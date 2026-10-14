# Alvin Creatives

Portfolio site for Alvin Creatives — a Sweden based photographer and filmmaker
working across sports, cars, products and commercial work. Near-black,
media-first, built so the work carries the page and the interface stays quiet.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Motion ·
Lenis · Resend · Cloudflare Workers.

---

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
npm run check    # eslint + tsc --noEmit — the gate CI runs on every push
```

No environment variables are required to run or build. The site works with
zero secrets — the contact form simply asks people to email directly until
Resend is configured.

---

## Content lives in `data/`, not in components

Nothing about the work is hardcoded in JSX. To update the site, edit:

| File               | What it controls                                                |
| ------------------ | --------------------------------------------------------------- |
| `data/site.ts`     | Name, tagline, hero line, bio, capabilities, email, location, socials, showreel source |
| `data/projects.ts` | Every project: title, client, category, cover, gallery, summary |
| `data/clients.ts`  | The logo marquee                                                 |
| `data/types.ts`    | The shapes above (`Project`, `Media`, `Client`)                   |

The one stand-in left is the About portrait, which runs a behind-the-scenes
frame rather than a photograph of Alvin — a decision rather than a gap, and the
alt text describes the camera it actually shows. `ASSETS-NEEDED.md` carries that
reasoning along with everything else that was settled.

### Adding a project

1. Add an object to `projects` in `data/projects.ts`.
2. Create `public/media/projects/<slug>/` and drop the files in.
3. Set `featured: true` for it to appear in **Selected work** on the home page
   (the home grid shows the first six featured projects).

The case study page, `/work` filters, sitemap and prev/next navigation all
follow automatically from the array.

---

## Media

See [`public/media/README.md`](public/media/README.md) for the exact folder
layout and file names, plus compression guidance.

**In production this folder is not served by the Worker.** It is uploaded to an
R2 bucket behind `media.alcreatives.com` under a versioned prefix, which —
unlike Workers static assets — answers Range requests, so video streams instead
of downloading whole. `npm run deploy` drops the folder from the deploy for that
reason. `mediaUrl()` in `lib/media.ts` is the single switch: empty
`NEXT_PUBLIC_MEDIA_BASE_URL` (local) serves from disk, a value (production,
committed in `.env.production`) serves from R2.

`npm run r2` wraps rclone against the bucket, deriving its S3 credentials from
`CLOUDFLARE_API_TOKEN` in `.env.tooling` on every run, so no keys are stored:

```bash
npm run r2 lsf r2:alvin-media --dirs-only        # which prefixes exist
npm run r2 size r2:alvin-media/v3/media          # objects and bytes
npm run r2 check public/media r2:alvin-media/v3/media --one-way
```

Re-encoding a file that is already uploaded means bumping the prefix first —
the reason, and the exact commands, are in `public/media/README.md`.

**Missing files are safe.** Every image and video renders through
`components/media/MediaFrame.tsx`, which falls back to a quiet on-brand
placeholder naming the file it is waiting for. That is how the site can look
finished before a single asset exists — and how you can see at a glance what is
still outstanding.

### Where the hero video comes from

`public/media/hero/showreel.mp4`, served from R2 like everything else under
`/media`.

There used to be a `NEXT_PUBLIC_VIDEO_PROVIDER` flag choosing between the file,
Mux and Vimeo. All three are gone. Mux shipped about a megabyte of client
JavaScript for a player nothing used; Vimeo was the escape hatch for a showreel
too heavy to self-host, and R2 answers Range requests, so the file streams
properly and there is nothing to escape. Moving the hero to a hosted player
later means adding a branch back, not flipping a flag.

### Stills are resized once, not per request

Workers has no image-optimisation service, so `npm run media` writes each still
at 640 and 1080 px beside the full-size copy, and `lib/image-loader.ts` points
`next/image` at whichever one fits — anything above 1080 gets the original. The
built HTML contains no `/_next/image` URLs at all.

There was a 1600 step until it turned out to be a duplicate: the full-size copy
caps the *longest* edge at 2400, so a portrait crop is already 1600 wide and the
variant was the same file written twice. 120 of 138 pairs were byte-identical,
50 MB carried in git and in the bucket for nothing.

The widths are declared in three places that must agree: `IMAGE_WIDTHS` in
`lib/media.ts`, the same constant in `scripts/ingest-media.mjs`, and
`images.deviceSizes` in `next.config.ts`. Change one, change all three, then
re-run `npm run media -- --force`.

---

## Environment variables

Copy `.env.example` to `.env.local` for local work, and add the same keys under
**Workers & Pages → alvin-hemsida → Settings → Variables and Secrets**. The
mail keys are secrets; everything else is a plain variable.

**Credentials for the tooling go in `.env.tooling` instead**, which is what
`scripts/r2.sh` and `scripts/purge-cache.mjs` read. The reason is not taste: the
OpenNext adapter merges `.env`, `.env.{mode}` and `.env.local` into the Worker
bundle it deploys, so anything in `.env.local` ships to production inside the
script. A Worker secret of the same name is written first and wins at runtime,
which covers the mail keys — but `CLOUDFLARE_API_TOKEN` is not a Worker secret,
so nothing shadowed it and it travelled as a working credential. `.env.tooling`
is ignored by git under the same `.env*` rule and read by neither the adapter
nor Next.

`CLOUDFLARE_ZONE_ID` can go in the same file, and is worth setting: without it
`purge-cache.mjs` lists the account's zones to find the id, which needs
**Zone → Zone → Read** on the token — a permission whose name is just "Zone",
which makes it hard to find in the dashboard. With the id set there is no
lookup, so the token only needs R2 **Object Read & Write** and **Cache Purge**.
The zone id is not a secret; it is on the domain's Overview page.

| Variable                     | Required | Purpose                                          |
| ---------------------------- | -------- | ------------------------------------------------ |
| `RESEND_API_KEY`             | for mail | API key from resend.com                          |
| `CONTACT_TO_EMAIL`           | for mail | Where inquiries land                             |
| `CONTACT_FROM_EMAIL`         | for mail | Verified sender on a domain you own in Resend    |
| `NEXT_PUBLIC_MEDIA_BASE_URL` | no       | Serve `/media` from another origin; empty = ship with the Worker |

Without the three mail variables the form returns a friendly "email me
directly" message and logs the full submission server-side, so nothing is lost.

---

## Contact form

`components/contact/ContactForm.tsx` → `POST /api/contact`
(`app/api/contact/route.ts`).

- Validation rules are shared by client and server in `lib/contact.ts`.
- A hidden honeypot field drops bot submissions silently.
- In-memory rate limit: 5 submissions per IP per 10 minutes. It is per-instance,
  which is fine at this volume; move it to Upstash Redis if that ever changes.
- One submission sends **two** emails, both built in `lib/contact-emails.ts`:
  - **To Alvin** — every field plus the message. `replyTo` is the sender, so
    hitting reply answers them directly. If this one fails the form says so and
    the submission is logged.
  - **To the sender** — a receipt repeating what they submitted, with the
    one-working-day expectation. `replyTo` is Alvin. Best effort: the inquiry
    has already landed, so a bounced receipt is logged, not surfaced — asking
    someone to resubmit would only send Alvin the same inquiry twice.

---

## Design notes

- Tokens live in `app/globals.css` (`@theme`): `bg #0A0A0A`, `surface #111111`,
  `ink #F5F4F2`, `muted #8A8A8A`, hairline `rgba(245,244,242,0.10)`.
- Type: Clash Display (display) and Satoshi (UI), self-hosted from `app/fonts/`
  via `next/font/local` — no external font request.
- Utility classes `type-hero`, `type-display`, `type-headline`,
  `type-statement`, `type-label`, `type-body` carry the whole type scale; they
  are fluid, so the large type scales down cleanly on a phone.
- `.shell` is the standard page gutter.
- Motion: Lenis smooth scroll, on-scroll reveals via `components/ui/Reveal.tsx`,
  hero parallax, hover-to-play covers.
- Reduced motion is handled in two places, and the split matters. Anything that
  only *looks* animated is neutralised by a `[data-reveal]` rule in
  `app/globals.css`, so the markup stays identical for everyone — branching on
  the media query during render made the server and the browser disagree, and
  React threw away the server render to reconcile it. Where the preference
  changes *behaviour* (hero parallax, grid layout animations, video autoplay),
  components read `lib/use-reduced-motion.ts`, whose server snapshot is false so
  hydration still matches.

---

## Deploy

Pushing to `main` deploys. Cloudflare Workers Builds watches the repo and runs:

```bash
npx opennextjs-cloudflare build   # build command
npx wrangler deploy               # deploy command
```

The build command must not be `npm run build` — the adapter calls that itself
to build Next, so pointing it back at the adapter would recurse forever.

To deploy by hand instead:

```bash
npm run preview   # build and run it on the Workers runtime locally
npm run deploy    # build and push it live
```

`npm run deploy` builds, then runs `scripts/check-media-origin.mjs`, then drops
`public/media` from the bundle, then deploys. The check is not ceremony: the
media origin is inlined at build time, `.env.local` outranks `.env.production`
even in a production build, and dropping the folder without that value baked in
would 404 every image and video with no fallback. It reads the built output
rather than the environment, because only the build proves the value landed.

`wrangler.jsonc` holds the Worker config. Analytics is Cloudflare Web Analytics,
enabled per zone in the dashboard — there is no script in the app.

### Why there is no Cache Rule for the HTML

Prerendered pages still pass through the Worker, which costs a cold start on
roughly one request in ten. The obvious fix — a Cache Rule in the Cloudflare
dashboard — does not work here, and it is worth writing down why, because the
rule looks like it should.

**Cloudflare runs Workers before the edge cache.** A Cache Rule never sees a
request the Worker answers itself, so it cannot cache a page this site
generates. Measured on the live site: `/_next/static/*.js` and `/favicon.ico`
come back `cf-cache-status: HIT`, while every HTML page carries no such header
at all — assets are served by Workers Assets, pages by the script. Cloudflare's
own docs put it plainly: with the whole project on Workers, the Cache API is
the only way to cache what the Worker returns.

So the caching lives in `open-next.config.ts` instead, as cache interception
over an incremental cache read from Workers Static Assets. A prerendered route
is answered without starting NextServer, which is the cold start the rule was
meant to remove. Nothing needs provisioning, and it is read-only: the day a
route starts revalidating, that override has to become the R2 or KV one.

**The purge still matters.** The origin sends `s-maxage=31536000`, so anything
that *is* cached at the edge — the assets — may be held for a year.
`npm run deploy` ends with `scripts/purge-cache.mjs`, which clears the zone and
needs an API token with Zone → Cache Purge. Media is unaffected: it is served
from R2 under a versioned prefix, so new bytes arrive at a new URL.

### Why Cloudflare

Vercel's Hobby plan does not permit commercial sites, and this one is a
business. Cloudflare's free tier has no such restriction. Requests to static
assets are free and unmetered, so only `/api/contact` — the single dynamic
route — draws on the Worker request budget.

---

## What was settled with Alvin

Nothing is outstanding from him. [`ASSETS-NEEDED.md`](ASSETS-NEEDED.md) records
what was decided and why — the stand-in portrait, no date per project, the
showreel staying at 1080p, all sixteen client names cleared — so whoever reads
this in a year finds the reasoning instead of guessing at it.

---

## Handover

**Everything is already in Alvin's name.** Verified against the Cloudflare API on
2026-09-18: the account is `Alvincreatives@outlook.com's Account`, the zone
`alcreatives.com` is active on it, and the repository lives under the
`ALcreatives` GitHub organisation. Nothing runs on the builder's account, so
nothing stops working if he steps away.

### What costs money, and to whom

| Thing | Where | Note |
| ----- | ----- | ---- |
| Domain | wherever `alcreatives.com` is registered | renews annually |
| Cloudflare | free tier | Workers, Pages, the zone, and R2 within its free allowance |
| Resend | free tier | the contact form; the sending domain must stay verified |

R2 holds about 560 MB against a 10 GB free allowance, so there is room to grow.
Requests to static assets are free and unmetered; only `/api/contact` draws on
the Worker budget.

### Deploying from a different machine

Clone the repo, `npm install`, then create `.env.tooling` with two values:

```
CLOUDFLARE_API_TOKEN=...
CLOUDFLARE_ACCOUNT_ID=...
```

That is all `npm run deploy` needs. The mail keys are Worker secrets and already
live on Cloudflare — `npx wrangler secret list` shows `RESEND_API_KEY`,
`CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL` without revealing their values.

A replacement API token needs exactly four permissions, each one confirmed
necessary the hard way: **Account → Workers Scripts: Edit** (the deploy itself),
**Account → R2 Storage: Edit** (`npm run r2`), **Zone → Cache Purge** (the last
step of the deploy) and **Zone → Zone: Read** — or skip that last one by adding
`CLOUDFLARE_ZONE_ID` to the same file. Set Zone Resources to include
`alcreatives.com`, or the zone permissions match nothing and fail silently.

### Pushing to GitHub does not deploy, on purpose

A Cloudflare Workers Builds connection was attached to this repository from the
start and was disconnected on 2026-09-18. It had never once deployed the site:
of the thirty Worker versions at that point, twenty-seven came from `wrangler`
on a developer's machine and three from the dashboard. It failed silently for a
month, then failed loudly when the API token was rotated and its build token
went with it.

It was removed rather than repaired, because a generic build would not produce
this site. `npm run deploy` does four things in order that matter:

1. builds with `NEXT_PUBLIC_MEDIA_BASE_URL` inlined from `.env.production`,
2. runs `scripts/check-media-origin.mjs` against the *built output* to prove the
   media origin actually landed,
3. deletes `public/media` from the bundle, because R2 serves it — around 560 MB
   that would otherwise be uploaded as Worker assets,
4. deploys, then purges the edge cache.

A build that skips step 3 uploads half a gigabyte it should not, and one that
skips step 2 can publish a site where every image is a 404. So deploys are
deliberate and local: `npm run deploy`, from a machine with `.env.tooling`.

Wanting push-to-deploy back is reasonable, but it is real work — that whole
chain has to be reproduced in Cloudflare's build environment with its own
credentials. It is not a checkbox.

### What is not in git

`public/media` **is** committed, all 560 MB of it, so a fresh clone builds and
deploys a complete site. These are not:

- `hemsida material/` — 3.4 GB of camera originals, and the only copy is on the
  machine this was built on. Everything under `public/media` is derived from it
  by `npm run media`. Without it the site still runs, but no frame can be
  re-cropped, re-encoded or added. **Alvin should hold his own copy.**
- `.env.tooling`, `.dev.vars`, `.env.local` — all recreatable: the Cloudflare
  token from the dashboard, the Resend key by rotating it with
  `npx wrangler secret put RESEND_API_KEY`.

### Analytics

Cloudflare Web Analytics, with the beacon added by hand in `app/layout.tsx`
rather than left to auto-install, which was enabled and still delivered no
beacon. The token in that snippet is public by design. Traffic shows up under
the zone in the Cloudflare dashboard.

### Two rules that live in the dashboard, not in this repo

Written down because nothing in the code hints at them, and in a year the
question "why does it do that" gets asked here rather than in a browser tab.

**www redirects to the apex.** A Redirect Rule on the zone: hostname equals
`www.alcreatives.com`, dynamic redirect to
`concat("https://alcreatives.com", http.request.uri.path)`, 301, query string
preserved. Before it existed both hostnames served the site as separate origins,
which is what broke the contact form for anyone on www — the origin check only
accepted the apex. The route accepts both names now, so this rule is tidiness
rather than load-bearing, but without it every page has two addresses.
Verified: one hop, path and query intact, and the apex does not redirect.

**Rate limiting on `/api/contact`.** A WAF rate limiting rule on the zone,
counting by IP. It sits in front of the Worker, so a blocked request costs
nothing. On the free plan the window and the block are both ten seconds, which
stops a burst but lets a slow drip through — which is why the Worker also has
its own limiter, the `CONTACT_RATE_LIMITER` binding in `wrangler.jsonc`, at five
per sixty seconds. The two layers catch different shapes of abuse.

### Before the site is really finished

Register it in Google Search Console and submit `/sitemap.xml`. The property
should be created from Alvin's own Google account so he owns it; verification is
a DNS TXT record on the zone, which anyone with Cloudflare access can add.
