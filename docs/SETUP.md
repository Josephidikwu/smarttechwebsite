# Setup — steps that need your accounts

Everything in this repo that doesn't require your credentials is done. These steps need your
Neon, Vercel, and a couple of Google accounts — I can't do them from here since none of them are
authenticated in this environment.

## 1. Create the Neon project

1. Sign up / log in at [neon.tech](https://neon.tech), create a project.
2. Copy the connection string from **Connection Details** (it looks like
   `postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require`).
3. Put it in `.env.local` as `DATABASE_URL` (copy `.env.example` to `.env.local` first).
4. Apply migrations:

```sh
npm run db:migrate
```

The free tier (0.5GB storage, 100 compute-hours/month) comfortably covers a launch-stage site —
see the cost breakdown from planning if you want the numbers again.

## 2. Create the Vercel project

1. Import this GitHub repo at [vercel.com/new](https://vercel.com/new).
2. **This needs the Pro plan ($20/month)** — Vercel's free Hobby plan is restricted to
   non-commercial personal use per their fair use guidelines, and this is a company's commercial
   site.
3. Add environment variables (Project → Settings → Environment Variables): `DATABASE_URL`,
   `SETTINGS_ENCRYPTION_KEY`, `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`,
   `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `ADMIN_NOTIFICATION_EMAIL`, `NEXT_PUBLIC_SITE_URL` — see
   `.env.example` for the full list and what each one is for.
4. Every push to `main` deploys automatically once the project is connected — no separate deploy
   command needed.

## 3. Generate SETTINGS_ENCRYPTION_KEY

This encrypts the webmail (SMTP) password at rest — see step 6.

```sh
openssl rand -base64 32
```

Put the output in `.env.local` (dev) and the Vercel project's env vars (production). Losing this
key means re-entering the webmail password later; it's not recoverable from the encrypted value.

## 4. Enable Vercel Blob (file storage)

1. Project → **Storage** tab → **Create Database** → **Blob**.
2. Set access to **Private** — CVs, cover letters, and quote attachments must never be public.
3. Connect it to this project, including the **Development** environment if you want file uploads
   to work locally.
4. Run `vercel env pull` to get `BLOB_READ_WRITE_TOKEN` (and the OIDC-related vars) into
   `.env.local`.

## 5. Domain name

Point your domain at Vercel (Project → Settings → Domains) once you've picked/confirmed it, then
update `NEXT_PUBLIC_SITE_URL` in both `.env.local` and the Vercel project's env vars.

## 6. Configure webmail (SMTP) — now done in the admin dashboard

Unlike the rest of this list, this isn't a setup-doc step — it's a page in the app:

1. Sign in at `/admin/login` (see **Admin access** below to create the first account).
2. Go to **Settings → Email (Webmail)**.
3. Enter the SMTP host/port/username/password from your email provider (Gmail, Zoho, Outlook, or
   any host that offers SMTP — check their SMTP settings page for the exact host/port).
4. Click **Send Test Email** to confirm it works before relying on it — it goes to your own admin
   account's email address.

Every notification email (contact enquiries, application confirmations, product enquiries, quote
requests) goes through this mailbox once configured. Until it's set, the site still works — form
submissions still save to the database, sending just no-ops with a console warning (same pattern
as Turnstile/GA4 before their keys are set).

## 7. Google Analytics 4

Create a GA4 property, grab the Measurement ID (`G-XXXXXXX`), and set it as
`NEXT_PUBLIC_GA_MEASUREMENT_ID` in `.env.local` (dev) and the Vercel project's env vars (prod). The
`gtag.js` snippet, route-change page views, and the conversion events
(`contact_form_submit`, `product_enquiry`, `training_application`, `internship_application`,
`career_application`, `general_application`, `quote_request`) are already wired in — the site
just no-ops on analytics until this ID is set.

## 8. Cloudflare Turnstile

Turnstile itself is unaffected by the Neon/Vercel move — it's a standalone anti-spam widget, not
tied to Cloudflare hosting. Create a widget for your domain at
[dash.cloudflare.com](https://dash.cloudflare.com) → Turnstile, then set:

- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (public, `.env.local` / Vercel env vars)
- `TURNSTILE_SECRET_KEY` (secret — `.env.local` locally, Vercel env vars in production; never
  committed)

## 9. Rate limiting

Vercel's platform includes DDoS mitigation and a Web Application Firewall by default (see
Project → Security). For the public submission endpoints specifically (contact, quote, product
enquiry, training/internship/career applications, newsletter), add custom WAF rate-limiting rules
once the domain is live — Vercel's dashboard equivalent of the Cloudflare zone-level rules this
build was originally going to use. `/admin/login` deserves a tighter rule too, since it isn't
behind Turnstile today.

## 10. Google Search Console

Once deployed to the real domain: verify via DNS or meta tag, submit `sitemap.xml`, request
indexing for key pages.

## Admin access

There's no public signup — the first account has to be seeded directly:

```sh
ADMIN_NAME="Your Name" ADMIN_EMAIL=you@example.com ADMIN_PASSWORD="a-strong-password" \
  npm run seed:admin
```

Run this with `DATABASE_URL` pointed at whichever Neon branch you want to seed. From there, sign
in at `/admin/login` and add colleagues from Settings → Users (super_admin only).

## Local development (works today, no account needed beyond a free Neon project)

```sh
npm run dev          # next dev — fast iteration
npm run db:migrate   # (re-)apply Drizzle migrations to DATABASE_URL
npm run db:studio    # browse DATABASE_URL's data
```
