import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export type StockStatus = "in_stock" | "out_of_stock" | "contact_us";
export type ProductStatus = "draft" | "published";
export type EnquiryStatus = "new" | "in_progress" | "resolved";

export const brands = sqliteTable("brands", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  logoKey: text("logo_key"), // R2 object key
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  // e.g. Laptops & Computers, Audio & Headphones, Accessories, Networking, Gadgets
  parentId: integer("parent_id"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

/**
 * E-commerce-ready from day one (SKU, price, stock, specs, images, featured)
 * even though Phase 1 ships no cart/checkout. Phase 2 adds `cart`, `orders`,
 * `customers`, `payments`, `shipping`, `discounts` referencing this table —
 * no rebuild of the product model itself.
 */
export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  categoryId: integer("category_id").references(() => categories.id, { onDelete: "set null" }),
  brandId: integer("brand_id").references(() => brands.id, { onDelete: "set null" }),
  sku: text("sku"),
  price: real("price"),
  currency: text("currency").notNull().default("NGN"),
  stockStatus: text("stock_status").$type<StockStatus>().notNull().default("contact_us"),
  // { processor, memory, storage, display, connectivity, battery, os, other: {...} }
  specifications: text("specifications", { mode: "json" }).$type<Record<string, string>>(),
  description: text("description"),
  images: text("images", { mode: "json" }).$type<string[]>().default(sql`'[]'`), // R2 object keys
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  status: text("status").$type<ProductStatus>().notNull().default("draft"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

/** "Request This Product" / "Request Bulk Quote" from a product detail page. */
export const productEnquiries = sqliteTable("product_enquiries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  type: text("type").$type<"request" | "bulk_quote">().notNull().default("request"),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  organisation: text("organisation"),
  message: text("message"),
  status: text("status").$type<EnquiryStatus>().notNull().default("new"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

/**
 * General procurement/project quote requests (Request a Quote page,
 * Procurement page). `productId` is nullable so this also covers
 * product-tied bulk quotes without a duplicate table.
 */
export const quoteRequests = sqliteTable("quote_requests", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  productId: integer("product_id").references(() => products.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  organisation: text("organisation"),
  email: text("email").notNull(),
  phone: text("phone"),
  whatDoYouNeed: text("what_do_you_need").notNull(),
  budgetRange: text("budget_range"),
  description: text("description"),
  attachmentKey: text("attachment_key"), // R2 object key
  preferredContactMethod: text("preferred_contact_method"),
  status: text("status").$type<EnquiryStatus>().notNull().default("new"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});
