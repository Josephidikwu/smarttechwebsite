import type { Metadata } from "next";
import Link from "next/link";
import { and, desc, eq, isNull, isNotNull, like, or } from "drizzle-orm";
import { requireUser } from "@/lib/auth/rbac";
import { getDb } from "@/lib/db/client";
import { contactSubmissions, type ContactStatus } from "@/lib/db/schema";
import { StatusBadge, contactStatusTone } from "@/components/ui/status-badge";

export const metadata: Metadata = { title: "Contact Enquiries", robots: { index: false } };

const statusOptions: ContactStatus[] = ["new", "in_progress", "resolved"];

export default async function AdminContactListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; archived?: string }>;
}) {
  await requireUser();
  const { q = "", status = "", archived = "" } = await searchParams;

  const db = getDb();
  const conditions = [
    archived === "1" ? isNotNull(contactSubmissions.archivedAt) : isNull(contactSubmissions.archivedAt),
  ];
  if (status && statusOptions.includes(status as ContactStatus)) {
    conditions.push(eq(contactSubmissions.status, status as ContactStatus));
  }
  if (q.trim()) {
    const term = `%${q.trim()}%`;
    conditions.push(
      or(
        like(contactSubmissions.name, term),
        like(contactSubmissions.email, term),
        like(contactSubmissions.organisation, term),
        like(contactSubmissions.message, term),
      )!,
    );
  }

  const submissions = await db
    .select()
    .from(contactSubmissions)
    .where(and(...conditions))
    .orderBy(desc(contactSubmissions.createdAt));

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">
        Contact Enquiries
      </h1>
      <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
        Submissions from the public Contact form.
      </p>

      <form className="mt-6 flex flex-wrap items-end gap-3">
        <div>
          <label className="text-xs font-medium text-[var(--color-ink-muted)]">Search</label>
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Name, email, organisation, message…"
            className="mt-1 block w-64 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-ink)]"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-[var(--color-ink-muted)]">Status</label>
          <select
            name="status"
            defaultValue={status}
            className="mt-1 block rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-ink)]"
          >
            <option value="">All</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-[var(--color-ink-muted)]">View</label>
          <select
            name="archived"
            defaultValue={archived}
            className="mt-1 block rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-ink)]"
          >
            <option value="">Active</option>
            <option value="1">Archived</option>
          </select>
        </div>
        <button
          type="submit"
          className="rounded-md bg-[var(--color-brand-blue)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-brand-blue-dark)]"
        >
          Filter
        </button>
        {(q || status || archived) && (
          <Link href="/admin/contact" className="text-sm text-[var(--color-ink-muted)] hover:underline">
            Clear
          </Link>
        )}
      </form>

      <div className="mt-6 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
            <tr>
              <th className="px-5 py-3 font-medium text-[var(--color-ink-muted)]">Name</th>
              <th className="px-5 py-3 font-medium text-[var(--color-ink-muted)]">Subject</th>
              <th className="px-5 py-3 font-medium text-[var(--color-ink-muted)]">Status</th>
              <th className="px-5 py-3 font-medium text-[var(--color-ink-muted)]">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {submissions.map((s) => (
              <tr key={s.id} className="hover:bg-[var(--color-bg-subtle)]">
                <td className="px-5 py-3">
                  <Link href={`/admin/contact/${s.id}`} className="block">
                    <span className="font-medium text-[var(--color-ink)]">{s.name}</span>
                    <span className="block text-xs text-[var(--color-ink-muted)]">{s.email}</span>
                  </Link>
                </td>
                <td className="px-5 py-3 text-[var(--color-ink-muted)]">{s.subject}</td>
                <td className="px-5 py-3">
                  <StatusBadge tone={contactStatusTone(s.status)}>{s.status}</StatusBadge>
                </td>
                <td className="px-5 py-3 text-[var(--color-ink-muted)]">
                  {new Date(s.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {submissions.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-[var(--color-ink-muted)]">
                  No submissions match.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

