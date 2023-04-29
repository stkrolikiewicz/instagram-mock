<script setup lang="ts">
import type { Post, User } from '@/types'
import { Container, ImageGallery, UserBar } from '.'
import { ref, onMounted, watch } from 'vue'
import { supabase } from '@/supabase'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/users'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()

const route = useRoute()
const { username } = route.params

const { user: loggedInUser } = storeToRefs(userStore)

const user = ref<User>()
const isFollowing = ref(false)
const posts = ref<Post[]>([])
const loading = ref(false)

const addNewPost = (post: Post) => {
  posts.value?.unshift(post)
  if (user.value) user.value.posts = posts.value.length
}

const fetchData = async () => {
  loading.value = true
  const { data: userData } = await supabase
    .from('users')
    .select()
    .eq('username', username)
    .single()
  
  if (!userData) {
    loading.value = false
    return user.value = undefined
  }
  
  user.value = userData
  const { data: postsData } = await supabase
    .from('posts')
    .select()
    .eq('owner_id', user.value?.id)
    .order('created_at', { ascending: false })

  if (postsData) {
    posts.value = postsData
    user.value.posts = posts.value.length
  }
  loading.value = false
}

const fetchIsFollowing = async () => {
  if (loggedInUser.value &&  user.value && (loggedInUser.value.id !== user.value.id)) {
    const { data } = await supabase
      .from('followers_following')
      .select()
      .eq('follower_id', loggedInUser.value.id)
      .eq('following_id', user.value.id)
      .single()
    if(data) isFollowing.value = true
    else isFollowing.value = false
  }
}

const fetchFollowersCount = async () => {
  const { count } = await supabase
    .from('followers_following')
    .select('*', { count: 'exact' })
    .eq('following_id', user.value?.id)

  return count
}
const fetchFollowingCount = async () => {
  const { count } = await supabase
    .from('followers_following')
    .select('*', { count: 'exact' })
    .eq('follower_id', user.value?.id)

  return count
}

const updateIsFollowing = (follow: boolean) => {
  isFollowing.value = follow
}

watch(loggedInUser, () => {
  fetchIsFollowing()
})

watch(isFollowing, () => {
  fetchFollowersCount()
})


onMounted(() => {
  fetchData().then(() => {
    fetchIsFollowing()
    fetchFollowersCount().then(res => {
      if (res && user.value) user.value.followers = res
    })
    fetchFollowingCount().then(res => {
      if (res && user.value) user.value.following = res
    })
  })
})

</script>

<template>
  <Container>
    <div
      v-if="!loading && user"
      class="profile-container"
    >
      <UserBar
        :user-info="user"
        :add-new-post="addNewPost"
        :is-following="isFollowing"
        :update-is-following="updateIsFollowing"
      />
      <ImageGallery :posts="posts" />
    </div>
    <div
      v-else-if="loading"
      class="spin"  
    >
      <ASpin />
    </div>
    <div v-else>
      <ATypographyTitle :level="2">
        User Not found!
      </ATypographyTitle>
    </div>
  </Container>
</template>

<style
scoped
lang="scss"
>
.profile-container {
display: flex;
flex-direction: column;
// align-items: center;
padding: 15px 0;
gap: 15px;
}
.spin {
  display: flex;
  width: 100%;
  height: calc(100vh - 65px);
  justify-content: center;
  align-items: center;
}
</style>