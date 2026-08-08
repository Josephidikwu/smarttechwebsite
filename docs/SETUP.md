# Setup — steps that need your accounts

Everything in this repo that doesn't require your credentials is done. These steps need your
Cloudflare account (and a couple of others) — I can't do them from here since `wrangler` isn't
authenticated in this environment.

## 1. Cloudflare login

```sh
npx wrangler login
```

## 2. Create the D1 database

```sh
npx wrangler d1 create smarttechwebsite-db
```

Copy the `database_id` it prints into `wrangler.jsonc` → `d1_databases[0].database_id` (currently
`REPLACE_WITH_D1_DATABASE_ID`). Then apply migrations to the real (remote) database:

```sh
npm run db:migrate:remote
```

(Local dev already works without this — `npm run db:migrate:local` was run during scaffolding and
uses a local SQLite file, no login required.)

## 3. Create the R2 bucket

```sh
npx wrangler r2 bucket create smarttechwebsite-uploads
```

No further config needed — `wrangler.jsonc` already points at this bucket name.

## 4. Domain name

Needed before the next three steps. Once you've picked/confirmed the domain:

- Onboard Cloudflare Email Service: `npx wrangler email sending enable <your-domain>`
- Update `NEXT_PUBLIC_SITE_URL` in `wrangler.jsonc` (`vars`) and `.env.local`
- Point the zone at Cloudflare if it isn't already, for Turnstile/WAF/rate-limiting to apply

## 5. Google Analytics 4

Create a GA4 property, grab the Measurement ID (`G-XXXXXXX`), and set it as
`NEXT_PUBLIC_GA_MEASUREMENT_ID` in `.env.local` (dev) and `wrangler.jsonc` → `vars` (prod). Wiring
the actual `gtag.js` + conversion events happens in M9, but the ID can be dropped in whenever
you have it.

## 6. Cloudflare Turnstile

Create a Turnstile widget for the domain, then set:

- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (public, `.env.local` / `wrangler.jsonc` vars)
- `TURNSTILE_SECRET_KEY` (secret — `.dev.vars` locally, `npx wrangler secret put
  TURNSTILE_SECRET_KEY` in production; never committed)

## 7. Google Search Console

Once deployed to the real domain: verify via DNS or meta tag, submit `sitemap.xml`, request
indexing for key pages. This is an M9/M10-time step, not needed now.

## Admin access

There's no public signup — the first account has to be seeded directly:

```sh
ADMIN_NAME="Your Name" ADMIN_EMAIL=you@example.com ADMIN_PASSWORD="a-strong-password" \
  npm run seed:admin
```

This prints a `wrangler d1 execute` command (against local D1 by default, `--remote` for
production) rather than running it for you — review it, then run it. From there, sign in at
`/admin/login` and add colleagues from Settings → Users (super_admin only).

## Local development (works today, no account needed)

```sh
npm run dev              # next dev — fast iteration
npm run db:migrate:local # (re-)apply Drizzle migrations to local D1
npm run db:studio        # browse local D1 data
npm run preview          # opennextjs-cloudflare build + preview — closest to production (workerd runtime)
```
