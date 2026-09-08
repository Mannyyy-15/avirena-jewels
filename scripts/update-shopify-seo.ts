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

const UPDATES = [
  {
    id: "gid://shopify/Product/10511623815490",
    seo: {
      title: "Avirena Square Studs | Anti-Tarnish Gold-Tone Brass | AVIRENA",
      description: "Geometric square studs in anti-tarnish gold-tone brass. Nickel-free with surgical steel posts. Free delivery across India & 7-day returns."
    },
    replaceInDesc: [
      { from: "14-day exchanges on unworn pieces in original packaging.", to: "Free delivery across India. 7-day easy returns on unworn pieces in original packaging." }
    ]
  },
  {
    id: "gid://shopify/Product/10511624438082",
    seo: {
      title: "Avirena Drop Earrings | Elongated Gold-Tone Brass | AVIRENA",
      description: "Elongated drop earrings in anti-tarnish gold-tone brass. Clear accent, surgical steel posts. Free delivery across India & 7-day returns."
    },
    replaceInDesc: [
      { from: "14-day exchanges on unworn pieces in original packaging.", to: "Free delivery across India. 7-day easy returns on unworn pieces in original packaging." }
    ]
  },
  {
    id: "gid://shopify/Product/10511624896834",
    seo: {
      title: "Avirena Statement Drops | Sculptural Brass Earrings | AVIRENA",
      description: "Layered geometric drops in anti-tarnish gold-tone brass. Festive statement with surgical steel posts. Free delivery across India & 7-day returns."
    },
    replaceInDesc: [
      { from: "14-day exchanges on unworn pieces in original packaging.", to: "Free delivery across India. 7-day easy returns on unworn pieces in original packaging." }
    ]
  },
  {
    id: "gid://shopify/Product/10513953587522",
    seo: {
      title: "Avirena Heart Drops | Silver-Tone Puffed Heart Earrings | AVIRENA",
      description: "Puffed double heart drops in anti-tarnish silver tone. Lightweight, nickel-free, surgical steel posts. Free delivery across India & 7-day returns."
    },
    replaceInDesc: [
      { from: "14-day exchanges on unworn pieces in original packaging.", to: "Free delivery across India. 7-day easy returns on unworn pieces in original packaging." }
    ]
  },
  {
    id: "gid://shopify/Product/10513953751362",
    seo: {
      title: "Avirena Spiral Earrings | Silver-Tone Curved Studs | AVIRENA",
      description: "Sculptural spiral earrings in anti-tarnish silver tone. Sits close to the lobe, nickel-free. Free delivery across India & 7-day returns."
    },
    replaceInDesc: [
      { from: "14-day exchanges on unworn pieces in original packaging.", to: "Free delivery across India. 7-day easy returns on unworn pieces in original packaging." }
    ]
  },
  {
    id: "gid://shopify/Product/10513953784130",
    seo: {
      title: "Avirena Crystal Hoops Gold | Domed Oval Crystal Earrings | AVIRENA",
      description: "Chunky gold-tone hoops with oval crystal stone. Anti-tarnish brass, surgical steel posts. Free delivery across India & 7-day returns."
    },
    replaceInDesc: [
      { from: "14-day exchanges on unworn pieces in original packaging.", to: "Free delivery across India. 7-day easy returns on unworn pieces in original packaging." }
    ]
  },
  {
    id: "gid://shopify/Product/10513953849666",
    seo: {
      title: "Avirena Crystal Hoops Silver | Domed Oval Crystal Hoops | AVIRENA",
      description: "Chunky silver-tone hoops with oval crystal stone. Anti-tarnish finish, surgical steel posts. Free delivery across India & 7-day returns."
    },
    replaceInDesc: [
      { from: "14-day exchanges on unworn pieces in original packaging.", to: "Free delivery across India. 7-day easy returns on unworn pieces in original packaging." }
    ]
  },
  {
    id: "gid://shopify/Product/10513953915202",
    seo: {
      title: "Avirena Pebble Studs | Organic Gold-Tone Dome Studs | AVIRENA",
      description: "Organic pebble-faceted dome studs in anti-tarnish gold-tone brass. Nickel-free surgical steel posts. Free delivery across India & 7-day returns."
    },
    replaceInDesc: [
      { from: "14-day exchanges on unworn pieces in original packaging.", to: "Free delivery across India. 7-day easy returns on unworn pieces in original packaging." }
    ]
  },
  {
    id: "gid://shopify/Product/10513954013506",
    seo: {
      title: "Avirena Leaf Studs | Folded Leaf Gold-Tone Earrings | AVIRENA",
      description: "Sculptural folded leaf studs in anti-tarnish gold-tone brass. Nickel-free with surgical steel posts. Free delivery across India & 7-day returns."
    },
    replaceInDesc: [
      { from: "14-day exchanges on unworn pieces in original packaging.", to: "Free delivery across India. 7-day easy returns on unworn pieces in original packaging." }
    ]
  }
];

async function main() {
  const token = await getAdminAccessToken();

  for (const item of UPDATES) {
    // 1. Fetch current description
    const getRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/${API_VERSION}/graphql.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
      body: JSON.stringify({
        query: `query($id: ID!) { product(id: $id) { title descriptionHtml } }`,
        variables: { id: item.id }
      })
    });
    const getData = await getRes.json();
    let descHtml = getData.data?.product?.descriptionHtml || '';

    for (const r of item.replaceInDesc) {
      descHtml = descHtml.replace(r.from, r.to);
    }

    // 2. Run productUpdate mutation
    const updateRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/${API_VERSION}/graphql.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
      body: JSON.stringify({
        query: `
          mutation productUpdate($input: ProductInput!) {
            productUpdate(input: $input) {
              product {
                id
                title
                seo {
                  title
                  description
                }
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
            seo: item.seo,
            descriptionHtml: descHtml,
          }
        }
      })
    });

    const updateData = await updateRes.json();
    const errors = updateData.data?.productUpdate?.userErrors;
    if (errors && errors.length > 0) {
      console.error(`Error updating ${item.id}:`, errors);
    } else {
      console.log(`Updated ${updateData.data?.productUpdate?.product?.title} (SEO title: ${updateData.data?.productUpdate?.product?.seo?.title})`);
    }
  }
}

main().catch(console.error);
