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
  const facts = arabic
    ? [
        { label: "المساحة", value: "550 Acres" },
        { label: "الموقع", value: "New Heliopolis" },
      ]
    : [
        { label: "Project area", value: "550 Acres" },
        { label: "Location", value: "New Heliopolis" },
      ];
  const facilities = arabic
    ? ["تشطيب كامل", "منطقة تجارية", "منطقة إدارية", "مركز طبي", "نادٍ رياضي", "كلوب هاوس"]
    : ["Fully finished", "Commercial area", "Administrative area", "Medical centre", "Sport club", "Club house"];

  return (
    <section className="section sarai-project" aria-labelledby="sarai-title">
      <div className="section-inner">
        <div className="sarai-overview">
          <div>
            <p className="section-kicker">Madinet Masr · Sarai Compound</p>
            <h1 className="section-title" id="sarai-title">Sarai</h1>
            <p className="section-lede">
              {arabic
                ? "يقع S-Villa 212 ضمن مشروع سراي. تعرّف على تفاصيل المشروع واطلب سعر الوحدة وخيارات السداد حسب المساحة من فريق المبيعات."
                : "S-Villa 212 is part of Sarai. Explore the compound and ask our sales team for unit pricing by size and current payment options."}
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
      </div>
    </section>
  );
}
