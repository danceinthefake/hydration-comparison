'use client';

import { useState } from 'react';

const faqs = [
  {
    question: 'What is Zero Hydration?',
    answer: 'Zero hydration means the server renders HTML that works without any JavaScript. The page is fully functional immediately upon loading, with no client-side JavaScript needed to make it interactive.'
  },
  {
    question: 'Why does hydration matter for performance?',
    answer: 'Hydration requires downloading, parsing, and executing JavaScript before the page becomes interactive. Zero hydration eliminates this overhead, resulting in faster Time to Interactive (TTI) and better Core Web Vitals scores.'
  },
  {
    question: 'Can I still have interactive elements?',
    answer: 'Yes! You can use islands architecture to selectively hydrate only the components that need interactivity, while keeping the rest of the page as static HTML.'
  },
  {
    question: 'Which framework is best for zero hydration?',
    answer: 'Astro is designed from the ground up for zero hydration by default. Nuxt can achieve it with experimental flags. Next.js currently requires React runtime even for static content.'
  }
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="faq-section">
      <h2>Frequently Asked Questions</h2>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <button
              className="faq-question"
              onClick={() => toggle(index)}
              aria-expanded={openIndex === index}
            >
              <span>{faq.question}</span>
              <span className={`icon ${openIndex === index ? 'open' : ''}`}>+</span>
            </button>
            <div className={`faq-answer ${openIndex === index ? 'open' : ''}`}>
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
