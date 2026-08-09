import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { Container } from "@/components/ui/container";
import { getDb } from "@/lib/db/client";
import { products, categories, brands } from "@/lib/db/schema";
import { ProductEnquiryForm } from "@/components/sections/product-enquiry-form";
import { getPublicSiteSettings } from "@/lib/settings/site-settings";

// Reads live product data (admin-managed) — never statically cached.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const db = getDb();
  const [product] = await db
    .select({ name: products.name, description: products.description })
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1);
  return { title: product?.name ?? "Product", description: product?.description ?? undefined };
}

const stockLabel: Record<string, string> = {
  in_stock: "Available",
  out_of_stock: "Contact us for availability",
  contact_us: "Contact us for availability",
};

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = getDb();
  const [product] = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  if (!product || product.status !== "published") notFound();
  const { turnstileSiteKey } = await getPublicSiteSettings();

  const [category, brand] = await Promise.all([
    product.categoryId
      ? db.select({ name: categories.name }).from(categories).where(eq(categories.id, product.categoryId)).limit(1)
      : Promise.resolve([]),
    product.brandId
      ? db.select({ name: brands.name }).from(brands).where(eq(brands.id, product.brandId)).limit(1)
      : Promise.resolve([]),
  ]);

  const specs = product.specifications ?? {};

  const schemaAvailability =
    product.stockStatus === "in_stock" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description ?? undefined,
    sku: product.sku ?? undefined,
    brand: brand[0]?.name ? { "@type": "Brand", name: brand[0].name } : undefined,
    offers: product.price
      ? {
          "@type": "Offer",
          priceCurrency: product.currency,
          price: product.price,
          availability: schemaAvailability,
        }
      : undefined,
  };

  return (
    <Container className="grid gap-16 py-20 lg:grid-cols-12 lg:py-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="lg:col-span-5">
        <p className="text-sm font-medium tracking-wide text-[var(--color-brand-blue)] uppercase">
          {category[0]?.name ?? "Product"} {brand[0]?.name ? `· ${brand[0].name}` : ""}
        </p>
        <h1 className="mt-3 max-w-md text-4xl font-bold tracking-tight text-[var(--color-ink)]">
          {product.name}
        </h1>
        {product.description && (
          <p className="mt-5 max-w-md text-[var(--color-ink-muted)]">{product.description}</p>
        )}

        {Object.keys(specs).length > 0 && (
          <dl className="mt-8 flex flex-col gap-3 border-t border-[var(--color-border)] pt-6 text-sm">
            {Object.entries(specs).map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4">
                <dt className="text-[var(--color-ink-muted)]">{label}</dt>
                <dd className="text-[var(--color-ink)]">{value}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-6 flex justify-between gap-4 border-t border-[var(--color-border)] pt-6 text-sm">
          <dt className="text-[var(--color-ink-muted)]">Availability</dt>
          <dd className="text-[var(--color-ink)]">{stockLabel[product.stockStatus]}</dd>
        </div>
      </div>

      <div className="lg:col-span-7">
        <h2 className="text-lg font-semibold text-[var(--color-ink)]">Need this product?</h2>
        <p className="mt-1.5 text-sm text-[var(--color-ink-muted)]">
          Whether you need one device or technology equipment for an organisation, talk to our
          team.
        </p>
        <div className="mt-6">
          <ProductEnquiryForm productId={product.id} turnstileSiteKey={turnstileSiteKey} />
        </div>
      </div>
    </Container>
  );
}
