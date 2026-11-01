import { notFound } from "next/navigation";
import { canPublish, getSession } from "@/lib/auth";
import PublishToggle from "@/components/dashboard/PublishToggle";
import { area, egp } from "@/lib/format";
import { CATEGORIES, REGIONS, STATUSES, getProject } from "@/lib/projects";
import { listDevelopers } from "@/lib/developers";
import { listProperties } from "@/lib/admin";
import PropertyCard from "@/components/dashboard/PropertyCard";
import ProjectForm from "@/components/dashboard/ProjectForm";
import { updateProjectAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string; error?: string; ok?: string }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const lang = query.lang === "ar" ? "ar" : "en";

  const [project, developers, inventory] = await Promise.all([
    getProject(slug),
    listDevelopers(),
    listProperties({ projectSlug: slug, limit: 500 }),
  ]);
  if (!project) notFound();
  const mayPublish = canPublish(await getSession());

  const t =
    lang === "ar"
      ? {
          back: "→ العودة إلى المشروعات",
          liveBadge: "منشور على الموقع",
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
          liveBadge: "Live on website",
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
          {project.published ? (
            <span className="dash-badge" data-tone="delivering" style={{ marginInlineStart: "0.5rem" }}>
              {t.liveBadge}
            </span>
          ) : null}
          <h1>{name}</h1>
          <p>{tagline}</p>
        </div>
        <div className="dash-actions">
          <a className="dash-btn" href={`/dashboard/projects/new?developer=${encodeURIComponent(project.developerSlug)}`}>+ Add project</a>
          <PublishToggle
            kind="project"
            id={project.slug}
            published={project.published}
            canPublish={mayPublish}
          />
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

      {query.error ? <p className="dash-banner dash-banner--error" role="alert">{query.error}</p> : null}
      {query.ok ? <p className="dash-banner dash-banner--ok" role="status">{query.ok}</p> : null}

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

      <section className="dash-card" style={{ marginTop: "1rem" }}>
        <div className="dash-card-head"><h2 className="dash-card-title">Edit project</h2><span className="dash-meta-row">/{project.slug}</span></div>
        <div className="dash-card-body">
          <ProjectForm developers={developers} project={project} action={updateProjectAction} submitLabel="Save project" />
        </div>
      </section>

      <section className="dash-card" style={{ marginTop: "1rem" }}>
        <div className="dash-card-head">
          <h2 className="dash-card-title">Primary units · {inventory.length}</h2>
          <a className="dash-btn dash-btn--gold" href={`/dashboard/inventory/new?project=${encodeURIComponent(project.slug)}`}>+ Add unit to this project</a>
        </div>
        <div className="dash-card-body">
          {inventory.length ? <div className="inv-grid">{inventory.map((unit) => <PropertyCard key={unit.id} property={unit} canPublish={mayPublish} />)}</div> : <div className="dash-empty"><p>No units belong to this project yet.</p><a className="dash-link" href={`/dashboard/inventory/new?project=${encodeURIComponent(project.slug)}`}>Add the first unit →</a></div>}
        </div>
      </section>

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
