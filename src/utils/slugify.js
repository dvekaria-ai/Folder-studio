/* ---------------------------------------------------------------------------
   slugify — folder name to safe filename.

   "Bar of Gold!"        -> bar-of-gold
   "Q3 Planning (final)" -> q3-planning-final
   "café näive"          -> cafe-naive
   "???"                 -> custom-folder

   Used for seed filenames at build time and for download filenames at runtime.
   We own the name, not the destination.
--------------------------------------------------------------------------- */

export const FALLBACK_SLUG = 'custom-folder'

/** Longest slug we will emit. Keeps filenames sane on every filesystem. */
const MAX_LENGTH = 64

export function slugify(input, { fallback = FALLBACK_SLUG, maxLength = MAX_LENGTH } = {}) {
  const slug = String(input ?? '')
    .normalize('NFKD')            // split accented chars into base + mark
    .replace(/[̀-ͯ]/g, '') // drop the marks
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')  // anything else becomes a separator
    .replace(/-+/g, '-')          // collapse runs
    .replace(/^-|-$/g, '')        // trim
    .slice(0, maxLength)
    .replace(/-$/, '')            // slicing may have left a trailing hyphen

  return slug || fallback
}

/** Same thing, with the extension attached. */
export function slugifyFilename(input, extension = 'png', options) {
  return `${slugify(input, options)}.${extension}`
}
