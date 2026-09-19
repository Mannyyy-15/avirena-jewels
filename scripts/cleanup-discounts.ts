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

const DISCOUNTS_TO_DELETE = [
  'gid://shopify/DiscountAutomaticNode/1553101881666', // Crystal Hoops Duo auto discount
  'gid://shopify/DiscountAutomaticNode/1553101914434', // Studs + Hearts Duo auto discount
  'gid://shopify/DiscountAutomaticNode/1553101947202', // Drops + Spirals Duo auto discount
  'gid://shopify/DiscountAutomaticNode/1553103257922', // Cascade Duo auto discount
  'gid://shopify/DiscountCodeNode/1553236951362',      // ONLINE50
];

async function deleteDiscount(token: string, id: string) {
  const isAutomatic = id.includes('DiscountAutomaticNode');
  const mutation = isAutomatic
    ? `mutation discountAutomaticDelete($id: ID!) {
        discountAutomaticDelete(id: $id) {
          deletedAutomaticDiscountId
          userErrors { field message }
        }
      }`
    : `mutation discountCodeDelete($id: ID!) {
        discountCodeDelete(id: $id) {
          deletedCodeDiscountId
          userErrors { field message }
        }
      }`;

  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ query: mutation, variables: { id } }),
  });
  const data = await res.json();
  console.log(`Deleted ${id}:`, JSON.stringify(data));
}

async function main() {
  const token = await getAdminAccessToken();
  for (const id of DISCOUNTS_TO_DELETE) {
    await deleteDiscount(token, id);
  }
  console.log('✅ Cleaned up old discounts. Only PREPAID50 remains active!');
}

main().catch(console.error);
