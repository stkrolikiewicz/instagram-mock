<script setup lang="ts">
import type { Post, User } from '@/types'
import { UploadPhotoModal } from '.'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/users'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { UserAddOutlined } from '@ant-design/icons-vue'

const props = defineProps<{
  userInfo: User,
  addNewPost: (post: Post) => void,
  isFollowing: boolean,
  updateIsFollowing: (follow: boolean) => void
}>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const route = useRoute()
const { username: profileUsername } = route.params
const loading = ref(false)

const followUser = async () => {
  loading.value = true
  await fetch('/api/followUser', {
    method: 'POST',
    body: JSON.stringify({
      followerId: user.value?.id,
      followingId: props.userInfo?.id,
    }),
  })
    .then(() => {
      props.updateIsFollowing(true)
    })
  loading.value = false
}

const unFollowUser = async () => {
  loading.value = true
  await fetch('/api/unFollowUser', {
    method: 'POST',
    body: JSON.stringify({
      followerId: user.value?.id,
      followingId: props.userInfo?.id,
    }),
  })
    .then(() => props.updateIsFollowing(false))

  loading.value = false
}

</script>

<template>
  <div
    class="userbar-container"
  >
    <div class="top-content">
      <ATypographyTitle :level="2">
        {{ userInfo.username }}
      </ATypographyTitle>
      <div v-if="user">
        <UploadPhotoModal
          v-if="profileUsername === user.username"
          :add-new-post="addNewPost"
        />
        <div v-else>
          <AButton
            v-if="!isFollowing"
            :loading="loading"
            @click="followUser"
          >
            <UserAddOutlined />
            Follow
          </AButton>
          <AButton
            v-else
            :loading="loading"
            @click="unFollowUser"
          >
            Following
          </AButton>
        </div>
      </div>
    </div>
    <div class="bottom-content">
      <ATypographyTitle :level="5">
        {{ userInfo?.posts ? userInfo.posts : 0 }} posts
      </ATypographyTitle>
      <ATypographyTitle :level="5">
        {{ userInfo?.followers ? userInfo.followers : 0 }} followers
      </ATypographyTitle>
      <ATypographyTitle :level="5">
        {{ userInfo?.following ? userInfo.following : 0 }}  following
      </ATypographyTitle>
    </div>
  </div>
</template>

<style scoped lang="scss">
.userbar-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  div {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 30px;
    h2, h5 {
      margin: 0;
      padding: 0;
      display: flex;
      flex-wrap: wrap;
      word-break: break-all;
    }
  }

  .top-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

</style>
