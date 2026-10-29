"use client";

import type { Contact, Content, Lang, TileId } from "@/data/content";
import { requestConsent } from "@/lib/analytics";
import { ui } from "@/lib/labels";

export default function Footer({
  c,
  contact,
  lang,
  whatsapp,
  phoneHref,
  onOpen,
}: {
  c: Content;
  contact: Contact;
  lang: Lang;
  whatsapp: string;
  phoneHref: string;
  onOpen: (id: TileId) => void;
}) {
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
              {c.tiles.map((tile) => (
                <button
                  key={tile.id}
                  type="button"
                  className="footer-link"
                  onClick={() => onOpen(tile.id)}
                >
                  {tile.index} — {tile.title}
                </button>
              ))}
            </div>
          </div>

          <div className="footer-links">
            <a className="footer-link" href="#collection">
              {c.nav.collection}
            </a>
            <a className="footer-link" href="#top">
              {ui[lang].top}
            </a>
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
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {c.footer.rights}
          </span>
          <span>{c.footer.builtWith}</span>
          <button type="button" className="footer-link" onClick={() => requestConsent()}>
            {ui[lang].cookies}
          </button>
        </div>
      </div>
    </footer>
  );
}