// Typed `process.env` access for the server-only env vars this app reads.
// Public (`NEXT_PUBLIC_*`) vars are typed the same way but also bundled
// client-side by Next.js — see docs/SETUP.md for where each one comes from.
declare namespace NodeJS {
  interface ProcessEnv {
    /** Neon connection string. */
    DATABASE_URL: string;
    /** Vercel Blob read-write token (auto-set when a store is connected to the project). */
    BLOB_READ_WRITE_TOKEN?: string;
    /** 32-byte base64 key for encrypting the SMTP password at rest — `openssl rand -base64 32`. */
    SETTINGS_ENCRYPTION_KEY: string;
    /** Turnstile secret key — server-side siteverify only, never exposed to the client. */
    TURNSTILE_SECRET_KEY?: string;
    /** Inbox that receives "new submission" notifications for every pipeline. */
    ADMIN_NOTIFICATION_EMAIL?: string;

    NEXT_PUBLIC_SITE_URL: string;
    NEXT_PUBLIC_GA_MEASUREMENT_ID?: string;
    NEXT_PUBLIC_TURNSTILE_SITE_KEY?: string;
  }
}
