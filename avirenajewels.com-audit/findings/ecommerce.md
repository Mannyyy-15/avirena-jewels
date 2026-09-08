# E-commerce SEO Audit — avirenajewels.com

Scope: 9-product live catalog (all earrings), headless React/Vercel storefront, Shopify Storefront API backend, static prerender via `scripts/prerender.ts`. All findings below are from direct code inspection (`d:/ThePieCraft Marketing/Web Development/avirena-jewels`) and live fetches of `https://avirenajewels.com` (raw/pre-JS HTML, mode=never). No DataForSEO or Google API data used — no search volume, SERP position, or competitor pricing is asserted anywhere in this report.

Live catalog verified (coordinator-supplied, from a fresh Shopify pull — supersedes the ₹499–779 range in the original brief):

| Product | Handle | Price |
|---|---|---|
| Avirena Square Studs | avirena-square-studs-gold-tone-brass-earrings | ₹799 |
| Avirena Drop Earrings | avirena-drop-earrings-gold-tone-brass | ₹699 |
| Avirena Statement Drops | avirena-statement-drops-geometric-brass-earrings | ₹1199 |
| Avirena Heart Drops | avirena-heart-drops-silver-tone-earrings | ₹799 |
| Avirena Spiral Earrings | avirena-spiral-earrings-silver-tone | ₹599 |
| Avirena Crystal Hoops — Gold | avirena-crystal-hoops-gold-tone-earrings | ₹699 |
| Avirena Crystal Hoops — Silver | avirena-crystal-hoops-silver-tone-earrings | ₹649 |
| Avirena Pebble Studs | avirena-pebble-studs-gold-tone-earrings | ₹699 |
| Avirena Leaf Studs | avirena-leaf-studs-gold-tone-earrings | ₹749 |

All 9 confirmed `availableForSale=true` and all 9 confirmed present as real `<a href="/product/...">` links in the prerendered `/shop` HTML (raw fetch, mode=never — no JS executed).

---

## Critical

### C1. "Under ₹999" smart collection is now mis-titled for its own member
**Evidence:** Every product carries the tag `under-999` (per coordinator's live Shopify verification), applied when all 9 products were priced ₹499–779. "Avirena Statement Drops" has since been repriced to ₹1199. The Shopify smart collection "Under ₹999" is rule-based on that tag (per task brief: "Shopify smart collections exist... Under ₹999 — all rule-based on tags"), so a ₹1199 product now appears inside a collection whose name promises sub-₹999 pricing.
**Impact:** This is a shopper-trust problem (bait-and-switch perception, refund/chargeback risk) as much as an SEO one — if that collection is indexed/linked (e.g. via a promo page, category nav, or a future Merchant Center promotion feed built off the collection), it actively misleads both users and any crawler/feed reading collection-level price claims.
**Fix:** Either (a) remove the `under-999` tag from Statement Drops now, or (b) convert the "Under ₹999" collection from a tag condition to a **price** condition (`Price < 999`) in Shopify's smart collection rule builder. Option (b) is strictly better: it self-corrects on every future repricing with zero manual tagging, which matters because this exact drift will recur every time a price changes and someone forgets the tag.
**Falsifiable:** Open Shopify Admin → Products → Avirena Statement Drops → confirm tag `under-999` present and price ₹1199. Open Collections → "Under ₹999" → confirm its condition type is `tag` not `price`, and confirm Statement Drops appears in the collection's product list.

---

## High

### H1. Buy Now bypasses the cart and loses the ₹1,999 free-shipping nudge entirely
**Evidence:** `src/pages/ProductDetailPage.tsx:233-256` — `handleBuyNow()` calls `syncLocalCartToShopify([{ ...single item... }])` and immediately does `window.location.href = checkoutUrl` (line 244), sending the shopper straight to Shopify's hosted checkout. It deliberately "does NOT touch the local bag" (comment at line 224-228). The free-shipping progress bar exists only in `src/components/CartDrawer.tsx:29,52-53` (`FREE_SHIPPING_THRESHOLD_INR = 1999`) and `src/pages/CartPage.tsx:26,43-44` — both are cart-only UI. There is no free-shipping messaging anywhere on the product detail page itself (confirmed by reading the full PDP render tree, and by the prerendered PDP HTML, which contains only `<p class="price">` and the description — no shipping-threshold copy).
**Impact:** At the verified per-unit prices (₹599–1199), a single Buy Now purchase is always below ₹1,999 and always incurs the flat ₹99 shipping fee stated in `src/pages/PoliciesPage.tsx:146`. Buy Now shoppers never see the "add ₹X more for free shipping" nudge that could have pushed them to add a second item (raising AOV and clearing the threshold) because they never enter the cart drawer or cart page at all. This is a conversion/AOV issue with an SEO-adjacent dimension: it undermines the value proposition ("Free delivery over ₹1,999") stated in the very meta description Google indexes for `/shop` (`scripts/prerender.ts` ~line 618: *"Free delivery over ₹1,999 and 14-day exchanges across India"*) — a shopper who lands from that snippet and clicks Buy Now will be charged shipping despite what the SERP snippet implied, unless they cross the threshold another way.
**Fix:** Surface the free-shipping threshold inline near the Buy Now / Add to Bag buttons on the PDP (e.g. "Add ₹1,300 more to unlock free shipping" or "Buy 2+ pieces for free delivery"), and/or offer a lightweight upsell ("Perfect match with" — see C-adjacent finding L1 below) before Buy Now fires, since that section already exists on the page but currently has no cart-value awareness. Do not silently remove the ₹99 fallback fee; make it visible pre-checkout instead of only in policies.
**Falsifiable:** Visit any `/product/avirena-*` page, click Buy Now with no other cart activity — confirm no free-shipping copy is shown at any point before Shopify's hosted checkout, and confirm Shopify checkout charges ₹99 shipping on a sub-₹1,999 single-item order.

### H2. Zero cross-sell links exist in prerendered HTML; the hydrated "Perfect match with" section uses JS click-handlers, not real links
**Evidence:**
- `scripts/prerender.ts` product-route `htmlContent` (~lines 1236-1263) contains only breadcrumb nav, `<h1>`, gallery images, price, and description — no related-product markup of any kind. Confirmed live: fetching `https://avirenajewels.com/product/avirena-crystal-hoops-gold-tone-earrings` and `.../avirena-crystal-hoops-silver-tone-earrings` with `render_page.py --mode never` (no JS executed) returns **zero** `/product/` links on either page (`PRODUCT LINKS ON PAGE: []` for both).
- The hydrated, client-side-only "Perfect match with" block does exist (`src/pages/ProductDetailPage.tsx:828-877`) and lists up to 3 `complementaryItems` (line 274-276, simply `activeProducts` minus the current product, no relevance logic). But its click targets are not anchors: the product-preview `<div>` uses `onClick={() => onSelectProduct(item)}` (line 843) and the "Add to cart" control is a `<button onClick={() => handleQuickAddRecommendation(item)}>` (lines 869-874). `onSelectProduct` resolves to `handleSelectProduct` in `src/App.tsx:504-510`, which only calls `setSelectedProduct`/`setCurrentPage` (React state) — the URL is patched afterward via `pushState` in a `useEffect` (App.tsx:495-500), not via a native `<a href>`. There is no `href` attribute anywhere in that block.
**Impact:** Internal PageRank/link-equity flow between the 9 product pages is effectively zero from a crawler's perspective — both in the static HTML Googlebot sees on first pass and in the hydrated DOM, since the "links" are synthetic JS click targets rather than crawlable anchors. This also means Googlebot's second-wave (JS) rendering pass gets no additional internal links either, only interaction handlers it won't invoke. For a 9-SKU catalog, product-to-product linking is one of the few internal-linking levers available (no blog/category depth to lean on), and it's currently unused.
**Fix:** Two changes, not one — (1) add real crawlable cross-sell links to the prerendered PDP `htmlContent` in `scripts/prerender.ts` (simple: reuse `renderProductCards()`, excluding the current handle, same pattern already used on `/shop` and category pages); (2) change the hydrated "Perfect match with" tile from `<div onClick>` to a proper `<Link>`/`<a href="/product/{handle}">` wrapping the clickable area (client-side router can still intercept the click for SPA navigation, but the anchor tag itself must be present so both crawlers and users get a real href, e.g. for open-in-new-tab / view-source consistency).
**Falsifiable:** `render_page.py <product-url> --mode never` on any of the 9 product pages and grep for `/product/` — currently returns none. After a fix, expect 2–3 real anchor-tag links per product page pointing at other in-stock products.

### H3. Merchant Center / Google Shopping free-listing feed is not buildable today — three concrete blockers
Assessed against Google Merchant Center's minimum required product-data fields (id, title, description, link, image_link, price, availability, condition, shipping — brand/GTIN/MPN required where applicable for most categories, plus a valid returns/shipping policy for India).

- **B1 — No product feed exists.** No `merchant_center` feed file, no `google_product_feed` script, and no reference to Content API / Merchant Center in `package.json`, `scripts/`, or `.env.example` (grep across the repo found nothing). Shopify's native "Google & YouTube" sales channel app is the fastest path (auto-generates a feed from the same Storefront/Admin data already in use) but there is no evidence it is installed — **not verified** from this repo alone; requires checking the live Shopify Admin's installed-apps list, which is outside this audit's access.
- **B2 — GTIN/brand/identifier gap.** The `Product` JSON-LD emitted per product (`scripts/prerender.ts` ~lines 1153-1225) sets `brand.name: "Avirena Jewels"` but has no `gtin`, `mpn`, or `identifier_exists: false` fallback. Google Shopping requires either a GTIN/MPN pair or an explicit `identifier_exists=false` declaration for private-label goods; without it, Merchant Center will flag every item under "missing required unique product identifiers" and can suppress the listing. Fix is low-cost: add `"identifier_exists": false` to the Product schema now that no GTINs exist, and set it to true once real GTINs are assigned.
- **B3 — New India merchant account has zero trust signals to submit alongside the feed.** No review/rating markup exists anywhere by explicit design (per project memory — `aggregateRating` was removed deliberately, no review system exists). This isn't a schema bug, but it does mean Merchant Center's product-rating richness and Google's "Reviewed by" trust badges are unavailable at launch, and a brand-new India Merchant Center account with no order history, no verified business identity badge, and no reviews will likely face a manual review / phone-verification step before shopping ads or the free listings surface in Search — this is a Google Merchant Center account-standing process, not something fixable in code. **Not verified**: current Merchant Center account status, since no credentials were provided for this audit.
- **B4 (minor, confirmed) — currency/shipping consistency is actually fine.** `priceCurrency: currency` where `currency = product.priceRange.minVariantPrice.currencyCode` (confirmed `INR` in the live fetch), and `shippingDetails`/`hasMerchantReturnPolicy` blocks are present with concrete values (free shipping to IN, 14-day returns) — this part of Merchant Center's required-fields checklist is already satisfied at the schema level, once a feed is actually built from it.

**Fix priority:** Install/configure Shopify's Google & YouTube channel (fastest, reuses existing catalog data) → add `identifier_exists: false` to Product schema → expect an account-verification delay before free listings go live, independent of code.
**Falsifiable:** Log into Merchant Center for this domain (or Shopify Admin → Sales Channels) and confirm whether "Google & YouTube" is installed; if it is, this entire H3 section's B1 claim is wrong and should be struck. Check any product's JSON-LD via `view-source:` or the browser console for the absence of `gtin`/`mpn`/`identifier_exists`.

---

## Medium

### M1. Every image in a product's gallery shares identical alt text — no per-image differentiation
**Evidence:** `scripts/prerender.ts` product-route gallery renderer (~lines 1246-1254) sets `alt="${escapeHtml(prodTitle)}"` on **every** image in the loop, with no index-based or angle-based variation. Confirmed live on `avirena-crystal-hoops-gold-tone-earrings`: all 5 gallery `<img>` tags have the exact same `alt="Avirena Crystal Hoops — Gold"` string, differing only in `src`/`loading`/`fetchpriority`.
**Impact:** Google Images can't differentiate "front view" vs "worn on ear" vs "packaging" vs "size reference" shots from alt text alone, losing potential long-tail Image Search visibility (e.g. "earrings on ear model" queries) and reducing accessibility quality for screen-reader users navigating the gallery (identical announcements for 5 different images).
**Fix:** Either pull per-image alt text from Shopify's native image `altText` field (already fetched in the GraphQL query — `images.edges.node.altText` per the task brief's "5 images with alt text" — but the prerender's `fetchShopifyProducts()` GraphQL query at the top of `scripts/prerender.ts` (~lines 100-125) only selects `url`, not `altText`, so it's being discarded even though Shopify has it), or synthesize positional variants (`"${prodTitle} — front view"`, `"${prodTitle} — detail"`, etc.) as a fallback.
**Falsifiable:** Diff the `images(first: 6) { edges { node { url altText } } }` GraphQL selection in `scripts/prerender.ts` against what's actually used in `renderProductCards`/product gallery rendering — `altText` is fetched nowhere in the current query, confirming it's unused, not just unused in output.

### M2. "Statement Drops" price (₹1199) sits well outside the site's advertised entry price and the free-shipping/₹999 messaging band
**Evidence:** `/shop` meta description (`scripts/prerender.ts` ~line 618): *"Shop anti-tarnish gold-tone brass jewellery for daily wear. Nickel-free, skin-safe, from ₹499."* Live catalog has no ₹499 item — cheapest is Spiral Earrings at ₹599. This is a stale "from ₹499" price-floor claim now off by ₹100, independent of the C1 tag issue.
**Impact:** Minor but real — a "from ₹X" claim in an indexed meta description that no longer matches any live SKU is a small trust/accuracy gap, and if this copy is reused verbatim in a future Merchant Center promotional feed or ad copy, it compounds C1's mis-titled-collection problem.
**Fix:** Derive the "from ₹X" floor dynamically from `Math.min(...shopifyProducts.map(p => price))` at prerender time instead of a hardcoded literal, so it self-corrects the same way the empty-category noindex logic already does.
**Falsifiable:** Compare the hardcoded `'from ₹499'` string in `scripts/prerender.ts`'s `/shop` route description against `Math.min()` of the 9 live `priceRange.minVariantPrice.amount` values (currently 599).

---

## Low / Informational

### L1. Crystal Hoops gold/silver pair — cannibalization risk is low, differentiation is adequate but not maximized
**Evidence (live, prerendered, pre-JS):**
| | Gold | Silver |
|---|---|---|
| `<title>` | Avirena Crystal Hoops — Gold \| AVIRENA | Avirena Crystal Hoops — Silver \| AVIRENA |
| `<h1>` | Avirena Crystal Hoops — Gold | Avirena Crystal Hoops — Silver |
| Meta description opening | "...anchors a prong-set oval crystal, **so the eye catches the sparkle**…" | "...anchors a prong-set oval crystal, **finished in a cool silver tone**…" |
| Canonical | `/product/avirena-crystal-hoops-gold-tone-earrings` | `/product/avirena-crystal-hoops-silver-tone-earrings` |

Both are genuinely distinct URLs, titles, H1s, and canonicals — this is not a duplicate-content setup, and each is self-canonical (no cross-canonicalization forcing one to defer to the other). They will not directly cannibalize each other's rankings for their own exact-match title strings ("crystal hoops gold" vs "crystal hoops silver").
**Where the real risk is:** for a generic, non-color query like "crystal hoop earrings" or "anti tarnish crystal hoops," both pages are legitimate candidates and Google will pick one (likely whichever has more engagement/links), which is normal same-family variant competition, not a bug — but there is currently no shared "choose your finish" hub page or on-page cross-link between the two variants (confirmed: `PRODUCT LINKS ON PAGE: []` for both, same as H2), so a shopper or crawler landing on one has no path to discover the other exists.
**Fix (low priority, ties into H2):** Once cross-sell links are added (H2 fix), explicitly ensure each Crystal Hoops page links to its color counterpart with descriptive anchor text ("Also available in silver") rather than relying on the generic "Perfect match with" random-3 selection, so the two variant pages reinforce rather than silently compete for the shared query space.
**Falsifiable:** Search-console query-level data would confirm actual cannibalization (impressions/clicks split or self-competition) — **not verified**, no Search Console access in this audit. This finding is based solely on on-page differentiation, not ranking behavior.

### L2. Faceted navigation / query-parameter bloat: not currently a risk, but the search feature writes an unhandled `?q=` parameter
**Evidence:** `scripts/prerender.ts` WebSite schema's `SearchAction` (~line 210) targets `${SITE_URL}/shop?q={search_term_string}`, confirming the site intends to support `/shop?q=...` search URLs. `/shop` itself has no filter UI in the prerendered HTML (no color/price/size facet links — the category split is by path (`/shop/earrings`) not by query string). Confirmed no `?` parameter links appear anywhere in the prerendered `/shop` or category HTML.
**Impact:** Currently low risk — there's no crawlable facet permutation generator, so no parameter-bloat crisis exists today. But the `SearchAction` schema advertises a `?q=` pattern that, if the in-app search component ever generates crawlable/linkable search-result URLs (as opposed to a client-only modal — `src/components/SearchModal.tsx` exists, suggesting search is currently a modal, not a URL-driven page), could start generating indexable thin-content permutations later.
**Fix:** No immediate action required. When/if `/shop?q=` becomes a real crawlable route, add `<link rel="canonical" href="/shop">` (or noindex) on all query-parameter variants preemptively, and keep an eye on Search Console's "Page indexing" report for a sudden spike in `?q=` URLs.
**Falsifiable:** `SearchModal.tsx` behavior (does it navigate to `/shop?q=...` and change the URL, or stay client-only with no URL change?) — **not verified** in this pass; would need to read that component and/or test the live search UI to confirm whether this is purely theoretical or already live.

### L3. Missing commercial-intent pages typical for a jewelry store
Confirmed absent from the full prerendered route list in `scripts/prerender.ts` (Home, /shop, 5x /shop/:category, /collections, /about, /contact, /faq, /policies, /journal, /guides + guide articles, /product/:handle × 9, /404 — that is the complete route set, no others exist):
- **No gifting/occasion landing pages** (e.g. "Gifts under ₹1,000", "Everyday Office Jewelry") despite Shopify smart collections "Gifting Edit" and "Office & Everyday" already existing per the task brief — these collections have no corresponding frontend route/page at all, so they're invisible to both users and crawlers even though the merchandising work to create them in Shopify has already been done.
- **No size/fit guide specific to earrings** (the existing `/guides/ring-size-guide` is ring-only; the entire 9-SKU catalog is earrings, yet there's no earring-specific buying guide — e.g. hoop diameter, stud backing type, weight/comfort for daily wear).
- **No dedicated "New Arrivals" or "Bestsellers" page** — common jewelry-store commercial-intent landing pages, useful for a launch-day site with only one real category.
- **No Journal/blog articles yet** — `/journal` route exists (`scripts/prerender.ts` ~ROUTE 8) but its `htmlContent` is a single static intro paragraph with no article listing or links; it's a stub page, not populated content.
**Fix:** Highest-leverage first: build `/shop/gifting-edit` and `/shop/office-everyday` (or similar) routes wired to the already-existing Shopify smart collections — this is pure frontend work with zero new merchandising effort since the collections and their tag rules already exist. Populate `/journal` or remove it from the sitemap until it has content (currently it's a thin stub included in the sitemap — worth checking whether it should be noindexed like the empty categories are).
**Falsifiable:** Full route enumeration is in `scripts/prerender.ts`'s `routes.push(...)` calls — grep for `routes.push` to get the authoritative list; cross-check against Shopify Admin's collection list for "Gifting Edit" / "Office & Everyday" to confirm they exist with no matching frontend route.

---

## Not Verified (explicitly out of scope for this pass — do not treat as confirmed either way)
- Actual Merchant Center account status/history (no credentials).
- Whether Shopify's "Google & YouTube" sales channel app is installed (Shopify Admin access, not repo-visible).
- `SearchModal.tsx` internal behavior re: `?q=` URL generation (code not read this pass).
- Any Search Console impression/click data for the crystal-hoops gold/silver pair (no GSC access; L1's cannibalization risk is inferred from on-page structure only, not ranking data).
- Whether `/journal`'s thin-content status is currently suppressing it in Google's index (would require a `site:` search or GSC coverage report, neither performed).
- Live rendering with JS enabled (`--mode always`) was not run in this pass; all "prerendered HTML" claims above are from `--mode never` (raw, pre-JS) fetches only, which is the more conservative/relevant test for crawler-visible content but does not describe what a JS-executing renderer (Googlebot's second wave) additionally sees beyond what hydration adds — for the specific claim in H2 (that hydrated cross-sell "links" are non-anchor JS handlers), that was confirmed by direct source code read of `ProductDetailPage.tsx`/`App.tsx`, not by a rendered-DOM fetch.
