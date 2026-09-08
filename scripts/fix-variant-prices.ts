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

const ITEMS = [
  { productId: "gid://shopify/Product/10521318752578", price: "699.00", compareAtPrice: "2199.00" },
  { productId: "gid://shopify/Product/10521318785346", price: "799.00", compareAtPrice: "2499.00" },
  { productId: "gid://shopify/Product/10521318818114", price: "699.00", compareAtPrice: "2199.00" },
  { productId: "gid://shopify/Product/10521318850882", price: "799.00", compareAtPrice: "2499.00" },
  { productId: "gid://shopify/Product/10521318916418", price: "1199.00", compareAtPrice: "3999.00" },
];

async function main() {
  const token = await getAdminAccessToken();

  for (const item of ITEMS) {
    // 1. Fetch variant ID
    const getRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/${API_VERSION}/graphql.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
      body: JSON.stringify({
        query: `query($id: ID!) { product(id: $id) { title variants(first: 5) { edges { node { id } } } } }`,
        variables: { id: item.productId }
      })
    });
    const getData = await getRes.json();
    const variantId = getData.data?.product?.variants?.edges?.[0]?.node?.id;
    const title = getData.data?.product?.title;

    console.log(`Updating price for "${title}" (Variant ${variantId}) to ₹${item.price}...`);

    const updateRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/${API_VERSION}/graphql.json`, {
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
              id: variantId,
              price: item.price,
              compareAtPrice: item.compareAtPrice,
            }
          ]
        }
      })
    });

    const updateData = await updateRes.json();
    console.log('Result:', JSON.stringify(updateData.data?.productVariantsBulkUpdate));
  }
}

main().catch(console.error);
