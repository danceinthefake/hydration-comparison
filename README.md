# Hydration Comparison

A comparison of SSR hydration strategies across modern web frameworks, testing real-world interactive landing pages.

## Frameworks

| App | Stack | Port |
|-----|-------|------|
| [astro-vue-app](./astro-vue-app) | Astro + Vue | 4321 |
| [astro-react-app](./astro-react-app) | Astro + React | 4321 |
| [astro-svelte-app](./astro-svelte-app) | Astro + Svelte | 4321 |
| [nuxt-app](./nuxt-app) | Nuxt 3 | 3000 |
| [nextjs-app](./nextjs-app) | Next.js 14 | 3001 |

## Quick Start

```bash
# Install dependencies for all apps
cd astro-vue-app && npm install && cd ..
cd astro-react-app && npm install && cd ..
cd astro-svelte-app && npm install && cd ..
cd nuxt-app && npm install && cd ..
cd nextjs-app && npm install && cd ..
```

## Running Apps

### Development

```bash
# Astro + Vue
cd astro-vue-app && npm run dev

# Astro + React
cd astro-react-app && npm run dev

# Astro + Svelte
cd astro-svelte-app && npm run dev

# Nuxt
cd nuxt-app && npm run dev

# Next.js
cd nextjs-app && npm run dev
```

### Production

```bash
# Astro + Vue
cd astro-vue-app && npm run prod

# Astro + React
cd astro-react-app && npm run prod

# Astro + Svelte
cd astro-svelte-app && npm run prod

# Nuxt
cd nuxt-app && npm run prod

# Next.js
cd nextjs-app && npm run prod
```

## Interactive Features

All apps include the same interactive components:

- **Mobile Navigation** - Hamburger menu toggle
- **Stats Counter** - Animated numbers on scroll
- **Testimonial Carousel** - Auto-sliding with controls
- **FAQ Accordion** - Expandable questions
- **Contact Form** - Validation and submission
- **Back to Top** - Scroll-triggered button

## Results

| Framework | JS Bundle Size |
|-----------|---------------|
| Astro + Svelte | ~30KB |
| Astro + Vue | ~45KB |
| Astro + React | ~55KB |
| Nuxt | ~150KB |
| Next.js | ~200KB+ |

See [RESULTS.md](./RESULTS.md) for detailed analysis.

## Key Takeaways

1. **Astro's Islands Architecture** ships JS only for interactive components
2. **Svelte has the smallest runtime** among UI frameworks
3. **Next.js/Nuxt** require full framework hydration
4. **Choose based on interactivity needs** - more interactivity = less benefit from islands

## Project Structure

```
hydration-comparison/
├── astro-vue-app/          # Astro + Vue
│   └── src/components/     # Vue components (.vue)
├── astro-react-app/        # Astro + React
│   └── src/components/     # React components (.tsx)
├── astro-svelte-app/       # Astro + Svelte
│   └── src/components/     # Svelte components (.svelte)
├── nuxt-app/               # Nuxt 3
│   └── components/         # Vue components
├── nextjs-app/             # Next.js 14
│   └── components/         # React components
├── RESULTS.md              # Detailed comparison results
└── README.md               # This file
```

## Scripts Reference

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Serve production build |
| `npm run prod` | Build and serve production |

## License

MIT
