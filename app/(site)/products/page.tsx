import type { Metadata } from "next";
import Link from "next/link";
import { and, desc, eq } from "drizzle-orm";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/sections/page-hero";
import { Button } from "@/components/ui/button";
import { getDb } from "@/lib/db/client";
import { products, categories } from "@/lib/db/schema";
import {
  AccessoryIcon,
  GadgetIcon,
  HeadphonesIcon,
  LaptopIcon,
  NetworkingIcon,
} from "@/components/ui/category-icons";

export const metadata: Metadata = {
  title: "Technology Products",
  description:
    "Laptops, computers, headphones, accessories, networking equipment and gadgets — technology products from Smart Technology, sourced for the way you work, learn, communicate and live.",
};

// Reads live product/category data (admin-managed) — never statically cached.
export const dynamic = "force-dynamic";

const categoryTiles = [
  {
    name: "Laptops & Computers",
    copy: "Technology for work, business, education and everyday productivity.",
    Icon: LaptopIcon,
  },
  {
    name: "Audio & Headphones",
    copy: "Headphones, earbuds, speakers and other audio technology.",
    Icon: HeadphonesIcon,
  },
  {
    name: "Accessories",
    copy: "Essential accessories, peripherals, chargers, cables, adapters and more.",
    Icon: AccessoryIcon,
  },
  {
    name: "Networking",
    copy: "Equipment and accessories for connected environments.",
    Icon: NetworkingIcon,
  },
  {
    name: "Gadgets",
    copy: "Technology products designed for modern digital lifestyles.",
    Icon: GadgetIcon,
  },
];

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const db = getDb();

  const categoryRows = await db.select().from(categories);
  const activeCategory = category ? categoryRows.find((c) => c.slug === category) : undefined;

  const conditions = [eq(products.status, "published")];
  if (activeCategory) conditions.push(eq(products.categoryId, activeCategory.id));

  const productRows = await db
    .select()
    .from(products)
    .where(and(...conditions))
    .orderBy(desc(products.createdAt));

  return (
    <>
      <PageHero
        eyebrow="Technology Products"
        title="Technology you'll want to use."
        intro="From everyday devices to business technology, we help customers access products suited to the way they work, learn, communicate and live."
        image="/images/heroes/products.jpg"
        imageAlt="Modern technology products and devices"
      />

      <section className="py-16 lg:py-20">
        <Container>
          <div className="grid gap-px overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-3">
            {categoryTiles.map(({ name, copy, Icon }) => (
              <div key={name} className="flex flex-col gap-4 bg-[var(--color-bg)] p-8">
                <Icon className="h-8 w-8 text-[var(--color-brand-blue)]" />
                <div>
                  <h2 className="font-semibold text-[var(--color-ink)]">{name}</h2>
                  <p className="mt-1.5 text-sm text-[var(--color-ink-muted)]">{copy}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-[var(--color-border)] py-16 lg:py-20">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">
              {activeCategory ? activeCategory.name : "All Products"}
            </h2>
            {categoryRows.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/products"
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${!activeCategory ? "border-[var(--color-brand-blue)] text-[var(--color-brand-blue)]" : "border-[var(--color-border)] text-[var(--color-ink-muted)]"}`}
                >
                  All
                </Link>
                {categoryRows.map((c) => (
                  <Link
                    key={c.id}
                    href={`/products?category=${c.slug}`}
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${activeCategory?.id === c.id ? "border-[var(--color-brand-blue)] text-[var(--color-brand-blue)]" : "border-[var(--color-border)] text-[var(--color-ink-muted)]"}`}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {productRows.length > 0 ? (
            <div className="mt-8 grid gap-px overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-3">
              {productRows.map((p) => (
                <Link key={p.id} href={`/products/${p.slug}`} className="group bg-[var(--color-bg)] p-6">
                  <p className="font-semibold text-[var(--color-ink)]">{p.name}</p>
                  {p.price ? (
                    <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
                      {p.currency} {p.price.toLocaleString()}
                    </p>
                  ) : (
                    <p className="mt-1 text-sm text-[var(--color-ink-muted)]">Contact us for pricing</p>
                  )}
                  <span className="mt-3 inline-block text-sm font-medium text-[var(--color-brand-blue)] opacity-0 transition-opacity group-hover:opacity-100">
                    Explore Product →
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-8 text-sm text-[var(--color-ink-muted)]">
              No products are listed here yet — check back soon.
            </p>
          )}
        </Container>
      </section>

      <section className="border-t border-[var(--color-border)] py-16">
        <Container className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-xl font-semibold text-[var(--color-ink)]">
              Looking for something specific?
            </p>
            <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
              Tell us what you need and our team can help you find the right product.
            </p>
          </div>
          <Button href="/quote">Request a Product</Button>
        </Container>
      </section>
    </>
  );
}
