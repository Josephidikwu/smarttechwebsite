/**
 * Bootstraps the first super_admin account — the only way in, since there's
 * no public signup. Prints a `wrangler d1 execute` command rather than
 * hitting D1 directly (this script runs in plain Node, not the Workers
 * runtime, so it has no binding access).
 *
 * Usage:
 *   ADMIN_NAME="Jane Doe" ADMIN_EMAIL=jane@example.com ADMIN_PASSWORD="…" \
 *     npx tsx scripts/seed-admin.ts [--remote]
 *
 * Env vars, not CLI args, so the password never lands in shell history.
 */
import { hashPassword } from "../lib/auth/password";

async function main() {
  const name = process.env.ADMIN_NAME;
  const email = process.env.ADMIN_EMAIL?.toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const remote = process.argv.includes("--remote");

  if (!name || !email || !password) {
    console.error(
      "Set ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD env vars first, e.g.:\n" +
        '  ADMIN_NAME="Jane Doe" ADMIN_EMAIL=jane@example.com ADMIN_PASSWORD="a-strong-password" ' +
        "npx tsx scripts/seed-admin.ts",
    );
    process.exit(1);
  }
  if (password.length < 12) {
    console.error("ADMIN_PASSWORD must be at least 12 characters.");
    process.exit(1);
  }

  const passwordHash = await hashPassword(password);
  const escapedName = name.replace(/'/g, "''");
  const escapedEmail = email.replace(/'/g, "''");

  const sql =
    `INSERT INTO users (name, email, password_hash, role) VALUES ` +
    `('${escapedName}', '${escapedEmail}', '${passwordHash}', 'super_admin');`;

  console.log("\nRun this to create the account:\n");
  console.log(
    `npx wrangler d1 execute smarttechwebsite-db ${remote ? "--remote" : "--local"} --command "${sql}"\n`,
  );
}

main();
