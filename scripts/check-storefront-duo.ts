import dotenv from 'dotenv';
dotenv.config({ path: 'hydrogen/.env' });

const SHOP_DOMAIN = process.env.PUBLIC_STORE_DOMAIN || 'm5yhxq-gb.myshopify.com';
const STOREFRONT_ACCESS_TOKEN = process.env.PUBLIC_STOREFRONT_API_TOKEN;
const API_VERSION = process.env.PUBLIC_STOREFRONT_API_VERSION || '2025-01';

async function main() {
  const res = await fetch(`https://${SHOP_DOMAIN}/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN!,
    },
    body: JSON.stringify({
      query: `{
        product(handle: "studs-hearts-duo") {
          id
          title
          handle
          availableForSale
          variants(first: 5) {
            edges {
              node {
                id
                title
                availableForSale
                price { amount currencyCode }
                selectedOptions { name value }
              }
            }
          }
        }
      }`
    })
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

main().catch(console.error);
