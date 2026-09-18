import { CartItem, Product } from '../types';

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
  const byHandle = new Map(products.map((product) => [product.handle, product]));
  return PAIR_OFFERS.map((offer) => ({
    ...offer,
    products: offer.handles.map((handle) => byHandle.get(handle)).filter(Boolean) as Product[],
  })).filter((offer) => offer.products.length === 2);
}

export function findPairOffer(product: Product, products: Product[]) {
  return resolvePairOffers(products).find((offer) => offer.handles.includes(product.handle || ''));
}

export function getAutomaticPairSavings(items: CartItem[]) {
  const quantityByHandle = new Map<string, number>();
  items.forEach((item) => {
    const handle = item.product.handle || '';
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
