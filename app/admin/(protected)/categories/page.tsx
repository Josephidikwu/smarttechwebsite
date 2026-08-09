import type { Metadata } from "next";
import { desc } from "drizzle-orm";
import { requireUser } from "@/lib/auth/rbac";
import { getDb } from "@/lib/db/client";
import { categories } from "@/lib/db/schema";
import { CategoryForm } from "@/components/sections/admin/category-form";
import { DeleteButton } from "@/components/sections/admin/delete-button";
import { deleteCategory } from "@/lib/actions/catalogue-admin";

export const metadata: Metadata = { title: "Categories", robots: { index: false } };

export default async function AdminCategoriesPage() {
  await requireUser();
  const db = getDb();
  const rows = await db.select().from(categories).orderBy(desc(categories.createdAt));

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">Categories</h1>
      <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
        Categories used to organise and filter the public product catalogue.
      </p>

      <div className="mt-6 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-6">
        <CategoryForm />
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
            <tr>
              <th className="px-5 py-3 font-medium text-[var(--color-ink-muted)]">Name</th>
              <th className="px-5 py-3 font-medium text-[var(--color-ink-muted)]">Description</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {rows.map((c) => (
              <tr key={c.id}>
                <td className="px-5 py-3 text-[var(--color-ink)]">{c.name}</td>
                <td className="px-5 py-3 text-[var(--color-ink-muted)]">{c.description || "—"}</td>
                <td className="px-5 py-3 text-right">
                  <DeleteButton id={c.id} action={deleteCategory} confirmMessage={`Delete "${c.name}"?`} />
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={3} className="px-5 py-8 text-center text-[var(--color-ink-muted)]">
                  No categories yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
