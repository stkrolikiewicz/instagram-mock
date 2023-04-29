<script setup lang="ts">
import { Profile } from '@/components'
</script>


<template>
  <main>
    <Profile :key="String($route.params.username)" />
  </main>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
