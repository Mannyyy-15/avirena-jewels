import fs from 'fs';
import path from 'path';

const outDir = path.resolve('temp-new-products');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 5 Batches in chronological upload order:
// Batch 1 (Product 1): 5 images (uploaded 11:27:44 to 11:27:47)
// Batch 2 (Product 2): 5 images (uploaded 11:28:06 to 11:28:10)
// Batch 3 (Product 3): 5 images (uploaded 11:28:36 to 11:28:38)
// Batch 4 (Product 4): 6 images (uploaded 11:29:03 to 11:29:06)
// Batch 5 (Product 5): 6 images (uploaded 11:29:25 to 11:29:33)

const data = JSON.parse(fs.readFileSync('shopify-files-dump.json', 'utf8'));
const files = data.data.files.edges.map((e: any) => e.node);
const todayFiles = files.filter((f: any) => f.createdAt.startsWith('2026-09-08T11:')).reverse(); // chronological order

console.log('Today files chronological count:', todayFiles.length);

async function download(url: string, dest: string) {
  const res = await fetch(url);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
}

async function main() {
  const promises = todayFiles.map(async (f: any, i: number) => {
    const url = f.image?.url || f.url;
    const filename = `img_${String(i + 1).padStart(2, '0')}.png`;
    const dest = path.join(outDir, filename);
    await download(url, dest);
    console.log(`Downloaded ${filename}`);
  });
  await Promise.all(promises);
  console.log('All downloads completed!');
}

main().catch(console.error);
