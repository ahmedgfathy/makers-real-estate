import {
  SEED_CATEGORIES,
  SEED_DEVELOPERS,
  SEED_FACTS,
  SEED_LANDMARKS,
  SEED_LOCATIONS,
  SEED_PROJECTS,
  SEED_UNITS,
} from "../data/catalog-seed";
import { PROJECT_DETAILS } from "../data/portfolio";
import type { TxClient } from "./db";

/** Seeds the canonical catalogue once. Existing ids are never overwritten. */
export async function seedCatalog(client: TxClient): Promise<void> {
  for (const location of SEED_LOCATIONS) {
    await client.query(
      `INSERT INTO locations
         (id, slug, parent_id, type, name_en, name_ar, description_en, description_ar,
          image_url, sort_order, is_directory)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (id) DO NOTHING`,
      [
        location.id,
        location.slug,
        location.parentId,
        location.type,
        location.nameEn,
        location.nameAr,
        location.descriptionEn,
        location.descriptionAr,
        location.imageUrl,
        location.sortOrder,
        location.isDirectory,
      ]
    );
  }

  for (const developer of SEED_DEVELOPERS) {
    await client.query(
      `INSERT INTO developers (id, slug, name_en, name_ar, description_en, description_ar)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (id) DO NOTHING`,
      [developer.id, developer.slug, developer.nameEn, developer.nameAr, developer.descriptionEn, developer.descriptionAr]
    );
  }

  for (const category of SEED_CATEGORIES) {
    await client.query(
      `INSERT INTO property_categories
         (id, slug, name_en, name_ar, sort_order, attribute_schema)
       VALUES ($1, $2, $3, $4, $5, $6::jsonb)
       ON CONFLICT (id) DO NOTHING`,
      [category.id, category.slug, category.nameEn, category.nameAr, category.sortOrder, JSON.stringify(category.attributes)]
    );
  }

  for (const project of SEED_PROJECTS) {
    await client.query(
      `INSERT INTO projects
         (id, slug, developer_id, location_id, name_en, name_ar, description_en, description_ar,
          status, cover_image, masterplan_image, delivery_date, starting_price,
          down_payment_percent, installment_months, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
       ON CONFLICT (id) DO NOTHING`,
      [
        project.id,
        project.slug,
        project.developerId,
        project.locationId,
        project.nameEn,
        project.nameAr,
        project.descriptionEn,
        project.descriptionAr,
        project.status,
        project.coverImage,
        project.masterplanImage,
        project.deliveryDate,
        project.startingPrice,
        project.downPaymentPercent,
        project.installmentMonths,
        project.sortOrder,
      ]
    );

    for (const link of project.categories) {
      await client.query(
        `INSERT INTO project_property_categories (project_id, category_id, sort_order)
         VALUES ($1, $2, $3)
         ON CONFLICT (project_id, category_id) DO NOTHING`,
        [project.id, link.categoryId, link.sortOrder]
      );
    }

    const detail = PROJECT_DETAILS[project.slug];
    if (!detail) continue;

    for (const [index, url] of detail.gallery.entries()) {
      await client.query(
        `INSERT INTO project_images (id, project_id, url, alt_en, alt_ar, kind, sort_order)
         VALUES ($1, $2, $3, $4, $5, 'gallery', $6)
         ON CONFLICT (id) DO NOTHING`,
        [
          `${project.id}-img-${index + 1}`,
          project.id,
          url,
          detail.galleryAlt?.en ?? detail.coverCaption?.en ?? project.nameEn,
          detail.galleryAlt?.ar ?? detail.coverCaption?.ar ?? project.nameAr,
          index,
        ]
      );
    }

    for (const [index, name] of detail.highlights.en.entries()) {
      await client.query(
        `INSERT INTO project_facilities (id, project_id, name_en, name_ar, sort_order)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO NOTHING`,
        [`${project.id}-fac-${index + 1}`, project.id, name, detail.highlights.ar[index] ?? name, index]
      );
    }

    await client.query(
      `INSERT INTO payment_plans
         (id, project_id, name_en, name_ar, down_payment_percent, installment_months,
          delivery_date, notes_en, notes_ar, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 0)
       ON CONFLICT (id) DO NOTHING`,
      [
        `${project.id}-plan-default`,
        project.id,
        "Developer payment plan",
        "خطة سداد المطور",
        project.downPaymentPercent,
        project.installmentMonths,
        project.deliveryDate,
        detail.plan.note.en,
        detail.plan.note.ar,
      ]
    );
  }

  for (const fact of SEED_FACTS) {
    await client.query(
      `INSERT INTO project_facts (id, project_id, label_en, label_ar, value_en, value_ar, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO NOTHING`,
      [fact.id, fact.projectId, fact.labelEn, fact.labelAr, fact.valueEn, fact.valueAr, fact.sortOrder]
    );
  }

  for (const landmark of SEED_LANDMARKS) {
    await client.query(
      `INSERT INTO project_landmarks (id, project_id, name_en, name_ar, distance, kind, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO NOTHING`,
      [landmark.id, landmark.projectId, landmark.nameEn, landmark.nameAr, landmark.distance, landmark.kind, landmark.sortOrder]
    );
  }

  for (const unit of SEED_UNITS) {
    await client.query(
      `INSERT INTO units
         (id, slug, project_id, category_id, reference, title_en, title_ar,
          built_up_area, land_area, terrace_area, bedrooms, total_price, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       ON CONFLICT (id) DO NOTHING`,
      [
        unit.id,
        unit.slug,
        unit.projectId,
        unit.categoryId,
        unit.reference,
        unit.titleEn,
        unit.titleAr,
        unit.builtUpArea,
        unit.landArea,
        unit.terraceArea,
        unit.bedrooms,
        unit.totalPrice,
        unit.status,
      ]
    );
  }
}
