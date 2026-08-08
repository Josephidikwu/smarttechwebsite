import type { ReactNode } from "react";

const inputClasses =
  "w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3.5 py-2.5 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] focus:outline-2 focus:outline-offset-1 focus:outline-[var(--color-brand-blue)]";

export function FormField({
  label,
  name,
  children,
  error,
  required,
}: {
  label: string;
  name: string;
  children: ReactNode;
  error?: string[];
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium text-[var(--color-ink)]">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <div className="mt-1.5">{children}</div>
      {error?.[0] && (
        <p className="mt-1.5 text-xs text-red-600" role="alert">
          {error[0]}
        </p>
      )}
    </div>
  );
}

export function textInputClasses() {
  return inputClasses;
}
