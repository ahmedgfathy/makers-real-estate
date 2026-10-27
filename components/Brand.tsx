export default function Brand({ name, tagline }: { name: string; tagline: string }) {
  return (
    <span className="brand" aria-hidden="false">
      <img
        className="brand-mark"
        src="/img/makers-mark.png"
        alt=""
        width={220}
        height={209}
      />
      <span className="brand-inner">
        <span className="brand-name">{name}</span>
        <span className="brand-rule" />
        <span className="brand-sub">{tagline}</span>
      </span>
    </span>
  );
}
