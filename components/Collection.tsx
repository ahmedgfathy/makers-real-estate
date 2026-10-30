"use client";

import type { Content, Lang, TileId } from "@/data/content";
import { ui } from "@/lib/labels";
import Reveal from "./Reveal";

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3.5 10.5 10.5 3.5M10.5 3.5H5M10.5 3.5V9" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

export default function Collection({
  c,
  lang,
  onOpen,
}: {
  c: Content;
  lang: Lang;
  onOpen: (id: TileId, el: HTMLButtonElement) => void;
}) {
  const t = ui[lang];

  return (
    <section className="collection" id="collection">
      <div className="collection-inner">
        <div className="collection-head">
          <Reveal>
            <h2 className="collection-lede">{c.hero.lede}</h2>
          </Reveal>
          <Reveal delay={100} className="collection-meta">
            <span className="eyebrow">{c.grid.label}</span>
            <span className="collection-count">
              {c.tiles.length} {t.collections} — SODIC East
            </span>
          </Reveal>
        </div>

        <div className="tiles">
          {c.tiles.map((tile, i) => (
            <Reveal key={tile.id} delay={i * 70}>
              <button
                type="button"
                className="tile"
                onClick={(e) => onOpen(tile.id, e.currentTarget)}
                aria-label={`${t.openTile} — ${tile.title}`}
              >
                <span className="tile-media">
                  <img
                    src={tile.image}
                    alt={tile.title}
                    loading={i < 3 ? "eager" : "lazy"}
                    decoding="async"
                  />
                </span>
                <span className="tile-veil" />
                <span className="tile-top">
                  <span className="tile-index">{tile.index}</span>
                  <span className="tile-arrow">
                    <Arrow />
                  </span>
                </span>
                <span className="tile-body">
                  <span className="tile-kicker">{tile.kicker}</span>
                  <span className="tile-title">{tile.title}</span>
                  <span className="tile-meta">{tile.meta}</span>
                </span>
                <span className="tile-line" />
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}