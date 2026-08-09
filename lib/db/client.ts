import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/**
 * Server-only. Call from Route Handlers, Server Actions and Server
 * Components — never from client components. `neon-http` is a plain
 * request/response driver (no pooled connection to manage), which suits
 * Vercel's serverless functions the same way it suited Workers before.
 */
export function getDb() {
  return drizzle(neon(process.env.DATABASE_URL!), { schema });
}
