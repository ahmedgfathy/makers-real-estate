import { getPool, withTransaction } from "../lib/db";
import { seedProjects } from "../lib/seed-projects";

/**
 * Refreshes only the SODIC project catalogue.
 *   npm run db:seed:projects
 *
 * Useful against a production database: it replaces `projects` and leaves
 * content, properties and leads untouched. The full `db:seed` still rebuilds
 * everything.
 */

async function main() {
  const pool = getPool();

  const count = await withTransaction((client) => seedProjects(client));

  const { rows } = await pool.query<{ projects: number; priced: number }>(
    `SELECT count(*)::int AS projects,
            count(price_from)::int AS priced
       FROM projects`
  );

  console.log(
    `[seed:projects] ${count} developments · ${rows[0].projects} rows · ${rows[0].priced} with a starting price`
  );
}

main()
  .then(() => process.exit(0))
  .catch((err: unknown) => {
    console.error("[seed:projects] failed:", err instanceof Error ? err.message : err);
    process.exit(1);
  });
