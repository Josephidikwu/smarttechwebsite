import type { Metadata } from "next";
import Link from "next/link";
import { desc } from "drizzle-orm";
import { requireUser } from "@/lib/auth/rbac";
import { getDb } from "@/lib/db/client";
import { generalApplications } from "@/lib/db/schema";
import { StatusBadge, type Tone } from "@/components/ui/status-badge";

export const metadata: Metadata = { title: "General Applications", robots: { index: false } };

const statusTone: Record<string, Tone> = {
  new: "info",
  reviewing: "warning",
  shortlisted: "warning",
  interview: "warning",
  offer: "warning",
  hired: "success",
  rejected: "danger",
};

export default async function AdminGeneralApplicationsPage() {
  await requireUser();
  const db = getDb();
  const applications = await db.select().from(generalApplications).orderBy(desc(generalApplications.createdAt));

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">
        General Applications
      </h1>
      <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
        &quot;Don&apos;t see the right role?&quot; submissions — not tied to a specific job.
      </p>

      <div className="mt-6 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
            <tr>
              <th className="px-5 py-3 font-medium text-[var(--color-ink-muted)]">Applicant</th>
              <th className="px-5 py-3 font-medium text-[var(--color-ink-muted)]">Status</th>
              <th className="px-5 py-3 font-medium text-[var(--color-ink-muted)]">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {applications.map((a) => (
              <tr key={a.id} className="hover:bg-[var(--color-bg-subtle)]">
                <td className="px-5 py-3">
                  <Link href={`/admin/careers/general/${a.id}`} className="block">
                    <span className="font-medium text-[var(--color-ink)]">{a.fullName}</span>
                    <span className="block text-xs text-[var(--color-ink-muted)]">{a.email}</span>
                  </Link>
                </td>
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
                <td colSpan={3} className="px-5 py-8 text-center text-[var(--color-ink-muted)]">
                  No general applications yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
