import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { requireUser } from "@/lib/auth/rbac";
import { getDb } from "@/lib/db/client";
import { products, categories, brands } from "@/lib/db/schema";
import { updateProduct, deleteProduct } from "@/lib/actions/catalogue-admin";
import { ProductForm } from "@/components/sections/admin/product-form";
import { DeleteButton } from "@/components/sections/admin/delete-button";

export const metadata: Metadata = { title: "Edit Product", robots: { index: false } };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await requireUser("admin");
  const { id } = await params;
  const productId = Number(id);
  if (!Number.isInteger(productId)) notFound();

  const db = getDb();
  const [[product], categoryRows, brandRows] = await Promise.all([
    db.select().from(products).where(eq(products.id, productId)).limit(1),
    db.select({ id: categories.id, name: categories.name }).from(categories),
    db.select({ id: brands.id, name: brands.name }).from(brands),
  ]);
  if (!product) notFound();

  const boundAction = updateProduct.bind(null, productId);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">
          Edit {product.name}
        </h1>
        <DeleteButton id={product.id} action={deleteProduct} confirmMessage={`Delete "${product.name}"?`} />
      </div>
      <div className="mt-6 max-w-3xl rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-6">
        <ProductForm
          action={boundAction}
          submitLabel="Save Changes"
          categories={categoryRows}
          brands={brandRows}
          initial={product}
        />
      </div>
    </div>
  );
}
