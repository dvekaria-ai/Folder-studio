/* ---------------------------------------------------------------------------
   Background keying — turns the prompt's pure-black backdrop transparent.

   Node-only (depends on sharp), so it lives outside src/ and never reaches the
   client bundle. Used at build time by scripts/generate-seeds.mjs and at
   runtime by /api/generate.

   Why flood fill rather than a luminance threshold: a plain threshold also
   punches holes in dark parts of the subject (the shadow under a waffle, the
   slot of a floppy disk). Filling inward from the border only removes black
   that is actually connected to the outside.

   Two thresholds give a soft edge:
     lum <= HARD            -> fully transparent
     HARD < lum <= SOFT     -> partial alpha, ramped
     lum > SOFT             -> untouched subject
   Partial-alpha pixels are un-premultiplied so the subject keeps its own
   colour instead of staying muddied by the black it was blended with. Without
   that step every edge keeps a dark fringe, which is the "ugly black box"
   the apply guide warns about.
--------------------------------------------------------------------------- */

import sharp from 'sharp'

const HARD = 12 // at or below this luminance: certainly background
const SOFT = 48 // above this: certainly subject

export async function keyOutBackground(input, { hard = HARD, soft = SOFT } = {}) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const { width, height, channels } = info
  if (channels !== 4) throw new Error(`keyOutBackground: expected RGBA, got ${channels} channels`)

  const lum = new Float32Array(width * height)
  for (let p = 0; p < width * height; p++) {
    const i = p * 4
    lum[p] = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]
  }

  // Flood fill inward from every border pixel that reads as background.
  const outside = new Uint8Array(width * height)
  const stack = []

  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return
    const p = y * width + x
    if (outside[p] || lum[p] > soft) return
    outside[p] = 1
    stack.push(p)
  }

  for (let x = 0; x < width; x++) { push(x, 0); push(x, height - 1) }
  for (let y = 0; y < height; y++) { push(0, y); push(width - 1, y) }

  while (stack.length) {
    const p = stack.pop()
    const x = p % width
    const y = (p - x) / width
    push(x - 1, y); push(x + 1, y); push(x, y - 1); push(x, y + 1)
  }

  let cleared = 0
  for (let p = 0; p < width * height; p++) {
    if (!outside[p]) continue
    const i = p * 4
    const l = lum[p]

    if (l <= hard) {
      data[i + 3] = 0
      cleared++
      continue
    }

    // Soft band: ramp alpha, then un-premultiply against black.
    const a = Math.round(((l - hard) / (soft - hard)) * 255)
    data[i + 3] = a
    if (a > 0) {
      const k = 255 / a
      data[i] = Math.min(255, Math.round(data[i] * k))
      data[i + 1] = Math.min(255, Math.round(data[i + 1] * k))
      data[i + 2] = Math.min(255, Math.round(data[i + 2] * k))
    }
  }

  const png = await sharp(data, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toBuffer()

  return { png, width, height, clearedPixels: cleared, totalPixels: width * height }
}
