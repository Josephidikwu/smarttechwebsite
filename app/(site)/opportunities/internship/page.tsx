import type { Metadata } from "next";
import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { Container } from "@/components/ui/container";
import { getDb } from "@/lib/db/client";
import { internships } from "@/lib/db/schema";

export const metadata: Metadata = {
  title: "Technology Internship Programme",
  description:
    "Gain practical exposure, develop workplace skills and learn by contributing to real technology projects at Smart Technology.",
};

// Reads live internship data (admin-managed) — never statically cached.
export const dynamic = "force-dynamic";

const whoCanApply = [
  "Students",
  "Recent graduates",
  "Entry-level professionals",
  "Aspiring technology professionals",
  "People transitioning into technology",
];

const areas = [
  "Software Development",
  "Web Development",
  "Artificial Intelligence",
  "Data",
  "UI/UX",
  "IT & Infrastructure",
  "Digital Marketing",
  "Business Operations",
];

export default async function InternshipPage() {
  const db = getDb();
  const openInternships = await db
    .select()
    .from(internships)
    .where(eq(internships.status, "open"))
    .orderBy(desc(internships.createdAt));

  return (
    <>
      <section className="pt-16 pb-4 lg:pt-24">
        <Container className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <p className="text-sm font-medium tracking-wide text-[var(--color-brand-blue)] uppercase">
              Internship
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-[var(--color-ink)] sm:text-5xl">
              Learn By Doing.
            </h1>
            <p className="mt-5 max-w-xl text-[var(--color-ink-muted)]">
              Knowledge is powerful. Experience makes it practical. Our internship opportunities
              are designed to give aspiring professionals exposure to technology, teamwork and the
              workplace while developing practical skills.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container className="grid gap-10 sm:grid-cols-2">
          <div>
            <h2 className="text-sm font-semibold tracking-wide text-[var(--color-ink)] uppercase">
              Who can apply?
            </h2>
            <ul className="mt-4 flex flex-col gap-2">
              {whoCanApply.map((w) => (
                <li key={w} className="text-sm text-[var(--color-ink-muted)]">
                  {w}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-wide text-[var(--color-ink)] uppercase">
              Areas of interest
            </h2>
            <ul className="mt-4 grid grid-cols-2 gap-2">
              {areas.map((a) => (
                <li key={a} className="text-sm text-[var(--color-ink-muted)]">
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="border-t border-[var(--color-border)] py-16 lg:py-20">
        <Container>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">
            Open positions
          </h2>

          {openInternships.length > 0 ? (
            <div className="mt-8 divide-y divide-[var(--color-border)] border-t border-[var(--color-border)]">
              {openInternships.map((i) => (
                <Link
                  key={i.id}
                  href={`/opportunities/internship/${i.slug}`}
                  className="group flex flex-col gap-2 py-7 sm:flex-row sm:items-center sm:gap-8"
                >
                  <span className="text-lg font-semibold text-[var(--color-ink)] sm:w-72 sm:shrink-0">
                    {i.position}
                  </span>
                  <span className="text-sm text-[var(--color-ink-muted)] sm:flex-1">
                    {i.department} {i.workArrangement ? `· ${i.workArrangement}` : ""}
                  </span>
                  <span className="text-sm font-medium text-[var(--color-brand-blue)] whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100">
                    Apply →
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-6 text-sm text-[var(--color-ink-muted)]">
              No internship positions are open right now — check back soon.
            </p>
          )}
        </Container>
      </section>
    </>
  );
}
