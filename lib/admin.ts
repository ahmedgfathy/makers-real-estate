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
  governorate_id: string | null;
  city_id: string | null;
  area_id: string | null;
  location_id: string | null;
  project_id: string | null;
  property_category_id: string | null;
  unit_id: string | null;
  budget: number | null;
  requirements: Record<string, unknown>;
  locale: "en" | "ar" | null;
  source_path: string | null;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  meta_form_id: string | null;
  meta_ad_id: string | null;
  meta_adgroup_id: string | null;
  meta_page_id: string | null;
  meta_created_at: Date | null;
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
  locationId?: string;
  projectId?: string;
  categoryId?: string;
  unitId?: string;
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
  governorateId?: string | null;
  cityId?: string | null;
  areaId?: string | null;
  locationId?: string | null;
  projectId?: string | null;
  propertyCategoryId?: string | null;
  unitId?: string | null;
  budget?: number | null;
  requirements?: Record<string, unknown> | null;
  locale?: string | null;
  sourcePath?: string | null;
  referrer?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  metaFormId?: string | null;
  metaAdId?: string | null;
  metaAdgroupId?: string | null;
  metaPageId?: string | null;
  metaCreatedAt?: string | null;
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
  governorate_id, city_id, area_id, location_id, project_id,
  property_category_id, unit_id,
  budget::float8 AS budget, requirements,
  locale, source_path, referrer, utm_source, utm_medium, utm_campaign,
  meta_form_id, meta_ad_id, meta_adgroup_id, meta_page_id, meta_created_at,
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
  const contextFilters: [string | undefined, string][] = [
    [filters.locationId, "location_id"],
    [filters.projectId, "project_id"],
    [filters.categoryId, "property_category_id"],
    [filters.unitId, "unit_id"],
  ];
  for (const [value, column] of contextFilters) {
    if (!value?.trim()) continue;
    params.push(value.trim());
    where.push(`${column} = $${params.length}`);
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
  const columns = [
    "full_name", "phone", "email", "source", "form_name", "campaign", "external_id",
    "project", "property_type", "bedrooms", "preferred_area", "budget_min", "budget_max",
    "payment_preference", "intent", "temperature", "message", "status", "assigned_to",
    "consent", "next_follow_up_on",
  ];
  const values: unknown[] = [
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
  ];

  const context: [string, unknown][] = [
    ["governorate_id", empty(input.governorateId)],
    ["city_id", empty(input.cityId)],
    ["area_id", empty(input.areaId)],
    ["location_id", empty(input.locationId)],
    ["project_id", empty(input.projectId)],
    ["property_category_id", empty(input.propertyCategoryId)],
    ["unit_id", empty(input.unitId)],
    ["budget", input.budget ?? null],
    ["requirements", input.requirements ?? {}],
    ["locale", input.locale === "en" || input.locale === "ar" ? input.locale : null],
    ["source_path", empty(input.sourcePath)],
    ["referrer", empty(input.referrer)],
    ["utm_source", empty(input.utmSource)],
    ["utm_medium", empty(input.utmMedium)],
    ["utm_campaign", empty(input.utmCampaign)],
    ["meta_form_id", empty(input.metaFormId)],
    ["meta_ad_id", empty(input.metaAdId)],
    ["meta_adgroup_id", empty(input.metaAdgroupId)],
    ["meta_page_id", empty(input.metaPageId)],
    ["meta_created_at", input.metaCreatedAt || null],
  ];
  for (const [column, value] of context) {
    columns.push(column);
    values.push(value);
  }

  const placeholders = values.map((_, index) => `$${index + 1}`).join(", ");
  const rows = await query<{ id: number }>(
    `INSERT INTO leads (${columns.join(", ")})
     VALUES (${placeholders})
     ON CONFLICT (external_id) WHERE external_id IS NOT NULL DO NOTHING
     RETURNING id::int AS id`,
    values
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

export type LeadClassification = {
  location: string | null;
  project: string | null;
  category: string | null;
  unit: string | null;
  budget: number | null;
  locale: string | null;
  sourcePath: string | null;
};

/** Resolves the structured IDs stored on a lead back to catalogue names. */
export async function getLeadClassification(
  lead: Pick<Lead, "id" | "location_id" | "area_id" | "city_id" | "project_id" | "property_category_id" | "unit_id" | "budget" | "locale" | "source_path">
): Promise<LeadClassification> {
  const rows = await query<LeadClassification>(
    `SELECT
       COALESCE(area.name_en, loc.name_en, legacy.name_en) AS location,
       proj.name_en AS project,
       cat.name_en AS category,
       unit.title_en AS unit,
       le.budget::float8 AS budget,
       le.locale,
       le.source_path
     FROM leads le
     LEFT JOIN locations loc ON loc.id = le.location_id
     LEFT JOIN locations area ON area.id = le.area_id
     LEFT JOIN locations legacy ON legacy.id = le.city_id
     LEFT JOIN projects proj ON proj.id = le.project_id
     LEFT JOIN property_categories cat ON cat.id = le.property_category_id
     LEFT JOIN units unit ON unit.id = le.unit_id
     WHERE le.id = $1
     LIMIT 1`,
    [lead.id ?? null]
  );
  return rows[0] ?? {
    location: null,
    project: null,
    category: null,
    unit: null,
    budget: lead.budget,
    locale: lead.locale,
    sourcePath: lead.source_path,
  };
}

export type ClassificationRow = { id: string; name: string; count: number };

/** CRM report: where structured enquiries are concentrated. */
export async function getLeadClassificationReport(): Promise<{
  locations: ClassificationRow[];
  projects: ClassificationRow[];
  categories: ClassificationRow[];
  structured: number;
  total: number;
}> {
  const [locations, projects, categories, summary] = await Promise.all([
    query<ClassificationRow>(
      `SELECT l.id::text AS id, l.name_en AS name, count(*)::int AS count
         FROM leads le JOIN locations l ON l.id = COALESCE(le.area_id, le.location_id)
        GROUP BY l.id, l.name_en ORDER BY count DESC, l.name_en LIMIT 8`
    ),
    query<ClassificationRow>(
      `SELECT p.id::text AS id, p.name_en AS name, count(*)::int AS count
         FROM leads le JOIN projects p ON p.id = le.project_id
        GROUP BY p.id, p.name_en ORDER BY count DESC, p.name_en LIMIT 8`
    ),
    query<ClassificationRow>(
      `SELECT c.id::text AS id, c.name_en AS name, count(*)::int AS count
         FROM leads le JOIN property_categories c ON c.id = le.property_category_id
        GROUP BY c.id, c.name_en ORDER BY count DESC, c.name_en LIMIT 8`
    ),
    query<{ structured: number; total: number }>(
      `SELECT count(*) FILTER (WHERE location_id IS NOT NULL OR area_id IS NOT NULL
          OR project_id IS NOT NULL OR property_category_id IS NOT NULL OR unit_id IS NOT NULL)::int AS structured,
              count(*)::int AS total
         FROM leads`
    ),
  ]);
  return {
    locations,
    projects,
    categories,
    structured: summary[0]?.structured ?? 0,
    total: summary[0]?.total ?? 0,
  };
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
