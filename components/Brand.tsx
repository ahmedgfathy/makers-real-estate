export default function Brand({ name, tagline }: { name: string; tagline: string }) {
  return (
    <span className="brand" aria-hidden="false">
      <span className="brand-name">{name}</span>
      <span className="brand-rule" />
      <span className="brand-sub">{tagline}</span>
    </span>
  );
}