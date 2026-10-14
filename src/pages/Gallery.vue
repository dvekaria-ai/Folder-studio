<script setup>
import { useSeeds } from '../composables/useSeeds.js'

/* Phase 3 — proving the manifest and the composable load. The real gallery
   grid, search field and lightbox arrive in Phase 4. */
const { results, query, count, total, isEmpty, isSearching, hasPlaceholders } = useSeeds()
</script>

<template>
  <div class="page gallery">
    <header class="gallery__head">
      <p class="eyebrow">Phase 3 — seed library</p>
      <h1>Gallery</h1>
      <p v-if="hasPlaceholders" class="microcopy">
        Showing stand-in art until the generator runs.
      </p>
    </header>

    <label class="search">
      <span class="sr-only">Search folders</span>
      <input v-model="query" type="search" placeholder="Search folders — try “gold” or “breakfast”" />
    </label>

    <p class="eyebrow count">{{ count }} of {{ total }}</p>

    <div v-if="isEmpty" class="empty">
      <p class="empty__title">No folders match that</p>
      <p class="empty__body">Nothing in the gallery goes by that name yet.</p>
      <div class="empty__actions">
        <button class="btn btn--ghost" @click="query = ''">Clear search</button>
      </div>
    </div>

    <ul v-else class="grid">
      <li v-for="seed in results" :key="seed.file" class="card">
        <img :src="seed.url" :alt="`A folder icon shaped like ${seed.name}`" width="256" height="256" />
        <span class="card__name">{{ seed.name }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.gallery { padding-block: var(--sp-8) var(--sp-10); }
.gallery__head { margin-bottom: var(--sp-6); }
.gallery__head .eyebrow { margin-bottom: var(--sp-2); }
.gallery__head .microcopy { margin-top: var(--sp-3); }

.search input {
  width: 100%;
  max-width: 420px;
  padding: var(--sp-3) var(--sp-4);
  background: var(--c-surface-2);
  border: 1px solid var(--c-border);
  border-radius: var(--r-full);
  color: var(--c-text);
  transition: border-color var(--transition-fast);
}
.search input::placeholder { color: var(--c-text-faint); }
.search input:hover { border-color: var(--c-border-strong); }

.count { margin-block: var(--sp-5) var(--sp-4); }

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: var(--sp-5);
  list-style: none;
  padding: 0;
}

.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-3);
  padding: var(--sp-4);
  border-radius: var(--r-lg);
  transition: background-color var(--transition-fast), transform var(--transition-fast);
}
.card:hover {
  background: var(--c-surface-1);
  transform: translateY(calc(-1 * var(--sp-1)));
}
.card img { width: 100%; height: auto; }
.card__name { font-size: var(--fs-sm); color: var(--c-text-muted); }
</style>
