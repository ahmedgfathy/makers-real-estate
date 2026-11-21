import Link from "next/link";
import { area, egp } from "@/lib/format";
import {
  categoryName,
  locationName,
  projectName,
  unitTitle,
  type Developer,
  type Lang,
  type LocationWithCount,
  type Project,
  type PropertyCategory,
  type Unit,
} from "@/lib/catalog";
import { locationPath, projectCategoryPath, projectDetailPath, unitPath } from "@/lib/project-routes";

const COPY = {
  en: {
    projects: "projects",
    project: "project",
    from: "From",
    down: "Down payment",
    installment: "Instalments",
    viewProject: "View project",
    viewArea: "Explore area",
    viewUnit: "View unit",
    bedrooms: "beds",
    available: "Available",
    reserved: "Reserved",
    sold: "Sold",
    archived: "Archived",
  },
  ar: {
    projects: "مشروعات",
    project: "مشروع",
    from: "من",
    down: "المقدم",
    installment: "التقسيط",
    viewProject: "عرض المشروع",
    viewArea: "استكشف المنطقة",
    viewUnit: "عرض الوحدة",
    bedrooms: "غرف",
    available: "متاحة",
    reserved: "محجوزة",
    sold: "مباعة",
    archived: "مؤرشفة",
  },
} as const;

function statusLabel(status: string, lang: Lang): string {
  if (lang === "ar") {
    if (status === "ready") return "جاهز للسكن";
    if (status === "under_construction") return "تحت الإنشاء";
    return "طرح أولي";
  }
  if (status === "ready") return "Ready to move";
  if (status === "under_construction") return "Under construction";
  return "Off-plan";
}

function unitStatusLabel(status: string, lang: Lang): string {
  const statusKeys = ["available", "reserved", "sold", "archived"] as const;
  const match = statusKeys.find((key) => key === status);
  return match ? COPY[lang][match] : status;
}

export function Breadcrumbs({
  lang,
  items,
}: {
  lang: Lang;
  items: { label: string; href?: string }[];
}) {
  return (
    <nav className="cat-breadcrumbs" aria-label={lang === "ar" ? "مسار التنقل" : "Breadcrumb"}>
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`}>
          {index > 0 && <span aria-hidden="true"> / </span>}
          {item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}

export function LocationCards({
  lang,
  locations,
}: {
  lang: Lang;
  locations: LocationWithCount[];
}) {
  const copy = COPY[lang];
  return (
    <div className="cat-card-grid">
      {locations.map((location) => (
        <Link className="cat-card" href={locationPath(lang, location.slug)} key={location.id}>
          <div className="cat-card-media">
            {location.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={location.imageUrl} alt={locationName(location, lang)} loading="lazy" />
            ) : (
              <span aria-hidden="true">◎</span>
            )}
          </div>
          <div className="cat-card-body">
            <p className="cat-card-kicker">
              {location.projectCount} {location.projectCount === 1 ? copy.project : copy.projects}
            </p>
            <h3>{locationName(location, lang)}</h3>
            <p>{lang === "ar" ? location.descriptionAr || location.descriptionEn : location.descriptionEn || location.descriptionAr}</p>
            <div className="cat-card-foot">
              <strong>{location.startingPrice ? `${copy.from} ${egp(location.startingPrice, true)}` : "—"}</strong>
              <span>{copy.viewArea} →</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function ProjectCards({
  lang,
  projects,
}: {
  lang: Lang;
  projects: Project[];
}) {
  const copy = COPY[lang];
  return (
    <div className="cat-card-grid">
      {projects.map((project) => (
        <article className="cat-card cat-project-card" key={project.id}>
          <Link href={projectDetailPath(lang, project.slug)} className="cat-card-media">
            {project.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={project.coverImage} alt={projectName(project, lang)} loading="lazy" />
            ) : (
              <span aria-hidden="true">◈</span>
            )}
          </Link>
          <div className="cat-card-body">
            <p className="cat-card-kicker">{statusLabel(project.status, lang)}</p>
            <h3>
              <Link href={projectDetailPath(lang, project.slug)}>{projectName(project, lang)}</Link>
            </h3>
            <p className="cat-card-meta">
              {project.developer
                ? `${lang === "ar" ? project.developer.nameAr || project.developer.nameEn : project.developer.nameEn} · `
                : ""}
              {project.location ? locationName(project.location, lang) : ""}
            </p>
            <p>{lang === "ar" ? project.descriptionAr : project.descriptionEn}</p>
            <div className="cat-chips">
              {project.categories.map((category) => (
                <Link
                  key={category.id}
                  className="cat-chip"
                  href={projectCategoryPath(lang, project.slug, category.slug)}
                >
                  {categoryName(category, lang)}
                </Link>
              ))}
            </div>
            <div className="cat-card-foot">
              <strong>{project.startingPrice ? `${copy.from} ${egp(project.startingPrice, true)}` : "—"}</strong>
              <span>
                {project.downPaymentPercent != null ? `${copy.down} ${project.downPaymentPercent}%` : ""}
                {project.installmentMonths ? ` · ${project.installmentMonths}m` : ""}
              </span>
            </div>
            <Link className="cat-card-link" href={projectDetailPath(lang, project.slug)}>
              {copy.viewProject} →
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}

export function UnitCards({ lang, units }: { lang: Lang; units: Unit[] }) {
  const copy = COPY[lang];
  return (
    <div className="cat-card-grid cat-unit-grid">
      {units.map((unit) => (
        <article className="cat-card cat-unit-card" key={unit.id}>
          <Link href={unitPath(lang, unit.slug)} className="cat-card-media">
            <span aria-hidden="true">▤</span>
          </Link>
          <div className="cat-card-body">
            <p className="cat-card-kicker">
              {lang === "ar" ? unit.categoryNameAr : unit.categoryNameEn} · {unitStatusLabel(unit.status, lang)}
            </p>
            <h3>
              <Link href={unitPath(lang, unit.slug)}>{unitTitle(unit, lang)}</Link>
            </h3>
            <p className="cat-card-meta">
              <Link href={projectDetailPath(lang, unit.projectSlug)}>
                {lang === "ar" ? unit.projectNameAr : unit.projectNameEn}
              </Link>
            </p>
            <div className="cat-specs">
              {unit.builtUpArea != null && <span>{area(unit.builtUpArea)}</span>}
              {unit.bedrooms != null && <span>{unit.bedrooms} {copy.bedrooms}</span>}
              {unit.bathrooms != null && <span>{unit.bathrooms} {lang === "ar" ? "حمام" : "baths"}</span>}
              {unit.floor && <span>{unit.floor}</span>}
            </div>
            <div className="cat-card-foot">
              <strong>{unit.totalPrice ? egp(unit.totalPrice, true) : "—"}</strong>
              <Link href={unitPath(lang, unit.slug)}>{copy.viewUnit} →</Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export function Pager({
  page,
  total,
  pageSize,
  path,
  query,
  lang,
}: {
  page: number;
  total: number;
  pageSize: number;
  path: string;
  query: Record<string, string | undefined>;
  lang: Lang;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;
  const href = (target: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value) params.set(key, value);
    }
    params.set("page", String(target));
    return `${path}?${params.toString()}`;
  };
  return (
    <nav className="cat-pager" aria-label={lang === "ar" ? "الصفحات" : "Pagination"}>
      {page > 1 && <Link href={href(page - 1)}>← {lang === "ar" ? "السابق" : "Previous"}</Link>}
      <span>{page} / {pages}</span>
      {page < pages && <Link href={href(page + 1)}>{lang === "ar" ? "التالي" : "Next"} →</Link>}
    </nav>
  );
}

export function SelectField({
  label,
  name,
  value,
  options,
}: {
  label: string;
  name: string;
  value: string;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="cat-filter-field">
      <span>{label}</span>
      <select name={name} defaultValue={value}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function TextField({
  label,
  name,
  value,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="cat-filter-field">
      <span>{label}</span>
      <input type={type} name={name} defaultValue={value} placeholder={placeholder} />
    </label>
  );
}

export function DeveloperName({ developer, lang }: { developer: Developer | null; lang: Lang }) {
  if (!developer) return null;
  return <>{lang === "ar" ? developer.nameAr || developer.nameEn : developer.nameEn}</>;
}

export function CategoryPills({
  lang,
  categories,
  projectSlug,
}: {
  lang: Lang;
  categories: PropertyCategory[];
  projectSlug: string;
}) {
  return (
    <div className="cat-chips">
      {categories.map((category) => (
        <Link
          key={category.id}
          className="cat-chip"
          href={projectCategoryPath(lang, projectSlug, category.slug)}
        >
          {categoryName(category, lang)} →
        </Link>
      ))}
    </div>
  );
}
