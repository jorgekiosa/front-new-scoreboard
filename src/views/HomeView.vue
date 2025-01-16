<script setup>
import Home from '@/components/Home.vue'
</script>
<template>
  <div class="home">
    <Home/>
  </div>
</template>
<style scoped>
.home{
  background-color: #033380;
  min-height: 100vh;
  display: flex;
  align-items: center;
}
@media (min-width: 1024px) {
  .home {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
