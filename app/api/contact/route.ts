import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { site } from "@/data/site";
import { validateContact, type ContactPayload } from "@/lib/contact";
import { confirmationEmail, notificationEmail } from "@/lib/contact-emails";

/**
 * The site's own hostname, taken from site.url rather than written twice.
 *
 * The origin check below builds its allowlist from this, so the day the domain
 * changes there is one place to change rather than two that can disagree.
 */
const SITE_HOST = new URL(site.url).host;

/**
 * The two shapes Resend accepts for `from` and `to`.
 *
 * Either a bare `name@example.com`, or `Name <name@example.com>` with the
 * address in angle brackets. Anything else comes back as a 422 validation error
 * at send time, which is how an invisible trailing newline in a Worker secret
 * turned into "Could not send just now" for every visitor.
 *
 * Deliberately not the pattern in lib/contact.ts: that one governs what a
 * visitor may type and knows nothing about display names.
 */
const SENDER_PATTERN =
  /^(?:[^\s@]+@[^\s@]+\.[^\s@]{2,}|[^<>]*<[^\s@]+@[^\s@]+\.[^\s@]{2,}>)$/;

/**
 * The fallback counter: a speed bump, and worth being honest about which.
 *
 * This Map lives in one Worker isolate. Cloudflare runs many in parallel and
 * discards them freely, so a determined sender meets a fresh counter most
 * requests. It stops a double-click and an impatient resend, which is most of
 * what a portfolio form sees. `isRateLimited` below prefers the runtime binding
 * and only falls back here — under `next dev`, in a test, or before the binding
 * is deployed — because a form that breaks over its own rate limiter is worse
 * than one counting loosely.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function isRateLimitedInMemory(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);

  // Keep the map from growing without bound on a long-lived instance.
  if (hits.size > 5000) {
    for (const [entryKey, times] of hits) {
      if (times.every((time) => now - time >= WINDOW_MS)) hits.delete(entryKey);
    }
  }

  return recent.length > MAX_PER_WINDOW;
}

/**
 * Five submissions a minute from one address, counted in the runtime.
 *
 * The binding is configured in wrangler.jsonc. It counts per Cloudflare
 * location rather than globally, which is a real limitation and still far
 * better than per isolate: one sender reaches one location. The zone rule in
 * front of the Worker catches bursts; this catches the steady drip that a
 * ten-second window on the Free plan lets through.
 */
async function isRateLimited(key: string) {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const limiter = env.CONTACT_RATE_LIMITER;
    if (limiter) {
      const { success } = await limiter.limit({ key });
      return !success;
    }
  } catch {
    // No Cloudflare context at all — `next dev` without the platform proxy, or
    // a plain Node test. Counting loosely beats refusing to accept the form.
  }

  return isRateLimitedInMemory(key);
}

export async function POST(request: Request) {
  // Same-origin only, and only where the origin is knowable. This is not CSRF
  // protection in the usual sense — there is no session to ride — it stops
  // another site scripting this form so a visitor's browser sends mail on its
  // behalf. A missing Origin passes: non-browser clients do not send one.
  //
  // This compared the raw Origin against site.url and nothing else, which broke
  // the form for anyone on www: that hostname serves the site rather than
  // redirecting to the apex, so the browser sent an Origin the route refused,
  // and the visitor got "Bad origin." beside the button. Both names are the
  // site, so both belong here. Hosts are compared rather than strings, so a
  // trailing slash or an explicit port cannot cause the same outage twice.
  //
  // The workers.dev hostname is deliberately absent. It is a deployment
  // artefact rather than an address anyone should be using, and testing the
  // form there will meet this check by design.
  const origin = request.headers.get("origin");
  if (process.env.NODE_ENV === "production" && origin) {
    const allowed = new Set([SITE_HOST, `www.${SITE_HOST}`]);
    let originHost: string | null = null;
    try {
      originHost = new URL(origin).host;
    } catch {
      originHost = null;
    }

    if (!originHost || !allowed.has(originHost)) {
      return NextResponse.json({ ok: false, message: "Bad origin." }, { status: 403 });
    }
  }

  // cf-connecting-ip is written by Cloudflare and cannot be forged from
  // outside. x-forwarded-for can be: Cloudflare *appends* the client to that
  // chain rather than replacing it, so its left-most value is whatever the
  // sender chose to put there — which handed every request its own quota.
  const ip =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (await isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, message: "Too many messages just now. Try again shortly." },
      { status: 429 },
    );
  }

  let payload: Partial<ContactPayload>;
  try {
    payload = (await request.json()) as Partial<ContactPayload>;
  } catch {
    return NextResponse.json(
      { ok: false, message: "Malformed request." },
      { status: 400 },
    );
  }

  // JSON parses fine for `null`, `5` and `"text"`, and every field read below
  // assumes an object of strings. Without this, `{"website": 5}` threw a
  // TypeError outside any catch and the caller got a bare 500.
  if (payload === null || typeof payload !== "object" || Array.isArray(payload)) {
    return NextResponse.json({ ok: false, message: "Malformed request." }, { status: 400 });
  }

  // Honeypot filled in: pretend everything is fine and drop it silently.
  if (typeof payload.website === "string" && payload.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const errors = validateContact(payload);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { ok: false, message: "Please check the highlighted fields.", errors },
      { status: 422 },
    );
  }

  const clean = {
    name: payload.name!.trim(),
    company: payload.company?.trim() || "Not given",
    email: payload.email!.trim(),
    projectType: payload.projectType!,
    budget: payload.budget?.trim() || "Not given",
    timeline: payload.timeline?.trim() || "Not given",
    message: payload.message!.trim(),
  };

  // Trimmed on the way out of the environment. A trailing newline from pasting
  // a value into `wrangler secret put` is invisible in every dashboard and took
  // the form down for an afternoon: Resend answered 422 "Invalid `from` field",
  // which surfaced to visitors as "Could not send just now" and looked for all
  // the world like an outage on this side.
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.CONTACT_TO_EMAIL?.trim();
  const from = process.env.CONTACT_FROM_EMAIL?.trim();

  // Checked here rather than discovered at send time. The route validates the
  // sender's address carefully and never once looked at its own, so a
  // misconfigured value could only announce itself as a failed send — a 502
  // that reads as broken code rather than as a setting that wants fixing.
  const malformed = [
    ["CONTACT_FROM_EMAIL", from],
    ["CONTACT_TO_EMAIL", to],
  ].filter(([, value]) => value && !SENDER_PATTERN.test(value));

  if (!apiKey || !to || !from || malformed.length > 0) {
    // No secrets configured, or one of them cannot be used — the site still
    // runs, nothing is lost silently. Names only: the values are secrets, and
    // which one is wrong is the useful half anyway.
    console.warn(
      malformed.length > 0
        ? `[contact] Unusable address configuration: ${malformed
            .map(([name]) => name)
            .join(", ")}. Resend needs name@example.com or Name <name@example.com>. Inquiry received:`
        : "[contact] Resend is not configured (RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL). Inquiry received:",
      clean,
    );
    return NextResponse.json(
      {
        ok: false,
        message: `Email delivery is not set up yet. Please write to ${site.contact.email} directly.`,
      },
      { status: 503 },
    );
  }

  const notification = notificationEmail(clean);
  const confirmation = confirmationEmail(clean);

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    // Alvin's copy first, and on its own: it is the one that must not be lost.
    // Replies go to whoever wrote in, so answering is one keystroke.
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: clean.email,
      subject: notification.subject,
      html: notification.html,
      text: notification.text,
    });

    if (error) {
      console.error("[contact] Resend rejected the notification:", error);
      return NextResponse.json(
        {
          ok: false,
          message: `Could not send just now. Please write to ${site.contact.email} directly.`,
        },
        { status: 502 },
      );
    }

    // The sender's receipt. Best effort by design: the inquiry has already
    // landed in Alvin's inbox, so a bounced receipt is a logged annoyance, not
    // a failed submission — telling the sender to try again would only send
    // Alvin a duplicate. Replies come back to Alvin rather than to the sender.
    const receipt = await resend.emails
      .send({
        from,
        to: clean.email,
        replyTo: to,
        subject: confirmation.subject,
        html: confirmation.html,
        text: confirmation.text,
      })
      .catch((confirmationError: unknown) => ({ error: confirmationError }));

    if (receipt?.error) {
      console.error("[contact] Confirmation email failed:", receipt.error);
    }

    return NextResponse.json({ ok: true });
  } catch (sendError) {
    console.error("[contact] Unexpected failure:", sendError);
    return NextResponse.json(
      {
        ok: false,
        message: `Something broke on my side. Please write to ${site.contact.email} directly.`,
      },
      { status: 500 },
    );
  }
}
