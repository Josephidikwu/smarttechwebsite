import type { MetadataRoute } from "next";
import { eq, and, lte } from "drizzle-orm";
import { site } from "@/lib/brand";
import { getDbAsync } from "@/lib/db/client";
import { products, trainingProgrammes, internships, jobs, blogPosts } from "@/lib/db/schema";

// Reflects live admin-managed content — never frozen at build time.
export const dynamic = "force-dynamic";

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
  "/opportunities/careers/general",
  "/our-companies",
  "/insights",
  "/contact",
  "/quote",
  "/legal/privacy-policy",
  "/legal/terms-of-use",
  "/legal/cookie-policy",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const db = await getDbAsync();

  const [productRows, trainingRows, internshipRows, jobRows, postRows] = await Promise.all([
    db.select({ slug: products.slug, updatedAt: products.updatedAt }).from(products).where(eq(products.status, "published")),
    db
      .select({ slug: trainingProgrammes.slug, updatedAt: trainingProgrammes.updatedAt })
      .from(trainingProgrammes)
      .where(eq(trainingProgrammes.status, "open")),
    db
      .select({ slug: internships.slug, updatedAt: internships.updatedAt })
      .from(internships)
      .where(eq(internships.status, "open")),
    db.select({ slug: jobs.slug, updatedAt: jobs.updatedAt }).from(jobs).where(eq(jobs.status, "open")),
    db
      .select({ slug: blogPosts.slug, updatedAt: blogPosts.updatedAt })
      .from(blogPosts)
      .where(and(eq(blogPosts.status, "published"), lte(blogPosts.publishedAt, new Date()))),
  ]);

  const dynamicEntries: MetadataRoute.Sitemap = [
    ...productRows.map((p) => ({ url: `${site.url}/products/${p.slug}`, lastModified: p.updatedAt })),
    ...trainingRows.map((t) => ({
      url: `${site.url}/opportunities/training/${t.slug}`,
      lastModified: t.updatedAt,
    })),
    ...internshipRows.map((i) => ({
      url: `${site.url}/opportunities/internship/${i.slug}`,
      lastModified: i.updatedAt,
    })),
    ...jobRows.map((j) => ({ url: `${site.url}/opportunities/careers/${j.slug}`, lastModified: j.updatedAt })),
    ...postRows.map((p) => ({ url: `${site.url}/insights/${p.slug}`, lastModified: p.updatedAt })),
  ];

  return [
    ...staticRoutes.map((path) => ({ url: `${site.url}${path}`, lastModified: new Date() })),
    ...dynamicEntries,
  ];
}
