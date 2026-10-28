"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import {
  createLead,
  LEAD_SOURCES,
  LEAD_STATUSES,
  updateLeadStatus,
} from "@/lib/admin";

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

export async function createLeadAction(formData: FormData) {
  await requireAdmin("/dashboard/leads/new");

  const fullName = text(formData, "full_name");
  const phone = text(formData, "phone");

  if (!fullName || !phone) {
    redirect("/dashboard/leads/new?error=Name%20and%20phone%20are%20required");
  }

  const rawSource = text(formData, "source") ?? "manual";
  const rawStatus = text(formData, "status") ?? "new";
  const source = (LEAD_SOURCES as readonly string[]).includes(rawSource) ? rawSource : "manual";
  const status = (LEAD_STATUSES as readonly string[]).includes(rawStatus) ? rawStatus : "new";

  const id = await createLead({
    full_name: fullName,
    phone,
    email: text(formData, "email"),
    source,
    form_name: text(formData, "form_name"),
    campaign: text(formData, "campaign"),
    external_id: text(formData, "external_id"),
    project: text(formData, "project"),
    property_type: text(formData, "property_type"),
    bedrooms: integer(formData, "bedrooms"),
    budget_min: money(formData, "budget_min"),
    budget_max: money(formData, "budget_max"),
    message: text(formData, "message"),
    status,
    assigned_to: text(formData, "assigned_to"),
    consent: formData.get("consent") === "on",
  });

  revalidatePath("/dashboard", "layout");
  redirect(`/dashboard/leads/${id}`);
}

export async function updateLeadStatusAction(formData: FormData) {
  await requireAdmin("/dashboard/leads");

  const id = Number(formData.get("id"));
  const status = String(formData.get("status") ?? "");

  if (!Number.isInteger(id) || !(LEAD_STATUSES as readonly string[]).includes(status)) return;

  await updateLeadStatus(id, status);
  revalidatePath("/dashboard/leads");
  revalidatePath(`/dashboard/leads/${id}`);
}
