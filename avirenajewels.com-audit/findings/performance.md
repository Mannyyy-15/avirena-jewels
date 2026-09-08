# Performance Audit — avirenajewels.com

**Method:** Lab data only (Lighthouse 13.4.1 CLI, simulated throttling, Moto G-class mobile profile / desktop profile). **No Google API credentials are configured in this environment, so CrUX and PageSpeed Insights FIELD data are unavailable.** Every number below is a single-run lab measurement, not a 75th-percentile field measurement, and is not what Google uses to score Core Web Vitals in Search. Lab numbers are directionally useful (they identify real bottlenecks) but should not be reported to stakeholders as "the site's LCP" without that caveat. INP is used throughout per current guidance; FID is never referenced (FID was fully retired from Chrome's tooling on 2024-09-09).

**Coverage actually measured this session:** homepage (`/`), mobile, one full Lighthouse run (`home-mobile.json`, fetched 2026-09-08T06:44:43Z). A desktop homepage run exists in the scratchpad but is **stale, from a prior session (2026-09-04T06:16:09Z, before the hero.png fix)** — reported below but explicitly labeled as dated/pre-fix, not a current measurement. `/shop`, `/product/avirena-crystal-hoops-gold-tone-earrings`, and `/guides/does-brass-jewelry-turn-skin-green` were **not measured** in this session (I was instructed to stop before running them) — do not treat any numbers for those three URLs elsewhere in this repo as current lab data. Static-asset/code inspection (bundle sizes, font count, CSS coverage, render mode) was completed for all pages since it's build-output-based, not per-URL.

---

## Finding 1 — Homepage LCP element was hero.png, 1.29MB unoptimized PNG (FIXED, pending redeploy)

**Severity: Critical**

**Measured (lab, mobile, pre-fix, 2026-09-08T06:44:43Z):**
- LCP = **15.2s** (`largest-contentful-paint`: 15,191.7ms) — fails "poor" threshold (>4.0s) by nearly 4x
- LCP element confirmed via Lighthouse's `lcp-breakdown-insight` node attribution: `<img src="/hero.png" alt="Avirena Signature Baroque Pearl Ring">`, **not** `/logo.webp` as originally assumed in the known-context brief
- LCP subpart breakdown:
  - Time to first byte: 3,275ms
  - Resource load delay: 626ms
  - **Resource load duration: 5,096ms** ← dominant cost
  - Element render delay: 56ms
- `hero.png` on disk: 1,323,513 bytes (1,292.5KB), PNG, 1024×1536, served with `loading="eager"` but **no** `fetchpriority="high"` and **not** discoverable in the initial HTML document at request time (`lcp-discovery-insight`: `priorityHinted: false`, `requestDiscoverable: false`) — it only becomes discoverable after the framer-motion component tree mounts client-side.
- Total page transfer weight: 4,581 KiB across 28 requests; hero.png alone was 29% of total page weight.

**Cause:** The homepage's floating hero visual (`src/components/HeroBaroquePearlRing.tsx`) rendered an eager `<img src="/hero.png">` at full 1.29MB PNG source even though it displays at a max of ~500px wide (`w-[145px] ... xl:w-[460px] 2xl:w-[500px]`) — roughly 6-9x more pixel data than ever gets displayed. It also had no `fetchpriority` hint and wasn't preloaded, so the browser discovered it late (after JS parsed and mounted the component), compounding the delay. The `index.html` preload was pointed at `/logo.webp`, which is a real (and large) hero element but not the one Lighthouse's LCP algorithm selected on this run.

**Fix applied (per coordinator, pending redeploy verification):**
- `public/hero.webp` generated via `scripts/optimize-images.ts`: 1,292.5KB → 109.0KB (92% reduction)
- `HeroBaroquePearlRing.tsx` now uses `<picture>` with the WebP source, PNG fallback, explicit `width`/`height`, `fetchPriority="high"`, `decoding="sync"`
- `index.html` preload retargeted from `/logo.webp` to `/hero.webp` at `fetchpriority="high"`, with `logo.webp` still preloaded but at normal priority behind it

**Important correction to make explicitly:** a `<link rel="preload">` aimed at the wrong element is not neutral — it is actively worse than no preload, because it consumes early network priority/bandwidth on a resource that isn't the LCP candidate, delaying discovery of the resource that actually is. That is what was happening before this fix (preloading logo.webp while hero.png silently drove LCP).

**Verification status: NOT YET RE-MEASURED.** This fix was applied mid-session, live has not been redeployed/re-crawled by this audit. Re-run `npx lighthouse https://avirenajewels.com/ --form-factor=mobile --screenEmulation.mobile --throttling-method=simulate --only-categories=performance` after deploy and confirm: (a) LCP element is now `hero.webp`/`hero.png`, (b) LCP resource load duration drops roughly in proportion to the 92% byte reduction, (c) `lcp-discovery-insight` reports `priorityHinted: true` and `requestDiscoverable: true`.

**Estimated improvement (not yet confirmed):** resource load duration is throttling-network-bound, so a ~12x byte reduction (1,292KB → 109KB) should cut that 5,096ms subpart by a large majority — plausibly LCP drops from ~15.2s into the 4-7s range on this same throttled profile. This does not by itself get LCP under the 2.5s "good" threshold; TTFB (3,275ms lab-simulated) and render delay still need attention (see Finding 2). Do not treat this estimate as measured — falsify it with a fresh Lighthouse run post-deploy.

---

## Finding 2 — TTFB: 3,275ms in Lighthouse's simulated-throttling lab run vs. sub-100ms in direct curl checks — these are not the same number, do not conflate them

**Severity: Informational (measurement-integrity issue, not a real server problem)**

**Measured:**
- Lighthouse `lcp-breakdown-insight` (mobile, simulated throttling): `timeToFirstByte: 3274.9ms`
- Direct `curl -w "%{time_starttransfer}"` against `https://avirenajewels.com/`: **0.044s (44ms)**, HTTP 200, served by Vercel (`X-Vercel-Cache: HIT`)

**Cause:** Lighthouse's `--throttling-method=simulate` applies a simulated round-trip-time/bandwidth model to the *entire* network waterfall, including TTFB, to approximate a mid-tier mobile connection (roughly the CrUX "average 4G" profile). That 3,275ms figure is the modeled TTFB under artificial network conditions, not a measurement of actual Vercel edge response time. The real TTFB — the one CrUX field data would report — is well under 100ms from this location.

**Fix / recommendation:** None needed on the server side; TTFB is not the bottleneck. The action item is reporting hygiene: never state "TTFB is 3.2s" without the "under simulated throttling" qualifier, and prefer `--throttling-method=devtools` or a `curl`/WebPageTest real-connection check when the actual server response time matters for a decision. This finding exists to prevent the 3,275ms number from being miscited elsewhere in this audit or downstream reports.

**Estimated improvement:** N/A — no fix needed, this is a reporting-accuracy note only.

---

## Finding 3 — vendor-motion chunk cost 3.5s of main-thread blocking during the homepage lab run

**Severity: High**

**Measured (lab, mobile, home-mobile.json):**
- `bootup-time` audit, per-script main-thread cost:
  - `vendor-motion-DAaT0qv1.js`: **3,496ms total** (637.8ms scripting)
  - Root document inline scripts: 1,059ms total
  - `vendor-react-DDwC_z6H.js`: 858.8ms total (510.5ms scripting)
  - `vendor-framer-BqTyLq8o.js`: 754.3ms total (399.6ms scripting)
  - Unattributable: 554.4ms
- Total Blocking Time (TBT): **420ms** — fails the "needs improvement" boundary for INP-correlated responsiveness (TBT >200ms strongly correlates with poor INP)
- Total Main Thread Work: 6.8s
- Time to Interactive: 15.3s (tracks LCP closely since this is a client-render-only app)

**Cause:** `vendor-motion` bundles GSAP + ScrollTrigger + Lenis (smooth-scroll). The homepage imports GSAP eagerly (`import gsap from 'gsap'; gsap.registerPlugin(ScrollTrigger)` at module scope in `src/pages/HomePage.tsx`) purely for scroll-triggered entrance animations on content that is, for the most part, off-screen at load. This is 3.5s of blocking time spent before any user interaction is possible, and it directly delays the moment `hero.png`/`hero.webp` becomes visible, since the pearl-ring image is wrapped in a `framer-motion` component with an `initial={{ opacity: 0 }}` state — **the LCP image is invisible (opacity 0) until React mounts, GSAP/motion initialize, and the entrance animation completes**, meaning even a perfectly optimized image cannot paint before the JS does its work.

**Fix:**
1. Defer GSAP/ScrollTrigger registration until after first paint (dynamic `import()` inside a `useEffect`, not a module-level side effect), so it no longer competes with initial render.
2. For the hero image specifically, do not gate its initial visibility behind a JS-driven opacity animation — render it visible by default (CSS-only fade-in with a short duration, or no animation at all) so LCP is not coupled to framer-motion's mount timing. Reserve the floating/bobbing animation for after the image has already painted.
3. Audit whether Lenis (smooth-scroll) needs to load on the homepage above-the-fold path at all, or can be deferred similarly.

**Estimated improvement:** Deferring GSAP initialization off the critical path should recover a meaningful share of the 420ms TBT and remove GSAP's 3.5s bootup entry from blocking early paint; decoupling the hero image's visibility from the framer-motion `opacity: 0 → 1` transition removes a fixed ~1s+ animation-duration tax from LCP regardless of image byte size. Combined with Finding 1, this is the second-largest lever on this page. Not yet measured post-fix — verify with a fresh trace.

---

## Finding 4 — Entry bundle: confirmed 171KB raw / 43KB gzip, not "~133KB" as stated in known context; chunk count is 18, not 19

**Severity: Low (accuracy correction, not a regression)**

**Measured (`dist/assets/`, current build output):**

| File | Raw | Gzip |
|---|---|---|
| `index-CMSkPMrC.js` (entry) | 171,218 B (167.2 KB) | 43,130 B (42.1 KB) |
| `vendor-react-*.js` | 193,814 B | 60,393 B |
| `vendor-motion-*.js` (gsap+lenis) | 134,802 B | 50,658 B |
| `vendor-framer-*.js` | 124,772 B | 40,652 B |
| `vendor-icons-*.js` (lucide) | 16,814 B | 3,930 B |
| Route chunks (12 files: ProductDetailPage, CheckoutPage, JournalPage, PoliciesPage, CollectionPage, FaqPage, ContactPage, CollectionsHubPage, CartPage, AboutPage, GuidesPage, SearchModal, WishlistModal) | 3.4KB–30.1KB each | 1.3KB–8.0KB each |

Total JS chunk count in `dist/assets/`: **18 files** (4 vendor + 1 entry + 13 route/component chunks), not 19. This is a minor discrepancy from the known-context claim and not itself a problem — manualChunks vendor-splitting (react / motion / framer / icons) and route-level `React.lazy` code-splitting are both confirmed working as designed in `vite.config.ts`.

**Cause of the ~133KB vs 171KB gap:** unclear from this session — could be gzip-vs-raw confusion in the earlier claim (43KB gzip is much closer to a "133KB" feel than 171KB raw is), a since-added dependency, or a different build. Not investigated further per scope (code-split architecture, not byte-shaving, was the ask).

**Verdict:** The code-splitting work holds structurally — the entry chunk is not re-bloated with vendor code, and route-based lazy loading is intact. The specific number in institutional memory should be corrected to **171KB raw / 43KB gzip, 18 chunks** for future reference.

**Estimated improvement:** None needed — this finding is a bookkeeping correction, not a regression requiring a fix.

---

## Finding 5 — Fonts: 2 families confirmed, but 15 variants requested, not 12

**Severity: Low**

**Measured (`index.html` Google Fonts link, current):**
```
family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,600;1,700
family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400
```
- Cormorant Garamond: **9 variants** (5 roman weights + 4 italic weights)
- Plus Jakarta Sans: **6 variants** (5 roman weights + 1 italic weight)
- Total: **15 variants**, 2 families — the family count matches known context; the variant count (claimed "12") does not.

**Cause:** Not a regression from this session's perspective (I have no prior baseline to compare against), just a correction to institutional memory. `display=swap` is set, which is correct practice and avoids FOIT (invisible text) at the cost of a brief FOUT (flash of fallback text) — acceptable tradeoff, not flagged as a defect.

**Fix (optional, not urgent):** Audit which of the 9 Cormorant Garamond weights are actually used in CSS (headings typically need 2-3 weights, not 9: e.g., 300 for display, 500/600 for subheads). Each unused variant is pure waste on the font request — Google Fonts serves only requested variants but the CSS file and font-matching overhead scale with variant count. Given `font-display: swap` is already in place, the marginal CLS/FOUT risk from trimming is low; this is a bytes-not-rendering-blocking cleanup.

**Estimated improvement:** Not measured — would require a diff of computed-style `font-weight` usage across the codebase against the 9 requested Cormorant weights. Flagging as a candidate for a follow-up audit, not quantifying here.

---

## Finding 6 — Homepage requests both logo.png (327KB) AND logo.webp (92KB) — picture element may not be preventing dual fetch in the measured environment

**Severity: Medium (needs follow-up verification)**

**Measured:** `total-byte-weight` network request list from the mobile Lighthouse run includes **both**:
- `https://avirenajewels.com/logo.png` — 327,641 bytes
- `https://avirenajewels.com/logo.webp` — 91,851 bytes

**Cause (unconfirmed — flagging, not diagnosing):** The homepage markup (`src/pages/HomePage.tsx` line ~284) correctly uses `<picture><source srcSet="/logo.webp" type="image/webp" /><img src="/logo.png" .../></picture>`, which should cause a WebP-capable browser to fetch only the WebP source. Both showing up in the same trace could mean: (a) the `index.html` `<link rel="preload" href="/logo.webp">` plus a *second*, separate preload/reference to `logo.png` is firing (there is no evidence of an explicit `logo.png` preload in `index.html`, so this needs source inspection I did not complete), (b) the prerendered static HTML skeleton (before React mounts and replaces it) contains a plain `<img src="/logo.png">` without the `<picture>` wrapper, and that request fires before `createRoot` swaps the DOM — this is the most likely explanation given Finding 7 below, or (c) a Lighthouse simulated-environment artifact unrelated to real Chrome behavior.

**Fix:** Grep the prerendered `dist/` output (or `scripts/prerender.ts`'s skeleton HTML) for any bare `<img src="/logo.png">` outside the `<picture>` element, and check whether the CSP or crawler-facing skeleton references the PNG directly. If confirmed, wrap the skeleton's logo reference in the same `<picture>`/WebP pattern, or drop the PNG entirely and rely on the fallback only for the small percentage of pre-WebP browsers.

**Estimated improvement:** If this is a genuine double-fetch, eliminating it saves up to 327KB per homepage load for browsers that would otherwise only need the 92KB WebP. **Not confirmed — this needs a real-browser network panel check (not simulated Lighthouse) before treating it as fact.**

---

## Finding 7 — createRoot (not hydrateRoot): confirmed client-render-only, prerendered skeleton is discarded wholesale

**Severity: Medium — real but bounded, needs targeted CLS measurement**

**Measured (source inspection, `src/main.tsx`):**
```js
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
```
Confirmed: `hydrateRoot` is not used anywhere in the codebase's client entry. This means the prerendered HTML (built by `scripts/prerender.ts`, using the ~3.5KB inlined `critical-skeleton-css`) is real, crawlable HTML — but the client bundle does not attach to it. React tears down `#root`'s children and builds a fresh DOM tree from scratch on mount.

**What this costs, assessed (not directly measured with a layout-shift trace this session):**
- **Not a classic CLS risk in the strict measurement sense**, because the skeleton CSS (`.hero-section`, `.products-grid`, `.product-card img{aspect-ratio:1/1}`, etc.) was deliberately written to approximate the same box dimensions as the real Tailwind-styled components (confirmed by reading both `CRITICAL_CSS` in `prerender.ts` and the live component classNames — e.g., skeleton `.hero-section{min-height:60vh}` vs. live Tailwind `min-h-[calc(100vh-6rem)]`). If box dimensions genuinely match, `createRoot`'s full-tree replacement will repaint but not necessarily reflow/shift.
- **It is a real visual-flash / FOUC-adjacent risk**: the skeleton uses hand-rolled CSS approximating brand tokens (`--av-bg:#E7E4D5` etc.) while the hydrated app uses actual Tailwind utility classes. Even at matching box sizes, font rendering, exact spacing, and any Tailwind-only visual details (shadows, exact color tokens, hover states) will pop in in a single frame when React swaps the tree — this reads to a user as a flash/jump even if the CWV CLS *metric* stays low, because Chrome's layout-instability API only scores elements that shift position, not elements that are replaced in-place at the same coordinates.
- Confirmed CLS from the one full lab run: **mobile homepage CLS = 0.019** — passes "good" (≤0.1) by a wide margin. This is evidence the skeleton-to-hydrated swap is not causing a measurable *layout-shift-score* penalty on this page, on this run. It does not rule out a perceptible visual flash, which the CLS metric cannot capture.

**Fix (if the flash is confirmed by manual/video observation, which I did not do this session):** Migrate `main.tsx` from `createRoot` to `hydrateRoot`, and make sure the prerendered skeleton's DOM structure (tag order, not just visual approximation) matches what React's first client render would produce — hydration mismatches would otherwise throw console errors and force a `createRoot`-style fallback anyway. This is a moderate-effort change (the skeleton and the real component tree are currently maintained as two independent implementations, per the comment in `prerender.ts`: "Once React mounts it replaces #root wholesale... nothing here needs to survive that swap") and would need real hydration-compatible markup, not just visually-similar markup.

**Estimated improvement:** Unquantified. CLS is already passing (0.019), so the *metric* upside from hydration is small-to-none on this page. The upside would be perceptual (no flash) and a small TBT/TTI improvement from not discarding and rebuilding the DOM tree, but this was not isolated and measured separately from the GSAP/motion cost in Finding 3. **Recommend a manual side-by-side video capture (DevTools Performance panel, "Screenshots" enabled) as the correct falsification method before investing in a hydration migration** — this finding is a plausible risk, not a proven regression.

---

## Finding 8 — Shopify product images served as PNG, not WebP, via CDN width-param resizing (partially quantified from homepage grid only)

**Severity: Medium**

**Measured (from the one completed run — homepage product grid thumbnails only; `/shop` and the product detail page were NOT measured this session):**
Sample product thumbnail requests captured in the homepage trace, all `image/png` via `cdn.shopify.com` with `?width=` resizing already applied:
- `square_nadir-square-studs-gold-tone-brass-earrings_1.png?v=...&width=...` — 122,622 B
- `f58237af-...  .png?v=...` — 119,043 B
- `square_forma-statement-drops-geometric-brass-earrings_1.png?v=...` — 112,170 B
- `460a6da3-....png?v=...` — 109,293 B

Four product thumbnails alone total ~463KB, at roughly 110-123KB each for what are (per the `?width=` resizing confirmed present in `shopifyImage()` in `HomePage.tsx`) already down-scaled grid-cell images, not full 1254×1254 masters.

**Cause:** Shopify's image CDN supports a `format` URL parameter (`&format=webp` or `&format=pjpg`) alongside `width`, but `shopifyImage()` in `HomePage.tsx` (and presumably the equivalent helper used on `/shop` and product-detail pages, not inspected this session) only appends `&width=N`, never `&format=webp`. PNG is a poor codec choice for photographic jewelry product shots — WebP/AVIF typically cut 25-50% of bytes at equivalent visual quality for this content type.

**Fix:** Append `&format=webp` (Shopify CDN supports this natively, no re-upload needed) to every `shopifyImage()` call site. This is a one-line change in the URL-building helper(s), not an image reprocessing job, since Shopify transforms on the fly.

**Estimated improvement:** Based on the 25-50% typical WebP-vs-PNG savings range for photographic content and the ~463KB sampled from just 4 of the homepage's product thumbnails, a full-catalog rollout (`/shop` grid with 9 cards, and the 5-image gallery on product detail pages — both **unmeasured this session**) plausibly saves several hundred KB to 1MB+ per page view on image-heavy pages. **This is an extrapolation from a partial sample, not a direct measurement of `/shop` or the product page — treat as a hypothesis to confirm with a dedicated trace of those two URLs before committing engineering time.**

---

## Not Measured This Session (explicitly)

Per the coordinator's instruction to stop after the homepage finding, the following were **not measured** and no numbers should be inferred for them from this document:
- `/shop` (9 product cards) — mobile or desktop, any metric
- `/product/avirena-crystal-hoops-gold-tone-earrings` (5-image gallery) — mobile or desktop, any metric
- `/guides/does-brass-jewelry-turn-skin-green` (1,154-word article) — mobile or desktop, any metric
- Homepage **desktop** on the current (post-fix) build — the only desktop data point in this file is a stale run from 2026-09-04 (LCP 8.4s, CLS 0.122, TBT 420ms, score 33), captured **before** the hero.png fix and before this audit session; do not cite it as current.
- Real-device or field INP for any page — INP cannot be measured in a single-run Lighthouse lab trace (Lighthouse's `inp-breakdown-insight` returned `scoreDisplayMode: notApplicable` because no interaction occurred during the automated run). INP requires either CrUX field data (unavailable, no API credentials) or a manual DevTools recorded-interaction trace, neither of which was done.
- CLS for any page other than the one homepage-mobile run (0.019).
- The double-fetch of `logo.png`+`logo.webp` (Finding 6) — flagged from lab trace evidence only, not confirmed via real-browser DevTools network panel.
- Whether the visual flash from `createRoot`'s tree replacement (Finding 7) is actually perceptible — no video/screenshot-timeline capture was done.
- TBT/INP impact of GSAP deferral (Finding 3) post-fix.

---

## Ranked Priority Summary (by measured impact, where impact was measurable)

1. **hero.png → hero.webp (Finding 1)** — largest single measured number in this audit (5,096ms of the 15,191ms LCP was resource load duration for one 1.29MB file). Fix applied, unverified post-deploy.
2. **GSAP/motion deferral + decoupling hero visibility from opacity animation (Finding 3)** — 3,496ms of measured main-thread blocking time from one chunk, plus a structural coupling between LCP paint and a JS animation's completion. Not yet fixed.
3. **Shopify PNG → WebP via `&format=webp` (Finding 8)** — cheapest fix in this list (one URL parameter), meaningful but only partially quantified (homepage sample only; `/shop` and product-detail pages unmeasured).
4. **logo.png/logo.webp potential double-fetch (Finding 6)** — up to 327KB if confirmed, but confirmation status is weak (simulated-lab evidence only).
5. **createRoot vs hydrateRoot (Finding 7)** — real architectural question, but current CLS is already passing (0.019); this is a perceptual/robustness concern more than a CWV-metric failure as measured today.
6. **Font variant trim, entry-bundle bookkeeping (Findings 4, 5)** — low severity, correctness/hygiene items, not driving any failing metric.

TTFB (Finding 2) is explicitly *not* ranked as an action item — it is a measurement-methodology note, the real server is fast.
