import { query } from "./db";

export type Lang = "en" | "ar";

export type LocationType = "country" | "governorate" | "city" | "district" | "area";

export type Location = {
  id: string;
  slug: string;
  parentId: string | null;
  type: LocationType;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  imageUrl: string | null;
  seoTitleEn: string | null;
  seoTitleAr: string | null;
  seoDescriptionEn: string | null;
  seoDescriptionAr: string | null;
  sortOrder: number;
  isDirectory: boolean;
};

export type LocationWithCount = Location & {
  projectCount: number;
  startingPrice: number | null;
};

export type Developer = {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  website: string | null;
  logoUrl: string | null;
};

export type PropertyCategory = {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string | null;
  descriptionAr: string | null;
  icon: string | null;
  sortOrder: number;
};

export type ProjectStatus = "ready" | "under_construction" | "off_plan";

export type Project = {
  id: string;
  slug: string;
  developerId: string | null;
  locationId: string | null;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  status: ProjectStatus;
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
  updatedAt: string;
  location: Location | null;
  developer: Developer | null;
  categories: PropertyCategory[];
};

export type ProjectWithCount = Project & { unitCount: number };

export type UnitStatus = "available" | "reserved" | "sold" | "archived";

export type Unit = {
  id: string;
  slug: string;
  reference: string | null;
  projectId: string;
  categoryId: string;
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
  status: UnitStatus;
  projectNameEn: string;
  projectNameAr: string;
  projectSlug: string;
  categoryNameEn: string;
  categoryNameAr: string;
  categorySlug: string;
};

export type ProjectImage = { id: string; url: string; altEn: string | null; altAr: string | null; kind: string };
export type Facility = { id: string; nameEn: string; nameAr: string | null; icon: string | null };
export type Landmark = {
  id: string;
  nameEn: string;
  nameAr: string | null;
  distance: string | null;
  kind: string;
};
export type ProjectFact = { id: string; labelEn: string; labelAr: string | null; valueEn: string; valueAr: string | null };
export type PaymentPlan = {
  id: string;
  nameEn: string;
  nameAr: string | null;
  downPaymentPercent: number | null;
  installmentMonths: number | null;
  deliveryDate: string | null;
  notesEn: string | null;
  notesAr: string | null;
};
export type UnitImage = { id: string; url: string; altEn: string | null; altAr: string | null; kind: string };

export type ProjectFilters = {
  q?: string;
  location?: string;
  locationIds?: string[];
  developer?: string;
  category?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  minDownPayment?: number;
  maxInstallment?: number;
  deliveryBefore?: string;
  sort?: "featured" | "price_asc" | "price_desc" | "name" | "newest";
  page?: number;
  pageSize?: number;
};

export type UnitFilters = {
  q?: string;
  location?: string;
  locationIds?: string[];
  project?: string;
  category?: string;
  bedrooms?: number;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  status?: string;
  sort?: "price_asc" | "price_desc" | "area_desc" | "newest";
  page?: number;
  pageSize?: number;
};

type Row = Record<string, unknown>;

/** Hero tab shorthand: all residential property categories, not just apartments. */
const RESIDENTIAL_CATEGORY_SLUGS = [
  "apartments",
  "studios",
  "villas",
  "standalone-villas",
  "twin-houses",
  "townhouses",
  "duplexes",
  "penthouses",
  "chalets",
];

function num(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function str(value: unknown): string {
  return value === null || value === undefined ? "" : String(value);
}

function dateOnly(value: unknown): string | null {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  const text = String(value);
  return text.slice(0, 10);
}

function jsonArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? (parsed as T[]) : [];
    } catch {
      return [];
    }
  }
  return [];
}

function mapLocation(row: Row): Location {
  return {
    id: str(row.id),
    slug: str(row.slug),
    parentId: row.parent_id ? str(row.parent_id) : null,
    type: (str(row.type) || "area") as LocationType,
    nameEn: str(row.name_en),
    nameAr: str(row.name_ar),
    descriptionEn: str(row.description_en),
    descriptionAr: str(row.description_ar),
    imageUrl: row.image_url ? str(row.image_url) : null,
    seoTitleEn: row.seo_title_en ? str(row.seo_title_en) : null,
    seoTitleAr: row.seo_title_ar ? str(row.seo_title_ar) : null,
    seoDescriptionEn: row.seo_description_en ? str(row.seo_description_en) : null,
    seoDescriptionAr: row.seo_description_ar ? str(row.seo_description_ar) : null,
    sortOrder: num(row.sort_order) ?? 0,
    isDirectory: Boolean(row.is_directory),
  };
}

function mapDeveloper(row: Row): Developer | null {
  if (!row.dev_id) return null;
  return {
    id: str(row.dev_id),
    slug: str(row.dev_slug),
    nameEn: str(row.dev_name_en),
    nameAr: str(row.dev_name_ar),
    descriptionEn: str(row.dev_description_en),
    descriptionAr: str(row.dev_description_ar),
    website: row.dev_website ? str(row.dev_website) : null,
    logoUrl: row.dev_logo_url ? str(row.dev_logo_url) : null,
  };
}

function mapCategory(row: Row): PropertyCategory {
  return {
    id: str(row.id),
    slug: str(row.slug),
    nameEn: str(row.name_en),
    nameAr: str(row.name_ar),
    descriptionEn: row.description_en ? str(row.description_en) : null,
    descriptionAr: row.description_ar ? str(row.description_ar) : null,
    icon: row.icon ? str(row.icon) : null,
    sortOrder: num(row.sort_order) ?? 0,
  };
}

const PROJECT_COLUMNS = `
  p.id, p.slug, p.developer_id, p.location_id, p.name_en, p.name_ar,
  COALESCE(p.description_en, '') AS description_en,
  COALESCE(p.description_ar, '') AS description_ar,
  p.status, p.cover_image, p.masterplan_image, p.video_url,
  p.seo_title_en, p.seo_title_ar, p.seo_description_en, p.seo_description_ar,
  p.delivery_date,
  p.starting_price, p.down_payment_percent, p.installment_months, p.is_featured,
  p.updated_at,
  l.id AS loc_id, l.slug AS loc_slug, l.parent_id AS loc_parent_id, l.type AS loc_type,
  l.name_en AS loc_name_en, l.name_ar AS loc_name_ar,
  COALESCE(l.description_en, '') AS loc_description_en,
  COALESCE(l.description_ar, '') AS loc_description_ar,
  l.image_url AS loc_image_url, l.seo_title_en AS loc_seo_title_en,
  l.seo_title_ar AS loc_seo_title_ar, l.seo_description_en AS loc_seo_description_en,
  l.seo_description_ar AS loc_seo_description_ar,
  COALESCE(l.sort_order, 0) AS loc_sort_order,
  COALESCE(l.is_directory, false) AS loc_is_directory,
  d.id AS dev_id, d.slug AS dev_slug, d.name_en AS dev_name_en, d.name_ar AS dev_name_ar,
  COALESCE(d.description_en, '') AS dev_description_en,
  COALESCE(d.description_ar, '') AS dev_description_ar,
  d.website AS dev_website, d.logo_url AS dev_logo_url,
  COALESCE(jsonb_agg(
    jsonb_build_object(
      'id', c.id, 'slug', c.slug, 'name_en', c.name_en, 'name_ar', c.name_ar,
      'description_en', c.description_en, 'description_ar', c.description_ar,
      'icon', c.icon, 'sort_order', ppc.sort_order
    ) ORDER BY ppc.sort_order, c.sort_order
  ) FILTER (WHERE c.id IS NOT NULL), '[]'::jsonb) AS categories
`;

const PROJECT_JOINS = `
  FROM projects p
  LEFT JOIN locations l ON l.id = p.location_id
  LEFT JOIN developers d ON d.id = p.developer_id
  LEFT JOIN project_property_categories ppc
    ON ppc.project_id = p.id AND ppc.is_active
  LEFT JOIN property_categories c ON c.id = ppc.category_id AND c.is_active
`;

function mapProject(row: Row): Project {
  const locationRow: Row = {
    id: row.loc_id,
    slug: row.loc_slug,
    parent_id: row.loc_parent_id,
    type: row.loc_type,
    name_en: row.loc_name_en,
    name_ar: row.loc_name_ar,
    description_en: row.loc_description_en,
    description_ar: row.loc_description_ar,
    image_url: row.loc_image_url,
    seo_title_en: row.loc_seo_title_en,
    seo_title_ar: row.loc_seo_title_ar,
    seo_description_en: row.loc_seo_description_en,
    seo_description_ar: row.loc_seo_description_ar,
    sort_order: row.loc_sort_order,
    is_directory: row.loc_is_directory,
  };

  const categories = jsonArray<Row>(row.categories)
    .map((item) => mapCategory({ ...item, sort_order: item.sort_order ?? item.sortOrder }))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return {
    id: str(row.id),
    slug: str(row.slug),
    developerId: row.developer_id ? str(row.developer_id) : null,
    locationId: row.location_id ? str(row.location_id) : null,
    nameEn: str(row.name_en),
    nameAr: str(row.name_ar),
    descriptionEn: str(row.description_en),
    descriptionAr: str(row.description_ar),
    status: (str(row.status) || "off_plan") as ProjectStatus,
    coverImage: row.cover_image ? str(row.cover_image) : null,
    masterplanImage: row.masterplan_image ? str(row.masterplan_image) : null,
    videoUrl: row.video_url ? str(row.video_url) : null,
    seoTitleEn: row.seo_title_en ? str(row.seo_title_en) : null,
    seoTitleAr: row.seo_title_ar ? str(row.seo_title_ar) : null,
    seoDescriptionEn: row.seo_description_en ? str(row.seo_description_en) : null,
    seoDescriptionAr: row.seo_description_ar ? str(row.seo_description_ar) : null,
    deliveryDate: dateOnly(row.delivery_date),
    startingPrice: num(row.starting_price),
    downPaymentPercent: num(row.down_payment_percent),
    installmentMonths: num(row.installment_months),
    isFeatured: Boolean(row.is_featured),
    updatedAt: dateOnly(row.updated_at) ?? "",
    location: row.loc_id ? mapLocation(locationRow) : null,
    developer: mapDeveloper(row),
    categories,
  };
}

export function locationName(location: Pick<Location, "nameEn" | "nameAr"> | null, lang: Lang): string {
  if (!location) return "";
  return lang === "ar" ? location.nameAr || location.nameEn : location.nameEn || location.nameAr;
}

export function projectName(project: Pick<Project, "nameEn" | "nameAr">, lang: Lang): string {
  return lang === "ar" ? project.nameAr || project.nameEn : project.nameEn || project.nameAr;
}

export function categoryName(category: Pick<PropertyCategory, "nameEn" | "nameAr">, lang: Lang): string {
  return lang === "ar" ? category.nameAr || category.nameEn : category.nameEn || category.nameAr;
}

export function unitTitle(unit: Pick<Unit, "titleEn" | "titleAr" | "reference">, lang: Lang): string {
  const title = lang === "ar" ? unit.titleAr || unit.titleEn : unit.titleEn || unit.titleAr;
  return unit.reference ? `${title} · ${unit.reference}` : title;
}

export async function listLocations(): Promise<Location[]> {
  const rows = await query<Row>(
    `SELECT * FROM locations
      WHERE is_active AND archived_at IS NULL
      ORDER BY sort_order, name_en`
  );
  return rows.map(mapLocation);
}

export async function getLocationBySlug(slug: string): Promise<Location | null> {
  const rows = await query<Row>(
    `SELECT * FROM locations WHERE slug = $1 AND is_active AND archived_at IS NULL LIMIT 1`,
    [slug]
  );
  return rows[0] ? mapLocation(rows[0]) : null;
}

export async function getLocationById(id: string): Promise<Location | null> {
  const rows = await query<Row>(`SELECT * FROM locations WHERE id = $1 LIMIT 1`, [id]);
  return rows[0] ? mapLocation(rows[0]) : null;
}

export function descendantIds(locations: Location[], id: string): string[] {
  const ids = [id];
  let changed = true;
  while (changed) {
    changed = false;
    for (const location of locations) {
      if (location.parentId && ids.includes(location.parentId) && !ids.includes(location.id)) {
        ids.push(location.id);
        changed = true;
      }
    }
  }
  return ids;
}

export function ancestorLocations(locations: Location[], location: Location | null): Location[] {
  const chain: Location[] = [];
  let current = location;
  while (current?.parentId) {
    const parent = locations.find((item) => item.id === current?.parentId);
    if (!parent || chain.some((item) => item.id === parent.id)) break;
    chain.unshift(parent);
    current = parent;
  }
  return chain;
}

export async function listDirectoryLocations(): Promise<LocationWithCount[]> {
  const [locations, projects] = await Promise.all([listLocations(), listProjects({ pageSize: 1000 })]);
  return locations
    .filter((location) => location.isDirectory)
    .map((location) => {
      const ids = descendantIds(locations, location.id);
      const matched = projects.items.filter((project) => project.locationId && ids.includes(project.locationId));
      const prices = matched.map((project) => project.startingPrice).filter((value): value is number => value !== null);
      return {
        ...location,
        projectCount: matched.length,
        startingPrice: prices.length ? Math.min(...prices) : null,
      };
    });
}

export async function listDevelopers(): Promise<Developer[]> {
  const rows = await query<Row>(
    `SELECT id AS dev_id, slug AS dev_slug, name_en AS dev_name_en, name_ar AS dev_name_ar,
            description_en AS dev_description_en, description_ar AS dev_description_ar,
            website AS dev_website, logo_url AS dev_logo_url
      FROM developers WHERE is_active AND archived_at IS NULL ORDER BY name_en`
  );
  return rows.map((row) => mapDeveloper(row)!);
}

export async function listCategories(): Promise<PropertyCategory[]> {
  const rows = await query<Row>(
    `SELECT id, slug, name_en, name_ar, description_en, description_ar, icon, sort_order
      FROM property_categories WHERE is_active AND archived_at IS NULL ORDER BY sort_order, name_en`
  );
  return rows.map(mapCategory);
}

function projectWhere(filters: ProjectFilters, params: unknown[]): string {
  const clauses = ["p.is_active", "p.archived_at IS NULL"];
  if (filters.q) {
    params.push(filters.q);
    const i = params.length;
    clauses.push(`(p.name_en ILIKE '%' || $${i} || '%' OR p.name_ar ILIKE '%' || $${i} || '%'
      OR l.name_en ILIKE '%' || $${i} || '%' OR l.name_ar ILIKE '%' || $${i} || '%'
      OR d.name_en ILIKE '%' || $${i} || '%' OR d.name_ar ILIKE '%' || $${i} || '%')`);
  }
  if (filters.locationIds) {
    // An explicitly empty set means "no locations", not "all locations".
    params.push(filters.locationIds);
    clauses.push(`p.location_id = ANY($${params.length}::text[])`);
  } else if (filters.location) {
    params.push(filters.location);
    clauses.push(`p.location_id = ANY($${params.length}::text[])`);
  }
  if (filters.developer) {
    params.push(filters.developer);
    clauses.push(`p.developer_id = $${params.length}`);
  }
  if (filters.category === "residential") {
    params.push(RESIDENTIAL_CATEGORY_SLUGS);
    clauses.push(`EXISTS (SELECT 1 FROM project_property_categories pp
      JOIN property_categories pc ON pc.id = pp.category_id
      WHERE pp.project_id = p.id AND pp.is_active
        AND pc.slug = ANY($${params.length}::text[]))`);
  } else if (filters.category) {
    params.push(filters.category);
    clauses.push(`EXISTS (SELECT 1 FROM project_property_categories pp
      WHERE pp.project_id = p.id AND pp.category_id = $${params.length} AND pp.is_active)`);
  }
  if (filters.status) {
    params.push(filters.status);
    clauses.push(`p.status = $${params.length}`);
  }
  if (typeof filters.minPrice === "number") {
    params.push(filters.minPrice);
    clauses.push(`p.starting_price >= $${params.length}`);
  }
  if (typeof filters.maxPrice === "number") {
    params.push(filters.maxPrice);
    clauses.push(`p.starting_price <= $${params.length}`);
  }
  if (typeof filters.minDownPayment === "number") {
    params.push(filters.minDownPayment);
    clauses.push(`p.down_payment_percent >= $${params.length}`);
  }
  if (typeof filters.maxInstallment === "number") {
    params.push(filters.maxInstallment);
    clauses.push(`p.installment_months <= $${params.length}`);
  }
  if (filters.deliveryBefore) {
    params.push(filters.deliveryBefore);
    clauses.push(`p.delivery_date <= $${params.length}::date`);
  }
  return clauses.join(" AND ");
}

const PROJECT_SORT: Record<NonNullable<ProjectFilters["sort"]>, string> = {
  featured: "p.is_featured DESC, p.sort_order, p.name_en",
  price_asc: "p.starting_price ASC NULLS LAST, p.name_en",
  price_desc: "p.starting_price DESC NULLS LAST, p.name_en",
  name: "p.name_en",
  newest: "p.updated_at DESC, p.sort_order",
};

export async function listProjects(
  filters: ProjectFilters = {}
): Promise<{ items: Project[]; total: number; page: number; pageSize: number }> {
  const params: unknown[] = [];
  const where = projectWhere(filters, params);
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.min(1000, Math.max(1, filters.pageSize ?? 12));
  params.push(pageSize, (page - 1) * pageSize);
  const sql = `
    SELECT ${PROJECT_COLUMNS}, COUNT(*) OVER()::int AS total
    ${PROJECT_JOINS}
    WHERE ${where}
    GROUP BY p.id, l.id, d.id
    ORDER BY ${PROJECT_SORT[filters.sort ?? "featured"]}
    LIMIT $${params.length - 1} OFFSET $${params.length}`;
  const rows = await query<Row>(sql, params);
  return {
    items: rows.map(mapProject),
    total: num(rows[0]?.total) ?? 0,
    page,
    pageSize,
  };
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const rows = await query<Row>(
    `SELECT ${PROJECT_COLUMNS}
     ${PROJECT_JOINS}
     WHERE p.slug = $1 AND p.is_active AND p.archived_at IS NULL
     GROUP BY p.id, l.id, d.id
     LIMIT 1`,
    [slug]
  );
  return rows[0] ? mapProject(rows[0]) : null;
}

export async function getProjectById(id: string): Promise<Project | null> {
  const rows = await query<Row>(
    `SELECT ${PROJECT_COLUMNS}
     ${PROJECT_JOINS}
     WHERE p.id = $1
     GROUP BY p.id, l.id, d.id
     LIMIT 1`,
    [id]
  );
  return rows[0] ? mapProject(rows[0]) : null;
}

export async function getProjectCategories(projectId: string): Promise<PropertyCategory[]> {
  const rows = await query<Row>(
    `SELECT c.id, c.slug, c.name_en, c.name_ar, c.description_en, c.description_ar,
            c.icon, ppc.sort_order
      FROM project_property_categories ppc
      JOIN property_categories c ON c.id = ppc.category_id
      WHERE ppc.project_id = $1 AND ppc.is_active AND c.is_active
      ORDER BY ppc.sort_order, c.sort_order`,
    [projectId]
  );
  return rows.map((row) => mapCategory({ ...row, sort_order: row.sort_order }));
}

export async function getProjectImages(projectId: string): Promise<ProjectImage[]> {
  const rows = await query<Row>(
    `SELECT id, url, alt_en, alt_ar, kind FROM project_images
      WHERE project_id = $1 ORDER BY sort_order`,
    [projectId]
  );
  return rows.map((row) => ({
    id: str(row.id),
    url: str(row.url),
    altEn: row.alt_en ? str(row.alt_en) : null,
    altAr: row.alt_ar ? str(row.alt_ar) : null,
    kind: str(row.kind),
  }));
}

export async function getProjectFacilities(projectId: string): Promise<Facility[]> {
  const rows = await query<Row>(
    `SELECT id, name_en, name_ar, icon FROM project_facilities
      WHERE project_id = $1 ORDER BY sort_order`,
    [projectId]
  );
  return rows.map((row) => ({
    id: str(row.id),
    nameEn: str(row.name_en),
    nameAr: row.name_ar ? str(row.name_ar) : null,
    icon: row.icon ? str(row.icon) : null,
  }));
}

export async function getProjectLandmarks(projectId: string): Promise<Landmark[]> {
  const rows = await query<Row>(
    `SELECT id, name_en, name_ar, distance, kind FROM project_landmarks
      WHERE project_id = $1 ORDER BY sort_order`,
    [projectId]
  );
  return rows.map((row) => ({
    id: str(row.id),
    nameEn: str(row.name_en),
    nameAr: row.name_ar ? str(row.name_ar) : null,
    distance: row.distance ? str(row.distance) : null,
    kind: str(row.kind),
  }));
}

export async function getProjectFacts(projectId: string): Promise<ProjectFact[]> {
  const rows = await query<Row>(
    `SELECT id, label_en, label_ar, value_en, value_ar FROM project_facts
      WHERE project_id = $1 ORDER BY sort_order`,
    [projectId]
  );
  return rows.map((row) => ({
    id: str(row.id),
    labelEn: str(row.label_en),
    labelAr: row.label_ar ? str(row.label_ar) : null,
    valueEn: str(row.value_en),
    valueAr: row.value_ar ? str(row.value_ar) : null,
  }));
}

export async function getPaymentPlans(projectId: string): Promise<PaymentPlan[]> {
  const rows = await query<Row>(
    `SELECT id, name_en, name_ar, down_payment_percent, installment_months,
            delivery_date, notes_en, notes_ar
      FROM payment_plans WHERE project_id = $1 ORDER BY sort_order`,
    [projectId]
  );
  return rows.map((row) => ({
    id: str(row.id),
    nameEn: str(row.name_en),
    nameAr: row.name_ar ? str(row.name_ar) : null,
    downPaymentPercent: num(row.down_payment_percent),
    installmentMonths: num(row.installment_months),
    deliveryDate: dateOnly(row.delivery_date),
    notesEn: row.notes_en ? str(row.notes_en) : null,
    notesAr: row.notes_ar ? str(row.notes_ar) : null,
  }));
}

const UNIT_SELECT = `
  u.id, u.slug, u.reference, u.project_id, u.category_id,
  COALESCE(u.title_en, '') AS title_en, COALESCE(u.title_ar, '') AS title_ar,
  u.description_en, u.description_ar,
  u.built_up_area, u.land_area, u.bedrooms, u.bathrooms, u.floor,
  u.garden_area, u.terrace_area, u.view_en, u.view_ar, u.finishing_en, u.finishing_ar,
  u.delivery_date, u.total_price, u.down_payment_amount, u.down_payment_percent,
  u.installment_months, u.installment_amount, u.installment_frequency, u.status,
  p.name_en AS project_name_en, p.name_ar AS project_name_ar, p.slug AS project_slug,
  p.location_id AS unit_location_id,
  c.name_en AS category_name_en, c.name_ar AS category_name_ar, c.slug AS category_slug
`;

const UNIT_JOINS = `
  FROM units u
  JOIN projects p ON p.id = u.project_id
  JOIN property_categories c ON c.id = u.category_id
`;

function mapUnit(row: Row): Unit {
  return {
    id: str(row.id),
    slug: str(row.slug),
    reference: row.reference ? str(row.reference) : null,
    projectId: str(row.project_id),
    categoryId: str(row.category_id),
    titleEn: str(row.title_en),
    titleAr: str(row.title_ar),
    descriptionEn: row.description_en ? str(row.description_en) : null,
    descriptionAr: row.description_ar ? str(row.description_ar) : null,
    builtUpArea: num(row.built_up_area),
    landArea: num(row.land_area),
    bedrooms: num(row.bedrooms),
    bathrooms: num(row.bathrooms),
    floor: row.floor ? str(row.floor) : null,
    gardenArea: num(row.garden_area),
    terraceArea: num(row.terrace_area),
    viewEn: row.view_en ? str(row.view_en) : null,
    viewAr: row.view_ar ? str(row.view_ar) : null,
    finishingEn: row.finishing_en ? str(row.finishing_en) : null,
    finishingAr: row.finishing_ar ? str(row.finishing_ar) : null,
    deliveryDate: dateOnly(row.delivery_date),
    totalPrice: num(row.total_price),
    downPaymentAmount: num(row.down_payment_amount),
    downPaymentPercent: num(row.down_payment_percent),
    installmentMonths: num(row.installment_months),
    installmentAmount: num(row.installment_amount),
    installmentFrequency: row.installment_frequency ? str(row.installment_frequency) : null,
    status: (str(row.status) || "available") as UnitStatus,
    projectNameEn: str(row.project_name_en),
    projectNameAr: str(row.project_name_ar),
    projectSlug: str(row.project_slug),
    categoryNameEn: str(row.category_name_en),
    categoryNameAr: str(row.category_name_ar),
    categorySlug: str(row.category_slug),
  };
}

function unitWhere(filters: UnitFilters, params: unknown[]): string {
  const clauses = ["u.is_active", "u.status <> 'archived'"];
  const push = (sql: string, value: unknown) => {
    params.push(value);
    return sql.replace("?", `$${params.length}`);
  };
  if (filters.q) {
    const value = `%${filters.q}%`;
    params.push(value);
    clauses.push(`(u.title_en ILIKE $${params.length} OR u.title_ar ILIKE $${params.length}
      OR u.reference ILIKE $${params.length} OR p.name_en ILIKE $${params.length}
      OR p.name_ar ILIKE $${params.length})`);
  }
  if (filters.locationIds) {
    // An explicitly empty set means "no locations", not "all locations".
    params.push(filters.locationIds);
    clauses.push(`p.location_id = ANY($${params.length}::text[])`);
  } else if (filters.location) {
    params.push([filters.location]);
    clauses.push(`p.location_id = ANY($${params.length}::text[])`);
  }
  if (filters.project) {
    params.push(filters.project);
    clauses.push(`p.slug = $${params.length}`);
  }
  if (filters.category === "residential") {
    params.push(RESIDENTIAL_CATEGORY_SLUGS);
    clauses.push(`c.slug = ANY($${params.length}::text[])`);
  } else if (filters.category) {
    params.push(filters.category);
    clauses.push(`c.slug = $${params.length}`);
  }
  if (typeof filters.bedrooms === "number") clauses.push(push("u.bedrooms = ?", filters.bedrooms));
  if (typeof filters.minPrice === "number") clauses.push(push("u.total_price >= ?", filters.minPrice));
  if (typeof filters.maxPrice === "number") clauses.push(push("u.total_price <= ?", filters.maxPrice));
  if (typeof filters.minArea === "number") clauses.push(push("u.built_up_area >= ?", filters.minArea));
  if (typeof filters.maxArea === "number") clauses.push(push("u.built_up_area <= ?", filters.maxArea));
  if (filters.status) clauses.push(push("u.status = ?", filters.status));
  return clauses.join(" AND ");
}

const UNIT_SORT: Record<NonNullable<UnitFilters["sort"]>, string> = {
  price_asc: "u.total_price ASC NULLS LAST",
  price_desc: "u.total_price DESC NULLS LAST",
  area_desc: "u.built_up_area DESC NULLS LAST",
  newest: "u.created_at DESC",
};

export async function listUnits(
  filters: UnitFilters = {}
): Promise<{ items: Unit[]; total: number; page: number; pageSize: number }> {
  const params: unknown[] = [];
  const where = unitWhere(filters, params);
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.min(1000, Math.max(1, filters.pageSize ?? 12));
  params.push(pageSize, (page - 1) * pageSize);
  const rows = await query<Row>(
    `SELECT ${UNIT_SELECT}, COUNT(*) OVER()::int AS total
     ${UNIT_JOINS}
     WHERE ${where}
     ORDER BY ${UNIT_SORT[filters.sort ?? "newest"]}, u.slug
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );
  return {
    items: rows.map(mapUnit),
    total: num(rows[0]?.total) ?? 0,
    page,
    pageSize,
  };
}

/** Public unit URLs for the sitemap. */
export async function listUnitSitemapEntries(): Promise<{ slug: string; updatedAt: string }[]> {
  const rows = await query<Row>(
    `SELECT slug, updated_at FROM units
      WHERE is_active AND status <> 'archived'
      ORDER BY slug`
  );
  return rows.map((row) => ({
    slug: str(row.slug),
    updatedAt: new Date(row.updated_at as string | Date).toISOString(),
  }));
}

export async function getUnitBySlug(slug: string): Promise<Unit | null> {
  const rows = await query<Row>(
    `SELECT ${UNIT_SELECT} ${UNIT_JOINS} WHERE u.slug = $1 AND u.is_active LIMIT 1`,
    [slug]
  );
  return rows[0] ? mapUnit(rows[0]) : null;
}

export async function getUnitById(id: string): Promise<Unit | null> {
  const rows = await query<Row>(
    `SELECT ${UNIT_SELECT} ${UNIT_JOINS} WHERE u.id = $1 AND u.is_active LIMIT 1`,
    [id]
  );
  return rows[0] ? mapUnit(rows[0]) : null;
}

export async function getUnitImages(unitId: string): Promise<UnitImage[]> {
  const rows = await query<Row>(
    `SELECT id, url, alt_en, alt_ar, kind FROM unit_images
      WHERE unit_id = $1 ORDER BY sort_order`,
    [unitId]
  );
  return rows.map((row) => ({
    id: str(row.id),
    url: str(row.url),
    altEn: row.alt_en ? str(row.alt_en) : null,
    altAr: row.alt_ar ? str(row.alt_ar) : null,
    kind: str(row.kind),
  }));
}

export async function getCatalogCounts(): Promise<{
  locations: number;
  projects: number;
  categories: number;
  units: number;
}> {
  const rows = await query<Row>(
    `SELECT
      (SELECT count(*)::int FROM locations WHERE is_active AND archived_at IS NULL) AS locations,
      (SELECT count(*)::int FROM projects WHERE is_active AND archived_at IS NULL) AS projects,
      (SELECT count(*)::int FROM property_categories WHERE is_active AND archived_at IS NULL) AS categories,
      (SELECT count(*)::int FROM units WHERE is_active) AS units`
  );
  return {
    locations: num(rows[0]?.locations) ?? 0,
    projects: num(rows[0]?.projects) ?? 0,
    categories: num(rows[0]?.categories) ?? 0,
    units: num(rows[0]?.units) ?? 0,
  };
}

/** Pairs of id/slug used by lead forms, CRM selects and sitemaps. */
export async function getCatalogOptions(): Promise<{
  locations: Location[];
  developers: Developer[];
  projects: Project[];
  categories: PropertyCategory[];
}> {
  const [locations, developers, projects, categories] = await Promise.all([
    listLocations(),
    listDevelopers(),
    listProjects({ pageSize: 1000, sort: "name" }),
    listCategories(),
  ]);
  return { locations, developers, projects: projects.items, categories };
}
