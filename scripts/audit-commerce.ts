import dotenv from 'dotenv';

dotenv.config();

const shop = process.env.VITE_SHOPIFY_STORE_DOMAIN;
const clientId = process.env.SHOPIFY_CLIENT_ID;
const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;
const apiVersion = process.env.VITE_SHOPIFY_API_VERSION || '2025-01';

if (!shop || !clientId || !clientSecret) {
  throw new Error('Shopify Admin credentials are not configured.');
}

async function accessToken() {
  const response = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });
  if (!response.ok) throw new Error(`Admin authentication failed (${response.status}).`);
  return (await response.json() as { access_token: string }).access_token;
}

async function main() {
  const token = await accessToken();
  const query = `
    query CommerceAudit {
      discountNodes(first: 50) {
        nodes {
          id
          discount {
            ... on DiscountAutomaticBasic {
              __typename title status startsAt endsAt combinesWith { orderDiscounts productDiscounts shippingDiscounts }
              customerGets { value { ... on DiscountAmount { amount { amount currencyCode } appliesOnEachItem } } items { ... on DiscountProducts { products(first: 20) { nodes { id title handle } } } } }
            }
            ... on DiscountCodeBasic {
              __typename title status startsAt endsAt codes(first: 10) { nodes { code } }
              combinesWith { orderDiscounts productDiscounts shippingDiscounts }
              customerGets { value { ... on DiscountAmount { amount { amount currencyCode } appliesOnEachItem } } items { ... on AllDiscountItems { allItems } ... on DiscountProducts { products(first: 20) { nodes { id title handle } } } } }
            }
          }
        }
      }
      products(first: 50, query: "status:active") {
        nodes {
          id title handle status totalInventory
          variants(first: 20) { nodes { id title price compareAtPrice inventoryQuantity inventoryPolicy availableForSale } }
        }
      }
    }
  `;
  const response = await fetch(`https://${shop}/admin/api/${apiVersion}/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ query }),
  });
  const payload = await response.json() as { data?: unknown; errors?: unknown };
  if (!response.ok || payload.errors) throw new Error(JSON.stringify(payload.errors || payload));
  console.log(JSON.stringify(payload.data, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
