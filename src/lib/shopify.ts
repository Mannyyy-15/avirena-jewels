import { Product, ProductVariant, Category, Metal, ShopifyCart } from '../types';

const SHOPIFY_STORE_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || '';
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';
const SHOPIFY_API_VERSION = import.meta.env.VITE_SHOPIFY_API_VERSION || '2025-01';

/**
 * Material description per metal finish. These must describe what the piece is
 * actually made of — brass and alloy with protective coatings, not precious metal.
 */
const METAL_MATERIALS: Record<Metal, string> = {
  'Gold-Tone Brass':
    'High-grade brass with anti-tarnish gold-tone e-coating (hypoallergenic, nickel-free)',
  'Anti-Tarnish Brass':
    'High-grade brass with protective anti-tarnish e-coating (hypoallergenic, nickel-free)',
  'Silver-Tone Alloy':
    'Durable silver-tone alloy with protective anti-tarnish coating (hypoallergenic, nickel-free)',
  'Rose Gold-Tone':
    'High-grade brass with anti-tarnish rose gold-tone e-coating (hypoallergenic, nickel-free)',
};

export const isShopifyConfigured = (): boolean => {
  return Boolean(
    SHOPIFY_STORE_DOMAIN &&
    SHOPIFY_STOREFRONT_ACCESS_TOKEN &&
    !SHOPIFY_STORE_DOMAIN.includes('your-shop-name') &&
    SHOPIFY_STORE_DOMAIN.trim().length > 0
  );
};

export async function shopifyFetch<T>({
  query,
  variables = {},
}: {
  query: string;
  variables?: Record<string, any>;
}): Promise<{ data: T; errors?: any }> {
  if (!isShopifyConfigured()) {
    throw new Error('Shopify Storefront API credentials are not configured.');
  }

  const endpoint = `https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Shopify API error [${response.status}]: ${errorText}`);
  }

  return response.json();
}

// ---------------- GraphQL Queries ----------------

export const GET_PRODUCTS_QUERY = `
  query GetProducts($first: Int = 50) {
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
          images(first: 6) {
            edges {
              node {
                url
                altText
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

export const GET_PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!) {
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

export const CART_CREATE_MUTATION = `
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    id
                    title
                    handle
                  }
                  image {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CART_LINES_ADD_MUTATION = `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    id
                    title
                    handle
                  }
                  image {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CART_LINES_UPDATE_MUTATION = `
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    id
                    title
                    handle
                  }
                  image {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const CART_LINES_REMOVE_MUTATION = `
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    id
                    title
                    handle
                  }
                  image {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const GET_CART_QUERY = `
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      id
      checkoutUrl
      totalQuantity
      cost {
        totalAmount {
          amount
          currencyCode
        }
        subtotalAmount {
          amount
          currencyCode
        }
      }
      lines(first: 50) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                price {
                  amount
                  currencyCode
                }
                product {
                  id
                  title
                  handle
                }
                image {
                  url
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
`;

// ---------------- Helpers & Transformer ----------------

export function transformShopifyProduct(node: any): Product {
  const images = (node.images?.edges || []).map((edge: any) => edge.node.url);
  const rawAmount = parseFloat(node.priceRange?.minVariantPrice?.amount || '0');
  const currencyCode = (node.priceRange?.minVariantPrice?.currencyCode || 'INR').toUpperCase();
  
  // Normalize price to base EUR so currency switcher works seamlessly
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
  if (rawCompareAmount && rawCompareAmount > rawAmount) {
    if (currencyCode === 'INR') {
      baseComparePriceEur = rawCompareAmount / 90.0;
    } else if (currencyCode === 'USD') {
      baseComparePriceEur = rawCompareAmount / 1.08;
    } else if (currencyCode === 'GBP') {
      baseComparePriceEur = rawCompareAmount / 0.85;
    } else {
      baseComparePriceEur = rawCompareAmount;
    }
  }

  // Derive Category from title, productType, tags, description
  const titleLower = (node.title || '').toLowerCase();
  const typeLower = (node.productType || '').toLowerCase();
  const tagsLower = (node.tags || []).map((t: string) => t.toLowerCase()).join(' ');
  const descLower = (node.description || '').toLowerCase();
  const fullText = `${titleLower} ${typeLower} ${tagsLower} ${descLower}`;

  let category: Category = 'earrings';
  if (/\b(earrings?|studs?|dangles?|hoops?|huggie)\b/i.test(titleLower) || /\b(earrings?|studs?|dangles?|hoops?|huggie)\b/i.test(typeLower) || /\b(earrings?)\b/i.test(tagsLower)) {
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
  } else if (/\b(earrings?|studs?|dangles?|hoops?)\b/i.test(fullText)) {
    category = 'earrings';
  } else if (/\b(necklaces?|pendants?|chokers?)\b/i.test(fullText)) {
    category = 'necklaces';
  } else if (/\b(bracelets?|bangles?|cuffs?)\b/i.test(fullText)) {
    category = 'bracelets';
  } else if (/\b(brooches?|pins?)\b/i.test(fullText)) {
    category = 'brooches';
  } else if (/\b(rings?|bands?)\b/i.test(fullText)) {
    category = 'rings';
  }

  // Derive Metal — from title and tags ONLY, never the description.
  //
  // The description is deliberately excluded: every product description ends
  // with "surgical steel posts", so matching 'steel' against the full text
  // labelled all nine products "Silver-Tone Alloy", including the gold ones.
  // The post material is not the finish of the piece.
  //
  // 'gold-tone' is tested before the bare 'silver'/'gold' checks so that a
  // title like "Solene Crystal Hoops — Gold" cannot be mis-read.
  const finishText = `${titleLower} ${typeLower} ${tagsLower}`;
  let metal: Metal;
  if (finishText.includes('rose gold')) {
    metal = 'Rose Gold-Tone';
  } else if (finishText.includes('silver-tone') || /\bsilver\b/.test(finishText)) {
    metal = 'Silver-Tone Alloy';
  } else if (finishText.includes('gold-tone') || /\bgold\b/.test(finishText)) {
    metal = 'Gold-Tone Brass';
  } else if (finishText.includes('anti-tarnish') || finishText.includes('brass')) {
    metal = 'Anti-Tarnish Brass';
  } else {
    metal = 'Gold-Tone Brass';
  }

  // Extract description bullets if present
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
      'Hypoallergenic, lead & nickel free for sensitive skin',
      'Homegrown Indian design crafted for lasting shine',
    ];
  }

  // Variants
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
    description: node.description || 'Handcrafted dailywear jewellery sculpted for everyday wear.',
    details,
    materials: METAL_MATERIALS[metal],
    sizes: category === 'rings' ? ['US 6 (52mm)', 'US 7 (54mm)', 'US 8 (57mm)'] : undefined,
    inStock: node.availableForSale ?? true,
    isBestseller: tagsLower.includes('bestseller') || tagsLower.includes('featured') || true,
    isNew: tagsLower.includes('new'),
    isSculptural: true,
    variants,
  };
}

export function transformShopifyCart(cartData: any): ShopifyCart | null {
  if (!cartData) return null;
  return {
    id: cartData.id,
    checkoutUrl: cartData.checkoutUrl,
    totalQuantity: cartData.totalQuantity || 0,
    cost: cartData.cost || {
      totalAmount: { amount: '0', currencyCode: 'EUR' },
      subtotalAmount: { amount: '0', currencyCode: 'EUR' },
    },
    lines: (cartData.lines?.edges || []).map((e: any) => ({
      id: e.node.id,
      quantity: e.node.quantity,
      merchandise: e.node.merchandise,
    })),
  };
}
