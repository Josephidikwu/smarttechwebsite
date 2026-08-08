import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/rbac";
import { createTrainingProgramme } from "@/lib/actions/training-admin";
import { TrainingProgrammeForm } from "@/components/sections/admin/training-programme-form";

export const metadata: Metadata = { title: "New Training Programme", robots: { index: false } };

export default async function NewTrainingProgrammePage() {
  await requireUser("admin");

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">New Programme</h1>
      <div className="mt-6 max-w-3xl rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-6">
        <TrainingProgrammeForm action={createTrainingProgramme} submitLabel="Create Programme" />
      </div>
    </div>
  );
}
