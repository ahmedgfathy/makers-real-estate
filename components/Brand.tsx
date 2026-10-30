/**
 * Brand lockup — the supplied Makers logo, used as-is.
 *
 * `public/img/makers-logo.jpg` is a byte-for-byte copy of the delivered logo
 * file (mark + wordmark + "real estate" line on black). The screen blend mode
 * dissolves its flat black background over the dark chrome, so no recolour or
 * crop of the artwork is needed. Sizing lives in `.brand` / `.brand-logo`
 * (globals.css).
 */
export default function Brand({ name, tagline }: { name: string; tagline: string }) {
  return (
    <span className="brand">
      <img
        className="brand-logo"
        src="/img/makers-logo.jpg"
        alt={`${name} — ${tagline}`}
        width={1536}
        height={1024}
        decoding="async"
      />
    </span>
  );
}
