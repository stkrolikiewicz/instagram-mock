<script setup lang="ts">
import type { Post } from '@/types'
const { VITE_BASE_PHOTO_URL } = import.meta.env

defineProps<{
  posts: Post[]
}>()
</script>


<template>
  <div class="image-gallery-container">
    <div
      v-for="post in posts"
      :key="post.id"
      class="image-container"
    >
      <img
        :src="VITE_BASE_PHOTO_URL + post.url"
        alt=""
      >
    </div>
  </div>
</template>

<style scoped lang="scss">
.image-gallery-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  @media (max-width: 740px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 470px) {
    grid-template-columns: repeat(1, 1fr);
  }
  justify-content: stretch;
  gap: 20px;
  div {
    background-color: aliceblue;
    max-width: 420px;
    min-width: 200px;
  }
  img {
    width: 100%;
    aspect-ratio: 1/1;
    object-fit: cover;
  }
}
</style>
