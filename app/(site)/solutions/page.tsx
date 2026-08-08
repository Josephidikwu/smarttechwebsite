import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { pillars } from "@/lib/content/pillars";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Technology products, procurement, software, AI, data and IT infrastructure — Smart Technology's solutions for the way you live, work and grow.",
};

export default function SolutionsPage() {
  return (
    <>
      <section className="pt-16 pb-4 lg:pt-24">
        <Container>
          <p className="text-sm font-medium tracking-wide text-[var(--color-brand-blue)] uppercase">
            Solutions
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight text-[var(--color-ink)] sm:text-5xl">
            Technology for the way you live, work and grow.
          </h1>
          <p className="mt-6 max-w-xl text-[var(--color-ink-muted)]">
            We bring together technology products, digital solutions and professional services to
            meet the evolving needs of individuals, businesses and organisations.
          </p>
        </Container>
      </section>

      <section className="py-20 lg:py-24">
        <Container>
          <div className="divide-y divide-[var(--color-border)] border-t border-[var(--color-border)]">
            {pillars.map((p) => (
              <Link
                key={p.name}
                href={p.href}
                className="group flex flex-col gap-2 py-8 sm:flex-row sm:items-center sm:gap-8"
              >
                <span className="text-sm font-medium text-[var(--color-ink-muted)] sm:w-10">
                  {p.n}
                </span>
                <span className="text-xl font-semibold text-[var(--color-ink)] sm:w-72 sm:shrink-0">
                  {p.name}
                </span>
                <span className="text-sm text-[var(--color-ink-muted)] sm:flex-1">{p.copy}</span>
                <span className="text-sm font-medium text-[var(--color-brand-blue)] whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100">
                  {p.cta} →
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
