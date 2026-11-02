import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { getPool, pingDb, withTransaction, type TxClient } from "../lib/db";

const REMOVE_PORTFOLIO_TABLES = "remove_portfolio_tables_v1";
const REMOVE_PORTFOLIO_CONTENT = "remove_portfolio_content_v1";
const REMOVE_DEMO_LEADS = "remove_demo_leads_v1";
const PURGE_TEST_LEADS = "purge_test_leads_v1";
const DEMO_LEAD_PHONES = [
  "0100 214 8831",
  "0112 905 7744",
  "0109 441 2208",
  "0128 330 1190",
  "0106 778 4521",
  "0115 602 3377",
  "0100 887 5512",
  "0122 410 6688",
  "0110 553 9024",
  "0101 202 7745",
  "0127 911 4402",
  "0104 668 1123",
  "01000000000",
  "01000000001",
] as const;
const TEST_LEAD_NAMES = ["Dev Test", "Test User", "Dev Test FP", "Test", "ABC", "test"] as const;

/** Applies db/schema.sql, including removal of the retired portfolio tables. */
function schemaPath(): string {
  const root = process.env.INIT_CWD || process.cwd();
  const candidate = path.resolve(root, "db/schema.sql");
  if (existsSync(candidate)) return candidate;
  throw new Error(`schema.sql not found at ${candidate}`);
}

/** Runs `fn` exactly once per database, guarded by the app_migrations table. */
async function runOnce<T>(name: string, fn: (client: TxClient) => Promise<T>): Promise<T | null> {
  return withTransaction(async (client) => {
    await client.query("SELECT pg_advisory_xact_lock(hashtext($1))", [name]);
    const applied = await client.query<{ name: string }>(
      "SELECT name FROM app_migrations WHERE name = $1",
      [name]
    );
    if (applied.rows.length) return null;
    const result = await fn(client);
    await client.query("INSERT INTO app_migrations (name) VALUES ($1)", [name]);
    return result;
  });
}

/** Deletes leads whose rows were produced by testing rather than by a buyer. */
async function deleteTestLeads(client: TxClient): Promise<number> {
  const result = await client.query<{ id: number }>(
    `DELETE FROM leads
      WHERE email ILIKE '%@example.com'
         OR external_id LIKE 'fb-lead-%'
         OR full_name ILIKE 'test%'
         OR full_name = ANY($1::text[])
         OR phone = ANY($2::text[])
         OR campaign ILIKE '%test%'
      RETURNING id`,
    [TEST_LEAD_NAMES, DEMO_LEAD_PHONES]
  );
  if (result.rows.length) {
    await client.query(
      "DELETE FROM audit_log WHERE entity_type = 'lead' AND entity_id = ANY($1::text[])",
      [result.rows.map((row) => String(row.id))]
    );
  }
  return result.rows.length;
}

async function main() {
  const file = schemaPath();
  console.log(`[migrate] applying ${file}`);
  const pool = getPool();
  await pool.query(readFileSync(file, "utf8"));

  await pool.query(
    `CREATE TABLE IF NOT EXISTS app_migrations (
       name text PRIMARY KEY,
       applied_at timestamptz NOT NULL DEFAULT now()
     )`
  );

  // One-time destructive migrations from the retired portfolio front end.
  const removedTables = await runOnce(REMOVE_PORTFOLIO_TABLES, async (client) => {
    await client.query("DROP TABLE IF EXISTS properties, projects, developers CASCADE");
    return true;
  });
  if (removedTables) {
    console.log("[migrate] removed developer, project, and property inventory tables and data");
  }

  const removedContent = await runOnce(REMOVE_PORTFOLIO_CONTENT, async (client) => {
    await client.query("DROP TABLE IF EXISTS panel_sections, panels, tiles CASCADE");
    await client.query("ALTER TABLE site_content DROP COLUMN IF EXISTS grid, DROP COLUMN IF EXISTS panel");
    return true;
  });
  if (removedContent) {
    console.log("[migrate] removed collection tiles, detail panels and unit/price sections");
  }

  const removedDemoLeads = await runOnce(REMOVE_DEMO_LEADS, deleteTestLeads);
  const purgedTestLeads = await runOnce(PURGE_TEST_LEADS, deleteTestLeads);
  console.log(
    `[migrate] removed ${(removedDemoLeads ?? 0) + (purgedTestLeads ?? 0)} demo/test lead records` +
      (purgedTestLeads === null ? " (purge already applied)" : "")
  );

  const ping = await pingDb();
  if (!ping.ok) throw new Error(`connection check failed: ${ping.error}`);

  const { rows } = await pool.query<{ name: string }>(
    `SELECT table_name AS name
       FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name`
  );
  console.log("[migrate] ok — tables:", rows.map((row) => row.name).join(", "));

  const { rows: counts } = await pool.query<{ locale: string; pages: number }>(
    `SELECT l.code AS locale, count(s.lang)::int AS pages
       FROM locales l LEFT JOIN site_content s ON s.lang = l.code
      GROUP BY l.code ORDER BY l.code`
  );
  for (const locale of counts) console.log(`[migrate] locale ${locale.locale}: ${locale.pages} landing chrome`);
  await pool.end();
}

main().catch((error: unknown) => {
  console.error("[migrate] failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
