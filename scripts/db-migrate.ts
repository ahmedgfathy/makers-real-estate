import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { getPool, pingDb, withTransaction } from "../lib/db";
import { seedProjects } from "../lib/seed-projects";

const PORTFOLIO_CLEANUP = "sodic_lakes_eastvale_only_v1";
const PORTFOLIO_PUBLICATION = "sodic_lakes_eastvale_publish_v1";
const ACTIVE_PROJECT_SLUGS = ["the-lakes", "eastvale"] as const;

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

  // One-time portfolio cleanup. Keep CRM-created data intact on future builds.
  await pool.query(
    `CREATE TABLE IF NOT EXISTS app_migrations (
       name text PRIMARY KEY,
       applied_at timestamptz NOT NULL DEFAULT now()
     )`
  );
  const portfolioCleanup = await withTransaction(async (client) => {
    await client.query("SELECT pg_advisory_xact_lock(hashtext($1))", [PORTFOLIO_CLEANUP]);
    const applied = await client.query<{ name: string }>(
      "SELECT name FROM app_migrations WHERE name = $1",
      [PORTFOLIO_CLEANUP]
    );
    if (applied.rows.length) return null;

    // Ensure both requested SODIC project records exist before pruning the rest.
    await seedProjects(client);
    await client.query(
      `UPDATE projects
          SET developer_slug = 'sodic',
              position = CASE slug WHEN 'the-lakes' THEN 1 WHEN 'eastvale' THEN 2 END,
              updated_at = now()
        WHERE slug = ANY($1::text[])`,
      [ACTIVE_PROJECT_SLUGS]
    );

    const removedUnits = await client.query<{ id: number }>(
      `DELETE FROM properties
        WHERE project_slug IS NULL OR project_slug <> ALL($1::text[])
        RETURNING id`,
      [ACTIVE_PROJECT_SLUGS]
    );
    const removedProjects = await client.query<{ slug: string }>(
      `DELETE FROM projects WHERE slug <> ALL($1::text[]) RETURNING slug`,
      [ACTIVE_PROJECT_SLUGS]
    );
    const removedDevelopers = await client.query<{ slug: string }>(
      `DELETE FROM developers WHERE slug <> 'sodic' RETURNING slug`
    );
    await client.query("INSERT INTO app_migrations (name) VALUES ($1)", [PORTFOLIO_CLEANUP]);

    return {
      units: removedUnits.rows.length,
      projects: removedProjects.rows.length,
      developers: removedDevelopers.rows.length,
    };
  });
  if (portfolioCleanup) {
    console.log(
      `[migrate] portfolio pruned: ${portfolioCleanup.developers} developers, ` +
        `${portfolioCleanup.projects} projects, ${portfolioCleanup.units} units removed`
    );
  }

  const portfolioPublication = await withTransaction(async (client) => {
    await client.query("SELECT pg_advisory_xact_lock(hashtext($1))", [PORTFOLIO_PUBLICATION]);
    const applied = await client.query<{ name: string }>(
      "SELECT name FROM app_migrations WHERE name = $1",
      [PORTFOLIO_PUBLICATION]
    );
    if (applied.rows.length) return null;

    const developer = await client.query(
      `UPDATE developers
          SET published = true, published_at = COALESCE(published_at, now()), updated_at = now()
        WHERE slug = 'sodic' RETURNING slug`
    );
    const projects = await client.query(
      `UPDATE projects
          SET published = true, published_at = COALESCE(published_at, now()), updated_at = now()
        WHERE slug = ANY($1::text[]) AND developer_slug = 'sodic' RETURNING slug`,
      [ACTIVE_PROJECT_SLUGS]
    );
    const units = await client.query(
      `UPDATE properties
          SET published = true, published_at = COALESCE(published_at, now()), updated_at = now()
        WHERE project_slug = ANY($1::text[]) RETURNING id`,
      [ACTIVE_PROJECT_SLUGS]
    );
    await client.query("INSERT INTO app_migrations (name) VALUES ($1)", [PORTFOLIO_PUBLICATION]);

    return {
      developers: developer.rows.length,
      projects: projects.rows.length,
      units: units.rows.length,
    };
  });
  if (portfolioPublication) {
    console.log(
      `[migrate] portfolio published: ${portfolioPublication.developers} developers, ` +
        `${portfolioPublication.projects} projects, ${portfolioPublication.units} units`
    );
  }

  const { rows: portfolioCounts } = await pool.query<{
    developers: number;
    projects: number;
    units: number;
  }>(
    `SELECT (SELECT count(*)::int FROM developers) AS developers,
            (SELECT count(*)::int FROM projects) AS projects,
            (SELECT count(*)::int FROM properties) AS units`
  );
  console.log(
    `[migrate] portfolio: ${portfolioCounts[0].developers} developers, ` +
      `${portfolioCounts[0].projects} projects, ${portfolioCounts[0].units} units`
  );

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
