import type { Contact, Content, Lang } from "@/data/content";
import { ui } from "@/lib/labels";

/** Footer for the public catalogue pages. Mirrors the landing-page footer. */
export default function PublicFooter({
  c,
  contact,
  lang,
  whatsapp,
  phoneHref,
}: {
  c: Content;
  contact: Contact;
  lang: Lang;
  whatsapp: string;
  phoneHref: string;
}) {
  const t = ui[lang];

  return (
    <footer className="site-footer" id="contact">
      <div className="footer-inner">
        <div className="footer-cta">
          <div>
            <h2 className="footer-title">{c.footer.title}</h2>
            <p className="footer-lede">{c.footer.lede}</p>
          </div>

          <div className="advisor">
            <span className="advisor-name">{contact.name[lang]}</span>
            <span className="advisor-role">{c.footer.role}</span>
            <div className="advisor-actions">
              <a
                className="btn btn--solid btn--sm"
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                data-cta="whatsapp"
                data-cta-surface="footer"
              >
                <span>{c.footer.whatsapp}</span>
              </a>
              <a
                className="btn btn--ghost btn--sm phone"
                href={phoneHref}
                data-cta="phone"
                data-cta-surface="footer"
              >
                <span>{c.footer.call}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-grid">
          <div>
            <p className="footer-disclaimer">{c.footer.disclaimer}</p>
            <div className="footer-links" style={{ marginTop: "1.4rem" }}>
              <a className="footer-link" href="/">
                {c.brand.name}
              </a>
              <a className="footer-link" href="/projects">
                {t.projects}
              </a>
              <a className="footer-link" href="/properties">
                {t.properties}
              </a>
              <a className="footer-link" href="/#collection">
                {c.nav.collection}
              </a>
            </div>
          </div>

          <div className="footer-links">
            <a
              className="footer-link"
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              data-cta="whatsapp"
              data-cta-surface="footer-links"
            >
              {c.footer.whatsapp}
            </a>
            <a className="footer-link" href={phoneHref} data-cta="phone" data-cta-surface="footer-links">
              {c.footer.call}
            </a>
            <a className="footer-link" href="/login">
              {t.login}
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {c.footer.rights}
          </span>
          <span>{c.footer.builtWith}</span>
        </div>
      </div>
    </footer>
  );
}
