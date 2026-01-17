# SSR Hydration Comparison Results

## Overview

This project compares **hydration behavior** across different frameworks when building interactive landing pages with real-world features, including a Pokemon search with detail pages using PokeAPI.

## Frameworks Tested

| App | Framework | UI Library | Hydration Strategy |
|-----|-----------|------------|-------------------|
| astro-vue-app | Astro 4 | Vue 3 | Islands (selective) |
| astro-react-app | Astro 4 | React 18 | Islands (selective) |
| astro-svelte-app | Astro 4 | Svelte 4 | Islands (selective) |
| nuxt-app | Nuxt 3 | Vue 3 | Full (configurable) |
| nextjs-app | Next.js 14 | React 18 | Full + Server Components |

---

## Interactive Features Tested

All apps include the same 12 interactive components + Pokemon pages:

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

### Total JavaScript Bundle Size

| App | Raw JS Size | Gzip Size |
|-----|-------------|-----------|
| **astro-svelte-app** | 60.1 KB | **21.2 KB** |
| **astro-vue-app** | 108.8 KB | 42.0 KB |
| **astro-react-app** | 193.9 KB | 57.6 KB |
| **nuxt-app** | 230.9 KB | 86.2 KB |
| **nextjs-app** | 762.4 KB | 226.5 KB |

### JavaScript Savings (vs Next.js)

| App | Reduction (Raw) | Reduction (Gzip) |
|-----|-----------------|------------------|
| astro-svelte-app | **92.1%** smaller | **90.6%** smaller |
| astro-vue-app | **85.7%** smaller | **81.5%** smaller |
| astro-react-app | **74.6%** smaller | **74.6%** smaller |
| nuxt-app | **69.7%** smaller | **61.9%** smaller |

---

## Per-Page JavaScript Analysis

This is where the **real difference** becomes visible. Different pages load different amounts of JavaScript.

### Home Page (12 Interactive Components)

| App | Raw JS | Gzip JS | Notes |
|-----|--------|---------|-------|
| **astro-svelte-app** | 60.1 KB | 21.2 KB | Only component JS, no runtime |
| **astro-vue-app** | 108.8 KB | 42.0 KB | Vue runtime + components |
| **astro-react-app** | 193.9 KB | 57.6 KB | React runtime + components |
| **nuxt-app** | 200.5 KB | 74.9 KB | Full Vue + Nuxt framework |
| **nextjs-app** | 475.9 KB | 139.5 KB | Full React + Next.js framework |

### Pokemon Detail Page (Static Content)

| App | Raw JS | Gzip JS | Notes |
|-----|--------|---------|-------|
| **astro-svelte-app** | **0 KB** | **0 KB** | Pure static HTML |
| **astro-vue-app** | **0 KB** | **0 KB** | Pure static HTML |
| **astro-react-app** | **0 KB** | **0 KB** | Pure static HTML |
| **nuxt-app** | 200.5 KB | 74.9 KB | Same JS as home (full hydration) |
| **nextjs-app** | 440.3 KB | 134.0 KB | Server Component reduces page JS |

### Key Insight

- **Astro apps**: Pokemon detail pages are **pure static HTML** with **zero JavaScript**
- **Nuxt**: Loads the **same JS bundle on every page** because of full hydration
- **Next.js**: Server Components help, but still loads **134 KB gzip** for static content

---

## Detailed Bundle Analysis

### 1. Astro + Svelte (Best Performance)

```
dist/_astro/
├── client.js                    1.97 KB
├── BackToTop.js                 0.93 KB
├── CookieBanner.js              1.71 KB
├── StatsCounter.js              1.55 KB
├── MobileNav.js                 2.00 KB
├── FaqAccordion.js              1.98 KB
├── Modal.js                     2.12 KB
├── Tabs.js                      2.00 KB
├── TestimonialCarousel.js       2.11 KB
├── ImageLightbox.js             2.50 KB
├── PricingToggle.js             2.24 KB
├── SearchBox.js                 2.73 KB
├── ContactForm.js               2.78 KB
└── index.js (shared)            6.73 KB
────────────────────────────────────────
Total JS: 60.1 KB (21.2 KB gzip)
```

**Why smallest**: Svelte compiles to vanilla JS at build time - no runtime needed.

### 2. Astro + Vue

```
dist/_astro/
├── Vue runtime-core             70.07 KB
├── Vue runtime-dom              11.38 KB
├── client.js                    1.04 KB
├── Components (12 total)        ~26 KB
────────────────────────────────────────
Total JS: 108.8 KB (42.0 KB gzip)
```

**Note**: Vue runtime (~81 KB) is shared across all components via code splitting.

### 3. Astro + React

```
dist/_astro/
├── React runtime (client.js)    135.60 KB
├── Components (12 total)        ~58 KB
────────────────────────────────────────
Total JS: 193.9 KB (57.6 KB gzip)
```

**Note**: React runtime is larger than Vue, but still selective hydration.

### 4. Nuxt (Full Hydration)

```
.output/public/_nuxt/
├── Vue runtime                  ~90 KB
├── Nuxt framework               ~70 KB
├── Components + app             ~71 KB
────────────────────────────────────────
Total JS: 230.9 KB (86.2 KB gzip)
```

**Note**: Full page hydration - same JS loads on EVERY page, including Pokemon detail.

### 5. Next.js (Full Hydration + Server Components)

```
out/_next/static/
├── framework.js                 139.98 KB
├── main.js                      116.39 KB
├── polyfills.js                 112.59 KB
├── fd9d1056.js (React DOM)      172.83 KB
├── chunks (various)             ~220 KB
────────────────────────────────────────
Total JS: 762.4 KB (226.5 KB gzip)
```

**Note**: Largest total bundle, but Server Components reduce per-page JS on Pokemon detail.

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

| Scenario | Astro | Nuxt | Next.js |
|----------|-------|------|---------|
| Home (complex) | 21-58 KB | 75 KB | 140 KB |
| Pokemon (static) | **0 KB** | 75 KB | 134 KB |

**Astro wins big on static content pages** - no JavaScript at all.

### 4. Nuxt Loads Same JS Everywhere

Nuxt's full hydration means:
- Home page: 75 KB gzip
- Pokemon page: 75 KB gzip
- Contact page: 75 KB gzip

Every page pays the same JavaScript cost, even for purely static content.

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
| **Nuxt Full Hydration** | Simple mental model, full Vue reactivity | Same large bundle on every page |
| **Next.js Server Components** | Reduced component hydration, React ecosystem | Large base runtime, complex model |

---

## Recommendations

| Use Case | Recommended Framework | Home Page JS | Static Page JS |
|----------|----------------------|--------------|----------------|
| Content sites, blogs | **Astro + Svelte** | ~21 KB | **0 KB** |
| Marketing sites (Vue) | **Astro + Vue** | ~42 KB | **0 KB** |
| Marketing sites (React) | **Astro + React** | ~58 KB | **0 KB** |
| Apps needing Vue features | **Nuxt** | ~75 KB | ~75 KB |
| Apps needing React features | **Next.js** | ~140 KB | ~134 KB |

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

| App | Admin Component | Runtime | Total Gzip |
|-----|-----------------|---------|------------|
| **astro-svelte-app** | 8.9 KB | 2.9 KB | **~12 KB** |
| **astro-vue-app** | 3.8 KB | 33.5 KB | **~37 KB** |
| **astro-react-app** | 4.4 KB | 46.4 KB | **~50 KB** |
| **nuxt-app** | N/A | Full bundle | **~92 KB** |
| **nextjs-app** | ~12 KB | Full bundle | **~100 KB** |

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

**Nuxt/Next.js advantage for admin UIs:**
```vue
<!-- Nuxt: Components naturally share state -->
<SearchBox />           <!-- Can access shared store -->
<TypeFilters />         <!-- Can access shared store -->
<PokemonTable />        <!-- Can access shared store -->
<SelectionSummary />    <!-- Can access shared store -->
```

### Component Size Comparison

Even for complex admin panels, **Svelte's compiled output is smallest**:

| Framework | Component Code | Runtime | Total |
|-----------|---------------|---------|-------|
| Svelte | 26.8 KB | 7.0 KB | **33.8 KB** |
| Vue | 10.3 KB | 83.6 KB | **93.9 KB** |
| React | 17.2 KB | 142.3 KB | **159.5 KB** |

**Svelte's approach**: Reactivity compiles into the component itself, resulting in:
- Larger component files (includes all reactive logic)
- Tiny runtime (just hydration glue)
- Smallest total bundle

### Admin Page Trade-offs

| Approach | Pros | Cons |
|----------|------|------|
| **Astro + Svelte** | Smallest bundle (~12 KB gzip) | Complex state = single large component |
| **Astro + Vue** | Good balance (~37 KB gzip) | Islands cannot share Vue context |
| **Astro + React** | Familiar React (~50 KB gzip) | Islands cannot share React context |
| **Nuxt** | Natural state sharing | Larger bundle (~92 KB gzip) |
| **Next.js** | Full React ecosystem | Largest bundle (~100 KB gzip) |

### When to Use Each

| Scenario | Best Choice |
|----------|-------------|
| Admin panel with complex shared state | **Nuxt** or **Next.js** (natural state sharing) |
| Admin panel where bundle size critical | **Astro + Svelte** (single island) |
| Simple dashboards | **Astro** with separate islands |
| Full-featured web apps | **Nuxt** or **Next.js** |

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

**Astro with Svelte** delivers the best performance, shipping only **21 KB (gzip) of JavaScript** on the home page, **zero JavaScript** on Pokemon detail pages, and **~12 KB** on complex admin pages - a **90% reduction** compared to Next.js.

### Per-Page Summary

| Page Type | Astro + Svelte | Astro + Vue | Nuxt | Next.js |
|-----------|----------------|-------------|------|---------|
| Home (12 components) | 21 KB | 42 KB | 75 KB | 140 KB |
| Pokemon Detail (static) | **0 KB** | **0 KB** | 75 KB | 134 KB |
| Admin (complex state) | **12 KB** | 37 KB | 92 KB | 100 KB |

### Key Takeaways

1. **For static content pages** (blogs, documentation, product pages): **Astro's islands architecture** delivers massive JavaScript savings by shipping zero JS.

2. **For complex interactive pages** (admin panels, dashboards): **Astro still wins on bundle size**, but requires bundling shared state into a single island component.

3. **For full-featured web apps** where development experience matters more than bundle size: **Nuxt or Next.js** provide natural state sharing across components.

### The Astro Islands Trade-off

| Scenario | Astro | Nuxt/Next.js |
|----------|-------|--------------|
| Multiple independent interactive components | Easy (multiple islands) | Standard |
| Complex shared state across components | Harder (single large island) | Natural |
| Static content pages | **Zero JS** | Always loads runtime |
| Bundle size | Smallest | Larger |

**Bottom Line**: Choose Astro for content-heavy sites with occasional interactivity. Choose Nuxt/Next.js for application-heavy sites where every page needs complex reactivity.

---

## E-commerce Recommendation (WooCommerce Replacement)

If you're looking to replace WooCommerce with a modern JavaScript framework, here's our comprehensive analysis based on the benchmark results.

### E-commerce Requirements

A complete e-commerce platform needs:

| Feature | Description | State Complexity |
|---------|-------------|------------------|
| Product catalog | Browse products by category | Low (static) |
| Product detail | View product info, images, variants | Low (static) |
| Search | Find products with filters | Medium |
| Shopping cart | Add/remove items, persist across pages | **High (shared state)** |
| Wishlist | Save products for later | Medium |
| Checkout | Multi-step form, payment integration | **High (complex forms)** |
| User accounts | Login, register, order history | **High (auth state)** |
| Admin panel | Inventory, orders, customers CRUD | **High (complex state)** |

---

### Framework Comparison for E-commerce

#### 1. Astro + Svelte

| Aspect | Details |
|--------|---------|
| **Bundle Size** | ~12-21 KB gzip (smallest) |
| **Product Pages** | 0 KB JS (pure static HTML) |
| **Admin Page** | ~12 KB gzip |

**Pros:**
- Smallest JavaScript bundle by far
- Product pages load instantly (0 KB JS)
- Excellent Core Web Vitals scores
- Best for SEO on product pages
- Svelte compiles away runtime overhead

**Cons:**
- **Islands cannot share state** - cart in header can't communicate with add-to-cart button
- Need workarounds for cart persistence (localStorage + custom events)
- Smaller ecosystem, fewer e-commerce integrations
- Team needs to learn Svelte
- Complex checkout flow requires single large component
- No built-in auth solution

**E-commerce Workarounds Required:**
```javascript
// Cart state sharing between islands requires manual sync
// Island 1: Add to Cart button
localStorage.setItem('cart', JSON.stringify(cart));
window.dispatchEvent(new CustomEvent('cart-updated'));

// Island 2: Cart icon in header
window.addEventListener('cart-updated', () => {
  cart = JSON.parse(localStorage.getItem('cart'));
});
```

**Verdict:** Best performance, but significant architectural complexity for e-commerce shared state.

---

#### 2. Astro + Vue

| Aspect | Details |
|--------|---------|
| **Bundle Size** | ~37-42 KB gzip |
| **Product Pages** | 0 KB JS (pure static HTML) |
| **Admin Page** | ~37 KB gzip |

**Pros:**
- Zero JS on static product pages
- Vue's familiar reactivity model
- Smaller than React runtime
- Good performance vs full hydration frameworks
- Can use Vue ecosystem libraries within islands

**Cons:**
- **Islands still cannot share Vue context/Pinia store**
- Same cart state sharing problem as Astro + Svelte
- Vue runtime (~33 KB) loaded per island group
- Need workarounds for global state
- No built-in routing for SPA-like navigation

**Verdict:** Good balance, but still has islands state sharing limitation.

---

#### 3. Astro + React

| Aspect | Details |
|--------|---------|
| **Bundle Size** | ~50-58 KB gzip |
| **Product Pages** | 0 KB JS (pure static HTML) |
| **Admin Page** | ~50 KB gzip |

**Pros:**
- Zero JS on static product pages
- Largest ecosystem (most UI libraries, payment integrations)
- Team likely already knows React
- Many e-commerce components available

**Cons:**
- **Islands cannot share React context**
- Largest runtime among Astro options (~46 KB)
- Same state sharing workarounds needed
- React's bundle size negates some Astro benefits
- No built-in auth, need third-party solutions

**Verdict:** Familiar ecosystem but largest Astro bundle, still has islands limitation.

---

#### 4. Nuxt 3

| Aspect | Details |
|--------|---------|
| **Bundle Size** | ~75-92 KB gzip |
| **Product Pages** | ~75 KB gzip (same as all pages) |
| **Admin Page** | ~92 KB gzip |

**Pros:**
- **Natural state sharing across ALL components** (Pinia, composables)
- Cart state works everywhere without workarounds
- Built-in routing with automatic code splitting
- Excellent SSR/SSG for SEO
- Good e-commerce integrations (Medusa, Saleor, Shopify Storefront API)
- Built-in useFetch for API calls
- Middleware for auth protection
- **46% smaller than Next.js**
- Vue's intuitive reactivity for complex forms
- Nuxt DevTools for debugging
- Simpler mental model than React Server Components

**Cons:**
- Same JS bundle loads on every page (no 0 KB pages)
- Larger than Astro options
- Smaller ecosystem than React/Next.js
- Fewer developers know Vue vs React

**Cart state sharing (natural):**
```vue
<!-- Header component -->
<template>
  <span>Cart: {{ cartStore.itemCount }}</span>
</template>
<script setup>
const cartStore = useCartStore(); // Just works everywhere
</script>

<!-- Product page -->
<template>
  <button @click="cartStore.addItem(product)">Add to Cart</button>
</template>
<script setup>
const cartStore = useCartStore(); // Same store, shared state
</script>
```

**Verdict:** Best balance of performance, developer experience, and e-commerce suitability.

---

#### 5. Next.js 14

| Aspect | Details |
|--------|---------|
| **Bundle Size** | ~100-140 KB gzip |
| **Product Pages** | ~134 KB gzip |
| **Admin Page** | ~100 KB gzip |

**Pros:**
- **Largest ecosystem** - most e-commerce solutions available
- Vercel's e-commerce templates (Shopify, Swell, BigCommerce)
- Server Components reduce some hydration
- Built-in image optimization
- Excellent TypeScript support
- Most developers know React
- Vercel deployment is seamless
- Built-in API routes for backend

**Cons:**
- **Largest JavaScript bundle** (87% larger than Nuxt)
- Server Components add mental complexity
- 'use client' vs server component decisions
- Hydration mismatch errors common
- Still loads ~134 KB on static product pages
- More complex than Nuxt for same features

**Verdict:** Best ecosystem but largest bundle and added complexity.

---

### Side-by-Side Comparison

| Criteria | Astro+Svelte | Astro+Vue | Astro+React | Nuxt | Next.js |
|----------|--------------|-----------|-------------|------|---------|
| **Product Page JS** | 0 KB | 0 KB | 0 KB | 75 KB | 134 KB |
| **Admin Page JS** | 12 KB | 37 KB | 50 KB | 92 KB | 100 KB |
| **Cart State Sharing** | ❌ Workaround | ❌ Workaround | ❌ Workaround | ✅ Natural | ✅ Natural |
| **Checkout Complexity** | Hard | Hard | Hard | Easy | Easy |
| **Auth Integration** | Manual | Manual | Manual | Built-in | Built-in |
| **E-commerce Ecosystem** | Limited | Limited | Good | Good | Best |
| **Learning Curve** | High | Medium | Medium | Low | Medium |
| **Deployment** | Simple | Simple | Simple | Simple | Simple |
| **SEO** | Excellent | Excellent | Excellent | Excellent | Excellent |
| **Core Web Vitals** | Best | Great | Good | Good | Average |

---

### The Critical E-commerce Problem: Shared Cart State

This is why Astro struggles for e-commerce:

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER (Island 1)                                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Logo    Search    [Cart Icon: 3 items]  [Account]  │   │
│  └─────────────────────────────────────────────────────┘   │
│                           ↑                                 │
│                    How does this                            │
│                    know about items?                        │
│                           ↓                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  PRODUCT CARD (Island 2)                             │   │
│  │  ┌─────────┐                                         │   │
│  │  │  Image  │  Product Name                           │   │
│  │  │         │  $99.00                                 │   │
│  │  └─────────┘  [Add to Cart] ← Adds item              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ❌ In Astro: These islands CANNOT share state directly     │
│  ✅ In Nuxt/Next: Components naturally share store/context  │
└─────────────────────────────────────────────────────────────┘
```

---

### Final Recommendation

#### 🏆 **RECOMMENDED: Nuxt 3**

**Strong Reasons:**

1. **Natural State Sharing (Most Important)**
   - Cart, wishlist, user session work across all components without workarounds
   - No localStorage hacks or custom events needed
   - Pinia stores are reactive everywhere
   - This alone saves weeks of development time

2. **46% Smaller Than Next.js**
   - ~75 KB vs ~140 KB on product pages
   - Significant performance advantage over main competitor
   - Better Core Web Vitals = better SEO ranking

3. **Simpler Mental Model**
   - No Server Components vs Client Components confusion
   - No 'use client' directives to manage
   - No hydration mismatch debugging
   - Vue's reactivity is more intuitive than React hooks

4. **E-commerce Ready**
   - Built-in useFetch for API calls
   - Built-in middleware for auth guards
   - Good integrations: Medusa, Saleor, Shopify Storefront API
   - Auto-imports reduce boilerplate

5. **Acceptable Bundle Size Trade-off**
   - 75 KB loads in <100ms on 3G
   - Cached after first page visit
   - Users browse multiple pages anyway
   - Performance difference imperceptible to users

6. **Lower Development Cost**
   - Single codebase
   - Simple deployment
   - Less architectural decisions
   - Faster time to market

#### When to Choose Others

| Choose This | If You Have |
|-------------|-------------|
| **Astro + Svelte** | <100 products, minimal cart needs, performance-obsessed |
| **Astro + Vue** | Mostly static catalog, cart on separate subdomain |
| **Astro + React** | Static catalog + existing React component library |
| **Next.js** | Must use React, need Vercel ecosystem, team knows React only |

#### When NOT to Choose Nuxt

- Team only knows React and won't learn Vue
- Must integrate with Shopify Hydrogen (React-only)
- Already have significant React codebase to reuse

---

### Summary Table

| Framework | Bundle Size | State Sharing | E-commerce Ready | Recommendation |
|-----------|-------------|---------------|------------------|----------------|
| Astro+Svelte | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐ | Small static stores |
| Astro+Vue | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐ | Static catalog only |
| Astro+React | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | Static + React libs |
| **Nuxt** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | **Most e-commerce** |
| Next.js | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | React-only teams |

---

### Bottom Line

**For WooCommerce replacement, use Nuxt 3.**

The ~75 KB JavaScript overhead is a worthwhile trade-off for:
- Natural cart/checkout state management
- Simpler development experience
- 46% smaller bundle than Next.js
- Faster time to market
- Lower long-term maintenance cost

Astro's 0 KB product pages are impressive, but the architectural complexity of managing e-commerce state across islands will cost more in development time than the performance benefit provides.

**Choose simplicity. Choose Nuxt.**
