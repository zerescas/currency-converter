<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import gsap from 'gsap';

import SwapIcon from './icons/SwapIcon.vue';
import VInput from './VInput.vue';
import VSelect, { type IOption } from './VSelect.vue';

import { useCurrencyExchangeAPI } from '@/composables/useCurrencyExchangeAPI';
import ErrorWrapper from './ErrorWrapper.vue';

const { getCurrencies, getCurrencyByLanguage, getExchangeRate, allowedCurrencies } =
  useCurrencyExchangeAPI();

const currenciesOptions = ref<IOption[]>([]);

const exchangeRate = ref();
const selectedFromCurrency = ref();
const selectedToCurrency = ref();

// Variables to handle API error through <ErrorWrapper> component
const isLoading = ref(false);
const isError = ref(false);
const errorMessage = ref('');
const reloadFunc = ref<() => void>();

// Get exchange rate from API on change "From" or "To" currencies
watch(
  [selectedFromCurrency, selectedToCurrency],
  async (
    [newSelectedFromCurrency, newSelectedToCurrency],
    [oldSelectedFromCurrency, oldSelectedToCurrency],
  ) => {
    try {
      isLoading.value = true;
      exchangeRate.value = null;

      exchangeRate.value = await getExchangeRate(newSelectedFromCurrency, newSelectedToCurrency);
    } catch (error) {
      isError.value = true;
      errorMessage.value = 'Cannot get exchange rate';

      selectedFromCurrency.value = oldSelectedFromCurrency;
      selectedToCurrency.value = oldSelectedToCurrency;

      reloadFunc.value = () => {
        isError.value = false;
        selectedFromCurrency.value = newSelectedFromCurrency;
        selectedToCurrency.value = newSelectedToCurrency;
      };
    } finally {
      isLoading.value = false;
    }
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
  initComponent();
});

async function initComponent() {
  try {
    isLoading.value = true;

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
  } catch (error) {
    isError.value = true;
    errorMessage.value = 'Cannot initialize currency converter';

    reloadFunc.value = () => {
      isError.value = false;
      setTimeout(() => initComponent(), 300);
    };
  } finally {
    isLoading.value = false;
  }
}

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
  <ErrorWrapper :is-enabled="isError" :message="errorMessage" @reload="reloadFunc">
    <div class="currency-converter" :class="{ 'currency-converter--loading': isLoading }">
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
          {{ formattedResultAmount || 'Please wait' }}
        </div>
        <div class="currency-converter__result-to">{{ formattedResultExchange || 'Loading' }}</div>
      </div>
    </div>
  </ErrorWrapper>
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

  &--loading {
    pointer-events: none;

    .currency-converter__result {
      animation: breath 0.5s alternate-reverse ease infinite;
    }
  }
}

@keyframes breath {
  0% {
    opacity: 0.25;
  }

  100% {
    opacity: 1;
  }
}
</style>
