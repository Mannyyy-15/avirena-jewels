# E-commerce SEO Findings — avirenajewels.com

Scope: product catalog integrity, category page architecture, product page SEO,
commerce schema consequences, image pipeline, and Merchant Center readiness.
Data sources: live Shopify Storefront API query (3 products confirmed), rendered
and raw HTML pulls via `render_page.py` against the production site, and direct
repo inspection. No DataForSEO/Google API data used — no search volume, SERP
position, or competitor pricing is claimed anywhere below.

---

## Finding 1 — CRITICAL: Real catalog is 3 SKUs (all earrings); site markets 5 categories

**Evidence**
- Direct Shopify Storefront API query against the store configured in
  `scripts/prerender.ts:12-13` (`m5yhxq-gb.myshopify.com`) returns exactly
  **3 products, all category "earrings"**:
  - `/product/geometric-gold-tone-statement-earrings-for-women-modern-square-earrings`
  - `/product/gold-tone-drop-earrings-for-women-minimalist-long-dangle-earrings`
  - `/product/gold-tone-statement-drop-earrings-for-women-geometric-dangle-earrings`
- `public/sitemap.xml` / `dist/sitemap.xml` lists these same 3 product URLs — sitemap is accurate to the live backend.
- Yet the site publishes and internally promotes 5 shop categories: `/shop/earrings`, `/shop/necklaces`, `/shop/rings`, `/shop/bracelets`, `/shop/brooches` (`scripts/prerender.ts` categories array, ~line 232), each submitted in the sitemap at priority 0.8.
- `src/data/products.ts` contains 19 hardcoded fallback products spanning all 5 categories (5 necklaces, 5 earrings, 5 rings, 3 bracelets, 1 brooch — `grep -c "id: '" src/data/products.ts` = 19), but **`scripts/prerender.ts` never imports or reads this file** — it is invisible to the sitemap and to prerendered HTML.

**Commerce consequence**
This is the binding constraint on organic revenue: 4 of 5 advertised product lines (necklaces, rings, bracelets, brooches) have **zero purchasable inventory**. Any ranking or click earned by a necklace/ring/bracelet/brooch query lands a visitor on a page with nothing to buy in that category — pure bounce, zero conversion. Google Merchant Center / free product listings are only possible for the 3 earring SKUs; there is no feed-eligible inventory for 80% of the taxonomy the site presents.

**Fix**
Either (a) load real inventory for necklaces/rings/bracelets/brooches into Shopify before continuing to promote those categories, or (b) immediately reduce the public taxonomy to match reality (remove the 4 empty categories from nav, sitemap, and prerendering) until stock exists. Do not leave 5 categories live against 1 stocked category.

**Falsifiable**
Query the Shopify Storefront API `products(first:100)` for the configured store domain — count by `productType`/category. If categories other than earrings return >0 products, this finding is stale and should be re-scored.

---

## Finding 2 — CRITICAL: `/shop/:category` URLs do not filter and serve duplicate/mock content

**Evidence — root cause in code**
- `src/App.tsx` location-parsing effect (~line 115-170): the switch statement branches only on `parts[0]` (`root === 'shop'`) and calls `setCurrentPage('collection')`. It never reads `parts[1]` (the category slug) and never calls `setSelectedCategory(...)`. Visiting `/shop/bracelets` therefore renders the exact same view as `/shop`.
- `src/pages/CollectionPage.tsx:47` (`filteredProducts` `useMemo`) correctly filters by `selectedCategory` — the filtering logic itself is fine. The defect is entirely upstream: the URL never populates that prop.
- A second effect in `src/App.tsx` (~line 178-232) derives `targetPath` from `currentPage` only (`case 'collection': targetPath = '/shop'`) and calls `window.history.pushState(null, '', targetPath)`. Net effect: loading `/shop/earrings` gets silently rewritten to `/shop` in the address bar after hydration, and pushes a spurious history entry (breaks back-button UX). It also overwrites the server-rendered `<title>` — a visitor/crawler that executes JS sees `document.title` flip from the prerendered `"Earrings — Dailywear Jewelry | AVIRENA"` to `"All Jewellery Collection | AVIRENA"`.
- Directly observed on the live rendered page for `/shop/necklaces`: masthead reads **"ALL JEWELRY (19)"** with a mixed grid including rings, brooches, bracelets, and earrings drawn from the `src/data/products.ts` mock catalog (Unsplash-hosted images) — i.e., visitors briefly see 19 non-purchasable mock SKUs (see Finding 3) before/if the Shopify swap ever occurs, because `CollectionPage.tsx` imports `PRODUCTS` (the mock array) as its initial state.
- Net result across all 5 category URLs: **duplicate content** (same unfiltered listing served at 5 distinct canonical URLs) compounded by a **client-side URL collapse** back to `/shop`.

**Commerce consequence**
Google has no reliable way to associate `/shop/rings` with ring-specific intent — it either sees the identical `/shop` grid or a URL that self-corrects away from the one Google indexed. This actively damages topical relevance signals for every non-earring category page (Finding 1 already established there's no inventory to show).

**Fix**
1. Read `parts[1]` in the location effect and call `setSelectedCategory(parts[1])`.
2. Fix the reverse effect to preserve the category segment in `targetPath` (e.g. `/shop/${selectedCategory}` when `selectedCategory !== 'all'`) instead of collapsing to `/shop`.
3. Do not initialize `CollectionPage` state from the mock `PRODUCTS` array in production — gate it behind a dev-only flag or remove entirely once Shopify is the sole source of truth (see Finding 3).

**Falsifiable**
Load `/shop/bracelets` in a browser with JS enabled, wait for hydration, and inspect `window.location.pathname` and the rendered product grid. If the URL stays `/shop/bracelets` and only bracelet SKUs render, this finding is resolved.

---

## Finding 3 — HIGH: Unused 19-product mock catalog with 41 stock Unsplash images creates flash-of-fake-content risk

**Evidence**
- `src/data/products.ts` defines 19 products (`square-form-necklace`, `lucid-studs`, `solid-wave-brooch`, etc.) with prices, ratings, and review counts that do not correspond to any real inventory.
- All 41 image URLs referenced in this file resolve to `images.unsplash.com` (`grep -c "unsplash.com" src/data/products.ts` = 41; zero self-hosted or Shopify-hosted images in this file).
- `src/context/ShopifyContext.tsx:6,35` imports this array as `FALLBACK_PRODUCTS` and sets it as initial React state before the Shopify fetch resolves; `src/pages/CollectionPage.tsx` and `src/pages/ProductDetailPage.tsx` both default their `catalogProducts`/`products` props to this same array.
- Because `scripts/prerender.ts` never touches `products.ts`, none of this reaches the static/crawlable HTML — the risk is confined to the client-rendered flash between page load and Shopify data arriving, and to any crawler variant that executes JS but samples the DOM before the async fetch resolves (this is plausible: Googlebot's rendering queue can snapshot at various points, and third-party bots/AI crawlers frequently do not wait for async fetches at all).

**Commerce consequence**
If a rendering crawler samples the page during the fallback window, it indexes fictitious products (wrong prices, stock photography, invented review counts) attributed to the Avirena brand — a data-integrity risk for both SEO and any AI/LLM answer engine that snapshots the page.

**Fix**
Remove `products.ts` from all production code paths once the Shopify catalog is the single source of truth, or gate its use strictly behind `import.meta.env.DEV`. At minimum, replace the Unsplash placeholders with real product photography (or an explicit loading skeleton with no fabricated product data) so nothing resembling a real SKU can ever paint before live data arrives.

**Falsifiable**
Throttle network in devtools, load `/shop`, and screenshot the DOM within the first 1-2 seconds. If mock Unsplash-image products with prices/ratings are visible, the finding stands; if a neutral loading state renders instead, it's resolved.

---

## Finding 4 — HIGH: Category pages prerender with zero product links (thin content, orphaned products)

**Evidence**
- Raw (pre-JS) HTML for every `/shop/:category` route, generated by `scripts/prerender.ts` (~line 260-280), is a two-line stub. Directly fetched for `/shop/rings`:
  ```html
  <div id="root">
    <main class="category-page">
      <h1>Rings Collection</h1>
      <p>Ergonomic statement bands, wave rings, and baroque pearl solitaire rings.</p>
    </main>
  </div>
  ```
  No product cards, no `<a href="/product/...">` links, no images — identical stub pattern confirmed for `/faq` (interactive Ring Size Finder is entirely absent from static HTML; only appears after client JS runs).
- The `/shop` (all-jewelry) route's static HTML does include product cards built from live Shopify data (`productCardsHtml` in `scripts/prerender.ts`), but the 5 individual category routes do not reuse this — they were built with a static description string only.
- Consequence: the only path a non-JS-executing crawler has to discover any `/product/*` URL is the sitemap itself; there is no on-page internal link from a category page to a product page in the raw HTML at all.

**Commerce consequence**
Thin/near-duplicate content signals across 5 indexed URLs (see Finding 2) plus zero crawlable internal links to product pages meaningfully weakens PageRank flow to the 3 product pages that do have inventory, and gives Google grounds to treat the category pages as low-value crawl targets.

**Fix**
Extend the category-route generation in `scripts/prerender.ts` to filter `shopifyProducts` by category/`productType` and render the same `productCardsHtml` markup used for `/shop`, with real `<a href="/product/:handle">` links, into each category stub.

**Falsifiable**
Fetch `/shop/earrings` with a plain HTTP client (no JS execution) and count `<a href="/product/`ent occurrences in the response body. Currently 0; fix is verified when it matches the live earring count in Shopify.

---

## Finding 5 — HIGH: Keyword-stuffed, 101-character product titles will truncate in every SERP surface

**Evidence**
- Live product page `<title>` (raw HTML, `/product/geometric-gold-tone-statement-earrings-for-women-modern-square-earrings`):
  `"Geometric Gold-Tone Statement Earrings for Women | Modern Square Earrings | AVIRENA Dailywear Jewelry"` — measured **101 characters**.
- The identical 101-character string is reused verbatim as: the `<h1>`, the breadcrumb leaf node, and the `alt` text on every one of the 6 gallery images (`grep` on the raw HTML shows the same `alt="Geometric Gold-Tone Statement Earrings for Women | Modern Square Earrings"` repeated 6 times) — image alt text carries zero differentiating information (no "front view", "detail", "worn", etc.).
- Google typically renders ~580px of title in desktop SERPs (roughly 55-65 characters depending on character width) before truncating with an ellipsis or rewriting the title entirely from on-page content.

**Commerce consequence**
At this length Google will very likely algorithmically rewrite the SERP title rather than display the merchant-authored one, meaning none of the keyword stuffing has the intended effect, brand name (`AVIRENA`) is the single most likely truncated element, and click-through-rate signal is being left to Google's discretion rather than being controlled by the merchant.

**Fix**
Shorten titles to ≤ 60 characters, front-load the distinguishing product attribute, and move brand to the end only if space allows, e.g. `"Geometric Square Statement Earrings | AVIRENA"`. Differentiate image alt text per image (angle/context) instead of repeating the full title string.

**Falsifiable**
Character-count the rendered `<title>` and each `<img alt>` for all 3 live product pages; pass when title ≤ 60 chars and no two alt attributes on the same page are identical.

---

## Finding 6 — MEDIUM: Duplicate/conflicting canonical tags on every prerendered page

**Evidence**
- Base template `index.html:24` bakes in `<link rel="canonical" href="https://avirenajewels.com" />`.
- `scripts/prerender.ts`'s `renderPageHtml()` injects a second canonical tag via string concatenation before `</head>` (metaTags block) without removing the first. Confirmed by direct fetch: raw HTML for `/shop/rings` contains **two** `<link rel="canonical">` tags — one pointing to `https://avirenajewels.com`, one to `https://avirenajewels.com/shop/rings`. Same pattern reproduced on `/cart` (both canonicals present, page returns 200 with `robots: index, follow`).
- Client-side, `src/components/SeoMeta.tsx` (~line 73-79) further rewrites the canonical post-hydration, and for product pages it targets `https://avirenajewels.com/products/{id}` (**plural** "products") while `scripts/prerender.ts` and the sitemap both use `https://avirenajewels.com/product/{id}` (**singular**) — a self-contradictory canonical target between the static and client-injected values.

**Commerce consequence**
Multiple/conflicting canonical signals on the same document are explicitly called out by Google as unreliable; in practice Google picks one signal (often the first, or its own inferred URL) and effects can be inconsistent, diluting consolidation of ranking signals precisely on the pages meant to carry commercial intent.

**Fix**
Remove the static canonical from `index.html`'s `<head>` (or make prerender.ts replace it via regex the same way it replaces `<title>`, rather than appending a second tag). Align `SeoMeta.tsx` to the singular `/product/{id}` path used everywhere else.

**Falsifiable**
`grep -c 'rel="canonical"'` on any prerendered `dist/**/index.html` should return 1, not 2.

---

## Finding 7 — MEDIUM: Product images are uncompressed PNGs on Shopify CDN, no WebP/AVIF

**Evidence**
- All product gallery images for the 3 live products are `.png` (raw HTML: `grep -oE '\.png|\.webp|\.jpg'` on the product page response → 40 `.png` matches, 0 `.webp`, 0 `.jpg`).
- Filenames indicate AI-generated source assets uploaded directly to Shopify Files (`ChatGPTImageSep3_2026_03_18_11PM.png`, etc.) rather than a processed/optimized image pipeline.
- Images are served from `cdn.shopify.com` (confirmed headless Shopify backend, consistent with the `preconnect` hint in `index.html` and the Storefront API calls in `scripts/prerender.ts`).

**Commerce consequence**
PNG at full resolution for photographic/rendered product imagery is typically 2-5x larger than an equivalent WebP/AVIF, directly hurting LCP on product pages — a ranking factor and, more directly, a conversion-rate factor for mobile shoppers on Indian mobile networks.

**Fix**
Use Shopify's built-in image CDN transform parameters (e.g. `?width=1200&format=webp`) when generating `<img>` `src` values in `scripts/prerender.ts` and client components, rather than passing through the raw uploaded file URL.

**Falsifiable**
Request the `Content-Type` header of any product image URL currently in the sitemap; pass when `image/webp` or `image/avif` is returned instead of `image/png`.

---

## Finding 8 — MEDIUM: Google Merchant Center / free listings readiness is capped at 3 SKUs, and structured data claims don't match brand facts

**Evidence**
- Product schema emitted by `scripts/prerender.ts` (Offer, priceCurrency, availability, hasMerchantReturnPolicy, brand, sku, images) is structurally reasonable for the 3 real products — commerce eligibility mechanics are not the blocker (a separate schema-focused audit is covering syntax depth).
- The blocker is inventory breadth (Finding 1): Merchant Center free listings and Shopping ads both operate on a per-product feed — with only 3 earring SKUs, there is no feed presence possible for necklaces/rings/bracelets/brooches regardless of how well schema is authored.
- Separately, `src/components/SeoMeta.tsx` injects client-side Product/Organization schema and FAQ copy that **contradicts the brand's actual materials**: "18k Gold Vermeil", "925 sterling silver", "titanium-reinforced earring posts", "Jaipur and Vicenza ateliers", "100% recycled precious metals" (SeoMeta.tsx FAQ block, ~lines 245-275) — versus the brand's real positioning of brass with anti-tarnish e-coating and cultured baroque pearls, which is what `scripts/prerender.ts`'s server-rendered Organization schema correctly states ("durable brass, anti-tarnish protective coatings, and natural cultured pearls"). Two structured-data systems on the same site assert factually different material composition for the same brand.

**Commerce consequence**
If Google or any downstream shopping surface ingests the client-injected vermeil/sterling-silver claims (via rendered DOM sampling) instead of the server-rendered brass claims, it creates a materially false product representation — a Merchant Center policy risk (misrepresentation) independent of the schema-syntax review being done elsewhere.

**Fix**
Delete the contradictory FAQ/material copy from `src/components/SeoMeta.tsx` entirely; treat `scripts/prerender.ts`'s server-rendered schema as the single source of truth and stop double-injecting schema client-side.

**Falsifiable**
Diff the `material`/FAQ text in the server-rendered JSON-LD (`view-source` on any page) against the JSON-LD present in the live DOM after hydration (devtools Elements panel). Pass when they are identical or the client-side injection is removed.

---

## Finding 9 — MEDIUM: No commercial-intent content pages despite having the raw material for them

**Evidence**
- `src/components/RingSizerModal.tsx` exists and `src/pages/FaqPage.tsx` contains a working "Interactive Ring Size Finder" (mm-to-size slider, ~lines 171-198), but per Finding 4 this entire page prerenders to a 2-line stub with no ring-sizing content — the tool is invisible to any non-JS-executing crawler and has no dedicated indexable URL of its own (it's a modal/section, not a page).
- No dedicated jewelry-care / anti-tarnish-care guide page exists as a standalone URL — care content is confined to short accordion copy inside `ProductDetailPage.tsx` (~lines 429-445) and a FAQ answer, both client-rendered only.
- No dedicated materials/education page (explaining brass + e-coating + cultured baroque pearls as a category, independent of any single product) exists.
- No gifting/occasion collection pages exist in the sitemap or routing.

**Commerce consequence**
Ring sizing, jewelry care, and materials education are classic high-intent, top-of-funnel queries for a jewelry brand and are typically strong link-acquisition and topical-authority assets — currently none of this is capturable because the only page that touches these topics (`/faq`) is functionally empty to crawlers.

**Fix**
Once category filtering (Finding 2) and category inventory (Finding 1) are fixed, prioritize giving `/faq`'s ring-sizing tool, a `/care` (anti-tarnish care) guide, and a `/materials` guide each real prerendered, crawlable content — not just client-rendered widgets.

**Falsifiable**
Fetch `/faq` without JS execution; pass when the ring-sizing content and conversion table appear in the raw response body.

---

## Summary table

| # | Finding | Severity | Category |
|---|---|---|---|
| 1 | Real catalog = 3 SKUs (earrings only) vs 5 marketed categories | Critical | Catalog/inventory |
| 2 | Category URLs don't filter; client-side URL collapse to `/shop` | Critical | Routing/duplicate content |
| 3 | Unused 19-product mock catalog (41 Unsplash images) can flash on load | High | Data integrity |
| 4 | Category pages prerender with zero product links | High | Internal linking/thin content |
| 5 | 101-character keyword-stuffed titles, non-differentiated alt text | High | On-page SEO |
| 6 | Duplicate/conflicting canonical tags; `/product/` vs `/products/` mismatch | Medium | Technical SEO |
| 7 | Uncompressed PNG product images, no WebP/AVIF | Medium | Performance/images |
| 8 | Merchant Center capped at 3 SKUs; conflicting material claims in schema | Medium | Structured data/commerce risk |
| 9 | No indexable ring-sizing, care, or materials pages | Medium | Content gap |

Note: sitemap `lastmod` dates are uniform across all URLs (single build-time stamp, `scripts/prerender.ts:222`) — flagged only in passing here as it is covered in the dedicated sitemap/technical-SEO audit.

## Files referenced
- `d:/ThePieCraft Marketing/Web Development/avirena-jewels/scripts/prerender.ts`
- `d:/ThePieCraft Marketing/Web Development/avirena-jewels/src/App.tsx`
- `d:/ThePieCraft Marketing/Web Development/avirena-jewels/src/pages/CollectionPage.tsx`
- `d:/ThePieCraft Marketing/Web Development/avirena-jewels/src/pages/ProductDetailPage.tsx`
- `d:/ThePieCraft Marketing/Web Development/avirena-jewels/src/components/ProductCard.tsx`
- `d:/ThePieCraft Marketing/Web Development/avirena-jewels/src/components/SeoMeta.tsx`
- `d:/ThePieCraft Marketing/Web Development/avirena-jewels/src/context/ShopifyContext.tsx`
- `d:/ThePieCraft Marketing/Web Development/avirena-jewels/src/data/products.ts`
- `d:/ThePieCraft Marketing/Web Development/avirena-jewels/src/pages/FaqPage.tsx`
- `d:/ThePieCraft Marketing/Web Development/avirena-jewels/src/components/RingSizerModal.tsx`
- `d:/ThePieCraft Marketing/Web Development/avirena-jewels/public/sitemap.xml`
- `d:/ThePieCraft Marketing/Web Development/avirena-jewels/public/robots.txt`
- `d:/ThePieCraft Marketing/Web Development/avirena-jewels/index.html`
- `d:/ThePieCraft Marketing/Web Development/avirena-jewels/vercel.json`
