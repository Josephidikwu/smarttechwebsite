import { integer, pgTable, primaryKey, serial, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./core";

export type BlogPostStatus = "draft" | "scheduled" | "published";

// Technology, AI, Software, Gadgets, Business Technology, Digital Transformation,
// Career & Skills, Training
export const blogCategories = pgTable("blog_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
});

export const blogTags = pgTable("blog_tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
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
  publishedAt: timestamp("published_at"),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const blogPostTags = pgTable(
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
