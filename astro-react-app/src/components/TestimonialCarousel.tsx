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
      <style>{`
        .testimonials-section {
          padding: 4rem 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        .testimonials-section h2 {
          text-align: center;
          font-size: 2.5rem;
          margin-bottom: 2rem;
        }
        .carousel {
          display: flex;
          align-items: center;
          max-width: 800px;
          margin: 0 auto;
          gap: 1rem;
        }
        .carousel-container {
          flex: 1;
          overflow: hidden;
        }
        .carousel-track {
          display: flex;
          transition: transform 0.5s ease;
        }
        .testimonial-card {
          min-width: 100%;
          padding: 2rem;
          text-align: center;
        }
        .avatar {
          width: 60px;
          height: 60px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          font-weight: bold;
          font-size: 1.25rem;
        }
        .text {
          font-size: 1.2rem;
          line-height: 1.8;
          margin-bottom: 1.5rem;
          font-style: italic;
        }
        .author {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .name {
          font-weight: bold;
          font-size: 1.1rem;
        }
        .role {
          opacity: 0.8;
          font-size: 0.9rem;
        }
        .nav-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.25rem;
          transition: background 0.3s;
        }
        .nav-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        .dots {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1.5rem;
        }
        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid white;
          background: transparent;
          cursor: pointer;
          transition: background 0.3s;
        }
        .dot.active {
          background: white;
        }
        @media (max-width: 768px) {
          .nav-btn {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}
