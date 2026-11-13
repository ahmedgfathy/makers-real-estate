# Makers Real Estate

Bilingual real estate landing page and lead CRM built with Next.js App Router, TypeScript, and PostgreSQL.

## Local setup

```bash
npm install
cp .env.example .env
npm run db:migrate
npm run db:seed
npm run dev
```

The database URL is read from `DATABASE_URL`. Use a Neon pooled connection for the running app and a direct connection for manual database maintenance.

## Website and CRM

- The public site has a localized home carousel at `/en` and `/ar`, a projects catalogue, and separate About Us and Contact Us pages. Individual project pages include Sleek and Sarai. The root URL redirects to `/en`.
- The Sarai page presents S-Villa 212 as part of the compound and integrates the fact sheet's 550-acre size, New Heliopolis location, and listed facilities alongside the supplied images and videos. The original source files in `proj1/s/` remain unchanged; no pricing or payment plan is published until a Sarai-specific source is confirmed.
- `sitemap.xml` lists the public localized home, projects, about, contact, Sleek and Sarai pages with reciprocal language alternates. `robots.txt` allows public assets and disallows the dashboard, login, and API routes.
- The site emits consent-gated GTM events for page views, project views, WhatsApp/phone clicks, successful lead submissions, and language changes. Google Consent Mode defaults analytics and advertising storage to denied; accepting the current prompt grants analytics only.
- Google Tag Manager is configured in the Next.js app, not through GoDaddy. Set `NEXT_PUBLIC_GTM_ID` and `NEXT_PUBLIC_SITE_URL` in Vercel. The canonical URL defaults to `https://www.makersegypt.com`; override it if the production hostname differs. Add GA4 event tags/triggers in the GTM container; configure its Google tag not to send an automatic page view and avoid a second browser-history page-view mechanism.
- Set `GOOGLE_SITE_VERIFICATION` only for a Google Search Console URL-prefix verification token. Domain properties require DNS verification. Submit `/sitemap.xml` in Search Console after deployment.
- The site retains its AdSense publisher verification metadata and loader; this does not add ad placements.
- The CRM provides an overview, lead search and filtering, lead details, manual lead entry, follow-up logging, and account management.
- Follow-ups are the heart of the CRM: every lead carries a `next_follow_up_on` date, and each contact attempt is appended to `lead_follow_ups`. The sidebar bell, the queue card, the overview banner, and `/dashboard/follow-ups` count overdue and due-today work.
- Lead intake is available at `POST /api/leads`; the Meta lead ads webhook is `/api/webhooks/meta`.
- Dashboard sessions use signed HTTP-only cookies. Per-user passwords are stored as scrypt hashes in `admin_users`.

## Data and schema

- `db/schema.sql` defines localized landing content, leads, the follow-up log, dashboard users, and the audit log.
- `scripts/db-seed.ts` refreshes only the bilingual landing-page content. It does not insert or replace leads.
- `npm run db:import-leads -- <file.csv>` imports an exported leads CSV (English or Arabic headers) and is safe to re-run: rows are matched on phone/handle, so existing leads are never duplicated or overwritten.
- The public portfolio and the inventory modules have been removed. Migrations drop the legacy `developers`, `projects`, `properties`, `tiles`, `panels`, and `panel_sections` tables plus the site content columns they fed. Lead records, account records, audit history, and landing content are retained.
- `/api/health` reports database reachability and whether site content is being served from PostgreSQL or the static fallback.

## Deployment

Vercel builds run `npm run db:migrate && next build`. Set `DATABASE_URL`, the authentication and Meta webhook variables, `NEXT_PUBLIC_SITE_URL` (the production canonical origin), `NEXT_PUBLIC_GTM_ID`, and any optional verification/analytics variables in the Vercel project environment. The Vercel region is configured in `vercel.json`.
