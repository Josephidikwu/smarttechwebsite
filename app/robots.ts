import type { MetadataRoute } from "next";
import { site } from "@/lib/brand";

export default function robots(): MetadataRoute.Robots {
  return {
    // Admin pages already carry `robots: { index: false }` in their own
    // metadata; this disallow is defense-in-depth so well-behaved crawlers
    // never fetch /admin/* at all, keeping it out of crawl budget and any
    // cache that might render before the meta tag is read.
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
