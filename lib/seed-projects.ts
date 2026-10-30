import { projects } from "@/data/projects";
import type { TxClient } from "./db";

/**
 * Seeds the `projects` table from `data/projects.ts`.
 *
 * Kept separate from the full `db:seed` so production can refresh the project
 * catalogue without touching content, properties or leads:
 *   npm run db:seed:projects
 *
 * The catalogue is generated data, so it is rebuilt wholesale: rows that no
 * longer exist in `data/projects.ts` are removed.
 */

const PROJECT_COLUMNS = [
  "slug", "name", "name_ar", "region", "location", "category", "status",
  "tagline", "tagline_ar", "description", "description_ar", "price_from",
  "payment_plan", "payment_plan_ar", "finishing", "unit_types", "amenities",
  "location_notes", "hero_image", "brochure", "masterplan", "position",
] as const;

const json = (value: unknown) => JSON.stringify(value);

export async function seedProjects(client: TxClient): Promise<number> {
  await client.query("DELETE FROM projects");

  for (const project of projects) {
    const values = [
      project.slug,
      project.name,
      project.nameAr || null,
      project.region,
      project.location,
      project.category,
      project.status,
      project.tagline || null,
      project.taglineAr || null,
      project.description,
      project.descriptionAr || null,
      project.priceFrom,
      project.paymentPlan,
      project.paymentPlanAr,
      project.finishing,
      json(project.unitTypes),
      json(project.amenities),
      json(project.locationNotes),
      project.heroImage,
      project.brochure,
      project.masterplan,
      project.position,
    ];
    const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");

    await client.query(
      `INSERT INTO projects (${PROJECT_COLUMNS.join(", ")})
       VALUES (${placeholders})`,
      values
    );
  }

  return projects.length;
}
