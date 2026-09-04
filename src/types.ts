export type Category = 'all' | 'rings' | 'necklaces' | 'earrings' | 'bracelets' | 'sets' | 'brooches';

export type Metal = 'Gold-Tone Brass' | 'Silver-Tone Alloy' | 'Anti-Tarnish Brass' | 'Rose Gold-Tone';

export type Currency = 'EUR' | 'INR' | 'USD' | 'GBP';

export interface ProductVariant {
  id: string;
  title: string;
  price: number;
  availableForSale: boolean;
  selectedOptions?: { name: string; value: string }[];
  sku?: string;
}

export interface Product {
  id: string;
  shopifyId?: string;
  handle?: string;
  name: string;
  subtitle?: string;
  category: Category;
  metal: Metal;
  price: number; // Base in EUR
  originalPrice?: number;
  /** Only set when backed by a real review system. Never hardcode. */
  rating?: number;
  /** Only set when backed by a real review system. Never hardcode. */
  reviewsCount?: number;
  images: string[];
  description: string;
  details: string[];
  materials: string;
  sizes?: string[];
  inStock: boolean;
  isBestseller?: boolean;
  isNew?: boolean;
  isSculptural?: boolean;
  styledWithIds?: string[];
  variants?: ProductVariant[];
}

export interface CartItem {
  id: string;
  shopifyLineId?: string;
  variantId?: string;
  product: Product;
  quantity: number;
  metal: Metal;
  size?: string;
}

export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  rate: number; // Relative to EUR (1 EUR = X)
  label: string;
}

export type PageView =
  | 'home'
  | 'collection'
  | 'shop'
  | 'collections'
  | 'about'
  | 'contact'
  | 'journal'
  | 'faq'
  | 'policies'
  | 'guides'
  | 'pdp'
  | 'cart'
  | 'checkout'
  | 'story'
  | 'care';

export interface ShopifyConfig {
  domain: string;
  storefrontAccessToken: string;
  apiVersion: string;
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
    subtotalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
  lines: {
    id: string;
    quantity: number;
    merchandise: {
      id: string;
      title: string;
      product: {
        id: string;
        title: string;
        handle: string;
      };
      price: {
        amount: string;
        currencyCode: string;
      };
      image?: {
        url: string;
        altText?: string;
      };
    };
  }[];
}
