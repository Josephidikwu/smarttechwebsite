import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/rbac";
import { getDb } from "@/lib/db/client";
import { blogCategories } from "@/lib/db/schema";
import { createBlogPost } from "@/lib/actions/blog-admin";
import { BlogPostForm } from "@/components/sections/admin/blog-post-form";

export const metadata: Metadata = { title: "New Article", robots: { index: false } };

export default async function NewBlogPostPage() {
  await requireUser("editor");
  const db = getDb();
  const categoryRows = await db.select({ id: blogCategories.id, name: blogCategories.name }).from(blogCategories);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">New Article</h1>
      <div className="mt-6 max-w-3xl rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-6">
        <BlogPostForm action={createBlogPost} submitLabel="Create Article" categories={categoryRows} />
      </div>
    </div>
  );
}
