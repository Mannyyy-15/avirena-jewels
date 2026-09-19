import dotenv from 'dotenv';
dotenv.config();

const SHOP_DOMAIN = process.env.VITE_SHOPIFY_STORE_DOMAIN || 'm5yhxq-gb.myshopify.com';
const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET;
const API_VERSION = process.env.VITE_SHOPIFY_API_VERSION || '2025-01';

async function getAdminAccessToken(): Promise<string> {
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: CLIENT_ID!,
      client_secret: CLIENT_SECRET!,
    }),
  });
  const data = await res.json();
  return data.access_token;
}

const UPDATES = [
  {
    productId: 'gid://shopify/Product/10539322245442',
    variantId: 'gid://shopify/ProductVariant/56209270145346',
    title: 'Drops + Spirals Duo',
    price: '1198.00',
    compareAtPrice: '4098.00',
  },
  {
    productId: 'gid://shopify/Product/10539322310978',
    variantId: 'gid://shopify/ProductVariant/56209270210882',
    title: 'Cascade Statement Duo',
    price: '2298.00',
    compareAtPrice: '7998.00',
  },
];

async function main() {
  const token = await getAdminAccessToken();

  for (const item of UPDATES) {
    console.log(`Publishing ${item.title}...`);
    // 1. Update product status & tags
    await fetch(`https://${SHOP_DOMAIN}/admin/api/${API_VERSION}/graphql.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
      body: JSON.stringify({
        query: `
          mutation productUpdate($input: ProductInput!) {
            productUpdate(input: $input) {
              product {
                id
                title
                status
                tags
              }
              userErrors {
                field
                message
              }
            }
          }
        `,
        variables: {
          input: {
            id: item.productId,
            status: 'ACTIVE',
            tags: ['bundle', 'duo-suite', 'earrings'],
          },
        },
      }),
    });

    // 2. Update price and compareAtPrice
    await fetch(`https://${SHOP_DOMAIN}/admin/api/${API_VERSION}/graphql.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
      body: JSON.stringify({
        query: `
          mutation productVariantsBulkUpdate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
            productVariantsBulkUpdate(productId: $productId, variants: $variants) {
              productVariants {
                id
                price
                compareAtPrice
              }
              userErrors {
                field
                message
              }
            }
          }
        `,
        variables: {
          productId: item.productId,
          variants: [
            {
              id: item.variantId,
              price: item.price,
              compareAtPrice: item.compareAtPrice,
            },
          ],
        },
      }),
    });
  }

  console.log('All bundles published and prices updated!');
}

main().catch(console.error);
