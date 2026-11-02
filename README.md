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

- The public site has an English/Arabic landing page, enquiry form, WhatsApp and phone contact links, and optional PostHog analytics.
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

Vercel builds run `npm run db:migrate && next build`. Set `DATABASE_URL` and the authentication, lead API, Meta webhook, site URL, and optional analytics variables in the Vercel project environment. The Vercel region is configured in `vercel.json`.
