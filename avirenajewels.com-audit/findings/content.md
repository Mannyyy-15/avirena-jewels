# Content Quality / E-E-A-T / AI Citability Audit — avirenajewels.com

Audit date: 2026-09-08
Method: live `curl` of prerendered HTML for every route in scope (saved to local scratch dir), `grep`/word-count on the raw `<div id="root">` markup (what non-JS-executing crawlers see), plus static analysis of `src/`, `scripts/prerender.ts`, and compiled `dist/assets/*.js` (what ships to browsers and JS-rendering crawlers). No Search Console access — no traffic, impression, or query data is reported or implied anywhere below.

Corrected scope facts used throughout: live catalog is **9 products, all earrings, all in stock, ₹599–₹1,199**.

---

## 1. HEADLINE FINDING — five core trust/navigation pages prerender almost no content; real copy exists only after JS hydration

**Severity: High**

**Evidence.** Fetching each URL directly (`curl https://avirenajewels.com/<route>`) and reading only the static markup inside `<div id="root">…</div>` (i.e., what a crawler sees without executing JavaScript) gives real, measured word counts:

| Route | Prerendered `#root` word count | What's actually there |
|---|---|---|
| `/about` | **12 words** | `<h1>Our Story & Philosophy</h1><p>Handcrafted homegrown dailywear jewelry sculpted for everyday confidence.</p>` — nothing else |
| `/contact` | **13 words** | `<h1>Atelier Concierge</h1><p>Connect with our jewelry specialists for styling, sizing, and order assistance.</p>` — no phone, email, address, or hours in static HTML |
| `/policies` | **11 words** | `<h1>Client Policies & Assurance</h1><p>14-Day Exchanges • Tracked Express Shipping • Hypoallergenic Materials</p>` — none of the six actual policy documents |
| `/collections` | **11 words** | `<h1>Signature Design Suites</h1><p>Explore cohesive sculptural narratives crafted to stack harmoniously.</p>` |
| `/journal` | **14 words** | `<h1>Atelier Journal & Lookbook</h1><p>Discover dailywear styling notes...</p>` |
| `/` (home) | **~60 words** | Nav + hero line + empty category list container |
| `/faq` | **73 words** | H1 + intro line + a list of 7 guide links; the actual Q&A answer text is **not** in `#root`, only in the `<script type="application/ld+json">` FAQPage block in `<head>` |
| `/shop` | **50 words** | Header + 9 product cards (name + price only, no shop-page body copy) |
| `/shop/earrings` | **56 words** | Same pattern |

Contrast with the pages that *do* prerender fully:

| Route | Prerendered `#root` word count |
|---|---|
| `/guides` (hub) | 213 words |
| `/guides/does-brass-jewelry-turn-skin-green` | 1,154 words |
| `/guides/anti-tarnish-jewelry-care` | ~1,050 words |
| `/guides/jewelry-materials-guide` | ~1,230 words |
| `/guides/ring-size-guide` | ~1,000 words |
| `/guides/jewellery-for-sensitive-skin-india` | ~1,040 words |
| `/guides/jewellery-care-monsoon-humidity-india` | ~890 words |
| `/guides/jewellery-gifting-guide-india` | ~840 words |
| `/product/avirena-*` (each of 9) | 160–210 words, full description + materials + care block |

**Root cause.** `scripts/prerender.ts` builds full server-rendered markup for guide and product/category routes, but for `/about`, `/contact`, `/policies`, `/collections`, `/journal`, and `/` it only writes a one-line heading + subhead skeleton into the static HTML (see the `about-page`, `contact-page`, `policies-page`, `collections-page`, `journal-page` `<main>` blocks). The real content for these pages — About's founder narrative, Contact's phone/email/hours, Policies' six full legal documents, FAQ's actual answers — lives entirely inside the React component tree (`AboutPage.tsx`, `ContactPage.tsx`, `PoliciesPage.tsx`, `FaqPage.tsx`) and is only added to the DOM client-side after the JS bundle executes.

**Why it matters, precisely (not overstated).** Googlebot does execute JavaScript and can pick up hydrated content — but that happens in a deferred, budget-limited second rendering pass, not on first crawl, and is not guaranteed for a brand-new domain with no crawl-budget history. Meanwhile GPTBot, ClaudeBot, PerplexityBot, and most non-Google AI/social crawlers listed in this site's own `robots.txt` do **not** execute JavaScript on ordinary fetches, so today they receive 11–14 word stubs for the exact pages that carry this brand's trustworthiness evidence (About = experience/founder story, Contact = verifiable business identity, Policies = terms/returns/legal disclosures). For a zero-history sole proprietorship where these pages *are* the E-E-A-T case, shipping them as near-blank skeletons to first-pass and non-rendering crawlers is a real, avoidable cost — not a catastrophic one, since the guide/product architecture proves the team already knows how to prerender fully.

**Fix.** In `scripts/prerender.ts`, extend the same full-markup-generation pattern already used for guide and product routes to `/about`, `/contact`, `/policies`, `/collections`, `/journal`, and `/`. Concretely: the functions that build `<main class="about-page">…</main>` etc. need to render the actual page copy (from the same source components/strings used by `AboutPage.tsx`, `ContactPage.tsx`, `PoliciesPage.tsx`) into the prerendered string, not a hardcoded placeholder sentence.

**Falsifiability.** `curl -s https://avirenajewels.com/about | grep -oP '(?<=<div id="root">).*(?=</body>)'` — after the fix, word count should be in the several-hundred range, matching the true rendered page, not 12 words.

---

## 2. Regression check — vermeil / sterling / 925 / hallmark / BIS / 18k / Vicenza / Jaipur / "Private Limited" / aggregateRating / ratingValue / reviewCount

Grepped across: all 26 fetched prerendered pages (raw static HTML), `src/`, `scripts/prerender.ts`, and every compiled bundle in `dist/assets/*.js`.

### 2a. Confirmed ABSENT (no regression)
- **`aggregateRating` / `ratingValue` / `reviewCount` / star ratings**: zero hits anywhere in prerendered HTML, `src/`, or `dist/assets`. The fabricated 4.9/38-review schema flagged in prior audits (`avirena-fabricated-reviews.md`) is confirmed gone from the codebase as it stands today.
- **"Private Limited"**: zero hits.
- **`Vicenza` / `Jaipur` as fabricated atelier locations**: zero hits. (`Jaipur`/`Vicenza` do not appear at all in current `src/` or live pages.)
- **`avirena.com` as the primary brand domain in llms.txt, schema, or guide copy**: zero hits in `public/llms.txt` (confirmed correct — see §6) and zero hits in JSON-LD across all fetched pages (Organization/OnlineStore schema on `/about` correctly uses `avirenajewels.com` throughout).
- **18k / BIS / hallmark as *positive* material claims** (i.e., claiming Avirena *is* 18k gold or *is* BIS-hallmarked): zero hits. Every occurrence of "18k," "hallmark," "BIS," "vermeil," "sterling," "925" found in live guide pages, product pages, and `src/data/guides.ts` is explicitly a **negation or comparison-category** statement, e.g. (`/guides/jewelry-materials-guide`, live, verified): *"Avirena does not make vermeil, and we mention it here only so you can compare constructions accurately while shopping"* and *"it is not solid gold, gold vermeil or sterling silver, and it is not hallmarked to any precious-metal standard."* This is correct, intentional, citable content — explicitly called out in the brief as non-regression — and it is confirmed as such on every product page and guide checked.

### 2b. CONFIRMED REGRESSION — fabricated corporate identity still live in `PoliciesPage.tsx` / shipped in production JS bundle

**Severity: Critical**

`src/pages/PoliciesPage.tsx` still contains a fully fabricated legal/corporate identity that contradicts the verified fact that Avirena is a **sole proprietorship** with contact `avirenajewels@gmail.com` / `+91-78238-89290`:

| Line(s) | Fabricated content |
|---|---|
| `PoliciesPage.tsx:112` | `"Welcome to the Avirena Jewels online boutique (avirena.com)"` — wrong domain (a live, unrelated third-party site) |
| `PoliciesPage.tsx:103` | `privacy@avirena.com` — non-existent domain/inbox |
| `PoliciesPage.tsx:166-168` | `"Registered Atelier & Studio Office: Studio Avirena, Suite 402, Heritage Craft Enclave, Bandra West, Mumbai, Maharashtra 400050, India"` — fabricated street address, no such office verified to exist |
| `PoliciesPage.tsx:175` | `"+91 98200 12345 / +91 80505 56004"` — phone numbers that do not match the verified `+91-78238-89290` |
| `PoliciesPage.tsx:183` | `legal@avirena.com` |
| `PoliciesPage.tsx:193-195` | `Corporate Identity Number (CIN): U36999MH2024PTC123456`, `GSTIN / Tax ID: 27AAAAA0000A1Z5`, `Director / Representative: Avirena Atelier Management Board` — a fabricated CIN (the format is even wrong for a sole proprietorship, which cannot have a CIN — that's a company-only identifier), a fabricated GSTIN, and a fabricated corporate governance body ("Management Board") for what is verified to be a one-person sole proprietorship |

**This is not stale/dead code — it ships to production.** `grep` of the compiled bundle confirms every one of these strings is present verbatim in `dist/assets/PoliciesPage-B2MUxs_-.js`, which is the file the live site's `<script type="module">` loads. Per Finding 1, `/policies` prerenders only an 11-word skeleton, so this fabricated content is not in the static HTML crawlers see on first pass — but it renders into the visible, readable page for every human visitor and every JS-executing crawler/renderer (including Googlebot's render pass) once the page hydrates, at the URL a shopper or an AI answer engine would treat as the canonical legal/contact source for the brand.

**Why Critical.** A fabricated CIN and GSTIN presented as a real government-issued tax/registration identifier is a materially false representation of legal status — this is a different and more serious category of harm than a marketing-copy softening issue, and it directly contradicts the verified "sole proprietorship" fact this audit is required to hold every page to. It also creates a second, wrong domain (`avirena.com`) as an official contact channel, repeating the exact domain-confusion problem already flagged and believed fixed elsewhere (llms.txt, schema).

**Fix.** Rewrite all six tabs of `PoliciesPage.tsx` (`returns`, `privacy`, `terms`, `shipping`, `contact`, `legal`) to use only the verified facts: sole proprietorship, Mumbai, `avirenajewels@gmail.com`, `+91-78238-89290`, no CIN (sole proprietorships don't have one — if a GSTIN legitimately exists, use the real number or omit the field entirely rather than fabricate one), no fictitious street address unless a real registered address exists and the owner is comfortable publishing it. Remove `avirena.com` and `@avirena.com` addresses entirely.

**Falsifiability.** `grep -riE "avirena\.com|GSTIN|CIN|Bandra|Management Board|98200|80505" dist/assets/PoliciesPage-*.js` should return zero matches after the fix; visually verify by clicking through all six tabs at `/policies` in a real browser post-deploy.

### 2c. Minor: "Atelier" positioning language is inconsistent with the corrected brand facts

**Severity: Low**

The verified facts state a Mumbai sole proprietorship with no physical storefront and no atelier/foundry. "Atelier" (implying a designer's dedicated workshop/studio) appears repeatedly as brand-voice styling — e.g. live `/about` H1 fallback "About Atelier" (nav label, `prerender.ts:587` and `HomePage.tsx` render), `/contact` H1 "Atelier Concierge" (`prerender.ts:908`, `ContactPage.tsx:106`), `/journal` H1 "Atelier Journal & Lookbook" (`prerender.ts:1001`), Navbar "Avirena Atelier Club" (`Navbar.tsx:332,442`), Footer "AVIRENA is an atelier jewellery venture" (`Footer.tsx:170`), and Policies' "Registered Atelier & Studio Office" (covered in 2b, which compounds the issue by pairing the word with a fabricated address). This is not a material-composition regression and is far less severe than 2b, but it is directionally the same problem — implying facilities/infrastructure that isn't confirmed to exist for a one-person sole proprietorship — and is worth correcting for consistency with the corrected positioning (e.g., "Avirena Jewels," "Studio," "Design Notes," "Customer Care").

**Fix.** Global find-replace of "Atelier" → a neutral term ("Studio," "Design," "Team," "Customer Care") across `Navbar.tsx`, `Footer.tsx`, `ContactPage.tsx`, `AboutUsEditorialSection.tsx`, `QuickViewModal.tsx`, `RingSizerModal.tsx`, `CheckoutPage.tsx`, and `scripts/prerender.ts`, except where a page explicitly and accurately labels itself a small home-based/independent operation.

**Falsifiability.** `grep -rin "atelier" src/ scripts/` should return zero hits, or only hits inside copy that explicitly discloses the sole-proprietor, no-storefront reality.

### 2d. Non-issue: `CatalogPiecesSvg.tsx` "18k Yellow Gold" / "925 Sterling Silver" strings

**Severity: Informational, no action required**

`src/components/CatalogPiecesSvg.tsx:6,23` contain the strings `18k Yellow Gold Gradient` and `925 Sterling Silver / Mirror Rhodium Gradient` — but these are **JSX code comments** naming SVG `<linearGradient>` color-ramp IDs (`catGoldGrad`, `catSilverGrad`), not rendered or visible text, and not read by any crawler (comments are stripped at build time). Confirmed by reading the component: no user-facing string interpolates these comments. No fix needed; flagged only for completeness since the brief's grep would surface it.

---

## 3. E-E-A-T — practical, available trust signals not currently used

This is a brand-new store (launched today) with no trading history, no third-party reviews, and no named founder attribution anywhere in the site. The recommendations below use only facts already verified for this brand — none require inventing credentials, review counts, press mentions, or a founder identity that hasn't been supplied.

**Experience (currently weak — no first-hand signals anywhere).**
- The guides (`src/data/guides.ts`) are written with real specificity (exact mm-to-ring-size conversion tables, named causes of skin reactions) but contain zero first-person framing ("we tested," "in our experience packing X orders during monsoon..."). Nothing here requires fabrication: a single sentence of verifiable, low-risk first-hand framing — e.g., in `jewellery-care-monsoon-humidity-india`, "we ship from Mumbai, so this guide reflects what we see with our own inventory through the monsoon" — would be both true (per the verified Mumbai/sole-proprietorship facts) and a legitimate experience signal, without claiming false authority.
- No customer-facing photos of real product-in-hand/on-body use, no unboxing content, nothing depicting the actual owner packing/shipping — all safe, factual experience signals a solo operator can add without cost.

**Expertise (currently thin — no author attribution on any guide).**
- All 7 guides are authoritative in tone and factually careful, but none carry a byline, an "About the author," or even an organizational attribution beyond the generic site `<meta name="author" content="Avirena Jewels">`. For E-E-A-T (and for AI citation, which favors clearly attributed content), add a simple, honest attribution line per guide — e.g., "Written by the Avirena team, Mumbai" or, if the owner is comfortable being named, a real first name + "Founder, Avirena Jewels." This does not require fabricating credentials (no need to claim "gemologist" or "10 years in jewelry" if untrue) — plain honest attribution alone is a usable, currently-missing signal.
- No citations to any external, independent standard the brand's material claims align with — e.g., the nickel-free/lead-free/cadmium-free claims could credibly reference the general consumer-safety rationale (EU REACH nickel-release rules are the common industry benchmark cited by comparable brands) *if and only if the compliance is actually true and verifiable* — flagged as an opportunity, not a requirement, since fabricating a compliance claim would be worse than omitting one.

**Authoritativeness (weakest category for a brand launched today — genuinely no external recognition yet, and none should be invented).**
- `sameAs` schema on `/about` correctly links Instagram, Facebook, and Pinterest — good, keep it accurate as these accounts gain followers.
- No practical fix available today beyond continuing to build real social proof over time (this is expected and honest for a day-one brand — the correct move is patience, not fabrication).

**Trustworthiness (highest-weighted category, and the one most within reach for a solo operator — currently underused).**
- `/contact` and `/policies`, the two pages that should carry the strongest trust signals (real phone, real email, real return/refund terms), are exactly the two pages found to prerender almost no content (Finding 1) and, on `/policies`, to contain fabricated corporate identifiers (Finding 2b). Fixing both of those findings *is* the single highest-leverage trust improvement available — no new facts need inventing, just correctly surfacing the ones already verified (real phone, real email, honest sole-proprietorship status, honest return policy).
- Consider adding a plain, honest "About the owner" sentence disclosing this is a solo/small operation — modern QRG guidance and consumer trust research both treat transparent disclosure of being a small/independent seller as a *positive* trust signal, not a weakness, provided it's not paired with inflated claims (which is the opposite of what's currently happening on `/policies`).
- One quantifiable trust-adjacent issue worth flagging here: `src/data/products.ts` (`getCompareAtPrice`, lines ~18–41) synthetically manufactures "compare-at" MRP prices to always show a 65–72% discount (e.g., a ₹599 product gets a fabricated ₹1,899 struck-through price), rather than using a real prior or reference price. This is a pricing-honesty issue rather than a content-quality one per se, but it directly undermines Trustworthiness for a new brand with zero pricing history to justify any "discount" claim, and is worth a cross-reference to the ecommerce/schema audit if not already covered there.

---

## 4. Guide citability (the 7 `/guides/*` articles)

**Severity: Low-Medium (mostly strong; two concrete gaps found)**

**Self-contained direct-answer openings.** Spot-checked against the live prerendered `#root` content (not just JSON-LD) for all 7 guides:
- `does-brass-jewelry-turn-skin-green`: opens with a direct, quotable answer — confirmed strong.
- `jewelry-materials-guide`: opens by naming the four constructions and immediately stating which one Avirena is — strong, self-contained.
- `ring-size-guide`: FAQ answers (e.g., the "54 mm" and "size up" answers quoted below) are self-contained and don't require reading surrounding page context to be correctly quoted — strong.
- Not independently re-verified line-by-line for the remaining 4 guides beyond confirming full prerendered text is present (Finding 1 contrast table) — recommend a follow-up manual pass specifically checking that `jewellery-gifting-guide-india`, `jewellery-care-monsoon-humidity-india`, `jewellery-for-sensitive-skin-india`, and `anti-tarnish-jewelry-care` each lead with a direct answer rather than a scene-setting intro, since this was not exhaustively confirmed for all four.

**FAQ answer length vs. the 110–130 word "quotable" band.** Measured directly from live JSON-LD/prerendered text on `/guides/ring-size-guide`:
- "Size up..." answer: **~118 words** — squarely in band.
- "What ring size is 54 mm?" answer: **~113 words** — in band.
- The FAQPage answer on `/faq` for "what is Avirena jewelry made from" (also reused near-verbatim as guide/product boilerplate): **~118 words** — in band.
These three measured samples land correctly in the target range; this appears to be a deliberate, successfully-executed editorial constraint. Not exhaustively measured across all FAQ entries in `guides.ts` (there are dozens of `Answer` blocks) — spot-check is representative but not a full audit of every answer.

**Marketing softening — one place it has crept back in.** In `guides.ts:149` (the pricing-honesty FAQ answer, reused site-wide), the honest core claim — *"it is not solid gold, not gold vermeil and not sterling silver, and it is not hallmarked to any precious-metal standard"* — is preserved intact and is genuinely good, citable, non-softened content. No softening found in the sampled guide text itself. The softening that *has* crept back in is not inside the guides — it's on `/policies` (Finding 2b), which uses padded, marketing-forward language ("artisanal craftsmanship and metallurgical integrity of our demi-fine creations," "gemological... inspection," "master artisan casting") that overstates production reality for brass fashion jewelry assembled/sourced rather than "cast" in a "studio" with "master artisans" — this is softer-edged marketing copy sitting right next to the fabricated corporate-identity problem, and both should be cleaned in the same pass.

---

## 5. Duplicate/near-duplicate content across the 9 product pages

**Severity: Low (proportion is defensible, with one caveat)**

Measured directly from the live prerendered `#root` content of `/product/avirena-crystal-hoops-gold-tone-earrings` (205 words total):
- **Unique-per-product copy**: the opening description sentence(s) + "Product highlights" bullets — approx. **65 words**, genuinely distinct per SKU (confirmed against `src/data/products.ts`, where all 19 catalog-wide `description` fields, including non-live mock categories, read as distinct hand-written copy, not templated).
- **Shared Materials/Care/Perfect-for/Shipping boilerplate**: approx. **140 words** — roughly **68% of total page word count is shared boilerplate**, identical or near-identical across all 9 live product pages.

**Is this defensible?** Partially. Sharing a Materials & Care block verbatim across a single brand's SKUs is standard, expected e-commerce practice (Google's guidance treats this as normal, not manipulative, when the unique product identity/description is present and substantive) — and here it is present. However, at 205 words total per page with 68% shared, the *unique* portion per product (~65 words) is thin in absolute terms, especially since 9 products currently span only one category (earrings). With only 9 SKUs today this is a low-severity issue, but it will compound as the catalog grows (per the known catalog-gap finding, more categories are planned) — more products sharing the same ~140-word block while each contributing only ~65 unique words increases near-duplicate content ratio site-wide.

**Fix.** Not urgent at 9 SKUs. Before adding the next wave of products, budget for lengthening the *unique* portion per product (e.g., add 2-3 more product-specific sentences — styling pairing suggestions, a specific occasion callout, or a sizing/fit note particular to that shape) so unique copy approaches parity with (or exceeds) the shared block, rather than remaining a fixed ~65-word intro regardless of catalog size.

**Falsifiability.** Re-measure unique-vs-shared word ratio after the next product batch ships; flag if shared-boilerplate proportion exceeds ~70% site-wide with 15+ SKUs live.

---

## 6. `public/llms.txt` accuracy and reachability

**Severity: Informational — confirmed correct, with the standard caveat**

- **Reachable**: `curl -s -o /dev/null -w "%{http_code}" https://avirenajewels.com/llms.txt` → `200`.
- **Accurate against verified brand facts**: content matches the verified facts exactly — sole proprietorship, Mumbai, brass + anti-tarnish e-coating, nickel/lead/cadmium-free, surgical steel posts, cultured freshwater baroque pearls, `avirenajewels@gmail.com`, `+91 78238 89290`, `https://avirenajewels.com` as the sole canonical domain, explicit negation of solid gold/vermeil/sterling/hallmarking. No stale references to the old fictional narrative (no vermeil-as-fact, no `avirena.com`, no Vicenza/Jaipur) — this file appears to have been correctly fixed since the prior audit pass that flagged it.
- **One stale note inside the file itself**: it lists "Avirena sells earrings, necklaces, rings, bracelets, and brooches" under Product Categories, while the live catalog today is 9 SKUs, earrings-only. The file does correctly hedge this with *"catalog availability changes. Check https://avirenajewels.com/shop for what is currently purchasable"* — so it is not presenting false current-availability information, but the category list itself is aspirational/future-state rather than reflecting the current 9-SKU, earrings-only reality. Low severity given the explicit hedge, but worth tightening to avoid an answer engine citing "Avirena sells rings and bracelets" as a present-tense fact.
- **Standard caveat, not overstated**: `llms.txt` is an unofficial, voluntary convention with no confirmed adoption by Google Search and no guarantee any AI crawler actually fetches or weights it — its presence and accuracy are good hygiene, not a ranking or citation guarantee, and should not be reported to stakeholders as if it were.

**Fix.** Either update the category line to say "Avirena currently sells earrings; additional categories are planned" or leave as-is given the existing hedge — this is a minor tightening, not a correctness failure.

**Falsifiability.** Re-`curl` `/llms.txt` after any catalog expansion and confirm the category list still matches (or still correctly hedges against) live `/shop` contents.

---

## 7. Content gaps for a first-time ₹599–₹1,199 fashion-jewellery buyer in India

Based on what a genuine first-time buyer at this price point typically needs to complete a purchase confidently, cross-checked against what currently exists across `/faq`, the 7 guides, and product pages (unverified where noted — no analytics/search-query data available to confirm actual demand, this is drawn from category norms only):

- **Real customer photos / UGC**: no evidence of customer-submitted photos, "as worn" images, or any content showing the product on a range of skin tones — a common trust gap for anti-tarnish/skin-reaction-sensitive fashion jewelry specifically, and directly relevant given the brand's own guides honestly discuss skin reactions. Unverified whether this is planned; not currently present in any fetched page.
- **A visible size/scale reference on product pages**: product descriptions are qualitative ("chunky domed hoop") but the fetched product page content shows no explicit dimensions (mm/cm, weight in grams) in the visible `#root` text — a common purchase blocker for earrings/rings bought online sight-unseen. Not confirmed present or absent in product images (images were not visually inspected in this text-focused pass).
- **COD/payment-method clarity at the product level**: `/policies` (once fixed per Finding 1/2b) mentions COD, but this is not visible anywhere in the thin `/product/*` pages themselves, where a first-time buyer is most likely to look for it before deciding to purchase.
- **A plain "is this real gold?" one-line FAQ answer positioned prominently on product pages themselves**, not only in guides/FAQ — the honest, well-written negation already exists (`guides.ts:391` and reused boilerplate) but a first-time buyer scanning a single product page rather than navigating to `/faq` or a guide may not encounter it without reading the full Materials block; consider a short, bolded one-liner near the price.
- **Anti-tarnish coating lifespan expectation stated as a number** (e.g., "typical wear life under normal use is approximately X months with proper care") — the guides discuss care thoroughly but a concrete expectation-setting figure was not found in the sampled content; if no reliable figure exists yet, this is reasonably omitted rather than fabricated, but is a real question this price segment asks.
- **Return/exchange for online-only sizing risk on rings specifically** — the ring size guide is strong, but whether the return policy explicitly permits a free size exchange (not just a return) was not independently re-verified beyond the (currently fabricated-identity-laden) `/policies` "Exchange for Another Atelier Piece" dropdown option, which does at least indicate exchange functionality exists.

None of the above are confirmed via query/demand data — they are drawn from general first-time-buyer patterns in the ₹500–1,500 Indian fashion jewelry category and should be treated as hypotheses to validate, not confirmed traffic-losing gaps.

---

## Summary table

| # | Finding | Severity |
|---|---|---|
| 1 | `/about`, `/contact`, `/policies`, `/collections`, `/journal`, `/`, `/faq` prerender near-empty skeletons; real content is hydration-only | High |
| 2b | `PoliciesPage.tsx` still ships fabricated CIN/GSTIN/address/domain/phone numbers, contradicting verified sole-proprietorship facts | Critical |
| 2c | "Atelier" positioning language inconsistent with sole-proprietorship, no-storefront facts | Low |
| 2d | "18k"/"925 Sterling Silver" strings in `CatalogPiecesSvg.tsx` are non-rendered code comments | Informational, no action |
| 3 | E-E-A-T: `/contact` and `/policies` are the two weakest pages and also the two most fixable (fix Finding 1 + 2b) | Medium |
| 3 | Fabricated 65–72% "compare-at" discount pricing in `products.ts` undermines Trustworthiness | Medium (flag for ecommerce/schema audit) |
| 4 | Guide FAQ answers measured in-band (110–130 words); softening found on `/policies`, not in guides | Low-Medium |
| 5 | Product description duplication ~68% shared boilerplate at 205 words/page; defensible at 9 SKUs, will need attention as catalog grows | Low |
| 6 | `llms.txt` confirmed live, reachable, and accurate; one aspirational category line to tighten | Informational |
| 7 | Content gaps: UGC/real photos, product-level dimensions, product-level COD/payment clarity, prominent "not real gold" one-liner, coating lifespan expectation | Unverified, hypotheses only |

All findings above are based on directly fetched, verifiable evidence (live HTTP responses, raw HTML, source files with line numbers, or compiled bundle contents) captured on 2026-09-08. No traffic, ranking, or query-volume data was available or used.
