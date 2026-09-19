# 06 — Verification

The recurring failure mode on this project has been **assuming something works
because the code looks right**. The Meta Pixel was dead for days, GA4 for weeks,
and both looked fine in source. Verify in a browser, against the live site.

---

## Testing setup that works here

Playwright is installed in the scratchpad, and Chromium lives at:

```
C:/Users/ThePiecraft/AppData/Local/ms-playwright/chromium_headless_shell-1234/
  chrome-headless-shell-win64/chrome-headless-shell.exe
```

**Always pass a real user agent.** Meta silently ignores headless-shell UAs, so
a pixel test will show zero events and look like a bug:

```js
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) ' +
             'AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 ' +
             'Instagram 320.0.0.0',
  locale: 'en-IN', hasTouch: true, isMobile: true,
});
```

This is the Instagram in-app browser — the environment most paid traffic
actually arrives in. Test there, not just desktop Chrome.

---

## Phase 2 — routes render server-side

```bash
for u in / /shop /product/avirena-square-studs-gold-tone-brass-earrings; do
  curl -s "http://localhost:3000$u" | grep -c "Avirena"
done
```

Must be non-zero **in the raw HTML**. Under the old Vite app the raw HTML had
**zero `<img>` tags** — Hydrogen SSR should fix this. Confirm:

```bash
curl -s http://localhost:3000/shop | grep -c "<img"
```

---

## Phase 3 — discounts actually apply

Read the totals **at checkout**, never from the admin. Wait ~9s: cart permalinks
take seconds to compute, and a fast scrape reads pre-discount values.

| Cart | Expected total |
|---|---|
| Crystal Hoops gold + silver | **₹1,248** (₹100 off) |
| Same + `PREPAID50` | **₹1,198** (₹150 off) |
| Single ₹799 item + `PREPAID50` | **₹749** (₹50 off) |
| Single item, no code | **₹799** (no discount) |

On mobile widths Shopify **collapses the order summary** — expand it or you will
read stale numbers.

---

## Phase 4 — analytics (the phase that justifies the migration)

### Meta Pixel

Spy on `fbq` *after* it exists, then walk the funnel:

```js
await page.evaluate(() => {
  window.__ev = [];
  const real = window.fbq;
  window.fbq = function () {
    if (arguments[0] === 'track') window.__ev.push(arguments[1]);
    if (typeof real === 'function') return real.apply(this, arguments);
  };
});
```

Expected on a PDP: `PageView, ViewContent` — **exactly one PageView**. Two means
a duplicate tracker (`04-GOTCHAS.md` §3). After Add to Bag: `AddToCart`.

### GA4

Same spy on `window.gtag`. Expected: `view_item` on PDP load, `add_to_cart` on
Add to Bag, `begin_checkout` on checkout hand-off.

### CSP

```js
page.on('console', m => {
  if (/Content Security Policy|Refused/i.test(m.text())) console.log(m.text());
});
```

**Must be silent.** Any "Refused to connect" means an analytics host is missing
from `connect-src` — exactly how GA sat dead for weeks.

### The decisive test — native Shopify analytics

This is the entire point of the migration. **Do not declare success without it.**

1. Deploy to Oxygen with `PUBLIC_CHECKOUT_DOMAIN` set
2. Visit the storefront from a **real phone on mobile data** (not a VPN, not
   headless)
3. Browse 2–3 product pages
4. Open Shopify admin → **Analytics → Live View**
5. Within ~15 minutes, check **Analytics → Reports → Sessions**

**Pass:** sessions appear with the correct traffic source.
**Fail:** sessions stay flat → check `PUBLIC_CHECKOUT_DOMAIN` and that the
checkout domain equals the primary domain. Several GitHub reports trace exactly
this. If it still fails after that, the migration has not delivered its goal —
say so plainly rather than reporting partial success.

---

## Phase 5 — SEO parity

Compare every route against production:

```bash
curl -s https://avirenajewels.com/shop | grep -oE '<link rel="canonical"[^>]*>'
curl -s http://localhost:3000/shop     | grep -oE '<link rel="canonical"[^>]*>'
```

Titles, descriptions and canonicals must match. Check all 12 legacy 301s still
redirect in **one hop**:

```bash
curl -s -o /dev/null -w "%{http_code} -> %{redirect_url}\n" \
  https://avirenajewels.com/product/nadir-square-studs-gold-tone-brass-earrings
```

Expect `301`/`308` straight to the `avirena-*` handle.

---

## Phase 6 — post-cutover smoke test

| Check | Expected |
|---|---|
| Homepage | 200, real content in raw HTML |
| All 46 routes | 200 |
| 12 legacy redirects | single-hop 301 |
| Add to cart → checkout | reaches Shopify checkout, correct total |
| Meta Events Manager | ViewContent, AddToCart, InitiateCheckout arriving |
| Shopify Live View | shows your own visit |
| CLS (mobile) | < 0.1 |
| LCP (mobile) | should **improve** vs ~8s on Instagram today |
| Console | no errors, no CSP violations |

---

## Reporting standard

State what you **measured**, not what you expect. If something is unverified,
say "unverified". If a phase fails, report the failure with the evidence rather
than moving on — every expensive bug on this project survived because a check
was skipped or a result assumed.
