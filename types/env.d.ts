// Typed `process.env` access for the server-only env vars this app reads.
// These are all genuine infrastructure/bootstrapping values — anything a
// non-technical admin might reasonably change (GA4 ID, Turnstile keys, the
// notification inbox, webmail/SMTP) lives in the database instead, editable
// from Settings -> Integrations / Settings -> Email in the admin dashboard.
// See lib/settings/site-settings.ts and docs/SETUP.md.
declare namespace NodeJS {
  interface ProcessEnv {
    /** Neon connection string. */
    DATABASE_URL: string;
    /** Vercel Blob read-write token (auto-set when a store is connected to the project). */
    BLOB_READ_WRITE_TOKEN?: string;
    /** 32-byte base64 key for encrypting secrets at rest (SMTP + Turnstile) — `openssl rand -base64 32`. */
    SETTINGS_ENCRYPTION_KEY: string;

    NEXT_PUBLIC_SITE_URL: string;
  }
}
