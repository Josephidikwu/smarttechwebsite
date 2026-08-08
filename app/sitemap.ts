import type { MetadataRoute } from "next";
import { site } from "@/lib/brand";

// Static routes only for now — dynamic entries (products, training
// programmes, jobs, blog posts) are added as each backs onto real data in
// M4–M8.
const staticRoutes = [
  "",
  "/about",
  "/about/our-story",
  "/solutions",
  "/solutions/procurement",
  "/solutions/software",
  "/solutions/ai",
  "/solutions/data",
  "/solutions/it-infrastructure",
  "/solutions/web-digital",
  "/products",
  "/opportunities",
  "/opportunities/training",
  "/opportunities/internship",
  "/opportunities/careers",
  "/our-companies",
  "/insights",
  "/contact",
  "/quote",
  "/legal/privacy-policy",
  "/legal/terms-of-use",
  "/legal/cookie-policy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return staticRoutes.map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
  }));
}
