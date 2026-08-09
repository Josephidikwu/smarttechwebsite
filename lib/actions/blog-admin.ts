"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { blogCategories, blogTags, blogPosts, blogPostTags } from "@/lib/db/schema";
import { blogTaxonomySchema, blogPostSchema } from "@/lib/validation/schemas";
import { requireUser } from "@/lib/auth/rbac";
import { slugify } from "@/lib/utils/slugify";

export type SimpleFormState = { errors?: Record<string, string[]>; formError?: string };

async function uniqueSlug(
  db: ReturnType<typeof getDb>,
  table: typeof blogCategories | typeof blogTags | typeof blogPosts,
  name: string,
) {
  const baseSlug = slugify(name);
  let slug = baseSlug;
  let n = 1;
  for (;;) {
    const [existing] = await db.select({ id: table.id }).from(table).where(eq(table.slug, slug));
    if (!existing) return slug;
    slug = `${baseSlug}-${++n}`;
  }
}

// ---------------------------------------------------------------- Taxonomy

export async function createBlogCategory(
  _prevState: SimpleFormState,
  formData: FormData,
): Promise<SimpleFormState> {
  await requireUser("editor");
  const parsed = blogTaxonomySchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  const db = getDb();
  const slug = await uniqueSlug(db, blogCategories, parsed.data.name);
  await db.insert(blogCategories).values({ name: parsed.data.name, slug });

  revalidatePath("/admin/insights/categories");
  return {};
}

export async function deleteBlogCategory(id: number) {
  await requireUser("editor");
  await getDb().delete(blogCategories).where(eq(blogCategories.id, id));
  revalidatePath("/admin/insights/categories");
}

async function findOrCreateTags(db: ReturnType<typeof getDb>, tagNames: string[]): Promise<number[]> {
  const ids: number[] = [];
  for (const rawName of tagNames) {
    const name = rawName.trim();
    if (!name) continue;
    const slug = slugify(name);
    const [existing] = await db.select({ id: blogTags.id }).from(blogTags).where(eq(blogTags.slug, slug));
    if (existing) {
      ids.push(existing.id);
    } else {
      const [created] = await db.insert(blogTags).values({ name, slug }).returning({ id: blogTags.id });
      ids.push(created.id);
    }
  }
  return ids;
}

// ------------------------------------------------------------------- Posts

export type BlogPostFormState = { errors?: Record<string, string[]>; formError?: string };

function parseBlogPostForm(formData: FormData) {
  return blogPostSchema.safeParse({
    title: formData.get("title"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    categoryId: formData.get("categoryId"),
    tags: formData.get("tags"),
    status: formData.get("status"),
    publishedAt: formData.get("publishedAt"),
    seoTitle: formData.get("seoTitle"),
    seoDescription: formData.get("seoDescription"),
  });
}

function resolvePublishedAt(status: string, publishedAt: string) {
  if (status === "published") return publishedAt ? new Date(publishedAt) : new Date();
  if (status === "scheduled") return publishedAt ? new Date(publishedAt) : null;
  return null;
}

export async function createBlogPost(
  _prevState: BlogPostFormState,
  formData: FormData,
): Promise<BlogPostFormState> {
  const user = await requireUser("editor");
  const parsed = parseBlogPostForm(formData);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  const db = getDb();
  const slug = await uniqueSlug(db, blogPosts, parsed.data.title);
  const tagIds = await findOrCreateTags(
    db,
    parsed.data.tags ? parsed.data.tags.split(",") : [],
  );

  const [post] = await db
    .insert(blogPosts)
    .values({
      title: parsed.data.title,
      slug,
      excerpt: parsed.data.excerpt || null,
      content: parsed.data.content,
      categoryId: parsed.data.categoryId ? Number(parsed.data.categoryId) : null,
      authorId: user.id,
      status: parsed.data.status,
      publishedAt: resolvePublishedAt(parsed.data.status, parsed.data.publishedAt ?? ""),
      seoTitle: parsed.data.seoTitle || null,
      seoDescription: parsed.data.seoDescription || null,
    })
    .returning({ id: blogPosts.id });

  if (tagIds.length > 0) {
    await db.insert(blogPostTags).values(tagIds.map((tagId) => ({ postId: post.id, tagId })));
  }

  revalidatePath("/admin/insights");
  revalidatePath("/insights");
  redirect("/admin/insights");
}

export async function updateBlogPost(
  id: number,
  _prevState: BlogPostFormState,
  formData: FormData,
): Promise<BlogPostFormState> {
  await requireUser("editor");
  const parsed = parseBlogPostForm(formData);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  const db = getDb();
  await db
    .update(blogPosts)
    .set({
      title: parsed.data.title,
      excerpt: parsed.data.excerpt || null,
      content: parsed.data.content,
      categoryId: parsed.data.categoryId ? Number(parsed.data.categoryId) : null,
      status: parsed.data.status,
      publishedAt: resolvePublishedAt(parsed.data.status, parsed.data.publishedAt ?? ""),
      seoTitle: parsed.data.seoTitle || null,
      seoDescription: parsed.data.seoDescription || null,
      updatedAt: new Date(),
    })
    .where(eq(blogPosts.id, id));

  const tagIds = await findOrCreateTags(
    db,
    parsed.data.tags ? parsed.data.tags.split(",") : [],
  );
  await db.delete(blogPostTags).where(eq(blogPostTags.postId, id));
  if (tagIds.length > 0) {
    await db.insert(blogPostTags).values(tagIds.map((tagId) => ({ postId: id, tagId })));
  }

  revalidatePath("/admin/insights");
  revalidatePath("/insights");
  redirect("/admin/insights");
}

export async function deleteBlogPost(id: number) {
  await requireUser("editor");
  const db = getDb();
  await db.delete(blogPostTags).where(eq(blogPostTags.postId, id));
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
  revalidatePath("/admin/insights");
  redirect("/admin/insights");
}

export async function getPostTagNames(db: ReturnType<typeof getDb>, postId: number) {
  const rows = await db
    .select({ name: blogTags.name })
    .from(blogPostTags)
    .innerJoin(blogTags, eq(blogPostTags.tagId, blogTags.id))
    .where(eq(blogPostTags.postId, postId));
  return rows.map((r) => r.name).join(", ");
}
