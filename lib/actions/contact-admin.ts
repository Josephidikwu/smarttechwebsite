"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { contactSubmissions, statusHistory, type ContactStatus } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth/rbac";

const ENTITY_TYPE = "contact_submission";
const LIST_PATH = "/admin/contact";

async function getSubmissionOrThrow(db: ReturnType<typeof getDb>, id: number) {
  const [row] = await db
    .select()
    .from(contactSubmissions)
    .where(eq(contactSubmissions.id, id))
    .limit(1);
  if (!row) throw new Error("Submission not found");
  return row;
}

export async function updateContactStatus(id: number, newStatus: ContactStatus, note: string) {
  const user = await requireUser();
  const db = getDb();
  const submission = await getSubmissionOrThrow(db, id);

  await db
    .update(contactSubmissions)
    .set({ status: newStatus, updatedAt: new Date() })
    .where(eq(contactSubmissions.id, id));

  await db.insert(statusHistory).values({
    entityType: ENTITY_TYPE,
    entityId: id,
    fromStatus: submission.status,
    toStatus: newStatus,
    changedBy: user.id,
    note: note || null,
  });

  revalidatePath(`${LIST_PATH}/${id}`);
  revalidatePath(LIST_PATH);
}

export async function addContactNote(id: number, note: string) {
  const user = await requireUser();
  if (!note.trim()) return;
  const db = getDb();
  const submission = await getSubmissionOrThrow(db, id);

  await db.insert(statusHistory).values({
    entityType: ENTITY_TYPE,
    entityId: id,
    fromStatus: submission.status,
    toStatus: submission.status,
    changedBy: user.id,
    note,
  });

  revalidatePath(`${LIST_PATH}/${id}`);
}

export async function archiveContact(id: number, archived: boolean) {
  await requireUser();
  const db = getDb();
  await db
    .update(contactSubmissions)
    .set({ archivedAt: archived ? new Date() : null, updatedAt: new Date() })
    .where(eq(contactSubmissions.id, id));

  revalidatePath(`${LIST_PATH}/${id}`);
  revalidatePath(LIST_PATH);
}

/** admin/super_admin only — editors can triage but not permanently delete. */
export async function deleteContact(id: number) {
  await requireUser("admin");
  const db = getDb();
  await db
    .delete(statusHistory)
    .where(and(eq(statusHistory.entityType, ENTITY_TYPE), eq(statusHistory.entityId, id)));
  await db.delete(contactSubmissions).where(eq(contactSubmissions.id, id));

  revalidatePath(LIST_PATH);
  redirect(LIST_PATH);
}
