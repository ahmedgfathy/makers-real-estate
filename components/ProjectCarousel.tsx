"use client";

import { useEffect, useState } from "react";
import type { Project, Lang } from "@/data/content";
import { ui } from "@/lib/labels";
import { projectPath, projectSlug } from "@/lib/project-routes";

export default function ProjectCarousel({
  projects,
  lang,
}: {
  projects: Project[];
  lang: Lang;
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const labels = ui[lang];
  const project = projects[active];

  useEffect(() => {
    if (
      paused ||
      projects.length < 2 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return;
    const timer = window.setInterval(() => {
      setActive((index) => (index + 1) % projects.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [paused, projects.length]);

  if (!project) return null;

  const move = (offset: number) => {
    setActive((index) => (index + offset + projects.length) % projects.length);
  };
  const target = projectPath(project, lang);

  return (
    <section
      className="project-carousel"
      aria-label={labels.projects}
      aria-roledescription={lang === "ar" ? "عرض شرائح" : "carousel"}
    >
      {projects.map((item, index) => (
        <div
          key={projectSlug(item)}
          className={`project-carousel-slide${index === active ? " is-active" : ""}`}
          aria-hidden={index !== active}
        >
          <img src={item.image} alt="" fetchPriority={index === active ? "high" : "auto"} />
        </div>
      ))}
      <div className="project-carousel-scrim" />

      <div className="project-carousel-content" aria-live={paused ? "polite" : "off"}>
        <p className="project-carousel-eyebrow">{project.status}</p>
        <h1 className="project-carousel-title">{project.name}</h1>
        <p className="project-carousel-location">{project.location}</p>
        <p className="project-carousel-summary">{project.note}</p>
        <a className="btn btn--gold project-carousel-cta" href={target}>
          {labels.viewProject}
          <span aria-hidden="true">↗</span>
        </a>
        <a className="project-carousel-all" href={`/${lang}/projects`}>
          {labels.seeAllProjects}
        </a>
      </div>

      <div className="project-carousel-controls">
        <button
          type="button"
          onClick={() => {
            setPaused(true);
            move(-1);
          }}
          aria-label={labels.previousProject}
        >
          <span aria-hidden="true">←</span>
        </button>
        <span className="project-carousel-count" aria-live="off">
          {String(active + 1).padStart(2, "0")} <span>/</span> {String(projects.length).padStart(2, "0")}
        </span>
        <button
          type="button"
          onClick={() => {
            setPaused(true);
            move(1);
          }}
          aria-label={labels.nextProject}
        >
          <span aria-hidden="true">→</span>
        </button>
        <button
          type="button"
          className="project-carousel-toggle"
          onClick={() => setPaused((value) => !value)}
          aria-label={paused ? labels.playSlideshow : labels.pauseSlideshow}
        >
          {paused ? "▶" : "Ⅱ"}
        </button>
      </div>

      <div className="project-carousel-dots" role="group" aria-label={labels.projects}>
        {projects.map((item, index) => (
          <button
            type="button"
            key={projectSlug(item)}
            className={index === active ? "is-active" : ""}
            aria-label={`${item.name} ${labels.projectOf} ${projects.length}`}
            aria-pressed={index === active}
            onClick={() => {
              setActive(index);
              setPaused(true);
            }}
          />
        ))}
      </div>
    </section>
  );
}
