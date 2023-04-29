<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { SearchOutlined } from '@ant-design/icons-vue'

const router = useRouter()
const searchUsername = ref<string>()
const visible = ref(false)

const onSearch = () => {
  if (searchUsername.value) {
    router.push(`/profile/${searchUsername.value}`)
    searchUsername.value = ''
  }
  visible.value = false
}
</script>

<template>
  <AInputSearch
    v-model:value="searchUsername"
    placeholder="username..."
    style="max-width: 200px"
    class="desktop"
    @search="onSearch"
  />
  <APopover
    v-model:visible="visible"
    trigger="click"
    placement="bottom"
  >
    <template #content>
      <AInput
        v-model:value="searchUsername"
        placeholder="username..."
        @keyup.enter="onSearch"
      />
    </template>
    <AButton
      type="primary"
      ghost
      class="mobile"
    >
      <SearchOutlined />
    </AButton>
  </APopover>
</template>

<style scoped lang="scss">
.mobile {
    display: none;
  }
  @media (max-width: 610px) {
    .desktop {
      display: none;
    }
    .mobile {
      display: block;
    }
  }
</style>
