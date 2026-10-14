"use client";

import { IMAGE_WIDTHS, imageVariant, mediaUrl } from "@/lib/media";

/**
 * Resolves a still to one of the widths `npm run media` already wrote.
 *
 * There is no image optimisation service behind this: Cloudflare Workers has
 * no equivalent of Vercel's optimiser, and Cloudflare Images costs money for
 * something sharp can do once at ingest. So next/image keeps its srcset and
 * lazy loading, and every URL it asks for is a file that exists.
 *
 * `quality` is deliberately ignored — it is baked in at encode time.
 */
export default function imageLoader({
  src,
  width,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  // Smallest width that still covers the request. Anything above 1080 falls
  // through to the full-size original, which for a portrait crop is the same
  // 1600-wide file the old variant used to duplicate.
  const variant = IMAGE_WIDTHS.find((candidate) => width <= candidate);
  return mediaUrl(variant ? imageVariant(src, variant) : src);
}
