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

export type DetailRate = { label: Record<Lang, string>; value: string };

export type DetailUnit = { label: string; area: string; price: string };

export type DetailUnitGroup = { title: Record<Lang, string>; units: DetailUnit[] };

export type DetailVideo = { src: string; poster: string; label: Record<Lang, string> };

export type ProjectDetail = {
  slug: string;
  /** Hero + gallery imagery. */
  cover: string;
  coverCaption?: Record<Lang, string>;
  gallery: string[];
  galleryAlt?: Record<Lang, string>;
  videos?: DetailVideo[];
  intro: Record<Lang, string[]>;
  facts: DetailFact[];
  highlights: Record<Lang, string[]>;
  /** Price per m², only where the developer publishes it (Sleek). */
  rates?: DetailRate[];
  plan: {
    stats: { value: string; label: Record<Lang, string> }[];
    example?: Record<Lang, string>;
    note: Record<Lang, string>;
  };
  /** Unit inventory, grouped by floor or use. */
  units?: DetailUnitGroup[];
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
  sleek: {
    slug: "sleek",
    cover: "/sleek/exterior.jpg",
    coverCaption: { en: "Sleek, South 90th Street", ar: "سليك، شارع التسعين الجنوبي" },
    gallery: [
      "/sleek/exterior.jpg",
      "/sleek/frontage.jpg",
      "/sleek/retail-render.jpg",
      "/sleek/location-map.jpg",
      "/sleek/site-progress.jpg",
      "/sleek/site-aerial.jpg",
      "/sleek/site-view.jpg",
    ],
    galleryAlt: {
      en: "Sleek exterior, frontage, retail promenade, location and construction progress",
      ar: "سليك — الواجهة والممشى التجاري والموقع وتقدم الأعمال",
    },
    videos: [
      { src: "/sleek/video-1.mp4", poster: "/sleek/exterior.jpg", label: { en: "Sleek project film 1", ar: "فيديو سليك 1" } },
      { src: "/sleek/video-2.mp4", poster: "/sleek/frontage.jpg", label: { en: "Sleek project film 2", ar: "فيديو سليك 2" } },
      { src: "/sleek/video-3.mp4", poster: "/sleek/retail-render.jpg", label: { en: "Sleek project film 3", ar: "فيديو سليك 3" } },
    ],
    intro: {
      en: [
        "Sleek is AlRabat's commercial address on South 90th Street at Mohamed Naguib Axis: ground and first-floor retail and food and beverage, plus offices and clinics above, designed as a single walkable frontage.",
        "Units run from a 36.5 m² clinic to a 179 m² administrative floor plate. Retail and F&B are handed over core and shell, clinics fully finished, with delivery in Q1 2029.",
      ],
      ar: [
        "سليك هو العنوان التجاري للرباط على شارع التسعين الجنوبي عند محور محمد نجيب: تجزئة ومطاعم في الدورين الأرضي والأول، ومكاتب وعيادات أعلى، بتصميم واجهة واحدة قابلة للمشي.",
        "الوحدات تبدأ من عيادة 36.5 م² حتى مسطح إداري 179 م². التجزئة والمطاعم تُسلَّم على الطوب (Core & shell) والعيادات بتشطيب كامل، والتسليم في الربع الأول 2029.",
      ],
    },
    facts: [
      { label: { en: "Starting price", ar: "السعر الابتدائي" }, value: { en: "EGP 6.4M", ar: "6.4 مليون جنيه" } },
      { label: { en: "Unit size", ar: "مساحة الوحدة" }, value: { en: "37–141 m²", ar: "37–141 م²" } },
      { label: { en: "Activities", ar: "الأنشطة" }, value: { en: "Retail · F&B · Admin · Clinics", ar: "تجزئة · مطاعم · إداري · عيادات" } },
      { label: { en: "Delivery", ar: "التسليم" }, value: { en: "Q1 2029", ar: "الربع الأول 2029" } },
    ],
    highlights: {
      en: [
        "South 90th Street frontage at Mohamed Naguib Axis",
        "Ground and first-floor retail and F&B",
        "Administrative floors, core and shell",
        "Clinics delivered fully finished",
        "Operated by AlRabat",
        "40% cash discount available",
      ],
      ar: [
        "واجهة على التسعين الجنوبي عند محور محمد نجيب",
        "تجزئة ومطاعم في الدورين الأرضي والأول",
        "أدوار إدارية على الطوب (Core & shell)",
        "عيادات بتشطيب كامل",
        "التشغيل بواسطة الرباط",
        "خصم كاش يصل إلى 40%",
      ],
    },
    rates: [
      { label: { en: "Commercial · ground", ar: "تجاري · أرضي" }, value: "EGP 334,000 / m²" },
      { label: { en: "Commercial · first", ar: "تجاري · أول" }, value: "EGP 277,000 / m²" },
      { label: { en: "Administrative", ar: "إداري" }, value: "EGP 194,000 / m²" },
      { label: { en: "Clinics", ar: "عيادات" }, value: "EGP 205,000 / m²" },
    ],
    plan: {
      stats: [
        { value: "5%", label: { en: "Down payment", ar: "مقدم" } },
        { value: "5%", label: { en: "After 3 months", ar: "بعد 3 أشهر" } },
        { value: "6 yrs", label: { en: "Payment period", ar: "مدة السداد" } },
        { value: "40%", label: { en: "Cash discount", ar: "خصم الكاش" } },
      ],
      note: {
        en: "Sleek is sold core and shell for retail and F&B, and fully finished for clinics. Prices, unit availability and the payment schedule are confirmed by AlRabat at reservation.",
        ar: "يُباع سليك على الطوب للتجزئة والمطاعم وبتشطيب كامل للعيادات. الأسعار وتوافر الوحدات وجدول السداد يؤكدها الرباط عند الحجز.",
      },
    },
    units: [
      {
        title: { en: "Ground floor · Retail", ar: "الدور الأرضي · تجزئة" },
        units: [
          { label: "—", area: "64 m²", price: "EGP 21,376,000" },
          { label: "—", area: "58 m²", price: "EGP 27,260,000" },
          { label: "—", area: "74 m²", price: "EGP 29,156,000" },
        ],
      },
      {
        title: { en: "Ground floor · F&B", ar: "الدور الأرضي · مطاعم" },
        units: [
          { label: "—", area: "58 + 27.5 m²", price: "EGP 30,225,000" },
          { label: "—", area: "88.5 + 48 m²", price: "EGP 38,214,000" },
          { label: "—", area: "86 + 22.5 m²", price: "EGP 50,060,000" },
        ],
      },
      {
        title: { en: "First floor · Retail", ar: "الدور الأول · تجزئة" },
        units: [
          { label: "—", area: "51.5 m²", price: "EGP 14,780,500" },
          { label: "—", area: "51 m²", price: "EGP 15,555,500" },
          { label: "—", area: "61 m²", price: "EGP 17,385,000" },
        ],
      },
      {
        title: { en: "First floor · F&B", ar: "الدور الأول · مطاعم" },
        units: [{ label: "—", area: "118 + 40 m²", price: "EGP 45,782,000" }],
      },
      {
        title: { en: "Administrative · core and shell", ar: "إداري · على الطوب" },
        units: [
          { label: "—", area: "39 m²", price: "EGP 8,853,000" },
          { label: "—", area: "47.5 m²", price: "EGP 10,402,500" },
          { label: "—", area: "53 + 8.5 m²", price: "EGP 12,668,500" },
          { label: "—", area: "65 + 7 m²", price: "EGP 13,051,000" },
          { label: "—", area: "77 m²", price: "EGP 15,777,300" },
          { label: "—", area: "97 + 3 m²", price: "EGP 20,968,000" },
          { label: "—", area: "110 + 38 m²", price: "EGP 24,779,000" },
          { label: "—", area: "124 m²", price: "EGP 26,536,000" },
          { label: "—", area: "140.5 m²", price: "EGP 28,662,000" },
        ],
      },
      {
        title: { en: "Clinics · fully finished", ar: "عيادات · تشطيب كامل" },
        units: [
          { label: "1 room", area: "36.5 m²", price: "EGP 7,551,850" },
          { label: "2 rooms", area: "50 m²", price: "EGP 11,495,000" },
          { label: "3 rooms", area: "73.5 m²", price: "EGP 15,103,700" },
          { label: "4 rooms", area: "129 + 22 m²", price: "EGP 26,733,000" },
        ],
      },
    ],
  },
  sarai: {
    slug: "sarai",
    cover: "/sarai/cover.jpg",
    coverCaption: { en: "Sarai compound, Suez Road", ar: "سراي، طريق السويس" },
    gallery: [
      "/sarai/villa-exterior.jpg",
      "/sarai/waterfront.jpg",
      "/sarai/residences.jpg",
      "/sarai/landscaped-homes.jpg",
      "/sarai/building.jpg",
      "/sarai/canal.jpg",
      "/sarai/community.jpg",
      "/sarai/evening.jpg",
    ],
    galleryAlt: {
      en: "Sarai villas, waterfront, residences and community",
      ar: "فلل سراي والواجهة المائية والمجتمع",
    },
    videos: [
      { src: "/sarai/video-1.mp4", poster: "/sarai/cover.jpg", label: { en: "Sarai project film 1", ar: "فيديو سراي 1" } },
      { src: "/sarai/video-2.mp4", poster: "/sarai/waterfront.jpg", label: { en: "Sarai project film 2", ar: "فيديو سراي 2" } },
      { src: "/sarai/video-3.mp4", poster: "/sarai/villa-exterior.jpg", label: { en: "Sarai project film 3", ar: "فيديو سراي 3" } },
    ],
    intro: {
      en: [
        "Sarai is Madinet Masr's 1,200-acre double-gated community on Suez Road, beside Madinaty and the El-Amal axis. The developer has been building since 1909.",
        "Makers is selling S-Villa 212 in Elm Tree Park: a 3-bedroom villa with maid's room, EGP 19,100,000 at 1.5% down over 12 years, with 8% maintenance and delivery in 2031.",
      ],
      ar: [
        "سراي مجتمع مدينة مصر على 1,200 فدان ببوابات مزدوجة على طريق السويس، بجوار مدينتي ومحور الأمل. المطور يعمل منذ عام 1909.",
        "تبيع ميكرز S-Villa 212 في إلم تري بارك: فيلا 3 غرف نوم مع غرفة خدم، بسعر 19,100,000 جنيه بمقدم 1.5% وتقسيط 12 سنة، وصيانة 8% وتسليم 2031.",
      ],
    },
    facts: [
      { label: { en: "Unit price", ar: "سعر الوحدة" }, value: { en: "EGP 19.1M", ar: "19.1 مليون جنيه" } },
      { label: { en: "Unit type", ar: "نوع الوحدة" }, value: { en: "S-Villa 212 · 3 bed + maid", ar: "S-Villa 212 · 3 غرف + خدم" } },
      { label: { en: "Maintenance", ar: "الصيانة" }, value: { en: "8%", ar: "8%" } },
      { label: { en: "Delivery", ar: "التسليم" }, value: { en: "2031", ar: "2031" } },
    ],
    highlights: {
      en: [
        "1,200-acre double-gated community",
        "Suez Road, beside Madinaty",
        "Elm Tree Park — S-Villa 212",
        "Commercial area and strip mall",
        "International school and medical centre",
        "Klub Kayan and club houses",
        "Hotel and gas station on site",
      ],
      ar: [
        "مجتمع على 1,200 فدان ببوابات مزدوجة",
        "طريق السويس بجوار مدينتي",
        "إلم تري بارك — S-Villa 212",
        "منطقة تجارية وستريب مول",
        "مدرسة دولية ومركز طبي",
        "كلوب كيان وكلوب هاوسات",
        "فندق ومحطة وقود داخل المشروع",
      ],
    },
    plan: {
      stats: [
        { value: "1.5%", label: { en: "Down payment", ar: "المقدم" } },
        { value: "12 yrs", label: { en: "Instalments", ar: "التقسيط" } },
        { value: "144", label: { en: "Instalments count", ar: "عدد الأقساط" } },
        { value: "2031", label: { en: "Delivery", ar: "التسليم" } },
      ],
      example: {
        en: "EGP 19,100,000 at 1.5% down is EGP 286,500 up front, leaving about EGP 130,649 per month over 144 instalments.",
        ar: "19,100,000 جنيه بمقدم 1.5% تعني 286,500 جنيه مقدمًا، ويتبقى نحو 130,649 جنيهًا شهريًا على 144 قسطًا.",
      },
      note: {
        en: "Maintenance is 8% of the unit price (EGP 1,528,000) per the Elm Tree Park sheet. Prices, availability and the final schedule are confirmed by Madinet Masr at reservation.",
        ar: "الصيانة 8% من سعر الوحدة (1,528,000 جنيه) حسب ورقة إلم تري بارك. الأسعار والتوافر والجدول النهائي يؤكدها مدينة مصر عند الحجز.",
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
