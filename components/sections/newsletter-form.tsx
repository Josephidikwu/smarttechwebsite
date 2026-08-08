"use client";

import { useActionState } from "react";
import { subscribeToNewsletter, type NewsletterState } from "@/lib/actions/newsletter";

const initialState: NewsletterState = {};

export function NewsletterForm() {
  const [state, formAction, pending] = useActionState(subscribeToNewsletter, initialState);

  if (state.success) {
    return (
      <p className="mt-6 max-w-xs text-sm font-medium text-[var(--color-ink)]">
        You&apos;re subscribed — thanks for staying connected.
      </p>
    );
  }

  return (
    <form action={formAction} className="mt-6 max-w-xs">
      <label htmlFor="newsletter-email" className="text-sm font-medium text-[var(--color-ink)]">
        Stay connected to what&apos;s next.
      </label>
      <div className="mt-2 flex gap-2">
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          placeholder="Email address"
          className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] focus:outline-2 focus:outline-[var(--color-brand-blue)]"
        />
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 rounded-md bg-[var(--color-brand-blue)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-brand-blue-dark)] disabled:opacity-50"
        >
          {pending ? "…" : "Subscribe"}
        </button>
      </div>
      {state.error && <p className="mt-2 text-xs text-red-600">{state.error}</p>}
      <p className="mt-2 text-xs text-[var(--color-ink-muted)]">
        By subscribing, you agree to receive communications from Smart Technology. You can
        unsubscribe at any time.
      </p>
    </form>
  );
}
