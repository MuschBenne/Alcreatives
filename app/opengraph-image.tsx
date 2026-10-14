import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = `${site.name} | ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Static fallback social card. Kept type-only and monochrome so it matches the
 * site; swap in a real still once Alvin's imagery lands by replacing this file
 * with app/opengraph-image.jpg.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(120% 100% at 20% 0%, #1a1a1a 0%, #0f0f0f 45%, #0a0a0a 100%)",
          color: "#F5F4F2",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#8A8A8A",
          }}
        >
          {site.contact.location}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* Matches the Wordmark lockup: uppercase, wide tracking, no mark. */}
          <div
            style={{
              display: "flex",
              fontSize: 78,
              letterSpacing: 10,
              textTransform: "uppercase",
              lineHeight: 1,
            }}
          >
            {site.name}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: 34,
              color: "#8A8A8A",
              maxWidth: 820,
              lineHeight: 1.3,
            }}
          >
            {site.tagline}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
