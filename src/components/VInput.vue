<script setup lang="ts">
const modelValue = defineModel();

withDefaults(
  defineProps<{
    label?: string;

    inputId: string;
    inputName?: string;
    inputType?: 'text' | 'number';
  }>(),
  {
    inputType: 'text',
  },
);
</script>

<template>
  <div class="vinput">
    <label class="vinput__label" :for="inputId">{{ label }}</label>

    <input
      class="vinput__input"
      v-model="modelValue"
      :type="inputType"
      :id="inputId"
      :name="inputName"
    />
  </div>
</template>
