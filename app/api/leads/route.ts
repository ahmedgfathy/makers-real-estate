import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createLead, LEAD_SOURCES, type LeadSource, type NewLeadInput } from "@/lib/admin";

export const dynamic = "force-dynamic";

type FacebookField = { name?: string; values?: unknown[] };
type LeadBody = Record<string, unknown> & {
  field_data?: FacebookField[];
  leadgen_id?: unknown;
  form_id?: unknown;
  form_name?: unknown;
  campaign_name?: unknown;
  ad_name?: unknown;
};

function first(...values: unknown[]): string | null {
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

function number(value: unknown): number | null {
  const text = first(value);
  if (!text) return null;
  const parsed = Number(text.replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function bool(value: unknown): boolean {
  const text = first(value)?.toLowerCase();
  return text === "true" || text === "1" || text === "yes" || text === "on";
}

function source(value: unknown): LeadSource {
  const text = first(value)?.toLowerCase() as LeadSource | null;
  return text && (LEAD_SOURCES as readonly string[]).includes(text) ? text : "website";
}

/**
 * Public lead intake.
 *
 * Accepts either a plain JSON / website form payload or a Facebook Lead Ads
 * style payload (`field_data: [{ name, values }]`). If LEADS_API_KEY is set,
 * callers must send it as `x-api-key` (or `?key=`).
 */
export async function POST(req: Request) {
  const expectedKey = process.env.LEADS_API_KEY;
  if (expectedKey) {
    const url = new URL(req.url);
    const provided = req.headers.get("x-api-key") ?? url.searchParams.get("key");
    if (provided !== expectedKey) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
  }

  let body: LeadBody;
  try {
    body = (await req.json()) as LeadBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Expected a JSON body" }, { status: 400 });
  }

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
    return NextResponse.json(
      { ok: false, error: "full_name and phone are required" },
      { status: 400 }
    );
  }

  const isFacebook = Boolean(body.leadgen_id || body.field_data);
  const externalId = first(field("leadgen_id"), body.leadgen_id, body.external_id);

  const input: NewLeadInput = {
    full_name: fullName,
    phone,
    email: first(field("email"), body.email),
    source: isFacebook ? "facebook" : source(body.source),
    form_name: first(field("form_name"), body.form_name, body.form_id),
    campaign: first(field("campaign_name"), body.campaign_name, body.campaign),
    external_id: externalId,
    project: first(field("project", "project_interest", "which_project"), body.project),
    property_type: first(field("property_type", "unit_type"), body.property_type),
    bedrooms: number(first(field("bedrooms", "bedrooms_count"), body.bedrooms)),
    budget_min: number(first(field("budget_min"), body.budget_min, body.budget)),
    budget_max: number(first(field("budget_max"), body.budget_max)),
    message: first(field("message", "notes"), body.message, body.notes),
    status: "new",
    assigned_to: null,
    consent: isFacebook ? true : bool(body.consent),
  };

  try {
    const id = await createLead(input);
    revalidatePath("/dashboard", "layout");
    return NextResponse.json({ ok: true, id, source: input.source }, { status: 201 });
  } catch (err) {
    console.error("[leads] intake failed:", err);
    return NextResponse.json({ ok: false, error: "Could not save lead" }, { status: 500 });
  }
}
