# 01 — Why Hydrogen, and why not the alternatives

## The problem

Shopify Analytics shows ~8 sessions. GA4 shows ~1,800 for the same period.
Neither is wrong — they measure different things:

- **Shopify Analytics** counts requests **Shopify's own servers serve**.
- Our pages are served by **Vercel**. Shopify never sees them.
- So Shopify only records the few visitors who reach the checkout domain.

The owner wants native Shopify numbers. That is a legitimate ask, and the
answer is architectural: to be counted by Shopify, Shopify must serve the pages.

---

## Five approaches tested and rejected

Each was tested against the live store or live API. Do not re-propose them.

### 1. Pass tracking data in the cart mutation — IMPOSSIBLE

Widely suggested online. Introspected the live Storefront API (2025-01):

```
CartBuyerIdentityInput: email, phone, companyLocationId,
                        countryCode, customerAccessToken, preferences
CartInput:              attributes, lines, discountCodes, giftCardCodes,
                        note, buyerIdentity, delivery, metafields
```

No `customerIpAddress`. No `userAgent`. They existed on `checkoutCreate`, which
Shopify **removed in 2026**. Any guide describing this predates that removal.

### 2. Monorail / Trekkie beacon — WORKS, BUT REJECTED

`POST checkout.avirenajewels.com/.well-known/shopify/monorail/unstable/produce_batch`

Confirmed it accepts events from our origin and validates the schema
(`trekkie_storefront_page_view/1.1`, requires `shopId`, `uniqToken`,
`visitToken`, `microSessionId`, `path`).

Rejected because:
- It **fabricates** analytics events from an unauthorised origin. This is the
  same class of problem as the fake reviews and fake order toasts already
  removed from this site (see `05-INTEGRITY-RULES.md`).
- The endpoint is marked `unstable` — Shopify can break it silently.
- Plausibly violates Shopify's API terms.

**This is what Littledata and Fueled actually do.** It is why they charge money:
they carry the compliance and maintenance risk.

### 3. Cloudflare Worker proxy — REJECTED

Proposed code's own comment said `// Silently spoof a pageview event`. Same
fabrication as #2, plus it forwards `X-Forwarded-For` with real customer IPs —
a privacy exposure under India's DPDP Act. The proposed snippet was also broken
(`ctx` undefined, `https://vercel.app` is not a real origin, tracking URL looped
to our own apex).

### 4. DNS repoint to Shopify's IP — BREAKS THE SITE

Proposal: point the apex A record at `23.227.38.65` and have Shopify "fetch the
React app from Vercel behind the scenes." **Shopify has no such feature.**

Tested: `curl --resolve avirenajewels.com:443:23.227.38.65` returns **`000`** —
connection refused, no certificate for that hostname. The Shopify theme also has
a **password page** on it. Repointing DNS takes the storefront offline.

### 5. `marketing_events` Admin API — WRONG REPORT

Tested live: `GET /admin/api/2025-01/marketing_events.json` → `200 {"marketing_events":[]}`.

It works, but it is a **campaign registry**, not a session tracker. Shopify's
docs: events *"should be modeled at the campaign level."* One record per
campaign, not per visitor. Populates **Marketing reports**, not **Sessions**.

The GraphQL equivalent `MarketingActivityCreateInput` accepts exactly two fields
(`marketingActivityExtensionId`, `status`) and requires a registered marketing
app extension. You cannot POST arbitrary pageviews into it.

---

## Two approaches that genuinely work

### App Proxy — works, but costly

Shopify serves the pages through a proxied sub-path, so sessions are real.

**Cost:** the prefix must be one of `apps`, `a`, `community`, `tools` — Shopify
**forbids root**. Every URL becomes `avirenajewels.com/a/store/...`, and the
apex would serve the Shopify theme (currently a password page). Also gives no
product-view or add-to-cart tracking, since those need Shopify's theme JS.

### Hydrogen + Oxygen — the recommended answer

| | Hydrogen/Oxygen | App Proxy |
|---|---|---|
| Sessions in Shopify | Yes | Yes |
| Live View | Yes | Unverified |
| Product views / add-to-cart | Yes | No |
| URLs stay clean | Yes | No (`/a/store/...`) |
| Homepage stays yours | Yes | No |
| Cost | ₹0 (free on Basic) | ₹0 |
| Speed | Faster (edge, 100+ PoPs) | Slower (extra hop) |

Shopify's docs on `Analytics.Provider`: it *"enables you to view metrics in real
time, directly in the Shopify admin."*

**Requirements** (all satisfiable):
1. Hosted on Oxygen — free on Basic
2. `PUBLIC_CHECKOUT_DOMAIN` set to the primary domain
3. Checkout domain == primary domain (needs the DNS change in README)
4. Consent handling via the Customer Privacy API

---

## Honest caveats

- This is a **4–7 day port**, not a migration. Hydrogen is React Router v7; the
  current app is a client-side SPA with a `currentPage` state machine.
- Several GitHub discussions report sessions **not** populating when the
  checkout-domain requirement is unmet. Get that right or the whole exercise
  fails. Verify with a real visit before declaring success.
- Do not start this mid-campaign. Build on a branch; cut over when verified.
