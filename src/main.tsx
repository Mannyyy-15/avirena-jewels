import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

/**
 * Handle stale chunk loading failures upon new deployments.
 * When a new version of the app is deployed to production, older hashed chunks
 * (like ProductDetailPage-[oldHash].js) return 404. Vite dispatches 'vite:preloadError'
 * on window; listening to this allows us to auto-reload once to fetch the latest assets
 * seamlessly without throwing uncaught TypeErrors to the user.
 */
window.addEventListener('vite:preloadError', (event) => {
  console.warn('[Avirena] Dynamic module chunk outdated after new deployment. Auto-reloading...', event);
  const reloadKey = 'avirena_preload_retry';
  const lastReload = sessionStorage.getItem(reloadKey);
  const now = Date.now();
  if (!lastReload || now - parseInt(lastReload, 10) > 15000) {
    sessionStorage.setItem(reloadKey, String(now));
    window.location.reload();
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

