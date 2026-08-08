import type { Metadata } from "next";
import { desc } from "drizzle-orm";
import { requireUser } from "@/lib/auth/rbac";
import { getDb } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { CreateUserForm } from "@/components/sections/admin/create-user-form";

export const metadata: Metadata = { title: "Users", robots: { index: false } };

export default async function AdminUsersPage() {
  await requireUser("super_admin");

  const db = getDb();
  const allUsers = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      lastLoginAt: users.lastLoginAt,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt));

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">Users</h1>
      <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
        Staff accounts — there&apos;s no public signup, so this is the only way to add colleagues.
      </p>

      <div className="mt-8 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
            <tr>
              <th className="px-5 py-3 font-medium text-[var(--color-ink-muted)]">Name</th>
              <th className="px-5 py-3 font-medium text-[var(--color-ink-muted)]">Email</th>
              <th className="px-5 py-3 font-medium text-[var(--color-ink-muted)]">Role</th>
              <th className="px-5 py-3 font-medium text-[var(--color-ink-muted)]">Last login</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {allUsers.map((u) => (
              <tr key={u.id}>
                <td className="px-5 py-3 text-[var(--color-ink)]">{u.name}</td>
                <td className="px-5 py-3 text-[var(--color-ink-muted)]">{u.email}</td>
                <td className="px-5 py-3 text-[var(--color-ink-muted)] capitalize">
                  {u.role.replace("_", " ")}
                </td>
                <td className="px-5 py-3 text-[var(--color-ink-muted)]">
                  {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : "Never"}
                </td>
              </tr>
            ))}
            {allUsers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-6 text-center text-[var(--color-ink-muted)]">
                  No users yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold text-[var(--color-ink)]">Add a user</h2>
        <div className="mt-4 max-w-2xl rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-6">
          <CreateUserForm />
        </div>
      </div>
    </div>
  );
}
