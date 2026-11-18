import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteFrame from "@/components/SiteFrame";
import CatalogFilters, { type CatalogQuery } from "@/components/portal/CatalogFilters";
import ProjectGrid from "@/components/portal/ProjectGrid";
import { DEVELOPERS, filterProjects, MARKETS, PORTAL, projectsOf } from "@/data/portfolio";
import { getSite } from "@/lib/content-db";
import { absoluteUrl, isLang, localizedAlternates } from "@/lib/seo";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = "force-dynamic";

const pageCopy = {
  en: {
    title: "Property Projects in Egypt | Makers Real Estate",
    description:
      "Explore the primary residential and commercial projects Makers Real Estate represents, with starting prices, unit types and delivery dates.",
  },
  ar: {
    title: "مشروعات عقارية في مصر | ميكرز للعقارات",
    description:
      "استكشف المشروعات السكنية والتجارية الأولية التي تمثلها ميكرز للعقارات، بأسعار البداية وأنواع الوحدات ومواعيد التسليم.",
  },
} as const;

function one(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLang(locale)) return {};

  const copy = pageCopy[locale];
  const url = absoluteUrl(`/${locale}/projects`);
  return {
    title: copy.title,
    description: copy.description,
    alternates: { canonical: url, languages: localizedAlternates("/projects") },
    openGraph: { title: copy.title, description: copy.description, type: "website", url },
  };
}

export default async function ProjectsPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  if (!isLang(locale)) notFound();

  const sp = await searchParams;
  const query: CatalogQuery = {
    q: one(sp.q),
    city: one(sp.city),
    type: one(sp.type),
    developer: one(sp.developer),
  };

  const { content, contact } = await getSite();
  const copy = PORTAL[locale];
  const all = projectsOf(locale);
  const results = filterProjects(all, query);
  const filtered = Boolean(query.q || query.city || query.type || query.developer);

  const heading =
    query.city && query.city !== "all"
      ? MARKETS.find((market) => market.slug === query.city)?.name[locale] ?? copy.resultsTitle
      : copy.resultsTitle;

  return (
    <SiteFrame content={content} contact={contact} lang={locale}>
      <main className="site-page-main">
        <header className="ppage-head">
          <div className="pwrap">
            <p className="pkicker">{copy.projectsKicker}</p>
            <h1 className="ptitle">{heading}</h1>
            <p className="plede">{copy.projectsLede}</p>
          </div>
        </header>

        <section className="psec">
          <div className="pwrap">
            <CatalogFilters
              lang={locale}
              copy={copy}
              areas={MARKETS}
              developers={DEVELOPERS}
              current={query}
            />

            <div className="presultbar">
              <span>
                <strong>{results.length}</strong>{" "}
                {results.length === 1 ? copy.resultsOne : copy.resultsMany}
              </span>
              {filtered ? (
                <a className="pclear" href={`/${locale}/projects`}>
                  {copy.clearFilters}
                </a>
              ) : null}
            </div>

            {results.length ? (
              <ProjectGrid lang={locale} copy={copy} projects={results} contact={contact} />
            ) : (
              <div className="pempty">
                <h2>{copy.noResultsTitle}</h2>
                <p>{copy.noResultsBody}</p>
                <p style={{ marginTop: "18px" }}>
                  <a className="btn btn--gold" href={`/${locale}/projects`}>
                    {copy.clearFilters}
                  </a>
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </SiteFrame>
  );
}
