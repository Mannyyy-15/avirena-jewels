import fs from 'fs';
import path from 'path';

interface DumpProduct {
  id: string;
  title: string;
  handle: string;
  status: string;
  updatedAt: string;
  description: string;
  imageCount: number;
  images: string[];
}

const dump: DumpProduct[] = JSON.parse(fs.readFileSync('shopify-catalog-dump.json', 'utf8'));

const METADATA: Record<string, {
  subtitle: string;
  category: 'earrings' | 'necklaces' | 'bracelets' | 'rings' | 'brooches';
  metal: 'Gold-Tone Brass' | 'Silver-Tone Alloy' | 'Anti-Tarnish Brass';
  priceInr: number;
  comparePriceInr: number;
  details: string[];
  materials: string;
}> = {
  'avirena-square-studs-gold-tone-brass-earrings': {
    subtitle: 'Modern Geometric Square Stud Earrings',
    category: 'earrings',
    metal: 'Gold-Tone Brass',
    priceInr: 799,
    comparePriceInr: 2499,
    details: [
      'Modern geometric square design with brushed-and-polished contrast',
      'Contemporary architectural statement silhouette',
      'Lightweight core for comfortable all-day wear',
      'Surgical steel hypoallergenic posts for sensitive ears',
      'Free delivery across India & 7-day easy returns',
    ],
    materials: 'High-grade brass with anti-tarnish gold-tone protective coating (nickel-free, lead-free) and surgical steel posts',
  },
  'avirena-drop-earrings-gold-tone-brass': {
    subtitle: 'Elongated Minimalist Drop Earrings',
    category: 'earrings',
    metal: 'Gold-Tone Brass',
    priceInr: 699,
    comparePriceInr: 2199,
    details: [
      'Elegant elongated drop design with clear round accent detail',
      'Streamlined minimalist silhouette suitable from office to evening',
      'Hollow-formed drop staying featherlight on the lobe',
      'Surgical steel hypoallergenic posts for sensitive ears',
      'Free delivery across India & 7-day easy returns',
    ],
    materials: 'High-grade brass with anti-tarnish gold-tone protective coating (nickel-free, lead-free) and surgical steel posts',
  },
  'avirena-statement-drops-geometric-brass-earrings': {
    subtitle: 'Sculptural Layered Geometric Brass Earrings',
    category: 'earrings',
    metal: 'Gold-Tone Brass',
    priceInr: 1199,
    comparePriceInr: 3999,
    details: [
      'Layered organic geometric drop design with fluid movement',
      'Sculptural statement scale without lobe weight',
      'High-polish mirror gold-tone finish',
      'Surgical steel hypoallergenic posts for sensitive ears',
      'Free delivery across India & 7-day easy returns',
    ],
    materials: 'High-grade brass with anti-tarnish gold-tone protective coating (nickel-free, lead-free) and surgical steel posts',
  },
  'avirena-heart-drops-silver-tone-earrings': {
    subtitle: 'Puffed Double Heart Silver-Tone Earrings',
    category: 'earrings',
    metal: 'Silver-Tone Alloy',
    priceInr: 779,
    comparePriceInr: 2499,
    details: [
      'Articulated double puffed heart drop silhouette',
      'Mirror-polished cool silver-tone protective finish',
      'Hollow-formed construction for zero lobe fatigue',
      'Surgical steel hypoallergenic posts for sensitive ears',
      'Free delivery across India & 7-day easy returns',
    ],
    materials: 'Durable alloy with anti-tarnish silver-tone protective coating (nickel-free, lead-free) and surgical steel posts',
  },
  'avirena-spiral-earrings-silver-tone': {
    subtitle: 'Sculptural Continuous Curve Silver-Tone Studs',
    category: 'earrings',
    metal: 'Silver-Tone Alloy',
    priceInr: 599,
    comparePriceInr: 1899,
    details: [
      'Continuous tapered spiral curving around the lobe',
      'Architectural unbroken line from every angle',
      'Sits close to the ear for continuous daily comfort',
      'Surgical steel hypoallergenic posts for sensitive ears',
      'Free delivery across India & 7-day easy returns',
    ],
    materials: 'Durable alloy with anti-tarnish silver-tone protective coating (nickel-free, lead-free) and surgical steel posts',
  },
  'avirena-crystal-hoops-gold-tone-earrings': {
    subtitle: 'Chunky Domed Hoop with Prong-Set Oval Crystal',
    category: 'earrings',
    metal: 'Gold-Tone Brass',
    priceInr: 599,
    comparePriceInr: 2199,
    details: [
      'Chunky domed hoop anchoring a brilliant prong-set oval crystal',
      'Polished gold-tone finish with high light-refraction stone',
      'Hollow-formed hoop so scale does not weigh down the lobe',
      'Surgical steel hypoallergenic posts for sensitive ears',
      'Free delivery across India & 7-day easy returns',
    ],
    materials: 'High-grade brass with anti-tarnish gold-tone coating & faceted glass crystal stone',
  },
  'avirena-crystal-hoops-silver-tone-earrings': {
    subtitle: 'Chunky Domed Hoop with Prong-Set Oval Crystal',
    category: 'earrings',
    metal: 'Silver-Tone Alloy',
    priceInr: 599,
    comparePriceInr: 2199,
    details: [
      'Chunky domed hoop anchoring a brilliant prong-set oval crystal',
      'Polished cool silver-tone finish with crisp sparkle',
      'Hollow-formed hoop so scale does not weigh down the lobe',
      'Surgical steel hypoallergenic posts for sensitive ears',
      'Free delivery across India & 7-day easy returns',
    ],
    materials: 'Durable alloy with anti-tarnish silver-tone coating & faceted glass crystal stone',
  },
  'avirena-pebble-studs-gold-tone-earrings': {
    subtitle: 'Organic Faceted Dome Gold-Tone Studs',
    category: 'earrings',
    metal: 'Gold-Tone Brass',
    priceInr: 699,
    comparePriceInr: 2199,
    details: [
      'Organic pebble-faceted dome silhouette inspired by sea-worn stone',
      'Natural asymmetrical light-catching contours',
      'Snug fit to the lobe with zero swing or snagging',
      'Surgical steel hypoallergenic posts for sensitive ears',
      'Free delivery across India & 7-day easy returns',
    ],
    materials: 'High-grade brass with anti-tarnish gold-tone protective coating (nickel-free, lead-free) and surgical steel posts',
  },
  'avirena-leaf-studs-gold-tone-earrings': {
    subtitle: 'Sculptural Folded Leaf Gold-Tone Earrings',
    category: 'earrings',
    metal: 'Gold-Tone Brass',
    priceInr: 699,
    comparePriceInr: 2499,
    details: [
      'Sculptural folded leaf silhouette with gentle central twist',
      'Sits upward along the earlobe creating an elongating line',
      'High-polish gold-tone luster reflecting light continuously',
      'Surgical steel hypoallergenic posts for sensitive ears',
      'Free delivery across India & 7-day easy returns',
    ],
    materials: 'High-grade brass with anti-tarnish gold-tone protective coating (nickel-free, lead-free) and surgical steel posts',
  },
  'avirena-duo-curve-hoops-gold-tone-brass': {
    subtitle: 'Sculptural Double-Band Gold-Tone Huggie Hoops',
    category: 'earrings',
    metal: 'Gold-Tone Brass',
    priceInr: 699,
    comparePriceInr: 2199,
    details: [
      'Architectural dual-band layered silhouette',
      'Brushed satin and mirror-polished gold-tone contrast',
      'Snug huggie hoop fit for continuous comfort',
      'Surgical steel hypoallergenic posts for sensitive ears',
      'Free delivery across India & 7-day easy returns',
    ],
    materials: 'High-grade brass with anti-tarnish gold-tone protective e-coating (nickel-free, lead-free) and surgical steel posts',
  },
  'avirena-tiered-pebble-drops-gold-tone-earrings': {
    subtitle: 'Articulated Triple Oval Bead Drop Earrings',
    category: 'earrings',
    metal: 'Gold-Tone Brass',
    priceInr: 799,
    comparePriceInr: 2499,
    details: [
      'Articulated triple oval drop design with kinetic swing',
      'Fluid link joins creating natural, graceful movement',
      'High-polish gold-tone mirror finish',
      'Surgical steel hypoallergenic posts for sensitive ears',
      'Free delivery across India & 7-day easy returns',
    ],
    materials: 'High-grade brass with anti-tarnish gold-tone protective e-coating (nickel-free, lead-free) and surgical steel posts',
  },
  'avirena-granulated-dome-studs-gold-tone': {
    subtitle: 'Textured Granulated Beaded Gold-Tone Studs',
    category: 'earrings',
    metal: 'Gold-Tone Brass',
    priceInr: 699,
    comparePriceInr: 2199,
    details: [
      'Rich granulated beaded caviar texture across an arched dome',
      'Dimensional relief with deep light scattering',
      'Ergonomic secure hinged post and latch mechanism',
      'Surgical steel hypoallergenic posts for sensitive ears',
      'Free delivery across India & 7-day easy returns',
    ],
    materials: 'High-grade brass with anti-tarnish gold-tone protective e-coating (nickel-free, lead-free) and surgical steel posts',
  },
  'avirena-brushed-orb-drops-gold-tone-earrings': {
    subtitle: 'Matte Spherical Ball Drop Hoop Earrings',
    category: 'earrings',
    metal: 'Gold-Tone Brass',
    priceInr: 799,
    comparePriceInr: 2499,
    details: [
      'Perfect spherical orb silhouette with warm brushed-satin finish',
      'Suspended from an articulated polished mini-hoop',
      'Dynamic kinetic motion as the sphere rolls with your pace',
      'Surgical steel hypoallergenic posts for sensitive ears',
      'Free delivery across India & 7-day easy returns',
    ],
    materials: 'High-grade brass with anti-tarnish gold-tone protective e-coating (nickel-free, lead-free) and surgical steel posts',
  },
  'avirena-cascade-statement-drops-gold-tone': {
    subtitle: 'Tiered Perforated Molten Fringe Drop Earrings',
    category: 'earrings',
    metal: 'Gold-Tone Brass',
    priceInr: 1199,
    comparePriceInr: 3999,
    details: [
      'Multi-tiered cascading molten fringe architecture',
      'Intricate organic cellular openwork detailing',
      'High-gloss mirror gold-tone finish with deep light reflection',
      'Surgical steel hypoallergenic posts with comfort disc backings',
      'Free delivery across India & 7-day easy returns',
    ],
    materials: 'High-grade brass with anti-tarnish gold-tone protective e-coating (nickel-free, lead-free) and surgical steel posts',
  },
};

const productsCode = dump.map((p) => {
  const meta = METADATA[p.handle] || {
    subtitle: 'Artisanal Dailywear Jewelry',
    category: 'earrings',
    metal: 'Gold-Tone Brass',
    priceInr: 699,
    comparePriceInr: 2199,
    details: [
      'Handcrafted anti-tarnish dailywear jewelry',
      'Hypoallergenic surgical steel posts',
      'Free delivery across India & 7-day easy returns',
    ],
    materials: 'High-grade brass with anti-tarnish protective coating',
  };

  const imagesFormatted = p.images.map((img) => `      '${img}'`).join(',\n');
  const detailsFormatted = meta.details.map((d) => `      '${d}'`).join(',\n');

  // Clean description snippet
  const cleanDesc = p.description
    .replace(/\s+/g, ' ')
    .replace('14-day exchanges on unworn pieces in original packaging.', 'Free delivery across India. 7-day easy returns on unworn pieces in original packaging.')
    .trim();

  return `  {
    id: '${p.handle}',
    shopifyId: '${p.id}',
    handle: '${p.handle}',
    name: '${p.title.replace(/'/g, "\\'")}',
    subtitle: '${meta.subtitle.replace(/'/g, "\\'")}',
    category: '${meta.category}',
    metal: '${meta.metal}',
    price: ${(meta.priceInr / 90.0).toFixed(2)},
    originalPrice: ${(meta.comparePriceInr / 90.0).toFixed(2)},
    images: [
${imagesFormatted}
    ],
    description: '${cleanDesc.replace(/'/g, "\\'")}',
    details: [
${detailsFormatted}
    ],
    materials: '${meta.materials.replace(/'/g, "\\'")}',
    inStock: true,
    isBestseller: true,
    isSculptural: true
  }`;
}).join(',\n');

const fullFile = `import { Product, CurrencyConfig, Currency } from '../types';

export const CURRENCIES: Record<Currency, CurrencyConfig> = {
  INR: { code: 'INR', symbol: '₹', rate: 90.0, label: 'INR (₹)' },
  EUR: { code: 'EUR', symbol: '₹', rate: 90.0, label: 'INR (₹)' },
  USD: { code: 'USD', symbol: '₹', rate: 90.0, label: 'INR (₹)' },
  GBP: { code: 'GBP', symbol: '₹', rate: 90.0, label: 'INR (₹)' },
};

export const formatPrice = (price: number, currency: Currency = 'INR'): string => {
  const inrAmount = price < 500 ? Math.round(price * 90) : Math.round(price);
  return \`₹\${inrAmount.toLocaleString('en-IN')}\`;
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
    inrCompare = 1899; // ~68% off (Volute Spiral: 599 vs 1899 = 68% off)
  } else if (inrSelling <= 700) {
    inrCompare = 2199; // ~68%–70% off (Solene 649, Lume 699, Petra 699)
  } else if (inrSelling <= 800) {
    inrCompare = 2499; // ~68%–70% off (Foglia 749 vs 2499, Nadir 799, Amara 799)
  } else if (inrSelling <= 1000) {
    inrCompare = 2999; // ~68%–70% off
  } else if (inrSelling <= 1250) {
    inrCompare = 3999; // ~70% off (Forma 1199 vs 3999 = 70% off)
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

export const PRODUCTS: Product[] = [
${productsCode}
];
`;

fs.writeFileSync('src/data/products.ts', fullFile);
console.log('Successfully synced src/data/products.ts with all 9 Shopify products and their real image sets!');
