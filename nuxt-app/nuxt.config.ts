export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  experimental: {
    noScripts: false
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/'],
      failOnError: false
    }
  },
  hooks: {
    async 'nitro:config'(nitroConfig) {
      const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
      const data = await res.json();
      const pokemonRoutes = data.results.map((p: { name: string }) => `/pokemon/${p.name}`);
      nitroConfig.prerender = nitroConfig.prerender ?? {};
      nitroConfig.prerender.routes = [
        ...(nitroConfig.prerender.routes ?? []),
        ...pokemonRoutes,
      ];
    },
  },
})
