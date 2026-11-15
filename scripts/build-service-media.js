// Builds the Services sphere atlas sources: square, lightweight webp tiles.
//
// Usage:
//   node scripts/build-service-media.js            # build missing/stale tiles
//   node scripts/build-service-media.js --force    # rebuild everything
//   node scripts/build-service-media.js seo        # only matching slugs
//
// Sources: media-src/services/<slug>.<webp|png|jpg> (outside `public` so raw
//          uploads never ship)
// Outputs: public/media/services/<slug>.webp
//
// The InfiniteMenu shader samples 256 px per tile (a 4x4 atlas for 10 items),
// so 1024 px uploads only add decode time. 512 px keeps a little headroom for
// high-DPI canvases without paying for pixels the atlas throws away.
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const ffmpeg = require("ffmpeg-static");

const ROOT = path.resolve(__dirname, "..");
const SOURCE_DIR = path.join(ROOT, "media-src/services");
const OUT_DIR = path.join(ROOT, "public/media/services");

const SIZE = 512;
const WEBP_QUALITY = 88;
const SOURCE_EXT = /\.(webp|png|jpe?g)$/i;

const CROP = `scale=${SIZE}:${SIZE}:force_original_aspect_ratio=increase,crop=${SIZE}:${SIZE}`;

function humanSize(bytes) {
  return `${Math.round(bytes / 1024)} KB`;
}

function findSources() {
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`Missing source directory: ${path.relative(ROOT, SOURCE_DIR)}`);
    console.error("Put the full-size service images there, then re-run.");
    process.exit(1);
  }
  return fs
    .readdirSync(SOURCE_DIR)
    .filter((name) => SOURCE_EXT.test(name))
    .map((name) => ({
      slug: name.replace(SOURCE_EXT, ""),
      input: path.join(SOURCE_DIR, name),
    }));
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

function isFresh(input, output) {
  if (!fs.existsSync(output)) return false;
  return fs.statSync(output).mtimeMs >= fs.statSync(input).mtimeMs;
}

function main() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const filters = args.filter((arg) => !arg.startsWith("--"));

  const sources = findSources();
  if (!sources.length) {
    console.error(`No image files found in ${path.relative(ROOT, SOURCE_DIR)}`);
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  let built = 0;
  let skipped = 0;
  for (const { slug, input } of sources) {
    if (filters.length && !filters.some((f) => slug.includes(f))) continue;

    const output = path.join(OUT_DIR, `${slug}.webp`);
    if (!force && isFresh(input, output)) {
      console.log(`skip  ${slug} (up to date)`);
      skipped += 1;
      continue;
    }

    const sourceSize = fs.statSync(input).size;
    runFfmpeg([
      "-y",
      "-i",
      input,
      "-vf",
      CROP,
      "-c:v",
      "libwebp",
      "-quality",
      String(WEBP_QUALITY),
      output,
    ]);
    const outputSize = fs.statSync(output).size;
    console.log(
      `build ${slug}: ${humanSize(sourceSize)} -> ${humanSize(outputSize)} ` +
        `(${((outputSize / sourceSize) * 100).toFixed(0)}%)`
    );
    built += 1;
  }

  console.log(`\nDone. ${built} built, ${skipped} skipped. Output: public/media/services/`);
}

main();
