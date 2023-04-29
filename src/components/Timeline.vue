<script setup lang="ts">
import { Container, Cards, LoginMessage, Spinner } from '.'
import { useUserStore } from '@/stores/users'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()

const { user, loadingUser } = storeToRefs(userStore)

</script>

<template>
  <Container v-if="!loadingUser">
    <Cards v-if="user" /> 
    <LoginMessage v-else />
  </Container>
  <Container v-else>
    <Spinner />
  </Container>
</template>

<style scoped lang="scss">
.timeline-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  gap: 20px;
}
.spin {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: calc(100vh - 65px);
}
</style>