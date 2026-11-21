import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BreadcrumbJsonLd from "@/components/catalog/BreadcrumbJsonLd";
import { Breadcrumbs, Pager, UnitCards } from "@/components/catalog/CatalogPieces";
import JsonLd from "@/components/JsonLd";
import LeadForm from "@/components/LeadForm";
import SiteFrame from "@/components/SiteFrame";
import { whatsappLink } from "@/data/content";
import { categoryName, getProjectBySlug, listUnits, projectName } from "@/lib/catalog";
import { localeCopy, queryRecord, readUnitQuery, unitFilters, type UnitQuery } from "@/lib/catalog-params";
import { getSite } from "@/lib/content-db";
import { absoluteUrl, isLang, localizedAlternates } from "@/lib/seo";

type PageProps = {
  params: Promise<{ locale: string; slug: string; category: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = "force-dynamic";

function labels(lang: "en" | "ar") {
  return lang === "ar"
    ? { home: "الرئيسية", projects: "المشروعات", units: "الوحدات", noUnits: "لا توجد وحدات في هذا التصنيف حالياً.", description: "تصفّح الوحدات المتاحة من هذا النوع داخل المشروع." }
    : { home: "Home", projects: "Projects", units: "Units", noUnits: "No units are published in this category yet.", description: "Browse available units of this type inside the project." };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug, category } = await params;
  if (!isLang(locale)) return {};
  const project = await getProjectBySlug(slug);
  const match = project?.categories.find((item) => item.slug === category);
  if (!project || !match) return {};
  const title = locale === "ar"
    ? `${categoryName(match, "ar")} ${projectName(project, "ar")} | ميكرز للعقارات`
    : `${categoryName(match, "en")} in ${projectName(project, "en")} | Makers Real Estate`;
  const path = `/projects/${slug}/${category}`;
  const url = absoluteUrl(`/${locale}${path}`);
  return {
    title,
    description: labels(locale).description,
    alternates: { canonical: url, languages: localizedAlternates(path) },
    openGraph: { title, description: labels(locale).description, url },
  };
}

export default async function ProjectCategoryPage({ params, searchParams }: PageProps) {
  const { locale, slug, category } = await params;
  if (!isLang(locale)) notFound();
  const project = await getProjectBySlug(slug);
  if (!project) notFound();
  const categoryRow = project.categories.find((item) => item.slug === category);
  if (!categoryRow) notFound();

  const query: UnitQuery = { ...readUnitQuery(await searchParams), category };
  const [site, units] = await Promise.all([
    getSite(),
    listUnits(unitFilters(query, project.slug)),
  ]);
  const t = labels(locale);
  const tFilter = localeCopy(locale);
  const path = `/projects/${slug}/${category}`;
  const breadcrumbs = [
    { label: t.home, href: `/${locale}` },
    { label: t.projects, href: `/${locale}/projects` },
    { label: projectName(project, locale), href: `/${locale}/projects/${slug}` },
    { label: categoryName(categoryRow, locale) },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `${categoryName(categoryRow, locale)} — ${projectName(project, locale)}`,
          url: absoluteUrl(`/${locale}${path}`),
          numberOfItems: units.total,
        }}
      />
      <SiteFrame content={site.content} contact={site.contact} lang={locale}>
        <main className="site-page-main">
          <header className="cat-page-head">
            <div className="pwrap">
              <Breadcrumbs lang={locale} items={breadcrumbs} />
              <p className="pkicker">{projectName(project, locale)}</p>
              <h1 className="ptitle">{categoryName(categoryRow, locale)}</h1>
              <p className="plede">{t.description}</p>
            </div>
          </header>
          <section className="psec">
            <div className="pwrap">
              <div className="presultbar">
                <span><strong>{units.total}</strong> {tFilter.results}</span>
              </div>
              {units.items.length ? (
                <>
                  <UnitCards lang={locale} units={units.items} />
                  <Pager
                    lang={locale}
                    page={units.page}
                    total={units.total}
                    pageSize={units.pageSize}
                    path={`/${locale}${path}`}
                    query={queryRecord(query)}
                  />
                </>
              ) : (
                <div className="pempty"><p>{t.noUnits}</p></div>
              )}
            </div>
          </section>
          <LeadForm
            c={site.content[locale]}
            lang={locale}
            contact={site.contact}
            whatsapp={whatsappLink(site.contact, locale)}
            phoneHref={site.contact.phoneHref}
            defaultProject={projectName(project, locale)}
            context={{
              projectId: project.id,
              locationId: project.locationId ?? undefined,
              propertyCategoryId: categoryRow.id,
              sourcePath: `/${locale}${path}`,
            }}
          />
        </main>
      </SiteFrame>
    </>
  );
}
