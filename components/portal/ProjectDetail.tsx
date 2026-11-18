import type { Contact, Lang, Project } from "@/data/content";
import type { PortalCopy, ProjectDetail as Detail } from "@/data/portfolio";

/**
 * One detail template for every project.
 *
 * The Lakes, EastVale, Sleek and Sarai all render through this component; what
 * differs is data in PROJECT_DETAILS (facts, rates, unit inventory, payment
 * terms, gallery, video). Adding a project is a data change, not a new page
 * layout.
 */
export default function ProjectDetail({
  lang,
  project,
  detail,
  copy,
  contact,
  whatsapp,
}: {
  lang: Lang;
  project: Project;
  detail: Detail;
  copy: PortalCopy;
  contact: Contact;
  whatsapp: string;
}) {
  const t = {
    overview: lang === "ar" ? "نظرة عامة" : "Overview",
    facts: lang === "ar" ? "لمحة سريعة" : "At a glance",
    about: lang === "ar" ? "عن المشروع" : "About the project",
    highlights: lang === "ar" ? "أبرز ما في المشروع" : "What the project includes",
    rates: lang === "ar" ? "سعر المتر" : "Price per m²",
    ratesLede:
      lang === "ar"
        ? "أسعار البداية للمتر كما يطرحها المطور، وتختلف حسب الدور والاستخدام."
        : "Starting rates per square metre as released by the developer — they vary by floor and use.",
    units: lang === "ar" ? "الوحدات المتاحة" : "Available units",
    unitsLede:
      lang === "ar"
        ? "نماذج من الوحدات المتاحة الآن. الأسعار والمساحات تتغير بسرعة — تواصل معنا لتأكيد الوحدة."
        : "Examples of units on release now. Prices and areas move quickly — contact us to confirm what is still available.",
    unit: lang === "ar" ? "الوحدة" : "Unit",
    area: lang === "ar" ? "المساحة" : "Area",
    price: lang === "ar" ? "السعر" : "Price",
    planKicker: lang === "ar" ? "خطة السداد" : "Payment plan",
    planTitle: lang === "ar" ? "المقدم والتقسيط من المطور." : "The developer's own schedule.",
    planLede:
      lang === "ar"
        ? "الشروط أدناه كما يطرحها المطور، وتُثبَّت في عقد الحجز."
        : "The terms below are the developer's release terms, fixed in the reservation contract.",
    example: lang === "ar" ? "مثال محسوب" : "Worked example",
    requestPlan: lang === "ar" ? "اطلب خطة السداد" : "Request the payment plan",
    gallery: lang === "ar" ? "صور المشروع" : "Project gallery",
    video: lang === "ar" ? "فيديو المشروع" : "Project film",
    indicative: lang === "ar" ? "تقديري" : "Indicative",
    call: lang === "ar" ? "اتصل" : "Call",
  };

  const rail = [
    { href: "#overview", label: t.overview },
    ...(detail.rates ? [{ href: "#rates", label: t.rates }] : []),
    ...(detail.units ? [{ href: "#units", label: t.units }] : []),
    { href: "#payment-plan", label: t.planKicker },
    { href: "#gallery", label: t.gallery },
  ];

  return (
    <div className="pdetail">
      <header
        className="pdetail-hero"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.32) 45%, rgba(0,0,0,0.74) 100%), url(${detail.cover})`,
        }}
      >
        <div className="pdetail-hero-inner">
          <p className="pdetail-kicker">{project.location}</p>
          <h1 className="pdetail-title">{project.name}</h1>
          <p className="pdetail-lede">{project.type}</p>
          <div className="pdetail-chips">
            <span className="pdetail-chip pdetail-chip--solid">{project.priceFrom}</span>
            <span className="pdetail-chip">{project.status}</span>
          </div>
        </div>
      </header>

      <nav className="pdetail-rail" aria-label={t.overview}>
        <div className="pdetail-rail-inner">
          {rail.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
          <a className="pdetail-rail-cta" href={contact.phoneHref} data-cta="phone" data-cta-surface="project-rail">
            {t.call} · {contact.phoneLabel}
          </a>
        </div>
      </nav>

      <section className="psec" id="overview">
        <div className="pwrap">
          <p className="pkicker">{t.facts}</p>
          <div className="pdetail-facts">
            {detail.facts.map((fact) => (
              <div className="pdetail-fact" key={fact.label.en}>
                <span>{fact.label[lang]}</span>
                <strong dir="auto">{fact.value[lang]}</strong>
              </div>
            ))}
          </div>

          <div className="pdetail-body">
            <div className="pdetail-copy">
              <h2 className="ptitle">{t.about}</h2>
              {detail.intro[lang].map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
              <p className="pdetail-note">{project.note}</p>
            </div>

            <aside className="pdetail-side">
              <h3 className="pdetail-side-title">{t.highlights}</h3>
              <ul className="pdetail-list">
                {detail.highlights[lang].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </section>

      {detail.rates ? (
        <section className="psec psec--off" id="rates">
          <div className="pwrap">
            <div className="phead">
              <div>
                <p className="pkicker">{t.rates}</p>
                <h2 className="ptitle">{t.rates}</h2>
                <p className="plede">{t.ratesLede}</p>
              </div>
            </div>
            <div className="pdetail-rates">
              {detail.rates.map((rate) => (
                <div className="pdetail-rate" key={rate.label.en}>
                  <span>{rate.label[lang]}</span>
                  <strong dir="ltr">{rate.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {detail.units ? (
        <section className="psec" id="units">
          <div className="pwrap">
            <div className="phead">
              <div>
                <p className="pkicker">{t.units}</p>
                <h2 className="ptitle">{t.units}</h2>
                <p className="plede">{t.unitsLede}</p>
              </div>
              <a className="pmore" href={whatsapp} target="_blank" rel="noopener noreferrer">
                {t.requestPlan}
                <span aria-hidden="true">→</span>
              </a>
            </div>

            <div className="pdetail-units">
              {detail.units.map((group) => (
                <article className="pdetail-unit-group" key={group.title.en}>
                  <h3>{group.title[lang]}</h3>
                  <div className="pdetail-unit-head">
                    <span>{t.unit}</span>
                    <span>{t.area}</span>
                    <span>{t.price}</span>
                  </div>
                  <ul>
                    {group.units.map((unit) => (
                      <li key={`${group.title.en}-${unit.area}-${unit.price}`}>
                        <span>{unit.label === "—" ? "" : unit.label}</span>
                        <bdi dir="ltr">{unit.area}</bdi>
                        <strong dir="ltr">{unit.price}</strong>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="psec psec--dark" id="payment-plan">
        <div className="pwrap">
          <div className="phead">
            <div>
              <p className="pkicker">{t.planKicker}</p>
              <h2 className="ptitle">{t.planTitle}</h2>
              <p className="plede">{t.planLede}</p>
            </div>
          </div>

          <div className="pdetail-plan">
            {detail.plan.stats.map((stat) => (
              <div className="pdetail-plan-stat" key={stat.label.en}>
                <strong dir="auto">{stat.value}</strong>
                <span>{stat.label[lang]}</span>
              </div>
            ))}
          </div>

          {detail.plan.example ? (
            <div className="pdetail-example">
              <span className="pdetail-example-tag">{t.example}</span>
              <p>{detail.plan.example[lang]}</p>
              <span className="pdetail-example-tag pdetail-example-tag--muted">{t.indicative}</span>
            </div>
          ) : null}

          <p className="pdetail-plan-note">{detail.plan.note[lang]}</p>

          <div className="pdetail-actions">
            <a className="btn btn--gold" href={contact.phoneHref} data-cta="phone" data-cta-surface="project-detail">
              {t.call} · {contact.phoneLabel}
            </a>
            <a
              className="btn btn--outline"
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              data-cta="whatsapp"
              data-cta-surface="project-detail"
            >
              {t.requestPlan}
            </a>
          </div>
        </div>
      </section>

      <section className="psec" id="gallery">
        <div className="pwrap">
          <p className="pkicker">{t.gallery}</p>
          <h2 className="ptitle">{project.name}</h2>
          <div className="pdetail-gallery">
            {detail.gallery.map((src, index) => (
              <img
                key={src}
                src={src}
                alt={detail.galleryAlt ? `${project.name} — ${detail.galleryAlt[lang]}` : `${project.name} — ${index + 1}`}
                loading="lazy"
                decoding="async"
              />
            ))}
          </div>

          {detail.videos ? (
            <>
              <p className="pkicker pdetail-video-kicker">{t.video}</p>
              <div className="pdetail-videos">
                {detail.videos.map((video) => (
                  <video
                    key={video.src}
                    src={video.src}
                    poster={video.poster}
                    controls
                    playsInline
                    preload="none"
                    aria-label={video.label[lang]}
                  />
                ))}
              </div>
            </>
          ) : null}
        </div>
      </section>

      <div className="pdetail-foot-cta">
        <div className="pwrap">
          <p>{copy.projectsLede}</p>
          <a className="btn btn--gold" href="#enquiry" data-cta="project_enquiry" data-cta-surface={detail.slug}>
            {lang === "ar" ? `استفسر عن ${project.name}` : `Ask about ${project.name}`}
          </a>
        </div>
      </div>
    </div>
  );
}
