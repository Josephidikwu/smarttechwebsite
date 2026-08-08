"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitContactForm, type ContactFormState } from "@/lib/actions/contact";
import { contactSubjectOptions } from "@/lib/validation/schemas";
import { FormField, textInputClasses } from "@/components/ui/form-field";
import { TurnstileWidget } from "@/components/ui/turnstile-widget";

const initialState: ContactFormState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md bg-[var(--color-brand-blue)] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--color-brand-blue-dark)] disabled:opacity-50 sm:w-auto"
    >
      {pending ? "Sending…" : "Send Enquiry"}
    </button>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState(submitContactForm, initialState);
  const values = state.values ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Full Name" name="name" required error={state.errors?.name}>
          <input
            id="name"
            name="name"
            defaultValue={values.name}
            required
            className={textInputClasses()}
          />
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
        <FormField label="Phone Number" name="phone" error={state.errors?.phone}>
          <input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={values.phone}
            className={textInputClasses()}
          />
        </FormField>
      </div>

      <FormField
        label="What can we help you with?"
        name="subject"
        required
        error={state.errors?.subject}
      >
        <select
          id="subject"
          name="subject"
          defaultValue={values.subject ?? ""}
          required
          className={textInputClasses()}
        >
          <option value="" disabled>
            Choose an option
          </option>
          {contactSubjectOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Message" name="message" required error={state.errors?.message}>
        <textarea
          id="message"
          name="message"
          rows={5}
          defaultValue={values.message}
          required
          className={textInputClasses()}
        />
      </FormField>

      <TurnstileWidget action="contact" />

      {state.formError && (
        <p className="text-sm text-red-600" role="alert">
          {state.formError}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
