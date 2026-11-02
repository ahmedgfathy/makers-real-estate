import { query } from "./db";

/* ------------------------------------------------------------------ */
/* Leads                                                               */
/* ------------------------------------------------------------------ */

export const LEAD_SOURCES = [
  "facebook",
  "instagram",
  "website",
  "whatsapp",
  "referral",
  "walk-in",
  "legacy",
  "manual",
] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];

export const LEAD_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "viewing",
  "nurture",
  "won",
  "lost",
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

/** Stages that no longer need a follow-up, so they leave the queue. */
export const CLOSED_STATUSES = ["won", "lost"] as const;

export const LEAD_TEMPERATURES = ["hot", "warm", "cold"] as const;
export type LeadTemperature = (typeof LEAD_TEMPERATURES)[number];

export const LEAD_INTENTS = ["buyer", "investor", "renter"] as const;
export type LeadIntent = (typeof LEAD_INTENTS)[number];

export const LEAD_PAYMENTS = ["cash", "installments", "mortgage", "undecided"] as const;
export type LeadPayment = (typeof LEAD_PAYMENTS)[number];

export const FOLLOW_UP_CHANNELS = [
  "call",
  "whatsapp",
  "email",
  "visit",
  "meeting",
  "other",
] as const;
export type FollowUpChannel = (typeof FOLLOW_UP_CHANNELS)[number];

export const FOLLOW_UP_OUTCOMES = [
  "reached",
  "no_answer",
  "callback_later",
  "wrong_number",
  "not_interested",
  "viewing_booked",
  "sent_brief",
  "other",
] as const;
export type FollowUpOutcome = (typeof FOLLOW_UP_OUTCOMES)[number];

export type Lead = {
  id: number;
  full_name: string;
  phone: string;
  email: string | null;
  source: LeadSource;
  form_name: string | null;
  campaign: string | null;
  external_id: string | null;
  project: string | null;
  property_type: string | null;
  bedrooms: number | null;
  preferred_area: string | null;
  budget_min: number | null;
  budget_max: number | null;
  payment_preference: LeadPayment | null;
  intent: LeadIntent | null;
  temperature: LeadTemperature | null;
  message: string | null;
  status: LeadStatus;
  assigned_to: string | null;
  consent: boolean;
  next_follow_up_on: string | null;
  last_follow_up_at: Date | null;
  follow_up_count: number;
  created_at: Date;
  updated_at: Date;
};

export type FollowUp = {
  id: number;
  lead_id: number;
  logged_at: Date;
  author: string;
  channel: FollowUpChannel;
  outcome: FollowUpOutcome;
  note: string | null;
  follow_up_on: string | null;
};

export type LeadFilters = {
  q?: string;
  source?: string;
  status?: string;
  temperature?: string;
  assignedTo?: string;
  /** "overdue" | "today" | "due" (today or earlier) | "none" (never scheduled) */
  followUp?: string;
  limit?: number;
  /** Only leads that are still in play (not won / lost). */
  open?: boolean;
  /** "received" (default) or "follow_up" — put the follow-up queue first. */
  order?: string;
};

export type NewLeadInput = {
  full_name: string;
  phone: string;
  email?: string | null;
  source?: string | null;
  form_name?: string | null;
  campaign?: string | null;
  external_id?: string | null;
  project?: string | null;
  property_type?: string | null;
  bedrooms?: number | null;
  preferred_area?: string | null;
  budget_min?: number | null;
  budget_max?: number | null;
  payment_preference?: string | null;
  intent?: string | null;
  temperature?: string | null;
  message?: string | null;
  status?: string | null;
  assigned_to?: string | null;
  consent?: boolean;
  next_follow_up_on?: string | null;
};

const LEAD_SELECT = `
  id::int AS id,
  full_name, phone, email, source, form_name, campaign, external_id,
  project, property_type, bedrooms, preferred_area,
  budget_min::float8 AS budget_min,
  budget_max::float8 AS budget_max,
  payment_preference, intent, temperature, message, status, assigned_to, consent,
  to_char(next_follow_up_on, 'YYYY-MM-DD') AS next_follow_up_on,
  last_follow_up_at, follow_up_count, created_at, updated_at
`;

const OPEN_LEADS = `status NOT IN ('won', 'lost')`;

function oneOf<T extends readonly string[]>(values: T, value: string | null | undefined, fallback: string | null): string | null {
  return value && (values as readonly string[]).includes(value) ? value : fallback;
}

export async function listLeads(filters: LeadFilters = {}): Promise<Lead[]> {
  const where: string[] = [];
  const params: unknown[] = [];

  if (filters.q?.trim()) {
    params.push(`%${filters.q.trim()}%`);
    const p = `$${params.length}`;
    where.push(
      `(full_name ILIKE ${p} OR phone ILIKE ${p} OR COALESCE(email, '') ILIKE ${p} OR COALESCE(project, '') ILIKE ${p} OR COALESCE(message, '') ILIKE ${p} OR COALESCE(assigned_to, '') ILIKE ${p})`
    );
  }
  if (filters.source?.trim()) {
    params.push(filters.source.trim());
    where.push(`source = $${params.length}`);
  }
  if (filters.status?.trim()) {
    params.push(filters.status.trim());
    where.push(`status = $${params.length}`);
  }
  const temperature = oneOf(LEAD_TEMPERATURES, filters.temperature, null);
  if (temperature) {
    params.push(temperature);
    where.push(`temperature = $${params.length}`);
  }
  if (filters.assignedTo?.trim()) {
    params.push(filters.assignedTo.trim());
    where.push(`assigned_to = $${params.length}`);
  }
  switch (filters.followUp) {
    case "overdue":
      where.push(`${OPEN_LEADS} AND next_follow_up_on < CURRENT_DATE`);
      break;
    case "today":
      where.push(`${OPEN_LEADS} AND next_follow_up_on = CURRENT_DATE`);
      break;
    case "due":
      where.push(`${OPEN_LEADS} AND next_follow_up_on <= CURRENT_DATE`);
      break;
    case "none":
      where.push(`${OPEN_LEADS} AND next_follow_up_on IS NULL`);
      break;
    default:
      break;
  }
  if (filters.open) where.push(OPEN_LEADS);

  params.push(Math.min(Math.max(filters.limit ?? 100, 1), 500));
  const limit = `$${params.length}`;

  const order =
    filters.order === "follow_up"
      ? "next_follow_up_on ASC NULLS LAST, created_at DESC"
      : "created_at DESC";

  return query<Lead>(
    `SELECT ${LEAD_SELECT}
       FROM leads
      ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
      ORDER BY ${order}
      LIMIT ${limit}`,
    params
  );
}

export async function getLead(id: number): Promise<Lead | null> {
  const rows = await query<Lead>(`SELECT ${LEAD_SELECT} FROM leads WHERE id = $1`, [id]);
  return rows[0] ?? null;
}

/**
 * Match a lead by its contact string: digits for a phone number, or the
 * lowercased `@handle` when the consultant only has a social contact.
 */
export async function findLeadByContact(key: string): Promise<Lead | null> {
  const rows = await query<Lead>(
    `SELECT ${LEAD_SELECT} FROM leads
      WHERE regexp_replace(phone, '\\D', '', 'g') = $1
           OR lower(replace(phone, ' ', '')) = $1
      ORDER BY id LIMIT 1`,
    [key]
  );
  return rows[0] ?? null;
}

export async function createLead(input: NewLeadInput): Promise<number> {
  const rows = await query<{ id: number }>(
    `INSERT INTO leads (
       full_name, phone, email, source, form_name, campaign, external_id,
       project, property_type, bedrooms, preferred_area, budget_min, budget_max,
       payment_preference, intent, temperature, message, status, assigned_to,
       consent, next_follow_up_on
     ) VALUES (
       $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21
     )
     ON CONFLICT (external_id) WHERE external_id IS NOT NULL DO NOTHING
     RETURNING id::int AS id`,
    [
      input.full_name,
      input.phone,
      empty(input.email),
      oneOf(LEAD_SOURCES, input.source, "manual"),
      empty(input.form_name),
      empty(input.campaign),
      empty(input.external_id),
      empty(input.project),
      empty(input.property_type),
      input.bedrooms ?? null,
      empty(input.preferred_area),
      input.budget_min ?? null,
      input.budget_max ?? null,
      oneOf(LEAD_PAYMENTS, input.payment_preference, null),
      oneOf(LEAD_INTENTS, input.intent, null),
      oneOf(LEAD_TEMPERATURES, input.temperature, null),
      empty(input.message),
      oneOf(LEAD_STATUSES, input.status, "new"),
      empty(input.assigned_to),
      input.consent ?? false,
      input.next_follow_up_on ?? null,
    ]
  );

  if (rows[0]) return rows[0].id;

  const existing = await query<{ id: number }>(
    "SELECT id::int AS id FROM leads WHERE external_id = $1",
    [input.external_id]
  );
  if (!existing[0]) throw new Error("Lead could not be created");
  return existing[0].id;
}

/** Pipeline status only — used by the quick action on the lead page. */
export async function updateLeadStatus(id: number, status: string): Promise<void> {
  const valid = oneOf(LEAD_STATUSES, status, null);
  if (!valid) return;
  await query("UPDATE leads SET status = $2, updated_at = now() WHERE id = $1", [id, valid]);
}

/** Schedule (or clear) the next follow-up date. */
export async function setFollowUpDate(id: number, date: string | null): Promise<void> {
  await query("UPDATE leads SET next_follow_up_on = $2, updated_at = now() WHERE id = $1", [
    id,
    date,
  ]);
}

export type FollowUpInput = {
  lead_id: number;
  author: string;
  channel?: string | null;
  outcome?: string | null;
  note?: string | null;
  follow_up_on?: string | null;
  logged_at?: Date;
};

/**
 * Records one contact attempt and moves the lead's follow-up counters:
 * the log is the source of truth, the lead row carries the queue state.
 */
export async function addFollowUp(input: FollowUpInput): Promise<number> {
  const rows = await query<{ id: number }>(
    `INSERT INTO lead_follow_ups (lead_id, logged_at, author, channel, outcome, note, follow_up_on)
     VALUES ($1, COALESCE($2, now()), $3, $4, $5, $6, $7)
     RETURNING id::int AS id`,
    [
      input.lead_id,
      input.logged_at ?? null,
      input.author,
      oneOf(FOLLOW_UP_CHANNELS, input.channel, "call"),
      oneOf(FOLLOW_UP_OUTCOMES, input.outcome, "reached"),
      empty(input.note),
      input.follow_up_on ?? null,
    ]
  );

  await query(
    `UPDATE leads
        SET follow_up_count = follow_up_count + 1,
            last_follow_up_at = COALESCE($2, now()),
            next_follow_up_on = COALESCE($3, next_follow_up_on),
            updated_at = now()
      WHERE id = $1`,
    [input.lead_id, input.logged_at ?? null, input.follow_up_on ?? null]
  );

  if (!rows[0]) throw new Error("Follow-up could not be recorded");
  return rows[0].id;
}

export async function listFollowUps(leadId: number): Promise<FollowUp[]> {
  return query<FollowUp>(
    `SELECT id::int AS id,
            lead_id::int AS lead_id,
            logged_at, author, channel, outcome, note,
            to_char(follow_up_on, 'YYYY-MM-DD') AS follow_up_on
       FROM lead_follow_ups
      WHERE lead_id = $1
      ORDER BY logged_at DESC, id DESC`,
    [leadId]
  );
}

/* ------------------------------------------------------------------ */
/* Dashboard aggregates                                                */
/* ------------------------------------------------------------------ */

export type LeadStats = {
  total: number;
  new: number;
  facebook: number;
  qualified: number;
  open: number;
  hot: number;
  unassigned: number;
};

export async function getLeadStats(): Promise<LeadStats> {
  const rows = await query<LeadStats>(
    `SELECT count(*)::int AS total,
            count(*) FILTER (WHERE status = 'new')::int AS new,
            count(*) FILTER (WHERE source = 'facebook')::int AS facebook,
            count(*) FILTER (WHERE status IN ('qualified', 'viewing', 'won'))::int AS qualified,
            count(*) FILTER (WHERE ${OPEN_LEADS})::int AS open,
            count(*) FILTER (WHERE temperature = 'hot' AND ${OPEN_LEADS})::int AS hot,
            count(*) FILTER (WHERE COALESCE(assigned_to, '') = '' AND ${OPEN_LEADS})::int AS unassigned
       FROM leads`
  );
  return rows[0] ?? { total: 0, new: 0, facebook: 0, qualified: 0, open: 0, hot: 0, unassigned: 0 };
}

export async function getLeadSourceBreakdown(): Promise<{ source: string; count: number }[]> {
  return query<{ source: string; count: number }>(
    `SELECT source, count(*)::int AS count
       FROM leads
      GROUP BY source
      ORDER BY count DESC, source`
  );
}

export async function getConsultantBreakdown(): Promise<{ consultant: string; count: number; due: number }[]> {
  return query<{ consultant: string; count: number; due: number }>(
    `SELECT COALESCE(NULLIF(assigned_to, ''), 'Unassigned') AS consultant,
            count(*)::int AS count,
            count(*) FILTER (WHERE ${OPEN_LEADS} AND next_follow_up_on <= CURRENT_DATE)::int AS due
       FROM leads
      GROUP BY 1
      ORDER BY count DESC, consultant`
  );
}

export type FollowUpAlerts = {
  overdue: number;
  dueToday: number;
  upcoming: number;
  unscheduled: number;
};

/** The bell on every dashboard page: how much of the queue is waiting. */
export async function getFollowUpAlerts(): Promise<FollowUpAlerts> {
  const rows = await query<{ overdue: number; due_today: number; upcoming: number; unscheduled: number }>(
    `SELECT count(*) FILTER (WHERE next_follow_up_on < CURRENT_DATE)::int AS overdue,
            count(*) FILTER (WHERE next_follow_up_on = CURRENT_DATE)::int AS due_today,
            count(*) FILTER (WHERE next_follow_up_on > CURRENT_DATE
                              AND next_follow_up_on <= CURRENT_DATE + 7)::int AS upcoming,
            count(*) FILTER (WHERE next_follow_up_on IS NULL)::int AS unscheduled
       FROM leads
      WHERE ${OPEN_LEADS}`
  );
  const row = rows[0] ?? { overdue: 0, due_today: 0, upcoming: 0, unscheduled: 0 };
  return {
    overdue: row.overdue,
    dueToday: row.due_today,
    upcoming: row.upcoming,
    unscheduled: row.unscheduled,
  };
}

/** Leads whose follow-up is due today or already overdue, oldest first. */
export async function getDueFollowUps(limit = 8): Promise<Lead[]> {
  return query<Lead>(
    `SELECT ${LEAD_SELECT}
       FROM leads
      WHERE ${OPEN_LEADS} AND next_follow_up_on <= CURRENT_DATE
      ORDER BY next_follow_up_on ASC
      LIMIT ${Math.min(Math.max(limit, 1), 200)}`
  );
}

/* ------------------------------------------------------------------ */
function empty(value: string | null | undefined): string | null {
  if (value == null) return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}
