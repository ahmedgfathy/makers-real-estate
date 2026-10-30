# -*- coding: utf-8 -*-
import io, re

p = "/home/xinreal/makers/app/globals.css"
s = io.open(p, encoding="utf-8").read()
start = s.index("/* ---------- hero ---------- */")
end = s.index("/* ---------- reveal ---------- */")

new_hero = """/* ---------- hero (cinema frame) ---------- */

.hero {
  position: relative;
  min-height: 100svh;
  display: flex;
  align-items: center;
  padding-block: calc(var(--header-h) + clamp(0.75rem, 2.5vh, 2rem)) clamp(1.5rem, 4vh, 3rem);
  background: var(--bg);
}

.hero-inner {
  width: 100%;
  max-width: var(--maxw);
  margin-inline: auto;
  padding-inline: var(--pad);
  display: flex;
  flex-direction: column;
  gap: clamp(1rem, 2.2vw, 1.8rem);
}

/* the wide film band: fixed 2.35:1, never taller than ~58vh */
.hero-frame {
  position: relative;
  width: min(100%, calc(58vh * 2.35));
  aspect-ratio: 2.35 / 1;
  margin-inline: auto;
  overflow: hidden;
  border: 1px solid var(--line-strong);
  background: #000;
  isolation: isolate;
}

.hero-media { position: absolute; inset: 0; z-index: 0; }

.hero-media video,
.hero-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 58%;
}

.hero-scrim {
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    linear-gradient(180deg, rgba(8, 8, 10, 0.6) 0%, rgba(8, 8, 10, 0.08) 30%, rgba(8, 8, 10, 0.18) 56%, rgba(8, 8, 10, 0.9) 100%),
    linear-gradient(92deg, rgba(8, 8, 10, 0.6) 0%, rgba(8, 8, 10, 0.12) 46%, rgba(8, 8, 10, 0) 74%);
}

.hero-frame-top {
  position: absolute;
  z-index: 2;
  inset-block-start: 0;
  inset-inline: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: clamp(0.85rem, 2vw, 1.45rem) clamp(1rem, 2.6vw, 2rem);
}

.hero-frame-ref {
  font-size: 0.56rem;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  color: rgba(244, 240, 233, 0.55);
  white-space: nowrap;
}

html[lang="ar"] .hero-frame-ref {
  letter-spacing: 0.04em;
  text-transform: none;
  font-size: 0.7rem;
}

.hero-caption {
  position: absolute;
  z-index: 2;
  inset-block-end: 0;
  inset-inline: 0;
  padding: clamp(1rem, 2.4vw, 2rem) clamp(1rem, 2.6vw, 2rem) clamp(1.1rem, 2.4vw, 2rem);
}

.hero-title { display: flex; flex-direction: column; }

.hero-title-line {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4.8vw, 4.2rem);
  font-weight: 300;
  line-height: 0.88;
  letter-spacing: -0.03em;
}

.hero-title-line--italic {
  font-style: italic;
  color: rgba(244, 240, 233, 0.94);
  margin-inline-start: clamp(0rem, 2.6vw, 2.1rem);
}

html[lang="ar"] .hero-title-line {
  font-family: var(--font-arabic);
  font-weight: 600;
  line-height: 1.14;
  letter-spacing: 0;
  font-size: clamp(1.7rem, 3.9vw, 3.4rem);
}

html[lang="ar"] .hero-title-line--italic { font-style: normal; margin-inline-start: 0; }

.hero-place {
  margin-top: clamp(0.55rem, 1.1vw, 0.9rem);
  font-size: 0.62rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(244, 240, 233, 0.72);
}

html[lang="ar"] .hero-place {
  letter-spacing: 0.04em;
  font-size: 0.78rem;
  text-transform: none;
}

/* meta bar under the frame */
.hero-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: clamp(1rem, 2.4vw, 2.2rem);
  padding-top: clamp(0.85rem, 1.8vw, 1.3rem);
  border-top: 1px solid var(--line);
}

.hero-actions { display: flex; flex-wrap: wrap; gap: 0.6rem; }

.hero-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(0.9rem, 2vw, 2.2rem);
}

.hero-stat-value {
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 2.2vw, 2.1rem);
  font-weight: 300;
  line-height: 1;
  letter-spacing: -0.01em;
}

html[lang="ar"] .hero-stat-value {
  font-family: var(--font-arabic);
  font-weight: 600;
  font-size: clamp(1.2rem, 1.8vw, 1.75rem);
}

.hero-stat-label {
  margin-top: 0.5rem;
  font-size: 0.58rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--ink-faint);
  line-height: 1.4;
}

html[lang="ar"] .hero-stat-label {
  letter-spacing: 0.02em;
  font-size: 0.68rem;
  text-transform: none;
}

"""

s = s[:start] + new_hero + s[end:]

# reduced-motion block: drop the now-unused scroll animation line
s = s.replace("  html { scroll-behavior: auto; }\n  .hero-scroll { animation: none; }\n", "  html { scroll-behavior: auto; }\n")

# responsive hero rules
s = s.replace(
"""  .hero-foot { grid-template-columns: 1fr; gap: 2rem; }
  .hero-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.2rem; }""",
"""  .hero-frame { width: 100%; aspect-ratio: 16 / 9; }
  .hero-foot { align-items: flex-start; }
  .hero-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem 1.6rem; }""")

s = s.replace("  .header-nav { display: none; }\n  .hero-scroll { display: none; }\n", "  .header-nav { display: none; }\n")

s = s.replace(
"""  .hero-title-line { font-size: clamp(2.9rem, 17vw, 5rem); }
  .hero-title-line--italic { margin-inline-start: 1.4rem; }""",
"""  .hero-frame { aspect-ratio: 4 / 3; }
  .hero-title-line { font-size: clamp(1.8rem, 8.4vw, 2.6rem); }
  .hero-title-line--italic { margin-inline-start: 0.9rem; }
  .hero-actions { width: 100%; }
  .hero-actions .btn { flex: 1 1 auto; }
  .hero-frame-ref { display: none; }""")

io.open(p, "w", encoding="utf-8").write(s)
print("hero block replaced; remaining .hero-scroll refs:", s.count("hero-scroll"))