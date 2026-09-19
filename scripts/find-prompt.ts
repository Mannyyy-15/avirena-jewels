import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const indexPath = path.resolve(__dirname, '../hydrogen/node_modules/@shopify/cli/dist/index.js');
const content = fs.readFileSync(indexPath, 'utf-8');

const idx = content.indexOf('Creating a deployment');
if (idx !== -1) {
  console.log('Found match at index:', idx);
  console.log('Snippet:', content.substring(Math.max(0, idx - 200), Math.min(content.length, idx + 400)));
} else {
  console.log('Not found');
}
