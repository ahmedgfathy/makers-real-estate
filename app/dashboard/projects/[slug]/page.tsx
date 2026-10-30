import { notFound } from "next/navigation";
import { area, egp } from "@/lib/format";
import { CATEGORIES, REGIONS, STATUSES, getProject } from "@/lib/projects";

export const dynamic = "force-dynamic";

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const lang = query.lang === "ar" ? "ar" : "en";

  const project = await getProject(slug);
  if (!project) notFound();

  const t =
    lang === "ar"
      ? {
          back: "→ العودة إلى المشروعات",
          priceFrom: "السعر يبدأ من",
          payment: "خطة السداد",
          finishing: "التشطيب",
          status: "الحالة",
          units: "أنواع الوحدات",
          amenities: "الخدمات والمرافق",
          location: "الموقع والمسافات",
          sources: "ملفات المصدر",
          brochure: "البروشور",
          masterplan: "المخطط العام",
          inventory: "وحدات المخزون",
          note: "هذه البيانات مسجلة في جدول projects. عدّل data/projects.ts ثم نفّذ npm run db:seed.",
          onRequest: "عند الطلب",
          unit: "الوحدة",
          beds: "غرف",
          area: "المساحة",
          price: "السعر من",
          details: "تفاصيل",
          noUnits: "لم تُنشر أنواع الوحدات بعد.",
        }
      : {
          back: "← Back to projects",
          priceFrom: "Starting price",
          payment: "Payment plan",
          finishing: "Finishing",
          status: "Status",
          units: "Unit types",
          amenities: "Amenities",
          location: "Location & distances",
          sources: "Source documents",
          brochure: "Brochure",
          masterplan: "Masterplan",
          inventory: "Inventory units",
          note: "Served from the projects table. Edit data/projects.ts, then run npm run db:seed.",
          onRequest: "On request",
          unit: "Unit",
          beds: "Beds",
          area: "Area",
          price: "From",
          details: "Details",
          noUnits: "No unit types published yet.",
        };

  const name = lang === "ar" ? project.nameAr : project.name;
  const tagline = lang === "ar" ? project.taglineAr : project.tagline;
  const description = lang === "ar" ? project.descriptionAr : project.description;
  const paymentPlan = lang === "ar" ? project.paymentPlanAr : project.paymentPlan;

  return (
    <div className="dash-page">
      <a className="dash-back" href={`/dashboard/projects?lang=${lang}`}>
        {t.back}
      </a>

      <header className="dash-head">
        <div>
          <span className="dash-kicker">
            {REGIONS[project.region][lang]} · {CATEGORIES[project.category][lang]}
          </span>
          <h1>{name}</h1>
          <p>{tagline}</p>
        </div>
        <div className="dash-actions">
          <a
            className={`dash-btn${lang === "en" ? " dash-btn--gold" : ""}`}
            href={`/dashboard/projects/${project.slug}?lang=en`}
          >
            EN
          </a>
          <a
            className={`dash-btn${lang === "ar" ? " dash-btn--gold" : ""}`}
            href={`/dashboard/projects/${project.slug}?lang=ar`}
          >
            ع
          </a>
          <a
            className="dash-btn"
            href={`/dashboard/inventory?q=${encodeURIComponent(project.name)}`}
          >
            {t.inventory} ↗
          </a>
        </div>
      </header>

      <section className={`fact-hero${project.heroImage ? "" : " fact-hero--empty"}`}>
        {project.heroImage ? <img src={project.heroImage} alt="" /> : null}
        <div>
          <span className="dash-kicker">
            {project.location} · {STATUSES[project.status][lang]}
          </span>
          <h2>{name}</h2>
          <p>{description}</p>
        </div>
      </section>

      <div className="project-facts">
        <div className="project-fact">
          <span>{t.priceFrom}</span>
          <strong>{project.priceFrom ? egp(project.priceFrom, true) : t.onRequest}</strong>
        </div>
        <div className="project-fact">
          <span>{t.payment}</span>
          <strong>{paymentPlan ?? "—"}</strong>
        </div>
        <div className="project-fact">
          <span>{t.finishing}</span>
          <strong>{project.finishing ?? "—"}</strong>
        </div>
        <div className="project-fact">
          <span>{t.status}</span>
          <strong>{STATUSES[project.status][lang]}</strong>
        </div>
      </div>

      <section className="dash-card" style={{ marginTop: "0.9rem" }}>
        <div className="dash-card-head">
          <h2 className="dash-card-title">
            {t.units} · {project.unitTypes.length}
          </h2>
          <span className="dash-meta-row">{project.location}</span>
        </div>
        <div className="dash-card-body dash-card-body--flush">
          {project.unitTypes.length ? (
            <div className="dash-table-wrap">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>{t.unit}</th>
                    <th>{t.beds}</th>
                    <th>{t.area}</th>
                    <th>{t.price}</th>
                    <th>{t.details}</th>
                  </tr>
                </thead>
                <tbody>
                  {project.unitTypes.map((unit, index) => (
                    <tr key={`${project.slug}-${index}`}>
                      <td className="cell-strong">
                        {lang === "ar" ? unit.nameAr ?? unit.name : unit.name}
                      </td>
                      <td className="cell-num">{unit.bedrooms ?? "—"}</td>
                      <td className="cell-num">
                        {unit.areaFrom == null
                          ? "—"
                          : unit.areaTo && unit.areaTo !== unit.areaFrom
                            ? `${area(unit.areaFrom)} – ${area(unit.areaTo)}`
                            : area(unit.areaFrom)}
                      </td>
                      <td className="cell-num">
                        {unit.priceFrom ? egp(unit.priceFrom, true) : "—"}
                      </td>
                      <td className="cell-sub">
                        {[unit.finishing, unit.note].filter(Boolean).join(" · ") || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="dash-empty">
              <p className="detail-note">{t.noUnits}</p>
            </div>
          )}
        </div>
      </section>

      <div className="fact-cols">
        <section className="dash-card">
          <div className="dash-card-head">
            <h2 className="dash-card-title">{t.amenities}</h2>
          </div>
          <div className="dash-card-body">
            <ul className="fact-list">
              {project.amenities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="dash-card">
          <div className="dash-card-head">
            <h2 className="dash-card-title">{t.location}</h2>
          </div>
          <div className="dash-card-body">
            <ul className="fact-list">
              {project.locationNotes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="dash-card">
          <div className="dash-card-head">
            <h2 className="dash-card-title">{t.sources}</h2>
          </div>
          <div className="dash-card-body">
            <ul className="fact-list">
              {project.brochure ? (
                <li>
                  {t.brochure}: <code>{project.brochure}</code>
                </li>
              ) : null}
              {project.masterplan ? (
                <li>
                  {t.masterplan}: <code>{project.masterplan}</code>
                </li>
              ) : null}
            </ul>
          </div>
        </section>
      </div>

      <p className="dash-note" style={{ marginTop: "0.9rem" }}>
        {t.note}
      </p>
    </div>
  );
}
