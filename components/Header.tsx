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
  contact,
  phoneHref,
}: {
  c: Content;
  lang: Lang;
  onLang: (l: Lang) => void;
  localeRoot: string;
  contact: Contact;
  phoneHref: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const labels = ui[lang];
  const prefix = localeRoot;

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("header-menu-open", menuOpen);
    return () => document.body.classList.remove("header-menu-open");
  }, [menuOpen]);

  const links = [
    { href: prefix, label: labels.home, match: (path: string) => path === prefix },
    {
      href: `${prefix}/projects`,
      label: labels.projects,
      match: (path: string) => path === `${prefix}/projects`,
    },
    {
      href: `${prefix}/locations`,
      label: lang === "ar" ? "المواقع" : "Locations",
      match: (path: string) => path.startsWith(`${prefix}/locations`),
    },
    {
      href: `${prefix}/search`,
      label: lang === "ar" ? "بحث" : "Search",
      match: (path: string) => path.startsWith(`${prefix}/search`),
    },
    { href: `${prefix}/#developers`, label: lang === "ar" ? "المطورون" : "Developers", match: () => false },
    { href: `${prefix}/about`, label: labels.aboutUs, match: (path: string) => path === `${prefix}/about` },
    { href: `${prefix}/contact`, label: labels.contactUs, match: (path: string) => path === `${prefix}/contact` },
  ];

  return (
    <header className="site-header">
      <a className="header-brand" href={prefix} aria-label={`${c.brand.name} — ${c.brand.sub}`}>
        <Brand name={c.brand.name} tagline={c.brand.tagline} />
      </a>

      <nav
        id="primary-navigation"
        className={`header-nav${menuOpen ? " is-open" : ""}`}
        aria-label={c.footer.sections}
      >
        {links.map((link) => (
          <a
            key={link.href}
            className="header-link"
            href={link.href}
            aria-current={link.match(pathname) ? "page" : undefined}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </a>
        ))}
      </nav>

      <div className="header-right">
        <a className="header-login" href="/login" aria-label={labels.login}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
          className="header-call"
          href={phoneHref}
          data-cta="phone"
          data-cta-surface="header"
          aria-label={`${c.nav.call} ${contact.phoneLabel}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M7.2 3.8h2.2l1.2 4.1-1.8 1.6a15.3 15.3 0 0 0 5.7 5.7l1.6-1.8 4.1 1.2v2.2c0 1.1-.9 2-2 2A15.2 15.2 0 0 1 5.2 5.8c0-1.1.9-2 2-2Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
          <strong className="phone" dir="ltr">
            {contact.phoneLabel}
          </strong>
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
      </div>
    </header>
  );
}
