"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { trainingApplications, trainingProgrammes, statusHistory } from "@/lib/db/schema";
import type { TrainingAppStatus } from "@/lib/db/schema";
import { trainingProgrammeSchema } from "@/lib/validation/schemas";
import { requireUser } from "@/lib/auth/rbac";
import { slugify } from "@/lib/utils/slugify";

const ENTITY_TYPE = "training_application";

export type ProgrammeFormState = {
  errors?: Record<string, string[]>;
  formError?: string;
};

function parseProgrammeForm(formData: FormData) {
  return trainingProgrammeSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    category: formData.get("category"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    duration: formData.get("duration"),
    format: formData.get("format"),
    location: formData.get("location"),
    applicationDeadline: formData.get("applicationDeadline"),
    capacity: formData.get("capacity"),
    status: formData.get("status"),
    requirements: formData.get("requirements"),
  });
}

function toDate(value: string) {
  return value ? new Date(value) : null;
}

export async function createTrainingProgramme(
  _prevState: ProgrammeFormState,
  formData: FormData,
): Promise<ProgrammeFormState> {
  await requireUser("admin");
  const parsed = parseProgrammeForm(formData);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  const db = getDb();
  const baseSlug = slugify(parsed.data.name);
  let slug = baseSlug;
  let n = 1;
  while ((await db.select({ id: trainingProgrammes.id }).from(trainingProgrammes).where(eq(trainingProgrammes.slug, slug)))[0]) {
    slug = `${baseSlug}-${++n}`;
  }

  await db.insert(trainingProgrammes).values({
    name: parsed.data.name,
    slug,
    description: parsed.data.description || null,
    category: parsed.data.category || null,
    startDate: toDate(parsed.data.startDate ?? ""),
    endDate: toDate(parsed.data.endDate ?? ""),
    duration: parsed.data.duration || null,
    format: parsed.data.format || null,
    location: parsed.data.location || null,
    applicationDeadline: toDate(parsed.data.applicationDeadline ?? ""),
    capacity: parsed.data.capacity ? Number(parsed.data.capacity) : null,
    status: parsed.data.status,
    requirements: parsed.data.requirements || null,
  });

  revalidatePath("/admin/training");
  revalidatePath("/opportunities/training");
  redirect("/admin/training");
}

export async function updateTrainingProgramme(
  id: number,
  _prevState: ProgrammeFormState,
  formData: FormData,
): Promise<ProgrammeFormState> {
  await requireUser("admin");
  const parsed = parseProgrammeForm(formData);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  const db = getDb();
  await db
    .update(trainingProgrammes)
    .set({
      name: parsed.data.name,
      description: parsed.data.description || null,
      category: parsed.data.category || null,
      startDate: toDate(parsed.data.startDate ?? ""),
      endDate: toDate(parsed.data.endDate ?? ""),
      duration: parsed.data.duration || null,
      format: parsed.data.format || null,
      location: parsed.data.location || null,
      applicationDeadline: toDate(parsed.data.applicationDeadline ?? ""),
      capacity: parsed.data.capacity ? Number(parsed.data.capacity) : null,
      status: parsed.data.status,
      requirements: parsed.data.requirements || null,
      updatedAt: new Date(),
    })
    .where(eq(trainingProgrammes.id, id));

  revalidatePath("/admin/training");
  revalidatePath("/opportunities/training");
  redirect("/admin/training");
}

export async function updateTrainingApplicationStatus(
  id: number,
  newStatus: TrainingAppStatus,
  note: string,
) {
  const user = await requireUser();
  const db = getDb();
  const [app] = await db
    .select({ status: trainingApplications.status })
    .from(trainingApplications)
    .where(eq(trainingApplications.id, id))
    .limit(1);
  if (!app) return;

  await db.update(trainingApplications).set({ status: newStatus }).where(eq(trainingApplications.id, id));
  await db.insert(statusHistory).values({
    entityType: ENTITY_TYPE,
    entityId: id,
    fromStatus: app.status,
    toStatus: newStatus,
    changedBy: user.id,
    note: note || null,
  });

  revalidatePath(`/admin/training/applications/${id}`);
  revalidatePath("/admin/training/applications");
}

export async function addTrainingApplicationNote(id: number, note: string) {
  const user = await requireUser();
  if (!note.trim()) return;
  const db = getDb();
  const [app] = await db
    .select({ status: trainingApplications.status })
    .from(trainingApplications)
    .where(eq(trainingApplications.id, id))
    .limit(1);
  if (!app) return;

  await db.insert(statusHistory).values({
    entityType: ENTITY_TYPE,
    entityId: id,
    fromStatus: app.status,
    toStatus: app.status,
    changedBy: user.id,
    note,
  });

  revalidatePath(`/admin/training/applications/${id}`);
}
