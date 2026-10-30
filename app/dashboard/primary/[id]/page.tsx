import { notFound } from "next/navigation";
import type { Lang, TileId } from "@/data/content";
import { getSite } from "@/lib/content-db";
import SectionBlock from "@/components/Sections";

export const dynamic = "force-dynamic";

const TILE_IDS: TileId[] = [
  "lakes",
  "phase08m",
  "sodic-east",
  "amenities",
  "collection",
  "payment",
];

export default async function PrimaryTilePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const lang: Lang = query.lang === "ar" ? "ar" : "en";

  if (!(TILE_IDS as string[]).includes(id)) notFound();
  const tileId = id as TileId;

  const { content } = await getSite();
  const c = content[lang];
  const panel = c.panels[tileId];
  const tile = c.tiles.find((item) => item.id === tileId);

  if (!panel || !tile) notFound();

  return (
    <div className="dash-page">
      <a className="dash-back" href={`/dashboard/primary?lang=${lang}`}>
        ← Back to primary data
      </a>

      <header className="dash-head">
        <div>
          <span className="dash-kicker">
            {tile.index} · {panel.kicker}
          </span>
          <h1>{panel.title}</h1>
          <p>{tile.meta}</p>
        </div>
        <div className="dash-actions">
          <a
            className={`dash-btn${lang === "en" ? " dash-btn--gold" : ""}`}
            href={`/dashboard/primary/${tileId}?lang=en`}
          >
            EN
          </a>
          <a
            className={`dash-btn${lang === "ar" ? " dash-btn--gold" : ""}`}
            href={`/dashboard/primary/${tileId}?lang=ar`}
          >
            ع
          </a>
          <a className="dash-btn" href={`/#tile-${tileId}`} target="_blank" rel="noopener noreferrer">
            View on site ↗
          </a>
        </div>
      </header>

      <section className="fact-hero" style={{ minHeight: "180px" }}>
        <img src={panel.image} alt="" />
        <div>
          <span className="dash-kicker">{tile.kicker}</span>
          <h2>{panel.title}</h2>
          <p>{panel.lede}</p>
        </div>
      </section>

      <section className="dash-card" style={{ marginTop: "0.9rem" }}>
        <div className="dash-card-head">
          <h2 className="dash-card-title">
            Panel sections · {panel.sections.length}
          </h2>
          <span className="dash-meta-row">{c.meta.title}</span>
        </div>
        <div className="dash-card-body">
          <div className="section-preview">
            {panel.sections.map((section, index) => (
              <SectionBlock key={`${tileId}-${index}`} section={section} lang={lang} c={c} />
            ))}
          </div>
        </div>
      </section>

      <p className="dash-note" style={{ marginTop: "0.9rem" }}>
        This is the live panel content served from PostgreSQL. The public site opens the same data
        at <code>/#tile-{tileId}</code>.
      </p>
    </div>
  );
}
