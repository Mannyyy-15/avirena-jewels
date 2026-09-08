import fs from 'fs';

const data = JSON.parse(fs.readFileSync('shopify-files-dump.json', 'utf8'));
const files = data.data.files.edges.map((e: any) => e.node);

console.log(`Total files: ${files.length}`);
const todayFiles = files.filter((f: any) => f.createdAt.startsWith('2026-09-08T11:'));

console.log(`Files uploaded today around 11:xx UTC: ${todayFiles.length}`);
todayFiles.forEach((f: any, i: number) => {
  const url = f.image?.url || f.url || '';
  console.log(`[${i + 1}] ID: ${f.id} | Created: ${f.createdAt} | URL: ${url}`);
});
