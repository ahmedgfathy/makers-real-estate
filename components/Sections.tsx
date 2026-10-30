import type { Content, Lang, Section } from "@/data/content";
import { formatEGP } from "@/data/content";
import { ui } from "@/lib/labels";

// Arabic values carry LRI/PDI isolates around digits, so strip them before testing.
const isNumeric = (v?: string) =>
  !!v && /^[\d,]+$/.test(v.replace(/[\u2066-\u2069]/g, ""));

function SecHead({ title }: { title?: string }) {
  if (!title) return null;
  return (
    <div className="sec-head">
      <span className="sec-title">{title}</span>
      <span className="sec-rule" />
    </div>
  );
}

export default function SectionBlock({
  section,
  lang,
  c,
}: {
  section: Section;
  lang: Lang;
  c: Content;
}) {
  const t = ui[lang];

  if (section.kind === "stats") {
    return (
      <div className="sec">
        <div className="stats">
          {section.items.map((s) => (
            <div className="stat" key={s.label}>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (section.kind === "list") {
    return (
      <div className="sec">
        <SecHead title={section.title} />
        <ul className={`list-grid cols-${section.columns ?? 2}`}>
          {section.items.map((item) => (
            <li className="li" key={item}>
              {item}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (section.kind === "table") {
    return (
      <div className="sec">
        <SecHead title={section.title} />
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                {section.columns.map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci} className={/^[\d٠-٩]/.test(cell) ? "num" : undefined}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {section.footnote ? <p className="tbl-note">{section.footnote}</p> : null}
      </div>
    );
  }

  if (section.kind === "units") {
    return (
      <div className="sec">
        <SecHead title={section.title} />
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>{c.panel.unit}</th>
                <th>{c.panel.floor}</th>
                <th className="num">
                  {c.panel.area} {t.m2}
                </th>
                {section.gardenColumn ? (
                  <th className="num">
                    {c.panel.garden} {t.m2}
                  </th>
                ) : null}
                {section.roofColumn ? (
                  <th className="num">
                    {c.panel.roof} {t.m2}
                  </th>
                ) : null}
                <th className="num">
                  {c.panel.price} {t.egp}
                </th>
                <th className="num">{c.panel.monthly}</th>
              </tr>
            </thead>
            <tbody>
              {section.rows.map((u) => {
                const floorLabel =
                  u.garden != null ? t.groundGarden : u.floor == null ? t.ground : c.panel.floors[String(u.floor)];
                return (
                  <tr key={u.code}>
                    <td className="c-code">{u.code}</td>
                    <td>{floorLabel}</td>
                    <td className="c-num num">{u.area}</td>
                    {section.gardenColumn ? <td className="c-num num">{u.garden ?? "—"}</td> : null}
                    {section.roofColumn ? <td className="c-num num">{u.roof ?? "—"}</td> : null}
                    <td className="c-price num">{formatEGP(u.price)}</td>
                    <td className="c-month num">{formatEGP(Math.round(u.price / 120))}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (section.kind === "prices") {
    return (
      <div className="sec">
        <SecHead title={section.title} />
        <div className="prices">
          {section.rows.map((r) => (
            <div className="price-row" key={r.label}>
              <span className="price-label">{r.label}</span>
              <span className="price-area">{r.area ?? ""}</span>
              <span className="price-value">
                {r.price} {t.egp}
              </span>
              <span className="price-month">
                {t.approx} {r.monthly}
                {isNumeric(r.monthly) ? ` ${t.egp} ${t.perMonth}` : ""}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (section.kind === "gallery") {
    return (
      <div className="sec">
        <div className="gallery">
          {section.items.map((g) => (
            <figure key={g.src}>
              <img src={g.src} alt={g.caption} loading="lazy" decoding="async" />
              <figcaption>{g.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="sec">
      <p className="note">{section.text}</p>
    </div>
  );
}