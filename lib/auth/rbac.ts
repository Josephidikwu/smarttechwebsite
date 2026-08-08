import "server-only";
import { redirect } from "next/navigation";
import { getSessionUser, type SessionUser } from "@/lib/auth/session";
import type { UserRole } from "@/lib/db/schema";

const ROLE_RANK: Record<UserRole, number> = {
  editor: 0,
  admin: 1,
  super_admin: 2,
};

export function hasRole(user: SessionUser, minRole: UserRole): boolean {
  return ROLE_RANK[user.role] >= ROLE_RANK[minRole];
}

/**
 * Server Component / Server Action guard. Redirects to login (or a 403-ish
 * redirect back to the dashboard) rather than just hiding UI — render-time
 * gating alone isn't a security boundary, every admin route/action calls
 * this itself.
 */
export async function requireUser(minRole: UserRole = "editor"): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  if (!hasRole(user, minRole)) redirect("/admin");
  return user;
}
