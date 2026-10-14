import type { Metadata } from "next";
import { site } from "@/data/site";
import type { Media, Project } from "@/data/types";
import { fullSize, mediaUrl } from "@/lib/media";

/**
 * Per-page metadata that extends the root instead of replacing it.
 *
 * Next merges metadata *shallowly*: a page exporting `openGraph: { title }`
 * replaces the root's whole openGraph object, taking `siteName`, `locale`,
 * `url` and — the expensive one — the card image with it. That is why every
 * page except the home page shared as a bare line of text. So this restates the
 * inherited fields on every page rather than trusting the merge, and sets the
 * canonical URL, which no page had at all.
 */

/** Fallback card: the frame the showreel opens on, already 16:9 for a card. */
const DEFAULT_IMAGE = {
  url: mediaUrl(site.showreel.poster),
  width: 1920,
  height: 1080,
  alt: site.showreel.alt,
};

export type CardImage = {
  url: string;
  width: number;
  height: number;
  alt: string;
};

/** Width and height of a generated still at `width`, from its crop ratio. */
function sizeAt(media: Media, width: number) {
  const [w, h] = (media.ratio ?? "3/2").split("/").map(Number);
  if (!w || !h) return { width, height: Math.round(width * 0.625) };
  return { width, height: Math.round((width * h) / w) };
}

function isLandscape(media: Media) {
  const [w, h] = (media.ratio ?? "3/2").split("/").map(Number);
  return Boolean(w && h) && w > h;
}

/**
 * The share card for one project.
 *
 * Covers are 4:5 and every preview crops a portrait image to a letterbox, so a
 * landscape still from the gallery wins when the project has one. Films are the
 * last resort rather than the first: their posters are written at the video's
 * own size with no width variants, so a vertical film means a vertical card.
 */
export function cardImageFor(project: Project): CardImage {
  const still =
    project.gallery.find((media) => media.kind === "image" && isLandscape(media)) ??
    (project.cover.kind === "image" ? project.cover : undefined) ??
    project.gallery.find((media) => media.kind === "image");

  if (still) {
    // The full-size file, not a variant: the widest variant is 1080 now, and a
    // share card wants the biggest thing we have. Its size comes from the
    // longest edge — passing 1600 as the width told every landscape still it
    // was 1600x1067 when the file on disk is 2400x1600.
    const { width, height } = fullSize(still.ratio);
    return { url: mediaUrl(still.src), width, height, alt: still.alt };
  }

  const poster = project.cover.poster;
  if (poster) {
    return { url: mediaUrl(poster), ...sizeAt(project.cover, 1080), alt: project.cover.alt };
  }

  return DEFAULT_IMAGE;
}

type PageMetadataInput = {
  /** Goes through the root's `%s | Alvin Creatives` template. */
  title: string;
  /**
   * Title for the share card and the browser tab when the name is already in
   * it. A case study sets this so the tab does not read
   * "BMW | Hedin Automotive | Alvin Creatives".
   */
  absoluteTitle?: string;
  /** Shown on the card and in search results. Falls back to the site's own. */
  description?: string;
  /**
   * Site-relative, leading slash. "/" for the home page, never "". `null` for a
   * page that has no address of its own — the 404, which is rendered at
   * whatever URL was mistyped and so cannot honestly claim to be canonical.
   */
  path: string | null;
  image?: CardImage;
  type?: "website" | "article";
  /** Pages that exist but should not be indexed, like 404. */
  index?: boolean;
};

export function pageMetadata({
  title,
  absoluteTitle,
  description = site.description,
  path,
  image = DEFAULT_IMAGE,
  type = "website",
  index = true,
}: PageMetadataInput): Metadata {
  // `metadataBase` resolves the canonical, but openGraph.url is written out in
  // full because some crawlers read it without resolving anything.
  const url = path === null ? undefined : path === "/" ? site.url : `${site.url}${path}`;
  const cardTitle = absoluteTitle ?? `${title} | ${site.name}`;
  const images = [{ url: image.url, width: image.width, height: image.height, alt: image.alt }];

  return {
    title: absoluteTitle ? { absolute: absoluteTitle } : title,
    description,
    // `null`, not a missing field: leaving `alternates` out let the 404 inherit
    // the root's `canonical: "/"` and claim to be the home page. The type is
    // `null | string | URL | AlternateLinkDescriptor`, and null is how Next
    // cancels an inherited value rather than replacing it.
    alternates: { canonical: path },
    openGraph: {
      type,
      siteName: site.name,
      title: cardTitle,
      description,
      ...(url ? { url } : {}),
      locale: "en_GB",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: cardTitle,
      description,
      images,
    },
    ...(index ? {} : { robots: { index: false, follow: true } }),
  };
}
