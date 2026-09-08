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

const PRODUCTS_TO_UPDATE = [
  {
    id: "gid://shopify/Product/10521318752578",
    title: "Avirena Duo Curve Hoops",
    handle: "avirena-duo-curve-hoops-gold-tone-brass",
    category: "gid://shopify/TaxonomyCategory/aa-6-6", // Earrings
    productType: "Earrings",
    vendor: "Avirena Jewels",
    tags: [
      "anti-tarnish",
      "brass",
      "dailywear",
      "earrings",
      "gifting",
      "gold-tone",
      "hoops",
      "huggie",
      "minimalist",
      "nickel-free",
      "office-wear",
      "statement",
      "under-999",
      "bestseller",
      "featured",
      "new"
    ]
  },
  {
    id: "gid://shopify/Product/10521318785346",
    title: "Avirena Tiered Pebble Drops",
    handle: "avirena-tiered-pebble-drops-gold-tone-earrings",
    category: "gid://shopify/TaxonomyCategory/aa-6-6", // Earrings
    productType: "Earrings",
    vendor: "Avirena Jewels",
    tags: [
      "anti-tarnish",
      "brass",
      "dailywear",
      "dangle",
      "drop-earrings",
      "earrings",
      "ethnic-wear",
      "festive",
      "gifting",
      "gold-tone",
      "nickel-free",
      "occasion-wear",
      "organic",
      "sculptural",
      "statement",
      "under-999",
      "bestseller",
      "featured",
      "new"
    ]
  },
  {
    id: "gid://shopify/Product/10521318818114",
    title: "Avirena Granulated Dome Studs",
    handle: "avirena-granulated-dome-studs-gold-tone",
    category: "gid://shopify/TaxonomyCategory/aa-6-6", // Earrings
    productType: "Earrings",
    vendor: "Avirena Jewels",
    tags: [
      "anti-tarnish",
      "brass",
      "dailywear",
      "earrings",
      "ethnic-wear",
      "gifting",
      "gold-tone",
      "nickel-free",
      "office-wear",
      "sculptural",
      "statement",
      "studs",
      "textured",
      "under-999",
      "bestseller",
      "featured",
      "new"
    ]
  },
  {
    id: "gid://shopify/Product/10521318850882",
    title: "Avirena Brushed Orb Drops",
    handle: "avirena-brushed-orb-drops-gold-tone-earrings",
    category: "gid://shopify/TaxonomyCategory/aa-6-6", // Earrings
    productType: "Earrings",
    vendor: "Avirena Jewels",
    tags: [
      "anti-tarnish",
      "ball-earrings",
      "brass",
      "dailywear",
      "dangle",
      "drop-earrings",
      "earrings",
      "gifting",
      "gold-tone",
      "minimalist",
      "nickel-free",
      "occasion-wear",
      "office-wear",
      "sculptural",
      "statement",
      "under-999",
      "bestseller",
      "featured",
      "new"
    ]
  },
  {
    id: "gid://shopify/Product/10521318916418",
    title: "Avirena Cascade Statement Drops",
    handle: "avirena-cascade-statement-drops-gold-tone",
    category: "gid://shopify/TaxonomyCategory/aa-6-6", // Earrings
    productType: "Earrings",
    vendor: "Avirena Jewels",
    tags: [
      "anti-tarnish",
      "brass",
      "dangle",
      "drop-earrings",
      "earrings",
      "ethnic-wear",
      "festive",
      "gifting",
      "gold-tone",
      "nickel-free",
      "occasion-wear",
      "organic",
      "sculptural",
      "statement",
      "bestseller",
      "featured",
      "new"
    ]
  }
];

async function main() {
  const token = await getAdminAccessToken();

  for (const item of PRODUCTS_TO_UPDATE) {
    console.log(`Updating ${item.title}...`);
    const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/${API_VERSION}/graphql.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
      body: JSON.stringify({
        query: `
          mutation updateProductTaxonomy($input: ProductInput!) {
            productUpdate(input: $input) {
              product {
                id
                title
                productType
                vendor
                category {
                  id
                  name
                  fullName
                }
                tags
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
            category: item.category,
            productType: item.productType,
            vendor: item.vendor,
            tags: item.tags,
          }
        }
      })
    });

    const data = await res.json();
    if (data.data?.productUpdate?.userErrors?.length > 0) {
      console.error(`Errors for ${item.title}:`, data.data.productUpdate.userErrors);
    } else {
      const updated = data.data?.productUpdate?.product;
      console.log(`Success: ${updated.title}`);
      console.log(`  Category: ${updated.category?.name} (${updated.category?.fullName})`);
      console.log(`  ProductType: ${updated.productType}`);
      console.log(`  Vendor: ${updated.vendor}`);
      console.log(`  Tags count: ${updated.tags?.length}`);
    }
  }
}

main().catch(console.error);
