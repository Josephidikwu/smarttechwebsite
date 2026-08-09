# Setup — steps that need your accounts

Everything in this repo that doesn't require your credentials is done. These steps need your
Neon and Vercel accounts — I can't do them from here since neither is authenticated in this
environment.

Only genuine infrastructure/bootstrapping values are env vars (see `.env.example`). Everything a
non-technical admin might reasonably want to change — GA4 ID, Turnstile keys, the notification
inbox, webmail/SMTP — is configured from the admin dashboard once deployed, not here, and takes
effect without a redeploy.

## 1. Create the Neon project

1. Sign up / log in at [neon.tech](https://neon.tech), create a project.
2. Copy the connection string from **Connection Details** (it looks like
   `postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require`).
3. Put it in `.env.local` as `DATABASE_URL` (copy `.env.example` to `.env.local` first).
4. Apply migrations:

```sh
npm run db:migrate
```

The free tier (0.5GB storage, 100 compute-hours/month) comfortably covers a launch-stage site.

## 2. Create the Vercel project

1. Import this GitHub repo at [vercel.com/new](https://vercel.com/new).
2. **This needs the Pro plan ($20/month)** — Vercel's free Hobby plan is restricted to
   non-commercial personal use per their fair use guidelines, and this is a company's commercial
   site.
3. Add environment variables (Project → Settings → Environment Variables): `DATABASE_URL`,
   `SETTINGS_ENCRYPTION_KEY`, `NEXT_PUBLIC_SITE_URL` — see `.env.example` for what each one is
   for. `BLOB_READ_WRITE_TOKEN` gets added automatically in step 4.
4. Every push to `main` deploys automatically once the project is connected — no separate deploy
   command needed.

## 3. Generate SETTINGS_ENCRYPTION_KEY

Encrypts the webmail (SMTP) password and the Turnstile secret key at rest — both are set later,
from the admin dashboard, never as env vars.

```sh
openssl rand -base64 32
```

Put the output in `.env.local` (dev) and the Vercel project's env vars (production) as
`SETTINGS_ENCRYPTION_KEY`. Losing this key means re-entering both secrets later; it's not
recoverable from the encrypted values already in the database.

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

## 6. Sign in and configure the rest from the admin dashboard

Everything past this point is a page in the app, not a setup-doc step:

1. Sign in at `/admin/login` (see **Admin access** below to create the first account).
2. **Settings → Email (Webmail)** — enter SMTP host/port/username/password from your email
   provider (Gmail, Zoho, Outlook, or any host that offers SMTP), then **Send Test Email** to
   confirm before relying on it. Every notification email (contact enquiries, application
   confirmations, product enquiries, quote requests) goes through this mailbox once set.
3. **Settings → Integrations**:
   - **Analytics** — GA4 Measurement ID (`G-XXXXXXX`) from a GA4 property. The `gtag.js` snippet,
     route-change page views, and conversion events (`contact_form_submit`, `product_enquiry`,
     `training_application`, `internship_application`, `career_application`,
     `general_application`, `quote_request`) are already wired in.
   - **Notifications** — which inbox receives the "new submission" alerts (separate from the
     webmail mailbox that *sends* them — this is just the recipient address).
   - **Security (Turnstile)** — create a widget for your domain at
     [dash.cloudflare.com](https://dash.cloudflare.com) → Turnstile (Turnstile itself is
     unaffected by the Neon/Vercel move, it's a standalone anti-spam widget), then paste the site
     key and secret key here.

Every one of these is optional — the site works fully with none of them set, each feature just
no-ops (with a console warning) until its value is saved.

## 7. Rate limiting

Vercel's platform includes DDoS mitigation and a Web Application Firewall by default (see
Project → Security). For the public submission endpoints specifically (contact, quote, product
enquiry, training/internship/career applications, newsletter), add custom WAF rate-limiting rules
once the domain is live. `/admin/login` deserves a tighter rule too, since it isn't behind
Turnstile today.

## 8. Google Search Console

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
