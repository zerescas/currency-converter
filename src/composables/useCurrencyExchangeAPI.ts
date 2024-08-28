import axios from 'axios';

interface CurrenciesByCountries {
  country_iso3: string;
  country_iso_numeric: string;
  country_name: string;
  currency_code: string;
  currency_name: string;
  currency_number: string;
}

interface ExchangeRates {
  date: string;
  [currencyCode: string]: ExchangeRate | string;
}

interface ExchangeRate {
  [currencyCode: string]: string;
}

const apiClient = axios.create({
  baseURL: 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api/v1',
});

const allowedCurrencies = ['rub', 'usd', 'eur', 'gbp'];

export const useCurrencyExchangeAPI = function () {
  /** Get list of currencies in next format:
   * @example
   * "usd": "US Dollar"
   */
  async function getCurrencies() {
    try {
      const response = await apiClient.get<Record<string, string>>('currencies.json');
      const filteredResponse: Record<string, string> = Object.keys(response.data)
        .filter((key) => allowedCurrencies.includes(key))
        .reduce((object, key) => {
          return Object.assign(object, {
            [key]: response.data[key],
          });
        }, {});

      return filteredResponse;
    } catch (error) {
      console.error('Failed to get currencies list:', error);
      throw error;
    }
  }

  /** Get list of currencies grouped by countries in next format
   * @example
   * "us": {
   *    "country_name": "united states of america (the)",
   *    "country_iso3": "usa",
   *    "country_iso_numeric": "840",
   *    "currency_name": "us dollar",
   *    "currency_code": "usd",
   *    "currency_number": "840"
   * }
   */
  async function getCountriesCurrencies() {
    try {
      const response = await apiClient.get<Record<string, CurrenciesByCountries>>('country.json');
      return response.data;
    } catch (error) {
      console.error('Failed to get currencies by countries:', error);
      throw error;
    }
  }

  /** Get currency by provided language
   * @param language - A value from navigator.language ('ru-RU', 'us-GB', etc)
   */
  async function getCurrencyByLanguage(language: string) {
    const locale = language.split('-').at(-1)?.toLowerCase();
    if (!locale) return;

    return (await getCountriesCurrencies())[locale];
  }

  /** Get list of exchange rates for base currency
   * @example
   * {
   *   "date": "2013-08-28",
   *   "USD": {
   *     "RUB": 33.1224
   *   }
   * }
   * @param currencyCode - base currency
   */
  async function getExchangeRates(currencyCode: string) {
    try {
      const response = await apiClient.get<ExchangeRates>(
        `currencies/${currencyCode.toLowerCase()}.json`,
      );
      return response.data;
    } catch (error) {
      console.error('Failed to get exchange rates:', error);
      throw error;
    }
  }

  /** Get exchange rate from "currencyCodeFrom" to "currencyCodeTo"
   * @param currencyCodeFrom - base currency
   * @param currencyCodeTo - currency to exchange
   */
  async function getExchangeRate(currencyCodeFrom: string, currencyCodeTo: string) {
    try {
      const response = await getExchangeRates(currencyCodeFrom);

      const exchangeRates = response[currencyCodeFrom.toLowerCase()] as ExchangeRate;
      const exchangeRate = exchangeRates[currencyCodeTo.toLowerCase()];

      return exchangeRate;
    } catch (error) {
      console.error('Failed to get exchange rate:', error);
      throw error;
    }
  }

  return {
    getCurrencies,
    getCurrencyByLanguage,
    getExchangeRates,
    getExchangeRate,
    allowedCurrencies,
  };
};
