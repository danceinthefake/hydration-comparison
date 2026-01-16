<script setup lang="ts">
import { ref, onMounted } from 'vue';

const stats = [
  { value: 98, suffix: '%', label: 'Lighthouse Score' },
  { value: 0, suffix: 'KB', label: 'JavaScript Shipped' },
  { value: 50, suffix: 'ms', label: 'Time to Interactive' },
  { value: 100, suffix: '%', label: 'SEO Optimized' }
];

const counters = ref(stats.map(() => 0));
const hasAnimated = ref(false);

const animateCounters = () => {
  if (hasAnimated.value) return;
  hasAnimated.value = true;

  stats.forEach((stat, index) => {
    const duration = 2000;
    const steps = 60;
    const increment = stat.value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= stat.value) {
        counters.value[index] = stat.value;
        clearInterval(timer);
      } else {
        counters.value[index] = Math.floor(current);
      }
    }, duration / steps);
  });
};

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        animateCounters();
        observer.disconnect();
      }
    },
    { threshold: 0.5 }
  );

  const element = document.getElementById('stats-section');
  if (element) observer.observe(element);
});
</script>

<template>
  <section id="stats-section" class="stats-section">
    <h2>Performance Metrics</h2>
    <div class="stats-grid">
      <div v-for="(stat, index) in stats" :key="index" class="stat-item">
        <div class="stat-value">
          {{ counters[index] }}<span class="suffix">{{ stat.suffix }}</span>
        </div>
        <div class="stat-label">{{ stat.label }}</div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.stats-section {
  padding: 4rem 2rem;
  background: #1a1a2e;
  color: white;
}

.stats-section h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.stat-item {
  text-align: center;
  padding: 1.5rem;
}

.stat-value {
  font-size: 3.5rem;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 0.5rem;
}

.suffix {
  font-size: 1.5rem;
  opacity: 0.8;
}

.stat-label {
  font-size: 1.1rem;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 1px;
}

@media (max-width: 768px) {
  .stat-value {
    font-size: 2.5rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
