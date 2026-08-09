"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  saveEmailSettings,
  testEmailSettings,
  type EmailSettingsState,
  type SendTestEmailState,
} from "@/lib/actions/email-settings-admin";
import { FormField, textInputClasses } from "@/components/ui/form-field";

const saveInitialState: EmailSettingsState = {};
const testInitialState: SendTestEmailState = {};

type Initial = {
  smtpHost: string | null;
  smtpPort: number | null;
  smtpSecure: boolean;
  smtpUsername: string | null;
  fromAddress: string | null;
  fromName: string | null;
  configured: boolean;
};

/** Reads pending state from the nearest ancestor <form> — works regardless
 *  of which button (save or test) triggered the pending submit. */
function SubmitButtons({
  saveAction,
  testAction,
}: {
  saveAction: (formData: FormData) => void;
  testAction: (formData: FormData) => void;
}) {
  const { pending } = useFormStatus();
  return (
    <>
      <button
        type="submit"
        formAction={saveAction}
        disabled={pending}
        className="rounded-md bg-[var(--color-brand-blue)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-brand-blue-dark)] disabled:opacity-50"
      >
        {pending ? "Working…" : "Save Settings"}
      </button>
      <button
        type="submit"
        formAction={testAction}
        disabled={pending}
        className="rounded-md border border-[var(--color-border)] px-5 py-2.5 text-sm font-medium text-[var(--color-ink)] transition-colors hover:bg-[var(--color-bg-subtle)] disabled:opacity-50"
      >
        {pending ? "Working…" : "Send Test Email"}
      </button>
    </>
  );
}

/**
 * One form, two server actions — each submit button overrides the form's
 * default `action` via `formAction` (the standard React 19 way to run
 * different actions from the same field set without duplicating inputs).
 * `useActionState`'s dispatch function is directly usable as a `formAction`.
 */
export function EmailSettingsForm({ initial }: { initial: Initial }) {
  const [saveState, saveAction] = useActionState(saveEmailSettings, saveInitialState);
  const [testState, testAction] = useActionState(testEmailSettings, testInitialState);

  return (
    <form action={saveAction} className="max-w-2xl">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="SMTP Host" name="smtpHost" required error={saveState.errors?.smtpHost}>
          <input
            id="smtpHost"
            name="smtpHost"
            required
            placeholder="smtp.zoho.com"
            defaultValue={initial.smtpHost ?? ""}
            className={textInputClasses()}
          />
        </FormField>
        <FormField label="SMTP Port" name="smtpPort" required error={saveState.errors?.smtpPort}>
          <input
            id="smtpPort"
            name="smtpPort"
            type="number"
            required
            placeholder="465"
            defaultValue={initial.smtpPort ?? ""}
            className={textInputClasses()}
          />
        </FormField>
        <FormField
          label="Mailbox Username"
          name="smtpUsername"
          required
          error={saveState.errors?.smtpUsername}
        >
          <input
            id="smtpUsername"
            name="smtpUsername"
            required
            placeholder="notifications@smarttechnology.com"
            defaultValue={initial.smtpUsername ?? ""}
            className={textInputClasses()}
          />
        </FormField>
        <FormField label="Mailbox Password" name="smtpPassword" error={saveState.errors?.smtpPassword}>
          <input
            id="smtpPassword"
            name="smtpPassword"
            type="password"
            placeholder={initial.configured ? "Leave blank to keep the current password" : "Required"}
            className={textInputClasses()}
          />
        </FormField>
        <FormField
          label={'"From" Address'}
          name="fromAddress"
          required
          error={saveState.errors?.fromAddress}
        >
          <input
            id="fromAddress"
            name="fromAddress"
            type="email"
            required
            placeholder="notifications@smarttechnology.com"
            defaultValue={initial.fromAddress ?? ""}
            className={textInputClasses()}
          />
        </FormField>
        <FormField label={'"From" Name'} name="fromName" error={saveState.errors?.fromName}>
          <input
            id="fromName"
            name="fromName"
            placeholder="Smart Technology"
            defaultValue={initial.fromName ?? ""}
            className={textInputClasses()}
          />
        </FormField>
        <label className="flex items-center gap-2 text-sm text-[var(--color-ink)] sm:col-span-2">
          <input type="checkbox" name="smtpSecure" defaultChecked={initial.smtpSecure} className="h-4 w-4" />
          Use TLS/SSL (leave on unless your provider says otherwise — most mailbox providers
          require this on port 465)
        </label>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <SubmitButtons saveAction={saveAction} testAction={testAction} />
      </div>

      <div className="mt-3 flex flex-col gap-1.5">
        {saveState.formError && (
          <p className="text-sm text-red-600" role="alert">
            {saveState.formError}
          </p>
        )}
        {saveState.success && (
          <p className="text-sm text-green-700" role="status">
            Settings saved.
          </p>
        )}
        {testState.error && (
          <p className="text-sm text-red-600" role="alert">
            {testState.error}
          </p>
        )}
        {testState.success && (
          <p className="text-sm text-green-700" role="status">
            Test email sent to your account email — check your inbox.
          </p>
        )}
      </div>
    </form>
  );
}
