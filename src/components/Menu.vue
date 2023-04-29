<script setup lang="ts">

import { AuthModal } from '.'
import { useUserStore } from '@/stores/users'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

defineProps<{
  isMobile: boolean
}>()

const router = useRouter()
const userStore = useUserStore()
const { loading, user } = storeToRefs(userStore)

const isAuthenticated = user

const logout = async () => {
  await userStore.handleLogout()
}

const goToUsersProfile =  () => {
  router.push(`/profile/${user.value?.username}`)
}
</script>

<template>
  <div
    v-if="!isAuthenticated"
    :class="isMobile ? 'mobile-menu' : 'desktop'"
  >
    <AuthModal
      :is-login="false"
    />
    <AuthModal :is-login="true" />
  </div>
  <div
    v-else
    :class="isMobile ? 'mobile-menu' : 'desktop'"
  >
    <AButton
      type="primary"
      @click="goToUsersProfile"
    >
      Profile
    </AButton>
    <AButton
      type="primary"
      :loading="loading"
      @click="logout"
    >
      Logout
    </AButton>
  </div>
</template>

<style scoped lang="scss">

.mobile {
    display: none;
  }
  @media (max-width: 500px) {
    .desktop {
      display: none;
    }
    .mobile {
      display: block;
    }
  }
.mobile-menu {
  display: flex;
  gap: 10px;
  flex-direction: column;
  align-items: flex-end;
  padding-block: 10px;
  border-radius: 2px;
}
</style>
