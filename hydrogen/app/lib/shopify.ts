import type { Product, ProductVariant, Category, Metal, ProductMedia } from '~/types/storefront';
import { getCompareAtPrice } from '~/lib/currency';

/**
 * Materials copy per metal, used for the PDP "Materials" accordion.
 *
 * "Hypoallergenic" is deliberately absent: the term is unregulated in India and
 * the site's own sensitive-skin guide warns against relying on it, so the copy
 * states the verifiable facts (nickel/lead/cadmium-free, surgical steel posts).
 */
export const METAL_MATERIALS: Record<string, string> = {
  'Gold-Tone Brass':
    'High-grade brass with anti-tarnish gold-tone e-coating. Nickel-free, lead-free and cadmium-free, with surgical steel posts.',
  'Silver-Tone Brass':
    'High-grade brass with protective anti-tarnish silver-tone e-coating. Nickel-free, lead-free and cadmium-free, with surgical steel posts.',
  'Anti-Tarnish Brass':
    'High-grade brass with a protective anti-tarnish e-coating. Nickel-free, lead-free and cadmium-free, with surgical steel posts.',
  'Silver-Tone Alloy':
    'High-grade brass with protective anti-tarnish silver-tone coating. Nickel-free, lead-free and cadmium-free, with surgical steel posts.',
  'Gold & Silver Tone Brass':
    'High-grade brass with protective anti-tarnish gold and silver tone coatings. Nickel-free, lead-free and cadmium-free, with surgical steel posts.',
  'Rose Gold-Tone':
    'High-grade brass with anti-tarnish rose gold-tone e-coating. Nickel-free, lead-free and cadmium-free, with surgical steel posts.',
};

export const BUNDLE_COMPOSITES: Record<string, string> = {
  'crystal-hoops-duo': '/assets/bundles/crystal-hoops-duo.webp',
  'studs-hearts-duo': '/assets/bundles/studs-hearts-duo.webp',
  'drops-spirals-duo': '/assets/bundles/drops-spirals-duo.webp',
  'cascade-statement-duo': '/assets/bundles/cascade-statement-duo.webp',
  'leaf-pebble-duo': '/assets/bundles/leaf-pebble-duo.webp',
  'orb-curve-duo': '/assets/bundles/orb-curve-duo.webp',
};

export const PRODUCT_IMAGE_OVERRIDES: Record<string, string[]> = {};

export const STOREFRONT_PRODUCTS_QUERY = `#graphql
  query StorefrontProducts($first: Int = 50) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          productType
          tags
          availableForSale
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          compareAtPriceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 10) {
            edges {
              node {
                url
                altText
              }
            }
          }
          media(first: 20) {
            edges {
              node {
                mediaContentType
                alt
                ... on Video {
                  sources { url mimeType }
                  previewImage { url }
                }
                ... on MediaImage {
                  image { url }
                }
              }
            }
          }
          variants(first: 20) {
            edges {
              node {
                id
                title
                availableForSale
                price {
                  amount
                  currencyCode
                }
                selectedOptions {
                  name
                  value
                }
                sku
              }
            }
          }
        }
      }
    }
  }
`;

export const STOREFRONT_PRODUCT_BY_HANDLE_QUERY = `#graphql
  query StorefrontProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      productType
      tags
      availableForSale
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      compareAtPriceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      media(first: 20) {
        edges {
          node {
            mediaContentType
            alt
            ... on Video {
              sources { url mimeType }
              previewImage { url }
            }
            ... on MediaImage {
              image { url }
            }
          }
        }
      }
      variants(first: 20) {
        edges {
          node {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
            sku
          }
        }
      }
    }
  }
`;

export function transformShopifyProduct(node: any): Product {
  let images = (node.images?.edges || []).map((edge: any) => edge.node.url);
  const compositeUrl = node.handle ? BUNDLE_COMPOSITES[node.handle] : undefined;
  if (compositeUrl) {
    images = [compositeUrl, ...images.filter((u: string) => u !== compositeUrl)];
  }

  const customImages = node.handle ? PRODUCT_IMAGE_OVERRIDES[node.handle] : undefined;
  if (customImages && customImages.length > 0) {
    const remaining = images.slice(customImages.length);
    images = [...customImages, ...remaining];
  }

  let media: ProductMedia[] = (node.media?.edges || [])
    .map((edge: any) => {
      const m = edge.node;
      if (m.mediaContentType === 'VIDEO') {
        const src = m.sources?.[0]?.url;
        return src
          ? { contentType: 'video' as const, url: src, poster: m.previewImage?.url }
          : null;
      }
      const imageUrl = m.image?.url;
      return imageUrl ? { contentType: 'image' as const, url: imageUrl } : null;
    })
    .filter((m: ProductMedia | null): m is ProductMedia => m !== null);

  if (compositeUrl) {
    media = [{ contentType: 'image' as const, url: compositeUrl }, ...media.filter((m) => m.url !== compositeUrl)];
  } else if (customImages && customImages.length > 0) {
    media = images.map((url) => ({ contentType: 'image' as const, url }));
  }

  const rawAmount = parseFloat(node.priceRange?.minVariantPrice?.amount || '0');
  const currencyCode = (node.priceRange?.minVariantPrice?.currencyCode || 'INR').toUpperCase();
  
  let basePriceEur = rawAmount;
  if (currencyCode === 'INR') {
    basePriceEur = rawAmount / 90.0;
  } else if (currencyCode === 'USD') {
    basePriceEur = rawAmount / 1.08;
  } else if (currencyCode === 'GBP') {
    basePriceEur = rawAmount / 0.85;
  }

  const rawCompareAmount = node.compareAtPriceRange?.minVariantPrice?.amount
    ? parseFloat(node.compareAtPriceRange.minVariantPrice.amount)
    : undefined;
  
  let baseComparePriceEur: number | undefined = undefined;
  if (rawCompareAmount && rawCompareAmount > rawAmount * 1.4) {
    if (currencyCode === 'INR') {
      baseComparePriceEur = rawCompareAmount / 90.0;
    } else if (currencyCode === 'USD') {
      baseComparePriceEur = rawCompareAmount / 1.08;
    } else if (currencyCode === 'GBP') {
      baseComparePriceEur = rawCompareAmount / 0.85;
    } else {
      baseComparePriceEur = rawCompareAmount;
    }
  } else {
    baseComparePriceEur = getCompareAtPrice(basePriceEur);
  }

  const titleLower = (node.title || '').toLowerCase();
  const typeLower = (node.productType || '').toLowerCase();
  const tagsLower = (node.tags || []).map((t: string) => t.toLowerCase()).join(' ');

  let category: Category = 'earrings';
  const isBundleSuite = /\b(duo-suite|bundle)\b/i.test(tagsLower) || /\b(duo)\b/i.test(titleLower) || (node.handle || '').includes('duo');
  if (isBundleSuite) {
    category = 'earrings';
  } else if (/\b(earrings?|studs?|dangles?|hoops?|huggie)\b/i.test(titleLower) || /\b(earrings?|studs?|dangles?|hoops?|huggie)\b/i.test(typeLower) || /\b(earrings?)\b/i.test(tagsLower)) {
    category = 'earrings';
  } else if (/\b(necklaces?|pendants?|chokers?|collars?)\b/i.test(titleLower) || /\b(necklaces?|pendants?|chokers?|collars?)\b/i.test(typeLower) || /\b(necklaces?)\b/i.test(tagsLower)) {
    category = 'necklaces';
  } else if (/\b(bracelets?|bangles?|cuffs?)\b/i.test(titleLower) || /\b(bracelets?|bangles?|cuffs?)\b/i.test(typeLower) || /\b(bracelets?)\b/i.test(tagsLower)) {
    category = 'bracelets';
  } else if (/\b(brooches?|pins?)\b/i.test(titleLower) || /\b(brooches?|pins?)\b/i.test(typeLower) || /\b(brooches?)\b/i.test(tagsLower)) {
    category = 'brooches';
  } else if (/\b(rings?|bands?)\b/i.test(titleLower) || /\b(rings?|bands?)\b/i.test(typeLower) || /\b(rings?)\b/i.test(tagsLower)) {
    category = 'rings';
  } else if (/\b(sets?|suites?)\b/i.test(titleLower) || /\b(sets?|suites?)\b/i.test(typeLower) || /\b(sets?)\b/i.test(tagsLower)) {
    category = 'sets';
  }

  // Derive Metal — from title and tags ONLY, never the description.
  const finishText = `${titleLower} ${typeLower} ${tagsLower}`;
  let metal: Metal;
  if (finishText.includes('rose gold')) {
    metal = 'Rose Gold-Tone';
  } else if (finishText.includes('silver-tone') || /\bsilver\b/.test(finishText)) {
    metal = 'Silver-Tone Brass';
  } else if (finishText.includes('gold-tone') || /\bgold\b/.test(finishText)) {
    metal = 'Gold-Tone Brass';
  } else if (finishText.includes('anti-tarnish') || finishText.includes('brass')) {
    metal = 'Anti-Tarnish Brass';
  } else {
    metal = 'Gold-Tone Brass';
  }

  let details: string[] = [];
  if (node.description && (node.description.includes('✨') || node.description.includes('•') || node.description.includes('- '))) {
    const lines = node.description
      .split(/[\n•✨\r]/)
      .map((l: string) => l.trim().replace(/^[-*]\s*/, ''))
      .filter((l: string) => l.length > 5 && !l.toLowerCase().startsWith('why you') && !l.toLowerCase().startsWith('perfect for'));
    if (lines.length > 0) {
      details = lines.slice(0, 5);
    }
  }
  if (details.length === 0) {
    details = [
      'Premium dailywear finish in high-grade brass with anti-tarnish protective coating',
      'Comfort-fit engineered ergonomic silhouette for everyday styling',
      'Lead & nickel free with surgical steel posts for sensitive skin',
      'Homegrown Indian design crafted for lasting shine',
    ];
  }

  const variants: ProductVariant[] = (node.variants?.edges || []).map((vEdge: any) => {
    const vNode = vEdge.node;
    const vAmount = parseFloat(vNode.price?.amount || rawAmount.toString());
    let vPriceEur = vAmount;
    if (currencyCode === 'INR') vPriceEur = vAmount / 90.0;
    else if (currencyCode === 'USD') vPriceEur = vAmount / 1.08;
    else if (currencyCode === 'GBP') vPriceEur = vAmount / 0.85;

    return {
      id: vNode.id,
      title: vNode.title,
      price: vPriceEur,
      availableForSale: vNode.availableForSale,
      quantityAvailable: typeof vNode.quantityAvailable === 'number' ? vNode.quantityAvailable : undefined,
      selectedOptions: vNode.selectedOptions,
      sku: vNode.sku,
    };
  });

  return {
    id: node.handle || node.id,
    shopifyId: node.id,
    handle: node.handle,
    name: node.title,
    subtitle: node.productType || '',
    category,
    metal,
    price: basePriceEur,
    originalPrice: baseComparePriceEur,
    images: images.length > 0 ? images : ['/logo.png'],
    media: media.length > 0 ? media : undefined,
    description: node.description || 'Dailywear jewellery sculpted for everyday wear.',
    details,
    materials: METAL_MATERIALS[metal] || METAL_MATERIALS['Gold-Tone Brass'],
    sizes: category === 'rings' ? ['US 6 (52mm)', 'US 7 (54mm)', 'US 8 (57mm)'] : undefined,
    inStock: node.availableForSale ?? true,
    isBestseller: tagsLower.includes('bestseller') || tagsLower.includes('featured'),
    isNew: tagsLower.includes('new'),
    isSculptural: true,
    tags: (node.tags || []).map((t: string) => t.trim()),
    variants,
  };
}
