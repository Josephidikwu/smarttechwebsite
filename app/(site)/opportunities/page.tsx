import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Opportunities",
  description:
    "Smart Technology provides pathways for people who want to learn technology, gain practical experience and build careers — training, internships and careers.",
};

const opportunities = [
  {
    name: "Training",
    copy: "Build the skills you need for the digital world. Explore training opportunities in technology, artificial intelligence, freelancing and related digital disciplines.",
    href: "/opportunities/training",
    cta: "Apply for Training",
  },
  {
    name: "Internship",
    copy: "Turn knowledge into experience. Gain practical exposure, develop workplace skills and learn by contributing to technology projects.",
    href: "/opportunities/internship",
    cta: "Apply for Internship",
  },
  {
    name: "Careers",
    copy: "Build your future with us. Explore available opportunities and discover how your skills can contribute to our growing technology ecosystem.",
    href: "/opportunities/careers",
    cta: "Explore Careers",
  },
];

export default function OpportunitiesPage() {
  return (
    <>
      <section className="pt-16 pb-4 lg:pt-24">
        <Container>
          <p className="text-sm font-medium tracking-wide text-[var(--color-brand-blue)] uppercase">
            Opportunities
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight text-[var(--color-ink)] sm:text-5xl">
            Learn. Experience. Build.
          </h1>
          <p className="mt-6 max-w-xl text-[var(--color-ink-muted)]">
            Technology creates opportunities when people have the knowledge, skills and
            experience to participate. Smart Technology provides pathways for people who want to
            learn technology, gain practical experience and build careers.
          </p>
        </Container>
      </section>

      <section className="py-20 lg:py-24">
        <Container>
          <div className="grid divide-y divide-[var(--color-border)] border-t border-[var(--color-border)] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {opportunities.map((o) => (
              <div key={o.name} className="flex flex-col gap-3 py-8 sm:px-8 sm:py-2 sm:first:pl-0">
                <h2 className="text-xl font-semibold text-[var(--color-ink)]">{o.name}</h2>
                <p className="text-sm text-[var(--color-ink-muted)]">{o.copy}</p>
                <Link
                  href={o.href}
                  className="mt-1 text-sm font-medium text-[var(--color-brand-blue)] underline-offset-4 hover:underline"
                >
                  {o.cta} →
                </Link>
              </div>
            ))}
          </div>

          <p className="mt-14 max-w-2xl text-xs text-[var(--color-ink-muted)]">
            The registered objects of Oracle Digital Infor Hub Ltd specifically include digital
            training and capacity-building programmes in technology, freelancing, artificial
            intelligence and related areas.
          </p>
        </Container>
      </section>
    </>
  );
}
