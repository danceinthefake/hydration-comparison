<script lang="ts">
  import { onMount } from 'svelte';

  const images = [
    { id: 1, src: 'https://picsum.photos/seed/1/600/400', thumb: 'https://picsum.photos/seed/1/300/200', alt: 'Nature landscape' },
    { id: 2, src: 'https://picsum.photos/seed/2/600/400', thumb: 'https://picsum.photos/seed/2/300/200', alt: 'City skyline' },
    { id: 3, src: 'https://picsum.photos/seed/3/600/400', thumb: 'https://picsum.photos/seed/3/300/200', alt: 'Mountain view' },
    { id: 4, src: 'https://picsum.photos/seed/4/600/400', thumb: 'https://picsum.photos/seed/4/300/200', alt: 'Ocean sunset' },
    { id: 5, src: 'https://picsum.photos/seed/5/600/400', thumb: 'https://picsum.photos/seed/5/300/200', alt: 'Forest path' },
    { id: 6, src: 'https://picsum.photos/seed/6/600/400', thumb: 'https://picsum.photos/seed/6/300/200', alt: 'Desert dunes' },
  ];

  let isOpen = false;
  let currentIndex = 0;
  let mounted = false;

  const openLightbox = (index: number) => {
    currentIndex = index;
    isOpen = true;
    if (mounted) {
      document.body.style.overflow = 'hidden';
    }
  };

  const closeLightbox = () => {
    isOpen = false;
    if (mounted) {
      document.body.style.overflow = '';
    }
  };

  const next = () => {
    currentIndex = (currentIndex + 1) % images.length;
  };

  const prev = () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  };

  onMount(() => {
    mounted = true;
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  });
</script>

<section class="lightbox-section">
  <h2>Image Gallery</h2>
  <p>Click any image to open lightbox. Use arrow keys to navigate.</p>
  <div class="gallery-grid">
    {#each images as image, index}
      <button
        class="gallery-item"
        on:click={() => openLightbox(index)}
      >
        <img src={image.thumb} alt={image.alt} loading="lazy" />
      </button>
    {/each}
  </div>
</section>

{#if isOpen}
  <div class="lightbox-overlay" on:click={closeLightbox} on:keydown={handleKeyDown} role="button" tabindex="-1">
    <button class="lightbox-close" on:click={closeLightbox} aria-label="Close">
      &times;
    </button>
    <button class="lightbox-nav prev" on:click|stopPropagation={prev} aria-label="Previous">
      &lt;
    </button>
    <div class="lightbox-content" on:click|stopPropagation on:keydown|stopPropagation role="dialog">
      <img src={images[currentIndex].src} alt={images[currentIndex].alt} />
      <p class="lightbox-caption">
        {images[currentIndex].alt} ({currentIndex + 1}/{images.length})
      </p>
    </div>
    <button class="lightbox-nav next" on:click|stopPropagation={next} aria-label="Next">
      &gt;
    </button>
  </div>
{/if}

<style>
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
