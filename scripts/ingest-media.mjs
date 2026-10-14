/**
 * Turns the camera originals in `hemsida material/` into web assets under
 * `public/media`. Everything it produces is derived — delete public/media and
 * re-run and you get the same bytes back.
 *
 *   npm run media           process everything that is missing
 *   npm run media -- --force  re-encode even if the output already exists
 *
 * The selection lives in ./media-manifest.mjs; this file is only the machinery.
 */

import { execFile } from "node:child_process";
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import sharp from "sharp";
import { SOURCE_ROOT, images, videos, logos } from "./media-manifest.mjs";

const run = promisify(execFile);

const OUT_ROOT = "public/media";
const FORCE = process.argv.includes("--force");

/** Longest edge for the full-size still every variant is derived from. */
const MAX_EDGE = 2400;
const JPEG_QUALITY = 80;

/**
 * Narrower copies written beside each still, so next/image can build a real
 * srcset without an optimisation service at runtime — see lib/image-loader.ts.
 *
 * Keep in sync with IMAGE_WIDTHS in lib/media.ts and `images.deviceSizes` in
 * next.config.ts. The 1600 step is gone: MAX_EDGE caps the longest edge, so a
 * portrait crop is already 1600 wide at full size and the variant was the same
 * file twice. Anything above 1080 now resolves to the original.
 */
const IMAGE_WIDTHS = [640, 1080];

/** `public/media/bts/01.jpg` + 640 → `public/media/bts/01-640.jpg`. */
function variantPath(file, width) {
  const ext = path.extname(file);
  return `${file.slice(0, -ext.length)}-${width}${ext}`;
}

function parseRatio(ratio) {
  const [w, h] = ratio.split("/").map(Number);
  if (!w || !h) throw new Error(`Bad ratio: ${ratio}`);
  return w / h;
}

/** Cover-crop to `ratio`, then cap the longest edge at MAX_EDGE. */
function fitToRatio(width, height, ratio) {
  const target = parseRatio(ratio);
  const source = width / height;

  // Largest box of the target ratio that still fits inside the source.
  let w = source > target ? Math.round(height * target) : width;
  let h = source > target ? height : Math.round(width / target);

  const scale = Math.min(1, MAX_EDGE / Math.max(w, h));
  return { width: Math.round(w * scale), height: Math.round(h * scale) };
}

async function exists(file) {
  try {
    await stat(file);
    return true;
  } catch {
    return false;
  }
}

async function sizeOf(file) {
  const { size } = await stat(file);
  return `${(size / 1024 / 1024).toFixed(2)} MB`;
}

async function ensureDir(file) {
  await mkdir(path.dirname(file), { recursive: true });
}

/**
 * One encode, one output file. A sharp instance cannot be reused across two
 * `toFile` calls, so each width gets its own pipeline off the same source.
 */
async function encodeStill({ src, dest, width, height, position }) {
  await sharp(src, { failOn: "none" })
    .rotate()
    // Centre by default: these frames are already composed, so trusting the
    // middle beats letting an entropy heuristic re-frame them.
    .resize(width, height, { fit: "cover", position, withoutEnlargement: true })
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true, progressive: true })
    .toFile(dest);
}

async function processImage({ from, to, ratio, position = "centre" }) {
  const src = path.join(SOURCE_ROOT, from);
  const dest = path.join(OUT_ROOT, to);
  const outputs = [dest, ...IMAGE_WIDTHS.map((w) => variantPath(dest, w))];

  // Every width has to be present, or a srcset entry would 404 — a half-done
  // set from an interrupted run must not read as "already ingested".
  if (!FORCE) {
    const present = await Promise.all(outputs.map(exists));
    if (present.every(Boolean)) return { dest, skipped: true };
  }

  await ensureDir(dest);
  const { width, height } = await sharp(src, { failOn: "none" }).rotate().metadata();
  const box = fitToRatio(width, height, ratio);

  await encodeStill({ src, dest, width: box.width, height: box.height, position });

  const target = parseRatio(ratio);
  for (const variantWidth of IMAGE_WIDTHS) {
    await encodeStill({
      src,
      dest: variantPath(dest, variantWidth),
      width: variantWidth,
      height: Math.round(variantWidth / target),
      position,
    });
  }

  return { dest, note: `${box.width}x${box.height} +${IMAGE_WIDTHS.length} widths` };
}

/**
 * Source frame rate as a number, or null if it cannot be read.
 *
 * Worth the extra probe: a 29.97 source (30000/1001) cannot line up with the
 * MP4 timescale, so the muxer writes an edit list and the clip reports
 * start_time 0.033 instead of 0. On a grid cover that made the hover rewind a
 * seek outside the seekable range, which errored and swapped the finished
 * video for the "awaiting asset" placeholder. Rounding to an integer rate on
 * output removes the offset. 30/1 and 24/1 sources round to themselves, so
 * this only touches the fractional ones.
 */
async function frameRateOf(file) {
  try {
    const { stdout } = await run("ffprobe", [
      "-v", "error",
      "-select_streams", "v:0",
      "-show_entries", "stream=r_frame_rate",
      "-of", "default=nw=1:nk=1",
      file,
    ]);
    const [num, den] = stdout.trim().split("/").map(Number);
    return num && den ? num / den : null;
  } catch {
    return null;
  }
}

async function processVideo(spec) {
  const src = path.join(SOURCE_ROOT, spec.from);
  const dest = path.join(OUT_ROOT, spec.to);
  const poster = spec.poster ? path.join(OUT_ROOT, spec.poster) : null;

  const trim = spec.trim ?? {};
  // segments: pieces of the source joined end to end, for a cut that has to
  // step over a shot in the middle. Each piece is { start, end } in source
  // seconds, end exclusive. Takes the place of trim when present.
  const segments = spec.segments ?? null;
  const scaleCrop = `scale=${spec.width}:${spec.height}:force_original_aspect_ratio=increase,crop=${spec.width}:${spec.height}`;

  if (FORCE || !(await exists(dest))) {
    await ensureDir(dest);
    const rate = await frameRateOf(src);
    await run("ffmpeg", [
      "-y",
      // -ss after -i, not before: seeking the input lands on the nearest
      // keyframe, which is not good enough when the cut has to miss a specific
      // frame — the BMW clip has burned-in pricing right before its window.
      // Decoding up to the cut costs a few seconds and buys frame accuracy.
      "-i", src,
      ...(segments
        ? [
            // The trim filter decodes to each cut, so the pieces are frame
            // accurate the same way the -ss below is. Every piece restarts at
            // zero before concat lays them end to end.
            "-filter_complex",
            segments
              .map(({ start, end }, i) => `[0:v]trim=start=${start}:end=${end},setpts=PTS-STARTPTS,${scaleCrop}[s${i}]`)
              .join(";") +
              `;${segments.map((_, i) => `[s${i}]`).join("")}concat=n=${segments.length}:v=1:a=0[v]`,
            "-map", "[v]",
          ]
        : [
            ...(trim.start ? ["-ss", String(trim.start)] : []),
            ...(trim.duration ? ["-t", String(trim.duration)] : []),
            // setpts=PTS-STARTPTS restamps the cut to begin at zero. On its own
            // it did not clear the container offset a fractional rate produces;
            // -r is what does that. Kept because it is the right thing to do
            // after a trim.
            "-vf", `${scaleCrop},setpts=PTS-STARTPTS`,
          ]),
      // -an: MediaFrame always plays muted, so the audio track is dead weight.
      "-an",
      // Integer output rate — see frameRateOf above for what this is fixing.
      ...(rate ? ["-r", String(Math.round(rate))] : []),
      "-c:v", "libx264",
      "-profile:v", "high",
      "-preset", "slow",
      "-crf", String(spec.crf ?? 23),
      // A ceiling under CRF, not a target: calm shots stay well below it, and
      // it only bites on the grain and motion that would otherwise balloon a
      // file. The buffer is two seconds of it. A fixed small buffer clipped
      // exactly those busy moments, which is where the quality was needed.
      "-maxrate", spec.maxrate ?? "5000k",
      "-bufsize", spec.bufsize ?? `${parseInt(spec.maxrate ?? "5000k", 10) * 2}k`,
      // 4.0 covers 1080p at these rates and is what older phones and TV
      // browsers can decode in hardware; x264 would otherwise pick 5.0.
      "-level:v", "4.0",
      "-pix_fmt", "yuv420p",
      // Puts the index up front so playback can start before the full download.
      "-movflags", "+faststart",
      dest,
    ]);
  }

  if (poster && (FORCE || !(await exists(poster)))) {
    await ensureDir(poster);
    const { stdout: frame } = await run("ffmpeg", [
      "-y",
      // The poster is the frame the encoded clip opens on, so the still and
      // the film show the same picture. A hover cover pauses and rewinds to
      // frame zero when the pointer leaves, and an autoplaying film starts
      // there; a poster grabbed from anywhere else makes the card visibly
      // change picture the moment it plays. Timestamps are in the source, so a
      // trimmed clip counts from its cut. posterAt overrides it — see the note
      // on `videos` in media-manifest.mjs.
      "-ss", String(spec.posterAt ?? segments?.[0].start ?? trim.start ?? 0),
      "-i", src,
      "-frames:v", "1",
      "-vf", scaleCrop,
      // Hand the frame to sharp instead of letting ffmpeg write the JPEG. Its
      // -q:v 4 is a coarser knob than mozjpeg at the quality the stills already
      // use, and a poster is what someone looks at while the film loads, so it
      // deserves the same encoder.
      "-f", "image2pipe",
      "-vcodec", "png",
      "pipe:1",
    ], { encoding: "buffer", maxBuffer: 128 * 1024 * 1024 });

    await sharp(frame)
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true, progressive: true })
      .toFile(poster);
  }

  return { dest };
}

async function processLogo({ from, to, white }) {
  const src = path.join(SOURCE_ROOT, from);
  const dest = path.join(OUT_ROOT, to);
  if (!FORCE && (await exists(dest))) return { dest, skipped: true };

  await ensureDir(dest);
  // density only matters for the SVG source; raster inputs ignore it.
  // The D&G vector rasterises past sharp's default 268MP guard, hence the opt-out.
  //
  // trim() first: several of these arrive as a small wordmark centred in a big
  // transparent canvas. Without it the padding survives the resize and the
  // marquee renders the artwork at a fraction of its row height.
  const trimmed = await sharp(src, { density: 600, limitInputPixels: false })
    .ensureAlpha()
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 0 })
    .png()
    .toBuffer();

  // 360x120, not 1200x400: ClientLogo.tsx renders these between 24 and 48 px
  // tall, so 120 covers a 3x display with room to spare. The old size was
  // roughly 200 KB of PNG to paint a logo the height of a line of text.
  const base = sharp(trimmed).resize(360, 120, {
    fit: "inside",
    withoutEnlargement: true,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  });

  if (!white) {
    await base.png({ compressionLevel: 9 }).toFile(dest);
    return { dest };
  }

  // Keep the artwork's alpha, throw away its colour: a white silhouette that
  // still respects knockouts and counters.
  const mask = await base.ensureAlpha().extractChannel("alpha").toBuffer();
  const { width, height } = await sharp(mask).metadata();

  await sharp({
    create: { width, height, channels: 3, background: "#ffffff" },
  })
    .joinChannel(mask)
    .png({ compressionLevel: 9 })
    .toFile(dest);

  return { dest };
}

async function main() {
  if (!(await exists(SOURCE_ROOT))) {
    console.error(`Source folder "${SOURCE_ROOT}" is missing — nothing to ingest.`);
    process.exitCode = 1;
    return;
  }

  const groups = [
    ["Stills", images, processImage],
    ["Logos", logos, processLogo],
    ["Video", videos, processVideo],
  ];

  let failures = 0;

  for (const [label, specs, handler] of groups) {
    console.log(`\n${label} (${specs.length})`);
    for (const spec of specs) {
      try {
        const { dest, skipped, note } = await handler(spec);
        const suffix = skipped ? "skipped" : `${await sizeOf(dest)}${note ? ` · ${note}` : ""}`;
        console.log(`  ${skipped ? "·" : "✓"} ${spec.to.padEnd(46)} ${suffix}`);
      } catch (error) {
        failures += 1;
        // ffmpeg says what actually went wrong on its last stderr line, not in
        // the "Command failed" message execFile builds.
        const detail =
          error.stderr?.trim().split("\n").at(-1) ?? error.message.split("\n")[0];
        console.error(`  ✗ ${spec.to} — ${detail}`);
      }
    }
  }

  console.log(failures ? `\n${failures} failed.` : "\nDone.");
  if (failures) process.exitCode = 1;
}

await main();
