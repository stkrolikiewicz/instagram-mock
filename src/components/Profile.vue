<script setup lang="ts">
import type { Post, User } from '@/types'
import { Container, ImageGallery, UserBar } from '.'
import { ref, onMounted, watch } from 'vue'
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
const BASE_IMAGE_URL = ref('')

const addNewPost = (post: Post) => {
  posts.value?.unshift(post)
  if (user.value) user.value.posts = posts.value.length
}

const fetchData = async () => {
  loading.value = true

  await fetch('/api/userData', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username,
    }),
  })
    .then(res => res.json())
    .then(res => {
      user.value = res.data.user
      if (res.data.posts && user.value) {
        posts.value = res.data.posts
        user.value.posts = posts.value.length
      }
    })
  loading.value = false
}
const fetchBaseURL = async () => {
  await fetch('/api/baseImageURL')
    .then(res => res.json())
    .then(res => {
      BASE_IMAGE_URL.value = res.url
    })
}

const fetchIsFollowing = async () => {
  if (loggedInUser.value &&  user.value && (loggedInUser.value.id !== user.value.id)) {
    await fetch('/api/isFollowing', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.value.id,
        loggedInUserId: loggedInUser.value.id,
      }),
    })
      .then(res => res.json())
      .then(res => isFollowing.value = res.isFollowing)
  }
}

const fetchFollowersCount = async () => {
  let count = 0

  await fetch('/api/followersCount', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: user.value?.id,
    }),
  },
  )
    .then(res => res.json())
    .then(res => count = res.count)

  return count
}
const fetchFollowingCount = async () => {
  let count = 0

  await fetch('/api/followingCount', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: user.value?.id,
    }),
  })
    .then(res => res.json())
    .then(res => count = res.count)

  return count
}

const updateIsFollowing = (follow: boolean) => {
  isFollowing.value = follow
  if(user.value?.followers) {
    if (follow) user.value.followers++
    else user.value.followers--
  }
}

watch(loggedInUser, () => {
  fetchIsFollowing()
})

watch(isFollowing, () => {
  fetchFollowersCount()
})


onMounted(() => {
  fetchData()
    .then(() => {
      fetchBaseURL()
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
      <ImageGallery
        v-if="BASE_IMAGE_URL"
        :posts="posts"
        :base-url="BASE_IMAGE_URL"
      />
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