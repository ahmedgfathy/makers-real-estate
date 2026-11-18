import type { Contact, Lang, Project } from "@/data/content";
import type { PortalCopy, ProjectDetail as Detail } from "@/data/portfolio";

/**
 * Shared detail page for the projects that do not have a hand-built component
 * (Sleek and Sarai do). Facts, highlights and the payment plan all come from
 * PROJECT_DETAILS in data/portfolio.ts, so adding a project is a data change.
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
    facts: lang === "ar" ? "لمحة سريعة" : "At a glance",
    about: lang === "ar" ? "عن المشروع" : "About the project",
    highlights: lang === "ar" ? "أبرز ما في المشروع" : "What the project includes",
    planKicker: lang === "ar" ? "خطة السداد" : "Payment plan",
    planTitle: lang === "ar" ? "المقدم والتقسيط من المطور." : "The developer's own schedule.",
    planLede:
      lang === "ar"
        ? "الفترة والسداد هنا كما يطرحها المطور، وتُثبَّت في عقد الحجز."
        : "The terms below are the developer's release terms, fixed in the reservation contract.",
    example: lang === "ar" ? "مثال" : "Worked example",
    requestPlan: lang === "ar" ? "اطلب خطة السداد" : "Request the payment plan",
    gallery: lang === "ar" ? "صور المشروع" : "Project gallery",
    indicative: lang === "ar" ? "تقديري" : "Indicative",
  };

  return (
    <div className="pdetail">
      <header
        className="pdetail-hero"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.72) 100%), url(${detail.cover})`,
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

      <section className="psec">
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

          <div className="pdetail-example">
            <span className="pdetail-example-tag">{t.example}</span>
            <p>{detail.plan.example[lang]}</p>
            <span className="pdetail-example-tag pdetail-example-tag--muted">{t.indicative}</span>
          </div>

          <p className="pdetail-plan-note">{detail.plan.note[lang]}</p>

          <div className="pdetail-actions">
            <a className="btn btn--gold" href={contact.phoneHref} data-cta="phone" data-cta-surface="project-detail">
              {copy.call} · {contact.phoneLabel}
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

      <section className="psec">
        <div className="pwrap">
          <p className="pkicker">{t.gallery}</p>
          <h2 className="ptitle">{project.name}</h2>
          <div className="pdetail-gallery">
            {detail.gallery.map((src) => (
              <img key={src} src={src} alt={`${project.name} — Makers Real Estate`} loading="lazy" decoding="async" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
