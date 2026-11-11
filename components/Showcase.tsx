import type { ReactNode } from "react";
import type { Content, Lang } from "@/data/content";

function Kicker({ children }: { children: ReactNode }) {
  return <p className="section-kicker">{children}</p>;
}

export default function Showcase({ c, lang }: { c: Content; lang: Lang }) {
  const s = c.sections;

  return (
    <>
      <section className="section intro" id="about">
        <div className="section-inner intro-inner">
          <div className="intro-copy">
            <Kicker>{s.intro.kicker}</Kicker>
            <h2 className="section-title">{s.intro.title}</h2>
            <p className="section-lede">{s.intro.lede}</p>
            <p className="intro-body">{s.intro.body}</p>
          </div>

          <div className="intro-facts">
            {s.intro.facts.map((fact) => (
              <div className="intro-fact" key={fact.label}>
                <span className="intro-fact-value">{fact.value}</span>
                <span className="intro-fact-label">{fact.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section projects" id="projects">
        <div className="section-inner">
          <div className="section-head">
            <div>
              <Kicker>{s.projects.kicker}</Kicker>
              <h2 className="section-title">{s.projects.title}</h2>
            </div>
            <p className="section-lede">{s.projects.lede}</p>
          </div>

          <div className="project-grid">
            {s.projects.items.map((project, index) => (
              <article className="project-card" key={project.name}>
                <a className="project-media" href="#enquiry" aria-label={project.name}>
                  <img src={project.image} alt={project.name} loading={index === 0 ? "eager" : "lazy"} decoding="async" />
                  <span className="project-status">{project.status}</span>
                  <span className="project-index">0{index + 1}</span>
                </a>

                <div className="project-body">
                  <div className="project-topline">
                    <h3 className="project-name">{project.name}</h3>
                    <span className="project-location">{project.location}</span>
                  </div>

                  <div className="project-meta">
                    <span>
                      <small>{lang === "ar" ? "النوع" : "Type"}</small>
                      {project.type}
                    </span>
                    <span>
                      <small>{lang === "ar" ? "السعر" : "Price"}</small>
                      {project.priceFrom}
                    </span>
                  </div>

                  <p className="project-note">{project.note}</p>

                  <a className="project-link" href="#enquiry">
                    {lang === "ar" ? "اطلب المتاح" : "Request availability"}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section why" id="why">
        <div className="section-inner">
          <div className="section-head section-head--light">
            <div>
              <Kicker>{s.advantages.kicker}</Kicker>
              <h2 className="section-title">{s.advantages.title}</h2>
            </div>
            <p className="section-lede">{s.advantages.lede}</p>
          </div>

          <div className="why-grid">
            {s.advantages.items.map((item, index) => (
              <div className="why-item" key={item.title}>
                <span className="why-index">0{index + 1}</span>
                <h3 className="why-title">{item.title}</h3>
                <p className="why-text">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section amenities" id="amenities">
        <div className="section-inner amenities-inner">
          <div className="amenities-media">
            <img src={s.amenities.image} alt="" loading="lazy" decoding="async" />
            <span className="amenities-caption">{s.amenities.kicker}</span>
          </div>

          <div className="amenities-copy">
            <Kicker>{s.amenities.kicker}</Kicker>
            <h2 className="section-title">{s.amenities.title}</h2>
            <p className="section-lede">{s.amenities.lede}</p>

            <ul className="amenity-list">
              {s.amenities.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section payment" id="payment">
        <div className="section-inner">
          <div className="payment-head">
            <div>
              <Kicker>{s.payment.kicker}</Kicker>
              <h2 className="section-title">{s.payment.title}</h2>
            </div>
            <p className="section-lede">{s.payment.lede}</p>
          </div>

          <div className="payment-stats">
            {s.payment.stats.map((stat) => (
              <div className="payment-stat" key={stat.label}>
                <span>{stat.value}</span>
                <small>{stat.label}</small>
              </div>
            ))}
          </div>

          <div className="payment-foot">
            <p>{s.payment.note}</p>
            <a className="btn btn--forest" href="#enquiry">
              {lang === "ar" ? "اطلب خطة السداد" : "Request the payment plan"}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
