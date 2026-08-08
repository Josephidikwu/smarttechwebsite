import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { Container } from "@/components/ui/container";
import { getDb } from "@/lib/db/client";
import { trainingProgrammes } from "@/lib/db/schema";
import { TrainingApplyForm } from "@/components/sections/training-apply-form";

// Reads live programme data (admin-managed) — never statically cached.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const db = getDb();
  const [programme] = await db
    .select({ name: trainingProgrammes.name, description: trainingProgrammes.description })
    .from(trainingProgrammes)
    .where(eq(trainingProgrammes.slug, slug))
    .limit(1);
  return { title: programme?.name ?? "Training Programme", description: programme?.description ?? undefined };
}

export default async function TrainingProgrammeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const db = getDb();
  const [programme] = await db
    .select()
    .from(trainingProgrammes)
    .where(eq(trainingProgrammes.slug, slug))
    .limit(1);
  if (!programme || programme.status !== "open") notFound();

  return (
    <Container className="grid gap-16 py-20 lg:grid-cols-12 lg:py-28">
      <div className="lg:col-span-5">
        <p className="text-sm font-medium tracking-wide text-[var(--color-brand-blue)] uppercase">
          {programme.category || "Training"}
        </p>
        <h1 className="mt-3 max-w-md text-4xl font-bold tracking-tight text-[var(--color-ink)]">
          {programme.name}
        </h1>
        {programme.description && (
          <p className="mt-5 max-w-md text-[var(--color-ink-muted)]">{programme.description}</p>
        )}

        <dl className="mt-8 flex flex-col gap-3 border-t border-[var(--color-border)] pt-6 text-sm">
          {programme.format && (
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--color-ink-muted)]">Format</dt>
              <dd className="text-[var(--color-ink)]">{programme.format}</dd>
            </div>
          )}
          {programme.duration && (
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--color-ink-muted)]">Duration</dt>
              <dd className="text-[var(--color-ink)]">{programme.duration}</dd>
            </div>
          )}
          {programme.location && (
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--color-ink-muted)]">Location</dt>
              <dd className="text-[var(--color-ink)]">{programme.location}</dd>
            </div>
          )}
          {programme.applicationDeadline && (
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--color-ink-muted)]">Application deadline</dt>
              <dd className="text-[var(--color-ink)]">
                {new Date(programme.applicationDeadline).toLocaleDateString()}
              </dd>
            </div>
          )}
          {programme.requirements && (
            <div className="pt-2">
              <dt className="text-[var(--color-ink-muted)]">Requirements</dt>
              <dd className="mt-1 whitespace-pre-wrap text-[var(--color-ink)]">
                {programme.requirements}
              </dd>
            </div>
          )}
        </dl>
      </div>

      <div className="lg:col-span-7">
        <TrainingApplyForm programmeId={programme.id} />
      </div>
    </Container>
  );
}
