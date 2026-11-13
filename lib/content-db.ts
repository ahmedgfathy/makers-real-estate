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
 * PostgreSQL stores the site content. `data/content.ts` stays behind as the
 * seed input and fallback; new static project cards are merged at read time so
 * a deployment can add a listing without reseeding the database.
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
  sections: Content["sections"] | null;
};

async function loadFromDb(): Promise<Site> {
  const [siteRows, contactRows] = await Promise.all([
    query<SiteRow>(
      "SELECT lang, meta, brand, nav, hero, footer, lead_form, sections FROM site_content"
    ),
    query<{ value: Contact }>("SELECT value FROM settings WHERE key = 'contact'"),
  ]);

  if (siteRows.length === 0) {
    throw new Error("site_content is empty — run `npm run db:seed` first");
  }
  if (contactRows.length === 0) {
    throw new Error("settings.contact is missing — run `npm run db:seed` first");
  }

  /**
   * The two phone numbers are fixed by the sales team, so the numbers from
   * data/content.ts always win over a stale settings row. Name and welcome
   * message still come from the database when present.
   */
  const dbContact = contactRows[0].value;
  const contact: Contact = {
    ...staticContact,
    ...dbContact,
    phoneLabel: staticContact.phoneLabel,
    phoneHref: staticContact.phoneHref,
    whatsappLabel: staticContact.whatsappLabel,
    whatsapp: staticContact.whatsapp,
  };

  const built = {} as Record<Lang, Content>;

  for (const lang of LANGS) {
    const chrome = siteRows.find((r) => r.lang === lang);
    if (!chrome) throw new Error(`site_content row missing for locale "${lang}"`);

    const dbSections = chrome.sections ?? staticContent[lang].sections;
    const staticSections = staticContent[lang].sections;
    const newProjects = staticSections.projects.items.filter(
      (project) => !dbSections.projects.items.some((existing) => existing.name === project.name)
    );
    const hasNewProjects = newProjects.length > 0;
    const sections: Content["sections"] = {
      ...dbSections,
      projects: {
        ...dbSections.projects,
        ...(hasNewProjects
          ? {
              kicker: staticSections.projects.kicker,
              title: staticSections.projects.title,
              lede: staticSections.projects.lede,
            }
          : {}),
        items: [...dbSections.projects.items, ...newProjects],
      },
    };
    const dbLeadForm = chrome.lead_form ?? staticContent[lang].leadForm;
    const leadForm: Content["leadForm"] = {
      ...dbLeadForm,
      projectOptions: [
        ...dbLeadForm.projectOptions,
        ...staticContent[lang].leadForm.projectOptions.filter(
          (option) => !dbLeadForm.projectOptions.includes(option)
        ),
      ],
    };

    built[lang] = {
      meta: hasNewProjects ? staticContent[lang].meta : chrome.meta,
      brand: hasNewProjects
        ? { ...chrome.brand, sub: staticContent[lang].brand.sub }
        : chrome.brand,
      nav: chrome.nav,
      hero: chrome.hero,
      footer: hasNewProjects
        ? { ...chrome.footer, builtWith: staticContent[lang].footer.builtWith }
        : chrome.footer,
      // Databases migrated before the lead form / new sections existed keep
      // the static copy so the redesigned page still renders in full.
      leadForm,
      sections,
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
