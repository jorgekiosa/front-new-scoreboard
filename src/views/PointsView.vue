<script setup>
import Points from '@/components/Points.vue'
</script>
<template>
  <div class="points">
    <Points/>
  </div>
</template>
<style scoped>
.points{
  background-color: #033380;
  min-height: 100vh;
  display: flex;
}
@media (min-width: 1024px) {
  .points {
    min-height: 100vh;
    display: flex;
  }
}
</style>
