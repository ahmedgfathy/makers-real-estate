import type { Lang } from "@/data/content";
import { DEVELOPERS, projectsByDeveloper, type PortalCopy } from "@/data/portfolio";

export default function DeveloperSection({ lang, copy }: { lang: Lang; copy: PortalCopy }) {
  return (
    <section className="psec psec--off" id="developers" aria-labelledby="developers-title">
      <div className="pwrap">
        <div className="phead">
          <div>
            <p className="pkicker">{copy.developersKicker}</p>
            <h2 className="ptitle" id="developers-title">
              {copy.developersTitle}
            </h2>
            <p className="plede">{copy.developersLede}</p>
          </div>
        </div>

        <div className="pdevs">
          {DEVELOPERS.map((developer) => {
            const count = projectsByDeveloper(developer.slug, lang).length;
            return (
              <article className="pdev" key={developer.slug}>
                <h3 className="pdev-name">{developer.name}</h3>
                <p className="pdev-meta">
                  {count} {count === 1 ? copy.projectCount : copy.projectsCount}
                </p>
                <p className="pdev-blurb">{developer.blurb[lang]}</p>
                <a className="pdev-link" href={`/${lang}/projects?developer=${developer.slug}`}>
                  {copy.viewProjects}
                  <span aria-hidden="true">→</span>
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
