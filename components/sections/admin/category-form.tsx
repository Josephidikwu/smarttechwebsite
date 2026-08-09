"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createCategory, type SimpleFormState } from "@/lib/actions/catalogue-admin";
import { textInputClasses } from "@/components/ui/form-field";

const initialState: SimpleFormState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-[var(--color-brand-blue)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-brand-blue-dark)] disabled:opacity-50"
    >
      {pending ? "Adding…" : "Add Category"}
    </button>
  );
}

export function CategoryForm() {
  const [state, formAction] = useActionState(createCategory, initialState);

  return (
    <form action={formAction} className="flex items-end gap-3">
      <div>
        <label htmlFor="name" className="text-sm font-medium text-[var(--color-ink)]">
          Category name
        </label>
        <input id="name" name="name" required className={`mt-1.5 ${textInputClasses()}`} />
        {state.errors?.name && <p className="mt-1 text-xs text-red-600">{state.errors.name[0]}</p>}
      </div>
      <div>
        <label htmlFor="description" className="text-sm font-medium text-[var(--color-ink)]">
          Description
        </label>
        <input id="description" name="description" className={`mt-1.5 ${textInputClasses()}`} />
      </div>
      <SubmitButton />
    </form>
  );
}
