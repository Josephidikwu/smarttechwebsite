import { inArray } from "drizzle-orm";
import { revalidateTag, unstable_cache } from "next/cache";
import "server-only";
import { decryptSecret, encryptSecret } from "@/lib/crypto/settings-encryption";
import { getDb } from "@/lib/db/client";
import { siteSettings } from "@/lib/db/schema";

/**
 * Typed access over the generic `site_settings` key-value table — admin-
 * configurable integration values that used to be env vars (GA4 ID, Turnstile
 * keys, the notification inbox). Anything genuinely infrastructure-level
 * (DATABASE_URL, BLOB_READ_WRITE_TOKEN, SETTINGS_ENCRYPTION_KEY) stays an env
 * var — there's nothing for an admin to meaningfully "enter" for those.
 *
 * Public-facing reads (root layout, public form pages) are wrapped in
 * unstable_cache — without it, a live DB read in the root layout would force
 * every page in the app dynamic, undoing the static/ISR rendering the rest
 * of the build relies on. `saveIntegrationSettings` calls revalidateTag so a
 * saved change shows up immediately rather than waiting out the TTL.
 */

const CACHE_TAG = "site-settings";

const KEYS = {
  ga4MeasurementId: "ga4_measurement_id",
  adminNotificationEmail: "admin_notification_email",
  turnstileSiteKey: "turnstile_site_key",
  turnstileSecretKeyEncrypted: "turnstile_secret_key_encrypted",
} as const;

export type PublicSiteSettings = {
  turnstileSiteKey: string | null;
};

export type IntegrationSettings = {
  ga4MeasurementId: string | null;
  adminNotificationEmail: string | null;
  turnstileSiteKey: string | null;
  turnstileConfigured: boolean; // secret is never sent back to the browser
};

async function readKeys(keys: string[]): Promise<Map<string, string>> {
  const db = getDb();
  const rows = await db
    .select({ key: siteSettings.key, value: siteSettings.value })
    .from(siteSettings)
    .where(inArray(siteSettings.key, keys));
  return new Map(rows.map((r) => [r.key, r.value ?? ""]));
}

/** Used by every public form page — just the Turnstile site key, nothing sensitive. Cached. */
export const getPublicSiteSettings = unstable_cache(
  async (): Promise<PublicSiteSettings> => {
    const values = await readKeys([KEYS.turnstileSiteKey]);
    return { turnstileSiteKey: values.get(KEYS.turnstileSiteKey) || null };
  },
  ["public-site-settings"],
  { tags: [CACHE_TAG], revalidate: 300 },
);

/** Used server-side by GA4Script in the root layout. Cached. */
export const getGA4MeasurementId = unstable_cache(
  async (): Promise<string | null> => {
    const values = await readKeys([KEYS.ga4MeasurementId]);
    return values.get(KEYS.ga4MeasurementId) || null;
  },
  ["ga4-measurement-id"],
  { tags: [CACHE_TAG], revalidate: 300 },
);

/** Which inbox receives "new submission" notifications. Cached (read on every form submit). */
export const getAdminNotificationEmail = unstable_cache(
  async (): Promise<string> => {
    const values = await readKeys([KEYS.adminNotificationEmail]);
    return values.get(KEYS.adminNotificationEmail) || "";
  },
  ["admin-notification-email"],
  { tags: [CACHE_TAG], revalidate: 300 },
);

/** Server-side siteverify only. Cached (read on every form submit). */
export const getTurnstileSecretKey = unstable_cache(
  async (): Promise<string | null> => {
    const values = await readKeys([KEYS.turnstileSecretKeyEncrypted]);
    const encrypted = values.get(KEYS.turnstileSecretKeyEncrypted);
    return encrypted ? decryptSecret(encrypted) : null;
  },
  ["turnstile-secret-key"],
  { tags: [CACHE_TAG], revalidate: 300 },
);

/** Used by the /admin/settings/integrations page itself — always fresh, never cached. */
export async function getIntegrationSettings(): Promise<IntegrationSettings> {
  const values = await readKeys([
    KEYS.ga4MeasurementId,
    KEYS.adminNotificationEmail,
    KEYS.turnstileSiteKey,
    KEYS.turnstileSecretKeyEncrypted,
  ]);
  return {
    ga4MeasurementId: values.get(KEYS.ga4MeasurementId) || null,
    adminNotificationEmail: values.get(KEYS.adminNotificationEmail) || null,
    turnstileSiteKey: values.get(KEYS.turnstileSiteKey) || null,
    turnstileConfigured: Boolean(values.get(KEYS.turnstileSecretKeyEncrypted)),
  };
}

async function upsert(key: string, value: string) {
  const db = getDb();
  await db
    .insert(siteSettings)
    .values({ key, value, updatedAt: new Date() })
    .onConflictDoUpdate({ target: siteSettings.key, set: { value, updatedAt: new Date() } });
}

/** Saves from the Integrations admin form. Blank turnstileSecretKey keeps the currently stored one. */
export async function saveIntegrationSettings(input: {
  ga4MeasurementId: string;
  adminNotificationEmail: string;
  turnstileSiteKey: string;
  turnstileSecretKey: string; // "" means "don't change"
}) {
  await upsert(KEYS.ga4MeasurementId, input.ga4MeasurementId);
  await upsert(KEYS.adminNotificationEmail, input.adminNotificationEmail);
  await upsert(KEYS.turnstileSiteKey, input.turnstileSiteKey);
  if (input.turnstileSecretKey) {
    await upsert(KEYS.turnstileSecretKeyEncrypted, encryptSecret(input.turnstileSecretKey));
  }
  revalidateTag(CACHE_TAG, "max");
}
