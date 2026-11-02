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

/** Whole days between a `YYYY-MM-DD` date and today; positive means overdue. */
export function daysOverdue(value: string | null | undefined): number | null {
  if (!value) return null;
  const due = Date.parse(`${value}T00:00:00`);
  if (Number.isNaN(due)) return null;
  const today = new Date();
  const midnight = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const dueDay = new Date(due);
  const dueMidnight = Date.UTC(dueDay.getFullYear(), dueDay.getMonth(), dueDay.getDate());
  return Math.round((midnight - dueMidnight) / 86_400_000);
}

/** "Overdue by 3 days" / "Due today" / "In 4 days" for the follow-up queue. */
export function followUpLabel(value: string | null | undefined): string {
  const days = daysOverdue(value);
  if (days == null) return "Not scheduled";
  if (days > 0) return `Overdue by ${days} day${days === 1 ? "" : "s"}`;
  if (days === 0) return "Due today";
  const inDays = Math.abs(days);
  if (inDays === 1) return "Tomorrow";
  return `In ${inDays} days`;
}

/** Digits only — empty when the "phone" is really a WhatsApp / Telegram handle. */
export function phoneDigits(phone: string): string {
  return phone.replace(/\D/g, "");
}

/** "overdue" | "today" | "soon" — the tone a follow-up badge is rendered with. */
export function followUpTone(value: string | null | undefined): "overdue" | "today" | "soon" | "none" {
  const days = daysOverdue(value);
  if (days == null) return "none";
  if (days > 0) return "overdue";
  if (days === 0) return "today";
  return "soon";
}
