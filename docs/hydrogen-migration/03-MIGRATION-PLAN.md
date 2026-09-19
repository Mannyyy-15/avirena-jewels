# 03 — Migration plan

**Estimate:** 4–7 working days. Build on a branch. The live Vercel site stays
up and serving ads until the final cutover.

Each phase has an acceptance test. **Do not start a phase until the previous
one passes** — most of the bugs in `04-GOTCHAS.md` came from skipping checks.

---

## Phase 0 — Scaffold (half a day)

```bash
npm create @shopify/hydrogen@latest
# choose: TypeScript, Tailwind CSS, no demo routes
```

Link to the store and pull environment variables:

```bash
npx shopify hydrogen link      # select Avirena Jewels
npx shopify hydrogen env pull
```

Env mapping (names change from the Vite app):

| Vite (now) | Hydrogen |
|---|---|
| `VITE_SHOPIFY_STORE_DOMAIN` | `PUBLIC_STORE_DOMAIN` |
| `VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN` | `PUBLIC_STOREFRONT_API_TOKEN` |
| `VITE_SHOPIFY_API_VERSION` | `PUBLIC_STOREFRONT_API_VERSION` |
| — | `PUBLIC_CHECKOUT_DOMAIN` ← **critical, see Phase 6** |

**Accept:** `npm run dev` serves a Hydrogen page that lists real Avirena
products from the live Storefront API.

---

## Phase 1 — Design system (half a day)

Port `tailwind.config` / theme, fonts (Cormorant Garamond + Plus Jakarta Sans),
and the brand tokens:

```
ink #413C23   accent #8F896D   error/urgency #7A0F1A
surfaces #E7E4D5 #F2EFDB #FAF8F5   border #D8D2C2   muted #6B6650
```

Port leaf components first — they are mostly presentational and carry over
almost unchanged: `AvirenaLogo`, `BrandLogo`, `PaymentBadges`, `Toast`,
`ProductCard`, `CatalogItemCard`.

**Accept:** a storybook-style page renders the brand palette, both fonts and a
`ProductCard` identically to production.

---

## Phase 2 — Routes (1–2 days, the big one)

Replace the `currentPage` state machine with file-based routes:

| Current | Hydrogen route file |
|---|---|
| `/` | `app/routes/_index.tsx` |
| `/shop` | `app/routes/shop._index.tsx` |
| `/shop/:category` | `app/routes/shop.$category.tsx` |
| `/collections` | `app/routes/collections._index.tsx` |
| `/collections/:handle` | `app/routes/collections.$handle.tsx` |
| `/product/:handle` | `app/routes/product.$handle.tsx` |
| `/guides`, `/guides/:slug` | `app/routes/guides._index.tsx`, `guides.$slug.tsx` |
| `/about /contact /faq /journal` | one file each |
| policies (5 routes) | `app/routes/$policy.tsx` or one file each |
| `/cart` | `app/routes/cart.tsx` |
| `/checkout` | **do not port** — see `05-INTEGRITY-RULES.md` |

Move data fetching from client `useEffect` into **server `loader`s**. This is
the main intellectual work: the current app fetches the whole catalogue client
side and filters in memory; Hydrogen should query per route.

**Keep:** empty categories returning 200 with `noindex, follow` and honest
"no pieces yet" copy.

**Accept:** all 46 routes render server-side. `curl` each one and confirm real
product content in the **raw HTML** (not just after JS).

---

## Phase 3 — Cart and checkout (1 day)

Use Hydrogen's `CartProvider` / cart handlers. Drop the bespoke cart code.

Port `PAIR_OFFERS` from `src/data/offers.ts` — the bundle **discounts already
exist in Shopify** and apply automatically; the frontend only displays them.

**Do not port** `CheckoutPage.tsx` or `buildDirectCheckoutUrl` — Hydrogen hands
off to Shopify checkout natively.

**Accept:** add 2 items of a duo pair → checkout shows exactly **₹100 off**;
adding `PREPAID50` makes it **₹150**. A single item + code = **₹50**.

---

## Phase 4 — Analytics (half a day) — the whole point

```tsx
import {Analytics} from '@shopify/hydrogen';

<Analytics.Provider cart={cart} shop={shop} consent={consent}>
  {/* app */}
</Analytics.Provider>
```

Add per-route analytics components: `Analytics.ProductView`,
`Analytics.CollectionView`, `Analytics.CartView`, `Analytics.SearchView`.

Then re-add the third-party layer — **all of it, or ad measurement breaks**:

- Meta Pixel `3584415405045765` + the funnel events in `02-CURRENT-ARCHITECTURE.md`
- GA4 `G-9WWZWVFT8S` + the `lib/analytics.ts` ecommerce events (port the file)
- GA4 cross-domain linker for both domains
- **No client-side Purchase event** — Shopify's FB channel owns it

Reproduce the CSP as Oxygen headers. Re-read `04-GOTCHAS.md` §1 and §2 first.

**Accept:** see `06-VERIFICATION.md` — this is the phase that justifies the
whole migration, so verify it properly rather than assuming.

---

## Phase 5 — SEO parity (half a day)

- Port all JSON-LD into route `meta` exports — **single source now**, no dual
  emission (`04-GOTCHAS.md` §8)
- Port the **12 legacy 301 redirects** from `vercel.json`
- Port `sitemap.xml` (Hydrogen can generate it) and `robots.txt`
- Port `llms.txt` **unchanged** — it is accurate, keep it that way
- Confirm canonical URLs match the current ones **exactly** — the path structure
  does not change, which is the main advantage over the App Proxy route

**Accept:** every one of the 46 URLs returns 200 with the same canonical, title
and description as production today.

---

## Phase 6 — DNS cutover (half a day, highest risk)

**Do not start until Phases 0–5 pass and the owner approves a window.**

Shopify requires **checkout domain == primary domain**. Today they are split.

1. Deploy to Oxygen, test on the `*.myshopify.dev` preview URL
2. In Shopify admin, set the primary domain to `avirenajewels.com`
3. Point `avirenajewels.com` DNS at Oxygen (Shopify admin gives the records)
4. Set `PUBLIC_CHECKOUT_DOMAIN=avirenajewels.com`
5. Keep `checkout.avirenajewels.com` resolving during the transition — live ads
   and existing cart permalinks reference it
6. **Update the Meta ad destination URLs the same day**

**Rollback:** keep the Vercel deployment live and the old DNS values recorded.
Reverting DNS restores the current site.

**Accept:** a real visit from a phone shows a session in Shopify Analytics
within ~15 minutes, and a test order completes end to end.

---

## Phase 7 — Post-cutover (ongoing, first 48h)

- Watch Shopify Analytics **Sessions** and **Live View** for real traffic
- Confirm Meta Events Manager still receives ViewContent → AddToCart →
  InitiateCheckout → Purchase (Purchase from Shopify server-side)
- Confirm GA4 still receives its events and sessions are not double-counted
- Re-measure CWV — Oxygen should be **faster**; the PDP was ~8s on Instagram's
  in-app browser
- Submit the sitemap in Search Console and watch for coverage errors

---

## Open decisions for the owner

1. **Draft product** `avirena-cascade-statement-drops-silver` — publish before
   or after cutover? (₹1,199, stock 2, 4 images ready)
2. **`RecentPurchaseToast`** — port it? If yes, the "Verified Order" label must
   go (`05-INTEGRITY-RULES.md`).
3. **Offer timer** — tie to a real window, or drop it?
4. **Cutover window** — ads should be paused during the DNS switch.
