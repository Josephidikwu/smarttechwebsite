import type { Metadata } from "next";
import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { Container } from "@/components/ui/container";
import { getDb } from "@/lib/db/client";
import { trainingProgrammes } from "@/lib/db/schema";

export const metadata: Metadata = {
  title: "Technology Training Programmes",
  description:
    "Build the skills you need for the digital world. Explore training opportunities in technology, artificial intelligence, freelancing and related digital disciplines.",
};

// Reads live programme data (admin-managed) — never statically cached.
export const dynamic = "force-dynamic";

const areas = [
  "Software development",
  "Web development",
  "Artificial intelligence",
  "Data",
  "Digital skills",
  "Freelancing",
  "Technology",
  "Related digital disciplines",
];

export default async function TrainingPage() {
  const db = getDb();
  const programmes = await db
    .select()
    .from(trainingProgrammes)
    .where(eq(trainingProgrammes.status, "open"))
    .orderBy(desc(trainingProgrammes.createdAt));

  return (
    <>
      <section className="pt-16 pb-4 lg:pt-24">
        <Container className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <p className="text-sm font-medium tracking-wide text-[var(--color-brand-blue)] uppercase">
              Training
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-[var(--color-ink)] sm:text-5xl">
              Build Skills. Create Opportunities.
            </h1>
            <p className="mt-5 max-w-xl text-[var(--color-ink-muted)]">
              Whether you&apos;re starting your technology journey or developing existing skills,
              our training opportunities are designed to support continuous learning.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container>
          <h2 className="text-sm font-semibold tracking-wide text-[var(--color-ink)] uppercase">
            Areas may include
          </h2>
          <ul className="mt-6 grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-4">
            {areas.map((a) => (
              <li key={a} className="text-sm text-[var(--color-ink-muted)]">
                {a}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="border-t border-[var(--color-border)] py-16 lg:py-20">
        <Container>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">
            Open programmes
          </h2>

          {programmes.length > 0 ? (
            <div className="mt-8 divide-y divide-[var(--color-border)] border-t border-[var(--color-border)]">
              {programmes.map((p) => (
                <Link
                  key={p.id}
                  href={`/opportunities/training/${p.slug}`}
                  className="group flex flex-col gap-2 py-7 sm:flex-row sm:items-center sm:gap-8"
                >
                  <span className="text-lg font-semibold text-[var(--color-ink)] sm:w-72 sm:shrink-0">
                    {p.name}
                  </span>
                  <span className="text-sm text-[var(--color-ink-muted)] sm:flex-1">
                    {p.category} {p.format ? `· ${p.format}` : ""}
                  </span>
                  <span className="text-sm font-medium text-[var(--color-brand-blue)] whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100">
                    Apply →
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-6 text-sm text-[var(--color-ink-muted)]">
              No programmes are open for applications right now — check back soon.
            </p>
          )}
        </Container>
      </section>
    </>
  );
}
