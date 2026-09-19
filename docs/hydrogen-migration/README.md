# Avirena Jewels — Hydrogen/Oxygen Migration

**Status:** Planned, not started
**Written:** 2026-09-19
**Audience:** An AI agent or developer picking this up with NO prior context.

---

## Read these in order

| # | File | What it gives you |
|---|------|-------------------|
| 1 | `01-WHY.md` | Why we are migrating. Read this before arguing with the plan. |
| 2 | `02-CURRENT-ARCHITECTURE.md` | How the site works today. Hard-won facts, many non-obvious. |
| 3 | `03-MIGRATION-PLAN.md` | Phase-by-phase build order with acceptance criteria. |
| 4 | `04-GOTCHAS.md` | Bugs already hit and fixed. **Do not re-introduce these.** |
| 5 | `05-INTEGRITY-RULES.md` | Non-negotiable content rules. Violating these has legal exposure. |
| 6 | `06-VERIFICATION.md` | How to prove each phase actually works. |

---

## The one-paragraph summary

Avirena Jewels is a headless Shopify store. The storefront is a Vite + React SPA
hosted on Vercel at `avirenajewels.com`; Shopify serves only the checkout at
`checkout.avirenajewels.com`. Because Vercel serves the pages, **Shopify's
Analytics dashboard shows almost no sessions** (8, versus 1,800 in GA4). The
owner wants native Shopify analytics. The only complete, free, supported way to
get it is to rebuild the storefront in **Shopify Hydrogen** hosted on
**Shopify Oxygen** — which is included free on the existing Basic plan.

This is a **port, not a migration**. ~14,100 lines of TSX across 12 pages and 25
components. Estimated **4–7 days**. Build on a branch, cut over when verified.

---

## Ground truth (verified 2026-09-19, do not assume otherwise)

| Fact | Value |
|---|---|
| Storefront | `avirenajewels.com` → Vercel |
| Checkout | `checkout.avirenajewels.com` → Shopify |
| Shopify store | `m5yhxq-gb.myshopify.com` |
| Shop ID | `103193641282` |
| Plan | Basic (Oxygen is free on this) |
| Products | 14 active + 1 draft, all earrings |
| Real orders | **1** — a ₹1 test order by the owner |
| GA4 | `G-9WWZWVFT8S` |
| Meta Pixel | `3584415405045765` |
| Live routes | 46 (see `02-CURRENT-ARCHITECTURE.md`) |

---

## Hard constraint that decides the DNS plan

Shopify requires **checkout domain == primary domain** for Hydrogen analytics to
populate the admin dashboard. Today they are split:

```
storefront  avirenajewels.com           (Vercel)
checkout    checkout.avirenajewels.com  (Shopify)
```

After migration, `avirenajewels.com` must be BOTH the Oxygen-hosted storefront
and the checkout domain. This is the documented, supported configuration — not a
workaround. Set `PUBLIC_CHECKOUT_DOMAIN=avirenajewels.com`.

---

## What NOT to do

Five other approaches were investigated and **tested against the live store**.
All failed. Do not revisit them — the reasons are recorded in `01-WHY.md`:

1. `customerIpAddress` / `userAgent` in the cart mutation — **fields do not exist**
2. Monorail/Trekkie beacon — works, but spoofs events; rejected on ethics/ToS
3. Cloudflare Worker proxy — same spoofing plus forges customer IPs
4. DNS repoint to Shopify's IP — **takes the site offline** (verified: `000`)
5. `marketing_events` Admin API — populates Marketing reports, **not Sessions**

---

## If you are an AI continuing this work

- Everything in these docs was **verified against the live site or live API**,
  not inferred. Where something is uncertain, it says so explicitly.
- `04-GOTCHAS.md` is the highest-value file. It lists real bugs that cost hours.
- `05-INTEGRITY-RULES.md` is not style guidance. Fabricated reviews, fake stock
  counts and invented order notifications were removed from this site for legal
  reasons. Do not re-add them in any form.
- Ask the owner before: changing URLs, changing DNS, or deleting Shopify data.
