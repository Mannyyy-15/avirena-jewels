import dotenv from 'dotenv';
import fs from 'fs';
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

async function main() {
  const token = await getAdminAccessToken();
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token,
    },
    body: JSON.stringify({
      query: `
        query {
          products(first: 20) {
            edges {
              node {
                id
                title
                handle
                status
                seo {
                  title
                  description
                }
                description
              }
            }
          }
        }
      `,
    }),
  });

  const data = await res.json();
  fs.writeFileSync('shopify-seo-dump.json', JSON.stringify(data.data.products.edges.map((e: any) => e.node), null, 2));
  console.log('Saved shopify-seo-dump.json successfully');
}

main().catch(console.error);
