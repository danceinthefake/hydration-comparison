import Header from '@/components/Header';
import Card from '@/components/Card';
import Footer from '@/components/Footer';

const cards = [
  { title: 'Fast Performance', description: 'Server-side rendering delivers content quickly to users.' },
  { title: 'SEO Friendly', description: 'Search engines can easily crawl and index your content.' },
  { title: 'Zero JavaScript', description: 'Static content requires no client-side JavaScript.' },
];

export default function Home() {
  return (
    <div className="app">
      <Header siteName="Next.js SSR" />
      <main>
        <section className="hero">
          <h1>Welcome to Next.js</h1>
          <p>Testing zero hydration with server-side rendering</p>
        </section>
        <section className="cards">
          {cards.map((card) => (
            <Card key={card.title} title={card.title} description={card.description} />
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
