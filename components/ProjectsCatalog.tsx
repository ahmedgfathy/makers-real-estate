import type { Content, Lang, Project } from "@/data/content";
import { ui } from "@/lib/labels";
import { projectPath, projectSlug } from "@/lib/project-routes";

export default function ProjectsCatalog({ c, lang }: { c: Content; lang: Lang }) {
  const labels = ui[lang];
  const projects = c.sections.projects.items;

  return (
    <section className="section projects" aria-labelledby="projects-title">
      <div className="section-inner">
        <div className="section-head">
          <div>
            <p className="section-kicker">{c.sections.projects.kicker}</p>
            <h1 className="section-title" id="projects-title">{labels.projects}</h1>
          </div>
          <p className="section-lede">{labels.projectsIntro}</p>
        </div>

        <div className="project-grid">
          {projects.map((project, index) => (
            <ProjectCard key={projectSlug(project)} project={project} index={index} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  index,
  lang,
}: {
  project: Project;
  index: number;
  lang: Lang;
}) {
  const slug = projectSlug(project);
  const hasDetailPage = slug === "sleek" || slug === "sarai";
  const href = hasDetailPage ? projectPath(project, lang) : `/${lang}/contact`;

  return (
    <article className="project-card" id={projectSlug(project)}>
      <a className="project-media" href={href} aria-label={project.name}>
        <img src={project.image} alt={project.name} loading={index === 0 ? "eager" : "lazy"} decoding="async" />
        <span className="project-status">{project.status}</span>
        <span className="project-index">0{index + 1}</span>
      </a>
      <div className="project-body">
        <div className="project-topline">
          <h2 className="project-name">{project.name}</h2>
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
        <a className="project-link" href={href}>
          {hasDetailPage ? ui[lang].viewProject : ui[lang].requestDetails}
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </article>
  );
}
