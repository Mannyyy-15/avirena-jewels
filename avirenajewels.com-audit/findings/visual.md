# Visual / Mobile Rendering Audit — avirenajewels.com
Captured 2026-09-04. Screenshots referenced below live in `../screenshots/` (desktop = 1440px viewport, mobile = 390px viewport; `-early` = screenshot taken immediately after `domcontentloaded`, before hydration/network settle; `-full` = full-page scroll capture).

---

## 1. CRITICAL — Hydration content swap: mock catalog (19 items) flashes before real Shopify catalog (3 items) loads

**Evidence:**
- `shop-bracelets-desktop-early.png` — masthead reads "ALL JEWELRY (19)" (top right: `HOME / SHOP / ALL JEWELRY (19)`), with three empty beige placeholder tiles and no product photography rendered underneath.
- `shop-bracelets-desktop.png` (settled state) — same URL now reads "ALL JEWELRY (3)" with three real product photos (a layered necklace, drop earrings, statement earrings — none of which are bracelets).
- `shop-brooches-desktop-early.png` / `shop-brooches-desktop.png` show the identical 19→3 swap on a different category URL.

**What's happening:** `CollectionPage.tsx` renders the local mock dataset (`src/data/products.ts`, 19 items) synchronously on mount, then replaces it once the real Shopify fetch (3 products total, store-wide) resolves. The visible symptom is a product **count that changes from 19 to 3** and a full tile reflow/re-paint after the page appears "loaded" — a genuine layout-shift and a trust problem: a shopper who screenshots or shares the page in the ~1-2s window before the swap sees a catalog that doesn't exist.

**SEO/UX consequence:** Googlebot's rendering pass may index either state depending on timing, meaning the indexed count/description of "19 pieces" could get cached and diverge from the live count of 3 — inconsistent snippets in search results. For users, a shifting product count during the exact moment they're deciding whether to keep browsing damages credibility immediately.

**Fix:** Do not render the mock array at all in production; show a skeleton/loading state (shimmer tiles, no fabricated count) until the real Shopify response resolves, then paint once.

---

## 2. CRITICAL — No category filtering: every /shop/{category} URL renders the same "ALL JEWELRY" list

**Evidence:**
- `shop-bracelets-desktop.png`, `shop-brooches-desktop.png`, `shop-earrings-desktop.png`, `shop-rings-desktop.png` are visually identical once hydrated: same masthead "ALL JEWELRY (3)", same three products (a necklace + two earring styles — zero bracelets, zero brooches, zero rings actually shown).
- Mobile confirms the same bug: `shop-necklaces-mobile.png` and `shop-earrings-mobile.png` are pixel-identical — both list "ALL JEWELRY," both open with "Layered Chain Necklace ₹16,200" as the first tile, both show the same 12 mixed-category products (necklaces, studs, brooch, cuffs, rings, bracelets all mixed together) regardless of the URL slug.
- Confirmed in source: the prerendered static HTML per category (`necklaces-prerendered.html`, fetched via curl) does contain a correct per-category `<h1>Necklaces Collection</h1>` and matching meta description — but this is discarded the instant hydration mounts `CollectionPage.tsx`, which always renders the "ALL JEWELRY" masthead regardless of route.

**SEO/UX consequence:** A user landing on `/shop/rings` from a Google search for "brass rings India" sees a necklace first and a generic "ALL JEWELRY" heading — the page does not deliver on the query intent that got them there, which is a strong negative ranking/engagement signal (pogo-sticking) on top of the immediate conversion loss. Five distinct category URLs are functionally one page with no differentiated content once JS runs, which is a duplicate/thin-content problem for any crawler that renders JS.

**Fix:** `App.tsx`'s shop route handler must read the category slug from the URL and pass it into the Shopify query/filter; `CollectionPage.tsx` masthead should reflect the actual filtered category name and count, matching what's already correctly generated in the prerendered `<title>`/`<h1>`.

---

## 3. HIGH — Empty category pages (rings/bracelets/brooches) show wrong products, not an empty state

Per the brief's concern about `/shop/necklaces` et al. rendering empty: they don't render empty — they render the **wrong, unfiltered catalog** (see Finding 2). This is arguably worse than an empty state for SEO because it's not honest about inventory: a "Brooches" page showing a necklace, two earrings, a ring and bracelets is either going to look broken to a user or, if a crawler trusts the prerendered per-category schema (`CollectionPage` structured data naming "Necklaces Collection" while the rendered content is generic), creates a mismatch between structured data and visible content — a schema markup violation that risks a manual action or lost rich-result eligibility.

**Fix:** Same as Finding 2 — implement real server/client-side filtering by category before this can be assessed as a genuine empty-state problem or not.

---

## 4. HIGH — Broken pre-hydration paint: prerendered skeleton uses CSS classes that don't exist in the stylesheet

**Evidence:** Raw curl of the prerendered HTML (before any JS executes) for `/` and `/shop/necklaces` shows markup like:
```html
<header class="site-header">
<section class="hero-section">
<a href="/shop" class="cta-btn">Explore Collection</a>
<section class="categories-section">
<main class="category-page">
```
Grepping the actual shipped stylesheet (`/assets/index-B4SDxzdV.css`, pulled live) for `.hero-section`, `.cta-btn`, `.site-header`, `.category-page`, `.categories-section` returns **zero matches** — none of these classes are styled anywhere. The real design is built entirely from Tailwind utility classes injected by React after hydration.

**What this means visually:** for the brief moment between first paint and hydration completing, a user (or a slow/throttled mobile connection, or a crawler that doesn't wait for full JS execution) sees completely unstyled, browser-default HTML: black underlined links in a vertical stack, default serif body text on white, no `#E7E4D5` background, no layout, no hero image, no logo — then a hard jump to the fully styled brand experience. `home-mobile-early.png` (captured at domcontentloaded) already shows the *hydrated* app design because the JS bundle executed fast in this environment, but on real-world 3G/4G India mobile connections (the stated primary market) this gap will be materially longer and the unstyled-to-styled jump will be visible.

**SEO consequence:** Googlebot's initial HTML parse (before rendering budget kicks in) sees only a nav list, one H1/paragraph, and 5 category links — no product data, no images, no price. Category-specific content only exists correctly in the prerendered per-page meta tags/H1/JSON-LD, which is good, but the visible body content a user gets on slow connections is a bare skeleton with none of the persuasive/trust content.

**Fix:** Either style the prerendered skeleton with real (non-Tailwind-dependent) inline/critical CSS so the first paint is presentable, or reduce hydration time so the swap window is imperceptible. At minimum, match the skeleton's copy per-route (it already correctly varies H1/meta by category — extend that discipline to a matching minimal-but-branded visual state).

---

## 5. MEDIUM — Possible routing bug on product detail URL

**Evidence:** `product-earrings-desktop-early.png`, captured immediately after navigating to `/product/geometric-gold-tone-statement-earrings-for-women-modern-square-earrings`, shows the **homepage** hero mid-render ("Home" nav tab underlined/active, "TIMELESS BEAUTY • UNIQUELY YOURS" hero copy, "(ALL PIECES — 19)") — not a product page. The settled screenshot `product-earrings-desktop.png` also shows the homepage (giant "AVIRENA" wordmark hero, "Collection"/"Popular" sections), not the product detail template.

The prerendered HTML for this exact URL (fetched via curl, confirmed correct) *does* contain the right content: proper `<h1>`, image gallery, `<p class="price">₹499</p>`, full JSON-LD Product/Offer schema. So the server-side prerender is correct, but the client-side hydration/router appears to redirect or fall through to the home route in this test run.

**Consequence:** If this reproduces consistently (not a one-off timing flake in this test), it means direct navigation or a fresh session to any product URL bounces the user to the homepage after JS loads — a critical broken user journey (can't view or buy the product they clicked from search/social) and a client-side routing mismatch that could cause Google's rendered-HTML index to diverge sharply from the prerendered snapshot for every product page.

**Fix:** Re-verify with a hard reload / private window outside this audit; check the SPA router's fallback/catch-all logic for `/product/:slug` — confirm it isn't matching a broader pattern or failing slug lookup and silently redirecting home.

---

## 6. Above-the-fold mobile analysis (390px) — home page

**Evidence:** `home-mobile.png` (full hydrated state).

What is visible without scrolling: top promo bar ("HOMEGROWN HANDCRAFTED DAILYWEAR LUXURY"), hamburger + wordmark + wishlist/account/cart icons, then the giant stacked "AVIRENA" wordmark as the hero visual (decorative, not a product photo), a one-line value prop, and an "EXPLORE COLLECTION" CTA button. The first actual product image, price, or SKU-level content does **not** appear until the user scrolls to the "Collection" section.

**Assessment against the brief's requirement ("does the user immediately see what is sold, a price, and a path to buy"):** Partially fails. The CTA is present and visible, but there is no product photo and no price in the first viewport — the hero is entirely typographic/decorative. For a jewelry storefront where the product itself (metal finish, pearl texture, craftsmanship) is the primary persuasion tool, leading with wordmark typography instead of a hero product shot is a missed opportunity, especially on mobile where scroll depth to the first product is costly.

**Fix:** Consider a hero treatment that overlays or juxtaposes a product photo with the wordmark, or drops directly into the first product carousel with visible price sooner, particularly since the desktop version (`home-desktop.png`) already shows the small gold earring product nested inside the wordmark loop as a decorative touch — this is a nice detail but is not a substitute for a scannable price/product above the fold on mobile.

---

## 7. Category page above-the-fold (mobile) — price and product visible faster

**Evidence:** `shop-earrings-mobile.png`, `shop-necklaces-mobile.png` (identical due to Finding 2).

Here the mobile experience is better: promo bar, condensed header, "ALL JEWELRY" title over a smaller hero band, then the first product tile ("Layered Chain Necklace, ₹16,200") appears just below the fold after a modest scroll. Price is clearly legible in the small-caps serif label style. This is a stronger product+price+path-to-buy pattern than the homepage and should arguably be the template the homepage hero borrows from.

---

## 8. Contrast — light serif/sans type on #E7E4D5 ground

**Observed in all captures:** Body copy and secondary labels ("GOLD-TONE BRASS", category eyebrows, footer links) render in a muted taupe/olive tone against the `#E7E4D5` (light beige, ~L 89%) background. Visually, several of these text treatments — particularly the small all-caps eyebrow labels above product titles and the footer link list on `home-mobile.png` — read as low-contrast light-gray-on-beige rather than a clearly dark ink tone. Primary headings (H1 hero, product titles) use a near-black/dark-olive (`#413C23`, per the theme-color meta tag) which is comfortably AA-compliant, but the secondary/tertiary text tier (prices' supporting labels, filter chips "CATEGORY"/"FINISH", the promo bar's smaller print) is visually closer to the borderline range.

**Recommendation:** Run a contrast checker against the specific hex pairs used for eyebrow/label text vs `#E7E4D5` — anything using a lighter olive/taupe (roughly `#8F896D`, referenced in the body's `selection` CSS) on `#E7E4D5` computes to well under 3:1, failing AA even for large text. Darken secondary label text or increase weight to compensate; this affects the "CURATED DAILYWEAR BRASS" strip and product card eyebrow labels visible in every category screenshot.

---

## 9. Mobile usability specifics (390px)

**Evidence:** `shop-earrings-mobile.png`, `home-mobile.png`.

- **Navigation:** Collapses correctly to a hamburger icon at 390px; no visible nav overflow or broken menu bar. Icons (search, wishlist, account, cart) are grouped tightly on the right — icon-to-icon spacing looks tight (roughly 24-28px apart based on proportions in the capture), which is under the 48x48px recommended touch target when accounting for icon padding. Worth measuring in devtools directly, but visually these are the classic "four tiny icons crammed into a header" pattern that's easy to mis-tap on real devices.
- **No horizontal scroll observed** in any mobile capture — `shop-earrings-mobile.png`, `shop-necklaces-mobile.png`, `home-mobile.png` all show content properly contained to the 390px viewport width with no clipped or overflowing elements.
- **Product grid:** Single-column stacked product cards on mobile (not 2-up), meaning a lot of vertical scroll to compare products — 12 products shown in `shop-earrings-mobile.png` requires a very long scroll (full-page capture `shop-earrings-mobile-full.png` is 11,740px tall). A 2-column grid at 390px would let users compare price/style faster and is standard for mobile jewelry commerce.
- **Cart drawer:** Not captured mid-interaction in this pass (static screenshots only, no click-through), so cart drawer open/close behavior at 390px is unverified — recommend a follow-up interactive test (add-to-cart tap, confirm the drawer doesn't overflow or block the close affordance at this width).

---

## 10. Font loading (FOIT/FOUT)

**Evidence:** Prerendered `<head>` (both `home-prerendered.html` and `necklaces-prerendered.html`) loads four Google Font families via a single **render-blocking** stylesheet link:
```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:...&family=Montserrat:...&family=Playfair+Display:...&family=Plus+Jakarta+Sans:...&display=swap" rel="stylesheet" />
```
`display=swap` is set, which means the browser will use `font-swap` behavior (FOUT — fallback font shown immediately, swapped to webfont once loaded) rather than FOIT (invisible text). This is the better of the two failure modes, but four families in one blocking request is still a meaningful render-blocking cost, and on throttled mobile connections a visible swap from system-serif/sans fallback to Cormorant Garamond/Playfair Display will be noticeable given how large and typographically central the hero wordmark is (see `home-mobile.png`, `product-earrings-desktop-early.png` where the wordmark occupies most of the viewport — any swap here is highly visible because of the type's size and prominence).

**Fix:** Self-host subsetted woff2 files for just the weights actually used, add `font-display: swap` at the `@font-face` level (already implied by `display=swap` param, good), and split into 1-2 files instead of 4 families loaded together to shorten the blocking window.

---

## 11. Console/network/broken images

No hard JavaScript console errors or broken/404 images were observed in the captured pages during this pass (product photography on category/home pages loaded correctly — see the necklace, earring, and cuff product photos in `shop-bracelets-desktop.png`, `shop-earrings-mobile.png`). The one functional defect worth flagging again here is the apparent product-URL routing issue in Finding 5, which is a navigation/logic bug rather than a broken-asset issue.

---

## Screenshot index

| File | Page | Viewport | Notes |
|---|---|---|---|
| `home-desktop.png` / `home-desktop-full.png` | / | 1440 | Hydrated, full design |
| `home-desktop-early.png` | / | 1440 | Early paint (JS executed fast in this env) |
| `home-mobile.png` / `home-mobile-full.png` | / | 390 | Above-the-fold analysis source |
| `home-mobile-early.png` | / | 390 | Early paint |
| `shop-earrings-desktop.png` / `-full` | /shop/earrings | 1440 | "ALL JEWELRY (3)" post-hydration |
| `shop-earrings-desktop-early.png` | /shop/earrings | 1440 | Mock-data 19-count flash |
| `shop-earrings-mobile.png` / `-full` | /shop/earrings | 390 | Identical to necklaces — Finding 2 |
| `shop-necklaces-desktop.png` / `-full` | /shop/necklaces | 1440 | Identical content to earrings/bracelets |
| `shop-necklaces-mobile.png` / `-full` | /shop/necklaces | 390 | Pixel-identical to shop-earrings-mobile.png |
| `shop-bracelets-desktop-early.png` | /shop/bracelets | 1440 | Key evidence for Finding 1 (19-count, empty tiles) |
| `shop-bracelets-desktop.png` | /shop/bracelets | 1440 | Key evidence for Finding 1 (3-count, real photos) |
| `shop-brooches-desktop-early.png` / `.png` / `-full` | /shop/brooches | 1440 | Same 19→3 swap confirmed on 2nd category |
| `shop-rings-desktop.png` / `-full`, `-early` | /shop/rings | 1440 | Same "ALL JEWELRY" content |
| `product-earrings-desktop.png` / `-full` | /product/geometric-... | 1440 | Renders homepage, not product — Finding 5 |
| `product-earrings-desktop-early.png` | /product/geometric-... | 1440 | Also renders homepage mid-paint |
| `collections-desktop.png` / `-full`, `-early` | /collections | 1440 | Captured, no major issues flagged beyond global findings |
