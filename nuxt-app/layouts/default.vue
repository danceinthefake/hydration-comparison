<template>
  <div class="app">
    <slot />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: system-ui, -apple-system, sans-serif;
  line-height: 1.6;
  color: #333;
}
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
