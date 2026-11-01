"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import {
  createProperty,
  PROPERTY_STATUSES,
  PROPERTY_TYPES,
  updateProperty,
  updatePropertyStatus,
} from "@/lib/admin";
import { getProject } from "@/lib/projects";
import { recordAudit } from "@/lib/audit";

function text(form: FormData, key: string): string | null {
  const value = form.get(key);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

function number(form: FormData, key: string): number | null {
  const value = text(form, key);
  if (!value) return null;
  const parsed = Number(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function list(form: FormData, key: string): string[] {
  const value = text(form, key);
  if (!value) return [];
  return value
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function createPropertyAction(formData: FormData) {
  await requireAdmin("/dashboard/inventory/new");

  const code = text(formData, "code");
  const title = text(formData, "title");
  const price = number(formData, "price");
  const projectSlug = text(formData, "project_slug");
  const rawType = text(formData, "property_type") ?? "apartment";
  const rawStatus = text(formData, "status") ?? "available";

  if (!code || !title || price == null || !projectSlug) {
    redirect("/dashboard/inventory/new?error=Project%2C%20code%2C%20title%20and%20price%20are%20required");
  }
  const project = await getProject(projectSlug);
  if (!project) redirect("/dashboard/inventory/new?error=Choose%20a%20valid%20project");

  const propertyType = (PROPERTY_TYPES as readonly string[]).includes(rawType)
    ? rawType
    : "apartment";
  const status = (PROPERTY_STATUSES as readonly string[]).includes(rawStatus)
    ? rawStatus
    : "available";

  const id = await createProperty({
    code,
    title,
    project: project.name,
    project_slug: project.slug,
    phase: text(formData, "phase"),
    property_type: propertyType,
    listing_type: text(formData, "listing_type") ?? "sale",
    status,
    bedrooms: number(formData, "bedrooms"),
    bathrooms: number(formData, "bathrooms"),
    built_up_area: number(formData, "built_up_area"),
    garden_area: number(formData, "garden_area"),
    roof_area: number(formData, "roof_area"),
    floor: text(formData, "floor"),
    finishing: text(formData, "finishing"),
    view: text(formData, "view"),
    price,
    down_payment: number(formData, "down_payment") ?? 0,
    installment_years: number(formData, "installment_years") ?? 10,
    monthly_installment: number(formData, "monthly_installment"),
    delivery: text(formData, "delivery"),
    description: text(formData, "description"),
    amenities: list(formData, "amenities"),
    images: list(formData, "images"),
    video: text(formData, "video"),
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
  });

  revalidatePath("/dashboard", "layout");
  revalidatePath("/dashboard/primary");
  revalidatePath(`/dashboard/projects/${project.slug}`);

  if (id == null) {
    redirect("/dashboard/inventory/new?error=That%20unit%20code%20already%20exists");
  }

  redirect(`/dashboard/inventory/${id}`);
}

export async function updatePropertyAction(formData: FormData) {
  const id = number(formData, "id");
  const session = await requireAdmin(id == null ? "/dashboard/inventory" : `/dashboard/inventory/${id}`);
  const code = text(formData, "code");
  const title = text(formData, "title");
  const price = number(formData, "price");
  const projectSlug = text(formData, "project_slug");
  if (id == null || !Number.isInteger(id) || !code || !title || price == null || !projectSlug) {
    redirect("/dashboard/inventory?error=Project%2C%20code%2C%20title%20and%20price%20are%20required");
  }
  const project = await getProject(projectSlug);
  if (!project) redirect(`/dashboard/inventory/${id}/edit?error=Choose%20a%20valid%20project`);

  const rawType = text(formData, "property_type") ?? "apartment";
  const rawStatus = text(formData, "status") ?? "available";
  await updateProperty(id, {
    code,
    title,
    project: project.name,
    project_slug: project.slug,
    phase: text(formData, "phase"),
    property_type: (PROPERTY_TYPES as readonly string[]).includes(rawType) ? rawType : "apartment",
    listing_type: text(formData, "listing_type") ?? "sale",
    status: (PROPERTY_STATUSES as readonly string[]).includes(rawStatus) ? rawStatus : "available",
    bedrooms: number(formData, "bedrooms"),
    bathrooms: number(formData, "bathrooms"),
    built_up_area: number(formData, "built_up_area"),
    garden_area: number(formData, "garden_area"),
    roof_area: number(formData, "roof_area"),
    floor: text(formData, "floor"),
    finishing: text(formData, "finishing"),
    view: text(formData, "view"),
    price,
    down_payment: number(formData, "down_payment") ?? 0,
    installment_years: number(formData, "installment_years") ?? 10,
    monthly_installment: number(formData, "monthly_installment"),
    delivery: text(formData, "delivery"),
    description: text(formData, "description"),
    amenities: list(formData, "amenities"),
    images: list(formData, "images"),
    video: text(formData, "video"),
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
  });
  await recordAudit({ actor: session.username, action: "unit.updated", entityType: "property", entityId: String(id), detail: { code, project: project.slug } });
  revalidatePath("/dashboard/primary");
  revalidatePath("/dashboard/inventory");
  revalidatePath(`/dashboard/inventory/${id}`);
  revalidatePath(`/dashboard/projects/${project.slug}`);
  revalidatePath("/properties");
  revalidatePath("/projects");
  redirect(`/dashboard/inventory/${id}`);
}

export async function updatePropertyStatusAction(formData: FormData) {
  await requireAdmin("/dashboard/inventory");

  const id = Number(formData.get("id"));
  const status = String(formData.get("status") ?? "");

  if (!Number.isInteger(id) || !(PROPERTY_STATUSES as readonly string[]).includes(status)) return;

  await updatePropertyStatus(id, status);
  revalidatePath("/dashboard/inventory");
  revalidatePath(`/dashboard/inventory/${id}`);
}
