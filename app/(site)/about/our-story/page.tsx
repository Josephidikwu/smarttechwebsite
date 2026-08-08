import type { Metadata } from "next";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Smart Technology was created around a simple idea: make technology more accessible, practical and useful.",
};

export default function OurStoryPage() {
  return (
    <section className="pt-16 pb-24 lg:pt-24 lg:pb-32">
      <Container className="grid gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <p className="text-sm font-medium tracking-wide text-[var(--color-brand-blue)] uppercase">
            Our Story
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-[var(--color-ink)] sm:text-5xl">
            From Technology Needs to Technology Opportunities
          </h1>
        </div>

        <div className="max-w-2xl lg:col-span-7 lg:col-start-6">
          <p className="text-lg text-[var(--color-ink-muted)]">
            Technology is changing the way people live, work and do business. Yet accessing the
            right technology, building the right digital solution or finding the right skills can
            still be a challenge.
          </p>

          <p className="mt-8 text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
            Smart Technology was created around a simple idea: make technology more accessible,
            practical and useful.
          </p>

          <p className="mt-8 text-[var(--color-ink-muted)]">
            Our work brings together technology products, procurement, software, artificial
            intelligence, data, IT infrastructure and digital solutions under one ecosystem. But
            our vision goes beyond providing technology.
          </p>
          <p className="mt-4 text-[var(--color-ink-muted)]">
            We want to help create an environment where people can learn, gain experience, build
            careers and create opportunities through technology. That&apos;s why our ecosystem
            extends from the devices people use every day to the software and intelligent systems
            powering modern organisations — and to the people developing the skills to build the
            future.
          </p>

          <p className="mt-8 border-l-2 border-[var(--color-brand-blue)] pl-5 text-xl font-medium text-[var(--color-ink)]">
            We don&apos;t just provide technology. We create opportunities around it.
          </p>
        </div>
      </Container>
    </section>
  );
}
