# SSR Hydration Comparison: Astro vs Nuxt vs Next.js

## Overview

This comparison tests which framework can achieve **zero hydration** (no JavaScript sent to the client) for static SSR content.

## Results Summary

| Framework | Zero Hydration? | JavaScript Size | Total Build Size |
|-----------|-----------------|-----------------|------------------|
| **Astro** | YES | 0 bytes | 8KB |
| **Nuxt** | YES (with config) | 0 bytes | 56KB |
| **Next.js** | NO | 700KB | 764KB |

## Detailed Analysis

### Astro - Zero Hydration by Default

**Status: TRUE ZERO HYDRATION**

- No `<script>` tags in HTML output
- No JavaScript files generated
- Ships pure HTML + inline CSS
- Zero configuration needed

**HTML Output:**
- Clean, minimal HTML
- Scoped CSS with data attributes
- No framework runtime

**Configuration Used:**
```js
// astro.config.mjs
export default defineConfig({
  output: 'static'
});
```

---

### Nuxt - Zero Hydration with Configuration

**Status: TRUE ZERO HYDRATION (with experimental flag)**

- No `<script>` tags in HTML output
- No JavaScript files in final build
- Ships pure HTML + inline CSS
- Requires experimental configuration

**HTML Output:**
- Clean HTML with Vue scoped styles
- No Vue runtime included
- Has `<div id="__nuxt">` wrapper but no hydration scripts

**Configuration Used:**
```ts
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true,
  experimental: {
    noScripts: true
  }
});
```

**Note:** The build process still generates JS bundles (~172KB) during compilation, but they are not included in the final static output.

---

### Next.js - Cannot Achieve Zero Hydration

**Status: REQUIRES HYDRATION**

- Multiple `<script>` tags in HTML output
- 700KB of JavaScript files
- React runtime always included
- Server Components reduce but don't eliminate JS

**JavaScript Bundles Included:**
| File | Size |
|------|------|
| framework-*.js | 137KB |
| fd9d1056-*.js | 169KB |
| 117-*.js | 122KB |
| main-*.js | 114KB |
| polyfills-*.js | 110KB |
| Other chunks | ~48KB |

**HTML Output Contains:**
- Multiple `<script>` tags loading React runtime
- RSC (React Server Components) payload as inline JSON
- Hydration bootstrap code

**Configuration Used:**
```js
// next.config.js
const nextConfig = {
  output: 'export'
};
```

**Why Next.js Can't Achieve Zero Hydration:**
1. React requires client-side hydration to attach event listeners
2. RSC payload is embedded for potential client-side navigation
3. Framework architecture assumes JavaScript will run on client
4. Even pure Server Components ship the React runtime

---

## Recommendations

### Use Astro When:
- Building content-focused websites (blogs, docs, marketing sites)
- SEO and performance are top priorities
- Interactivity is minimal or can be islands-based
- You want zero hydration by default

### Use Nuxt When:
- You need Vue ecosystem compatibility
- Building apps that may need interactivity later
- Want the option to toggle between zero-JS and full hydration
- Team is familiar with Vue

### Use Next.js When:
- Building highly interactive applications
- Need React ecosystem and component libraries
- Client-side navigation and state management are important
- Accepting ~87KB minimum JS payload is acceptable

---

## Test Website Structure

All three frameworks render the same content:
- Header with navigation
- Hero section with gradient background
- 3 feature cards
- Footer with copyright

**Components:**
- Header (site name + nav links)
- Card (title + description)
- Footer (year + copyright)

---

## How to Run

```bash
# Astro
cd astro-app
npm install
npm run build
npm run preview

# Nuxt
cd nuxt-app
npm install
npm run generate
npx serve .output/public

# Next.js
cd nextjs-app
npm install
npm run build
npx serve out
```

---

## Conclusion

**Astro** is the clear winner for zero hydration scenarios. It's designed with this use case in mind and requires no special configuration.

**Nuxt** is a viable alternative if you need Vue compatibility, but requires enabling an experimental feature.

**Next.js** is not suitable for zero hydration requirements. Choose it only when you need React's full capabilities and accept the JavaScript overhead.
