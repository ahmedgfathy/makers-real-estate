"use client";

import { useEffect, useState } from "react";
import type { Content, Lang } from "@/data/content";

export default function Hero({
  c,
  lang,
  whatsapp,
  phoneHref,
}: {
  c: Content;
  lang: Lang;
  whatsapp: string;
  phoneHref: string;
}) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <section className="hero" id="top">
      {/* Edge-to-edge widescreen background video layer */}
      <div className="hero-media-wrap" aria-hidden="true">
        <div className="hero-media">
          {reduced ? (
            <img src="/img/hero-poster.jpg" alt="" aria-hidden="true" />
          ) : (
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/img/hero-poster.jpg"
              aria-hidden="true"
              tabIndex={-1}
            >
              <source src="/video/hero.mp4" type="video/mp4" />
            </video>
          )}
        </div>
        <div className="hero-scrim" />
        <div className="hero-vignette" />
      </div>

      {/* Main hero typography & interactive actions */}
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            <span className="eyebrow">{c.hero.eyebrow}</span>
          </div>

          <h1 className="hero-title">
            <span className="hero-title-line">{c.hero.titleLine1}</span>
            <span className="hero-title-line hero-title-line--italic">{c.hero.titleLine2}</span>
          </h1>

          <div className="hero-location">
            <span className="hero-place">{c.hero.place}</span>
          </div>

          {c.hero.lede && (
            <p className="hero-lede">{c.hero.lede}</p>
          )}

          <div className="hero-actions">
            <a className="btn btn--solid hero-btn-primary" href="#collection">
              <span>{c.hero.primary}</span>
              <svg className="hero-btn-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <a className="btn btn--glass" href={whatsapp} target="_blank" rel="noopener noreferrer">
              <span>{c.hero.secondary}</span>
            </a>
            <a className="btn btn--ghost hero-phone phone" href={phoneHref} aria-label={c.footer.call}>
              <span>{c.footer.call}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Full-width docked frosted HUD stats bar */}
      <div className="hero-hud">
        <div className="hero-hud-inner">
          <div className="hero-stats">
            {c.hero.stats.map((s) => (
              <div key={s.label} className="hero-stat-card">
                <div className="hero-stat-value">{s.value}</div>
                <div className="hero-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          <a href="#collection" className="hero-scroll-cue" aria-label={c.hero.scroll}>
            <span className="hero-scroll-text">{c.hero.scroll}</span>
            <span className="hero-scroll-indicator">
              <span className="hero-scroll-dot" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
