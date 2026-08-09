"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitJobApplication, type JobApplicationState } from "@/lib/actions/careers";
import { FormField, textInputClasses } from "@/components/ui/form-field";
import { TurnstileWidget } from "@/components/ui/turnstile-widget";

const initialState: JobApplicationState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md bg-[var(--color-brand-blue)] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--color-brand-blue-dark)] disabled:opacity-50 sm:w-auto"
    >
      {pending ? "Submitting…" : "Submit Application"}
    </button>
  );
}

export function JobApplyForm({
  jobId,
  turnstileSiteKey,
}: {
  jobId: number;
  turnstileSiteKey: string | null;
}) {
  const action = submitJobApplication.bind(null, jobId);
  const [state, formAction] = useActionState(action, initialState);
  const values = state.values ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Full Name" name="fullName" required error={state.errors?.fullName}>
          <input id="fullName" name="fullName" defaultValue={values.fullName} required className={textInputClasses()} />
        </FormField>
        <FormField label="Email" name="email" required error={state.errors?.email}>
          <input id="email" name="email" type="email" defaultValue={values.email} required className={textInputClasses()} />
        </FormField>
      </div>

      <FormField label="Phone" name="phone" error={state.errors?.phone}>
        <input id="phone" name="phone" type="tel" defaultValue={values.phone} className={textInputClasses()} />
      </FormField>

      <FormField label="CV" name="cv" required>
        <input
          id="cv"
          name="cv"
          type="file"
          accept=".pdf,.doc,.docx"
          required
          className="block w-full text-sm text-[var(--color-ink-muted)] file:mr-4 file:rounded-md file:border-0 file:bg-[var(--color-bg-subtle)] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[var(--color-ink)] hover:file:bg-[var(--color-border)]"
        />
      </FormField>

      <FormField label="Cover Letter" name="coverLetterFile">
        <input
          id="coverLetterFile"
          name="coverLetterFile"
          type="file"
          accept=".pdf,.doc,.docx"
          className="block w-full text-sm text-[var(--color-ink-muted)] file:mr-4 file:rounded-md file:border-0 file:bg-[var(--color-bg-subtle)] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[var(--color-ink)] hover:file:bg-[var(--color-border)]"
        />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Portfolio" name="portfolio" error={state.errors?.portfolio}>
          <input id="portfolio" name="portfolio" type="url" defaultValue={values.portfolio} className={textInputClasses()} />
        </FormField>
        <FormField label="LinkedIn" name="linkedin" error={state.errors?.linkedin}>
          <input id="linkedin" name="linkedin" type="url" defaultValue={values.linkedin} className={textInputClasses()} />
        </FormField>
      </div>

      <FormField label="Additional Information" name="additionalInfo" error={state.errors?.additionalInfo}>
        <textarea id="additionalInfo" name="additionalInfo" rows={3} defaultValue={values.additionalInfo} className={textInputClasses()} />
      </FormField>

      <TurnstileWidget action="job_application" siteKey={turnstileSiteKey} />

      {state.formError && (
        <p className="text-sm text-red-600" role="alert">
          {state.formError}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
