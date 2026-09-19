# 02 — How the site works today

Every statement here was verified against the running code or the live site.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite (SPA, **not** Next.js) |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Hosting | Vercel |
| Commerce | Shopify Storefront API (headless) |
| Checkout | Shopify-hosted at `checkout.avirenajewels.com` |
| Animation | GSAP + Lenis smooth scroll + Framer Motion |
| Analytics | GA4 `G-9WWZWVFT8S`, Meta Pixel `3584415405045765`, Vercel Analytics |

---

## Routing — the biggest thing to rewrite

There is **no router library**. `src/App.tsx` (~1,300 lines) is a hand-rolled
state machine:

```tsx
const [currentPage, setCurrentPage] = useState<PageView>(initialPageFromPath);
```

- `PageView` is a union in `src/types.ts` (`'home' | 'shop' | 'pdp' | ...`)
- `initialPageFromPath()` parses `window.location.pathname` on first render
- `buildPath()` maps state → URL; an effect calls `history.pushState`
- Pages are lazy-loaded via `lazyWithRetry()` (reloads once on a stale chunk
  after a deploy — keep this idea, Oxygen has the same problem)

**In Hydrogen this all disappears.** File-based routes replace it entirely.
Budget real time for this; it touches every page.

---

## Prerendering — replaced by SSR

`scripts/prerender.ts` runs after `vite build` and writes **46 static HTML
files**, each with its own meta tags and JSON-LD.

**Critical detail:** `src/main.tsx` uses `createRoot`, **not** `hydrateRoot`.
React therefore **discards** the prerendered DOM and rebuilds it. Consequences:

- Prerendered HTML is only a first paint + a fallback for non-JS crawlers
- Raw HTML contains **zero `<img>` tags** — all images are client-rendered
- Schema must be emitted **twice**, identically: once in `prerender.ts` and
  once in `SeoMeta.tsx`. They have drifted before (see `04-GOTCHAS.md`)

Hydrogen's SSR removes this entire class of problem. Good riddance.

---

## The 46 live routes

```
/                                   home
/shop                               all products
/shop/earrings                      only category with stock
/collections                        hub
/collections/under-999              curated
/collections/gifting-edit           curated
/collections/duo-suites             curated (bundles)
/about /contact /faq /journal /guides
/guides/<slug>                      7 guides
/privacy-policy /refund-policy /shipping-policy
/terms-of-service /legal-notice /policies
/product/<handle>                   15 real + 6 bundle pages
```

Empty categories (`/shop/rings`, `/necklaces`, `/bracelets`, `/brooches`) return
**200 with `noindex, follow`** and honest "no pieces yet" copy. Keep this.

`vercel.json` holds **12 legacy 301s** from a pre-rebrand handle change. These
MUST be carried over — the site is headless, so Shopify's own redirects never
fire.

---

## Catalogue (verified 2026-09-19)

14 active products, all earrings, ₹599–₹1,199. One draft
(`avirena-cascade-statement-drops-silver`, ₹1,199, stock 2, needs publishing).

**Only one design exists in both tones:** Crystal Hoops (gold ₹699 / silver ₹649).

### Bundles

Defined in `src/data/offers.ts` as `PAIR_OFFERS`, and backed by **real Shopify
automatic discounts**. Pricing rule is `P1 + P2 − ₹100`.

| Bundle | Maths | Total |
|---|---|---|
| Crystal Hoops Duo | 699 + 649 − 100 | ₹1,248 |
| Studs + Hearts Duo | 799 + 799 − 100 | ₹1,498 |
| Drops + Spirals Duo | 699 + 599 − 100 | ₹1,198 |

**Critical implementation detail:** the discounts are `₹50 off each item`
(`appliesOnEachItem: true`), which makes them **PRODUCT-class**. They were first
built as `₹100 off the order` (ORDER-class) and that **silently suppressed the
`PREPAID50` code**, because Shopify allows only **one ORDER-class discount per
checkout**. Do not "simplify" this back.

`PREPAID50` = ₹50 off any order, all products and bundles, `combinesWith:
{ productDiscounts: true, orderDiscounts: true, shippingDiscounts: true }`.

Verified at checkout: ₹100 off a pair, ₹150 with the code, ₹50 on a single item.

---

## Analytics — current, working state

| Event | Meta Pixel | GA4 |
|---|---|---|
| PageView | index.html inline (URL-keyed SPA tracker) | automatic |
| view_item / ViewContent | `ProductDetailPage.tsx` | `lib/analytics.ts` |
| add_to_cart / AddToCart | `App.handleAddToCart` | `lib/analytics.ts` |
| add_to_wishlist | `App.handleToggleWishlist` | `lib/analytics.ts` |
| begin_checkout / InitiateCheckout | PDP Buy Now, cart page, cart drawer | `lib/analytics.ts` |
| **Purchase** | **Shopify's FB channel, server-side via CAPI** | not sent |

**Never add a client-side Purchase event.** The order completes on a different
origin. Shopify's Facebook & Instagram channel (installed, "Maximum" data
sharing) owns Purchase. A client Purchase event would invent sales.

GA4 cross-domain linking is configured in `index.html` via
`linker: { domains: [...] }`.

---

## Checkout hand-off

`src/lib/shopify.ts` → `buildDirectCheckoutUrl(items)` builds a cart permalink:

```
https://checkout.avirenajewels.com/cart/<variantId>:<qty>,<variantId>:<qty>
```

This is the fast path and is used by the PDP Buy Now, the cart page and the cart
drawer. Falls back to `syncLocalCartToShopify()` (a `cartCreate` mutation) if the
permalink cannot be built.

`src/pages/CheckoutPage.tsx` is a **non-functional mock** kept only as a fallback
when Shopify is unconfigured. It takes no payment. **Do not port it to Hydrogen**
— Hydrogen hands off to real Shopify checkout natively.

---

## Environment variables

```
VITE_SHOPIFY_STORE_DOMAIN=m5yhxq-gb.myshopify.com
VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=<secret>
VITE_SHOPIFY_API_VERSION=2025-01
SHOPIFY_CLIENT_ID=<secret>       # Admin API, scripts only
SHOPIFY_CLIENT_SECRET=<secret>   # Admin API, scripts only
```

Hydrogen renames these — see `03-MIGRATION-PLAN.md`.

---

## CSP (`vercel.json`)

Restrictive and deliberately maintained. Must be reproduced in Hydrogen or
analytics will silently break (it has, twice). Allowed hosts include:

- `script-src`: `connect.facebook.net`, `googletagmanager.com`,
  `va.vercel-scripts.com`, `'unsafe-inline'`
- `connect-src`: facebook, myshopify, checkout domain, `api.postalpincode.in`,
  google-analytics, vercel-insights
- `img-src`: `cdn.shopify.com`, facebook, google

**Never put a hash alongside `'unsafe-inline'`** — per CSP spec the hash makes
the browser ignore `'unsafe-inline'`, which silently blocked the Meta Pixel for
days. See `04-GOTCHAS.md`.
