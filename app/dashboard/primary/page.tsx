import { canPublish, getSession } from "@/lib/auth";
import { listDevelopers } from "@/lib/developers";
import { listProperties } from "@/lib/admin";
import { listProjects } from "@/lib/projects";
import PublishToggle from "@/components/dashboard/PublishToggle";
import PropertyCard from "@/components/dashboard/PropertyCard";

export const dynamic = "force-dynamic";

export default async function PrimaryPage() {
  const mayPublish = canPublish(await getSession());
  const [developers, projects, properties] = await Promise.all([
    listDevelopers(),
    listProjects(),
    listProperties({ limit: 500 }),
  ]);
  const totalUnits = properties.length;

  return (
    <div className="dash-page primary-hierarchy">
      <header className="dash-head">
        <div>
          <span className="dash-kicker">Primary portfolio</span>
          <h1>Developers, projects &amp; units</h1>
          <p>
            Organize your website collection as a portfolio: developers contain projects, and each
            project contains the units your team wants to show.
          </p>
        </div>
        <div className="dash-actions">
          <a className="dash-btn dash-btn--gold" href="/dashboard/developers/new">+ Add developer</a>
          <a className="dash-btn" href="/dashboard/projects/new">+ Add project</a>
          <a className="dash-btn" href="/dashboard/inventory/new">+ Add unit</a>
        </div>
      </header>

      <div className="portfolio-summary">
        <div><strong>{developers.length}</strong><span>Developers</span></div>
        <div><strong>{projects.length}</strong><span>Projects</span></div>
        <div><strong>{totalUnits}</strong><span>Units</span></div>
        <p>Publish a developer, project and unit to make its collection visible on the website.</p>
      </div>

      {developers.length ? (
        <div className="developer-stack">
          {developers.map((developer) => {
            const developerProjects = projects.filter((project) => project.developerSlug === developer.slug);
            const developerUnits = properties.filter((unit) =>
              developerProjects.some((project) => project.slug === unit.project_slug)
            );

            return (
              <section className="developer-panel" key={developer.slug}>
                <div className="developer-panel-head">
                  <div className="developer-monogram" aria-hidden="true">{developer.name.slice(0, 1)}</div>
                  <div className="developer-heading">
                    <span className="dash-kicker">Developer · {developerProjects.length} projects · {developerUnits.length} units</span>
                    <h2>{developer.name}</h2>
                    {developer.name_ar ? <p dir="rtl">{developer.name_ar}</p> : null}
                  </div>
                  <div className="developer-panel-actions">
                    <PublishToggle
                      kind="developer"
                      id={developer.slug}
                      published={developer.published}
                      canPublish={mayPublish}
                      compact
                    />
                    <a className="dash-btn" href={`/dashboard/developers/${developer.slug}`}>Edit developer</a>
                    <a className="dash-btn dash-btn--gold" href={`/dashboard/projects/new?developer=${encodeURIComponent(developer.slug)}`}>+ Add project</a>
                  </div>
                </div>

                {developerProjects.length ? (
                  <div className="developer-project-list">
                    {developerProjects.map((project) => {
                      const units = properties.filter((unit) => unit.project_slug === project.slug);
                      return (
                        <article className="portfolio-project" key={project.slug}>
                          <div className="portfolio-project-head">
                            <a className="portfolio-project-title" href={`/dashboard/projects/${project.slug}`}>
                              {project.heroImage ? <img src={project.heroImage} alt="" /> : <span className="portfolio-project-placeholder">{project.name.slice(0, 1)}</span>}
                              <span>
                                <strong>{project.name}</strong>
                                <small>{project.location} · {units.length} {units.length === 1 ? "unit" : "units"}</small>
                              </span>
                            </a>
                            <div className="portfolio-project-actions">
                              <PublishToggle
                                kind="project"
                                id={project.slug}
                                published={project.published}
                                canPublish={mayPublish}
                                compact
                              />
                              <a className="dash-link" href={`/dashboard/projects/${project.slug}`}>Edit project →</a>
                              <a className="dash-btn dash-btn--quiet" href={`/dashboard/inventory/new?project=${encodeURIComponent(project.slug)}`}>+ Add unit</a>
                            </div>
                          </div>

                          {units.length ? (
                            <div className="portfolio-unit-grid">
                              {units.map((unit) => <PropertyCard key={unit.id} property={unit} canPublish={mayPublish} />)}
                            </div>
                          ) : (
                            <div className="portfolio-empty-unit">
                              <span>No units in this project yet.</span>
                              <a className="dash-link" href={`/dashboard/inventory/new?project=${encodeURIComponent(project.slug)}`}>Add the first unit →</a>
                            </div>
                          )}
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <div className="portfolio-empty-unit">
                    <span>No projects for this developer yet.</span>
                    <a className="dash-link" href={`/dashboard/projects/new?developer=${encodeURIComponent(developer.slug)}`}>Add the first project →</a>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      ) : (
        <section className="dash-empty">
          <div className="dash-empty-icon">⌂</div>
          <h2>Start your portfolio</h2>
          <p>Add a developer, then create projects and add their units to the collection.</p>
          <a className="dash-btn dash-btn--gold" href="/dashboard/developers/new">Add your first developer</a>
        </section>
      )}

      <p className="dash-note" style={{ marginTop: "1rem" }}>
        Website visibility follows the hierarchy: a project appears only when its developer and project are published; a unit also needs its own publish switch turned on.
      </p>
    </div>
  );
}
