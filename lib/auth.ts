import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { touchLastLogin, verifyCredentials, type AdminUser } from "./users";

/**
 * Single-dashboard session with per-user accounts.
 *
 * Credentials live in PostgreSQL (admin_users, scrypt hashes). The env pair
 * ADMIN_USERNAME / ADMIN_PASSWORD stays as a bootstrap fallback — it works
 * even when the database has no users yet (fresh preview deployments), and
 * scripts/db-migrate.ts seeds it into admin_users on first migration.
 */

export const SESSION_COOKIE = "makers_admin";
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? "admin";
// Comma-separated usernames allowed to publish to the public website. Everyone
// else who can sign in is a regular user (read-only for publishing).
const ADMIN_USERNAMES = (process.env.ADMIN_USERNAMES ?? ADMIN_USERNAME)
  .split(",")
  .map((name) => name.trim())
  .filter(Boolean);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "zerocall";
const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET ?? "makers-dev-session-secret-change-me";

export type AdminSession = { username: string; role: Role; expiresAt: number };

export type Role = "admin" | "editor";

/** Admins may publish/unpublish; editors can manage data but not go live. */
export function roleOf(username: string): Role {
  return ADMIN_USERNAMES.includes(username) ? "admin" : "editor";
}

export function canPublish(session: AdminSession | null): boolean {
  return session != null && session.role === "admin";
}

/** Admins may manage dashboard accounts. */
export function canManageUsers(session: AdminSession | null): boolean {
  return session != null && session.role === "admin";
}

function fixedHash(value: string): Buffer {
  return createHmac("sha256", SESSION_SECRET).update(value).digest();
}

function safeEqual(a: string, b: string): boolean {
  const left = fixedHash(a);
  const right = fixedHash(b);
  return timingSafeEqual(left, right) && a.length === b.length;
}

export function checkCredentials(username: string, password: string): boolean {
  return safeEqual(username, ADMIN_USERNAME) && safeEqual(password, ADMIN_PASSWORD);
}

/**
 * Credential check: the database first (per-user accounts), then the env pair
 * as a bootstrap fallback. Returns the acting user's role.
 */
export async function authenticate(
  username: string,
  password: string
): Promise<{ user: AdminUser | null; role: Role } | null> {
  const user = await verifyCredentials(username, password);
  if (user) {
    await touchLastLogin(user.username);
    return { user, role: user.role };
  }
  if (checkCredentials(username, password)) {
    return { user: null, role: roleOf(username) };
  }
  return null;
}

function sign(payload: string): string {
  return createHmac("sha256", SESSION_SECRET).update(payload).digest("base64url");
}

export function createSessionToken(username: string, role: Role): string {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  const payload = Buffer.from(
    JSON.stringify({ u: username, r: role, exp: expiresAt }),
    "utf8"
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string): AdminSession | null {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  if (!safeEqual(signature, sign(payload))) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      u?: unknown;
      r?: unknown;
      exp?: unknown;
    };
    if (typeof data.u !== "string" || typeof data.exp !== "number") return null;
    if (data.exp <= Math.floor(Date.now() / 1000)) return null;
    // Older tokens carry no role; fall back to the env-based mapping.
    const role: Role = data.r === "admin" || data.r === "editor" ? data.r : roleOf(data.u);
    return { username: data.u, role, expiresAt: data.exp };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<AdminSession | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return token ? verifySessionToken(token) : null;
}

/** Server-component / server-action guard. Redirects to the login screen. */
export async function requireAdmin(nextPath = "/dashboard"): Promise<AdminSession> {
  const session = await getSession();
  if (!session) redirect(`/login?next=${encodeURIComponent(safeNext(nextPath))}`);
  return session;
}

export function safeNext(next: string | null | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/dashboard";
  return next;
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE,
    secure: (process.env.NEXT_PUBLIC_SITE_URL ?? "").startsWith("https://"),
  };
}
