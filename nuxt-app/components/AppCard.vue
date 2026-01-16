<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
}>();
</script>

<template>
  <article class="card">
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
  </article>
</template>

<style scoped>
.card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
h3 {
  margin-bottom: 0.5rem;
  color: #1a1a2e;
}
p {
  color: #666;
}
</style>
