import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { Container } from "@/components/ui/container";
import { getDb } from "@/lib/db/client";
import { internships } from "@/lib/db/schema";
import { InternshipApplyForm } from "@/components/sections/internship-apply-form";
import { getPublicSiteSettings } from "@/lib/settings/site-settings";

// Reads live internship data (admin-managed) — never statically cached.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const db = getDb();
  const [internship] = await db
    .select({ position: internships.position, description: internships.description })
    .from(internships)
    .where(eq(internships.slug, slug))
    .limit(1);
  return {
    title: internship?.position ?? "Internship",
    description: internship?.description ?? undefined,
  };
}

export default async function InternshipDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const db = getDb();
  const [internship] = await db.select().from(internships).where(eq(internships.slug, slug)).limit(1);
  if (!internship || internship.status !== "open") notFound();
  const { turnstileSiteKey } = await getPublicSiteSettings();

  return (
    <Container className="grid gap-16 py-20 lg:grid-cols-12 lg:py-28">
      <div className="lg:col-span-5">
        <p className="text-sm font-medium tracking-wide text-[var(--color-brand-blue)] uppercase">
          {internship.department || "Internship"}
        </p>
        <h1 className="mt-3 max-w-md text-4xl font-bold tracking-tight text-[var(--color-ink)]">
          {internship.position}
        </h1>
        {internship.description && (
          <p className="mt-5 max-w-md text-[var(--color-ink-muted)]">{internship.description}</p>
        )}

        <dl className="mt-8 flex flex-col gap-3 border-t border-[var(--color-border)] pt-6 text-sm">
          {internship.workArrangement && (
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--color-ink-muted)]">Work arrangement</dt>
              <dd className="text-[var(--color-ink)]">{internship.workArrangement}</dd>
            </div>
          )}
          {internship.duration && (
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--color-ink-muted)]">Duration</dt>
              <dd className="text-[var(--color-ink)]">{internship.duration}</dd>
            </div>
          )}
          {internship.location && (
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--color-ink-muted)]">Location</dt>
              <dd className="text-[var(--color-ink)]">{internship.location}</dd>
            </div>
          )}
          {internship.applicationDeadline && (
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--color-ink-muted)]">Application deadline</dt>
              <dd className="text-[var(--color-ink)]">
                {new Date(internship.applicationDeadline).toLocaleDateString()}
              </dd>
            </div>
          )}
          {internship.responsibilities && (
            <div className="pt-2">
              <dt className="text-[var(--color-ink-muted)]">Responsibilities</dt>
              <dd className="mt-1 whitespace-pre-wrap text-[var(--color-ink)]">
                {internship.responsibilities}
              </dd>
            </div>
          )}
          {internship.requirements && (
            <div className="pt-2">
              <dt className="text-[var(--color-ink-muted)]">Requirements</dt>
              <dd className="mt-1 whitespace-pre-wrap text-[var(--color-ink)]">
                {internship.requirements}
              </dd>
            </div>
          )}
        </dl>
      </div>

      <div className="lg:col-span-7">
        <InternshipApplyForm internshipId={internship.id} turnstileSiteKey={turnstileSiteKey} />
      </div>
    </Container>
  );
}
