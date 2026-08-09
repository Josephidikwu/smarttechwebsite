# Smart Technology Information Hub — Website

Next.js (App Router) + Vercel + Neon Postgres + Vercel Blob. See `docs/` for the full picture:

- `docs/SETUP.md` — one-time setup that needs your Neon/Vercel/Google accounts (database, Blob
  store, domain, GA4, Turnstile, Search Console). Webmail (SMTP) is configured from the admin
  dashboard after first login, not here.
- `docs/content-deck.md` — the literal source copy for every page.
- `docs/design-direction.md` — the art-direction brief this build is checked against.
- `docs/brand-guide-page-*.png` — reference renders from the Smart Technology brand guide.

The full build plan (architecture, data model, milestones) lives in the project's plan history;
milestones are tracked as tasks (M0–M10).

## Local development

```sh
npm install
cp .env.example .env.local   # fill in DATABASE_URL at minimum — see docs/SETUP.md
npm run db:migrate           # apply Drizzle migrations to your Neon branch
npm run dev                  # next dev, http://localhost:3000
```

Other scripts:

```sh
npm run build       # production Next.js build
npm run lint         # ESLint
npm run db:generate  # generate a new Drizzle migration after editing lib/db/schema/*
npm run db:migrate   # apply pending migrations to DATABASE_URL
npm run db:studio    # browse DATABASE_URL's data
npm run seed:admin   # create the first super_admin (no public signup)
```

## Project structure

```
app/                marketing, catalogue, opportunities, admin routes (App Router)
components/ui/       brand-token-driven primitives (Button, Container, Logo)
components/sections/ bespoke, composition-first per-page-section layouts
lib/db/schema/       Drizzle schema, one file per domain module
lib/db/client.ts     getDb() — Neon connection via DATABASE_URL
lib/crypto/          AES-256-GCM helpers for the admin-configured SMTP password at rest
lib/brand.ts         site identity, nav, footer structure (single source of truth)
public/brand/        logo assets extracted from the brand guide (SVG + favicon PNGs)
drizzle/             generated SQL migrations
```
