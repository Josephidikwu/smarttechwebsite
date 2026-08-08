import type { Metadata } from "next";
import Link from "next/link";
import { and, desc, eq } from "drizzle-orm";
import { requireUser } from "@/lib/auth/rbac";
import { getDb } from "@/lib/db/client";
import { jobApplications, jobs, type JobAppStatus } from "@/lib/db/schema";
import { StatusBadge, type Tone } from "@/components/ui/status-badge";

export const metadata: Metadata = { title: "Job Applications", robots: { index: false } };

const statusTone: Record<string, Tone> = {
  new: "info",
  reviewing: "warning",
  shortlisted: "warning",
  interview: "warning",
  offer: "warning",
  hired: "success",
  rejected: "danger",
};
const statusOptions: JobAppStatus[] = [
  "new",
  "reviewing",
  "shortlisted",
  "interview",
  "offer",
  "hired",
  "rejected",
];

export default async function AdminJobApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ jobId?: string; status?: string }>;
}) {
  await requireUser();
  const { jobId, status } = await searchParams;

  const db = getDb();
  const conditions = [];
  if (jobId) conditions.push(eq(jobApplications.jobId, Number(jobId)));
  if (status && statusOptions.includes(status as JobAppStatus)) {
    conditions.push(eq(jobApplications.status, status as JobAppStatus));
  }

  const applications = await db
    .select({
      id: jobApplications.id,
      fullName: jobApplications.fullName,
      email: jobApplications.email,
      status: jobApplications.status,
      createdAt: jobApplications.createdAt,
      jobTitle: jobs.title,
    })
    .from(jobApplications)
    .innerJoin(jobs, eq(jobApplications.jobId, jobs.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(jobApplications.createdAt));

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">Job Applications</h1>
      {jobId && (
        <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
          Filtered by job.{" "}
          <Link href="/admin/careers/applications" className="text-[var(--color-brand-blue)] hover:underline">
            Clear filter
          </Link>
        </p>
      )}

      <div className="mt-6 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
            <tr>
              <th className="px-5 py-3 font-medium text-[var(--color-ink-muted)]">Applicant</th>
              <th className="px-5 py-3 font-medium text-[var(--color-ink-muted)]">Job</th>
              <th className="px-5 py-3 font-medium text-[var(--color-ink-muted)]">Status</th>
              <th className="px-5 py-3 font-medium text-[var(--color-ink-muted)]">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {applications.map((a) => (
              <tr key={a.id} className="hover:bg-[var(--color-bg-subtle)]">
                <td className="px-5 py-3">
                  <Link href={`/admin/careers/applications/${a.id}`} className="block">
                    <span className="font-medium text-[var(--color-ink)]">{a.fullName}</span>
                    <span className="block text-xs text-[var(--color-ink-muted)]">{a.email}</span>
                  </Link>
                </td>
                <td className="px-5 py-3 text-[var(--color-ink-muted)]">{a.jobTitle}</td>
                <td className="px-5 py-3">
                  <StatusBadge tone={statusTone[a.status]}>{a.status}</StatusBadge>
                </td>
                <td className="px-5 py-3 text-[var(--color-ink-muted)]">
                  {new Date(a.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {applications.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-[var(--color-ink-muted)]">
                  No applications yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
