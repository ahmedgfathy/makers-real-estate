import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BreadcrumbJsonLd from "@/components/catalog/BreadcrumbJsonLd";
import { Breadcrumbs } from "@/components/catalog/CatalogPieces";
import JsonLd from "@/components/JsonLd";
import LeadForm from "@/components/LeadForm";
import SiteFrame from "@/components/SiteFrame";
import { whatsappLink } from "@/data/content";
import { area, egp, formatDate } from "@/lib/format";
import {
  getProjectById,
  getUnitBySlug,
  getUnitImages,
  listLocations,
  locationName,
  projectName,
  unitTitle,
} from "@/lib/catalog";
import { getSite } from "@/lib/content-db";
import { absoluteUrl, isLang, localizedAlternates } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export const dynamic = "force-dynamic";

function labels(lang: "en" | "ar") {
  return lang === "ar"
    ? {
        home: "الرئيسية", projects: "المشروعات", units: "الوحدات", specs: "مواصفات الوحدة",
        pricing: "السعر والسداد", reference: "المرجع", builtUp: "المساحة المبنية", land: "مساحة الأرض",
        bedrooms: "غرف النوم", bathrooms: "الحمامات", floor: "الدور", garden: "الحديقة",
        terrace: "التراس", view: "الإطلالة", finishing: "التشطيب", delivery: "التسليم",
        total: "إجمالي السعر", down: "المقدم", installment: "القسط", period: "مدة السداد",
        status: "الحالة", gallery: "صور الوحدة", enquiry: "استفسر عن هذه الوحدة",
      }
    : {
        home: "Home", projects: "Projects", units: "Units", specs: "Unit specifications",
        pricing: "Price & payment", reference: "Reference", builtUp: "Built-up area", land: "Land area",
        bedrooms: "Bedrooms", bathrooms: "Bathrooms", floor: "Floor", garden: "Garden",
        terrace: "Terrace", view: "View", finishing: "Finishing", delivery: "Delivery",
        total: "Total price", down: "Down payment", installment: "Instalment", period: "Payment period",
        status: "Status", gallery: "Unit gallery", enquiry: "Enquire about this unit",
      };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLang(locale)) return {};
  const unit = await getUnitBySlug(slug);
  if (!unit) return {};
  const title = locale === "ar" ? `وحدة ${unitTitle(unit, "ar")}` : `${unitTitle(unit, "en")} Unit`;
  const path = `/units/${slug}`;
  const url = absoluteUrl(`/${locale}${path}`);
  return {
    title,
    description: locale === "ar" ? unit.descriptionAr || unit.titleAr : unit.descriptionEn || unit.titleEn,
    alternates: { canonical: url, languages: localizedAlternates(path) },
    openGraph: {
      title,
      description: locale === "ar" ? unit.descriptionAr || unit.titleAr : unit.descriptionEn || unit.titleEn,
      url,
    },
  };
}

export default async function UnitPage({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!isLang(locale)) notFound();
  const unit = await getUnitBySlug(slug);
  if (!unit) notFound();

  const [site, images, project, locations] = await Promise.all([
    getSite(),
    getUnitImages(unit.id),
    getProjectById(unit.projectId),
    listLocations(),
  ]);
  const t = labels(locale);
  const path = `/units/${slug}`;
  const title = unitTitle(unit, locale);
  const categoryLabel = locale === "ar" ? unit.categoryNameAr || unit.categoryNameEn : unit.categoryNameEn;
  const location = project?.location ?? locations.find((item) => item.id === project?.locationId) ?? null;
  const breadcrumbs = [
    { label: t.home, href: `/${locale}` },
    { label: t.projects, href: `/${locale}/projects` },
    ...(project
      ? [{ label: projectName(project, locale), href: `/${locale}/projects/${project.slug}` }]
      : []),
    { label: title },
  ];

  const specs: [string, string | null][] = [
    [t.reference, unit.reference],
    [t.builtUp, area(unit.builtUpArea)],
    [t.land, area(unit.landArea)],
    [t.bedrooms, unit.bedrooms == null ? null : String(unit.bedrooms)],
    [t.bathrooms, unit.bathrooms == null ? null : String(unit.bathrooms)],
    [t.floor, unit.floor],
    [t.garden, area(unit.gardenArea)],
    [t.terrace, area(unit.terraceArea)],
    [t.view, locale === "ar" ? unit.viewAr || unit.viewEn : unit.viewEn],
    [t.finishing, locale === "ar" ? unit.finishingAr || unit.finishingEn : unit.finishingEn],
    [t.delivery, formatDate(unit.deliveryDate)],
    [t.status, unit.status],
  ];

  const pricing: [string, string | null][] = [
    [t.total, egp(unit.totalPrice)],
    [t.down, unit.downPaymentAmount ? egp(unit.downPaymentAmount) : unit.downPaymentPercent != null ? `${unit.downPaymentPercent}%` : null],
    [t.installment, egp(unit.installmentAmount)],
    [t.period, unit.installmentMonths ? `${unit.installmentMonths} ${locale === "ar" ? "شهر" : "months"}` : null],
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: title,
          description: locale === "ar" ? unit.descriptionAr || unit.titleAr : unit.descriptionEn || unit.titleEn,
          url: absoluteUrl(`/${locale}${path}`),
          offers: unit.totalPrice
            ? { "@type": "Offer", price: unit.totalPrice, priceCurrency: "EGP", availability: unit.status === "available" ? "https://schema.org/InStock" : "https://schema.org/PreOrder" }
            : undefined,
        }}
      />
      <SiteFrame content={site.content} contact={site.contact} lang={locale}>
        <main className="site-page-main">
          <header className="cat-page-head">
            <div className="pwrap">
              <Breadcrumbs lang={locale} items={breadcrumbs} />
              <p className="pkicker">
                {project ? projectName(project, locale) : ""}
                {location ? ` · ${locationName(location, locale)}` : ""}
              </p>
              <h1 className="ptitle">{title}</h1>
              <p className="plede">{categoryLabel}</p>
            </div>
          </header>

          <section className="psec">
            <div className="pwrap cat-two-col">
              <div>
                <p className="pkicker">{t.specs}</p>
                <h2 className="ptitle">{t.specs}</h2>
                <p>{locale === "ar" ? unit.descriptionAr || unit.descriptionEn : unit.descriptionEn || unit.descriptionAr}</p>
                <div className="cat-facts">
                  {specs.filter(([, value]) => value).map(([label, value]) => (
                    <div key={label}><span>{label}</span><strong dir="auto">{value}</strong></div>
                  ))}
                </div>
              </div>
              <aside className="cat-aside">
                <h3>{t.pricing}</h3>
                <dl>
                  {pricing.filter(([, value]) => value).map(([label, value]) => (
                    <div key={label}><dt>{label}</dt><dd dir="auto">{value}</dd></div>
                  ))}
                </dl>
                {images.length ? (
                  <>
                    <h3>{t.gallery}</h3>
                    <div className="cat-gallery cat-gallery--small">
                      {images.map((image) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img key={image.id} src={image.url} alt={locale === "ar" ? image.altAr || image.altEn || title : image.altEn || title} loading="lazy" />
                      ))}
                    </div>
                  </>
                ) : null}
              </aside>
            </div>
          </section>

          <LeadForm
            c={site.content[locale]}
            lang={locale}
            contact={site.contact}
            whatsapp={whatsappLink(site.contact, locale)}
            phoneHref={site.contact.phoneHref}
            defaultProject={project ? projectName(project, locale) : unit.projectNameEn}
            context={{
              projectId: unit.projectId,
              locationId: project?.locationId ?? undefined,
              propertyCategoryId: unit.categoryId,
              unitId: unit.id,
              budget: unit.totalPrice ?? undefined,
              sourcePath: `/${locale}${path}`,
            }}
          />
        </main>
      </SiteFrame>
    </>
  );
}
