import { content, type Lang, type Project } from "./content";

/**
 * Portal data for the public catalogue.
 *
 * Nothing here is a second copy of the copy: project cards come from
 * `content[lang].sections.projects.items` (which `lib/content-db.ts` merges with
 * PostgreSQL at read time). This module only adds the portal taxonomy — areas,
 * developer partners, residential/commercial grouping and the filter helper.
 */

export type Category = "residential" | "commercial";

export type Market = {
  slug: string;
  name: Record<Lang, string>;
  image: string;
  /** Short line shown under the area name. */
  blurb: Record<Lang, string>;
};

export const MARKETS: Market[] = [
  {
    slug: "new-heliopolis",
    name: { en: "New Heliopolis", ar: "هليوبوليس الجديدة" },
    image: "/img/lakes-pool.jpg",
    blurb: {
      en: "SODIC East, The Lakes and Sarai",
      ar: "سوديك إيست والبحيرات وسراي",
    },
  },
  {
    slug: "south-90th",
    name: { en: "South 90th · New Cairo", ar: "التسعين الجنوبي · القاهرة الجديدة" },
    image: "/sleek/exterior.jpg",
    blurb: {
      en: "Commercial and clinic units at Mohamed Naguib Axis",
      ar: "وحدات تجارية وعيادات عند محور محمد نجيب",
    },
  },
  {
    slug: "mostakbal-city",
    name: { en: "Mostakbal City · Mada City", ar: "مدينة المستقبل · مادا" },
    image: "/img/lakes-garden.jpg",
    blurb: {
      en: "EastVale — SODIC's 500-feddan wellness community",
      ar: "إيست فيل — مجتمع سوديك الصحي على 500 فدان",
    },
  },
  {
    slug: "all",
    name: { en: "All areas", ar: "كل المناطق" },
    image: "/img/lakes-sunset.jpg",
    blurb: {
      en: "Every project Makers represents today",
      ar: "كل المشروعات التي تمثلها ميكرز حاليًا",
    },
  },
];

export type Developer = {
  slug: string;
  name: string;
  /** Project slugs (from `data/content.ts`) this developer is behind. */
  projects: string[];
  blurb: Record<Lang, string>;
};

export const DEVELOPERS: Developer[] = [
  {
    slug: "sodic",
    name: "SODIC",
    projects: ["the-lakes", "eastvale"],
    blurb: {
      en: "One of Egypt's largest listed developers. The Lakes sits inside SODIC East in New Heliopolis; EastVale anchors Mada City in Mostakbal City.",
      ar: "من أكبر المطورين المقيدين في البورصة المصرية. البحيرات داخل سوديك إيست بهليوبوليس الجديدة، وإيست فيل في مدينة مادا بمدينة المستقبل.",
    },
  },
  {
    slug: "alrabat",
    name: "AlRabat",
    projects: ["sleek"],
    blurb: {
      en: "Commercial developer behind Sleek — retail, F&B, offices and clinics on South 90th Street.",
      ar: "المطور التجاري وراء سليك — تجزئة ومطاعم ومكاتب وعيادات على شارع التسعين الجنوبي.",
    },
  },
  {
    slug: "madinet-masr",
    name: "Madinet Masr",
    projects: ["sarai"],
    blurb: {
      en: "Founded in 1909, Madinet Masr develops Sarai — a 1,200-acre double-gated community on Suez Road beside Madinaty, with Elm Tree Park among its phases.",
      ar: "تأسست عام 1909، وتطور مدينة مصر مشروع سراي — مجتمع على 1,200 فدان ببوابات مزدوجة على طريق السويس بجوار مدينتي، ويضم إلم تري بارك بين مراحله.",
    },
  },
];

const PROJECT_MARKET: Record<string, string> = {
  "the-lakes": "new-heliopolis",
  eastvale: "mostakbal-city",
  sarai: "new-heliopolis",
  sleek: "south-90th",
};

const PROJECT_CATEGORY: Record<string, Category> = {
  "the-lakes": "residential",
  eastvale: "residential",
  sarai: "residential",
  sleek: "commercial",
};

export function projectsOf(lang: Lang): Project[] {
  return content[lang].sections.projects.items;
}

export function marketOf(project: Project): string {
  return PROJECT_MARKET[project.slug ?? ""] ?? "all";
}

export function categoryOf(project: Project): Category {
  return PROJECT_CATEGORY[project.slug ?? ""] ?? "residential";
}

export function developerOf(project: Project): Developer | null {
  const slug = project.slug ?? "";
  return DEVELOPERS.find((developer) => developer.projects.includes(slug)) ?? null;
}

/** How many of the represented projects sit in each market. */
export function marketCount(slug: string, lang: Lang): number {
  const items = projectsOf(lang);
  if (slug === "all") return items.length;
  return items.filter((project) => marketOf(project) === slug).length;
}

export function projectsByDeveloper(slug: string, lang: Lang): Project[] {
  const developer = DEVELOPERS.find((item) => item.slug === slug);
  if (!developer) return [];
  return projectsOf(lang).filter((project) => developer.projects.includes(project.slug ?? ""));
}

export type ProjectFilters = {
  q?: string;
  city?: string;
  type?: string;
  developer?: string;
};

const normalise = (value: string) => value.trim().toLowerCase();

/** Filter the represented projects by free text, area, category or developer. */
export function filterProjects(items: Project[], filters: ProjectFilters): Project[] {
  const q = filters.q ? normalise(filters.q) : "";
  const city = filters.city && filters.city !== "all" ? filters.city : "";
  const type = filters.type === "residential" || filters.type === "commercial" ? filters.type : "";
  const developer = filters.developer ?? "";

  return items.filter((project) => {
    if (q) {
      const haystack = [project.name, project.location, project.type, project.note, project.status]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (city && marketOf(project) !== city) return false;
    if (type && categoryOf(project) !== type) return false;
    if (developer && !developerOf(project)?.projects.includes(project.slug ?? "")) return false;
    return true;
  });
}

/** Copy for the portal chrome and section headings (not stored in PostgreSQL). */
export const PORTAL = {
  en: {
    heroTitle:
      "Your direct route to primary homes and commercial space in East Cairo.",
    heroLede:
      "Official developer prices, written payment plans and advisors who answer the phone. The Lakes, EastVale, Sleek and Sarai.",
    residentialTab: "Residential Projects",
    commercialTab: "Commercial Projects",
    searchPlaceholder: "Search for projects",
    cityLabel: "City",
    typeLabel: "Unit Type",
    searchCta: "Search",
    allCities: "All cities",
    residential: "Residential",
    commercial: "Commercial",
    areasKicker: "Where we sell",
    areasTitle: "Top Areas",
    areasLede: "Every project Makers represents today, by the part of Cairo it sits in.",
    viewMore: "View More",
    projectsKicker: "Now selling",
    projectsTitle: "Latest Projects",
    projectsLede:
      "Primary units only — bought at the developer's launch price, with the developer's own payment schedule.",
    priceLabel: "Price",
    unitLabel: "Unit type",
    deliveryLabel: "Status",
    details: "View project",
    call: "Call",
    whatsapp: "WhatsApp",
    empty: "No projects match those filters yet.",
    developersKicker: "Authorised partners",
    developersTitle: "Top Developers",
    developersLede:
      "We sell directly for the developer, so the price you see is the launch price — not a resale premium.",
    viewProjects: "View projects",
    projectsCount: "projects",
    projectCount: "project",
    resultsTitle: "Projects",
    resultsOne: "project",
    resultsMany: "projects",
    clearFilters: "Clear filters",
    filterSearch: "Search",
    filterCity: "City",
    filterType: "Unit type",
    filterDeveloper: "Developer",
    filterAll: "All",
    filterApply: "Filter",
    noResultsTitle: "Nothing matches yet",
    noResultsBody:
      "Try clearing the filters, or call us — new releases are often not on the site the same day.",
  },
  ar: {
    heroTitle: "طريقك المباشر للوحدات الأولية والمساحات التجارية في شرق القاهرة.",
    heroLede:
      "أسعار المطور الرسمية وخطط سداد مكتوبة ومستشارون يردون على الهاتف. البحيرات وإيست فيل وسليك وسراي.",
    residentialTab: "مشروعات سكنية",
    commercialTab: "مشروعات تجارية",
    searchPlaceholder: "ابحث عن مشروع",
    cityLabel: "المدينة",
    typeLabel: "نوع الوحدة",
    searchCta: "بحث",
    allCities: "كل المدن",
    residential: "سكني",
    commercial: "تجاري",
    areasKicker: "أين نبيع",
    areasTitle: "أهم المناطق",
    areasLede: "كل مشروع تمثله ميكرز اليوم، حسب موقعه في القاهرة.",
    viewMore: "عرض المزيد",
    projectsKicker: "معروض الآن",
    projectsTitle: "أحدث المشروعات",
    projectsLede:
      "وحدات أولية فقط — بسعر إطلاق المطور، وبجدول السداد الخاص به.",
    priceLabel: "السعر",
    unitLabel: "نوع الوحدة",
    deliveryLabel: "الحالة",
    details: "عرض المشروع",
    call: "اتصل",
    whatsapp: "واتساب",
    empty: "لا توجد مشروعات مطابقة لهذه الفلاتر.",
    developersKicker: "شركاء معتمدون",
    developersTitle: "أهم المطورين",
    developersLede:
      "نبيع مباشرة للمطور، فالسعر المعروض هو سعر الإطلاق وليس علاوة إعادة بيع.",
    viewProjects: "عرض المشروعات",
    projectsCount: "مشروعات",
    projectCount: "مشروع",
    resultsTitle: "المشروعات",
    resultsOne: "مشروع",
    resultsMany: "مشروعات",
    clearFilters: "مسح الفلاتر",
    filterSearch: "بحث",
    filterCity: "المدينة",
    filterType: "نوع الوحدة",
    filterDeveloper: "المطور",
    filterAll: "الكل",
    filterApply: "تصفية",
    noResultsTitle: "لا توجد نتائج",
    noResultsBody:
      "جرّب مسح الفلاتر أو اتصل بنا — الطروحات الجديدة لا تظهر على الموقع في يومها دائمًا.",
  },
} as const;

export type PortalCopy = (typeof PORTAL)[Lang];
