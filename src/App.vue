<template>
  <a class="skip" href="#main">Skip to content</a>

  <header class="masthead">
    <div class="page masthead__inner">
      <RouterLink to="/" class="wordmark">
        What the <em>Folder</em>
      </RouterLink>

      <nav class="nav" aria-label="Main">
        <RouterLink to="/">Gallery</RouterLink>
        <RouterLink to="/create">Create</RouterLink>
        <RouterLink to="/apply">Apply guide</RouterLink>
      </nav>
    </div>
  </header>

  <main id="main" tabindex="-1">
    <RouterView />
  </main>
</template>

<style scoped>
.skip {
  position: absolute;
  left: var(--sp-4);
  top: calc(-1 * var(--sp-10));
  z-index: 10;
  padding: var(--sp-3) var(--sp-4);
  background: var(--c-accent);
  color: var(--c-accent-ink);
  border-radius: var(--r-sm);
  font-size: var(--fs-sm);
  font-weight: 600;
  text-decoration: none;
  transition: top var(--transition-fast);
}
.skip:focus { top: var(--sp-4); }

.masthead {
  position: sticky;
  top: 0;
  z-index: 5;
  background: var(--c-bg-veil);
  backdrop-filter: blur(var(--blur-veil));
  border-bottom: 1px solid var(--c-border);
}

.masthead__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-5);
  height: var(--sp-8);
}

.wordmark {
  font-family: var(--font-display);
  font-size: var(--fs-xl);
  letter-spacing: var(--tracking-tight);
  text-decoration: none;
  white-space: nowrap;
}
.wordmark em {
  font-style: italic;
  color: var(--c-accent);
}

.nav {
  display: flex;
  gap: var(--sp-5);
  font-size: var(--fs-sm);
}

.nav a {
  color: var(--c-text-muted);
  text-decoration: none;
  transition: color var(--transition-fast);
}
.nav a:hover { color: var(--c-text); }
.nav a.router-link-active { color: var(--c-accent); }

main:focus { outline: none; }

@media (max-width: 540px) {
  .masthead__inner {
    height: auto;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--sp-2);
    padding-block: var(--sp-3);
  }
  .nav { gap: var(--sp-4); }
}
</style>
