/**
 * Where media is served from, and how the pre-generated stills are named.
 *
 * Every asset under /public/media is derived output from `npm run media`. In
 * production those same bytes live in an R2 bucket behind a custom domain, so
 * the site itself ships no imagery and Cloudflare serves it with zero egress
 * cost. Locally NEXT_PUBLIC_MEDIA_BASE_URL is empty and /public/media answers
 * instead — the paths are identical either way.
 */

/** No trailing slash, so `${BASE}${src}` is always well-formed. */
const BASE = (process.env.NEXT_PUBLIC_MEDIA_BASE_URL ?? "").replace(/\/+$/, "");

/**
 * Whether the origin serving media honours Range requests.
 *
 * R2 behind the custom domain does; the Worker's own static assets answer a
 * range with the whole file and no `Accept-Ranges`, so a browser cannot fetch
 * just a video header. Tied to BASE rather than set by hand: local development
 * and any build without the variable fall back to the safe behaviour instead of
 * promising streaming that is not there.
 */
export const MEDIA_SUPPORTS_RANGE = BASE !== "";

/**
 * Widths written for every still, smallest first.
 *
 * Keep in sync with IMAGE_WIDTHS in scripts/ingest-media.mjs and with
 * `images.deviceSizes` in next.config.ts. Anything wider than the last entry
 * is served by the full-size original.
 *
 * There used to be a 1600 step, and for the portrait crops that make up most of
 * the site it was a byte-for-byte copy of the original: MAX_EDGE caps the
 * *longest* edge, so a 2:3 still is already 1600 wide at full size. 120 of 138
 * pairs were identical — 44 MB carried in git, in the bucket and in every
 * backup for nothing.
 */
export const IMAGE_WIDTHS = [640, 1080] as const;

/**
 * The longest edge every still is capped to at ingest. MAX_EDGE in
 * scripts/ingest-media.mjs — keep the two the same.
 */
export const MEDIA_MAX_EDGE = 2400;

/**
 * The real pixel size of a full-size still, from its crop ratio.
 *
 * The cap is on the longest edge, not the width, which is the part that was got
 * wrong: metadata and structured data both assumed 1600 wide and so described a
 * 2400x1600 landscape as 1600x1067. Measured against the files, all 134 stills
 * hold to this — 2:3, 4:5 and 3:2, every one of them 2400 on its long side.
 *
 * Film posters are not stills and do not pass through here: they are written at
 * the video's own size, so their dimensions are known where they are used.
 */
export function fullSize(ratio: string | undefined) {
  const [w, h] = (ratio ?? "3/2").split("/").map(Number);
  if (!w || !h) return { width: MEDIA_MAX_EDGE, height: Math.round(MEDIA_MAX_EDGE * 0.625) };
  return w > h
    ? { width: MEDIA_MAX_EDGE, height: Math.round((MEDIA_MAX_EDGE * h) / w) }
    : { width: Math.round((MEDIA_MAX_EDGE * w) / h), height: MEDIA_MAX_EDGE };
}

/**
 * Points a /media path at whichever origin is serving it. Absolute URLs and
 * data URIs pass through untouched, so anything already carrying its own origin
 * is left alone.
 */
export function mediaUrl(src: string): string;
export function mediaUrl(src: string | undefined): string | undefined;
export function mediaUrl(src: string | undefined): string | undefined {
  if (!src || !BASE || !src.startsWith("/")) return src;
  return `${BASE}${src}`;
}

/** `/media/bts/01.jpg` + 640 → `/media/bts/01-640.jpg`. */
export function imageVariant(src: string, width: number): string {
  const dot = src.lastIndexOf(".");
  // No extension to split on: hand back the original rather than invent a path
  // that ingest never wrote.
  if (dot < 1) return src;
  return `${src.slice(0, dot)}-${width}${src.slice(dot)}`;
}
