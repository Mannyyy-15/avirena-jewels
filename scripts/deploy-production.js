const { spawn } = require('child_process');
const path = require('path');

const hydrogenDir = path.resolve(__dirname, '../hydrogen');

const child = spawn('npx.cmd', ['shopify', 'hydrogen', 'deploy', '--env=production', '--no-verify'], {
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
  console.log('Spawned deploy process, waiting to send confirmation...');
  // Send "y" and Enter after a short delay
  const interval = setInterval(() => {
    try {
      child.stdin.write('y\r\n');
    } catch (e) {
      clearInterval(interval);
    }
  }, 1000);

  setTimeout(() => clearInterval(interval), 15000);
});

child.on('close', (code) => {
  console.log(`Process exited with code ${code}`);
  process.exit(code);
});
