/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SHOPIFY_STORE_DOMAIN?: string;
  readonly VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN?: string;
  readonly VITE_SHOPIFY_API_VERSION?: string;
  readonly GEMINI_API_KEY?: string;
  readonly APP_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
