"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/rbac";
import { encryptSecret } from "@/lib/crypto/settings-encryption";
import { getDb } from "@/lib/db/client";
import { emailSettings } from "@/lib/db/schema";
import { sendTestEmail } from "@/lib/email";
import { emailSettingsSchema } from "@/lib/validation/schemas";

export type EmailSettingsState = {
  errors?: Record<string, string[]>;
  formError?: string;
  success?: boolean;
};

function parse(formData: FormData) {
  return emailSettingsSchema.safeParse({
    smtpHost: formData.get("smtpHost"),
    smtpPort: formData.get("smtpPort"),
    smtpSecure: formData.get("smtpSecure") === "on",
    smtpUsername: formData.get("smtpUsername"),
    smtpPassword: formData.get("smtpPassword"),
    fromAddress: formData.get("fromAddress"),
    fromName: formData.get("fromName"),
  });
}

/** super_admin only — saves the webmail (SMTP) connection every notification email uses. */
export async function saveEmailSettings(
  _prevState: EmailSettingsState,
  formData: FormData,
): Promise<EmailSettingsState> {
  await requireUser("super_admin");

  const parsed = parse(formData);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const db = getDb();
  const [existing] = await db.select().from(emailSettings).limit(1);

  // Blank password on the form means "keep what's already saved" — never
  // silently wipe a working configuration because the field was left empty.
  const passwordEncrypted = parsed.data.smtpPassword
    ? encryptSecret(parsed.data.smtpPassword)
    : existing?.smtpPasswordEncrypted;

  if (!passwordEncrypted) {
    return { formError: "Enter the mailbox password." };
  }

  const values = {
    id: 1,
    smtpHost: parsed.data.smtpHost,
    smtpPort: parsed.data.smtpPort,
    smtpSecure: parsed.data.smtpSecure,
    smtpUsername: parsed.data.smtpUsername,
    smtpPasswordEncrypted: passwordEncrypted,
    fromAddress: parsed.data.fromAddress,
    fromName: parsed.data.fromName || null,
    updatedAt: new Date(),
  };

  if (existing) {
    await db.update(emailSettings).set(values);
  } else {
    await db.insert(emailSettings).values(values);
  }

  revalidatePath("/admin/settings/email");
  return { success: true };
}

export type SendTestEmailState = {
  error?: string;
  success?: boolean;
};

/** Builds a transport from the just-submitted (not-yet-saved) form values so
 *  a bad host/port/credential is caught before it's relied on for real. */
export async function testEmailSettings(
  _prevState: SendTestEmailState,
  formData: FormData,
): Promise<SendTestEmailState> {
  const user = await requireUser("super_admin");

  const parsed = parse(formData);
  if (!parsed.success) {
    return { error: "Fix the highlighted fields first." };
  }

  let password = parsed.data.smtpPassword;
  if (!password) {
    const db = getDb();
    const [existing] = await db.select().from(emailSettings).limit(1);
    if (!existing?.smtpPasswordEncrypted) {
      return { error: "Enter the mailbox password to send a test email." };
    }
    const { decryptSecret } = await import("@/lib/crypto/settings-encryption");
    password = decryptSecret(existing.smtpPasswordEncrypted);
  }

  const result = await sendTestEmail({
    to: user.email,
    smtpHost: parsed.data.smtpHost,
    smtpPort: parsed.data.smtpPort,
    smtpSecure: parsed.data.smtpSecure,
    smtpUsername: parsed.data.smtpUsername,
    smtpPassword: password,
    fromAddress: parsed.data.fromAddress,
    fromName: parsed.data.fromName || null,
  });

  if (!result.ok) return { error: result.error };
  return { success: true };
}
