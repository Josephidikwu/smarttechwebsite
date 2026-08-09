"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { ProductFormState } from "@/lib/actions/catalogue-admin";
import { stockStatusOptions, productStatusOptions } from "@/lib/validation/schemas";
import { FormField, textInputClasses } from "@/components/ui/form-field";

const initialState: ProductFormState = {};

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

export function ProductForm({
  action,
  submitLabel,
  categories,
  brands,
  initial,
}: {
  action: (prevState: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  submitLabel: string;
  categories: { id: number; name: string }[];
  brands: { id: number; name: string }[];
  initial?: {
    name?: string;
    categoryId?: number | null;
    brandId?: number | null;
    sku?: string | null;
    price?: number | null;
    currency?: string;
    stockStatus?: string;
    description?: string | null;
    featured?: boolean;
    status?: string;
    specifications?: Record<string, string> | null;
  };
}) {
  const [state, formAction] = useActionState(action, initialState);
  const specs = initial?.specifications ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Product Name" name="name" required error={state.errors?.name}>
          <input id="name" name="name" defaultValue={initial?.name} required className={textInputClasses()} />
        </FormField>
        <FormField label="SKU" name="sku" error={state.errors?.sku}>
          <input id="sku" name="sku" defaultValue={initial?.sku ?? ""} className={textInputClasses()} />
        </FormField>
      </div>

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
        <FormField label="Brand" name="brandId" error={state.errors?.brandId}>
          <select id="brandId" name="brandId" defaultValue={initial?.brandId ?? ""} className={textInputClasses()}>
            <option value="">None</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <FormField label="Price" name="price" error={state.errors?.price}>
          <input id="price" name="price" type="number" step="0.01" min={0} defaultValue={initial?.price ?? ""} className={textInputClasses()} />
        </FormField>
        <FormField label="Currency" name="currency" error={state.errors?.currency}>
          <input id="currency" name="currency" defaultValue={initial?.currency ?? "NGN"} className={textInputClasses()} />
        </FormField>
        <FormField label="Stock Status" name="stockStatus" required error={state.errors?.stockStatus}>
          <select id="stockStatus" name="stockStatus" defaultValue={initial?.stockStatus ?? "contact_us"} required className={textInputClasses()}>
            {stockStatusOptions.map((s) => (
              <option key={s} value={s}>
                {s.replace("_", " ")}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <FormField label="Description" name="description" error={state.errors?.description}>
        <textarea id="description" name="description" rows={3} defaultValue={initial?.description ?? ""} className={textInputClasses()} />
      </FormField>

      <fieldset className="rounded-md border border-[var(--color-border)] p-4">
        <legend className="px-1 text-sm font-semibold text-[var(--color-ink)]">Specifications</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Processor" name="specProcessor">
            <input id="specProcessor" name="specProcessor" defaultValue={specs.Processor ?? ""} className={textInputClasses()} />
          </FormField>
          <FormField label="Memory" name="specMemory">
            <input id="specMemory" name="specMemory" defaultValue={specs.Memory ?? ""} className={textInputClasses()} />
          </FormField>
          <FormField label="Storage" name="specStorage">
            <input id="specStorage" name="specStorage" defaultValue={specs.Storage ?? ""} className={textInputClasses()} />
          </FormField>
          <FormField label="Display" name="specDisplay">
            <input id="specDisplay" name="specDisplay" defaultValue={specs.Display ?? ""} className={textInputClasses()} />
          </FormField>
          <FormField label="Connectivity" name="specConnectivity">
            <input id="specConnectivity" name="specConnectivity" defaultValue={specs.Connectivity ?? ""} className={textInputClasses()} />
          </FormField>
          <FormField label="Battery" name="specBattery">
            <input id="specBattery" name="specBattery" defaultValue={specs.Battery ?? ""} className={textInputClasses()} />
          </FormField>
          <FormField label="Operating System" name="specOs">
            <input id="specOs" name="specOs" defaultValue={specs["Operating System"] ?? ""} className={textInputClasses()} />
          </FormField>
          <FormField label="Other" name="specOther">
            <input id="specOther" name="specOther" defaultValue={specs.Other ?? ""} className={textInputClasses()} />
          </FormField>
        </div>
      </fieldset>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-[var(--color-ink)]">
          <input type="checkbox" name="featured" defaultChecked={initial?.featured} className="h-4 w-4" />
          Featured product
        </label>
        <FormField label="Status" name="status" required error={state.errors?.status}>
          <select id="status" name="status" defaultValue={initial?.status ?? "draft"} required className={textInputClasses()}>
            {productStatusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </FormField>
      </div>

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
