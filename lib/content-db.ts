import { query } from "./db";
import {
  contact as staticContact,
  content as staticContent,
  type Contact,
  type Content,
  type Lang,
} from "@/data/content";

/**
 * Runtime content source.
 *
 * PostgreSQL (db/schema.sql) is the source of truth. `data/content.ts` stays
 * behind as (a) the seed input for `npm run db:seed` and (b) a last-resort
 * fallback so the site keeps rendering if the database is unreachable.
 */

export type Site = { content: Record<Lang, Content>; contact: Contact };

const LANGS: Lang[] = ["en", "ar"];

type SiteRow = {
  lang: string;
  meta: Content["meta"];
  brand: Content["brand"];
  nav: Content["nav"];
  hero: Content["hero"];
  footer: Content["footer"];
  lead_form: Content["leadForm"] | null;
};

async function loadFromDb(): Promise<Site> {
  const [siteRows, contactRows] = await Promise.all([
    query<SiteRow>(
      "SELECT lang, meta, brand, nav, hero, footer, lead_form FROM site_content"
    ),
    query<{ value: Contact }>("SELECT value FROM settings WHERE key = 'contact'"),
  ]);

  if (siteRows.length === 0) {
    throw new Error("site_content is empty — run `npm run db:seed` first");
  }
  if (contactRows.length === 0) {
    throw new Error("settings.contact is missing — run `npm run db:seed` first");
  }

  const contact = contactRows[0].value;
  const built = {} as Record<Lang, Content>;

  for (const lang of LANGS) {
    const chrome = siteRows.find((r) => r.lang === lang);
    if (!chrome) throw new Error(`site_content row missing for locale "${lang}"`);

    built[lang] = {
      meta: chrome.meta,
      brand: chrome.brand,
      nav: chrome.nav,
      hero: chrome.hero,
      footer: chrome.footer,
      // Databases migrated before the lead form existed keep the static copy.
      leadForm: chrome.lead_form ?? staticContent[lang].leadForm,
    };
  }

  return { content: built, contact };
}

function staticSite(): Site {
  return { content: staticContent, contact: staticContact };
}

const TTL_MS = Number(process.env.CONTENT_CACHE_TTL_MS ?? 30_000);

let cache: { site: Site; at: number; fromDb: boolean } | null = null;
let inFlight: Promise<Site> | null = null;

/** Content + contact for both locales. Served from PostgreSQL with a short TTL cache. */
export async function getSite(): Promise<Site> {
  const now = Date.now();
  if (cache && now - cache.at < TTL_MS) return cache.site;

  if (!inFlight) {
    inFlight = loadFromDb()
      .then((site) => {
        cache = { site, at: Date.now(), fromDb: true };
        return site;
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : String(err);
        console.warn(
          `[content] PostgreSQL unavailable, serving static fallback — ${message}`
        );
        const site = staticSite();
        cache = { site, at: Date.now(), fromDb: false };
        return site;
      })
      .finally(() => {
        inFlight = null;
      });
  }

  return inFlight;
}

/** Whether the current cached payload came from PostgreSQL (diagnostics). */
export function siteSource(): "postgres" | "static" | "pending" {
  if (!cache) return "pending";
  return cache.fromDb ? "postgres" : "static";
}
