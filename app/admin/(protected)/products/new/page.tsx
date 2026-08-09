import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/rbac";
import { getDb } from "@/lib/db/client";
import { categories, brands } from "@/lib/db/schema";
import { createProduct } from "@/lib/actions/catalogue-admin";
import { ProductForm } from "@/components/sections/admin/product-form";

export const metadata: Metadata = { title: "New Product", robots: { index: false } };

export default async function NewProductPage() {
  await requireUser("admin");
  const db = getDb();
  const [categoryRows, brandRows] = await Promise.all([
    db.select({ id: categories.id, name: categories.name }).from(categories),
    db.select({ id: brands.id, name: brands.name }).from(brands),
  ]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">New Product</h1>
      <div className="mt-6 max-w-3xl rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-6">
        <ProductForm action={createProduct} submitLabel="Create Product" categories={categoryRows} brands={brandRows} />
      </div>
    </div>
  );
}
