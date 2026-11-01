import { query } from "./db";

export type Developer = {
  slug: string;
  name: string;
  name_ar: string | null;
  description: string | null;
  description_ar: string | null;
  established: number | null;
  website: string | null;
  published: boolean;
  published_at: Date | null;
  created_at: Date;
  updated_at: Date;
};

export type DeveloperInput = Pick<Developer, "name"> &
  Partial<Pick<Developer, "name_ar" | "description" | "description_ar" | "established" | "website">>;

const DEVELOPER_COLUMNS = `slug, name, name_ar, description, description_ar, established,
  website, published, published_at, created_at, updated_at`;

export async function listDevelopers(): Promise<Developer[]> {
  return query<Developer>(
    `SELECT ${DEVELOPER_COLUMNS} FROM developers ORDER BY name`
  );
}

export async function getDeveloper(slug: string): Promise<Developer | null> {
  const rows = await query<Developer>(
    `SELECT ${DEVELOPER_COLUMNS} FROM developers WHERE slug = $1`,
    [slug]
  );
  return rows[0] ?? null;
}

export async function createDeveloper(slug: string, input: DeveloperInput): Promise<void> {
  await query(
    `INSERT INTO developers (slug, name, name_ar, description, description_ar, established, website)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [slug, input.name, nullable(input.name_ar), nullable(input.description), nullable(input.description_ar), input.established ?? null, nullable(input.website)]
  );
}

export async function updateDeveloper(slug: string, input: DeveloperInput): Promise<void> {
  await query(
    `UPDATE developers
        SET name = $2, name_ar = $3, description = $4, description_ar = $5,
            established = $6, website = $7, updated_at = now()
      WHERE slug = $1`,
    [slug, input.name, nullable(input.name_ar), nullable(input.description), nullable(input.description_ar), input.established ?? null, nullable(input.website)]
  );
}

export async function setDeveloperPublished(slug: string, published: boolean): Promise<void> {
  await query(
    `UPDATE developers
        SET published = $2,
            published_at = CASE WHEN $2 THEN COALESCE(published_at, now()) ELSE NULL END,
            updated_at = now()
      WHERE slug = $1`,
    [slug, published]
  );
}

function nullable(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}
