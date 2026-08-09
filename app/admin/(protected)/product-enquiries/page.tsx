import type { Metadata } from "next";
import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { requireUser } from "@/lib/auth/rbac";
import { getDb } from "@/lib/db/client";
import { productEnquiries, products } from "@/lib/db/schema";
import { StatusBadge, contactStatusTone } from "@/components/ui/status-badge";

export const metadata: Metadata = { title: "Product Enquiries", robots: { index: false } };

export default async function AdminProductEnquiriesPage() {
  await requireUser();
  const db = getDb();

  const rows = await db
    .select({
      id: productEnquiries.id,
      name: productEnquiries.name,
      email: productEnquiries.email,
      type: productEnquiries.type,
      status: productEnquiries.status,
      createdAt: productEnquiries.createdAt,
      productName: products.name,
    })
    .from(productEnquiries)
    .innerJoin(products, eq(productEnquiries.productId, products.id))
    .orderBy(desc(productEnquiries.createdAt));

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">
        Product Enquiries
      </h1>
      <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
        &quot;Request This Product&quot; and &quot;Request Bulk Quote&quot; submissions.
      </p>

      <div className="mt-6 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
            <tr>
              <th className="px-5 py-3 font-medium text-[var(--color-ink-muted)]">Requester</th>
              <th className="px-5 py-3 font-medium text-[var(--color-ink-muted)]">Product</th>
              <th className="px-5 py-3 font-medium text-[var(--color-ink-muted)]">Type</th>
              <th className="px-5 py-3 font-medium text-[var(--color-ink-muted)]">Status</th>
              <th className="px-5 py-3 font-medium text-[var(--color-ink-muted)]">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {rows.map((e) => (
              <tr key={e.id} className="hover:bg-[var(--color-bg-subtle)]">
                <td className="px-5 py-3">
                  <Link href={`/admin/product-enquiries/${e.id}`} className="block">
                    <span className="font-medium text-[var(--color-ink)]">{e.name}</span>
                    <span className="block text-xs text-[var(--color-ink-muted)]">{e.email}</span>
                  </Link>
                </td>
                <td className="px-5 py-3 text-[var(--color-ink-muted)]">{e.productName}</td>
                <td className="px-5 py-3 text-[var(--color-ink-muted)] capitalize">
                  {e.type.replace("_", " ")}
                </td>
                <td className="px-5 py-3">
                  <StatusBadge tone={contactStatusTone(e.status)}>{e.status}</StatusBadge>
                </td>
                <td className="px-5 py-3 text-[var(--color-ink-muted)]">
                  {new Date(e.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-[var(--color-ink-muted)]">
                  No product enquiries yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
