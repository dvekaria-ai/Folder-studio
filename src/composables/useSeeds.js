/* ---------------------------------------------------------------------------
   useSeeds — the gallery's data source.

   The manifest is a static import, so the seed list ships in the bundle and
   the gallery renders with no fetch and no loading state.

   Search matches the folder name and its tags. Someone typing "gold" should
   find the bar of gold; someone typing "breakfast" should find the waffle and
   the toast even though neither says "breakfast" in its name.
--------------------------------------------------------------------------- */

import { computed, ref, unref } from 'vue'
import manifest from '../data/seeds.json' with { type: 'json' }

/** Seed images live in public/seeds/, so the URL is the path. */
export function seedImageUrl(seed) {
  return `/seeds/${seed.file}`
}

const normalise = (s) => String(s ?? '').toLowerCase().trim()

/** True when every whitespace-separated term appears in the name or a tag.
 *  Multi-term is AND, so "gold bar" narrows rather than widens. */
export function matchesQuery(seed, query) {
  const terms = normalise(query).split(/\s+/).filter(Boolean)
  if (!terms.length) return true

  const haystack = [seed.name, ...(seed.tags ?? [])].map(normalise).join(' ')
  return terms.every((term) => haystack.includes(term))
}

export function useSeeds(query) {
  // Accept a ref, a getter, or nothing at all.
  const internal = ref('')
  const q = computed(() => {
    if (query === undefined) return internal.value
    return typeof query === 'function' ? query() : unref(query)
  })

  const all = computed(() => manifest.map((seed) => ({ ...seed, url: seedImageUrl(seed) })))

  const results = computed(() => all.value.filter((seed) => matchesQuery(seed, q.value)))

  return {
    /** Every seed, unfiltered. */
    all,
    /** Seeds matching the current query. */
    results,
    /** Writable query, for when the caller didn't pass one in. */
    query: internal,
    total: computed(() => all.value.length),
    count: computed(() => results.value.length),
    isEmpty: computed(() => results.value.length === 0),
    isSearching: computed(() => normalise(q.value).length > 0),
    /** True while the gallery is still showing stand-in art. */
    hasPlaceholders: computed(() => all.value.some((s) => s.placeholder)),
  }
}
