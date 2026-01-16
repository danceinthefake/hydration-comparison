export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  experimental: {
    noScripts: true
  },
  nitro: {
    prerender: {
      crawlLinks: false,
      routes: ['/'],
      failOnError: false
    }
  }
})
