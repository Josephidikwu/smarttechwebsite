"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getDb } from "@/lib/db/client";
import { quoteRequests } from "@/lib/db/schema";
import { quoteRequestSchema } from "@/lib/validation/schemas";
import { verifyTurnstile } from "@/lib/turnstile";
import { notifyAdminOfQuoteRequest } from "@/lib/email";
import { uploadToR2 } from "@/lib/storage/r2";

export type QuoteFormState = {
  errors?: Record<string, string[]>;
  formError?: string;
  values?: Record<string, string>;
};

export async function submitQuoteRequest(
  _prevState: QuoteFormState,
  formData: FormData,
): Promise<QuoteFormState> {
  const raw = Object.fromEntries(
    Array.from(formData.entries()).filter(([, v]) => typeof v === "string"),
  ) as Record<string, string>;

  const parsed = quoteRequestSchema.safeParse({
    name: raw.name,
    organisation: raw.organisation,
    email: raw.email,
    phone: raw.phone,
    whatDoYouNeed: raw.whatDoYouNeed,
    budgetRange: raw.budgetRange,
    description: raw.description,
    preferredContactMethod: raw.preferredContactMethod,
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors, values: raw };
  }

  const ip = (await headers()).get("cf-connecting-ip") ?? undefined;
  const verified = await verifyTurnstile(raw["cf-turnstile-response"] ?? null, ip);
  if (!verified) {
    return { formError: "We couldn't verify you're human — please try again.", values: raw };
  }

  let attachmentKey: string | null = null;
  const attachment = formData.get("attachment");
  if (attachment instanceof File && attachment.size > 0) {
    const result = await uploadToR2(attachment, { prefix: "quote-attachments", kind: "document" });
    if ("error" in result) {
      return { formError: result.error, values: raw };
    }
    attachmentKey = result.key;
  }

  const db = getDb();
  await db.insert(quoteRequests).values({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone || null,
    organisation: parsed.data.organisation || null,
    whatDoYouNeed: parsed.data.whatDoYouNeed,
    budgetRange: parsed.data.budgetRange || null,
    description: parsed.data.description || null,
    preferredContactMethod: parsed.data.preferredContactMethod || null,
    attachmentKey,
  });

  await notifyAdminOfQuoteRequest(parsed.data);

  redirect("/quote/thank-you");
}
