import { titleCase } from "@/lib/format";

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className="dash-badge" data-tone={status}>
      {titleCase(status)}
    </span>
  );
}

export function SourceBadge({ source }: { source: string }) {
  return (
    <span className="dash-badge" data-source={source}>
      {titleCase(source)}
    </span>
  );
}
