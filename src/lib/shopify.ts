import { Product, ProductVariant, Category, Metal, ShopifyCart } from '../types';

const SHOPIFY_STORE_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || '';
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';
const SHOPIFY_API_VERSION = import.meta.env.VITE_SHOPIFY_API_VERSION || '2025-01';

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
  const minPrice = parseFloat(node.priceRange?.minVariantPrice?.amount || '0');
  const comparePrice = node.compareAtPriceRange?.minVariantPrice?.amount
    ? parseFloat(node.compareAtPriceRange.minVariantPrice.amount)
    : undefined;

  // Derive Category
  const typeLower = (node.productType || '').toLowerCase();
  const tagsLower = (node.tags || []).map((t: string) => t.toLowerCase());
  let category: Category = 'rings';
  if (typeLower.includes('necklace') || tagsLower.includes('necklaces')) category = 'necklaces';
  else if (typeLower.includes('ring') || tagsLower.includes('rings')) category = 'rings';
  else if (typeLower.includes('earring') || tagsLower.includes('earrings')) category = 'earrings';
  else if (typeLower.includes('bracelet') || tagsLower.includes('bracelets')) category = 'bracelets';
  else if (typeLower.includes('brooch') || tagsLower.includes('brooches')) category = 'brooches';
  else if (typeLower.includes('set') || tagsLower.includes('sets')) category = 'sets';

  // Derive Metal
  let metal: Metal = '18k Gold Vermeil';
  if (tagsLower.includes('silver') || tagsLower.includes('sterling silver')) {
    metal = '925 Sterling Silver';
  } else if (tagsLower.includes('rose gold')) {
    metal = 'Rose Gold';
  } else if (tagsLower.includes('solid gold')) {
    metal = 'Solid Gold';
  }

  // Variants
  const variants: ProductVariant[] = (node.variants?.edges || []).map((vEdge: any) => {
    const vNode = vEdge.node;
    return {
      id: vNode.id,
      title: vNode.title,
      price: parseFloat(vNode.price?.amount || minPrice.toString()),
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
    subtitle: '',
    category,
    metal,
    price: minPrice,
    originalPrice: comparePrice && comparePrice > minPrice ? comparePrice : undefined,
    rating: 4.9,
    reviewsCount: 24,
    images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=90'],
    description: node.description || 'Handcrafted fine jewellery sculpted for daily wear.',
    details: [
      'Demi-fine craftsmanship in thick 18k gold vermeil & recycled silver',
      'Comfort-fit engineered ergonomic silhouette',
      'Anti-tarnish protective micro-coating',
      'Crafted by master goldsmiths',
    ],
    materials: metal === '18k Gold Vermeil' ? '3.0 Micron 18k Gold Vermeil over 925 Sterling Silver' : 'Solid 925 Sterling Silver',
    sizes: ['Small (48-50)', 'Medium (52-54)', 'Large (56-58)'],
    inStock: node.availableForSale ?? true,
    isBestseller: tagsLower.includes('bestseller') || tagsLower.includes('featured'),
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
