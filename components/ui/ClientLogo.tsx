"use client";

import { useState } from "react";
import type { Client } from "@/data/types";
import { mediaUrl } from "@/lib/media";

/**
 * How much height a logo gives up for being wide. At 0 every logo shares one
 * height, so a long wordmark runs ten times the width of a square mark; at 0.5
 * they share one area, which leaves the longest wordmarks too thin to read.
 */
const WIDTH_PENALTY = 0.4;

/**
 * Renders the client's logo file when it exists and a clean wordmark when it
 * does not, so the marquee looks finished before any SVG has been delivered.
 */
export function ClientLogo({ client }: { client: Client }) {
  const [failed, setFailed] = useState(false);

  if (!client.logo || failed) {
    return (
      <span className="font-display text-lg tracking-tight text-muted transition-colors duration-500 hover:text-ink md:text-2xl">
        {client.name}
      </span>
    );
  }

  const { src, width, height } = client.logo;
  const scale = (width / height) ** -WIDTH_PENALTY;

  return (
    // eslint-disable-next-line @next/next/no-img-element -- logos are small SVGs, no optimisation needed
    <img
      src={mediaUrl(src)}
      alt={client.name}
      width={width}
      height={height}
      loading="lazy"
      onError={() => setFailed(true)}
      style={{ height: `calc(var(--logo-size) * ${scale.toFixed(3)})` }}
      className="w-auto opacity-55 transition-opacity duration-500 [--logo-size:2.25rem] hover:opacity-100 md:[--logo-size:3rem]"
    />
  );
}
