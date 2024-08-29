<script setup lang="ts">
defineProps<{
  isEnabled: boolean;
  message: string;
}>();

const emit = defineEmits<{
  (e: 'reload'): void;
}>();
</script>

<template>
  <div class="error-wrapper" :class="{ 'error-wrapper--enabled': isEnabled }">
    <div class="error-wrapper__info">
      <div class="error-wrapper__error-message">{{ message }}</div>
      <button
        class="button button--outline button--error error-wrapper__reload"
        @click="emit('reload')"
      >
        Reload
      </button>
    </div>

    <div class="error-wrapper__component">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.error-wrapper {
  position: relative;

  &__info {
    left: 0;
    opacity: 0;
    pointer-events: none;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    transition: opacity 0.3s ease;
  }

  &__error-message {
    font-weight: 500;
    margin-bottom: 12px;
  }

  &__component {
    transition: opacity 0.3s ease;
  }

  &--enabled {
    .error-wrapper__info {
      opacity: 1;
      pointer-events: all;
    }

    .error-wrapper__component {
      opacity: 0.05;
      pointer-events: none;
    }
  }
}
</style>
