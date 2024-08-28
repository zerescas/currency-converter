<script setup lang="ts">
import { ref } from 'vue';
import SwapIcon from './icons/SwapIcon.vue';
import VInput from './VInput.vue';
import VSelect, { type IOption } from './VSelect.vue';

const options: IOption[] = [{ value: 'USD' }, { value: 'RUB' }];

const selectedFromCurrency = ref(options[0].value);
const selectedToCurrency = ref(options[1].value);
</script>

<template>
  <div class="currency-converter">
    <div class="input-group currency-converter__inputs">
      <VInput label="Amount" input-id="money-amount" />

      <VSelect v-model="selectedFromCurrency" :options label="From" select-id="from-currency" />

      <div class="currency-converter__to-currency">
        <button class="currency-converter__swap-currencies">
          <SwapIcon class="currency-converter__swap-currencies-icon" />
        </button>

        <VSelect v-model="selectedToCurrency" :options label="To" select-id="to-currency" />
      </div>
    </div>

    <div class="currency-converter__result">
      <span style="font-size: 20px">24,000 RUB</span> <br />
      <span style="font-size: 20px">= </span>
      <span style="font-size: 32px; font-weight: 600">240 USD</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.currency-converter {
  &__inputs {
    margin-bottom: 60px;
  }

  &__to-currency {
    position: relative;
  }

  &__swap-currencies {
    background-color: transparent;
    border: none;
    color: inherit;
    cursor: pointer;
    height: 24px;
    left: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
    transition: color 0.3s ease;
    z-index: 1;

    @media (hover: hover) {
      &:hover {
        color: var(--theme-color-accent);
      }
    }
  }

  &__swap-currencies-icon {
    height: 100%;
    width: 100%;
  }
}
</style>
