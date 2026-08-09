import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { requireUser } from "@/lib/auth/rbac";
import { getDb } from "@/lib/db/client";
import { blogPosts, blogCategories } from "@/lib/db/schema";
import { updateBlogPost, deleteBlogPost, getPostTagNames } from "@/lib/actions/blog-admin";
import { BlogPostForm } from "@/components/sections/admin/blog-post-form";
import { DeleteButton } from "@/components/sections/admin/delete-button";

export const metadata: Metadata = { title: "Edit Article", robots: { index: false } };

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  await requireUser("editor");
  const { id } = await params;
  const postId = Number(id);
  if (!Number.isInteger(postId)) notFound();

  const db = getDb();
  const [[post], categoryRows, tagNames] = await Promise.all([
    db.select().from(blogPosts).where(eq(blogPosts.id, postId)).limit(1),
    db.select({ id: blogCategories.id, name: blogCategories.name }).from(blogCategories),
    getPostTagNames(db, postId),
  ]);
  if (!post) notFound();

  const boundAction = updateBlogPost.bind(null, postId);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">
          Edit {post.title}
        </h1>
        <DeleteButton id={post.id} action={deleteBlogPost} confirmMessage={`Delete "${post.title}"?`} />
      </div>
      <div className="mt-6 max-w-3xl rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-6">
        <BlogPostForm
          action={boundAction}
          submitLabel="Save Changes"
          categories={categoryRows}
          initial={{ ...post, tags: tagNames }}
        />
      </div>
    </div>
  );
}
