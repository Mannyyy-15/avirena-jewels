/**
 * Renames Shopify products to official branded names (e.g. "Avirena Square Studs")
 * to eliminate third-party copyright risks.
 */

import dotenv from 'dotenv';
dotenv.config();

const SHOP_DOMAIN = process.env.VITE_SHOPIFY_STORE_DOMAIN || 'm5yhxq-gb.myshopify.com';
const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET;
const API_VERSION = process.env.VITE_SHOPIFY_API_VERSION || '2025-01';

interface RenameMap {
  id: string;
  newTitle: string;
  newHandle: string;
}

const PRODUCTS_TO_RENAME: RenameMap[] = [
  {
    id: 'gid://shopify/Product/10511623815490',
    newTitle: 'Avirena Square Studs',
    newHandle: 'avirena-square-studs-gold-tone-brass-earrings',
  },
  {
    id: 'gid://shopify/Product/10511624438082',
    newTitle: 'Avirena Drop Earrings',
    newHandle: 'avirena-drop-earrings-gold-tone-brass',
  },
  {
    id: 'gid://shopify/Product/10511624896834',
    newTitle: 'Avirena Statement Drops',
    newHandle: 'avirena-statement-drops-geometric-brass-earrings',
  },
  {
    id: 'gid://shopify/Product/10513953587522',
    newTitle: 'Avirena Heart Drops',
    newHandle: 'avirena-heart-drops-silver-tone-earrings',
  },
  {
    id: 'gid://shopify/Product/10513953751362',
    newTitle: 'Avirena Spiral Earrings',
    newHandle: 'avirena-spiral-earrings-silver-tone',
  },
  {
    id: 'gid://shopify/Product/10513953784130',
    newTitle: 'Avirena Crystal Hoops — Gold',
    newHandle: 'avirena-crystal-hoops-gold-tone-earrings',
  },
  {
    id: 'gid://shopify/Product/10513953849666',
    newTitle: 'Avirena Crystal Hoops — Silver',
    newHandle: 'avirena-crystal-hoops-silver-tone-earrings',
  },
  {
    id: 'gid://shopify/Product/10513953915202',
    newTitle: 'Avirena Pebble Studs',
    newHandle: 'avirena-pebble-studs-gold-tone-earrings',
  },
  {
    id: 'gid://shopify/Product/10513954013506',
    newTitle: 'Avirena Leaf Studs',
    newHandle: 'avirena-leaf-studs-gold-tone-earrings',
  },
];

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
  if (!res.ok) {
    throw new Error(`Failed to get access token: ${await res.text()}`);
  }
  const data = await res.json();
  return data.access_token;
}

async function main() {
  const token = await getAdminAccessToken();
  console.log('✅ Connected to Shopify Admin API');

  for (const item of PRODUCTS_TO_RENAME) {
    console.log(`\n🔄 Renaming product ${item.id} -> "${item.newTitle}" (${item.newHandle})...`);
    const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/${API_VERSION}/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token,
      },
      body: JSON.stringify({
        query: `
          mutation productUpdate($input: ProductInput!) {
            productUpdate(input: $input) {
              product {
                id
                title
                handle
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
            id: item.id,
            title: item.newTitle,
            handle: item.newHandle,
          },
        },
      }),
    });

    const data = await res.json();
    const result = data.data?.productUpdate;
    if (result?.userErrors && result.userErrors.length > 0) {
      console.error(`  ❌ User errors:`, result.userErrors);
    } else if (result?.product) {
      console.log(`  ✓ Successfully updated: "${result.product.title}" | Handle: "${result.product.handle}"`);
    } else {
      console.error(`  ❌ Unexpected response:`, JSON.stringify(data));
    }
  }

  console.log('\n🎉 All products in Shopify successfully renamed to Avirena branded names!');
}

main().catch(console.error);
