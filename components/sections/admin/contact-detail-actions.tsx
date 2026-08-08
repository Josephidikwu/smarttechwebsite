"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  updateContactStatus,
  addContactNote,
  archiveContact,
  deleteContact,
} from "@/lib/actions/contact-admin";
import type { ContactStatus } from "@/lib/db/schema";

const statusOptions: ContactStatus[] = ["new", "in_progress", "resolved"];

export function ContactDetailActions({
  id,
  currentStatus,
  archived,
  canDelete,
}: {
  id: number;
  currentStatus: ContactStatus;
  archived: boolean;
  canDelete: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<ContactStatus>(currentStatus);
  const [statusNote, setStatusNote] = useState("");
  const [note, setNote] = useState("");

  function submitStatus() {
    startTransition(async () => {
      await updateContactStatus(id, status, statusNote);
      setStatusNote("");
      router.refresh();
    });
  }

  function submitNote() {
    if (!note.trim()) return;
    startTransition(async () => {
      await addContactNote(id, note);
      setNote("");
      router.refresh();
    });
  }

  function toggleArchive() {
    startTransition(async () => {
      await archiveContact(id, !archived);
      router.refresh();
    });
  }

  function handleDelete() {
    if (!confirm("Permanently delete this submission? This can't be undone.")) return;
    startTransition(async () => {
      await deleteContact(id);
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-sm font-semibold text-[var(--color-ink)]">Change status</h2>
        <div className="mt-3 flex flex-col gap-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ContactStatus)}
            className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-ink)]"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s.replace("_", " ")}
              </option>
            ))}
          </select>
          <textarea
            value={statusNote}
            onChange={(e) => setStatusNote(e.target.value)}
            placeholder="Optional note about this change"
            rows={2}
            className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-ink)]"
          />
          <button
            type="button"
            disabled={pending || status === currentStatus}
            onClick={submitStatus}
            className="rounded-md bg-[var(--color-brand-blue)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-brand-blue-dark)] disabled:opacity-50"
          >
            Update status
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-[var(--color-ink)]">Add internal note</h2>
        <div className="mt-3 flex flex-col gap-3">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="Visible to staff only"
            className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-ink)]"
          />
          <button
            type="button"
            disabled={pending || !note.trim()}
            onClick={submitNote}
            className="rounded-md border border-[var(--color-ink)] px-4 py-2 text-sm font-medium text-[var(--color-ink)] hover:bg-[var(--color-bg-subtle)] disabled:opacity-50"
          >
            Add note
          </button>
        </div>
      </div>

      <div className="flex gap-3 border-t border-[var(--color-border)] pt-6">
        <button
          type="button"
          disabled={pending}
          onClick={toggleArchive}
          className="rounded-md border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-ink)] hover:bg-[var(--color-bg-subtle)] disabled:opacity-50"
        >
          {archived ? "Unarchive" : "Archive"}
        </button>
        {canDelete && (
          <button
            type="button"
            disabled={pending}
            onClick={handleDelete}
            className="rounded-md px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            Delete permanently
          </button>
        )}
      </div>
    </div>
  );
}
