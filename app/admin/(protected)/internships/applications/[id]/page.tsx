import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { and, desc, eq } from "drizzle-orm";
import { requireUser } from "@/lib/auth/rbac";
import { getDb } from "@/lib/db/client";
import { internshipApplications, internships, statusHistory, users } from "@/lib/db/schema";
import { StatusBadge, type Tone } from "@/components/ui/status-badge";
import { InternshipApplicationActions } from "@/components/sections/admin/internship-application-actions";
import { adminFileUrl } from "@/lib/storage/r2";

export const metadata: Metadata = { title: "Application Detail", robots: { index: false } };

const statusTone: Record<string, Tone> = {
  new: "info",
  reviewing: "warning",
  shortlisted: "warning",
  interview: "warning",
  accepted: "success",
  rejected: "danger",
};

export default async function AdminInternshipApplicationDetailPage({
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
    .select({
      id: internshipApplications.id,
      fullName: internshipApplications.fullName,
      email: internshipApplications.email,
      phone: internshipApplications.phone,
      institution: internshipApplications.institution,
      courseOfStudy: internshipApplications.courseOfStudy,
      graduationYear: internshipApplications.graduationYear,
      areaOfInterest: internshipApplications.areaOfInterest,
      skills: internshipApplications.skills,
      portfolio: internshipApplications.portfolio,
      github: internshipApplications.github,
      linkedin: internshipApplications.linkedin,
      coverLetter: internshipApplications.coverLetter,
      availability: internshipApplications.availability,
      cvKey: internshipApplications.cvKey,
      status: internshipApplications.status,
      createdAt: internshipApplications.createdAt,
      positionName: internships.position,
    })
    .from(internshipApplications)
    .innerJoin(internships, eq(internshipApplications.internshipId, internships.id))
    .where(eq(internshipApplications.id, applicationId))
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
    .where(and(eq(statusHistory.entityType, "internship_application"), eq(statusHistory.entityId, applicationId)))
    .orderBy(desc(statusHistory.changedAt));

  const links = [
    ["Portfolio", application.portfolio],
    ["GitHub", application.github],
    ["LinkedIn", application.linkedin],
  ] as const;

  return (
    <div className="p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">
            {application.fullName}
          </h1>
          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
            {application.email} · Applying for {application.positionName}
          </p>
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
              <dt className="text-[var(--color-ink-muted)]">Institution</dt>
              <dd className="mt-0.5 text-[var(--color-ink)]">{application.institution || "—"}</dd>
            </div>
            <div>
              <dt className="text-[var(--color-ink-muted)]">Course of study</dt>
              <dd className="mt-0.5 text-[var(--color-ink)]">{application.courseOfStudy || "—"}</dd>
            </div>
            <div>
              <dt className="text-[var(--color-ink-muted)]">Graduation year</dt>
              <dd className="mt-0.5 text-[var(--color-ink)]">{application.graduationYear || "—"}</dd>
            </div>
            <div>
              <dt className="text-[var(--color-ink-muted)]">Area of interest</dt>
              <dd className="mt-0.5 text-[var(--color-ink)]">{application.areaOfInterest || "—"}</dd>
            </div>
            <div>
              <dt className="text-[var(--color-ink-muted)]">Availability</dt>
              <dd className="mt-0.5 text-[var(--color-ink)]">{application.availability || "—"}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-[var(--color-ink-muted)]">Skills</dt>
              <dd className="mt-1 whitespace-pre-wrap text-[var(--color-ink)]">{application.skills || "—"}</dd>
            </div>
            {application.coverLetter && (
              <div className="col-span-2">
                <dt className="text-[var(--color-ink-muted)]">Cover letter</dt>
                <dd className="mt-1 whitespace-pre-wrap text-[var(--color-ink)]">{application.coverLetter}</dd>
              </div>
            )}
            <div className="col-span-2 flex flex-wrap gap-4">
              {links
                .filter(([, url]) => url)
                .map(([label, url]) => (
                  <a
                    key={label}
                    href={url!}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[var(--color-brand-blue)] hover:underline"
                  >
                    {label} →
                  </a>
                ))}
            </div>
            <div className="col-span-2">
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
          <InternshipApplicationActions id={application.id} currentStatus={application.status} />
        </div>
      </div>
    </div>
  );
}
