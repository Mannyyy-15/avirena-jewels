import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';

const PUBLIC_DIR = path.resolve(process.cwd(), 'public');
const ogBannerPath = path.join(PUBLIC_DIR, 'og-banner.jpg');

const filter = 'color=c=0xFAF8F5:s=1200x630,drawbox=x=26:y=26:w=1148:h=578:color=0xC5A059@0.5:t=2,drawbox=x=34:y=34:w=1132:h=562:color=0xD8D2C2@0.6:t=1[bg];[0:v]scale=850:-1[logo];[bg][logo]overlay=(W-w)/2:(H-h)/2';

execFileSync(
  'ffmpeg',
  [
    '-y',
    '-i',
    path.join(PUBLIC_DIR, 'logo.png'),
    '-filter_complex',
    filter,
    '-frames:v',
    '1',
    '-q:v',
    '2',
    ogBannerPath,
  ],
  { stdio: 'pipe' }
);

const stat = fs.statSync(ogBannerPath);
console.log(`✓ og-banner.jpg created (${(stat.size / 1024).toFixed(1)} KB, 1200x630).`);
