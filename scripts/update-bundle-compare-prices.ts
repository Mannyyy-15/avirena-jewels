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

const BUNDLE_UPDATES = [
  {
    productId: 'gid://shopify/Product/10537141469506',
    variantId: 'gid://shopify/ProductVariant/56203199709506',
    title: 'Crystal Hoops Duo',
    price: '1248.00',
    compareAtPrice: '4398.00', // Solene Gold (2199) + Solene Silver (2199)
  },
  {
    productId: 'gid://shopify/Product/10537182953794',
    variantId: 'gid://shopify/ProductVariant/56203344937282',
    title: 'Studs + Hearts Duo',
    price: '1498.00',
    compareAtPrice: '4998.00', // Nadir Square (2499) + Coro Heart (2499)
  },
  {
    productId: 'gid://shopify/Product/10537186361666',
    variantId: 'gid://shopify/ProductVariant/56203362238786',
    title: 'Drops + Spirals Duo',
    price: '1198.00',
    compareAtPrice: '4098.00', // Lume Drop (2199) + Volute Spiral (1899)
  },
  {
    productId: 'gid://shopify/Product/10537186427202',
    variantId: 'gid://shopify/ProductVariant/56203362763074',
    title: 'Cascade Statement Duo',
    price: '2298.00',
    compareAtPrice: '7998.00', // Forma Gold (3999) + Forma Silver (3999)
  },
];

async function main() {
  const token = await getAdminAccessToken();

  for (const item of BUNDLE_UPDATES) {
    console.log(`Updating ${item.title} to price: ₹${item.price}, compareAtPrice: ₹${item.compareAtPrice}...`);
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
              id: item.variantId,
              price: item.price,
              compareAtPrice: item.compareAtPrice,
            },
          ],
        },
      }),
    });

    const updateData = await updateRes.json();
    const errors = updateData.data?.productVariantsBulkUpdate?.userErrors;
    if (errors && errors.length > 0) {
      console.error(`Errors for ${item.title}:`, errors);
    } else {
      const updated = updateData.data?.productVariantsBulkUpdate?.productVariants?.[0];
      console.log(`✓ Updated ${item.title}:`, updated);
    }
  }

  console.log('\nAll bundle prices updated successfully in Shopify!');
}

main().catch(console.error);
