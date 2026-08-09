"use server";

import { requireUser } from "@/lib/auth/rbac";
import { saveIntegrationSettings } from "@/lib/settings/site-settings";
import { integrationSettingsSchema } from "@/lib/validation/schemas";

export type IntegrationSettingsState = {
  errors?: Record<string, string[]>;
  formError?: string;
  success?: boolean;
};

/** super_admin only — GA4 ID, notification inbox, Turnstile keys. All optional:
 *  each integration simply no-ops until its value is set. */
export async function saveIntegrations(
  _prevState: IntegrationSettingsState,
  formData: FormData,
): Promise<IntegrationSettingsState> {
  await requireUser("super_admin");

  const parsed = integrationSettingsSchema.safeParse({
    ga4MeasurementId: formData.get("ga4MeasurementId"),
    adminNotificationEmail: formData.get("adminNotificationEmail"),
    turnstileSiteKey: formData.get("turnstileSiteKey"),
    turnstileSecretKey: formData.get("turnstileSecretKey"),
  });
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  await saveIntegrationSettings({
    ga4MeasurementId: parsed.data.ga4MeasurementId ?? "",
    adminNotificationEmail: parsed.data.adminNotificationEmail ?? "",
    turnstileSiteKey: parsed.data.turnstileSiteKey ?? "",
    turnstileSecretKey: parsed.data.turnstileSecretKey ?? "",
  });

  return { success: true };
}
