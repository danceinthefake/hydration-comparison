# SSR Hydration Comparison Results

## Overview

This project compares **hydration behavior** across different frameworks when building interactive landing pages with real-world features, including a Pokemon search with detail pages using PokeAPI.

## Frameworks Tested

| App | Framework | UI Library | Hydration Strategy | Deploy Model |
|-----|-----------|------------|-------------------|--------------|
| astro-vue-app | Astro 4 | Vue 3 | Islands (selective) | Static files |
| astro-react-app | Astro 4 | React 18 | Islands (selective) | Static files |
| astro-svelte-app | Astro 4 | Svelte 4 | Islands (selective) | Static files |
| sveltekit-app | SvelteKit 2 | Svelte 4 | Full hydration | Static files |
| nuxt-app | Nuxt 3 | Vue 3 | Full hydration | Static files |
| nextjs-app | Next.js 14 | React 18 | Full + Server Components | Static files |

> All apps use static pre-rendering (`nuxt generate`, `next export`, `adapter-static`) and are served via a static file server. Nuxt was updated from SSR-node to static-generate for a fair apples-to-apples comparison.
> All 6 apps have identical pages: home (13 interactive components), 151 Pokémon detail pages, and an admin panel.

---

## Interactive Features Tested

All apps include the same 13 interactive components + Pokemon pages + Admin panel:

| Component | Reactivity |
|-----------|------------|
| Mobile Navigation | Toggle menu state |
| Stats Counter | Intersection Observer + animated counting |
| Testimonial Carousel | Auto-slide interval + manual controls |
| FAQ Accordion | Expand/collapse state |
| Contact Form | Form validation + submission |
| Back to Top | Scroll position listener |
| Modal | Portal rendering, ESC key, click outside |
| Tabs | Multiple state management, ARIA roles |
| Image Lightbox | Gallery with keyboard navigation |
| Cookie Banner | localStorage persistence |
| Pricing Toggle | Monthly/yearly computed values |
| **Search Box** | PokeAPI integration, debounced search, navigation |
| **Pokemon Detail** | 151 static pages with Pokemon data |

---

## Benchmark Results (Production Build)

### Home Page JavaScript Bundle Size

| App | Raw JS | Gzip JS | Notes |
|-----|--------|---------|-------|
| **astro-svelte-app** | 61 KB | **26 KB** | Svelte components only, no runtime |
| **sveltekit-app** | 103 KB | 36 KB | Svelte runtime + SvelteKit router |
| **astro-vue-app** | 111 KB | 48 KB | Vue runtime + components |
| **astro-react-app** | 194 KB | 64 KB | React runtime + components |
| **nuxt-app** | 202 KB | 76 KB | Full Vue + Nuxt framework |
| **nextjs-app** | 476 KB | 141 KB | Full React + Next.js framework |

> Measured by tracing transitive ES module imports from each page's HTML. Gzip measured per-file (as served over HTTP/2).

### JavaScript Savings (vs Next.js)

| App | Reduction (Raw) | Reduction (Gzip) |
|-----|-----------------|------------------|
| astro-svelte-app | **87.2%** smaller | **81.6%** smaller |
| sveltekit-app | **78.4%** smaller | **74.5%** smaller |
| astro-vue-app | **76.7%** smaller | **66.0%** smaller |
| astro-react-app | **59.2%** smaller | **54.6%** smaller |
| nuxt-app | **57.6%** smaller | **46.1%** smaller |

---

## Per-Page JavaScript Analysis

This is where the **real difference** becomes visible. Different pages load different amounts of JavaScript.

### Home Page (13 Interactive Components)

| App | Raw JS | Gzip JS | Notes |
|-----|--------|---------|-------|
| **astro-svelte-app** | 61 KB | 26 KB | Svelte components only, no framework runtime |
| **sveltekit-app** | 103 KB | 36 KB | Svelte + SvelteKit router (static pre-render) |
| **astro-vue-app** | 111 KB | 48 KB | Vue runtime + components |
| **astro-react-app** | 194 KB | 64 KB | React runtime + components |
| **nuxt-app** | 202 KB | 76 KB | Full Vue + Nuxt framework |
| **nextjs-app** | 476 KB | 141 KB | Full React + Next.js framework |

### Pokemon Detail Page (Static Content)

| App | Raw JS | Gzip JS | Notes |
|-----|--------|---------|-------|
| **astro-svelte-app** | **0 KB** | **0 KB** | Pure static HTML, zero JS |
| **astro-vue-app** | **0 KB** | **0 KB** | Pure static HTML, zero JS |
| **astro-react-app** | **0 KB** | **0 KB** | Pure static HTML, zero JS |
| **sveltekit-app** | 58 KB | 23 KB | Runtime + router + pokemon component |
| **nuxt-app** | 204 KB | 77 KB | Full Vue + Nuxt loads on every page |
| **nextjs-app** | 440 KB | 136 KB | Full React + Next.js loads on every page |

### Admin Page (Complex Shared State)

| App | Raw JS | Gzip JS | Notes |
|-----|--------|---------|-------|
| **astro-svelte-app** | 35 KB | **13 KB** | AdminPanel as single island component |
| **sveltekit-app** | 75 KB | 28 KB | Runtime + router + AdminPanel component |
| **astro-vue-app** | 95 KB | 38 KB | AdminPanel island + Vue runtime |
| **astro-react-app** | 160 KB | 51 KB | AdminPanel island + React runtime |
| **nuxt-app** | 195 KB | 74 KB | Full Vue + Nuxt + AdminPanel component |
| **nextjs-app** | 452 KB | 140 KB | Full React + Next.js + AdminPanel component |

### Key Insights

- **Astro apps**: Pokemon detail pages are **pure static HTML** with **zero JavaScript**
- **SvelteKit**: Pays for runtime + router (~36 KB gz home) on every page, but much lighter than Nuxt/Next.js on all pages
- **Nuxt**: ~75–77 KB gz on every page regardless of content
- **Next.js**: Server Components help slightly, but still **135–141 KB gzip** on every page

---

## Detailed Bundle Analysis

### 1. Astro + Svelte (Best Performance)

```
dist/_astro/ (home page)
├── client.js + 13 components    ~54 KB
└── Svelte shared runtime         ~7 KB
────────────────────────────────────────
Home page JS:    61 KB raw (26 KB gzip)
Admin page JS:   35 KB raw (13 KB gzip)  ← AdminPanel island only
Pokemon page JS:  0 KB raw  (0 KB gzip)  ← pure static HTML
```

**Why smallest**: Svelte compiles reactivity to vanilla JS — no framework runtime shipped. Pokemon pages are pure static HTML with zero JavaScript.

### 2. SvelteKit (adapter-static)

```
build/_app/immutable/
├── Shared: start + app entry + chunks  ~46 KB  (loaded on every page)
├── nodes/2.js: home page component     ~55 KB  (home only)
├── nodes/3.js: admin component         ~27 KB  (admin only)
├── nodes/4.js: pokemon component       ~11 KB  (pokemon pages only)
────────────────────────────────────────────────────────────────────
Home page JS:    103 KB raw (36 KB gzip)
Admin page JS:    75 KB raw (28 KB gzip)
Pokemon page JS:  58 KB raw (23 KB gzip)
```

**Note**: SvelteKit splits routes into separate JS nodes. The shared bootstrap (~46 KB) loads on every page, plus the route-specific component. Pokemon pages are light because the component is tiny (pure display, no interactivity). Sits between Astro+Svelte and Astro+Vue on home/admin, and well below Nuxt/Next.js on all pages.

### 3. Astro + Vue

```
dist/_astro/ (home page)
├── Vue runtime-core             69 KB
├── Components (13 total)       ~26 KB
├── client.js + helpers          ~1 KB
────────────────────────────────────────
Home page JS:    111 KB raw (48 KB gzip)
Admin page JS:    95 KB raw (38 KB gzip)  ← AdminPanel island + Vue runtime
Pokemon page JS:   0 KB raw  (0 KB gzip)  ← pure static HTML
```

**Note**: Vue runtime (~69 KB) is shared across all components via ES module imports.

### 4. Astro + React

```
dist/_astro/ (home page)
├── React runtime (client.js)   ~140 KB
├── Components (13 total)        ~54 KB
────────────────────────────────────────
Home page JS:    194 KB raw (64 KB gzip)
Admin page JS:   160 KB raw (51 KB gzip)  ← AdminPanel island + React runtime
Pokemon page JS:   0 KB raw  (0 KB gzip)  ← pure static HTML
```

**Note**: React runtime is larger than Vue, but still selective hydration.

### 5. Nuxt (Full Hydration, Static Generated)

```
.output/public/_nuxt/ (home page)
├── Vue runtime + Nuxt framework  ~202 KB
────────────────────────────────────────
Home page JS:    202 KB raw (76 KB gzip)
Admin page JS:   195 KB raw (74 KB gzip)  ← same framework + page component
Pokemon page JS: 204 KB raw (77 KB gzip)  ← full Vue + Nuxt loads on every page
```

**Note**: `nuxt generate` produces static files (same as Next/SvelteKit). Nearly the same JS bundle loads on every page — Nuxt code-splits page components but the Vue + Nuxt runtime dominates.

### 6. Next.js (Full Hydration + Server Components)

```
out/_next/static/ (home page chunks)
├── framework + polyfills        ~350 KB
├── page chunks                  ~126 KB
────────────────────────────────────────
Home page JS:    476 KB raw (141 KB gzip)
Admin page JS:   452 KB raw (140 KB gzip)
Pokemon page JS: 440 KB raw (136 KB gzip)
```

**Note**: Largest bundle. Server Components reduce component JS but React runtime still required on every page.

---

## Hydration Strategies Compared

### Islands Architecture (Astro)

```html
<!-- HOME PAGE -->
<!-- Static - No JS shipped -->
<header>...</header>
<main>
  <section class="hero">...</section>      <!-- Static: 0 KB -->
  <section class="cards">...</section>     <!-- Static: 0 KB -->
</main>
<footer>...</footer>

<!-- Interactive Islands - Only these ship JS -->
<MobileNav client:load />                  <!-- Immediate hydration -->
<SearchBox client:visible />               <!-- Lazy: hydrate when visible -->
<StatsCounter client:visible />            <!-- Lazy -->

<!-- POKEMON DETAIL PAGE -->
<!-- 100% Static - ZERO JavaScript needed -->
<main class="pokemon-page">
  <div class="pokemon-card">...</div>      <!-- Static: 0 KB -->
  <div class="stats">...</div>             <!-- Static: 0 KB -->
</main>
```

**Benefit**: Pokemon detail pages ship **zero JavaScript** - pure static HTML.

### Full Hydration (Nuxt)

```html
<!-- EVERY PAGE loads the same JS -->
<div id="__nuxt">
  <header>...</header>       <!-- Hydrated -->
  <main>...</main>           <!-- Hydrated -->
  <footer>...</footer>       <!-- Hydrated -->
</div>
<script src="/_nuxt/entry.js"></script>  <!-- ~75 KB gzip on EVERY page -->
```

**Drawback**: Pokemon detail page loads 75 KB of JavaScript just to display static content.

### Server Components (Next.js)

```html
<!-- Server-rendered, but still needs hydration for client components -->
<main class="pokemon-page">
  <!-- Server Component - no hydration needed -->
  <div class="pokemon-card">...</div>
</main>
<!-- But still loads ~134 KB gzip for React runtime + framework -->
<script src="/_next/static/chunks/main.js"></script>
<script src="/_next/static/chunks/framework.js"></script>
```

**Trade-off**: Less component JS, but React runtime still required.

---

## Key Findings

### 1. Runtime Size Matters

| Framework | Runtime Size |
|-----------|-------------|
| Svelte | ~0 KB (compiles away) |
| Vue 3 | ~81 KB |
| React 18 | ~136 KB |

### 2. Architecture Matters More

Even with the same UI library (React), Astro ships **74% less JavaScript** than Next.js because of selective hydration.

### 3. Per-Page Loading is Critical

| Scenario | Astro+Svelte | Astro+Vue | SvelteKit | Astro+React | Nuxt | Next.js |
|----------|-------------|-----------|-----------|-------------|------|---------|
| Home (complex) | 26 KB | 48 KB | 36 KB | 64 KB | 76 KB | 141 KB |
| Pokemon (static) | **0 KB** | **0 KB** | 23 KB | **0 KB** | 77 KB | 136 KB |
| Admin (complex state) | 13 KB | 38 KB | 28 KB | 51 KB | 74 KB | 140 KB |

**Astro wins on static content pages** - zero JavaScript. SvelteKit beats Nuxt/Next.js on all pages.

### 4. Full-Hydration Frameworks Load Large JS Everywhere

SvelteKit, Nuxt and Next.js ship the framework bundle on every page, but amounts differ significantly:
- SvelteKit: 23–36 KB gzip per page (Svelte runtime + router, code-splits page components)
- Nuxt: 74–77 KB gzip per page (Vue + Nuxt framework, minimal code splitting)
- Next.js: 136–141 KB gzip per page (React + Next.js framework)

### 5. Next.js Server Components Help (But Not Enough)

Server Components reduce component-level hydration, but:
- Still loads ~134 KB for React runtime
- Still larger than Nuxt on static pages
- Much larger than Astro

---

## Trade-offs Summary

| Approach | Pros | Cons |
|----------|------|------|
| **Astro Islands** | Zero JS for static pages, minimal bundle | More setup for complex state sharing |
| **SvelteKit Full Hydration** | Natural Svelte stores, lightest full-hydration option (23–36 KB gz) | Pays for runtime on every page (unlike Astro) |
| **Nuxt Full Hydration** | Simple mental model, full Vue reactivity | 2–3× heavier than SvelteKit on every page |
| **Next.js Server Components** | Reduced component hydration, React ecosystem | Largest base runtime, complex model |

---

## Recommendations

| Use Case | Recommended Framework | Home Page JS | Static Page JS |
|----------|----------------------|--------------|----------------|
| Content sites, blogs | **Astro + Svelte** | ~26 KB | **0 KB** |
| Marketing sites (Vue) | **Astro + Vue** | ~48 KB | **0 KB** |
| Marketing sites (React) | **Astro + React** | ~64 KB | **0 KB** |
| Medium apps (Svelte) | **SvelteKit** | ~36 KB | ~23 KB |
| Apps needing Vue features | **Nuxt** | ~76 KB | ~77 KB |
| Apps needing React features | **Next.js** | ~141 KB | ~136 KB |

---

## Admin Page Analysis (Complex Reactivity)

This section tests the frameworks with a **complex admin panel** that requires shared state across multiple features:

### Admin Panel Features

- Data table with 151 Pokemon from PokeAPI
- Search with debounced input
- Multi-select type filters (18 types)
- Sorting by ID, name, HP, attack, defense, speed
- Pagination with configurable items per page
- Bulk selection with checkboxes
- Selected Pokemon stats summary (computed values)
- Export to CSV functionality
- Table/Grid view toggle

### Admin Page JavaScript Size

| App | Raw JS | Gzip JS | Notes |
|-----|--------|---------|-------|
| **astro-svelte-app** | 35 KB | **13 KB** | AdminPanel component + Svelte runtime |
| **sveltekit-app** | 75 KB | 28 KB | Svelte runtime + router + AdminPanel component |
| **astro-vue-app** | 95 KB | 38 KB | AdminPanel island + Vue runtime |
| **astro-react-app** | 160 KB | 51 KB | AdminPanel island + React runtime |
| **nuxt-app** | 195 KB | 74 KB | Full Vue + Nuxt framework |
| **nextjs-app** | 452 KB | 140 KB | Full React + Next.js framework |

### Key Insight: Astro's Islands Limitation

**For complex admin UIs, Astro requires a single large island component.**

```astro
<!-- Astro admin.astro -->
<!--
  In Astro, islands are ISOLATED - they cannot share state.
  For admin UIs with shared state (search, filters, table, selection),
  we must use ONE large island component.
-->
<AdminPanel client:load />
```

**Why?** Astro islands:
- Each island has its own isolated JavaScript context
- Cannot share state with other islands
- Cannot use Vue/React context across islands
- Best suited for independent interactive components

**SvelteKit/Nuxt/Next.js advantage for admin UIs:**
```svelte
<!-- SvelteKit: Components naturally share Svelte stores -->
<SearchBox />           <!-- Can access shared store -->
<TypeFilters />         <!-- Can access shared store -->
<PokemonTable />        <!-- Can access shared store -->
<SelectionSummary />    <!-- Can access shared store -->
```

**SvelteKit is the winner here**: same natural state sharing as Nuxt/Next.js, but **2.6× lighter than Nuxt** (28 KB vs 74 KB gz) and **5× lighter than Next.js** (28 KB vs 140 KB gz) on the admin page.

### Component Size Comparison

Even for complex admin panels, **Svelte's compiled output is smallest**:

| Framework | Component Code | Runtime | Total (gz) |
|-----------|---------------|---------|------------|
| Svelte | ~28 KB | ~7 KB | **13 KB gz** |
| Vue | ~11 KB | ~84 KB | **38 KB gz** |
| React | ~17 KB | ~143 KB | **51 KB gz** |

**Svelte's approach**: Reactivity compiles into the component itself, resulting in:
- Larger component files (includes all reactive logic)
- Tiny runtime (just hydration glue)
- Smallest total bundle

### Admin Page Trade-offs

| Approach | Pros | Cons |
|----------|------|------|
| **Astro + Svelte** | Smallest bundle (~13 KB gzip) | Complex state = single large component |
| **SvelteKit** | Code-splits cleanly (~28 KB gzip) | Pays for router on every page |
| **Astro + Vue** | Good balance (~38 KB gzip) | Islands cannot share Vue context |
| **Astro + React** | Familiar React (~51 KB gzip) | Islands cannot share React context |
| **Nuxt** | Natural state sharing | Larger bundle (~74 KB gzip) |
| **Next.js** | Full React ecosystem | Largest bundle (~140 KB gzip) |

### When to Use Each

| Scenario | Best Choice |
|----------|-------------|
| Admin panel with complex shared state | **SvelteKit**, **Nuxt**, or **Next.js** (natural state sharing via stores/context) |
| Admin panel where bundle size critical | **Astro + Svelte** (single island, 13 KB gz) or **SvelteKit** (28 KB gz) |
| Simple dashboards | **Astro** with separate islands |
| Full-featured web apps (Svelte) | **SvelteKit** (lightest full-hydration option) |
| Full-featured web apps (Vue) | **Nuxt** |
| Full-featured web apps (React) | **Next.js** |

---

## How to Run Benchmarks

```bash
# Build all apps
cd astro-vue-app && npm run build
cd ../astro-react-app && npm run build
cd ../astro-svelte-app && npm run build
cd ../nuxt-app && npm run build
cd ../nextjs-app && npm run build

# Measure total JS bundle size
find dist/_astro -name "*.js" -exec cat {} + | wc -c        # Astro apps
find .output/public/_nuxt -name "*.js" -exec cat {} + | wc -c  # Nuxt
find out/_next/static -name "*.js" -exec cat {} + | wc -c      # Next.js

# Measure gzip size
find dist/_astro -name "*.js" -exec cat {} + | gzip | wc -c   # Astro apps
```

---

## Conclusion

**Astro with Svelte** delivers the best performance, shipping only **26 KB (gzip) of JavaScript** on the home page, **zero JavaScript** on Pokemon detail pages, and **~13 KB** on complex admin pages — a **82% reduction** compared to Next.js.

### Per-Page Summary

| Page Type | Astro+Svelte | Astro+Vue | SvelteKit | Astro+React | Nuxt | Next.js |
|-----------|-------------|-----------|-----------|-------------|------|---------|
| Home (13 components) | 26 KB | 48 KB | 36 KB | 64 KB | 76 KB | 141 KB |
| Pokemon Detail (static) | **0 KB** | **0 KB** | **23 KB** | **0 KB** | 77 KB | 136 KB |
| Admin (complex state) | **13 KB** | 38 KB | **28 KB** | 51 KB | 74 KB | 140 KB |

### Key Takeaways

1. **For static content pages** (blogs, documentation, product pages): **Astro's islands architecture** delivers massive JavaScript savings by shipping zero JS.

2. **For complex interactive pages** (admin panels, dashboards): **SvelteKit is the clear winner among full-hydration frameworks** — natural state sharing (Svelte stores) at 28 KB gz, vs 74 KB Nuxt and 140 KB Next.js. Astro+Svelte is still lightest (13 KB gz) but requires a single monolithic island.

3. **For full-featured web apps** where natural state sharing across components matters: **SvelteKit** (Svelte), **Nuxt** (Vue), or **Next.js** (React). SvelteKit ships 2–5× less JS than the other two while offering the same developer experience for state management.

### The Full-Hydration Comparison

| Scenario | Astro | SvelteKit | Nuxt | Next.js |
|----------|-------|-----------|------|---------|
| Complex shared state | Harder (single island) | **Natural** (stores) | Natural | Natural |
| Static content pages | **Zero JS** | 23 KB gz | 77 KB gz | 136 KB gz |
| Complex app pages | N/A | **28 KB gz** | 74 KB gz | 140 KB gz |
| Bundle efficiency | Smallest | **Lightest full-hydration** | 2.6× heavier than SK | 5× heavier than SK |

**Bottom Line**: Choose Astro for content-heavy sites with occasional interactivity. Choose SvelteKit for complex apps that need natural state sharing — it ships 2–5× less JS than Nuxt or Next.js while offering the same developer experience.

