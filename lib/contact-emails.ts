/**
 * The two emails one form submission produces.
 *
 * They are deliberately different documents. Alvin's is a work order — every
 * field, nothing else, and it replies to the sender. The sender's is a receipt
 * — it confirms what arrived, says when to expect an answer, and replies to
 * Alvin. Building both here keeps the route handler about delivery.
 *
 * Written as inline-styled tables rather than anything nicer: email clients do
 * not have our stylesheet, and a fair number still ignore <style> blocks. The
 * hex values are the design tokens from globals.css, copied because there is no
 * way to reference them from here.
 */

import { site } from "@/data/site";

const BG = "#0A0A0A";
const SURFACE = "#111111";
const INK = "#F5F4F2";
const MUTED = "#8A8A8A";
const HAIRLINE = "rgba(245,244,242,0.1)";

const FONT = "Helvetica Neue,Helvetica,Arial,sans-serif";

export type ContactSubmission = {
  name: string;
  company: string;
  email: string;
  projectType: string;
  budget: string;
  timeline: string;
  message: string;
};

type Email = { subject: string; html: string; text: string };

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Collapses newlines for the one place HTML escaping does not reach.
 *
 * `name` is validated for length, not for shape, and it goes into the subject
 * line. Resend takes a JSON object rather than raw SMTP headers, so this is not
 * the classic CRLF header injection — but a subject is a single-line field, and
 * a name carrying line breaks has no business deciding how it renders.
 */
function oneLine(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

/** The rows both emails show, in the order the form asks for them. */
function detailRows(submission: ContactSubmission): Array<[string, string]> {
  return [
    ["Name", submission.name],
    ["Company", submission.company],
    ["Email", submission.email],
    ["Project type", submission.projectType],
    ["Budget", submission.budget],
    ["Timeline", submission.timeline],
  ];
}

function renderRows(rows: Array<[string, string]>) {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;width:100%">
      ${rows
        .map(
          ([label, value]) => `
        <tr>
          <td style="padding:8px 24px 8px 0;font-family:${FONT};font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:${MUTED};white-space:nowrap;vertical-align:top">${label}</td>
          <td style="padding:8px 0;font-family:${FONT};font-size:14px;color:${INK};vertical-align:top">${escapeHtml(value)}</td>
        </tr>`,
        )
        .join("")}
    </table>`;
}

/**
 * Shared frame. `preheader` is the grey line inboxes show next to the subject —
 * hidden in the body itself, which is why it carries the display:none stack.
 */
function shell({ preheader, body }: { preheader: string; body: string }) {
  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:${BG};">
    <div style="display:none;font-size:1px;color:${BG};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden">${escapeHtml(preheader)}</div>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${BG};border-collapse:collapse">
      <tr>
        <td align="center" style="padding:40px 16px">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px;background:${SURFACE};border:1px solid ${HAIRLINE};border-collapse:collapse">
            <tr>
              <td style="padding:32px 32px 36px">
                <p style="margin:0 0 28px;font-family:${FONT};font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:${INK}">${escapeHtml(site.name)}</p>
                ${body}
              </td>
            </tr>
          </table>
          <p style="margin:20px 0 0;font-family:${FONT};font-size:11px;color:${MUTED}">${escapeHtml(site.contact.location)} · <a href="${site.url}" style="color:${MUTED}">${escapeHtml(site.url.replace(/^https?:\/\//, ""))}</a></p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function heading(text: string) {
  return `<h1 style="margin:0 0 24px;font-family:${FONT};font-size:20px;line-height:1.3;font-weight:500;color:${INK}">${escapeHtml(text)}</h1>`;
}

function paragraph(text: string) {
  return `<p style="margin:0 0 16px;font-family:${FONT};font-size:14px;line-height:1.65;color:${INK}">${escapeHtml(text)}</p>`;
}

function sectionLabel(text: string) {
  return `<p style="margin:28px 0 10px;font-family:${FONT};font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:${MUTED}">${escapeHtml(text)}</p>`;
}

function quotedMessage(message: string) {
  return `<p style="margin:0;padding:0 0 0 16px;border-left:1px solid ${HAIRLINE};font-family:${FONT};font-size:14px;line-height:1.65;color:${INK};white-space:pre-wrap">${escapeHtml(message)}</p>`;
}

/** Goes to Alvin. Everything the sender filled in, and nothing invented. */
export function notificationEmail(submission: ContactSubmission): Email {
  const rows = detailRows(submission);
  const company = submission.company !== "Not given" ? ` (${submission.company})` : "";

  return {
    subject: oneLine(`${submission.projectType} inquiry from ${submission.name}${company}`),
    html: shell({
      preheader: oneLine(`${submission.projectType} · ${submission.name}${company}`),
      body: [
        heading("New inquiry from the website"),
        renderRows(rows),
        sectionLabel("Project details"),
        quotedMessage(submission.message),
        `<p style="margin:28px 0 0;font-family:${FONT};font-size:13px;color:${MUTED}">Replying to this email goes straight to ${escapeHtml(submission.name)}.</p>`,
      ].join("\n"),
    }),
    text: [
      "New inquiry from the website",
      "",
      ...rows.map(([label, value]) => `${label}: ${value}`),
      "",
      "Project details:",
      submission.message,
      "",
      `Reply to this email to answer ${submission.name} directly.`,
    ].join("\n"),
  };
}

/**
 * Goes to whoever filled in the form. Repeats their own answers back so they
 * can see what actually arrived, and sets an expectation for the reply.
 */
export function confirmationEmail(submission: ContactSubmission): Email {
  const rows = detailRows(submission);
  const firstName = submission.name.split(/\s+/)[0];

  return {
    subject: `Thanks, your inquiry reached ${site.name}`,
    html: shell({
      preheader: "Your inquiry has arrived. Alvin normally replies within one working day.",
      body: [
        heading(`Thanks, ${firstName}. It arrived.`),
        paragraph(
          `Your ${submission.projectType.toLowerCase()} inquiry is in my inbox. I read everything myself and normally reply within one working day.`,
        ),
        paragraph(
          "If it is urgent, or you thought of something to add, just reply to this email.",
        ),
        sectionLabel("What you sent"),
        renderRows(rows),
        sectionLabel("Project details"),
        quotedMessage(submission.message),
        `<p style="margin:28px 0 0;font-family:${FONT};font-size:13px;line-height:1.6;color:${MUTED}">${escapeHtml(site.name)} · <a href="mailto:${site.contact.email}" style="color:${MUTED}">${escapeHtml(site.contact.email)}</a></p>`,
      ].join("\n"),
    }),
    text: [
      `Thanks, ${firstName}. It arrived.`,
      "",
      `Your ${submission.projectType.toLowerCase()} inquiry is in my inbox. I read everything myself and normally reply within one working day.`,
      "",
      "If it is urgent, or you thought of something to add, just reply to this email.",
      "",
      "What you sent:",
      ...rows.map(([label, value]) => `${label}: ${value}`),
      "",
      "Project details:",
      submission.message,
      "",
      site.name,
      site.contact.email,
    ].join("\n"),
  };
}
