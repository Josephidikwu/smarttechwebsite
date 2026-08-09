"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

export function DeleteButton({
  id,
  action,
  confirmMessage = "Delete this? This can't be undone.",
}: {
  id: number;
  action: (id: number) => Promise<void>;
  confirmMessage?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm(confirmMessage)) return;
        startTransition(async () => {
          await action(id);
          router.refresh();
        });
      }}
      className="text-sm font-medium text-red-600 hover:underline disabled:opacity-50"
    >
      Delete
    </button>
  );
}
