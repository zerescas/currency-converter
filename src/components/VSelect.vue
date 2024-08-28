<script setup lang="ts">
import { ref } from 'vue';
import SelectArrowIcon from './icons/SelectArrowIcon.vue';

export interface IOption {
  value: string;
}

const modelValue = defineModel();

withDefaults(
  defineProps<{
    label?: string;

    selectName?: string;
    options?: IOption[] | null;
  }>(),
  {
    options: null,
  },
);

const isOpened = ref(false);
</script>

<template>
  <div class="vinput vselect" :class="{ 'vselect--opened': isOpened }">
    <label class="vinput__label">{{ label }}</label>

    <div class="vselect__select-wrapper">
      <select
        class="vinput__input vselect__select"
        v-model="modelValue"
        :name="selectName"
        @click="isOpened = !isOpened"
        @blur="isOpened = false"
      >
        <option
          v-for="option in options"
          :key="option.value"
          class="vselect__option"
          :value="option.value"
        >
          {{ option.value }}
        </option>
      </select>

      <SelectArrowIcon class="vselect__select-arrow" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.vselect {
  position: relative;

  &__select-wrapper {
    color: var(--theme-input-color);
    position: relative;
    transition: color 0.25s ease;
  }

  &__select {
    appearance: none;
    width: 100%;
  }

  &__select-arrow {
    height: 8px;
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translate(0, -50%);
    transition: transform 0.25s ease;
  }

  &--opened {
    .vselect__select-wrapper {
      color: var(--theme-focus-input-color);
    }

    .vselect__select-arrow {
      transform: translate(0, -50%) rotate(-180deg);
    }
  }
}
</style>
