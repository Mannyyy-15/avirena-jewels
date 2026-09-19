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

async function createBundle(
  token: string,
  title: string,
  handle: string,
  p1Handle: string,
  p2Handle: string,
  bundlePrice: string,
  compareAtPrice: string
) {
  // 1. Fetch component products
  const fetchRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({
      query: `{
        p1: productByHandle(handle: "${p1Handle}") {
          id
          title
          options {
            id
            name
            values
          }
        }
        p2: productByHandle(handle: "${p2Handle}") {
          id
          title
          options {
            id
            name
            values
          }
        }
      }`
    })
  });
  const { data } = await fetchRes.json();
  const p1 = data.p1;
  const p2 = data.p2;

  console.log(`P1 (${p1Handle}):`, p1);
  console.log(`P2 (${p2Handle}):`, p2);

  const bundleCreateRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({
      query: `
        mutation productBundleCreate($input: ProductBundleCreateInput!) {
          productBundleCreate(input: $input) {
            productBundleOperation {
              id
              status
              product {
                id
                title
                handle
                variants(first: 1) {
                  edges {
                    node {
                      id
                      price
                    }
                  }
                }
              }
              userErrors {
                field
                message
              }
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
          title,
          components: [
            {
              productId: p1.id,
              quantity: 1,
              optionSelections: [
                {
                  componentOptionId: p1.options[0].id,
                  name: p1.options[0].name,
                  values: [p1.options[0].values[0]],
                }
              ]
            },
            {
              productId: p2.id,
              quantity: 1,
              optionSelections: [
                {
                  componentOptionId: p2.options[0].id,
                  name: p2.options[0].name,
                  values: [p2.options[0].values[0]],
                }
              ]
            }
          ]
        }
      }
    })
  });

  const createData = await bundleCreateRes.json();
  console.log('Bundle creation result:', JSON.stringify(createData, null, 2));

  const createdProduct = createData.data?.productBundleCreate?.productBundleOperation?.product;
  if (createdProduct) {
    // Update handle, tags, price, compareAtPrice
    const variantId = createdProduct.variants.edges[0]?.node?.id;
    console.log(`Updating handle to ${handle}, price to ${bundlePrice}, compareAtPrice to ${compareAtPrice}...`);
    
    await fetch(`https://${SHOP_DOMAIN}/admin/api/${API_VERSION}/graphql.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
      body: JSON.stringify({
        query: `
          mutation productUpdate($input: ProductInput!) {
            productUpdate(input: $input) {
              product {
                id
                handle
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
            id: createdProduct.id,
            handle,
            tags: ['bundle', 'duo-suite', 'earrings'],
            status: 'ACTIVE',
          }
        }
      })
    });

    if (variantId) {
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
              }
            }
          `,
          variables: {
            productId: createdProduct.id,
            variants: [
              {
                id: variantId,
                price: bundlePrice,
                compareAtPrice: compareAtPrice,
              }
            ]
          }
        })
      });
    }
  }
}

async function main() {
  const token = await getAdminAccessToken();

  console.log('--- Creating Drops + Spirals Duo ---');
  await createBundle(
    token,
    'Drops + Spirals Duo',
    'drops-spirals-duo',
    'avirena-drop-earrings-gold-tone-brass',
    'avirena-spiral-earrings-silver-tone',
    '1198.00',
    '4098.00'
  );

  console.log('--- Creating Cascade Gold + Silver Duo ---');
  await createBundle(
    token,
    'Cascade Statement Duo',
    'cascade-statement-duo',
    'avirena-cascade-statement-drops-gold-tone',
    'avirena-cascade-statement-drops-silver',
    '2298.00',
    '7998.00'
  );
}

main().catch(console.error);
