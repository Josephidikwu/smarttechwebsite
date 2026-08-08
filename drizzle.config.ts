import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  driver: "d1-http",
  schema: "./lib/db/schema/index.ts",
  out: "./drizzle",
  dbCredentials: {
    // These are only used by `drizzle-kit` when talking to the *remote* D1
    // HTTP API directly (rare). Local/migrate workflows go through the
    // `db:migrate:local` / `db:migrate:remote` wrangler scripts instead, so
    // these can stay empty for day-to-day work.
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID ?? "",
    databaseId: process.env.CLOUDFLARE_DATABASE_ID ?? "",
    token: process.env.CLOUDFLARE_D1_TOKEN ?? "",
  },
});
