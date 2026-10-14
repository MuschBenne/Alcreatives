> **Portfolio copy:** the generated media (~560 MB of client photo and film) is not
> included here. Production serves it from Cloudflare R2 via
> `NEXT_PUBLIC_MEDIA_BASE_URL` in `.env.production`, so the site still renders
> its media when run from this repo.

# /public/media

**Everything in here is generated. Do not edit these files by hand.**

`scripts/ingest-media.mjs` reads the camera originals in `hemsida material/`
(gitignored) and writes this folder. Delete the folder, re-run, and you get the
same bytes back.

```bash
npm run media             # process anything that is missing
npm run media -- --force  # re-encode everything
```

## Re-encoding an existing file? Bump the prefix first

Production serves this folder from R2, not from the deploy, and every object
goes out as `immutable` for a year. Filenames are not content-hashed, so
re-encoding a file that is already uploaded and putting it back at the same
address means anyone who has already loaded it keeps the old bytes for up to a
year — the new version simply never reaches them.

So whenever `npm run media` changes bytes that are already live:

```bash
# 1. bump the prefix in .env.production: /v3 -> /v4
# 2. copy the old prefix across server-side — no bandwidth, about two minutes
npm run r2 copy r2:alvin-media/v3 r2:alvin-media/v4
# 3. upload only what actually changed
npm run r2 copy public/media r2:alvin-media/v4/media \
  --exclude ".DS_Store" --exclude "*.md" --transfers 16 --progress
npm run r2 check public/media r2:alvin-media/v4/media --one-way
# 4. npm run deploy
```

Adding new files is safe at the current prefix — nothing has cached an address
that did not exist. It is only overwriting that needs the bump.

### Leave the old prefix alone for a week

This is the part that was learned the hard way, on 2026-09-18. The old prefix was
deleted a few hours after the switch, on the reasoning that the live site had
been verified on the new one. That was the wrong thing to check.

A visitor who loaded a page before the switch is holding HTML that points at the
old prefix. Deleting it turns every image on their page into the "Awaiting
asset" placeholder — the site looks broken to them while looking perfect to
everyone testing it. That is exactly what happened: a friend of Alvin's opened
the site and the About portrait was a placeholder.

The document itself is not cached hard — it goes out with no `max-age`, no
`etag` and no `last-modified`, so a browser refetches it on the next visit. But
`stale-while-revalidate` is thirty days, and an open tab is unbounded. The
window is real even if it is usually short.

So: **wait a week before deleting the old prefix.** It costs a few hundred MB
against a 10 GB free allowance, which is nothing next to a prospective client
seeing a broken page.

```bash
npm run r2 purge r2:alvin-media/v3    # a week after the deploy, not the same day
```

## Changing what the site shows

1. Put the new original somewhere under `hemsida material/`.
2. Add or edit its line in `scripts/media-manifest.mjs` — source path, output
   path, and the crop ratio.
3. `npm run media`
4. Update the matching entry in `data/projects.ts` (or `data/site.ts`) so the
   `ratio` and the `alt` text still describe the file.

Steps 2 and 4 both carry a `ratio`. They have to agree or the frame letterboxes.

## What lives where

```
media/
  hero/
    showreel.mp4          full-viewport hero film (muted, loops)
    hero-poster.jpg       grabbed from the film, shown while it loads
  intro/
    still-01.jpg          4:5 — the portrait beside the Approach text
    still-02.jpg … 04.jpg 2:3 — the three across below it
                          the wide frame there is a project still, not an intro one
  capabilities/
    automotive.jpg  motion.jpg  product.jpg      4:5 each
  about/
    portrait.jpg          4:5
  bts/
    01.jpg … 08.jpg       2:3 — the Behind the scenes page
  clients/
    *.png                 white silhouettes, generated from the LOGOS folder
  projects/<slug>/
    cover.jpg             4:5 — the shape the work grid expects
    01.jpg … NN.jpg       2:3 stills, with the occasional 3:2 for rhythm.
                          How many depends on the case: eight for the Hedin
                          BMW, seventeen for the Countryman
    cover.mp4 + cover-poster.jpg      when the cover is a film
    film-01.mp4 … film-NN.mp4         gallery films, each with its own poster
```

## Rules the script already follows

- **Stills**: JPG, longest edge 2400px, cropped from the centre unless the entry
  sets `position`. Each one is written at 640 and 1080 beside the full-size
  copy; `lib/image-loader.ts` picks between them and there is no optimisation
  service, so every URL `next/image` asks for is a file that exists.
- **Video**: H.264, no audio track, `+faststart`. Sizes are set per entry in
  `scripts/media-manifest.mjs` — the hero is 1920×1080, vertical films are
  1080×1920. There is no hosted-player escape hatch any more: Mux and Vimeo and
  the `NEXT_PUBLIC_VIDEO_PROVIDER` flag were all removed on 2026-09-17, because
  R2 answers Range requests and streams these properly on its own.
- **Posters**: one per video, always. It is what shows before playback starts.
- **Logos**: flattened to white so they survive the dark palette. BMW is the
  exception — flattening the roundel would turn it into a white disc.

## Missing files

Anything absent renders a quiet labelled placeholder naming the file it wants,
so a partial delivery never breaks a page.
