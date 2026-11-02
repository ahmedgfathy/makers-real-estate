import { readFileSync } from "node:fs";
import { importLeadsFromCsv, MAX_IMPORT_ROWS } from "../lib/lead-import";
import { getPool } from "../lib/db";

/**
 * Imports the team's legacy lead spreadsheet into the CRM.
 * Parsing, classification and matching rules live in lib/lead-import.ts, which
 * the dashboard's "Import CSV" action shares.
 *
 * Usage:
 *   npm run db:import-leads ["path/to/leads.csv"]
 */

const DEFAULT_CSV = "/home/xinreal/Downloads/makers leads - all.csv";

async function main() {
  const path = process.argv[2] ?? DEFAULT_CSV;
  const csv = readFileSync(path, "utf8");
  console.log(`[import] ${path} (row limit ${MAX_IMPORT_ROWS})`);

  const result = await importLeadsFromCsv(csv);
  console.log(
    `[import] ${result.created} created, ${result.existing} already present, ` +
      `${result.skipped} empty rows skipped, ${result.errors.length} failed`
  );
  for (const error of result.errors.slice(0, 20)) console.error(`[import] ${error}`);

  await getPool().end();
}

main().catch((error: unknown) => {
  console.error("[import] failed:", error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
