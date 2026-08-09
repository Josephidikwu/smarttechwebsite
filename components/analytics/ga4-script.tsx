"use client";

import Script from "next/script";

/**
 * Renders nothing until a GA4 Measurement ID is set at Settings ->
 * Integrations (admin dashboard) — mirrors the same graceful-degradation
 * pattern as TurnstileWidget, so the site works fully before analytics is
 * configured. `measurementId` is fetched server-side (see app/layout.tsx)
 * rather than read from an env var, so it can change without a redeploy.
 */
export function GA4Script({ measurementId }: { measurementId: string | null }) {
  if (!measurementId) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', { send_page_view: false });
        `}
      </Script>
    </>
  );
}
