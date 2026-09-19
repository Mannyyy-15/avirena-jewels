import { Product } from '../types';

/**
 * GA4 ecommerce events.
 *
 * The site already reports the funnel to the Meta pixel, but sent GA4 nothing
 * beyond automatic page_view - which is why GA4 showed "Key events: 0" while
 * hundreds of users browsed. These helpers emit GA4's standard ecommerce
 * events so both platforms describe the same funnel.
 *
 * Purchase is deliberately absent: the order completes on
 * checkout.avirenajewels.com, a different origin this page cannot observe.
 * Shopify reports that side. Adding a Purchase here would invent a sale.
 *
 * Every call is a no-op when gtag is missing (blocked, consent tooling, an ad
 * blocker), so analytics can never break a buying flow.
 */

type GtagParams = Record<string, unknown>;

const send = (event: string, params: GtagParams): void => {
  if (typeof window === 'undefined') return;
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag !== 'function') return;
  try {
    gtag('event', event, params);
  } catch {
    /* Never let a tracking failure interrupt the page. */
  }
};

/** GA4 expects a plain number; prices are already rupees on this catalogue. */
const toAmount = (price: number): number =>
  price < 500 ? Math.round(price * 90) : Math.round(price);

const itemOf = (product: Product, quantity = 1): GtagParams => ({
  item_id: product.handle || product.id,
  item_name: product.name,
  item_brand: 'Avirena Jewels',
  item_category: product.category,
  item_variant: product.metal,
  price: toAmount(product.price),
  quantity,
});

export const trackViewItem = (product: Product): void => {
  send('view_item', {
    currency: 'INR',
    value: toAmount(product.price),
    items: [itemOf(product)],
  });
};

export const trackAddToCart = (product: Product, quantity = 1): void => {
  send('add_to_cart', {
    currency: 'INR',
    value: toAmount(product.price) * quantity,
    items: [itemOf(product, quantity)],
  });
};

export const trackAddToWishlist = (product: Product): void => {
  send('add_to_wishlist', {
    currency: 'INR',
    value: toAmount(product.price),
    items: [itemOf(product)],
  });
};

/** Fired at every hand-off to Shopify checkout: PDP Buy Now, cart, drawer. */
export const trackBeginCheckout = (
  items: { product: Product; quantity: number }[],
): void => {
  const value = items.reduce(
    (sum, i) => sum + toAmount(i.product.price) * i.quantity,
    0,
  );
  send('begin_checkout', {
    currency: 'INR',
    value,
    items: items.map((i) => itemOf(i.product, i.quantity)),
  });
};
