import re

with open("app/globals.css", "r", encoding="utf-8") as f:
    content = f.read()

# Add .btn--glass if not present
glass_btn = """
.btn--glass {
  background: rgba(244, 240, 233, 0.08);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-color: rgba(244, 240, 233, 0.22);
  color: var(--ink);
}
.btn--glass::before { background: rgba(244, 240, 233, 0.2); }
.btn--glass:hover {
  color: var(--ink);
  border-color: var(--sand);
  box-shadow: 0 0 20px rgba(212, 180, 120, 0.2);
}
"""

if ".btn--glass" not in content:
    content = content.replace(".btn--sm { padding: 0.62rem 1.05rem; font-size: 0.66rem; }",
                              ".btn--sm { padding: 0.62rem 1.05rem; font-size: 0.66rem; }\n" + glass_btn)

new_hero_css = """/* ---------- hero (widescreen full-width) ---------- */

.hero {
  position: relative;
  min-height: 100svh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #08080a;
  overflow: hidden;
  isolation: isolate;
}

/* edge-to-edge media layer */
.hero-media-wrap {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.hero-media {
  position: absolute;
  inset: 0;
}

.hero-media video,
.hero-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 54%;
  transform: scale(1.02);
}

/* cinematic multi-layer scrims */
.hero-scrim {
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    linear-gradient(180deg, rgba(8, 8, 10, 0.85) 0%, rgba(8, 8, 10, 0.35) 18%, rgba(8, 8, 10, 0.1) 40%, rgba(8, 8, 10, 0.5) 75%, rgba(8, 8, 10, 0.95) 100%),
    linear-gradient(90deg, rgba(8, 8, 10, 0.72) 0%, rgba(8, 8, 10, 0.3) 48%, rgba(8, 8, 10, 0.15) 100%);
}

html[lang="ar"] .hero-scrim {
  background:
    linear-gradient(180deg, rgba(8, 8, 10, 0.85) 0%, rgba(8, 8, 10, 0.35) 18%, rgba(8, 8, 10, 0.1) 40%, rgba(8, 8, 10, 0.5) 75%, rgba(8, 8, 10, 0.95) 100%),
    linear-gradient(270deg, rgba(8, 8, 10, 0.72) 0%, rgba(8, 8, 10, 0.3) 48%, rgba(8, 8, 10, 0.15) 100%);
}

.hero-vignette {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: radial-gradient(circle at center, transparent 38%, rgba(8, 8, 10, 0.55) 100%);
  mix-blend-mode: multiply;
}

/* hero content container */
.hero-container {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: var(--maxw);
  margin-inline: auto;
  padding-inline: var(--pad);
  padding-top: calc(var(--header-h) + clamp(2.5rem, 7vh, 5.5rem));
  padding-bottom: clamp(2.5rem, 6vh, 4.5rem);
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1 0 auto;
}

.hero-content {
  max-width: 820px;
  display: flex;
  flex-direction: column;
}

/* glowing eyebrow pill badge */
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.38rem 0.95rem;
  border-radius: 999px;
  background: rgba(14, 14, 18, 0.68);
  border: 1px solid rgba(212, 180, 120, 0.28);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  width: fit-content;
  margin-bottom: clamp(1rem, 2.2vh, 1.6rem);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.hero-badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--gold);
  box-shadow: 0 0 10px var(--gold-glow);
  animation: badge-pulse 2.4s ease-in-out infinite;
}

@keyframes badge-pulse {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.4); opacity: 1; box-shadow: 0 0 14px var(--gold); }
}

/* editorial grand title */
.hero-title {
  display: flex;
  flex-direction: column;
  margin: 0;
}

.hero-title-line {
  font-family: var(--font-display);
  font-size: clamp(3rem, 7.5vw, 6.2rem);
  font-weight: 300;
  line-height: 0.88;
  letter-spacing: -0.035em;
  color: #fbf9f5;
  text-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
}

.hero-title-line--italic {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 300;
  color: #f4efe6;
  margin-inline-start: clamp(1.2rem, 3.8vw, 3.2rem);
  text-shadow: 0 4px 34px rgba(0, 0, 0, 0.6);
}

html[lang="ar"] .hero-title-line {
  font-family: var(--font-arabic);
  font-weight: 600;
  line-height: 1.12;
  letter-spacing: 0;
  font-size: clamp(2.3rem, 5.8vw, 4.8rem);
}

html[lang="ar"] .hero-title-line--italic {
  font-style: normal;
  margin-inline-start: 0;
}

.hero-location {
  margin-top: clamp(0.75rem, 1.5vh, 1.2rem);
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.hero-place {
  font-size: clamp(0.64rem, 0.85vw, 0.74rem);
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: rgba(244, 240, 233, 0.82);
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.6);
  font-weight: 400;
}

html[lang="ar"] .hero-place {
  letter-spacing: 0.04em;
  font-size: 0.88rem;
  text-transform: none;
}

/* editorial lede paragraph */
.hero-lede {
  margin-top: clamp(1rem, 2vh, 1.5rem);
  max-width: 54ch;
  font-size: clamp(0.92rem, 1.15vw, 1.08rem);
  line-height: 1.68;
  color: rgba(244, 240, 233, 0.84);
  font-weight: 300;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.8);
}

html[lang="ar"] .hero-lede {
  font-family: var(--font-arabic);
  font-size: clamp(0.95rem, 1.25vw, 1.15rem);
  line-height: 1.82;
  color: rgba(244, 240, 233, 0.88);
}

/* buttons */
.hero-actions {
  margin-top: clamp(1.4rem, 2.8vh, 2.2rem);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.85rem;
}

.hero-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.4), 0 0 20px rgba(212, 180, 120, 0.18);
}

.hero-btn-arrow {
  transition: transform 0.3s var(--ease);
}

.hero-btn-primary:hover .hero-btn-arrow {
  transform: translateX(4px);
}

html[lang="ar"] .hero-btn-arrow {
  transform: scaleX(-1);
}

html[lang="ar"] .hero-btn-primary:hover .hero-btn-arrow {
  transform: scaleX(-1) translateX(4px);
}

/* ---------- docked widescreen HUD stats ribbon ---------- */

.hero-hud {
  position: relative;
  z-index: 3;
  width: 100%;
  background: linear-gradient(180deg, rgba(10, 10, 14, 0.72) 0%, rgba(8, 8, 10, 0.94) 100%);
  backdrop-filter: blur(24px) saturate(1.25);
  -webkit-backdrop-filter: blur(24px) saturate(1.25);
  border-top: 1px solid rgba(212, 180, 120, 0.2);
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.4);
}

.hero-hud-inner {
  max-width: var(--maxw);
  margin-inline: auto;
  padding-inline: var(--pad);
  padding-block: clamp(1.1rem, 2vh, 1.55rem);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(4, auto);
  gap: clamp(1.5rem, 3.8vw, 3.6rem);
  align-items: center;
}

.hero-stat-card {
  position: relative;
  display: flex;
  flex-direction: column;
}

.hero-stat-card + .hero-stat-card::before {
  content: "";
  position: absolute;
  inset-inline-start: clamp(-0.75rem, -1.9vw, -1.8rem);
  top: 15%;
  bottom: 15%;
  width: 1px;
  background: rgba(212, 180, 120, 0.22);
}

.hero-stat-value {
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 2.4vw, 2.3rem);
  font-weight: 300;
  line-height: 1;
  letter-spacing: -0.015em;
  color: #fff;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
}

html[lang="ar"] .hero-stat-value {
  font-family: var(--font-arabic);
  font-weight: 600;
  font-size: clamp(1.3rem, 2vw, 1.85rem);
}

.hero-stat-label {
  margin-top: 0.4rem;
  font-size: 0.58rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(244, 240, 233, 0.6);
  line-height: 1.35;
  white-space: nowrap;
}

html[lang="ar"] .hero-stat-label {
  letter-spacing: 0.02em;
  font-size: 0.72rem;
  text-transform: none;
}

/* scroll to explore cue */
.hero-scroll-cue {
  display: inline-flex;
  align-items: center;
  gap: 0.9rem;
  padding: 0.5rem 0.8rem;
  color: rgba(244, 240, 233, 0.65);
  transition: color 0.3s;
}

.hero-scroll-cue:hover {
  color: var(--sand);
}

.hero-scroll-text {
  font-size: 0.6rem;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  white-space: nowrap;
}

html[lang="ar"] .hero-scroll-text {
  letter-spacing: 0.04em;
  text-transform: none;
  font-size: 0.72rem;
}

.hero-scroll-indicator {
  width: 16px;
  height: 26px;
  border: 1px solid rgba(212, 180, 120, 0.4);
  border-radius: 999px;
  display: flex;
  justify-content: center;
  padding-top: 4px;
  position: relative;
}

.hero-scroll-dot {
  width: 3px;
  height: 5px;
  background: var(--gold);
  border-radius: 999px;
  animation: scroll-bob 2s ease-in-out infinite;
}

@keyframes scroll-bob {
  0% { transform: translateY(0); opacity: 0; }
  30% { opacity: 1; }
  80% { transform: translateY(8px); opacity: 0; }
  100% { transform: translateY(0); opacity: 0; }
}
"""

# Replace old hero block
pattern = re.compile(r'/\* ---------- hero \(cinema frame\) ---------- \*/.*?(?=/\* ---------- reveal ---------- \*/)', re.DOTALL)
if pattern.search(content):
    content = pattern.sub(new_hero_css + "\n", content)
    print("Replaced hero block")
else:
    print("Could not match hero block!")

# Update responsive block
old_media = """@media (max-width: 900px) {
  .hero-frame { width: 100%; aspect-ratio: 16 / 9; }
  .hero-foot { align-items: flex-start; }
  .hero-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem 1.6rem; }
  .footer-cta { grid-template-columns: 1fr; }
  .footer-grid { grid-template-columns: 1fr; gap: 1.8rem; }
  .header-nav { display: none; }
}

@media (max-width: 560px) {
  .brand-name { font-size: 0.78rem; }
  .brand-sub { font-size: 0.42rem; }
  .hero-frame { aspect-ratio: 4 / 3; }
  .hero-title-line { font-size: clamp(1.8rem, 8.4vw, 2.6rem); }
  .hero-title-line--italic { margin-inline-start: 0.9rem; }
  .hero-actions { width: 100%; }
  .hero-actions .btn { flex: 1 1 auto; }
  .hero-frame-ref { display: none; }
  .btn { padding: 0.85rem 1.15rem; }
}"""

new_media = """@media (max-width: 900px) {
  .hero-container {
    padding-top: calc(var(--header-h) + 2rem);
    padding-bottom: 2rem;
  }
  .hero-hud-inner {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.2rem;
  }
  .hero-stats {
    width: 100%;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.2rem 1.8rem;
  }
  .hero-stat-card + .hero-stat-card::before {
    display: none;
  }
  .hero-scroll-cue {
    display: none;
  }
  .footer-cta { grid-template-columns: 1fr; }
  .footer-grid { grid-template-columns: 1fr; gap: 1.8rem; }
  .header-nav { display: none; }
}

@media (max-width: 560px) {
  .brand-name { font-size: 0.78rem; }
  .brand-sub { font-size: 0.42rem; }
  .hero-title-line { font-size: clamp(2rem, 9.5vw, 3rem); }
  .hero-title-line--italic { margin-inline-start: 0.8rem; }
  .hero-actions { width: 100%; }
  .hero-actions .btn { flex: 1 1 auto; }
  .btn { padding: 0.85rem 1.15rem; }
}"""

if old_media in content:
    content = content.replace(old_media, new_media)
    print("Replaced responsive media queries")
else:
    print("Could not find old media queries!")

with open("app/globals.css", "w", encoding="utf-8") as f:
    f.write(content)

print("Saved app/globals.css")
