import type { Metadata } from "next";
import Link from "next/link";
import { and, desc, eq } from "drizzle-orm";
import { requireUser } from "@/lib/auth/rbac";
import { getDb } from "@/lib/db/client";
import { trainingApplications, trainingProgrammes, type TrainingAppStatus } from "@/lib/db/schema";
import { StatusBadge, type Tone } from "@/components/ui/status-badge";

export const metadata: Metadata = { title: "Training Applications", robots: { index: false } };

const statusTone: Record<string, Tone> = {
  new: "info",
  reviewing: "warning",
  shortlisted: "warning",
  accepted: "success",
  rejected: "danger",
};
const statusOptions: TrainingAppStatus[] = ["new", "reviewing", "shortlisted", "accepted", "rejected"];

export default async function AdminTrainingApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ programmeId?: string; status?: string }>;
}) {
  await requireUser();
  const { programmeId, status } = await searchParams;

  const db = getDb();
  const conditions = [];
  if (programmeId) conditions.push(eq(trainingApplications.programmeId, Number(programmeId)));
  if (status && statusOptions.includes(status as TrainingAppStatus)) {
    conditions.push(eq(trainingApplications.status, status as TrainingAppStatus));
  }

  const applications = await db
    .select({
      id: trainingApplications.id,
      fullName: trainingApplications.fullName,
      email: trainingApplications.email,
      status: trainingApplications.status,
      createdAt: trainingApplications.createdAt,
      programmeName: trainingProgrammes.name,
    })
    .from(trainingApplications)
    .innerJoin(trainingProgrammes, eq(trainingApplications.programmeId, trainingProgrammes.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(trainingApplications.createdAt));

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">
        Training Applications
      </h1>
      <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
        {programmeId ? "Filtered by programme. " : ""}
        <Link href="/admin/training/applications" className="text-[var(--color-brand-blue)] hover:underline">
          {programmeId ? "Clear filter" : ""}
        </Link>
      </p>

      <div className="mt-6 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
            <tr>
              <th className="px-5 py-3 font-medium text-[var(--color-ink-muted)]">Applicant</th>
              <th className="px-5 py-3 font-medium text-[var(--color-ink-muted)]">Programme</th>
              <th className="px-5 py-3 font-medium text-[var(--color-ink-muted)]">Status</th>
              <th className="px-5 py-3 font-medium text-[var(--color-ink-muted)]">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {applications.map((a) => (
              <tr key={a.id} className="hover:bg-[var(--color-bg-subtle)]">
                <td className="px-5 py-3">
                  <Link href={`/admin/training/applications/${a.id}`} className="block">
                    <span className="font-medium text-[var(--color-ink)]">{a.fullName}</span>
                    <span className="block text-xs text-[var(--color-ink-muted)]">{a.email}</span>
                  </Link>
                </td>
                <td className="px-5 py-3 text-[var(--color-ink-muted)]">{a.programmeName}</td>
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
