# Technical SEO Audit — avirenajewels.com

Live audit date: 2026-09-08
Scope: crawlability, indexability, security, URL structure, mobile, Core Web Vitals (lab/static only), structured data, JS rendering, IndexNow.

**No Google API credentials are configured in this environment.** CrUX and PageSpeed Insights field data are unavailable. All Core Web Vitals findings below are lab/static-analysis (HTML/resource inspection) only — no LCP/INP/CLS milliseconds are reported or invented.

---

## 1. Checkout subdomain de-indexing will NOT work as built

**Severity: Critical**

**Evidence:**
```
GET https://checkout.avirenajewels.com/robots.txt -> 200
User-agent: *
Disallow: /collections/
Disallow: /products/
Disallow: /policies/
Disallow: /pages/
Disallow: /blogs/
Disallow: /cart
Disallow: /account
Disallow: /collections
Disallow: /products

GET https://checkout.avirenajewels.com/products/avirena-square-studs-gold-tone-brass-earrings -> 200
  <meta name="robots" content="noindex, nofollow">   (confirmed present)

GET https://checkout.avirenajewels.com/  -> 200
  <meta name="robots" content="noindex, nofollow">   (confirmed present, root is NOT disallowed)

Additionally confirmed by coordinator on /collections/earrings and /policies/refund-policy: same noindex meta present, same paths blocked by robots.txt Disallow.
```

This is the classic self-defeating combination. `robots.txt Disallow` blocks **crawling**; `<meta name="robots" content="noindex">` only works if Googlebot is able to **fetch** the page to read the tag. For `/products/*`, `/collections/*`, `/policies/*`, `/pages/*`, `/blogs/*` — Googlebot is blocked from fetching, so it can never see the noindex directive. Any of these URLs previously indexed will persist in Google's index indefinitely; typical symptom in Search Console is "Indexed, though blocked by robots.txt." Only the root `/` is actually workable today, since root is not in the Disallow list and the noindex tag is present and crawlable there.

**Ownership note:** the noindex meta originates from this repo (`scripts/update-theme-redirect.ts:23`, injected into Shopify's `layout/theme.liquid` head via the Admin API). The `checkout.avirenajewels.com/robots.txt` content is **not** in this repo — it is served by Shopify itself, normally controlled via a `robots.txt.liquid` template override in the Shopify theme editor (Online Store > Themes > Edit code). Anyone fixing this needs Shopify theme-editor access, not just repo access.

**Fix — apply in this order:**
1. In the Shopify theme's `robots.txt.liquid` (or via Shopify's robots.txt editor if using the default), remove the `Disallow` lines for `/products/`, `/collections/`, `/policies/`, `/pages/`, `/blogs/` (keep `/cart` and `/account` disallowed — those are session/PII-bearing paths that don't need indexing consideration since they were never indexable content in the first place). Leave the `noindex, nofollow` meta tag in place exactly as-is.
2. Wait for Search Console to show the checkout-subdomain URLs drop out of the index (typically a few weeks after Googlebot successfully recrawls and processes the noindex).
3. Only after confirmed removal from the index, optionally restore the Disallow rules for crawl-budget hygiene — restoring them before removal is confirmed will re-trigger the same block.

**Falsifiability:** `curl -s https://checkout.avirenajewels.com/robots.txt` should show `/products/`, `/collections/`, `/policies/`, `/pages/`, `/blogs/` no longer disallowed, while `curl -s https://checkout.avirenajewels.com/products/<any-handle> | grep -i robots` continues to show `noindex, nofollow`. Confirm resolution long-term via Search Console > Pages report showing checkout.avirenajewels.com URLs under "Excluded — noindex" rather than "Indexed, though blocked by robots.txt."

---

## 2. Redirect chain repaired locally but NOT deployed to production

**Severity: Critical**

**Evidence — live production right now (git-committed HEAD, not the local working copy):**
```
GET /product/geometric-gold-tone-statement-earrings-for-women-modern-square-earrings
  -> 308 Location: /product/nadir-square-studs-gold-tone-brass-earrings
GET /product/nadir-square-studs-gold-tone-brass-earrings
  -> 404 Not Found
```
Same broken pattern confirmed for the other two originally-shipped rules:
- `/product/gold-tone-drop-earrings-for-women-minimalist-long-dangle-earrings` → 308 → `/product/lume-drop-earrings-gold-tone-brass` → **404**
- `/product/gold-tone-statement-drop-earrings-for-women-geometric-dangle-earrings` → 308 → `/product/forma-statement-drops-geometric-brass-earrings` → **404**

The 9 new redirect rules mapping interim handles (`nadir-`, `lume-`, `forma-`, `amara-`, `volute-`, `solene-` x2, `petra-`, `foglia-`) directly to the current `avirena-*` handles exist **only in the uncommitted local `vercel.json`** (confirmed via `git diff vercel.json` — file shows as modified, not staged, not committed, not deployed). Tested live: e.g. `/product/nadir-square-studs-gold-tone-brass-earrings` currently 404s in production instead of 301-redirecting to `/product/avirena-square-studs-gold-tone-brass-earrings`.

Confirmed the destination handles themselves are healthy: all 9 current `avirena-*` product URLs return live 200 (avirena-square-studs-gold-tone-brass-earrings, avirena-drop-earrings-gold-tone-brass, avirena-statement-drops-geometric-brass-earrings, avirena-heart-drops-silver-tone-earrings, avirena-spiral-earrings-silver-tone, avirena-crystal-hoops-gold-tone-earrings, avirena-crystal-hoops-silver-tone-earrings, avirena-pebble-studs-gold-tone-earrings, avirena-leaf-studs-gold-tone-earrings).

Reviewed the local (undeployed) `vercel.json`: all 12 redirect entries point directly at a final live `avirena-*` destination — no redirect-to-redirect chains remain in the fixed version. This is correct as written; it just isn't live yet.

**Fix:** commit and deploy the current `vercel.json` changes. This is a deploy-blocking issue — any inbound link, bookmark, or search-engine-cached URL using the pre-rename handles is currently a dead end (308 into a 404, or a bare 404) in production.

**Falsifiability:** post-deploy, `curl -sI https://avirenajewels.com/product/nadir-square-studs-gold-tone-brass-earrings` should return a single `301` (permanent redirects in vercel.json render as 308 for POST-safe semantics under Vercel, confirm actual code) directly to `/product/avirena-square-studs-gold-tone-brass-earrings` with a `200` on one more hop, and no entry in the redirect map should require more than one hop to reach a `200`.

---

## 3. IndexNow protocol not implemented

**Severity: Low**

**Evidence:**
- No key file present: `curl -sI https://avirenajewels.com/indexnow.txt` → 404 (and no `*.txt` key file matching an IndexNow API key pattern exists in `dist/` or `public/`).
- No submission logic in the codebase: `grep -ril "indexnow"` across `.ts/.tsx/.js` (excluding `node_modules`, `dist`, and the audit folder itself) returns zero matches.
- robots.txt does not reference IndexNow (only a standard `Sitemap:` directive).

**Fix:** Generate an IndexNow key, publish `https://avirenajewels.com/<key>.txt` containing the key, and add a post-deploy hook (or Vercel build step) that POSTs changed URLs to `https://api.indexnow.org/indexnow` (fans out to Bing, Yandex, Naver automatically). Given the site is a small 26-URL catalog with frequent handle changes, this would meaningfully speed up Bing/Yandex re-crawl of the recent `avirena-*` rename versus waiting on organic re-crawl.

**Falsifiability:** `curl -sI https://avirenajewels.com/<key>.txt` returns 200 with the key as body; a manual POST to the IndexNow API returns 200/202.

---

## 4. Sitemap — valid, but lastmod is not trustworthy

**Severity: Medium**

**Evidence:**
- `claude-seo sitemap_discovery.py` confirms `https://avirenajewels.com/sitemap.xml` is declared in robots.txt, returns HTTP 200, and validates as a well-formed `urlset` (`"valid": true`). No `sitemap_index.xml`/`sitemap-index.xml`/`wp-sitemap.xml` fallbacks exist (all 404, expected — single flat sitemap is appropriate at this URL count).
- `grep -c "<url>" dist/sitemap.xml` = 26, matching the verified URL count in scope.
- Every one of the 26 `<lastmod>` values is identical: `2026-09-08` (today / build date) — `grep -o "<lastmod>[^<]*</lastmod>" dist/sitemap.xml | sort -u` returns exactly one distinct value across all 26 entries. This means lastmod is stamped at build/deploy time uniformly, not derived from actual per-page content-change dates (e.g. git history or CMS/Shopify updated_at). A sitemap where every URL always shows "changed today" on every deploy is a signal search engines are known to discount over time — it stops functioning as a genuine recrawl-priority hint.

**Fix:** Derive `lastmod` per-URL from the actual last content change (Shopify product `updated_at` for product/category pages, git commit date or CMS field for static pages) rather than stamping the sitemap generation timestamp on every entry uniformly.

**Falsifiability:** re-run the sitemap generator without touching content and confirm `lastmod` values do NOT all shift to the new build date; confirm they only change for URLs whose underlying content actually changed.

---

## 5. Canonical tags — correct and unique where sampled

**Severity: Pass**

**Evidence:** Sampled home, `/shop`, `/shop/earrings`, `/shop/necklaces`, `/shop/rings`, `/shop/bracelets`, `/shop/brooches`, and one product page. Every page carries exactly one self-referencing `<link rel="canonical">` matching its own URL (`grep -c 'rel="canonical"'` = 1 on homepage). No duplicates, no cross-page canonicalization observed in the sample.

**Not verified:** the remaining ~19 URLs (guide articles, other 8 products, /about, /contact, /faq, /policies, /journal, /collections) were not individually pulled — spot-check recommended before calling this fully passed site-wide.

---

## 6. Robots meta per route — empty categories correctly noindex,follow

**Severity: Pass**

**Evidence:**
```
/shop/earrings   -> <meta name="robots" content="index, follow, ...">      (has stock)
/shop/necklaces  -> <meta name="robots" content="noindex, follow">          (empty)
/shop/rings      -> <meta name="robots" content="noindex, follow">          (empty)
/shop/bracelets  -> <meta name="robots" content="noindex, follow">          (empty)
/shop/brooches   -> <meta name="robots" content="noindex, follow">          (empty)
```
This is exactly the correct pattern: empty category pages are noindex (don't waste index slots on empty inventory pages) but follow (link equity still flows through to indexed pages via any nav/breadcrumb links). Home, `/shop`, and `/shop/earrings` are correctly `index, follow`.

---

## 7. Protocol / host / trailing-slash consolidation — all correct

**Severity: Pass**

**Evidence:**
```
http://avirenajewels.com/          -> 308 -> https://avirenajewels.com/
https://www.avirenajewels.com/     -> 301 -> https://avirenajewels.com/
https://avirenajewels.com/shop/    -> 308 -> /shop      (trailing slash stripped)
https://avirenajewels.com/about/   -> 308 -> /about
```
Single-hop redirects to the canonical https, non-www, no-trailing-slash form in all four tested cases. `vercel.json`'s `"trailingSlash": false` and `"cleanUrls": true` are functioning as configured in production.

---

## 8. Favicon / icon suite (commit c6b8856) — all declared URLs resolve

**Severity: Pass**

**Evidence:** Every icon/manifest link declared in `<head>` was fetched live and returns 200:
```
favicon.ico            -> 200
favicon-48x48.png      -> 200
favicon-96x96.png      -> 200
favicon-192x192.png    -> 200
favicon-512x512.png    -> 200
apple-touch-icon.png   -> 200
site.webmanifest       -> 200
```
`site.webmanifest` JSON is valid and references `/favicon-192x192.png` and `/favicon-512x512.png`, both confirmed live. No 404s in the favicon suite.

---

## 9. Security headers — present and unchanged; CSP compatible with observed resources

**Severity: Pass**

**Evidence:** Live response headers on `https://avirenajewels.com/` confirmed present: `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`, `Cross-Origin-Opener-Policy: same-origin`.

CSP directive review against actually-loaded resources (homepage + product page HTML):
- `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com` — matches the loaded Google Fonts stylesheet link.
- `font-src 'self' https://fonts.gstatic.com data:` — matches font file origin.
- `img-src 'self' data: blob: https://cdn.shopify.com https://images.unsplash.com https://imagedelivery.net` — matches observed `<img>` sources (`cdn.shopify.com` confirmed on product page; `images.unsplash.com` referenced via preconnect).
- `script-src 'self'` — only same-origin `<script type="module" src="/assets/...">` and a same-origin `<script type="application/ld+json">` data block observed; no inline executable `<script>` blocks or third-party script tags found in fetched HTML that would be blocked. (Shopify checkout/cart flows happen via `form-action`/`frame-src` allowances to `*.myshopify.com` and `checkout.shopify.com`, both present.)
- No CSP violations identifiable from static HTML inspection. **Caveat:** this is static-source review, not a live browser console capture — cannot rule out a runtime-injected script or a Shopify Buy SDK call that only fires post-interaction (e.g. add-to-cart) without executing a real browser session.

---

## 10. JavaScript rendering / prerendering — confirmed working

**Severity: Pass**

**Evidence:** `render_page.py --mode auto` returned `"is_spa": false` for the homepage, meaning the auto-detector found sufficient server-rendered content and did not need to fall back to a Playwright render — confirming the prerender pipeline (`scripts/prerender.ts`) is producing real content-bearing HTML rather than an empty SPA shell. Directly confirmed in the raw fetched HTML: product names, brand name, and full text content are present in the initial response (`grep -c "AVIRENA"` = 13 occurrences pre-hydration), even though `<div id="root">` is empty in the literal DOM node (React will hydrate into it client-side — the prerendered markup sits as siblings/is injected by the static generator, structurally normal for this prerender pattern and not a rendering risk since content is present in the initial payload either way).

Product-page JSON-LD (`application/ld+json`) is also present in the raw, unrendered HTML — Organization, OnlineStore, WebSite, Product, and BreadcrumbList schema all confirmed server-side without requiring JS execution.

---

## 11. Structured data — no fabricated review data found in sampled products

**Severity: Info / Positive**

**Evidence:** Checked `aggregateRating` presence across 3 sampled product pages (avirena-square-studs-gold-tone-brass-earrings, avirena-drop-earrings-gold-tone-brass, avirena-heart-drops-silver-tone-earrings): zero occurrences of `aggregateRating` in any. This appears inconsistent with the memory note flagging a hardcoded 4.9/38 `aggregateRating` on every product page — either that was already fixed in a prior commit, or it doesn't apply to the current product set. **Flagging as unverified-fixed**: only 3 of 9 products were sampled; recommend a full 9-product sweep to confirm no aggregateRating remains anywhere before closing that item out.

Other schema observed on the sampled product page is well-formed and accurate to context: `OnlineStore` (not `JewelryStore` — correct, no physical storefront, consistent with prior verified context), real `telephone`/`email`/address fields, `Product` offer with real price/currency/availability/return-policy fields, and a correct `BreadcrumbList`. No fabricated data identified in what was reviewed.

**Not verified:** the other 6 of 9 products, and the guide-article pages' Article/FAQ schema (if any), were not checked in this pass.

---

## 12. Mobile-friendliness — passes static checks

**Severity: Pass**

**Evidence:**
- `<meta name="viewport" content="width=device-width, initial-scale=1.0" />` present.
- Product images carry explicit `width`/`height` attributes (e.g. `width="1000"`, `width="600" height="750"`) plus `loading="lazy"` on below-fold images — reduces CLS risk from image loading and defers offscreen image fetches.
- No fixed-width layout containers or viewport-breaking meta values found in the sampled HTML.

**Not verified:** actual touch-target sizing (min 48x48px per WCAG/Google guidance) and tap-spacing require rendered-layout/visual inspection, not source inspection — out of scope for a static HTML check. Defer to the visual/UX audit pass if one exists (`avirenajewels.com-audit/findings/visual.md`).

---

## 13. Core Web Vitals — lab/static findings only (no field data available)

**Severity: Info — explicitly no CrUX/PSI data**

**No Google API credentials are configured in this environment. CrUX and PageSpeed Insights field data are unavailable. The items below are static/lab observations from source inspection only — no LCP/INP/CLS millisecond or score values are reported, measured, or invented.**

Static risk factors observed:
- **Render-blocking external stylesheet:** the Google Fonts CSS (`fonts.googleapis.com/css2?family=Cormorant+Garamond:...;family=Plus+Jakarta+Sans:...`) is loaded as a blocking `<link rel="stylesheet">` requesting 2 font families across roughly 11 weight/style combinations. This is a third-party round-trip in the critical rendering path and is a plausible LCP/text-render-delay contributor, though actual impact cannot be quantified without field/lab trace data. `display=swap` is correctly set, which mitigates invisible-text (FOIT) risk but does not eliminate the request itself from the critical path.
- **CLS mitigation present:** explicit image `width`/`height` attributes and `loading="lazy"` on below-fold images reduce layout-shift risk from image loading — a positive signal, not a defect.
- **INP:** cannot be assessed from static HTML; requires real interaction tracing (a lab tool run, e.g. Lighthouse, or field CrUX data) which is outside this environment's available tooling.

**Recommendation:** if reducing the font-loading critical path is a priority, consider self-hosting the two font families (already permitted by `font-src 'self' ... data:` in CSP) or subsetting to only the weights actually used, to remove the third-party render-blocking round trip. Beyond that, no further CWV claims can be made without either Search Console/CrUX API access or a live Lighthouse run.

---

## Summary

| # | Finding | Severity | Status |
|---|---|---|---|
| 1 | Checkout subdomain robots.txt blocks crawling of pages carrying noindex — noindex can never be seen by Google | Critical | Confirmed live |
| 2 | Redirect-chain fix exists only in uncommitted `vercel.json`; production still 308s into dead 404s | Critical | Confirmed live, not deployed |
| 3 | IndexNow not implemented | Low | Confirmed absent |
| 4 | Sitemap valid but lastmod uniformly stamped at build time, not real content-change dates | Medium | Confirmed |
| 5 | Canonical tags unique/self-referencing (sampled) | Pass | Confirmed (partial sample) |
| 6 | Empty category pages correctly noindex,follow | Pass | Confirmed |
| 7 | http→https, www→non-www, trailing-slash consolidation | Pass | Confirmed |
| 8 | Favicon/manifest suite all resolve 200 | Pass | Confirmed |
| 9 | Security headers present; CSP compatible with loaded resources | Pass | Confirmed (static) |
| 10 | Prerendering confirmed working (not an empty SPA shell) | Pass | Confirmed |
| 11 | No fabricated aggregateRating found in sampled products | Info | Partial sample (3/9) |
| 12 | Mobile viewport/image CLS mitigation present | Pass | Confirmed (static); touch targets unverified |
| 13 | Core Web Vitals — no field data available; static risk noted in font loading | Info | No CrUX/PSI credentials configured |

**Highest priority action:** deploy the corrected `vercel.json` (item 2) and fix the checkout subdomain robots.txt (item 1) — in that order of urgency, since item 1 requires Shopify theme-editor access outside this repo and should be scheduled immediately given it is actively preventing de-indexing right now.
