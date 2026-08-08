"use server";

import { getDb } from "@/lib/db/client";
import { newsletterSubscribers } from "@/lib/db/schema";
import { newsletterSchema } from "@/lib/validation/schemas";

export type NewsletterState = { error?: string; success?: boolean };

export async function subscribeToNewsletter(
  _prevState: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const parsed = newsletterSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Enter a valid email address" };
  }

  const db = getDb();
  // Re-subscribing (including someone who'd previously unsubscribed) just
  // flips status back to active.
  await db
    .insert(newsletterSubscribers)
    .values({ email: parsed.data.email })
    .onConflictDoUpdate({
      target: newsletterSubscribers.email,
      set: { status: "active" },
    });

  return { success: true };
}
