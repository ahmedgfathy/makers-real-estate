"use client";

import { useRef } from "react";
import type { Contact, Content, Lang } from "@/data/content";
import { ui } from "@/lib/labels";

const START_AT = 1.2;

export default function Hero({
  c,
  lang,
  contact,
  whatsapp,
  phoneHref,
}: {
  c: Content;
  lang: Lang;
  contact: Contact;
  whatsapp: string;
  phoneHref: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const seekPastBlackFrame = () => {
    const video = videoRef.current;
    if (video && video.currentTime < START_AT) video.currentTime = START_AT;
  };

  return (
    <section className="hero" id="top">
      <div className="hero-media-wrap" aria-hidden="true">
        <div className="hero-media">
          <video
            ref={videoRef}
            src="/video/hero.mp4#t=1.2"
            poster="/img/lakes-sunset.jpg"
            autoPlay
            muted
            playsInline
            preload="auto"
            tabIndex={-1}
            disablePictureInPicture
            onLoadedMetadata={seekPastBlackFrame}
            onEnded={(event) => {
              event.currentTarget.currentTime = START_AT;
              void event.currentTarget.play();
            }}
          />
        </div>
        <div className="hero-scrim" />
      </div>

      <div className="hero-inner">
        <p className="hero-eyebrow">
          <span className="hero-eyebrow-dot" />
          {c.hero.eyebrow}
        </p>

        <h1 className="hero-title">
          <span>{c.hero.titleLine1}</span>
          {c.hero.titleLine2 ? <em>{c.hero.titleLine2}</em> : null}
        </h1>

        <p className="hero-place">{c.hero.place}</p>
        <p className="hero-lede">{c.hero.lede}</p>

        <div className="hero-actions">
          <a
            className="btn btn--gold hero-btn-primary"
            href="#projects"
            data-cta="explore"
            data-cta-surface="hero"
          >
            <span>{c.hero.primary}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a
            className="btn btn--outline hero-btn-wa"
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            data-cta="whatsapp"
            data-cta-surface="hero"
          >
            <span>{c.hero.secondary}</span>
            <small className="phone">{contact.whatsappLabel}</small>
          </a>
          <a
            className="hero-call"
            href={phoneHref}
            data-cta="phone"
            data-cta-surface="hero"
            aria-label={c.footer.call}
          >
            <small>{ui[lang].call}</small>
            <span className="phone" dir="ltr">{contact.phoneLabel}</span>
          </a>
        </div>
      </div>

      <div className="hero-bar">
        <div className="hero-stats">
          {c.hero.stats.map((s) => (
            <div key={s.label} className="hero-stat">
              <span className="hero-stat-value">{s.value}</span>
              <span className="hero-stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        <a href="#projects" className="hero-scroll" aria-label={c.hero.scroll}>
          <span>{c.hero.scroll}</span>
          <span className="hero-scroll-line" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
