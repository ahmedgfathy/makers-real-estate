import { randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

/**
 * Password hashing for dashboard accounts (admin_users.password_hash).
 *
 * scrypt ships with Node, so no native dependency (bcrypt / argon2) is needed
 * on Vercel's serverless build image. Stored format:
 *
 *   scrypt$<N>$<r>$<p>$<salt-base64>$<hash-base64>
 */

const scrypt = promisify(scryptCb) as (
  password: string | Buffer,
  salt: Buffer,
  keylen: number,
  options: { N: number; r: number; p: number; maxmem: number }
) => Promise<Buffer>;

const N = 16384;
const R = 8;
const P = 1;
const KEYLEN = 64;
// scrypt needs roughly 128 * N * r bytes; give it headroom over the 32 MB default.
const MAXMEM = 64 * 1024 * 1024;

export const MIN_PASSWORD_LENGTH = 8;

/** Hash a plaintext password for storage. */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, KEYLEN, { N, r: R, p: P, maxmem: MAXMEM });
  return `scrypt$${N}$${R}$${P}$${salt.toString("base64")}$${hash.toString("base64")}`;
}

/**
 * Constant-time verification. Returns false for malformed stored hashes so a
 * corrupted row can never authenticate anyone.
 */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;

  const [, nRaw, rRaw, pRaw, saltRaw, hashRaw] = parts;
  const N_ = Number(nRaw);
  const R_ = Number(rRaw);
  const P_ = Number(pRaw);
  if (!Number.isInteger(N_) || !Number.isInteger(R_) || !Number.isInteger(P_)) return false;

  try {
    const salt = Buffer.from(saltRaw, "base64");
    const expected = Buffer.from(hashRaw, "base64");
    if (salt.length === 0 || expected.length === 0) return false;

    const actual = await scrypt(password, salt, expected.length, {
      N: N_,
      r: R_,
      p: P_,
      maxmem: MAXMEM,
    });
    return timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}
