/**
 * Build-time raster optimisation for the self-hosted hero art.
 *
 * The homepage hero wordmark (public/logo.png, 2128x739, 320KB) is the LCP
 * element. This emits a WebP sibling so <picture> can serve ~72% fewer bytes to
 * every modern browser while the PNG stays as the fallback.
 *
 * ffmpeg is used because it is the only encoder guaranteed present in this
 * toolchain (no sharp/squoosh dependency). If ffmpeg is unavailable the step
 * logs and exits 0 — a missing WebP degrades to the PNG fallback in <picture>,
 * so the build must not fail over it.
 *
 * AVIF is deliberately NOT emitted: the bundled libaom build cannot encode an
 * alpha channel, and the logo is transparent art composited with
 * mix-blend-multiply. A flattened AVIF renders as a black box, so shipping one
 * would be worse than shipping none.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

interface Target {
  src: string;
  out: string;
  quality: number;
}

const TARGETS: Target[] = [
  { src: 'public/logo.png', out: 'public/logo.webp', quality: 82 },
  // hero.png is 1.29MB and is the REAL mobile LCP element (measured), not the
  // logo. Under throttled mobile it accounted for ~5s of resource load time on
  // its own, which dominates every other performance cost on the site.
  { src: 'public/hero.png', out: 'public/hero.webp', quality: 80 },
];

/**
 * Photographic JPEGs imported through Vite from src/assets.
 *
 * These are 600KB-1MB each and lazy-loaded below the fold, so they do not hit
 * LCP — but they are still ~3MB of avoidable transfer for anyone who scrolls.
 * Vite fingerprints and copies them at build time, so converting the SOURCE is
 * what changes what ships.
 */
const PHOTO_TARGETS: Target[] = [
  'about/about-vignette-1',
  'about/about-vignette-2',
  'about/about-vignette-3',
  'about/about-vignette-4',
  'about/about-banner-book',
  'blog-hero-editorial',
  'shop-hero-editorial',
].map((name) => ({
  src: `src/assets/${name}.jpg`,
  out: `src/assets/${name}.webp`,
  quality: 78,
}));

function ffmpegAvailable(): boolean {
  try {
    execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function kb(bytes: number): string {
  return `${(bytes / 1024).toFixed(1)}KB`;
}

function main(): void {
  if (!ffmpegAvailable()) {
    console.warn('⚠️  optimize-images: ffmpeg not found — keeping existing WebP assets as-is.');
    return;
  }

  for (const { src, out, quality } of [...TARGETS, ...PHOTO_TARGETS]) {
    const srcPath = path.join(ROOT, src);
    const outPath = path.join(ROOT, out);

    if (!existsSync(srcPath)) {
      console.warn(`⚠️  optimize-images: ${src} missing, skipping.`);
      continue;
    }

    // Only re-encode when the source is newer than the derivative.
    if (existsSync(outPath) && statSync(outPath).mtimeMs >= statSync(srcPath).mtimeMs) {
      console.log(`✓ optimize-images: ${out} up to date (${kb(statSync(outPath).size)}).`);
      continue;
    }

    try {
      execFileSync(
        'ffmpeg',
        [
          '-y', '-hide_banner', '-loglevel', 'error',
          '-i', srcPath,
          '-c:v', 'libwebp',
          '-lossless', '0',
          '-quality', String(quality),
          '-compression_level', '6',
          '-preset', 'picture',
          outPath,
        ],
        { stdio: 'inherit' }
      );
      console.log(
        `✓ optimize-images: ${src} ${kb(statSync(srcPath).size)} → ${out} ${kb(statSync(outPath).size)}`
      );
    } catch {
      console.warn(`⚠️  optimize-images: failed to encode ${out} — PNG fallback still ships.`);
    }
  }
}

main();
