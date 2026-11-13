import type { Lang } from "@/data/content";

type Unit = { label?: string; area: string; price: string };
type UnitGroup = { title: string; units: Unit[] };

const units = {
  groundRetail: [
    { area: "64 m²", price: "EGP 21,376,000" },
    { area: "58 m²", price: "EGP 27,260,000" },
    { area: "74 m²", price: "EGP 29,156,000" },
  ],
  groundFood: [
    { area: "58 m² + 27.5 m²", price: "EGP 30,225,000" },
    { area: "88.5 m² + 48 m²", price: "EGP 38,214,000" },
    { area: "86 m² + 22.5 m²", price: "EGP 50,060,000" },
  ],
  firstRetail: [
    { area: "51.5 m²", price: "EGP 14,780,500" },
    { area: "51 m²", price: "EGP 15,555,500" },
    { area: "61 m²", price: "EGP 17,385,000" },
  ],
  firstFood: [{ area: "118 m² + 40 m²", price: "EGP 45,782,000" }],
  admin: [
    { area: "39 m²", price: "EGP 8,853,000" },
    { area: "47.5 m²", price: "EGP 10,402,500" },
    { area: "53 m² + 8.5 m²", price: "EGP 12,668,500" },
    { area: "65 m² + 7 m²", price: "EGP 13,051,000" },
    { area: "77 m²", price: "EGP 15,777,300" },
    { area: "97 m² + 3 m²", price: "EGP 20,968,000" },
    { area: "110 m² + 38 m²", price: "EGP 24,779,000" },
    { area: "124 m²", price: "EGP 26,536,000" },
    { area: "140.5 m²", price: "EGP 28,662,000" },
  ],
  clinics: [
    { label: "1 room", area: "36.5 m²", price: "EGP 7,551,850" },
    { label: "2 rooms", area: "50 m²", price: "EGP 11,495,000" },
    { label: "3 rooms", area: "73.5 m²", price: "EGP 15,103,700" },
    { label: "4 rooms", area: "129 m² + 22 m²", price: "EGP 26,733,000" },
  ],
} satisfies Record<string, Unit[]>;

const copy = {
  en: {
    kicker: "New Cairo · Commercial destination",
    intro:
      "A new address for retail, food and beverage, offices and clinics, directly on South 90th Street at Mohamed Naguib Axis.",
    map: "Open location in Google Maps",
    operator: "Operated by",
    handover: "Delivery",
    handoverValue: "Q1 2029",
    unitMix: "Retail · F&B · Admin · Clinics",
    ratesTitle: "Starting prices per square metre",
    rates: [
      { label: "Commercial · Ground floor", price: "EGP 334,000 / m²" },
      { label: "Commercial · First floor", price: "EGP 277,000 / m²" },
      { label: "Administrative", price: "EGP 194,000 / m²" },
      { label: "Clinics", price: "EGP 205,000 / m²" },
    ],
    paymentTitle: "Payment plan",
    paymentSteps: [
      { value: "5%", label: "Down payment" },
      { value: "5%", label: "After 3 months" },
      { value: "6 years", label: "Payment period" },
      { value: "40%", label: "Cash discount" },
    ],
    inventoryTitle: "Available unit examples",
    groundRetail: "Ground floor · Retail",
    groundFood: "Ground floor · F&B",
    firstRetail: "First floor · Retail",
    firstFood: "First floor · F&B",
    admin: "Administrative · Core and shell",
    clinics: "Clinics · Fully finished",
    unit: "Unit",
    area: "Area",
    price: "Price",
    galleryTitle: "Sleek in pictures",
    gallery: [
      "Sleek exterior rendering",
      "Sleek frontage rendering",
      "Retail promenade rendering",
      "South 90th Street location map",
      "Project construction progress",
      "Aerial construction progress",
      "Construction site view",
    ],
    videoTitle: "Project videos",
    videoLabels: ["Project video 1", "Project video 2", "Project video 3"],
    enquire: "Ask about Sleek",
  },
  ar: {
    kicker: "القاهرة الجديدة · وجهة تجارية",
    intro:
      "عنوان جديد للتجزئة والمطاعم والمكاتب والعيادات، مباشرة على شارع التسعين الجنوبي عند محور محمد نجيب.",
    map: "افتح الموقع على خرائط Google",
    operator: "التشغيل بواسطة",
    handover: "التسليم",
    handoverValue: "الربع الأول 2029",
    unitMix: "تجزئة · مطاعم ومشروبات · إداري · عيادات",
    ratesTitle: "أسعار تبدأ من المتر المربع",
    rates: [
      { label: "تجاري · الدور الأرضي", price: "EGP 334,000 / m²" },
      { label: "تجاري · الدور الأول", price: "EGP 277,000 / m²" },
      { label: "إداري", price: "EGP 194,000 / m²" },
      { label: "عيادات", price: "EGP 205,000 / m²" },
    ],
    paymentTitle: "خطة السداد",
    paymentSteps: [
      { value: "5%", label: "مقدم" },
      { value: "5%", label: "بعد 3 أشهر" },
      { value: "6 سنوات", label: "مدة السداد" },
      { value: "40%", label: "خصم الكاش" },
    ],
    inventoryTitle: "نماذج من الوحدات المتاحة",
    groundRetail: "الدور الأرضي · تجزئة",
    groundFood: "الدور الأرضي · مطاعم ومشروبات",
    firstRetail: "الدور الأول · تجزئة",
    firstFood: "الدور الأول · مطاعم ومشروبات",
    admin: "إداري · Core and shell",
    clinics: "عيادات · تشطيب كامل",
    unit: "وحدة",
    area: "المساحة",
    price: "السعر",
    galleryTitle: "سليك بالصور",
    gallery: [
      "تصميم خارجي لمشروع سليك",
      "واجهة مشروع سليك",
      "تصميم ممشى المحلات",
      "خريطة موقع شارع التسعين الجنوبي",
      "تقدم أعمال الإنشاء",
      "لقطة جوية لموقع الإنشاء",
      "صورة لموقع الإنشاء",
    ],
    videoTitle: "فيديوهات المشروع",
    videoLabels: ["فيديو المشروع 1", "فيديو المشروع 2", "فيديو المشروع 3"],
    enquire: "استفسر عن سليك",
  },
} satisfies Record<Lang, {
  kicker: string;
  intro: string;
  map: string;
  operator: string;
  handover: string;
  handoverValue: string;
  unitMix: string;
  ratesTitle: string;
  rates: { label: string; price: string }[];
  paymentTitle: string;
  paymentSteps: { value: string; label: string }[];
  inventoryTitle: string;
  groundRetail: string;
  groundFood: string;
  firstRetail: string;
  firstFood: string;
  admin: string;
  clinics: string;
  unit: string;
  area: string;
  price: string;
  galleryTitle: string;
  gallery: string[];
  videoTitle: string;
  videoLabels: string[];
  enquire: string;
}>;

const MAP_URL = "https://maps.app.goo.gl/bybiWnAp5ZE9QLtX8";
const IMAGE_PATHS = [
  "/sleek/exterior.jpg",
  "/sleek/frontage.jpg",
  "/sleek/retail-render.jpg",
  "/sleek/location-map.jpg",
  "/sleek/site-progress.jpg",
  "/sleek/site-aerial.jpg",
  "/sleek/site-view.jpg",
];
const VIDEO_PATHS = [
  "/sleek/video-1.mp4",
  "/sleek/video-2.mp4",
  "/sleek/video-3.mp4",
];
const ARABIC_CLINIC_LABELS = ["غرفة واحدة", "غرفتان", "3 غرف", "4 غرف"];

export default function SleekProject({
  lang,
  standalone = false,
}: {
  lang: Lang;
  standalone?: boolean;
}) {
  const c = copy[lang];
  const ProjectTitle = standalone ? "h1" : "h2";
  const unitGroups: UnitGroup[] = [
    { title: c.groundRetail, units: units.groundRetail },
    { title: c.groundFood, units: units.groundFood },
    { title: c.firstRetail, units: units.firstRetail },
    { title: c.firstFood, units: units.firstFood },
    { title: c.admin, units: units.admin },
    {
      title: c.clinics,
      units: units.clinics.map((unit, index) => ({
        ...unit,
        label: lang === "ar" ? ARABIC_CLINIC_LABELS[index] ?? unit.label : unit.label,
      })),
    },
  ];

  return (
    <section className="section sleek-project" id="sleek" aria-labelledby="sleek-title">
      <div className="section-inner">
        <div className="sleek-overview">
          <div className="sleek-overview-copy">
            <p className="section-kicker">{c.kicker}</p>
            <ProjectTitle className="section-title" id="sleek-title">Sleek</ProjectTitle>
            <p className="section-lede">{c.intro}</p>
            <a className="sleek-map-link" href={MAP_URL} target="_blank" rel="noopener noreferrer">
              <span aria-hidden="true">↗</span>
              {c.map}
            </a>

            <dl className="sleek-facts">
              <div>
                <dt>{c.operator}</dt>
                <dd>AlRabat</dd>
              </div>
              <div>
                <dt>{c.handover}</dt>
                <dd>{c.handoverValue}</dd>
              </div>
              <div className="sleek-fact-wide">
                <dt>{lang === "ar" ? "الأنشطة" : "Unit mix"}</dt>
                <dd>{c.unitMix}</dd>
              </div>
            </dl>
          </div>

          <figure className="sleek-cover">
            <img src={IMAGE_PATHS[0]} alt={c.gallery[0]} loading="lazy" decoding="async" />
            <figcaption>{lang === "ar" ? "تصور معماري للمشروع" : "Architectural project rendering"}</figcaption>
          </figure>
        </div>

        <section className="sleek-block" aria-labelledby="sleek-rates-title">
          <h3 className="sleek-subtitle" id="sleek-rates-title">{c.ratesTitle}</h3>
          <div className="sleek-rates">
            {c.rates.map((rate) => (
              <div className="sleek-rate" key={rate.label}>
                <span>{rate.label}</span>
                <strong dir="ltr">{rate.price}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="sleek-block" aria-labelledby="sleek-payment-title">
          <h3 className="sleek-subtitle" id="sleek-payment-title">{c.paymentTitle}</h3>
          <div className="sleek-payment">
            {c.paymentSteps.map((step) => (
              <div className="sleek-payment-step" key={step.label}>
                <strong dir="ltr">{step.value}</strong>
                <span>{step.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="sleek-block" id="sleek-units" aria-labelledby="sleek-units-title">
          <h3 className="sleek-subtitle" id="sleek-units-title">{c.inventoryTitle}</h3>
          <div className="sleek-unit-groups">
            {unitGroups.map((group) => (
              <article className="sleek-unit-group" key={group.title}>
                <h4>{group.title}</h4>
                <div className="sleek-unit-header">
                  <span>{c.unit}</span>
                  <span>{c.area}</span>
                  <span>{c.price}</span>
                </div>
                <ul>
                  {group.units.map((unit) => (
                    <li className="sleek-unit-row" key={`${unit.area}-${unit.price}`}>
                      <span>{unit.label ?? c.unit}</span>
                      <bdi dir="ltr">{unit.area}</bdi>
                      <strong dir="ltr">{unit.price}</strong>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="sleek-block" aria-labelledby="sleek-gallery-title">
          <h3 className="sleek-subtitle" id="sleek-gallery-title">{c.galleryTitle}</h3>
          <div className="sleek-gallery">
            {IMAGE_PATHS.map((src, index) => (
              <figure className="sleek-gallery-item" key={src}>
                <img src={src} alt={c.gallery[index]} loading="lazy" decoding="async" />
                <figcaption>{c.gallery[index]}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="sleek-block" aria-labelledby="sleek-video-title">
          <h3 className="sleek-subtitle" id="sleek-video-title">{c.videoTitle}</h3>
          <div className="sleek-videos">
            {VIDEO_PATHS.map((src, index) => (
              <video
                key={src}
                src={src}
                controls
                playsInline
                preload="none"
                poster={IMAGE_PATHS[0]}
                aria-label={c.videoLabels[index]}
              />
            ))}
          </div>
        </section>

        <div className="sleek-cta">
          <a className="btn btn--forest" href="#enquiry" data-cta="project_enquiry" data-cta-surface="sleek">
            {c.enquire}
          </a>
        </div>
      </div>
    </section>
  );
}
