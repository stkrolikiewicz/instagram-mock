<script setup lang="ts">
import type { Post } from '@/types'
const { VITE_BASE_PHOTO_URL } = import.meta.env

defineProps<{
  card: Post
}>()
</script>

<template>
  <ACard
    hoverable
    class="card"
  >
    <template #cover>
      <img
        :alt="card.name"
        :src="VITE_BASE_PHOTO_URL + card.url"
      >
    </template>
    <ACardMeta :title="card.caption">
      <template
        v-if="card.created_at"
        #description
      >
        {{ (new Date(card.created_at)).toLocaleDateString() }}
      </template>
    </ACardMeta>
  </ACard>
</template>

<style scoped>
.card {
  max-width: 420px;
}
</style>