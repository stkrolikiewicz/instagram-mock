<script setup lang="ts">
import { ref, onMounted } from 'vue'

const emits = defineEmits(['intersect'])

const observer = ref<IntersectionObserver>()
const root = ref<Element>()

onMounted(() => {
  observer.value = new IntersectionObserver(([entry]) => {
    if(entry && entry.isIntersecting) {
      emits('intersect')
    }
  })
  
  if (root.value) observer.value.observe(root.value)
})
</script>

<template>
  <div
    ref="root"
    class="observer"
  >
    <ASpin />
  </div>
</template>

<style scoped>
.observer {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>