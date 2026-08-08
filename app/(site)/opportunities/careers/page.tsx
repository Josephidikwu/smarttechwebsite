import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Careers at Smart Technology",
  description:
    "Explore careers at Smart Technology — technology jobs and opportunities for people who are curious, capable and ready to solve problems.",
};

export default function CareersPage() {
  return (
    <>
      <section className="pt-16 pb-4 lg:pt-24">
        <Container>
          <p className="text-sm font-medium tracking-wide text-[var(--color-brand-blue)] uppercase">
            Careers
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight text-[var(--color-ink)] sm:text-5xl">
            Build Your Future With Smart Technology.
          </h1>
          <p className="mt-6 max-w-xl text-[var(--color-ink-muted)]">
            We are interested in people who are curious, capable, passionate about technology and
            ready to solve problems. Explore our current opportunities and discover where your
            skills can contribute.
          </p>
        </Container>
      </section>

      {/* Open Positions — populated once job postings ship in M6; no listings to
          show yet, so this section leads with the general-application path. */}
      <section className="border-t border-[var(--color-border)] py-20 lg:py-24">
        <Container className="flex flex-col items-start justify-between gap-6 rounded-lg bg-[var(--color-bg-subtle)] p-10 sm:flex-row sm:items-center">
          <div>
            <p className="text-2xl font-semibold text-[var(--color-ink)]">
              Don&apos;t See Your Role?
            </p>
            <p className="mt-2 max-w-md text-sm text-[var(--color-ink-muted)]">
              We&apos;re always interested in meeting talented people. Technology is always
              evolving, and so are we — tell us how you could contribute.
            </p>
          </div>
          <Button href="/contact">Submit General Application</Button>
        </Container>
      </section>
    </>
  );
}
