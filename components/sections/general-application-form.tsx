"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitGeneralApplication, type GeneralApplicationState } from "@/lib/actions/careers";
import { FormField, textInputClasses } from "@/components/ui/form-field";
import { TurnstileWidget } from "@/components/ui/turnstile-widget";

const initialState: GeneralApplicationState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md bg-[var(--color-brand-blue)] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--color-brand-blue-dark)] disabled:opacity-50 sm:w-auto"
    >
      {pending ? "Submitting…" : "Submit General Application"}
    </button>
  );
}

export function GeneralApplicationForm({ turnstileSiteKey }: { turnstileSiteKey: string | null }) {
  const [state, formAction] = useActionState(submitGeneralApplication, initialState);
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

      <FormField
        label="Tell us how you could contribute"
        name="message"
        required
        error={state.errors?.message}
      >
        <textarea id="message" name="message" rows={5} defaultValue={values.message} required className={textInputClasses()} />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Portfolio" name="portfolio" error={state.errors?.portfolio}>
          <input id="portfolio" name="portfolio" type="url" defaultValue={values.portfolio} className={textInputClasses()} />
        </FormField>
        <FormField label="LinkedIn" name="linkedin" error={state.errors?.linkedin}>
          <input id="linkedin" name="linkedin" type="url" defaultValue={values.linkedin} className={textInputClasses()} />
        </FormField>
      </div>

      <FormField label="CV" name="cv">
        <input
          id="cv"
          name="cv"
          type="file"
          accept=".pdf,.doc,.docx"
          className="block w-full text-sm text-[var(--color-ink-muted)] file:mr-4 file:rounded-md file:border-0 file:bg-[var(--color-bg-subtle)] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[var(--color-ink)] hover:file:bg-[var(--color-border)]"
        />
      </FormField>

      <TurnstileWidget action="general_application" siteKey={turnstileSiteKey} />

      {state.formError && (
        <p className="text-sm text-red-600" role="alert">
          {state.formError}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
