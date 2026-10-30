"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { publishProjectAction, publishPropertyAction } from "@/app/dashboard/actions";

/**
 * The public website switch shown on projects and inventory units.
 *
 * Optimistic: flips immediately, then rolls back if the server action fails
 * (for example when a non-admin tries to publish).
 */
export default function PublishToggle({
  kind,
  id,
  published,
  canPublish,
  label = "Publish to website",
  compact = false,
}: {
  kind: "project" | "property";
  id: string | number;
  published: boolean;
  canPublish: boolean;
  label?: string;
  compact?: boolean;
}) {
  const [on, setOn] = useState(published);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function change(next: boolean) {
    if (!canPublish || pending) return;
    setOn(next);
    setError(null);

    startTransition(async () => {
      const result =
        kind === "project"
          ? await publishProjectAction(String(id), next)
          : await publishPropertyAction(Number(id), next);

      if (!result.ok) {
        setOn(!next);
        setError(result.error ?? "Could not update the website.");
        return;
      }
      router.refresh();
    });
  }

  return (
    <span
      className={`publish-switch${compact ? " publish-switch--compact" : ""}`}
      data-on={on}
      data-pending={pending}
      data-locked={!canPublish}
      title={
        canPublish
          ? on
            ? "Live on the public website — untick to hide"
            : "Tick to publish on the public website"
          : "Only an admin can publish to the website"
      }
    >
      <label className="publish-switch-control">
        <input
          type="checkbox"
          checked={on}
          disabled={!canPublish || pending}
          onChange={(event) => change(event.target.checked)}
        />
        <span className="publish-switch-track" aria-hidden="true">
          <span className="publish-switch-thumb" />
        </span>
        <span className="publish-switch-label">
          {compact ? (on ? "Live" : "Publish") : on ? "Live on website" : label}
        </span>
      </label>
      {error ? (
        <span className="publish-switch-error" role="status">
          {error}
        </span>
      ) : null}
    </span>
  );
}
