import type { Metadata } from "next";
import type { Lang } from "@/data/content";
import { whatsappLink } from "@/data/content";
import { getSite } from "@/lib/content-db";
import { egp } from "@/lib/format";
import { CATEGORIES, REGIONS, listProjects } from "@/lib/projects";
import Arrow from "@/components/public/Arrow";
import LangSync from "@/components/public/LangSync";
import PublicFooter from "@/components/public/PublicFooter";
import PublicHeader from "@/components/public/PublicHeader";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects — Makers Real Estate",
  description:
    "The SODIC developments currently offered by Makers Real Estate: locations, unit types, starting prices and payment plans.",
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export default async function PublicProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const params = await searchParams;
  const lang: Lang = params.lang === "ar" ? "ar" : "en";

  const [{ content, contact }, projects] = await Promise.all([
    getSite(),
    listProjects({ publishedOnly: true }),
  ]);

  const c = content[lang];
  const whatsapp = whatsappLink(contact, lang);

  const t =
    lang === "ar"
      ? {
          kicker: "المشروعات",
          title: "مشروعات مختارة، جاهزة للمعاينة",
          lede: "كل مشروع منشور من فريق المبيعات: الموقع، أنواع الوحدات، الأسعار الابتدائية وخطط السداد.",
          count: "مشروع منشور",
          from: "تبدأ من",
          onRequest: "السعر عند الطلب",
          empty: "يتم تجهيز مشروعات جديدة. عد قريبًا.",
          view: "عرض المشروع",
          units: "وحدات متاحة",
        }
      : {
          kicker: "Projects",
          title: "A portfolio worth walking through",
          lede: "Every development our sales team has published: location, unit mix, starting prices and payment plans.",
          count: "projects live",
          from: "From",
          onRequest: "Price on request",
          empty: "New projects are being prepared. Check back soon.",
          view: "View project",
          units: "units available",
        };

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <LangSync lang={lang} />
      <PublicHeader
        c={c}
        lang={lang}
        basePath="/projects"
        whatsapp={whatsapp}
        phoneHref={contact.phoneHref}
        active="projects"
      />

      <main className="public-main">
        <section className="collection">
          <div className="collection-inner">
            <div className="collection-head">
              <div>
                <h1 className="collection-lede">{t.title}</h1>
                <p className="public-sublede">{t.lede}</p>
              </div>
              <div className="collection-meta">
                <span className="eyebrow">{t.kicker}</span>
                <span className="collection-count">
                  {projects.length} {t.count}
                </span>
              </div>
            </div>

            {projects.length ? (
              <div className="tiles">
                {projects.map((project, index) => {
                  const name = lang === "ar" ? project.nameAr : project.name;
                  const tagline = lang === "ar" ? project.taglineAr : project.tagline;
                  return (
                    <a
                      className="tile"
                      key={project.slug}
                      href={`/projects/${project.slug}?lang=${lang}`}
                      aria-label={`${t.view} — ${name}`}
                    >
                      <span className="tile-media">
                        {project.heroImage ? (
                          <img
                            src={project.heroImage}
                            alt={name}
                            loading={index < 3 ? "eager" : "lazy"}
                            decoding="async"
                          />
                        ) : (
                          <span className="tile-media-empty" aria-hidden="true">
                            <span className="tile-monogram">{initials(project.name)}</span>
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
                          {REGIONS[project.region][lang]} · {CATEGORIES[project.category][lang]}
                        </span>
                        <span className="tile-title">{name}</span>
                        <span className="tile-meta">
                          {project.priceFrom ? `${t.from} ${egp(project.priceFrom, true)}` : t.onRequest} ·{" "}
                          {tagline}
                        </span>
                      </span>
                      <span className="tile-line" />
                    </a>
                  );
                })}
              </div>
            ) : (
              <p className="public-empty">{t.empty}</p>
            )}
          </div>
        </section>
      </main>

      <PublicFooter
        c={c}
        contact={contact}
        lang={lang}
        whatsapp={whatsapp}
        phoneHref={contact.phoneHref}
      />
    </>
  );
}
