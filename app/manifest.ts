import type { MetadataRoute } from "next";
import { site } from "@/data/site";

/**
 * Makes the site installable and, more usefully here, tells a phone what to
 * paint around it when someone saves it to their home screen. The colours are
 * the same two the `viewport` export in app/layout.tsx already declares.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.tagline}`,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0A0A0A",
    theme_color: "#0A0A0A",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
