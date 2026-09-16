/**
 * Phase 3 — non-destructive web optimization of the four approved doctor
 * portraits. Original pixels preserved (no crop, no resize, no retouch);
 * PNG → WebP q88 transcode only, for web performance.
 * Source of truth (untouched): /home/z/my-project/upload/*.jpg.png
 */
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const SRC = "/home/z/my-project/upload";
const OUT = "/home/z/my-project/public/images/doctors";

const files = [
  "dr-himanshu-arora-profile.jpg.png",
  "dr-shruti-beri-arora-profile.jpg.png",
  "dr-shalabh-aggarwal-profile.jpg.png",
  "dr-akshay-rawat-profile.jpg.png",
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  for (const f of files) {
    const inPath = path.join(SRC, f);
    const outName = f.replace(/\.jpg\.png$/, ".webp");
    const outPath = path.join(OUT, outName);
    const meta = await sharp(inPath).metadata();
    await sharp(inPath).webp({ quality: 88, effort: 6 }).toFile(outPath);
    const before = fs.statSync(inPath).size;
    const after = fs.statSync(outPath).size;
    console.log(
      `${outName}: ${meta.width}x${meta.height} ` +
        `${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB`
    );
  }
  console.log("DONE");
})();
