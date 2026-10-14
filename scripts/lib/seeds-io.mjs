/* Shared helpers for the two seed scripts. */

import { writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
export const SEEDS_DIR = resolve(ROOT, 'public/seeds')
export const MANIFEST_PATH = resolve(ROOT, 'src/data/seeds.json')

/** The folder silhouette, as an SVG path on a 1024x1024 canvas.
 *  The tab is sacred — it is the whole reason a folder reads as a folder. */
export const FOLDER_PATH =
  'M120 760 V300 a40 40 0 0 1 40-40 h200 a30 30 0 0 1 24 12 l34 46 ' +
  'h346 a40 40 0 0 1 40 40 v402 a40 40 0 0 1-40 40 H160 a40 40 0 0 1-40-40 Z'

export async function writeManifest(entries) {
  await mkdir(dirname(MANIFEST_PATH), { recursive: true })
  const json = JSON.stringify(entries, null, 2) + '\n'
  await writeFile(MANIFEST_PATH, json, 'utf8')
  return MANIFEST_PATH
}

export async function ensureSeedsDir() {
  await mkdir(SEEDS_DIR, { recursive: true })
  return SEEDS_DIR
}
