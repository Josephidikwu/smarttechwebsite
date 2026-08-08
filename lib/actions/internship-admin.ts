"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { internships, internshipApplications, statusHistory } from "@/lib/db/schema";
import type { InternshipAppStatus } from "@/lib/db/schema";
import { internshipSchema } from "@/lib/validation/schemas";
import { requireUser } from "@/lib/auth/rbac";
import { slugify } from "@/lib/utils/slugify";

const ENTITY_TYPE = "internship_application";

export type InternshipFormState = {
  errors?: Record<string, string[]>;
  formError?: string;
};

function parseInternshipForm(formData: FormData) {
  return internshipSchema.safeParse({
    position: formData.get("position"),
    department: formData.get("department"),
    description: formData.get("description"),
    responsibilities: formData.get("responsibilities"),
    requirements: formData.get("requirements"),
    duration: formData.get("duration"),
    location: formData.get("location"),
    workArrangement: formData.get("workArrangement"),
    applicationDeadline: formData.get("applicationDeadline"),
    positionsAvailable: formData.get("positionsAvailable"),
    status: formData.get("status"),
  });
}

function toDate(value: string) {
  return value ? new Date(value) : null;
}

export async function createInternship(
  _prevState: InternshipFormState,
  formData: FormData,
): Promise<InternshipFormState> {
  await requireUser("admin");
  const parsed = parseInternshipForm(formData);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  const db = getDb();
  const baseSlug = slugify(parsed.data.position);
  let slug = baseSlug;
  let n = 1;
  while ((await db.select({ id: internships.id }).from(internships).where(eq(internships.slug, slug)))[0]) {
    slug = `${baseSlug}-${++n}`;
  }

  await db.insert(internships).values({
    position: parsed.data.position,
    slug,
    department: parsed.data.department || null,
    description: parsed.data.description || null,
    responsibilities: parsed.data.responsibilities || null,
    requirements: parsed.data.requirements || null,
    duration: parsed.data.duration || null,
    location: parsed.data.location || null,
    workArrangement: parsed.data.workArrangement || null,
    applicationDeadline: toDate(parsed.data.applicationDeadline ?? ""),
    positionsAvailable: parsed.data.positionsAvailable ? Number(parsed.data.positionsAvailable) : null,
    status: parsed.data.status,
  });

  revalidatePath("/admin/internships");
  revalidatePath("/opportunities/internship");
  redirect("/admin/internships");
}

export async function updateInternship(
  id: number,
  _prevState: InternshipFormState,
  formData: FormData,
): Promise<InternshipFormState> {
  await requireUser("admin");
  const parsed = parseInternshipForm(formData);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  const db = getDb();
  await db
    .update(internships)
    .set({
      position: parsed.data.position,
      department: parsed.data.department || null,
      description: parsed.data.description || null,
      responsibilities: parsed.data.responsibilities || null,
      requirements: parsed.data.requirements || null,
      duration: parsed.data.duration || null,
      location: parsed.data.location || null,
      workArrangement: parsed.data.workArrangement || null,
      applicationDeadline: toDate(parsed.data.applicationDeadline ?? ""),
      positionsAvailable: parsed.data.positionsAvailable ? Number(parsed.data.positionsAvailable) : null,
      status: parsed.data.status,
      updatedAt: new Date(),
    })
    .where(eq(internships.id, id));

  revalidatePath("/admin/internships");
  revalidatePath("/opportunities/internship");
  redirect("/admin/internships");
}

export async function updateInternshipApplicationStatus(
  id: number,
  newStatus: InternshipAppStatus,
  note: string,
) {
  const user = await requireUser();
  const db = getDb();
  const [app] = await db
    .select({ status: internshipApplications.status })
    .from(internshipApplications)
    .where(eq(internshipApplications.id, id))
    .limit(1);
  if (!app) return;

  await db.update(internshipApplications).set({ status: newStatus }).where(eq(internshipApplications.id, id));
  await db.insert(statusHistory).values({
    entityType: ENTITY_TYPE,
    entityId: id,
    fromStatus: app.status,
    toStatus: newStatus,
    changedBy: user.id,
    note: note || null,
  });

  revalidatePath(`/admin/internships/applications/${id}`);
  revalidatePath("/admin/internships/applications");
}

export async function addInternshipApplicationNote(id: number, note: string) {
  const user = await requireUser();
  if (!note.trim()) return;
  const db = getDb();
  const [app] = await db
    .select({ status: internshipApplications.status })
    .from(internshipApplications)
    .where(eq(internshipApplications.id, id))
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

  revalidatePath(`/admin/internships/applications/${id}`);
}
