# Action Plan — avirenajewels.com

Ordered by **dependency**, not just severity. Phase 0 items are legal/trust exposures that should ship regardless of everything else. Phase 1 unblocks the value of all on-page work.

---

## Phase 0 — Stop the exposure (do today, ~2 hours total)

These are not SEO optimizations. They are false statements currently being served to users and search engines.

### 0.1 — Remove all fabricated review data
**Files:** `scripts/prerender.ts` (~line 625), `src/lib/shopify.ts:542-543`, `src/data/products.ts` (all 19 entries), `src/pages/ProductDetailPage.tsx:220`, `src/components/ProductCard.tsx:142`

Delete the `aggregateRating` JSON-LD block and every displayed rating/review count. There is no review system; nothing legitimate is lost.

- **Falsifiability:** `curl` any product page and grep for `aggregateRating` → zero matches. Rich Results Test shows Product without review markup.
- **Do not:** seed, backfill, or estimate reviews to "keep" the stars.

### 0.2 — Fix the materials ternary
**File:** `src/lib/shopify.ts:547`

The condition can never be true, so every brass product is labelled `'Solid 925 Sterling Silver'`. Replace with the real material derived from `metal`.

- **Falsifiability:** Render a product page with JS enabled; the materials field reads brass, not sterling silver.

### 0.3 — Purge false brand claims
**Files:** `public/llms.txt`, `ContactPage.tsx`, `PoliciesPage.tsx`, `CollectionsHubPage.tsx`, `CartDrawer.tsx`/`CartPage.tsx`, `JournalPage.tsx`, `SeoMeta.tsx`

Remove "18k Gold Vermeil", "925 Sterling Silver", "Vicenza/Jaipur atelier", `avirena.com`, `concierge@avirena.com`, and the fabricated CIN/GSTIN. Rewrite `llms.txt` from verified live facts only (a corrected draft is in `findings/geo.md`).

- **Why urgent:** `avirena.com` is a real, unrelated third-party site.
- **Falsifiability:** Grep the hydrated DOM of `/`, `/policies`, `/contact` for `vermeil|sterling|Vicenza|avirena\.com` → zero matches.

### 0.4 — Resolve NAP to one truth
Pick the real phone and the real address. Replace the placeholder `+91-98200-12345` and reconcile the three conflicting addresses (`prerender.ts:120`, `SeoMeta.tsx:124`, `CheckoutPage.tsx:41`). Align the shipping threshold (₹1,999 vs ₹3,000).

- **Falsifiability:** One phone and one address string across the entire repo.

### 0.5 — Rotate the exposed Shopify token
`scripts/prerender.ts:13` commits a Storefront access token as a hardcoded fallback. It is a public-scope token, but it is in git history — rotate it and move to env-only.

---

## Phase 1 — Fix routing (Week 1) — **unblocks everything downstream**

### 1.1 — Repair `handleLocationChange()` in `src/App.tsx`
Three coupled fixes:

1. **Line ~130** — match products by **Shopify handle**, not `p.id`. This is what breaks product-page schema.
2. **Line ~139** — read `parts[1]` in `case 'shop'` and set `selectedCategory` from the slug.
3. **Line ~231** — derive `targetPath` from the actual location instead of rewriting it from `currentPage`; use `replaceState` if a rewrite is ever needed, never `pushState`.

- **Falsifiability:** Load `/product/{handle}` with JS on → JSON-LD still contains `"@type":"Product"`. Load `/shop/necklaces` → URL stays `/shop/necklaces`, title stays "Necklaces", back button works.
- **Leading indicator:** GSC "Duplicate without user-selected canonical" count starts falling.

### 1.2 — Scope the Vercel rewrite and add a real 404
**File:** `vercel.json`

The 16 routes are already static files Vercel resolves first, so the catch-all is unnecessary. Remove it, add `dist/404.html`, and set `cleanUrls` + `trailingSlash: false`.

- **Falsifiability:** `curl -o /dev/null -w "%{http_code}" https://avirenajewels.com/junk-path` → `404`.

### 1.3 — Resolve the URL-scheme collision
`SeoMeta.tsx:36,174` emits `/products/{local-id}`; real URLs are `/product/{handle}`. Make canonicals and `offers.url` match reality.

### 1.4 — Strip static meta before injection
**File:** `scripts/prerender.ts:147` (`renderPageHtml()`)

Remove `index.html`'s `<title>`, description, canonical, OG, and Twitter tags before injecting per-route ones. Fix the homepage canonical to a single trailing-slash-consistent form.

- **Falsifiability:** `curl / | grep -c '<link rel="canonical"'` → `1`.

---

## Phase 2 — Fix the catalog (Weeks 2–4) — **the actual revenue constraint**

### 2.1 — Decide the catalog strategy
The binding question is a business one, not technical: **the store sells 3 earrings while the site markets 5 categories.**

Either:
- **(a)** Load the remaining designed pieces into Shopify with real photography, or
- **(b)** Narrow the site to what actually exists — make it an earrings brand until the catalog grows.

Option (b) is legitimate and often stronger: three well-merchandised products beat five empty category pages. What is not viable is continuing to advertise categories with no inventory.

### 2.2 — Until the catalog grows, stop advertising empty categories
`noindex` the four empty category pages and remove them from the sitemap and nav. Add `/policies` to the sitemap (currently live but omitted).

### 2.3 — Remove the mock catalog from the render path
`CollectionPage.tsx` imports the 19-product mock `PRODUCTS` (41 Unsplash stock photos), causing a visible "19 → 3" flash. Render a real skeleton/empty state instead.

- **Falsifiability:** No frame of a category page load shows a product count other than the true one.

### 2.4 — Internal linking
Category pages currently prerender zero product links. Emit real product `<a>` links so crawlers reach products through site structure, not just the sitemap.

---

## Phase 3 — Content and authority (Month 2)

### 3.1 — Write the objection-handling content (highest-confidence content bet)
SERP evidence is unambiguous: **"does brass jewelry turn skin green" is 100% editorial blog articles.** This brand sells brass and has no answer anywhere. Write it honestly — brass *can* react with skin chemistry; explain what the e-coating does and its realistic lifespan.

Then: an anti-tarnish care guide, a materials guide, and a ring-sizing page (the `RingSizerModal` content is currently trapped in a modal and unindexable).

### 3.2 — Substantiate the claims
"Anti-tarnish", "water-resistant", "hypoallergenic", "nickel-free" are the core differentiators and are currently unsupported. Document the coating spec and any testing. This is E-E-A-T *and* consumer-protection.

### 3.3 — Fix product titles
101 characters, keyword-stuffed, truncating everywhere. Target ~60 characters, front-loading the distinctive product name.

### 3.4 — Resolve the positioning contradiction
Decide whether this is a luxury atelier or an accessible brass dailywear brand, and make the copy consistent. The SXO evidence points to the latter — **Zariin** (brass + gold plating, dailywear) is the closest comparable, and that segment is won with category and collection pages.

---

## Phase 4 — Performance and measurement (ongoing)

### 4.1 — Get real measurement first
**Configure a Google API key and connect GSC.** Right now there is no field data, no indexation data, and no traffic data — every performance conclusion in this audit is structural inference. This is the cheapest high-value step in the plan.

### 4.2 — Image and bundle work
- Convert the 320KB PNG hero to WebP/AVIF; add `width`/`height` to every image (guaranteed CLS win); preload the LCP image
- Route-based code-splitting for the 747KB bundle
- Trim the 4-family / 25-variant font request to what is actually used

### 4.3 — Style the prerender skeleton
None of `.site-header`, `.hero-section`, `.cta-btn`, `.category-page`, `.categories-section` exist in the shipped CSS. Add critical inline CSS so first paint isn't unstyled HTML on slow connections.

### 4.4 — Then the smaller technical items
Security headers (CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy); real per-route `lastmod` from git history; IndexNow; fill in the placeholder Bing/Pinterest verification codes; image sitemap entries for category pages.

---

## Sequencing Rationale

- **Phase 0 is independent** — ship it regardless of anything else. It is false-statement removal.
- **Phase 1 gates Phases 2–4.** Schema, titles, and canonicals cannot be validated while hydration overwrites them. Fixing routing first makes every later fix *verifiable*.
- **Phase 2 gates ROI.** Traffic to a 3-SKU store converts against 3 SKUs.
- **Phase 3 compounds** but needs Phase 1 to be indexed correctly.
- **Phase 4.1 should arguably happen first** — without GSC you cannot measure whether any of this worked.

## How to know it worked

Watch these rather than re-running a full audit:
- GSC Coverage: "Duplicate without user-selected canonical" and "Crawled – currently not indexed" trending down (Phase 1)
- GSC Enhancements → Products: valid items with **no** review-snippet warnings (Phase 0.1)
- Rich Results Test on a product URL **with JS rendering**: returns Product, not Organization (Phase 1.1)
- Impressions on non-brand informational queries (Phase 3.1)
- CrUX LCP/CLS entering "Good" once field data exists (Phase 4)
