<script setup>
const swatches = [
  { group: 'Background', items: ['--c-bg', '--c-surface-1', '--c-surface-2', '--c-surface-3'] },
  { group: 'Text', items: ['--c-text', '--c-text-muted', '--c-text-faint'] },
  { group: 'Accent', items: ['--c-accent', '--c-accent-hover', '--c-accent-press', '--c-accent-ink'] },
  { group: 'Status', items: ['--c-danger', '--c-success'] },
]

const spacing = ['--sp-1', '--sp-2', '--sp-3', '--sp-4', '--sp-5', '--sp-6', '--sp-7', '--sp-8', '--sp-9', '--sp-10']
const radii = ['--r-sm', '--r-md', '--r-lg', '--r-xl']
const motion = ['--t-fast', '--t-base', '--t-slow']
</script>

<template>
  <div class="page guide">
    <header class="guide__head">
      <p class="eyebrow">Phase 2</p>
      <h1>Design tokens</h1>
      <p class="microcopy">Every colour, space and easing the folders are allowed to use.</p>
    </header>

    <section v-for="s in swatches" :key="s.group" class="section">
      <h2>{{ s.group }}</h2>
      <ul class="swatches">
        <li v-for="token in s.items" :key="token" class="swatch">
          <span class="swatch__chip" :style="{ background: `var(${token})` }" />
          <code>{{ token }}</code>
        </li>
      </ul>
    </section>

    <section class="section">
      <h2>Typography</h2>
      <h1>Display — Instrument Serif</h1>
      <p class="microcopy">Microcopy — asking the folder what it wants to be…</p>
      <p class="body-sample">Body — Inter. The quick brown fox jumps over the lazy dog, then
        files it under <em>miscellaneous</em>.</p>
      <p class="eyebrow">Eyebrow label</p>
    </section>

    <section class="section">
      <h2>Buttons</h2>
      <div class="row">
        <button class="btn btn--primary">Download PNG</button>
        <button class="btn btn--ghost">Regenerate</button>
        <button class="btn btn--quiet">Cancel</button>
        <button class="btn btn--primary" disabled>Disabled</button>
      </div>
      <div class="row">
        <button class="btn btn--primary btn--lg">Large</button>
        <button class="btn btn--ghost btn--sm">Small</button>
      </div>
      <p class="note">Tab through these — every one should show a gold ring.</p>
    </section>

    <section class="section">
      <h2>Spacing</h2>
      <ul class="scale">
        <li v-for="token in spacing" :key="token">
          <code>{{ token }}</code>
          <span class="bar" :style="{ width: `var(${token})` }" />
        </li>
      </ul>
    </section>

    <section class="section">
      <h2>Radius</h2>
      <div class="row">
        <span v-for="token in radii" :key="token" class="radius" :style="{ borderRadius: `var(${token})` }">
          <code>{{ token }}</code>
        </span>
      </div>
    </section>

    <section class="section">
      <h2>Motion</h2>
      <div class="row">
        <span v-for="token in motion" :key="token" class="motion" :style="{ transitionDuration: `var(${token})` }">
          <code>{{ token }}</code>
        </span>
      </div>
      <p class="note">Hover to see each duration, all <code>ease-in-out</code>.</p>
    </section>

    <section class="section">
      <h2>Empty state</h2>
      <div class="empty">
        <p class="empty__title">No folders match that</p>
        <p class="empty__body">Nothing in the gallery goes by that name yet — but the generator
          will happily take a swing at it.</p>
        <div class="empty__actions">
          <button class="btn btn--primary">Create your own</button>
          <button class="btn btn--ghost">Clear search</button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.guide { padding-block: var(--sp-8) var(--sp-10); }
.guide__head { margin-bottom: var(--sp-8); }
.guide__head .eyebrow { margin-bottom: var(--sp-2); }
.guide__head .microcopy { margin-top: var(--sp-3); }

.section {
  padding-block: var(--sp-6);
  border-top: 1px solid var(--c-border);
}
.section > h2 { margin-bottom: var(--sp-5); }
.section > * + * { margin-top: var(--sp-4); }

.swatches {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: var(--sp-4);
  list-style: none;
  padding: 0;
}
.swatch { display: flex; flex-direction: column; gap: var(--sp-2); }
.swatch__chip {
  height: var(--sp-8);
  border: 1px solid var(--c-border);
  border-radius: var(--r-md);
}

code {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: var(--fs-xs);
  color: var(--c-text-faint);
}

.body-sample { max-width: 60ch; color: var(--c-text-muted); }

.row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--sp-3);
}

.note { font-size: var(--fs-sm); color: var(--c-text-faint); }

.scale { list-style: none; padding: 0; display: grid; gap: var(--sp-2); }
.scale li { display: flex; align-items: center; gap: var(--sp-4); }
.scale code { width: 72px; flex-shrink: 0; }
.bar { height: var(--sp-3); background: var(--c-accent); border-radius: var(--r-full); }

.radius {
  display: grid;
  place-items: center;
  width: var(--sp-9);
  height: var(--sp-9);
  background: var(--c-surface-2);
  border: 1px solid var(--c-border);
}

.motion {
  display: grid;
  place-items: center;
  padding: var(--sp-4) var(--sp-5);
  background: var(--c-surface-2);
  border: 1px solid var(--c-border);
  border-radius: var(--r-md);
  transition-property: background-color, transform;
  transition-timing-function: var(--ease);
}
.motion:hover { background: var(--c-accent-soft); transform: translateY(calc(-1 * var(--sp-1))); }
</style>
