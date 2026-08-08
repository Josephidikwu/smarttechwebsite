import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { requireUser } from "@/lib/auth/rbac";
import { getDb } from "@/lib/db/client";
import { trainingProgrammes } from "@/lib/db/schema";
import { updateTrainingProgramme } from "@/lib/actions/training-admin";
import { TrainingProgrammeForm } from "@/components/sections/admin/training-programme-form";

export const metadata: Metadata = { title: "Edit Training Programme", robots: { index: false } };

export default async function EditTrainingProgrammePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser("admin");
  const { id } = await params;
  const programmeId = Number(id);
  if (!Number.isInteger(programmeId)) notFound();

  const db = getDb();
  const [programme] = await db
    .select()
    .from(trainingProgrammes)
    .where(eq(trainingProgrammes.id, programmeId))
    .limit(1);
  if (!programme) notFound();

  const boundAction = updateTrainingProgramme.bind(null, programmeId);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">
        Edit {programme.name}
      </h1>
      <div className="mt-6 max-w-3xl rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-6">
        <TrainingProgrammeForm action={boundAction} submitLabel="Save Changes" initial={programme} />
      </div>
    </div>
  );
}
