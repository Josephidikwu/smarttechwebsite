import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Cloudflare's Image Resizing handles optimization in production via the
    // `images` binding wired up in wrangler.jsonc; keep Next's default loader
    // for local dev.
  },
};

export default nextConfig;

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
