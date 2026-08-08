"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  updateTrainingApplicationStatus,
  addTrainingApplicationNote,
} from "@/lib/actions/training-admin";
import type { TrainingAppStatus } from "@/lib/db/schema";

const statusOptions: TrainingAppStatus[] = ["new", "reviewing", "shortlisted", "accepted", "rejected"];

export function TrainingApplicationActions({
  id,
  currentStatus,
}: {
  id: number;
  currentStatus: TrainingAppStatus;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<TrainingAppStatus>(currentStatus);
  const [statusNote, setStatusNote] = useState("");
  const [note, setNote] = useState("");

  function submitStatus() {
    startTransition(async () => {
      await updateTrainingApplicationStatus(id, status, statusNote);
      setStatusNote("");
      router.refresh();
    });
  }

  function submitNote() {
    if (!note.trim()) return;
    startTransition(async () => {
      await addTrainingApplicationNote(id, note);
      setNote("");
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-sm font-semibold text-[var(--color-ink)]">Change status</h2>
        <div className="mt-3 flex flex-col gap-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as TrainingAppStatus)}
            className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-ink)]"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
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
    </div>
  );
}
