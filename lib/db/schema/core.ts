import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

/** Staff roles. No public signup — accounts are provisioned by a super_admin. */
export type UserRole = "super_admin" | "admin" | "editor";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").$type<UserRole>().notNull().default("editor"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  lastLoginAt: timestamp("last_login_at"),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(), // random opaque token, not auto-increment
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
});

/**
 * One shared, polymorphic status-log reused by every submission/application
 * pipeline (contact, training, internship, careers, general) instead of a
 * bespoke status-history table per domain. `entityType` is a stable string
 * key (e.g. "contact_submission", "training_application") + `entityId`.
 */
export const statusHistory = pgTable("status_history", {
  id: serial("id").primaryKey(),
  entityType: text("entity_type").notNull(),
  entityId: integer("entity_id").notNull(),
  fromStatus: text("from_status"),
  toStatus: text("to_status").notNull(),
  changedBy: integer("changed_by").references(() => users.id, { onDelete: "set null" }),
  note: text("note"),
  changedAt: timestamp("changed_at").notNull().defaultNow(),
});

/** Free-form site/integration config (SEO defaults, GA4 ID, etc.) editable from the admin. */
export const siteSettings = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  status: text("status").$type<"active" | "unsubscribed">().notNull().default("active"),
  subscribedAt: timestamp("subscribed_at").notNull().defaultNow(),
});

/**
 * Singleton row (id is always 1) holding the admin-configured webmail/SMTP
 * connection used by lib/email/index.ts. The password is never stored in
 * plaintext — see lib/crypto/settings-encryption.ts. Configured from
 * /admin/settings/email; until a row exists, sendMail() no-ops (same
 * graceful-degradation pattern as Turnstile/GA4 before their env vars are set).
 */
export const emailSettings = pgTable("email_settings", {
  id: integer("id").primaryKey().default(1),
  smtpHost: text("smtp_host"),
  smtpPort: integer("smtp_port"),
  smtpSecure: boolean("smtp_secure").notNull().default(true),
  smtpUsername: text("smtp_username"),
  smtpPasswordEncrypted: text("smtp_password_encrypted"),
  fromAddress: text("from_address"),
  fromName: text("from_name"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
