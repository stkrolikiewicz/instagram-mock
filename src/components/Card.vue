<script setup lang="ts">
import type { Post } from '@/types'
import { onMounted, ref } from 'vue'

defineProps<{
  card: Post
}>()

const BASE_IMAGE_URL = ref('')

onMounted(() => {
  fetchBaseURL()
})

const fetchBaseURL = async () => {
  await fetch('/api/baseImageURL')
    .then(res => res.json())
    .then(res => {
      BASE_IMAGE_URL.value = res.url
    })
}
</script>

<template>
  <ACard
    hoverable
    class="card"
  >
    <template #cover>
      <img
        :alt="card.name"
        :src="BASE_IMAGE_URL + card.url"
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