import type { Metadata } from "next";
import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { getDb } from "@/lib/db/client";
import { jobs } from "@/lib/db/schema";

export const metadata: Metadata = {
  title: "Careers at Smart Technology",
  description:
    "Explore careers at Smart Technology — technology jobs and opportunities for people who are curious, capable and ready to solve problems.",
};

// Reads live job listings (admin-managed) — never statically cached.
export const dynamic = "force-dynamic";

export default async function CareersPage() {
  const db = getDb();
  const openJobs = await db.select().from(jobs).where(eq(jobs.status, "open")).orderBy(desc(jobs.createdAt));

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

      <section className="py-16 lg:py-20">
        <Container>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">
            Open Positions
          </h2>

          {openJobs.length > 0 ? (
            <div className="mt-8 divide-y divide-[var(--color-border)] border-t border-[var(--color-border)]">
              {openJobs.map((j) => (
                <Link
                  key={j.id}
                  href={`/opportunities/careers/${j.slug}`}
                  className="group flex flex-col gap-2 py-7 sm:flex-row sm:items-center sm:gap-8"
                >
                  <span className="text-lg font-semibold text-[var(--color-ink)] sm:w-72 sm:shrink-0">
                    {j.title}
                  </span>
                  <span className="text-sm text-[var(--color-ink-muted)] sm:flex-1">
                    {j.department} {j.location ? `· ${j.location}` : ""}{" "}
                    {j.employmentType ? `· ${j.employmentType}` : ""}
                  </span>
                  <span className="text-sm font-medium text-[var(--color-brand-blue)] whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100">
                    View Position →
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-6 text-sm text-[var(--color-ink-muted)]">
              No open positions right now — check back soon, or submit a general application
              below.
            </p>
          )}
        </Container>
      </section>

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
          <Button href="/opportunities/careers/general">Submit General Application</Button>
        </Container>
      </section>
    </>
  );
}
