import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { Container } from "@/components/ui/container";
import { getDb } from "@/lib/db/client";
import { jobs } from "@/lib/db/schema";
import { JobApplyForm } from "@/components/sections/job-apply-form";

// Reads live job data (admin-managed) — never statically cached.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const db = getDb();
  const [job] = await db
    .select({ title: jobs.title, description: jobs.description })
    .from(jobs)
    .where(eq(jobs.slug, slug))
    .limit(1);
  return { title: job?.title ?? "Job", description: job?.description ?? undefined };
}

export default async function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = getDb();
  const [job] = await db.select().from(jobs).where(eq(jobs.slug, slug)).limit(1);
  if (!job || job.status !== "open") notFound();

  return (
    <Container className="py-20 lg:py-28">
      <p className="text-sm font-medium tracking-wide text-[var(--color-brand-blue)] uppercase">
        {job.department || "Careers"}
      </p>
      <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight text-[var(--color-ink)]">
        Apply for {job.title}
      </h1>

      <div className="mt-10 grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <dl className="flex flex-col gap-3 text-sm">
            {job.location && (
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--color-ink-muted)]">Location</dt>
                <dd className="text-[var(--color-ink)]">{job.location}</dd>
              </div>
            )}
            {job.employmentType && (
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--color-ink-muted)]">Employment Type</dt>
                <dd className="text-[var(--color-ink)]">{job.employmentType}</dd>
              </div>
            )}
            {job.experienceLevel && (
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--color-ink-muted)]">Experience</dt>
                <dd className="text-[var(--color-ink)]">{job.experienceLevel}</dd>
              </div>
            )}
            {job.salary && (
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--color-ink-muted)]">Salary</dt>
                <dd className="text-[var(--color-ink)]">{job.salary}</dd>
              </div>
            )}
            {job.applicationDeadline && (
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--color-ink-muted)]">Application Deadline</dt>
                <dd className="text-[var(--color-ink)]">
                  {new Date(job.applicationDeadline).toLocaleDateString()}
                </dd>
              </div>
            )}
          </dl>

          {job.description && (
            <div className="mt-8 border-t border-[var(--color-border)] pt-6">
              <h2 className="text-sm font-semibold text-[var(--color-ink)]">About the Role</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm text-[var(--color-ink-muted)]">
                {job.description}
              </p>
            </div>
          )}
          {job.responsibilities && (
            <div className="mt-6">
              <h2 className="text-sm font-semibold text-[var(--color-ink)]">Responsibilities</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm text-[var(--color-ink-muted)]">
                {job.responsibilities}
              </p>
            </div>
          )}
          {job.requirements && (
            <div className="mt-6">
              <h2 className="text-sm font-semibold text-[var(--color-ink)]">Requirements</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm text-[var(--color-ink-muted)]">
                {job.requirements}
              </p>
            </div>
          )}
          {job.niceToHave && (
            <div className="mt-6">
              <h2 className="text-sm font-semibold text-[var(--color-ink)]">Nice to Have</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm text-[var(--color-ink-muted)]">
                {job.niceToHave}
              </p>
            </div>
          )}
        </div>

        <div className="lg:col-span-7">
          <JobApplyForm jobId={job.id} />
        </div>
      </div>
    </Container>
  );
}
