import type { Metadata } from "next";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Ideas, technology & opportunities — perspectives, guides and useful information around technology, artificial intelligence, digital transformation, gadgets, careers and the evolving digital economy.",
};

const categories = [
  "Technology",
  "Artificial Intelligence",
  "Software",
  "Gadgets",
  "Business Technology",
  "Digital Transformation",
  "Career & Skills",
  "Training",
];

export default function InsightsPage() {
  return (
    <section className="pt-16 pb-28 lg:pt-24 lg:pb-36">
      <Container>
        <p className="text-sm font-medium tracking-wide text-[var(--color-brand-blue)] uppercase">
          Insights
        </p>
        <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight text-[var(--color-ink)] sm:text-5xl">
          Ideas, Technology &amp; Opportunities
        </h1>
        <p className="mt-6 max-w-xl text-[var(--color-ink-muted)]">
          Explore perspectives, guides and useful information around technology, artificial
          intelligence, digital transformation, gadgets, careers and the evolving digital economy.
        </p>

        <div className="mt-12 flex flex-wrap gap-2">
          {categories.map((c) => (
            <span
              key={c}
              className="rounded-full border border-[var(--color-border)] px-4 py-1.5 text-sm text-[var(--color-ink-muted)]"
            >
              {c}
            </span>
          ))}
        </div>

        <p className="mt-16 text-sm text-[var(--color-ink-muted)]">
          Articles are on their way — check back soon.
        </p>
      </Container>
    </section>
  );
}
