import type { Metadata } from "next";
import { desc } from "drizzle-orm";
import { requireUser } from "@/lib/auth/rbac";
import { getDb } from "@/lib/db/client";
import { brands } from "@/lib/db/schema";
import { BrandForm } from "@/components/sections/admin/brand-form";
import { DeleteButton } from "@/components/sections/admin/delete-button";
import { deleteBrand } from "@/lib/actions/catalogue-admin";

export const metadata: Metadata = { title: "Brands", robots: { index: false } };

export default async function AdminBrandsPage() {
  await requireUser();
  const db = getDb();
  const rows = await db.select().from(brands).orderBy(desc(brands.createdAt));

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">Brands</h1>
      <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
        Brands available when creating or editing a product.
      </p>

      <div className="mt-6 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-6">
        <BrandForm />
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
            {rows.map((b) => (
              <tr key={b.id}>
                <td className="px-5 py-3 text-[var(--color-ink)]">{b.name}</td>
                <td className="px-5 py-3 text-right">
                  <DeleteButton id={b.id} action={deleteBrand} confirmMessage={`Delete "${b.name}"?`} />
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={2} className="px-5 py-8 text-center text-[var(--color-ink-muted)]">
                  No brands yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
