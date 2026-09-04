# Full SEO Audit — avirenajewels.com

**Date:** 2026-09-04
**Target:** https://avirenajewels.com (live production)
**Business type:** E-commerce — D2C jewelry (brass with anti-tarnish e-coating, cultured freshwater pearls), Mumbai / India-primary market, INR pricing
**Stack:** Vite + React SPA, prerendered via `scripts/prerender.ts`, hosted on Vercel, Shopify Storefront API as headless commerce backend

---

## SEO Health Score: 38 / 100

| Category | Weight | Score | Weighted |
|---|---|---|---|
| Technical SEO | 22% | 35 | 7.7 |
| Content Quality | 23% | 30 | 6.9 |
| On-Page SEO | 20% | 40 | 8.0 |
| Schema / Structured Data | 10% | 25 | 2.5 |
| Performance (CWV) | 10% | 55 | 5.5 |
| AI Search Readiness | 10% | 41 | 4.1 |
| Images | 5% | 60 | 3.0 |
| **Total** | **100%** | | **37.7 → 38** |

**Score coverage caveat:** Content Quality, Performance, and SXO specialists were terminated by an API session rate limit before filing reports. Content and Performance scores are derived from partial specialist output plus my own direct verification, and carry lower confidence than the other categories. See *Audit Completeness* below.

---

## The One-Sentence Summary

The site's SEO **infrastructure** is genuinely well built — prerendering works, all 16 routes return 200 with unique titles and correct per-route JSON-LD — but a **single routing defect in `src/App.tsx` destroys that work the moment React hydrates**, and the underlying business has only **3 sellable products** behind a storefront advertising five categories.

---

## Executive Summary — Top 5 Critical Issues

### 1. Hydration destroys the correct prerendered SEO (Critical)
One defect, three symptoms. `src/App.tsx` `handleLocationChange()`:

- **Line ~130** — product lookup matches `p.id === parts[1]`, but live URLs use the **Shopify handle**. The match fails → falls to `default: setCurrentPage('home')` → `SeoMeta.tsx` overwrites the correct Product + BreadcrumbList JSON-LD with **homepage schema** on every product page.
- **Line ~139** — `case 'shop'` never reads `parts[1]`, so `/shop/bracelets` never sets `selectedCategory`. All five category URLs render the same unfiltered list.
- **Line ~231** — a second effect derives `targetPath` from `currentPage` alone and calls `pushState`, rewriting `/shop/earrings` → `/shop` (also pushing a junk history entry, breaking the back button) and overwriting the prerendered `<title>`.

Independently confirmed twice: by the schema specialist via a 13-second Playwright render (ruling out a timing race) and by my own source trace.

**Everything else on this list is gated behind this fix.** Repairing `prerender.ts` or the JSON-LD alone changes nothing, because hydration overwrites it regardless.

### 2. Fabricated review data sitewide (Critical — legal exposure, not just SEO)
- `scripts/prerender.ts` (~line 625) hardcodes an **identical** `aggregateRating` of `4.9` / `38 reviews` into **every** product page's JSON-LD.
- `src/lib/shopify.ts:542-543` hardcodes another fake pair (`rating: 4.9, reviewsCount: 24`).
- `src/data/products.ts` hardcodes per-product ratings (4.7–5.0) and counts (19–62), displayed as "(38 reviews)" at `ProductDetailPage.tsx:220` and `ProductCard.tsx:142`.

**There is no review collection system anywhere in the codebase.** This violates Google's structured-data policies (manual-action risk against the whole domain) and is a consumer-deception exposure under India's ASCI/CCPA advertising rules.

**Fix is removal, now.** Do not seed, backfill, or "estimate" reviews.

### 3. Catalog reality: 3 products, 5 advertised categories (Critical — business constraint)
I queried the Shopify Storefront API directly. The store contains **exactly 3 products, all earrings**. `src/data/products.ts` holds 19 designed pieces across 5 categories, but `prerender.ts` never reads that file — it is unused mock data illustrated with **41 Unsplash stock photos**.

Consequences: `/shop/necklaces`, `/rings`, `/bracelets`, `/brooches` are prerendered, sitemap-submitted, and have no inventory. `CollectionPage.tsx` *does* import the mock `PRODUCTS`, so users briefly see "ALL JEWELRY (19)" with placeholder tiles before it swaps to "(3)".

**No amount of SEO work raises revenue past a 3-SKU catalog.** This is the binding constraint on the entire channel.

### 4. Soft 404s on every invalid URL (Critical)
The unscoped `"source": "/(.*)"` rewrite in `vercel.json` returns **HTTP 200 + homepage** for any unmatched path — proven by byte-identical ETag (`52e43cfd6eb8766b045192d9d4252ee1`) and Content-Length on `/nonexistent-page-test-404` and `/indexnow.txt`.

This compounds with a **URL-scheme collision**: `SeoMeta.tsx:36,174` declares canonicals and `offers.url` as `/products/{local-id}` (plural), while real URLs are `/product/{shopify-handle}` (singular). `/products/lucid-studs` returns 200 serving the homepage — so JS-executing crawlers see product pages self-canonicalize to a URL that renders homepage content.

### 5. False material claims contradicting the actual product (Critical — advertising risk)
`src/lib/shopify.ts:547` contains dead code:
```ts
materials: (metal as string) === '18k Gold Vermeil' ? 'Heavy 18k Gold Vermeil over 925 Sterling Silver' : 'Solid 925 Sterling Silver',
```
`metal` is only ever assigned `'Gold-Tone Brass' | 'Anti-Tarnish Brass' | 'Silver-Tone Alloy' | 'Rose Gold-Tone'` two lines earlier, so the condition **can never be true** — every product silently gets `materials: 'Solid 925 Sterling Silver'` for what is a brass item.

The GEO specialist found the same fabricated positioning ("18k Gold Vermeil", "925 Sterling Silver", "Vicenza, Italy" atelier, `avirena.com` domain) hardcoded across six live templates and `public/llms.txt`.

**Verified nuance:** these false claims do **not** appear in the prerendered HTML (I grepped `/`, `/policies`, `/contact`, `/collections` — zero matches). They surface only after hydration. So non-JS AI crawlers currently see accurate brass copy; Googlebot's render pass and human view-source see the false claims.

`avirena.com` is a **real, unrelated third-party site** — a live brand-confusion risk.

---

## Top 5 Quick Wins

| # | Fix | Effort | Why it pays |
|---|---|---|---|
| 1 | Delete both fabricated `aggregateRating` blocks + displayed counts | ~30 min | Removes manual-action and ASCI exposure immediately |
| 2 | Fix `shopify.ts:547` materials ternary | 1 line | Stops false "sterling silver" claims on brass |
| 3 | Scope the `vercel.json` rewrite + ship `dist/404.html` | ~1 hr | Restores real 404s; the 16 routes are already static files |
| 4 | Strip static meta tags in `renderPageHtml()` before injecting | ~1 hr | Kills duplicate titles/descriptions and conflicting canonicals |
| 5 | Rewrite `public/llms.txt` from verified live facts | ~30 min | Stops feeding answer engines a wrong domain and wrong materials |

---

## Findings by Category

### Technical SEO — 35/100
**Works:** Prerendering is real and correct (`is_spa: false`); all 16 routes 200 with unique titles; HTTPS with HSTS `max-age=63072000`; http→https and www→non-www consolidate without loops; `/assets/*` immutable 1-year caching; correct mobile viewport; sitemap resolves and parses.

**Broken:**
- Soft 404 on all unmatched paths (Critical) — `vercel.json`
- Duplicate meta tags on every page; two conflicting canonicals on the homepage — `prerender.ts:147` injects without stripping `index.html`'s originals (High)
- Security headers absent: CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy. Only HSTS present, missing `includeSubDomains`/`preload` (High). `Access-Control-Allow-Origin: *` applied to HTML documents, not just assets.
- `http://www` is a 2-hop redirect chain (Low)
- IndexNow not implemented; Bing and Pinterest verification tags are still literal placeholders (`BING_WEBMASTER_VERIFICATION_CODE`) — neither is actually active (Info)

**Full detail:** `findings/technical.md`

### Content Quality — 30/100 *(reduced confidence — specialist cut short)*
- Category pages prerender to **only an `<h1>` and one sentence** — zero product links. Crawlers reach products via sitemap alone; no internal link equity flows.
- Five category URLs serve effectively identical hydrated content — duplicate content across the shop hierarchy.
- Brand positioning is internally contradictory: "luxury atelier / concierge / lost-wax casting / Vicenza" language against an actual brass dailywear product at ₹2,000–3,600.
- No substantiation for "anti-tarnish", "water-resistant", "hypoallergenic" claims anywhere on-site — an E-E-A-T and consumer-protection gap for claims that are the brand's core differentiator.
- `/journal` exists but has no real editorial content.

### On-Page SEO — 40/100
**Works:** Unique, intent-matched titles and descriptions per prerendered route; clean URL structure; correct `<html lang>`; OG and Twitter cards present.

**Broken:**
- Product titles are **101 characters**, keyword-stuffed, and truncate in every SERP surface
- Duplicate `<title>`/description/OG/Twitter blocks on every page
- Hydration replaces the correct prerendered title with a generic one
- `/policies` is live but **missing from the sitemap**
- Every `lastmod` is the build timestamp (`prerender.ts:222`), identical across all 16 URLs — a false freshness signal when git history already provides real per-file dates

### Schema — 25/100
**Works (in raw HTML only):** Organization, JewelryStore, WebSite+SearchAction, and per-product Product + BreadcrumbList are all syntactically valid and well-formed.

**Broken:**
- Hydration replaces Product schema with homepage schema (Critical)
- Fabricated `aggregateRating` on every product (Critical)
- Placeholder phone `+91-98200-12345` in Organization *and* JewelryStore (High)
- **Three conflicting street addresses** — `prerender.ts:120` "Heritage Craft Enclave, Bandra West"; `SeoMeta.tsx:124` "Suite 402, Heritage Craft Enclave, Bandra West"; `CheckoutPage.tsx:41` "14, Altamount Luxury Enclave, Cumballa Hill" (High)
- No `BreadcrumbList` on 5 category + 5 static pages; no `ItemList` anywhere (Medium)
- FAQPage present — **Info only**. Google retired FAQ rich results for all sites on 2026-05-07. Not recommending removal; noting its content is factually stale (references vermeil/sterling).

**Full detail:** `findings/schema.md`

### Performance — 55/100 *(lab/static only — no field data)*
**No Google API credentials are configured**, so CrUX field data — what actually feeds the Page Experience signal — is unavailable. No Lighthouse trace completed before the rate limit. These are structural risks, not measured scores.

- Hero `/logo.png` is a **320KB uncompressed PNG at 2128×739**, rendered near-full-width with `loading="eager"`, no `width`/`height`, no preload. Prime LCP suspect; WebP/AVIF would cut 60–80%.
- **No `width`/`height` on any image** — hero, product cards, or the 6 gallery images. Guaranteed CLS.
- Single JS bundle **747KB uncompressed** (Brotli on the wire), no code-splitting across 16 routes.
- Google Fonts: 4 families / ~25 variants in one render-blocking request (`&display=swap` present, so FOIT is mitigated).
- INP genuinely unknown — requires a runtime trace.

### AI Search Readiness — 41/100
**Works:** Excellent crawler posture — GPTBot, ChatGPT-User, PerplexityBot, ClaudeBot, Google-Extended, Applebot-Extended all explicitly allowed. Prerendering means non-JS AI crawlers get real content. All three `sameAs` social profiles resolve.

**Broken:** `llms.txt` — the file whose entire purpose is feeding authoritative brand facts to LLMs — contains the wrong domain, wrong contact email, wrong materials, and three fictitious atelier cities. Plus every NAP conflict above, fabricated CIN/GSTIN, and mismatched shipping thresholds (₹1,999 vs ₹3,000).

Notable content gap: **no accurate answer anywhere to "does brass jewelry turn skin green"** — the single most common objection for this product category.

**Full detail:** `findings/geo.md`

### Images — 60/100
- All 41 images in the unused mock catalog are **Unsplash stock photos** — a brand-authenticity risk if that data ever renders (and it briefly does, pre-hydration).
- Live product images are `.png` on Shopify CDN, not WebP/AVIF.
- Image sitemap has entries only for the homepage logo and 3 products — zero for 5 category pages.
- No dimensions on any `<img>`.

### Search Experience (SXO) — partial
The specialist was cut short but returned one decisive, evidence-backed result before stopping: **"does brass jewelry turn skin green" is 100% dominated by editorial blog articles** — pure informational intent this brand has no page for. And **"dailywear jewellery brand india" is dominated by category/collection pages** from GIVA, Tyaani, BlueStone, Candere, and Zariin — with Zariin (brass + gold plating, dailywear positioning) identified as the closest comparable model.

---

## Visual / Mobile

Confirmed by screenshot: `/shop/bracelets` renders a masthead reading **"ALL JEWELRY (3)"** showing three earrings — not bracelets. An earlier capture of the same page type shows **"ALL JEWELRY (19)"** with empty beige placeholder tiles: the mock-catalog flash.

Separately verified: the prerendered skeleton uses classes (`.site-header`, `.hero-section`, `.cta-btn`, `.category-page`, `.categories-section`) that have **zero occurrences** in the shipped stylesheet. First paint is therefore completely unstyled browser-default HTML until React hydrates — most visible on the slow mobile connections that dominate the target market.

**Full detail:** `findings/visual.md`

---

## Audit Completeness

| Specialist | Status |
|---|---|
| Technical | ✅ Complete |
| Schema | ✅ Complete (resumed past turn limit) |
| Sitemap | ✅ Complete |
| GEO | ✅ Complete |
| E-commerce | ✅ Report filed before rate limit |
| Visual | ✅ Report filed before rate limit |
| Content / E-E-A-T | ⚠️ Terminated by API rate limit — no file |
| Performance / CWV | ⚠️ Terminated by API rate limit — no file |
| SXO | ⚠️ Terminated by API rate limit — no file (partial findings captured above) |

Not run (no credentials): `seo-google` (GSC/CrUX/GA4), `seo-backlinks` beyond Common Crawl tier, `seo-maps`/`seo-local`, `seo-dataforseo`.

**No search volumes, rankings, traffic figures, or SERP positions appear in this report** — none were measurable without credentials, and none were estimated.
