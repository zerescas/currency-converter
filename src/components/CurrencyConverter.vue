<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import gsap from 'gsap';

import SwapIcon from './icons/SwapIcon.vue';
import VInput from './VInput.vue';
import VSelect, { type IOption } from './VSelect.vue';

import { useCurrencyExchangeAPI } from '@/composables/useCurrencyExchangeAPI';

const { getCurrencies, getCurrencyByLanguage, getExchangeRate, allowedCurrencies } =
  useCurrencyExchangeAPI();

const currenciesOptions = ref<IOption[]>([]);

const exchangeRate = ref();
const selectedFromCurrency = ref();
const selectedToCurrency = ref();

// Get exchange rate from API on change "From" or "To" currencies
watch(
  [selectedFromCurrency, selectedToCurrency],
  async ([newSelectedFromCurrency, newSelectedToCurrency]) => {
    exchangeRate.value = await getExchangeRate(newSelectedFromCurrency, newSelectedToCurrency);
  },
);

// Amount to exchange
const amount = ref(1);
const tweenedAmount = ref(0);
watch(
  amount,
  (newAmount) => {
    gsap.to(tweenedAmount, {
      value: newAmount,
      duration: 0.5,
    });
  },
  { immediate: true },
);

const formattedResultAmount = computed(() => {
  if (!selectedFromCurrency.value) return '';

  return `${formatNumber(tweenedAmount.value, selectedFromCurrency.value)} ${selectedFromCurrency.value}`;
});

// Exchange result
const tweenedExchangedAmount = ref(0);
watch(
  [amount, exchangeRate],
  ([newAmount, exchangeRate]) => {
    gsap.to(tweenedExchangedAmount, {
      value: newAmount * exchangeRate,
      duration: 0.5,
    });
  },
  { immediate: true },
);

const formattedResultExchange = computed(() => {
  if (!exchangeRate.value || !selectedToCurrency.value) return '';

  return `${formatNumber(tweenedExchangedAmount.value ?? 1, selectedToCurrency.value)} ${selectedToCurrency.value}`;
});

onMounted(async () => {
  // Fill "currenciesOptions" with API response
  const currenciesList = await getCurrencies();
  for (const currencyCode in currenciesList) {
    currenciesOptions.value.push({
      value: currencyCode.toUpperCase(),
      text: `${currencyCode.toUpperCase()} - ${currenciesList[currencyCode]}`,
    });
  }

  // Set "selectedFromCurrency" based on user's language
  // Set "selectedToCurrency" default value
  let userCurrencyCode = (await getCurrencyByLanguage(navigator.language))?.currency_code ?? '';
  if (!allowedCurrencies.includes(userCurrencyCode)) {
    userCurrencyCode = 'USD';
  }

  selectedFromCurrency.value = userCurrencyCode.toUpperCase();
  selectedToCurrency.value = 'USD';
});

function swapCurrencies() {
  [selectedFromCurrency.value, selectedToCurrency.value] = [
    selectedToCurrency.value,
    selectedFromCurrency.value,
  ];
}

function formatNumber(amount: number, currencyCode: string) {
  return Intl.NumberFormat(navigator.language, {
    style: 'currency',
    currency: currencyCode,
    currencyDisplay: 'narrowSymbol',
  }).format(amount ?? 0);
}
</script>

<template>
  <div class="currency-converter">
    <div class="vinput-group currency-converter__inputs">
      <VInput v-model="amount" label="Amount" input-id="money-amount" input-type="number" />

      <VSelect
        v-model="selectedFromCurrency"
        :options="currenciesOptions"
        label="From"
        select-id="from-currency"
      />

      <div class="currency-converter__to-currency">
        <button class="currency-converter__swap-currencies" @click="swapCurrencies">
          <SwapIcon class="currency-converter__swap-currencies-icon" />
        </button>

        <VSelect
          v-model="selectedToCurrency"
          :options="currenciesOptions"
          label="To"
          select-id="to-currency"
        />
      </div>
    </div>

    <div class="currency-converter__result">
      <div class="currency-converter__result-from">
        {{ formattedResultAmount || '...' }}
      </div>
      <div class="currency-converter__result-to">{{ formattedResultExchange || '...' }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.currency-converter {
  &__inputs {
    margin-bottom: 60px;

    @include desktop {
      max-width: 300px;
    }
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

  // Result
  &__result {
    overflow: auto;
    padding-bottom: 4px;
    padding-left: 20px;
    padding-top: 4px;
    position: relative;
    text-wrap: nowrap;

    &::before {
      background-color: var(--theme-color-accent);
      bottom: 0;
      content: '';
      left: 0;
      position: absolute;
      top: 0;
      width: 1px;
    }
  }

  &__result-from {
    font-size: 18px;
  }

  &__result-to {
    font-size: 32px;
    font-weight: 600;
  }
}
</style>
