import { sql } from "drizzle-orm";
import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./core";

export type BlogPostStatus = "draft" | "scheduled" | "published";

// Technology, AI, Software, Gadgets, Business Technology, Digital Transformation,
// Career & Skills, Training
export const blogCategories = sqliteTable("blog_categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
});

export const blogTags = sqliteTable("blog_tags", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
});

export const blogPosts = sqliteTable("blog_posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  featuredImageKey: text("featured_image_key"),
  categoryId: integer("category_id").references(() => blogCategories.id, {
    onDelete: "set null",
  }),
  authorId: integer("author_id").references(() => users.id, { onDelete: "set null" }),
  status: text("status").$type<BlogPostStatus>().notNull().default("draft"),
  publishedAt: integer("published_at", { mode: "timestamp" }),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const blogPostTags = sqliteTable(
  "blog_post_tags",
  {
    postId: integer("post_id")
      .notNull()
      .references(() => blogPosts.id, { onDelete: "cascade" }),
    tagId: integer("tag_id")
      .notNull()
      .references(() => blogTags.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.postId, t.tagId] })],
);
