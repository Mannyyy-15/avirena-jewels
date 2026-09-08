import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';

const ROOT_DIR = process.cwd();
const PUBLIC_DIR = path.resolve(ROOT_DIR, 'public');
// Strict source of truth: the official high-resolution logo provided by user
const SRC_FAVICON = path.resolve(ROOT_DIR, 'favicon.png');

if (!fs.existsSync(SRC_FAVICON)) {
  console.error('❌ Master favicon.png not found at:', SRC_FAVICON);
  process.exit(1);
}

console.log('🚀 Generating Google-compliant Favicon Suite from Master Asset:');
console.log('   Source:', SRC_FAVICON);

// 1. Generate PNG variants using ffmpeg high-quality lanczos scaling
const targets = [
  { name: 'favicon-48x48.png', size: 48 },   // Google Search core standard (exact multiple of 48)
  { name: 'favicon-96x96.png', size: 96 },   // High-DPI SERP (2x)
  { name: 'favicon-192x192.png', size: 192 }, // Android & mobile Google Search
  { name: 'favicon-512x512.png', size: 512 }, // PWA install & high-res branding
  { name: 'apple-touch-icon.png', size: 180 }, // iOS Safari home screen
];

for (const t of targets) {
  const outPath = path.join(PUBLIC_DIR, t.name);
  console.log(`  -> Generating ${t.name} (${t.size}x${t.size})...`);
  execFileSync(
    'ffmpeg',
    [
      '-y',
      '-i',
      SRC_FAVICON,
      '-vf',
      `scale=${t.size}:${t.size}:flags=lanczos`,
      outPath,
    ],
    { stdio: 'pipe' }
  );
  const stat = fs.statSync(outPath);
  console.log(`     ✓ Created ${t.name} (${(stat.size / 1024).toFixed(1)} KB)`);
}

// 2. Generate multi-resolution root /favicon.ico (48x48 primary)
const icoPath = path.join(PUBLIC_DIR, 'favicon.ico');
console.log('  -> Generating root favicon.ico from master...');
execFileSync(
  'ffmpeg',
  [
    '-y',
    '-i',
    path.join(PUBLIC_DIR, 'favicon-48x48.png'),
    icoPath,
  ],
  { stdio: 'pipe' }
);
const icoStat = fs.statSync(icoPath);
console.log(`  ✓ Created root favicon.ico (${(icoStat.size / 1024).toFixed(1)} KB)`);

// 3. Keep public/favicon.png as a crisp 512x512 copy of the master logo
fs.copyFileSync(path.join(PUBLIC_DIR, 'favicon-512x512.png'), path.join(PUBLIC_DIR, 'favicon.png'));
console.log('  ✓ Updated public/favicon.png with 512x512 master logo.');

// 4. Remove any outdated/artificial favicon.svg so browsers never display anything else
const svgPath = path.join(PUBLIC_DIR, 'favicon.svg');
if (fs.existsSync(svgPath)) {
  fs.unlinkSync(svgPath);
  console.log('  ✓ Removed artificial public/favicon.svg');
}

// 5. Create site.webmanifest for PWA & Google rich search index
const manifest = {
  name: 'AVIRENA Jewels',
  short_name: 'AVIRENA',
  description: 'Anti-Tarnish Sculptural Fine Jewelry for Everyday Wear',
  start_url: '/',
  display: 'standalone',
  background_color: '#FAF8F5',
  theme_color: '#413C23',
  icons: [
    {
      src: '/favicon-192x192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any maskable',
    },
    {
      src: '/favicon-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any maskable',
    },
  ],
};
fs.writeFileSync(path.join(PUBLIC_DIR, 'site.webmanifest'), JSON.stringify(manifest, null, 2), 'utf-8');
console.log('  ✓ Created site.webmanifest');

console.log('\n🎉 Favicon Suite generation finished successfully from master logo!');
