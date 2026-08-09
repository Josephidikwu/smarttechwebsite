"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitTrainingApplication, type TrainingApplicationState } from "@/lib/actions/training";
import { FormField, textInputClasses } from "@/components/ui/form-field";
import { TurnstileWidget } from "@/components/ui/turnstile-widget";

const initialState: TrainingApplicationState = {};

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

export function TrainingApplyForm({
  programmeId,
  turnstileSiteKey,
}: {
  programmeId: number;
  turnstileSiteKey: string | null;
}) {
  const action = submitTrainingApplication.bind(null, programmeId);
  const [state, formAction] = useActionState(action, initialState);
  const values = state.values ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Full Name" name="fullName" required error={state.errors?.fullName}>
          <input id="fullName" name="fullName" defaultValue={values.fullName} required className={textInputClasses()} />
        </FormField>
        <FormField label="Email Address" name="email" required error={state.errors?.email}>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={values.email}
            required
            className={textInputClasses()}
          />
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Phone Number" name="phone" error={state.errors?.phone}>
          <input id="phone" name="phone" type="tel" defaultValue={values.phone} className={textInputClasses()} />
        </FormField>
        <FormField label="Current Skill Level" name="currentSkillLevel" error={state.errors?.currentSkillLevel}>
          <input
            id="currentSkillLevel"
            name="currentSkillLevel"
            placeholder="Beginner, intermediate, advanced…"
            defaultValue={values.currentSkillLevel}
            className={textInputClasses()}
          />
        </FormField>
      </div>

      <FormField label="Educational Background" name="educationalBackground" error={state.errors?.educationalBackground}>
        <textarea
          id="educationalBackground"
          name="educationalBackground"
          rows={2}
          defaultValue={values.educationalBackground}
          className={textInputClasses()}
        />
      </FormField>

      <FormField
        label="Why do you want to join this programme?"
        name="motivation"
        required
        error={state.errors?.motivation}
      >
        <textarea
          id="motivation"
          name="motivation"
          rows={4}
          defaultValue={values.motivation}
          required
          className={textInputClasses()}
        />
      </FormField>

      <FormField label="Preferred Training Format" name="preferredFormat" error={state.errors?.preferredFormat}>
        <input
          id="preferredFormat"
          name="preferredFormat"
          placeholder="In-person, online, hybrid…"
          defaultValue={values.preferredFormat}
          className={textInputClasses()}
        />
      </FormField>

      <FormField label="Upload Document/CV" name="cv">
        <input
          id="cv"
          name="cv"
          type="file"
          accept=".pdf,.doc,.docx"
          className="block w-full text-sm text-[var(--color-ink-muted)] file:mr-4 file:rounded-md file:border-0 file:bg-[var(--color-bg-subtle)] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[var(--color-ink)] hover:file:bg-[var(--color-border)]"
        />
      </FormField>

      <FormField label="Additional Information" name="additionalInfo" error={state.errors?.additionalInfo}>
        <textarea
          id="additionalInfo"
          name="additionalInfo"
          rows={2}
          defaultValue={values.additionalInfo}
          className={textInputClasses()}
        />
      </FormField>

      <TurnstileWidget action="training_application" siteKey={turnstileSiteKey} />

      {state.formError && (
        <p className="text-sm text-red-600" role="alert">
          {state.formError}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
