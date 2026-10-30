import io

root = "/home/xinreal/makers/"
miss = []

def patch(path, pairs):
    p = root + path
    with io.open(p, encoding="utf-8") as f:
        s = f.read()
    for old, new in pairs:
        if old not in s:
            miss.append((path, old[:60]))
            continue
        s = s.replace(old, new, 1)
    with io.open(p, "w", encoding="utf-8") as f:
        f.write(s)

patch("app/globals.css", [
    ("  line-height: 1.6;\n  -webkit-font-smoothing: antialiased;",
     "  line-height: 1.6;\n  font-variant-numeric: lining-nums;\n  -webkit-font-smoothing: antialiased;"),
    ("  margin-block: clamp(1.2rem, 3vh, 2rem) 0;",
     "  margin-block: clamp(2.4rem, 5.5vh, 3.6rem) 0;"),
    ("""html[lang="ar"] .hero-title-line {
  font-family: var(--font-arabic);
  font-weight: 600;
  line-height: 1.05;
  letter-spacing: 0;
  font-size: clamp(3rem, 9vw, 8rem);
}

html[lang="ar"] .hero-title-line--italic { font-style: normal; }""",
     """html[lang="ar"] .hero-title-line {
  font-family: var(--font-arabic);
  font-weight: 600;
  line-height: 1.16;
  letter-spacing: 0;
  font-size: clamp(2.5rem, 7.2vw, 6.2rem);
}

html[lang="ar"] .hero-title-line--italic { font-style: normal; margin-inline-start: 0; }

html[lang="ar"] .hero-place { margin-top: 1.9rem; }"""),
    ("  overflow: hidden;\n  transition: color 0.4s var(--ease), border-color 0.4s var(--ease),\n    background 0.4s var(--ease);\n}",
     "  overflow: hidden;\n  white-space: nowrap;\n  transition: color 0.4s var(--ease), border-color 0.4s var(--ease),\n    background 0.4s var(--ease);\n}"),
])

# append new utility rules
with io.open(root + "app/globals.css", "a", encoding="utf-8") as f:
    f.write("""
/* ---------- numerals, bidi helpers, small screens ---------- */

.display,
.hero-title-line,
.panel-title,
.collection-title,
.footer-title,
.stat-value,
.hero-stat-value,
.tile-index,
.price-value,
.advisor-name {
  font-variant-numeric: lining-nums;
  font-feature-settings: "lnum" 1, "onum" 0;
}

.phone {
  direction: ltr;
  unicode-bidi: isolate;
  display: inline-block;
}

@media (max-width: 720px) {
  .hero-phone { display: none; }
}

@media (max-width: 640px) {
  .site-header .btn { display: none; }
  .header-right { gap: 0.7rem; }
}
""")

patch("app/site.css", [
    ("    linear-gradient(180deg, rgba(8, 8, 10, 0.1) 0%, rgba(8, 8, 10, 0.06) 38%, rgba(8, 8, 10, 0.7) 78%, rgba(8, 8, 10, 0.94) 100%);",
     "    linear-gradient(180deg, rgba(8, 8, 10, 0.18) 0%, rgba(8, 8, 10, 0.08) 32%, rgba(8, 8, 10, 0.55) 60%, rgba(8, 8, 10, 0.9) 84%, rgba(8, 8, 10, 0.97) 100%);"),
    ("  background: rgba(5, 5, 6, 0.76);", "  background: rgba(5, 5, 6, 0.85);"),
])

patch("components/Header.tsx", [
    ('className="header-link" href={"tel:+201009500083"}', 'className="header-link phone" href="tel:+201009500083"'),
])

patch("components/Hero.tsx", [
    ('<a className="btn btn--ghost" href={phoneHref} aria-label={c.footer.call}>',
     '<a className="btn btn--ghost hero-phone phone" href={phoneHref} aria-label={c.footer.call}>'),
    ("""
      <span className="hero-scroll" aria-hidden="true">
        {c.hero.scroll}
      </span>
""", "\n"),
])

patch("components/Footer.tsx", [
    ('import { contact } from "@/data/content";',
     'import { contact } from "@/data/content";\nimport { ui } from "@/lib/labels";'),
    ('<a className="btn btn--ghost btn--sm" href={phoneHref}>',
     '<a className="btn btn--ghost btn--sm phone" href={phoneHref}>'),
    ('<a className="footer-link" href="#top">\n              {c.hero.scroll}\n            </a>',
     '<a className="footer-link" href="#top">\n              {ui[lang].top}\n            </a>'),
])

patch("components/Panel.tsx", [
    ("""          <span className="panel-foot-meta">
            {contact.name[lang]} · {contact.phoneLabel}
          </span>""",
     """          <span className="panel-foot-meta">
            {contact.name[lang]} · <span className="phone">{contact.phoneLabel}</span>
          </span>"""),
])

patch("lib/labels.ts", [
    ('openTile: "Open",', 'openTile: "Open",\n    top: "Back to top",'),
    ('openTile: "افتح",', 'openTile: "افتح",\n    top: "أعلى الصفحة",'),
])

print("MISSES:", len(miss))
for m in miss:
    print("  MISS", m)