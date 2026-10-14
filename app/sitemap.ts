import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { categories, projects } from "@/data/projects";
import { mediaUrl } from "@/lib/media";

/**
 * No `lastModified` anywhere, on purpose.
 *
 * It used to be `new Date()` on every entry, evaluated per request, which told
 * every crawl that all eighteen pages had changed seconds ago. A date that is
 * always now is worse than no date: it is a claim, it is false, and a crawler
 * that learns to distrust it discounts the whole file.
 *
 * The honest alternative needs a real per-project date, and there is none:
 * file timestamps say when the media was last re-encoded, not when the work was
 * published, and dating the work was deliberately dropped. So the entries carry
 * what is true — the URL, and the images and films on it. Add a date field to
 * `Project` and this can use it.
 */
/**
 * A sitemap entry has to be an absolute URL, and `mediaUrl()` hands back the
 * path untouched when no media origin is set — which is every local build. That
 * produced a silently invalid file, so the origin is filled in here.
 */
function absolute(path: string) {
  const url = mediaUrl(path);
  return url.startsWith("http") ? url : `${site.url}${url}`;
}

/**
 * Next interpolates these strings straight into the XML without escaping a
 * single character — see `resolveSitemap` in
 * `next/dist/build/webpack/loaders/metadata/resolve-route-data.js`. So a title
 * like "HYROX & Stan Browney" emits a bare `&`, which in XML opens an entity
 * that never closes: the parser stops at that line and every URL after it is
 * lost. Google rejects the file outright.
 *
 * Escaping here is safe precisely because Next escapes nothing; there is no
 * second pass to double-encode it. `&` has to go first, or it would re-escape
 * the ampersands the later replacements just introduced.
 */
function xml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/work", "/behind-the-scenes", "/about", "/contact"].map(
    (path) => ({
      url: xml(`${site.url}${path}`),
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.8,
    }),
  );

  // The category pages exist now, so they belong here — a page nothing points
  // at and nothing announces may as well not exist.
  const categoryRoutes = categories.map((category) => ({
    url: xml(`${site.url}/work/category/${category.slug}`),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const projectRoutes = projects.map((project) => {
    const media = [project.cover, ...project.gallery];

    return {
      url: xml(`${site.url}/work/${project.slug}`),
      changeFrequency: "yearly" as const,
      priority: 0.6,
      // Every still and film was invisible to image and video search until now.
      images: media
        .filter((item) => item.kind === "image")
        // The original, not a variant: image search wants the largest file,
        // and 1600 is no longer a width we write.
        .map((item) => xml(absolute(item.src))),
      // snake_case, not camelCase: these keys go straight into the XML, and
      // Next drops the whole block without a word if they are spelled wrong.
      videos: media
        .filter((item) => item.kind === "fileVideo" && item.poster)
        .map((item) => ({
          title: xml(project.title),
          description: xml(item.alt),
          thumbnail_loc: xml(absolute(item.poster!)),
          content_loc: xml(absolute(item.src)),
        })),
    };
  });

  return [...staticRoutes, ...categoryRoutes, ...projectRoutes];
}
