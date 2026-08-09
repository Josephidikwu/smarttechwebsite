import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/sections/page-hero";
import { pillars } from "@/lib/content/pillars";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Technology products, procurement, software, AI, data and IT infrastructure — Smart Technology's solutions for the way you live, work and grow.",
};

export default function SolutionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title="Technology for the way you live, work and grow."
        intro="We bring together technology products, digital solutions and professional services to meet the evolving needs of individuals, businesses and organisations."
        image="/images/heroes/solutions.jpg"
        imageAlt="Team collaborating on technology solutions"
      />

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
