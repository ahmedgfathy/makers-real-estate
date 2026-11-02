import { contact, content, type Lang } from "../data/content";
import { getPool, withTransaction, type TxClient } from "../lib/db";

/**
 * Seeds the bilingual landing-page chrome (meta, brand, nav, hero, footer,
 * lead form) and the contact block.
 *
 * CRM lead records are operational data and are deliberately not populated
 * with sample/demo rows by this script.
 */

const LANGS: Lang[] = ["en", "ar"];
const json = (value: unknown) => JSON.stringify(value);

async function seedLocale(client: TxClient, lang: Lang) {
  const locale = content[lang];

  await client.query(
    `INSERT INTO site_content (lang, meta, brand, nav, hero, footer, lead_form)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (lang) DO UPDATE SET
       meta = EXCLUDED.meta, brand = EXCLUDED.brand, nav = EXCLUDED.nav,
       hero = EXCLUDED.hero, footer = EXCLUDED.footer,
       lead_form = EXCLUDED.lead_form, updated_at = now()`,
    [
      lang,
      json(locale.meta),
      json(locale.brand),
      json(locale.nav),
      json(locale.hero),
      json(locale.footer),
      json(locale.leadForm),
    ]
  );

  console.log(`[seed] ${lang}: landing chrome`);
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

  console.log("[seed] CRM leads were left untouched");
  await pool.end();
}

main().catch((error: unknown) => {
  console.error("[seed] failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
