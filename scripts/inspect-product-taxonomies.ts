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

async function main() {
  const token = await getAdminAccessToken();
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({
      query: `
        query {
          products(first: 20) {
            edges {
              node {
                id
                title
                handle
                productType
                tags
                vendor
                category {
                  name
                }
                collections(first: 5) {
                  edges {
                    node {
                      id
                      title
                      handle
                    }
                  }
                }
              }
            }
          }
        }
      `
    })
  });

  const data = await res.json();
  data.data?.products?.edges?.forEach((e: any) => {
    const p = e.node;
    console.log(`\n"${p.title}" (${p.handle})`);
    console.log(`  productType: "${p.productType}"`);
    console.log(`  category: "${p.category?.name || 'none'}"`);
    console.log(`  vendor: "${p.vendor}"`);
    console.log(`  tags: ${JSON.stringify(p.tags)}`);
    console.log(`  collections: ${p.collections.edges.map((c: any) => c.node.title).join(', ') || 'none'}`);
  });
}

main().catch(console.error);
