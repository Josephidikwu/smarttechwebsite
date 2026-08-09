import type { NextConfig } from "next";

// Third-party origins the site actually talks to — keep this list in sync
// with what's really loaded (Turnstile, GA4) rather than opening it wider
// than necessary.
const isDev = process.env.NODE_ENV !== "production";

const csp = [
  "default-src 'self'",
  // 'unsafe-inline' is needed for the GA4 inline init snippet and the
  // per-page JSON-LD <script> tags (no nonce plumbing yet — see M10 notes
  // in docs/SETUP.md if tightening this further).
  // 'unsafe-eval' is dev-only — Turbopack/React Fast Refresh use eval() for
  // HMR and never in production (confirmed by React's own dev warning), so
  // it's added only when NODE_ENV !== "production" and never ships live.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com https://challenges.cloudflare.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://challenges.cloudflare.com",
  "frame-src https://challenges.cloudflare.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // Only meaningful once served over HTTPS on the real domain — harmless locally.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // Cloudflare's Image Resizing handles optimization in production via the
    // `images` binding wired up in wrangler.jsonc; keep Next's default loader
    // for local dev.
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
