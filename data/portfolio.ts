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

/**
 * Detail-page copy for the projects that do not have a hand-built component
 * (Sleek and Sarai have their own pages). Every figure here is already
 * published on the cards in data/content.ts — nothing new is invented; the
 * monthly examples are the simple arithmetic of price / months at 0% interest
 * and are labelled indicative.
 */
export type DetailFact = {
  label: Record<Lang, string>;
  value: Record<Lang, string>;
};

export type ProjectDetail = {
  slug: string;
  /** Hero + gallery imagery. */
  cover: string;
  gallery: string[];
  intro: Record<Lang, string[]>;
  facts: DetailFact[];
  highlights: Record<Lang, string[]>;
  plan: {
    stats: { value: string; label: Record<Lang, string> }[];
    example: Record<Lang, string>;
    note: Record<Lang, string>;
  };
};

export const PROJECT_DETAILS: Record<string, ProjectDetail> = {
  "the-lakes": {
    slug: "the-lakes",
    cover: "/img/lakes-pool.jpg",
    gallery: [
      "/img/lakes-pool.jpg",
      "/img/lakes-beach.jpg",
      "/img/lakes-garden.jpg",
      "/img/lakes-sunset.jpg",
      "/img/lakes-walk.jpg",
      "/img/lakes-building.jpg",
    ],
    intro: {
      en: [
        "The Lakes is the residential core of SODIC East in New Heliopolis: a 655-acre master plan built around a swimmable central lagoon, with 55% of the land left open as landscape, water and walking routes.",
        "Makers sells the first release directly for the developer — apartments, duplexes and penthouses from 60 to 209 m², at the official launch price rather than a resale ticket.",
      ],
      ar: [
        "البحيرات هي النواة السكنية لمشروع سوديك إيست في هليوبوليس الجديدة: ماستر بلان على 655 فدانًا حول بحيرة مركزية قابلة للسباحة، مع ترك 55% من الأرض مساحات مفتوحة ومياه وممرات للمشي.",
        "تبيع ميكرز الطرح الأول مباشرة لصالح المطور — شقق ودوبلكس وبنتهاوس بمساحات من 60 إلى 209 م²، بسعر الإطلاق الرسمي وليس بسعر إعادة بيع.",
      ],
    },
    facts: [
      { label: { en: "Starting price", ar: "السعر الابتدائي" }, value: { en: "EGP 6.7M", ar: "6.7 مليون جنيه" } },
      { label: { en: "Unit size", ar: "مساحة الوحدة" }, value: { en: "60–209 m²", ar: "60–209 م²" } },
      { label: { en: "Unit types", ar: "أنواع الوحدات" }, value: { en: "1–4 bed · duplex · penthouse", ar: "غرفة إلى 4 غرف · دوبلكس · بنتهاوس" } },
      { label: { en: "First delivery", ar: "أول تسليم" }, value: { en: "Dec 2026", ar: "ديسمبر 2026" } },
    ],
    highlights: {
      en: [
        "Swimmable central lagoon",
        "55% open landscape",
        "SODIC Sports Club",
        "International school",
        "Cycling and running spine",
        "Retail and dining promenade",
        "Flexi Plus finish",
      ],
      ar: [
        "بحيرة مركزية قابلة للسباحة",
        "55% مساحات مفتوحة",
        "نادي سوديك الرياضي",
        "مدرسة دولية",
        "مسار للدراجات والجري",
        "ممشى تجاري ومطاعم",
        "تشطيب فليكسي بلس",
      ],
    },
    plan: {
      stats: [
        { value: "0%", label: { en: "Down payment", ar: "المقدم" } },
        { value: "10 yrs", label: { en: "Instalments", ar: "التقسيط" } },
        { value: "120", label: { en: "Monthly payments", ar: "قسط شهري" } },
        { value: "Dec 2026", label: { en: "First delivery", ar: "أول تسليم" } },
      ],
      example: {
        en: "A 60 m² residence from EGP 6,700,000 over 120 months is roughly EGP 55,833 per month at 0% down.",
        ar: "وحدة 60 م² تبدأ من 6,700,000 جنيه على 120 شهرًا تعني نحو 55,833 جنيهًا شهريًا بمقدم 0%.",
      },
      note: {
        en: "Monthly figures are indicative and calculated at 0% interest. The final schedule, unit price and delivery date are set by the developer in the reservation contract.",
        ar: "الأرقام الشهرية تقديرية ومحسوبة دون فوائد. الجدول النهائي وسعر الوحدة وموعد التسليم يحددها المطور في عقد الحجز.",
      },
    },
  },
  eastvale: {
    slug: "eastvale",
    cover: "/img/lakes-sunset.jpg",
    gallery: [
      "/img/lakes-sunset.jpg",
      "/img/lakes-garden.jpg",
      "/img/lakes-walk.jpg",
      "/img/lakes-beach.jpg",
    ],
    intro: {
      en: [
        "EastVale anchors Mada City in Mostakbal City: SODIC's 500-feddan wellness community, planned around open landscape and everyday facilities rather than a single landmark.",
        "The mix runs from apartments to townhouses and villas between 80 and 311 m², sold by Makers at the developer's primary price with the developer's own payment schedule.",
      ],
      ar: [
        "إيست فيل هو نواة مدينة مادا بمدينة المستقبل: مجتمع سوديك الصحي على 500 فدان، مخطط حول المساحات المفتوحة والخدمات اليومية بدلًا من معلم واحد.",
        "المزيج يمتد من الشقق إلى التاون هاوس والفلل بمساحات من 80 إلى 311 م²، تبيعه ميكرز بسعر المطور الأولي وبجدول السداد الخاص به.",
      ],
    },
    facts: [
      { label: { en: "Starting price", ar: "السعر الابتدائي" }, value: { en: "EGP 8.5M", ar: "8.5 مليون جنيه" } },
      { label: { en: "Unit size", ar: "مساحة الوحدة" }, value: { en: "80–311 m²", ar: "80–311 م²" } },
      { label: { en: "Unit types", ar: "أنواع الوحدات" }, value: { en: "Apartments · townhouses · villas", ar: "شقق · تاون هاوس · فلل" } },
      { label: { en: "Community", ar: "المجتمع" }, value: { en: "500 feddan", ar: "500 فدان" } },
    ],
    highlights: {
      en: [
        "500-feddan wellness master plan",
        "Apartments, townhouses and villas",
        "Inside Mada City, Mostakbal City",
        "Primary sales, direct from SODIC",
        "Phased handover by neighbourhood",
        "Flexible instalment plans up to 9 years",
      ],
      ar: [
        "ماستر بلان صحي على 500 فدان",
        "شقق وتاون هاوس وفلل",
        "داخل مدينة مادا بمدينة المستقبل",
        "بيع أولي مباشرة من سوديك",
        "تسليم على مراحل حسب الحي",
        "خطط سداد مرنة حتى 9 سنوات",
      ],
    },
    plan: {
      stats: [
        { value: "5%", label: { en: "Down payment", ar: "المقدم" } },
        { value: "9 yrs", label: { en: "Instalments", ar: "التقسيط" } },
        { value: "108", label: { en: "Monthly payments", ar: "قسط شهري" } },
        { value: "Phased", label: { en: "Handover", ar: "التسليم" } },
      ],
      example: {
        en: "An 80 m² unit from EGP 8,500,000 with 5% down (EGP 425,000) leaves about EGP 74,769 per month over 108 months.",
        ar: "وحدة 80 م² تبدأ من 8,500,000 جنيه بمقدم 5% (425,000 جنيه) تترك نحو 74,769 جنيهًا شهريًا على 108 أشهر.",
      },
      note: {
        en: "Monthly figures are indicative and calculated at 0% interest. The final schedule, unit price and handover date are set by the developer in the reservation contract.",
        ar: "الأرقام الشهرية تقديرية ومحسوبة دون فوائد. الجدول النهائي وسعر الوحدة وموعد التسليم يحددها المطور في عقد الحجز.",
      },
    },
  },
};

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
