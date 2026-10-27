"use client";

import { useEffect, useState } from "react";
import type { Content, Lang } from "@/data/content";
import Reveal from "./Reveal";

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

      <div className="hero-inner">
        <Reveal delay={80}>
          <span className="eyebrow">{c.hero.eyebrow}</span>
        </Reveal>

        <h1 className="hero-title">
          <Reveal delay={160}>
            <span className="hero-title-line">{c.hero.titleLine1}</span>
          </Reveal>
          <Reveal delay={260}>
            <span className="hero-title-line hero-title-line--italic">{c.hero.titleLine2}</span>
          </Reveal>
          <Reveal delay={380}>
            <span className="hero-place">{c.hero.place}</span>
          </Reveal>
        </h1>

        <Reveal delay={460} className="hero-foot">
          <div>
            <p className="hero-lede">{c.hero.lede}</p>
            <div className="hero-actions">
              <a className="btn btn--solid" href="#collection">
                <span>{c.hero.primary}</span>
              </a>
              <a
                className="btn btn--ghost"
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{c.hero.secondary}</span>
              </a>
              <a className="btn btn--ghost hero-phone phone" href={phoneHref} aria-label={c.footer.call}>
                <span>{c.footer.call}</span>
              </a>
            </div>
          </div>

          <div className="hero-stats">
            {c.hero.stats.map((s) => (
              <div key={s.label}>
                <div className="hero-stat-value">{s.value}</div>
                <div className="hero-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

    </section>
  );
}