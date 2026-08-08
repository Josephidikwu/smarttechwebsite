import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Cloudflare Email Service wrapper (`send_email` binding — see
 * wrangler.jsonc). Best-effort: a DB write must never fail because email
 * did, so every call here is wrapped and logged rather than thrown from the
 * calling Server Action. `from` must be on a domain onboarded via
 * `wrangler email sending enable` (docs/SETUP.md) — until then, and until
 * ADMIN_NOTIFICATION_EMAIL is set, this logs and no-ops.
 */
async function sendMail(opts: { to: string; subject: string; html: string; text: string }) {
  const { env } = getCloudflareContext();
  const from = env.EMAIL_FROM_ADDRESS;

  if (!opts.to) {
    console.warn(`[email] No recipient configured — skipped "${opts.subject}". See docs/SETUP.md.`);
    return;
  }

  try {
    await env.EMAIL.send({
      to: opts.to,
      from: { email: from, name: "Smart Technology" },
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
    });
  } catch (err) {
    // Domain likely not onboarded to Email Service yet — don't break the
    // user-facing flow over it.
    console.error(`[email] send failed for "${opts.subject}":`, err);
  }
}

function adminEmail() {
  const { env } = getCloudflareContext();
  return env.ADMIN_NOTIFICATION_EMAIL;
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
  await sendMail({ to: adminEmail(), subject: `New enquiry: ${s.subject}`, html, text });
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
  await sendMail({ to: adminEmail(), subject: "New quote request", html, text });
}
