import { query, withTransaction } from "./db";

type Row = Record<string, unknown>;

const UPSERT_TABLES = [
  "locations",
  "developers",
  "property_categories",
  "projects",
  "units",
  "project_images",
  "unit_images",
  "project_facilities",
  "payment_plans",
] as const;

type UpsertTable = (typeof UPSERT_TABLES)[number];

function slug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

export function makeSlug(value: string): string {
  return slug(value) || "item";
}

function clean(value: FormDataEntryValue | string | null | undefined): string {
  if (value === null || value === undefined) return "";
  return typeof value === "string" ? value.trim() : "";
}

function nullable(value: FormDataEntryValue | string | null | undefined): string | null {
  const text = clean(value);
  return text ? text : null;
}

function numeric(value: FormDataEntryValue | string | null | undefined): number | null {
  const text = clean(value);
  if (!text) return null;
  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : null;
}

function checked(value: FormDataEntryValue | string | null | undefined): boolean {
  return value === "on" || value === "true" || value === "1";
}

async function findIdBySlug(table: UpsertTable, value: string): Promise<string | null> {
  const rows = await query<Row>(`SELECT id FROM ${table} WHERE slug = $1 LIMIT 1`, [value]);
  return rows[0] ? String(rows[0].id) : null;
}

async function upsert(table: UpsertTable, values: Record<string, unknown>): Promise<string> {
  const keys = Object.keys(values);
  const columns = keys.join(", ");
  const placeholders = keys.map((_, index) => `$${index + 1}`).join(", ");
  const updates = keys
    .filter((key) => key !== "id")
    .map((key) => `${key} = EXCLUDED.${key}`)
    .join(", ");
  const params = keys.map((key) => values[key]);
  await query(
    `INSERT INTO ${table} (${columns}) VALUES (${placeholders})
     ON CONFLICT (id) DO UPDATE SET ${updates}`,
    params
  );
  return String(values.id);
}

export type LocationInput = {
  id?: string;
  slug: string;
  parentId: string | null;
  type: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string | null;
  descriptionAr: string | null;
  imageUrl: string | null;
  seoTitleEn: string | null;
  seoTitleAr: string | null;
  seoDescriptionEn: string | null;
  seoDescriptionAr: string | null;
  sortOrder: number;
  isDirectory: boolean;
};

export async function saveLocation(input: LocationInput): Promise<string> {
  const value = makeSlug(input.slug);
  const id = input.id || (await findIdBySlug("locations", value)) || `loc_${value}`;
  return upsert("locations", {
    id,
    slug: value,
    parent_id: input.parentId,
    type: input.type,
    name_en: input.nameEn,
    name_ar: input.nameAr,
    description_en: input.descriptionEn,
    description_ar: input.descriptionAr,
    image_url: input.imageUrl,
    seo_title_en: input.seoTitleEn,
    seo_title_ar: input.seoTitleAr,
    seo_description_en: input.seoDescriptionEn,
    seo_description_ar: input.seoDescriptionAr,
    sort_order: input.sortOrder,
    is_directory: input.isDirectory,
    is_active: true,
    archived_at: null,
    updated_at: new Date(),
  });
}

export type DeveloperInput = {
  id?: string;
  slug: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string | null;
  descriptionAr: string | null;
  website: string | null;
  logoUrl: string | null;
};

export async function saveDeveloper(input: DeveloperInput): Promise<string> {
  const value = makeSlug(input.slug);
  const id = input.id || (await findIdBySlug("developers", value)) || `dev_${value}`;
  return upsert("developers", {
    id,
    slug: value,
    name_en: input.nameEn,
    name_ar: input.nameAr,
    description_en: input.descriptionEn,
    description_ar: input.descriptionAr,
    website: input.website,
    logo_url: input.logoUrl,
    is_active: true,
    archived_at: null,
    updated_at: new Date(),
  });
}

export type CategoryInput = {
  id?: string;
  slug: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string | null;
  descriptionAr: string | null;
  icon: string | null;
  sortOrder: number;
  attributes: Record<string, unknown>;
};

export async function saveCategory(input: CategoryInput): Promise<string> {
  const value = makeSlug(input.slug);
  const id = input.id || (await findIdBySlug("property_categories", value)) || `cat_${value.replace(/-/g, "_")}`;
  return upsert("property_categories", {
    id,
    slug: value,
    name_en: input.nameEn,
    name_ar: input.nameAr,
    description_en: input.descriptionEn,
    description_ar: input.descriptionAr,
    icon: input.icon,
    sort_order: input.sortOrder,
    attribute_schema: JSON.stringify(input.attributes),
    is_active: true,
    archived_at: null,
    updated_at: new Date(),
  });
}

export type ProjectInput = {
  id?: string;
  slug: string;
  developerId: string | null;
  locationId: string | null;
  nameEn: string;
  nameAr: string;
  descriptionEn: string | null;
  descriptionAr: string | null;
  status: string;
  coverImage: string | null;
  masterplanImage: string | null;
  videoUrl: string | null;
  seoTitleEn: string | null;
  seoTitleAr: string | null;
  seoDescriptionEn: string | null;
  seoDescriptionAr: string | null;
  deliveryDate: string | null;
  startingPrice: number | null;
  downPaymentPercent: number | null;
  installmentMonths: number | null;
  isFeatured: boolean;
  sortOrder: number;
};

export async function saveProject(input: ProjectInput): Promise<string> {
  const value = makeSlug(input.slug);
  const id = input.id || (await findIdBySlug("projects", value)) || `proj_${value.replace(/-/g, "_")}`;
  return upsert("projects", {
    id,
    slug: value,
    developer_id: input.developerId,
    location_id: input.locationId,
    name_en: input.nameEn,
    name_ar: input.nameAr,
    description_en: input.descriptionEn,
    description_ar: input.descriptionAr,
    status: input.status,
    cover_image: input.coverImage,
    masterplan_image: input.masterplanImage,
    video_url: input.videoUrl,
    seo_title_en: input.seoTitleEn,
    seo_title_ar: input.seoTitleAr,
    seo_description_en: input.seoDescriptionEn,
    seo_description_ar: input.seoDescriptionAr,
    delivery_date: input.deliveryDate,
    starting_price: input.startingPrice,
    down_payment_percent: input.downPaymentPercent,
    installment_months: input.installmentMonths,
    is_featured: input.isFeatured,
    sort_order: input.sortOrder,
    is_active: true,
    archived_at: null,
    updated_at: new Date(),
  });
}

export async function setProjectCategories(projectId: string, categoryIds: string[]): Promise<void> {
  await withTransaction(async (client) => {
    await client.query(
      "UPDATE project_property_categories SET is_active = false WHERE project_id = $1",
      [projectId]
    );
    for (const [index, categoryId] of categoryIds.entries()) {
      await client.query(
        `INSERT INTO project_property_categories (project_id, category_id, sort_order, is_active)
         VALUES ($1, $2, $3, true)
         ON CONFLICT (project_id, category_id)
         DO UPDATE SET sort_order = EXCLUDED.sort_order, is_active = true`,
        [projectId, categoryId, index]
      );
    }
  });
}

export type UnitInput = {
  id?: string;
  slug: string;
  projectId: string;
  categoryId: string;
  reference: string | null;
  titleEn: string;
  titleAr: string;
  descriptionEn: string | null;
  descriptionAr: string | null;
  builtUpArea: number | null;
  landArea: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  floor: string | null;
  gardenArea: number | null;
  terraceArea: number | null;
  viewEn: string | null;
  viewAr: string | null;
  finishingEn: string | null;
  finishingAr: string | null;
  deliveryDate: string | null;
  totalPrice: number | null;
  downPaymentAmount: number | null;
  downPaymentPercent: number | null;
  installmentMonths: number | null;
  installmentAmount: number | null;
  installmentFrequency: string | null;
  status: string;
  images: string[];
};

export async function saveUnit(input: UnitInput): Promise<string> {
  const value = makeSlug(input.slug);
  const id = input.id || (await findIdBySlug("units", value)) || `unit_${value.replace(/-/g, "_")}`;
  // A unit always belongs to a project/category pair; create the link if the
  // editor picked a category that was not previously attached to the project.
  await query(
    `INSERT INTO project_property_categories (project_id, category_id, sort_order, is_active)
     VALUES ($1, $2, 0, true)
     ON CONFLICT (project_id, category_id) DO UPDATE SET is_active = true`,
    [input.projectId, input.categoryId]
  );
  const unitId = await upsert("units", {
    id,
    slug: value,
    project_id: input.projectId,
    category_id: input.categoryId,
    reference: input.reference,
    title_en: input.titleEn,
    title_ar: input.titleAr,
    description_en: input.descriptionEn,
    description_ar: input.descriptionAr,
    built_up_area: input.builtUpArea,
    land_area: input.landArea,
    bedrooms: input.bedrooms,
    bathrooms: input.bathrooms,
    floor: input.floor,
    garden_area: input.gardenArea,
    terrace_area: input.terraceArea,
    view_en: input.viewEn,
    view_ar: input.viewAr,
    finishing_en: input.finishingEn,
    finishing_ar: input.finishingAr,
    delivery_date: input.deliveryDate,
    total_price: input.totalPrice,
    down_payment_amount: input.downPaymentAmount,
    down_payment_percent: input.downPaymentPercent,
    installment_months: input.installmentMonths,
    installment_amount: input.installmentAmount,
    installment_frequency: input.installmentFrequency,
    status: input.status,
    is_active: true,
    updated_at: new Date(),
  });

  await withTransaction(async (client) => {
    await client.query("DELETE FROM unit_images WHERE unit_id = $1", [unitId]);
    for (const [index, url] of input.images.entries()) {
      await client.query(
        `INSERT INTO unit_images (id, unit_id, url, alt_en, alt_ar, kind, sort_order)
         VALUES ($1, $2, $3, NULL, NULL, 'photo', $4)`,
        [`${unitId}-img-${index + 1}`, unitId, url, index]
      );
    }
  });
  return unitId;
}

export async function archiveCatalogItem(table: "locations" | "developers" | "property_categories" | "projects" | "units", id: string): Promise<void> {
  if (table === "units") {
    await query(
      "UPDATE units SET is_active = false, status = 'archived', updated_at = now() WHERE id = $1",
      [id]
    );
    return;
  }
  await query(
    `UPDATE ${table} SET is_active = false, archived_at = now(), updated_at = now() WHERE id = $1`,
    [id]
  );
}

export async function restoreCatalogItem(table: "locations" | "developers" | "property_categories" | "projects" | "units", id: string): Promise<void> {
  if (table === "units") {
    await query(
      "UPDATE units SET is_active = true, status = 'available', updated_at = now() WHERE id = $1",
      [id]
    );
    return;
  }
  await query(
    `UPDATE ${table} SET is_active = true, archived_at = NULL, updated_at = now() WHERE id = $1`,
    [id]
  );
}

type CatalogEntity = "locations" | "developers" | "property_categories" | "projects" | "units";

/** Admin lists include archived rows so staff can restore them safely. */
export async function listCatalogAdmin(entity: CatalogEntity): Promise<Row[]> {
  const order =
    entity === "locations" || entity === "property_categories" || entity === "projects"
      ? "sort_order, name_en"
      : entity === "units"
        ? "created_at DESC"
        : "name_en";
  const rows = await query<Row>(`SELECT * FROM ${entity} ORDER BY ${order}`);
  return rows;
}

export async function getCatalogRecord(entity: CatalogEntity, id: string): Promise<Row | null> {
  const rows = await query<Row>(`SELECT * FROM ${entity} WHERE id = $1 LIMIT 1`, [id]);
  return rows[0] ?? null;
}

export type ProjectMediaInput = {
  images: string[];
  facilities: string[];
  landmarks: string[];
  facts: string[];
  plan: { nameEn: string; nameAr: string; downPaymentPercent: number | null; installmentMonths: number | null; deliveryDate: string | null; notesEn: string | null; notesAr: string | null };
};

function lines(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function parts(line: string, count: number): string[] {
  const values = line.split("|").map((part) => part.trim());
  return Array.from({ length: count }, (_, index) => values[index] ?? "");
}

export async function saveProjectMedia(projectId: string, input: ProjectMediaInput): Promise<void> {
  await withTransaction(async (client) => {
    await client.query("DELETE FROM project_images WHERE project_id = $1", [projectId]);
    for (const [index, url] of input.images.entries()) {
      await client.query(
        `INSERT INTO project_images (id, project_id, url, alt_en, alt_ar, kind, sort_order)
         VALUES ($1, $2, $3, NULL, NULL, 'gallery', $4)`,
        [`${projectId}-img-${index + 1}`, projectId, url, index]
      );
    }

    await client.query("DELETE FROM project_facilities WHERE project_id = $1", [projectId]);
    for (const [index, line] of input.facilities.entries()) {
      const [nameEn, nameAr] = parts(line, 2);
      if (!nameEn) continue;
      await client.query(
        `INSERT INTO project_facilities (id, project_id, name_en, name_ar, sort_order)
         VALUES ($1, $2, $3, $4, $5)`,
        [`${projectId}-fac-${index + 1}`, projectId, nameEn, nameAr || null, index]
      );
    }

    await client.query("DELETE FROM project_landmarks WHERE project_id = $1", [projectId]);
    for (const [index, line] of input.landmarks.entries()) {
      const [nameEn, nameAr, distance, kind] = parts(line, 4);
      if (!nameEn) continue;
      const safeKind = ["nearby", "landmark", "transport", "education", "leisure"].includes(kind)
        ? kind
        : "nearby";
      await client.query(
        `INSERT INTO project_landmarks (id, project_id, name_en, name_ar, distance, kind, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [`${projectId}-landmark-${index + 1}`, projectId, nameEn, nameAr || null, distance || null, safeKind, index]
      );
    }

    await client.query("DELETE FROM project_facts WHERE project_id = $1", [projectId]);
    for (const [index, line] of input.facts.entries()) {
      const [labelEn, labelAr, valueEn, valueAr] = parts(line, 4);
      if (!labelEn || !valueEn) continue;
      await client.query(
        `INSERT INTO project_facts (id, project_id, label_en, label_ar, value_en, value_ar, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [`${projectId}-fact-${index + 1}`, projectId, labelEn, labelAr || null, valueEn, valueAr || null, index]
      );
    }

    await client.query(
      `INSERT INTO payment_plans
         (id, project_id, name_en, name_ar, down_payment_percent, installment_months,
          delivery_date, notes_en, notes_ar, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 0)
       ON CONFLICT (id) DO UPDATE SET
         name_en = EXCLUDED.name_en, name_ar = EXCLUDED.name_ar,
         down_payment_percent = EXCLUDED.down_payment_percent,
         installment_months = EXCLUDED.installment_months,
         delivery_date = EXCLUDED.delivery_date,
         notes_en = EXCLUDED.notes_en, notes_ar = EXCLUDED.notes_ar`,
      [
        `${projectId}-plan-default`,
        projectId,
        input.plan.nameEn,
        input.plan.nameAr || null,
        input.plan.downPaymentPercent,
        input.plan.installmentMonths,
        input.plan.deliveryDate,
        input.plan.notesEn,
        input.plan.notesAr,
      ]
    );
  });
}

export { lines as parseLines };

/** Helpers for parsing CRM form data into the strongly typed inputs above. */
export const form = { clean, nullable, numeric, checked };
