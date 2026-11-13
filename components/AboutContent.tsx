import type { Content, Lang } from "@/data/content";
import { ui } from "@/lib/labels";

export default function AboutContent({ c, lang }: { c: Content; lang: Lang }) {
  const intro = c.sections.intro;
  const values = c.sections.advantages;

  return (
    <>
      <section className="section about-page" aria-labelledby="about-title">
        <div className="section-inner intro-inner">
          <div className="intro-copy">
            <p className="section-kicker">{intro.kicker}</p>
            <h1 className="section-title" id="about-title">{ui[lang].aboutTitle}</h1>
            <p className="section-lede">{intro.lede}</p>
            <p className="intro-body">{ui[lang].aboutLede}</p>
            <p className="intro-body">{intro.body}</p>
          </div>
          <div className="intro-facts">
            {intro.facts.map((fact) => (
              <div className="intro-fact" key={fact.label}>
                <span className="intro-fact-value">{fact.value}</span>
                <span className="intro-fact-label">{fact.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section why" aria-labelledby="about-values-title">
        <div className="section-inner">
          <div className="section-head section-head--light">
            <div>
              <p className="section-kicker">{values.kicker}</p>
              <h2 className="section-title" id="about-values-title">{values.title}</h2>
            </div>
            <p className="section-lede">{values.lede}</p>
          </div>
          <div className="why-grid">
            {values.items.map((item, index) => (
              <article className="why-item" key={item.title}>
                <span className="why-index">0{index + 1}</span>
                <h3 className="why-title">{item.title}</h3>
                <p className="why-text">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
