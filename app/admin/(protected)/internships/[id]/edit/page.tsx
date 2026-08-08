import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { requireUser } from "@/lib/auth/rbac";
import { getDb } from "@/lib/db/client";
import { internships } from "@/lib/db/schema";
import { updateInternship } from "@/lib/actions/internship-admin";
import { InternshipForm } from "@/components/sections/admin/internship-form";

export const metadata: Metadata = { title: "Edit Internship", robots: { index: false } };

export default async function EditInternshipPage({ params }: { params: Promise<{ id: string }> }) {
  await requireUser("admin");
  const { id } = await params;
  const internshipId = Number(id);
  if (!Number.isInteger(internshipId)) notFound();

  const db = getDb();
  const [internship] = await db.select().from(internships).where(eq(internships.id, internshipId)).limit(1);
  if (!internship) notFound();

  const boundAction = updateInternship.bind(null, internshipId);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">
        Edit {internship.position}
      </h1>
      <div className="mt-6 max-w-3xl rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-6">
        <InternshipForm action={boundAction} submitLabel="Save Changes" initial={internship} />
      </div>
    </div>
  );
}
