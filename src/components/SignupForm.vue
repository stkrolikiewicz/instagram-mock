<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { Credentials } from '@/types'
import { LockOutlined, UserOutlined, MailOutlined } from '@ant-design/icons-vue'
import type { FormInstance } from 'ant-design-vue'
import { useUserStore } from '@/stores/users'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { errorMessage, loading } = storeToRefs(userStore)

const props = defineProps<{
  visible: boolean
}>()

watch(() => props.visible, () => {
  formRef.value?.resetFields()
  errorMessage.value = ''
})

const formRef = ref<FormInstance>()

const formState = reactive<Credentials>({
  username: '',
  email: '',
  password: '',
})

const onFinish = () => {
  formRef.value?.validateFields()
    .then(() => {
      userStore.handleSignup({
        username: formState.username,
        email: formState.email,
        password: formState.password,
      }).then(() => loading.value = false)
      formRef.value?.resetFields()
    })
    .catch(error => {
      errorMessage.value = error
      loading.value = false
    })
}

</script>

<template>
  <AForm
    ref="formRef"
    :model="formState"
    name="normal_login"
    class="login-form"
    @finish="onFinish"
  >
    <AFormItem v-if="errorMessage">
      <AAlert
        :message="errorMessage"
        type="error"
        show-icon
      />
    </AFormItem>
    <div v-if="!loading">
      <AFormItem
        label="Username"
        name="username"
        :rules="[
          { required: true, message: 'Please input your username!' },
          { min: 4, message: 'Username should have at least 4 letters!'}
        ]"
      >
        <AInput v-model:value="formState.username">
          <template #prefix>
            <UserOutlined class="site-form-item-icon" />
          </template>
        </AInput>
      </AFormItem>

      <AFormItem
        label="E-mail"
        name="email"
        :rules="[
          { required: true, message: 'Please input your email!' },
          { type: 'email', message: 'Email has incorrect format!' }
        ]"
      >
        <AInput v-model:value="formState.email">
          <template #prefix>
            <MailOutlined class="site-form-item-icon" />
          </template>
        </AInput>
      </AFormItem>

      <AFormItem
        label="Password"
        name="password"
        :rules="[
          { required: true, message: 'Please input your password!' },
          { min: 8, message: 'Username should have at least 8 letters!'},
          { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/, message: 'Ensure that your password has at least 1 upper case letter, 1 lo case letter, 1 special case letter and 1 digit'}
        ]"
      >
        <AInputPassword v-model:value="formState.password">
          <template #prefix>
            <LockOutlined class="site-form-item-icon" />
          </template>
        </AInputPassword>
      </AFormItem>
    </div>
    <div
      v-else
      class="spin"
    >
      <ASpin />
    </div>
    <AFormItem>
      <AButton
        type="primary"
        html-type="submit"
        class="login-form-button"
        :disabled="loading"
        :loading="loading"
      >
        Sign up
      </AButton>
    </AFormItem>
  </AForm>
</template>

<style scoped lang="scss">
.login-form {
  max-width: 300px;
  &-forgot {
    float: right;
  }
  &-button {
    width: 100%
  }
}

.spin {
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>