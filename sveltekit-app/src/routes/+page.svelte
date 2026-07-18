<script lang="ts">
  import MobileNav from '$lib/components/MobileNav.svelte';
  import StatsCounter from '$lib/components/StatsCounter.svelte';
  import SearchBox from '$lib/components/SearchBox.svelte';
  import Tabs from '$lib/components/Tabs.svelte';
  import TestimonialCarousel from '$lib/components/TestimonialCarousel.svelte';
  import PricingToggle from '$lib/components/PricingToggle.svelte';
  import ImageLightbox from '$lib/components/ImageLightbox.svelte';
  import FaqAccordion from '$lib/components/FaqAccordion.svelte';
  import Modal from '$lib/components/Modal.svelte';
  import ContactForm from '$lib/components/ContactForm.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import CookieBanner from '$lib/components/CookieBanner.svelte';
  import BackToTop from '$lib/components/BackToTop.svelte';

  const cards = [
    { title: 'Fast Performance', description: 'Server-side rendering delivers content quickly to users with minimal JavaScript overhead.' },
    { title: 'SEO Friendly', description: 'Search engines can easily crawl and index your fully-rendered HTML content.' },
    { title: 'SvelteKit Powered', description: 'Full Svelte reactivity with static pre-rendering via adapter-static for minimal JS bundles.' },
  ];
</script>

<svelte:head>
  <title>SvelteKit - Hydration Test</title>
</svelte:head>

<MobileNav siteName="SvelteKit" />

<main>
  <section id="home" class="hero">
    <h1>Welcome to SvelteKit</h1>
    <p>Testing static pre-rendering with SvelteKit adapter-static</p>
    <a href="#features" class="cta-button">Explore Features</a>
  </section>

  <section id="features" class="cards">
    <h2>Why SvelteKit?</h2>
    <div class="cards-grid">
      {#each cards as card}
        <div class="card">
          <h3>{card.title}</h3>
          <p>{card.description}</p>
        </div>
      {/each}
    </div>
  </section>

  <StatsCounter />

  <SearchBox />

  <Tabs />

  <TestimonialCarousel />

  <PricingToggle />

  <ImageLightbox />

  <FaqAccordion />

  <Modal />

  <ContactForm />
</main>

<Footer />

<CookieBanner />

<BackToTop />

<style>
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

  .card {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    transition: transform 0.3s, box-shadow 0.3s;
  }

  .card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }

  .card h3 {
    font-size: 1.25rem;
    margin-bottom: 0.75rem;
    color: #1a1a2e;
  }

  .card p {
    color: #666;
    line-height: 1.7;
  }

  @media (max-width: 768px) {
    .hero h1 {
      font-size: 2.5rem;
    }
  }
</style>
