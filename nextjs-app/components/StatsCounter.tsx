'use client';

import { useState, useEffect, useRef } from 'react';

const stats = [
  { value: 98, suffix: '%', label: 'Lighthouse Score' },
  { value: 0, suffix: 'KB', label: 'JavaScript Shipped' },
  { value: 50, suffix: 'ms', label: 'Time to Interactive' },
  { value: 100, suffix: '%', label: 'SEO Optimized' }
];

export default function StatsCounter() {
  const [counters, setCounters] = useState(stats.map(() => 0));
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCounters();
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateCounters = () => {
    stats.forEach((stat, index) => {
      const duration = 2000;
      const steps = 60;
      const increment = stat.value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= stat.value) {
          setCounters((prev) => {
            const newCounters = [...prev];
            newCounters[index] = stat.value;
            return newCounters;
          });
          clearInterval(timer);
        } else {
          setCounters((prev) => {
            const newCounters = [...prev];
            newCounters[index] = Math.floor(current);
            return newCounters;
          });
        }
      }, duration / steps);
    });
  };

  return (
    <section ref={sectionRef} className="stats-section">
      <h2>Performance Metrics</h2>
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-item">
            <div className="stat-value">
              {counters[index]}<span className="suffix">{stat.suffix}</span>
            </div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
