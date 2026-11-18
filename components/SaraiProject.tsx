import type { Lang } from "@/data/content";
import { ui } from "@/lib/labels";

const photos = [
  "villa-exterior.jpg",
  "waterfront.jpg",
  "residences.jpg",
  "landscaped-homes.jpg",
  "building.jpg",
  "canal.jpg",
  "community.jpg",
  "evening.jpg",
];

export default function SaraiProject({ lang }: { lang: Lang }) {
  const arabic = lang === "ar";
  // Facts, facilities and the offer below come from Madinet Masr's current
  // company fact sheet and the Elm Tree Park payment-plan sheet.
  const facts = arabic
    ? [
        { label: "المساحة", value: "1,200 فدان" },
        { label: "الموقع", value: "طريق السويس · بجوار مدينتي" },
        { label: "المطور", value: "مدينة مصر · منذ 1909" },
      ]
    : [
        { label: "Project area", value: "1,200 acres" },
        { label: "Location", value: "Suez Road · next to Madinaty" },
        { label: "Developer", value: "Madinet Masr · since 1909" },
      ];
  const facilities = arabic
    ? [
        "منطقة تجارية",
        "ستريب مول",
        "منطقة إدارية",
        "مدرسة دولية",
        "مركز طبي",
        "محطة وقود",
        "فندق",
        "مجتمع محاط ببوابات مزدوجة",
        "كلوب كيان",
        "كلوب هاوسات خاصة",
      ]
    : [
        "Commercial area",
        "Strip mall",
        "Administrative area",
        "International school",
        "Medical centre",
        "Gas station",
        "Hotel",
        "Double gated community",
        "Klub Kayan",
        "Exclusive club houses",
      ];
  const salesCopy = arabic
    ? {
        pricesTitle: "S-Villa 212 · إلم تري بارك",
        startingPrice: "سعر الوحدة",
        priceValue: "19.1 مليون جنيه",
        unitSizes: "نوع الوحدة",
        sizesValue: "S-Villa 212 · 3 غرف + خدم",
        maintenance: "الصيانة",
        maintenanceValue: "8%",
        delivery: "التسليم",
        deliveryValue: "2031",
        paymentTitle: "خطة السداد",
        paymentValue: "مقدم 1.5% · تقسيط 12 سنة",
        inventoryTitle: "الوحدات المتاحة",
        inventoryNote: "السعر والخطة أعلاه لعرض إلم تري بارك الحالي. الأسعار والمساحات والتوافر تتغير بسرعة — تواصل معنا لتأكيد الوحدة المتاحة.",
        enquire: "استفسر عن سراي",
      }
    : {
        pricesTitle: "S-Villa 212 · Elm Tree Park",
        startingPrice: "Unit price",
        priceValue: "EGP 19.1M",
        unitSizes: "Unit type",
        sizesValue: "S-Villa 212 · 3 bed + maid",
        maintenance: "Maintenance",
        maintenanceValue: "8%",
        delivery: "Delivery",
        deliveryValue: "2031",
        paymentTitle: "Payment plan",
        paymentValue: "1.5% down · 12 years",
        inventoryTitle: "Available units",
        inventoryNote: "The price and plan above are the current Elm Tree Park offer. Prices, sizes and availability move quickly — contact us to confirm the unit on release.",
        enquire: "Ask about Sarai",
      };

  return (
    <section className="section sarai-project" aria-labelledby="sarai-title">
      <div className="section-inner">
        <div className="sarai-overview">
          <div>
            <p className="section-kicker">Madinet Masr · Sarai Compound</p>
            <h1 className="section-title" id="sarai-title">Sarai</h1>
            <p className="section-lede">
              {arabic
                ? "S-Villa 212 في إلم تري بارك داخل سراي — مجتمع مدينة مصر على 1,200 فدان بطريق السويس بجوار مدينتي. تفاصيل الوحدة وخطة السداد الحالية بالأسفل."
                : "S-Villa 212 sits in Elm Tree Park inside Sarai — Madinet Masr's 1,200-acre community on Suez Road beside Madinaty. Current unit and payment details below."}
            </p>
          </div>
          <img className="sarai-cover" src="/sarai/cover.jpg" alt="" fetchPriority="high" />
        </div>

        <section className="sleek-block" aria-labelledby="sarai-facts-title">
          <h2 className="sleek-subtitle" id="sarai-facts-title">
            {arabic ? "نبذة عن المشروع" : "Sarai at a glance"}
          </h2>
          <dl className="sarai-facts">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
          <h3 className="sleek-subtitle sarai-facilities-title">
            {arabic ? "المرافق" : "Facilities"}
          </h3>
          <ul className="sarai-facilities">
            {facilities.map((facility) => <li key={facility}>{facility}</li>)}
          </ul>
        </section>

        <section className="sleek-block" aria-labelledby="sarai-prices-title">
          <h2 className="sleek-subtitle" id="sarai-prices-title">{salesCopy.pricesTitle}</h2>
          <div className="sleek-rates">
            <div className="sleek-rate">
              <span>{salesCopy.startingPrice}</span>
              <strong>{salesCopy.priceValue}</strong>
            </div>
            <div className="sleek-rate">
              <span>{salesCopy.unitSizes}</span>
              <strong>{salesCopy.sizesValue}</strong>
            </div>
            <div className="sleek-rate">
              <span>{salesCopy.maintenance}</span>
              <strong>{salesCopy.maintenanceValue}</strong>
            </div>
            <div className="sleek-rate">
              <span>{salesCopy.delivery}</span>
              <strong>{salesCopy.deliveryValue}</strong>
            </div>
          </div>
        </section>

        <section className="sleek-block" aria-labelledby="sarai-payment-title">
          <h2 className="sleek-subtitle" id="sarai-payment-title">{salesCopy.paymentTitle}</h2>
          <div className="sleek-payment">
            <div className="sleek-payment-step">
              <strong>{salesCopy.paymentValue}</strong>
              <span>{salesCopy.paymentTitle}</span>
            </div>
          </div>
        </section>

        <section className="sleek-block" aria-labelledby="sarai-inventory-title">
          <h2 className="sleek-subtitle" id="sarai-inventory-title">{salesCopy.inventoryTitle}</h2>
          <p className="section-lede sarai-inventory-note">{salesCopy.inventoryNote}</p>
        </section>

        <section className="sleek-block" aria-labelledby="sarai-gallery-title">
          <h2 className="sleek-subtitle" id="sarai-gallery-title">{ui[lang].gallery}</h2>
          <div className="sleek-gallery">
            {photos.map((photo) => (
              <figure className="sleek-gallery-item" key={photo}>
                <img
                  src={`/sarai/${photo}`}
                  alt={arabic ? "مشهد من مشروع سراي" : "Sarai project view"}
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            ))}
          </div>
        </section>

        <section className="sleek-block" aria-labelledby="sarai-videos-title">
          <h2 className="sleek-subtitle" id="sarai-videos-title">{ui[lang].projectVideos}</h2>
          <div className="sleek-videos">
            {[1, 2, 3].map((number) => (
              <video
                key={number}
                src={`/sarai/video-${number}.mp4`}
                controls
                playsInline
                preload="none"
                poster="/sarai/cover.jpg"
                aria-label={`${ui[lang].videoLabel} ${number}`}
              />
            ))}
          </div>
        </section>

        <div className="sleek-cta">
          <a className="btn btn--forest" href="#enquiry" data-cta="project_enquiry" data-cta-surface="sarai">
            {salesCopy.enquire}
          </a>
        </div>
      </div>
    </section>
  );
}
