import { query } from "./db";
import {
  CATEGORIES,
  REGIONS,
  STATUSES,
  projects as seedProjects,
  type ProjectCategory,
  type ProjectRegion,
  type ProjectStatus,
  type ProjectUnit,
} from "@/data/projects";

/**
 * SODIC project catalogue.
 *
 * PostgreSQL (`projects`, see db/schema.sql) is the source of truth and is
 * seeded from `data/projects.ts` by `npm run db:seed`. The static seed is kept
 * as a fallback so the CRM still renders if the database is unreachable.
 */

export { CATEGORIES, REGIONS, STATUSES };
export type { ProjectCategory, ProjectRegion, ProjectStatus, ProjectUnit };

export type Project = {
  slug: string;
  developerSlug: string;
  developerName: string;
  developerPublished: boolean;
  name: string;
  nameAr: string;
  region: ProjectRegion;
  location: string;
  category: ProjectCategory;
  status: ProjectStatus;
  tagline: string;
  taglineAr: string;
  description: string;
  descriptionAr: string;
  priceFrom: number | null;
  paymentPlan: string | null;
  paymentPlanAr: string | null;
  finishing: string | null;
  unitTypes: ProjectUnit[];
  amenities: string[];
  locationNotes: string[];
  heroImage: string | null;
  brochure: string | null;
  masterplan: string | null;
  position: number;
  published: boolean;
};

type ProjectRow = {
  slug: string;
  developer_slug: string;
  developer_name: string;
  developer_published: boolean;
  name: string;
  name_ar: string | null;
  region: string;
  location: string;
  category: string;
  status: string;
  tagline: string | null;
  tagline_ar: string | null;
  description: string;
  description_ar: string | null;
  price_from: string | number | null;
  payment_plan: string | null;
  payment_plan_ar: string | null;
  finishing: string | null;
  unit_types: ProjectUnit[];
  amenities: string[];
  location_notes: string[];
  hero_image: string | null;
  brochure: string | null;
  masterplan: string | null;
  position: number;
  published: boolean;
};

const isRegion = (value: string): value is ProjectRegion =>
  Object.prototype.hasOwnProperty.call(REGIONS, value);
const isCategory = (value: string): value is ProjectCategory =>
  Object.prototype.hasOwnProperty.call(CATEGORIES, value);
const isStatus = (value: string): value is ProjectStatus =>
  Object.prototype.hasOwnProperty.call(STATUSES, value);

function mapRow(row: ProjectRow): Project {
  if (!isRegion(row.region)) throw new Error(`unknown project region "${row.region}"`);
  if (!isCategory(row.category)) throw new Error(`unknown project category "${row.category}"`);
  if (!isStatus(row.status)) throw new Error(`unknown project status "${row.status}"`);

  return {
    slug: row.slug,
    developerSlug: row.developer_slug,
    developerName: row.developer_name,
    developerPublished: row.developer_published,
    name: row.name,
    nameAr: row.name_ar ?? row.name,
    region: row.region,
    location: row.location,
    category: row.category,
    status: row.status,
    tagline: row.tagline ?? "",
    taglineAr: row.tagline_ar ?? row.tagline ?? "",
    description: row.description,
    descriptionAr: row.description_ar ?? row.description,
    priceFrom: row.price_from == null ? null : Number(row.price_from),
    paymentPlan: row.payment_plan,
    paymentPlanAr: row.payment_plan_ar ?? row.payment_plan,
    finishing: row.finishing,
    unitTypes: row.unit_types ?? [],
    amenities: row.amenities ?? [],
    locationNotes: row.location_notes ?? [],
    heroImage: row.hero_image,
    brochure: row.brochure,
    masterplan: row.masterplan,
    position: row.position,
    published: row.published,
  };
}

/** Static copy of the seed, used when PostgreSQL is unavailable. */
function staticProjects(): Project[] {
  return seedProjects.map((project) => ({
    ...project,
    developerSlug: "sodic",
    developerName: "SODIC",
    developerPublished: false,
    nameAr: project.nameAr || project.name,
    taglineAr: project.taglineAr || project.tagline,
    descriptionAr: project.descriptionAr || project.description,
    paymentPlanAr: project.paymentPlanAr ?? project.paymentPlan,
    published: project.published ?? false,
  }));
}

export type ProjectFilters = {
  q?: string;
  region?: string;
  category?: string;
  status?: string;
  limit?: number;
  /** Only projects switched on for the public website. */
  publishedOnly?: boolean;
  developerSlug?: string;
};

export type ProjectInput = {
  developerSlug: string;
  name: string;
  nameAr?: string | null;
  region: ProjectRegion;
  location: string;
  category: ProjectCategory;
  status: ProjectStatus;
  tagline?: string | null;
  taglineAr?: string | null;
  description: string;
  descriptionAr?: string | null;
  priceFrom?: number | null;
  paymentPlan?: string | null;
  paymentPlanAr?: string | null;
  finishing?: string | null;
  heroImage?: string | null;
};

const PROJECT_SELECT = `p.slug, p.developer_slug, d.name AS developer_name,
  d.published AS developer_published, p.name, p.name_ar, p.region, p.location,
  p.category, p.status, p.tagline, p.tagline_ar, p.description, p.description_ar,
  p.price_from, p.payment_plan, p.payment_plan_ar, p.finishing, p.unit_types,
  p.amenities, p.location_notes, p.hero_image, p.brochure, p.masterplan,
  p.position, p.published`;

/** All projects, optionally filtered. Served from PostgreSQL with a static fallback. */
export async function listProjects(filters: ProjectFilters = {}): Promise<Project[]> {
  let projects: Project[];

  try {
    const rows = await query<ProjectRow>(
      `SELECT ${PROJECT_SELECT}
         FROM projects p JOIN developers d ON d.slug = p.developer_slug
        ORDER BY d.name, p.position, p.name`
    );
    if (rows.length === 0) throw new Error("projects table is empty — run `npm run db:seed`");
    projects = rows.map(mapRow);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`[projects] PostgreSQL unavailable, serving static fallback — ${message}`);
    projects = staticProjects().sort((a, b) => a.position - b.position);
  }

  const q = filters.q?.trim().toLowerCase();
  const filtered = projects.filter((project) => {
    if (filters.region && project.region !== filters.region) return false;
    if (filters.category && project.category !== filters.category) return false;
    if (filters.status && project.status !== filters.status) return false;
    if (filters.developerSlug && project.developerSlug !== filters.developerSlug) return false;
    if (filters.publishedOnly && (!project.published || !project.developerPublished)) return false;
    if (!q) return true;
    return [
      project.name,
      project.nameAr,
      project.location,
      project.tagline,
      project.description,
      ...project.unitTypes.map((unit) => unit.name),
      ...project.amenities,
    ]
      .join(" ")
      .toLowerCase()
      .includes(q);
  });

  return filters.limit ? filtered.slice(0, filters.limit) : filtered;
}

export async function getProject(slug: string): Promise<Project | null> {
  try {
    const rows = await query<ProjectRow>(
      `SELECT ${PROJECT_SELECT}
         FROM projects p JOIN developers d ON d.slug = p.developer_slug
        WHERE p.slug = $1`,
      [slug]
    );
    if (rows.length === 0) return null;
    return mapRow(rows[0]);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`[projects] PostgreSQL unavailable, serving static fallback — ${message}`);
    return staticProjects().find((project) => project.slug === slug) ?? null;
  }
}

/** Flips the public website switch. Only admin sessions may call this. */
export async function setProjectPublished(slug: string, published: boolean): Promise<void> {
  await query(
    `UPDATE projects
        SET published = $2,
            published_at = CASE WHEN $2 THEN COALESCE(published_at, now()) ELSE NULL END,
            updated_at = now()
      WHERE slug = $1`,
    [slug, published]
  );
}

export async function createProject(slug: string, input: ProjectInput): Promise<void> {
  await query(
    `INSERT INTO projects (
       slug, name, name_ar, developer_slug, region, location, category, status,
       tagline, tagline_ar, description, description_ar, price_from, payment_plan,
       payment_plan_ar, finishing, hero_image, position
     ) VALUES (
       $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17,
       COALESCE((SELECT max(position) + 1 FROM projects WHERE developer_slug = $4), 0)
     )`,
    [slug, input.name, nullable(input.nameAr), input.developerSlug, input.region, input.location,
      input.category, input.status, nullable(input.tagline), nullable(input.taglineAr), input.description,
      nullable(input.descriptionAr), input.priceFrom ?? null, nullable(input.paymentPlan),
      nullable(input.paymentPlanAr), nullable(input.finishing), nullable(input.heroImage)]
  );
}

export async function updateProject(slug: string, input: ProjectInput): Promise<void> {
  await query(
    `UPDATE projects
        SET developer_slug = $2, name = $3, name_ar = $4, region = $5, location = $6,
            category = $7, status = $8, tagline = $9, tagline_ar = $10,
            description = $11, description_ar = $12, price_from = $13,
            payment_plan = $14, payment_plan_ar = $15, finishing = $16,
            hero_image = $17, updated_at = now()
      WHERE slug = $1`,
    [slug, input.developerSlug, input.name, nullable(input.nameAr), input.region, input.location,
      input.category, input.status, nullable(input.tagline), nullable(input.taglineAr), input.description,
      nullable(input.descriptionAr), input.priceFrom ?? null, nullable(input.paymentPlan),
      nullable(input.paymentPlanAr), nullable(input.finishing), nullable(input.heroImage)]
  );
}

/** A project the public website may show, or null. */
export async function getPublishedProject(slug: string): Promise<Project | null> {
  const project = await getProject(slug);
  return project?.published && project.developerPublished ? project : null;
}

export type ProjectStats = {
  total: number;
  regions: number;
  selling: number;
  published: number;
  unitTypes: number;
  priceFrom: number | null;
};

export async function getProjectStats(): Promise<ProjectStats> {
  const projects = await listProjects();
  const prices = projects
    .map((project) => project.priceFrom)
    .filter((price): price is number => typeof price === "number" && price > 0);

  return {
    total: projects.length,
    regions: new Set(projects.map((project) => project.region)).size,
    selling: projects.filter(
      (project) => project.status === "selling" || project.status === "launching"
    ).length,
    published: projects.filter((project) => project.published).length,
    unitTypes: projects.reduce((sum, project) => sum + project.unitTypes.length, 0),
    priceFrom: prices.length ? Math.min(...prices) : null,
  };
}

function nullable(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}
