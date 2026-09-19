export interface AnalyticsItem {
  id: string;
  name: string;
  category?: string;
  metal?: string;
  price: number;
  quantity?: number;
}

const sendGtag = (event: string, params: Record<string, unknown>): void => {
  if (typeof window === 'undefined') return;
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag !== 'function') return;
  try {
    gtag('event', event, params);
  } catch {
    // Never let tracking failure interrupt UX
  }
};

const sendFbq = (event: string, params?: Record<string, unknown>): void => {
  if (typeof window === 'undefined') return;
  const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq;
  if (typeof fbq !== 'function') return;
  try {
    if (params) {
      fbq('track', event, params);
    } else {
      fbq('track', event);
    }
  } catch {
    // Never let tracking failure interrupt UX
  }
};

const toAmount = (price: number): number => Math.round(price);

export const trackViewItem = (item: AnalyticsItem): void => {
  const amount = toAmount(item.price);

  sendGtag('view_item', {
    currency: 'INR',
    value: amount,
    items: [
      {
        item_id: item.id,
        item_name: item.name,
        item_brand: 'Avirena Jewels',
        item_category: item.category || 'Jewelry',
        item_variant: item.metal || 'Brass',
        price: amount,
        quantity: 1,
      },
    ],
  });

  sendFbq('ViewContent', {
    content_name: item.name,
    content_ids: [item.id],
    content_type: 'product',
    value: amount,
    currency: 'INR',
  });
};

export const trackAddToCart = (item: AnalyticsItem, quantity = 1): void => {
  const amount = toAmount(item.price) * quantity;

  sendGtag('add_to_cart', {
    currency: 'INR',
    value: amount,
    items: [
      {
        item_id: item.id,
        item_name: item.name,
        item_brand: 'Avirena Jewels',
        item_category: item.category || 'Jewelry',
        item_variant: item.metal || 'Brass',
        price: toAmount(item.price),
        quantity,
      },
    ],
  });

  sendFbq('AddToCart', {
    content_name: item.name,
    content_ids: [item.id],
    content_type: 'product',
    value: amount,
    currency: 'INR',
  });
};

export const trackBeginCheckout = (items: AnalyticsItem[]): void => {
  const totalValue = items.reduce(
    (sum, item) => sum + toAmount(item.price) * (item.quantity || 1),
    0,
  );

  sendGtag('begin_checkout', {
    currency: 'INR',
    value: totalValue,
    items: items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      item_brand: 'Avirena Jewels',
      item_category: item.category || 'Jewelry',
      item_variant: item.metal || 'Brass',
      price: toAmount(item.price),
      quantity: item.quantity || 1,
    })),
  });

  sendFbq('InitiateCheckout', {
    num_items: items.reduce((sum, item) => sum + (item.quantity || 1), 0),
    content_ids: items.map((item) => item.id),
    value: totalValue,
    currency: 'INR',
  });
};
