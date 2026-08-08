import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export type ContactStatus = "new" | "in_progress" | "resolved";

/** The Contact page form ("Let's Talk Technology"). */
export const contactSubmissions = sqliteTable("contact_submissions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  organisation: text("organisation"),
  // "What can we help you with?" — Technology Products / Procurement / Software /
  // AI / Data & Analytics / IT Infrastructure / Web & Digital Solutions / Training /
  // Internship / Careers / Other
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").$type<ContactStatus>().notNull().default("new"),
  archivedAt: integer("archived_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});
