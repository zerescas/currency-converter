<template>
  <div class="scroll-container">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
.scroll-container {
  margin: auto;
  max-height: 100%;
  overflow: auto;
  width: 100%;
}
</style>
