import nodemailer from "nodemailer";
import { decryptSecret } from "@/lib/crypto/settings-encryption";
import { getDb } from "@/lib/db/client";
import { emailSettings } from "@/lib/db/schema";
import { getAdminNotificationEmail } from "@/lib/settings/site-settings";

/**
 * Admin-configurable webmail (SMTP) — set from /admin/settings/email, not an
 * env var. Best-effort: a DB write must never fail because email did, so
 * every call here is wrapped and logged rather than thrown from the calling
 * Server Action. Until a super_admin has saved SMTP settings, this logs and
 * no-ops (same graceful-degradation pattern as Turnstile/GA4 before their
 * keys are set).
 */
async function getTransport() {
  const db = getDb();
  const [row] = await db.select().from(emailSettings).limit(1);
  if (!row?.smtpHost || !row.smtpPort || !row.smtpUsername || !row.smtpPasswordEncrypted) {
    return null;
  }
  return {
    transport: nodemailer.createTransport({
      host: row.smtpHost,
      port: row.smtpPort,
      secure: row.smtpSecure,
      auth: { user: row.smtpUsername, pass: decryptSecret(row.smtpPasswordEncrypted) },
    }),
    from: row.fromName ? `"${row.fromName}" <${row.fromAddress}>` : row.fromAddress || row.smtpUsername,
  };
}

async function sendMail(opts: { to: string; subject: string; html: string; text: string }) {
  if (!opts.to) {
    console.warn(`[email] No recipient configured — skipped "${opts.subject}". See docs/SETUP.md.`);
    return;
  }

  const configured = await getTransport();
  if (!configured) {
    console.warn(
      `[email] Webmail isn't configured yet — skipped "${opts.subject}". Set it up at /admin/settings/email.`,
    );
    return;
  }

  try {
    await configured.transport.sendMail({
      to: opts.to,
      from: configured.from,
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
    });
  } catch (err) {
    // Bad SMTP credentials, host down, etc. — don't break the user-facing
    // flow over it.
    console.error(`[email] send failed for "${opts.subject}":`, err);
  }
}

async function adminEmail() {
  return getAdminNotificationEmail();
}

/** Used by the "Send test email" button in /admin/settings/email — surfaces
 *  connection/auth errors immediately instead of a silent console.error. */
export async function sendTestEmail(opts: {
  to: string;
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  smtpUsername: string;
  smtpPassword: string;
  fromAddress: string;
  fromName: string | null;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const transport = nodemailer.createTransport({
      host: opts.smtpHost,
      port: opts.smtpPort,
      secure: opts.smtpSecure,
      auth: { user: opts.smtpUsername, pass: opts.smtpPassword },
    });
    await transport.verify();
    await transport.sendMail({
      to: opts.to,
      from: opts.fromName ? `"${opts.fromName}" <${opts.fromAddress}>` : opts.fromAddress,
      subject: "Smart Technology — test email",
      text: "If you're reading this, your webmail (SMTP) settings are working.",
      html: "<p>If you're reading this, your webmail (SMTP) settings are working.</p>",
    });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

function layout(title: string, rows: [string, string | null | undefined][]) {
  const lines = rows.filter(([, v]) => v);
  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#0a0a10">
      <h2 style="color:#042ccc">${title}</h2>
      <table style="width:100%;border-collapse:collapse">
        ${lines
          .map(
            ([label, value]) => `
          <tr>
            <td style="padding:6px 12px 6px 0;color:#55555f;vertical-align:top;white-space:nowrap">${label}</td>
            <td style="padding:6px 0">${value}</td>
          </tr>`,
          )
          .join("")}
      </table>
    </div>`;
  const text = `${title}\n\n${lines.map(([label, value]) => `${label}: ${value}`).join("\n")}`;
  return { html, text };
}

export async function notifyAdminOfContactSubmission(s: {
  name: string;
  email: string;
  phone?: string | null;
  organisation?: string | null;
  subject: string;
  message: string;
}) {
  const { html, text } = layout("New contact enquiry", [
    ["Name", s.name],
    ["Email", s.email],
    ["Phone", s.phone],
    ["Organisation", s.organisation],
    ["What they need", s.subject],
    ["Message", s.message],
  ]);
  await sendMail({ to: await adminEmail(), subject: `New enquiry: ${s.subject}`, html, text });
}

/** "We've received your application" — docs/content-deck.md §25, reused across
 *  training/internship/careers/general applications. */
export async function sendApplicantConfirmation(opts: {
  to: string;
  applicantName: string;
  applicationType: "training" | "internship" | "job" | "general";
  itemName: string;
}) {
  const { html, text } = layout("Application Received", [
    ["Application type", opts.applicationType],
    ["Programme / role", opts.itemName],
    ["Submitted", new Date().toLocaleString()],
  ]);
  const withIntro = {
    html: `<p>Hi ${opts.applicantName},</p><p>Thank you for your interest in Smart Technology. We've successfully received your application. Our team will review your submission and contact you if you are selected for the next stage.</p>${html}`,
    text: `Hi ${opts.applicantName},\n\nThank you for your interest in Smart Technology. We've successfully received your application. Our team will review your submission and contact you if you are selected for the next stage.\n\n${text}`,
  };
  await sendMail({ to: opts.to, subject: "Application Received — Smart Technology", ...withIntro });
}

export async function notifyAdminOfTrainingApplication(a: {
  fullName: string;
  email: string;
  phone?: string | null;
  programmeName: string;
}) {
  const { html, text } = layout("New training application", [
    ["Name", a.fullName],
    ["Email", a.email],
    ["Phone", a.phone],
    ["Programme", a.programmeName],
  ]);
  await sendMail({
    to: await adminEmail(),
    subject: `New training application: ${a.programmeName}`,
    html,
    text,
  });
}

export async function notifyAdminOfInternshipApplication(a: {
  fullName: string;
  email: string;
  phone?: string | null;
  positionName: string;
}) {
  const { html, text } = layout("New internship application", [
    ["Name", a.fullName],
    ["Email", a.email],
    ["Phone", a.phone],
    ["Position", a.positionName],
  ]);
  await sendMail({
    to: await adminEmail(),
    subject: `New internship application: ${a.positionName}`,
    html,
    text,
  });
}

export async function notifyAdminOfJobApplication(a: {
  fullName: string;
  email: string;
  phone?: string | null;
  jobTitle: string;
}) {
  const { html, text } = layout("New job application", [
    ["Name", a.fullName],
    ["Email", a.email],
    ["Phone", a.phone],
    ["Job", a.jobTitle],
  ]);
  await sendMail({ to: await adminEmail(), subject: `New job application: ${a.jobTitle}`, html, text });
}

export async function notifyAdminOfGeneralApplication(a: {
  fullName: string;
  email: string;
  phone?: string | null;
}) {
  const { html, text } = layout("New general career application", [
    ["Name", a.fullName],
    ["Email", a.email],
    ["Phone", a.phone],
  ]);
  await sendMail({ to: await adminEmail(), subject: "New general career application", html, text });
}

export async function notifyAdminOfProductEnquiry(e: {
  name: string;
  email: string;
  phone?: string | null;
  organisation?: string | null;
  productName: string;
  type: "request" | "bulk_quote";
  message?: string | null;
}) {
  const { html, text } = layout(
    e.type === "bulk_quote" ? "New bulk quote request" : "New product enquiry",
    [
      ["Product", e.productName],
      ["Name", e.name],
      ["Email", e.email],
      ["Phone", e.phone],
      ["Organisation", e.organisation],
      ["Message", e.message],
    ],
  );
  await sendMail({
    to: await adminEmail(),
    subject: `${e.type === "bulk_quote" ? "Bulk quote request" : "Product enquiry"}: ${e.productName}`,
    html,
    text,
  });
}

export async function notifyAdminOfQuoteRequest(q: {
  name: string;
  email: string;
  phone?: string | null;
  organisation?: string | null;
  whatDoYouNeed: string;
  budgetRange?: string | null;
  description?: string | null;
}) {
  const { html, text } = layout("New quote request", [
    ["Name", q.name],
    ["Email", q.email],
    ["Phone", q.phone],
    ["Organisation", q.organisation],
    ["What they need", q.whatDoYouNeed],
    ["Budget range", q.budgetRange],
    ["Description", q.description],
  ]);
  await sendMail({ to: await adminEmail(), subject: "New quote request", html, text });
}
