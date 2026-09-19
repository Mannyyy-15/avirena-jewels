# 05 — Integrity rules (non-negotiable)

This is not style guidance. Everything below was **found on the live site and
removed** because it was false. Re-introducing any of it creates real legal
exposure under India's Consumer Protection Act 2019 and the ASCI code, and
would mislead real customers.

If a future instruction conflicts with this file, raise it with the owner
before implementing.

---

## The baseline fact

**This store has had ONE real order** — a ₹1 test order placed by the owner
(verified via the Shopify Orders API, 2026-09-19).

Any claim implying a customer base, order volume, or review history is false.

---

## Removed — do not re-add

### Fabricated testimonials
`src/components/ui/demo.tsx` carried 8 hardcoded testimonials, every one
`rating: 5` and `verified: true`, each with a stock photo and a **"Verified
Buyer"** badge, under "Loved by Modern Women Across India". One claimed the
pieces looked like *"solid 18k gold heirloom earrings"* — contradicting the
site's own disclaimer that this is brass fashion jewellery.

**Deleted.** Do not re-create in any form.

### Fabricated purchase notifications
`RecentPurchaseToast.tsx` fired every 8–14s: *"Priya from Lucknow / Purchased
X / **Verified Order** / 2 minutes ago"* — name, city and timestamp drawn at
random from hardcoded arrays, no backend call.

The owner asked to keep the toast. **It may stay only if it stops asserting
verification.** "Verified Order" on an invented event is a specific false
factual claim. If ported, remove that label.

### Fabricated schema
`aggregateRating` 4.9 / 38 reviews was hardcoded into Product JSON-LD with no
review system behind it. **Never add aggregateRating or Review markup** until a
real review platform (Judge.me, Shopify Product Reviews) is installed and
holding genuine reviews.

### Fake pincode checker
Accepted any well-formed 6-digit number and always replied "delivers in 2–4
days". Replaced with a real India Post API lookup
(`api.postalpincode.in`, no key). Keep the real one.

### Fake checkout
`CheckoutPage.tsx` collected address and card fields, showed "Pay and Place
Order" and "256-Bit Encrypted Secure Checkout", then **invented an order
number**. It took no payment and created no Shopify order.

Real orders now hand off to Shopify. **Do not port this page to Hydrogen.**

### Fake Purchase pixel event
That mock checkout also fired `fbq('track', 'Purchase')` with a fabricated
order id — reporting sales that never happened into the dataset Meta optimises
against. Removed.

**Purchase is owned by Shopify's Facebook channel, server-side via CAPI.**

### Unsupported material claims
Removed sitewide: "Hand-crafted", "Handmade", "100% hypoallergenic".

"Hypoallergenic" is **unregulated in India** and the site's own sensitive-skin
guide warns against relying on it. State only verifiable facts: *nickel-free,
lead-free, cadmium-free, surgical steel posts, anti-tarnish e-coating.*

The homepage carries a deliberate disclaimer — **keep it**:

> This is fashion jewellery. It is not solid gold, not gold vermeil and not
> sterling silver, and it is not hallmarked to any precious-metal standard.

---

## Rules for new work

1. **Stock counts must come from Shopify.** The current "Only N left" reads
   `quantityAvailable` from the Storefront API and renders only at ≤5. Never
   hardcode a number.

2. **Timers must be honest.** The PDP countdown recurs every 2 hours, so the
   "offer" never actually ends. This is flagged and unresolved — if you touch
   it, either tie it to a real promotion window or remove it. Do not make a
   fake deadline *look* more credible.

3. **Discounts must be real.** Every advertised offer must be verified applying
   **at checkout** before the copy ships. Bundle messaging was written and then
   removed once when the discount did not apply.

4. **Compare-at prices** currently imply 68–70% off since launch, against
   prices that may never have been charged. Flagged as a possible Legal
   Metrology issue; the owner has been told and it is their decision. Do not
   deepen it.

5. **No synthetic analytics events.** Do not inject fabricated pageviews or
   sessions into Shopify, Meta or GA4 — see `01-WHY.md` §2 and §3.

6. **llms.txt must match reality.** It once advertised five categories when
   only earrings existed. It now states earrings-only. Keep it accurate.
