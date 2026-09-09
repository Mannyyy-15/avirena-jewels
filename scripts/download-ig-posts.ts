import fs from 'fs';
import path from 'path';

const POSTS = [
  {
    id: 'post-1',
    code: 'DdBnEviT5WR',
    type: 'reel',
    caption: 'Hair tucked back. Golden texture catching the light. These earrings deserve their moment. ✨',
    url: 'https://www.instagram.com/reel/DdBnEviT5WR/',
  },
  {
    id: 'post-2',
    code: 'Dc8v3NVvEuK',
    type: 'post',
    caption: 'AVIRENA • Modern anti-tarnish jewelry. Crafted for every day.',
    url: 'https://www.instagram.com/p/Dc8v3NVvEuK/',
  },
  {
    id: 'post-3',
    code: 'Dc8u9B2MYd0',
    type: 'reel',
    caption: 'Effortless elegance. Sculptural lines made to elevate every occasion.',
    url: 'https://www.instagram.com/reel/Dc8u9B2MYd0/',
  },
];

async function main() {
  const targetDir = path.resolve('public/instagram');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  for (const post of POSTS) {
    console.log(`Fetching media for ${post.code}...`);
    const headRes = await fetch(`https://www.instagram.com/p/${post.code}/media/?size=l`, {
      redirect: 'manual'
    });
    const mediaUrl = headRes.headers.get('location');
    if (!mediaUrl) {
      console.error(`Failed to get location for ${post.code}`);
      continue;
    }

    const imgRes = await fetch(mediaUrl);
    const buffer = Buffer.from(await imgRes.arrayBuffer());

    const outPath = path.join(targetDir, `${post.id}.jpg`);
    fs.writeFileSync(outPath, buffer);
    console.log(`Saved ${outPath} (${(fs.statSync(outPath).size / 1024).toFixed(1)} KB)`);
  }
}

main().catch(console.error);
