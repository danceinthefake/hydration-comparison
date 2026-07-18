<script lang="ts">
  import { onMount } from 'svelte';

  let isVisible = false;
  let mounted = false;

  const handleScroll = () => {
    if (mounted) {
      isVisible = window.scrollY > 300;
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  onMount(() => {
    mounted = true;
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });
</script>

<button
  class="back-to-top"
  class:visible={isVisible}
  on:click={scrollToTop}
  aria-label="Back to top"
>
  ↑
</button>

<style>
  .back-to-top {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    cursor: pointer;
    font-size: 1.5rem;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s, box-shadow 0.3s, opacity 0.3s, visibility 0.3s;
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
  }
  .back-to-top.visible {
    opacity: 1;
    visibility: visible;
  }
  .back-to-top:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }
</style>
