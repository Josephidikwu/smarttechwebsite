"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { jobs, jobApplications, generalApplications, statusHistory } from "@/lib/db/schema";
import type { JobAppStatus } from "@/lib/db/schema";
import { jobSchema } from "@/lib/validation/schemas";
import { requireUser } from "@/lib/auth/rbac";
import { slugify } from "@/lib/utils/slugify";

const JOB_APP_ENTITY = "job_application";
const GENERAL_APP_ENTITY = "general_application";

export type JobFormState = {
  errors?: Record<string, string[]>;
  formError?: string;
};

function parseJobForm(formData: FormData) {
  return jobSchema.safeParse({
    title: formData.get("title"),
    department: formData.get("department"),
    location: formData.get("location"),
    employmentType: formData.get("employmentType"),
    experienceLevel: formData.get("experienceLevel"),
    salary: formData.get("salary"),
    description: formData.get("description"),
    responsibilities: formData.get("responsibilities"),
    requirements: formData.get("requirements"),
    niceToHave: formData.get("niceToHave"),
    applicationDeadline: formData.get("applicationDeadline"),
    status: formData.get("status"),
  });
}

function toDate(value: string) {
  return value ? new Date(value) : null;
}

export async function createJob(_prevState: JobFormState, formData: FormData): Promise<JobFormState> {
  await requireUser("admin");
  const parsed = parseJobForm(formData);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  const db = getDb();
  const baseSlug = slugify(parsed.data.title);
  let slug = baseSlug;
  let n = 1;
  while ((await db.select({ id: jobs.id }).from(jobs).where(eq(jobs.slug, slug)))[0]) {
    slug = `${baseSlug}-${++n}`;
  }

  await db.insert(jobs).values({
    title: parsed.data.title,
    slug,
    department: parsed.data.department || null,
    location: parsed.data.location || null,
    employmentType: parsed.data.employmentType || null,
    experienceLevel: parsed.data.experienceLevel || null,
    salary: parsed.data.salary || null,
    description: parsed.data.description || null,
    responsibilities: parsed.data.responsibilities || null,
    requirements: parsed.data.requirements || null,
    niceToHave: parsed.data.niceToHave || null,
    applicationDeadline: toDate(parsed.data.applicationDeadline ?? ""),
    status: parsed.data.status,
  });

  revalidatePath("/admin/careers");
  revalidatePath("/opportunities/careers");
  redirect("/admin/careers");
}

export async function updateJob(
  id: number,
  _prevState: JobFormState,
  formData: FormData,
): Promise<JobFormState> {
  await requireUser("admin");
  const parsed = parseJobForm(formData);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors };

  const db = getDb();
  await db
    .update(jobs)
    .set({
      title: parsed.data.title,
      department: parsed.data.department || null,
      location: parsed.data.location || null,
      employmentType: parsed.data.employmentType || null,
      experienceLevel: parsed.data.experienceLevel || null,
      salary: parsed.data.salary || null,
      description: parsed.data.description || null,
      responsibilities: parsed.data.responsibilities || null,
      requirements: parsed.data.requirements || null,
      niceToHave: parsed.data.niceToHave || null,
      applicationDeadline: toDate(parsed.data.applicationDeadline ?? ""),
      status: parsed.data.status,
      updatedAt: new Date(),
    })
    .where(eq(jobs.id, id));

  revalidatePath("/admin/careers");
  revalidatePath("/opportunities/careers");
  redirect("/admin/careers");
}

export async function updateJobApplicationStatus(id: number, newStatus: JobAppStatus, note: string) {
  const user = await requireUser();
  const db = getDb();
  const [app] = await db
    .select({ status: jobApplications.status })
    .from(jobApplications)
    .where(eq(jobApplications.id, id))
    .limit(1);
  if (!app) return;

  await db.update(jobApplications).set({ status: newStatus }).where(eq(jobApplications.id, id));
  await db.insert(statusHistory).values({
    entityType: JOB_APP_ENTITY,
    entityId: id,
    fromStatus: app.status,
    toStatus: newStatus,
    changedBy: user.id,
    note: note || null,
  });

  revalidatePath(`/admin/careers/applications/${id}`);
  revalidatePath("/admin/careers/applications");
}

export async function addJobApplicationNote(id: number, note: string) {
  const user = await requireUser();
  if (!note.trim()) return;
  const db = getDb();
  const [app] = await db
    .select({ status: jobApplications.status })
    .from(jobApplications)
    .where(eq(jobApplications.id, id))
    .limit(1);
  if (!app) return;

  await db.insert(statusHistory).values({
    entityType: JOB_APP_ENTITY,
    entityId: id,
    fromStatus: app.status,
    toStatus: app.status,
    changedBy: user.id,
    note,
  });

  revalidatePath(`/admin/careers/applications/${id}`);
}

export async function updateGeneralApplicationStatus(id: number, newStatus: JobAppStatus, note: string) {
  const user = await requireUser();
  const db = getDb();
  const [app] = await db
    .select({ status: generalApplications.status })
    .from(generalApplications)
    .where(eq(generalApplications.id, id))
    .limit(1);
  if (!app) return;

  await db.update(generalApplications).set({ status: newStatus }).where(eq(generalApplications.id, id));
  await db.insert(statusHistory).values({
    entityType: GENERAL_APP_ENTITY,
    entityId: id,
    fromStatus: app.status,
    toStatus: newStatus,
    changedBy: user.id,
    note: note || null,
  });

  revalidatePath(`/admin/careers/general/${id}`);
  revalidatePath("/admin/careers/general");
}

export async function addGeneralApplicationNote(id: number, note: string) {
  const user = await requireUser();
  if (!note.trim()) return;
  const db = getDb();
  const [app] = await db
    .select({ status: generalApplications.status })
    .from(generalApplications)
    .where(eq(generalApplications.id, id))
    .limit(1);
  if (!app) return;

  await db.insert(statusHistory).values({
    entityType: GENERAL_APP_ENTITY,
    entityId: id,
    fromStatus: app.status,
    toStatus: app.status,
    changedBy: user.id,
    note,
  });

  revalidatePath(`/admin/careers/general/${id}`);
}
