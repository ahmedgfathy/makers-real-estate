import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BreadcrumbJsonLd from "@/components/catalog/BreadcrumbJsonLd";
import CatalogFilterForm from "@/components/catalog/CatalogFilterForm";
import { Breadcrumbs, Pager, ProjectCards } from "@/components/catalog/CatalogPieces";
import JsonLd from "@/components/JsonLd";
import SiteFrame from "@/components/SiteFrame";
import {
  ancestorLocations,
  categoryName,
  descendantIds,
  getLocationBySlug,
  getCatalogOptions,
  listProjects,
  locationName,
} from "@/lib/catalog";
import {
  localeCopy,
  projectFilters,
  queryLocationIds,
  queryRecord,
  readProjectQuery,
} from "@/lib/catalog-params";
import { getSite } from "@/lib/content-db";
import { absoluteUrl, isLang, localizedAlternates } from "@/lib/seo";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = "force-dynamic";

function labels(lang: "en" | "ar") {
  return lang === "ar"
    ? {
        home: "الرئيسية",
        locations: "المواقع",
        projects: "المشروعات",
        from: "من",
        to: "إلى",
        projectCount: "عدد المشروعات",
        categories: "أنواع العقارات",
        priceRange: "نطاق الأسعار",
        locationInfo: "معلومات الموقع",
        nearbyAreas: "مناطق أخرى قريبة",
        noProjects: "لا توجد مشروعات في هذه المنطقة بعد.",
        results: "نتيجة",
      }
    : {
        home: "Home",
        locations: "Locations",
        projects: "Projects",
        from: "From",
        to: "To",
        projectCount: "Projects",
        categories: "Property categories",
        priceRange: "Price range",
        locationInfo: "Location details",
        nearbyAreas: "Nearby areas",
        noProjects: "No projects are published in this area yet.",
        results: "results",
      };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLang(locale)) return {};
  const location = await getLocationBySlug(slug);
  if (!location) return {};

  const text = labels(locale);
  const title = locale === "ar" ? location.seoTitleAr || `عقارات ${location.nameAr}` : location.seoTitleEn || `Properties in ${location.nameEn}`;
  const description =
    locale === "ar"
      ? location.seoDescriptionAr || location.descriptionAr || location.descriptionEn
      : location.seoDescriptionEn || location.descriptionEn || location.descriptionAr;
  const path = `/locations/${slug}`;
  const url = absoluteUrl(`/${locale}${path}`);
  return {
    title: title || text.projects,
    description: description || undefined,
    alternates: { canonical: url, languages: localizedAlternates(path) },
    openGraph: {
      title,
      description: description || undefined,
      type: "website",
      url,
      images: location.imageUrl ? [location.imageUrl] : undefined,
    },
  };
}

export default async function LocationPage({ params, searchParams }: PageProps) {
  const { locale, slug } = await params;
  if (!isLang(locale)) notFound();

  const location = await getLocationBySlug(slug);
  if (!location) notFound();

  const query = readProjectQuery(await searchParams);
  const [site, options] = await Promise.all([getSite(), getCatalogOptions()]);
  const areaIds = descendantIds(options.locations, location.id);
  const allInArea = await listProjects({ locationIds: areaIds, pageSize: 1000, sort: "name" });

  const selectedIds = queryLocationIds(query, options.locations);
  const locationIds = selectedIds.length
    ? areaIds.filter((id) => selectedIds.includes(id))
    : areaIds;
  const filters = { ...projectFilters(query, options.locations), locationIds, location: undefined };
  const projects = await listProjects(filters);

  const name = locationName(location, locale);
  const t = labels(locale);
  const ancestors = ancestorLocations(options.locations, location);
  const siblings = options.locations.filter(
    (item) => item.id !== location.id && item.parentId === location.parentId && item.isDirectory
  );
  const categories = Array.from(
    new Map(allInArea.items.flatMap((project) => project.categories).map((category) => [category.id, category])).values()
  ).sort((a, b) => a.sortOrder - b.sortOrder);
  const prices = allInArea.items
    .map((project) => project.startingPrice)
    .filter((price): price is number => price !== null)
    .sort((a, b) => a - b);
  const path = `/locations/${slug}`;
  const breadcrumbs = [
    { label: t.home, href: `/${locale}` },
    { label: t.locations, href: `/${locale}/locations` },
    ...ancestors.map((item) => ({
      label: locationName(item, locale),
      href: `/${locale}/locations/${item.slug}`,
    })),
    { label: name },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Place",
          name,
          description: locale === "ar" ? location.descriptionAr : location.descriptionEn,
          url: absoluteUrl(`/${locale}${path}`),
          image: location.imageUrl ? absoluteUrl(location.imageUrl) : undefined,
          address: {
            "@type": "PostalAddress",
            addressLocality: ancestors.map((item) => locationName(item, locale)).join(", "),
            addressCountry: "EG",
          },
        }}
      />
      <SiteFrame content={site.content} contact={site.contact} lang={locale}>
        <main className="site-page-main">
          <header
            className="cat-area-hero"
            style={location.imageUrl ? { backgroundImage: `linear-gradient(180deg, rgba(0,0,0,.62), rgba(0,0,0,.35)), url(${location.imageUrl})` } : undefined}
          >
            <div className="pwrap">
              <Breadcrumbs lang={locale} items={breadcrumbs} />
              <p className="pkicker">{location.type}</p>
              <h1 className="ptitle">{name}</h1>
              <p className="plede">{locale === "ar" ? location.descriptionAr || location.descriptionEn : location.descriptionEn || location.descriptionAr}</p>
            </div>
          </header>

          <section className="psec psec--off">
            <div className="pwrap cat-area-summary">
              <div className="cat-summary-card">
                <span>{t.projectCount}</span>
                <strong>{allInArea.total}</strong>
              </div>
              <div className="cat-summary-card">
                <span>{t.priceRange}</span>
                <strong dir="auto">
                  {prices.length
                    ? `${t.from } ${prices[0].toLocaleString()} — ${t.to} ${prices[prices.length - 1].toLocaleString()} EGP`
                    : "—"}
                </strong>
              </div>
              <div className="cat-summary-card cat-summary-card--wide">
                <span>{t.categories}</span>
                <div className="cat-chips">
                  {categories.map((category) => (
                    <span className="cat-chip" key={category.id}>
                      {categoryName(category, locale)}
                    </span>
                  ))}
                </div>
              </div>
              <div className="cat-summary-card cat-summary-card--wide">
                <span>{t.locationInfo}</span>
                <p>
                  {ancestors.length
                    ? ancestors.map((item) => locationName(item, locale)).join(" → ")
                    : locale === "ar"
                      ? "موقع مستقل"
                      : "Top-level location"}
                  {location.parentId ? ` → ${name}` : ""}
                </p>
              </div>
            </div>
          </section>

          <section className="psec">
            <div className="pwrap">
              <CatalogFilterForm
                lang={locale}
                action={`/${locale}${path}`}
                mode="projects"
                locations={options.locations}
                developers={Array.from(
                  new Map(
                    allInArea.items
                      .map((project) => project.developer)
                      .filter((developer): developer is NonNullable<typeof developer> => Boolean(developer))
                      .map((developer) => [developer.id, developer])
                  ).values()
                )}
                categories={categories}
                projectQuery={query}
              />
              <div className="presultbar">
                <span>
                  <strong>{projects.total}</strong> {t.results}
                </span>
              </div>
              {projects.items.length ? (
                <>
                  <ProjectCards lang={locale} projects={projects.items} />
                  <Pager
                    lang={locale}
                    page={projects.page}
                    total={projects.total}
                    pageSize={projects.pageSize}
                    path={`/${locale}${path}`}
                    query={queryRecord(query)}
                  />
                </>
              ) : (
                <div className="pempty">
                  <p>{t.noProjects}</p>
                </div>
              )}
            </div>
          </section>

          {siblings.length ? (
            <section className="psec psec--off">
              <div className="pwrap">
                <h2 className="ptitle">{t.nearbyAreas}</h2>
                <div className="cat-chips cat-chips--large">
                  {siblings.map((item) => (
                    <a className="cat-chip" key={item.id} href={`/${locale}/locations/${item.slug}`}>
                      {locationName(item, locale)} →
                    </a>
                  ))}
                </div>
              </div>
            </section>
          ) : null}
        </main>
      </SiteFrame>
    </>
  );
}
