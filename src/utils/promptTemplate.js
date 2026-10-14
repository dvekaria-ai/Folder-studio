/* ---------------------------------------------------------------------------
   The house prompt template — the design system for AI output.

   Every generation, seeded or on-demand, goes through this function. The tab,
   the silhouette and the lighting language are non-negotiable: they are what
   makes a generated folder belong to the same family as every other one.

   The pure-black background is functional as well as aesthetic — it is what
   makes the keying pass in ./keyOutBackground.js reliable.
--------------------------------------------------------------------------- */

export function buildPrompt(name) {
  const subject = String(name ?? '').trim()
  if (!subject) throw new Error('buildPrompt: a folder name is required')

  return (
    `A macOS folder icon redesigned to look like ${subject}: ` +
    'keep the classic folder silhouette with the small tab at the top edge, ' +
    `render the folder body as ${subject}, ` +
    'soft studio lighting, centered on a solid pure black (#000000) background, ' +
    'square icon, high detail.'
  )
}

/* Per-provider tuning is allowed, but only ever as an addition — the sentence
   above is never rewritten. */
export const PROVIDER_SUFFIX = {
  gemini: '',
  openai: ' Centered composition, no text, no watermark.',
}

export function buildPromptFor(name, provider = 'gemini') {
  return buildPrompt(name) + (PROVIDER_SUFFIX[provider] ?? '')
}
