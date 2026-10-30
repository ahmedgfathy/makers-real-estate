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

CREATE INDEX IF NOT EXISTS idx_tiles_lang_pos ON tiles (lang, position);
CREATE INDEX IF NOT EXISTS idx_sections_lookup ON panel_sections (lang, tile_id, position);

INSERT INTO locales (code, dir, label) VALUES
  ('en', 'ltr', 'English'),
  ('ar', 'rtl', 'العربية')
ON CONFLICT (code) DO NOTHING;

COMMIT;
