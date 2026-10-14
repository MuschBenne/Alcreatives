# What was settled with Alvin

Fourteen projects are live, along with the showreel, the capability and intro
stills, and nine client logos. The contact form emails you, media streams from
R2, and the site is deployed.

**Nothing is outstanding.** The last open item — more behind-the-scenes material
— was closed on 2026-09-18: the page runs on eight frames and that is enough.
More would still slot straight in, through the BTS block in
`scripts/media-manifest.mjs` and `data/bts.ts`, the day Alvin wants to send some.

**Two things are deliberately absent**, decided rather than forgotten. A real
portrait for About: it keeps running a behind-the-scenes frame, and the alt text
says so, describing a camera rather than a person. And a date per project: the
`year` field is gone entirely now, so the sitemap carries no `lastmod` and the
films are described without `VideoObject`, which requires an upload date.

## 1. Decisions, made

- **The showreel stays at 1080p.** A 720p mobile version would save roughly 60%
  of the bandwidth on a phone, but this is a photography and film company and
  the hero is the first thing anyone sees. Quality wins over the saving.
- **Vimeo and Mux are gone**, along with the provider flag. The showreel plays
  from R2, which answers Range requests and streams it properly, and that was
  the only reason an escape hatch existed.
- **No year per project.** The field has been removed rather than left empty.

## 2. Copy

The wording on the site is mine rather than yours, and you have decided to keep
it as it stands, so the `DRAFT` markers are gone from the code. If you ever want
to rewrite, these are the strings:

| Item | Where it lives |
| ---- | -------------- |
| Positioning line — "Sports, cars, products and commercial work." | `site.tagline` |
| Hero headline — "Stills that move." | `components/sections/Hero.tsx` |
| Hero line, intro paragraph, approach | `site.heroLine`, `site.intro`, `site.about.approach` |
| Project titles and summaries — drafted from the images, so worth checking I have not misnamed a shoot | `data/projects.ts` |

The About bio and heading are your own words.

**Client names:** all sixteen are cleared by you, including Burberry, Dolce &
Gabbana, Valentino and Celsius, which came through the Ludwig Blomqvist work.
That decision is recorded in `data/clients.ts`.

**Hedin's BMW set is two projects now, and the campaign copy is gone.** Split on
2026-09-18 on Alvin's instruction: Hedin Automotive keeps the black 120 and its
three films, BMW Sverige keeps the red M2. The five stills that carried campaign
lockups across the frame were replaced by his clean re-edits of the same shoot;
the X5 and the showroom interior went with them, being campaign furniture rather
than pictures of the car.

## 3. Accounts — done

`RESEND_API_KEY`, `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL` are set as Worker
secrets, confirmed on 2026-09-17. The form can email you.

Worth knowing if it ever stops working: production reads Worker secrets first,
so `npx wrangler secret put <NAME>` is how you change one — it prompts for the
value, stores it encrypted and needs no redeploy, since secrets are read per
request. The Resend sending domain also has to stay verified, or Resend refuses
the send however right the key is.

**`.env.local` is not as local as its name suggests.** The OpenNext adapter
merges `.env`, `.env.{mode}` and `.env.local` into the Worker bundle it deploys,
so whatever sits there ships to production inside the script. For the mail keys
that is harmless — the real Worker secret is written first and wins, so rotating
one still works. It was not harmless for the Cloudflare API token, which is not
a Worker secret and had nothing shadowing it, so it lived in the deployed script
as a working credential. It now sits in `.env.tooling`, which git ignores under
the same rule and neither the adapter nor Next reads.

If all three were missing the form would still validate, rate-limit and log
every inquiry, then tell people to email directly — nothing lost, but nothing
delivered.

## 4. Where the media lives now

`public/media` is around 559 MB across 537 files, and production does **not**
serve it from the deploy. It is uploaded to an R2 bucket behind
`media.alcreatives.com` under a versioned prefix — `/v4` today, and `/v3` was
deleted on 2026-09-18 once the site was verified on the new one — which, unlike
Workers static assets, answers Range requests, so video streams instead of
downloading whole.

The folder stays in Git because the camera originals are gitignored, which makes
this the only copy a fresh clone can rebuild from.

One rule comes with that: re-encoding a file that is already uploaded means
bumping the prefix first. Every object is served immutable for a year, so
overwriting in place would leave anyone who has already visited on the old file.
The reason and the exact commands are in `public/media/README.md`.

All copy on the site is in English. Say the word and I'll switch the whole thing
to Swedish, or set it up bilingual.
