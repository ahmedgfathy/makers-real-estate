import type { Content, Lang, Section, TileId } from "@/data/content";
import { getSite } from "@/lib/content-db";
import { listProperties } from "@/lib/admin";
import { canPublish, getSession } from "@/lib/auth";
import { area, egp, titleCase } from "@/lib/format";
import { REGIONS, STATUSES, listProjects } from "@/lib/projects";
import { StatusBadge } from "@/components/dashboard/Badges";
import PublishToggle from "@/components/dashboard/PublishToggle";

export const dynamic = "force-dynamic";

/** The primary record is the SODIC East development (The Lakes is its launch). */
const PRIMARY_PROJECTS = ["sodic east", "the lakes"];

function listItems(c: Content, tile: TileId, index: number) {
  const lists = c.panels[tile].sections.filter(
    (section): section is Extract<Section, { kind: "list" }> => section.kind === "list"
  );
  return lists[index]?.items ?? [];
}

export default async function PrimaryPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const params = await searchParams;
  const lang: Lang = params.lang === "ar" ? "ar" : "en";

  const { content, contact } = await getSite();
  const c = content[lang];
  const mayPublish = canPublish(await getSession());

  const [projects, inventory] = await Promise.all([
    listProjects(),
    listProperties({ limit: 300 }),
  ]);

  // Primary units: the units that belong to this project, straight from the
  // inventory, so the publish switch here and on /dashboard/inventory agree.
  const units = inventory.filter((unit) =>
    PRIMARY_PROJECTS.includes(unit.project.trim().toLowerCase())
  );

  const overview = listItems(c, "sodic-east", 0);
  const community = listItems(c, "sodic-east", 1);
  const sports = listItems(c, "amenities", 0);
  const lakes = listItems(c, "lakes", 0);

  const priceSection = c.panels.lakes.sections.find((section) => section.kind === "prices");
  const paymentStats = c.panels.payment.sections.find((section) => section.kind === "stats");
  const paymentPrices = c.panels.payment.sections.find((section) => section.kind === "prices");

  const labels =
    lang === "ar"
      ? {
          kicker: "الأساسي",
          title: "الأساسي",
          lede: "سجل المشروع الأساسي (سوديك إيست · ذا ليكس): ملف الحقائق، الوحدات الأساسية، خطط السداد، وكل مشروعات سوديك التابعة له.",
          units: "الوحدات الأساسية",
          unitsHint: "سوديك إيست · ذا ليكس",
          noUnits: "لا توجد وحدات مسجلة لهذا المشروع بعد.",
          inventory: "المخزون",
          unitCode: "الوحدة",
          type: "النوع",
          area: "المساحة",
          price: "السعر",
          status: "الحالة",
          website: "الموقع",
          factSheet: "ملف الحقائق",
          overview: "نظرة عامة على المشروع",
          community: "المجتمع والخدمات",
          sports: "النادي الرياضي",
          lakes: "البحيرات · إطلاق جديد",
          starting: "الأسعار الابتدائية",
          payment: "خطة السداد",
          advisor: "مستشار المبيعات",
          tiles: "بيانات المجموعة",
          projects: "مشروعات سوديك",
          allProjects: "كل المشروعات",
          source: "المصدر: PostgreSQL · بذور من data/content.ts",
        }
      : {
          kicker: "Primary",
          title: "Primary",
          lede: "The primary project record — SODIC East · The Lakes: its fact sheet, its units, the payment story and the SODIC catalogue that hangs off it.",
          units: "Primary units",
          unitsHint: "SODIC East · The Lakes",
          noUnits: "No units recorded for this project yet.",
          inventory: "Inventory",
          unitCode: "Unit",
          type: "Type",
          area: "Area",
          price: "Price",
          status: "Status",
          website: "Website",
          factSheet: "Fact sheet",
          overview: "Project overview",
          community: "Community & amenities",
          sports: "SODIC Sports Club",
          lakes: "The Lakes · New launch",
          starting: "Starting prices",
          payment: "Payment plan",
          advisor: "Sales advisor",
          tiles: "Collection data",
          projects: "SODIC projects",
          allProjects: "All projects",
          source: "Source: PostgreSQL · seeded from data/content.ts",
        };

  return (
    <div className="dash-page">
      <header className="dash-head">
        <div>
          <span className="dash-kicker">{labels.kicker}</span>
          <h1>{labels.title}</h1>
          <p>{labels.lede}</p>
        </div>
        <div className="dash-actions">
          <a
            className={`dash-btn${lang === "en" ? " dash-btn--gold" : ""}`}
            href="/dashboard/primary"
          >
            EN
          </a>
          <a
            className={`dash-btn${lang === "ar" ? " dash-btn--gold" : ""}`}
            href="/dashboard/primary?lang=ar"
          >
            ع
          </a>
        </div>
      </header>

      <section className="fact-hero">
        <img src={c.panels.lakes.image} alt="" />
        <div>
          <span className="dash-kicker">{c.hero.eyebrow}</span>
          <h2>
            {c.hero.titleLine1} {c.hero.titleLine2}
          </h2>
          <p>{c.hero.lede}</p>
        </div>
      </section>

      <div className="fact-cols">
        <section className="dash-card">
          <div className="dash-card-head">
            <h2 className="dash-card-title">{labels.overview}</h2>
          </div>
          <div className="dash-card-body">
            <ul className="fact-list">
              {overview.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="dash-card">
          <div className="dash-card-head">
            <h2 className="dash-card-title">{labels.community}</h2>
          </div>
          <div className="dash-card-body">
            <ul className="fact-list">
              {community.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="dash-card">
          <div className="dash-card-head">
            <h2 className="dash-card-title">{labels.sports}</h2>
          </div>
          <div className="dash-card-body">
            <ul className="fact-list">
              {sports.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <section className="dash-card" style={{ marginTop: "0.9rem" }}>
        <div className="dash-card-head">
          <h2 className="dash-card-title">
            {labels.units} · {units.length}
          </h2>
          <a className="dash-link" href="/dashboard/inventory">
            {labels.inventory} →
          </a>
        </div>
        <div className="dash-card-body dash-card-body--flush">
          {units.length ? (
            <div className="dash-table-wrap">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>{labels.unitCode}</th>
                    <th>{labels.type}</th>
                    <th>{labels.area}</th>
                    <th>{labels.price}</th>
                    <th>{labels.status}</th>
                    <th>{labels.website}</th>
                  </tr>
                </thead>
                <tbody>
                  {units.map((unit) => (
                    <tr key={unit.id}>
                      <td>
                        <a className="cell-strong" href={`/dashboard/inventory/${unit.id}`}>
                          {unit.code}
                        </a>
                        <span className="cell-sub">
                          {unit.title}
                          {unit.phase ? ` · ${unit.phase}` : ""}
                        </span>
                      </td>
                      <td>{titleCase(unit.property_type)}</td>
                      <td className="cell-num">{area(unit.built_up_area)}</td>
                      <td className="cell-num">{egp(unit.price, true)}</td>
                      <td>
                        <StatusBadge status={unit.status} />
                      </td>
                      <td>
                        <PublishToggle
                          kind="property"
                          id={unit.id}
                          published={unit.published}
                          canPublish={mayPublish}
                          compact
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="dash-empty">
              <p className="detail-note">{labels.noUnits}</p>
            </div>
          )}
        </div>
      </section>

      <div className="dash-grid" style={{ marginTop: "0.9rem" }}>
        <section className="dash-card">
          <div className="dash-card-head">
            <h2 className="dash-card-title">{labels.lakes}</h2>
            <a className="dash-link" href={`/dashboard/primary/lakes?lang=${lang}`}>
              Open panel →
            </a>
          </div>
          <div className="dash-card-body">
            <p className="detail-note">{c.panels.lakes.lede}</p>
            <ul className="fact-list" style={{ marginTop: "0.9rem" }}>
              {lakes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <div className="detail-side">
          <section className="dash-card">
            <div className="dash-card-head">
              <h2 className="dash-card-title">{labels.starting}</h2>
            </div>
            <div className="dash-card-body">
              {priceSection?.kind === "prices" ? (
                <div className="fact-price-list">
                  {priceSection.rows.map((row) => (
                    <div className="fact-price-row" key={row.label}>
                      <span>{row.label}</span>
                      <strong>{egp(Number(row.price.replace(/[^0-9.]/g, "")), true)}</strong>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </section>

          <section className="dash-card">
            <div className="dash-card-head">
              <h2 className="dash-card-title">{labels.payment}</h2>
            </div>
            <div className="dash-card-body">
              {paymentStats?.kind === "stats" ? (
                <div className="dash-meta-row">
                  {paymentStats.items.map((item) => (
                    <span key={item.label}>
                      <strong>{item.value}</strong> {item.label}
                    </span>
                  ))}
                </div>
              ) : null}
              {paymentPrices?.kind === "prices" ? (
                <p className="detail-note" style={{ marginTop: "0.8rem" }}>
                  {paymentPrices.rows[0]?.label}: {egp(Number(paymentPrices.rows[0]?.price.replace(/[^0-9.]/g, "")), true)} ·{" "}
                  {paymentPrices.rows[0]?.monthly} EGP / month
                </p>
              ) : null}
            </div>
          </section>

          <section className="dash-card">
            <div className="dash-card-head">
              <h2 className="dash-card-title">{labels.advisor}</h2>
            </div>
            <div className="dash-card-body">
              <p className="detail-note">
                {contact.name[lang]}
                <br />
                {c.footer.role}
                <br />
                <a className="phone" href={contact.phoneHref}>
                  {contact.phoneLabel}
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>

      <section className="dash-card" style={{ marginTop: "0.9rem" }}>
        <div className="dash-card-head">
          <h2 className="dash-card-title">{labels.tiles}</h2>
          <span className="dash-meta-row">{c.tiles.length} panels</span>
        </div>
        <div className="dash-card-body">
          <div className="primary-tiles">
            {c.tiles.map((tile) => (
              <a
                className="primary-tile"
                key={tile.id}
                href={`/dashboard/primary/${tile.id}?lang=${lang}`}
              >
                <img src={tile.image} alt="" loading="lazy" />
                <span className="primary-tile-index">{tile.index}</span>
                <span className="primary-tile-title">{tile.title}</span>
                <span className="primary-tile-meta">{tile.meta}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="dash-card" style={{ marginTop: "0.9rem" }}>
        <div className="dash-card-head">
          <h2 className="dash-card-title">
            {labels.projects} · {projects.length}
          </h2>
          <a className="dash-link" href={`/dashboard/projects?lang=${lang}`}>
            {labels.allProjects} →
          </a>
        </div>
        <div className="dash-card-body">
          <div className="project-index">
            {projects.map((project) => (
              <div className="project-index-row" key={project.slug}>
                <a
                  className="project-index-main"
                  href={`/dashboard/projects/${project.slug}?lang=${lang}`}
                >
                  <strong>{lang === "ar" ? project.nameAr : project.name}</strong>
                  <em>
                    {REGIONS[project.region][lang]} · {STATUSES[project.status][lang]}
                  </em>
                  <span>{project.priceFrom ? egp(project.priceFrom, true) : "—"}</span>
                </a>
                <PublishToggle
                  kind="project"
                  id={project.slug}
                  published={project.published}
                  canPublish={mayPublish}
                  compact
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <p className="dash-note" style={{ marginTop: "0.9rem" }}>
        {labels.source}. Edit <code>data/content.ts</code>, then run <code>npm run db:seed</code> to
        publish the change to PostgreSQL and the public site.
      </p>
    </div>
  );
}
