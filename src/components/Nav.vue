<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Container, Menu, SearchInput } from '.'
import { EllipsisOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '@/stores/users'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { loadingUser } = storeToRefs(userStore)

</script>

<template>
  <ALayoutHeader>
    <Container>
      <div class="nav-container">
        <div class="right-content">
          <RouterLink to="/">
            Instamock
          </RouterLink>
          <SearchInput />
        </div>
        <div
          v-if="!loadingUser"
          class="left-content"
        >
          <ADropdownButton
            type="primary"
            class="mobile"
          >
            <template #overlay>
              <Menu :is-mobile="true" />
            </template>
            <template #icon>
              <EllipsisOutlined />
            </template>
          </ADropdownButton>
          <Menu :is-mobile="false" />
        </div>
      </div>
    </Container>
  </ALayoutHeader>
</template>

<style scoped lang="scss">
.ant-layout-header {
  padding-inline: 0;
}
.nav-container {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  div {
    display: flex;
    align-items: center;
    gap: 10px;
  }
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
}
</style>
