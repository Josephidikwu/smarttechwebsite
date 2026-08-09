"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createBlogCategory, type SimpleFormState } from "@/lib/actions/blog-admin";
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

export function BlogCategoryForm() {
  const [state, formAction] = useActionState(createBlogCategory, initialState);

  return (
    <form action={formAction} className="flex items-end gap-3">
      <div>
        <label htmlFor="name" className="text-sm font-medium text-[var(--color-ink)]">
          Category name
        </label>
        <input id="name" name="name" required className={`mt-1.5 ${textInputClasses()}`} />
        {state.errors?.name && <p className="mt-1 text-xs text-red-600">{state.errors.name[0]}</p>}
      </div>
      <SubmitButton />
    </form>
  );
}
