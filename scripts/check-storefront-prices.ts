import dotenv from 'dotenv';
dotenv.config();

const SHOP_DOMAIN = process.env.VITE_SHOPIFY_STORE_DOMAIN || 'm5yhxq-gb.myshopify.com';
const TOKEN = process.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const API_VERSION = process.env.VITE_SHOPIFY_API_VERSION || '2025-01';

async function main() {
  const res = await fetch(`https://${SHOP_DOMAIN}/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': TOKEN!,
    },
    body: JSON.stringify({
      query: `
        query {
          products(first: 20) {
            edges {
              node {
                title
                handle
                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                }
                variants(first: 5) {
                  edges {
                    node {
                      id
                      title
                      price {
                        amount
                      }
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
  data.data.products.edges.forEach((e: any) => {
    console.log(e.node.title, '| priceRange:', e.node.priceRange.minVariantPrice.amount, '| variantPrice:', e.node.variants.edges[0]?.node?.price?.amount);
  });
}

main().catch(console.error);
