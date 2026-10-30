-- Makers Real Estate — PostgreSQL schema
-- Content is stored per locale (en / ar). Sections are polymorphic, so their
-- payload lives in jsonb while the structural columns stay relational.

BEGIN;

CREATE TABLE IF NOT EXISTS locales (
  code  text PRIMARY KEY CHECK (code IN ('en', 'ar')),
  dir   text NOT NULL CHECK (dir IN ('ltr', 'rtl')),
  label text NOT NULL
);

-- Page chrome: meta, brand, nav, hero, grid, panel UI strings, footer.
CREATE TABLE IF NOT EXISTS site_content (
  lang       text PRIMARY KEY REFERENCES locales (code) ON DELETE CASCADE,
  meta       jsonb NOT NULL,
  brand      jsonb NOT NULL,
  nav        jsonb NOT NULL,
  hero       jsonb NOT NULL,
  grid       jsonb NOT NULL,
  panel      jsonb NOT NULL,
  footer     jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- The six collection tiles, ordered.
CREATE TABLE IF NOT EXISTS tiles (
  lang     text NOT NULL REFERENCES locales (code) ON DELETE CASCADE,
  id       text NOT NULL,
  position integer NOT NULL CHECK (position >= 0),
  idx      text NOT NULL,
  kicker   text NOT NULL,
  title    text NOT NULL,
  meta     text NOT NULL,
  image    text NOT NULL,
  PRIMARY KEY (lang, id),
  UNIQUE (lang, position)
);

-- One detail panel per tile.
CREATE TABLE IF NOT EXISTS panels (
  lang     text NOT NULL REFERENCES locales (code) ON DELETE CASCADE,
  tile_id  text NOT NULL,
  position integer NOT NULL,
  kicker   text NOT NULL,
  title    text NOT NULL,
  lede     text NOT NULL,
  image    text NOT NULL,
  cta      text NOT NULL,
  PRIMARY KEY (lang, tile_id),
  UNIQUE (lang, position),
  FOREIGN KEY (lang, tile_id) REFERENCES tiles (lang, id) ON DELETE CASCADE
);

-- Polymorphic panel sections: kind + payload (stats/table/units/list/prices/gallery/note).
CREATE TABLE IF NOT EXISTS panel_sections (
  lang      text NOT NULL,
  tile_id   text NOT NULL,
  position  integer NOT NULL CHECK (position >= 0),
  kind      text NOT NULL CHECK (
              kind IN ('stats', 'table', 'units', 'list', 'prices', 'gallery', 'note')
            ),
  payload   jsonb NOT NULL,
  PRIMARY KEY (lang, tile_id, position),
  FOREIGN KEY (lang, tile_id) REFERENCES panels (lang, tile_id) ON DELETE CASCADE
);

-- Small key/value settings that are not per-locale (currently: contact block).
CREATE TABLE IF NOT EXISTS settings (
  key        text PRIMARY KEY,
  value      jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Sales leads, whatever the entry point: Facebook / Instagram lead ads,
-- the website form, WhatsApp or a consultant's manual entry.
CREATE TABLE IF NOT EXISTS leads (
  id            bigserial PRIMARY KEY,
  full_name     text NOT NULL,
  phone         text NOT NULL,
  email         text,
  source        text NOT NULL DEFAULT 'manual'
                CHECK (source IN ('facebook', 'instagram', 'website', 'whatsapp', 'manual')),
  form_name     text,
  campaign      text,
  external_id   text,
  project       text,
  property_type text,
  bedrooms      integer,
  budget_min    bigint,
  budget_max    bigint,
  message       text,
  status        text NOT NULL DEFAULT 'new'
                CHECK (status IN ('new', 'contacted', 'qualified', 'viewing', 'won', 'lost')),
  assigned_to   text,
  consent       boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Standard property inventory: one row per sellable unit, with media URLs.
CREATE TABLE IF NOT EXISTS properties (
  id                  bigserial PRIMARY KEY,
  code                text NOT NULL UNIQUE,
  title               text NOT NULL,
  project             text NOT NULL DEFAULT 'SODIC East',
  phase               text,
  property_type       text NOT NULL
                      CHECK (property_type IN ('studio', 'apartment', 'duplex', 'penthouse', 'townhouse', 'villa', 'chalet')),
  listing_type        text NOT NULL DEFAULT 'sale'
                      CHECK (listing_type IN ('sale', 'resale', 'rent')),
  status              text NOT NULL DEFAULT 'available'
                      CHECK (status IN ('available', 'reserved', 'sold', 'off_plan')),
  bedrooms            integer,
  bathrooms           integer,
  built_up_area       numeric(9, 2),
  garden_area         numeric(9, 2),
  roof_area           numeric(9, 2),
  floor               text,
  finishing           text,
  view                text,
  currency            text NOT NULL DEFAULT 'EGP',
  price               bigint NOT NULL,
  down_payment        bigint NOT NULL DEFAULT 0,
  installment_years   integer NOT NULL DEFAULT 10,
  monthly_installment bigint,
  delivery            text,
  description         text,
  amenities           jsonb NOT NULL DEFAULT '[]'::jsonb,
  images              jsonb NOT NULL DEFAULT '[]'::jsonb,
  video               text,
  featured            boolean NOT NULL DEFAULT false,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

-- SODIC project catalogue: one row per development (or phase) with its unit
-- mix, amenities, payment plan and source documents. Bilingual text lives in
-- paired columns so the CRM can switch language without a join.
CREATE TABLE IF NOT EXISTS projects (
  slug             text PRIMARY KEY,
  name             text NOT NULL,
  name_ar          text,
  region           text NOT NULL
                   CHECK (region IN ('east-cairo', 'new-cairo', 'west-cairo', 'north-coast')),
  location         text NOT NULL,
  category         text NOT NULL
                   CHECK (category IN ('residential', 'mixed-use', 'commercial', 'branded', 'serviced')),
  status           text NOT NULL DEFAULT 'selling'
                   CHECK (status IN ('launching', 'selling', 'delivering', 'sold-out', 'completed')),
  tagline          text,
  tagline_ar       text,
  description      text NOT NULL,
  description_ar   text,
  price_from       bigint,
  payment_plan     text,
  payment_plan_ar  text,
  finishing        text,
  unit_types       jsonb NOT NULL DEFAULT '[]'::jsonb,
  amenities        jsonb NOT NULL DEFAULT '[]'::jsonb,
  location_notes   jsonb NOT NULL DEFAULT '[]'::jsonb,
  hero_image       text,
  brochure         text,
  masterplan       text,
  position         integer NOT NULL DEFAULT 0,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tiles_lang_pos ON tiles (lang, position);
CREATE INDEX IF NOT EXISTS idx_sections_lookup ON panel_sections (lang, tile_id, position);
CREATE INDEX IF NOT EXISTS idx_projects_region ON projects (region, position);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects (status, position);

CREATE UNIQUE INDEX IF NOT EXISTS idx_leads_external ON leads (external_id)
  WHERE external_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads (source, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_properties_status ON properties (status, price);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties (property_type, status);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON properties (featured, created_at DESC);

INSERT INTO locales (code, dir, label) VALUES
  ('en', 'ltr', 'English'),
  ('ar', 'rtl', 'العربية')
ON CONFLICT (code) DO NOTHING;

COMMIT;
