'use client';

import { useState, useEffect } from 'react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Frontend Developer',
    text: 'Switching to zero hydration improved our Lighthouse score from 65 to 98. The performance gains are incredible!',
    avatar: 'SJ'
  },
  {
    name: 'Michael Chen',
    role: 'Tech Lead',
    text: 'Our e-commerce site saw a 40% reduction in bounce rate after eliminating unnecessary JavaScript hydration.',
    avatar: 'MC'
  },
  {
    name: 'Emily Davis',
    role: 'Performance Engineer',
    text: 'Zero hydration is a game-changer for content-heavy sites. Our TTI dropped from 4.2s to under 1s.',
    avatar: 'ED'
  },
  {
    name: 'Alex Thompson',
    role: 'Startup Founder',
    text: 'We chose Astro for our marketing site and have never looked back. Zero JS means zero problems!',
    avatar: 'AT'
  }
];

export default function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goTo = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="testimonials" className="testimonials-section">
      <h2>What Developers Say</h2>
      <div className="carousel">
        <button className="nav-btn prev" onClick={prev} aria-label="Previous testimonial">
          &lt;
        </button>
        <div className="carousel-container">
          <div
            className="carousel-track"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="avatar">{testimonial.avatar}</div>
                <p className="text">&ldquo;{testimonial.text}&rdquo;</p>
                <div className="author">
                  <span className="name">{testimonial.name}</span>
                  <span className="role">{testimonial.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button className="nav-btn next" onClick={next} aria-label="Next testimonial">
          &gt;
        </button>
      </div>
      <div className="dots">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`dot ${currentIndex === index ? 'active' : ''}`}
            onClick={() => goTo(index)}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
