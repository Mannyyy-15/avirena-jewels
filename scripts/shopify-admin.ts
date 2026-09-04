/**
 * Shopify Admin & Storefront API Management CLI
 * Uses Client Credentials Grant (Client ID + Client Secret) to authenticate
 * with the Shopify Admin GraphQL API and manage Storefront API access tokens.
 *
 * Usage:
 *   npx tsx scripts/shopify-admin.ts [command]
 *
 * Commands:
 *   status     - Check store information, primary domain, and catalog inventory
 *   products   - List all products (including draft and active) with prices and stock
 *   token      - Generate or display the active Storefront Access Token
 */

import dotenv from 'dotenv';
dotenv.config();

const SHOP_DOMAIN = process.env.VITE_SHOPIFY_STORE_DOMAIN || 'm5yhxq-gb.myshopify.com';
const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET;
const API_VERSION = process.env.VITE_SHOPIFY_API_VERSION || '2025-01';

async function getAdminAccessToken(): Promise<string> {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('Missing SHOPIFY_CLIENT_ID or SHOPIFY_CLIENT_SECRET in .env');
  }

  const res = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to obtain Admin Access Token (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return data.access_token;
}

async function adminGraphQL(query: string, variables: any = {}) {
  const token = await getAdminAccessToken();
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token,
    },
    body: jsonStringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`Admin GraphQL HTTP error (${res.status}): ${await res.text()}`);
  }

  const data = await res.json();
  if (data.errors) {
    throw new Error(`Admin GraphQL Error: ${JSON.stringify(data.errors, null, 2)}`);
  }
  return data.data;
}

function jsonStringify(obj: any) {
  return JSON.stringify(obj);
}

async function checkStatus() {
  console.log(`\n🔍 Checking connection to Shopify Store: ${SHOP_DOMAIN}...`);
  const data = await adminGraphQL(`
    query StoreStatus {
      shop {
        name
        email
        myshopifyDomain
        currencyCode
        primaryDomain {
          url
          host
        }
      }
      products(first: 20) {
        edges {
          node {
            id
            title
            status
            totalInventory
            handle
            priceRangeV2 {
              minVariantPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `);

  console.log(`\n✅ Connected successfully to "${data.shop.name}"!`);
  console.log(`   Email:          ${data.shop.email}`);
  console.log(`   Shopify Domain: ${data.shop.myshopifyDomain}`);
  console.log(`   Primary Domain: ${data.shop.primaryDomain?.url || 'N/A'}`);
  console.log(`   Currency:       ${data.shop.currencyCode}`);

  const products = data.products.edges;
  console.log(`\n📦 Total Products Found: ${products.length}`);
  products.forEach(({ node }: any, i: number) => {
    const price = node.priceRangeV2?.minVariantPrice?.amount;
    const curr = node.priceRangeV2?.minVariantPrice?.currencyCode;
    console.log(
      `   ${i + 1}. [${node.status}] ${node.title} — ${curr} ${price} (Inventory: ${node.totalInventory})`
    );
  });
}

async function ensureStorefrontToken() {
  const token = await getAdminAccessToken();
  const listRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/${API_VERSION}/storefront_access_tokens.json`, {
    headers: { 'X-Shopify-Access-Token': token },
  });
  const listData = await listRes.json();
  const existing = listData.storefront_access_tokens || [];

  if (existing.length > 0) {
    console.log(`\n🔑 Existing Storefront Access Token(s) found:`);
    existing.forEach((t: any) => {
      console.log(`   • Title: "${t.title}" | Token: ${t.access_token}`);
    });
    return existing[0].access_token;
  }

  console.log(`\n⚙️ Generating new Storefront Access Token...`);
  const createRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/${API_VERSION}/storefront_access_tokens.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token,
    },
    body: JSON.stringify({
      storefront_access_token: { title: 'Avirena Headless Storefront' },
    }),
  });

  const createData = await createRes.json();
  const created = createData.storefront_access_token;
  console.log(`✅ Storefront Access Token Created: ${created.access_token}`);
  return created.access_token;
}

async function main() {
  const cmd = process.argv[2] || 'status';
  try {
    if (cmd === 'status' || cmd === 'products') {
      await checkStatus();
    } else if (cmd === 'token') {
      await ensureStorefrontToken();
    } else {
      console.log(`Unknown command: ${cmd}`);
      console.log(`Available commands: status, token`);
    }
  } catch (err: any) {
    console.error(`\n❌ Error:`, err.message);
    process.exit(1);
  }
}

main();
