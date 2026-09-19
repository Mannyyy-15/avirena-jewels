import type { CartItem, Product } from '~/types/storefront';
import { getPriceInINR } from '~/lib/currency';

export type PairOffer = {
  id: string;
  title: string;
  handles: [string, string];
  saving: number;
  shopifyHandle?: string;
  bundleProduct?: Product;
};

export const PAIR_OFFERS: PairOffer[] = [
  {
    id: 'crystal-hoops-duo',
    title: 'Crystal Hoops Duo',
    handles: ['avirena-crystal-hoops-gold-tone-earrings', 'avirena-crystal-hoops-silver-tone-earrings'],
    saving: 100,
    shopifyHandle: 'crystal-hoops-duo',
  },
  {
    id: 'studs-hearts-duo',
    title: 'Studs + Hearts Duo',
    handles: ['avirena-square-studs-gold-tone-brass-earrings', 'avirena-heart-drops-silver-tone-earrings'],
    saving: 100,
    shopifyHandle: 'studs-hearts-duo',
  },
  {
    id: 'drops-spirals-duo',
    title: 'Drops + Spirals Duo',
    handles: ['avirena-drop-earrings-gold-tone-brass', 'avirena-spiral-earrings-silver-tone'],
    saving: 100,
    shopifyHandle: 'drops-spirals-duo',
  },
  {
    id: 'cascade-duo',
    title: 'Cascade Gold + Silver Duo',
    handles: ['avirena-cascade-statement-drops-gold-tone', 'avirena-cascade-statement-drops-silver'],
    saving: 100,
    shopifyHandle: 'cascade-statement-duo',
  },
  {
    id: 'leaf-pebble-duo',
    title: 'Leaf + Pebble Duo',
    handles: ['avirena-leaf-studs-gold-tone-earrings', 'avirena-pebble-studs-gold-tone-earrings'],
    saving: 100,
    shopifyHandle: 'leaf-pebble-duo',
  },
  {
    id: 'orb-curve-duo',
    title: 'Brushed Orb + Duo Curve Duo',
    handles: ['avirena-brushed-orb-drops-gold-tone-earrings', 'avirena-duo-curve-hoops-gold-tone-brass'],
    saving: 100,
    shopifyHandle: 'orb-curve-duo',
  },
];

export function resolvePairOffers(products: Product[]) {
  const byKey = new Map<string, Product>();
  products.forEach((p) => {
    if (p.handle) byKey.set(p.handle, p);
    if (p.id) byKey.set(p.id, p);
  });
  return PAIR_OFFERS.map((offer) => {
    let bundleProduct = offer.shopifyHandle ? byKey.get(offer.shopifyHandle) : undefined;
    const resolvedProducts = offer.handles.map((h) => byKey.get(h)).filter(Boolean) as Product[];

    if (bundleProduct && resolvedProducts.length === 2) {
      const compositeMain = `/assets/bundles/${offer.shopifyHandle}.webp`;
      const p1Images = resolvedProducts[0].images || [];
      const p2Images = resolvedProducts[1].images || [];
      const distinctOriginals = Array.from(new Set([...p1Images, ...p2Images])).filter(
        (u) => u !== compositeMain
      );
      const allImages = [compositeMain, ...distinctOriginals];

      bundleProduct = {
        ...bundleProduct,
        images: allImages,
        media: allImages.map((url) => ({ contentType: 'image' as const, url })),
      };
    }

    return {
      ...offer,
      bundleProduct,
      products: resolvedProducts,
    };
  }).filter((offer) => offer.products.length === 2);
}

export function findPairOffer(product: Product, products: Product[]) {
  const targetKey = product.handle || product.id;
  return resolvePairOffers(products).find((offer) => offer.handles.includes(targetKey) || (offer.bundleProduct && (offer.bundleProduct.handle === targetKey || offer.bundleProduct.id === targetKey)));
}

/**
 * Creates cart items for a pair. If the native Shopify Bundle product exists in the catalog,
 * it returns the single native bundle line item; otherwise it returns linked paired items.
 */
export function createPairBundleItems(offer: PairOffer, products: [Product, Product]): Omit<CartItem, 'id'>[] {
  if (offer.bundleProduct) {
    const images =
      offer.bundleProduct.images && offer.bundleProduct.images.length > 0
        ? offer.bundleProduct.images
        : [products[0].images?.[0] || '/logo.png', products[1].images?.[0] || '/logo.png'];

    const bundleMetal =
      offer.bundleProduct.metal && !/18k|rhodium/i.test(offer.bundleProduct.metal)
        ? offer.bundleProduct.metal
        : products[0].metal === products[1].metal
        ? products[0].metal
        : 'Gold & Silver Tone Brass';

    const hydratedProduct: Product = {
      ...offer.bundleProduct,
      images,
      metal: bundleMetal,
    };

    return [
      {
        product: hydratedProduct,
        quantity: 1,
        metal: hydratedProduct.metal,
        variantId: offer.bundleProduct.variants?.[0]?.id,
        bundleGroupId: `bundle-${offer.id}-${Date.now()}`,
        bundleTitle: offer.title,
        bundleSavings: offer.saving,
      },
    ];
  }

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
