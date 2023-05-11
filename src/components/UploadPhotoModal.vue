<script setup lang="ts">
import { ref, watch } from 'vue'
import { useUserStore } from '@/stores/users'
import { storeToRefs } from 'pinia'
import type { Post } from '@/types'

const props = defineProps<{
  addNewPost: (post: Post) => void
}>()

const userStore = useUserStore()

const { user, errorMessage, successMessage } = storeToRefs(userStore)

const visible = ref<boolean>(false)
const caption = ref('')
const file = ref<File | null>()
const myData = new FormData()
const loading = ref(false)
const input = ref<HTMLInputElement>()

const showModal = () => {
  visible.value = true
}

watch(file, () => {
  if (file.value) errorMessage.value = ''
})

const handleOk = async () => {
  loading.value = true
  if (file.value) {
    myData.append('ownerId', String(user.value?.id))
    if (caption.value) myData.append('caption', caption.value)
    if (file.value) myData.append('image', file.value)
    await fetch('/api/uploadPhoto', {
      method: 'POST',
      body: myData,
    })
      .then(res => res.json())
      .then(res => {
        console.log
        loading.value = false
        if (res.error) {
          loading.value = false
          errorMessage.value = res.message
        } else {
          successMessage.value = res.message
          file.value = null
          caption.value = ''
          visible.value = false
          props.addNewPost({
            url: res.data.path,
            caption: caption.value,
          })
        }
        myData.delete('ownerId')
        myData.delete('caption')
        myData.delete('image')
      })
  } else {
    errorMessage.value = 'A file was not selected!'
  }
  loading.value = false
}

const handleUploadChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    file.value = target.files[0]
  } else file.value = null
}

</script>

<template>
  <div>
    <AButton
      @click="showModal"
    >
      Upload Photo
    </AButton>
    <AModal
      v-model:visible="visible"
      title="Upload Photo"
      :ok-button-props="{ disabled: !file || loading, loading: loading }"
      :cancel-button-props="{ disabled: loading }"
      @ok="handleOk"
      @cancel="() => {
        caption = ''
        file = null
        if (input) input.value = ''
      }"
    >
      <div
        v-if="loading"
        class="spin"
      >
        <ASpin />
      </div>
      <div
        v-else
        class="inputs"
      >
        <input
          ref="input"
          type="file"
          required
          accept=".jpg,.png,.avif"
          @change="handleUploadChange"
        >
        <AInput
          v-model:value="caption"
          placeholder="Caption..."
          :max-length="50"
        />
        <AAlert
          v-if="errorMessage"
          :message="errorMessage"
          type="error"
          show-icon
        />
      </div>
    </AModal>
  </div>
</template>

<style scoped lang="scss">
  .inputs {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .spin {
    width: 100%;
    height: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>