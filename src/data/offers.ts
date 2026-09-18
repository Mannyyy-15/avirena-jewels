import { CartItem, Product } from '../types';
import { getPriceInINR } from './products';

export type PairOffer = {
  id: string;
  title: string;
  handles: [string, string];
  saving: number;
};

export const PAIR_OFFERS: PairOffer[] = [
  {
    id: 'crystal-hoops-duo',
    title: 'Crystal Hoops Duo',
    handles: ['avirena-crystal-hoops-gold-tone-earrings', 'avirena-crystal-hoops-silver-tone-earrings'],
    saving: 100,
  },
  {
    id: 'studs-hearts-duo',
    title: 'Studs + Hearts Duo',
    handles: ['avirena-square-studs-gold-tone-brass-earrings', 'avirena-heart-drops-silver-tone-earrings'],
    saving: 100,
  },
  {
    id: 'drops-spirals-duo',
    title: 'Drops + Spirals Duo',
    handles: ['avirena-drop-earrings-gold-tone-brass', 'avirena-spiral-earrings-silver-tone'],
    saving: 100,
  },
  {
    id: 'cascade-duo',
    title: 'Cascade Gold + Silver Duo',
    handles: ['avirena-cascade-statement-drops-gold-tone', 'avirena-cascade-statement-drops-silver'],
    saving: 100,
  },
];

export function resolvePairOffers(products: Product[]) {
  const byKey = new Map<string, Product>();
  products.forEach((p) => {
    if (p.handle) byKey.set(p.handle, p);
    if (p.id) byKey.set(p.id, p);
  });
  return PAIR_OFFERS.map((offer) => ({
    ...offer,
    products: offer.handles.map((h) => byKey.get(h)).filter(Boolean) as Product[],
  })).filter((offer) => offer.products.length === 2);
}

export function findPairOffer(product: Product, products: Product[]) {
  const targetKey = product.handle || product.id;
  return resolvePairOffers(products).find((offer) => offer.handles.includes(targetKey));
}

/**
 * Creates the two paired cart items linked with the same bundleGroupId.
 */
export function createPairBundleItems(offer: PairOffer, products: [Product, Product]): Omit<CartItem, 'id'>[] {
  const bundleGroupId = `bundle-${offer.id}-${Date.now()}`;
  return products.map((product) => ({
    product,
    quantity: 1,
    metal: product.metal,
    bundleGroupId,
    bundleTitle: offer.title,
    bundleSavings: offer.saving,
  }));
}

export type DisplayCartItem =
  | {
      type: 'single';
      item: CartItem;
    }
  | {
      type: 'bundle';
      bundleGroupId: string;
      bundleTitle: string;
      items: CartItem[];
      quantity: number;
      combinedPrice: number;
      combinedOriginalPrice: number;
      savings: number;
    };

/**
 * Groups cart items so that items sharing a bundleGroupId are merged into a single display unit.
 */
export function groupCartItemsForDisplay(items: CartItem[]): DisplayCartItem[] {
  const result: DisplayCartItem[] = [];
  const processedBundleGroups = new Set<string>();

  for (const item of items) {
    if (item.bundleGroupId) {
      if (processedBundleGroups.has(item.bundleGroupId)) continue;
      processedBundleGroups.add(item.bundleGroupId);

      const bundleMembers = items.filter((i) => i.bundleGroupId === item.bundleGroupId);
      const qty = bundleMembers[0]?.quantity || 1;
      const baseTotalInr = bundleMembers.reduce((sum, m) => sum + getPriceInINR(m.product.price), 0);
      const savings = bundleMembers[0]?.bundleSavings || 100;
      const finalPriceInr = Math.max(0, baseTotalInr - savings);

      result.push({
        type: 'bundle',
        bundleGroupId: item.bundleGroupId,
        bundleTitle: item.bundleTitle || 'Duo Suite',
        items: bundleMembers,
        quantity: qty,
        combinedPrice: finalPriceInr,
        combinedOriginalPrice: baseTotalInr,
        savings,
      });
    } else {
      result.push({
        type: 'single',
        item,
      });
    }
  }

  return result;
}

export function getAutomaticPairSavings(items: CartItem[]) {
  const quantityByHandle = new Map<string, number>();
  items.forEach((item) => {
    const handle = item.product.handle || item.product.id || '';
    quantityByHandle.set(handle, (quantityByHandle.get(handle) || 0) + item.quantity);
  });

  return PAIR_OFFERS.reduce((total, offer) => {
    const pairs = Math.min(
      quantityByHandle.get(offer.handles[0]) || 0,
      quantityByHandle.get(offer.handles[1]) || 0,
    );
    return total + pairs * offer.saving;
  }, 0);
}
