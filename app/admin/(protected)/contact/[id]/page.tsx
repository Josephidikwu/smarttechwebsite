import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { and, desc, eq } from "drizzle-orm";
import { requireUser, hasRole } from "@/lib/auth/rbac";
import { getDb } from "@/lib/db/client";
import { contactSubmissions, statusHistory, users } from "@/lib/db/schema";
import { StatusBadge, contactStatusTone } from "@/components/ui/status-badge";
import { ContactDetailActions } from "@/components/sections/admin/contact-detail-actions";

export const metadata: Metadata = { title: "Enquiry Detail", robots: { index: false } };

export default async function AdminContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const submissionId = Number(id);
  if (!Number.isInteger(submissionId)) notFound();

  const db = getDb();
  const [submission] = await db
    .select()
    .from(contactSubmissions)
    .where(eq(contactSubmissions.id, submissionId))
    .limit(1);
  if (!submission) notFound();

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
    .where(
      and(eq(statusHistory.entityType, "contact_submission"), eq(statusHistory.entityId, submissionId)),
    )
    .orderBy(desc(statusHistory.changedAt));

  return (
    <div className="p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">
            {submission.name}
          </h1>
          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">{submission.email}</p>
        </div>
        <StatusBadge tone={contactStatusTone(submission.status)}>{submission.status}</StatusBadge>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-6 text-sm">
            <div>
              <dt className="text-[var(--color-ink-muted)]">Phone</dt>
              <dd className="mt-0.5 text-[var(--color-ink)]">{submission.phone || "—"}</dd>
            </div>
            <div>
              <dt className="text-[var(--color-ink-muted)]">Organisation</dt>
              <dd className="mt-0.5 text-[var(--color-ink)]">{submission.organisation || "—"}</dd>
            </div>
            <div>
              <dt className="text-[var(--color-ink-muted)]">Subject</dt>
              <dd className="mt-0.5 text-[var(--color-ink)]">{submission.subject}</dd>
            </div>
            <div>
              <dt className="text-[var(--color-ink-muted)]">Submitted</dt>
              <dd className="mt-0.5 text-[var(--color-ink)]">
                {new Date(submission.createdAt).toLocaleString()}
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="text-[var(--color-ink-muted)]">Message</dt>
              <dd className="mt-1 whitespace-pre-wrap text-[var(--color-ink)]">
                {submission.message}
              </dd>
            </div>
          </dl>

          <div className="mt-8">
            <h2 className="text-sm font-semibold text-[var(--color-ink)]">Activity</h2>
            <ol className="mt-3 flex flex-col gap-4">
              {history.map((h) => (
                <li
                  key={h.id}
                  className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] p-4 text-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[var(--color-ink)]">
                      {h.fromStatus !== h.toStatus
                        ? `${h.fromStatus ?? "—"} → ${h.toStatus}`
                        : "Note added"}
                    </span>
                    <span className="text-xs text-[var(--color-ink-muted)]">
                      {new Date(h.changedAt).toLocaleString()}
                    </span>
                  </div>
                  {h.note && <p className="mt-1.5 text-[var(--color-ink-muted)]">{h.note}</p>}
                  <p className="mt-1.5 text-xs text-[var(--color-ink-muted)]">
                    {h.changedByName ?? "System"}
                  </p>
                </li>
              ))}
              {history.length === 0 && (
                <li className="text-sm text-[var(--color-ink-muted)]">No activity yet.</li>
              )}
            </ol>
          </div>
        </div>

        <div className="lg:col-span-5">
          <ContactDetailActions
            id={submission.id}
            currentStatus={submission.status}
            archived={!!submission.archivedAt}
            canDelete={hasRole(user, "admin")}
          />
        </div>
      </div>
    </div>
  );
}
