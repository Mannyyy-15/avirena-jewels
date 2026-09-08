/**
 * Injects a headless storefront redirect script into Shopify's published theme.liquid.
 *
 * When using a headless architecture (custom frontend at avirenajewels.com and Shopify
 * backend at checkout.avirenajewels.com), any customer landing on checkout.avirenajewels.com/
 * (e.g. after payment or clicking "Continue shopping") would otherwise see Shopify's default
 * unstyled theme.
 *
 * This script safely intercepts non-checkout traffic in <head> and redirects visitors
 * directly back to the matching page on https://avirenajewels.com.
 */

import dotenv from 'dotenv';
dotenv.config();

const SHOP_DOMAIN = process.env.VITE_SHOPIFY_STORE_DOMAIN || 'm5yhxq-gb.myshopify.com';
const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET;
const API_VERSION = process.env.VITE_SHOPIFY_API_VERSION || '2025-01';

const HEADLESS_REDIRECT_SNIPPET = `
    {%- unless request.design_mode -%}
      <!-- Headless Storefront Redirect: Avirena Jewels -->
      <script>
        (function() {
          var p = window.location.pathname;
          // Never redirect checkout, one-page checkout, order status, thank you, challenge, or admin URLs
          if (
            !p.startsWith('/checkouts') &&
            !p.startsWith('/c/') &&
            !p.startsWith('/orders') &&
            !p.startsWith('/thank_you') &&
            !p.startsWith('/account') &&
            !p.startsWith('/challenge') &&
            !p.startsWith('/admin')
          ) {
            var target = 'https://avirenajewels.com';
            if (p.startsWith('/products/')) {
              target += '/product/' + p.replace('/products/', '');
            } else if (p.startsWith('/collections')) {
              target += '/shop';
            } else if (p === '/' || p === '') {
              target += '/';
            } else {
              target += p;
            }
            window.location.replace(target + window.location.search + window.location.hash);
          }
        })();
      </script>
    {%- endunless -%}
`;

async function getAdminAccessToken(): Promise<string> {
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: CLIENT_ID!,
      client_secret: CLIENT_SECRET!,
    }),
  });
  if (!res.ok) {
    throw new Error(`OAuth error (${res.status}): ${await res.text()}`);
  }
  const data = await res.json();
  return data.access_token;
}

async function main() {
  const token = await getAdminAccessToken();
  console.log('✅ Obtained Shopify Admin Access Token');

  // 1. Get published theme
  const themesRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/${API_VERSION}/themes.json`, {
    headers: { 'X-Shopify-Access-Token': token },
  });
  const themesData = await themesRes.json();
  const mainTheme = themesData.themes?.find((t: any) => t.role === 'main');
  if (!mainTheme) {
    throw new Error('No published theme found!');
  }
  console.log(`📦 Published theme: "${mainTheme.name}" (ID: ${mainTheme.id})`);

  // 2. Fetch layout/theme.liquid
  const assetRes = await fetch(
    `https://${SHOP_DOMAIN}/admin/api/${API_VERSION}/themes/${mainTheme.id}/assets.json?asset[key]=layout/theme.liquid`,
    {
      headers: { 'X-Shopify-Access-Token': token },
    }
  );
  const assetData = await assetRes.json();
  let themeLiquid: string = assetData.asset?.value;
  if (!themeLiquid) {
    throw new Error('Could not retrieve layout/theme.liquid content!');
  }

  // Check if snippet is already present
  if (themeLiquid.includes('Headless Storefront Redirect: Avirena Jewels')) {
    console.log('ℹ️ Headless redirect snippet is already present in layout/theme.liquid.');
    return;
  }

  // 3. Inject snippet right after <head>
  const headIndex = themeLiquid.indexOf('<head>');
  if (headIndex === -1) {
    throw new Error('Could not locate <head> tag in theme.liquid');
  }

  const updatedLiquid =
    themeLiquid.slice(0, headIndex + '<head>'.length) +
    HEADLESS_REDIRECT_SNIPPET +
    themeLiquid.slice(headIndex + '<head>'.length);

  // 4. Save updated asset back to Shopify
  console.log('🚀 Uploading updated layout/theme.liquid to Shopify...');
  const saveRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/${API_VERSION}/themes/${mainTheme.id}/assets.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token,
    },
    body: JSON.stringify({
      asset: {
        key: 'layout/theme.liquid',
        value: updatedLiquid,
      },
    }),
  });

  if (!saveRes.ok) {
    throw new Error(`Failed to update theme.liquid (${saveRes.status}): ${await saveRes.text()}`);
  }

  const saveData = await saveRes.json();
  console.log('🎉 Successfully injected headless redirect into layout/theme.liquid!');
  console.log(`   Updated asset key: ${saveData.asset?.key}`);
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
