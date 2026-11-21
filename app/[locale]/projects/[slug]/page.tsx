import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BreadcrumbJsonLd from "@/components/catalog/BreadcrumbJsonLd";
import CatalogFilterForm from "@/components/catalog/CatalogFilterForm";
import {
  Breadcrumbs,
  CategoryPills,
  Pager,
  UnitCards,
} from "@/components/catalog/CatalogPieces";
import JsonLd from "@/components/JsonLd";
import LeadForm from "@/components/LeadForm";
import SiteFrame from "@/components/SiteFrame";
import {
  ancestorLocations,
  categoryName,
  getPaymentPlans,
  getProjectBySlug,
  getProjectFacts,
  getProjectFacilities,
  getProjectImages,
  getProjectLandmarks,
  listLocations,
  listUnits,
  locationName,
  projectName,
} from "@/lib/catalog";
import {
  localeCopy,
  queryRecord,
  readUnitQuery,
  unitFilters,
  type UnitQuery,
} from "@/lib/catalog-params";
import { getSite } from "@/lib/content-db";
import { whatsappLink } from "@/data/content";
import { egp, formatDate } from "@/lib/format";
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
        projects: "المشروعات",
        overview: "نظرة عامة",
        hierarchy: "التصنيف",
        byDeveloper: "المطور",
        inArea: "الموقع",
        masterplan: "الماستر بلان",
        media: "المعرض",
        facilities: "المرافق والخدمات",
        landmarks: "المناطق القريبة",
        delivery: "التسليم والسداد",
        categories: "أنواع العقارات",
        units: "الوحدات المتاحة",
        filterUnits: "صفِّ الوحدات",
        noUnits: "لا توجد وحدات مطابقة حالياً.",
        plan: "خطة السداد",
        note: "ملاحظة المطور",
        from: "من",
        video: "فيديو المشروع",
        noMedia: "لا توجد صور منشورة بعد.",
      }
    : {
        home: "Home",
        projects: "Projects",
        overview: "Overview",
        hierarchy: "Classification",
        byDeveloper: "Developer",
        inArea: "Location",
        masterplan: "Masterplan",
        media: "Gallery",
        facilities: "Facilities",
        landmarks: "Nearby landmarks",
        delivery: "Delivery & payment",
        categories: "Property categories",
        units: "Available units",
        filterUnits: "Filter units",
        noUnits: "No units match these filters right now.",
        plan: "Payment plan",
        note: "Developer note",
        from: "From",
        video: "Project film",
        noMedia: "No images have been published yet.",
      };
}

function statusLabel(status: string, lang: "en" | "ar"): string {
  if (lang === "ar") {
    if (status === "ready") return "جاهز للسكن";
    if (status === "under_construction") return "تحت الإنشاء";
    return "طرح أولي";
  }
  if (status === "ready") return "Ready to move";
  if (status === "under_construction") return "Under construction";
  return "Off-plan";
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLang(locale)) return {};
  const project = await getProjectBySlug(slug);
  if (!project) return {};

  const name = projectName(project, locale);
  const title =
    locale === "ar"
      ? project.seoTitleAr || `${name} | الأسعار ومواعيد التسليم | ميكرز للعقارات`
      : project.seoTitleEn || `${name} | Prices & Delivery | Makers Real Estate`;
  const description =
    locale === "ar"
      ? project.seoDescriptionAr || project.descriptionAr
      : project.seoDescriptionEn || project.descriptionEn;
  const path = `/projects/${slug}`;
  const url = absoluteUrl(`/${locale}${path}`);
  return {
    title,
    description: description || undefined,
    alternates: { canonical: url, languages: localizedAlternates(path) },
    openGraph: {
      title,
      description: description || undefined,
      type: "website",
      url,
      images: project.coverImage ? [project.coverImage] : undefined,
    },
  };
}

export default async function ProjectDetailPage({ params, searchParams }: PageProps) {
  const { locale, slug } = await params;
  if (!isLang(locale)) notFound();

  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const query: UnitQuery = readUnitQuery(await searchParams);
  const [site, locations, images, facilities, landmarks, facts, plans, units] = await Promise.all([
    getSite(),
    listLocations(),
    getProjectImages(project.id),
    getProjectFacilities(project.id),
    getProjectLandmarks(project.id),
    getProjectFacts(project.id),
    getPaymentPlans(project.id),
    listUnits(unitFilters(query, project.slug)),
  ]);

  const name = projectName(project, locale);
  const t = labels(locale);
  const tFilter = localeCopy(locale);
  const ancestors = ancestorLocations(locations, project.location);
  const path = `/projects/${slug}`;
  const gallery = images.filter((image) => image.kind === "gallery");
  const masterplan = project.masterplanImage;
  const breadcrumbs = [
    { label: t.home, href: `/${locale}` },
    { label: t.projects, href: `/${locale}/projects` },
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
          "@type": "Product",
          name,
          description: locale === "ar" ? project.descriptionAr : project.descriptionEn,
          url: absoluteUrl(`/${locale}${path}`),
          image: project.coverImage ? absoluteUrl(project.coverImage) : undefined,
          brand: project.developer ? { "@type": "Brand", name: project.developer.nameEn } : undefined,
          offers: project.startingPrice
            ? {
                "@type": "Offer",
                price: project.startingPrice,
                priceCurrency: "EGP",
                availability: "https://schema.org/InStock",
              }
            : undefined,
        }}
      />
      <SiteFrame content={site.content} contact={site.contact} lang={locale}>
        <main className="site-page-main">
          <header
            className="cat-project-hero"
            style={{
              backgroundImage: `linear-gradient(180deg, rgba(0,0,0,.62), rgba(0,0,0,.38)), url(${project.coverImage ?? "/img/lakes-sunset.jpg"})`,
            }}
          >
            <div className="pwrap">
              <Breadcrumbs lang={locale} items={breadcrumbs} />
              <p className="pkicker">
                {project.location ? locationName(project.location, locale) : ""} · {statusLabel(project.status, locale)}
              </p>
              <h1 className="ptitle">{name}</h1>
              <p className="plede">{locale === "ar" ? project.descriptionAr : project.descriptionEn}</p>
              <div className="cat-hero-chips">
                {project.startingPrice ? <span>{t.from} {egp(project.startingPrice, true)}</span> : null}
                {project.developer ? <span>{locale === "ar" ? project.developer.nameAr || project.developer.nameEn : project.developer.nameEn}</span> : null}
                {project.installmentMonths ? <span>{project.installmentMonths} {locale === "ar" ? "شهر تقسيط" : "months"}</span> : null}
              </div>
            </div>
          </header>

          <section className="psec" id="overview">
            <div className="pwrap">
              <div className="cat-two-col">
                <div>
                  <p className="pkicker">{t.overview}</p>
                  <h2 className="ptitle">{name}</h2>
                  <p>{locale === "ar" ? project.descriptionAr : project.descriptionEn}</p>
                  {facts.length ? (
                    <div className="cat-facts">
                      {facts.map((fact) => (
                        <div key={fact.id}>
                          <span>{locale === "ar" ? fact.labelAr || fact.labelEn : fact.labelEn}</span>
                          <strong dir="auto">{locale === "ar" ? fact.valueAr || fact.valueEn : fact.valueEn}</strong>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
                <aside className="cat-aside">
                  <h3>{t.hierarchy}</h3>
                  <dl>
                    {project.developer ? (
                      <>
                        <dt>{t.byDeveloper}</dt>
                        <dd>{locale === "ar" ? project.developer.nameAr || project.developer.nameEn : project.developer.nameEn}</dd>
                      </>
                    ) : null}
                    {project.location ? (
                      <>
                        <dt>{t.inArea}</dt>
                        <dd>
                          {ancestors.map((item) => locationName(item, locale)).join(" → ")}
                          {ancestors.length ? " → " : ""}
                          {locationName(project.location, locale)}
                        </dd>
                      </>
                    ) : null}
                    <dt>{t.categories}</dt>
                    <dd>{project.categories.map((category) => categoryName(category, locale)).join(" · ")}</dd>
                  </dl>
                  <CategoryPills lang={locale} categories={project.categories} projectSlug={project.slug} />
                </aside>
              </div>
            </div>
          </section>

          {masterplan ? (
            <section className="psec psec--off" id="masterplan">
              <div className="pwrap">
                <p className="pkicker">{t.masterplan}</p>
                <h2 className="ptitle">{name}</h2>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="cat-wide-image" src={masterplan} alt={`${name} masterplan`} loading="lazy" />
              </div>
            </section>
          ) : null}

          <section className="psec" id="gallery">
            <div className="pwrap">
              <p className="pkicker">{t.media}</p>
              <h2 className="ptitle">{name}</h2>
              {gallery.length ? (
                <div className="cat-gallery">
                  {gallery.map((image) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={image.id}
                      src={image.url}
                      alt={locale === "ar" ? image.altAr || image.altEn || name : image.altEn || name}
                      loading="lazy"
                    />
                  ))}
                </div>
              ) : (
                <p>{t.noMedia}</p>
              )}
              {project.videoUrl ? (
                <div className="cat-video">
                  <p className="pkicker">{t.video}</p>
                  <video controls poster={project.coverImage ?? undefined} src={project.videoUrl} />
                </div>
              ) : null}
            </div>
          </section>

          {(facilities.length || landmarks.length) ? (
            <section className="psec psec--off" id="facilities">
              <div className="pwrap cat-two-col">
                {facilities.length ? (
                  <div>
                    <p className="pkicker">{t.facilities}</p>
                    <h2 className="ptitle">{t.facilities}</h2>
                    <ul className="cat-list">
                      {facilities.map((facility) => (
                        <li key={facility.id}>{locale === "ar" ? facility.nameAr || facility.nameEn : facility.nameEn}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {landmarks.length ? (
                  <div>
                    <p className="pkicker">{t.landmarks}</p>
                    <h2 className="ptitle">{t.landmarks}</h2>
                    <ul className="cat-list">
                      {landmarks.map((landmark) => (
                        <li key={landmark.id}>
                          {locale === "ar" ? landmark.nameAr || landmark.nameEn : landmark.nameEn}
                          {landmark.distance ? <span> — {landmark.distance}</span> : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </section>
          ) : null}

          <section className="psec" id="payment">
            <div className="pwrap">
              <p className="pkicker">{t.delivery}</p>
              <h2 className="ptitle">{t.delivery}</h2>
              <div className="cat-summary-grid">
                <div className="cat-summary-card">
                  <span>{locale === "ar" ? "التسليم" : "Delivery"}</span>
                  <strong>{formatDate(project.deliveryDate)}</strong>
                </div>
                <div className="cat-summary-card">
                  <span>{locale === "ar" ? "المقدم" : "Down payment"}</span>
                  <strong>{project.downPaymentPercent != null ? `${project.downPaymentPercent}%` : "—"}</strong>
                </div>
                <div className="cat-summary-card">
                  <span>{locale === "ar" ? "مدة التقسيط" : "Instalment period"}</span>
                  <strong>{project.installmentMonths ? `${project.installmentMonths} ${locale === "ar" ? "شهر" : "months"}` : "—"}</strong>
                </div>
              </div>
              {plans.map((plan) => (
                <article className="cat-plan" key={plan.id}>
                  <h3>{locale === "ar" ? plan.nameAr || plan.nameEn : plan.nameEn}</h3>
                  <p>{locale === "ar" ? plan.notesAr || plan.notesEn : plan.notesEn}</p>
                  <p className="cat-plan-meta">
                    {plan.downPaymentPercent != null ? `${plan.downPaymentPercent}% ` : ""}
                    {plan.installmentMonths ? `${plan.installmentMonths}m` : ""}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="psec psec--off" id="units">
            <div className="pwrap">
              <div className="phead">
                <div>
                  <p className="pkicker">{t.filterUnits}</p>
                  <h2 className="ptitle">{t.units}</h2>
                </div>
              </div>
              <CatalogFilterForm
                lang={locale}
                action={`/${locale}${path}`}
                mode="units"
                locations={[]}
                developers={[]}
                categories={project.categories}
                unitQuery={query}
              />
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
            defaultProject={name}
            context={{
              projectId: project.id,
              locationId: project.locationId ?? undefined,
              sourcePath: `/${locale}${path}`,
            }}
          />
        </main>
      </SiteFrame>
    </>
  );
}
