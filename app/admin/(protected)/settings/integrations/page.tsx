import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/rbac";
import { getIntegrationSettings } from "@/lib/settings/site-settings";
import { IntegrationsForm } from "@/components/sections/admin/integrations-form";

export const metadata: Metadata = { title: "Integrations", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminIntegrationsPage() {
  await requireUser("super_admin");

  const settings = await getIntegrationSettings();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">Integrations</h1>
      <p className="mt-1 max-w-2xl text-sm text-[var(--color-ink-muted)]">
        Analytics, notifications, and anti-spam — none of these need a redeploy to change. Every
        integration works fine unset; the related feature just no-ops until you save a value here.
      </p>

      <div className="mt-8 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-6">
        <IntegrationsForm initial={settings} />
      </div>
    </div>
  );
}
