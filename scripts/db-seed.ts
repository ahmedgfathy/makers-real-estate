import { contact, content, type Lang, type Section, type TileId } from "../data/content";
import { projects } from "../data/projects";
import { getPool, withTransaction, type TxClient } from "../lib/db";

/**
 * Seeds PostgreSQL from data/content.ts — the original single source of truth.
 *   npm run db:seed
 *
 * Writes both locales, replaces tiles/panels/sections wholesale, and upserts
 * the contact settings row. Runs in one transaction.
 */

const LANGS: Lang[] = ["en", "ar"];
const json = (v: unknown) => JSON.stringify(v);

async function seedLocale(client: TxClient, lang: Lang) {
  const c = content[lang];

  await client.query(
    `INSERT INTO site_content (lang, meta, brand, nav, hero, grid, panel, footer)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT (lang) DO UPDATE SET
       meta = EXCLUDED.meta, brand = EXCLUDED.brand, nav = EXCLUDED.nav,
       hero = EXCLUDED.hero, grid = EXCLUDED.grid, panel = EXCLUDED.panel,
       footer = EXCLUDED.footer, updated_at = now()`,
    [lang, json(c.meta), json(c.brand), json(c.nav), json(c.hero), json(c.grid), json(c.panel), json(c.footer)]
  );

  // Tiles cascade-delete panels and their sections — rebuild them in order.
  await client.query("DELETE FROM tiles WHERE lang = $1", [lang]);

  for (let i = 0; i < c.tiles.length; i++) {
    const t = c.tiles[i];
    await client.query(
      `INSERT INTO tiles (lang, id, position, idx, kicker, title, meta, image)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [lang, t.id, i, t.index, t.kicker, t.title, t.meta, t.image]
    );

    const panel = c.panels[t.id as TileId];
    if (!panel) throw new Error(`missing panel for tile "${t.id}" in "${lang}"`);

    await client.query(
      `INSERT INTO panels (lang, tile_id, position, kicker, title, lede, image, cta)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [lang, t.id, i, panel.kicker, panel.title, panel.lede, panel.image, panel.cta]
    );

    for (let s = 0; s < panel.sections.length; s++) {
      const section = panel.sections[s] as Section;
      const { kind, ...payload } = section;
      await client.query(
        `INSERT INTO panel_sections (lang, tile_id, position, kind, payload)
         VALUES ($1, $2, $3, $4, $5)`,
        [lang, t.id, s, kind, json(payload)]
      );
    }
  }

  console.log(`[seed] ${lang}: ${c.tiles.length} tiles, ${c.panels && Object.keys(c.panels).length} panels`);
}

/* ------------------------------------------------------------------ */
/* Property inventory                                                   */
/* ------------------------------------------------------------------ */

type SeedProperty = {
  code: string;
  title: string;
  project: string;
  phase: string | null;
  property_type: string;
  listing_type: string;
  status: string;
  bedrooms: number | null;
  bathrooms: number | null;
  built_up_area: number | null;
  garden_area: number | null;
  roof_area: number | null;
  floor: string | null;
  finishing: string | null;
  view: string | null;
  currency: string;
  price: number;
  down_payment: number;
  installment_years: number;
  monthly_installment: number;
  delivery: string | null;
  description: string | null;
  amenities: string[];
  images: string[];
  video: string | null;
  featured: boolean;
};

const PROPERTY_COLUMNS = [
  "code", "title", "project", "phase", "property_type", "listing_type", "status",
  "bedrooms", "bathrooms", "built_up_area", "garden_area", "roof_area", "floor",
  "finishing", "view", "currency", "price", "down_payment", "installment_years",
  "monthly_installment", "delivery", "description", "amenities", "images", "video",
  "featured",
] as const;

const ORDINALS: Record<number, string> = { 1: "1st", 2: "2nd", 3: "3rd", 4: "4th", 5: "5th" };

const APARTMENT_IMAGES = ["/img/lakes-building.jpg", "/img/lakes-pool.jpg", "/img/lakes-garden.jpg"];
const GARDEN_IMAGES = ["/img/lakes-garden.jpg", "/img/lakes-walk.jpg", "/img/lakes-building.jpg"];
const LARGE_IMAGES = ["/img/lakes-walk.jpg", "/img/lakes-sunset.jpg", "/img/lakes-beach.jpg"];
const VILLA_IMAGES = ["/img/lakes-sunset.jpg", "/img/lakes-walk.jpg", "/img/lakes-beach.jpg", "/img/lakes-pool.jpg"];
const COMMON_AMENITIES = [
  "Swimmable central lagoon",
  "SODIC Sports Club",
  "International school",
  "Green spine & cycling lanes",
];

const monthly = (price: number, years = 10) => Math.round(price / (years * 12));

function buildProperties(): SeedProperty[] {
  const properties: SeedProperty[] = [];
  const featuredUnits = new Set(["B20-31", "B20-03", "B23-51", "B20-43"]);

  for (const section of content.en.panels.phase08m.sections) {
    if (section.kind !== "units") continue;

    const heading = section.title ?? "";
    const bedrooms = Number(heading.match(/\d+/)?.[0] ?? 2);
    const nanny = /nanny/i.test(heading);
    const layout = heading.includes("·") ? heading.split("·")[1].trim() : "Phase 08M";
    const featured = section.rows.some((row) => featuredUnits.has(row.code));

    for (const unit of section.rows) {
      const floor = unit.garden != null
        ? "Ground + garden"
        : unit.floor
          ? ORDINALS[unit.floor]
          : "Ground";
      const extras = [
        unit.garden != null ? `${unit.garden} m² private garden` : null,
        unit.roof != null ? `${unit.roof} m² roof terrace` : null,
      ].filter(Boolean).join(" and ");

      properties.push({
        code: unit.code,
        title: `${bedrooms}-bedroom apartment${nanny ? " + nanny" : ""} · ${layout}`,
        project: "SODIC East",
        phase: "Phase 08M",
        property_type: "apartment",
        listing_type: "sale",
        status: "available",
        bedrooms,
        bathrooms: Math.max(1, Math.min(bedrooms, 3)),
        built_up_area: unit.area,
        garden_area: unit.garden ?? null,
        roof_area: unit.roof ?? null,
        floor,
        finishing: "Fully finished",
        view: "Water garden",
        currency: "EGP",
        price: unit.price,
        down_payment: 0,
        installment_years: 10,
        monthly_installment: monthly(unit.price),
        delivery: "December 2026",
        description:
          `Fully finished ${bedrooms}-bedroom${nanny ? " + nanny" : ""} apartment in Phase 08M, ` +
          `${floor.toLowerCase()}${extras ? `, with ${extras}` : ""}. Delivery December 2026.`,
        amenities: COMMON_AMENITIES,
        images: unit.garden != null ? GARDEN_IMAGES : bedrooms >= 3 ? LARGE_IMAGES : APARTMENT_IMAGES,
        video: featuredUnits.has(unit.code) ? "/video/hero.mp4" : null,
        featured: featuredUnits.has(unit.code),
      });
    }
  }

  // Headline inventory taken from the Collection / Payment panels.
  properties.push(
    {
      code: "SE2-APT-141",
      title: "2-bedroom apartment · SODIC East 2",
      project: "SODIC East",
      phase: "SODIC East 2",
      property_type: "apartment",
      listing_type: "sale",
      status: "available",
      bedrooms: 2,
      bathrooms: 2,
      built_up_area: 141,
      garden_area: null,
      roof_area: null,
      floor: "Upper floor",
      finishing: "Finished",
      view: "Community landscape",
      currency: "EGP",
      price: 14348000,
      down_payment: 0,
      installment_years: 10,
      monthly_installment: monthly(14348000),
      delivery: "30 Dec 2026",
      description: "Finished two-bedroom apartment in SODIC East 2, delivered 30 December 2026.",
      amenities: COMMON_AMENITIES,
      images: APARTMENT_IMAGES,
      video: "/video/hero.mp4",
      featured: true,
    },
    {
      code: "SE2-TH-208",
      title: "3-bedroom townhouse · SODIC East 2",
      project: "SODIC East",
      phase: "SODIC East 2",
      property_type: "townhouse",
      listing_type: "sale",
      status: "available",
      bedrooms: 3,
      bathrooms: 3,
      built_up_area: 208,
      garden_area: 60,
      roof_area: null,
      floor: "Ground + garden",
      finishing: "Finished",
      view: "Green spine",
      currency: "EGP",
      price: 29172000,
      down_payment: 0,
      installment_years: 10,
      monthly_installment: monthly(29172000),
      delivery: "31 Dec 2029",
      description: "Finished three-bedroom townhouse with a private garden in SODIC East 2.",
      amenities: [...COMMON_AMENITIES, "Private garden"],
      images: VILLA_IMAGES.slice(0, 3),
      video: "/video/hero.mp4",
      featured: true,
    },
    {
      code: "SE2-VL-300",
      title: "4-bedroom villa · SODIC East 2",
      project: "SODIC East",
      phase: "SODIC East 2",
      property_type: "villa",
      listing_type: "sale",
      status: "available",
      bedrooms: 4,
      bathrooms: 4,
      built_up_area: 300,
      garden_area: 120,
      roof_area: null,
      floor: "Standalone",
      finishing: "Finished",
      view: "Green spine",
      currency: "EGP",
      price: 52103000,
      down_payment: 0,
      installment_years: 10,
      monthly_installment: monthly(52103000),
      delivery: "31 Dec 2029",
      description: "Detached four-bedroom villa with private garden in SODIC East 2.",
      amenities: [...COMMON_AMENITIES, "Private garden", "Private parking"],
      images: VILLA_IMAGES,
      video: "/video/hero.mp4",
      featured: true,
    },
    {
      code: "TL-1B-076",
      title: "1-bedroom apartment · The Lakes",
      project: "The Lakes",
      phase: "The Lakes",
      property_type: "apartment",
      listing_type: "sale",
      status: "available",
      bedrooms: 1,
      bathrooms: 1,
      built_up_area: 76,
      garden_area: null,
      roof_area: null,
      floor: "Upper floor",
      finishing: "Flexi Plus",
      view: "Lagoon",
      currency: "EGP",
      price: 6700000,
      down_payment: 0,
      installment_years: 10,
      monthly_installment: monthly(6700000),
      delivery: "December 2026",
      description: "One-bedroom apartment in The Lakes, starting from EGP 6.7M with 0% down.",
      amenities: COMMON_AMENITIES,
      images: ["/img/lakes-pool.jpg", "/img/lakes-building.jpg", "/img/lakes-garden.jpg"],
      video: "/video/hero.mp4",
      featured: true,
    },
    {
      code: "TL-3D-200",
      title: "3-bedroom duplex · The Lakes",
      project: "The Lakes",
      phase: "The Lakes",
      property_type: "duplex",
      listing_type: "sale",
      status: "available",
      bedrooms: 3,
      bathrooms: 3,
      built_up_area: 200,
      garden_area: 35,
      roof_area: null,
      floor: "Ground + garden",
      finishing: "Flexi Plus",
      view: "Lagoon",
      currency: "EGP",
      price: 17700000,
      down_payment: 0,
      installment_years: 10,
      monthly_installment: monthly(17700000),
      delivery: "December 2026",
      description: "Three-bedroom duplex with a private garden in The Lakes.",
      amenities: [...COMMON_AMENITIES, "Private garden", "Waterfront decks"],
      images: VILLA_IMAGES.slice(0, 3),
      video: "/video/hero.mp4",
      featured: false,
    },
  );

  return properties;
}

async function seedProperties(client: TxClient) {
  const properties = buildProperties();

  for (const p of properties) {
    const values = [
      p.code, p.title, p.project, p.phase, p.property_type, p.listing_type, p.status,
      p.bedrooms, p.bathrooms, p.built_up_area, p.garden_area, p.roof_area, p.floor,
      p.finishing, p.view, p.currency, p.price, p.down_payment, p.installment_years,
      p.monthly_installment, p.delivery, p.description, json(p.amenities), json(p.images),
      p.video, p.featured,
    ];
    const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");

    await client.query(
      `INSERT INTO properties (${PROPERTY_COLUMNS.join(", ")})
       VALUES (${placeholders})
       ON CONFLICT (code) DO NOTHING`,
      values
    );
  }

  console.log(`[seed] properties: ${properties.length} records available`);
}

/* ------------------------------------------------------------------ */
/* SODIC project catalogue                                             */
/* ------------------------------------------------------------------ */

const PROJECT_COLUMNS = [
  "slug", "name", "name_ar", "region", "location", "category", "status",
  "tagline", "tagline_ar", "description", "description_ar", "price_from",
  "payment_plan", "payment_plan_ar", "finishing", "unit_types", "amenities",
  "location_notes", "hero_image", "brochure", "masterplan", "position",
] as const;

async function seedProjects(client: TxClient) {
  // The catalogue in data/projects.ts is authoritative: rebuild it wholesale so
  // removed projects do not linger in the CRM.
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

  console.log(`[seed] projects: ${projects.length} SODIC developments`);
}

/* ------------------------------------------------------------------ */
/* Leads — demo records across every intake channel                    */
/* ------------------------------------------------------------------ */

type SeedLead = {
  full_name: string;
  phone: string;
  email: string | null;
  source: string;
  form_name: string | null;
  campaign: string | null;
  external_id: string | null;
  project: string | null;
  property_type: string | null;
  bedrooms: number | null;
  budget_min: number | null;
  budget_max: number | null;
  message: string | null;
  status: string;
  assigned_to: string | null;
  consent: boolean;
  created_at: Date;
};

const LEAD_COLUMNS = [
  "full_name", "phone", "email", "source", "form_name", "campaign", "external_id",
  "project", "property_type", "bedrooms", "budget_min", "budget_max", "message",
  "status", "assigned_to", "consent", "created_at", "updated_at",
] as const;

function buildLeads(): SeedLead[] {
  const hoursAgo = (hours: number) => new Date(Date.now() - hours * 3_600_000);

  return [
    {
      full_name: "Omar Hassan", phone: "0100 214 8831", email: "omar.hassan@example.com",
      source: "facebook", form_name: "The Lakes — Request a call", campaign: "The Lakes · 0% down · Cairo",
      external_id: "fb-lead-1001", project: "The Lakes", property_type: "Apartment", bedrooms: 2,
      budget_min: 9000000, budget_max: 12000000,
      message: "Looking for a 2-bedroom with a payment plan. Please call after 6pm.",
      status: "new", assigned_to: null, consent: true, created_at: hoursAgo(2),
    },
    {
      full_name: "Nour El Sayed", phone: "0112 905 7744", email: "nour.elsayed@example.com",
      source: "facebook", form_name: "Phase 08M — Unit availability", campaign: "Phase 08M · Fully finished",
      external_id: "fb-lead-1002", project: "Phase 08M", property_type: "Apartment", bedrooms: 3,
      budget_min: 15000000, budget_max: 19000000,
      message: "Interested in a 3-bedroom with garden. Is B20-03 still available?",
      status: "contacted", assigned_to: "Seif El Din Tarek", consent: true, created_at: hoursAgo(5),
    },
    {
      full_name: "Mariam Adel", phone: "0109 441 2208", email: null,
      source: "facebook", form_name: "SODIC East — Master plan", campaign: "SODIC East · Villas",
      external_id: "fb-lead-1003", project: "SODIC East", property_type: "Villa", bedrooms: 4,
      budget_min: 45000000, budget_max: 60000000,
      message: "Please send the villa brochure and delivery dates.",
      status: "qualified", assigned_to: "Seif El Din Tarek", consent: true, created_at: hoursAgo(9),
    },
    {
      full_name: "Youssef Ibrahim", phone: "0128 330 1190", email: "youssef.ibrahim@example.com",
      source: "instagram", form_name: "The Lakes — Lead form", campaign: "The Lakes · Waterfront",
      external_id: "ig-lead-2001", project: "The Lakes", property_type: "Duplex", bedrooms: 3,
      budget_min: 16000000, budget_max: 20000000,
      message: "Do you have a duplex with a private garden?",
      status: "new", assigned_to: null, consent: true, created_at: hoursAgo(22),
    },
    {
      full_name: "Salma Fathy", phone: "0106 778 4521", email: "salma.fathy@example.com",
      source: "website", form_name: "Website — Request the full brief", campaign: null,
      external_id: null, project: "The Lakes", property_type: "Apartment", bedrooms: 1,
      budget_min: 6000000, budget_max: 7500000,
      message: "First-time buyer, interested in the 1-bedroom starting price.",
      status: "contacted", assigned_to: "Seif El Din Tarek", consent: true, created_at: hoursAgo(30),
    },
    {
      full_name: "Ahmed Samir", phone: "0115 602 3377", email: null,
      source: "whatsapp", form_name: null, campaign: null,
      external_id: null, project: "Phase 08M", property_type: "Apartment", bedrooms: 2,
      budget_min: 14000000, budget_max: 17000000,
      message: "Can I reserve B20-31? What is the maintenance deposit?",
      status: "viewing", assigned_to: "Seif El Din Tarek", consent: true, created_at: hoursAgo(48),
    },
    {
      full_name: "Dina Mostafa", phone: "0100 887 5512", email: "dina.mostafa@example.com",
      source: "facebook", form_name: "The Lakes — Request a call", campaign: "The Lakes · 0% down · Cairo",
      external_id: "fb-lead-1004", project: "The Lakes", property_type: "Apartment", bedrooms: 3,
      budget_min: 13000000, budget_max: 16000000,
      message: "Please share the 3-bedroom plans.",
      status: "new", assigned_to: null, consent: true, created_at: hoursAgo(60),
    },
    {
      full_name: "Karim Nabil", phone: "0122 410 6688", email: "karim.nabil@example.com",
      source: "website", form_name: "Website — Request the full brief", campaign: null,
      external_id: null, project: "SODIC East", property_type: "Townhouse", bedrooms: 3,
      budget_min: 28000000, budget_max: 35000000,
      message: "Looking for a townhouse delivered in 2029.",
      status: "qualified", assigned_to: "Seif El Din Tarek", consent: true, created_at: hoursAgo(72),
    },
    {
      full_name: "Hana Farouk", phone: "0110 553 9024", email: null,
      source: "instagram", form_name: "Phase 08M — Lead form", campaign: "Phase 08M · Fully finished",
      external_id: "ig-lead-2002", project: "Phase 08M", property_type: "Apartment", bedrooms: 3,
      budget_min: 17000000, budget_max: 21000000,
      message: "Is the 3-bedroom + nanny with roof still available?",
      status: "contacted", assigned_to: "Seif El Din Tarek", consent: true, created_at: hoursAgo(96),
    },
    {
      full_name: "Mohamed Ashraf", phone: "0101 202 7745", email: "m.ashraf@example.com",
      source: "manual", form_name: null, campaign: null,
      external_id: null, project: "The Lakes", property_type: "Apartment", bedrooms: 2,
      budget_min: 10000000, budget_max: 12500000,
      message: "Referral from an existing owner. Call in the morning.",
      status: "won", assigned_to: "Seif El Din Tarek", consent: false, created_at: hoursAgo(120),
    },
    {
      full_name: "Rana Khaled", phone: "0127 911 4402", email: "rana.khaled@example.com",
      source: "facebook", form_name: "SODIC East — Master plan", campaign: "SODIC East · Villas",
      external_id: "fb-lead-1005", project: "SODIC East", property_type: "Villa", bedrooms: 4,
      budget_min: 50000000, budget_max: 65000000,
      message: "Please call me to discuss the 4-bedroom villa.",
      status: "new", assigned_to: null, consent: true, created_at: hoursAgo(144),
    },
    {
      full_name: "Tarek Magdy", phone: "0104 668 1123", email: null,
      source: "website", form_name: "Website — Payment plan", campaign: null,
      external_id: null, project: "SODIC East", property_type: "Apartment", bedrooms: 2,
      budget_min: 14000000, budget_max: 18000000,
      message: "Need the ten-year plan in writing before a viewing.",
      status: "lost", assigned_to: "Seif El Din Tarek", consent: true, created_at: hoursAgo(168),
    },
  ];
}

async function seedLeads(client: TxClient) {
  const { rows } = await client.query<{ count: number }>("SELECT count(*)::int AS count FROM leads");
  if (rows[0].count > 0) {
    console.log(`[seed] leads: ${rows[0].count} existing records kept`);
    return;
  }

  const leads = buildLeads();
  for (const lead of leads) {
    const values = [
      lead.full_name, lead.phone, lead.email, lead.source, lead.form_name, lead.campaign,
      lead.external_id, lead.project, lead.property_type, lead.bedrooms, lead.budget_min,
      lead.budget_max, lead.message, lead.status, lead.assigned_to, lead.consent,
      lead.created_at, lead.created_at,
    ];
    const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");

    await client.query(
      `INSERT INTO leads (${LEAD_COLUMNS.join(", ")})
       VALUES (${placeholders})
       ON CONFLICT (external_id) WHERE external_id IS NOT NULL DO NOTHING`,
      values
    );
  }

  console.log(`[seed] leads: ${leads.length} demo records`);
}

async function main() {
  const pool = getPool();

  await withTransaction(async (client) => {
    for (const lang of LANGS) await seedLocale(client, lang);

    await client.query(
      `INSERT INTO settings (key, value) VALUES ('contact', $1)
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
      [json(contact)]
    );

    await seedProperties(client);
    await seedProjects(client);
    await seedLeads(client);
  });

  const { rows } = await pool.query<{ lang: string; tiles: number; panels: number; sections: number }>(
    `SELECT t.lang,
            count(DISTINCT t.id)::int AS tiles,
            count(DISTINCT p.tile_id)::int AS panels,
            count(s.position)::int AS sections
       FROM tiles t
       LEFT JOIN panels p ON p.lang = t.lang AND p.tile_id = t.id
       LEFT JOIN panel_sections s ON s.lang = t.lang AND s.tile_id = t.id
      GROUP BY t.lang ORDER BY t.lang`
  );
  for (const r of rows) {
    console.log(
      `[seed] ${r.lang}: ${r.tiles} tiles · ${r.panels} panels · ${r.sections} sections`
    );
  }

  const { rows: totals } = await pool.query<{ properties: number; projects: number; leads: number }>(
    `SELECT (SELECT count(*)::int FROM properties) AS properties,
            (SELECT count(*)::int FROM projects) AS projects,
            (SELECT count(*)::int FROM leads) AS leads`
  );
  console.log(
    `[seed] admin data: ${totals[0].properties} properties · ${totals[0].projects} projects · ${totals[0].leads} leads`
  );

  console.log("[seed] settings: contact");
  console.log("[seed] done");
}

main()
  .then(() => process.exit(0))
  .catch((err: unknown) => {
    console.error("[seed] failed:", err instanceof Error ? err.message : err);
    process.exit(1);
  });
