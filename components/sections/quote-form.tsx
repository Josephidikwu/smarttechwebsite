"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitQuoteRequest, type QuoteFormState } from "@/lib/actions/quote";
import { FormField, textInputClasses } from "@/components/ui/form-field";
import { TurnstileWidget } from "@/components/ui/turnstile-widget";

const initialState: QuoteFormState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md bg-[var(--color-brand-blue)] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--color-brand-blue-dark)] disabled:opacity-50 sm:w-auto"
    >
      {pending ? "Sending…" : "Request a Quote"}
    </button>
  );
}

export function QuoteForm({ turnstileSiteKey }: { turnstileSiteKey: string | null }) {
  const [state, formAction] = useActionState(submitQuoteRequest, initialState);
  const values = state.values ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Full Name" name="name" required error={state.errors?.name}>
          <input id="name" name="name" defaultValue={values.name} required className={textInputClasses()} />
        </FormField>
        <FormField label="Company / Organisation" name="organisation" error={state.errors?.organisation}>
          <input
            id="organisation"
            name="organisation"
            defaultValue={values.organisation}
            className={textInputClasses()}
          />
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Email" name="email" required error={state.errors?.email}>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={values.email}
            required
            className={textInputClasses()}
          />
        </FormField>
        <FormField label="Phone" name="phone" error={state.errors?.phone}>
          <input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={values.phone}
            className={textInputClasses()}
          />
        </FormField>
      </div>

      <FormField label="What do you need?" name="whatDoYouNeed" required error={state.errors?.whatDoYouNeed}>
        <input
          id="whatDoYouNeed"
          name="whatDoYouNeed"
          placeholder="e.g. 15 laptops for a new office, a CRM integration, network cabling…"
          defaultValue={values.whatDoYouNeed}
          required
          className={textInputClasses()}
        />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Budget Range" name="budgetRange" error={state.errors?.budgetRange}>
          <input
            id="budgetRange"
            name="budgetRange"
            defaultValue={values.budgetRange}
            className={textInputClasses()}
          />
        </FormField>
        <FormField
          label="Preferred Contact Method"
          name="preferredContactMethod"
          error={state.errors?.preferredContactMethod}
        >
          <input
            id="preferredContactMethod"
            name="preferredContactMethod"
            placeholder="Email, phone, WhatsApp…"
            defaultValue={values.preferredContactMethod}
            className={textInputClasses()}
          />
        </FormField>
      </div>

      <FormField
        label="Project / Requirement Description"
        name="description"
        error={state.errors?.description}
      >
        <textarea
          id="description"
          name="description"
          rows={5}
          defaultValue={values.description}
          className={textInputClasses()}
        />
      </FormField>

      <FormField label="Attach Document" name="attachment">
        <input
          id="attachment"
          name="attachment"
          type="file"
          accept=".pdf,.doc,.docx"
          className="block w-full text-sm text-[var(--color-ink-muted)] file:mr-4 file:rounded-md file:border-0 file:bg-[var(--color-bg-subtle)] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[var(--color-ink)] hover:file:bg-[var(--color-border)]"
        />
      </FormField>

      <TurnstileWidget action="quote_request" siteKey={turnstileSiteKey} />

      {state.formError && (
        <p className="text-sm text-red-600" role="alert">
          {state.formError}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
