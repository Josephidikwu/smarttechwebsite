"use client";

import { useActionState } from "react";
import { subscribeToNewsletter, type NewsletterState } from "@/lib/actions/newsletter";

const initialState: NewsletterState = {};

export function NewsletterForm() {
  const [state, formAction, pending] = useActionState(subscribeToNewsletter, initialState);

  if (state.success) {
    return (
      <p className="mt-6 max-w-xs text-sm font-medium text-white">
        You&apos;re subscribed — thanks for staying connected.
      </p>
    );
  }

  return (
    <form action={formAction} className="mt-6 max-w-xs">
      <label htmlFor="newsletter-email" className="text-sm font-medium text-white">
        Stay connected to what&apos;s next.
      </label>
      <div className="mt-2 flex gap-2">
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          placeholder="Email address"
          className="w-full rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-[var(--text-muted)] focus:outline-2 focus:outline-[var(--accent)]"
        />
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)] disabled:opacity-50"
        >
          {pending ? "…" : "Subscribe"}
        </button>
      </div>
      {state.error && <p className="mt-2 text-xs text-red-600">{state.error}</p>}
      <p className="mt-2 text-xs text-[var(--text-muted)]">
        By subscribing, you agree to receive communications from Smart Technology. You can
        unsubscribe at any time.
      </p>
    </form>
  );
}
