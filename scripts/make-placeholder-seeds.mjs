#!/usr/bin/env node
/* ---------------------------------------------------------------------------
   Placeholder seeds — folder silhouettes to build the gallery against while
   GEMINI_API_KEY is still outstanding.

   These are deliberately plain: real folder geometry (the tab survives), muted
   surface colours, the name on the body, and a dashed edge so nobody mistakes
   one for finished art. Every entry is flagged `"placeholder": true` in the
   manifest; generate-seeds.mjs overwrites both the PNGs and the flag.

     npm run seeds:placeholder
--------------------------------------------------------------------------- */

import sharp from 'sharp'
import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { SEED_NAMES } from './seed-names.mjs'
import { slugify } from '../src/utils/slugify.js'
import { ensureSeedsDir, writeManifest, SEEDS_DIR, FOLDER_PATH } from './lib/seeds-io.mjs'

const SIZE = 1024

const escapeXml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function placeholderSvg(name) {
  const label = escapeXml(name)
  // Long names need to shrink to fit the folder body.
  const fontSize = label.length > 16 ? 54 : label.length > 11 ? 66 : 78

  return `<svg width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="body" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2a2f36"/>
      <stop offset="100%" stop-color="#1b1f24"/>
    </linearGradient>
  </defs>
  <path d="${FOLDER_PATH}" fill="url(#body)" stroke="#3a4149" stroke-width="3"/>
  <path d="${FOLDER_PATH}" fill="none" stroke="#7d838a" stroke-width="4"
        stroke-dasharray="14 12" opacity="0.5"/>
  <text x="512" y="545" text-anchor="middle" dominant-baseline="middle"
        font-family="Helvetica, Arial, sans-serif" font-size="${fontSize}"
        font-weight="600" fill="#9ba1a8">${label}</text>
  <text x="512" y="625" text-anchor="middle" dominant-baseline="middle"
        font-family="Helvetica, Arial, sans-serif" font-size="30"
        letter-spacing="4" fill="#5d646c">PLACEHOLDER</text>
</svg>`
}

async function main() {
  await ensureSeedsDir()
  const manifest = []

  for (const seed of SEED_NAMES) {
    const slug = slugify(seed.name)
    const file = `${slug}.png`
    const png = await sharp(Buffer.from(placeholderSvg(seed.name)))
      .png({ compressionLevel: 9 })
      .toBuffer()

    await writeFile(resolve(SEEDS_DIR, file), png)
    manifest.push({
      name: seed.name,
      file,
      tags: seed.tags,
      group: seed.group,
      placeholder: true,
    })
    process.stdout.write(`  ${file}\n`)
  }

  const path = await writeManifest(manifest)
  console.log(`\n${manifest.length} placeholder seeds -> public/seeds/`)
  console.log(`manifest -> ${path.replace(process.cwd() + '/', '')}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
