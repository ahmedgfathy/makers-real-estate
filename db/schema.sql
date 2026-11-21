-- Makers Real Estate — PostgreSQL schema
-- The public site is a single landing page whose chrome is stored per locale
-- (en / ar). Everything else in here is CRM: leads, their follow-up log,
-- dashboard accounts and the audit trail.

BEGIN;

CREATE TABLE IF NOT EXISTS locales (
  code  text PRIMARY KEY CHECK (code IN ('en', 'ar')),
  dir   text NOT NULL CHECK (dir IN ('ltr', 'rtl')),
  label text NOT NULL
);

-- Page chrome: meta, brand, nav, hero, footer, lead form.
CREATE TABLE IF NOT EXISTS site_content (
  lang       text PRIMARY KEY REFERENCES locales (code) ON DELETE CASCADE,
  meta       jsonb NOT NULL,
  brand      jsonb NOT NULL,
  nav        jsonb NOT NULL,
  hero       jsonb NOT NULL,
  footer     jsonb NOT NULL,
  lead_form  jsonb,
  sections   jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Small key/value settings that are not per-locale (currently: contact block).
CREATE TABLE IF NOT EXISTS settings (
  key        text PRIMARY KEY,
  value      jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Sales leads, whatever the entry point: Facebook / Instagram lead ads,
-- the website form, WhatsApp, a consultant's manual entry or a imported list.
CREATE TABLE IF NOT EXISTS leads (
  id            bigserial PRIMARY KEY,
  full_name     text NOT NULL,
  phone         text NOT NULL,
  email         text,

  -- Where the enquiry came from. `legacy` is a list that predates the CRM.
  source        text NOT NULL DEFAULT 'manual'
                CHECK (source IN ('facebook', 'instagram', 'website', 'whatsapp',
                                  'referral', 'walk-in', 'legacy', 'manual')),
  form_name     text,
  campaign      text,
  external_id   text,

  -- What the buyer is looking for.
  project         text,
  property_type   text,
  bedrooms        integer,
  preferred_area  text,
  budget_min      bigint,
  budget_max      bigint,
  payment_preference text CHECK (payment_preference IN ('cash', 'installments', 'mortgage', 'undecided')),
  intent          text CHECK (intent IN ('buyer', 'investor', 'renter')),
  temperature     text CHECK (temperature IN ('hot', 'warm', 'cold')),
  message         text,

  -- Where the lead sits in the pipeline. `nurture` keeps a lead in the
  -- follow-up queue without counting it as active interest.
  status        text NOT NULL DEFAULT 'new'
                CHECK (status IN ('new', 'contacted', 'qualified', 'viewing',
                                  'nurture', 'won', 'lost')),
  assigned_to   text,
  consent       boolean NOT NULL DEFAULT false,

  -- Follow-up scheduling. `next_follow_up_on` drives the dashboard alerts;
  -- last_follow_up_at / follow_up_count are maintained by the log below.
  next_follow_up_on date,
  last_follow_up_at timestamptz,
  follow_up_count   integer NOT NULL DEFAULT 0 CHECK (follow_up_count >= 0),

  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Every contact attempt on a lead: the call, the WhatsApp, the viewing.
CREATE TABLE IF NOT EXISTS lead_follow_ups (
  id          bigserial PRIMARY KEY,
  lead_id     bigint NOT NULL REFERENCES leads (id) ON DELETE CASCADE,
  logged_at   timestamptz NOT NULL DEFAULT now(),
  author      text NOT NULL DEFAULT 'admin',
  channel     text NOT NULL DEFAULT 'call'
              CHECK (channel IN ('call', 'whatsapp', 'email', 'visit', 'meeting', 'other')),
  outcome     text NOT NULL DEFAULT 'reached'
              CHECK (outcome IN ('reached', 'no_answer', 'callback_later', 'wrong_number',
                                 'not_interested', 'viewing_booked', 'sent_brief', 'other')),
  note        text,
  follow_up_on date
);

-- Dashboard accounts. Passwords are scrypt hashes (lib/passwords.ts); the env
-- admin is bootstrapped by scripts/db-migrate.ts when the table is empty.
CREATE TABLE IF NOT EXISTS admin_users (
  username      text PRIMARY KEY,
  password_hash text NOT NULL,
  display_name  text,
  role          text NOT NULL DEFAULT 'editor'
                CHECK (role IN ('admin', 'editor')),
  active        boolean NOT NULL DEFAULT true,
  last_login_at timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Append-only audit trail: who changed what in the dashboard.
CREATE TABLE IF NOT EXISTS audit_log (
  id          bigserial PRIMARY KEY,
  at          timestamptz NOT NULL DEFAULT now(),
  actor       text NOT NULL,
  action      text NOT NULL,
  entity_type text NOT NULL,
  entity_id   text,
  detail      jsonb NOT NULL DEFAULT '{}'::jsonb
);

-- Existing installs: widen the lead enums and add the follow-up columns
-- without dropping data.
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS lead_form jsonb;
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS sections jsonb;

ALTER TABLE leads ADD COLUMN IF NOT EXISTS preferred_area     text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS payment_preference text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS intent             text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS temperature        text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS next_follow_up_on  date;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_follow_up_at  timestamptz;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS follow_up_count    integer NOT NULL DEFAULT 0;

ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_source_check;
ALTER TABLE leads ADD CONSTRAINT leads_source_check CHECK (
  source IN ('facebook', 'instagram', 'website', 'whatsapp',
             'referral', 'walk-in', 'legacy', 'manual')
);
ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_status_check;
ALTER TABLE leads ADD CONSTRAINT leads_status_check CHECK (
  status IN ('new', 'contacted', 'qualified', 'viewing', 'nurture', 'won', 'lost')
);
ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_payment_preference_check;
ALTER TABLE leads ADD CONSTRAINT leads_payment_preference_check CHECK (
  payment_preference IN ('cash', 'installments', 'mortgage', 'undecided')
);
ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_intent_check;
ALTER TABLE leads ADD CONSTRAINT leads_intent_check CHECK (
  intent IN ('buyer', 'investor', 'renter')
);
ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_temperature_check;
ALTER TABLE leads ADD CONSTRAINT leads_temperature_check CHECK (
  temperature IN ('hot', 'warm', 'cold')
);
ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_follow_up_count_check;
ALTER TABLE leads ADD CONSTRAINT leads_follow_up_count_check CHECK (follow_up_count >= 0);

CREATE INDEX IF NOT EXISTS idx_audit_at ON audit_log (at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_actor ON audit_log (actor, at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_log (entity_type, entity_id, at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS idx_leads_external ON leads (external_id)
  WHERE external_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads (source, created_at DESC);
-- Follow-up queue: open leads ordered by the day they are due.
CREATE INDEX IF NOT EXISTS idx_leads_follow_up ON leads (next_follow_up_on)
  WHERE status NOT IN ('won', 'lost');
CREATE INDEX IF NOT EXISTS idx_follow_ups_lead ON lead_follow_ups (lead_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_follow_ups_on ON lead_follow_ups (follow_up_on)
  WHERE follow_up_on IS NOT NULL;

-- ---------------------------------------------------------------------------
-- Real-estate catalogue
--
-- Area -> Project -> Property category -> Unit. Locations are self-referencing
-- so countries, governorates, cities, districts and sub-areas all use one
-- table. Every catalogue row has a stable text id and a unique public slug.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS locations (
  id                text PRIMARY KEY,
  slug              text NOT NULL UNIQUE,
  parent_id         text REFERENCES locations (id) ON DELETE SET NULL,
  type              text NOT NULL CHECK (type IN ('country', 'governorate', 'city', 'district', 'area')),
  name_en           text NOT NULL,
  name_ar           text NOT NULL,
  description_en    text,
  description_ar    text,
  image_url         text,
  seo_title_en      text,
  seo_title_ar      text,
  seo_description_en text,
  seo_description_ar text,
  sort_order        integer NOT NULL DEFAULT 0,
  is_active         boolean NOT NULL DEFAULT true,
  is_directory      boolean NOT NULL DEFAULT true,
  archived_at       timestamptz,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_locations_parent ON locations (parent_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_locations_directory ON locations (is_active, is_directory, type, sort_order);

CREATE TABLE IF NOT EXISTS developers (
  id             text PRIMARY KEY,
  slug           text NOT NULL UNIQUE,
  name_en        text NOT NULL,
  name_ar        text,
  description_en text,
  description_ar text,
  website        text,
  logo_url       text,
  is_active      boolean NOT NULL DEFAULT true,
  archived_at    timestamptz,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS projects (
  id                    text PRIMARY KEY,
  slug                  text NOT NULL UNIQUE,
  developer_id          text REFERENCES developers (id) ON DELETE SET NULL,
  location_id           text REFERENCES locations (id) ON DELETE SET NULL,
  name_en               text NOT NULL,
  name_ar               text NOT NULL,
  description_en        text,
  description_ar        text,
  status                text NOT NULL DEFAULT 'off_plan'
                        CHECK (status IN ('ready', 'under_construction', 'off_plan')),
  cover_image           text,
  masterplan_image      text,
  video_url             text,
  seo_title_en          text,
  seo_title_ar          text,
  seo_description_en    text,
  seo_description_ar    text,
  delivery_date         date,
  starting_price        bigint,
  down_payment_percent  numeric(6, 2),
  installment_months    integer,
  sort_order            integer NOT NULL DEFAULT 0,
  is_featured           boolean NOT NULL DEFAULT false,
  is_active             boolean NOT NULL DEFAULT true,
  archived_at           timestamptz,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_projects_location ON projects (location_id, is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_projects_developer ON projects (developer_id, is_active);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects (status, is_active);
CREATE INDEX IF NOT EXISTS idx_projects_price ON projects (starting_price) WHERE starting_price IS NOT NULL;

CREATE TABLE IF NOT EXISTS project_images (
  id          text PRIMARY KEY,
  project_id  text NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
  url         text NOT NULL,
  alt_en      text,
  alt_ar      text,
  kind        text NOT NULL DEFAULT 'gallery' CHECK (kind IN ('gallery', 'masterplan', 'video_poster')),
  sort_order  integer NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_project_images_project ON project_images (project_id, kind, sort_order);

CREATE TABLE IF NOT EXISTS project_facilities (
  id         text PRIMARY KEY,
  project_id text NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
  name_en    text NOT NULL,
  name_ar    text,
  icon       text,
  sort_order integer NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_project_facilities_project ON project_facilities (project_id, sort_order);

CREATE TABLE IF NOT EXISTS project_landmarks (
  id         text PRIMARY KEY,
  project_id text NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
  name_en    text NOT NULL,
  name_ar    text,
  distance   text,
  kind       text NOT NULL DEFAULT 'nearby' CHECK (kind IN ('nearby', 'landmark', 'transport', 'education', 'leisure')),
  sort_order integer NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_project_landmarks_project ON project_landmarks (project_id, sort_order);

CREATE TABLE IF NOT EXISTS project_facts (
  id         text PRIMARY KEY,
  project_id text NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
  label_en   text NOT NULL,
  label_ar   text,
  value_en   text NOT NULL,
  value_ar   text,
  sort_order integer NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_project_facts_project ON project_facts (project_id, sort_order);

CREATE TABLE IF NOT EXISTS payment_plans (
  id                    text PRIMARY KEY,
  project_id            text NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
  name_en               text NOT NULL,
  name_ar               text,
  down_payment_percent  numeric(6, 2),
  installment_months    integer,
  delivery_date         date,
  notes_en              text,
  notes_ar              text,
  sort_order            integer NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_payment_plans_project ON payment_plans (project_id, sort_order);

CREATE TABLE IF NOT EXISTS property_categories (
  id               text PRIMARY KEY,
  slug             text NOT NULL UNIQUE,
  name_en          text NOT NULL,
  name_ar          text NOT NULL,
  description_en   text,
  description_ar   text,
  icon             text,
  attribute_schema jsonb NOT NULL DEFAULT '{}'::jsonb,
  sort_order       integer NOT NULL DEFAULT 0,
  is_active        boolean NOT NULL DEFAULT true,
  archived_at      timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS project_property_categories (
  project_id  text NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
  category_id text NOT NULL REFERENCES property_categories (id) ON DELETE CASCADE,
  sort_order  integer NOT NULL DEFAULT 0,
  is_active   boolean NOT NULL DEFAULT true,
  PRIMARY KEY (project_id, category_id)
);
CREATE INDEX IF NOT EXISTS idx_ppc_category ON project_property_categories (category_id, is_active);

CREATE TABLE IF NOT EXISTS units (
  id                     text PRIMARY KEY,
  slug                   text NOT NULL UNIQUE,
  project_id             text NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
  category_id            text NOT NULL,
  payment_plan_id        text REFERENCES payment_plans (id) ON DELETE SET NULL,
  FOREIGN KEY (project_id, category_id)
    REFERENCES project_property_categories (project_id, category_id) ON DELETE CASCADE,
  reference              text,
  title_en               text,
  title_ar               text,
  description_en         text,
  description_ar         text,
  built_up_area          numeric(10, 2),
  land_area              numeric(10, 2),
  bedrooms               integer,
  bathrooms              integer,
  floor                  text,
  garden_area            numeric(10, 2),
  terrace_area           numeric(10, 2),
  view_en                text,
  view_ar                text,
  finishing_en           text,
  finishing_ar           text,
  delivery_date          date,
  total_price            bigint,
  down_payment_amount    bigint,
  down_payment_percent   numeric(6, 2),
  installment_months     integer,
  installment_amount     bigint,
  installment_frequency  text CHECK (installment_frequency IN ('monthly', 'quarterly', 'yearly', 'none')),
  status                 text NOT NULL DEFAULT 'available'
                         CHECK (status IN ('available', 'reserved', 'sold', 'archived')),
  is_active              boolean NOT NULL DEFAULT true,
  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_units_project_category ON units (project_id, category_id, status);
CREATE INDEX IF NOT EXISTS idx_units_status_price ON units (status, total_price);
CREATE INDEX IF NOT EXISTS idx_units_specs ON units (bedrooms, built_up_area);
CREATE INDEX IF NOT EXISTS idx_units_delivery ON units (delivery_date) WHERE delivery_date IS NOT NULL;

CREATE TABLE IF NOT EXISTS unit_images (
  id         text PRIMARY KEY,
  unit_id    text NOT NULL REFERENCES units (id) ON DELETE CASCADE,
  url        text NOT NULL,
  alt_en     text,
  alt_ar     text,
  kind       text NOT NULL DEFAULT 'photo' CHECK (kind IN ('photo', 'floor_plan')),
  sort_order integer NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_unit_images_unit ON unit_images (unit_id, kind, sort_order);

-- Leads keep the old free-text fields for compatibility, but new enquiries
-- carry canonical ids so the CRM can filter and report by classification.
ALTER TABLE leads ADD COLUMN IF NOT EXISTS governorate_id text REFERENCES locations (id) ON DELETE SET NULL;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS city_id text REFERENCES locations (id) ON DELETE SET NULL;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS area_id text REFERENCES locations (id) ON DELETE SET NULL;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS location_id text REFERENCES locations (id) ON DELETE SET NULL;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS project_id text REFERENCES projects (id) ON DELETE SET NULL;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS property_category_id text REFERENCES property_categories (id) ON DELETE SET NULL;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS unit_id text REFERENCES units (id) ON DELETE SET NULL;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS budget bigint;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS requirements jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS locale text CHECK (locale IN ('en', 'ar'));
ALTER TABLE leads ADD COLUMN IF NOT EXISTS source_path text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS referrer text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_source text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_medium text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_campaign text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS meta_form_id text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS meta_ad_id text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS meta_adgroup_id text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS meta_page_id text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS meta_created_at timestamptz;
CREATE INDEX IF NOT EXISTS idx_leads_project ON leads (project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_area ON leads (area_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_category ON leads (property_category_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_unit ON leads (unit_id) WHERE unit_id IS NOT NULL;

INSERT INTO locales (code, dir, label) VALUES
  ('en', 'ltr', 'English'),
  ('ar', 'rtl', 'العربية')
ON CONFLICT (code) DO NOTHING;

COMMIT;
