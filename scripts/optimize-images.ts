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

const TARGETS: Target[] = [{ src: 'public/logo.png', out: 'public/logo.webp', quality: 82 }];

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

  for (const { src, out, quality } of TARGETS) {
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
