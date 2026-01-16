<script setup lang="ts">
import { ref } from 'vue';

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

const openIndex = ref<number | null>(null);

const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index;
};
</script>

<template>
  <section id="faq" class="faq-section">
    <h2>Frequently Asked Questions</h2>
    <div class="faq-list">
      <div v-for="(faq, index) in faqs" :key="index" class="faq-item">
        <button
          class="faq-question"
          @click="toggle(index)"
          :aria-expanded="openIndex === index"
        >
          <span>{{ faq.question }}</span>
          <span :class="['icon', { open: openIndex === index }]">+</span>
        </button>
        <div :class="['faq-answer', { open: openIndex === index }]">
          <p>{{ faq.answer }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.faq-section {
  padding: 4rem 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.faq-section h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #1a1a2e;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.faq-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.faq-question {
  width: 100%;
  padding: 1.25rem;
  background: white;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 500;
  text-align: left;
  color: #1a1a2e;
  transition: background 0.3s;
}

.faq-question:hover {
  background: #f5f5f5;
}

.icon {
  font-size: 1.5rem;
  font-weight: 300;
  transition: transform 0.3s;
}

.icon.open {
  transform: rotate(45deg);
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease, padding 0.3s ease;
  background: #f9f9f9;
}

.faq-answer.open {
  max-height: 200px;
  padding: 1.25rem;
}

.faq-answer p {
  margin: 0;
  color: #555;
  line-height: 1.7;
}
</style>
