"use client";

import { useEffect, useState } from "react";
import type { Contact, Content, Lang } from "@/data/content";
import { ui } from "@/lib/labels";
import Brand from "./Brand";

export default function Header({
  c,
  lang,
  onLang,
  contact,
  whatsapp,
  phoneHref,
}: {
  c: Content;
  lang: Lang;
  onLang: (l: Lang) => void;
  contact: Contact;
  whatsapp: string;
  phoneHref: string;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      <a className="header-brand" href="#top" aria-label={c.brand.name + " — " + c.brand.sub}>
        <Brand name={c.brand.name} tagline={c.brand.tagline} />
      </a>

      <nav className="header-nav" aria-label={c.footer.sections}>
        <a className="header-link" href="#projects">
          {c.nav.projects}
        </a>
        <a className="header-link" href="#why">
          {c.nav.why}
        </a>
        <a className="header-link" href="#payment">
          {c.nav.payment}
        </a>
        <a className="header-link" href="#enquiry">
          {c.nav.contact}
        </a>
      </nav>

      <div className="header-right">
        <a className="header-call" href={phoneHref} data-cta="phone" data-cta-surface="header">
          <small>{c.nav.call}</small>
          <strong className="phone">{contact.phoneLabel}</strong>
        </a>

        <a className="header-login" href="/login" aria-label={ui[lang].login}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 10V7.2a4 4 0 018 0V10" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="12" cy="15" r="1.2" fill="currentColor" />
          </svg>
          <span>{ui[lang].login}</span>
        </a>

        <div className="lang-switch" role="group" aria-label="Language / اللغة">
          <button
            type="button"
            className="lang-opt"
            data-active={lang === "en"}
            onClick={() => onLang("en")}
            aria-pressed={lang === "en"}
          >
            EN
          </button>
          <button
            type="button"
            className="lang-opt"
            data-active={lang === "ar"}
            onClick={() => onLang("ar")}
            aria-pressed={lang === "ar"}
          >
            ع
          </button>
        </div>

        <a
          className="btn btn--gold btn--sm header-cta"
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          data-cta="whatsapp"
          data-cta-surface="header"
        >
          <span>{ui[lang].whatsapp}</span>
        </a>
      </div>
    </header>
  );
}
