import fs from 'fs';
import path from 'path';
import { spawnSync, execFileSync } from 'child_process';
import dotenv from 'dotenv';
dotenv.config();

const SHOP_DOMAIN = process.env.VITE_SHOPIFY_STORE_DOMAIN || 'm5yhxq-gb.myshopify.com';
const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET;

async function fetchWithRetry(url: string, options: any = {}, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 25000);
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeout);
      return res;
    } catch (err: any) {
      console.warn(`  [fetch attempt ${i + 1} failed: ${err.message || err}]. Retrying...`);
      if (i === retries - 1) throw err;
      await new Promise((r) => setTimeout(r, 2000 * (i + 1)));
    }
  }
  throw new Error('All retries failed');
}

async function getAdminAccessToken(): Promise<string> {
  const res = await fetchWithRetry(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
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

interface ImageBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  width: number;
  height: number;
  opaqueBlack: number;
  transparent: number;
}

function analyzeImage(imagePath: string, width = 1254, height = 1254): ImageBounds {
  const res = spawnSync('ffmpeg', ['-i', imagePath, '-f', 'rawvideo', '-pix_fmt', 'rgba', 'pipe:1'], {
    maxBuffer: 50 * 1024 * 1024,
  });
  const buf = res.stdout;
  if (!buf || buf.length < width * height * 4) {
    throw new Error('Failed to extract raw pixels');
  }

  let minX = width, maxX = 0, minY = height, maxY = 0;
  let opaqueBlack = 0, transparent = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = buf[idx];
      const g = buf[idx + 1];
      const b = buf[idx + 2];
      const a = buf[idx + 3];

      if (a < 15) {
        transparent++;
      } else if (r < 15 && g < 15 && b < 15) {
        opaqueBlack++;
      } else {
        // Colored / non-black pixel
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  return {
    minX,
    maxX,
    minY,
    maxY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
    opaqueBlack,
    transparent,
  };
}

// Convert an image with black bars into a clean, true 1:1 square
function cropToSquareNoBlack(inputPath: string, outputPath: string, bounds: ImageBounds, targetSize = 1254) {
  const contentW = bounds.width;
  const contentH = bounds.height;
  const squareSize = Math.min(contentW, contentH);
  const cropX = bounds.minX + Math.round((contentW - squareSize) / 2);
  const cropY = bounds.minY + Math.round((contentH - squareSize) / 2);

  const filter = `crop=${squareSize}:${squareSize}:${cropX}:${cropY},scale=${targetSize}:${targetSize}`;
  execFileSync('ffmpeg', ['-y', '-i', inputPath, '-vf', filter, outputPath], { stdio: 'pipe' });
}

async function run() {
  console.log('🚀 Checking and fixing all images with black bars...');
  const accessToken = await getAdminAccessToken();
  console.log('✓ Obtained Shopify token.');

  const res = await fetchWithRetry(`https://${SHOP_DOMAIN}/admin/api/2025-01/products.json?limit=50`, {
    headers: { 'X-Shopify-Access-Token': accessToken },
  });
  const { products } = await res.json();

  const workDir = path.resolve(process.cwd(), 'scratch', 'fix_black_bars');
  if (!fs.existsSync(workDir)) fs.mkdirSync(workDir, { recursive: true });

  let totalFixed = 0;

  for (const product of products) {
    console.log(`\n📦 Product: "${product.title}" (ID: ${product.id})`);
    for (const img of product.images || []) {
      const origFile = path.join(workDir, `orig_${product.id}_${img.id}.png`);
      const dlRes = await fetchWithRetry(img.src);
      const buf = Buffer.from(await dlRes.arrayBuffer());
      fs.writeFileSync(origFile, buf);

      const bounds = analyzeImage(origFile, img.width, img.height);
      
      // An image has black padding/bars if:
      // 1. It is not a transparent cutout (transparent < 100k)
      // 2. Its non-black content starts well inside the canvas (> 25px border margin)
      const hasLeftBar = bounds.minX > 25;
      const hasRightBar = bounds.maxX < img.width - 26;
      const hasTopBar = bounds.minY > 25;
      const hasBottomBar = bounds.maxY < img.height - 26;
      const isBlackBarImage = (hasLeftBar || hasRightBar || hasTopBar || hasBottomBar) && bounds.transparent < 100000;

      if (!isBlackBarImage) {
        console.log(`  ✓ Image pos ${img.position} (${img.id}): clean (bounds: ${bounds.minX}..${bounds.maxX} x ${bounds.minY}..${bounds.maxY}, transparent: ${bounds.transparent})`);
        continue;
      }

      console.log(`  ⚠️ Image pos ${img.position} (${img.id}): HAS BLACK BARS (${bounds.opaqueBlack} opaque black pixels)!`);
      console.log(`     Content region: ${bounds.width}x${bounds.height} at (${bounds.minX}, ${bounds.minY})`);

      const fixedFile = path.join(workDir, `clean_${product.id}_${img.id}.png`);
      cropToSquareNoBlack(origFile, fixedFile, bounds, 1254);

      // Verify the fixed image has 0 opaque black bars
      const fixedBounds = analyzeImage(fixedFile, 1254, 1254);
      console.log(`     Fixed image: opaqueBlack=${fixedBounds.opaqueBlack}, transparent=${fixedBounds.transparent}`);

      // Upload clean square image to Shopify
      const base64Data = fs.readFileSync(fixedFile).toString('base64');
      const filename = `square_clean_${product.handle}_${img.position}.png`;

      console.log(`     Uploading clean 1:1 square to Shopify at position ${img.position}...`);
      const uploadRes = await fetchWithRetry(
        `https://${SHOP_DOMAIN}/admin/api/2025-01/products/${product.id}/images.json`,
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
        console.error('     ❌ Failed to upload clean image:', uploadData);
        continue;
      }
      const newImageId = uploadData.image.id;
      console.log(`     ✓ Uploaded clean 1:1 square image (ID: ${newImageId})`);

      // Re-link any variants that pointed to the old image
      const linkedVariants = (product.variants || []).filter((v: any) => v.image_id === img.id);
      for (const variant of linkedVariants) {
        console.log(`     Re-linking Variant ID ${variant.id} to clean image...`);
        await fetchWithRetry(
          `https://${SHOP_DOMAIN}/admin/api/2025-01/variants/${variant.id}.json`,
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

      // Delete the old black-bar image
      console.log(`     Deleting old black-bar image ID ${img.id}...`);
      await fetchWithRetry(
        `https://${SHOP_DOMAIN}/admin/api/2025-01/products/${product.id}/images/${img.id}.json`,
        {
          method: 'DELETE',
          headers: { 'X-Shopify-Access-Token': accessToken },
        }
      );
      console.log(`     ✓ Deleted old black-bar image.`);
      totalFixed++;
    }
  }

  console.log(`\n🎉 Completed! Total images fixed with clean 1:1 square cropping: ${totalFixed}`);
}

run().catch(console.error);
