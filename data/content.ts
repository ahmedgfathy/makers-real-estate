export type Lang = "en" | "ar";
export type TileId = "lakes" | "phase08m" | "sodic-east" | "amenities" | "collection" | "payment";

export type Stat = { value: string; label: string };

export type UnitRow = {
  code: string;
  floor?: 1 | 2 | 3 | 4 | 5;
  area: number;
  garden?: number;
  roof?: number;
  price: number;
};

export type PriceRow = { label: string; area?: string; price: string; monthly?: string };

export type Section =
  | { kind: "stats"; items: Stat[] }
  | { kind: "table"; title?: string; columns: string[]; rows: string[][]; footnote?: string }
  | { kind: "units"; title?: string; rows: UnitRow[]; gardenColumn?: boolean; roofColumn?: boolean }
  | { kind: "list"; title?: string; items: string[]; columns?: 1 | 2 | 3 }
  | { kind: "prices"; title?: string; rows: PriceRow[] }
  | { kind: "gallery"; items: { src: string; caption: string }[] }
  | { kind: "note"; text: string };

export type Tile = {
  id: TileId;
  index: string;
  kicker: string;
  title: string;
  meta: string;
  image: string;
};

export type Panel = {
  id: TileId;
  kicker: string;
  title: string;
  lede: string;
  image: string;
  sections: Section[];
  cta: string;
};

export type Content = {
  meta: { title: string; description: string };
  brand: { name: string; tagline: string; sub: string };
  nav: { collection: string; gallery: string; contact: string; call: string };
  hero: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    place: string;
    lede: string;
    primary: string;
    secondary: string;
    scroll: string;
    stats: Stat[];
  };
  grid: { label: string; title: string; lede: string; open: string };
  panel: {
    close: string;
    scrollHint: string;
    beds: string;
    unit: string;
    floor: string;
    area: string;
    garden: string;
    roof: string;
    price: string;
    monthly: string;
    floors: Record<string, string>;
    monthlyNote: string;
  };
  footer: {
    title: string;
    lede: string;
    advisor: string;
    role: string;
    whatsapp: string;
    call: string;
    disclaimer: string;
    rights: string;
    builtWith: string;
    sections: string;
  };
  tiles: Tile[];
  panels: Record<TileId, Panel>;
};

const cta = "Request the full brief";

const en: Content = {
  meta: {
    title: "Makers Real Estate — The Lakes at SODIC East",
    description:
      "Makers Real Estate presents The Lakes at SODIC East, New Heliopolis. Apartments and duplexes from EGP 6.7M, 0% down payment, ten-year installments, delivery December 2026.",
  },
  brand: { name: "Makers", tagline: "Real Estate", sub: "SODIC East · New Heliopolis" },
  nav: { collection: "Collection", gallery: "Gallery", contact: "Contact", call: "Call" },
  hero: {
    eyebrow: "Makers Real Estate · SODIC East",
    titleLine1: "The",
    titleLine2: "Lakes",
    place: "New Heliopolis · East Cairo",
    lede:
      "Water, landscape and everyday life wrapped around a swimmable central lagoon. Homes from EGP 6.7M with 0% down and ten years to pay.",
    primary: "Explore the collection",
    secondary: "Speak to an advisor",
    scroll: "Scroll to explore",
    stats: [
      { value: "655", label: "Acres master plan" },
      { value: "55%", label: "Open space" },
      { value: "0%", label: "Down payment" },
      { value: "10 yrs", label: "Installments" },
    ],
  },
  grid: {
    label: "Choose a collection",
    title: "Six ways into SODIC East",
    lede:
      "Open any tile for the full brief — units, areas, prices, amenities and delivery dates. Everything below is current inventory held by Makers Real Estate.",
    open: "Open",
  },
  panel: {
    close: "Close",
    scrollHint: "Scroll for the full brief",
    beds: "Bedrooms",
    unit: "Unit",
    floor: "Floor",
    area: "Area",
    garden: "Garden",
    roof: "Roof",
    price: "Price",
    monthly: "≈ Monthly",
    floors: { "1": "1st", "2": "2nd", "3": "3rd", "4": "4th", "5": "5th" },
    monthlyNote:
      "Monthly figure is indicative: price divided by 120 months at 0% interest. Final schedule is set in the reservation contract.",
  },
  footer: {
    title: "Let’s find your address.",
    lede:
      "Seif El Din Tarek walks you through layouts, availability and payment schedules — usually within the hour.",
    advisor: "Seif El Din Tarek",
    role: "Senior Property Consultant · SODIC",
    whatsapp: "WhatsApp",
    call: "0100 950 0083",
    disclaimer:
      "Prices, areas and availability are indicative and subject to change without notice. Images are artist impressions of The Lakes at SODIC East. Delivery dates are per phase.",
    rights: "Makers Real Estate. All rights reserved.",
    builtWith: "SODIC East · The Lakes · Phase 08M",
    sections: "Sections",
  },
  tiles: [
    { id: "lakes", index: "01", kicker: "New launch", title: "The Lakes", meta: "1–4 Bed+N · From EGP 6.7M", image: "/img/lakes-pool.jpg" },
    { id: "phase08m", index: "02", kicker: "Apartments · Fully finished", title: "Phase 08M", meta: "18 units · 125–225 m² · Dec 2026", image: "/img/lakes-building.jpg" },
    { id: "sodic-east", index: "03", kicker: "The master plan", title: "SODIC East", meta: "655 acres · 6,000 homes · 55% open", image: "/img/lakes-beach.jpg" },
    { id: "amenities", index: "04", kicker: "Sports club & community", title: "Amenities", meta: "8 tennis · 6 squash · 4 padel", image: "/img/lakes-garden.jpg" },
    { id: "collection", index: "05", kicker: "Inventory · Two phases", title: "The Collection", meta: "112 units · Townhouses, villas, apartments", image: "/img/lakes-walk.jpg" },
    { id: "payment", index: "06", kicker: "Pricing & payment", title: "0% Down", meta: "Ten years · Delivery Dec 2026", image: "/img/lakes-sunset.jpg" },
  ],
  panels: {
    lakes: {
      id: "lakes",
      kicker: "New launch · Multi-family neighborhood",
      title: "The Lakes",
      lede:
        "A water-centric residential community inside SODIC East, designed by EDSA around a swimmable central lagoon: sandy shoreline, a central island, a café pavilion and waterfront decks, with secondary lakes threaded through every cluster.",
      image: "/img/lakes-pool.jpg",
      cta,
      sections: [
        {
          kind: "stats",
          items: [
            { value: "EDSA", label: "Master landscape architect" },
            { value: "1–4", label: "Bed+N homes" },
            { value: "6.7M", label: "Starting price (EGP)" },
            { value: "10 yrs", label: "Installments" },
          ],
        },
        {
          kind: "list",
          title: "Why The Lakes",
          columns: 2,
          items: [
            "A swimmable central lagoon with a sandy shoreline, central island, café pavilion and waterfront decks",
            "Secondary lakes and water features create waterfront experiences across the residential clusters",
            "Human-scaled clusters designed around views, privacy, landscape and distinctive architecture",
            "Flexible homes that respond to different lifestyles and changing needs",
            "A water garden connecting the neighborhood for walking, jogging and cycling",
            "Close to the SODIC Sports Club and the international school, with easy access in and out",
          ],
        },
        {
          kind: "prices",
          title: "Starting prices",
          rows: [
            { label: "1 bedroom apartment", area: "≈ 76 m²", price: "6,700,000", monthly: "55,833" },
            { label: "2 bedroom apartment", area: "≈ 123 m²", price: "10,900,000", monthly: "90,833" },
            { label: "2 bedroom + nanny", area: "≈ 127 m²", price: "11,200,000", monthly: "93,333" },
            { label: "3 bedroom apartment", area: "≈ 149 m²", price: "13,200,000", monthly: "110,000" },
            { label: "3 bedroom + nanny", area: "≈ 160 m²", price: "14,100,000", monthly: "117,500" },
            { label: "3 bedroom duplex", area: "≈ 200 m²", price: "17,700,000", monthly: "147,500" },
            { label: "4 bedroom + nanny", area: "≈ 199 m²", price: "17,500,000", monthly: "145,833" },
          ],
        },
        {
          kind: "note",
          text: "Payment plan: 0% down payment with installments over 10 years. Flexi Plus finish. Prices are subject to availability.",
        },
        {
          kind: "gallery",
          items: [
            { src: "/img/lakes-sunset.jpg", caption: "Waterfront clusters at golden hour" },
            { src: "/img/lakes-garden.jpg", caption: "The water garden" },
            { src: "/img/lakes-walk.jpg", caption: "Sunken gardens and walkways" },
            { src: "/img/lakes-beach.jpg", caption: "Lagoon shoreline" },
            { src: "/img/lakes-building.jpg", caption: "Residential cluster" },
          ],
        },
      ],
    },    phase08m: {
      id: "phase08m",
      kicker: "Phase 08M · Apartments, fully finished",
      title: "Phase 08M",
      lede:
        "Eighteen fully finished apartments in buildings B20, B22 and B23 — two-bedroom homes with private gardens, three-bedroom family apartments, and a single three-bedroom-plus-nanny residence with a private roof terrace. Delivery December 2026.",
      image: "/img/lakes-building.jpg",
      cta,
      sections: [
        {
          kind: "stats",
          items: [
            { value: "18", label: "Units available" },
            { value: "125–225", label: "Built-up area (m²)" },
            { value: "Dec 2026", label: "Delivery" },
            { value: "Finished", label: "Condition" },
          ],
        },
        {
          kind: "units",
          title: "2 bedrooms · Ground + garden",
          gardenColumn: true,
          rows: [
            { code: "B20-04", area: 129, garden: 67, price: 17596000 },
            { code: "B20-01", area: 129, garden: 80, price: 17805000 },
          ],
        },
        {
          kind: "units",
          title: "2 bedrooms · Upper floors",
          rows: [
            { code: "B20-31", floor: 3, area: 125, price: 15030000 },
            { code: "B20-41", floor: 4, area: 125, price: 15032000 },
            { code: "B20-34", floor: 3, area: 125, price: 15171000 },
            { code: "B20-44", floor: 4, area: 125, price: 15171000 },
            { code: "B20-21", floor: 2, area: 129, price: 15408000 },
            { code: "B20-14", floor: 1, area: 129, price: 15408000 },
            { code: "B23-44", floor: 4, area: 125, price: 16147000 },
            { code: "B20-11", floor: 1, area: 141, price: 16532000 },
          ],
        },
        {
          kind: "units",
          title: "3 bedrooms · Ground + garden",
          gardenColumn: true,
          rows: [{ code: "B20-03", area: 153, garden: 61, price: 18935000 }],
        },
        {
          kind: "units",
          title: "3 bedrooms · Upper floors",
          rows: [
            { code: "B20-23", floor: 2, area: 153, price: 17220000 },
            { code: "B20-33", floor: 3, area: 153, price: 17381000 },
            { code: "B20-43", floor: 4, area: 153, price: 17920000 },
            { code: "B20-42", floor: 4, area: 153, price: 18597000 },
            { code: "B22-23", floor: 2, area: 153, price: 18677000 },
            { code: "B20-12", floor: 1, area: 165, price: 18944000 },
          ],
        },
        {
          kind: "units",
          title: "3 bedrooms + nanny",
          roofColumn: true,
          rows: [{ code: "B23-51", floor: 5, area: 225, roof: 19, price: 26252000 }],
        },
        {
          kind: "note",
          text: "Fully finished, delivery December 2026. Layouts and payment plans are issued per unit — ask for the sheet of any code above.",
        },
      ],
    },
    "sodic-east": {
      id: "sodic-east",
      kicker: "The master plan · New Heliopolis",
      title: "SODIC East",
      lede:
        "655 acres between New Cairo and the New Administrative Capital: 6,000 homes, a two-kilometre green spine, four kilometres of jogging and cycling lanes, and 55% of the land left open.",
      image: "/img/lakes-beach.jpg",
      cta,
      sections: [
        {
          kind: "stats",
          items: [
            { value: "655", label: "Acres" },
            { value: "6,000", label: "Residential units" },
            { value: "1,505", label: "Units in phase one" },
            { value: "20K", label: "Expected residents" },
          ],
        },
        {
          kind: "list",
          title: "Project overview",
          columns: 2,
          items: [
            "655 acres mixed-use development in East Cairo",
            "6,000 residential units",
            "Phase 1: 1,505 units",
            "80% single family · 20% multiple family",
            "55% open space · 18% footprint",
            "2 km green spine",
            "4 km jogging and cycling lane",
            "110,000 m² of commercial GLA",
          ],
        },
        {
          kind: "list",
          title: "Community & amenities",
          columns: 3,
          items: [
            "SODIC Sports Club",
            "International School",
            "Community Mall",
            "Commercial District",
            "Family Clinics",
            "Mosque",
            "Town Hall",
            "Social Nodes",
            "Transportation Hub",
            "Green Spine / The Ravine",
          ],
        },
        {
          kind: "table",
          title: "Location",
          columns: ["Destination", "Drive time"],
          rows: [
            ["New Cairo", "25 min"],
            ["New Administrative Capital", "25 min"],
            ["Cairo International Airport", "25 min"],
            ["LRT Station", "10 min"],
          ],
        },
        {
          kind: "note",
          text: "Set within SODIC East in New Heliopolis, strategically positioned between New Cairo and the New Administrative Capital.",
        },
      ],
    },
    amenities: {
      id: "amenities",
      kicker: "Sports club & community",
      title: "Amenities",
      lede:
        "A 40-acre first phase of the SODIC Sports Club is complete and open — one of the largest in East Cairo — surrounded by an international school, a community mall, family clinics and a town hall.",
      image: "/img/lakes-garden.jpg",
      cta,
      sections: [
        {
          kind: "stats",
          items: [
            { value: "8", label: "Tennis courts" },
            { value: "6", label: "Squash courts" },
            { value: "4", label: "Padel courts" },
            { value: "3", label: "Pools" },
          ],
        },
        {
          kind: "list",
          title: "SODIC Sports Club",
          columns: 2,
          items: [
            "11-a-side football court",
            "5-a-side football courts",
            "8 tennis courts",
            "6 squash courts",
            "4 padel courts",
            "Olympic and half-Olympic pools",
            "Kids pool",
            "Gymnastics and martial arts",
            "Kids village",
            "Outdoor fitness arena",
            "Health and wellness",
            "F&B outlets",
            "Sports halls and studios",
          ],
        },
        {
          kind: "list",
          title: "Community",
          columns: 2,
          items: [
            "International school",
            "Community mall",
            "Commercial district",
            "Family clinics",
            "Mosque",
            "Town hall",
            "Social nodes",
            "Transportation hub",
            "2 km green spine",
            "4 km jogging and cycling lane",
          ],
        },
        {
          kind: "list",
          title: "Life around water at The Lakes",
          columns: 2,
          items: [
            "Swimmable central lagoon with sandy shoreline and central island",
            "Café pavilion and waterfront decks",
            "Secondary lakes through the residential clusters",
            "Water garden connecting the neighborhood",
            "Shaded gardens and reading nooks",
            "Kids’ areas, picnic gardens and outdoor fitness",
          ],
        },
      ],
    },
    collection: {
      id: "collection",
      kicker: "Inventory · Two phases",
      title: "The Collection",
      lede:
        "112 available units across two phases of SODIC East — apartments, townhouses and villas from 125 m² to 392 m², with delivery dates that stretch from December 2026 to the end of 2029.",
      image: "/img/lakes-walk.jpg",
      cta,
      sections: [
        {
          kind: "stats",
          items: [
            { value: "112", label: "Units available" },
            { value: "2", label: "Phases" },
            { value: "125–392", label: "Area range (m²)" },
            { value: "2026–29", label: "Delivery window" },
          ],
        },
        {
          kind: "table",
          title: "SODIC East 2 · Delivery 31 Dec 2029",
          columns: ["Type", "Beds", "Finishing", "Area m²", "Price EGP", "Delivery"],
          rows: [
            ["Town house", "3", "Core and shell", "234", "39,846,000", "RTM"],
            ["Town house", "3", "Finished", "201–208", "29,172,000 – 36,234,000", "31/12/2029"],
            ["Villa", "3", "Finished", "208–232", "40,003,000 – 44,098,000", "31/12/2029"],
            ["Villa", "4", "Finished", "300", "52,103,000 – 52,834,000", "31/12/2029"],
          ],
        },
        {
          kind: "table",
          title: "SODIC East 2 · Delivery 30 Dec 2026 – 30 Sep 2027",
          columns: ["Type", "Beds", "Finishing", "Area m²", "Price EGP", "Delivery"],
          rows: [
            ["Apartment", "2", "Finished", "125–141", "14,348,000 – 17,950,000", "30/12/2026 – 30/09/2027"],
            ["Apartment", "3", "Core and shell", "183–223", "25,077,000 – 31,794,000", "30/09/2027"],
            ["Apartment", "3", "Finished", "153–225", "17,220,000 – 26,252,000", "30/12/2026"],
            ["Villa", "3", "Core and shell", "237", "50,558,000", "30/09/2027"],
            ["Villa", "4", "Core and shell", "326", "53,015,000 – 58,463,000", "30/09/2027"],
            ["Villa", "5", "Core and shell", "392", "62,620,000 – 71,339,000", "30/09/2027"],
          ],
        },
        {
          kind: "note",
          text: "Prepared by SODIC Sales. Prices are subject to availability and may change without prior notice. Unit-by-unit availability for phase 08M is listed under the Phase 08M tile.",
        },
      ],
    },
    payment: {
      id: "payment",
      kicker: "Pricing & payment",
      title: "0% Down",
      lede:
        "Zero down payment with installments over ten years — the structure SODIC is offering across The Lakes and the current SODIC East phases. Delivery of finished apartments starts December 2026.",
      image: "/img/lakes-sunset.jpg",
      cta,
      sections: [
        {
          kind: "stats",
          items: [
            { value: "0%", label: "Down payment" },
            { value: "10 yrs", label: "Installment period" },
            { value: "120", label: "Monthly installments" },
            { value: "Dec 2026", label: "First delivery" },
          ],
        },
        {
          kind: "prices",
          title: "What it looks like",
          rows: [
            { label: "1 bedroom apartment", area: "From 6.7M EGP", price: "6,700,000", monthly: "55,833" },
            { label: "2 bedroom apartment", area: "From 10.9M EGP", price: "10,900,000", monthly: "90,833" },
            { label: "3 bedroom apartment", area: "From 13.2M EGP", price: "13,200,000", monthly: "110,000" },
            { label: "3 bedroom + nanny", area: "From 14.1M EGP", price: "14,100,000", monthly: "117,500" },
            { label: "Phase 08M · 2 bed", area: "From 15.03M EGP", price: "15,030,000", monthly: "125,250" },
            { label: "Phase 08M · 3 bed + nanny", area: "From 26.25M EGP", price: "26,252,000", monthly: "218,767" },
          ],
        },
        {
          kind: "note",
          text: "Monthly figures are indicative only: total price divided by 120 months at 0% interest. The binding schedule, reservation terms and any maintenance deposit are confirmed in writing.",
        },
        {
          kind: "list",
          title: "What you need to reserve",
          columns: 1,
          items: [
            "Unit code and layout sheet for the home you want",
            "Reservation form signed with the developer",
            "National ID or passport for the contract",
            "Delivery date and finishing specification for that phase",
          ],
        },
      ],
    },
  },
};

const ar: Content = {  meta: {
    title: "ميكرز للعقارات — البحيرات في سوديك إيست",
    description:
      "ميكرز للعقارات تقدم البحيرات داخل سوديك إيست، هليوبوليس الجديدة. شقق ودوبلكس تبدأ من 6.7 مليون جنيه، بدون مقدم، وتقسيط على 10 سنوات، والتسليم ديسمبر 2026.",
  },
  brand: { name: "ميكرز", tagline: "للعقارات", sub: "سوديك إيست · هليوبوليس الجديدة" },
  nav: { collection: "المجموعة", gallery: "الصور", contact: "تواصل", call: "اتصل" },
  hero: {
    eyebrow: "ميكرز للعقارات · سوديك إيست",
    titleLine1: "البحيرات",
    titleLine2: "",
    place: "هليوبوليس الجديدة · شرق القاهرة",
    lede:
      "مياه ومساحات خضراء وحياة يومية حول بحيرة مركزية صالحة للسباحة. وحدات تبدأ من 6.7 مليون جنيه، بدون مقدم وتقسيط على 10 سنوات.",
    primary: "استكشف المجموعة",
    secondary: "تحدث مع مستشار",
    scroll: "انزل للاستكشاف",
    stats: [
      { value: "655", label: "فدان" },
      { value: "55%", label: "مساحات مفتوحة" },
      { value: "0%", label: "مقدم الحجز" },
      { value: "10 سنوات", label: "مدة التقسيط" },
    ],
  },
  grid: {
    label: "اختر مجموعة",
    title: "ستة أبواب إلى سوديك إيست",
    lede:
      "افتح أي مربع لتحصل على الملف الكامل: الوحدات، المساحات، الأسعار، الخدمات ومواعيد التسليم. كل ما بالأسفل متاح فعليًا عبر ميكرز للعقارات.",
    open: "افتح",
  },
  panel: {
    close: "إغلاق",
    scrollHint: "انزل للملف الكامل",
    beds: "غرف النوم",
    unit: "الوحدة",
    floor: "الدور",
    area: "المساحة",
    garden: "الحديقة",
    roof: "الروف",
    price: "السعر",
    monthly: "≈ القسط الشهري",
    floors: { "1": "الأول", "2": "الثاني", "3": "الثالث", "4": "الرابع", "5": "الخامس" },
    monthlyNote:
      "القسط الشهري إرشادي: السعر مقسومًا على 120 شهرًا بفائدة 0%. الجدول النهائي يُحدد في عقد الحجز.",
  },
  footer: {
    title: "لنحدد عنوانك.",
    lede:
      "سيف الدين طارق يشرح لك المخططات والمتاح والأسعار وخطط السداد — عادة خلال ساعة من تواصلك.",
    advisor: "سيف الدين طارق",
    role: "مستشار عقاري أول · سوديك",
    whatsapp: "واتساب",
    call: "0100 950 0083",
    disclaimer:
      "الأسعار والمساحات والمتاح إرشادية وقابلة للتغيير دون إشعار. الصور تخييلية لمشروع البحيرات داخل سوديك إيست. مواعيد التسليم حسب المرحلة.",
    rights: "ميكرز للعقارات. جميع الحقوق محفوظة.",
    builtWith: "سوديك إيست · البحيرات · مرحلة 08M",
    sections: "الأقسام",
  },
  tiles: [
    { id: "lakes", index: "01", kicker: "إطلاق جديد", title: "البحيرات", meta: "1–4 غرف + مربية · من 6.7 مليون", image: "/img/lakes-pool.jpg" },
    { id: "phase08m", index: "02", kicker: "شقق · تشطيب كامل", title: "مرحلة 08M", meta: "18 وحدة · 125–225 م² · ديسمبر 2026", image: "/img/lakes-building.jpg" },
    { id: "sodic-east", index: "03", kicker: "المخطط الرئيسي", title: "سوديك إيست", meta: "655 فدان · 6000 وحدة · 55% مفتوحة", image: "/img/lakes-beach.jpg" },
    { id: "amenities", index: "04", kicker: "النادي الرياضي والمجتمع", title: "الخدمات", meta: "8 تنس · 6 إسكواش · 4 بادل", image: "/img/lakes-garden.jpg" },
    { id: "collection", index: "05", kicker: "المتاح · مرحلتان", title: "المجموعة", meta: "112 وحدة · تاون هاوس وفيلات وشقق", image: "/img/lakes-walk.jpg" },
    { id: "payment", index: "06", kicker: "الأسعار والسداد", title: "بدون مقدم", meta: "10 سنوات · التسليم ديسمبر 2026", image: "/img/lakes-sunset.jpg" },
  ],
  panels: {
    lakes: {
      id: "lakes",
      kicker: "إطلاق جديد · حي سكني متعدد",
      title: "البحيرات",
      lede:
        "مجتمع سكني محوره المياه داخل سوديك إيست، صممه مكتب EDSA حول بحيرة مركزية صالحة للسباحة: شاطئ رملي، جزيرة مركزية، كشك مقهى وأرصفة على المياه، مع بحيرات ثانوية تتخلل كل مجموعة سكنية.",
      image: "/img/lakes-pool.jpg",
      cta: "اطلب الملف الكامل",
      sections: [
        {
          kind: "stats",
          items: [
            { value: "EDSA", label: "تصميم تنسيق الموقع" },
            { value: "1–4", label: "غرف + مربية" },
            { value: "6.7M", label: "سعر البداية (جنيه)" },
            { value: "10 سنوات", label: "التقسيط" },
          ],
        },
        {
          kind: "list",
          title: "لماذا البحيرات؟",
          columns: 2,
          items: [
            "بحيرة مركزية صالحة للسباحة مع شاطئ رملي وجزيرة مركزية وكشك مقهى وأرصفة مائية",
            "بحيرات ثانوية وعناصر مائية تمنح تجربة على المياه داخل كل مجموعة سكنية",
            "مجموعات بمقياس إنساني مصممة حول الإطلالات والخصوصية والاندسكيب",
            "وحدات مرنة تستجيب لأنماط حياة مختلفة واحتياجات متغيرة",
            "حديقة مائية تربط الحي وتخدم المشي والجري وركوب الدراجات",
            "قريبة من النادي الرياضي والمدرسة الدولية، مع سهولة دخول وخروج",
          ],
        },
        {
          kind: "prices",
          title: "أسعار البداية",
          rows: [
            { label: "شقة غرفة نوم", area: "≈ 76 م²", price: "6,700,000", monthly: "55,833" },
            { label: "شقة غرفتين", area: "≈ 123 م²", price: "10,900,000", monthly: "90,833" },
            { label: "غرفتان + مربية", area: "≈ 127 م²", price: "11,200,000", monthly: "93,333" },
            { label: "شقة 3 غرف", area: "≈ 149 م²", price: "13,200,000", monthly: "110,000" },
            { label: "3 غرف + مربية", area: "≈ 160 م²", price: "14,100,000", monthly: "117,500" },
            { label: "دوبلكس 3 غرف", area: "≈ 200 م²", price: "17,700,000", monthly: "147,500" },
            { label: "4 غرف + مربية", area: "≈ 199 م²", price: "17,500,000", monthly: "145,833" },
          ],
        },
        {
          kind: "note",
          text: "خطة السداد: بدون مقدم وتقسيط على 10 سنوات. تشطيب فليكسي بلس. الأسعار مرتبطة بالمتاح وقت الحجز.",
        },
        {
          kind: "gallery",
          items: [
            { src: "/img/lakes-sunset.jpg", caption: "المجموعات السكنية على المياه" },
            { src: "/img/lakes-garden.jpg", caption: "الحديقة المائية" },
            { src: "/img/lakes-walk.jpg", caption: "حدائق غاطسة وممرات" },
            { src: "/img/lakes-beach.jpg", caption: "شاطئ البحيرة" },
            { src: "/img/lakes-building.jpg", caption: "مجموعة سكنية" },
          ],
        },
      ],
    },    phase08m: {
      id: "phase08m",
      kicker: "مرحلة 08M · شقق تشطيب كامل",
      title: "مرحلة 08M",
      lede:
        "ثمانية عشر شقة بتشطيب كامل في مباني B20 وB22 وB23: شقق غرفتين بحدائق خاصة، وشقق ثلاث غرف للعائلات، ووحدة واحدة بثلاث غرف مع مربية وروف خاص. التسليم ديسمبر 2026.",
      image: "/img/lakes-building.jpg",
      cta: "اطلب الملف الكامل",
      sections: [
        {
          kind: "stats",
          items: [
            { value: "18", label: "وحدة متاحة" },
            { value: "125–225", label: "المساحة (م²)" },
            { value: "ديسمبر 2026", label: "التسليم" },
            { value: "كامل", label: "التشطيب" },
          ],
        },
        {
          kind: "units",
          title: "غرفتان · أرضي بحديقة",
          gardenColumn: true,
          rows: [
            { code: "B20-04", area: 129, garden: 67, price: 17596000 },
            { code: "B20-01", area: 129, garden: 80, price: 17805000 },
          ],
        },
        {
          kind: "units",
          title: "غرفتان · أدوار علوية",
          rows: [
            { code: "B20-31", floor: 3, area: 125, price: 15030000 },
            { code: "B20-41", floor: 4, area: 125, price: 15032000 },
            { code: "B20-34", floor: 3, area: 125, price: 15171000 },
            { code: "B20-44", floor: 4, area: 125, price: 15171000 },
            { code: "B20-21", floor: 2, area: 129, price: 15408000 },
            { code: "B20-14", floor: 1, area: 129, price: 15408000 },
            { code: "B23-44", floor: 4, area: 125, price: 16147000 },
            { code: "B20-11", floor: 1, area: 141, price: 16532000 },
          ],
        },
        {
          kind: "units",
          title: "3 غرف · أرضي بحديقة",
          gardenColumn: true,
          rows: [{ code: "B20-03", area: 153, garden: 61, price: 18935000 }],
        },
        {
          kind: "units",
          title: "3 غرف · أدوار علوية",
          rows: [
            { code: "B20-23", floor: 2, area: 153, price: 17220000 },
            { code: "B20-33", floor: 3, area: 153, price: 17381000 },
            { code: "B20-43", floor: 4, area: 153, price: 17920000 },
            { code: "B20-42", floor: 4, area: 153, price: 18597000 },
            { code: "B22-23", floor: 2, area: 153, price: 18677000 },
            { code: "B20-12", floor: 1, area: 165, price: 18944000 },
          ],
        },
        {
          kind: "units",
          title: "3 غرف + مربية",
          roofColumn: true,
          rows: [{ code: "B23-51", floor: 5, area: 225, roof: 19, price: 26252000 }],
        },
        {
          kind: "note",
          text: "وحدات بتشطيب كامل، التسليم ديسمبر 2026. المخططات وخطط السداد تُصدر لكل وحدة على حدة — اطلب ملف أي كود بالأسفل.",
        },
      ],
    },
    "sodic-east": {
      id: "sodic-east",
      kicker: "المخطط الرئيسي · هليوبوليس الجديدة",
      title: "سوديك إيست",
      lede:
        "655 فدانًا بين القاهرة الجديدة والعاصمة الإدارية: 6000 وحدة سكنية، وممشى أخضر بطول كيلومترين، وأربعة كيلومترات للجري وركوب الدراجات، و55% من الأرض مساحات مفتوحة.",
      image: "/img/lakes-beach.jpg",
      cta: "اطلب الملف الكامل",
      sections: [
        {
          kind: "stats",
          items: [
            { value: "655", label: "فدان" },
            { value: "6,000", label: "وحدة سكنية" },
            { value: "1,505", label: "وحدة في المرحلة الأولى" },
            { value: "20K", label: "عدد السكان المتوقع" },
          ],
        },
        {
          kind: "list",
          title: "نظرة عامة",
          columns: 2,
          items: [
            "655 فدانًا تطوير متعدد الاستخدامات في شرق القاهرة",
            "6000 وحدة سكنية",
            "المرحلة الأولى: 1505 وحدة",
            "80% سكن فردي · 20% سكن متعدد",
            "55% مساحات مفتوحة · 18% نسبة البناء",
            "ممشى أخضر بطول 2 كم",
            "4 كم مخصصة للجري وركوب الدراجات",
            "110 آلاف م² مساحات تجارية",
          ],
        },
        {
          kind: "list",
          title: "المجتمع والخدمات",
          columns: 3,
          items: [
            "نادي سوديك الرياضي",
            "مدرسة دولية",
            "مول مجتمعي",
            "منطقة تجارية",
            "عيادات عائلية",
            "مسجد",
            "قاعة المدينة",
            "نقاط اجتماعية",
            "مركز مواصلات",
            "الممشى الأخضر / ذا رافين",
          ],
        },
        {
          kind: "table",
          title: "الموقع",
          columns: ["الوجهة", "زمن الوصول"],
          rows: [
            ["القاهرة الجديدة", "25 دقيقة"],
            ["العاصمة الإدارية الجديدة", "25 دقيقة"],
            ["مطار القاهرة الدولي", "25 دقيقة"],
            ["محطة القطار الكهربائي", "10 دقائق"],
          ],
        },
        {
          kind: "note",
          text: "يقع المشروع داخل سوديك إيست في هليوبوليس الجديدة، بين القاهرة الجديدة والعاصمة الإدارية الجديدة.",
        },
      ],
    },
    amenities: {
      id: "amenities",
      kicker: "النادي الرياضي والمجتمع",
      title: "الخدمات",
      lede:
        "المرحلة الأولى من نادي سوديك الرياضي على مساحة 40 فدانًا مكتملة وتعمل — من أكبر النوادي في شرق القاهرة — ويحيط بها مدرسة دولية ومول مجتمعي وعيادات عائلية وقاعة مدينة.",
      image: "/img/lakes-garden.jpg",
      cta: "اطلب الملف الكامل",
      sections: [
        {
          kind: "stats",
          items: [
            { value: "8", label: "ملاعب تنس" },
            { value: "6", label: "ملاعب إسكواش" },
            { value: "4", label: "ملاعب بادل" },
            { value: "3", label: "حمامات سباحة" },
          ],
        },
        {
          kind: "list",
          title: "نادي سوديك الرياضي",
          columns: 2,
          items: [
            "ملعب كرة قدم 11 لاعبًا",
            "ملاعب كرة قدم 5 لاعبين",
            "8 ملاعب تنس",
            "6 ملاعب إسكواش",
            "4 ملاعب بادل",
            "حمام سباحة أولمبي ونصف أولمبي",
            "حمام سباحة للأطفال",
            "جمباز وفنون قتالية",
            "قرية أطفال",
            "ساحة لياقة خارجية",
            "صحة وعافية",
            "مطاعم وكافيهات",
            "صالات واستوديوهات رياضية",
          ],
        },
        {
          kind: "list",
          title: "المجتمع",
          columns: 2,
          items: [
            "مدرسة دولية",
            "مول مجتمعي",
            "منطقة تجارية",
            "عيادات عائلية",
            "مسجد",
            "قاعة مدينة",
            "نقاط اجتماعية",
            "مركز مواصلات",
            "ممشى أخضر بطول 2 كم",
            "4 كم للجري وركوب الدراجات",
          ],
        },
        {
          kind: "list",
          title: "الحياة حول المياه في البحيرات",
          columns: 2,
          items: [
            "بحيرة مركزية صالحة للسباحة بشاطئ رملي وجزيرة",
            "كشك مقهى وأرصفة على المياه",
            "بحيرات ثانوية داخل المجموعات السكنية",
            "حديقة مائية تربط الحي",
            "حدائق مظللة وأركان قراءة",
            "مناطق أطفال وحدائق نزهة ولياقة خارجية",
          ],
        },
      ],
    },
    collection: {
      id: "collection",
      kicker: "المتاح · مرحلتان",
      title: "المجموعة",
      lede:
        "112 وحدة متاحة في مرحلتي سوديك إيست — شقق وتاون هاوس وفيلات من 125 م² إلى 392 م²، بمواعيد تسليم تمتد من ديسمبر 2026 حتى نهاية 2029.",
      image: "/img/lakes-walk.jpg",
      cta: "اطلب الملف الكامل",
      sections: [
        {
          kind: "stats",
          items: [
            { value: "112", label: "وحدة متاحة" },
            { value: "2", label: "مرحلتان" },
            { value: "125–392", label: "نطاق المساحة (م²)" },
            { value: "2026–29", label: "نافذة التسليم" },
          ],
        },
        {
          kind: "table",
          title: "سوديك إيست 2 · التسليم 31 ديسمبر 2029",
          columns: ["النوع", "غرف", "التشطيب", "المساحة م²", "السعر جنيه", "التسليم"],
          rows: [
            ["تاون هاوس", "3", "على الطوب", "234", "39,846,000", "جاهز"],
            ["تاون هاوس", "3", "كامل", "201–208", "29,172,000 – 36,234,000", "31/12/2029"],
            ["فيلا", "3", "كامل", "208–232", "40,003,000 – 44,098,000", "31/12/2029"],
            ["فيلا", "4", "كامل", "300", "52,103,000 – 52,834,000", "31/12/2029"],
          ],
        },
        {
          kind: "table",
          title: "سوديك إيست 2 · التسليم 30 ديسمبر 2026 – 30 سبتمبر 2027",
          columns: ["النوع", "غرف", "التشطيب", "المساحة م²", "السعر جنيه", "التسليم"],
          rows: [
            ["شقة", "2", "كامل", "125–141", "14,348,000 – 17,950,000", "30/12/2026 – 30/09/2027"],
            ["شقة", "3", "على الطوب", "183–223", "25,077,000 – 31,794,000", "30/09/2027"],
            ["شقة", "3", "كامل", "153–225", "17,220,000 – 26,252,000", "30/12/2026"],
            ["فيلا", "3", "على الطوب", "237", "50,558,000", "30/09/2027"],
            ["فيلا", "4", "على الطوب", "326", "53,015,000 – 58,463,000", "30/09/2027"],
            ["فيلا", "5", "على الطوب", "392", "62,620,000 – 71,339,000", "30/09/2027"],
          ],
        },
        {
          kind: "note",
          text: "بيانات معتمدة من مبيعات سوديك. الأسعار مرتبطة بالمتاح وقابلة للتغيير دون إشعار. تفاصيل مرحلة 08M وحدة بوحدة موجودة في مربع المرحلة.",
        },
      ],
    },
    payment: {
      id: "payment",
      kicker: "الأسعار والسداد",
      title: "بدون مقدم",
      lede:
        "صفر مقدم مع تقسيط على عشر سنوات — النظام المعروض في البحيرات ومراحل سوديك إيست الحالية. تسليم الشقق المكتملة يبدأ ديسمبر 2026.",
      image: "/img/lakes-sunset.jpg",
      cta: "اطلب الملف الكامل",
      sections: [
        {
          kind: "stats",
          items: [
            { value: "0%", label: "مقدم الحجز" },
            { value: "10 سنوات", label: "مدة التقسيط" },
            { value: "120", label: "قسط شهري" },
            { value: "ديسمبر 2026", label: "أول تسليم" },
          ],
        },
        {
          kind: "prices",
          title: "كيف يبدو الرقم",
          rows: [
            { label: "شقة غرفة نوم", area: "من 6.7 مليون", price: "6,700,000", monthly: "55,833" },
            { label: "شقة غرفتين", area: "من 10.9 مليون", price: "10,900,000", monthly: "90,833" },
            { label: "شقة 3 غرف", area: "من 13.2 مليون", price: "13,200,000", monthly: "110,000" },
            { label: "3 غرف + مربية", area: "من 14.1 مليون", price: "14,100,000", monthly: "117,500" },
            { label: "08M · غرفتان", area: "من 15.03 مليون", price: "15,030,000", monthly: "125,250" },
            { label: "08M · 3 غرف + مربية", area: "من 26.25 مليون", price: "26,252,000", monthly: "218,767" },
          ],
        },
        {
          kind: "note",
          text: "الأرقام الشهرية إرشادية فقط: إجمالي السعر مقسومًا على 120 شهرًا بفائدة 0%. الجدول المُلزم وشروط الحجز وأي وديعة صيانة يتم تأكيدها كتابةً.",
        },
        {
          kind: "list",
          title: "ما تحتاجه للحجز",
          columns: 1,
          items: [
            "كود الوحدة ومخطط الوحدة التي ترغب فيها",
            "نموذج الحجز موقّع مع المطور",
            "الرقم القومي أو جواز السفر للتعاقد",
            "موعد التسليم ومواصفات التشطيب لهذه المرحلة",
          ],
        },
      ],
    },
  },
};

const LRI = "\u2066";
const PDI = "\u2069";
const NUM_CHUNK = /[A-Za-z0-9][A-Za-z0-9,.\/\u2013\-+%]*(?:\s*[\u2013\-]\s*[A-Za-z0-9][A-Za-z0-9,.\/\u2013\-+%]*)*/g;
const SKIP_KEYS = new Set(["id", "src", "image", "kind"]);

const isolateText = (s: string) =>
  /^\//.test(s) || /^(https?:|tel:|mailto:)/.test(s) ? s : s.replace(NUM_CHUNK, (m) => LRI + m + PDI);

function isolateDeep<T>(value: T, key?: string): T {
  if (typeof value === "string") {
    return (SKIP_KEYS.has(key ?? "") ? value : isolateText(value)) as unknown as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => isolateDeep(item)) as unknown as T;
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = isolateDeep(v, k);
    }
    return out as T;
  }
  return value;
}

export const content: Record<Lang, Content> = { en, ar: isolateDeep(ar) };

export type Contact = {
  name: Record<Lang, string>;
  phoneLabel: string;
  phoneHref: string;
  whatsapp: string;
  whatsappMessage: Record<Lang, string>;
};

export const contact: Contact = {
  name: { en: "Seif El Din Tarek", ar: "سيف الدين طارق" },
  phoneLabel: "0100 950 0083",
  phoneHref: "tel:+201009500083",
  whatsapp: "https://wa.me/201009500083",
  whatsappMessage: {
    en: "Hello Seif, I am interested in SODIC East — please send me the layouts and payment plan.",
    ar: "أهلاً سيف، مهتم بمشروع سوديك إيست — من فضلك ابعتلي المخططات وخطة السداد.",
  },
};

export const whatsappLink = (c: Contact, lang: Lang) =>
  c.whatsapp + "?text=" + encodeURIComponent(c.whatsappMessage[lang]);

export const formatEGP = (value: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);