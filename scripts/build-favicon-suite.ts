import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';

const PUBLIC_DIR = path.resolve(process.cwd(), 'public');
const SRC_FAVICON = path.join(PUBLIC_DIR, 'favicon.png');

console.log('🚀 Generating Google-compliant Favicon Suite from:', SRC_FAVICON);

// 1. Generate PNG variants
const targets = [
  { name: 'favicon-48x48.png', size: 48 },   // Google Search core standard
  { name: 'favicon-96x96.png', size: 96 },   // High-DPI SERP
  { name: 'favicon-192x192.png', size: 192 }, // Android & mobile Google Search
  { name: 'favicon-512x512.png', size: 512 }, // PWA install
  { name: 'apple-touch-icon.png', size: 180 }, // iOS Safari
  { name: 'favicon-temp.png', size: 192 },    // Clean replacement for favicon.png
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

// Replace the old 726KB favicon.png with the optimized 192x192 version
fs.renameSync(path.join(PUBLIC_DIR, 'favicon-temp.png'), path.join(PUBLIC_DIR, 'favicon.png'));
console.log('  ✓ Replaced oversized favicon.png with lightweight 192x192 version.');

// 2. Generate multi-resolution root /favicon.ico (48x48 primary)
const icoPath = path.join(PUBLIC_DIR, 'favicon.ico');
console.log('  -> Generating root favicon.ico...');
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

// 3. Create SVG favicon for modern browsers
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="46" fill="#FAF8F5" stroke="#C5A059" stroke-width="2.5"/>
  <text x="35" y="62" font-family="Cinzel, 'Playfair Display', Georgia, serif" font-size="44" font-weight="600" fill="#1E1E1C" text-anchor="middle">A</text>
  <text x="64" y="62" font-family="Cinzel, 'Playfair Display', Georgia, serif" font-size="44" font-weight="300" fill="#1E1E1C" text-anchor="middle">V</text>
  <path d="M 34 22 C 30 40, 56 42, 60 72" fill="none" stroke="#D4AF37" stroke-width="2" stroke-linecap="round"/>
  <circle cx="34" cy="22" r="2.5" fill="#D4AF37"/>
  <circle cx="60" cy="74" r="3.5" fill="#8B1524"/>
</svg>
`;
fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.svg'), svgContent, 'utf-8');
console.log('  ✓ Created vector favicon.svg');

// 4. Create site.webmanifest for PWA & Google rich search index
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

console.log('\n🎉 Favicon Suite generation finished successfully!');
