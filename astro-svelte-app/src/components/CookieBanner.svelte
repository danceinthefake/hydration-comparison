<script lang="ts">
  import { onMount } from 'svelte';

  let isVisible = false;
  const COOKIE_KEY = 'cookie-consent';

  const checkConsent = () => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) {
      isVisible = true;
    }
  };

  const acceptAll = () => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify({ analytics: true, marketing: true, timestamp: Date.now() }));
    isVisible = false;
  };

  const acceptEssential = () => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify({ analytics: false, marketing: false, timestamp: Date.now() }));
    isVisible = false;
  };

  onMount(() => {
    checkConsent();
  });
</script>

{#if isVisible}
  <div class="cookie-banner">
    <div class="cookie-content">
      <div class="cookie-text">
        <h4>🍪 Cookie Settings</h4>
        <p>We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.</p>
      </div>
      <div class="cookie-actions">
        <button class="btn-essential" on:click={acceptEssential}>Essential Only</button>
        <button class="btn-accept" on:click={acceptAll}>Accept All</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .cookie-banner {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
    z-index: 1500;
    padding: 1.5rem;
    animation: slideUp 0.3s ease;
  }

  @keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }

  .cookie-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
  }

  .cookie-text h4 {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
    color: #1a1a2e;
  }

  .cookie-text p {
    font-size: 0.9rem;
    color: #666;
    line-height: 1.5;
    margin: 0;
  }

  .cookie-actions {
    display: flex;
    gap: 1rem;
    flex-shrink: 0;
  }

  .btn-essential {
    padding: 0.75rem 1.5rem;
    background: none;
    border: 2px solid #667eea;
    color: #667eea;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s;
  }

  .btn-essential:hover {
    background: #667eea;
    color: white;
  }

  .btn-accept {
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    color: white;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: transform 0.3s;
  }

  .btn-accept:hover {
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    .cookie-content {
      flex-direction: column;
      text-align: center;
    }

    .cookie-actions {
      width: 100%;
      justify-content: center;
    }
  }
</style>
