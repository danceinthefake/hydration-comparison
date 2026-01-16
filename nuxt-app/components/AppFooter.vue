<script setup lang="ts">
const year = new Date().getFullYear();
</script>

<template>
  <footer>
    <p>&copy; {{ year }} Hydration Test. All rights reserved.</p>
  </footer>
</template>

<style scoped>
footer {
  background: #1a1a2e;
  color: white;
  text-align: center;
  padding: 2rem;
  margin-top: auto;
}
</style>
