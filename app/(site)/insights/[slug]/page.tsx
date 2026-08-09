import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { Container } from "@/components/ui/container";
import { getDb } from "@/lib/db/client";
import { blogPosts, blogCategories, users } from "@/lib/db/schema";

// Reads live article data (admin-managed) — never statically cached.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const db = getDb();
  const [post] = await db
    .select({
      title: blogPosts.title,
      seoTitle: blogPosts.seoTitle,
      seoDescription: blogPosts.seoDescription,
      excerpt: blogPosts.excerpt,
    })
    .from(blogPosts)
    .where(eq(blogPosts.slug, slug))
    .limit(1);
  if (!post) return { title: "Article" };
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || undefined,
  };
}

export default async function InsightArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = getDb();
  const [post] = await db
    .select({
      id: blogPosts.id,
      title: blogPosts.title,
      content: blogPosts.content,
      publishedAt: blogPosts.publishedAt,
      status: blogPosts.status,
      categoryName: blogCategories.name,
      authorName: users.name,
    })
    .from(blogPosts)
    .leftJoin(blogCategories, eq(blogPosts.categoryId, blogCategories.id))
    .leftJoin(users, eq(blogPosts.authorId, users.id))
    .where(eq(blogPosts.slug, slug))
    .limit(1);

  if (!post || post.status !== "published" || !post.publishedAt || post.publishedAt > new Date()) {
    notFound();
  }

  return (
    <article className="pt-16 pb-28 lg:pt-24">
      <Container className="max-w-3xl">
        <div className="flex items-center gap-3">
          {post.categoryName && (
            <span className="text-xs font-medium tracking-wide text-[var(--color-brand-blue)] uppercase">
              {post.categoryName}
            </span>
          )}
          <span className="text-xs text-[var(--color-ink-muted)]">
            {new Date(post.publishedAt).toLocaleDateString()}
            {post.authorName ? ` · ${post.authorName}` : ""}
          </span>
        </div>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-[var(--color-ink)]">
          {post.title}
        </h1>
        <div className="mt-10 flex flex-col gap-5 text-[var(--color-ink-muted)] whitespace-pre-wrap">
          {post.content}
        </div>
      </Container>
    </article>
  );
}
