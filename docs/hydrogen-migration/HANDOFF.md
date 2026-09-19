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

- **Active Phase**: **Phase 6 — DNS Cutover** (Pending owner action for Shopify CLI login & DNS changes)
- **Git Branch**: `hydrogen-migration`
- **Build Status**: ✅ Passes (`npm run build` exit code 0, 3.25s client + 3.64s server)
- **MiniOxygen Dev Server**: Verified on `http://localhost:3100`
- **Live Production Status**: Active on Vercel at `avirenajewels.com`.
- **Meta ads: PAUSED** by the owner on 2026-09-19. This lowers cutover risk —
  Phase 6 no longer has to wait for an ad-free window. Ad destination URLs must
  still be re-checked before ads resume, whichever architecture is live then.

---

## 3. Phase Progress Tracker

| Phase | Description | Status | Verified By |
|---|---|---|---|
| **Phase 0** | Branch creation, `@shopify/hydrogen` scaffolding, environment variables, Shopify store link | 🟢 Completed | Antigravity (2026-09-19) |
| **Phase 1** | Design tokens, typography (Cormorant + Plus Jakarta Sans), palette, leaf components | 🟢 Completed | Antigravity (2026-09-19) |
| **Phase 2** | Route architecture (45 routes), server `loader`s, raw HTML SSR | 🟢 Completed | Antigravity (2026-09-19) |
| **Phase 3** | Hydrogen Cart API, Duo Suite automatic discount stacking, checkout handoff | 🟢 Completed | Antigravity (2026-09-19) |
| **Phase 4** | Native Shopify Analytics (`Analytics.Provider`), Meta Pixel, GA4, CSP headers | 🟢 Completed | Antigravity (2026-09-19) |
| **Phase 5** | SEO parity, JSON-LD schema, 24 legacy 301 redirects, sitemap.xml, robots.txt, llms.txt | 🟢 Completed | Antigravity (2026-09-19) |
| **Phase 6** | Oxygen deployment, DNS cutover, `PUBLIC_CHECKOUT_DOMAIN` update | 🟡 Pending Owner | — |
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

## 5. Immediate Next Actions (Phase 6 — DNS Cutover)

> **Requires interactive terminal access** — the Shopify CLI needs browser-based OAuth login.

1. **Login**: `npx shopify auth login --shop m5yhxq-gb.myshopify.com`
2. **Link**: `npx shopify hydrogen link` (select "Avirena Jewels")
3. **Deploy Preview**: `npx shopify hydrogen deploy --preview --force --no-lockfile-check`
4. **Smoke test** the `*.myshopify.dev` preview URL (see `06-VERIFICATION.md`)
5. **Set primary domain** to `avirenajewels.com` in Shopify Admin → Settings → Domains
6. **Point DNS** at Oxygen (Shopify provides records)
7. **Update** `PUBLIC_CHECKOUT_DOMAIN` to `avirenajewels.com`
8. **Re-deploy**: `npx shopify hydrogen deploy --force --no-lockfile-check`
9. **Verify**: Sessions appear in Shopify Analytics Live View within 15 minutes

**Rollback**: Revert DNS to Vercel IPs. The Vercel deployment stays live.

---

## 6. Completed Work Summary (Phases 0–5)

### Routes (45 total)
- Homepage, Shop (index + category), Collections (index + handle + all)
- Products PDP, Cart, Checkout (redirect to Shopify)
- About, Contact, FAQ, Journal, Guides (index + slug)
- Policies (index + handle + 4 individual policy routes)
- Account (login, logout, authorize, profile, addresses, orders)
- Search, Blogs, Pages, Discount, Design System
- `robots.txt`, `sitemap.xml`, `sitemap.$type.$page.xml`
- Catch-all 404 (`$.tsx`)

### Analytics
- GA4 `G-9WWZWVFT8S` with cross-domain linker (apex + checkout)
- Meta Pixel `3584415405045765` with nonce security
- `Analytics.Provider` from `@shopify/hydrogen` wrapping all routes
- `trackViewItem`, `trackAddToCart`, `trackBeginCheckout` on PDPs
- No client-side Purchase event (Shopify CAPI handles this)

### SEO
- JSON-LD: Organization, WebSite, Product, BreadcrumbList
- 24 legacy 301 redirects in `server.ts`
- `robots.txt` with Shopify-standard disallow rules
- `sitemap.xml` via Hydrogen's `getSitemapIndex`
- `llms.txt` ported unchanged to `public/`
- Canonical URLs matching production exactly

### CSP (entry.server.tsx)
- `scriptSrc`: self, cdn.shopify.com, connect.facebook.net, googletagmanager.com, google-analytics.com
- `connectSrc`: all GA4/FB beacon domains, shopify domains, checkout domain
- `imgSrc`: cdn.shopify.com, facebook, google analytics
- `fontSrc`: fonts.gstatic.com, cdn.shopify.com
- `styleSrc`: unsafe-inline, fonts.googleapis.com (no hash collision — per Gotcha §1)

---

## 7. Live-site state as of 2026-09-19 (pre-migration baseline)

The Vercel site is healthy. If the migration stalls or is abandoned, this is a
working storefront — nothing here is blocked on Hydrogen.

**Known-good numbers to regression-test against after cutover:**
- Page-load CLS: ~0.0001 home, ~0.02 PDP (mobile)
- Pixel funnel on a PDP: `PageView, ViewContent` then `AddToCart` — exactly one PageView
- Crystal Hoops duo at checkout: ₹1,248 (₹1,198 with `PREPAID50`)

---

## 8. Open decisions still owned by the user

1. Publish draft product `avirena-cascade-statement-drops-silver` (₹1,199, stock 2, 4 images ready)?
2. Port `RecentPurchaseToast`? If yes, the **"Verified Order"** label must be removed — see `05-INTEGRITY-RULES.md`.
3. PDP offer timer recurs every 2h, so the "offer" never ends. Tie to a real window, or drop it?
4. Compare-at prices imply 68-70% off since launch. Flagged as a possible Legal Metrology issue; user's call, untouched.

---

## 9. Cross-agent note

This file is the single source of session state. Any agent (Claude, Antigravity,
Codex) should update sections 2, 3 and 5 at the end of its session so the next
one starts from fact rather than assumption. Prefer recording what was
**measured** over what was expected — see `06-VERIFICATION.md`.
