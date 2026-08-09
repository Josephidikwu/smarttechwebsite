import type { Metadata } from "next";
import Link from "next/link";
import { and, desc, eq, lte } from "drizzle-orm";
import { Container } from "@/components/ui/container";
import { getDb } from "@/lib/db/client";
import { blogPosts, blogCategories } from "@/lib/db/schema";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Ideas, technology & opportunities — perspectives, guides and useful information around technology, artificial intelligence, digital transformation, gadgets, careers and the evolving digital economy.",
};

// Reads live article data (admin-managed) — never statically cached.
export const dynamic = "force-dynamic";

export default async function InsightsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const db = getDb();

  const categoryRows = await db.select().from(blogCategories);
  const activeCategory = category ? categoryRows.find((c) => c.slug === category) : undefined;

  const conditions = [eq(blogPosts.status, "published"), lte(blogPosts.publishedAt, new Date())];
  if (activeCategory) conditions.push(eq(blogPosts.categoryId, activeCategory.id));

  const posts = await db
    .select({
      id: blogPosts.id,
      title: blogPosts.title,
      slug: blogPosts.slug,
      excerpt: blogPosts.excerpt,
      publishedAt: blogPosts.publishedAt,
      categoryName: blogCategories.name,
    })
    .from(blogPosts)
    .leftJoin(blogCategories, eq(blogPosts.categoryId, blogCategories.id))
    .where(and(...conditions))
    .orderBy(desc(blogPosts.publishedAt));

  return (
    <section className="pt-16 pb-28 lg:pt-24 lg:pb-36">
      <Container>
        <p className="text-sm font-medium tracking-wide text-[var(--color-brand-blue)] uppercase">
          Insights
        </p>
        <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight text-[var(--color-ink)] sm:text-5xl">
          Ideas, Technology &amp; Opportunities
        </h1>
        <p className="mt-6 max-w-xl text-[var(--color-ink-muted)]">
          Explore perspectives, guides and useful information around technology, artificial
          intelligence, digital transformation, gadgets, careers and the evolving digital economy.
        </p>

        {categoryRows.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2">
            <Link
              href="/insights"
              className={`rounded-full border px-4 py-1.5 text-sm ${!activeCategory ? "border-[var(--color-brand-blue)] text-[var(--color-brand-blue)]" : "border-[var(--color-border)] text-[var(--color-ink-muted)]"}`}
            >
              All
            </Link>
            {categoryRows.map((c) => (
              <Link
                key={c.id}
                href={`/insights?category=${c.slug}`}
                className={`rounded-full border px-4 py-1.5 text-sm ${activeCategory?.id === c.id ? "border-[var(--color-brand-blue)] text-[var(--color-brand-blue)]" : "border-[var(--color-border)] text-[var(--color-ink-muted)]"}`}
              >
                {c.name}
              </Link>
            ))}
          </div>
        )}

        {posts.length > 0 ? (
          <div className="mt-12 divide-y divide-[var(--color-border)] border-t border-[var(--color-border)]">
            {posts.map((p) => (
              <Link key={p.id} href={`/insights/${p.slug}`} className="group flex flex-col gap-2 py-8">
                <div className="flex items-center gap-3">
                  {p.categoryName && (
                    <span className="text-xs font-medium tracking-wide text-[var(--color-brand-blue)] uppercase">
                      {p.categoryName}
                    </span>
                  )}
                  {p.publishedAt && (
                    <span className="text-xs text-[var(--color-ink-muted)]">
                      {new Date(p.publishedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-brand-blue)]">
                  {p.title}
                </h2>
                {p.excerpt && <p className="text-sm text-[var(--color-ink-muted)]">{p.excerpt}</p>}
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-16 text-sm text-[var(--color-ink-muted)]">
            Articles are on their way — check back soon.
          </p>
        )}
      </Container>
    </section>
  );
}
