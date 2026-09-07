import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';

const SHOPIFY_STORE_DOMAIN = process.env.VITE_SHOPIFY_STORE_DOMAIN || '';
const SHOPIFY_CLIENT_ID = process.env.SHOPIFY_CLIENT_ID || '';
const SHOPIFY_CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET || '';

if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_CLIENT_ID || !SHOPIFY_CLIENT_SECRET) {
  console.error('Missing Shopify credentials in .env');
  process.exit(1);
}

const SCRATCH_DIR = path.resolve(process.cwd(), 'scratch', 'square_images');
if (!fs.existsSync(SCRATCH_DIR)) {
  fs.mkdirSync(SCRATCH_DIR, { recursive: true });
}

async function getAdminAccessToken(): Promise<string> {
  const res = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: SHOPIFY_CLIENT_ID,
      client_secret: SHOPIFY_CLIENT_SECRET,
      grant_type: 'client_credentials',
    }),
  });
  const data = await res.json();
  if (!data.access_token) {
    throw new Error('Failed to obtain Shopify Admin access token: ' + JSON.stringify(data));
  }
  return data.access_token;
}

function padToSquare(inputPath: string, outputPath: string, size = 1254) {
  // Pad symmetrically with transparent color and scale to uniform 1254x1254 square
  const filter = `pad=max(iw\\,ih):max(iw\\,ih):(ow-iw)/2:(oh-ih)/2:color=0x00000000,scale=${size}:${size}`;
  execFileSync('ffmpeg', ['-y', '-i', inputPath, '-vf', filter, outputPath], { stdio: 'pipe' });
}

async function main() {
  console.log('🚀 Starting Shopify product image squaring process...');
  const accessToken = await getAdminAccessToken();
  console.log('✓ Obtained Shopify Admin API access token.');

  // Fetch all products
  const productsRes = await fetch(
    `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2025-01/products.json?limit=50`,
    {
      headers: { 'X-Shopify-Access-Token': accessToken },
    }
  );
  const { products } = await productsRes.json();
  console.log(`✓ Fetched ${products.length} products from Shopify.`);

  for (const product of products) {
    console.log(`\n📦 Checking Product: "${product.title}" (ID: ${product.id})`);
    const images = product.images || [];

    // Filter images that are not 1:1 square
    const nonSquareImages = images.filter((img: any) => img.width !== img.height);
    if (nonSquareImages.length === 0) {
      console.log(`  ✓ All ${images.length} images are already 1:1 square. Skipping.`);
      continue;
    }

    console.log(`  Found ${nonSquareImages.length} non-square image(s) to convert to 1:1 square.`);

    for (const img of nonSquareImages) {
      console.log(`  -> Processing Image ID ${img.id} (${img.width}x${img.height}) at position ${img.position}...`);
      const dlRes = await fetch(img.src);
      const buffer = Buffer.from(await dlRes.arrayBuffer());
      const rawFile = path.join(SCRATCH_DIR, `raw_${product.id}_${img.id}.png`);
      const squareFile = path.join(SCRATCH_DIR, `sq_${product.id}_${img.id}.png`);
      fs.writeFileSync(rawFile, buffer);

      // Convert using ffmpeg
      padToSquare(rawFile, squareFile, 1254);

      // Read converted square base64
      const base64Data = fs.readFileSync(squareFile).toString('base64');
      const filename = `square_${product.handle}_${img.position}.png`;

      // Upload to Shopify product
      const uploadRes = await fetch(
        `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2025-01/products/${product.id}/images.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': accessToken,
          },
          body: JSON.stringify({
            image: {
              attachment: base64Data,
              filename,
              position: img.position,
            },
          }),
        }
      );
      const uploadData = await uploadRes.json();
      if (!uploadData.image) {
        console.error('  Failed to upload square image:', uploadData);
        continue;
      }
      const newImageId = uploadData.image.id;
      console.log(`  ✓ Uploaded 1254x1254 square image (ID: ${newImageId}) at position ${img.position}.`);

      // Check if any variant was linked to the old image
      const linkedVariants = (product.variants || []).filter((v: any) => v.image_id === img.id);
      for (const variant of linkedVariants) {
        console.log(`    Re-linking Variant ID ${variant.id} to new square image...`);
        await fetch(
          `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2025-01/variants/${variant.id}.json`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'X-Shopify-Access-Token': accessToken,
            },
            body: JSON.stringify({
              variant: {
                id: variant.id,
                image_id: newImageId,
              },
            }),
          }
        );
      }

      // Delete the old non-square image
      console.log(`    Deleting old non-square image ID ${img.id}...`);
      await fetch(
        `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2025-01/products/${product.id}/images/${img.id}.json`,
        {
          method: 'DELETE',
          headers: { 'X-Shopify-Access-Token': accessToken },
        }
      );
      console.log(`    ✓ Deleted old non-square image ID ${img.id}.`);
    }
  }

  // Also clean up any extra duplicate test image on Nadir if present
  const nadirRes = await fetch(
    `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2025-01/products/10511623815490/images.json`,
    { headers: { 'X-Shopify-Access-Token': accessToken } }
  );
  const nadirData = await nadirRes.json();
  const testImages = (nadirData.images || []).filter((img: any) => img.src.includes('nadir-square-1254.png'));
  for (const tImg of testImages) {
    console.log(`Cleaning up temporary test image ${tImg.id}...`);
    await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2025-01/products/10511623815490/images/${tImg.id}.json`,
      { method: 'DELETE', headers: { 'X-Shopify-Access-Token': accessToken } }
    );
  }

  console.log('\n🎉 Finished squaring all product images in Shopify!');
}

main().catch((err) => {
  console.error('Fatal error in squaring script:', err);
  process.exit(1);
});
