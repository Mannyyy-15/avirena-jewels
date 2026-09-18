import dotenv from 'dotenv';

dotenv.config();

const shop = process.env.VITE_SHOPIFY_STORE_DOMAIN;
const clientId = process.env.SHOPIFY_CLIENT_ID;
const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;
const apiVersion = process.env.VITE_SHOPIFY_API_VERSION || '2025-01';

async function accessToken() {
  const response = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId!,
      client_secret: clientSecret!,
    }),
  });
  return (await response.json() as { access_token: string }).access_token;
}

async function main() {
  const token = await accessToken();
  const query = `
    query CheckBundleImages {
      products(first: 10, query: "tag:bundle") {
        nodes {
          id
          title
          handle
          status
          tags
          images(first: 5) {
            nodes {
              id
              url
            }
          }
        }
      }
    }
  `;

  const res = await fetch(`https://${shop}/admin/api/${apiVersion}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token,
    },
    body: JSON.stringify({ query }),
  });

  const json = await res.json();
  console.log(JSON.stringify(json.data?.products?.nodes, null, 2));
}

main().catch(console.error);
