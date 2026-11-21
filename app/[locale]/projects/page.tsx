import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CatalogFilterForm from "@/components/catalog/CatalogFilterForm";
import { Breadcrumbs, Pager, ProjectCards } from "@/components/catalog/CatalogPieces";
import JsonLd from "@/components/JsonLd";
import SiteFrame from "@/components/SiteFrame";
import { getCatalogOptions, listProjects, projectName } from "@/lib/catalog";
import {
  localeCopy,
  projectFilters,
  queryRecord,
  readProjectQuery,
  type ProjectQuery,
} from "@/lib/catalog-params";
import { getSite } from "@/lib/content-db";
import { absoluteUrl, isLang, localizedAlternates, SITE_URL } from "@/lib/seo";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = "force-dynamic";

const pageCopy = {
  en: {
    kicker: "Curated primary market",
    title: "Explore Projects",
    lede: "Filter real projects by location, developer, property type, payment terms and delivery.",
    emptyTitle: "No projects match those filters",
    emptyBody: "Try widening the price range or clearing one of the location filters.",
  },
  ar: {
    kicker: "طرح أولي مختار",
    title: "استكشف المشروعات",
    lede: "تصفح المشروعات الحقيقية حسب الموقع والمطور ونوع العقار وشروط السداد والتسليم.",
    emptyTitle: "لا توجد مشروعات مطابقة",
    emptyBody: "جرّب توسيع نطاق السعر أو إلغاء أحد فلاتر الموقع.",
  },
} as const;

function queryIsFiltered(query: ProjectQuery): boolean {
  return Boolean(
    query.q ||
      query.governorate ||
      query.city ||
      query.area ||
      query.location ||
      query.developer ||
      query.category ||
      query.status ||
      query.minPrice ||
      query.maxPrice ||
      query.minDownPayment ||
      query.maxInstallment ||
      query.deliveryBefore
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLang(locale)) return {};

  const copy = pageCopy[locale];
  const url = absoluteUrl(`/${locale}/projects`);
  return {
    title:
      locale === "ar"
        ? "مشروعات عقارية في مصر | ميكرز للعقارات"
        : "Property Projects in Egypt | Makers Real Estate",
    description: copy.lede,
    alternates: { canonical: url, languages: localizedAlternates("/projects") },
    openGraph: { title: copy.title, description: copy.lede, type: "website", url },
  };
}

export default async function ProjectsPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  if (!isLang(locale)) notFound();

  const query = readProjectQuery(await searchParams);
  const [site, options] = await Promise.all([getSite(), getCatalogOptions()]);
  const filters = projectFilters(query, options.locations);
  const results = await listProjects(filters);
  const t = localeCopy(locale);
  const copy = pageCopy[locale];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: copy.title,
          url: absoluteUrl(`/${locale}/projects`),
          numberOfItems: results.total,
          itemListElement: results.items.map((item, index) => ({
            "@type": "ListItem",
            position: (results.page - 1) * results.pageSize + index + 1,
            name: projectName(item, locale),
            url: absoluteUrl(`/${locale}/projects/${item.slug}`),
          })),
        }}
      />
      <SiteFrame content={site.content} contact={site.contact} lang={locale}>
        <main className="site-page-main">
          <header className="cat-page-head">
            <div className="pwrap">
              <Breadcrumbs
                lang={locale}
                items={[
                  { label: locale === "ar" ? "الرئيسية" : "Home", href: `/${locale}` },
                  { label: copy.title },
                ]}
              />
              <p className="pkicker">{copy.kicker}</p>
              <h1 className="ptitle">{copy.title}</h1>
              <p className="plede">{copy.lede}</p>
            </div>
          </header>

          <section className="psec">
            <div className="pwrap">
              <CatalogFilterForm
                lang={locale}
                action={`/${locale}/projects`}
                mode="projects"
                locations={options.locations}
                developers={options.developers}
                categories={options.categories}
                projectQuery={query}
              />

              <div className="presultbar">
                <span>
                  <strong>{results.total}</strong> {t.results}
                </span>
                {queryIsFiltered(query) ? (
                  <a className="pclear" href={`/${locale}/projects`}>
                    {t.clear}
                  </a>
                ) : null}
              </div>

              {results.items.length ? (
                <>
                  <ProjectCards lang={locale} projects={results.items} />
                  <Pager
                    lang={locale}
                    page={results.page}
                    total={results.total}
                    pageSize={results.pageSize}
                    path={`/${locale}/projects`}
                    query={queryRecord(query)}
                  />
                </>
              ) : (
                <div className="pempty">
                  <h2>{copy.emptyTitle}</h2>
                  <p>{copy.emptyBody}</p>
                  <p style={{ marginTop: "18px" }}>
                    <a className="btn btn--gold" href={`/${locale}/projects`}>
                      {t.clear}
                    </a>
                  </p>
                </div>
              )}
            </div>
          </section>
        </main>
      </SiteFrame>
    </>
  );
}
