"use client";

import Script from "next/script";

/**
 * Renders nothing if no site key is configured yet (see docs/SETUP.md) so
 * forms stay usable during early development — `lib/turnstile.ts` mirrors
 * this by skipping server-side verification only in that same state.
 */
export function TurnstileWidget({ action }: { action: string }) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  if (!siteKey) return null;

  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
      <div className="cf-turnstile" data-sitekey={siteKey} data-action={action} />
    </>
  );
}
