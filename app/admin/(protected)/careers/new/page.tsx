import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/rbac";
import { createJob } from "@/lib/actions/careers-admin";
import { JobForm } from "@/components/sections/admin/job-form";

export const metadata: Metadata = { title: "New Job", robots: { index: false } };

export default async function NewJobPage() {
  await requireUser("admin");

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">New Job</h1>
      <div className="mt-6 max-w-3xl rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-6">
        <JobForm action={createJob} submitLabel="Create Job" />
      </div>
    </div>
  );
}
