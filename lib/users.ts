import { query } from "./db";
import { verifyPassword, hashPassword, MIN_PASSWORD_LENGTH } from "./passwords";

/**
 * Dashboard accounts stored in PostgreSQL (admin_users).
 *
 * `scripts/db-migrate.ts` bootstraps the first admin from ADMIN_USERNAME /
 * ADMIN_PASSWORD when the table is empty, so existing deployments keep their
 * env credentials as the initial login. After that the table is the source of
 * truth and credentials can be managed from /dashboard/users.
 */

export type Role = "admin" | "editor";

export type AdminUser = {
  username: string;
  display_name: string | null;
  role: Role;
  active: boolean;
  last_login_at: Date | null;
  created_at: Date;
};

const USER_SELECT = `
  username, display_name, role, active, last_login_at, created_at
`;

export async function listUsers(): Promise<AdminUser[]> {
  return query<AdminUser>(
    `SELECT ${USER_SELECT} FROM admin_users ORDER BY role, username`
  );
}

export async function getUser(username: string): Promise<AdminUser | null> {
  const rows = await query<AdminUser>(
    `SELECT ${USER_SELECT} FROM admin_users WHERE username = $1`,
    [username]
  );
  return rows[0] ?? null;
}

export async function countActiveAdmins(excludeUsername?: string): Promise<number> {
  const rows = await query<{ n: number }>(
    `SELECT count(*)::int AS n
       FROM admin_users
      WHERE role = 'admin' AND active
        AND ($1::text IS NULL OR username <> $1)`,
    [excludeUsername ?? null]
  );
  return rows[0]?.n ?? 0;
}

export type CreateUserInput = {
  username: string;
  password: string;
  displayName?: string | null;
  role?: Role;
};

/** Creates an account with a scrypt-hashed password. Throws on invalid input. */
export async function createUser(input: CreateUserInput): Promise<void> {
  const username = input.username.trim().toLowerCase();
  if (!/^[a-z0-9_.-]{3,32}$/.test(username)) {
    throw new Error(
      "Username must be 3–32 characters: letters, numbers, dot, dash or underscore."
    );
  }
  if (input.password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
  }

  const existing = await getUser(username);
  if (existing) throw new Error(`Username "${username}" already exists.`);

  const passwordHash = await hashPassword(input.password);
  await query(
    `INSERT INTO admin_users (username, password_hash, display_name, role)
     VALUES ($1, $2, $3, $4)`,
    [username, passwordHash, input.displayName?.trim() || null, input.role ?? "editor"]
  );
}

export async function setPassword(username: string, password: string): Promise<void> {
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
  }
  const passwordHash = await hashPassword(password);
  await query(
    "UPDATE admin_users SET password_hash = $2, updated_at = now() WHERE username = $1",
    [username, passwordHash]
  );
}

export async function setUserRole(username: string, role: Role): Promise<void> {
  await query(
    "UPDATE admin_users SET role = $2, updated_at = now() WHERE username = $1",
    [username, role]
  );
}

export async function setUserActive(username: string, active: boolean): Promise<void> {
  await query(
    "UPDATE admin_users SET active = $2, updated_at = now() WHERE username = $1",
    [username, active]
  );
}

export async function touchLastLogin(username: string): Promise<void> {
  await query(
    "UPDATE admin_users SET last_login_at = now() WHERE username = $1",
    [username]
  );
}

/** Credential check against the database (never against env vars). */
const USER_SELECT_FOR_AUTH = `
  u.username, u.display_name, u.role, u.active, u.last_login_at, u.created_at, u.password_hash
`;

/** Credential check against the database (never against env vars). */
export async function verifyCredentials(
  username: string,
  password: string
): Promise<AdminUser | null> {
  const rows = await query<{ password_hash: string } & AdminUser>(
    `SELECT ${USER_SELECT_FOR_AUTH} FROM admin_users u WHERE u.username = $1`,
    [username.trim().toLowerCase()]
  );
  const row = rows[0];
  if (!row) return null;
  if (!row.active) return null;

  const ok = await verifyPassword(password, row.password_hash);
  return ok ? { username: row.username, display_name: row.display_name, role: row.role, active: row.active, last_login_at: row.last_login_at, created_at: row.created_at } : null;
}
