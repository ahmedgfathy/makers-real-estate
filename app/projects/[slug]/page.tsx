import type { Metadata } from "next";
import type { Lang } from "@/data/content";
import { whatsappLink } from "@/data/content";
import { getSite } from "@/lib/content-db";
import { area, egp } from "@/lib/format";
import { CATEGORIES, REGIONS, STATUSES, getPublishedProject } from "@/lib/projects";
import Arrow from "@/components/public/Arrow";
import LangSync from "@/components/public/LangSync";
import PublicFooter from "@/components/public/PublicFooter";
import PublicHeader from "@/components/public/PublicHeader";

export const dynamic = "force-dynamic";

/**
 * Public brief for a single project.
 *
 * Only projects switched on with the CRM publish checkbox are reachable: the
 * lookup goes through getPublishedProject(), so an unpublished slug is a 404
 * even when someone knows the URL.
 */

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProject(slug);
  if (!project) return { title: "Project not found — Makers Real Estate" };

  return {
    title: `${project.name} — Makers Real Estate`,
    description: project.tagline || project.description.slice(0, 160),
    openGraph: project.heroImage ? { images: [project.heroImage] } : undefined,
  };
}

export default async function PublicProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const lang: Lang = query.lang === "ar" ? "ar" : "en";

  const [{ content, contact }, project] = await Promise.all([
    getSite(),
    getPublishedProject(slug),
  ]);

  const c = content[lang];
  const whatsapp = whatsappLink(contact, lang);

  if (!project) {
    return (
      <>
        <div className="grain" aria-hidden="true" />
        <LangSync lang={lang} />
        <PublicHeader
          c={c}
          lang={lang}
          basePath={`/projects/${slug}`}
          whatsapp={whatsapp}
          phoneHref={contact.phoneHref}
          active="projects"
        />
        <main className="public-main">
          <section className="collection">
            <div className="collection-inner">
              <a className="public-back" href={`/projects?lang=${lang}`}>
                {lang === "ar" ? "→ العودة إلى المشروعات" : "← Back to projects"}
              </a>
              <p className="public-empty">
                {lang === "ar"
                  ? "هذا المشروع غير منشور على الموقع حاليًا."
                  : "This project is not published on the website yet."}
              </p>
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

  const name = lang === "ar" ? project.nameAr : project.name;
  const tagline = lang === "ar" ? project.taglineAr : project.tagline;
  const description = lang === "ar" ? project.descriptionAr : project.description;
  const paymentPlan = lang === "ar" ? project.paymentPlanAr : project.paymentPlan;

  const t =
    lang === "ar"
      ? {
          back: "→ العودة إلى المشروعات",
          book: "احجز معاينة",
          call: "اتصل بنا",
          priceFrom: "السعر يبدأ من",
          payment: "خطة السداد",
          finishing: "التشطيب",
          category: "الفئة",
          about: "عن المشروع",
          units: "أنواع الوحدات",
          unit: "الوحدة",
          beds: "غرف",
          area: "المساحة",
          price: "السعر من",
          details: "تفاصيل",
          amenities: "الخدمات والمرافق",
          location: "الموقع والمسافات",
          noUnits: "لم تُنشر أنواع الوحدات بعد.",
          onRequest: "السعر عند الطلب",
          note: "الأسعار والمخططات استرشادية وتُعتمد في عقد الحجز.",
        }
      : {
          back: "← Back to projects",
          book: "Book a viewing",
          call: "Call the advisor",
          priceFrom: "Starting price",
          payment: "Payment plan",
          finishing: "Finishing",
          category: "Category",
          about: "About the development",
          units: "Unit types",
          unit: "Unit",
          beds: "Beds",
          area: "Area",
          price: "From",
          details: "Details",
          amenities: "Amenities",
          location: "Location & distances",
          noUnits: "No unit types published yet.",
          onRequest: "Price on request",
          note: "Prices and plans are indicative and confirmed in the reservation contract.",
        };

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <LangSync lang={lang} />
      <PublicHeader
        c={c}
        lang={lang}
        basePath={`/projects/${project.slug}`}
        whatsapp={whatsapp}
        phoneHref={contact.phoneHref}
        active="projects"
      />

      <main className="public-main">
        <section className="collection">
          <div className="collection-inner">
            <a className="public-back" href={`/projects?lang=${lang}`}>
              {t.back}
            </a>

            <div className="public-hero">
              <div className={`public-hero-media${project.heroImage ? "" : " public-hero-media--empty"}`}>
                {project.heroImage ? (
                  <img src={project.heroImage} alt={name} loading="eager" decoding="async" />
                ) : (
                  <span className="tile-monogram" aria-hidden="true">
                    {initials(project.name)}
                  </span>
                )}
              </div>

              <div className="public-hero-body">
                <span className="eyebrow">
                  {REGIONS[project.region][lang]} · {CATEGORIES[project.category][lang]}
                </span>
                <h1 className="public-title">{name}</h1>
                <p className="public-tagline">{tagline}</p>
                <p className="public-hero-meta">
                  {project.location} · {STATUSES[project.status][lang]}
                </p>

                <div className="public-cta">
                  <a
                    className="btn btn--solid btn--sm"
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cta="whatsapp"
                    data-cta-surface="project"
                  >
                    <span>{t.book}</span>
                  </a>
                  <a
                    className="btn btn--ghost btn--sm phone"
                    href={contact.phoneHref}
                    data-cta="phone"
                    data-cta-surface="project"
                  >
                    <span>{t.call}</span>
                    <Arrow />
                  </a>
                </div>
              </div>
            </div>

            <div className="stats public-facts">
              <div className="stat">
                <div className="stat-value">
                  {project.priceFrom ? egp(project.priceFrom, true) : t.onRequest}
                </div>
                <div className="stat-label">{t.priceFrom}</div>
              </div>
              <div className="stat">
                <div className="stat-value">{paymentPlan ?? "—"}</div>
                <div className="stat-label">{t.payment}</div>
              </div>
              <div className="stat">
                <div className="stat-value">{project.finishing ?? "—"}</div>
                <div className="stat-label">{t.finishing}</div>
              </div>
              <div className="stat">
                <div className="stat-value">{CATEGORIES[project.category][lang]}</div>
                <div className="stat-label">{t.category}</div>
              </div>
            </div>

            <div className="sec">
              <div className="sec-head">
                <span className="sec-title">{t.about}</span>
                <span className="sec-rule" />
              </div>
              <p className="panel-lede">{description}</p>
            </div>

            <div className="sec">
              <div className="sec-head">
                <span className="sec-title">
                  {t.units} · {project.unitTypes.length}
                </span>
                <span className="sec-rule" />
              </div>

              {project.unitTypes.length ? (
                <div className="tbl-wrap">
                  <table className="tbl">
                    <thead>
                      <tr>
                        <th>{t.unit}</th>
                        <th>{t.beds}</th>
                        <th className="num">{t.area}</th>
                        <th className="num">{t.price}</th>
                        <th>{t.details}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {project.unitTypes.map((unit, index) => (
                        <tr key={`${project.slug}-${index}`}>
                          <td className="c-code">
                            {lang === "ar" ? unit.nameAr ?? unit.name : unit.name}
                          </td>
                          <td>{unit.bedrooms ?? "—"}</td>
                          <td className="c-num num">
                            {unit.areaFrom == null
                              ? "—"
                              : unit.areaTo && unit.areaTo !== unit.areaFrom
                                ? `${area(unit.areaFrom)} – ${area(unit.areaTo)}`
                                : area(unit.areaFrom)}
                          </td>
                          <td className="c-price num">
                            {unit.priceFrom ? egp(unit.priceFrom, true) : "—"}
                          </td>
                          <td>
                            {[unit.finishing, unit.note].filter(Boolean).join(" · ") || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="detail-note">{t.noUnits}</p>
              )}
            </div>

            <div className="sec">
              <div className="sec-head">
                <span className="sec-title">{t.amenities}</span>
                <span className="sec-rule" />
              </div>
              <ul className="list-grid cols-2">
                {project.amenities.map((item) => (
                  <li className="li" key={item}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="sec">
              <div className="sec-head">
                <span className="sec-title">{t.location}</span>
                <span className="sec-rule" />
              </div>
              <ul className="list-grid cols-2">
                {project.locationNotes.map((item) => (
                  <li className="li" key={item}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <p className="note">{t.note}</p>
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
