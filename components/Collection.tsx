"use client";

import type { Content, Lang } from "@/data/content";
import { ui } from "@/lib/labels";
import { egp } from "@/lib/format";
import Reveal from "./Reveal";

export type HomeProject = {
  slug: string;
  name: string;
  nameAr: string;
  developerName: string;
  regionName: Record<Lang, string>;
  heroImage: string | null;
  priceFrom: number | null;
  unitCount: number;
};

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3.5 10.5 10.5 3.5M10.5 3.5H5M10.5 3.5V9" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

export default function Collection({
  c,
  lang,
  projects,
}: {
  c: Content;
  lang: Lang;
  projects: HomeProject[];
}) {
  const t = ui[lang];
  const labels =
    lang === "ar"
      ? {
          from: "تبدأ من",
          onRequest: "السعر عند الطلب",
          units: "وحدات",
          empty: "يتم تجهيز المشروعات. عد قريبًا.",
          view: "عرض المشروع",
        }
      : {
          from: "From",
          onRequest: "Price on request",
          units: "units",
          empty: "Projects are being prepared. Check back soon.",
          view: "View project",
        };

  return (
    <section className="collection" id="collection">
      <div className="collection-inner">
        <div className="collection-head">
          <Reveal>
            <h2 className="collection-lede">{c.hero.lede}</h2>
          </Reveal>
          <Reveal delay={100} className="collection-meta">
            <span className="eyebrow">{c.grid.label}</span>
            <span className="collection-count">
              {projects.length} {t.collections} — SODIC
            </span>
          </Reveal>
        </div>

        <div className="tiles">
          {projects.length ? (
            projects.map((project, index) => {
              const name = lang === "ar" ? project.nameAr : project.name;
              const monogram = project.name
                .split(/\s+/)
                .map((part) => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <Reveal key={project.slug} delay={index * 70}>
                  <a
                    className="tile"
                    href={`/projects/${project.slug}?lang=${lang}`}
                    aria-label={`${labels.view} — ${name}`}
                  >
                    <span className="tile-media">
                      {project.heroImage ? (
                        <img
                          src={project.heroImage}
                          alt={name}
                          loading={index < 2 ? "eager" : "lazy"}
                          decoding="async"
                        />
                      ) : (
                        <span className="tile-media-empty" aria-hidden="true">
                          <span className="tile-monogram">{monogram}</span>
                        </span>
                      )}
                    </span>
                    <span className="tile-veil" />
                    <span className="tile-top">
                      <span className="tile-index">{String(index + 1).padStart(2, "0")}</span>
                      <span className="tile-arrow">
                        <Arrow />
                      </span>
                    </span>
                    <span className="tile-body">
                      <span className="tile-kicker">
                        {project.developerName} · {project.regionName[lang]}
                      </span>
                      <span className="tile-title">{name}</span>
                      <span className="tile-meta">
                        {project.priceFrom
                          ? `${labels.from} ${egp(project.priceFrom, true)}`
                          : labels.onRequest}{" "}
                        · {project.unitCount} {labels.units}
                      </span>
                    </span>
                    <span className="tile-line" />
                  </a>
                </Reveal>
              );
            })
          ) : (
            <p className="public-empty">{labels.empty}</p>
          )}
        </div>
      </div>
    </section>
  );
}
