import { followUpLabel, followUpTone, titleCase } from "@/lib/format";

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

export function TemperatureBadge({ temperature }: { temperature: string | null }) {
  if (!temperature) return <span className="cell-sub">—</span>;
  return (
    <span className="dash-badge" data-temperature={temperature}>
      {titleCase(temperature)}
    </span>
  );
}

export function FollowUpBadge({ date }: { date: string | null }) {
  const tone = followUpTone(date);
  return (
    <span className="dash-badge dash-badge--follow" data-tone={tone}>
      {followUpLabel(date)}
    </span>
  );
}
