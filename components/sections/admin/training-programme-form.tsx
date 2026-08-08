"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { ProgrammeFormState } from "@/lib/actions/training-admin";
import { programmeStatusOptions } from "@/lib/validation/schemas";
import { FormField, textInputClasses } from "@/components/ui/form-field";

const initialState: ProgrammeFormState = {};

function toDateInputValue(d?: Date | string | null) {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-[var(--color-brand-blue)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--color-brand-blue-dark)] disabled:opacity-50"
    >
      {pending ? "Saving…" : label}
    </button>
  );
}

export function TrainingProgrammeForm({
  action,
  submitLabel,
  initial,
}: {
  action: (prevState: ProgrammeFormState, formData: FormData) => Promise<ProgrammeFormState>;
  submitLabel: string;
  initial?: {
    name?: string;
    description?: string | null;
    category?: string | null;
    startDate?: Date | null;
    endDate?: Date | null;
    duration?: string | null;
    format?: string | null;
    location?: string | null;
    applicationDeadline?: Date | null;
    capacity?: number | null;
    status?: string;
    requirements?: string | null;
  };
}) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Programme Name" name="name" required error={state.errors?.name}>
          <input id="name" name="name" defaultValue={initial?.name} required className={textInputClasses()} />
        </FormField>
        <FormField label="Category" name="category" error={state.errors?.category}>
          <input id="category" name="category" defaultValue={initial?.category ?? ""} className={textInputClasses()} />
        </FormField>
      </div>

      <FormField label="Description" name="description" error={state.errors?.description}>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={initial?.description ?? ""}
          className={textInputClasses()}
        />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-3">
        <FormField label="Start Date" name="startDate" error={state.errors?.startDate}>
          <input
            id="startDate"
            name="startDate"
            type="date"
            defaultValue={toDateInputValue(initial?.startDate)}
            className={textInputClasses()}
          />
        </FormField>
        <FormField label="End Date" name="endDate" error={state.errors?.endDate}>
          <input
            id="endDate"
            name="endDate"
            type="date"
            defaultValue={toDateInputValue(initial?.endDate)}
            className={textInputClasses()}
          />
        </FormField>
        <FormField label="Application Deadline" name="applicationDeadline" error={state.errors?.applicationDeadline}>
          <input
            id="applicationDeadline"
            name="applicationDeadline"
            type="date"
            defaultValue={toDateInputValue(initial?.applicationDeadline)}
            className={textInputClasses()}
          />
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <FormField label="Duration" name="duration" error={state.errors?.duration}>
          <input id="duration" name="duration" defaultValue={initial?.duration ?? ""} className={textInputClasses()} />
        </FormField>
        <FormField label="Format" name="format" error={state.errors?.format}>
          <input
            id="format"
            name="format"
            placeholder="In-person / online / hybrid"
            defaultValue={initial?.format ?? ""}
            className={textInputClasses()}
          />
        </FormField>
        <FormField label="Location" name="location" error={state.errors?.location}>
          <input id="location" name="location" defaultValue={initial?.location ?? ""} className={textInputClasses()} />
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Capacity" name="capacity" error={state.errors?.capacity}>
          <input
            id="capacity"
            name="capacity"
            type="number"
            min={0}
            defaultValue={initial?.capacity ?? ""}
            className={textInputClasses()}
          />
        </FormField>
        <FormField label="Status" name="status" required error={state.errors?.status}>
          <select
            id="status"
            name="status"
            defaultValue={initial?.status ?? "draft"}
            required
            className={textInputClasses()}
          >
            {programmeStatusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <FormField label="Requirements" name="requirements" error={state.errors?.requirements}>
        <textarea
          id="requirements"
          name="requirements"
          rows={3}
          defaultValue={initial?.requirements ?? ""}
          className={textInputClasses()}
        />
      </FormField>

      {state.formError && (
        <p className="text-sm text-red-600" role="alert">
          {state.formError}
        </p>
      )}
      <div>
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}
