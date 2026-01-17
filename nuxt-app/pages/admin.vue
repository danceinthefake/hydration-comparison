<script setup lang="ts">
useHead({
  title: 'Admin Panel - Pokemon Manager'
});
</script>

<template>
  <div>
    <!--
      NUXT ADVANTAGE: Full Hydration with Shared State

      Unlike Astro's islands architecture, Nuxt hydrates the entire page.
      This means:
      - All components can share state through Vue's reactivity
      - Can use Pinia, composables, or provide/inject for global state
      - No need to bundle everything into a single "island" component
      - Components can communicate freely through events or shared state

      Trade-off: More JavaScript is sent to the client, but complex
      admin UIs work naturally without architectural constraints.

      For this demo, we use a single AdminPanel component to match
      the Astro implementation, but in a real Nuxt app you could
      split this into multiple components that share state via
      Pinia or composables.
    -->
    <AdminPanel />
  </div>
</template>

<style scoped>
div {
  min-height: 100vh;
  background: #f5f5f5;
}
</style>
