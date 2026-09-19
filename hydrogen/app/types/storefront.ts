export type Category = 'all' | 'rings' | 'necklaces' | 'earrings' | 'bracelets' | 'sets' | 'brooches';

export type Metal =
  | 'Gold-Tone Brass'
  | 'Silver-Tone Brass'
  | 'Silver-Tone Alloy'
  | 'Anti-Tarnish Brass'
  | 'Rose Gold-Tone'
  | 'Gold & Silver Tone Brass'
  | string;

export type Currency = 'EUR' | 'INR' | 'USD' | 'GBP';

export interface ProductVariant {
  id: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  availableForSale: boolean;
  /** Units left, straight from Shopify. Undefined when the store does not track inventory. */
  quantityAvailable?: number;
  selectedOptions?: { name: string; value: string }[];
  sku?: string;
}

export interface ProductMedia {
  contentType: 'image' | 'video';
  /** Image URL, or the mp4 source URL for video items */
  url: string;
  /** Preview/poster frame, present on video items */
  poster?: string;
}

export interface Product {
  id: string;
  shopifyId?: string;
  handle?: string;
  name: string;
  subtitle?: string;
  category: Category;
  metal: Metal;
  price: number; // Base price (in INR or EUR)
  originalPrice?: number;
  /** Only set when backed by a real review system. Never hardcode. */
  rating?: number;
  /** Only set when backed by a real review system. Never hardcode. */
  reviewsCount?: number;
  images: string[];
  /** Ordered Shopify gallery (images + videos). Undefined for mock products. */
  media?: ProductMedia[];
  description: string;
  details: string[];
  materials: string;
  sizes?: string[];
  inStock: boolean;
  isBestseller?: boolean;
  isNew?: boolean;
  isSculptural?: boolean;
  styledWithIds?: string[];
  tags?: string[];
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
  bundleGroupId?: string;
  bundleTitle?: string;
  bundleSavings?: number;
}

export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  rate: number;
  label: string;
}
