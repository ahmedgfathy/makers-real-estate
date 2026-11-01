import { query } from "./db";

/**
 * Append-only audit trail (audit_log table).
 *
 * Records who did what in the dashboard: publish switches, lead intake and
 * status changes, account management. Reads are rendered on /dashboard/audit;
 * writes are best-effort — a failed audit write is logged but never breaks the
 * operation it describes.
 */

export type AuditEntry = {
  id: number;
  at: Date;
  actor: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  detail: Record<string, unknown>;
};

export type AuditInput = {
  actor: string;
  action: string;
  entityType: string;
  entityId?: string | number | null;
  detail?: Record<string, unknown>;
};

export async function recordAudit(entry: AuditInput): Promise<void> {
  try {
    await query(
      `INSERT INTO audit_log (actor, action, entity_type, entity_id, detail)
       VALUES ($1, $2, $3, $4, $5::jsonb)`,
      [
        entry.actor,
        entry.action,
        entry.entityType,
        entry.entityId == null ? null : String(entry.entityId),
        JSON.stringify(entry.detail ?? {}),
      ]
    );
  } catch (err) {
    console.error(
      "[audit] failed to record",
      entry.action,
      err instanceof Error ? err.message : err
    );
  }
}

export type AuditFilters = {
  actor?: string;
  action?: string;
  entityType?: string;
  limit?: number;
};

export async function listAudit(filters: AuditFilters = {}): Promise<AuditEntry[]> {
  const where: string[] = [];
  const params: unknown[] = [];

  if (filters.actor?.trim()) {
    params.push(filters.actor.trim());
    where.push(`actor = $${params.length}`);
  }
  if (filters.action?.trim()) {
    params.push(filters.action.trim());
    where.push(`action = $${params.length}`);
  }
  if (filters.entityType?.trim()) {
    params.push(filters.entityType.trim());
    where.push(`entity_type = $${params.length}`);
  }

  params.push(Math.min(Math.max(filters.limit ?? 100, 1), 500));

  return query<AuditEntry>(
    `SELECT id::int AS id, at, actor, action, entity_type, entity_id, detail
       FROM audit_log
      ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
      ORDER BY at DESC
      LIMIT $${params.length}`,
    params
  );
}

/** Distinct action values seen so far, for the audit page filter. */
export async function listAuditActions(): Promise<string[]> {
  const rows = await query<{ action: string }>(
    "SELECT DISTINCT action FROM audit_log ORDER BY action"
  );
  return rows.map((r) => r.action);
}
