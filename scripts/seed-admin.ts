/**
 * Bootstraps the first super_admin account — the only way in, since there's
 * no public signup. Runs directly against DATABASE_URL (Neon).
 *
 * Usage:
 *   ADMIN_NAME="Jane Doe" ADMIN_EMAIL=jane@example.com ADMIN_PASSWORD="…" \
 *     npm run seed:admin
 *
 * Env vars, not CLI args, so the password never lands in shell history.
 * Point DATABASE_URL at whichever Neon branch you want to seed (local .env.local
 * for dev, or pass it inline for a one-off against production).
 */
import { eq } from "drizzle-orm";
import { hashPassword } from "../lib/auth/password";
import { getDb } from "../lib/db/client";
import { users } from "../lib/db/schema";

async function main() {
  const name = process.env.ADMIN_NAME;
  const email = process.env.ADMIN_EMAIL?.toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!name || !email || !password) {
    console.error(
      "Set ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD env vars first, e.g.:\n" +
        '  ADMIN_NAME="Jane Doe" ADMIN_EMAIL=jane@example.com ADMIN_PASSWORD="a-strong-password" ' +
        "npm run seed:admin",
    );
    process.exit(1);
  }
  if (password.length < 12) {
    console.error("ADMIN_PASSWORD must be at least 12 characters.");
    process.exit(1);
  }
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set — point it at the Neon branch you want to seed.");
    process.exit(1);
  }

  const db = getDb();
  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email));
  if (existing) {
    console.error(`A user with email ${email} already exists (id ${existing.id}) — nothing to do.`);
    process.exit(1);
  }

  const passwordHash = await hashPassword(password);
  const [created] = await db
    .insert(users)
    .values({ name, email, passwordHash, role: "super_admin" })
    .returning({ id: users.id });

  console.log(`\nCreated super_admin "${name}" <${email}> (id ${created.id}). Sign in at /admin/login.\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
