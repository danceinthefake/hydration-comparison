<script lang="ts">
  export let siteName: string;

  let isOpen = false;

  const toggleMenu = () => {
    isOpen = !isOpen;
  };

  const closeMenu = () => {
    isOpen = false;
  };
</script>

<header class="header">
  <nav class="nav">
    <div class="logo">{siteName}</div>
    <button
      class="hamburger"
      on:click={toggleMenu}
      aria-expanded={isOpen}
      aria-label="Toggle menu"
    >
      <span class="bar" class:open={isOpen}></span>
      <span class="bar" class:open={isOpen}></span>
      <span class="bar" class:open={isOpen}></span>
    </button>
    <ul class="nav-links" class:open={isOpen}>
      <li><a href="#home" on:click={closeMenu}>Home</a></li>
      <li><a href="#features" on:click={closeMenu}>Features</a></li>
      <li><a href="#testimonials" on:click={closeMenu}>Testimonials</a></li>
      <li><a href="#faq" on:click={closeMenu}>FAQ</a></li>
      <li><a href="#contact" on:click={closeMenu}>Contact</a></li>
    </ul>
  </nav>
</header>

<style>
  .header {
    background: #1a1a2e;
    color: white;
    padding: 1rem 2rem;
    position: sticky;
    top: 0;
    z-index: 1000;
  }
  .nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
  }
  .logo {
    font-size: 1.5rem;
    font-weight: bold;
  }
  .hamburger {
    display: none;
    flex-direction: column;
    gap: 5px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 5px;
  }
  .bar {
    width: 25px;
    height: 3px;
    background: white;
    transition: all 0.3s ease;
  }
  .bar.open:nth-child(1) {
    transform: rotate(45deg) translate(5px, 6px);
  }
  .bar.open:nth-child(2) {
    opacity: 0;
  }
  .bar.open:nth-child(3) {
    transform: rotate(-45deg) translate(5px, -6px);
  }
  .nav-links {
    display: flex;
    list-style: none;
    gap: 2rem;
    margin: 0;
    padding: 0;
  }
  .nav-links a {
    color: white;
    text-decoration: none;
    transition: opacity 0.3s;
  }
  .nav-links a:hover {
    opacity: 0.8;
  }
  @media (max-width: 768px) {
    .hamburger {
      display: flex;
    }
    .nav-links {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      flex-direction: column;
      background: #1a1a2e;
      padding: 0;
      gap: 0;
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
    }
    .nav-links.open {
      max-height: 300px;
      padding: 1rem 0;
    }
    .nav-links li {
      text-align: center;
      padding: 0.75rem 2rem;
    }
  }
</style>
