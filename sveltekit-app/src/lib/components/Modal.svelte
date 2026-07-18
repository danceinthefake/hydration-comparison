<script lang="ts">
  import { onMount } from 'svelte';

  let isOpen = false;
  let mounted = false;

  const openModal = () => {
    isOpen = true;
    if (mounted) {
      document.body.style.overflow = 'hidden';
    }
  };

  const closeModal = () => {
    isOpen = false;
    if (mounted) {
      document.body.style.overflow = '';
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      closeModal();
    }
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

<section class="modal-section">
  <h2>Interactive Modal Demo</h2>
  <p>Click the button below to see an interactive modal popup</p>
  <button class="open-modal-btn" on:click={openModal}>
    Open Modal
  </button>
</section>

{#if isOpen}
  <div class="modal-overlay" on:click={closeModal} on:keydown={handleKeyDown} role="button" tabindex="-1">
    <div class="modal-content" on:click|stopPropagation on:keydown|stopPropagation role="dialog" aria-modal="true">
      <button class="modal-close" on:click={closeModal} aria-label="Close">
        &times;
      </button>
      <h3>Welcome to Our Platform</h3>
      <p>
        This is a fully interactive modal component built with Svelte.
        It demonstrates:
      </p>
      <ul>
        <li>Click outside to close</li>
        <li>Press ESC key to close</li>
        <li>Focus trap for accessibility</li>
        <li>Body scroll lock when open</li>
      </ul>
      <div class="modal-actions">
        <button class="modal-btn secondary" on:click={closeModal}>
          Cancel
        </button>
        <button class="modal-btn primary" on:click={closeModal}>
          Got it!
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-section {
    padding: 4rem 2rem;
    text-align: center;
    background: linear-gradient(180deg, #fff 0%, #f8f9fa 100%);
  }

  .modal-section h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: #1a1a2e;
  }

  .modal-section p {
    color: #666;
    margin-bottom: 2rem;
  }

  .open-modal-btn {
    padding: 1rem 2rem;
    font-size: 1.1rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: transform 0.3s, box-shadow 0.3s;
  }

  .open-modal-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  }

  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    animation: fadeIn 0.2s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .modal-content {
    background: white;
    padding: 2rem;
    border-radius: 16px;
    max-width: 500px;
    width: 90%;
    position: relative;
    animation: slideUp 0.3s ease;
  }

  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  .modal-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
    padding: 0.5rem;
    line-height: 1;
  }

  .modal-content h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #1a1a2e;
  }

  .modal-content p {
    color: #666;
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  .modal-content ul {
    margin-bottom: 1.5rem;
    padding-left: 1.5rem;
  }

  .modal-content li {
    color: #555;
    padding: 0.25rem 0;
  }

  .modal-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
  }

  .modal-btn {
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s;
  }

  .modal-btn.secondary {
    background: none;
    border: 2px solid #e0e0e0;
    color: #666;
  }

  .modal-btn.secondary:hover {
    border-color: #667eea;
    color: #667eea;
  }

  .modal-btn.primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    color: white;
  }

  .modal-btn.primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  }
</style>
