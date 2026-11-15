// Builds lightweight gallery loop videos + poster frames from source reels.
//
// Usage:
//   node scripts/build-gallery-media.js            # build missing/stale outputs
//   node scripts/build-gallery-media.js --force    # rebuild everything
//   node scripts/build-gallery-media.js cinnamonbliss  # only matching slugs
//
// Sources: media-src/reel/<slug>-reel.mp4 (preferred; outside `public` so raw
//          uploads never ship) or public/media/{reel,work}/<slug>-reel.mp4
// Outputs: public/media/reel/loops/<slug>-loop.mp4
//          public/media/reel/loops/<slug>-poster.webp
//
// The loop is a small, silent, faststart H.264 clip so many of them can play
// at once in the gallery grid without shipping the full reels.
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const ffmpeg = require("ffmpeg-static");

const ROOT = path.resolve(__dirname, "..");
const SOURCE_DIRS = [
  "media-src/reel",
  "public/media/reel",
  "public/media/work",
];
const OUT_DIR = path.join(ROOT, "public/media/reel/loops");

// The brand showreel drives the gallery's expanding center player; it is not
// a project tile and must not be transcoded into the loop set. `as-reel.mp4`
// is the older Work cut of the A&S campaign; the gallery uses AS-reel.mp4.
const EXCLUDE = new Set(["sarovar-reel.mp4", "as-reel.mp4"]);

const WIDTH = 360;
const HEIGHT = 640;
const MAX_SECONDS = 15;
const POSTER_AT = 0.5;
// Some reels open on a transition; pull their poster from a later beat.
const POSTER_TIMES = {
  ibrs: 4,
  northwok: 4,
  podcast: 7,
};
const CRF = 28;
const PRESET = "slow";
const WEBP_QUALITY = 80;

const CROP = `scale=${WIDTH}:${HEIGHT}:force_original_aspect_ratio=increase,crop=${WIDTH}:${HEIGHT}`;

function humanSize(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function findSources() {
  const found = new Map();
  for (const dir of SOURCE_DIRS) {
    const abs = path.join(ROOT, dir);
    if (!fs.existsSync(abs)) continue;
    for (const name of fs.readdirSync(abs)) {
      if (!name.endsWith("-reel.mp4") || EXCLUDE.has(name)) continue;
      const slug = name.slice(0, -"-reel.mp4".length);
      // First source dir wins, so project reels in /reel beat duplicates in /work.
      if (!found.has(slug)) found.set(slug, path.join(abs, name));
    }
  }
  return found;
}

function runFfmpeg(args) {
  try {
    execFileSync(ffmpeg, args, { stdio: ["ignore", "ignore", "pipe"] });
  } catch (error) {
    const stderr = error.stderr ? error.stderr.toString() : "";
    const tail = stderr.trim().split(/\r?\n/).slice(-6).join("\n");
    throw new Error(tail || error.message);
  }
}

function buildLoop(input, output) {
  runFfmpeg([
    "-y",
    "-i",
    input,
    "-t",
    String(MAX_SECONDS),
    "-an",
    "-vf",
    CROP,
    "-c:v",
    "libx264",
    "-profile:v",
    "main",
    "-pix_fmt",
    "yuv420p",
    "-crf",
    String(CRF),
    "-preset",
    PRESET,
    "-movflags",
    "+faststart",
    output,
  ]);
}

function buildPoster(input, output, at = POSTER_AT) {
  const render = (at) =>
    runFfmpeg([
      "-y",
      "-ss",
      String(at),
      "-i",
      input,
      "-frames:v",
      "1",
      "-vf",
      CROP,
      "-c:v",
      "libwebp",
      "-quality",
      String(WEBP_QUALITY),
      output,
    ]);
  try {
    render(at);
  } catch {
    // Very short clips may not have a frame at the requested time.
    render(0);
  }
  if (!fs.existsSync(output)) throw new Error("poster was not written");
}

function isFresh(input, output) {
  if (!fs.existsSync(output)) return false;
  return fs.statSync(output).mtimeMs >= fs.statSync(input).mtimeMs;
}

function main() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const filters = args.filter((arg) => !arg.startsWith("--"));

  const sources = findSources();
  if (!sources.size) {
    console.error(`No *-reel.mp4 files found in ${SOURCE_DIRS.join(", ")}`);
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  let built = 0;
  let skipped = 0;
  for (const [slug, input] of sources) {
    if (filters.length && !filters.some((f) => slug.includes(f))) continue;

    const loop = path.join(OUT_DIR, `${slug}-loop.mp4`);
    const poster = path.join(OUT_DIR, `${slug}-poster.webp`);

    if (!force && isFresh(input, loop) && isFresh(input, poster)) {
      console.log(`skip  ${slug} (up to date)`);
      skipped += 1;
      continue;
    }

    const sourceSize = fs.statSync(input).size;
    buildLoop(input, loop);
    buildPoster(input, poster, POSTER_TIMES[slug] ?? POSTER_AT);
    const loopSize = fs.statSync(loop).size;
    console.log(
      `build ${slug}: ${humanSize(sourceSize)} -> ${humanSize(loopSize)} ` +
        `(${((loopSize / sourceSize) * 100).toFixed(1)}%) + poster`
    );
    built += 1;
  }

  console.log(`\nDone. ${built} built, ${skipped} skipped. Output: public/media/reel/loops/`);
}

main();
