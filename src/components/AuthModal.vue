<script setup lang="ts">
import { ref } from 'vue'
import { LoginForm, SignupForm } from '.'
import { LoginOutlined, UserAddOutlined } from '@ant-design/icons-vue'


const props = defineProps<{
    isLogin: boolean
}>()

const visible = ref<boolean>(false)

const showModal = () => {
  visible.value = true
}

const title = props.isLogin ? 'Log in' : 'Sign up'
</script>

<template>
  <div>
    <AButton
      v-if="isLogin"
      type="primary"
      @click="showModal"
    >
      <LoginOutlined />
      Log in
    </AButton>
    <AButton
      v-else
      type="primary"
      @click="showModal"
    >
      <UserAddOutlined />
      Sign up
    </AButton>
    <AModal
      v-model:visible="visible"
      :title="title"
      :footer="null"
    >
      <div class="modal">
        <LoginForm
          v-if="isLogin"
          :visible="visible"
        />
        <SignupForm
          v-else
          :visible="visible"
        />
      </div>
    </AModal>
  </div>
</template>

<style scoped lang="scss">
.modal {
  display: flex;
  width: 100%;
  justify-content: center;
}
</style>