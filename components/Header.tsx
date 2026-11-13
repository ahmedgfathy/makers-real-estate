"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { Contact, Content, Lang } from "@/data/content";
import { ui } from "@/lib/labels";
import Brand from "./Brand";

export default function Header({
  c,
  lang,
  onLang,
  localeRoot,
  solid = false,
  contact,
  phoneHref,
  whatsapp,
}: {
  c: Content;
  lang: Lang;
  onLang: (l: Lang) => void;
  localeRoot: string;
  solid?: boolean;
  contact: Contact;
  phoneHref: string;
  whatsapp: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const labels = ui[lang];
  const prefix = localeRoot;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header${scrolled || solid ? " is-scrolled" : ""}`}>
      <a className="header-brand" href={prefix} aria-label={c.brand.name + " — " + c.brand.sub}>
        <Brand name={c.brand.name} tagline={c.brand.tagline} />
      </a>

      <button
        type="button"
        className="header-menu-toggle"
        aria-expanded={menuOpen}
        aria-controls="primary-navigation"
        aria-label={menuOpen ? labels.closeMenu : labels.menu}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span />
        <span />
        <span />
      </button>

      <nav
        id="primary-navigation"
        className={`header-nav${menuOpen ? " is-open" : ""}`}
        aria-label={c.footer.sections}
      >
        <a className="header-link" href={prefix} aria-current={pathname === prefix ? "page" : undefined} onClick={() => setMenuOpen(false)}>
          {labels.home}
        </a>
        <a className="header-link" href={`${prefix}/projects`} aria-current={pathname.startsWith(`${prefix}/projects`) ? "page" : undefined} onClick={() => setMenuOpen(false)}>
          {labels.projects}
        </a>
        <a className="header-link" href={`${prefix}/about`} aria-current={pathname === `${prefix}/about` ? "page" : undefined} onClick={() => setMenuOpen(false)}>
          {labels.aboutUs}
        </a>
        <a className="header-link" href={`${prefix}/contact`} aria-current={pathname === `${prefix}/contact` ? "page" : undefined} onClick={() => setMenuOpen(false)}>
          {labels.contactUs}
        </a>
      </nav>

      <div className="header-right">
        <a className="header-call" href={phoneHref} data-cta="phone" data-cta-surface="header">
          <small>{c.nav.call}</small>
          <strong className="phone">{contact.phoneLabel}</strong>
        </a>

        <a className="header-login" href="/login" aria-label={labels.login}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 10V7.2a4 4 0 018 0V10" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="12" cy="15" r="1.2" fill="currentColor" />
          </svg>
          <span>{labels.login}</span>
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
          <span>{labels.whatsapp}</span>
        </a>
      </div>
    </header>
  );
}
