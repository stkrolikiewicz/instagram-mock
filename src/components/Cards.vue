<script setup lang="ts">
import { supabase } from '@/supabase'
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
  const { data: following } = await supabase
    .from('followers_following')
    .select('following_id')
    .eq('follower_id', user.value?.id)
  
  const owners_ids: number[] = following?.map(f => f.following_id) || []

  const { data: posts } = await supabase
    .from('posts')
    .select()
    .in('owner_id', owners_ids)
    .range(lastCardIndex.value - postsPerSet - 1,lastCardIndex.value)
    .order('created_at', { ascending: false })

  return posts
}

const fetchNextSet = async () => {
  const { data: following } = await supabase
    .from('followers_following')
    .select('following_id')
    .eq('follower_id', user.value?.id)
  
  const owners_ids: number[] = following?.map(f => f.following_id) || []

  const { data: nextPosts } = await supabase
    .from('posts')
    .select()
    .in('owner_id', owners_ids)
    .range(lastCardIndex.value + 1 ,lastCardIndex.value + postsPerSet)
    .order('created_at', { ascending: false })
  if (nextPosts?.length && posts.value) {
    posts.value = [
      ...posts.value,
      ...nextPosts,
    ]
    lastCardIndex.value += postsPerSet
  } else {
    reachEnd.value = true
  }
}

onMounted(() => {
  fetchData().then(res => posts.value = res || [])
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