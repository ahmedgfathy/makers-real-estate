import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Minimal single-admin session for the dashboard.
 *
 * Credentials come from ADMIN_USERNAME / ADMIN_PASSWORD and fall back to the
 * demo pair requested for this project. Replace both (and the session secret)
 * before exposing the dashboard publicly.
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

export type AdminSession = { username: string; expiresAt: number };

export type Role = "admin" | "editor";

/** Admins may publish/unpublish; editors can manage data but not go live. */
export function roleOf(username: string): Role {
  return ADMIN_USERNAMES.includes(username) ? "admin" : "editor";
}

export function canPublish(session: AdminSession | null): boolean {
  return session != null && roleOf(session.username) === "admin";
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

function sign(payload: string): string {
  return createHmac("sha256", SESSION_SECRET).update(payload).digest("base64url");
}

export function createSessionToken(username: string): string {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  const payload = Buffer.from(JSON.stringify({ u: username, exp: expiresAt }), "utf8").toString(
    "base64url"
  );
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string): AdminSession | null {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  if (!safeEqual(signature, sign(payload))) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      u?: unknown;
      exp?: unknown;
    };
    if (typeof data.u !== "string" || typeof data.exp !== "number") return null;
    if (data.exp <= Math.floor(Date.now() / 1000)) return null;
    return { username: data.u, expiresAt: data.exp };
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
