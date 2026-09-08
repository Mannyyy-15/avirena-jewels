import fs from 'fs';

const data = JSON.parse(fs.readFileSync('shopify-files-dump.json', 'utf8'));
const files = data.data.files.edges.map((e: any) => e.node);
const todayFiles = files.filter((f: any) => f.createdAt.startsWith('2026-09-08T11:')).reverse(); // chronological

todayFiles.forEach((f: any, i: number) => {
  const url = f.image?.url || f.url;
  console.log(`img_${String(i + 1).padStart(2, '0')} | ${f.createdAt} | ${url.split('?')[0]}`);
});
