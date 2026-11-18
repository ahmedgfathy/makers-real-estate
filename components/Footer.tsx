"use client";

import type { Contact, Content, Lang } from "@/data/content";
import { projectsOf } from "@/data/portfolio";
import { requestConsent } from "@/lib/analytics";
import { projectPath } from "@/lib/project-routes";
import { ui } from "@/lib/labels";
import Brand from "./Brand";

export default function Footer({
  c,
  contact,
  lang,
  localeRoot,
  whatsapp,
  phoneHref,
}: {
  c: Content;
  contact: Contact;
  lang: Lang;
  localeRoot: string;
  whatsapp: string;
  phoneHref: string;
}) {
  const labels = ui[lang];
  const projects = projectsOf(lang);

  return (
    <footer className="site-footer">
      <div className="pfooter-inner">
        <div className="pfooter-grid">
          <div className="pfooter-brand">
            <Brand name={c.brand.name} tagline={c.brand.tagline} />
            <p className="pfooter-about">{c.footer.lede}</p>
            <p className="pfooter-note">{c.footer.disclaimer}</p>
          </div>

          <nav className="pfooter-col" aria-label={labels.projects}>
            <h2 className="pfooter-title">{labels.projects}</h2>
            {projects.map((project) => (
              <a className="pfooter-link" href={projectPath(project, lang)} key={project.slug ?? project.name}>
                {project.name}
              </a>
            ))}
            <a className="pfooter-link" href={`${localeRoot}/projects`}>
              {labels.seeAllProjects}
            </a>
          </nav>

          <nav className="pfooter-col" aria-label={c.footer.sections}>
            <h2 className="pfooter-title">{c.footer.sections}</h2>
            <a className="pfooter-link" href={localeRoot}>
              {labels.home}
            </a>
            <a className="pfooter-link" href={`${localeRoot}/about`}>
              {labels.aboutUs}
            </a>
            <a className="pfooter-link" href={`${localeRoot}/contact`}>
              {labels.contactUs}
            </a>
            <a className="pfooter-link" href="/login">
              {labels.login}
            </a>
          </nav>

          <div className="pfooter-col">
            <h2 className="pfooter-title">{labels.contactUs}</h2>
            <span className="pfooter-title" style={{ margin: 0, fontWeight: 400, fontSize: "13px", color: "rgba(255,255,255,0.55)" }}>
              {c.footer.role}
            </span>
            <p style={{ margin: "6px 0 10px", color: "#fff", fontSize: "15px" }}>{contact.name[lang]}</p>
            <a className="pfooter-link phone" href={phoneHref} dir="ltr" data-cta="phone" data-cta-surface="footer">
              {contact.phoneLabel}
            </a>
            <a
              className="pfooter-link phone"
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              dir="ltr"
              data-cta="whatsapp"
              data-cta-surface="footer"
            >
              {contact.whatsappLabel}
            </a>
            <a className="pfooter-link" href={`${localeRoot}/contact`}>
              {c.leadForm.submit}
            </a>
          </div>
        </div>

        <div className="pfooter-bottom">
          <span>
            © {new Date().getFullYear()} {c.footer.rights}
          </span>
          <button type="button" className="pfooter-cookie" onClick={() => requestConsent()}>
            {labels.cookies}
          </button>
        </div>
      </div>
    </footer>
  );
}
