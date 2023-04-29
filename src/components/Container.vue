<template>
  <div class="container">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 50px;
  @media (max-width: 550px) {
    padding: 0 25px;
  }
}
</style>
