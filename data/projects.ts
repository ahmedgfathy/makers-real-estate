/**
 * SODIC project catalogue — the seed for the `projects` table in PostgreSQL.
 *
 * Compiled from the SODIC sales material in `data/sodic-projects/` (fact sheets,
 * briefs, launch documents and brochures). Figures are the published starting
 * points; availability and prices change, so treat them as reference data and
 * update them from the sales team's latest sheets.
 *
 * Edit here, then run `npm run db:seed` to publish to the CRM.
 */

export type ProjectRegion = "east-cairo" | "new-cairo" | "west-cairo" | "north-coast";

export type ProjectCategory = "residential" | "mixed-use" | "commercial" | "branded" | "serviced";

export type ProjectStatus = "launching" | "selling" | "delivering" | "sold-out" | "completed";

export type ProjectUnit = {
  name: string;
  nameAr?: string;
  bedrooms?: number | null;
  areaFrom?: number | null;
  areaTo?: number | null;
  priceFrom?: number | null;
  finishing?: string | null;
  note?: string | null;
};

export type ProjectSeed = {
  slug: string;
  name: string;
  nameAr: string;
  region: ProjectRegion;
  location: string;
  category: ProjectCategory;
  status: ProjectStatus;
  tagline: string;
  taglineAr: string;
  description: string;
  descriptionAr: string;
  priceFrom: number | null;
  paymentPlan: string | null;
  paymentPlanAr: string | null;
  finishing: string | null;
  unitTypes: ProjectUnit[];
  amenities: string[];
  locationNotes: string[];
  heroImage: string | null;
  brochure: string | null;
  masterplan: string | null;
  position: number;
  /** Initial public state; the CRM publish switch is authoritative after seeding. */
  published?: boolean;
};

export const REGIONS: Record<ProjectRegion, { en: string; ar: string }> = {
  "east-cairo": { en: "East Cairo", ar: "شرق القاهرة" },
  "new-cairo": { en: "New Cairo", ar: "القاهرة الجديدة" },
  "west-cairo": { en: "West Cairo", ar: "غرب القاهرة" },
  "north-coast": { en: "North Coast", ar: "الساحل الشمالي" },
};

export const CATEGORIES: Record<ProjectCategory, { en: string; ar: string }> = {
  residential: { en: "Residential", ar: "سكني" },
  "mixed-use": { en: "Mixed-use", ar: "متعدد الاستخدامات" },
  commercial: { en: "Commercial", ar: "تجاري" },
  branded: { en: "Branded residences", ar: "وحدات بعلامة تجارية" },
  serviced: { en: "Serviced residences", ar: "وحدات مخدومة" },
};

export const STATUSES: Record<ProjectStatus, { en: string; ar: string }> = {
  launching: { en: "Launching", ar: "قيد الإطلاق" },
  selling: { en: "Selling", ar: "متاح للبيع" },
  delivering: { en: "Delivering", ar: "قيد التسليم" },
  "sold-out": { en: "Sold out", ar: "مباع بالكامل" },
  completed: { en: "Completed", ar: "مكتمل" },
};

export const projects: ProjectSeed[] = [
  /* ------------------------------------------------------------------ */
  /* East Cairo                                                          */
  /* ------------------------------------------------------------------ */
  {
    slug: "sodic-east",
    name: "SODIC East",
    nameAr: "سوديك إيست",
    region: "east-cairo",
    location: "New Heliopolis, East Cairo",
    category: "mixed-use",
    status: "selling",
    tagline: "655 acres of neighbourhoods built around open air",
    taglineAr: "٦٥٥ فدانًا من الأحياء المحيطة بالمساحات المفتوحة",
    description:
      "A 655-acre mixed-use development in New Heliopolis, between New Cairo and the New Administrative Capital. Over 84% of the masterplan is open and green space; homes are parcelled into neighbourhoods designed around outdoor living, with a 2 km green spine, a 4 km jogging and cycling lane, an international school, Club S and a retail hub.",
    descriptionAr:
      "مشروع متعدد الاستخدامات بمساحة ٦٥٥ فدانًا في هليوبوليس الجديدة، بين القاهرة الجديدة والعاصمة الإدارية. أكثر من ٨٤٪ من المخطط مساحات مفتوحة وخضراء، مع حيوية تصميمية حول الحياة الخارجية، وممر أخضر بطول ٢ كم، ومسار للجري والدراجات بطول ٤ كم، ومدرسة دولية، ونادي Club S، ومنطقة تجارية.",
    priceFrom: 6_700_000,
    paymentPlan: "The Lakes: 0% down payment · installments over 10 years",
    paymentPlanAr: "ذا ليكس: بدون مقدم · تقسيط حتى ١٠ سنوات",
    finishing: "Core & shell and fully finished, depending on the neighbourhood",
    unitTypes: [
      { name: "The Lakes · 1–4 bedroom apartments & duplexes", nameAr: "ذا ليكس · شقق ودوبلكس بغرف نوم ١–٤", areaFrom: 76, areaTo: 200, priceFrom: 6_700_000, finishing: "Flexi Plus finish" },
      { name: "Azailya · Apartments", nameAr: "أزالية · شقق", areaFrom: 116, finishing: "Finished" },
      { name: "Oak · Apartments", nameAr: "أوك · شقق", areaFrom: 125, finishing: "Fully finished" },
      { name: "Camellia · Houses", nameAr: "كاميليا · منازل", areaFrom: 183, finishing: "Fully finished" },
      { name: "Orchid · Villas, twin houses & townhouses", nameAr: "أوركيد · فيلات وتوين وتاون هاوس", areaFrom: 234 },
      { name: "Rosewood · Standalone villas, family houses & townhouses", nameAr: "روزوود · فيلات مستقلة ومنازل عائلية وتاون هاوس", finishing: "Core & shell" },
      { name: "Meadows · Single-family homes", nameAr: "ميدوز · منازل عائلية", finishing: "Fully finished with smart home" },
      { name: "Hazel · Single-family units", nameAr: "هازل · وحدات عائلية", finishing: "Fully finished" },
    ],
    amenities: [
      "The Finnish British School",
      "Club S sports club, academies and wellness",
      "2 km green spine and 4 km jogging & cycling lane",
      "The Ravine and family parks",
      "Retail hub with restaurants",
      "International school, town hall and mosque",
      "Family clinics and neighbourhood services",
      "Community mall and transportation hub",
    ],
    locationNotes: [
      "5 minutes to El Shorouk",
      "10 minutes to the LRT station",
      "20 minutes to New Cairo",
      "25 minutes to the New Capital",
      "25 minutes to Cairo International Airport",
    ],
    heroImage: "/img/hero-poster.jpg",
    brochure: "sodic-projects/drive-download-20261028T185707Z-1-001/10. BRIEFS & FACT SHEET/Brief - SODIC East.pdf",
    masterplan: "sodic-projects/drive-download-20261028T185707Z-1-001/2. SODIC EAST/SODIC EAST - All Master Plans.pdf",
    position: 1,
  },
  {
    slug: "the-lakes",
    name: "The Lakes",
    nameAr: "ذا ليكس",
    region: "east-cairo",
    location: "SODIC East, New Heliopolis",
    category: "residential",
    status: "selling",
    tagline: "Life around water inside SODIC East",
    taglineAr: "حياة حول الماء داخل سوديك إيست",
    description:
      "A multi-family neighbourhood within SODIC East built around a swimmable central lagoon with a sandy shoreline, central island and café pavilion. Homes are 1–4 bedroom apartments and duplexes with flexible layouts, wrapped by secondary lakes, a water garden and shaded reading nooks.",
    descriptionAr:
      "حي سكني داخل سوديك إيست يلتف حول بحيرة مركزية صالحة للسباحة بشاطئ رملي وجزيرة مركزية ومقهى. الوحدات شقق ودوبلكس بغرف نوم من ١ إلى ٤ بمساحات مرنة، تحيط بها بحيرات ثانوية وحديقة مائية وأماكن هادئة للقراءة.",
    priceFrom: 6_700_000,
    paymentPlan: "0% down payment · installments over 10 years",
    paymentPlanAr: "بدون مقدم · تقسيط حتى ١٠ سنوات",
    finishing: "Flexi Plus finish",
    unitTypes: [
      { name: "1-bedroom apartment", nameAr: "شقة غرفة نوم", bedrooms: 1, areaFrom: 76, priceFrom: 6_700_000 },
      { name: "2-bedroom apartment", nameAr: "شقة غرفتين", bedrooms: 2, areaFrom: 123, priceFrom: 10_900_000 },
      { name: "2-bedroom + nanny apartment", nameAr: "شقة غرفتين + غرفة مربية", bedrooms: 2, areaFrom: 127, priceFrom: 11_200_000 },
      { name: "3-bedroom apartment", nameAr: "شقة ٣ غرف", bedrooms: 3, areaFrom: 149, priceFrom: 13_200_000 },
      { name: "3-bedroom + nanny apartment", nameAr: "شقة ٣ غرف + مربية", bedrooms: 3, areaFrom: 160, priceFrom: 14_100_000 },
      { name: "3-bedroom duplex", nameAr: "دوبلكس ٣ غرف", bedrooms: 3, areaFrom: 200, priceFrom: 17_700_000 },
      { name: "4-bedroom + nanny apartment", nameAr: "شقة ٤ غرف + مربية", bedrooms: 4, areaFrom: 199, priceFrom: 17_500_000 },
    ],
    amenities: [
      "Swimmable central lagoon with sandy shoreline",
      "Central island and café pavilion",
      "Waterfront decks and secondary lakes",
      "Water garden for walking, jogging and cycling",
      "Kids' areas and family picnic gardens",
      "Outdoor fitness, BBQ areas and fire pits",
      "Shaded gardens, reading nooks and working pods",
      "Flexible rooms: roof pergola, glass room, guest toilet",
    ],
    locationNotes: [
      "Part of SODIC East, New Heliopolis",
      "25 minutes to New Cairo",
      "25 minutes to the New Capital",
      "25 minutes to Cairo International Airport",
      "10 minutes to the LRT station",
    ],
    heroImage: "/img/lakes-beach.jpg",
    brochure: "The Lakes - SODIC East - Factsheet.pdf",
    masterplan: "sodic-projects/drive-download-20261028T185707Z-1-001/2. SODIC EAST/SODIC EAST - All Master Plans.pdf",
    position: 2,
  },
  {
    slug: "eastvale",
    name: "EastVale",
    nameAr: "إيست فيل",
    region: "east-cairo",
    location: "MADA City, East Cairo",
    category: "mixed-use",
    status: "launching",
    tagline: "4,500 homes on a 13% footprint",
    taglineAr: "٤٥٠٠ وحدة على ١٣٪ من المساحة",
    description:
      "A mixed-use community in MADA City masterplanned by EDSA, with homes by Australian architect PBD. Phase one releases 1,450 of 4,500 units across a 13% built footprint: 85% single-family homes and 15% apartments, connected by a 1.3 km Wellness Boulevard, garden trails and a 15-feddan Club S.",
    descriptionAr:
      "مجتمع متعدد الاستخدامات في مدينة مدى بمخطط عام من EDSA وتصميم وحدات من المعماري الأسترالي PBD. المرحلة الأولى تضم ١٤٥٠ وحدة من إجمالي ٤٥٠٠، على مساحة بناء ١٣٪: ٨٥٪ منازل عائلية و١٥٪ شقق، يربطها ممشى العافية بطول ١.٣ كم ومسارات حدائق ونادي Club S على ١٥ فدانًا.",
    priceFrom: 8_500_000,
    paymentPlan: "5% down payment · up to 9 years",
    paymentPlanAr: "مقدم ٥٪ · تقسيط حتى ٩ سنوات",
    finishing: "Fully finished with ACs",
    unitTypes: [
      { name: "Large villa", nameAr: "فيلا كبيرة", bedrooms: 5, areaFrom: 310, priceFrom: 55_900_000 },
      { name: "Medium villa", nameAr: "فيلا متوسطة", bedrooms: 4, areaFrom: 250, priceFrom: 49_900_000 },
      { name: "Small villa", nameAr: "فيلا صغيرة", bedrooms: 3, areaFrom: 220, priceFrom: 44_800_000 },
      { name: "Urban villa", nameAr: "فيلا حضرية", bedrooms: 3, areaFrom: 215, priceFrom: 39_200_000, note: "Includes a penthouse" },
      { name: "Twinhouse", nameAr: "توين هاوس", bedrooms: 4, areaFrom: 217, priceFrom: 34_500_000 },
      { name: "Townhouse", nameAr: "تاون هاوس", bedrooms: 3, areaFrom: 180, priceFrom: 27_900_000 },
      { name: "1-bedroom apartment", nameAr: "شقة غرفة نوم", bedrooms: 1, areaFrom: 80, priceFrom: 8_500_000, note: "Fourth floor only" },
      { name: "2-bedroom apartment", nameAr: "شقة غرفتين", bedrooms: 2, areaFrom: 125, priceFrom: 12_900_000 },
      { name: "3-bedroom + nanny apartment", nameAr: "شقة ٣ غرف + مربية", bedrooms: 3, areaFrom: 175, priceFrom: 16_500_000 },
    ],
    amenities: [
      "1.3 km Wellness Boulevard, 80 m wide",
      "Wellness Club",
      "Club S on 15 feddan",
      "Garden trails connecting all neighbourhoods",
      "Sports and recreational facilities",
      "Retail village on Mehwar El Amal",
      "Business district with offices, F&B and retail",
      "85% single-family, 13% built footprint",
    ],
    locationNotes: [
      "MADA City, East Cairo",
      "Masterplan by EDSA",
      "Homes by PBD architects",
      "1,450 units launching in phase one",
    ],
    heroImage: null,
    brochure: "sodic-projects/drive-download-20261028T185707Z-1-001/1. EASTVALE/EAST VALE LAUNCH.pdf",
    masterplan: "sodic-projects/drive-download-20261028T185707Z-1-001/1. EASTVALE/Eastvale Masterplan - Villas.pdf",
    position: 3,
  },

  /* ------------------------------------------------------------------ */
  /* New Cairo                                                           */
  /* ------------------------------------------------------------------ */
  {
    slug: "v-residence",
    name: "V Residence",
    nameAr: "في ريزيدنس",
    region: "new-cairo",
    location: "Villette, New Cairo",
    category: "residential",
    status: "selling",
    tagline: "Signature apartments in Villette",
    taglineAr: "شقق مميزة في فيليت",
    description:
      "A signature apartment community in Villette, New Cairo, with high-end homes overlooking landscaped greenery. Residents get the convenience of apartment living inside a full SODIC community: swimming lagoons, cycling and walking trails, and Club S with CrossFit, yoga, gym, courts and tennis.",
    descriptionAr:
      "مجتمع سكني مميز في فيليت بالقاهرة الجديدة، بشقق راقية تطل على مساحات خضراء منسقة. يجمع بين سهولة السكن في شقق وخدمات مجتمع سوديك الكاملة: بحيرات سباحة، مسارات للدراجات والمشي، ونادي Club S للكروس فيت واليوجا والجيم والملاعب والتنس.",
    priceFrom: null,
    paymentPlan: null,
    paymentPlanAr: null,
    finishing: null,
    unitTypes: [
      { name: "2-bedroom apartment", nameAr: "شقة غرفتين", bedrooms: 2, areaFrom: 137 },
      { name: "3-bedroom apartment", nameAr: "شقة ٣ غرف", bedrooms: 3, areaFrom: 173 },
    ],
    amenities: [
      "Swimming lagoons within walking distance",
      "Green spaces for cycling and strolling",
      "Club S with CrossFit, yoga and gym",
      "Sports fields and tennis courts",
      "Views over greenery and the skyline",
    ],
    locationNotes: [
      "Direct access to Road 90",
      "5 minutes to Eastown Residences and EDNC",
      "10 minutes to AUC",
      "15 minutes to the Cairo–Sokhna Road",
      "25 minutes to Cairo Airport",
    ],
    heroImage: "/projects/v-residence.jpg",
    brochure: "sodic-projects/drive-download-20261028T185707Z-1-001/10. BRIEFS & FACT SHEET/Brief - V Residences.pdf",
    masterplan: "sodic-projects/drive-download-20261028T185707Z-1-001/8. V RESIDENCE/BROCHURES AND MASTERPLANS/V Residence Foldout Masterplan.pdf",
    position: 4,
  },

  /* ------------------------------------------------------------------ */
  /* West Cairo                                                          */
  /* ------------------------------------------------------------------ */
  {
    slug: "the-estates",
    name: "The Estates",
    nameAr: "ذا إستيتس",
    region: "west-cairo",
    location: "New Zayed, West Cairo",
    category: "residential",
    status: "selling",
    tagline: "A signature community in 90% greenery",
    taglineAr: "مجتمع مميز تحيط به ٩٠٪ من المساحات الخضراء",
    description:
      "A signature villa community in New Zayed where homes are spaced well apart and integrated into the landscape. 90% of the masterplan is green, with gardens and lakes running up to 150 metres and a 2.4 km route enclosing every cluster.",
    descriptionAr:
      "مجتمع فيلات مميز في الشيخ زايد الجديدة، تتباعد فيه المنازل وتندمج مع الطبيعة. ٩٠٪ من المخطط مساحات خضراء، بحدائق وبحيرات تمتد حتى ١٥٠ مترًا، ومسار بطول ٢.٤ كم يحيط بكل مجموعة.",
    priceFrom: null,
    paymentPlan: null,
    paymentPlanAr: null,
    finishing: null,
    unitTypes: [
      { name: "The Cottage", nameAr: "الكوتيدج", areaFrom: 308.4 },
      { name: "The Chateau", nameAr: "الشاتو", areaFrom: 290 },
      { name: "The Ranch", nameAr: "الرانش", areaFrom: 432 },
      { name: "The Country House", nameAr: "كانتري هاوس", areaFrom: 348.1 },
    ],
    amenities: [
      "Gardens and lakes spanning up to 150 m",
      "2.4 km route enclosing every cluster",
      "90% of the masterplan is green",
      "Personalised wellness treatment plans",
      "Panoramic views through large glass windows",
    ],
    locationNotes: [
      "2 minutes to SODIC West",
      "3 minutes to Sphinx International Airport",
      "7 minutes to Mehwar",
      "15 minutes to the Grand Egyptian Museum",
    ],
    heroImage: null,
    brochure: "sodic-projects/drive-download-20261028T185707Z-1-001/10. BRIEFS & FACT SHEET/Brief - The Estates.pdf",
    masterplan: "sodic-projects/drive-download-20261028T185707Z-1-001/6. THE ESTATES/Brochure and Masterplans/Masterplan.pdf",
    position: 5,
  },
  {
    slug: "the-estates-residences",
    name: "The Estates Residences",
    nameAr: "ذا إستيتس ريزيدنسز",
    region: "west-cairo",
    location: "New Zayed, adjacent to The Estates",
    category: "residential",
    status: "selling",
    tagline: "Apartments and duplexes beside The Estates",
    taglineAr: "شقق ودوبلكس بجوار ذا إستيتس",
    description:
      "A neighbourhood of apartments, duplexes and villas next to The Estates in the heart of New Zayed, built around a green spine, parks and lakes. Amenities cover tennis, paddle, football, jogging, leisure and lap pools, outdoor gyms and multipurpose sports areas.",
    descriptionAr:
      "حي من الشقق والدوبلكس والفيلات بجوار ذا إستيتس في قلب الشيخ زايد الجديدة، يلتف حول ممر أخضر وحدائق وبحيرات. يضم ملاعب تنس وبادل وكرة قدم ومسارات جري ومسابح ترفيهية وأخرى للسباحة الطويلة وصالات رياضية خارجية.",
    priceFrom: null,
    paymentPlan: null,
    paymentPlanAr: null,
    finishing: "Fully finished",
    unitTypes: [
      { name: "Apartment", nameAr: "شقة", areaFrom: 129 },
      { name: "Duplex", nameAr: "دوبلكس", areaFrom: 280 },
      { name: "Villa · 3–4 bedrooms + nanny + penthouse", nameAr: "فيلا · ٣–٤ غرف + مربية + بنتهاوس", bedrooms: 4, areaFrom: 209.6, areaTo: 338 },
    ],
    amenities: [
      "Green parks, lakes and playgrounds",
      "BBQ areas and scenic parks",
      "Tennis, paddle, football and jogging",
      "Leisure and lap pools",
      "Outdoor gyms and multipurpose sports areas",
      "TV lounges and children's play areas",
      "Modern countryside architecture",
    ],
    locationNotes: [
      "Adjacent to The Estates, New Zayed",
      "Directly adjacent to the Cairo–Alex Highway",
      "Parallel to the Dabaa Road",
      "2 minutes to SODIC West",
      "3 minutes to Sphinx International Airport",
      "15 minutes to the Grand Egyptian Museum",
    ],
    heroImage: null,
    brochure: "sodic-projects/drive-download-20261028T185707Z-1-001/10. BRIEFS & FACT SHEET/Brief - The Estates Residences.pdf",
    masterplan: "sodic-projects/drive-download-20261028T185707Z-1-001/7. THE ESTATES RESIDENCES/Estates Residences -  Full Masterplan.pdf",
    position: 6,
  },
  {
    slug: "vye",
    name: "VYE",
    nameAr: "في",
    region: "west-cairo",
    location: "New Zayed, West Cairo",
    category: "residential",
    status: "delivering",
    tagline: "Live unlimited in New Zayed",
    taglineAr: "عِش بلا حدود في الشيخ زايد الجديدة",
    description:
      "A future-forward community in the heart of New Zayed designed by international architects. The masterplan is organised around The Drive, a green road connecting residents to SODIC West and Sheikh Zayed, and The Walk, a 3.7 km pedestrian and cycling route. VYE 09 delivers semi-finished townhouses and twin houses in 1.5 years; the RTM apartments are sold as VYE Neo and Nova.",
    descriptionAr:
      "مجتمع مستقبلي في قلب الشيخ زايد الجديدة بتصميم معماريين عالميين. ينظم المخطط حول The Drive، طريق أخضر يربط السكان بسوديك ويست والشيخ زايد، وThe Walk، مسار للمشي والدراجات بطول ٣.٧ كم. يسلّم VYE 09 تاون وتوين هاوس نصف تشطيب خلال سنة ونصف، وتُطرح شقق RTM باسم VYE Neo وNova.",
    priceFrom: null,
    paymentPlan: null,
    paymentPlanAr: null,
    finishing: "Semi-finished (VYE 09) · ready-to-move apartments",
    unitTypes: [
      { name: "Townhouses · VYE 09", nameAr: "تاون هاوس · VYE 09", note: "Semi-finished · delivery in 1.5 years" },
      { name: "Twin houses · VYE 09", nameAr: "توين هاوس · VYE 09", note: "Semi-finished · delivery in 1.5 years" },
      { name: "Apartments · VYE Neo / Nova", nameAr: "شقق · VYE Neo / Nova", note: "Ready to move" },
    ],
    amenities: [
      "The Drive green road",
      "The Walk · 3.7 km pedestrian and cycling route",
      "Future-forward architecture by international architects",
      "Minutes from SODIC West and Sheikh Zayed",
    ],
    locationNotes: [
      "Heart of New Zayed",
      "3 minutes to SODIC West",
      "5 minutes to Sphinx International Airport",
      "12 minutes to Sheikh Zayed",
      "Direct access to the Cairo–Alex Desert Road",
    ],
    heroImage: null,
    brochure: "sodic-projects/drive-download-20261028T185707Z-1-001/6. VYE & KARMELL/VYE/VYE 09 - Semi Finished Town and Twin Houses Delivery 1.5 Y/VYE SOL Homes Brochure.pdf",
    masterplan: "sodic-projects/drive-download-20261028T185707Z-1-001/6. VYE & KARMELL/Vye & Karmell FULL MASTERPLAN.pdf",
    position: 7,
  },
  {
    slug: "karmell",
    name: "Karmell",
    nameAr: "كارميل",
    region: "west-cairo",
    location: "New Zayed, West Cairo",
    category: "mixed-use",
    status: "selling",
    tagline: "A small town built around easy living",
    taglineAr: "بلدة صغيرة حولها الحياة السهلة",
    description:
      "A walkable small town in the heart of New Zayed with shops on every corner and nature woven into everyday life. Karmell 01 offers core-and-shell and fully finished apartments and duplexes; Karmell 05 adds standalone villas. The 3.7 km Walk, Downtown Karmell, Oak Grove and the Club S clubhouse anchor daily life.",
    descriptionAr:
      "بلدة صغيرة قابلة للمشي في قلب الشيخ زايد الجديدة، تنتشر فيها المحلات وتتداخل الطبيعة مع الحياة اليومية. يضم Karmell 01 شققًا ودوبلكس بنظامي الهيكل الخرساني والتشطيب الكامل، ويضيف Karmell 05 فيلات مستقلة. ويشكل ممشى ٣.٧ كم ووسط كارميل وأوك جروف ونادي Club S محور الحياة اليومية.",
    priceFrom: null,
    paymentPlan: null,
    paymentPlanAr: null,
    finishing: "Core & shell and fully finished",
    unitTypes: [
      { name: "Apartment", nameAr: "شقة", areaFrom: 81.92 },
      { name: "House", nameAr: "منزل", areaFrom: 182.64 },
      { name: "Standalone villa · Karmell 05", nameAr: "فيلا مستقلة · Karmell 05", areaFrom: 276.53 },
      { name: "Duplex · Karmell 01", nameAr: "دوبلكس · Karmell 01" },
    ],
    amenities: [
      "The Walk · 3.7 km pedestrian and cycling trail",
      "Downtown Karmell retail",
      "Oak Grove gardening plots",
      "Club S clubhouse",
      "VYE Town Centre offices",
      "Pharmacies, supermarkets, nurseries and clinics within walking distance",
    ],
    locationNotes: [
      "Heart of New Zayed",
      "Direct access to the Dabaa / Rod El Farag axis",
      "10 minutes to SODIC West",
      "25 minutes to Lebanon Square",
    ],
    heroImage: null,
    brochure: "sodic-projects/drive-download-20261028T185707Z-1-001/10. BRIEFS & FACT SHEET/Brief - Karmell.pdf",
    masterplan: "sodic-projects/drive-download-20261028T185707Z-1-001/6. VYE & KARMELL/Vye & Karmell FULL MASTERPLAN.pdf",
    position: 8,
  },
  {
    slug: "sodic-west",
    name: "SODIC West",
    nameAr: "سوديك ويست",
    region: "west-cairo",
    location: "Sheikh Zayed, West Cairo",
    category: "mixed-use",
    status: "completed",
    tagline: "West Cairo's original mixed-use district",
    taglineAr: "أول حي متعدد الاستخدامات في غرب القاهرة",
    description:
      "SODIC's flagship district in Sheikh Zayed, home to Allegria, Forty West, The Courtyards and Westown Residences alongside the Westown business park, The Portal, The Polygon, schools, retail and medical facilities. The commercial component alone spans 135,000 sqm of built-up area, 2,300 retail units, 635 office spaces and 250 parking plots.",
    descriptionAr:
      "الحي الرئيسي لسوديك في الشيخ زايد، ويضم أليجريا وفورتي ويست والكورت ياردز ووحدات ويستاون السكنية، إلى جانب مجمع ويستاون للأعمال وذا بورتال وذا بوليجون والمدارس والتجزئة والمنشآت الطبية. تبلغ مساحة الجزء التجاري ١٣٥ ألف متر مربع، و٢٣٠٠ وحدة تجزئة، و٦٣٥ مساحة مكتبية، و٢٥٠ موقف سيارات.",
    priceFrom: null,
    paymentPlan: null,
    paymentPlanAr: null,
    finishing: null,
    unitTypes: [
      { name: "Allegria · Villas", nameAr: "أليجريا · فيلات" },
      { name: "Forty West · Apartments", nameAr: "فورتي ويست · شقق" },
      { name: "The Courtyards · Residences", nameAr: "الكورت ياردز · وحدات سكنية" },
      { name: "Westown Residences · Apartments", nameAr: "ويستاون ريزيدنسز · شقق" },
    ],
    amenities: [
      "Westown business park",
      "The Portal and The Polygon offices",
      "2,300 retail units",
      "Schools and medical facilities",
      "44 m pedestrian green spine",
      "Direct access to the Cairo–Alex Desert Road",
    ],
    locationNotes: [
      "Sheikh Zayed, West Cairo",
      "Direct access to the Cairo–Alex Desert Road",
      "Dahshour Road connects SODIC West to 6th of October",
      "Minutes from Juhayna Square and Arkan Plaza",
    ],
    heroImage: null,
    brochure: "sodic-projects/drive-download-20261028T185707Z-1-001/10. BRIEFS & FACT SHEET/SODIC West- Commercial & Residential .pdf",
    masterplan: null,
    position: 9,
  },
  {
    slug: "the-portal",
    name: "The Portal",
    nameAr: "ذا بورتال",
    region: "west-cairo",
    location: "Westown, SODIC West",
    category: "commercial",
    status: "completed",
    tagline: "Class-A offices on the Westown green spine",
    taglineAr: "مكاتب من الفئة الأولى على الممر الأخضر في ويستاون",
    description:
      "A 31,300 sqm business complex of two premium buildings at the north-east end of Westown, overlooking The Polygon and the 44 m pedestrian green spine. Offices are fully finished from 110 sqm, with a double-height lobby, shared business lounge, two-level underground parking, 24/7 access and central chilled water.",
    descriptionAr:
      "مجمع أعمال بمساحة ٣١٣٠٠ متر مربع من مبنيين متميزين في الطرف الشمالي الشرقي من ويستاون، يطل على ذا بوليجون والممر الأخضر بعرض ٤٤ مترًا. مكاتب بتشطيب كامل تبدأ من ١١٠ متر مربع، مع لوبي بارتفاع مزدوج وصالة أعمال مشتركة وجراج تحت الأرض من طابقين وتشغيل ٢٤/٧ وتبريد مركزي.",
    priceFrom: null,
    paymentPlan: null,
    paymentPlanAr: null,
    finishing: "Fully finished offices",
    unitTypes: [
      { name: "Office", nameAr: "مكتب", areaFrom: 110 },
      { name: "Retail · ground floor", nameAr: "تجزئة · الدور الأرضي" },
    ],
    amenities: [
      "Double-height lobby and front desk",
      "Shared business lounge and business services",
      "High-speed WiFi and 24/7 access",
      "Two-level underground parking",
      "Provision for private bathrooms in all units",
      "Central chilled water plant and advanced FF system",
      "CCTV and security patrols",
      "Housekeeping and maintenance",
    ],
    locationNotes: [
      "Westown, SODIC West, Sheikh Zayed",
      "Overlooks The Polygon",
      "On the 44 m pedestrian green spine",
      "2 minutes from Sphinx International Airport",
      "Direct access to the Cairo–Alex Desert Road",
    ],
    heroImage: null,
    brochure: "sodic-projects/drive-download-20261028T185707Z-1-001/9. PORTAL/SODIC- The Portal Brochure.pdf",
    masterplan: null,
    position: 10,
  },
  {
    slug: "the-polygon",
    name: "The Polygon",
    nameAr: "ذا بوليجون",
    region: "west-cairo",
    location: "Westown, SODIC West",
    category: "commercial",
    status: "completed",
    tagline: "Westown's first business park",
    taglineAr: "أول مجمع أعمال في ويستاون",
    description:
      "Launched in 2009 and designed by Wilkinson Eyre, The Polygon is SODIC West's original business park. Polygon X offers spaces from 199 sqm and Polygon 9 from 276 sqm, serving a catchment of more than 40,000 residents.",
    descriptionAr:
      "أُطلق عام ٢٠٠٩ بتصميم مكتب Wilkinson Eyre، وهو مجمع الأعمال الأول في سوديك ويست. يوفر Polygon X مساحات من ١٩٩ متر مربع وPolygon 9 من ٢٧٦ متر مربع، ويخدم أكثر من ٤٠ ألف ساكن.",
    priceFrom: null,
    paymentPlan: null,
    paymentPlanAr: null,
    finishing: null,
    unitTypes: [
      { name: "Polygon X", nameAr: "بوليجون X", areaFrom: 199 },
      { name: "Polygon 9", nameAr: "بوليجون ٩", areaFrom: 276 },
    ],
    amenities: [
      "Business park by Wilkinson Eyre",
      "Offices, F&B and retail",
      "Direct access to The Portal and The Spine",
      "Catchment of over 40,000 residents",
    ],
    locationNotes: [
      "Westown, SODIC West, Sheikh Zayed",
      "Overlooks the Westown green spine",
      "Adjacent to The Portal",
      "Direct access to the Cairo–Alex Desert Road",
    ],
    heroImage: null,
    brochure: "sodic-projects/drive-download-20261028T185707Z-1-001/10. BRIEFS & FACT SHEET/Brief - Commercial.pdf",
    masterplan: null,
    position: 11,
  },
  {
    slug: "sodic-medical-district",
    name: "SODIC Medical District",
    nameAr: "الحي الطبي سوديك",
    region: "west-cairo",
    location: "SODIC West, Sheikh Zayed",
    category: "commercial",
    status: "selling",
    tagline: "Fully finished clinics in West Cairo",
    taglineAr: "عيادات بتشطيب كامل في غرب القاهرة",
    description:
      "An exclusive medical address inside SODIC West with fully finished clinics from 117 sqm, 24/7 security and banking and money exchange nearby. Positioned on the Boulevard alongside offices, F&B and retail with direct access to The Portal, The Polygon and The Spine.",
    descriptionAr:
      "عنوان طبي متميز داخل سوديك ويست بعيادات بتشطيب كامل تبدأ من ١١٧ متر مربع، مع أمن على مدار الساعة وخدمات بنكية قريبة. يقع على البوليفارد بجوار المكاتب والمطاعم والتجزئة مع وصول مباشر إلى ذا بورتال وذا بوليجون والممر.",
    priceFrom: null,
    paymentPlan: null,
    paymentPlanAr: null,
    finishing: "Fully finished clinics",
    unitTypes: [{ name: "Clinic", nameAr: "عيادة", areaFrom: 117 }],
    amenities: [
      "World-class medical facilities",
      "24/7 security",
      "Banking services and money exchange",
      "Offices, F&B and retail on the Boulevard",
      "Direct access to The Portal, The Polygon and The Spine",
    ],
    locationNotes: [
      "SODIC West, Sheikh Zayed",
      "Overlooking the Boulevard",
      "Direct access to the Cairo–Alex Desert Road",
    ],
    heroImage: null,
    brochure: "sodic-projects/drive-download-20261028T185707Z-1-001/10. BRIEFS & FACT SHEET/Brief - Commercial.pdf",
    masterplan: null,
    position: 12,
  },

  /* ------------------------------------------------------------------ */
  /* North Coast                                                         */
  /* ------------------------------------------------------------------ */
  {
    slug: "caesar",
    name: "Caesar",
    nameAr: "قيصر",
    region: "north-coast",
    location: "Km 82, Alexandria–Matrouh Road, Ras El Hekma",
    category: "residential",
    status: "selling",
    tagline: "A timeless North Coast summer, back to basics",
    taglineAr: "صيف ساحلي خالد.. عودة إلى البساطة",
    description:
      "A 1.2 km stretch of Mediterranean beachfront at km 82 on the Alexandria–Matrouh Road, overlooking Ras El Hekma bay. Caesar pairs crystal villas, twin houses and shell townhouses with more than 22,000 sqm of swimmable lagoons, The Pier, the MATCHA retail district, a hotel and a clubhouse with infinity pool.",
    descriptionAr:
      "شاطئ بطول ١.٢ كم على البحر المتوسط عند الكيلو ٨٢ من طريق الإسكندرية–مطروح، يطل على خليج رأس الحكمة. يجمع قيصر بين فيلات كريستال والتوين هاوس والتاون هاوس، وأكثر من ٢٢ ألف متر مربع من البحيرات الصالحة للسباحة، وذا بير، ومنطقة MATCHA التجارية، وفندق، ونادٍ بمسبح إنفينيتي.",
    priceFrom: 37_000_000,
    paymentPlan: "5% down payment · up to 8-year payment plan",
    paymentPlanAr: "مقدم ٥٪ · تقسيط حتى ٨ سنوات",
    finishing: "Shell townhouses · finished villas and twin houses",
    unitTypes: [
      { name: "Crystal Villa · one-storey", nameAr: "فيلا كريستال · دور واحد", areaFrom: 195, priceFrom: 46_000_000 },
      { name: "Bliss Twin House", nameAr: "توين هاوس بليس", areaFrom: 205, priceFrom: 43_000_000 },
      { name: "Shell Townhouse", nameAr: "تاون هاوس هيكل", areaFrom: 180, priceFrom: 37_000_000 },
      { name: "Villa · Extension 2", nameAr: "فيلا · الإمتداد الثاني", bedrooms: 5, areaFrom: 254, note: "5 bedrooms, 1 master and 2 en-suite" },
      { name: "Twinhouse · Extension 2", nameAr: "توين هاوس · الإمتداد الثاني", bedrooms: 4, areaFrom: 205, areaTo: 211 },
    ],
    amenities: [
      "1.2 km of Mediterranean beachfront",
      "The Pier waterfront landmark",
      "MATCHA retail district",
      "22,000+ sqm of crystal lagoons",
      "Clubhouse and infinity pool",
      "Hotel",
      "Garden trails",
      "Sports and recreation",
      "Tempo restaurant and everyday retail",
    ],
    locationNotes: [
      "Km 82, Alexandria–Matrouh Road",
      "Overlooking Ras El Hekma bay",
      "Close to Fouka Road and El Alamein Airport",
      "10 minutes to Dabaa Road",
    ],
    heroImage: null,
    brochure: "sodic-projects/drive-download-20261028T185707Z-1-001/10. BRIEFS & FACT SHEET/Fact Sheet - Caesar.pdf",
    masterplan: "sodic-projects/drive-download-20261028T185707Z-1-001/5. CAESAR/Caesar - Masterplan Levels.pdf",
    position: 13,
  },
  {
    slug: "ogami",
    name: "Ogami",
    nameAr: "أوجامي",
    region: "north-coast",
    location: "Ras El Hekma, North Coast",
    category: "residential",
    status: "selling",
    tagline: "Mediterranean soul, Japanese serenity",
    taglineAr: "روح متوسطية وسكينة يابانية",
    description:
      "A 15%-footprint coastal destination in Ras El Hekma masterplanned by DLR, terraced down to the Mediterranean and named after a serene Japanese island. Ogami is the home of Nobu on Egypt's North Coast, with cascading villas, swimmable lagoons, a beach town, sports clubhouse, wellness centre and cultural library.",
    descriptionAr:
      "وجهة ساحلية في رأس الحكمة على مساحة بناء ١٥٪ بتخطيط DLR، تدرجت نحو البحر المتوسط وتستلهم اسمها من جزيرة يابانية هادئة. تحتضن أوجامي أول Nobu في الساحل المصري، مع فيلات متدرجة وبحيرات للسباحة وبلدة شاطئية ونادٍ رياضي ومركز عافية ومكتبة ثقافية.",
    priceFrom: 55_000_000,
    paymentPlan: "5% down payment · up to 8-year payment plan",
    paymentPlanAr: "مقدم ٥٪ · تقسيط حتى ٨ سنوات",
    finishing: "Finished",
    unitTypes: [
      { name: "Beachside Villa · 5 bedrooms", nameAr: "فيلا بيسايد · ٥ غرف", bedrooms: 5, areaFrom: 490, priceFrom: 197_000_000, note: "1-storey · average land 900 m²" },
      { name: "Seascape Villa · 4 bedrooms", nameAr: "فيلا سيسكيب · ٤ غرف", bedrooms: 4, areaFrom: 350, priceFrom: 149_000_000, note: "1-storey · average land 750 m²" },
      { name: "Dusk Villa · 4 bedrooms", nameAr: "فيلا دسك · ٤ غرف", bedrooms: 4, areaFrom: 310, priceFrom: 64_000_000, note: "2-storeys · average land 400 m²" },
      { name: "Bayview Villa · 3 bedrooms", nameAr: "فيلا بايفيو · ٣ غرف", bedrooms: 3, areaFrom: 250, priceFrom: 55_000_000, note: "2-storeys · average land 340 m²" },
    ],
    amenities: [
      "Nobu Hotel, Residences and Restaurant",
      "Beach town",
      "Swimmable lagoons and waterfront promenades",
      "Clubhouse and restaurant",
      "Sports clubhouse and courts",
      "Wellness centre",
      "Cultural area and library",
      "Beachfront boutique retail",
      "Landscaped parks and BBQ areas",
    ],
    locationNotes: [
      "Ras El Hekma, North Coast",
      "10 km to Ras El Hekma",
      "71 km to El Alamein Airport",
      "83 km to Marsa Matrouh",
      "191 km to Borg El Arab Airport",
    ],
    heroImage: "/projects/ogami.jpg",
    brochure: "sodic-projects/drive-download-20261028T185707Z-1-001/4. OGAMI/VILLAS/BROCHURES/Ogami - Brochure.pdf",
    masterplan: "sodic-projects/drive-download-20261028T185707Z-1-001/4. OGAMI/VILLAS/MASTERPLANS/Ogami - Masterplan - Overview.pdf",
    position: 14,
  },
  {
    slug: "ogami-bloom-island",
    name: "Ogami Bloom Island",
    nameAr: "أوجامي بلوم آيلاند",
    region: "north-coast",
    location: "Ogami, Ras El Hekma",
    category: "residential",
    status: "launching",
    tagline: "Island living, reimagined",
    taglineAr: "حياة الجزيرة.. برؤية جديدة",
    description:
      "A collection of island neighbourhoods inside Ogami where every home has a waterfront setting, surrounded by swimmable lagoons. The low-density masterplan offers five new single-family home types with terraces, courtyards and gardens designed as extensions of the living space.",
    descriptionAr:
      "مجموعة أحياء جزيرية داخل أوجامي، لكل منزل فيها واجهة مائية وتحيط بها بحيرات صالحة للسباحة. يقدم المخطط منخفض الكثافة خمسة أنواع جديدة من المنازل العائلية بتراسات وأفنية وحدائق تمتد من مساحات المعيشة.",
    priceFrom: 28_000_000,
    paymentPlan: "5% down payment · up to 8-year payment plan",
    paymentPlanAr: "مقدم ٥٪ · تقسيط حتى ٨ سنوات",
    finishing: "Finished",
    unitTypes: [
      { name: "Oasis Twin Villa", nameAr: "توين فيلا أوازيس", areaFrom: 215, priceFrom: 50_000_000 },
      { name: "Sea Breeze Villa", nameAr: "فيلا سي بريز", areaFrom: 180, priceFrom: 45_000_000 },
      { name: "Courtyard Villa", nameAr: "فيلا الكورت يارد", areaFrom: 170, priceFrom: 36_000_000 },
      { name: "Garden Houses", nameAr: "جاردن هاوسز", areaFrom: 155, priceFrom: 31_000_000 },
      { name: "Horizon Houses", nameAr: "هورايزون هاوسز", areaFrom: 150, priceFrom: 28_000_000 },
    ],
    amenities: [
      "Neighbourhood surrounded by swimmable lagoons",
      "Waterfront promenades and landscaped parks",
      "Clubhouse and restaurant",
      "Sports clubhouse and courts",
      "Community green spaces",
      "Access to Ogami beaches, Nobu and retail",
    ],
    locationNotes: [
      "Inside Ogami, Ras El Hekma",
      "10 km to Ras El Hekma",
      "71 km to El Alamein Airport",
      "83 km to Marsa Matrouh",
    ],
    heroImage: null,
    brochure: "sodic-projects/drive-download-20261028T185707Z-1-002/4. OGAMI/BLOOM ISLAND/Ogami Bloom Island Brochure.pdf",
    masterplan: "sodic-projects/drive-download-20261028T185707Z-1-001/4. OGAMI/BLOOM ISLAND/Ogami Bloom Island Masterplan-TYPES.pdf",
    position: 15,
  },
  {
    slug: "nobu-residences",
    name: "Nobu Residences",
    nameAr: "نوبو ريزيدنسز",
    region: "north-coast",
    location: "Ogami, Ras El Hekma",
    category: "branded",
    status: "selling",
    tagline: "The first Nobu Residences in Egypt",
    taglineAr: "أول نوبو ريزيدنسز في مصر",
    description:
      "150 branded residences across 20 buildings within Ogami, integrated with an 80-key Nobu Hotel, the Nobu Restaurant and a wellness centre. Homes are fully furnished with Japanese and Mediterranean-inspired interiors; typical floors enjoy sea views while garden residences overlook the pools.",
    descriptionAr:
      "١٥٠ وحدة سكنية بعلامة نوبو موزعة على ٢٠ مبنى داخل أوجامي، متكاملة مع فندق نوبو بسعة ٨٠ غرفة ومطعم نوبو ومركز عافية. تُسلّم الوحدات مفروشة بالكامل بتصميمات يابانية ومتوسطية؛ تطل الأدوار المتكررة على البحر بينما تطل وحدات الحدائق على المسابح.",
    priceFrom: 30_000_000,
    paymentPlan: "8 years · 15% over the first two years · 5% at handover",
    paymentPlanAr: "٨ سنوات · ١٥٪ خلال أول سنتين · ٥٪ عند التسليم",
    finishing: "Fully furnished, including appliances and accessories",
    unitTypes: [
      { name: "Type 1 · 2-bedroom residence", nameAr: "النوع ١ · شقة غرفتين", bedrooms: 2, areaFrom: 163, priceFrom: 55_000_000 },
      { name: "Type 1 · 3-bedroom residence", nameAr: "النوع ١ · شقة ٣ غرف", bedrooms: 3, areaFrom: 197, priceFrom: 75_000_000 },
      { name: "Type 2 · 1-bedroom residence", nameAr: "النوع ٢ · شقة غرفة", bedrooms: 1, areaFrom: 118, priceFrom: 30_000_000 },
      { name: "Type 2 · 2-bedroom residence", nameAr: "النوع ٢ · شقة غرفتين", bedrooms: 2, areaFrom: 180, priceFrom: 50_000_000 },
      { name: "Type 2 · 3-bedroom residence", nameAr: "النوع ٢ · شقة ٣ غرف", bedrooms: 3, areaFrom: 218, priceFrom: 70_000_000 },
    ],
    amenities: [
      "80-key Nobu Hotel and Nobu Restaurant",
      "Private beach access",
      "Fitness centre and wellness centre & spa",
      "Swimmable pools",
      "Concierge, valet and 24/7 security",
      "Housekeeping and laundry",
      "Chauffeur service and childcare",
      "Priority reservations at Nobu North Coast",
      "Landscaped open spaces",
    ],
    locationNotes: [
      "Inside Ogami, Ras El Hekma",
      "10 km to Ras El Hekma",
      "71 km to El Alamein Airport",
      "83 km to Marsa Matrouh",
    ],
    heroImage: null,
    brochure: "sodic-projects/drive-download-20261028T185707Z-1-001/10. BRIEFS & FACT SHEET/Nobu Residences - Branded Residences - Factsheet.pdf",
    masterplan: "sodic-projects/drive-download-20261028T185707Z-1-001/4. OGAMI/NOBU/26.08.02 - OGAMI - Nobu Residences - Saleskit.pdf",
    position: 16,
  },
  {
    slug: "nobu-serviced-residences",
    name: "Nobu Serviced Residences",
    nameAr: "نوبو للوحدات المخدومة",
    region: "north-coast",
    location: "Ogami, Ras El Hekma",
    category: "serviced",
    status: "selling",
    tagline: "Turnkey suites run by Nobu Hotel",
    taglineAr: "أجنحة جاهزة تديرها فنادق نوبو",
    description:
      "36 serviced residences inside Ogami, professionally operated as part of the Nobu Hotel inventory under a hotel rental programme. Owners get five-star hospitality, housekeeping, concierge and turnkey ownership, with suites that connect to adjoining double rooms for larger family stays.",
    descriptionAr:
      "٣٦ وحدة مخدومة داخل أوجامي، تُدار احترافيًا ضمن مخزون فندق نوبو عبر برنامج تأجير فندقي. يحصل الملاك على ضيافة خمس نجوم وخدمة تدبير منزلي واستقبال وتسليم جاهز، مع أجنحة تتصل بغرف مزدوجة مجاورة لاستيعاب العائلات الكبيرة.",
    priceFrom: 35_000_000,
    paymentPlan: "8 years · 15% over the first two years · 5% at handover",
    paymentPlanAr: "٨ سنوات · ١٥٪ خلال أول سنتين · ٥٪ عند التسليم",
    finishing: "Fully furnished, including appliances and accessories",
    unitTypes: [
      { name: "Double room · 24 units", nameAr: "غرفة مزدوجة · ٢٤ وحدة", areaFrom: 52, priceFrom: 35_000_000 },
      { name: "Suite · 12 units", nameAr: "جناح · ١٢ وحدة", areaFrom: 85, priceFrom: 45_000_000 },
    ],
    amenities: [
      "Hotel rental programme",
      "Fully managed by Nobu Hotel",
      "Five-star hospitality",
      "Housekeeping and concierge",
      "Turnkey ownership",
      "Private beach access, pools, spa and fitness",
      "Concierge, valet and 24/7 security",
    ],
    locationNotes: [
      "Inside Ogami, Ras El Hekma",
      "10 km to Ras El Hekma",
      "71 km to El Alamein Airport",
      "83 km to Marsa Matrouh",
    ],
    heroImage: null,
    brochure: "sodic-projects/drive-download-20261028T185707Z-1-001/10. BRIEFS & FACT SHEET/Nobu Residences - Serviced Residences - Factsheet.pdf",
    masterplan: "sodic-projects/drive-download-20261028T185707Z-1-001/4. OGAMI/NOBU/26.08.02 - OGAMI - Nobu Residences - Saleskit.pdf",
    position: 17,
  },
  {
    slug: "june",
    name: "June",
    nameAr: "جون",
    region: "north-coast",
    location: "North Coast, near Caesar",
    category: "residential",
    status: "selling",
    tagline: "A Miami-inspired beach town",
    taglineAr: "بلدة شاطئية بإلهام ميامي",
    description:
      "A beach town with crystal-clear seawater, uninterrupted sea views and more than 100,000 sqm of lagoons. June is built around a pedestrian boardwalk, horizon pools, swimmable lagoons and a Club S clubhouse, with neighbourhoods including Pearl, Aquamarine, Aqua Lagoons and the Beach Residences.",
    descriptionAr:
      "بلدة شاطئية بمياه صافية وإطلالات بحرية غير محجوبة وأكثر من ١٠٠ ألف متر مربع من البحيرات. تقوم جون على ممشى للمشاة ومسابح أفقية وبحيرات صالحة للسباحة ونادٍ من Club S، وتضم أحياء بيرل وأكوامارين وأكوا لاجونز وبيتش ريزيدنسز.",
    priceFrom: null,
    paymentPlan: null,
    paymentPlanAr: null,
    finishing: null,
    unitTypes: [
      { name: "Pearl Townhouses", nameAr: "تاون هاوس بيرل", areaFrom: 197.98 },
      { name: "Pearl Twin Houses", nameAr: "توين هاوس بيرل", areaFrom: 221.93 },
      { name: "Pearl Villas", nameAr: "فيلات بيرل", areaFrom: 257.3 },
      { name: "Beach Residences", nameAr: "بيتش ريزيدنسز", areaFrom: 70 },
    ],
    amenities: [
      "The Boardwalk for walking, jogging and biking",
      "Beachfront F&B and retail",
      "Horizon pools with unobstructed views",
      "Swimmable lagoons with sandy beaches",
      "The Clubhouse by Club S",
      "Pharmacies, clinics, supermarkets and outdoor gyms",
      "Mosque and children's park",
      "More than 100,000 sqm of lagoons",
    ],
    locationNotes: [
      "5 minutes from Caesar",
      "10 minutes from Dabaa Road",
      "30 minutes from Sidi Abdel Rahman",
      "45 minutes from Alamein Road",
    ],
    heroImage: null,
    brochure: "sodic-projects/drive-download-20261028T185707Z-1-001/10. BRIEFS & FACT SHEET/Brief - June.pdf",
    masterplan: "sodic-projects/drive-download-20261028T185707Z-1-001/3. JUNE/Aquamarine/Aquamarine Masterplan Views.pdf",
    position: 18,
  },
  {
    slug: "june-aquamarine",
    name: "June Aquamarine",
    nameAr: "جون أكوامارين",
    region: "north-coast",
    location: "June, North Coast",
    category: "residential",
    status: "selling",
    tagline: "Lofts, chalets and sandstone houses by the lagoon",
    taglineAr: "لوفتات وشاليهات ومنازل حجر رملي بجوار البحيرة",
    description:
      "An 8,000 sqm lagoon neighbourhood inside June with lofts, chalets and sandstone houses. Lofts are grouped in attached blocks of four — two middle two-bedroom units and two corner three-bedroom units — and the sandstone houses offer five-bedroom homes.",
    descriptionAr:
      "حي داخل جون يضم بحيرة بمساحة ٨٠٠٠ متر مربع مع لوفتات وشاليهات ومنازل حجر رملي. تتجمع اللوفتات في مبانٍ متصلة من أربع وحدات: وحدتان وسطيتان بغرفتي نوم ووحدتان طرفيتان بثلاث غرف، بينما توفر منازل الحجر الرملي خمس غرف نوم.",
    priceFrom: null,
    paymentPlan: null,
    paymentPlanAr: null,
    finishing: null,
    unitTypes: [
      { name: "Loft · 2 bedrooms (middle)", nameAr: "لوفت · غرفتان (وسطي)", bedrooms: 2 },
      { name: "Loft · 3 bedrooms (corner)", nameAr: "لوفت · ٣ غرف (طرفي)", bedrooms: 3 },
      { name: "Chalet", nameAr: "شاليه" },
      { name: "Sandstone House · 5 bedrooms", nameAr: "منزل حجر رملي · ٥ غرف", bedrooms: 5 },
    ],
    amenities: [
      "8,000 sqm lagoon at the doorstep",
      "Kayaking along the waterways",
      "Clubhouse with fitness classes",
      "Sea views from balconies",
      "Part of June's boardwalk and retail",
    ],
    locationNotes: [
      "Inside June, North Coast",
      "5 minutes from Caesar",
      "10 minutes from Dabaa Road",
      "45 minutes from Alamein Road",
    ],
    heroImage: null,
    brochure: "sodic-projects/drive-download-20261028T185707Z-1-001/3. JUNE/Aquamarine/Aquamarine Brochure-Lofts.pdf",
    masterplan: "sodic-projects/drive-download-20261028T185707Z-1-001/3. JUNE/Aquamarine/Aquamarine Masterplan Distances.pdf",
    position: 19,
  },
  {
    slug: "june-pearl",
    name: "June Pearl",
    nameAr: "جون بيرل",
    region: "north-coast",
    location: "June, North Coast",
    category: "residential",
    status: "selling",
    tagline: "Villas, chalets and penthouses on the high side",
    taglineAr: "فيلات وشاليهات وبنتهاوس في الجزء المرتفع",
    description:
      "The Pearl neighbourhood of June sits on a magnificent elevation with unobstructed sea views. It offers villas from 197.98 sqm with three to five bedrooms plus nanny rooms, three-bedroom chalets and penthouses, and lofts with water views.",
    descriptionAr:
      "يقع حي بيرل في جون على مرتفع يوفر إطلالات بحرية غير محجوبة. يضم فيلات تبدأ من ١٩٧.٩٨ متر مربع بثلاث إلى خمس غرف نوم بالإضافة إلى غرفة مربية، وشاليهات وبنتهاوس بثلاث غرف، ولوفتات تطل على المياه.",
    priceFrom: null,
    paymentPlan: null,
    paymentPlanAr: null,
    finishing: null,
    unitTypes: [
      { name: "Pearl Villa · 3–5 bedrooms + nanny", nameAr: "فيلا بيرل · ٣–٥ غرف + مربية", bedrooms: 5, areaFrom: 197.98, areaTo: 200.96 },
      { name: "Pearl Chalet · 3 bedrooms", nameAr: "شاليه بيرل · ٣ غرف", bedrooms: 3 },
      { name: "Pearl Penthouse · 3 bedrooms", nameAr: "بنتهاوس بيرل · ٣ غرف", bedrooms: 3 },
      { name: "Pearl Loft", nameAr: "لوفت بيرل" },
    ],
    amenities: [
      "Elevated position with sea views",
      "En-suite bedrooms and nanny rooms",
      "Water views from lofts",
      "Access to June's boardwalk, lagoons and Club S",
      "More than 100,000 sqm of lagoons",
    ],
    locationNotes: [
      "Inside June, North Coast",
      "5 minutes from Caesar",
      "10 minutes from Dabaa Road",
      "45 minutes from Alamein Road",
    ],
    heroImage: null,
    brochure: "sodic-projects/drive-download-20261028T185707Z-1-001/3. JUNE/Pearl/Villa/Pearl Villas Brochure.pdf",
    masterplan: "sodic-projects/drive-download-20261028T185707Z-1-001/3. JUNE/Pearl/Villa/Pearl - Types Villas Masterplan.pdf",
    position: 20,
  },
  {
    slug: "june-beach-residences",
    name: "June Beach Residences",
    nameAr: "جون بيتش ريزيدنسز",
    region: "north-coast",
    location: "June, North Coast",
    category: "residential",
    status: "selling",
    tagline: "Sea-view apartments from 70 sqm",
    taglineAr: "شقق بإطلالة بحرية تبدأ من ٧٠ متر مربع",
    description:
      "Four beachfront buildings inside June with apartments from 70 sqm, sea views and a hotel-style service layer. Ground, typical and roof masterplans are available for each building, with distances to the beach and amenities mapped for buyers.",
    descriptionAr:
      "أربعة مبانٍ على الشاطئ داخل جون بشقق تبدأ من ٧٠ متر مربع وإطلالات بحرية وخدمات على طراز الفنادق. تتوفر مخططات للأدوار الأرضية والمتكررة والسطح لكل مبنى، مع خرائط للمسافات إلى الشاطئ والخدمات.",
    priceFrom: null,
    paymentPlan: null,
    paymentPlanAr: null,
    finishing: null,
    unitTypes: [
      { name: "Apartment · Building 1", nameAr: "شقة · مبنى ١", areaFrom: 70 },
      { name: "Apartment · Building 2", nameAr: "شقة · مبنى ٢", areaFrom: 70 },
      { name: "Apartment · Building 3", nameAr: "شقة · مبنى ٣", areaFrom: 70 },
      { name: "Apartment · Building 4", nameAr: "شقة · مبنى ٤", areaFrom: 70 },
    ],
    amenities: [
      "Beachfront buildings",
      "Sea views",
      "Hotel-style services",
      "Boardwalk, retail and F&B",
      "Clubhouse by Club S",
    ],
    locationNotes: [
      "Inside June, North Coast",
      "5 minutes from Caesar",
      "10 minutes from Dabaa Road",
      "30 minutes from Sidi Abdel Rahman",
    ],
    heroImage: null,
    brochure: "sodic-projects/drive-download-20261028T185707Z-1-002/3. JUNE/Beach Residences/Brochures/Beach Residences - Building 1.pdf",
    masterplan: "sodic-projects/drive-download-20261028T185707Z-1-001/3. JUNE/Beach Residences/Masterplans/Beach Residences - Ground Floor Masterplan .pdf",
    position: 21,
  },
  {
    slug: "june-aqua-lagoons",
    name: "June Aqua Lagoons",
    nameAr: "جون أكوا لاجونز",
    region: "north-coast",
    location: "June, North Coast",
    category: "residential",
    status: "launching",
    tagline: "500 metres from the sea, zero south-facing homes",
    taglineAr: "٥٠٠ متر من البحر.. بلا وحدات مواجهة للجنوب",
    description:
      "A lagoon-front neighbourhood 500 metres from the sea with 2,500 sqm of water features. Every unit includes a nanny's room and no residence faces south, so homes keep the sea breeze and the view.",
    descriptionAr:
      "حي على البحيرات على بعد ٥٠٠ متر من البحر، بمساحات مائية تبلغ ٢٥٠٠ متر مربع. تشمل كل وحدة غرفة مربية، ولا توجد وحدات مواجهة للجنوب، بما يحفظ نسيم البحر والإطلالة.",
    priceFrom: null,
    paymentPlan: null,
    paymentPlanAr: null,
    finishing: null,
    unitTypes: [
      { name: "2-bedroom apartment", nameAr: "شقة غرفتين", bedrooms: 2, areaFrom: 115, note: "101 m² indoor + 14 m² terrace" },
    ],
    amenities: [
      "2,500 sqm of water features",
      "500 m from the sea",
      "Nanny's room in every unit",
      "Zero south-facing residences",
      "Part of June's lagoons and boardwalk",
    ],
    locationNotes: [
      "Inside June, North Coast",
      "500 m from the sea",
      "5 minutes from Caesar",
      "10 minutes from Dabaa Road",
    ],
    heroImage: null,
    brochure: "sodic-projects/drive-download-20261028T185707Z-1-001/3. JUNE/Aqualagoons/June Aqua Lagoons Brochure .pdf",
    masterplan: null,
    position: 22,
  },
];
