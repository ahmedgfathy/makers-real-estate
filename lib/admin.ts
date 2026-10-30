import { query } from "./db";

/* ------------------------------------------------------------------ */
/* Leads                                                               */
/* ------------------------------------------------------------------ */

export const LEAD_SOURCES = ["facebook", "instagram", "website", "whatsapp", "manual"] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];

export const LEAD_STATUSES = ["new", "contacted", "qualified", "viewing", "won", "lost"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

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
  budget_min: number | null;
  budget_max: number | null;
  message: string | null;
  status: LeadStatus;
  assigned_to: string | null;
  consent: boolean;
  created_at: Date;
  updated_at: Date;
};

export type LeadFilters = {
  q?: string;
  source?: string;
  status?: string;
  limit?: number;
};

export type NewLeadInput = {
  full_name: string;
  phone: string;
  email?: string | null;
  source?: string;
  form_name?: string | null;
  campaign?: string | null;
  external_id?: string | null;
  project?: string | null;
  property_type?: string | null;
  bedrooms?: number | null;
  budget_min?: number | null;
  budget_max?: number | null;
  message?: string | null;
  status?: string;
  assigned_to?: string | null;
  consent?: boolean;
};

const LEAD_SELECT = `
  id::int AS id,
  full_name, phone, email, source, form_name, campaign, external_id,
  project, property_type, bedrooms,
  budget_min::float8 AS budget_min,
  budget_max::float8 AS budget_max,
  message, status, assigned_to, consent, created_at, updated_at
`;

export async function listLeads(filters: LeadFilters = {}): Promise<Lead[]> {
  const where: string[] = [];
  const params: unknown[] = [];

  if (filters.q?.trim()) {
    params.push(`%${filters.q.trim()}%`);
    const p = `$${params.length}`;
    where.push(
      `(full_name ILIKE ${p} OR phone ILIKE ${p} OR COALESCE(email, '') ILIKE ${p} OR COALESCE(project, '') ILIKE ${p})`
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

  params.push(Math.min(Math.max(filters.limit ?? 100, 1), 500));

  return query<Lead>(
    `SELECT ${LEAD_SELECT}
       FROM leads
      ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
      ORDER BY created_at DESC
      LIMIT $${params.length}`,
    params
  );
}

export async function getLead(id: number): Promise<Lead | null> {
  const rows = await query<Lead>(`SELECT ${LEAD_SELECT} FROM leads WHERE id = $1`, [id]);
  return rows[0] ?? null;
}

export async function createLead(input: NewLeadInput): Promise<number> {
  const rows = await query<{ id: number }>(
    `INSERT INTO leads (
       full_name, phone, email, source, form_name, campaign, external_id,
       project, property_type, bedrooms, budget_min, budget_max, message,
       status, assigned_to, consent
     ) VALUES (
       $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
     )
     ON CONFLICT (external_id) WHERE external_id IS NOT NULL DO NOTHING
     RETURNING id::int AS id`,
    [
      input.full_name,
      input.phone,
      empty(input.email),
      input.source ?? "manual",
      empty(input.form_name),
      empty(input.campaign),
      empty(input.external_id),
      empty(input.project),
      empty(input.property_type),
      input.bedrooms ?? null,
      input.budget_min ?? null,
      input.budget_max ?? null,
      empty(input.message),
      input.status ?? "new",
      empty(input.assigned_to),
      input.consent ?? false,
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

export async function updateLeadStatus(id: number, status: string): Promise<void> {
  await query("UPDATE leads SET status = $2, updated_at = now() WHERE id = $1", [id, status]);
}

export type LeadStats = {
  total: number;
  new: number;
  facebook: number;
  qualified: number;
};

export async function getLeadStats(): Promise<LeadStats> {
  const rows = await query<LeadStats>(
    `SELECT count(*)::int AS total,
            count(*) FILTER (WHERE status = 'new')::int AS new,
            count(*) FILTER (WHERE source = 'facebook')::int AS facebook,
            count(*) FILTER (WHERE status IN ('qualified', 'viewing', 'won'))::int AS qualified
       FROM leads`
  );
  return rows[0] ?? { total: 0, new: 0, facebook: 0, qualified: 0 };
}

export async function getLeadSourceBreakdown(): Promise<{ source: string; count: number }[]> {
  return query<{ source: string; count: number }>(
    `SELECT source, count(*)::int AS count
       FROM leads
      GROUP BY source
      ORDER BY count DESC, source`
  );
}

/* ------------------------------------------------------------------ */
/* Property inventory                                                  */
/* ------------------------------------------------------------------ */

export const PROPERTY_TYPES = [
  "studio",
  "apartment",
  "duplex",
  "penthouse",
  "townhouse",
  "villa",
  "chalet",
] as const;

export const PROPERTY_STATUSES = ["available", "reserved", "sold", "off_plan"] as const;

export type Property = {
  id: number;
  code: string;
  title: string;
  project: string;
  phase: string | null;
  property_type: string;
  listing_type: string;
  status: string;
  bedrooms: number | null;
  bathrooms: number | null;
  built_up_area: number | null;
  garden_area: number | null;
  roof_area: number | null;
  floor: string | null;
  finishing: string | null;
  view: string | null;
  currency: string;
  price: number;
  down_payment: number;
  installment_years: number;
  monthly_installment: number | null;
  delivery: string | null;
  description: string | null;
  amenities: string[];
  images: string[];
  video: string | null;
  featured: boolean;
  published: boolean;
  created_at: Date;
  updated_at: Date;
};

export type PropertyFilters = {
  q?: string;
  status?: string;
  type?: string;
  limit?: number;
  /** Only units switched on for the public website. */
  publishedOnly?: boolean;
};

export type NewPropertyInput = {
  code: string;
  title: string;
  project?: string;
  phase?: string | null;
  property_type: string;
  listing_type?: string;
  status?: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  built_up_area?: number | null;
  garden_area?: number | null;
  roof_area?: number | null;
  floor?: string | null;
  finishing?: string | null;
  view?: string | null;
  price: number;
  down_payment?: number;
  installment_years?: number;
  monthly_installment?: number | null;
  delivery?: string | null;
  description?: string | null;
  amenities?: string[];
  images?: string[];
  video?: string | null;
  featured?: boolean;
  published?: boolean;
};

const PROPERTY_SELECT = `
  id::int AS id, code, title, project, phase, property_type, listing_type, status,
  bedrooms, bathrooms,
  built_up_area::float8 AS built_up_area,
  garden_area::float8 AS garden_area,
  roof_area::float8 AS roof_area,
  floor, finishing, view, currency,
  price::float8 AS price,
  down_payment::float8 AS down_payment,
  installment_years,
  monthly_installment::float8 AS monthly_installment,
  delivery, description, amenities, images, video, featured, published, created_at, updated_at
`;

export async function listProperties(filters: PropertyFilters = {}): Promise<Property[]> {
  const where: string[] = [];
  const params: unknown[] = [];

  if (filters.q?.trim()) {
    params.push(`%${filters.q.trim()}%`);
    const p = `$${params.length}`;
    where.push(
      `(code ILIKE ${p} OR title ILIKE ${p} OR project ILIKE ${p} OR COALESCE(phase, '') ILIKE ${p})`
    );
  }
  if (filters.status?.trim()) {
    params.push(filters.status.trim());
    where.push(`status = $${params.length}`);
  }
  if (filters.type?.trim()) {
    params.push(filters.type.trim());
    where.push(`property_type = $${params.length}`);
  }
  if (filters.publishedOnly) where.push("published");

  params.push(Math.min(Math.max(filters.limit ?? 200, 1), 500));

  return query<Property>(
    `SELECT ${PROPERTY_SELECT}
       FROM properties
      ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
      ORDER BY featured DESC, created_at DESC, code
      LIMIT $${params.length}`,
    params
  );
}

export async function getProperty(id: number): Promise<Property | null> {
  const rows = await query<Property>(
    `SELECT ${PROPERTY_SELECT} FROM properties WHERE id = $1`,
    [id]
  );
  return rows[0] ?? null;
}

export async function updatePropertyStatus(id: number, status: string): Promise<void> {
  await query("UPDATE properties SET status = $2, updated_at = now() WHERE id = $1", [id, status]);
}

/** Flips the public website switch. Only admin sessions may call this. */
export async function setPropertyPublished(id: number, published: boolean): Promise<void> {
  await query(
    `UPDATE properties
        SET published = $2,
            published_at = CASE WHEN $2 THEN COALESCE(published_at, now()) ELSE NULL END,
            updated_at = now()
      WHERE id = $1`,
    [id, published]
  );
}

export async function createProperty(input: NewPropertyInput): Promise<number | null> {
  const years = input.installment_years ?? 10;
  const monthly =
    input.monthly_installment ??
    (years > 0 ? Math.round(input.price / (years * 12)) : null);

  const rows = await query<{ id: number }>(
    `INSERT INTO properties (
       code, title, project, phase, property_type, listing_type, status,
       bedrooms, bathrooms, built_up_area, garden_area, roof_area, floor,
       finishing, view, price, down_payment, installment_years,
       monthly_installment, delivery, description, amenities, images, video,
       featured, published, published_at
     ) VALUES (
       $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
       $16, $17, $18, $19, $20, $21, $22, $23, $24, $25,
       CASE WHEN $26 THEN now() ELSE NULL END
     )
     ON CONFLICT (code) DO NOTHING
     RETURNING id::int AS id`,
    [
      input.code,
      input.title,
      input.project ?? "SODIC East",
      empty(input.phase),
      input.property_type,
      input.listing_type ?? "sale",
      input.status ?? "available",
      input.bedrooms ?? null,
      input.bathrooms ?? null,
      input.built_up_area ?? null,
      input.garden_area ?? null,
      input.roof_area ?? null,
      empty(input.floor),
      empty(input.finishing),
      empty(input.view),
      input.price,
      input.down_payment ?? 0,
      years,
      monthly,
      empty(input.delivery),
      empty(input.description),
      JSON.stringify(input.amenities ?? []),
      JSON.stringify(input.images ?? []),
      empty(input.video),
      input.featured ?? false,
      input.published ?? false,
    ]
  );

  return rows[0]?.id ?? null;
}

export type PropertyStats = {
  total: number;
  available: number;
  featured: number;
  published: number;
  value: number;
};

export async function getPropertyStats(): Promise<PropertyStats> {
  const rows = await query<PropertyStats>(
    `SELECT count(*)::int AS total,
            count(*) FILTER (WHERE status = 'available')::int AS available,
            count(*) FILTER (WHERE featured)::int AS featured,
            count(*) FILTER (WHERE published)::int AS published,
            COALESCE(sum(price), 0)::float8 AS value
       FROM properties`
  );
  return rows[0] ?? { total: 0, available: 0, featured: 0, published: 0, value: 0 };
}

function empty(value: string | null | undefined): string | null {
  if (value == null) return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}
