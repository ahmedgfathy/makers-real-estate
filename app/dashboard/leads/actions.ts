"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import {
  addFollowUp,
  createLead,
  FOLLOW_UP_CHANNELS,
  FOLLOW_UP_OUTCOMES,
  LEAD_SOURCES,
  LEAD_STATUSES,
  setFollowUpDate,
  updateLeadStatus,
} from "@/lib/admin";
import { importLeadsFromCsv } from "@/lib/lead-import";

/** Uploaded spreadsheets are parsed in-request; keep the payload bounded. */
const MAX_UPLOAD_BYTES = 2 * 1024 * 1024;

/** `/dashboard/leads?notice=…` — the page renders this as a banner. */
function importNotice(notice: string, tone: "ok" | "bad" = "bad"): never {
  redirect(
    `/dashboard/leads?notice=${encodeURIComponent(notice)}&tone=${tone}`
  );
}

/**
 * Bulk-import a legacy lead spreadsheet from the dashboard.
 *
 * Runs the same rules as `npm run db:import-leads`: rows are classified from
 * their notes and matched on phone digits, so re-uploading a file updates
 * nothing that a consultant has already worked on.
 */
export async function importLeadsAction(formData: FormData) {
  const username = await actor();

  const file = formData.get("csv");
  if (!(file instanceof File) || file.size === 0) importNotice("Choose a .csv file first");
  if (file.size > MAX_UPLOAD_BYTES) {
    importNotice(`File is ${(file.size / 1024 / 1024).toFixed(1)} MB — the limit is 2 MB`);
  }
  if (!/\.csv$/i.test(file.name) && !/csv|text\/plain/.test(file.type)) {
    importNotice(`"${file.name}" does not look like a CSV`);
  }

  let result;
  try {
    result = await importLeadsFromCsv(await file.text());
  } catch (err) {
    importNotice(err instanceof Error ? err.message : "The import failed");
  }

  await recordAudit({
    actor: username,
    action: "lead.import",
    entityType: "lead",
    detail: {
      file: file.name,
      created: result.created,
      existing: result.existing,
      skipped: result.skipped,
      failed: result.errors.length,
      lead_ids: result.leadIds.slice(0, 1000),
    },
  });

  revalidatePath("/dashboard", "layout");
  revalidatePath("/dashboard/leads");
  revalidatePath("/dashboard/follow-ups");

  importNotice(
    `${result.created} leads imported, ${result.existing} already in the CRM` +
      (result.skipped ? `, ${result.skipped} empty rows skipped` : "") +
      (result.errors.length ? `, ${result.errors.length} rows failed` : ""),
    "ok"
  );
}

function text(form: FormData, key: string): string | null {
  const value = form.get(key);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

function integer(form: FormData, key: string): number | null {
  const value = text(form, key);
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function money(form: FormData, key: string): number | null {
  const value = text(form, key);
  if (!value) return null;
  const parsed = Number(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

/** `YYYY-MM-DD` or null — anything else is ignored rather than stored wrong. */
function isoDate(form: FormData, key: string): string | null {
  const value = text(form, key);
  return value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null;
}

function pick<T extends readonly string[]>(
  values: T,
  value: string | null,
  fallback: string | null
): string | null {
  return value && (values as readonly string[]).includes(value) ? value : fallback;
}

async function actor(): Promise<string> {
  const session = await requireAdmin("/dashboard/leads");
  return session.username;
}

export async function createLeadAction(formData: FormData) {
  await requireAdmin("/dashboard/leads/new");

  const fullName = text(formData, "full_name");
  const phone = text(formData, "phone");

  if (!fullName || !phone) {
    redirect("/dashboard/leads/new?error=Name%20and%20phone%20are%20required");
  }

  const id = await createLead({
    full_name: fullName,
    phone,
    email: text(formData, "email"),
    source: pick(LEAD_SOURCES, text(formData, "source"), "manual"),
    form_name: text(formData, "form_name"),
    campaign: text(formData, "campaign"),
    external_id: text(formData, "external_id"),
    project: text(formData, "project"),
    property_type: text(formData, "property_type"),
    bedrooms: integer(formData, "bedrooms"),
    preferred_area: text(formData, "preferred_area"),
    budget_min: money(formData, "budget_min"),
    budget_max: money(formData, "budget_max"),
    payment_preference: text(formData, "payment_preference"),
    intent: text(formData, "intent"),
    temperature: text(formData, "temperature"),
    message: text(formData, "message"),
    status: pick(LEAD_STATUSES, text(formData, "status"), "new"),
    assigned_to: text(formData, "assigned_to"),
    consent: formData.get("consent") === "on",
    next_follow_up_on: isoDate(formData, "next_follow_up_on"),
  });

  revalidatePath("/dashboard", "layout");
  redirect(`/dashboard/leads/${id}`);
}

export async function updateLeadStatusAction(formData: FormData) {
  const username = await actor();
  await requireAdmin("/dashboard/leads");

  const id = Number(formData.get("id"));
  const status = String(formData.get("status") ?? "");

  if (!Number.isInteger(id) || !(LEAD_STATUSES as readonly string[]).includes(status)) return;

  await updateLeadStatus(id, status);
  await recordAudit({
    actor: username,
    action: "lead.status",
    entityType: "lead",
    entityId: id,
    detail: { status },
  });
  revalidatePath("/dashboard/leads");
  revalidatePath(`/dashboard/leads/${id}`);
  revalidatePath("/dashboard/follow-ups");
}

/** Log a contact attempt; optionally move the pipeline status and set the next date. */
export async function addFollowUpAction(formData: FormData) {
  const username = await actor();

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  const note = text(formData, "note");
  const outcome = pick(FOLLOW_UP_OUTCOMES, text(formData, "outcome"), "other")!;
  const channel = pick(FOLLOW_UP_CHANNELS, text(formData, "channel"), "call")!;
  const followUpOn = isoDate(formData, "follow_up_on");

  await addFollowUp({
    lead_id: id,
    author: username,
    channel,
    outcome,
    note,
    follow_up_on: followUpOn,
  });

  const status = text(formData, "next_status");
  if (status && (LEAD_STATUSES as readonly string[]).includes(status)) {
    await updateLeadStatus(id, status);
  }

  await recordAudit({
    actor: username,
    action: "lead.follow_up",
    entityType: "lead",
    entityId: id,
    detail: { channel, outcome, next: followUpOn },
  });

  revalidatePath("/dashboard", "layout");
  revalidatePath("/dashboard/leads");
  revalidatePath("/dashboard/follow-ups");
  revalidatePath(`/dashboard/leads/${id}`);
}

/** Schedule or clear the next follow-up without logging a contact attempt. */
export async function setFollowUpDateAction(formData: FormData) {
  await actor();

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  await setFollowUpDate(id, isoDate(formData, "next_follow_up_on"));

  revalidatePath("/dashboard", "layout");
  revalidatePath("/dashboard/leads");
  revalidatePath("/dashboard/follow-ups");
  revalidatePath(`/dashboard/leads/${id}`);
}
