"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createUser, type CreateUserState } from "@/lib/actions/auth";
import { userRoleOptions } from "@/lib/validation/schemas";
import { FormField, textInputClasses } from "@/components/ui/form-field";

const initialState: CreateUserState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-[var(--color-brand-blue)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--color-brand-blue-dark)] disabled:opacity-50"
    >
      {pending ? "Creating…" : "Create User"}
    </button>
  );
}

export function CreateUserForm() {
  const [state, formAction] = useActionState(createUser, initialState);

  return (
    <form
      action={formAction}
      key={state.success ? "reset" : "form"}
      className="grid gap-4 sm:grid-cols-2"
    >
      <FormField label="Full Name" name="name" required error={state.errors?.name}>
        <input id="name" name="name" required className={textInputClasses()} />
      </FormField>
      <FormField label="Email" name="email" required error={state.errors?.email}>
        <input id="email" name="email" type="email" required className={textInputClasses()} />
      </FormField>
      <FormField label="Temporary Password" name="password" required error={state.errors?.password}>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={12}
          className={textInputClasses()}
        />
      </FormField>
      <FormField label="Role" name="role" required error={state.errors?.role}>
        <select id="role" name="role" required defaultValue="editor" className={textInputClasses()}>
          {userRoleOptions.map((r) => (
            <option key={r} value={r}>
              {r.replace("_", " ")}
            </option>
          ))}
        </select>
      </FormField>

      <div className="sm:col-span-2">
        {state.formError && (
          <p className="mb-3 text-sm text-red-600" role="alert">
            {state.formError}
          </p>
        )}
        {state.success && (
          <p className="mb-3 text-sm text-green-700" role="status">
            User created.
          </p>
        )}
        <SubmitButton />
      </div>
    </form>
  );
}
