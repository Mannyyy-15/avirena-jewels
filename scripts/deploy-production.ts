import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const hydrogenDir = path.resolve(__dirname, '../hydrogen');

const child = spawn('npx.cmd', ['shopify', 'hydrogen', 'deploy', '--env=production', '--no-verify', '-f'], {
  cwd: hydrogenDir,
  shell: true,
  stdio: ['pipe', 'inherit', 'inherit'],
  env: {
    ...process.env,
    CI: 'false',
    FORCE_COLOR: 'true',
  },
});

child.on('spawn', () => {
  console.log('Spawned deploy process, sending confirmation...');
  const interval = setInterval(() => {
    try {
      child.stdin.write('y\r\n');
    } catch (e) {
      clearInterval(interval);
    }
  }, 1000);

  setTimeout(() => clearInterval(interval), 30000);
});

child.on('close', (code) => {
  console.log(`Process exited with code ${code}`);
  process.exit(code || 0);
});
