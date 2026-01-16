<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const images = [
  { id: 1, src: 'https://picsum.photos/seed/1/600/400', thumb: 'https://picsum.photos/seed/1/300/200', alt: 'Nature landscape' },
  { id: 2, src: 'https://picsum.photos/seed/2/600/400', thumb: 'https://picsum.photos/seed/2/300/200', alt: 'City skyline' },
  { id: 3, src: 'https://picsum.photos/seed/3/600/400', thumb: 'https://picsum.photos/seed/3/300/200', alt: 'Mountain view' },
  { id: 4, src: 'https://picsum.photos/seed/4/600/400', thumb: 'https://picsum.photos/seed/4/300/200', alt: 'Ocean sunset' },
  { id: 5, src: 'https://picsum.photos/seed/5/600/400', thumb: 'https://picsum.photos/seed/5/300/200', alt: 'Forest path' },
  { id: 6, src: 'https://picsum.photos/seed/6/600/400', thumb: 'https://picsum.photos/seed/6/300/200', alt: 'Desert dunes' },
];

const isOpen = ref(false);
const isMounted = ref(false);
const currentIndex = ref(0);

const openLightbox = (index: number) => {
  currentIndex.value = index;
  isOpen.value = true;
  if (typeof document !== 'undefined') {
    document.body.style.overflow = 'hidden';
  }
};

const closeLightbox = () => {
  isOpen.value = false;
  if (typeof document !== 'undefined') {
    document.body.style.overflow = '';
  }
};

const next = () => {
  currentIndex.value = (currentIndex.value + 1) % images.length;
};

const prev = () => {
  currentIndex.value = (currentIndex.value - 1 + images.length) % images.length;
};

const handleKeydown = (e: KeyboardEvent) => {
  if (!isOpen.value) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') next();
  if (e.key === 'ArrowLeft') prev();
};

onMounted(() => {
  isMounted.value = true;
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
  if (typeof document !== 'undefined') {
    document.body.style.overflow = '';
  }
});
</script>

<template>
  <section class="lightbox-section">
    <h2>Image Gallery</h2>
    <p>Click any image to open lightbox. Use arrow keys to navigate.</p>
    <div class="gallery-grid">
      <button
        v-for="(image, index) in images"
        :key="image.id"
        class="gallery-item"
        @click="openLightbox(index)"
      >
        <img :src="image.thumb" :alt="image.alt" loading="lazy" />
      </button>
    </div>

    <Teleport to="body" v-if="isMounted">
      <div v-if="isOpen" class="lightbox-overlay" @click.self="closeLightbox">
        <button class="lightbox-close" @click="closeLightbox" aria-label="Close">&times;</button>
        <button class="lightbox-nav prev" @click="prev" aria-label="Previous">&lt;</button>
        <div class="lightbox-content">
          <img :src="images[currentIndex].src" :alt="images[currentIndex].alt" />
          <p class="lightbox-caption">{{ images[currentIndex].alt }} ({{ currentIndex + 1 }}/{{ images.length }})</p>
        </div>
        <button class="lightbox-nav next" @click="next" aria-label="Next">&gt;</button>
      </div>
    </Teleport>
  </section>
</template>

<style scoped>
.lightbox-section {
  padding: 4rem 2rem;
  background: #1a1a2e;
  color: white;
}

.lightbox-section h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.lightbox-section > p {
  text-align: center;
  opacity: 0.8;
  margin-bottom: 2rem;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  max-width: 1000px;
  margin: 0 auto;
}

.gallery-item {
  border: none;
  padding: 0;
  background: none;
  cursor: pointer;
  overflow: hidden;
  border-radius: 8px;
  aspect-ratio: 3/2;
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.gallery-item:hover img {
  transform: scale(1.05);
}

.lightbox-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.lightbox-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 10;
}

.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  font-size: 2rem;
  padding: 1rem;
  cursor: pointer;
  transition: background 0.3s;
}

.lightbox-nav:hover {
  background: rgba(255, 255, 255, 0.2);
}

.lightbox-nav.prev {
  left: 1rem;
}

.lightbox-nav.next {
  right: 1rem;
}

.lightbox-content {
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.lightbox-content img {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
}

.lightbox-caption {
  margin-top: 1rem;
  color: white;
  font-size: 0.9rem;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .lightbox-nav {
    padding: 0.5rem;
    font-size: 1.5rem;
  }
}
</style>
