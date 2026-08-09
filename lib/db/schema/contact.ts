import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export type ContactStatus = "new" | "in_progress" | "resolved";

/** The Contact page form ("Let's Talk Technology"). */
export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
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
  archivedAt: timestamp("archived_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
