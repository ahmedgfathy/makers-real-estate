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

INSERT INTO locales (code, dir, label) VALUES
  ('en', 'ltr', 'English'),
  ('ar', 'rtl', 'العربية')
ON CONFLICT (code) DO NOTHING;

COMMIT;
