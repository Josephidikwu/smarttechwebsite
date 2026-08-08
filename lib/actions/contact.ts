"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getDb } from "@/lib/db/client";
import { contactSubmissions } from "@/lib/db/schema";
import { contactSchema } from "@/lib/validation/schemas";
import { verifyTurnstile } from "@/lib/turnstile";
import { notifyAdminOfContactSubmission } from "@/lib/email";

export type ContactFormState = {
  errors?: Record<string, string[]>;
  formError?: string;
  values?: Record<string, string>;
};

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const raw = Object.fromEntries(formData) as Record<string, string>;

  const parsed = contactSchema.safeParse({
    name: raw.name,
    organisation: raw.organisation,
    email: raw.email,
    phone: raw.phone,
    subject: raw.subject,
    message: raw.message,
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors, values: raw };
  }

  const ip = (await headers()).get("cf-connecting-ip") ?? undefined;
  const verified = await verifyTurnstile(raw["cf-turnstile-response"] ?? null, ip);
  if (!verified) {
    return { formError: "We couldn't verify you're human — please try again.", values: raw };
  }

  const db = getDb();
  await db.insert(contactSubmissions).values({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone || null,
    organisation: parsed.data.organisation || null,
    subject: parsed.data.subject,
    message: parsed.data.message,
  });

  await notifyAdminOfContactSubmission(parsed.data);

  redirect("/contact/thank-you");
}
