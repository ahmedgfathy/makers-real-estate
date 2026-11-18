"use client";

import { useState } from "react";
import type { Lang } from "@/data/content";
import type { PortalCopy, Market } from "@/data/portfolio";

/**
 * Portal hero: full-bleed image, centred headline and the search card.
 * Tabs and the Unit Type select share one state so either can drive the query.
 */
export default function HeroSearch({
  lang,
  copy,
  areas,
  image,
}: {
  lang: Lang;
  copy: PortalCopy;
  areas: Market[];
  image: string;
}) {
  const [type, setType] = useState<"residential" | "commercial">("residential");

  return (
    <section className="phero" style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.28) 42%, rgba(0,0,0,0.55) 100%), url(${image})` }}>
      <div className="phero-inner">
        <h1 className="phero-title">{copy.heroTitle}</h1>
        <p className="phero-lede">{copy.heroLede}</p>

        <div className="psearch">
          <div className="psearch-tabs" role="tablist" aria-label={copy.projectsTitle}>
            <button
              type="button"
              role="tab"
              className="psearch-tab"
              aria-selected={type === "residential"}
              onClick={() => setType("residential")}
            >
              {copy.residentialTab}
            </button>
            <button
              type="button"
              role="tab"
              className="psearch-tab"
              aria-selected={type === "commercial"}
              onClick={() => setType("commercial")}
            >
              {copy.commercialTab}
            </button>
          </div>

          <form className="psearch-card" method="get" action={`/${lang}/projects`} role="search">
            <label className="psearch-field">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="6.6" stroke="currentColor" strokeWidth="1.6" />
                <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <input
                className="psearch-input"
                type="search"
                name="q"
                placeholder={copy.searchPlaceholder}
                aria-label={copy.searchPlaceholder}
              />
            </label>

            <span className="psearch-selectwrap">
              <select className="psearch-select" name="city" defaultValue="" aria-label={copy.cityLabel}>
                <option value="">{copy.cityLabel}</option>
                {areas.map((area) => (
                  <option key={area.slug} value={area.slug}>
                    {area.name[lang]}
                  </option>
                ))}
              </select>
            </span>

            <span className="psearch-selectwrap">
              <select
                className="psearch-select"
                name="type"
                value={type}
                onChange={(event) => setType(event.target.value as "residential" | "commercial")}
                aria-label={copy.typeLabel}
              >
                <option value="residential">{copy.residential}</option>
                <option value="commercial">{copy.commercial}</option>
              </select>
            </span>

            <button className="psearch-btn" type="submit">
              {copy.searchCta}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
