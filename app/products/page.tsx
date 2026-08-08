import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
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

const categories = [
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

export default function ProductsPage() {
  return (
    <>
      <section className="pt-16 pb-4 lg:pt-24">
        <Container>
          <p className="text-sm font-medium tracking-wide text-[var(--color-brand-blue)] uppercase">
            Technology Products
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight text-[var(--color-ink)] sm:text-5xl">
            Technology you&apos;ll want to use.
          </h1>
          <p className="mt-6 max-w-xl text-[var(--color-ink-muted)]">
            From everyday devices to business technology, we help customers access products
            suited to the way they work, learn, communicate and live.
          </p>
        </Container>
      </section>

      <section className="py-20 lg:py-24">
        <Container>
          <div className="grid gap-px overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-3">
            {categories.map(({ name, copy, Icon }) => (
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
