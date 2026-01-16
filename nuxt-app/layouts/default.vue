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
html {
  scroll-behavior: smooth;
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
footer {
  background: #1a1a2e;
  color: white;
  text-align: center;
  padding: 2rem;
  margin-top: auto;
}
</style>
