import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { getPool, pingDb } from "../lib/db";

/**
 * Applies db/schema.sql (idempotent — safe to run repeatedly).
 *   npm run db:migrate
 */

function schemaPath(): string {
  const root = process.env.INIT_CWD || process.cwd();
  const candidate = path.resolve(root, "db/schema.sql");
  if (existsSync(candidate)) return candidate;
  throw new Error(`schema.sql not found at ${candidate}`);
}

async function main() {
  const file = schemaPath();
  const sql = readFileSync(file, "utf8");

  console.log(`[migrate] applying ${file}`);
  const pool = getPool();
  await pool.query(sql);

  const ping = await pingDb();
  if (!ping.ok) throw new Error(`connection check failed: ${ping.error}`);

  const { rows } = await pool.query<{ name: string }>(
    `SELECT table_name AS name
       FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name`
  );
  console.log("[migrate] ok — tables:", rows.map((r) => r.name).join(", "));

  const { rows: counts } = await pool.query<{ locale: string; tiles: number }>(
    `SELECT l.code AS locale, count(t.id)::int AS tiles
       FROM locales l LEFT JOIN tiles t ON t.lang = l.code
      GROUP BY l.code ORDER BY l.code`
  );
  for (const c of counts) console.log(`[migrate] locale ${c.locale}: ${c.tiles} tiles`);
}

main()
  .then(() => process.exit(0))
  .catch((err: unknown) => {
    console.error("[migrate] failed:", err instanceof Error ? err.message : err);
    process.exit(1);
  });
