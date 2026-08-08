import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { and, desc, eq } from "drizzle-orm";
import { requireUser } from "@/lib/auth/rbac";
import { getDb } from "@/lib/db/client";
import { generalApplications, statusHistory, users, type JobAppStatus } from "@/lib/db/schema";
import { StatusBadge, type Tone } from "@/components/ui/status-badge";
import { ApplicationPipelineActions } from "@/components/sections/admin/application-pipeline-actions";
import { updateGeneralApplicationStatus, addGeneralApplicationNote } from "@/lib/actions/careers-admin";
import { adminFileUrl } from "@/lib/storage/r2";

export const metadata: Metadata = { title: "General Application Detail", robots: { index: false } };

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

export default async function AdminGeneralApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser();
  const { id } = await params;
  const applicationId = Number(id);
  if (!Number.isInteger(applicationId)) notFound();

  const db = getDb();
  const [application] = await db
    .select()
    .from(generalApplications)
    .where(eq(generalApplications.id, applicationId))
    .limit(1);
  if (!application) notFound();

  const history = await db
    .select({
      id: statusHistory.id,
      fromStatus: statusHistory.fromStatus,
      toStatus: statusHistory.toStatus,
      note: statusHistory.note,
      changedAt: statusHistory.changedAt,
      changedByName: users.name,
    })
    .from(statusHistory)
    .leftJoin(users, eq(statusHistory.changedBy, users.id))
    .where(and(eq(statusHistory.entityType, "general_application"), eq(statusHistory.entityId, applicationId)))
    .orderBy(desc(statusHistory.changedAt));

  return (
    <div className="p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">
            {application.fullName}
          </h1>
          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{application.email}</p>
        </div>
        <StatusBadge tone={statusTone[application.status]}>{application.status}</StatusBadge>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-6 text-sm">
            <div>
              <dt className="text-[var(--color-ink-muted)]">Phone</dt>
              <dd className="mt-0.5 text-[var(--color-ink)]">{application.phone || "—"}</dd>
            </div>
            <div>
              <dt className="text-[var(--color-ink-muted)]">Submitted</dt>
              <dd className="mt-0.5 text-[var(--color-ink)]">
                {new Date(application.createdAt).toLocaleString()}
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="text-[var(--color-ink-muted)]">Message</dt>
              <dd className="mt-1 whitespace-pre-wrap text-[var(--color-ink)]">{application.message}</dd>
            </div>
            <div className="col-span-2 flex flex-wrap gap-4">
              {application.portfolio && (
                <a href={application.portfolio} target="_blank" rel="noreferrer" className="text-[var(--color-brand-blue)] hover:underline">
                  Portfolio →
                </a>
              )}
              {application.linkedin && (
                <a href={application.linkedin} target="_blank" rel="noreferrer" className="text-[var(--color-brand-blue)] hover:underline">
                  LinkedIn →
                </a>
              )}
            </div>
            <div>
              <dt className="text-[var(--color-ink-muted)]">CV</dt>
              <dd className="mt-0.5">
                {application.cvKey ? (
                  <a href={adminFileUrl(application.cvKey)} className="text-[var(--color-brand-blue)] hover:underline">
                    Download CV
                  </a>
                ) : (
                  <span className="text-[var(--color-ink-muted)]">Not provided</span>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-[var(--color-ink-muted)]">Cover Letter</dt>
              <dd className="mt-0.5">
                {application.coverLetterKey ? (
                  <a href={adminFileUrl(application.coverLetterKey)} className="text-[var(--color-brand-blue)] hover:underline">
                    Download Cover Letter
                  </a>
                ) : (
                  <span className="text-[var(--color-ink-muted)]">Not provided</span>
                )}
              </dd>
            </div>
          </dl>

          <div className="mt-8">
            <h2 className="text-sm font-semibold text-[var(--color-ink)]">Activity</h2>
            <ol className="mt-3 flex flex-col gap-4">
              {history.map((h) => (
                <li key={h.id} className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] p-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[var(--color-ink)]">
                      {h.fromStatus !== h.toStatus ? `${h.fromStatus ?? "—"} → ${h.toStatus}` : "Note added"}
                    </span>
                    <span className="text-xs text-[var(--color-ink-muted)]">
                      {new Date(h.changedAt).toLocaleString()}
                    </span>
                  </div>
                  {h.note && <p className="mt-1.5 text-[var(--color-ink-muted)]">{h.note}</p>}
                  <p className="mt-1.5 text-xs text-[var(--color-ink-muted)]">{h.changedByName ?? "System"}</p>
                </li>
              ))}
              {history.length === 0 && <li className="text-sm text-[var(--color-ink-muted)]">No activity yet.</li>}
            </ol>
          </div>
        </div>

        <div className="lg:col-span-5">
          <ApplicationPipelineActions
            id={application.id}
            currentStatus={application.status}
            statusOptions={statusOptions}
            onUpdateStatus={updateGeneralApplicationStatus}
            onAddNote={addGeneralApplicationNote}
          />
        </div>
      </div>
    </div>
  );
}
