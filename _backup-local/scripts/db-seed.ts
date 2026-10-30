import { contact, content, type Lang, type Section, type TileId } from "../data/content";
import { getPool, withTransaction } from "../lib/db";

/**
 * Seeds PostgreSQL from data/content.ts — the original single source of truth.
 *   npm run db:seed
 *
 * Writes both locales, replaces tiles/panels/sections wholesale, and upserts
 * the contact settings row. Runs in one transaction.
 */

const LANGS: Lang[] = ["en", "ar"];
const json = (v: unknown) => JSON.stringify(v);

async function seedLocale(client: { query(text: string, params?: unknown[]): Promise<unknown> }, lang: Lang) {
  const c = content[lang];

  await client.query(
    `INSERT INTO site_content (lang, meta, brand, nav, hero, grid, panel, footer)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT (lang) DO UPDATE SET
       meta = EXCLUDED.meta, brand = EXCLUDED.brand, nav = EXCLUDED.nav,
       hero = EXCLUDED.hero, grid = EXCLUDED.grid, panel = EXCLUDED.panel,
       footer = EXCLUDED.footer, updated_at = now()`,
    [lang, json(c.meta), json(c.brand), json(c.nav), json(c.hero), json(c.grid), json(c.panel), json(c.footer)]
  );

  // Tiles cascade-delete panels and their sections — rebuild them in order.
  await client.query("DELETE FROM tiles WHERE lang = $1", [lang]);

  for (let i = 0; i < c.tiles.length; i++) {
    const t = c.tiles[i];
    await client.query(
      `INSERT INTO tiles (lang, id, position, idx, kicker, title, meta, image)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [lang, t.id, i, t.index, t.kicker, t.title, t.meta, t.image]
    );

    const panel = c.panels[t.id as TileId];
    if (!panel) throw new Error(`missing panel for tile "${t.id}" in "${lang}"`);

    await client.query(
      `INSERT INTO panels (lang, tile_id, position, kicker, title, lede, image, cta)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [lang, t.id, i, panel.kicker, panel.title, panel.lede, panel.image, panel.cta]
    );

    for (let s = 0; s < panel.sections.length; s++) {
      const section = panel.sections[s] as Section;
      const { kind, ...payload } = section;
      await client.query(
        `INSERT INTO panel_sections (lang, tile_id, position, kind, payload)
         VALUES ($1, $2, $3, $4, $5)`,
        [lang, t.id, s, kind, json(payload)]
      );
    }
  }

  console.log(`[seed] ${lang}: ${c.tiles.length} tiles, ${c.panels && Object.keys(c.panels).length} panels`);
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
  });

  const { rows } = await pool.query<{ lang: string; tiles: number; panels: number; sections: number }>(
    `SELECT t.lang,
            count(DISTINCT t.id)::int AS tiles,
            count(DISTINCT p.tile_id)::int AS panels,
            count(s.position)::int AS sections
       FROM tiles t
       LEFT JOIN panels p ON p.lang = t.lang AND p.tile_id = t.id
       LEFT JOIN panel_sections s ON s.lang = t.lang AND s.tile_id = t.id
      GROUP BY t.lang ORDER BY t.lang`
  );
  for (const r of rows) {
    console.log(
      `[seed] ${r.lang}: ${r.tiles} tiles · ${r.panels} panels · ${r.sections} sections`
    );
  }
  console.log("[seed] settings: contact");
  console.log("[seed] done");
}

main()
  .then(() => process.exit(0))
  .catch((err: unknown) => {
    console.error("[seed] failed:", err instanceof Error ? err.message : err);
    process.exit(1);
  });
