import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import dotenv from 'dotenv';

dotenv.config();

const shop = process.env.VITE_SHOPIFY_STORE_DOMAIN;
const clientId = process.env.SHOPIFY_CLIENT_ID;
const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;
const apiVersion = process.env.VITE_SHOPIFY_API_VERSION || '2025-01';

const BUNDLE_PAIRS = [
  {
    bundleHandle: 'crystal-hoops-duo',
    title: 'Crystal Hoops Duo',
    p1Handle: 'avirena-crystal-hoops-gold-tone-earrings',
    p2Handle: 'avirena-crystal-hoops-silver-tone-earrings',
  },
  {
    bundleHandle: 'studs-hearts-duo',
    title: 'Studs + Hearts Duo',
    p1Handle: 'avirena-square-studs-gold-tone-brass-earrings',
    p2Handle: 'avirena-heart-drops-silver-tone-earrings',
  },
  {
    bundleHandle: 'drops-spirals-duo',
    title: 'Drops + Spirals Duo',
    p1Handle: 'avirena-drop-earrings-gold-tone-brass',
    p2Handle: 'avirena-spiral-earrings-silver-tone',
  },
  {
    bundleHandle: 'cascade-statement-duo',
    title: 'Cascade Statement Duo',
    p1Handle: 'avirena-cascade-statement-drops-gold-tone',
    p2Handle: 'avirena-cascade-statement-drops-silver',
  },
];

async function getAccessToken() {
  const res = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId!,
      client_secret: clientSecret!,
    }),
  });
  const data = await res.json();
  return data.access_token;
}

async function fetchProductData(token: string) {
  const query = `
    query GetAllProducts {
      products(first: 30) {
        nodes {
          id
          handle
          title
          images(first: 10) {
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
  return json.data?.products?.nodes || [];
}

async function downloadImage(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download image from ${url}`);
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function main() {
  console.log('Connecting to Shopify Admin API...');
  const token = await getAccessToken();
  const products = await fetchProductData(token);
  const byHandle = new Map(products.map((p: any) => [p.handle, p]));

  const outputDir = path.resolve('public/assets/bundles');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const pair of BUNDLE_PAIRS) {
    console.log(`\nProcessing bundle: ${pair.title} (${pair.bundleHandle})...`);
    const p1 = byHandle.get(pair.p1Handle);
    const p2 = byHandle.get(pair.p2Handle);

    if (!p1?.images?.nodes?.[0]?.url || !p2?.images?.nodes?.[0]?.url) {
      console.warn(`Missing images for ${pair.bundleHandle}`);
      continue;
    }

    const p1Url = p1.images.nodes[0].url;
    const p2Url = p2.images.nodes[0].url;

    console.log(`P1 (${pair.p1Handle}): ${p1Url}`);
    console.log(`P2 (${pair.p2Handle}): ${p2Url}`);

    const [p1Buf, p2Buf] = await Promise.all([downloadImage(p1Url), downloadImage(p2Url)]);

    // Prepare each product to fit half the canvas (target: max 700 width, 1200 height)
    // Clean background #FAF8F5
    const p1Resized = await sharp(p1Buf)
      .resize(700, 1200, {
        fit: 'contain',
        background: { r: 250, g: 248, b: 245, alpha: 1 },
      })
      .toBuffer();

    const p2Resized = await sharp(p2Buf)
      .resize(700, 1200, {
        fit: 'contain',
        background: { r: 250, g: 248, b: 245, alpha: 1 },
      })
      .toBuffer();

    // Composite side-by-side on 1600x1600 canvas (#FAF8F5)
    // p1 centered on left (x: 60..760, middle: 410 -> left: 60, top: 200)
    // p2 centered on right (x: 840..1540, middle: 1190 -> left: 840, top: 200)
    const composite = await sharp({
      create: {
        width: 1600,
        height: 1600,
        channels: 3,
        background: { r: 250, g: 248, b: 245 },
      },
    })
      .composite([
        { input: p1Resized, left: 60, top: 200 },
        { input: p2Resized, left: 840, top: 200 },
      ])
      .webp({ quality: 90 })
      .toBuffer();

    const webpPath = path.join(outputDir, `${pair.bundleHandle}.webp`);
    fs.writeFileSync(webpPath, composite);

    const jpgBuffer = await sharp(composite).jpeg({ quality: 90 }).toBuffer();
    const jpgPath = path.join(outputDir, `${pair.bundleHandle}.jpg`);
    fs.writeFileSync(jpgPath, jpgBuffer);

    console.log(`✓ Saved composite: ${webpPath} and ${jpgPath}`);
  }

  console.log('\nAll bundle composites generated successfully!');
}

main().catch(console.error);
