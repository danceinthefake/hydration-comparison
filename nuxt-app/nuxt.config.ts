export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  // Toggle noScripts to compare hydration behavior:
  // - true: Zero JS shipped (interactive features won't work)
  // - false: Full Vue hydration (interactive features work)
  experimental: {
    noScripts: false
  },
  nitro: {
    prerender: {
      crawlLinks: false,
      routes: ['/'],
      failOnError: false
    }
  }
})
