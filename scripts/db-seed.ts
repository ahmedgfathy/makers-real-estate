import { contact, content, type Lang, type Section, type TileId } from "../data/content";
import { getPool, withTransaction, type TxClient } from "../lib/db";
import { seedProjects } from "../lib/seed-projects";

/**
 * Seeds website content and the initial SODIC project catalogue.
 *
 * CRM leads and inventory are real operational records. They are deliberately
 * not populated with sample/demo rows by this script.
 */

const LANGS: Lang[] = ["en", "ar"];
const json = (value: unknown) => JSON.stringify(value);

async function seedLocale(client: TxClient, lang: Lang) {
  const locale = content[lang];

  await client.query(
    `INSERT INTO site_content (lang, meta, brand, nav, hero, grid, panel, footer, lead_form)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     ON CONFLICT (lang) DO UPDATE SET
       meta = EXCLUDED.meta, brand = EXCLUDED.brand, nav = EXCLUDED.nav,
       hero = EXCLUDED.hero, grid = EXCLUDED.grid, panel = EXCLUDED.panel,
       footer = EXCLUDED.footer, lead_form = EXCLUDED.lead_form, updated_at = now()`,
    [lang, json(locale.meta), json(locale.brand), json(locale.nav), json(locale.hero), json(locale.grid), json(locale.panel), json(locale.footer), json(locale.leadForm)]
  );

  await client.query("DELETE FROM tiles WHERE lang = $1", [lang]);

  for (let position = 0; position < locale.tiles.length; position++) {
    const tile = locale.tiles[position];
    await client.query(
      `INSERT INTO tiles (lang, id, position, idx, kicker, title, meta, image)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [lang, tile.id, position, tile.index, tile.kicker, tile.title, tile.meta, tile.image]
    );

    const panel = locale.panels[tile.id as TileId];
    if (!panel) throw new Error(`missing panel for tile "${tile.id}" in "${lang}"`);
    await client.query(
      `INSERT INTO panels (lang, tile_id, position, kicker, title, lede, image, cta)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [lang, tile.id, position, panel.kicker, panel.title, panel.lede, panel.image, panel.cta]
    );

    for (let sectionPosition = 0; sectionPosition < panel.sections.length; sectionPosition++) {
      const section = panel.sections[sectionPosition] as Section;
      const { kind, ...payload } = section;
      await client.query(
        `INSERT INTO panel_sections (lang, tile_id, position, kind, payload)
         VALUES ($1, $2, $3, $4, $5)`,
        [lang, tile.id, sectionPosition, kind, json(payload)]
      );
    }
  }

  console.log(`[seed] ${lang}: ${locale.tiles.length} website tiles`);
}

async function main() {
  const pool = getPool();

  await withTransaction(async (client) => {
    for (const lang of LANGS) await seedLocale(client, lang);

    await client.query(
      `INSERT INTO settings (key, value) VALUES ('contact', $1)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
      [json(contact)]
    );

    const inserted = await seedProjects(client);
    console.log(`[seed] project catalogue source: ${inserted} records`);
  });

  const { rows } = await pool.query<{ projects: number }>(
    "SELECT count(*)::int AS projects FROM projects"
  );
  console.log(`[seed] CRM leads and inventory were left untouched; ${rows[0].projects} projects total`);
  await pool.end();
}

main().catch((error: unknown) => {
  console.error("[seed] failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
