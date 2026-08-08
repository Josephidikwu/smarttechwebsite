# Smart Technology Information Hub — Website

Next.js (App Router) + Cloudflare Workers (via OpenNext) + D1 + R2. See `docs/` for the full
picture:

- `docs/SETUP.md` — one-time setup that needs your Cloudflare/Google accounts (D1, R2, domain,
  GA4, Turnstile, Search Console).
- `docs/content-deck.md` — the literal source copy for every page.
- `docs/design-direction.md` — the art-direction brief this build is checked against.
- `docs/brand-guide-page-*.png` — reference renders from the Smart Technology brand guide.

The full build plan (architecture, data model, milestones) lives in the project's plan history;
milestones are tracked as tasks (M0–M10).

## Local development

```sh
npm install
npm run db:migrate:local   # apply Drizzle migrations to local D1 (no Cloudflare login needed)
npm run dev                # next dev, http://localhost:3000
```

Other scripts:

```sh
npm run build              # production Next.js build
npm run lint                # ESLint
npm run preview             # opennextjs-cloudflare build + preview (workerd runtime, closest to prod)
npm run deploy               # build + deploy to Cloudflare Workers
npm run db:generate         # generate a new Drizzle migration after editing lib/db/schema/*
npm run db:migrate:local    # apply pending migrations to local D1
npm run db:migrate:remote   # apply pending migrations to the real D1 database (needs wrangler login)
npm run db:studio           # browse local D1 data
npm run cf-typegen          # regenerate cloudflare-env.d.ts after changing wrangler.jsonc bindings
```

## Project structure

```
app/                marketing, catalogue, opportunities, admin routes (App Router)
components/ui/       brand-token-driven primitives (Button, Container, Logo)
components/sections/ bespoke, composition-first per-page-section layouts
lib/db/schema/       Drizzle schema, one file per domain module
lib/db/client.ts     getDb() — D1 binding via getCloudflareContext()
lib/brand.ts         site identity, nav, footer structure (single source of truth)
public/brand/        logo assets extracted from the brand guide (SVG + favicon PNGs)
drizzle/             generated SQL migrations
```
