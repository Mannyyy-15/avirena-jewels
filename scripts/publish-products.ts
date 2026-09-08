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

  // 1. Get Publications (Sales channels)
  const pubRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({
      query: `
        query {
          publications(first: 10) {
            edges {
              node {
                id
                name
              }
            }
          }
        }
      `
    })
  });
  const pubData = await pubRes.json();
  console.log('Publications:', JSON.stringify(pubData.data?.publications?.edges, null, 2));

  const publications = pubData.data?.publications?.edges?.map((e: any) => e.node) || [];

  // 2. Publish the 5 new products to all publications
  const newProductIds = [
    "gid://shopify/Product/10521318752578", // Duo Curve Hoops
    "gid://shopify/Product/10521318785346", // Tiered Pebble Drops
    "gid://shopify/Product/10521318818114", // Granulated Dome Studs
    "gid://shopify/Product/10521318850882", // Brushed Orb Drops
    "gid://shopify/Product/10521318916418", // Cascade Statement Drops
  ];

  for (const prodId of newProductIds) {
    for (const pub of publications) {
      console.log(`Publishing ${prodId} to "${pub.name}" (${pub.id})...`);
      const publishRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/${API_VERSION}/graphql.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
        body: JSON.stringify({
          query: `
            mutation publishablePublish($id: ID!, $input: [PublicationInput!]!) {
              publishablePublish(id: $id, input: $input) {
                userErrors {
                  field
                  message
                }
              }
            }
          `,
          variables: {
            id: prodId,
            input: [{ publicationId: pub.id }]
          }
        })
      });
      const pData = await publishRes.json();
      console.log('Result:', JSON.stringify(pData.data?.publishablePublish?.userErrors));
    }
  }
}

main().catch(console.error);
