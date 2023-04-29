<script setup lang="ts">
import { watch, onMounted } from 'vue'
import { Nav } from './components'
import { RouterView } from 'vue-router'
import { message } from 'ant-design-vue'
import { useUserStore } from '@/stores/users'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { errorMessage, successMessage, infoMessage } = storeToRefs(userStore)

onMounted(() => {
  userStore.getUser()
})

const error = () => {
  message.error(errorMessage.value)
}
const success = () => {
  message.success(successMessage.value)
  successMessage.value = ''
}
const info = () => {
  message.info(infoMessage.value)
  infoMessage.value = ''
}

watch(errorMessage, (current) => {
  if (current !== '') error()
})
watch(successMessage, (current) => {
  if (current !== '') success()
})
watch(infoMessage, (current) => {
  if (current !== '') info()
})
</script>

<template>
  <Nav />
  <main>
    <RouterView />
  </main>
</template>

<style scoped></style>
