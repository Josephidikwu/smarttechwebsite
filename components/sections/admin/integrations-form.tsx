"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  saveIntegrations,
  type IntegrationSettingsState,
} from "@/lib/actions/integrations-admin";
import { FormField, textInputClasses } from "@/components/ui/form-field";

const initialState: IntegrationSettingsState = {};

type Initial = {
  ga4MeasurementId: string | null;
  adminNotificationEmail: string | null;
  turnstileSiteKey: string | null;
  turnstileConfigured: boolean;
};

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-[var(--color-brand-blue)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-brand-blue-dark)] disabled:opacity-50"
    >
      {pending ? "Saving…" : "Save Settings"}
    </button>
  );
}

export function IntegrationsForm({ initial }: { initial: Initial }) {
  const [state, formAction] = useActionState(saveIntegrations, initialState);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-10">
      <section>
        <h2 className="text-sm font-semibold text-[var(--color-ink)]">Analytics</h2>
        <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
          Google Analytics 4 Measurement ID — visitor tracking and the site&apos;s conversion events.
        </p>
        <div className="mt-4">
          <FormField
            label="GA4 Measurement ID"
            name="ga4MeasurementId"
            error={state.errors?.ga4MeasurementId}
          >
            <input
              id="ga4MeasurementId"
              name="ga4MeasurementId"
              placeholder="G-XXXXXXXXXX"
              defaultValue={initial.ga4MeasurementId ?? ""}
              className={textInputClasses()}
            />
          </FormField>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-[var(--color-ink)]">Notifications</h2>
        <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
          The inbox that receives a &quot;new submission&quot; alert for every contact enquiry,
          application, product enquiry, and quote request.
        </p>
        <div className="mt-4">
          <FormField
            label="Admin Notification Email"
            name="adminNotificationEmail"
            error={state.errors?.adminNotificationEmail}
          >
            <input
              id="adminNotificationEmail"
              name="adminNotificationEmail"
              type="email"
              placeholder="you@smarttechnology.com"
              defaultValue={initial.adminNotificationEmail ?? ""}
              className={textInputClasses()}
            />
          </FormField>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-[var(--color-ink)]">Security (Turnstile)</h2>
        <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
          Anti-spam widget shown on every public form. Create a widget at
          dash.cloudflare.com → Turnstile for this domain.
        </p>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <FormField
            label="Site Key"
            name="turnstileSiteKey"
            error={state.errors?.turnstileSiteKey}
          >
            <input
              id="turnstileSiteKey"
              name="turnstileSiteKey"
              placeholder="Public — shown in page HTML"
              defaultValue={initial.turnstileSiteKey ?? ""}
              className={textInputClasses()}
            />
          </FormField>
          <FormField
            label="Secret Key"
            name="turnstileSecretKey"
            error={state.errors?.turnstileSecretKey}
          >
            <input
              id="turnstileSecretKey"
              name="turnstileSecretKey"
              type="password"
              placeholder={initial.turnstileConfigured ? "Leave blank to keep the current key" : "Not set"}
              className={textInputClasses()}
            />
          </FormField>
        </div>
      </section>

      <div>
        {state.formError && (
          <p className="mb-3 text-sm text-red-600" role="alert">
            {state.formError}
          </p>
        )}
        {state.success && (
          <p className="mb-3 text-sm text-green-700" role="status">
            Settings saved.
          </p>
        )}
        <SaveButton />
      </div>
    </form>
  );
}
