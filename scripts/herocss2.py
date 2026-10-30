# -*- coding: utf-8 -*-
import io
p = "/home/xinreal/makers/app/globals.css"
s = io.open(p, encoding="utf-8").read()
orig = s

pairs = [
# wider canvas for the hero only
(""".hero-inner {
  width: 100%;
  max-width: var(--maxw);""",
 """.hero-inner {
  width: 100%;
  max-width: 1760px;"""),
# a bit more presence
("""  width: min(100%, calc(58vh * 2.35));""",
 """  width: min(100%, calc(62vh * 2.35));"""),
# soft projected-film vignette inside the band
(""".hero-media { position: absolute; inset: 0; z-index: 0; }""",
 """.hero-frame::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  box-shadow: inset 0 0 90px rgba(0, 0, 0, 0.55);
}

.hero-media { position: absolute; inset: 0; z-index: 0; }"""),
# mobile refinements
("""  .hero-frame { aspect-ratio: 4 / 3; }
  .hero-title-line { font-size: clamp(1.8rem, 8.4vw, 2.6rem); }""",
 """  .hero-frame { aspect-ratio: 4 / 3; }
  .hero-frame-top { padding: 0.7rem 0.85rem; align-items: flex-start; }
  .hero-frame-top .eyebrow { font-size: 0.53rem; letter-spacing: 0.16em; max-width: 78%; }
  .hero-frame-top .eyebrow::before { width: 16px; }
  .hero-caption { padding: 0.8rem 0.85rem 1rem; }
  .hero-place { font-size: 0.55rem; letter-spacing: 0.22em; }
  .hero-title-line { font-size: clamp(1.7rem, 7.6vw, 2.4rem); }"""),
]

for old, new in pairs:
    print(("ok  " if old in s else "MISS"), old.splitlines()[0][:60])
    s = s.replace(old, new, 1)

io.open(p, "w", encoding="utf-8").write(s)
print("changed:", s != orig)