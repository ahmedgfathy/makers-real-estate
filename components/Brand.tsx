/**
 * Brand lockup — the supplied Makers logo, used as-is.
 *
 * The transparent PNG keeps the supplied mark and wordmark without a baked-in
 * background; the black edition sits on the site's light header, matching the
 * CRM. Sizing lives in `.brand` / `.brand-logo` (globals.css).
 */
export default function Brand({ name, tagline }: { name: string; tagline: string }) {
  return (
    <span className="brand">
      <img
        className="brand-logo"
        src="/img/makers-logo-black.png"
        alt={`${name} — ${tagline}`}
        width={1183}
        height={752}
        decoding="async"
      />
    </span>
  );
}
