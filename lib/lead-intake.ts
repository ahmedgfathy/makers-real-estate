import { createLead, LEAD_SOURCES, type LeadSource, type NewLeadInput } from "./admin";

/**
 * Payload → lead normalisation, shared by POST /api/leads (website form,
 * Facebook lead ads posted directly) and the Meta leadgen webhook
 * (POST /api/webhooks/meta).
 */

export type FacebookField = { name?: string; values?: unknown[] };

export type LeadBody = Record<string, unknown> & {
  field_data?: FacebookField[];
  leadgen_id?: unknown;
  form_id?: unknown;
  form_name?: unknown;
  campaign_name?: unknown;
  ad_name?: unknown;
};

export function first(...values: unknown[]): string | null {
  for (const value of values) {
    if (value == null) continue;
    if (Array.isArray(value)) {
      const nested = first(...value);
      if (nested) return nested;
      continue;
    }
    const text = String(value).trim();
    if (text) return text;
  }
  return null;
}

export function toNumber(value: unknown): number | null {
  const text = first(value);
  if (!text) return null;
  const parsed = Number(text.replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export function toBool(value: unknown): boolean {
  const text = first(value)?.toLowerCase();
  return text === "true" || text === "1" || text === "yes" || text === "on";
}

export function toLeadSource(value: unknown): LeadSource {
  const text = first(value)?.toLowerCase() as LeadSource | null;
  return text && (LEAD_SOURCES as readonly string[]).includes(text) ? text : "website";
}

/** Build a NewLeadInput from a plain or Facebook-shaped payload. */
export function normalizeLead(body: LeadBody): NewLeadInput | { error: string } {
  const fields = new Map<string, string>();
  if (Array.isArray(body.field_data)) {
    for (const field of body.field_data) {
      if (!field?.name) continue;
      const value = first(field.values);
      if (value) fields.set(field.name.toLowerCase(), value);
    }
  }
  const field = (...names: string[]) => first(...names.map((name) => fields.get(name)));

  const fullName = first(
    field("full_name", "full name", "name"),
    [field("first_name", "first name"), field("last_name", "last name")].filter(Boolean).join(" "),
    body.full_name,
    body.name
  );

  const phone = first(
    field("phone_number", "phone", "phone number", "mobile"),
    body.phone,
    body.phone_number
  );

  if (!fullName || !phone) {
    return { error: "full_name and phone are required" };
  }

  const isFacebook = Boolean(body.leadgen_id || body.field_data);
  const externalId = first(field("leadgen_id"), body.leadgen_id, body.external_id);

  return {
    full_name: fullName,
    phone,
    email: first(field("email"), body.email),
    source: isFacebook ? "facebook" : toLeadSource(body.source),
    form_name: first(field("form_name"), body.form_name, body.form_id),
    campaign: first(field("campaign_name"), body.campaign_name, body.campaign),
    external_id: externalId,
    project: first(field("project", "project_interest", "which_project"), body.project),
    property_type: first(field("property_type", "unit_type"), body.property_type),
    bedrooms: toNumber(first(field("bedrooms", "bedrooms_count"), body.bedrooms)),
    preferred_area: first(
      field("preferred_area", "area", "location", "preferred_location"),
      body.preferred_area
    ),
    budget_min: toNumber(first(field("budget_min"), body.budget_min, body.budget)),
    budget_max: toNumber(first(field("budget_max"), body.budget_max)),
    payment_preference: first(
      field("payment_preference", "payment_plan", "financing"),
      body.payment_preference
    ),
    intent: first(field("intent", "buying_for", "purpose"), body.intent),
    temperature: first(field("temperature", "lead_quality", "quality"), body.temperature),
    message: first(field("message", "notes"), body.message, body.notes),
    status: "new",
    assigned_to: first(field("consultant", "assigned_to", "sales"), body.assigned_to),
    consent: isFacebook ? true : toBool(body.consent),
    next_follow_up_on: first(body.next_follow_up_on, body.follow_up_on),
  };
}

/** Convenience: normalise and insert, returning the (possibly existing) id. */
export async function intakeLead(body: LeadBody): Promise<number | { error: string }> {
  const input = normalizeLead(body);
  if ("error" in input) return input;
  return createLead(input);
}
