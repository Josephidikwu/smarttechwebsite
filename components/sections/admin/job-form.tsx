"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { JobFormState } from "@/lib/actions/careers-admin";
import { programmeStatusOptions } from "@/lib/validation/schemas";
import { FormField, textInputClasses } from "@/components/ui/form-field";

const initialState: JobFormState = {};

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

export function JobForm({
  action,
  submitLabel,
  initial,
}: {
  action: (prevState: JobFormState, formData: FormData) => Promise<JobFormState>;
  submitLabel: string;
  initial?: {
    title?: string;
    department?: string | null;
    location?: string | null;
    employmentType?: string | null;
    experienceLevel?: string | null;
    salary?: string | null;
    description?: string | null;
    responsibilities?: string | null;
    requirements?: string | null;
    niceToHave?: string | null;
    applicationDeadline?: Date | null;
    status?: string;
  };
}) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Job Title" name="title" required error={state.errors?.title}>
          <input id="title" name="title" defaultValue={initial?.title} required className={textInputClasses()} />
        </FormField>
        <FormField label="Department" name="department" error={state.errors?.department}>
          <input id="department" name="department" defaultValue={initial?.department ?? ""} className={textInputClasses()} />
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <FormField label="Location" name="location" error={state.errors?.location}>
          <input id="location" name="location" defaultValue={initial?.location ?? ""} className={textInputClasses()} />
        </FormField>
        <FormField label="Employment Type" name="employmentType" error={state.errors?.employmentType}>
          <input
            id="employmentType"
            name="employmentType"
            placeholder="Full-time / Part-time / Contract"
            defaultValue={initial?.employmentType ?? ""}
            className={textInputClasses()}
          />
        </FormField>
        <FormField label="Experience Level" name="experienceLevel" error={state.errors?.experienceLevel}>
          <input id="experienceLevel" name="experienceLevel" defaultValue={initial?.experienceLevel ?? ""} className={textInputClasses()} />
        </FormField>
      </div>

      <FormField label="Salary (optional)" name="salary" error={state.errors?.salary}>
        <input id="salary" name="salary" defaultValue={initial?.salary ?? ""} className={textInputClasses()} />
      </FormField>

      <FormField label="Description" name="description" error={state.errors?.description}>
        <textarea id="description" name="description" rows={3} defaultValue={initial?.description ?? ""} className={textInputClasses()} />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Responsibilities" name="responsibilities" error={state.errors?.responsibilities}>
          <textarea
            id="responsibilities"
            name="responsibilities"
            rows={3}
            defaultValue={initial?.responsibilities ?? ""}
            className={textInputClasses()}
          />
        </FormField>
        <FormField label="Requirements" name="requirements" error={state.errors?.requirements}>
          <textarea
            id="requirements"
            name="requirements"
            rows={3}
            defaultValue={initial?.requirements ?? ""}
            className={textInputClasses()}
          />
        </FormField>
      </div>

      <FormField label="Nice-to-have Skills" name="niceToHave" error={state.errors?.niceToHave}>
        <textarea id="niceToHave" name="niceToHave" rows={2} defaultValue={initial?.niceToHave ?? ""} className={textInputClasses()} />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Application Deadline" name="applicationDeadline" error={state.errors?.applicationDeadline}>
          <input
            id="applicationDeadline"
            name="applicationDeadline"
            type="date"
            defaultValue={toDateInputValue(initial?.applicationDeadline)}
            className={textInputClasses()}
          />
        </FormField>
        <FormField label="Status" name="status" required error={state.errors?.status}>
          <select id="status" name="status" defaultValue={initial?.status ?? "draft"} required className={textInputClasses()}>
            {programmeStatusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </FormField>
      </div>

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
