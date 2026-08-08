import type { Metadata } from "next";
import Link from "next/link";
import { and, desc, eq } from "drizzle-orm";
import { requireUser } from "@/lib/auth/rbac";
import { getDb } from "@/lib/db/client";
import { internshipApplications, internships, type InternshipAppStatus } from "@/lib/db/schema";
import { StatusBadge, type Tone } from "@/components/ui/status-badge";

export const metadata: Metadata = { title: "Internship Applications", robots: { index: false } };

const statusTone: Record<string, Tone> = {
  new: "info",
  reviewing: "warning",
  shortlisted: "warning",
  interview: "warning",
  accepted: "success",
  rejected: "danger",
};
const statusOptions: InternshipAppStatus[] = [
  "new",
  "reviewing",
  "shortlisted",
  "interview",
  "accepted",
  "rejected",
];

export default async function AdminInternshipApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ internshipId?: string; status?: string }>;
}) {
  await requireUser();
  const { internshipId, status } = await searchParams;

  const db = getDb();
  const conditions = [];
  if (internshipId) conditions.push(eq(internshipApplications.internshipId, Number(internshipId)));
  if (status && statusOptions.includes(status as InternshipAppStatus)) {
    conditions.push(eq(internshipApplications.status, status as InternshipAppStatus));
  }

  const applications = await db
    .select({
      id: internshipApplications.id,
      fullName: internshipApplications.fullName,
      email: internshipApplications.email,
      status: internshipApplications.status,
      createdAt: internshipApplications.createdAt,
      positionName: internships.position,
    })
    .from(internshipApplications)
    .innerJoin(internships, eq(internshipApplications.internshipId, internships.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(internshipApplications.createdAt));

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">
        Internship Applications
      </h1>
      {internshipId && (
        <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
          Filtered by internship.{" "}
          <Link href="/admin/internships/applications" className="text-[var(--color-brand-blue)] hover:underline">
            Clear filter
          </Link>
        </p>
      )}

      <div className="mt-6 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
            <tr>
              <th className="px-5 py-3 font-medium text-[var(--color-ink-muted)]">Applicant</th>
              <th className="px-5 py-3 font-medium text-[var(--color-ink-muted)]">Position</th>
              <th className="px-5 py-3 font-medium text-[var(--color-ink-muted)]">Status</th>
              <th className="px-5 py-3 font-medium text-[var(--color-ink-muted)]">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {applications.map((a) => (
              <tr key={a.id} className="hover:bg-[var(--color-bg-subtle)]">
                <td className="px-5 py-3">
                  <Link href={`/admin/internships/applications/${a.id}`} className="block">
                    <span className="font-medium text-[var(--color-ink)]">{a.fullName}</span>
                    <span className="block text-xs text-[var(--color-ink-muted)]">{a.email}</span>
                  </Link>
                </td>
                <td className="px-5 py-3 text-[var(--color-ink-muted)]">{a.positionName}</td>
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
