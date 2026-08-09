"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitInternshipApplication, type InternshipApplicationState } from "@/lib/actions/internship";
import { FormField, textInputClasses } from "@/components/ui/form-field";
import { TurnstileWidget } from "@/components/ui/turnstile-widget";

const initialState: InternshipApplicationState = {};

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

export function InternshipApplyForm({
  internshipId,
  turnstileSiteKey,
}: {
  internshipId: number;
  turnstileSiteKey: string | null;
}) {
  const action = submitInternshipApplication.bind(null, internshipId);
  const [state, formAction] = useActionState(action, initialState);
  const values = state.values ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Full Name" name="fullName" required error={state.errors?.fullName}>
          <input id="fullName" name="fullName" defaultValue={values.fullName} required className={textInputClasses()} />
        </FormField>
        <FormField label="Email Address" name="email" required error={state.errors?.email}>
          <input id="email" name="email" type="email" defaultValue={values.email} required className={textInputClasses()} />
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Phone Number" name="phone" error={state.errors?.phone}>
          <input id="phone" name="phone" type="tel" defaultValue={values.phone} className={textInputClasses()} />
        </FormField>
        <FormField label="Institution" name="institution" error={state.errors?.institution}>
          <input id="institution" name="institution" defaultValue={values.institution} className={textInputClasses()} />
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Course of Study" name="courseOfStudy" error={state.errors?.courseOfStudy}>
          <input id="courseOfStudy" name="courseOfStudy" defaultValue={values.courseOfStudy} className={textInputClasses()} />
        </FormField>
        <FormField label="Graduation Year" name="graduationYear" error={state.errors?.graduationYear}>
          <input
            id="graduationYear"
            name="graduationYear"
            type="number"
            min={1980}
            max={2100}
            defaultValue={values.graduationYear}
            className={textInputClasses()}
          />
        </FormField>
      </div>

      <FormField label="Area of Interest" name="areaOfInterest" error={state.errors?.areaOfInterest}>
        <input
          id="areaOfInterest"
          name="areaOfInterest"
          placeholder="Software Development, Data, UI/UX…"
          defaultValue={values.areaOfInterest}
          className={textInputClasses()}
        />
      </FormField>

      <FormField label="Skills" name="skills" error={state.errors?.skills}>
        <textarea id="skills" name="skills" rows={2} defaultValue={values.skills} className={textInputClasses()} />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-3">
        <FormField label="Portfolio" name="portfolio" error={state.errors?.portfolio}>
          <input id="portfolio" name="portfolio" type="url" defaultValue={values.portfolio} className={textInputClasses()} />
        </FormField>
        <FormField label="GitHub" name="github" error={state.errors?.github}>
          <input id="github" name="github" type="url" defaultValue={values.github} className={textInputClasses()} />
        </FormField>
        <FormField label="LinkedIn" name="linkedin" error={state.errors?.linkedin}>
          <input id="linkedin" name="linkedin" type="url" defaultValue={values.linkedin} className={textInputClasses()} />
        </FormField>
      </div>

      <FormField label="Upload CV" name="cv">
        <input
          id="cv"
          name="cv"
          type="file"
          accept=".pdf,.doc,.docx"
          className="block w-full text-sm text-[var(--color-ink-muted)] file:mr-4 file:rounded-md file:border-0 file:bg-[var(--color-bg-subtle)] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[var(--color-ink)] hover:file:bg-[var(--color-border)]"
        />
      </FormField>

      <FormField label="Cover Letter" name="coverLetter" error={state.errors?.coverLetter}>
        <textarea id="coverLetter" name="coverLetter" rows={4} defaultValue={values.coverLetter} className={textInputClasses()} />
      </FormField>

      <FormField label="Availability" name="availability" error={state.errors?.availability}>
        <input id="availability" name="availability" defaultValue={values.availability} className={textInputClasses()} />
      </FormField>

      <TurnstileWidget action="internship_application" siteKey={turnstileSiteKey} />

      {state.formError && (
        <p className="text-sm text-red-600" role="alert">
          {state.formError}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
