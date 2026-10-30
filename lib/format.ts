const number = new Intl.NumberFormat("en-EG", { maximumFractionDigits: 0 });

export function egp(value: number | null | undefined, compact = false): string {
  if (value == null || Number.isNaN(value)) return "—";
  if (compact && Math.abs(value) >= 1_000_000) {
    const millions = value / 1_000_000;
    const digits = Math.abs(millions) >= 100 ? 0 : 1;
    return `EGP ${millions.toFixed(digits).replace(/\.0$/, "")}M`;
  }
  return `EGP ${number.format(value)}`;
}

export function area(value: number | null | undefined): string {
  return value == null ? "—" : `${number.format(value)} m²`;
}

export function formatDate(value: Date | string | null | undefined): string {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function timeAgo(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);
  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(date);
}

export function titleCase(value: string): string {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function budget(min: number | null, max: number | null): string {
  if (min == null && max == null) return "—";
  if (min != null && max != null) return `${egp(min, true)} – ${egp(max, true)}`;
  return egp(min ?? max, true);
}
