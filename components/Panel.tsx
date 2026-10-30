"use client";

import { useEffect, useRef, useState } from "react";
import type { Contact, Content, Lang, TileId } from "@/data/content";
import SectionBlock from "./Sections";

export default function Panel({
  id,
  c,
  contact,
  lang,
  whatsapp,
  onClose,
}: {
  id: TileId;
  c: Content;
  contact: Contact;
  lang: Lang;
  whatsapp: string;
  onClose: () => void;
}) {
  const [closing, setClosing] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef(false);
  const panel = c.panels[id];

  const requestClose = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    setClosing(true);
    window.setTimeout(onClose, 240);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.classList.add("is-locked");
    sheetRef.current?.focus({ preventScroll: true });
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("is-locked");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasMonthly = panel.sections.some((s) => s.kind === "units" || s.kind === "prices");

  return (
    <div
      className={`panel-root${closing ? " is-closing" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="panel-title"
    >
      <div className="panel-backdrop" onClick={requestClose} aria-hidden="true" />

      <div className="panel-sheet" ref={sheetRef} tabIndex={-1}>
        <div className="panel-hero">
          <img src={panel.image} alt="" />
          <div className="panel-hero-text">
            <span className="panel-kicker">{panel.kicker}</span>
            <h2 className="panel-title" id="panel-title">
              {panel.title}
            </h2>
          </div>
          <button
            type="button"
            className="panel-close"
            onClick={requestClose}
            aria-label={c.panel.close}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>
        </div>

        <div className="panel-scroll">
          <p className="panel-lede">{panel.lede}</p>
          {panel.sections.map((section, i) => (
            <SectionBlock key={`${id}-${i}`} section={section} lang={lang} c={c} />
          ))}
          {hasMonthly ? <p className="tbl-note">{c.panel.monthlyNote}</p> : null}
        </div>

        <div className="panel-foot">
          <span className="panel-foot-meta">
            {contact.name[lang]} · <span className="phone">{contact.phoneLabel}</span>
          </span>
          <a
            className="btn btn--solid btn--sm"
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            data-cta="whatsapp"
            data-cta-surface={"panel-" + id}
          >
            <span>{panel.cta}</span>
          </a>
        </div>
      </div>
    </div>
  );
}