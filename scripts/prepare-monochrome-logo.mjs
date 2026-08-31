import sharp from "sharp";

// Owner-approved deterministic edit of the supplied, white-matted gradient PNG.
// No tracing, generation, resizing, smoothing, or dilation of the silhouette.
const input = new URL("../public/images/tengyoda-logo-tyd.png", import.meta.url);
const output = new URL("../public/images/tengyoda-logo-solid.png", import.meta.url);
const { data: source, info } = await sharp(input.pathname).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const width = 181;
const height = 68;
const rgb = [255, 137, 0]; // #FF8900, the site's orange.
const blueFloor = Array.from({ length: info.width }, () => 255);
let left = info.width, top = info.height, right = -1, bottom = -1;

for (let y = 0; y < info.height; y++) {
  for (let x = 0; x < info.width; x++) {
    const i = (y * info.width + x) * 4;
    // The source uses a horizontal red/orange/yellow gradient: blue is the
    // dark channel. Estimate its opaque value independently for each column.
    if (source[i + 3]) blueFloor[x] = Math.min(blueFloor[x], source[i + 2]);
    if (source[i + 3] && Math.min(source[i], source[i + 1], source[i + 2]) < 255) {
      left = Math.min(left, x); top = Math.min(top, y);
      right = Math.max(right, x); bottom = Math.max(bottom, y);
    }
  }
}
if (right < left || bottom < top) throw new Error("The source has no visible logo.");
const reliable = blueFloor.map((value, x) => ({ value, x })).filter(item => item.value <= 32);
if (!reliable.length) throw new Error("Source is not the expected colored logo on white.");
for (let x = 0; x < info.width; x++) {
  if (blueFloor[x] > 32) {
    blueFloor[x] = reliable.reduce((best, item) => Math.abs(item.x - x) < Math.abs(best.x - x) ? item : best).value;
  }
}

// Recenter the original pixels in the established website display frame,
// removing only empty margins. Pixel geometry and cutouts are unchanged.
const offsetX = Math.floor((width - (right - left + 1)) / 2) - left;
const offsetY = Math.floor((height - (bottom - top + 1)) / 2) - top;
const result = Buffer.alloc(width * height * 4);
for (let y = 0; y < info.height; y++) {
  for (let x = 0; x < info.width; x++) {
    const i = (y * info.width + x) * 4;
    const alpha = Math.round(Math.min(1, (255 - source[i + 2]) / (255 - blueFloor[x])) * source[i + 3]);
    if (!alpha) continue;
    const outX = x + offsetX, outY = y + offsetY;
    if (outX < 0 || outY < 0 || outX >= width || outY >= height) throw new Error("Logo would be clipped.");
    const j = (outY * width + outX) * 4;
    result[j] = rgb[0]; result[j + 1] = rgb[1]; result[j + 2] = rgb[2];
    result[j + 3] = alpha;
  }
}

await sharp(result, { raw: { width, height, channels: 4 } }).png().toFile(output.pathname);
console.log(JSON.stringify({ output: output.pathname, width, height, color: "#FF8900", sourceBounds: { left, top, right, bottom }, offsetX, offsetY }));
