# Schema.org Audit — avirenajewels.com

Scope: homepage, /shop, /shop/earrings, /product/avirena-crystal-hoops-gold-tone-earrings, /guides, one guide article.
Sources: `scripts/prerender.ts` (`getGlobalSchema()` + per-route `jsonLd`), `src/components/SeoMeta.tsx` (hydration rewrite of `#dynamic-jsonld-schema`), live fetches (raw HTML and Playwright-rendered DOM) of the PDP.

---

## 1. CRITICAL — Hydrated Product `offers.price` is wrong currency-unit, live on production

**Evidence**: Live raw HTML for `/product/avirena-crystal-hoops-gold-tone-earrings` (`--mode never`) emits:
```json
"offers": { "priceCurrency": "INR", "price": 699, ... }
```
Live Playwright-rendered DOM (`--mode always`, same URL, immediately after) emits:
```json
"offers": { "priceCurrency": "INR", "price": 7.766666666666667, ... }
```
`src/components/SeoMeta.tsx:194` does `price: selectedProduct.price` while `src/lib/shopify.ts:441` stores `Product.price` as a **base-EUR-normalized** value (`rawAmount / 90.0` for INR-priced items — this is the currency-switcher's internal base unit, not a displayable price in any currency). Every UI price display (`CartDrawer.tsx:231`, `CartPage.tsx:212`, `CheckoutPage.tsx:546`, `QuickViewModal.tsx:265`) correctly runs this through `formatPrice(price, currency)` before rendering. `SeoMeta.tsx` is the only price consumer in the codebase that skips that conversion.

**Impact**: any crawler or bot that executes JS (Googlebot's rendering pass, Merchant Center's live crawl, any AI agent that renders the page) sees a ₹699 item declared as **₹7.77** (or whatever the active `currency` context happens to be at hydration). This is a direct violation of Google's structured-data price-accuracy policy and is grounds for Merchant Center suspension / manual action, not just a warning. It also fails prerendered-vs-hydrated parity outright — the two blocks materially disagree on price, and per the standing instruction, the hydrated version wins for JS-executing crawlers.

**Fix** — `src/components/SeoMeta.tsx`, replace line 194:
```diff
-          price: selectedProduct.price,
+          price: formatPriceForSchema(selectedProduct.price, currency),
```
Add a small helper near the top of the file (schema.org `Offer.price` wants a bare number, not a formatted string with currency symbol/commas):
```ts
// EUR→display-currency conversion factors, mirrored from src/lib/shopify.ts.
// Keep these two files' rates identical or PDP schema price will drift from the UI price again.
const CURRENCY_RATES: Record<string, number> = { EUR: 1, INR: 90.0, USD: 1.08, GBP: 0.85 };

function formatPriceForSchema(basePriceEur: number, currency: string): number {
  const rate = CURRENCY_RATES[currency] ?? CURRENCY_RATES.EUR;
  return Math.round(basePriceEur * rate * 100) / 100;
}
```
Better long-term fix: don't duplicate the conversion table in two files — export the existing rate table/function from `src/lib/shopify.ts` (or wherever `formatPrice` lives) and import it into `SeoMeta.tsx` so there is exactly one source of truth.

**Falsifiability**: Run `claude-seo run render_page.py https://avirenajewels.com/product/avirena-crystal-hoops-gold-tone-earrings --mode always --json-ld-output out.json` and check `data[].offers.price` for the `Product` block equals `699` (the on-page `₹699` price), not `7.77`. Repeat with `--mode never` — both must show `699` after the fix.

---

## 2. HIGH — BreadcrumbList silently disappears after hydration on PDP

**Evidence**: Raw HTML `structured_data.blocks[0].types` for the PDP includes `BreadcrumbList` and `ListItem`. The Playwright-rendered version's `types` list does **not** contain `BreadcrumbList` or `ListItem` at all — `SeoMeta.tsx` never pushes a `BreadcrumbList` schema for any page (grep confirms: only `Organization`, `OnlineStore`, `WebSite`, `Product`, and conditionally `Article`/`FAQPage` are pushed in `SeoMeta.tsx`'s `schemas` array).

**Impact**: For any JS-executing crawler, the prerendered `BreadcrumbList` is emitted into the DOM once at load, then **overwritten and removed** the moment `SeoMeta.tsx`'s `useEffect` fires and replaces `#dynamic-jsonld-schema`'s `textContent` wholesale. Google explicitly documents that it uses the post-render DOM; the breadcrumb rich-result eligibility this page currently has in raw HTML is lost the instant hydration completes. Same applies to every route's `BreadcrumbList` (category pages, guide pages, shop), not just the PDP — `SeoMeta.tsx` has no `BreadcrumbList` branch anywhere.

**Fix**: `SeoMeta.tsx` must push a `BreadcrumbList` matching whatever `scripts/prerender.ts` emits for that route (home has none; shop has Home→Shop; category has Home→Shop→Category; PDP has Home→Shop→Product; guides hub has Home→Guides; guide article has Home→Guides→Article). Minimal PDP-only patch inside the `if (currentPage === 'pdp' && selectedProduct)` block in `SeoMeta.tsx`:
```ts
schemas.push({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://avirenajewels.com' },
    { '@type': 'ListItem', position: 2, name: 'Shop', item: 'https://avirenajewels.com/shop' },
    {
      '@type': 'ListItem',
      position: 3,
      name: selectedProduct.name,
      item: `https://avirenajewels.com/product/${selectedProduct.handle || selectedProduct.id}`,
    },
  ],
});
```
Recommend the same pattern for `shop`/`collection` and `guides` branches so parity holds sitewide, not just on PDP.

**Falsifiability**: `render_page.py <url> --mode always --json-ld-output out.json`, check `types` includes `BreadcrumbList`. Currently fails on every route type checked (PDP confirmed directly; other routes inferred from reading `SeoMeta.tsx` in full — it has zero `BreadcrumbList` pushes for any branch, so this is a codebase-wide gap, not PDP-specific).

---

## 3. HIGH — `Offer.shippingDetails` diverges between prerender and hydration (missing field + wrong unit code + currency risk)

**Evidence**, `scripts/prerender.ts:1165-1191` vs `src/components/SeoMeta.tsx:204-226`:

| Field | prerender.ts | SeoMeta.tsx |
|---|---|---|
| `shippingDestination` | `{ "@type": "DefinedRegion", "addressCountry": "IN" }` | **absent** |
| `deliveryTime.handlingTime.unitCode` | `"DAY"` | `"d"` |
| `deliveryTime.transitTime.unitCode` | `"DAY"` | `"d"` |
| `shippingRate.currency` | hardcoded `"INR"` | `currency` (the active display-currency variable) |

Confirmed live on the rendered PDP: hydrated JSON-LD has no `shippingDestination` key under `shippingDetails`, and both `unitCode` values are `"d"`.

**Impact**: `"d"` is not a valid UN/CEFACT Common Code for `QuantitativeValue.unitCode` (the correct value is `"DAY"`, same as prerender.ts already uses) — this fails Google's Merchant Center shipping schema validation on the hydrated version. Losing `shippingDestination` makes the shipping declaration incomplete for crawlers that only see the hydrated DOM. `shippingRate.currency` tracking the currency-switcher variable instead of the actual settlement currency (shipping is charged in INR regardless of display currency) is a latent correctness bug if/when the currency switcher is used.

**Fix**, `src/components/SeoMeta.tsx` shippingDetails block:
```diff
           shippingDetails: {
             '@type': 'OfferShippingDetails',
             shippingRate: {
               '@type': 'MonetaryAmount',
               value: '0',
-              currency: currency,
+              currency: 'INR',
             },
+            shippingDestination: {
+              '@type': 'DefinedRegion',
+              addressCountry: 'IN',
+            },
             deliveryTime: {
               '@type': 'ShippingDeliveryTime',
               handlingTime: {
                 '@type': 'QuantitativeValue',
-                minValue: 1,
-                maxValue: 2,
-                unitCode: 'd',
+                minValue: 0,
+                maxValue: 1,
+                unitCode: 'DAY',
               },
               transitTime: {
                 '@type': 'QuantitativeValue',
                 minValue: 2,
                 maxValue: 4,
-                unitCode: 'd',
+                unitCode: 'DAY',
               },
             },
           },
```
(Also aligns `handlingTime` min/max with prerender.ts's `0–1`, currently `1–2` in SeoMeta — pick one and make both files match; prerender's `0-1` is likely correct since same-day dispatch is common for a small catalog.)

**Falsifiability**: Diff the two `data[].offers.shippingDetails` objects from `--mode never` and `--mode always` fetches of the same PDP URL — must be byte-identical (aside from irrelevant key order) after the fix.

---

## 4. HIGH — Product schema missing `material` in prerendered HTML (present only after hydration)

**Evidence**: `scripts/prerender.ts`'s `productJsonLd` (lines 1138–1201) has no `material` key anywhere in the `Product` object. `src/components/SeoMeta.tsx:189` does have `material: selectedProduct.materials || selectedProduct.metal`, sourced from `METAL_MATERIALS` in `src/lib/shopify.ts:11-19`, e.g. for this PDP: `"High-grade brass with an anti-tarnish gold-tone e-coating (hypoallergenic, nickel-free)"`. Confirmed on live fetches: raw HTML has no `material` field; hydrated DOM has it.

**Why this matters for this brand specifically**: `material` is a Google-recommended `Product` field, and this brand's core trust proposition is material honesty — the PDP's own visible copy states explicitly "This is fashion jewellery... not solid gold... not hallmarked." A crawler that only reads server HTML (not all do JS rendering, and AI answer engines frequently don't) currently gets zero material disclosure in structured data even though the brand goes out of its way to state it in prose. This is a **parity gap that removes a compliant, wanted field** — the fix is to add it to prerender.ts, matching SeoMeta.tsx's existing (correct) value, not to touch SeoMeta.tsx.

**Fix** — add to `scripts/prerender.ts` inside the `Product` object (after `brand`, before `offers`), sourced from the same `product` data available in that loop. Since `prerender.ts` builds from raw Shopify GraphQL nodes rather than the transformed `Product` type, mirror `METAL_MATERIALS` logic or, cleaner, import the same map:
```ts
// near the top of scripts/prerender.ts, alongside other shared constants
const METAL_MATERIALS_BY_KEYWORD: { match: RegExp; material: string }[] = [
  { match: /rose.?gold/i, material: 'High-grade brass with anti-tarnish rose gold-tone e-coating (hypoallergenic, nickel-free)' },
  { match: /silver/i, material: 'Durable silver-tone alloy with protective anti-tarnish coating (hypoallergenic, nickel-free)' },
  { match: /gold/i, material: 'High-grade brass with anti-tarnish gold-tone e-coating (hypoallergenic, nickel-free)' },
];
function deriveMaterial(product: any): string {
  const hay = `${product.title} ${product.productType} ${(product.tags || []).join(' ')}`;
  return (
    METAL_MATERIALS_BY_KEYWORD.find((r) => r.match.test(hay))?.material ||
    'High-grade brass with protective anti-tarnish e-coating (hypoallergenic, nickel-free)'
  );
}
```
Then in the `Product` object literal:
```diff
         brand: {
           '@type': 'Brand',
           name: 'Avirena Jewels',
         },
+        material: deriveMaterial(product),
         offers: {
```
**Strongly preferred alternative**: don't reinvent keyword-matching in two files — this is exactly the kind of drift the `deriveCategory()` comment at the top of `prerender.ts` warns about. If `src/lib/shopify.ts`'s `METAL_MATERIALS` map and its `metal` derivation logic can be extracted to a shared `.ts` module importable from both the Node prerender script and the browser bundle, do that instead and have both call the same function.

**Guardrail**: whatever value ends up in `material`, it must never say "gold", "silver", "sterling", "vermeil", or "diamond" without the "-tone"/"faceted crystal, not diamond" qualifiers already used in `METAL_MATERIALS` — confirmed the existing copy already respects this; just don't let a future edit drop the qualifiers.

**Falsifiability**: `render_page.py <product-url> --mode never --json-ld-output out.json` — `data[].material` must be present and must not contain the bare words "gold"/"silver" without "-tone" adjacent, or "diamond".

---

## 5. INFO — Home page FAQPage content diverges between prerender and hydration (not a regression, but inconsistent)

**Evidence**: `scripts/prerender.ts:558-579` (home route) emits a 2-question `FAQPage` (materials, pearls). `src/components/SeoMeta.tsx:274-313` emits a 4-question `FAQPage` for `currentPage === 'faq' || currentPage === 'home'` (materials, hypoallergenic, pearls, shipping) with reworded answer text even for the two overlapping questions.

**Impact**: Since Google retired FAQ rich results for all sites (2026-05-07), there is no SERP consequence. Flagging as Info per standing instruction — no removal recommended. The only reason to fix this is internal consistency (same reasoning as the `guideFaqEntries()` helper already used elsewhere in `prerender.ts` to prevent exactly this kind of drift) and because if AI/GEO citation of FAQ content ever matters, a crawler landing pre-hydration vs post-hydration would get two different answer sets for the same two questions, which looks inconsistent if a user compares "page source" answers to on-screen answers.

**Fix (optional, low priority)**: make `SeoMeta.tsx`'s home-page FAQ block reuse the exact same 2 entries as `prerender.ts`, or vice versa — pick one list as source of truth. Not urgent; do not spend engineering time here before items 1–4.

---

## 6. INFO — Existing FAQPage markup sitewide

Present on: homepage, `/faq`, every `/guides/:slug` article. Per standing guidance: Google retired FAQ rich results for all sites (2026-05-07). This is Info-severity, not a defect — no SERP benefit remains, any AI/GEO citation benefit is unconfirmed. **No removal recommended.** No new FAQPage should be added elsewhere on the strength of expected SERP gain.

---

## 7. PASS — Product `offers.url` and `BreadcrumbList` item URLs use current `/product/avirena-*` handles

**Evidence**: Live raw-HTML fetch of `/product/avirena-crystal-hoops-gold-tone-earrings` confirms:
```json
"offers": { "url": "https://avirenajewels.com/product/avirena-crystal-hoops-gold-tone-earrings", ... }
"BreadcrumbList" item 3: "item": "https://avirenajewels.com/product/avirena-crystal-hoops-gold-tone-earrings"
```
Both match the canonical URL and the current page's own URL exactly — no stale pre-rename handle (`solene-crystal-hoops-...`) leaked into schema. This is because `scripts/prerender.ts` builds `handle` from the live Shopify GraphQL response (`product.handle`) each build, not from any hardcoded list, and `vercel.json` separately 301-redirects the 12 old handles. **No fix needed.** Spot-check the other 8 products' PDPs before considering this fully closed sitewide — only the crystal-hoops-gold PDP was fetched live for this audit.

**Falsifiability**: For each of the 9 live product handles, `offers.url` and the final `BreadcrumbList` item's `item` must equal `https://avirenajewels.com/product/<handle>` with no `vercel.json`-listed old handle appearing anywhere in the JSON-LD.

---

## 8. PASS (confirmed absent) — No `aggregateRating`/`Review` markup found

**Evidence**: `grep -n "aggregateRating\|Review" scripts/prerender.ts src/components/SeoMeta.tsx` returns no matches in either file. Live raw and hydrated JSON-LD `types` arrays for the PDP contain no `AggregateRating` or `Review` type. Per the standing hard rule (no review system exists sitewide), this is correct and must stay this way — **any reappearance of this markup is Critical.**

**Falsifiability**: `grep -rn "aggregateRating\|AggregateRating\|\"Review\"" scripts/prerender.ts src/components/SeoMeta.tsx` must return nothing, on every future change to these two files.

---

## 9. PASS (confirmed absent) — No precious-metal or diamond claims in Product schema

**Evidence**: PDP `Product.description` (both raw and hydrated) explicitly states "The stone is a faceted crystal, not a diamond or precious gemstone. The metal is not solid gold, gold vermeil or sterling silver, and is not hallmarked to any precious-metal standard." `SeoMeta.tsx`'s `material` field sources from `METAL_MATERIALS` in `src/lib/shopify.ts`, all four entries use "-tone" qualifiers and never claim solid precious metal. No `material` field exists yet in prerender.ts (see Finding 4) so there is nothing to check there, but nothing incorrect either.

**Falsifiability**: any future `material`/`description` change must not introduce "18k", "sterling silver" (unqualified), "solid gold", or "diamond" without an explicit "-tone"/"not a diamond" qualifier in the same field.

---

## 10. Category pages — ItemList/CollectionPage assessment (confirmed correct behavior)

**Evidence**, `scripts/prerender.ts:716-800`: every `/shop/:category` route always emits a `CollectionPage` (name/url/description). Only non-empty categories additionally get `mainEntity: { '@type': 'ItemList', ... }` populated with the category's products; empty categories get `CollectionPage` with no `mainEntity` at all, and the route also gets `robots: 'noindex, follow'` plus exclusion from the sitemap (`isEmpty` branch).

**Assessment**: this is the right call and needs no change. Emitting `ItemList` on an empty, noindexed category would be actively misleading (a rich-result-eligible list of zero items, or worse, a list schema for a page Google is told not to index). Keeping the bare `CollectionPage` (no `ItemList`) on noindexed categories is harmless — it's not indexed anyway — and the moment inventory lands the same code path automatically promotes it to a populated `ItemList` with no manual schema work. **No fix required.** Only earrings currently has stock; necklaces, rings, bracelets, brooches are correctly noindexed and correctly schema-thin.

**Falsifiability**: for any category with `productsByCategory.get(cat.id).length === 0`, the emitted `CollectionPage` must have no `mainEntity` key, and the route's meta robots must be `noindex, follow`. For any category with stock, `mainEntity.itemListElement.length` must equal the live product count in that category.

---

## 11. Prerendered vs hydrated parity — verified on PDP, NOT verified on guide page

**PDP**: fully verified live (see Findings 1–4, 7 above). Confirmed divergences: `Offer.price` unit (Critical), missing `BreadcrumbList` (High), `shippingDetails` field/unit differences (High), missing `material` in prerendered-only (High).

**Guide page**: **not verified** — I read both code paths (`scripts/prerender.ts:1076-1122` and `SeoMeta.tsx:242-271`) and they appear structurally aligned (same `Article` fields, same `FAQPage` mapping from `guide.faqs`), but I did not fetch a live guide URL in both raw and rendered modes to confirm actual runtime parity. Given the PDP had a real, non-obvious divergence despite looking correct in an isolated code read, do not assume the guide page is clean without checking.

**Recommended manual test** (exact steps):
1. `"$HOME/.claude/skills/seo/bin/claude-seo" run render_page.py https://avirenajewels.com/guides/<any-slug> --mode never --json-ld-output raw.json`
2. `"$HOME/.claude/skills/seo/bin/claude-seo" run render_page.py https://avirenajewels.com/guides/<any-slug> --mode always --json-ld-output hydrated.json`
3. Diff the `Article`, `FAQPage`, and `BreadcrumbList` blocks between the two files. Given Finding 2 (SeoMeta.tsx never pushes `BreadcrumbList` for any route), expect the guide page's `BreadcrumbList` to also disappear after hydration — treat that as a very likely High finding pending confirmation, not yet confirmed.
4. Also diff `/guides` hub itself the same way (has `CollectionPage` + `BreadcrumbList` in prerender.ts; `SeoMeta.tsx` has no `guides`-hub-specific branch for either, only the `activeGuide` branch for individual articles) — the hub page's `CollectionPage`/`hasPart`/`BreadcrumbList` are likely lost entirely after hydration on `/guides` itself, since `SeoMeta.tsx` has no code path that emits them. This should also be confirmed with the same two-fetch diff before treating it as settled.

---

## 12. Missing high-value opportunities, ranked by impact

1. **Fix Finding 1 (price unit bug) immediately** — this is a live data-integrity/policy-compliance issue, not an "opportunity," but it is the single highest-impact item on this list by a wide margin (risk of Merchant Center suspension).
2. **Fix Finding 2 (BreadcrumbList lost on hydration, sitewide)** — cheap fix, restores an already-earned rich-result eligibility across every route type.
3. **Fix Finding 4 (material missing from prerendered Product)** — cheap, reinforces the brand's material-honesty positioning in a machine-readable field, not just prose.
4. **`WebPage`/`ItemPage` wrapper on PDP** — currently the PDP has `Product` + `BreadcrumbList` but no `WebPage`/`ItemPage` node with `@id` tying the page URL to the product entity. Not required for Merchant/Product rich results, but recommended for entity clarity if the site ever wants `mainEntityOfPage` cross-linking (as guide articles already do via `mainEntityOfPage`). Low priority.
5. **`VideoObject` — not applicable.** No product videos found in the codebase (`grep -rn "VideoObject\|\.mp4\|video" scripts/prerender.ts` returns nothing relevant); skip unless the catalog adds video assets. See `schema/templates.json` if that changes.
6. **Do not add `AggregateRating`/`Review`** — reiterating the hard rule as a standing "do not build" item, since it is the single most commonly-recommended e-commerce schema addition industry-wide and the one this site must never accept.
7. **Do not reintroduce `HowTo`** for the ring-sizing guide content, even though "measure your ring size at home" (`src/data/guides.ts:408`) reads like classic HowTo copy — deprecated, no rich result. `Article` + `FAQPage` (current treatment) is correct.

---

## Ready-to-paste JSON-LD summary

**Add to `scripts/prerender.ts` Product object** (Finding 4):
```json
"material": "High-grade brass with anti-tarnish gold-tone e-coating (hypoallergenic, nickel-free)"
```
(value must be derived per-product from the existing `METAL_MATERIALS`-equivalent logic — do not hardcode one value for all 9 SKUs; gold-tone vs silver-tone vs rose-gold-tone pieces need their matching string.)

**Add to `SeoMeta.tsx` PDP branch** (Finding 2):
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://avirenajewels.com" },
    { "@type": "ListItem", "position": 2, "name": "Shop", "item": "https://avirenajewels.com/shop" },
    { "@type": "ListItem", "position": 3, "name": "<selectedProduct.name>", "item": "https://avirenajewels.com/product/<handle>" }
  ]
}
```

**Fix in `SeoMeta.tsx` `shippingDetails`** (Finding 3) — add `shippingDestination`, change both `unitCode` values from `"d"` to `"DAY"`, and hardcode `shippingRate.currency` to `"INR"` — see full diff in Finding 3.

**Fix in `SeoMeta.tsx` `offers.price`** (Finding 1) — convert `selectedProduct.price` (base EUR) through the same rate table `formatPrice()` already uses before assigning to `Offer.price` — see full code in Finding 1.
