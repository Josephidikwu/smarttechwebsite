import type { Metadata } from "next";
import Link from "next/link";
import { desc, eq, count } from "drizzle-orm";
import { requireUser } from "@/lib/auth/rbac";
import { getDb } from "@/lib/db/client";
import { internships, internshipApplications } from "@/lib/db/schema";
import { StatusBadge, type Tone } from "@/components/ui/status-badge";

export const metadata: Metadata = { title: "Internships", robots: { index: false } };

const statusTone: Record<string, Tone> = { draft: "neutral", open: "success", closed: "danger" };

export default async function AdminInternshipsPage() {
  await requireUser();
  const db = getDb();

  const rows = await db
    .select({
      id: internships.id,
      position: internships.position,
      department: internships.department,
      status: internships.status,
      applicationCount: count(internshipApplications.id),
    })
    .from(internships)
    .leftJoin(internshipApplications, eq(internshipApplications.internshipId, internships.id))
    .groupBy(internships.id)
    .orderBy(desc(internships.createdAt));

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">Internships</h1>
          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
            Manage internship opportunities shown publicly.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/internships/applications"
            className="rounded-md border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-ink)] hover:bg-[var(--color-bg-subtle)]"
          >
            All Applications
          </Link>
          <Link
            href="/admin/internships/new"
            className="rounded-md bg-[var(--color-brand-blue)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-brand-blue-dark)]"
          >
            New Internship
          </Link>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
            <tr>
              <th className="px-5 py-3 font-medium text-[var(--color-ink-muted)]">Position</th>
              <th className="px-5 py-3 font-medium text-[var(--color-ink-muted)]">Department</th>
              <th className="px-5 py-3 font-medium text-[var(--color-ink-muted)]">Status</th>
              <th className="px-5 py-3 font-medium text-[var(--color-ink-muted)]">Applicants</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-[var(--color-bg-subtle)]">
                <td className="px-5 py-3 font-medium text-[var(--color-ink)]">{r.position}</td>
                <td className="px-5 py-3 text-[var(--color-ink-muted)]">{r.department || "—"}</td>
                <td className="px-5 py-3">
                  <StatusBadge tone={statusTone[r.status]}>{r.status}</StatusBadge>
                </td>
                <td className="px-5 py-3 text-[var(--color-ink-muted)]">
                  <Link href={`/admin/internships/applications?internshipId=${r.id}`} className="hover:underline">
                    {r.applicationCount}
                  </Link>
                </td>
                <td className="px-5 py-3 text-right">
                  <Link
                    href={`/admin/internships/${r.id}/edit`}
                    className="text-sm font-medium text-[var(--color-brand-blue)] hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-[var(--color-ink-muted)]">
                  No internships yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
