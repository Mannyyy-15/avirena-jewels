# Schema.org / Structured Data Audit — avirenajewels.com

Audit date: 2026-09-04
Scope: Homepage, 3 live product pages, category/collection pages, source of truth `scripts/prerender.ts` (static prerender) and `src/components/SeoMeta.tsx` (client-side hydration overwrite).

Note on methodology: this site ships **two independent JSON-LD generators that write to the same `<script id="dynamic-jsonld-schema">` tag**. `scripts/prerender.ts` bakes correct static JSON-LD into the HTML at build time. `src/components/SeoMeta.tsx` then **overwrites that same tag at runtime** via `document.getElementById('dynamic-jsonld-schema').textContent = ...` once React hydrates. Any consumer that only fetches raw HTML (curl, some crawlers) sees the prerendered version; any consumer that executes JavaScript (Google's rendering pipeline, Playwright, real browsers) sees whatever `SeoMeta.tsx` produces after `App.tsx` finishes routing. These two outputs are **inconsistent with each other**, and on product pages the runtime version is currently broken (Finding 1).

---

## Finding 1 — CRITICAL: Client-side hydration destroys Product/BreadcrumbList schema on every PDP

**Evidence:**
- Raw HTML (curl, no JS) at `https://avirenajewels.com/product/geometric-gold-tone-statement-earrings-for-women-modern-square-earrings` contains correct types: `Product, Offer, Brand, AggregateRating, MerchantReturnPolicy, BreadcrumbList` (5,684 bytes), sourced from `scripts/prerender.ts` lines 588-654.
- The same URL rendered with a full headless-browser pass (Playwright, 13.2s render time, zero console errors, `render_diagnostics: []`) drops all of that and instead emits only `Organization, JewelryStore, WebSite, FAQPage` — i.e. **the homepage schema set**. Confirmed reproducible, not a timing fluke (retested with 30s navigation timeout).
- Root cause is in `src/App.tsx`, `handleLocationChange()` (~lines 116-178): it parses the URL, does `storeProducts.find(p => p.id === parts[1])`, and only calls `setCurrentPage('pdp')` if a match is found; otherwise it falls through to `default: setCurrentPage('home')` (line 170). `storeProducts` comes from `useShopify()` (`src/context/ShopifyContext.tsx` / `src/lib/shopify.ts`), an async Storefront API fetch. When resolution of `currentPage` is captured as `'home'` (as observed), `src/components/SeoMeta.tsx`'s FAQPage condition `currentPage === 'faq' || currentPage === 'home'` (line 227) fires, and the `currentPage === 'pdp' && selectedProduct` branch (line 159) that builds Product/Offer/AggregateRating never runs. `SeoMeta.tsx` then calls `scriptTag.textContent = JSON.stringify(schemas)` (line 276), unconditionally clobbering the good prerendered markup with the wrong set.
- Google indexes based on the **rendered DOM**, not raw HTML, for JS-driven sites — meaning the Product rich result eligibility, Merchant Center feed potential, and correct canonical (`offers.url`) for all 3 live products are at risk of being invisible to Google despite the prerendered HTML looking correct in view-source.

**Fix:**
1. In `src/App.tsx`, `handleLocationChange()`: do not fall through to `'home'` when `root === 'product'` but the product isn't found yet (e.g., because `storeProducts` hasn't loaded). Add a distinct `'pdp-loading'` state, or gate routing on `isConfigured`/a loaded flag from `useShopify()`, so the app never mis-resolves a product route as the homepage.
2. In `src/components/SeoMeta.tsx`, stop having client JS overwrite JSON-LD that was already correctly prerendered. Either (a) remove `SeoMeta.tsx`'s JSON-LD injection entirely and rely solely on `scripts/prerender.ts` output (recommended — single source of truth), or (b) if client-side re-rendering must stay for SPA navigation, make it byte-compatible with the prerender source (same address, same phone, same URL pattern, same FAQ set) and add a guard so it never emits `FAQPage`-as-fallback for an unresolved PDP route.

**Falsifiability:** Re-run `render_page.py --mode always --timeout-ms 30000 --json` (or Google's Rich Results Test / URL Inspection "Tested page > View Crawled Page > Screenshot/HTML") against any of the 3 product URls below. If the rendered DOM's `#dynamic-jsonld-schema` contains `Product`/`Offer`/`BreadcrumbList`, this finding is resolved; if it contains `FAQPage`/`JewelryStore` instead, it reproduces.

---

## Finding 2 — CRITICAL: Fabricated `aggregateRating` on every product (identical values, no review system exists)

**Evidence:**
- `scripts/prerender.ts` ~line 624-628 hardcodes the exact same block on **every** Shopify product with no per-product variance:
  ```js
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '38' }
  ```
  All 3 live products (`geometric-gold-tone-statement-earrings...`, `gold-tone-drop-earrings...`, `gold-tone-statement-drop-earrings...`) get identical `4.9` / `38` — confirmed in the fetched raw JSON-LD for all three (5,684 / 5,663 / 5,671 byte blocks all containing `AggregateRating`).
- Separately, `src/data/products.ts` (unused mock data — the live store's 3 real products come from Shopify, not this file) hardcodes per-product `rating` (4.7–5.0) and `reviewsCount` (19–62) literals, and `src/components/SeoMeta.tsx` line 220 falls back to `selectedProduct.rating || '4.9'` / `selectedProduct.reviewsCount || '38'` — same fabricated pattern carried into the client-side generator.
- These numbers are displayed to shoppers as if real: `src/pages/ProductDetailPage.tsx:220` renders `({product.reviewsCount} reviews)`, and `src/components/ProductCard.tsx:142` does the same on listing cards.
- There is no review collection, submission, or moderation system anywhere in the codebase. No `Review` objects exist to back the `AggregateRating`.

**Why Critical:** This is fabricated review data, not a missing-property gap. Google's structured data policies explicitly prohibit review/rating markup that doesn't reflect genuine user-submitted reviews and carry manual-action risk (loss of all rich results, and in repeat cases, broader Search visibility penalties on the domain). In India this also carries CCPA-adjacent/ASCI consumer-deception exposure for advertising a review count/score no customer ever produced.

**Fix — do not seed or fabricate reviews to "back" this markup.** Remove the block and the on-page counts until a genuine review pipeline exists:
1. `scripts/prerender.ts`: delete the `aggregateRating` key entirely from the `Product` object (lines 624-628).
2. `src/components/SeoMeta.tsx`: delete the `aggregateRating` key from the PDP schema (lines 218-223).
3. `src/pages/ProductDetailPage.tsx:220` and `src/components/ProductCard.tsx:142`: remove or replace the `({product.reviewsCount} reviews)` UI display, since it's sourced from the same non-existent data.
4. If/when a real review system (verified purchases, e.g. via Shopify Product Reviews, Judge.me, Yotpo, or a custom pipeline) is implemented, re-add `aggregateRating`/`review` populated from real data only.

**Falsifiability:** Compare `ratingValue`/`reviewCount` across the 3 live product JSON-LD blocks — if all three still read `4.9`/`38` identically with no backing review store, the finding stands. Search the codebase for any `Review`-writing code path (`grep -r "type.*Review\|submitReview\|POST.*review"`) — none currently exists.

---

## Finding 3 — HIGH: Placeholder/fabricated NAP (phone) in Organization and JewelryStore schema

**Evidence:**
- `telephone: '+91-98200-12345'` appears in `scripts/prerender.ts` lines 101 and 114 (Organization `contactPoint` and JewelryStore), duplicated in `src/components/SeoMeta.tsx` lines 103 and 118, and also used as the WhatsApp deep link on `src/pages/ContactPage.tsx` line 143 (`https://wa.me/919820012345`).
- Despite being used consistently across the codebase, this is a placeholder-pattern number (`98200-12345` — a sequential/dummy-looking number, not a real assigned Indian mobile line), confirmed against `public/llms.txt`, which describes an entirely different brand contact model (`concierge@avirena.com`, domain `avirena.com`, no phone number listed at all) — i.e. the authoritative brand-facts manifest doesn't corroborate this number as real.
- Publishing a non-working or placeholder phone number in `Organization.contactPoint` and `LocalBusiness.telephone` is a NAP (Name/Address/Phone) integrity problem: it can suppress or misrepresent local-pack/knowledge-panel eligibility and directly harms customer trust if dialed.

**Fix:** Replace `+91-98200-12345` with the atelier's real, currently-monitored support/WhatsApp number in both `scripts/prerender.ts` (2 occurrences) and `src/components/SeoMeta.tsx` (2 occurrences), and update the WhatsApp link on `ContactPage.tsx` to match. Do not publish any telephone value in schema that isn't answered/monitored.

**Falsifiability:** Call or WhatsApp-message +91 98200 12345 during India business hours; if unanswered/unmonitored/non-existent, the finding is confirmed. Cross-check against `public/llms.txt` and any real business registration/GST document for the actual support line.

---

## Finding 4 — HIGH: NAP address mismatch between schema and visible Contact page (two different street addresses for the same location)

**Evidence:**
- `scripts/prerender.ts` line 120: `streetAddress: 'Heritage Craft Enclave, Bandra West'`.
- `src/components/SeoMeta.tsx` line 124: `streetAddress: 'Suite 402, Heritage Craft Enclave, Bandra West'` (the client-side generator, which — per Finding 1 — is what a JS-executing crawler actually loads on non-home pages).
- `src/pages/ContactPage.tsx` line 341 (visible on-page text): `"Waterfield Road, Bandra West, Mumbai 400050, India"`.
- Three different street-address strings for the same claimed physical location, same postal code (400050). This is a textbook NAP-inconsistency problem: Google cross-references the schema address against on-page text and other citations (GMB/Maps, directories) — inconsistent NAP data suppresses local ranking confidence and can prevent Knowledge Panel address matching entirely.
- Additionally, `public/llms.txt` lists atelier locations as "Mumbai (India), Jaipur (India), Vicenza (Italy)" with no Bandra West detail at all, and a different domain/contact entirely — this file is stale/unreconciled with the live site and should not be treated as corroborating evidence either way, but its divergence is itself worth flagging separately from schema (see Finding 8).

**Fix:** Pick one authoritative address (matching whatever is on the Google Business Profile / legal registration) and make `scripts/prerender.ts`, `SeoMeta.tsx`, and `ContactPage.tsx` all use the identical string, including suite/unit if applicable.

**Falsifiability:** Diff the `streetAddress` value across the three files/URLs above; if they don't match verbatim, the finding reproduces. Cross-check against Google Business Profile listing for "Studio Avirena Atelier" if one exists.

---

## Finding 5 — MEDIUM: BreadcrumbList missing on category pages and most static pages

**Evidence:**
- BreadcrumbList **is present and correct** on: `/shop` (`scripts/prerender.ts` lines 333-350), `/collections` (lines 415-431), and every `/product/:handle` page (lines 630-654) — confirmed live via raw fetch for `/collections` (`BreadcrumbList` present) and product pages.
- BreadcrumbList **is absent** on the 5 category routes generated in the `for (const cat of categories)` loop (`scripts/prerender.ts` lines 375-401, covering `/shop/earrings`, `/shop/necklaces`, `/shop/rings`, `/shop/bracelets`, `/shop/brooches`) — confirmed live: raw fetch of `/shop/earrings` returns only `CollectionPage, JewelryStore, Organization, WebSite` types, no `BreadcrumbList`.
- Also absent on `/about`, `/contact`, `/faq`, `/policies`, `/journal` (routes at lines 442-576 only push `AboutPage`/`ContactPage`/`FAQPage`/nothing extra — no `BreadcrumbList` object added).

**Impact:** Breadcrumb rich results are a real, still-active Google SERP feature (unlike FAQPage) and directly aid category-page CTR for an e-commerce site with 5 distinct jewelry categories.

**Fix:** Add a `BreadcrumbList` object to each category route inside the `categories.map`/`for` loop and to the remaining static routes. Ready-to-paste addition for the category loop in `scripts/prerender.ts` (insert into the `jsonLd` array alongside the existing `CollectionPage`):

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://avirenajewels.com/" },
    { "@type": "ListItem", "position": 2, "name": "Shop All Jewelry", "item": "https://avirenajewels.com/shop" },
    { "@type": "ListItem", "position": 3, "name": "{{cat.title}}", "item": "https://avirenajewels.com/shop/{{cat.id}}" }
  ]
}
```
(substitute `{{cat.title}}` / `{{cat.id}}` with the loop variable, matching the existing template-literal style already used for `/shop` and `/collections` breadcrumbs in the same file).

**Falsifiability:** Fetch raw HTML for `/shop/earrings`, `/about`, `/contact`, `/faq`, `/policies`, `/journal` and check `structured_data.blocks[].types` for `BreadcrumbList`; absence reproduces the finding.

---

## Finding 6 — MEDIUM: Category pages have no `ItemList`/product inventory signal, despite only 3 real products existing

**Evidence:**
- The live Shopify store (queried via the Storefront API endpoint the site itself uses, `m5yhxq-gb.myshopify.com`, per `scripts/prerender.ts` line 12) currently has only **3 products, all earrings**. `src/data/products.ts` (19 mock products across rings/necklaces/bracelets/brooches) is dead mock data never surfaced to the live site — `scripts/prerender.ts` only ever prerenders `shopifyProducts` fetched live (line 216 `fetchShopifyProducts()`).
- Consequently, `/shop/necklaces`, `/shop/rings`, `/shop/bracelets`, `/shop/brooches` are `CollectionPage` schema blocks describing categories that **currently contain zero real products** — a content/schema mismatch, not just a missing-opportunity gap. `CollectionPage` schema implies there's a page-relevant list of items; there isn't one behind 4 of the 5 categories today.
- `/shop` and the category pages also lack `ItemList` (`mainEntity`/`hasPart`) tying the `CollectionPage` to actual product URLs, which is a genuine missed opportunity for the one category (`/shop/earrings`) that does have inventory.

**Fix:**
1. Short-term: for the 4 empty categories, either noindex them or remove `CollectionPage` schema until they have inventory (schema describing an empty category can look thin/misleading to Google).
2. For `/shop/earrings` (and any category once populated), add an `ItemList` referencing the real product URLs, e.g.:

```json
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Earrings Collection | AVIRENA",
  "url": "https://avirenajewels.com/shop/earrings",
  "description": "Sculptural molten studs, organic drop earrings, and huggies in anti-tarnish brass.",
  "mainEntity": {
    "@type": "ItemList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "url": "https://avirenajewels.com/product/geometric-gold-tone-statement-earrings-for-women-modern-square-earrings" },
      { "@type": "ListItem", "position": 2, "url": "https://avirenajewels.com/product/gold-tone-drop-earrings-for-women-minimalist-long-dangle-earrings" },
      { "@type": "ListItem", "position": 3, "url": "https://avirenajewels.com/product/gold-tone-statement-drop-earrings-for-women-geometric-dangle-earrings" }
    ]
  }
}
```
This should be generated dynamically in `scripts/prerender.ts`'s category loop by filtering `shopifyProducts` by `productType`/tag matching `cat.id`, not hardcoded.

**Falsifiability:** Query the Shopify Storefront API product count/types directly, or view `/shop/necklaces` etc. live — if product grids are empty while `CollectionPage` schema is present, this reproduces.

---

## Finding 7 — LOW/INFO: FAQPage present (no Google SERP benefit as of the 2026-05-07 retirement)

**Evidence:** `FAQPage` schema present on homepage (`scripts/prerender.ts` lines 244-263, 2 questions) and on `/faq` (lines 510-529, 2 different questions), plus a third, non-matching 4-question variant in `src/components/SeoMeta.tsx` lines 227-266 that fires for `currentPage === 'home'` — meaning even the FAQPage content itself is inconsistent between prerendered and client-rendered output (materials/pearls questions on the static home page vs. gold-vermeil/hypoallergenic/pearls/shipping questions client-side — note this content also factually conflicts with the live site's brass/anti-tarnish positioning, describing "18k gold vermeil" and "925 sterling silver," which matches `llms.txt`'s outdated brand description, not the current brass-based site copy).

**Severity: Info only**, per current guidance — Google retired FAQ rich results for all sites on 2026-05-07; this markup carries no confirmed Google SERP benefit today, and any AI/LLM citation benefit is unconfirmed. **Do not remove for that reason alone**, and do not add new FAQPage instances expecting a SERP feature.

**Separate, real issue worth fixing independent of FAQPage's SERP status:** the FAQ *content itself* is self-contradictory across the three copies (brass vs. 18k gold vermeil/sterling silver) and should be reconciled to whatever the current product material actually is, since factually wrong Q&A content is a trust problem regardless of rich-result eligibility.

**Falsifiability:** Compare the 3 FAQPage question sets (prerender home, prerender /faq, SeoMeta.tsx) — divergent content confirms the inconsistency claim independent of the SERP-retirement severity call.

---

## Finding 8 — INFO: `public/llms.txt` brand-facts manifest is stale and contradicts the live site and schema

**Evidence:** `public/llms.txt` states website `https://avirena.com` (not `avirenajewels.com`), contact `concierge@avirena.com` (no phone), atelier locations "Mumbai (India), Jaipur (India), Vicenza (Italy)" (no Bandra West), and material claims of "3.0-Micron 18k Heavy Gold Vermeil" / "100% recycled solid 925 sterling silver" — none of which match the live site's brass/anti-tarnish-coating positioning or the JewelryStore schema's Bandra West address.

**Impact:** Not itself Schema.org markup, but since AI answer engines and LLM crawlers are explicitly invited to read this file (per its own header and the site's `robots.txt` GPTBot/ClaudeBot/PerplexityBot allowances), a stale manifest actively feeds wrong brand facts to exactly the audience it's meant to serve, and undermines the "AEO" intent it's clearly designed for.

**Fix:** Regenerate `public/llms.txt` from the same source of truth as `scripts/prerender.ts` (domain, materials, address, contact) so it can't drift independently again — ideally generate it programmatically in the same build step.

**Falsifiability:** Diff `public/llms.txt` claims against `scripts/prerender.ts`/live site copy; divergence as listed confirms this.

---

## Ready-to-paste corrected Product JSON-LD (Findings 1 + 2 combined fix)

Replace the `Product` object in `scripts/prerender.ts` (~lines 590-629) and the equivalent block in `src/components/SeoMeta.tsx` (~lines 160-223) with:

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Geometric Gold-Tone Statement Earrings for Women | Modern Square Earrings",
  "image": [
    "https://cdn.shopify.com/REPLACE_WITH_REAL_IMAGE_1.jpg",
    "https://cdn.shopify.com/REPLACE_WITH_REAL_IMAGE_2.jpg"
  ],
  "description": "REPLACE_WITH_REAL_SHOPIFY_DESCRIPTION",
  "sku": "geometric-gold-tone-statement-earrings-for-women-modern-square-earrings",
  "brand": {
    "@type": "Brand",
    "name": "Avirena Jewels"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://avirenajewels.com/product/geometric-gold-tone-statement-earrings-for-women-modern-square-earrings",
    "priceCurrency": "INR",
    "price": "REPLACE_WITH_REAL_PRICE",
    "priceValidUntil": "2027-12-31",
    "itemCondition": "https://schema.org/NewCondition",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "Avirena Jewels"
    },
    "hasMerchantReturnPolicy": {
      "@type": "MerchantReturnPolicy",
      "applicableCountry": ["IN", "US", "GB", "EU"],
      "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
      "merchantReturnDays": 14,
      "returnMethod": "https://schema.org/ReturnByMail",
      "returnFees": "https://schema.org/FreeReturn"
    }
  }
}
```

Notes on this replacement:
- `aggregateRating` is deliberately omitted — do not reintroduce it until real, verified customer reviews exist.
- Keep the existing `BreadcrumbList` sibling object from `scripts/prerender.ts` lines 630-654 as-is; it is correctly formed. Just ensure `src/components/SeoMeta.tsx` also emits it on `pdp` (it currently does not emit any `BreadcrumbList` at all).
- Once `App.tsx`'s routing bug (Finding 1) is fixed so `currentPage === 'pdp'` reliably resolves, `SeoMeta.tsx` should build this same object from `selectedProduct` fields, not divergent ones — recommend deleting `SeoMeta.tsx`'s JSON-LD injection entirely and trusting only the prerendered markup, since SPA client-side re-injection provides no benefit once prerendering already covers this correctly for the bots that matter.

## Ready-to-paste corrected Category page JSON-LD (Findings 5 + 6 combined fix)

For `/shop/earrings` (the only category with real inventory today):

```json
[
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Earrings Collection | AVIRENA",
    "url": "https://avirenajewels.com/shop/earrings",
    "description": "Sculptural molten studs, organic drop earrings, and huggies in anti-tarnish brass."
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://avirenajewels.com/" },
      { "@type": "ListItem", "position": 2, "name": "Shop All Jewelry", "item": "https://avirenajewels.com/shop" },
      { "@type": "ListItem", "position": 3, "name": "Earrings", "item": "https://avirenajewels.com/shop/earrings" }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "url": "https://avirenajewels.com/product/geometric-gold-tone-statement-earrings-for-women-modern-square-earrings" },
      { "@type": "ListItem", "position": 2, "url": "https://avirenajewels.com/product/gold-tone-drop-earrings-for-women-minimalist-long-dangle-earrings" },
      { "@type": "ListItem", "position": 3, "url": "https://avirenajewels.com/product/gold-tone-statement-drop-earrings-for-women-geometric-dangle-earrings" }
    ]
  }
]
```

For the other 4 categories (`necklaces`, `rings`, `bracelets`, `brooches`), add only the `BreadcrumbList` (matching pattern, swapping name/URL) until real inventory exists; withhold `CollectionPage`/`ItemList` until products are behind them.

---

## Summary Table

| # | Finding | Severity | Location |
|---|---|---|---|
| 1 | Client-side hydration overwrites correct Product/BreadcrumbList schema with homepage schema on every PDP | Critical | `src/App.tsx` (`handleLocationChange`), `src/components/SeoMeta.tsx` |
| 2 | Fabricated identical `aggregateRating` (4.9/38) on every product, no review system exists | Critical | `scripts/prerender.ts` L624-628, `src/components/SeoMeta.tsx` L218-223, `src/data/products.ts`, `ProductDetailPage.tsx` L220, `ProductCard.tsx` L142 |
| 3 | Placeholder/unverified phone number in Organization + JewelryStore schema | High | `scripts/prerender.ts` L101, L114; `src/components/SeoMeta.tsx` L103, L118; `ContactPage.tsx` L143 |
| 4 | Three conflicting street addresses for the same claimed location (NAP inconsistency) | High | `scripts/prerender.ts` L120; `src/components/SeoMeta.tsx` L124; `ContactPage.tsx` L341 |
| 5 | BreadcrumbList missing on 5 category pages + 5 static pages | Medium | `scripts/prerender.ts` category loop L375-401, and About/Contact/FAQ/Policies/Journal routes |
| 6 | CollectionPage schema on 4 categories with zero real inventory; no ItemList anywhere | Medium | `scripts/prerender.ts` L366-401 |
| 7 | FAQPage present, content inconsistent across 3 copies, factually stale (gold vermeil vs. brass) | Info | `scripts/prerender.ts` L244-263, L510-529; `src/components/SeoMeta.tsx` L227-266 |
| 8 | `llms.txt` brand manifest stale/contradicts live site and schema | Info | `public/llms.txt` |

What is correct and should be preserved as-is: `@context` uses `https://schema.org` throughout; no deprecated types (`HowTo`, `SpecialAnnouncement`, `CourseInfo`) present anywhere; JSON-LD format used exclusively (no Microdata/RDFa); dates are ISO 8601 (`priceValidUntil: "2027-12-31"`); `Offer.availability`/`itemCondition` use correct full schema.org URLs; `MerchantReturnPolicy` structure on all 3 product pages is complete and correctly typed; prerendered `BreadcrumbList` on `/shop`, `/collections`, and product pages is correctly formed with absolute URLs.
