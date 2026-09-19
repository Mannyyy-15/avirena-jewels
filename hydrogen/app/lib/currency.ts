import type { Currency, CurrencyConfig } from '~/types/storefront';

export const CURRENCIES: Record<Currency, CurrencyConfig> = {
  INR: { code: 'INR', symbol: '₹', rate: 90.0, label: 'INR (₹)' },
  EUR: { code: 'EUR', symbol: '₹', rate: 90.0, label: 'INR (₹)' },
  USD: { code: 'USD', symbol: '₹', rate: 90.0, label: 'INR (₹)' },
  GBP: { code: 'GBP', symbol: '₹', rate: 90.0, label: 'INR (₹)' },
};

export const getPriceInINR = (price: number): number => {
  if (!price || price <= 0) return 0;
  return price < 500 ? Math.round(price * 90) : Math.round(price);
};

export const formatInr = (amount: number): string => {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
};

export const formatPrice = (price: number, _currency: Currency = 'INR'): string => {
  const inrAmount = getPriceInINR(price);
  return `₹${inrAmount.toLocaleString('en-IN')}`;
};

/**
 * Resolves the compare-at price (MRP) for discount display.
 * If a valid compare-at price > selling price is provided, it is prioritized.
 * Otherwise, derives an attractive luxury retail MRP (~65%–72% off, ending in 99).
 */
export const getCompareAtPrice = (price: number, existingOriginalPrice?: number): number => {
  if (existingOriginalPrice && existingOriginalPrice > price) {
    return existingOriginalPrice;
  }
  const inrSelling = price < 500 ? Math.round(price * 90) : Math.round(price);
  
  let inrCompare: number;
  if (inrSelling <= 500) {
    inrCompare = 1699; // ~70% off
  } else if (inrSelling <= 600) {
    inrCompare = 1899; // ~68% off
  } else if (inrSelling <= 700) {
    inrCompare = 2199; // ~68%–70% off
  } else if (inrSelling <= 800) {
    inrCompare = 2499; // ~68%–70% off
  } else if (inrSelling <= 1000) {
    inrCompare = 2999; // ~68%–70% off
  } else if (inrSelling <= 1250) {
    inrCompare = 3999; // ~70% off
  } else if (inrSelling <= 1500) {
    inrCompare = 4699; // ~68%–70% off
  } else {
    inrCompare = Math.round((inrSelling * 3.2) / 100) * 100 - 1;
  }

  return price < 500 ? inrCompare / 90.0 : inrCompare;
};

/**
 * Calculates the integer discount percentage between selling price and compare-at price.
 */
export const getDiscountPercentage = (price: number, compareAtPrice?: number): number => {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  const inrSelling = price < 500 ? Math.round(price * 90) : Math.round(price);
  const inrCompare = compareAtPrice < 500 ? Math.round(compareAtPrice * 90) : Math.round(compareAtPrice);
  if (inrCompare <= inrSelling) return 0;
  return Math.max(1, Math.round(((inrCompare - inrSelling) / inrCompare) * 100));
};
