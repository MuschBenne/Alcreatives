/**
 * Refuses a deploy that would ship with no media origin baked in.
 *
 * `npm run deploy` deletes .open-next/assets/media, because those 600 MB live
 * on R2 now. That is only safe if the build actually inlined the R2 URL. It is
 * inlined at build time from NEXT_PUBLIC_MEDIA_BASE_URL, and .env.local wins
 * over .env.production even in a production build — so an empty line in an
 * untracked file on one machine is enough to produce a build where every image
 * and video resolves to a path the Worker no longer serves. Every asset 404s,
 * with no fallback.
 *
 * So this checks the built output rather than the environment: reading
 * process.env here would only prove the variable was set in *this* process, not
 * that the value reached the bundle.
 */

import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const BUILD_DIR = ".open-next";
const ENV_FILE = ".env.production";
const KEY = "NEXT_PUBLIC_MEDIA_BASE_URL";

/** Extensions worth searching. Media and fonts cannot contain a URL we set. */
const TEXT = new Set([".js", ".mjs", ".cjs", ".json", ".html", ".txt", ".map"]);

/** The deleted-at-deploy tree — skipping it saves scanning ~600 MB. */
const SKIP = new Set(["media"]);

function fail(message) {
  console.error(`\n  Deploy stopped: ${message}\n`);
  process.exit(1);
}

/** The value the build was supposed to inline, from the environment or the file. */
async function expectedOrigin() {
  if (process.env[KEY]) return process.env[KEY];

  let contents;
  try {
    contents = await readFile(ENV_FILE, "utf8");
  } catch {
    fail(`no ${KEY} in the environment and no ${ENV_FILE} to read it from.`);
  }

  const line = contents.split("\n").find((l) => l.startsWith(`${KEY}=`));
  const value = line?.slice(KEY.length + 1).trim();
  if (!value) {
    fail(
      `${KEY} is empty in ${ENV_FILE}. With no media origin the deploy would ` +
        `drop public/media and serve nothing in its place.`,
    );
  }
  return value;
}

/** Walks the build looking for `needle`, stopping at the first hit. */
async function buildContains(dir, needle) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    fail(`${BUILD_DIR} is missing — run the build before this check.`);
  }

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP.has(entry.name)) continue;
      if (await buildContains(full, needle)) return true;
      continue;
    }
    if (!TEXT.has(path.extname(entry.name))) continue;
    // Whole-file reads: the largest text file in the build is a few MB, and
    // streaming would only matter if a match could straddle a chunk boundary.
    const contents = await readFile(full, "utf8").catch(() => "");
    if (contents.includes(needle)) return true;
  }
  return false;
}

const origin = await expectedOrigin();

try {
  await stat(BUILD_DIR);
} catch {
  fail(`${BUILD_DIR} is missing — run the build before this check.`);
}

if (!(await buildContains(BUILD_DIR, origin))) {
  fail(
    `the build never inlined ${origin}.\n` +
      `  Most likely ${KEY} is set empty in .env.local, which overrides\n` +
      `  ${ENV_FILE} even in a production build. Every image and video would 404.`,
  );
}

console.log(`  Media origin ${origin} is in the build.`);
