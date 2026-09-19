# 04 — Gotchas: bugs already hit, fixed, and easy to re-introduce

Read this file before writing code. Every entry cost real debugging time and
several silently broke revenue or tracking. They are ordered by how expensive
they were.

---

## 1. CSP hash cancels `'unsafe-inline'` — Meta Pixel dead for days

`script-src` contained BOTH `'unsafe-inline'` AND a leftover
`'sha256-HSiUM2ls…'` from an old GA snippet.

**Per CSP spec, when any hash or nonce is present the browser IGNORES
`'unsafe-inline'`.** The inline pixel bootstrap was blocked. `fbq` was defined,
the config loaded, and **zero `/tr` beacons fired**. Ads were measured against
nothing.

**Rule:** never mix a hash with `'unsafe-inline'` in the same directive. If you
add a hash, every inline script needs one.

---

## 2. Google Analytics blocked by CSP — no data since launch

`connect-src` allowed `googletagmanager.com` (where the *script* loads) but not
`google-analytics.com` or `google.com` (where GA actually **sends** data). Every
event was refused. GA4 collected nothing for weeks.

**Rule:** allowing a script's origin is not enough. Allow the origins it
**beacons to**. After any analytics change, check DevTools console for
"Refused to connect".

---

## 3. Duplicate PageView halved apparent cost-per-result

Two route trackers existed: the inline one in `index.html` (URL-keyed, correct)
and a second `useEffect` in `App.tsx`. The second had `selectedProduct` in its
deps, which resolves **asynchronously** when the Shopify catalogue lands — so
every page fired PageView twice.

Doubled PageViews inflate traffic and halve cost-per-result on every campaign.

**Note:** my first fix was wrong. I patched the inline tracker with a settling
window; the duplicate was actually from React. **Trace `fbq` call stacks before
assuming a cause.**

---

## 4. Welcome modal blocked every ad click

The modal covered the full 390×844 mobile screen at 2.9s — *after* the visitor
had started scrolling — and blocked all product taps. Playwright's click
**timed out**. The only exit was a **28×28px** close button (Apple/Google
minimum is 44×44).

Fixed: skipped entirely for paid visits (`fbclid`, `gclid`, `ttclid`, paid
`utm_medium`/`utm_source`), 15s delay for organic, 44×44 button.

**Rule:** never interrupt a click you paid for.

---

## 5. Tailwind purged classes stored in JS data

Instagram tiles used `aspect-[4/5]` / `aspect-[3/4]` stored in a **JS data
array**, never as literal strings in markup. Tailwind purged them from the built
CSS, so containers reserved no height and the page reflowed as images loaded.

**Rule:** any Tailwind class that only exists inside a JS variable will be
purged. Use inline `style={{ aspectRatio }}` or safelist it.

---

## 6. CLS 0.362 → 0.02 — lazy route pushed the page down

The real cause was **not** images. The route is a lazy chunk behind a 70vh
`<Suspense>` fallback, so the Instagram section and footer painted early, then
were shoved down ~3,400px when the real page mounted.

Fixed by gating both on the route chunk having mounted (`RouteMountSignal`),
**keyed by route** — a boolean flag was cleared by a reset effect firing after
the mount, which **blanked the footer entirely** on instant-mount routes.

**Hydrogen note:** SSR should remove this class of bug. Verify CLS anyway.

---

## 7. `<picture>` wrapper broke the logo size

Wrapping `<img className="h-full">` in `<picture>` moved its sizing reference.
`<picture>` is an inline box with no height, so the logo rendered **70px in a
40px slot**.

**Rule:** when wrapping an image, the wrapper needs the sizing classes too.

---

## 8. Schema silently lost on hydration

`prerender.ts` emitted `BreadcrumbList` 13 times; `SeoMeta.tsx` emitted it once,
and `AboutPage`/`ContactPage`/`CategoryCode` **zero** times. Because React
replaces the DOM and **Google indexes the rendered DOM**, those blocks vanished.

**Hydrogen removes this** — one SSR pass, one source of schema. Do not
re-introduce dual emission.

---

## 9. ORDER-class discounts suppress each other

Bundles built as "₹100 off the order" silently killed the `PREPAID50` code —
Shopify allows **one ORDER-class discount per checkout**. Rebuilt as ₹50 per
item (`appliesOnEachItem: true` → PRODUCT-class), which stacks.

**Rule:** verify discounts **at checkout**, not by reading the admin. Cart
permalinks also take several seconds to compute totals — a fast scrape reads
pre-discount values and looks like a bug.

---

## 10. Headless testing traps

- **Meta ignores headless-shell user agents.** A pixel test showing "no events"
  is usually the UA. Use a real Chrome UA string.
- **Shopify checkout collapses its order summary** on mobile widths; scraping
  the page reads stale totals. Expand it, or wait ~9s.
- **`_shopify_y` / `_shopify_s` are set on the PARENT domain**
  (`domain=avirenajewels.com`), not the checkout subdomain. They ARE readable
  from the storefront.

---

## 11. Connector switched stores mid-session

The Shopify MCP connector silently switched to a different store
("Thepiecraft Rugs") and returned **its** analytics as if they were Avirena's.

**Rule:** call `get-shop-info` and confirm `Avirena Jewels` before trusting any
Shopify data. This happened three times.

---

## 12. Pre-existing type errors that do not block the build

`vite build` does **not** typecheck. `npm run lint` (`tsc --noEmit`) may report
errors that never reach Vercel. Fix them, but do not assume a red typecheck
explains a failed deploy — reproduce the deploy first.
