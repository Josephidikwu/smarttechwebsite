import type { Metadata } from "next";
import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { requireUser } from "@/lib/auth/rbac";
import { getDb } from "@/lib/db/client";
import { products, categories, brands } from "@/lib/db/schema";
import { StatusBadge, type Tone } from "@/components/ui/status-badge";

export const metadata: Metadata = { title: "Products", robots: { index: false } };

const statusTone: Record<string, Tone> = { draft: "neutral", published: "success" };

export default async function AdminProductsPage() {
  await requireUser();
  const db = getDb();

  const rows = await db
    .select({
      id: products.id,
      name: products.name,
      sku: products.sku,
      price: products.price,
      currency: products.currency,
      status: products.status,
      categoryName: categories.name,
      brandName: brands.name,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(brands, eq(products.brandId, brands.id))
    .orderBy(desc(products.createdAt));

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">Products</h1>
          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
            Only published products appear on the public catalogue.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/product-enquiries"
            className="rounded-md border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-ink)] hover:bg-[var(--color-bg-subtle)]"
          >
            Product Enquiries
          </Link>
          <Link
            href="/admin/products/new"
            className="rounded-md bg-[var(--color-brand-blue)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-brand-blue-dark)]"
          >
            New Product
          </Link>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
            <tr>
              <th className="px-5 py-3 font-medium text-[var(--color-ink-muted)]">Name</th>
              <th className="px-5 py-3 font-medium text-[var(--color-ink-muted)]">Category / Brand</th>
              <th className="px-5 py-3 font-medium text-[var(--color-ink-muted)]">Price</th>
              <th className="px-5 py-3 font-medium text-[var(--color-ink-muted)]">Status</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {rows.map((p) => (
              <tr key={p.id} className="hover:bg-[var(--color-bg-subtle)]">
                <td className="px-5 py-3 font-medium text-[var(--color-ink)]">{p.name}</td>
                <td className="px-5 py-3 text-[var(--color-ink-muted)]">
                  {[p.categoryName, p.brandName].filter(Boolean).join(" · ") || "—"}
                </td>
                <td className="px-5 py-3 text-[var(--color-ink-muted)]">
                  {p.price ? `${p.currency} ${p.price.toLocaleString()}` : "—"}
                </td>
                <td className="px-5 py-3">
                  <StatusBadge tone={statusTone[p.status]}>{p.status}</StatusBadge>
                </td>
                <td className="px-5 py-3 text-right">
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    className="text-sm font-medium text-[var(--color-brand-blue)] hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-[var(--color-ink-muted)]">
                  No products yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
