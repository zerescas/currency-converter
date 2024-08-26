<script setup lang="ts">
import GitHubIcon from './icons/GitHubIcon.vue';
</script>

<template>
  <div class="vheader">
    <div class="vheader__content">
      <div class="vheader__left">
        <a class="link vheader__app-title" href="/"> Currency Converter </a>
      </div>

      <div class="vheader__right">
        <nav class="vheader__links">
          <a class="link" href="https://github.com/zerescas/currency-converter">
            <GitHubIcon class="vheader__link-svg" />
          </a>
        </nav>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.vheader {
  padding: 24px 0;

  &__content {
    align-items: center;
    display: flex;
    margin: auto;
    max-width: $content-max-width;
    padding: 0 $content-x-padding;
  }

  // Left part
  &__left {
  }

  &__app-title {
    font-size: 20px;
    font-weight: 600;
  }

  // Right part
  &__right {
    margin-left: auto;
  }

  &__links {
    align-items: center;
    display: flex;
    gap: 16px;
    font-size: 16px;
  }

  &__link-svg {
    height: 32px;
    width: fit-content;
  }
}
</style>
