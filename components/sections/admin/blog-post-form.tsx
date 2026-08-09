"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { BlogPostFormState } from "@/lib/actions/blog-admin";
import { blogPostStatusOptions } from "@/lib/validation/schemas";
import { FormField, textInputClasses } from "@/components/ui/form-field";

const initialState: BlogPostFormState = {};

function toDateTimeInputValue(d?: Date | string | null) {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 16);
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-[var(--color-brand-blue)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--color-brand-blue-dark)] disabled:opacity-50"
    >
      {pending ? "Saving…" : label}
    </button>
  );
}

export function BlogPostForm({
  action,
  submitLabel,
  categories,
  initial,
}: {
  action: (prevState: BlogPostFormState, formData: FormData) => Promise<BlogPostFormState>;
  submitLabel: string;
  categories: { id: number; name: string }[];
  initial?: {
    title?: string;
    excerpt?: string | null;
    content?: string;
    categoryId?: number | null;
    tags?: string;
    status?: string;
    publishedAt?: Date | string | null;
    seoTitle?: string | null;
    seoDescription?: string | null;
  };
}) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <FormField label="Title" name="title" required error={state.errors?.title}>
        <input id="title" name="title" defaultValue={initial?.title} required className={textInputClasses()} />
      </FormField>

      <FormField label="Excerpt" name="excerpt" error={state.errors?.excerpt}>
        <textarea id="excerpt" name="excerpt" rows={2} defaultValue={initial?.excerpt ?? ""} className={textInputClasses()} />
      </FormField>

      <FormField label="Content" name="content" required error={state.errors?.content}>
        <textarea
          id="content"
          name="content"
          rows={12}
          defaultValue={initial?.content}
          required
          className={textInputClasses()}
        />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Category" name="categoryId" error={state.errors?.categoryId}>
          <select id="categoryId" name="categoryId" defaultValue={initial?.categoryId ?? ""} className={textInputClasses()}>
            <option value="">None</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Tags (comma-separated)" name="tags" error={state.errors?.tags}>
          <input id="tags" name="tags" defaultValue={initial?.tags ?? ""} className={textInputClasses()} />
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Status" name="status" required error={state.errors?.status}>
          <select id="status" name="status" defaultValue={initial?.status ?? "draft"} required className={textInputClasses()}>
            {blogPostStatusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </FormField>
        <FormField
          label="Publish / Schedule Date"
          name="publishedAt"
          error={state.errors?.publishedAt}
        >
          <input
            id="publishedAt"
            name="publishedAt"
            type="datetime-local"
            defaultValue={toDateTimeInputValue(initial?.publishedAt)}
            className={textInputClasses()}
          />
        </FormField>
      </div>

      <fieldset className="rounded-md border border-[var(--color-border)] p-4">
        <legend className="px-1 text-sm font-semibold text-[var(--color-ink)]">SEO</legend>
        <div className="flex flex-col gap-4">
          <FormField label="SEO Title" name="seoTitle" error={state.errors?.seoTitle}>
            <input id="seoTitle" name="seoTitle" defaultValue={initial?.seoTitle ?? ""} className={textInputClasses()} />
          </FormField>
          <FormField label="SEO Description" name="seoDescription" error={state.errors?.seoDescription}>
            <textarea
              id="seoDescription"
              name="seoDescription"
              rows={2}
              defaultValue={initial?.seoDescription ?? ""}
              className={textInputClasses()}
            />
          </FormField>
        </div>
      </fieldset>

      {state.formError && (
        <p className="text-sm text-red-600" role="alert">
          {state.formError}
        </p>
      )}
      <div>
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}
