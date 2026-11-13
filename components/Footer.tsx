"use client";

import type { Contact, Content, Lang } from "@/data/content";
import { requestConsent } from "@/lib/analytics";
import { ui } from "@/lib/labels";

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

  return (
    <footer className="site-footer" id="contact">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="footer-wordmark">
              {c.brand.name}
              <small>{c.brand.tagline}</small>
            </span>
            <p>{c.brand.sub}</p>
          </div>

          <div className="footer-lede-wrap">
            <h2 className="footer-title">{c.footer.title}</h2>
            <p className="footer-lede">{c.footer.lede}</p>
          </div>

          <div className="advisor">
            <span className="advisor-label">{c.footer.role}</span>
            <span className="advisor-name">{contact.name[lang]}</span>

            <a className="advisor-number" href={whatsapp} target="_blank" rel="noopener noreferrer" data-cta="whatsapp" data-cta-surface="footer">
              <small>{lang === "ar" ? "واتساب فقط" : "WhatsApp only"}</small>
              <strong className="phone">{contact.whatsappLabel}</strong>
            </a>

            <a className="advisor-number" href={phoneHref} data-cta="phone" data-cta-surface="footer">
              <small>{lang === "ar" ? "للمكالمات" : "For calls"}</small>
              <strong className="phone">{contact.phoneLabel}</strong>
            </a>

            <div className="advisor-actions">
              <a className="btn btn--gold btn--sm" href={whatsapp} target="_blank" rel="noopener noreferrer" data-cta="whatsapp" data-cta-surface="footer">
                <span>{c.footer.whatsapp}</span>
              </a>
              <a className="btn btn--outline btn--sm" href={phoneHref} data-cta="phone" data-cta-surface="footer">
                <span>{c.footer.call}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-grid">
          <div className="footer-col">
            <span className="footer-col-title">{c.footer.sections}</span>
            <a className="footer-link" href={localeRoot}>{labels.home}</a>
            <a className="footer-link" href={`${localeRoot}/projects`}>{labels.projects}</a>
            <a className="footer-link" href={`${localeRoot}/about`}>{labels.aboutUs}</a>
            <a className="footer-link" href={`${localeRoot}/contact`}>{labels.contactUs}</a>
          </div>

          <div className="footer-col">
            <span className="footer-col-title">{labels.contactUs}</span>
            <a className="footer-link" href={`${localeRoot}/contact`}>{c.leadForm.kicker}</a>
            <a className="footer-link" href={whatsapp} target="_blank" rel="noopener noreferrer" data-cta="whatsapp" data-cta-surface="footer-links">
              {c.footer.whatsapp}
            </a>
            <a className="footer-link phone" href={phoneHref} data-cta="phone" data-cta-surface="footer-links">
              {contact.phoneLabel}
            </a>
            <a className="footer-link" href={localeRoot}>{labels.top}</a>
          </div>

          <div className="footer-col footer-col--wide">
            <span className="footer-col-title">{c.footer.builtWith}</span>
            <p className="footer-disclaimer">{c.footer.disclaimer}</p>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {c.footer.rights}</span>
          <button type="button" className="footer-link" onClick={() => requestConsent()}>
            {labels.cookies}
          </button>
        </div>
      </div>
    </footer>
  );
}
