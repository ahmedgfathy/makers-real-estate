import type { Lang } from "@/data/content";
import { MARKETS, marketCount, type PortalCopy } from "@/data/portfolio";

export default function AreaSection({ lang, copy }: { lang: Lang; copy: PortalCopy }) {
  return (
    <section className="psec psec--off" id="areas" aria-labelledby="areas-title">
      <div className="pwrap">
        <div className="phead">
          <div>
            <p className="pkicker">{copy.areasKicker}</p>
            <h2 className="ptitle" id="areas-title">
              {copy.areasTitle}
            </h2>
            <p className="plede">{copy.areasLede}</p>
          </div>
          <a className="pmore" href={`/${lang}/projects`}>
            {copy.viewMore}
            <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className="pareas">
          {MARKETS.map((area) => {
            const count = marketCount(area.slug, lang);
            const unit = count === 1 ? copy.projectCount : copy.projectsCount;
            return (
              <a
                className="parea"
                key={area.slug}
                href={`/${lang}/projects?city=${area.slug}`}
                aria-label={`${area.name[lang]} — ${count} ${unit}`}
              >
                <img src={area.image} alt="" loading="lazy" decoding="async" />
                <span className="parea-count">
                  {count} {unit}
                </span>
                <span className="parea-name">{area.name[lang]}</span>
                <span className="parea-blurb">{area.blurb[lang]}</span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
