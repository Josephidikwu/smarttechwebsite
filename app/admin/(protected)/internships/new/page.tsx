import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/rbac";
import { createInternship } from "@/lib/actions/internship-admin";
import { InternshipForm } from "@/components/sections/admin/internship-form";

export const metadata: Metadata = { title: "New Internship", robots: { index: false } };

export default async function NewInternshipPage() {
  await requireUser("admin");

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">New Internship</h1>
      <div className="mt-6 max-w-3xl rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-6">
        <InternshipForm action={createInternship} submitLabel="Create Internship" />
      </div>
    </div>
  );
}
