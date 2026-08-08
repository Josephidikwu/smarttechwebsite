import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

/**
 * Server-only. Call from Route Handlers, Server Actions and Server
 * Components — never from client components. Reads the `DB` D1 binding
 * declared in wrangler.jsonc.
 */
export function getDb() {
  const { env } = getCloudflareContext();
  return drizzle(env.DB, { schema });
}

/** Use in statically-generated routes (see OpenNext docs on async context). */
export async function getDbAsync() {
  const { env } = await getCloudflareContext({ async: true });
  return drizzle(env.DB, { schema });
}
