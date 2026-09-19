# Hydrogen Migration — Living Handoff Document

**Project**: Avirena Jewels Headless Storefront Migration  
**Target Architecture**: Shopify Hydrogen (Remix) + Shopify Oxygen Hosting  
**Source Codebase**: React 19 + Vite SPA (`src/`)  
**Living Documentation**: `docs/hydrogen-migration/`  

---

## 1. Collaboration Rules for all AI Agents

1. **Always Read First**:
   - `docs/hydrogen-migration/04-GOTCHAS.md` (Prevent repeating past expensive bugs).
   - `docs/hydrogen-migration/05-INTEGRITY-RULES.md` (Strict legal & truthfulness constraints: real orders=1, no fake reviews, no fake purchase toasts, all pieces are **Brass**).
   - `docs/hydrogen-migration/03-MIGRATION-PLAN.md` (Exact phase sequence).
2. **Phase Gating**: Never skip ahead to a future phase before the current phase's acceptance criteria are verified.
3. **Keep Live Site Intact**: Work exclusively on branch `hydrogen-migration`. Do not push breaking changes to `master`.
4. **Always Update This Handoff**: At the end of every working session, update the **Current Status**, **Completed Milestones**, **In-Progress Items**, and **Next Immediate Steps** below.

---

## 2. Current Status

- **Active Phase**: **Phase 0 — Scaffolding & Setup**
- **Git Branch**: `master` (Ready to branch to `hydrogen-migration`)
- **Live Production Status**: Active on Vercel at `avirenajewels.com`.
- **Meta ads: PAUSED** by the owner on 2026-09-19. This lowers cutover risk —
  Phase 6 no longer has to wait for an ad-free window. Ad destination URLs must
  still be re-checked before ads resume, whichever architecture is live then.

---

## 3. Phase Progress Tracker

| Phase | Description | Status | Verified By |
|---|---|---|---|
| **Phase 0** | Branch creation, `@shopify/hydrogen` scaffolding, environment variables, Shopify store link | 🟡 In Planning | Pending Approval |
| **Phase 1** | Design tokens, typography (Cormorant + Plus Jakarta Sans), palette, leaf components | ⚪ Not Started | — |
| **Phase 2** | Route architecture (46 routes), server `loader`s, raw HTML SSR | ⚪ Not Started | — |
| **Phase 3** | Hydrogen Cart API, Duo Suite automatic discount stacking, checkout handoff | ⚪ Not Started | — |
| **Phase 4** | Native Shopify Analytics (`Analytics.Provider`), Meta Pixel, GA4, CSP headers | ⚪ Not Started | — |
| **Phase 5** | SEO parity, JSON-LD schema, 12 legacy 301 redirects, sitemap.xml, robots.txt | ⚪ Not Started | — |
| **Phase 6** | Oxygen deployment, ₹1 end-to-end checkout verification, DNS cutover window | ⚪ Not Started | — |
| **Phase 7** | Post-cutover 48h monitoring (Shopify Admin Sessions, CAPI, GA4, CWV) | ⚪ Not Started | — |

---

## 4. Key Configuration & Secrets Map

| Variable | Value / Destination | Notes |
|---|---|---|
| Store Domain | `m5yhxq-gb.myshopify.com` | Primary Shopify store |
| Shop ID | `103193641282` | Avirena Jewels |
| Meta Pixel ID | `3584415405045765` | Funnel events: ViewContent, AddToCart, InitiateCheckout |
| GA4 Measurement ID | `G-9WWZWVFT8S` | Cross-domain linking enabled |
| Current Checkout | `checkout.avirenajewels.com` | Will merge to `avirenajewels.com` in Phase 6 |

---

## 5. Immediate Next Actions

1. User reviews and approves implementation plan.
2. Create and checkout Git branch: `git checkout -b hydrogen-migration`.
3. Scaffold `@shopify/hydrogen@latest` in `hydrogen/`.
4. Link to Shopify store via `npx shopify hydrogen link` and verify local dev boot.

---

## 6. Live-site state as of 2026-09-19 (pre-migration baseline)

The Vercel site is healthy. If the migration stalls or is abandoned, this is a
working storefront — nothing here is blocked on Hydrogen.

Shipped and verified in the last session:

| Change | Status |
|---|---|
| Welcome modal skipped for paid traffic (`fbclid`/`gclid`/utm), 15s for organic, 44x44 close | live |
| GA4 ecommerce events (`view_item`, `add_to_cart`, `add_to_wishlist`, `begin_checkout`) | live |
| GA4 cross-domain linking (apex + checkout) | live |
| Vercel Web Analytics + CSP allowances | live |
| Meta Pixel funnel, single PageView (duplicate tracker removed) | verified |
| Duo bundles (P1+P2-100) + `PREPAID50`, PRODUCT-class so they stack | verified at checkout |
| 6-month anti-tarnish guarantee (FAQ + llms.txt) | live |
| Real low-stock counts from `quantityAvailable` | live |

**Known-good numbers to regression-test against after cutover:**
- Page-load CLS: ~0.0001 home, ~0.02 PDP (mobile)
- Pixel funnel on a PDP: `PageView, ViewContent` then `AddToCart` — exactly one PageView
- Crystal Hoops duo at checkout: ₹1,248 (₹1,198 with `PREPAID50`)

## 7. Open decisions still owned by the user

1. Publish draft product `avirena-cascade-statement-drops-silver` (₹1,199, stock 2, 4 images ready)?
2. Port `RecentPurchaseToast`? If yes, the **"Verified Order"** label must be removed — see `05-INTEGRITY-RULES.md`.
3. PDP offer timer recurs every 2h, so the "offer" never ends. Tie to a real window, or drop it?
4. Compare-at prices imply 68-70% off since launch. Flagged as a possible Legal Metrology issue; user's call, untouched.

## 8. Cross-agent note

This file is the single source of session state. Any agent (Claude, Antigravity,
Codex) should update sections 2, 3 and 5 at the end of its session so the next
one starts from fact rather than assumption. Prefer recording what was
**measured** over what was expected — see `06-VERIFICATION.md`.
