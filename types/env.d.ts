// Augments the generated `cloudflare-env.d.ts` (run `npm run cf-typegen` to
// regenerate that file from wrangler.jsonc bindings/vars). Secrets never go
// in wrangler.jsonc, so they aren't picked up by that generator — declared
// here instead. Local dev: put them in `.dev.vars` (see `.dev.vars.example`).
// Production: `npx wrangler secret put <NAME>`.
declare namespace Cloudflare {
  interface Env {
    /** Turnstile secret key — server-side siteverify only, never exposed to the client. */
    TURNSTILE_SECRET_KEY?: string;
  }
}

interface CloudflareEnv {
  TURNSTILE_SECRET_KEY?: string;
}
