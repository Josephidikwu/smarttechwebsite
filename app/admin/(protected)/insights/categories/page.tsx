import type { Metadata } from "next";
import { desc } from "drizzle-orm";
import { requireUser } from "@/lib/auth/rbac";
import { getDb } from "@/lib/db/client";
import { blogCategories } from "@/lib/db/schema";
import { BlogCategoryForm } from "@/components/sections/admin/blog-category-form";
import { DeleteButton } from "@/components/sections/admin/delete-button";
import { deleteBlogCategory } from "@/lib/actions/blog-admin";

export const metadata: Metadata = { title: "Insights Categories", robots: { index: false } };

export default async function AdminBlogCategoriesPage() {
  await requireUser();
  const db = getDb();
  const rows = await db.select().from(blogCategories).orderBy(desc(blogCategories.id));

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">
        Insights Categories
      </h1>
      <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
        Categories used to organise Insights articles (e.g. Technology, AI, Software).
      </p>

      <div className="mt-6 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-6">
        <BlogCategoryForm />
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
            <tr>
              <th className="px-5 py-3 font-medium text-[var(--color-ink-muted)]">Name</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {rows.map((c) => (
              <tr key={c.id}>
                <td className="px-5 py-3 text-[var(--color-ink)]">{c.name}</td>
                <td className="px-5 py-3 text-right">
                  <DeleteButton id={c.id} action={deleteBlogCategory} confirmMessage={`Delete "${c.name}"?`} />
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={2} className="px-5 py-8 text-center text-[var(--color-ink-muted)]">
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
