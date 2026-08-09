"use client";

import Script from "next/script";

/**
 * Renders nothing if no site key is configured yet (see Settings ->
 * Integrations in the admin dashboard) so forms stay usable during early
 * development — `lib/turnstile.ts` mirrors this by skipping server-side
 * verification only in that same state. `siteKey` is fetched server-side by
 * the page that renders this (see lib/settings/site-settings.ts) rather than
 * read from an env var, so it can change without a redeploy.
 */
export function TurnstileWidget({ action, siteKey }: { action: string; siteKey: string | null }) {
  if (!siteKey) return null;

  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
      <div className="cf-turnstile" data-sitekey={siteKey} data-action={action} />
    </>
  );
}
