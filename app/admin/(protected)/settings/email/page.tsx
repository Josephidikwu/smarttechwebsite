import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/rbac";
import { getDb } from "@/lib/db/client";
import { emailSettings } from "@/lib/db/schema";
import { EmailSettingsForm } from "@/components/sections/admin/email-settings-form";

export const metadata: Metadata = { title: "Email (Webmail)", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminEmailSettingsPage() {
  await requireUser("super_admin");

  const db = getDb();
  const [row] = await db.select().from(emailSettings).limit(1);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">Email (Webmail)</h1>
      <p className="mt-1 max-w-2xl text-sm text-[var(--color-ink-muted)]">
        Every notification email the site sends — contact enquiries, application confirmations,
        product enquiries, quote requests — goes out through this mailbox. Enter the SMTP details
        from your email provider (Gmail, Zoho, Outlook, or any host that offers SMTP), then send a
        test email to confirm it works before relying on it.
      </p>

      <div className="mt-8 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-6">
        <EmailSettingsForm
          initial={{
            smtpHost: row?.smtpHost ?? null,
            smtpPort: row?.smtpPort ?? 465,
            smtpSecure: row?.smtpSecure ?? true,
            smtpUsername: row?.smtpUsername ?? null,
            fromAddress: row?.fromAddress ?? null,
            fromName: row?.fromName ?? null,
            configured: Boolean(row?.smtpPasswordEncrypted),
          }}
        />
      </div>
    </div>
  );
}
