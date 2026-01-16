# SSR Hydration Comparison Results

## Overview

This project compares **hydration behavior** across different frameworks when building interactive landing pages with real-world features.

## Frameworks Tested

| App | Framework | UI Library | Hydration Strategy |
|-----|-----------|------------|-------------------|
| astro-vue-app | Astro 4 | Vue 3 | Islands (selective) |
| astro-react-app | Astro 4 | React 18 | Islands (selective) |
| astro-svelte-app | Astro 4 | Svelte 4 | Islands (selective) |
| nuxt-app | Nuxt 3 | Vue 3 | Full (configurable) |
| nextjs-app | Next.js 14 | React 18 | Full |

---

## Interactive Features Tested

All apps include the same 12 interactive components:

| Component | Reactivity |
|-----------|------------|
| Mobile Navigation | Toggle menu state |
| Stats Counter | Intersection Observer + animated counting |
| Testimonial Carousel | Auto-slide interval + manual controls |
| FAQ Accordion | Expand/collapse state |
| Contact Form | Form validation + submission |
| Back to Top | Scroll position listener |
| **Modal** | Portal rendering, ESC key, click outside |
| **Tabs** | Multiple state management, ARIA roles |
| **Image Lightbox** | Gallery with keyboard navigation |
| **Cookie Banner** | localStorage persistence |
| **Pricing Toggle** | Monthly/yearly computed values |
| **Search Box** | Debounced input, real-time filtering |

---

## Benchmark Results (Production Build)

### JavaScript Bundle Size

| App | Raw JS Size | Gzip Size | HTML Size |
|-----|-------------|-----------|-----------|
| **astro-svelte-app** | 60.6 KB | **21.2 KB** | 26.5 KB |
| **astro-vue-app** | 109.3 KB | 42.2 KB | 25.3 KB |
| **astro-react-app** | 194.5 KB | 57.7 KB | 50.9 KB |
| **nuxt-app** | 212.8 KB | 79.3 KB | SSR |
| **nextjs-app** | 735.5 KB | 218.1 KB | SSR |

### JavaScript Savings (vs Next.js)

| App | Reduction (Raw) | Reduction (Gzip) |
|-----|-----------------|------------------|
| astro-svelte-app | **91.8%** smaller | **90.3%** smaller |
| astro-vue-app | **85.1%** smaller | **80.6%** smaller |
| astro-react-app | **73.6%** smaller | **73.5%** smaller |
| nuxt-app | **71.1%** smaller | **63.6%** smaller |

---

## Detailed Bundle Analysis

### 1. Astro + Svelte (Best Performance)

```
dist/_astro/
├── client.js                    1.97 KB
├── BackToTop.js                 2.19 KB
├── CookieBanner.js              2.44 KB
├── StatsCounter.js              2.69 KB
├── MobileNav.js                 3.46 KB
├── FaqAccordion.js              3.57 KB
├── Modal.js                     3.97 KB
├── Tabs.js                      4.85 KB
├── TestimonialCarousel.js       5.10 KB
├── ImageLightbox.js             5.47 KB
├── PricingToggle.js             6.27 KB
├── index.js (shared)            6.73 KB
├── ContactForm.js               6.86 KB
└── SearchBox.js                 7.79 KB
────────────────────────────────────────
Total JS: 60.6 KB (21.2 KB gzip)
```

**Why smallest**: Svelte compiles to vanilla JS at build time - no runtime needed.

### 2. Astro + Vue

```
dist/_astro/
├── Vue runtime-core             70.07 KB
├── Vue runtime-dom              11.38 KB
├── Components (12 total)        ~28 KB
────────────────────────────────────────
Total JS: 109.3 KB (42.2 KB gzip)
```

**Note**: Vue runtime (~81 KB) is shared across all components via code splitting.

### 3. Astro + React

```
dist/_astro/
├── React runtime (client.js)    135.60 KB
├── Components (12 total)        ~59 KB
────────────────────────────────────────
Total JS: 194.5 KB (57.7 KB gzip)
```

**Note**: React runtime is larger than Vue, but still selective hydration.

### 4. Nuxt (Full Hydration)

```
.output/public/_nuxt/
├── Vue runtime                  ~90 KB
├── Nuxt framework               ~60 KB
├── Components + app             ~63 KB
────────────────────────────────────────
Total JS: 212.8 KB (79.3 KB gzip)
```

**Note**: Full page hydration - even static content is hydrated.

### 5. Next.js (Full Hydration)

```
out/_next/static/
├── React framework chunks       ~530 KB
├── Main bundle                  ~120 KB
├── Page + Components            ~85 KB
────────────────────────────────────────
Total JS: 735.5 KB (218.1 KB gzip)
```

**Note**: Largest bundle - React 18 with full hydration of all components.

---

## Hydration Strategies Compared

### Islands Architecture (Astro)

```html
<!-- Static - No JS shipped -->
<header>...</header>
<main>
  <section class="hero">...</section>      <!-- Static: 0 KB -->
  <section class="cards">...</section>     <!-- Static: 0 KB -->
</main>
<footer>...</footer>

<!-- Interactive Islands - Only these ship JS -->
<MobileNav client:load />                  <!-- Immediate hydration -->
<StatsCounter client:visible />            <!-- Lazy: hydrate when visible -->
<SearchBox client:visible />               <!-- Lazy -->
<Tabs client:visible />                    <!-- Lazy -->
<PricingToggle client:visible />           <!-- Lazy -->
<ImageLightbox client:visible />           <!-- Lazy -->
<Modal client:load />                      <!-- Immediate -->
<CookieBanner client:load />               <!-- Immediate -->
```

**Benefit**: Only 12 interactive components ship JavaScript. Static content = 0 JS.

### Full Hydration (Nuxt/Next.js)

```html
<!-- Everything hydrates, even static content -->
<div id="__nuxt">
  <header>...</header>       <!-- Hydrated -->
  <main>...</main>           <!-- Hydrated -->
  <footer>...</footer>       <!-- Hydrated -->
</div>
<script src="/_nuxt/entry.js"></script>  <!-- Full framework runtime -->
```

**Drawback**: Entire page requires JavaScript for hydration, even parts that never change.

---

## Key Findings

### 1. Runtime Size Matters

| Framework | Runtime Size |
|-----------|-------------|
| Svelte | ~0 KB (compiles away) |
| Vue 3 | ~81 KB |
| React 18 | ~136 KB |

### 2. Architecture Matters More

Even with the same UI library (React), Astro ships **73% less JavaScript** than Next.js because of selective hydration.

### 3. Lazy Loading (`client:visible`) Helps

Astro's `client:visible` directive defers hydration until components enter the viewport, improving initial load performance.

### 4. Trade-offs

| Approach | Pros | Cons |
|----------|------|------|
| **Astro Islands** | Minimal JS, fast initial load | More setup for complex state sharing |
| **Full Hydration** | Simpler mental model, full reactivity | Larger bundles, slower initial load |

---

## Recommendations

| Use Case | Recommended Framework | JS Bundle |
|----------|----------------------|-----------|
| Content sites with forms/carousels | **Astro + Svelte** | ~21 KB gzip |
| Marketing sites (Vue ecosystem) | **Astro + Vue** | ~42 KB gzip |
| Marketing sites (React ecosystem) | **Astro + React** | ~58 KB gzip |
| Apps needing Vue full features | **Nuxt** | ~79 KB gzip |
| Apps needing React full features | **Next.js** | ~218 KB gzip |

---

## How to Run Benchmarks

```bash
# Build all apps
cd astro-vue-app && npm run build
cd ../astro-react-app && npm run build
cd ../astro-svelte-app && npm run build
cd ../nuxt-app && npm run build
cd ../nextjs-app && npm run build

# Measure JS bundle size
find dist/_astro -name "*.js" -exec cat {} + | wc -c        # Astro apps
find .output/public/_nuxt -name "*.js" -exec cat {} + | wc -c  # Nuxt
find out/_next/static -name "*.js" -exec cat {} + | wc -c      # Next.js
```

---

## Conclusion

**Astro with Svelte** delivers the best performance for landing pages with interactive components, shipping only **21 KB (gzip) of JavaScript** - a **90% reduction** compared to Next.js.

**Astro's islands architecture** is the key differentiator - it allows mixing static and interactive content without shipping unnecessary JavaScript for static parts.

For the same 12 interactive components:
- **Astro + Svelte**: 21 KB gzip
- **Astro + Vue**: 42 KB gzip
- **Astro + React**: 58 KB gzip
- **Nuxt**: 79 KB gzip
- **Next.js**: 218 KB gzip

**Next.js and Nuxt** are better suited for highly interactive applications where full framework capabilities are needed across the entire page, but come with significantly larger bundle sizes.
