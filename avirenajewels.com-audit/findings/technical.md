# Technical SEO Audit — avirenajewels.com
Live audit date: 2026-09-04

Scope note: This picks up from established context (prerendering confirmed working, 16 routes, all 200s). This report focuses on the 10 investigation items assigned. No Google API credentials are configured in this environment, so **CrUX/field Core Web Vitals data is unavailable** — all CWV findings below are lab/static-analysis only (resource inspection, not measured LCP/INP/CLS milliseconds from a real browser trace).

---

## 1. Soft 404 — Blast Radius & Fix

**Severity: Critical**

**Evidence:**
```
GET https://avirenajewels.com/nonexistent-page-test-404 -> HTTP/1.1 200 OK
Content-Length: 10416   ETag: "52e43cfd6eb8766b045192d9d4252ee1"

GET https://avirenajewels.com/                          -> HTTP/1.1 200 OK
Content-Length: 10416   ETag: "52e43cfd6eb8766b045192d9d4252ee1"

GET https://avirenajewels.com/indexnow.txt               -> HTTP/1.1 200 OK
Content-Length: 10416   ETag: "52e43cfd6eb8766b045192d9d4252ee1"
```
Identical ETag/Content-Length/body confirms every unmatched path — including files like `/indexnow.txt` — silently serves the homepage bundle, not a 404.

Root cause: `vercel.json`
```json
"rewrites": [
  { "source": "/(.*)", "destination": "/index.html" }
]
```
This is a blanket rewrite with no exclusions and no `headers`/status override, and there is no server-side 404 route component in the SPA (React Router presumably has a catch-all `*` that would need to render a "not found" UI client-side, but since the page is served as **200** at the edge, Google/Bing will index it as content, not treat it as an error).

**Blast radius:**
- Any typo'd URL, old/removed product handle (Shopify handles rotate — e.g. discontinued products), broken internal link, or malicious scraper-injected URL returns 200 with the exact homepage title/meta/canonical/JSON-LD.
- Google Search Console will report these as "Indexed, though blocked by..." or worse, index them as duplicate homepages — direct duplicate-content inflation, diluting homepage relevance signals.
- Because the homepage's `<title>`, meta description, and canonical (`https://avirenajewels.com/`) are identical on every soft-404 URL, Googlebot may consolidate ranking signals onto whichever URL it discovers first, sometimes swapping the canonical homepage out of the index for a garbage URL (documented Google behavior with soft 404s at scale).
- `/indexnow.txt`, `/.well-known/*`, `/wp-admin` probes, `/favicon.ico` variants, and any prerender path that fails to generate (e.g., a Shopify product removed after last build but still linked somewhere) will all silently succeed instead of failing loud — this hides broken links from log-based monitoring since nothing 4xx/5xxs.
- Any crawler budget spent on these fake-200 URLs is wasted; at scale (thousands of guessed/malformed URLs from bots) this can measurably dilute crawl budget on a young/small site with only 16 real routes.

**Fix (exact vercel.json pattern for Vite SPA + prerendered routes on Vercel):**

Since this site prerenders known routes to static `index.html` files under `dist/<route>/index.html`, Vercel's filesystem routing already resolves those paths before falling through to the rewrite (`cleanUrls`/static handling happens first). The catch-all only fires for paths with **no matching static file** — which is exactly the case that should 404. Replace the blanket SPA rewrite with an explicit `trailingSlash`-safe config that lets Vercel's static 404 handling apply, and only rewrite a curated set of client-side-only paths (if any exist beyond the 16 prerendered routes):

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "cleanUrls": true,
  "trailingSlash": false,
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```
Removing the `rewrites` block entirely lets Vercel serve its default static 404 for any path without a matching prerendered file (verify a `404.html` exists in `dist/` — Vercel auto-uses `dist/404.html` if present; add one, styled to match the brand, since there currently is none). If any route must remain purely client-rendered (none currently do — all 16 are prerendered), scope the rewrite to only that path, e.g. `"source": "/app/(.*)"`, never `/(.*)`.

**Falsifiability check:** After deploy, `curl -s -o /dev/null -w "%{http_code}" https://avirenajewels.com/nonexistent-page-test-404` must return `404`, and the response body must differ from the homepage (different ETag/Content-Length, ideally a real "Page Not Found" template). If it still returns `200` with `Content-Length: 10416`, the fix did not take effect.

---

## 2. Duplicate/Conflicting Meta Tags

**Severity: High**

**Evidence** — live homepage HTML contains two full meta blocks:
```
<link rel="canonical" href="https://avirenajewels.com" />        <!-- from index.html:24, static -->
...
<link rel="canonical" href="https://avirenajewels.com/" />       <!-- injected by prerender.ts, second -->
```
Confirmed duplicated on the live page: `<meta name="title">` (×2), `<meta name="description">` (×2, different text — static says "AVIRENA is a celebration of timeless sculptural elegance..." vs injected says "Explore AVIRENA Jewels. Homegrown dailywear jewelry handcrafted..."), `<meta name="keywords">` (×2, identical), full OG set (×2, different descriptions/URLs), full Twitter set (×2, different descriptions/URLs), and two `<link rel="canonical">` with **different URLs** (no trailing slash vs trailing slash).

**Which tag Google honors:** For `<title>`, the prerender script correctly uses regex replace (`html.replace(/<title>.*?<\/title>/i, ...)`, prerender.ts:151) so there's only one `<title>`. But for meta/link tags, `renderPageHtml()` (prerender.ts:147–193) never removes the static block from the Vite-built `index.html` template — it only appends a second block before `</head>` (line 182: `html.replace('</head>', metaTags + '</head>')`). Google's documented behavior for duplicate/conflicting tags: **for canonical tags specifically, when multiple conflicting `rel=canonical` are present, Google ignores all of them and falls back to its own heuristic signal (usually the URL actually crawled, or an algorithmically chosen canonical)** — meaning the site loses control over its own canonicalization on the homepage. For duplicate `<meta name="description">`, Google generally uses the **first** one encountered in source order for snippet generation, but this is not guaranteed and inconsistent across crawlers/social scrapers (Facebook's OG parser and Twitter's card parser typically take the **first** occurrence too, but LinkedIn and some others take the **last**). Net effect: unpredictable, inconsistent snippets/canonical resolution.

**Fix location:** `scripts/prerender.ts:147` in `renderPageHtml()`. Before injecting the new meta block, strip the static duplicates from the template. Concretely:
```ts
function renderPageHtml(template: string, route: RouteData): string {
  let html = template;

  html = html.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(route.title)}</title>`);

  // Strip static duplicate tags from the Vite-built template before injecting fresh ones
  html = html
    .replace(/<meta\s+name="title"[^>]*>\s*/gi, '')
    .replace(/<meta\s+name="description"[^>]*>\s*/gi, '')
    .replace(/<meta\s+name="keywords"[^>]*>\s*/gi, '')
    .replace(/<link\s+rel="canonical"[^>]*>\s*/gi, '')
    .replace(/<meta\s+property="og:[^"]*"[^>]*>\s*/gi, '')
    .replace(/<meta\s+name="twitter:[^"]*"[^>]*>\s*/gi, '');

  const metaTags = `...`; // existing block, unchanged
  html = html.replace('</head>', `${metaTags}\n  </head>`);
  ...
}
```
Also fix the trailing-slash inconsistency at the source: `index.html:24` has `href="https://avirenajewels.com"` (no slash) while `prerender.ts:235` builds `canonical: \`${SITE_URL}/\`` (with slash) for the homepage route only — every other route (`shop`, `about`, etc.) correctly omits the trailing slash. Standardize on **no trailing slash** for the root to match `SITE_URL` used everywhere else, i.e. change prerender.ts line 235 from `` `${SITE_URL}/` `` to `SITE_URL`, and update `og:url`/`twitter:url` for the homepage route accordingly (they reuse `route.canonical` so this one change fixes all three).

**Falsifiability check:** `curl -s https://avirenajewels.com/ | grep -c 'rel="canonical"'` must return `1`, and `grep -c 'name="description"'` must return `1`. Currently both return `2`.

---

## 3. Redirect Behavior

**Severity: Medium** (chain length) / **Info** (scheme/host consolidation is otherwise correct)

**Evidence (measured):**
```
http://avirenajewels.com/       -> 308 -> https://avirenajewels.com/                [1 hop, correct]
https://avirenajewels.com       -> 200 (no redirect; served directly)               [correct, no bounce]
http://www.avirenajewels.com/   -> 308 -> https://www.avirenajewels.com/
                                 -> 301 -> https://avirenajewels.com/                [2 hops]
https://www.avirenajewels.com/  -> 301 -> https://avirenajewels.com/                [1 hop, correct]
https://avirenajewels.com/shop  -> 200 (no redirect)
https://avirenajewels.com/shop/ -> 200 (no redirect; trailing slash NOT normalized/redirected — served independently, not a 404 or redirect)
```
Findings:
- Non-www is the canonical host and both `http://` and `www` variants correctly funnel to `https://avirenajewels.com` — no redirect loops, no chain exceeding 2 hops.
- The `http://www` case is a 2-hop chain (HTTP→HTTPS on www, then www→non-www). This is standard Vercel apex/www handling but costs one extra round-trip versus a direct `http://www` → `https://non-www` single hop. Low impact (rare entry point) but easy to flatten at the Vercel domain config level (add both apex and www as aliases pointing directly to production, letting Vercel's edge issue a single combined redirect).
- **Trailing-slash inconsistency**: `/shop/` returns `200` directly rather than redirecting to `/shop` (or 404ing). Given the catch-all rewrite (finding #1), `/shop/` almost certainly isn't a distinct prerendered file — it's being served by the same `/(.*)  -> /index.html` rewrite, meaning `/shop/` is actually a **second soft-404-style duplicate of the homepage or of /shop**, not a canonicalized variant. This creates a duplicate-content pair (`/shop` vs `/shop/`) with only `/shop` declared as canonical in the sitemap — Google should self-resolve this via the canonical tag, but it's an avoidable ambiguity once the rewrite is fixed per item #1.

**Fix:** Once the vercel.json catch-all is removed (item #1), verify whether `/shop/` (trailing slash) 404s cleanly — if it does not resolve to a real file, that's correct. If a business reason exists to support trailing slashes, add `"trailingSlash": false` to vercel.json (already recommended above) which makes Vercel 308-redirect any trailing-slash path to its non-trailing-slash counterpart automatically.

**Falsifiability check:** `curl -s -o /dev/null -w "%{http_code} %{size_download}" https://avirenajewels.com/shop/` should either match `/shop`'s 308 redirect behavior or 404 — not silently return a 200 with homepage-sized content.

---

## 4. Security Headers

**Severity: High** (missing headers, live site handles user-submitted forms/checkout flows)

**Evidence — full header dump from `https://avirenajewels.com/`:**
```
HTTP/1.1 200 OK
Accept-Ranges: bytes
Access-Control-Allow-Origin: *
Cache-Control: public, max-age=0, must-revalidate
Content-Disposition: inline
Content-Type: text/html; charset=utf-8
Server: Vercel
Strict-Transport-Security: max-age=63072000
X-Vercel-Cache: HIT
```
**Present:** `Strict-Transport-Security` (max-age=63072000 = 2 years — good, but missing `includeSubDomains` and `preload` directives).

**Missing (confirmed absent on every response tested — homepage, /shop, product page, 404 page):**
- `Content-Security-Policy` — no CSP at all. No mitigation against XSS/injection despite loading third-party scripts (Google Fonts) and rendering user-influenced product data from Shopify.
- `X-Content-Type-Options` — absent, so browsers may MIME-sniff responses (minor risk given `Content-Type` is already explicit, but a standard baseline header).
- `X-Frame-Options` — absent. Site can be framed by any origin (clickjacking exposure on checkout/contact forms).
- `Referrer-Policy` — absent. Defaults to browser default (`strict-origin-when-cross-origin` in modern Chrome), so risk is partially mitigated by browser defaults, but not explicitly enforced — full referrer including path may leak to third parties in older browsers or via `Link` headers.
- `Permissions-Policy` — absent. No explicit restriction on camera/microphone/geolocation/payment APIs, relevant since this is a jewelry e-commerce site that may eventually integrate payment iframes.

**Also notable:** `Access-Control-Allow-Origin: *` is set globally on HTML documents (not just static assets) — this is unusual; wildcard CORS on HTML documents themselves has no real functional benefit (CORS governs fetch/XHR access, not navigation) but signals the header was likely applied blanket without route-scoping. Not a vulnerability by itself, but worth scoping to `/assets/*` only if it was intended for asset reuse.

**Fix:** Add a `headers` block in `vercel.json` applying to all routes:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=(), payment=(self)" },
        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" },
        { "key": "Content-Security-Policy", "value": "default-src 'self'; img-src 'self' https://cdn.shopify.com data:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; connect-src 'self' https://*.myshopify.com" }
      ]
    }
  ]
}
```
CSP will need real-world tuning (the SPA bundle currently is a single `type="module"` script with no inline scripts visible in the static HTML, so `script-src 'self'` should work without `unsafe-inline`; verify no inline `<script>` blocks get injected by third-party tags before locking this down — start in `Content-Security-Policy-Report-Only` mode for one release cycle).

**Falsifiability check:** `curl -s -D - -o /dev/null https://avirenajewels.com/ | grep -i "content-security-policy\|x-frame-options\|x-content-type-options\|referrer-policy\|permissions-policy"` currently returns nothing for any of these; after the fix, all five must appear.

---

## 5. Core Web Vitals — Lab Assessment (homepage + one product page)

**Severity: Medium-High (LCP risk), Info (no field data available)**

**No CrUX/field data statement:** This environment has no Google API credentials configured (PageSpeed Insights API / CrUX API), so real-user field metrics (the data Google actually uses for the Page Experience ranking signal) could not be retrieved. Everything below is **static/lab resource inspection only** — actual measured LCP/INP/CLS timings from a browser trace were not captured (no Lighthouse run was performed in this pass; findings are inferred from response headers, resource sizes, and markup inspection, which is a legitimate but weaker signal than a real trace).

### Homepage (`https://avirenajewels.com/`)
- **LCP risk — High probability of Needs-Improvement or Poor:** The largest above-the-fold visual element is `/logo.png`, a 320,384-byte (327,297 bytes measured / ~320KB) uncompressed PNG at native 2128×739px, rendered at `w-[98vw]` (near full viewport width) with `loading="eager"` (HomePage.tsx, hero section). It has no `width`/`height` attributes in the prerendered static markup, is not preloaded (`<link rel="preload" as="image">` absent from `index.html`), and is not in a modern format (WebP/AVIF would cut this 60-80%). On a throttled mobile connection this single asset alone plausibly exceeds a 2.5s LCP budget once render-blocking CSS/fonts/JS are accounted for ahead of it.
- **CLS risk — Confirmed markup defect:** Neither the hero logo nor the prerendered product-card/product-gallery `<img>` tags carry `width`/`height` attributes (verified: `grep '<img' ` on rendered product page output shows bare `<img src=... alt=... itemprop="image" />` with no dimensions). Without dimensions or `aspect-ratio` CSS reservation, the browser cannot reserve layout space before the image downloads, causing layout shift as each image resolves — directly affects CLS score.
- **INP:** Cannot be assessed from static inspection (INP requires actual interaction timing/JS execution profiling); no adverse patterns (huge synchronous handlers, etc.) were visually identifiable from the single 747KB JS bundle without a runtime trace, so this is genuinely unknown rather than flagged.

### Product page (`/product/geometric-gold-tone-statement-earrings-for-women-modern-square-earrings`)
- **LCP risk — Medium:** LCP candidate is likely the first Shopify CDN product image (`cdn.shopify.com/.../c66d3039-...png`). Unlike the homepage logo, this is served from Shopify's CDN (which applies its own image optimization/CDN caching), reducing risk versus the self-hosted logo. However, the prerendered gallery markup shows **no `loading="lazy"` on any gallery image and no `fetchpriority="high"` on the first/LCP image**, and again no `width`/`height` attributes — same CLS exposure as the homepage.
- **CLS risk — Confirmed:** Same missing-dimensions issue on all 6 gallery `<img>` tags (verified via rendered HTML dump).

**Fix (both pages):**
1. Add explicit `width`/`height` (or Tailwind `aspect-[W/H]` classes that map to `aspect-ratio` CSS, which achieves the same layout-reservation effect) to every `<img>` — hero logo, product cards, product gallery.
2. Add `<link rel="preload" as="image" href="/logo.png" fetchpriority="high">` to `index.html` for the homepage hero, or better, replace the 320KB PNG with a WebP/AVIF derivative and an inline SVG/low-res placeholder.
3. Add `fetchpriority="high"` to the first product-gallery image and keep `loading="lazy"` only on images 2+ (currently the shop-listing cards already do this correctly per prerender.ts:305 — the product detail gallery does not).

**Falsifiability check:** Run Lighthouse (or PageSpeed Insights once reachable) against both URLs post-fix; CLS score should drop measurably once dimensions are added, and LCP element timing should improve once the hero image is preloaded/compressed. Pre-fix baseline: no Lighthouse trace was run in this audit (tooling constraint noted above) — this should be the first validation step before/after remediation to get real numbers, since this report only establishes the structural risk, not a measured score.

---

## 6. Render-Blocking Resources

**Severity: Medium**

**Evidence:**
- Google Fonts: single request to `fonts.googleapis.com/css2?...` pulling **4 font families** (Cormorant Garamond, Montserrat, Playfair Display, Plus Jakarta Sans) with a combined ~25 weight/style variants in one query string (measured CSS response: 6,388 bytes, which then triggers additional `fonts.gstatic.com` requests per unique woff2 file actually used by rendered text — the CSS file itself is small, but it is render-blocking as a `<link rel="stylesheet">` with no `media` gating and no `font-display` override in the URL, though `&display=swap` is present in the query string, which does mitigate FOIT — text won't be invisible while fonts load, but the CSSOM still blocks first paint until this stylesheet resolves).
- Main JS bundle: `/assets/index-SEE23VPG.js`, 746,997 bytes uncompressed, served with `Content-Encoding: br` (Brotli — good, actual wire size is smaller than the uncompressed figure, but 747KB uncompressed for a single bundle is large; no code-splitting evident from `index.html`, which references exactly one `type="module"` script).
- CSS bundle: `/assets/index-B4SDxzdV.css`, 71,988 bytes uncompressed, also Brotli-compressed, loaded as a blocking `<link rel="stylesheet">` (standard, unavoidable for CSS, but combined with the Google Fonts stylesheet this is 2 blocking stylesheet requests before first paint).
- Preconnects for `fonts.googleapis.com` and `fonts.gstatic.com` (crossorigin) are present in `index.html:59-60`, which is correct practice and reduces the connection-setup cost.

**Fix:**
1. Reduce the Google Fonts request to only the weights actually used in rendered CSS (audit `src/index.css` / Tailwind config for which of the 25 requested weight/style/italic combinations are referenced by class names — likely a fraction are used). Fewer variants = smaller font payload and fewer gstatic subrequests.
2. Consider self-hosting the 1-2 most critical fonts (subset, woff2 only) to eliminate the third-party render-blocking round trip to `fonts.googleapis.com` entirely, keeping Google Fonts only for less-critical decorative faces if needed.
3. Investigate route-based code-splitting for the 747KB JS bundle (Vite/React `React.lazy()` + dynamic `import()` per route) since the site already has 16 distinct routes — currently everything ships in one bundle regardless of which page is requested.

**Falsifiability check:** `curl -s "https://fonts.googleapis.com/css2?family=..." | grep -c "@font-face"` currently returns ~25 `@font-face` blocks; after trimming to only-used weights this count should drop. Bundle count check: `curl -s https://avirenajewels.com/ | grep -c '<script type="module"'` currently returns `1`; after code-splitting, expect additional dynamically-loaded chunk references in the network trace (not necessarily in the initial HTML, since dynamic imports are runtime-triggered).

---

## 7. Mobile Viewport/Rendering Correctness

**Severity: Info / Pass**

**Evidence:**
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```
Present and correctly configured on `index.html:5` (and thus on every prerendered route, since all inherit from the same template) — no `maximum-scale` or `user-scalable=no` restrictions that would harm accessibility/zoom. No separate mobile subdomain or dynamic serving concerns (single responsive codebase via Tailwind, confirmed by extensive responsive-prefix classes like `sm: md: lg: xl: 2xl:` observed throughout HomePage.tsx).

Touch target spot-check: Navbar cart/menu buttons use `p-2` (8px padding) around icon content (Navbar.tsx:253) — depending on icon size this may sit close to or under the 44×44px recommended minimum touch target; not conclusively fail without rendered box-model measurement, flagging as **Low** severity for manual verification rather than a confirmed defect.

**No fix required for viewport meta itself** — this passes. Touch-target sizing is a **Low** severity item worth a manual tap-target audit (Chrome DevTools mobile emulation "tap targets" audit) rather than further static-code speculation.

**Falsifiability check:** Viewport meta tag presence: `curl -s https://avirenajewels.com/ | grep -o '<meta name="viewport"[^>]*>'` — must return the tag verbatim; currently does. This is a stable pass unless the tag is removed in a future deploy.

---

## 8. Sitemap/Robots Technical Correctness

**Severity: Medium** (lastmod accuracy), **Info** (structure otherwise correct)

**Evidence:**
- `sitemap_discovery.py` run result: sitemap **declared** in robots.txt, **found**, and **validated** (`"valid": true, "kind": "urlset"`) at `https://avirenajewels.com/sitemap.xml`. This is a genuine pass, not a stale robots.txt declaration — the helper confirmed it resolves and parses.
- Sitemap contains exactly **16 URLs** as expected (1 home + 1 shop + 5 categories + collections + about + contact + faq + policies + journal + 3 products = 16), confirmed by direct fetch.
- All 16 entries carry `<lastmod>2026-09-04</lastmod>` — i.e., **today's date on every URL, including static informational pages** (`/about`, `/policies`, `/faq`) that almost certainly were not content-modified today. Root cause confirmed in `prerender.ts:222`: `const today = new Date().toISOString().split('T')[0];` is applied uniformly to every `addSitemapUrl()` call regardless of actual content change — every production build (which appears to run at least daily, given deploy history) rewrites every `lastmod` to the current date. This makes `lastmod` meaningless as a freshness signal to Google — Google explicitly says it may reduce crawl trust in a sitemap if `lastmod` doesn't correlate with genuine change (a sitemap that "cries wolf" by claiming daily changes to static pages can cause Google to deprioritize the recrawl signal entirely).
- Homepage `changefreq: daily` / `priority: 1.0` is reasonable for a homepage but note **Google has publicly stated it ignores both `changefreq` and `priority` entirely** since 2016 — their presence is harmless but provides no actual SEO benefit; not worth further engineering effort either way.
- robots.txt: `Allow: /` with `Disallow: /checkout`, `/cart`, `/api/` — correctly scoped, no accidental blanket disallow, sitemap directive present and correctly pointing to the validated URL. AI crawler allowances (GPTBot, ChatGPT-User, PerplexityBot, ClaudeBot, Google-Extended, Applebot-Extended) are all explicit `Allow: /` blocks — correctly structured per-user-agent groups, not merged incorrectly into the wildcard group.
- **Interaction with finding #1:** Since `/checkout`, `/cart`, `/api/` are disallowed in robots.txt but the vercel.json catch-all serves 200s for everything, these disallowed paths still return 200 (just not crawled if bots honor robots.txt) — not a robots.txt defect itself, but reinforces that the catch-all's blast radius extends even to explicitly-disallowed paths, which is inconsistent (disallow signals "don't crawl" but the server still happily serves full content with a 200, so any bot that ignores robots.txt, or any direct link/referral, still reaches functioning-looking pages there).

**Fix:** In `prerender.ts`, track actual last-modified dates per route (e.g., diff against the previous build's sitemap, or use the Shopify product's `updatedAt` field for product URLs, and hardcode/version-control real change dates for static pages) instead of stamping every URL with `today`. Minimum viable fix: only update `lastmod` for a route when its `title`/`description`/`htmlContent` actually differs from the last generated version.

**Falsifiability check:** Run the prerender build on two consecutive days without any content change and diff `sitemap.xml` — if `lastmod` values change despite zero content diff, the defect is confirmed still present. Current evidence already shows this (all 16 entries share the literal build-date, not per-page dates).

---

## 9. IndexNow Protocol Status

**Severity: Low-Medium** (missed opportunity, not a defect)

**Evidence:**
- No IndexNow key file exists in the repo (`find public/ -iname "*indexnow*"` returned nothing) and no IndexNow submission code exists in `scripts/`, `src/`, `vercel.json`, or `package.json` (grep for "indexnow" across all of these returned zero matches).
- Live check: `GET https://avirenajewels.com/indexnow.txt` returns **HTTP 200**, but this is **not a real IndexNow key file** — it is the soft-404 homepage bundle (identical ETag `52e43cfd6eb8766b045192d9d4252ee1` and `Content-Length: 10416` to the actual homepage and to the earlier `/nonexistent-page-test-404` probe). This is a direct consequence of finding #1: any bot or manual check for an IndexNow key at a guessed path will get a false-positive 200, which could mislead someone into believing IndexNow is configured when it is not.
- No evidence of any IndexNow ping being sent to Bing/Yandex/Naver on deploy (no webhook, no Vercel build-step curl call, no GitHub Action found referencing `indexnow` or `bing.com/indexnow`/`api.indexnow.org`).

**Fix:** IndexNow is low-effort, high-value for a site already investing heavily in Bing/GSC verification (msvalidate.01 tag already present in index.html, albeit still the placeholder `BING_WEBMASTER_VERIFICATION_CODE` — see note below). Implementation:
1. Generate a key (any GUID), publish it at `public/<key>.txt` containing just the key string.
2. Add a post-build/post-deploy step (e.g., in `prerender.ts` or a separate script triggered by a Vercel deploy hook) that POSTs the 16 sitemap URLs to `https://api.indexnow.org/indexnow` with the key, notifying Bing/Yandex/Naver (and IndexNow-participating engines) immediately on every content change instead of waiting for organic recrawl.

**Side note (not in original scope but discovered in the same file):** `index.html:14` still has the literal placeholder `<meta name="msvalidate.01" content="BING_WEBMASTER_VERIFICATION_CODE" />` and line 15 has `<meta name="p:domain_verify" content="PINTEREST_DOMAIN_VERIFY_CODE" />` — both are unfilled template placeholders, not real verification codes. These are inert (won't break anything) but mean Bing Webmaster Tools and Pinterest domain verification are **not actually active** despite the tags' presence suggesting they are. Flagging as **Info** since it's adjacent to the IndexNow/Bing question but distinct from it.

**Falsifiability check:** `curl -s https://avirenajewels.com/<real-key>.txt` should return exactly the key string with `Content-Type: text/plain` once implemented — not the homepage bundle. Submission success is verifiable via Bing Webmaster Tools' IndexNow report showing recent submissions.

---

## 10. Preconnect Verification — cdn.shopify.com & images.unsplash.com

**Severity: Low**

**Evidence:**
- `index.html:27-30` declares `preconnect`+`dns-prefetch` for both `cdn.shopify.com` and `images.unsplash.com`.
- **`cdn.shopify.com` — confirmed actively used on real product pages.** Live sitemap.xml `image:image` entries and the rendered product-page HTML both show product images served exclusively from `cdn.shopify.com/s/files/1/1031/9364/1282/files/...` (verified via `render_page.py` against the live `/product/geometric-gold-tone-statement-earrings-for-women-modern-square-earrings` page — all 6 gallery images are `cdn.shopify.com` URLs). This preconnect is justified and actively saves connection-setup latency on every product/shop page.
- **`images.unsplash.com` — used only in client-side fallback/demo code, not in any prerendered (crawler-visible) HTML.** Confirmed via source grep: referenced in `src/data/products.ts` (fallback/demo product image arrays), `src/lib/shopify.ts:544` (fallback when a Shopify product has zero images: `images: images.length > 0 ? images : ['https://images.unsplash.com/...']`), and hardcoded directly in `src/pages/HomePage.tsx` (lines 64, 79, 87, 96, 104, 112, 120, 128, 373 — editorial/decorative hero imagery, e.g. line 373 is a full-width hero banner image, not a fallback). Since HomePage.tsx hardcodes Unsplash URLs for real rendered content (the editorial hero section), **this preconnect is also justified on the homepage specifically**, but it is **not used on product pages** (those render Shopify images only) — meaning on `/product/*` routes, the `images.unsplash.com` preconnect is a wasted connection (browser opens a TCP+TLS handshake to a domain that page never requests a resource from), and conversely on the homepage, if any product-card-driven content pulls exclusively from Shopify with no Unsplash fallback triggered, the `cdn.shopify.com` preconnect may or may not be exercised depending on whether `HomePage.tsx`'s featured-product section renders live Shopify data or the local Unsplash-based demo array.

**Fix:** These are global preconnects in `index.html`, applied identically to every route regardless of which origin that specific route actually uses. Options, in order of effort:
1. **Minimal:** Leave both as-is; the practical cost of an unused preconnect is small (one wasted DNS+TCP+TLS handshake, typically <100-300ms of connection overhead that's dropped after ~10s if unused) — this is a Low-severity, not urgent issue.
2. **Correct:** Move the preconnects out of the static `index.html` (applied to all routes) and into the per-route logic in `prerender.ts`'s `renderPageHtml()`, adding `<link rel="preconnect">` only for the origin(s) that specific `route.htmlContent`/`route.ogImage` actually references (e.g., product routes get `cdn.shopify.com` only; homepage gets both since it uses Unsplash hero images and may render Shopify-sourced product cards).

**Falsifiability check:** For a given route, `curl -s <route> | grep -o 'src="https://[^"]*"'` gives the actual image origins used; compare against `grep -o 'preconnect" href="https://[^"]*"'` for that same route. Currently every route returns the same two preconnects (both unconditional from the static template) regardless of which origins that route's images actually hit — confirmed by comparing the homepage and product-page preconnect blocks, which are byte-identical despite different image origins in use.

---

## Summary Table

| # | Area | Severity | Status |
|---|------|----------|--------|
| 1 | Soft 404 (vercel.json catch-all) | Critical | Confirmed defect, fix specified |
| 2 | Duplicate/conflicting meta tags | High | Confirmed defect, fix specified |
| 3 | Redirect chains (www/http/trailing-slash) | Medium | Mostly correct; trailing-slash + 2-hop www chain flagged |
| 4 | Security headers (CSP, XFO, XCTO, Referrer-Policy, Permissions-Policy) | High | All 5 confirmed absent, HSTS present but incomplete |
| 5 | Core Web Vitals (lab/static only, no CrUX) | Medium-High | LCP/CLS risk from unsized, uncompressed, unpreloaded hero image |
| 6 | Render-blocking resources (fonts, JS, CSS) | Medium | 25-variant font request, 747KB JS bundle, no code-splitting |
| 7 | Mobile viewport | Info/Pass | Correct; touch targets need manual spot-check (Low) |
| 8 | Sitemap/robots correctness | Medium | Sitemap valid & discoverable; lastmod stamped with build date, not real change date |
| 9 | IndexNow | Low-Medium | Not implemented; soft-404 masks this at guessed key paths |
| 10 | Unused preconnect check | Low | Both origins are genuinely used somewhere in the app, but not scoped per-route |

Files referenced in this audit (all absolute paths):
- `d:/ThePieCraft Marketing/Web Development/avirena-jewels/vercel.json`
- `d:/ThePieCraft Marketing/Web Development/avirena-jewels/index.html`
- `d:/ThePieCraft Marketing/Web Development/avirena-jewels/scripts/prerender.ts`
- `d:/ThePieCraft Marketing/Web Development/avirena-jewels/src/pages/HomePage.tsx`
- `d:/ThePieCraft Marketing/Web Development/avirena-jewels/src/lib/shopify.ts`
- `d:/ThePieCraft Marketing/Web Development/avirena-jewels/src/data/products.ts`
- `d:/ThePieCraft Marketing/Web Development/avirena-jewels/src/pages/ProductDetailPage.tsx`
- `d:/ThePieCraft Marketing/Web Development/avirena-jewels/src/components/Navbar.tsx`
- `d:/ThePieCraft Marketing/Web Development/avirena-jewels/public/logo.png`
