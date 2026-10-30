import { egp } from "@/lib/format";
import {
  CATEGORIES,
  REGIONS,
  STATUSES,
  getProjectStats,
  listProjects,
  type ProjectCategory,
  type ProjectRegion,
  type ProjectStatus,
} from "@/lib/projects";

export const dynamic = "force-dynamic";

type Search = { lang?: string; q?: string; region?: string; category?: string; status?: string };

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<Search> }) {
  const filters = await searchParams;
  const lang = filters.lang === "ar" ? "ar" : "en";

  const [stats, projects] = await Promise.all([
    getProjectStats(),
    listProjects({
      q: filters.q,
      region: filters.region,
      category: filters.category,
      status: filters.status,
    }),
  ]);

  const t =
    lang === "ar"
      ? {
          kicker: "المشروعات",
          title: "دليل مشروعات سوديك",
          lede: "كل مشروعات سوديك في مكان واحد: الموقع، أنواع الوحدات، الأسعار الابتدائية، خطط السداد والخدمات — مصدرها ملفات المبيعات الرسمية.",
          projects: "مشروعات",
          regions: "مناطق",
          active: "متاح للإطلاق والبيع",
          unitTypes: "أنواع وحدات",
          from: "تبدأ من",
          onRequest: "السعر عند الطلب",
          types: "أنواع",
          search: "بحث",
          searchPlaceholder: "اسم المشروع أو المنطقة أو نوع الوحدة",
          region: "المنطقة",
          allRegions: "كل المناطق",
          category: "الفئة",
          allCategories: "كل الفئات",
          status: "الحالة",
          allStatuses: "كل الحالات",
          filter: "تصفية",
          reset: "إعادة ضبط",
          empty: "لا يوجد مشروع مطابق لهذه التصفية.",
          note: "تُقرأ البيانات من جدول projects في PostgreSQL. عدّل data/projects.ts ثم نفّذ npm run db:seed للتحديث.",
          open: "عرض المشروع",
        }
      : {
          kicker: "Projects",
          title: "SODIC project catalogue",
          lede: "Every SODIC development in one place — location, unit mix, starting prices, payment plans and amenities, compiled from the official sales material.",
          projects: "Projects",
          regions: "Regions",
          active: "Launching & selling",
          unitTypes: "Unit types",
          from: "From",
          onRequest: "Price on request",
          types: "types",
          search: "Search",
          searchPlaceholder: "Project, location or unit type",
          region: "Region",
          allRegions: "All regions",
          category: "Category",
          allCategories: "All categories",
          status: "Status",
          allStatuses: "All statuses",
          filter: "Filter",
          reset: "Reset",
          empty: "No project matches this filter.",
          note: "Read from the projects table in PostgreSQL. Edit data/projects.ts, then run npm run db:seed to publish.",
          open: "Open project",
        };

  const regionEntries = Object.entries(REGIONS) as [ProjectRegion, { en: string; ar: string }][];
  const categoryEntries = Object.entries(CATEGORIES) as [ProjectCategory, { en: string; ar: string }][];
  const statusEntries = Object.entries(STATUSES) as [ProjectStatus, { en: string; ar: string }][];

  return (
    <div className="dash-page">
      <header className="dash-head">
        <div>
          <span className="dash-kicker">{t.kicker}</span>
          <h1>{t.title}</h1>
          <p>{t.lede}</p>
        </div>
        <div className="dash-actions">
          <a
            className={`dash-btn${lang === "en" ? " dash-btn--gold" : ""}`}
            href={`/dashboard/projects?lang=en${filters.q ? `&q=${encodeURIComponent(filters.q)}` : ""}`}
          >
            EN
          </a>
          <a
            className={`dash-btn${lang === "ar" ? " dash-btn--gold" : ""}`}
            href={`/dashboard/projects?lang=ar${filters.q ? `&q=${encodeURIComponent(filters.q)}` : ""}`}
          >
            ع
          </a>
        </div>
      </header>

      <section className="dash-stats" aria-label={t.title}>
        <div className="dash-stat">
          <div className="dash-stat-label">{t.projects}</div>
          <div className="dash-stat-value">{stats.total}</div>
          <div className="dash-stat-hint">SODIC</div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-label">{t.regions}</div>
          <div className="dash-stat-value">{stats.regions}</div>
          <div className="dash-stat-hint">{regionEntries.map(([, r]) => r[lang]).join(" · ")}</div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-label">{t.active}</div>
          <div className="dash-stat-value">{stats.selling}</div>
          <div className="dash-stat-hint">{t.projects}</div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-label">{t.unitTypes}</div>
          <div className="dash-stat-value">{stats.unitTypes}</div>
          <div className="dash-stat-hint">
            {t.from} <strong>{stats.priceFrom ? egp(stats.priceFrom, true) : "—"}</strong>
          </div>
        </div>
      </section>

      <section className="dash-card" style={{ marginTop: "0.9rem" }}>
        <form className="dash-filterbar" method="get" action="/dashboard/projects">
          <input type="hidden" name="lang" value={lang} />
          <label className="dash-field dash-field--grow">
            <span>{t.search}</span>
            <input
              className="dash-input"
              type="search"
              name="q"
              placeholder={t.searchPlaceholder}
              defaultValue={filters.q ?? ""}
            />
          </label>

          <label className="dash-field">
            <span>{t.region}</span>
            <select className="dash-select" name="region" defaultValue={filters.region ?? ""}>
              <option value="">{t.allRegions}</option>
              {regionEntries.map(([value, label]) => (
                <option key={value} value={value}>
                  {label[lang]}
                </option>
              ))}
            </select>
          </label>

          <label className="dash-field">
            <span>{t.category}</span>
            <select className="dash-select" name="category" defaultValue={filters.category ?? ""}>
              <option value="">{t.allCategories}</option>
              {categoryEntries.map(([value, label]) => (
                <option key={value} value={value}>
                  {label[lang]}
                </option>
              ))}
            </select>
          </label>

          <label className="dash-field">
            <span>{t.status}</span>
            <select className="dash-select" name="status" defaultValue={filters.status ?? ""}>
              <option value="">{t.allStatuses}</option>
              {statusEntries.map(([value, label]) => (
                <option key={value} value={value}>
                  {label[lang]}
                </option>
              ))}
            </select>
          </label>

          <button type="submit" className="dash-btn">
            {t.filter}
          </button>
          <a className="dash-btn dash-btn--quiet" href={`/dashboard/projects?lang=${lang}`}>
            {t.reset}
          </a>
        </form>

        <div className="dash-card-body">
          {projects.length ? (
            <div className="projects-grid">
              {projects.map((project) => {
                const name = lang === "ar" ? project.nameAr : project.name;
                const tagline = lang === "ar" ? project.taglineAr : project.tagline;
                return (
                  <a
                    className="project-card"
                    key={project.slug}
                    href={`/dashboard/projects/${project.slug}?lang=${lang}`}
                  >
                    <div className={`project-media${project.heroImage ? "" : " project-media--empty"}`}>
                      {project.heroImage ? (
                        <img src={project.heroImage} alt="" loading="lazy" />
                      ) : (
                        <span className="project-initials" aria-hidden="true">
                          {initials(project.name)}
                        </span>
                      )}
                      <span className="dash-badge project-badge" data-tone={project.status}>
                        {STATUSES[project.status][lang]}
                      </span>
                    </div>
                    <div className="project-body">
                      <span className="project-loc">
                        {REGIONS[project.region][lang]} · {CATEGORIES[project.category][lang]}
                      </span>
                      <span className="project-name">{name}</span>
                      <span className="project-tag">{tagline}</span>
                      <span className="project-foot">
                        <span className="project-price">
                          {project.priceFrom ? `${t.from} ${egp(project.priceFrom, true)}` : t.onRequest}
                        </span>
                        <span className="project-units">
                          {project.unitTypes.length} {t.types}
                        </span>
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          ) : (
            <div className="dash-empty">
              <p className="detail-note">{t.empty}</p>
            </div>
          )}
        </div>
      </section>

      <p className="dash-note" style={{ marginTop: "0.9rem" }}>
        {t.note}
      </p>
    </div>
  );
}
