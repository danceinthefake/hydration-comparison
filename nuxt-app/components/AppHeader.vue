<script setup lang="ts">
defineProps<{
  siteName: string;
}>();
</script>

<template>
  <header>
    <nav>
      <div class="logo">{{ siteName }}</div>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
header {
  background: #1a1a2e;
  color: white;
  padding: 1rem 2rem;
}
nav {
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
ul {
  display: flex;
  list-style: none;
  gap: 2rem;
}
a {
  color: white;
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
</style>
