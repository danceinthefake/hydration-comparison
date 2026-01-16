import Card from '@/components/Card';
import Footer from '@/components/Footer';
import MobileNav from '@/components/MobileNav';
import FaqAccordion from '@/components/FaqAccordion';
import TestimonialCarousel from '@/components/TestimonialCarousel';
import StatsCounter from '@/components/StatsCounter';
import ContactForm from '@/components/ContactForm';
import BackToTop from '@/components/BackToTop';
import Modal from '@/components/Modal';
import Tabs from '@/components/Tabs';
import ImageLightbox from '@/components/ImageLightbox';
import CookieBanner from '@/components/CookieBanner';
import PricingToggle from '@/components/PricingToggle';
import SearchBox from '@/components/SearchBox';

const cards = [
  { title: 'Fast Performance', description: 'Server-side rendering delivers content quickly to users with zero JavaScript overhead.' },
  { title: 'SEO Friendly', description: 'Search engines can easily crawl and index your fully-rendered HTML content.' },
  { title: 'React Ecosystem', description: 'Full React 18 capabilities with Server Components and streaming SSR.' },
];

export default function Home() {
  return (
    <div className="app">
      <MobileNav siteName="Next.js SSR" />

      <main>
        <section id="home" className="hero">
          <h1>Welcome to Next.js</h1>
          <p>Testing hydration with React Server Components</p>
          <a href="#features" className="cta-button">Explore Features</a>
        </section>

        <section id="features" className="cards">
          <h2>Why Zero Hydration?</h2>
          <div className="cards-grid">
            {cards.map((card) => (
              <Card key={card.title} title={card.title} description={card.description} />
            ))}
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
    </div>
  );
}
