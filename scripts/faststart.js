// Lossless MP4 faststart: moves `moov` before `mdat` and patches chunk offsets.
// Usage: node scripts/faststart.js <input.mp4> <output.mp4>
// Verifies output by re-parsing top-level boxes before exiting 0.
const fs = require("fs");

function readBoxes(buf, start, end) {
  const boxes = [];
  let off = start;
  while (off + 8 <= end) {
    let size = buf.readUInt32BE(off);
    const type = buf.toString("ascii", off + 4, off + 8);
    let header = 8;
    if (size === 1) {
      if (off + 16 > end) break;
      size = Number(buf.readBigUInt64BE(off + 8));
      header = 16;
    } else if (size === 0) {
      size = end - off;
    }
    if (size < header || off + size > end) break;
    boxes.push({ type, start: off, size, header });
    off += size;
  }
  return boxes;
}

// Patch stco/co64 chunk offsets by `delta` inside a moov buffer (in place).
function patchOffsets(moov) {
  const stack = [{ start: 8, end: moov.length }]; // skip moov header
  let patched = 0;
  while (stack.length) {
    const { start, end } = stack.pop();
    for (const b of readBoxes(moov, start, end)) {
      if (b.type === "stco") {
        const count = moov.readUInt32BE(b.start + b.header + 4);
        for (let i = 0; i < count; i++) {
          const p = b.start + b.header + 8 + i * 4;
          moov.writeUInt32BE(moov.readUInt32BE(p) + deltaOf(b, 0), p);
        }
        patched += count;
      } else if (b.type === "co64") {
        const count = moov.readUInt32BE(b.start + b.header + 4);
        for (let i = 0; i < count; i++) {
          const p = b.start + b.header + 8 + i * 8;
          moov.writeBigUInt64BE(moov.readBigUInt64BE(p) + BigInt(deltaOf(b, 1)), p);
        }
        patched += count;
      } else if (
        ["trak", "edts", "mdia", "minf", "dinf", "stbl", "mvex", "moof", "traf", "udta", "meta"].includes(b.type)
      ) {
        // Container boxes: descend.
        stack.push({ start: b.start + b.header, end: b.start + b.size });
      }
    }
  }
  return patched;
}

// delta is captured via closure set before patching
let DELTA = 0;
function deltaOf() {
  return DELTA;
}

function main() {
  const [input, output] = process.argv.slice(2);
  if (!input || !output) {
    console.error("usage: node scripts/faststart.js <input.mp4> <output.mp4>");
    process.exit(2);
  }
  const buf = fs.readFileSync(input);
  const boxes = readBoxes(buf, 0, buf.length);
  const moov = boxes.find((b) => b.type === "moov");
  const ftyp = boxes.find((b) => b.type === "ftyp");
  if (!moov) {
    console.error("no moov box found");
    process.exit(1);
  }
  // Already fast: moov ends before first mdat starts
  const firstMdat = boxes.find((b) => b.type === "mdat");
  if (firstMdat && moov.start < firstMdat.start) {
    console.log("already faststart, copying");
    fs.copyFileSync(input, output);
    return;
  }
  const moovBytes = Buffer.from(buf.subarray(moov.start, moov.start + moov.size));
  // New layout: [non-media head boxes...][moov][mdat + rest in original order]
  const head = [];
  const tail = [];
  for (const b of boxes) {
    if (b.type === "moov") continue;
    if (b.type === "mdat" || b.start > moov.start) tail.push(b);
    else head.push(b);
  }
  const headSize = head.reduce((n, b) => n + b.size, 0);
  // Tail media shifts forward: new mdat start minus old mdat start.
  const oldMdat = boxes.find((b) => b.type === "mdat");
  DELTA = headSize + moov.size - (oldMdat ? oldMdat.start : moov.start);
  const patched = patchOffsets(moovBytes);
  const parts = [];
  for (const b of head) parts.push(buf.subarray(b.start, b.start + b.size));
  parts.push(moovBytes);
  for (const b of tail) parts.push(buf.subarray(b.start, b.start + b.size));
  const out = Buffer.concat(parts);
  if (out.length !== buf.length) {
    console.error(`size mismatch: ${out.length} vs ${buf.length}`);
    process.exit(1);
  }
  fs.writeFileSync(output, out);
  // Verify: re-parse + confirm moov precedes mdat
  const v = readBoxes(out, 0, out.length);
  const vmoov = v.find((b) => b.type === "moov");
  const vmdat = v.find((b) => b.type === "mdat");
  if (!vmoov || !vmdat || vmoov.start > vmdat.start) {
    console.error("verification failed");
    process.exit(1);
  }
  console.log(`ok: patched ${patched} chunk offsets, moov@${vmoov.start} mdat@${vmdat.start}`);
}

main();
