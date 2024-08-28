<script setup lang="ts"></script>

<template>
  <div class="vcontent">
    <slot></slot>
  </div>
</template>

<style lang="scss">
.vcontent {
  display: flex;
  margin: auto;
  max-width: $content-max-width;
  overflow: hidden;
  padding: 0 $content-x-padding;
  width: 100%;
}
</style>
