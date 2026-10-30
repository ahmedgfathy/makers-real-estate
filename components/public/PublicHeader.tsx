import type { Content, Lang } from "@/data/content";
import { ui } from "@/lib/labels";
import Brand from "../Brand";

/**
 * Header for the public catalogue pages (/projects, /properties).
 *
 * Mirrors the landing-page header, but links are real routes instead of
 * in-page hashes, and the language switch is a link that preserves the path.
 */
export default function PublicHeader({
  c,
  lang,
  basePath,
  whatsapp,
  phoneHref,
  active,
}: {
  c: Content;
  lang: Lang;
  basePath: string;
  whatsapp: string;
  phoneHref: string;
  active: "projects" | "properties";
}) {
  const t = ui[lang];
  const langHref = (next: Lang) => `${basePath}?lang=${next}`;

  return (
    <header className="site-header is-scrolled">
      <a href="/" aria-label={`${c.brand.name} — ${c.brand.sub}`}>
        <Brand name={c.brand.name} tagline={c.brand.tagline} />
      </a>

      <div className="header-right">
        <nav className="header-nav" aria-label={c.footer.sections}>
          <a className="header-link" href="/#collection">
            {c.nav.collection}
          </a>
          <a className="header-link" href="/projects" data-active={active === "projects"}>
            {t.projects}
          </a>
          <a className="header-link" href="/properties" data-active={active === "properties"}>
            {t.properties}
          </a>
          <a className="header-link phone" href={phoneHref} data-cta="phone" data-cta-surface="header">
            {c.footer.call}
          </a>
        </nav>

        <a className="header-login" href="/login" aria-label={t.login}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 10V7.2a4 4 0 018 0V10" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="12" cy="15" r="1.2" fill="currentColor" />
          </svg>
          <span>{t.login}</span>
        </a>

        <div className="lang-switch" role="group" aria-label="Language / اللغة">
          <a className="lang-opt" data-active={lang === "en"} href={langHref("en")} aria-current={lang === "en"}>
            EN
          </a>
          <a className="lang-opt" data-active={lang === "ar"} href={langHref("ar")} aria-current={lang === "ar"}>
            ع
          </a>
        </div>

        <a
          className="btn btn--solid btn--sm"
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          data-cta="whatsapp"
          data-cta-surface="header"
        >
          <span>{t.book}</span>
        </a>
      </div>
    </header>
  );
}
