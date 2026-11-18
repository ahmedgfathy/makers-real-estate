import type { Contact, Lang, Project } from "@/data/content";
import type { PortalCopy } from "@/data/portfolio";
import { projectPath } from "@/lib/project-routes";

function WhatsAppIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M20 11.7a8.1 8.1 0 0 1-11.9 7.1L4 20l1.2-4A8.1 8.1 0 1 1 20 11.7Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7.2 3.8h2.2l1.2 4.1-1.8 1.6a15.3 15.3 0 0 0 5.7 5.7l1.6-1.8 4.1 1.2v2.2c0 1.1-.9 2-2 2A15.2 15.2 0 0 1 5.2 5.8c0-1.1.9-2 2-2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function projectWhatsApp(contact: Contact, project: Project, lang: Lang): string {
  const text =
    lang === "ar"
      ? `أهلاً، مهتم بمشروع ${project.name} — من فضلك ابعتلي قائمة الأسعار وخطة السداد.`
      : `Hello, I'm interested in ${project.name} — please send me the price list and payment plan.`;
  return `${contact.whatsapp}?text=${encodeURIComponent(text)}`;
}

export default function ProjectGrid({
  lang,
  copy,
  projects,
  contact,
}: {
  lang: Lang;
  copy: PortalCopy;
  projects: Project[];
  contact: Contact;
}) {
  return (
    <div className="pprojects">
      {projects.map((project) => {
        const href = projectPath(project, lang);
        return (
          <article className="pproject" id={project.slug} key={project.slug ?? project.name}>
            <a className="pproject-media" href={href} aria-label={project.name}>
              <img src={project.image} alt={project.name} loading="lazy" decoding="async" />
              {project.status ? <span className="pproject-badge">{project.status}</span> : null}
            </a>

            <div className="pproject-body">
              <h3 className="pproject-name">
                <a href={href}>{project.name}</a>
              </h3>
              <p className="pproject-loc">{project.location}</p>

              <div className="pproject-rows">
                <div className="pproject-row">
                  <span>{copy.priceLabel}</span>
                  <b dir="auto">{project.priceFrom}</b>
                </div>
                <div className="pproject-row">
                  <span>{copy.unitLabel}</span>
                  <b dir="auto">{project.type}</b>
                </div>
                <div className="pproject-row">
                  <span>{copy.deliveryLabel}</span>
                  <b dir="auto">{project.status}</b>
                </div>
              </div>

              <p className="pproject-note">{project.note}</p>

              <div className="pproject-actions">
                <a className="pproject-action" href={contact.phoneHref} data-cta="phone" data-cta-surface="project-card">
                  <PhoneIcon />
                  <span>{copy.call}</span>
                </a>
                <a
                  className="pproject-action pproject-action--wa"
                  href={projectWhatsApp(contact, project, lang)}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cta="whatsapp"
                  data-cta-surface="project-card"
                >
                  <WhatsAppIcon />
                  <span>{copy.whatsapp}</span>
                </a>
                <a className="pproject-action pproject-action--detail" href={href}>
                  <span>{copy.details}</span>
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
