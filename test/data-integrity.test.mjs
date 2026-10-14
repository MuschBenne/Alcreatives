import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";

import { projects } from "../data/projects.ts";
import { behindTheScenes } from "../data/bts.ts";
import { site } from "../data/site.ts";
import { clients } from "../data/clients.ts";
import { IMAGE_WIDTHS } from "../lib/media.ts";

/**
 * Guards the one failure this site actually has: data and files drifting apart.
 *
 * Every image and film is referenced by a hand-written path in data/, and
 * MediaFrame answers a missing file with a quiet "Awaiting asset" placeholder.
 * That is the right behaviour for a half-delivered shoot and the wrong one for
 * a typo — the page still renders, nothing throws, and nobody finds out until
 * someone looks at the live site. So the check belongs here rather than in a
 * component.
 *
 * Runs on the file tree, not the bucket. `npm run r2 check` is what compares
 * the tree to what is deployed.
 */

const ROOT = new URL("../public/media/", import.meta.url).pathname;

const variantPath = (src, width) => {
  const ext = path.extname(src);
  return `${src.slice(0, -ext.length)}-${width}${ext}`;
};

/** Every Media object on the site, with a label naming where it came from. */
function allMedia() {
  const found = [];
  for (const project of projects) {
    found.push({ media: project.cover, where: `${project.slug} cover` });
    project.gallery.forEach((media, index) =>
      found.push({ media, where: `${project.slug} gallery[${index}]` }),
    );
  }
  behindTheScenes.forEach((media, index) =>
    found.push({ media, where: `bts[${index}]` }),
  );
  site.capabilities.forEach((capability) =>
    found.push({
      media: { kind: "image", ...capability.image },
      where: `capability ${capability.title}`,
    }),
  );

  // The three that used to be written into components and so were covered by
  // nothing: the showreel behind the hero, the About portrait, and the five
  // stills in the Approach section. They live in data/site.ts now.
  found.push({
    media: {
      kind: "fileVideo",
      src: site.showreel.file,
      poster: site.showreel.poster,
      alt: site.showreel.alt,
    },
    where: "showreel",
  });
  found.push({ media: site.about.portrait, where: "about portrait" });
  found.push({ media: site.introStills.portrait, where: "intro portrait" });
  found.push({ media: site.introStills.landscape, where: "intro landscape" });
  site.introStills.row.forEach((media, index) =>
    found.push({ media, where: `intro row[${index}]` }),
  );

  return found;
}

const onDisk = (src) => existsSync(path.join(ROOT, src.replace(/^\/media\//, "")));

test("every referenced still and film exists on disk", () => {
  const missing = allMedia()
    .filter(({ media }) => media.kind === "image" || media.kind === "fileVideo")
    .filter(({ media }) => !onDisk(media.src))
    .map(({ media, where }) => `${where}: ${media.src}`);

  assert.deepEqual(missing, [], `missing files:\n${missing.join("\n")}`);
});

test("every still has the widths the loader will ask for", () => {
  const missing = [];
  for (const { media, where } of allMedia()) {
    if (media.kind !== "image") continue;
    for (const width of IMAGE_WIDTHS) {
      const variant = variantPath(media.src, width);
      if (!onDisk(variant)) missing.push(`${where}: ${variant}`);
    }
  }
  assert.deepEqual(missing, [], `missing variants:\n${missing.join("\n")}`);
});

test("every film has a poster, and the poster exists", () => {
  const broken = allMedia()
    .filter(({ media }) => media.kind === "fileVideo")
    .filter(({ media }) => !media.poster || !onDisk(media.poster))
    .map(({ media, where }) => `${where}: ${media.poster ?? "no poster"}`);

  assert.deepEqual(broken, [], `films without a usable poster:\n${broken.join("\n")}`);
});

test("every media object carries alt text and a parsable ratio", () => {
  const bad = [];
  for (const { media, where } of allMedia()) {
    if (!media.alt?.trim()) bad.push(`${where}: empty alt`);
    if (media.ratio !== undefined) {
      const [w, h] = media.ratio.split("/").map(Number);
      if (!w || !h) bad.push(`${where}: bad ratio ${media.ratio}`);
    }
  }
  assert.deepEqual(bad, [], bad.join("\n"));
});

test("project slugs are unique", () => {
  const slugs = projects.map((project) => project.slug);
  assert.equal(new Set(slugs).size, slugs.length, `duplicate slug in ${slugs.join(", ")}`);
});

test("client logos exist and their declared size matches the file", async () => {
  const sharp = (await import("sharp")).default;
  const wrong = [];

  for (const client of clients) {
    if (!client.logo) continue;
    if (!onDisk(client.logo.src)) {
      wrong.push(`${client.name}: ${client.logo.src} missing`);
      continue;
    }
    // ClientLogo sizes each logo from these numbers before the file loads, so a
    // stale value is a visibly wrong logo rather than a crash.
    const file = path.join(ROOT, client.logo.src.replace(/^\/media\//, ""));
    const { width, height } = await sharp(file).metadata();
    if (width !== client.logo.width || height !== client.logo.height) {
      wrong.push(
        `${client.name}: data says ${client.logo.width}x${client.logo.height}, file is ${width}x${height}`,
      );
    }
  }

  assert.deepEqual(wrong, [], wrong.join("\n"));
});

/**
 * Next writes the sitemap XML by string interpolation and escapes nothing, so
 * any `&` in a title or alt text — "HYROX & Stan Browney", "Dolce & Gabbana" —
 * used to open an XML entity that never closed. Parsing stopped at that line,
 * every URL below it was lost, and Search Console refused the file.
 *
 * The module imports through the `@/` alias, which Node does not resolve, so
 * the test loads a copy with those rewritten to absolute paths. It checks what
 * actually reaches the XML rather than trusting each field to be wrapped.
 */
test("no sitemap field carries a character that would break the XML", async () => {
  const root = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
  const fs = await import("node:fs/promises");
  const os = await import("node:os");

  const text = (await fs.readFile(path.join(root, "app/sitemap.ts"), "utf8")).replace(
    /(from\s+")@\/([^"]+)(")/g,
    (_, before, target, after) => `${before}${root}/${target}.ts${after}`,
  );
  const copy = path.join(await fs.mkdtemp(path.join(os.tmpdir(), "sitemap-")), "sitemap.ts");
  await fs.writeFile(copy, text);

  const { default: sitemap } = await import(copy);
  const bad = [];

  const check = (where, value) => {
    // An escaped entity is `&amp;`, `&lt;`, `&#38;` and so on. A bare `&`, or
    // one starting something that is not an entity, is the failure.
    if (/&(?!(#\d+|#x[0-9a-fA-F]+|[a-zA-Z]+);)/.test(value) || /[<>]/.test(value)) {
      bad.push(`${where}: ${value}`);
    }
  };

  for (const entry of sitemap()) {
    check("url", entry.url);
    (entry.images ?? []).forEach((image, i) => check(`${entry.url} images[${i}]`, image));
    for (const video of entry.videos ?? []) {
      for (const [key, value] of Object.entries(video)) {
        check(`${entry.url} video ${key}`, value);
      }
    }
  }

  assert.deepEqual(bad, [], bad.join("\n"));
});
