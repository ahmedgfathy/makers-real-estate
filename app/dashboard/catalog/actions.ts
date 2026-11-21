"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { canPublish, requireAdmin } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import {
  archiveCatalogItem,
  form,
  restoreCatalogItem,
  saveCategory,
  saveDeveloper,
  saveLocation,
  saveProject,
  saveProjectMedia,
  saveUnit,
  setProjectCategories,
  parseLines,
} from "@/lib/catalog-admin";

type Entity = "locations" | "developers" | "property_categories" | "projects" | "units";

function notice(message: string, tone: "ok" | "bad" = "ok"): never {
  redirect(`/dashboard/catalog?notice=${encodeURIComponent(message)}&tone=${tone}`);
}

function entity(value: FormDataEntryValue | string | null): Entity {
  const text = form.clean(value);
  const allowed: Entity[] = ["locations", "developers", "property_categories", "projects", "units"];
  return allowed.includes(text as Entity) ? (text as Entity) : "locations";
}

function one(value: FormDataEntryValue | null): string {
  return form.clean(value);
}

async function guard(): Promise<string> {
  const session = await requireAdmin("/dashboard/catalog");
  return session.username;
}

function revalidateCatalog() {
  revalidatePath("/", "layout");
  revalidatePath("/en", "layout");
  revalidatePath("/ar", "layout");
  revalidatePath("/dashboard", "layout");
  revalidatePath("/dashboard/catalog");
}

export async function saveLocationAction(data: FormData) {
  const actor = await guard();
  const nameEn = one(data.get("nameEn"));
  const nameAr = one(data.get("nameAr"));
  if (!nameEn || !nameAr) notice("English and Arabic names are required", "bad");
  const id = await saveLocation({
    id: one(data.get("id")) || undefined,
    slug: one(data.get("slug")) || nameEn,
    parentId: form.nullable(data.get("parentId")),
    type: one(data.get("type")) || "area",
    nameEn,
    nameAr,
    descriptionEn: form.nullable(data.get("descriptionEn")),
    descriptionAr: form.nullable(data.get("descriptionAr")),
    imageUrl: form.nullable(data.get("imageUrl")),
    seoTitleEn: form.nullable(data.get("seoTitleEn")),
    seoTitleAr: form.nullable(data.get("seoTitleAr")),
    seoDescriptionEn: form.nullable(data.get("seoDescriptionEn")),
    seoDescriptionAr: form.nullable(data.get("seoDescriptionAr")),
    sortOrder: form.numeric(data.get("sortOrder")) ?? 0,
    isDirectory: form.checked(data.get("isDirectory")),
  });
  await recordAudit({ actor, action: "catalog.location.saved", entityType: "location", entityId: id, detail: { nameEn } });
  revalidateCatalog();
  notice(`Location “${nameEn}” saved`);
}

export async function saveDeveloperAction(data: FormData) {
  const actor = await guard();
  const nameEn = one(data.get("nameEn"));
  if (!nameEn) notice("An English name is required", "bad");
  const id = await saveDeveloper({
    id: one(data.get("id")) || undefined,
    slug: one(data.get("slug")) || nameEn,
    nameEn,
    nameAr: one(data.get("nameAr")) || nameEn,
    descriptionEn: form.nullable(data.get("descriptionEn")),
    descriptionAr: form.nullable(data.get("descriptionAr")),
    website: form.nullable(data.get("website")),
    logoUrl: form.nullable(data.get("logoUrl")),
  });
  await recordAudit({ actor, action: "catalog.developer.saved", entityType: "developer", entityId: id, detail: { nameEn } });
  revalidateCatalog();
  notice(`Developer “${nameEn}” saved`);
}

export async function saveCategoryAction(data: FormData) {
  const actor = await guard();
  const nameEn = one(data.get("nameEn"));
  const nameAr = one(data.get("nameAr"));
  if (!nameEn || !nameAr) notice("English and Arabic names are required", "bad");
  const attributes = form.clean(data.get("attributes"));
  let parsed: Record<string, unknown> = {};
  if (attributes) {
    try {
      const value = JSON.parse(attributes);
      if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error("object required");
      parsed = value as Record<string, unknown>;
    } catch {
      notice("Attributes must be a JSON object", "bad");
    }
  }
  const id = await saveCategory({
    id: one(data.get("id")) || undefined,
    slug: one(data.get("slug")) || nameEn,
    nameEn,
    nameAr,
    descriptionEn: form.nullable(data.get("descriptionEn")),
    descriptionAr: form.nullable(data.get("descriptionAr")),
    icon: form.nullable(data.get("icon")),
    sortOrder: form.numeric(data.get("sortOrder")) ?? 0,
    attributes: parsed,
  });
  await recordAudit({ actor, action: "catalog.category.saved", entityType: "category", entityId: id, detail: { nameEn } });
  revalidateCatalog();
  notice(`Category “${nameEn}” saved`);
}

export async function saveProjectAction(data: FormData) {
  const actor = await guard();
  const nameEn = one(data.get("nameEn"));
  const nameAr = one(data.get("nameAr"));
  if (!nameEn || !nameAr) notice("English and Arabic names are required", "bad");
  const id = await saveProject({
    id: one(data.get("id")) || undefined,
    slug: one(data.get("slug")) || nameEn,
    developerId: form.nullable(data.get("developerId")),
    locationId: form.nullable(data.get("locationId")),
    nameEn,
    nameAr,
    descriptionEn: form.nullable(data.get("descriptionEn")),
    descriptionAr: form.nullable(data.get("descriptionAr")),
    status: one(data.get("status")) || "off_plan",
    coverImage: form.nullable(data.get("coverImage")),
    masterplanImage: form.nullable(data.get("masterplanImage")),
    videoUrl: form.nullable(data.get("videoUrl")),
    seoTitleEn: form.nullable(data.get("seoTitleEn")),
    seoTitleAr: form.nullable(data.get("seoTitleAr")),
    seoDescriptionEn: form.nullable(data.get("seoDescriptionEn")),
    seoDescriptionAr: form.nullable(data.get("seoDescriptionAr")),
    deliveryDate: form.nullable(data.get("deliveryDate")),
    startingPrice: form.numeric(data.get("startingPrice")),
    downPaymentPercent: form.numeric(data.get("downPaymentPercent")),
    installmentMonths: form.numeric(data.get("installmentMonths")),
    isFeatured: form.checked(data.get("isFeatured")),
    sortOrder: form.numeric(data.get("sortOrder")) ?? 0,
  });
  const categoryIds = data.getAll("categoryIds").map(String).filter(Boolean);
  await setProjectCategories(id, categoryIds);
  await recordAudit({ actor, action: "catalog.project.saved", entityType: "project", entityId: id, detail: { nameEn, categoryIds } });
  revalidateCatalog();
  notice(`Project “${nameEn}” saved`, "ok");
}

export async function saveProjectMediaAction(data: FormData) {
  const actor = await guard();
  const projectId = one(data.get("projectId"));
  if (!projectId) notice("Choose a project first", "bad");
  await saveProjectMedia(projectId, {
    images: parseLines(one(data.get("images"))),
    facilities: parseLines(one(data.get("facilities"))),
    landmarks: parseLines(one(data.get("landmarks"))),
    facts: parseLines(one(data.get("facts"))),
    plan: {
      nameEn: one(data.get("planNameEn")) || "Developer payment plan",
      nameAr: one(data.get("planNameAr")) || "خطة سداد المطور",
      downPaymentPercent: form.numeric(data.get("planDownPayment")),
      installmentMonths: form.numeric(data.get("planInstallmentMonths")),
      deliveryDate: form.nullable(data.get("planDeliveryDate")),
      notesEn: form.nullable(data.get("planNotesEn")),
      notesAr: form.nullable(data.get("planNotesAr")),
    },
  });
  await recordAudit({ actor, action: "catalog.project.media.saved", entityType: "project", entityId: projectId });
  revalidateCatalog();
  notice("Project media and details saved");
}

export async function saveUnitAction(data: FormData) {
  const actor = await guard();
  const titleEn = one(data.get("titleEn"));
  const titleAr = one(data.get("titleAr"));
  if (!titleEn || !titleAr) notice("English and Arabic unit titles are required", "bad");
  const projectId = one(data.get("projectId"));
  const categoryId = one(data.get("categoryId"));
  if (!projectId || !categoryId) notice("Choose a project and category", "bad");
  const id = await saveUnit({
    id: one(data.get("id")) || undefined,
    slug: one(data.get("slug")) || `${titleEn}-${one(data.get("reference"))}`,
    projectId,
    categoryId,
    reference: form.nullable(data.get("reference")),
    titleEn,
    titleAr,
    descriptionEn: form.nullable(data.get("descriptionEn")),
    descriptionAr: form.nullable(data.get("descriptionAr")),
    builtUpArea: form.numeric(data.get("builtUpArea")),
    landArea: form.numeric(data.get("landArea")),
    bedrooms: form.numeric(data.get("bedrooms")),
    bathrooms: form.numeric(data.get("bathrooms")),
    floor: form.nullable(data.get("floor")),
    gardenArea: form.numeric(data.get("gardenArea")),
    terraceArea: form.numeric(data.get("terraceArea")),
    viewEn: form.nullable(data.get("viewEn")),
    viewAr: form.nullable(data.get("viewAr")),
    finishingEn: form.nullable(data.get("finishingEn")),
    finishingAr: form.nullable(data.get("finishingAr")),
    deliveryDate: form.nullable(data.get("deliveryDate")),
    totalPrice: form.numeric(data.get("totalPrice")),
    downPaymentAmount: form.numeric(data.get("downPaymentAmount")),
    downPaymentPercent: form.numeric(data.get("downPaymentPercent")),
    installmentMonths: form.numeric(data.get("installmentMonths")),
    installmentAmount: form.numeric(data.get("installmentAmount")),
    installmentFrequency: form.nullable(data.get("installmentFrequency")),
    status: one(data.get("status")) || "available",
    images: parseLines(one(data.get("images"))),
  });
  await recordAudit({ actor, action: "catalog.unit.saved", entityType: "unit", entityId: id, detail: { titleEn } });
  revalidateCatalog();
  notice(`Unit “${titleEn}” saved`);
}

export async function archiveCatalogAction(data: FormData) {
  const session = await requireAdmin("/dashboard/catalog");
  if (!canPublish(session)) notice("Only administrators can archive catalogue records", "bad");
  const table = entity(data.get("entity"));
  const id = one(data.get("id"));
  if (!id) notice("Missing catalogue record", "bad");
  await archiveCatalogItem(table, id);
  await recordAudit({ actor: session.username, action: "catalog.archived", entityType: table, entityId: id });
  revalidateCatalog();
  notice("Catalogue record archived");
}

export async function restoreCatalogAction(data: FormData) {
  const session = await requireAdmin("/dashboard/catalog");
  if (!canPublish(session)) notice("Only administrators can restore catalogue records", "bad");
  const table = entity(data.get("entity"));
  const id = one(data.get("id"));
  if (!id) notice("Missing catalogue record", "bad");
  await restoreCatalogItem(table, id);
  await recordAudit({ actor: session.username, action: "catalog.restored", entityType: table, entityId: id });
  revalidateCatalog();
  notice("Catalogue record restored");
}
