import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          /*
           * Split the long-lived vendor libraries out of the entry chunk. These
           * change only on dependency upgrades, so isolating them means a normal
           * content/UI deploy invalidates the (much smaller) app chunk instead of
           * forcing every returning visitor to re-download React + the animation
           * stack. Route chunks are handled separately by React.lazy in App.tsx.
           */
          manualChunks(id: string) {
            if (!id.includes('node_modules')) return;
            if (/[\/]node_modules[\/](react|react-dom|scheduler)[\/]/.test(id)) {
              return 'vendor-react';
            }
            if (/[\/]node_modules[\/](gsap|lenis)[\/]/.test(id)) {
              return 'vendor-motion';
            }
            if (/[\/]node_modules[\/](framer-motion|motion|motion-dom|motion-utils)[\/]/.test(id)) {
              return 'vendor-framer';
            }
            if (/[\/]node_modules[\/]lucide-react[\/]/.test(id)) {
              return 'vendor-icons';
            }
          },
        },
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      watch: {
        usePolling: true,
        interval: 1000,
        ignored: ['**/node_modules/**', '**/.git/**', '**/dist/**', '**/*.png', '**/*.jpg', '**/*.jpeg'],
      },
    },
  };
});
