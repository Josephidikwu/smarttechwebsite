"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitProductEnquiry, type ProductEnquiryState } from "@/lib/actions/catalogue";
import { FormField, textInputClasses } from "@/components/ui/form-field";
import { TurnstileWidget } from "@/components/ui/turnstile-widget";

const initialState: ProductEnquiryState = {};

function SubmitButtons() {
  const { pending } = useFormStatus();
  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="submit"
        name="type"
        value="request"
        disabled={pending}
        className="rounded-md bg-[var(--color-brand-blue)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--color-brand-blue-dark)] disabled:opacity-50"
      >
        {pending ? "Sending…" : "Request This Product"}
      </button>
      <button
        type="submit"
        name="type"
        value="bulk_quote"
        disabled={pending}
        className="rounded-md border border-[var(--color-ink)] px-5 py-2.5 text-sm font-medium text-[var(--color-ink)] hover:bg-[var(--color-bg-subtle)] disabled:opacity-50"
      >
        {pending ? "Sending…" : "Request Bulk Quote"}
      </button>
    </div>
  );
}

export function ProductEnquiryForm({
  productId,
  turnstileSiteKey,
}: {
  productId: number;
  turnstileSiteKey: string | null;
}) {
  const action = submitProductEnquiry.bind(null, productId);
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Full Name" name="name" required error={state.errors?.name}>
          <input id="name" name="name" required className={textInputClasses()} />
        </FormField>
        <FormField label="Email" name="email" required error={state.errors?.email}>
          <input id="email" name="email" type="email" required className={textInputClasses()} />
        </FormField>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Phone" name="phone" error={state.errors?.phone}>
          <input id="phone" name="phone" type="tel" className={textInputClasses()} />
        </FormField>
        <FormField label="Company / Organisation" name="organisation" error={state.errors?.organisation}>
          <input id="organisation" name="organisation" className={textInputClasses()} />
        </FormField>
      </div>
      <FormField label="Message" name="message" error={state.errors?.message}>
        <textarea id="message" name="message" rows={3} className={textInputClasses()} />
      </FormField>

      <TurnstileWidget action="product_enquiry" siteKey={turnstileSiteKey} />

      {state.formError && (
        <p className="text-sm text-red-600" role="alert">
          {state.formError}
        </p>
      )}

      <SubmitButtons />
      <p className="text-xs text-[var(--color-ink-muted)]">
        Online checkout is currently unavailable. Our team will respond to product enquiries
        directly.
      </p>
    </form>
  );
}
