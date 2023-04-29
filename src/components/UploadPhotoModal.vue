<script setup lang="ts">
import { ref, watch } from 'vue'
import { supabase } from '@/supabase'
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
  const fileName = Math.floor(Math.random() * 100000000000)
  if(file.value) {
    const { data, error } = await supabase.storage.from('images').upload('public/' + fileName, file.value)

    if (error) {
      loading.value = false
      errorMessage.value = error.message
    }
    if (data) {
      const { error } = await supabase.from('posts').insert({
        url: data.path,
        caption: caption.value,
        owner_id: user.value?.id,
      })
      if (error) {
        loading.value = false
        errorMessage.value = error.message
      } else {
        successMessage.value = 'Photo successfully uploaded!'
      }
      props.addNewPost({
        url: data.path,
        caption: caption.value,
      })
    }
    file.value = null
    caption.value = ''
    visible.value = false
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