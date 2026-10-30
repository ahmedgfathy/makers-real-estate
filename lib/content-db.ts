import { query } from "./db";
import {
  contact as staticContact,
  content as staticContent,
  type Contact,
  type Content,
  type Lang,
  type Panel,
  type Section,
  type Tile,
  type TileId,
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
const TILE_IDS: TileId[] = ["lakes", "phase08m", "sodic-east", "amenities", "collection", "payment"];
const isTileId = (v: string): v is TileId => (TILE_IDS as string[]).includes(v);

type SiteRow = {
  lang: string;
  meta: Content["meta"];
  brand: Content["brand"];
  nav: Content["nav"];
  hero: Content["hero"];
  grid: Content["grid"];
  panel: Content["panel"];
  footer: Content["footer"];
};

type TileRow = {
  lang: string;
  id: string;
  idx: string;
  kicker: string;
  title: string;
  meta: string;
  image: string;
};

type PanelRow = {
  lang: string;
  tile_id: string;
  kicker: string;
  title: string;
  lede: string;
  image: string;
  cta: string;
  sections: Array<Record<string, unknown> & { kind: string }>;
};

async function loadFromDb(): Promise<Site> {
  const [siteRows, tileRows, panelRows, contactRows] = await Promise.all([
    query<SiteRow>(
      "SELECT lang, meta, brand, nav, hero, grid, panel, footer FROM site_content"
    ),
    query<TileRow>(
      "SELECT lang, id, idx, kicker, title, meta, image FROM tiles ORDER BY lang, position"
    ),
    query<PanelRow>(
      `SELECT p.lang, p.tile_id, p.kicker, p.title, p.lede, p.image, p.cta,
              COALESCE(
                (SELECT json_agg(jsonb_build_object('kind', s.kind) || s.payload ORDER BY s.position)
                   FROM panel_sections s
                  WHERE s.lang = p.lang AND s.tile_id = p.tile_id),
                '[]'::json
              ) AS sections
         FROM panels p
        ORDER BY p.lang, p.position`
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

    const tiles: Tile[] = tileRows
      .filter((t) => t.lang === lang)
      .map((t) => {
        if (!isTileId(t.id)) throw new Error(`unknown tile id "${t.id}"`);
        return {
          id: t.id,
          index: t.idx,
          kicker: t.kicker,
          title: t.title,
          meta: t.meta,
          image: t.image,
        };
      });

    const panels = {} as Record<TileId, Panel>;
    for (const p of panelRows.filter((r) => r.lang === lang)) {
      if (!isTileId(p.tile_id)) throw new Error(`unknown panel tile id "${p.tile_id}"`);
      panels[p.tile_id] = {
        id: p.tile_id,
        kicker: p.kicker,
        title: p.title,
        lede: p.lede,
        image: p.image,
        cta: p.cta,
        sections: p.sections.map((s) => {
          const { kind, ...payload } = s;
          return { kind, ...payload } as Section;
        }),
      };
    }

    if (tiles.length === 0) throw new Error(`no tiles seeded for locale "${lang}"`);
    for (const t of tiles) {
      if (!panels[t.id]) throw new Error(`no panel seeded for tile "${t.id}" (${lang})`);
    }

    built[lang] = {
      meta: chrome.meta,
      brand: chrome.brand,
      nav: chrome.nav,
      hero: chrome.hero,
      grid: chrome.grid,
      panel: chrome.panel,
      footer: chrome.footer,
      tiles,
      panels,
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
