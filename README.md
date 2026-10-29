# Makers Real Estate — Landing Page

A one-page landing site for **Makers Real Estate** presenting **The Lakes at SODIC East**
(New Heliopolis, East Cairo). Built with **Next.js (App Router) + TypeScript**, bilingual
**EN / AR** with full RTL support, a full-bleed **video background**, and a grid of large
square tiles — each tile opens a full brief (units, areas, prices, delivery, amenities).

Live content: 6 tiles → The Lakes · Phase 08M · SODIC East · Amenities · The Collection · Payment.

---

## Run it

The site serves its content from **PostgreSQL** (see [Database](#database-postgresql)).
Set the database up once, then run:

```bash
npm install
npm run db:setup   # apply db/schema.sql + seed from data/content.ts
npm run dev        # http://localhost:3000
```

Production:

```bash
npm run build
npm run start      # http://localhost:3000
# or: npm run preview   (build + start)
```

> **Note on this sandbox:** in the Windows/WSL environment where the site was built, the browser
> could not open WebSockets, so `next dev` rendered but did not hydrate (the dev client waits for
> its HMR socket). `npm run build && npm run start` works perfectly. On a normal machine
> `npm run dev` hydrates normally.

---

## Database (PostgreSQL)

Content that used to live only in `data/content.ts` now lives in PostgreSQL, which the app
reads on every request.

| Piece | Purpose |
|---|---|
| `db/schema.sql` | DDL — content tables (`locales`, `site_content`, `tiles`, `panels`, `panel_sections`, `settings`) plus `leads` and `properties` |
| `scripts/db-migrate.ts` | applies the schema (idempotent) — `npm run db:migrate` |
| `scripts/db-seed.ts` | seeds both locales from `data/content.ts` — `npm run db:seed` |
| `lib/db.ts` | `pg` connection pool + query/transaction helpers |
| `lib/content-db.ts` | loads content from PostgreSQL and assembles the app's `Content` shape |

How the app uses it:

- `app/page.tsx` is an async server component (`force-dynamic`): it calls `getSite()` and passes
  `content` + `contact` to the client-side `Landing`.
- `app/layout.tsx` uses `generateMetadata()` to read title/description from the database.
- Content is cached in-process for `CONTENT_CACHE_TTL_MS` (default 30 s) so the page does not
  query per render.
- **Fallback:** if PostgreSQL is unreachable the app logs a warning and serves the static
  `data/content.ts`, so the site never goes blank.

Connection is configured with `DATABASE_URL` in `.env` (copy `.env.example`). The default is a
local unix socket with peer auth (`postgresql:///makers?host=/var/run/postgresql`).

Schema shape: one row per locale in `site_content` (page chrome as jsonb), ordered `tiles` and
`panels`, and polymorphic `panel_sections` (`kind` + jsonb `payload` for
stats/table/units/list/prices/gallery/note). `settings.contact` holds the advisor block.

**Editing content:** change the data in `data/content.ts`, then re-run `npm run db:seed`
(the seed is transactional and replaces tiles/panels/sections wholesale). Or edit rows in
PostgreSQL directly — changes appear within `CONTENT_CACHE_TTL_MS`.

```bash
npm run db:migrate   # apply db/schema.sql
npm run db:seed      # re-import content from data/content.ts
npm run db:setup     # migrate + seed
```

## Admin dashboard

The public header has a **Login** button. Sign in at `http://localhost:3000/login`:

| | |
|---|---|
| Username | `admin` |
| Password | `zerocall` |

Override both with `ADMIN_USERNAME` / `ADMIN_PASSWORD` in `.env` (and set a long
`ADMIN_SESSION_SECRET`). The session is an HTTP-only, signed cookie valid for eight hours.

Four modules:

| Module | Route | What it does |
|---|---|---|
| Overview | `/dashboard` | Lead, source, availability and portfolio-value cards; latest leads; featured inventory |
| Leads | `/dashboard/leads` | Pipeline across Facebook, Instagram, website, WhatsApp and manual entry; filters, detail view, status updates, manual intake |
| Primary data | `/dashboard/primary` | The SODIC East fact sheet and all six collection panels, read live from PostgreSQL with EN / AR switch |
| Inventory | `/dashboard/inventory` | Standard property records — code, type, specs, areas, finishing, price, payment plan, delivery, images and video |

### Lead intake API

Facebook / Instagram lead ads and website forms can post to `POST /api/leads`. A Facebook
`field_data` payload is normalised automatically (source `facebook`, external leadgen ID kept):

```bash
curl -X POST http://localhost:3000/api/leads \
  -H 'Content-Type: application/json' \
  -d '{
    "leadgen_id": "123456789",
    "form_name": "The Lakes — Request a call",
    "campaign_name": "The Lakes · 0% down · Cairo",
    "field_data": [
      { "name": "full_name", "values": ["Omar Hassan"] },
      { "name": "phone_number", "values": ["01002148831"] },
      { "name": "project", "values": ["The Lakes"] },
      { "name": "bedrooms", "values": ["2"] }
    ]
  }'
```

Plain JSON (`full_name`, `phone`, `email`, `project`, `budget_min`…) also works. If
`LEADS_API_KEY` is set, send it as `x-api-key` (or `?key=`).

### Seed data

`npm run db:seed` inserts **23 properties** derived from the Phase 08M unit list and the
Collection / Payment panels, plus **12 demo leads** across every source. Property images come
from `public/img`, and featured units carry the site film at `/video/hero.mp4`. Existing
leads are preserved on re-seed; properties are inserted by unique code.

> **Security:** the dashboard is a single-admin tool for this landing page. Change the
> credentials and session secret before deploying, and put the dashboard behind your normal
> infrastructure controls if it will be public.

## Structure

```
app/
  layout.tsx        fonts (Inter / Cormorant Garamond / Cairo), generateMetadata (DB), <html lang dir>
  page.tsx          async server component: loads content from PostgreSQL → <Landing />
  globals.css       design tokens, header, hero, footer, bidi helpers
  site.css          tile grid, detail panel, tables, gallery
  icon.png          favicon (gold M monogram, cropped from the brand logo)
  login/            admin sign-in screen
  dashboard/        overview, leads, primary data, inventory (layout + dashboard.css)
  api/auth/         login / logout routes
  api/leads/        public lead intake (website + Facebook lead ads)
components/
  Landing.tsx       state: language, open panel, hash deep-links (#tile-lakes …)
  Header.tsx        wordmark, nav, Login button, EN/ع switch, WhatsApp CTA
  Hero.tsx          video background (poster fallback / reduced-motion fallback), headline, stats
  Collection.tsx    the 6 large square tiles
  Panel.tsx         full-screen detail sheet (scroll lock, Esc, focus return, exit animation)
  Sections.tsx      renders the data sections (stats / tables / unit tables / prices / lists / gallery)
  Footer.tsx        advisor card, links, disclaimer
  Brand.tsx, Reveal.tsx
  dashboard/        DashboardNav, PropertyCard, status/source badges
data/
  content.ts        seed data + type definitions (EN + AR). Source for db:seed and the fallback.
db/
  schema.sql        PostgreSQL schema
lib/
  db.ts             pg pool, query(), withTransaction(), pingDb()
  content-db.ts     getSite(): content + contact from PostgreSQL (cached, with fallback)
  admin.ts          leads + property inventory queries
  auth.ts           signed admin session, credentials, requireAdmin()
  format.ts         EGP/area/date/budget formatting helpers
  labels.ts         small UI labels (Ground, per-month, back-to-top…)
scripts/
  db-migrate.ts     apply the schema
  db-seed.ts        seed the database from data/content.ts
public/
  video/hero.mp4    seamless 24s boomerang loop, 1920×1080, 7.2 MB, no audio
  img/*.jpg         hero poster + 6 stills used by tiles, panels and gallery
  img/makers-*.png  gold monogram mark + full logo lockup (header uses the mark)
```

## Editing content

PostgreSQL is the live source of truth; **`data/content.ts`** remains the seed it is imported from:

- `content.en` / `content.ar` — mirrored objects; TypeScript fails the build if they drift apart.
- `tiles[]` — the 6 tiles (index, kicker, title, meta, image).
- `panels[id].sections[]` — the brief behind each tile. Section kinds:
  `stats`, `table`, `units`, `prices`, `list`, `gallery`, `note`.
- Phase 08M unit rows are structured numbers (`area`, `garden`, `roof`, `price`); the table
  formats them and derives the monthly figure (`price / 120`) automatically.

After editing, run `npm run db:seed` to push the changes into PostgreSQL (transactional;
replaces tiles/panels/sections wholesale). Alternatively edit the tables directly — the app
picks changes up within `CONTENT_CACHE_TTL_MS`.

Arabic strings pass through `isolateDeep()` at module load, which wraps numbers and ranges in
Unicode isolates so `125–225` and phone numbers keep their order inside RTL text. The seed
stores the isolated text as-is, so the rendered output is byte-identical to the static site.

## Media / where it came from

| Asset | Source |
|---|---|
| `public/video/hero.mp4` | Pexels stock clip *Aerial View of Luxurious Waterfront Homes* (video ID [36870461](https://www.pexels.com/video/36870461/), David Pickup — Pexels License, free for commercial use, no attribution required): 1080p30 master (the full-resolution cut kept in this repo's history), 12s forward + reversed for a seamless 24s boomerang, H.264 High CRF 22 capped at 3 Mbps (≈2.4 Mbps, 7.2 MB), no audio, `+faststart`. Poster is a 1920 px frame from the same file. |
| `public/img/hero-poster.jpg` | poster frame from the same clip |
| `public/img/{lakes,creek,mall,boulevard,sodic,phase08m}.jpg` | frames from the original *The Lakes* render film, contrast/saturation nudged, 1280 wide |
| Copy & figures | `The Lakes – SODIC East – Factsheet.pdf`, `SODIC_EAST_Inventory_Breakdown_Brief.pdf` and the Phase 08M unit list |
| Brand | gold “M” monogram + wordmark from the brand logo PNG (`public/img/makers-mark.png` / `makers-logo.png`, favicon `app/icon.png` are crops/rescales of it); the header wordmark is set as type beside the monogram, and gold text uses a metallic gradient + slow sheen (`--gold-*` tokens in `globals.css`) |

To swap the background film: drop an `.mp4` at `public/video/hero.mp4` and a matching
`public/img/hero-poster.jpg`. Keep it under ~5 MB and mute the audio track.

## Deliberate details

- Phone numbers render `dir="ltr"` + bidi-isolated so `0100 950 0083` never reads backwards in Arabic.
- Numbers use lining figures (`font-variant-numeric`) so `08M` doesn't render as `o8M`.
- `prefers-reduced-motion` swaps the video for the poster and disables reveals.
- Tiles open with `#tile-<id>` in the URL, so a brief can be linked/shared; Back closes it.
- Monthly figures are explicitly labelled indicative (`price ÷ 120` at 0%); the disclaimer in the
  footer and the notes in each panel say the schedule is set in the reservation contract.

## Not built yet (the full site)

This is intentionally a landing page with a single-admin operations layer. Natural next steps:
per-project routes, unit-level public pages, a public lead form writing into the same `leads`
table, CRM sync for Facebook lead ads, real photography of the built product, and multi-user
roles / audit history for the dashboard.

---

## نظرة سريعة (بالعربي)

لاندنج بيج لشركة **ميكرز للعقارات** تعرض **ذا ليكس** داخل **سوديك إيست** — صفحة واحدة، عربي/إنجليزي،
خلفية فيديو، وستة مربعات كبيرة يفتح كل واحد منها الملف الكامل (وحدات، مساحات، أسعار، تسليم، خدمات).

```bash
npm install
npm run db:setup   # إنشاء الجداول وإدخال المحتوى
npm run dev
```

المحتوى يُقرأ الآن من **PostgreSQL** (جدول `site_content` / `tiles` / `panels` / `panel_sections`)،
و`data/content.ts` هو مصدر البذور لإدخاله عبر `npm run db:seed` ونسخته الاحتياطية.
الفيديو في `public/video/hero.mp4` والصور في `public/img/`.