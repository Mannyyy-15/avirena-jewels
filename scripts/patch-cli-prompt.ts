import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const indexPath = path.resolve(__dirname, '../hydrogen/node_modules/@shopify/cli/dist/index.js');
let content = fs.readFileSync(indexPath, 'utf-8');

const target = 'if(!j&&!He.defaultEnvironment&&(re||ie)){';
if (content.includes(target)) {
  content = content.replace(target, 'if(false&&!j&&!He.defaultEnvironment&&(re||ie)){');
  fs.writeFileSync(indexPath, content, 'utf-8');
  console.log('Successfully patched Shopify CLI to skip production confirmation prompt!');
} else {
  console.log('Target string not found in index.js');
}
