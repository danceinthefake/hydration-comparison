<script setup lang="ts">
useHead({
  title: 'Nuxt SSR - Hydration Test'
});

const cards = [
  { title: 'Fast Performance', description: 'Server-side rendering delivers content quickly to users with zero JavaScript overhead.' },
  { title: 'SEO Friendly', description: 'Search engines can easily crawl and index your fully-rendered HTML content.' },
  { title: 'Vue Powered', description: 'Full Vue 3 reactivity with optional hydration control via experimental flags.' },
];
</script>

<template>
  <div>
    <MobileNav site-name="Nuxt SSR" />

    <main>
      <section id="home" class="hero">
        <h1>Welcome to Nuxt</h1>
        <p>Testing zero hydration with Vue 3 and experimental noScripts</p>
        <a href="#features" class="cta-button">Explore Features</a>
      </section>

      <section id="features" class="cards">
        <h2>Why Zero Hydration?</h2>
        <div class="cards-grid">
          <AppCard
            v-for="card in cards"
            :key="card.title"
            :title="card.title"
            :description="card.description"
          />
        </div>
      </section>

      <StatsCounter />

      <TestimonialCarousel />

      <FaqAccordion />

      <ContactForm />
    </main>

    <AppFooter />

    <BackToTop />
  </div>
</template>

<style scoped>
main {
  min-height: calc(100vh - 200px);
}

.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
  padding: 6rem 2rem;
}

.hero h1 {
  font-size: 3.5rem;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.25rem;
  opacity: 0.9;
  margin-bottom: 2rem;
}

.cta-button {
  display: inline-block;
  padding: 1rem 2rem;
  background: white;
  color: #667eea;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: transform 0.3s, box-shadow 0.3s;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.cards {
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.cards h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #1a1a2e;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2.5rem;
  }
}
</style>
