# Sitemap Architecture & Indexation Surface Audit — avirenajewels.com

Scope: XML sitemap correctness, URL inventory/coverage, lastmod/changefreq/priority integrity, image sitemap, orphan routes, and how the soft-404 catch-all corrupts sitemap trust. Commerce/catalog implications are covered by the e-commerce agent; the Vercel rewrite fix itself is covered by the technical agent. This report covers indexation consequences only.

Generator: `scripts/prerender.ts` (writes identical `sitemap.xml` to both `dist/` and `public/`). Live file verified at `https://avirenajewels.com/sitemap.xml` matches `public/sitemap.xml` byte-for-byte at audit time.

---

## Finding 1 — Product URL coverage gap: sitemap has 3 of a much larger catalog surface (data-source ambiguity)

**Severity: Critical**

**Evidence:**
`scripts/prerender.ts` builds product routes/sitemap entries from a **live Shopify Storefront API query** (`fetchShopifyProducts()`, `scripts/prerender.ts:31-80`, `products(first: 100)`), not from the repo's static catalog. At audit time this query returned only **3 products** (all earrings, all with auto-generated Shopify handles like `geometric-gold-tone-statement-earrings-for-women-modern-square-earrings`), which is exactly what landed in the sitemap.

Separately, the repo contains a **fully authored static catalog** at `src/data/products.ts` with **19 products** across all 5 categories (necklaces, earrings, brooches, bracelets, rings) using clean human-authored ids (`square-form-necklace`, `lucid-studs`, `wave-prism-ring`, etc.). This static array is used as the client-side fallback (`ShopifyProvider`, `src/context/ShopifyContext.tsx:3,36`) whenever Shopify isn't configured or returns nothing usable — i.e., it is very likely what real visitors and old category pages actually display, but it is **never read by the sitemap generator at all**.

Net result: the sitemap is missing, at minimum:
- All 16 remaining static-catalog products not present in the Shopify feed: `lucid-studs`, `solid-wave-brooch`, `ornate-scroll-pendant`, `two-pearl-cuff`, `twin-hoop-earrings`, `row-edge-ring`, `wave-prism-ring`, `shell-radiance-studs`, `gold-curve-necklace`, `accent-earrings`, `linked-heart-bracelet`, `scalo-bracelet`, `dome-studs`, `pearl-drop-meridian`, `luna-pearl-choker`, `vela-ring`, `veda-ring`, `papette-gem-ring` (18 of 19; `square-form-necklace` is also missing since it has no Shopify counterpart in the current feed).
- Necklaces, rings, bracelets, and brooches category pages each link to zero indexed product URLs — every non-earring category page is a hub pointing at pages that don't exist in the sitemap.

This is compounded by Finding 5 (id-scheme mismatch): even if these products existed in Shopify, the client-side canonical/PDP routing uses the *local* id scheme (`/products/{id}`, e.g. `/products/square-form-necklace`) while the sitemap/prerender uses the *Shopify handle* scheme (`/product/{handle}`, e.g. `/product/geometric-gold-tone-...`). These are two different, non-overlapping URL spaces for what may be the same conceptual catalog.

**Fix:**
1. Determine which catalog is authoritative for production (Shopify feed vs. static `products.ts`) — this is a business/commerce decision outside this report's scope, but the sitemap must be generated from whichever one is actually live and linked from category pages.
2. If Shopify is authoritative and currently only has 3 products live, that is a business-side catalog gap, not a sitemap bug — but it means 4 of 5 category pages are currently orphaned hubs with no product URLs to submit to Google. Flag this to the e-commerce agent.
3. If the static catalog is (also) live in production, extend `fetchShopifyProducts()`/`main()` in `scripts/prerender.ts` to merge in static-catalog products that have no Shopify counterpart, using one single, canonical URL path pattern (see Finding 5).
4. Re-run `npm run build` (which chains `prerender`) and diff the resulting `sitemap.xml` URL count against the true live product count before next deploy.

**Falsifiability:** Compare `grep -c "id: '" src/data/products.ts` (19) against `grep -c "/product/" public/sitemap.xml` (3). Load `https://avirenajewels.com/shop/necklaces`, `/shop/rings`, `/shop/bracelets`, `/shop/brooches` and check whether any linked product URLs resolve to pages present in the sitemap's 3 `/product/*` entries — none currently do.

---

## Finding 2 — `lastmod` is a build timestamp, not a modification date (false recrawl signal)

**Severity: Medium**

**Evidence:** `scripts/prerender.ts:222` — `const today = new Date().toISOString().split('T')[0];` — and `addSitemapUrl` (`scripts/prerender.ts:225-227`) hard-codes `lastmod: today` for every single URL with no per-route override. Every one of the 16 URLs in the live sitemap carries `2026-09-04`, which is simply "the day the build ran," not "the day this page's content meaningfully changed." Any future rebuild (including unrelated deploys, e.g. a copy fix on the FAQ page) will re-stamp *every* URL to that day's date, including URLs whose content didn't change at all.

**Why it matters:** `lastmod` is one of the few sitemap signals Google still weights (unlike `priority`/`changefreq`). Google explicitly discounts `lastmod` values it judges to be inaccurate or blanket-applied, and once a sitemap is caught doing this, Googlebot tends to deprioritize the field for that entire domain going forward — including for future dates that might be genuinely accurate. This actively degrades recrawl scheduling efficiency for a 3–19 product catalog that needs freshness signals to work correctly, not against it.

**Fix — derive real per-route dates from git history at build time.** Git history is a good proxy for "last significant content change" as long as the CI checkout isn't shallow (`fetch-depth: 1` truncates `git log` to the merge commit). Example approach for `scripts/prerender.ts`:

```ts
import { execSync } from 'child_process';

function getLastModDate(filePaths: string[]): string {
  for (const file of filePaths) {
    try {
      const out = execSync(`git log -1 --format=%cs -- "${file}"`, {
        cwd: rootDir,
        encoding: 'utf-8',
      }).trim();
      if (out) return out; // already YYYY-MM-DD via %cs
    } catch {
      /* file may not exist in git history yet — try next path */
    }
  }
  return new Date().toISOString().split('T')[0]; // fallback only
}

// Static routes: map to the page component that actually renders them
const aboutLastmod = getLastModDate(['src/pages/AboutPage.tsx']);
const contactLastmod = getLastModDate(['src/pages/ContactPage.tsx']);
const policiesLastmod = getLastModDate(['src/pages/PoliciesPage.tsx']);
// ...one per static route

// Product routes: use Shopify's own updatedAt if you add it to the GraphQL query,
// which is more accurate than git history for catalog data:
// products(first: 100) { edges { node { updatedAt ... } } }
```

Verified this works today: `git log -1 --format=%ad --date=short -- src/pages/AboutPage.tsx`, `ContactPage.tsx`, and `PoliciesPage.tsx` all correctly return `2026-09-03` (one day before the current false blanket stamp of `2026-09-04`), proving git history is already available and differentiable per route in this repo.

For product pages specifically, prefer adding `updatedAt` to the existing Shopify GraphQL query (`scripts/prerender.ts:36-59`) over git blame — Shopify's own field reflects true catalog-content changes (price, description, images) independent of when the storefront code was last redeployed, which is the more correct signal for a Product URL's `lastmod`.

**Caveat to flag to whoever owns CI config:** if Vercel's git checkout for this project uses a shallow clone, `git log` will fail silently inside the `catch` block above and fall back to `today` for every route — silently reproducing today's bug. Confirm full-history checkout (or `fetch-depth: 0` if this is GitHub Actions feeding Vercel) before relying on this approach.

**Falsifiability:** After implementing, rebuild and confirm `grep lastmod public/sitemap.xml | sort -u` returns more than one distinct date. Re-run a build with zero content changes and confirm `lastmod` values are unchanged from the prior build (only genuinely touched routes' entries should change).

---

## Finding 3 — `changefreq` and `priority` are inert; low-severity cleanup

**Severity: Low / Info**

**Evidence:** All 16 entries carry both `<changefreq>` and `<priority>` (`scripts/prerender.ts:225-227, 706-730`). Google has stated for years that both tags are ignored for crawl prioritization (`changefreq`) and ranking (`priority`); Bing similarly gives them minimal weight. They add bytes to every build without providing a positive control signal.

**Assessment:** Not worth an urgent fix, and not currently causing harm — no evidence either tag is producing incorrect signals (e.g., `priority` values are reasonably ordered: home 1.0 → shop 0.9 → categories/collections 0.8 → about 0.7 → contact/faq 0.6 → policies 0.5, which at least reflects sound internal information architecture even if Google discards it). Recommend removing both tags the next time `scripts/prerender.ts`'s sitemap block is touched for another reason (e.g., alongside the Finding 2 fix), rather than as a standalone change. Simplifies the `addSitemapUrl` signature and the generator template at `scripts/prerender.ts:706-730`.

**Falsifiability:** Google's own sitemap documentation (developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) states both fields "are not used" for scoring; this is a stable, publicly documented position, not something requiring live testing.

---

## Finding 4 — Image sitemap: 1 image site-wide is a real missed opportunity for a jewelry brand

**Severity: Medium**

**Evidence:** Of 16 `<url>` entries, only the homepage (`<image:loc>https://avirenajewels.com/logo.png</image:loc>`) and the 3 product entries carry `<image:image>` tags. The 3 product entries do have rich image sets (5–6 CDN images each — `scripts/prerender.ts:684`, `addSitemapUrl(..., prodImages)`), which is good practice already implemented for products. But:
- **All 5 category pages** (`/shop/earrings`, `/shop/necklaces`, `/shop/rings`, `/shop/bracelets`, `/shop/brooches`) have zero image entries, despite each category page rendering product grid imagery once real products exist.
- `/shop`, `/collections`, `/journal` similarly carry no images despite being visually driven, catalog-adjacent pages.
- Once Finding 1's coverage gap is fixed and more products exist in the sitemap, this same per-product image pattern already in place should scale correctly — the mechanism works, it's just starved of category-level and catalog-breadth input.

**Why it matters:** Google Images is a meaningfully large discovery surface for jewelry (a highly visual, highly browsed vertical). Each `<image:image>` entry is a low-cost, direct way to get individual product photos indexed and attributed to the correct page/product, rather than relying on Googlebot to discover and correctly attribute images purely through on-page crawling.

**Fix:** Extend the category-route loop (`scripts/prerender.ts:375-401`) to pass representative image URLs into `addSitemapUrl`, e.g. the first N product images belonging to that category from the fetched Shopify set:

```ts
for (const cat of categories) {
  const categoryProducts = shopifyProducts.filter(
    (p) => (p.productType || '').toLowerCase() === cat.id.toLowerCase()
  );
  const categoryImages = categoryProducts
    .slice(0, 10) // cap to avoid bloating one entry
    .flatMap((p) => (p.images?.edges || []).map((e: any) => e.node.url))
    .slice(0, 20);

  // ...existing routes.push(...)
  addSitemapUrl(`${SITE_URL}/shop/${cat.id}`, '0.8', 'weekly', categoryImages);
}
```

Note this depends on `productType` in Shopify being reliably set to match the category ids (`earrings`, `necklaces`, etc.) — verify that mapping exists before wiring it up; if `productType` is inconsistent, filter by whatever taxonomy field Shopify actually uses (collection handle is often more reliable than free-text product type).

**Falsifiability:** `grep -c "image:image" public/sitemap.xml` currently returns entries only under the homepage and 3 product URLs (33 total `<image:image>` tags, all under 4 of 16 `<url>` blocks) — confirm via `grep -B5 "image:image" public/sitemap.xml | grep "<loc>"` that no category/shop/collections URL appears.

---

## Finding 5 — URL scheme mismatch: sitemap/prerender use `/product/{handle}`, live client-side routing/canonical use `/products/{id}` (singular vs. plural, Shopify handle vs. local id)

**Severity: High**

**Evidence:**
- `scripts/prerender.ts:657,660,684` generates and sitemaps: `${SITE_URL}/product/${handle}` (singular "product"), using the Shopify GraphQL `handle` field (auto-slugified from product title, e.g. `geometric-gold-tone-statement-earrings-for-women-modern-square-earrings`).
- `src/components/SeoMeta.tsx:36,174` — the client-side canonical injected at runtime for every PDP view, and the `Product` JSON-LD's `offers.url`, both use `https://avirenajewels.com/products/${selectedProduct.id}` (**plural** "products"), using the local `Product.id` field from `src/data/products.ts` (e.g. `square-form-necklace`).
- Confirmed live: `curl -s -o /dev/null -w "%{http_code}" https://avirenajewels.com/products/square-form-necklace` → `200` (only because of the Finding 6 catch-all rewrite, not because that route is real) and `https://avirenajewels.com/product/square-form-necklace` (singular) → also `200`, for the same reason.

This means: for any product that exists only in the local catalog (16 of 19, see Finding 1), the page a user actually lands on self-declares a canonical URL (`/products/{id}`) that **is never listed in the sitemap** and was **never prerendered** by `scripts/prerender.ts` (which only writes prerendered HTML to `dist/product/{handle}/index.html`, singular). Conversely, the 3 sitemap-listed, prerendered URLs use `/product/{handle}` (singular), which the client-side SPA router does correctly resolve via the `/product/:handle` matcher in `App.tsx:130-137` — but the canonical tag on that same page will still self-declare `/products/{handle}` (plural) once client-side JS hydrates and `SeoMeta.tsx` overwrites the prerendered canonical, per Finding 8's mechanism. So even the 3 "correct" sitemap URLs end up with a post-hydration self-contradicting canonical.

**Fix:** Pick one URL scheme — singular `/product/{slug}` is already what's prerendered, sitemapped, and routed server-side, so standardize on it. Update `src/components/SeoMeta.tsx:36` and `:174` from `/products/${selectedProduct.id}` to `/product/${selectedProduct.id}`. This is a one-line-per-occurrence fix but has sitemap-trust implications significant enough to flag here even though the file itself isn't sitemap code — it directly determines whether the canonical Google sees post-hydration matches the URL Google was told about in the sitemap.

**Falsifiability:** `grep -n "products/\${selectedProduct" src/components/SeoMeta.tsx` currently returns 2 matches (lines 36, 174); `grep -n "/product/" scripts/prerender.ts` uses singular throughout. Any live PDP URL, view page source (prerendered/static HTML) vs. inspect element after JS execution (hydrated DOM) — the `<link rel="canonical">` value will differ between the two, singular vs. plural, on the same URL.

---

## Finding 6 — Vercel catch-all rewrite lets Googlebot index arbitrary URLs, poisoning the sitemap's credibility signal

**Severity: Critical (indexation-surface consequences only — the rewrite fix itself is out of scope for this report)**

**Evidence:** `vercel.json`: `rewrites: [{ "source": "/(.*)", "destination": "/index.html" }]` with no exclusions. Confirmed live: `curl -s -o /dev/null -w "%{http_code}" https://avirenajewels.com/this-page-does-not-exist-xyz123` → `200`. There is no server-side 404 possible on this domain for any path.

**Indexation consequences (this report's scope):**
1. **The sitemap can no longer function as a trust boundary.** A sitemap's implicit value proposition to a search engine is "these are the URLs I vouch for; everything else is not my authoritative content surface." When *every* URL on the domain returns 200, Googlebot has no server-side signal distinguishing the 16 sitemap-listed URLs from a typo'd URL, an old removed URL, a scraper-guessed URL, or a maliciously constructed URL (e.g. from a spam backlink pointing at `avirenajewels.com/casino-bonus-xyz`). All of these soft-200 into homepage content and become indexable, diluting the domain's topical focus and potentially triggering manual/algorithmic quality signals unrelated to anything in this codebase.
2. **Soft 404s are actively flagged by Google Search Console**, not silently ignored — GSC's Page Indexing report has a dedicated "Soft 404" exclusion category. Once Google detects the pattern (any nonsense path → 200 + homepage-equivalent content), it doesn't just skip those specific junk URLs; it can become more conservative about trusting *any* 200 response from the domain, including the legitimate sitemap URLs, because the site has demonstrated its HTTP status codes aren't reliable indicators of real content.
3. **It directly undermines Finding 5's canonical mismatch.** Because invalid URLs 200 rather than 404, a broken/mismatched canonical (e.g. `/products/square-form-necklace`) doesn't get cleanly rejected by Google as "page not found" — instead Google fetches it, sees real-looking (homepage) content, and has to make an independent judgment call about which URL is canonical among a cluster of near-duplicate/misrouted URLs. This is precisely the ambiguous signal set that produces duplicate-content dilution and unpredictable indexing of the wrong URL variant.
4. **It affects the sitemap's own submitted URLs' trustworthiness indirectly**: GSC's "Sitemaps" report cross-references coverage against the Page Indexing report. If GSC is simultaneously reporting soft 404s for arbitrary paths on this domain, reviewers/algorithms auditing sitemap coverage have a noisier baseline for judging whether the 16 declared URLs are being correctly prioritized versus everything else Google discovers.

**What this report does not cover:** the actual `vercel.json` rewrite fix (e.g. adding a `fallback: false` config, a dedicated catch-all React route + `404` status page, or restricting the rewrite to known-good path prefixes) — that is the technical agent's remit. This report's finding is limited to: as long as the catch-all exists, no sitemap-coverage or canonical fix in Findings 1, 5, or 8 can be considered fully resolved from Google's perspective, because Google cannot use HTTP status to corroborate any of those fixes.

**Falsifiability:** `curl -s -o /dev/null -w "%{http_code}" https://avirenajewels.com/<random-string>` returns `200` for any arbitrary path today; this is directly reproducible and will resolve automatically once the technical agent's rewrite fix lands (re-test after that fix ships to confirm downstream sitemap-trust concerns are resolved).

---

## Finding 7 — Orphan/missing route reconciliation: sitemap vs. React router vs. prerender.ts

**Severity: Medium**

**Evidence — three-way comparison:**

| Route | In `App.tsx` router | In `prerender.ts` | In sitemap | Status |
|---|---|---|---|---|
| `/` | Yes | Yes | Yes | OK |
| `/shop` | Yes | Yes | Yes | OK |
| `/shop/{5 categories}` | Yes (via query/category state, not distinct paths — see note) | Yes (distinct prerendered paths) | Yes | OK, but see note below |
| `/collections` | Yes | Yes | Yes | OK |
| `/about` | Yes | Yes | Yes | OK |
| `/contact` | Yes | Yes | Yes | OK |
| `/faq` | Yes (`faq`, plus aliases `care`, `sizing`) | Yes | Yes | OK |
| `/policies` | Yes | Yes | **No** | **Missing from sitemap** |
| `/journal` | Yes (`journal`, plus alias `lookbook`) | Yes | Yes | OK |
| `/product/{handle}` | Yes (`product/:handle` matcher) | Yes (3 entries) | Yes (3 entries) | Coverage gap, see Finding 1 |
| `/products/{id}` (plural) | **No** — `App.tsx:127-137` only matches `root === 'product'` singular | No | No | Dead canonical target only (Finding 5) — not routable, only reachable via the catch-all's soft-200 |
| `/cart` | Yes | No (correctly excluded — transactional) | No (correctly excluded) | OK — should not be indexed |
| `/checkout` | Yes | No (correctly excluded) | No (correctly excluded, also `Disallow`'d in robots.txt) | OK |
| `/collection` (singular, alias) | Yes — `App.tsx:141` treats `collection` as alias for `shop` | No | No | Low-risk orphan alias, see below |
| `/suites` (alias for `/collections`) | Yes — `App.tsx:145` | No | No | Low-risk orphan alias, see below |

**Specific findings:**

1. **`/policies` is routable, prerendered (`scripts/prerender.ts:541-557` generates `dist/policies/index.html`), live (confirmed 200), has a unique title and its own JSON-LD block — but is absent from the sitemap.** Checking the sitemap generator: `addSitemapUrl` is called for every other prerendered route (`scripts/prerender.ts:294,364,400,440,468,495,538,576,684`) but there is no corresponding `addSitemapUrl(`${SITE_URL}/policies`, ...)` call anywhere in the file — it's the only fully-built, fully-live static route silently missing from the `sitemapUrls` array. This is a straightforward omission, not a deliberate exclusion (contrast with `/cart` and `/checkout`, which are correctly and consistently excluded everywhere).

2. **Alias routes (`/collection`, `/suites`, `/care`, `/sizing`, `/lookbook`)** — `App.tsx:139-172`'s switch statement accepts multiple path aliases that all resolve to the same `currentPage` state (e.g. both `/journal` and `/lookbook` render the Journal page). These aliases are not prerendered and not sitemapped, which is correct — they should not be treated as separate indexable URLs. No action needed here beyond confirming (separately, technical agent's remit) that these aliases don't get their own canonical tag pointing at themselves rather than at the primary path when hit directly.

3. **Nothing is in the sitemap but *not* routable** — no reverse-orphans found. All 16 current sitemap URLs correspond to a real router match and a real prerendered file.

**Fix:** Add the missing `addSitemapUrl` call for `/policies` in `scripts/prerender.ts`, immediately after its `routes.push(...)` block (around line 557), matching the pattern used for every sibling static route:
```ts
addSitemapUrl(`${SITE_URL}/policies`, '0.5', 'monthly');
```
(Priority/changefreq values shown for consistency with existing convention; per Finding 3, both are inert and could be dropped in a broader cleanup.)

**Falsifiability:** `grep -c "policies" public/sitemap.xml` → `0` currently. `curl -s -o /dev/null -w "%{http_code}" https://avirenajewels.com/policies` → `200`, and the page has a unique `<title>Policies, Shipping & Returns | AVIRENA</title>` per `scripts/prerender.ts:543` — confirming it's a real, complete, indexable page that simply isn't declared.

---

## Finding 8 — Homepage canonical mismatch: sitemap declares trailing slash, static tag omits it, injected tag adds it back

**Severity: Medium**

**Evidence:**
- Sitemap: `<loc>https://avirenajewels.com/</loc>` (trailing slash) — `public/sitemap.xml` line 4.
- Static prerendered `index.html` canonical (view-source, before JS runs): `<link rel="canonical" href="https://avirenajewels.com" />` — confirmed both in `index.html:24` (source template) and live via `curl -s https://avirenajewels.com/ | grep canonical` → returns the no-slash form as the *first* match.
- Client-side injected canonical (after JS hydrates): `src/components/SeoMeta.tsx:22` — `let canonical = 'https://avirenajewels.com'` for the home case... **but** live `curl` output actually showed a **second** canonical tag with the slash (`https://avirenajewels.com/`), meaning at runtime there are briefly (or persistently, depending on when `SeoMeta`'s `useEffect` fires vs. any other injection) **two `<link rel="canonical">` tags in the DOM** — one from the static template, one appended/updated by `SeoMeta.tsx`. `SeoMeta.tsx:75-81`'s logic (`querySelector` → update existing, else create new) is written to *update* the existing tag in place, not create a duplicate — so the presence of two different canonical values in the raw `curl` output suggests either (a) `scripts/prerender.ts`'s `renderPageHtml` (`scripts/prerender.ts:158`) is *also* injecting a second canonical `<link>` via its own `metaTags` block before `</head>`, in addition to the one already in the static `index.html` template, and the client-side script hasn't run in a plain `curl` fetch to reconcile them — which is exactly what's happening: `renderPageHtml` injects a *fresh* canonical (`scripts/prerender.ts:158`, using `route.canonical` = `${SITE_URL}/` with slash, `scripts/prerender.ts:235`) right before `</head>`, while the original static tag from the base `index.html` template (no slash) is never removed. **Two literal `<link rel="canonical">` tags exist in the served, prerendered HTML for `/` simultaneously.**

**Why two canonicals is worse than one wrong canonical:** Google's documented behavior when it encounters multiple conflicting canonical declarations on one page is to ignore all of them and fall back to its own algorithmic canonicalization heuristics — meaning Google, not the site, decides whether `https://avirenajewels.com` or `https://avirenajewels.com/` is authoritative. This is likely to resolve fine in practice (both forms serve identical content and both are on the same origin), but it removes the site owner's ability to declare intent, and it's the kind of inconsistency that compounds with Finding 5 and Finding 6 into a generally noisy, self-contradicting canonical signal set across the domain — exactly the pattern that erodes Google's trust in any single-source-of-truth signal from this domain, sitemap included.

**Fix:**
1. Standardize on the trailing-slash form for the homepage specifically (root path canonically has a trailing slash; this matches the sitemap's own declaration and is the more conventional choice for a domain root).
2. In `scripts/prerender.ts`, the homepage route's `canonical` field (`scripts/prerender.ts:235`, `` `${SITE_URL}/` ``) already produces the correct value — no change needed there.
3. Fix the **static template** `index.html:24` to match: change `<link rel="canonical" href="https://avirenajewels.com" />` to `href="https://avirenajewels.com/"`. This alone won't fully solve it, though, because `renderPageHtml` (`scripts/prerender.ts:182`, `html.replace('</head>', ...)`) *adds* a second canonical rather than replacing the first — it needs to also **strip any existing `<link rel="canonical">` from the base template** before injecting its own, e.g.:
```ts
// Before injecting metaTags, remove any static canonical already in the template
html = html.replace(/<link rel="canonical"[^>]*>\s*/i, '');
```
Add this line in `renderPageHtml` (`scripts/prerender.ts:147-193`) immediately before the `html.replace('</head>', ...)` call at line 182, so every prerendered page ends up with exactly one canonical tag, not the static one plus the injected one stacked together.
4. Also align `src/components/SeoMeta.tsx:22` (`let canonical = 'https://avirenajewels.com'`, no slash) to the slash form for consistency, since this is what overwrites the tag post-hydration for the home case — otherwise the DOM canonical will flip from slash (prerendered) to no-slash (post-hydration) on every homepage visit, which is its own smaller version of the same problem.

**Falsifiability:** `curl -s https://avirenajewels.com/ | grep -o '<link rel="canonical"[^>]*>'` currently returns two lines (no-slash, then slash) — reproducible today. After the fix, the same command should return exactly one line, matching the sitemap's `<loc>https://avirenajewels.com/</loc>`.

---

## Finding 9 — Sitemap index: not needed at this scale

**Severity: Info**

At 16 URLs (or even at the corrected ~35 URLs once Finding 1's coverage gap is closed), this domain is nowhere near the 50,000-URL/50MB per-file cap that would require splitting into multiple sitemap files under a sitemap index (`<sitemapindex>`). A single flat `sitemap.xml` is the correct, simplest architecture here. Do not introduce a sitemap index — it would add operational complexity (multiple files to keep in sync, an index file to maintain) with zero benefit at this catalog size. Revisit only if the catalog grows into the thousands of SKUs.

**Falsifiability:** `grep -c "<loc>" public/sitemap.xml` → 16, several orders of magnitude below the 50,000-URL threshold defined in the sitemaps.org protocol.

---

## Finding 10 — Location-page quality gates: not applicable

**Severity: N/A — confirmed out of scope**

Avirena Jewels is a single-location e-commerce brand (one atelier address referenced in JSON-LD, `scripts/prerender.ts:118-125`) with no programmatic location-page generation anywhere in the routing (`App.tsx`) or prerender script. There is no `/locations/{city}` pattern, no city-swapped landing pages, and nothing approaching the 30-page warning or 50-page hard-stop thresholds for doorway-page risk. No action needed; noted for completeness per the audit checklist.

---

## XML Validity, Encoding, and Structural Checks

**Severity: Pass (no defects found)**

- Declaration: `<?xml version="1.0" encoding="UTF-8"?>` present and correctly formed.
- Namespaces: default `xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"` and `xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"` both correctly declared on the root `<urlset>` element.
- All 16 `<loc>` values are absolute, HTTPS, single-domain (`avirenajewels.com`), with no protocol-relative or relative paths.
- No unescaped special characters (`&`, `<`, `>`) found in any `<loc>` or `<image:loc>` value — Shopify CDN URLs containing query strings (`?v=1788435680`) render correctly since `&` doesn't appear in any of the current URLs (single query param, no `&` needed).
- Trailing-slash consistency **within the sitemap itself** is correct: only the homepage root has a trailing slash (conventional), and all 15 other entries are consistently slash-free. The trailing-slash *problem* is the homepage's canonical-tag mismatch against the sitemap (Finding 8), not an internal sitemap inconsistency.
- Per-file limits: 16 URLs, file size negligible — nowhere near the 50,000-URL / 50MB ceiling (Finding 9).
- No `news:` namespace present, so the 1,000-URL news-sitemap cap doesn't apply.

**Falsifiability:** Validated by direct inspection of `public/sitemap.xml` (byte-identical to the live `https://avirenajewels.com/sitemap.xml` fetched via `curl` at audit time) and confirms well-formed XML with no parse errors.

---

## Summary Table

| # | Finding | Severity | Fix owner |
|---|---|---|---|
| 1 | Only 3 of 19 (or more) catalog products in sitemap; 4/5 category pages orphaned of product URLs | Critical | Sitemap generator + catalog-source decision (coordinate with e-commerce agent) |
| 2 | `lastmod` = build date on every URL, not real content-change date | Medium | Sitemap generator (`prerender.ts`) |
| 3 | `changefreq`/`priority` inert | Low/Info | Optional cleanup, low priority |
| 4 | Image sitemap: only homepage + 3 products have images; categories have none | Medium | Sitemap generator (`prerender.ts`) |
| 5 | `/product/{handle}` (sitemap) vs `/products/{id}` (client canonical/JSON-LD) scheme mismatch | High | `src/components/SeoMeta.tsx` |
| 6 | Catch-all rewrite → no true 404s → sitemap can't function as a trust boundary | Critical (indexation consequence; fix itself is technical agent's remit) | Cross-reference with technical agent's `vercel.json` fix |
| 7 | `/policies` fully built and live but missing from sitemap | Medium | Sitemap generator (`prerender.ts`) — add one `addSitemapUrl` call |
| 8 | Homepage: two conflicting canonical tags served simultaneously (slash vs. no-slash) | Medium | `index.html` + `scripts/prerender.ts` (`renderPageHtml`) + `SeoMeta.tsx` |
| 9 | Sitemap index | N/A | Not needed at this scale — no action |
| 10 | Location-page quality gates | N/A | Not applicable — single location |

---

## Corrected Sitemap Generation Approach (consolidated)

Combining Findings 1, 2, 4, and 7 into one coherent change to `scripts/prerender.ts`:

```ts
import { execSync } from 'child_process';

function getLastModDate(filePaths: string[]): string {
  for (const file of filePaths) {
    try {
      const out = execSync(`git log -1 --format=%cs -- "${file}"`, {
        cwd: rootDir,
        encoding: 'utf-8',
      }).trim();
      if (out) return out;
    } catch { /* try next path */ }
  }
  return new Date().toISOString().split('T')[0]; // last-resort fallback
}

// Static routes — one real lastmod per page component
addSitemapUrl(`${SITE_URL}/`, '1.0', 'daily', [`${SITE_URL}/logo.png`]);
// ...replace every addSitemapUrl(...) call's implicit `today` with an explicit
// per-route getLastModDate([...]) call, e.g.:
// addSitemapUrl(`${SITE_URL}/about`, '0.7', 'monthly', [], getLastModDate(['src/pages/AboutPage.tsx']));

// MISSING TODAY — add this call for the /policies route (Finding 7):
addSitemapUrl(`${SITE_URL}/policies`, '0.5', 'monthly', [], getLastModDate(['src/pages/PoliciesPage.tsx']));

// Category routes — include representative product imagery (Finding 4)
for (const cat of categories) {
  const categoryProducts = shopifyProducts.filter(
    (p) => (p.productType || '').toLowerCase() === cat.id.toLowerCase()
  );
  const categoryImages = categoryProducts
    .slice(0, 10)
    .flatMap((p) => (p.images?.edges || []).map((e: any) => e.node.url))
    .slice(0, 20);
  addSitemapUrl(`${SITE_URL}/shop/${cat.id}`, '0.8', 'weekly', categoryImages);
}

// Product routes — use Shopify's own updatedAt (add to GraphQL query) instead of git/build date
// query: products(first: 100) { edges { node { updatedAt ... } } }
addSitemapUrl(
  `${SITE_URL}/product/${handle}`,
  '0.9',
  'weekly',
  prodImages,
  product.updatedAt ? product.updatedAt.split('T')[0] : today
);
```

And update `addSitemapUrl`'s signature to accept an explicit `lastmod` override rather than always defaulting to `today`:

```ts
const addSitemapUrl = (
  loc: string,
  priority = '0.8',
  changefreq = 'weekly',
  images: string[] = [],
  lastmod: string = today // fallback only, prefer explicit per-route dates
) => {
  sitemapUrls.push({ loc, lastmod, changefreq, priority, images });
};
```

This resolves Findings 2, 4, and 7 in one coordinated pass through the same function. Finding 1 (true catalog coverage) requires a decision on catalog source of truth before the loop generating product routes can be fully corrected — see that finding for details.
