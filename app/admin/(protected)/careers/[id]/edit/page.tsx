import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { requireUser } from "@/lib/auth/rbac";
import { getDb } from "@/lib/db/client";
import { jobs } from "@/lib/db/schema";
import { updateJob } from "@/lib/actions/careers-admin";
import { JobForm } from "@/components/sections/admin/job-form";

export const metadata: Metadata = { title: "Edit Job", robots: { index: false } };

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  await requireUser("admin");
  const { id } = await params;
  const jobId = Number(id);
  if (!Number.isInteger(jobId)) notFound();

  const db = getDb();
  const [job] = await db.select().from(jobs).where(eq(jobs.id, jobId)).limit(1);
  if (!job) notFound();

  const boundAction = updateJob.bind(null, jobId);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">Edit {job.title}</h1>
      <div className="mt-6 max-w-3xl rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-6">
        <JobForm action={boundAction} submitLabel="Save Changes" initial={job} />
      </div>
    </div>
  );
}
