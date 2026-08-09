"use client";

import Script from "next/script";

/**
 * Renders nothing until NEXT_PUBLIC_GA_MEASUREMENT_ID is set (see
 * docs/SETUP.md) — mirrors the same graceful-degradation pattern as
 * TurnstileWidget, so the site works fully before analytics is configured.
 */
export function GA4Script() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
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
