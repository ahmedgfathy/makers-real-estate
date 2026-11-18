import type { Content, Lang } from "@/data/content";
import type { PortalCopy } from "@/data/portfolio";

/**
 * Dark band: the company's own positioning copy plus the headline numbers and
 * the four reasons Makers sells primary only. Content comes from
 * `content[lang].sections` so it stays database-driven.
 */
export default function JourneySection({
  lang,
  c,
  copy,
}: {
  lang: Lang;
  c: Content;
  copy: PortalCopy;
}) {
  const { advantages, intro } = c.sections;

  return (
    <section className="psec psec--dark" id="why" aria-labelledby="why-title">
      <div className="pwrap">
        <div className="phead">
          <div>
            <p className="pkicker">{advantages.kicker}</p>
            <h2 className="ptitle" id="why-title">
              {advantages.title}
            </h2>
            <p className="plede">{advantages.lede}</p>
          </div>
          <a className="pmore" href={`/${lang}/about`}>
            {copy.viewMore}
            <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className="pstats">
          {intro.facts.map((fact) => (
            <div key={fact.label}>
              <div className="pstat-value" dir="auto">
                {fact.value}
              </div>
              <div className="pstat-label">{fact.label}</div>
            </div>
          ))}
        </div>

        <div className="pwhy">
          {advantages.items.map((item, index) => (
            <article className="pwhy-item" key={item.title}>
              <span className="pwhy-index">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="pwhy-title">{item.title}</h3>
              <p className="pwhy-text">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
