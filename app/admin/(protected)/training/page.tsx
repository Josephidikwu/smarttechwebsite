import type { Metadata } from "next";
import Link from "next/link";
import { desc, eq, count } from "drizzle-orm";
import { requireUser } from "@/lib/auth/rbac";
import { getDb } from "@/lib/db/client";
import { trainingProgrammes, trainingApplications } from "@/lib/db/schema";
import { StatusBadge, type Tone } from "@/components/ui/status-badge";

export const metadata: Metadata = { title: "Training Programmes", robots: { index: false } };

const statusTone: Record<string, Tone> = { draft: "neutral", open: "success", closed: "danger" };

export default async function AdminTrainingPage() {
  await requireUser();
  const db = getDb();

  const programmes = await db
    .select({
      id: trainingProgrammes.id,
      name: trainingProgrammes.name,
      category: trainingProgrammes.category,
      status: trainingProgrammes.status,
      applicationCount: count(trainingApplications.id),
    })
    .from(trainingProgrammes)
    .leftJoin(trainingApplications, eq(trainingApplications.programmeId, trainingProgrammes.id))
    .groupBy(trainingProgrammes.id)
    .orderBy(desc(trainingProgrammes.createdAt));

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">
            Training Programmes
          </h1>
          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
            Manage programmes shown on the public Training page.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/training/applications"
            className="rounded-md border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-ink)] hover:bg-[var(--color-bg-subtle)]"
          >
            All Applications
          </Link>
          <Link
            href="/admin/training/new"
            className="rounded-md bg-[var(--color-brand-blue)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-brand-blue-dark)]"
          >
            New Programme
          </Link>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
            <tr>
              <th className="px-5 py-3 font-medium text-[var(--color-ink-muted)]">Name</th>
              <th className="px-5 py-3 font-medium text-[var(--color-ink-muted)]">Category</th>
              <th className="px-5 py-3 font-medium text-[var(--color-ink-muted)]">Status</th>
              <th className="px-5 py-3 font-medium text-[var(--color-ink-muted)]">Applicants</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {programmes.map((p) => (
              <tr key={p.id} className="hover:bg-[var(--color-bg-subtle)]">
                <td className="px-5 py-3 font-medium text-[var(--color-ink)]">{p.name}</td>
                <td className="px-5 py-3 text-[var(--color-ink-muted)]">{p.category || "—"}</td>
                <td className="px-5 py-3">
                  <StatusBadge tone={statusTone[p.status]}>{p.status}</StatusBadge>
                </td>
                <td className="px-5 py-3 text-[var(--color-ink-muted)]">
                  <Link
                    href={`/admin/training/applications?programmeId=${p.id}`}
                    className="hover:underline"
                  >
                    {p.applicationCount}
                  </Link>
                </td>
                <td className="px-5 py-3 text-right">
                  <Link
                    href={`/admin/training/${p.id}/edit`}
                    className="text-sm font-medium text-[var(--color-brand-blue)] hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {programmes.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-[var(--color-ink-muted)]">
                  No programmes yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
