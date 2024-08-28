<script setup lang="ts">
import VHeader from '@/components/VHeader.vue';
import VContent from '@/components/VContent.vue';
import CurrencyConverter from '@/components/CurrencyConverter.vue';
import ScrollContainer from './components/ScrollContainer.vue';
</script>

<template>
  <VHeader />

  <VContent>
    <ScrollContainer>
      <CurrencyConverter />
    </ScrollContainer>
  </VContent>
</template>
