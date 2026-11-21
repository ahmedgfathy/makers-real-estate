import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CatalogFilterForm from "@/components/catalog/CatalogFilterForm";
import { Breadcrumbs, Pager, UnitCards } from "@/components/catalog/CatalogPieces";
import JsonLd from "@/components/JsonLd";
import SiteFrame from "@/components/SiteFrame";
import { descendantIds, getCatalogOptions, listUnits } from "@/lib/catalog";
import { localeCopy, queryRecord, readUnitQuery, unitFilters } from "@/lib/catalog-params";
import { getSite } from "@/lib/content-db";
import { absoluteUrl, isLang, localizedAlternates } from "@/lib/seo";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = "force-dynamic";

const copy = {
  en: { title: "Search Units", lede: "Combine location, project, category, budget and unit specifications. Your selections stay in the URL.", empty: "No units match all of those filters." },
  ar: { title: "ابحث عن وحدة", lede: "اجمع بين الموقع والمشروع ونوع الوحدة والميزانية والمواصفات. تظل اختياراتك محفوظة في الرابط.", empty: "لا توجد وحدات تطابق كل هذه الفلاتر." },
} as const;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLang(locale)) return {};
  const text = copy[locale];
  const url = absoluteUrl(`/${locale}/search`);
  return {
    title: text.title,
    description: text.lede,
    alternates: { canonical: url, languages: localizedAlternates("/search") },
  };
}

export default async function SearchPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  if (!isLang(locale)) notFound();
  const query = readUnitQuery(await searchParams);
  const [site, options] = await Promise.all([getSite(), getCatalogOptions()]);
  const locationIds = query.location ? descendantIds(options.locations, query.location) : undefined;
  const units = await listUnits(unitFilters(query, undefined, locationIds));
  const text = copy[locale];
  const t = localeCopy(locale);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SearchResultsPage",
          name: text.title,
          url: absoluteUrl(`/${locale}/search`),
          numberOfResults: units.total,
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
                  { label: text.title },
                ]}
              />
              <p className="pkicker">{locale === "ar" ? "بحث متقدم" : "Advanced search"}</p>
              <h1 className="ptitle">{text.title}</h1>
              <p className="plede">{text.lede}</p>
            </div>
          </header>
          <section className="psec">
            <div className="pwrap">
              <CatalogFilterForm
                lang={locale}
                action={`/${locale}/search`}
                mode="units"
                locations={options.locations}
                developers={[]}
                categories={options.categories}
                unitQuery={query}
                showLocationProject
                projects={options.projects}
              />
              <div className="presultbar">
                <span><strong>{units.total}</strong> {t.results}</span>
              </div>
              {units.items.length ? (
                <>
                  <UnitCards lang={locale} units={units.items} />
                  <Pager
                    lang={locale}
                    page={units.page}
                    total={units.total}
                    pageSize={units.pageSize}
                    path={`/${locale}/search`}
                    query={queryRecord(query)}
                  />
                </>
              ) : (
                <div className="pempty"><p>{text.empty}</p></div>
              )}
            </div>
          </section>
        </main>
      </SiteFrame>
    </>
  );
}
