/**
 * Currency formatting utilities
 */

export type SupportedCurrency = 'RON' | 'EUR' | 'USD';

export interface CurrencyInfo {
  code: SupportedCurrency;
  symbol: string;
  name: string;
  locale: string;
}

export const SUPPORTED_CURRENCIES: Record<SupportedCurrency, CurrencyInfo> = {
  RON: {
    code: 'RON',
    symbol: 'lei',
    name: 'Romanian Leu',
    locale: 'ro-RO'
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    locale: 'en-EU'
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    locale: 'en-US'
  }
};

/**
 * Format a price with the appropriate currency symbol and formatting
 */
export function formatPrice(
  price: number,
  currency: SupportedCurrency = 'USD'
): string {
  const currencyInfo = SUPPORTED_CURRENCIES[currency];
  
  if (!currencyInfo) {
    console.warn(`Unsupported currency: ${currency}, falling back to USD`);
    return formatPrice(price, 'USD');
  }

  // Special formatting for Romanian Leu (symbol comes after the number)
  if (currency === 'RON') {
    return `${Math.round(price)} ${currencyInfo.symbol}`;
  }

  // For EUR and USD, symbol comes before the number
  return `${currencyInfo.symbol}${Math.round(price)}`;
}

/**
 * Format a price with full locale-aware formatting (includes decimals)
 */
export function formatPriceLocale(
  price: number,
  currency: SupportedCurrency = 'USD'
): string {
  const currencyInfo = SUPPORTED_CURRENCIES[currency];
  
  if (!currencyInfo) {
    console.warn(`Unsupported currency: ${currency}, falling back to USD`);
    return formatPriceLocale(price, 'USD');
  }

  try {
    return new Intl.NumberFormat(currencyInfo.locale, {
      style: 'currency',
      currency: currencyInfo.code,
    }).format(price);
  } catch (error) {
    console.warn(`Error formatting price with Intl.NumberFormat, falling back to simple format:`, error);
    return formatPrice(price, currency);
  }
}

/**
 * Get currency symbol for a given currency code
 */
export function getCurrencySymbol(currency: SupportedCurrency): string {
  return SUPPORTED_CURRENCIES[currency]?.symbol || '$';
}

/**
 * Get currency name for a given currency code
 */
export function getCurrencyName(currency: SupportedCurrency): string {
  return SUPPORTED_CURRENCIES[currency]?.name || 'US Dollar';
}

/**
 * Get all supported currencies for dropdowns/selects
 */
export function getSupportedCurrencies() {
  return Object.values(SUPPORTED_CURRENCIES).map(currency => ({
    value: currency.code,
    label: `${currency.name} (${currency.code})`,
    symbol: currency.symbol
  }));
}
