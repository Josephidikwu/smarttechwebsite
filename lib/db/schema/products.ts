import { boolean, integer, jsonb, numeric, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export type StockStatus = "in_stock" | "out_of_stock" | "contact_us";
export type ProductStatus = "draft" | "published";
export type EnquiryStatus = "new" | "in_progress" | "resolved";

export const brands = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  logoKey: text("logo_key"), // Blob object key
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  // e.g. Laptops & Computers, Audio & Headphones, Accessories, Networking, Gadgets
  parentId: integer("parent_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/**
 * E-commerce-ready from day one (SKU, price, stock, specs, images, featured)
 * even though Phase 1 ships no cart/checkout. Phase 2 adds `cart`, `orders`,
 * `customers`, `payments`, `shipping`, `discounts` referencing this table —
 * no rebuild of the product model itself.
 */
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  categoryId: integer("category_id").references(() => categories.id, { onDelete: "set null" }),
  brandId: integer("brand_id").references(() => brands.id, { onDelete: "set null" }),
  sku: text("sku"),
  // mode: "number" keeps this a JS number in application code (existing UI
  // calls .toLocaleString() on it) while numeric(10,2) still enforces exact
  // decimal storage at the DB level — safe for this price range.
  price: numeric("price", { precision: 10, scale: 2, mode: "number" }),
  currency: text("currency").notNull().default("NGN"),
  stockStatus: text("stock_status").$type<StockStatus>().notNull().default("contact_us"),
  // { processor, memory, storage, display, connectivity, battery, os, other: {...} }
  specifications: jsonb("specifications").$type<Record<string, string>>(),
  description: text("description"),
  images: jsonb("images").$type<string[]>().default([]), // Blob object keys
  featured: boolean("featured").notNull().default(false),
  status: text("status").$type<ProductStatus>().notNull().default("draft"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/** "Request This Product" / "Request Bulk Quote" from a product detail page. */
export const productEnquiries = pgTable("product_enquiries", {
  id: serial("id").primaryKey(),
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
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/**
 * General procurement/project quote requests (Request a Quote page,
 * Procurement page). `productId` is nullable so this also covers
 * product-tied bulk quotes without a duplicate table.
 */
export const quoteRequests = pgTable("quote_requests", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  organisation: text("organisation"),
  email: text("email").notNull(),
  phone: text("phone"),
  whatDoYouNeed: text("what_do_you_need").notNull(),
  budgetRange: text("budget_range"),
  description: text("description"),
  attachmentKey: text("attachment_key"), // Blob object key
  preferredContactMethod: text("preferred_contact_method"),
  status: text("status").$type<EnquiryStatus>().notNull().default("new"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
