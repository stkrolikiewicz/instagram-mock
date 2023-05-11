<script setup lang="ts">
import { Card, Observer } from '.'
import { useUserStore } from '@/stores/users'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import type { Post } from '@/types'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const posts = ref<Post[]>()
const postsPerSet = 3
const lastCardIndex = ref(postsPerSet - 1)
const reachEnd = ref(false)

const fetchData = async () => {
  await fetch('/api/initialData', {
    method: 'POST',
    body: JSON.stringify({
      userId: user.value?.id,
      lastCardIndex: lastCardIndex.value,
      postsPerSet: postsPerSet,
    }),
  })
    .then(res => res.json())
    .then(res => posts.value = res.data.posts)
}

const fetchNextSet = async () => {
  await fetch('/api/nextSet', {
    method: 'POST',
    body: JSON.stringify({
      userId: user.value?.id,
      lastCardIndex: lastCardIndex.value,
      postsPerSet: postsPerSet,
    }),
  })
    .then(res => res.json())
    .then(res => {
      if (res.data.nextPosts?.length && posts.value) {
        posts.value = [
          ...posts.value,
          ...res.data.nextPosts,
        ]
        lastCardIndex.value += postsPerSet
      } else {
        reachEnd.value = true
      }
    })
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div
    class="timeline-container"
  >
    <Card
      v-for="post in posts"
      :key="post.id"
      :card="post"
    />
    <Observer
      v-if="posts?.length && !reachEnd"
      @intersect="fetchNextSet"
    />
  </div>
</template>

<style scoped lang="scss">
.timeline-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  gap: 20px;
}
</style>