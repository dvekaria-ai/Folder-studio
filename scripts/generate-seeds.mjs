#!/usr/bin/env node
/* ---------------------------------------------------------------------------
   Generate the real seed library with Nano Banana (gemini-2.5-flash-image),
   key out the black background, and rewrite the manifest.

     GEMINI_API_KEY=... npm run seeds:generate
     GEMINI_API_KEY=... npm run seeds:generate -- --force        # redo all
     GEMINI_API_KEY=... npm run seeds:generate -- waffle toast   # redo some

   By default it skips any seed whose PNG already exists and is not flagged as
   a placeholder, so an interrupted run resumes instead of re-spending.
--------------------------------------------------------------------------- */

import { writeFile, readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { SEED_NAMES } from './seed-names.mjs'
import { slugify } from '../src/utils/slugify.js'
import { buildPromptFor } from '../src/utils/promptTemplate.js'
import { keyOutBackground } from '../lib/keyOutBackground.js'
import { ensureSeedsDir, writeManifest, SEEDS_DIR, MANIFEST_PATH } from './lib/seeds-io.mjs'

const MODEL = 'gemini-2.5-flash-image'
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`

const DELAY_MS = 1500   // be polite between calls
const MAX_RETRIES = 3

const apiKey = process.env.GEMINI_API_KEY
if (!apiKey) {
  console.error(
    'GEMINI_API_KEY is not set.\n\n' +
    'Get one at https://aistudio.google.com -> Get API key, then put it in\n' +
    'a .env file in the project root (gitignored):\n\n' +
    '  GEMINI_API_KEY=your-key-here\n\n' +
    'npm run seeds:generate reads that file automatically.\n\n' +
    'Nothing was generated. The placeholder seeds are still in place.'
  )
  process.exit(1)
}

const args = process.argv.slice(2)
const force = args.includes('--force')
const only = args.filter((a) => !a.startsWith('--')).map((a) => a.toLowerCase())

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/** Map provider failures onto messages a human can act on. */
function describeFailure(status, body) {
  const message = body?.error?.message ?? ''
  if (status === 400 && /API key not valid/i.test(message)) return 'invalid API key'
  if (status === 403) return 'key rejected — check the key has the Generative Language API enabled'
  if (status === 429) return 'rate limited or out of quota'
  if (status >= 500) return `provider error (${status})`
  return message || `HTTP ${status}`
}

async function generateOne(name) {
  const prompt = buildPromptFor(name, 'gemini')

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const res = await fetch(`${ENDPOINT}?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    })

    if (res.ok) {
      const json = await res.json()
      const parts = json?.candidates?.[0]?.content?.parts ?? []
      const image = parts.find((p) => p.inlineData?.data)
      if (!image) {
        const text = parts.find((p) => p.text)?.text
        throw new Error(`no image returned${text ? ` — model said: ${text.slice(0, 160)}` : ''}`)
      }
      return Buffer.from(image.inlineData.data, 'base64')
    }

    const body = await res.json().catch(() => null)
    const reason = describeFailure(res.status, body)
    const retriable = res.status === 429 || res.status >= 500

    if (!retriable || attempt === MAX_RETRIES) throw new Error(reason)
    const backoff = DELAY_MS * 2 ** attempt
    console.log(`    ${reason}; retrying in ${backoff}ms (${attempt}/${MAX_RETRIES - 1})`)
    await sleep(backoff)
  }
}

async function loadExistingManifest() {
  try {
    return JSON.parse(await readFile(MANIFEST_PATH, 'utf8'))
  } catch {
    return []
  }
}

async function main() {
  await ensureSeedsDir()
  const previous = await loadExistingManifest()
  const previousByFile = new Map(previous.map((s) => [s.file, s]))

  const manifest = []
  let generated = 0
  let skipped = 0
  const failures = []

  for (const seed of SEED_NAMES) {
    const slug = slugify(seed.name)
    const file = `${slug}.png`
    const path = resolve(SEEDS_DIR, file)
    const entry = { name: seed.name, file, tags: seed.tags, group: seed.group }

    const selected = only.length === 0 || only.includes(slug) || only.includes(seed.name.toLowerCase())
    const already = existsSync(path) && previousByFile.get(file)?.placeholder === false

    if (!selected || (already && !force)) {
      manifest.push(previousByFile.get(file) ?? { ...entry, placeholder: true })
      skipped++
      continue
    }

    process.stdout.write(`  ${seed.name} … `)
    try {
      const raw = await generateOne(seed.name)
      const { png, clearedPixels, totalPixels } = await keyOutBackground(raw)
      await writeFile(path, png)

      const clearedPct = Math.round((clearedPixels / totalPixels) * 100)
      manifest.push({ ...entry, placeholder: false })
      generated++
      console.log(`ok (${clearedPct}% keyed out)`)

      // A sane keyed image clears a lot of frame but not nearly all of it.
      if (clearedPct < 15) console.log('    ⚠︎ little background removed — check the result')
      if (clearedPct > 92) console.log('    ⚠︎ almost everything removed — check the result')
    } catch (err) {
      console.log(`FAILED — ${err.message}`)
      failures.push({ name: seed.name, reason: err.message })
      manifest.push(previousByFile.get(file) ?? { ...entry, placeholder: true })
    }

    await sleep(DELAY_MS)
  }

  await writeManifest(manifest)

  console.log(`\ngenerated ${generated}, skipped ${skipped}, failed ${failures.length}`)
  if (failures.length) {
    console.log('\nfailed seeds (placeholders kept):')
    for (const f of failures) console.log(`  ${f.name} — ${f.reason}`)
    console.log('\nRe-run to retry just those:')
    console.log(`  npm run seeds:generate -- ${failures.map((f) => slugify(f.name)).join(' ')}`)
    process.exitCode = 1
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
