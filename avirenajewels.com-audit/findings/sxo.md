# Search Experience Optimization (SXO) Audit — avirenajewels.com

Audit date: 2026-09-08. Method: live Google SERP observation via WebSearch for every target query (no DataForSEO, no Search Console, no fabricated positions/volumes — every ranking claim below is directly reproducible by re-running the same query), cross-referenced against the site's actual page inventory fetched via `render_page.py`/parsed HTML and the parallel technical/content/ecommerce/sitemap/schema audits already on file in this same `findings/` directory (`content.md`, `ecommerce.md`, `sitemap.md`, `schema.md`, `technical.md`).

Site inventory confirmed at audit time: 9 live products (all earrings, ₹599–1,199), `/shop` + `/shop/earrings` (populated) + 4 noindexed empty category pages, `/collections`, `/about`, `/contact`, `/faq`, `/policies`, `/journal` (stub, no articles), `/guides` hub + 7 guide articles, `/product/avirena-*` × 9.

SXO Gap Score is reported separately from any SEO Health Score elsewhere in this audit — it measures search-*experience* fit (does the page type and content match what the query-behind-the-search actually needs), not technical crawlability/indexability, which the other audit files already cover in depth.

---

## 0. Headline finding — the site is not choosing between "informational vs. commercial" correctly; it is choosing between two different failure modes on each

The prior hypothesis ("informational queries = international brands only, commercial = established Indian players only") is **partially confirmed, but the real pattern is sharper and more actionable than a geography split.** Live SERP observation on 2026-09-08 shows:

- **Every commercial query's SERP is dominated by a listing/category page format** — Myntra, Flipkart, Etsy India, TheJewelBox, GIVA, BlueStone, Amazon.in — never a blog post, never a single hero product page.
- **Every informational query's SERP is dominated by an editorial guide/blog-post format** — but the brands writing those guides are a *mix* of international (Dea Dia, Parkdale Brass, AJLuxe for "does brass turn skin green") **and small Indian D2C jewelry brands** (Zaisha, Ivara, Kymee, Shayn, Aferando, Subhranika, StyleBuzz, Avvni for "how long does anti-tarnish jewellery last"; Amama, Amorella, Seraphae, Ektaraa, Nuyug for "jewellery for sensitive skin india"). GIVA itself runs a guide/blog vertical (`giva.co/blogs/...`) that ranks for "jewellery care monsoon india" alongside Outlook Luxe and Surat Diamond.

**What this actually means for Avirena:** the informational SERPs are not closed to Indian brands — they are closed to brands that *haven't published a guide yet*, regardless of geography. Avirena already has 7 well-built guides (confirmed 840–1,230 words each, in-band FAQ answer lengths, honest material-negation copy — see `content.md` §4) sitting on **exactly the right page type** for 5 of the 6 informational queries. The problem is not page type. The problem, detailed in Sections 1–3 below, is that (a) one guide targets a query with almost no realistic Indian-context competition to win against yet, (b) the guides that answer a buying question dead-end with no path to a shoppable page, and (c) two commercially-valuable page types Shopify already supports (Gifting Edit, Office & Everyday smart collections — confirmed to exist in `ecommerce.md` L3) have **no frontend route at all**, so the commercial queries that should point there have nowhere to send a searcher.

---

## 1. SERP BACKWARDS — page type per query, and which Avirena URL should target it

| Query | Intent class | What actually ranks (format) | Live SERP evidence (2026-09-08) | Avirena URL that should own this | Current state |
|---|---|---|---|---|---|
| anti tarnish jewellery india | Commercial (category) | Marketplace/brand category listing pages | Myntra `/anti-tarnish-jewellery`, TheJewelBox `/collections/anti-tarnish-jewelry`, plus 2 blog explainers (Aferando, Ektaraa) mixed in | `/shop/earrings` (only populated category) | **Partial mismatch** — page exists and is the right type, but has zero on-page copy explaining "anti-tarnish" as a category (see §2) |
| anti tarnish earrings online | Commercial (category), weak India signal | Amazon.com, Etsy, US boutique collection pages (Midori, Oh Clementine, Beautiful Earth) — this exact phrasing pulls mostly US-hosted stores | `/shop/earrings` | Aligned in type; **not winnable near-term** — see §5, this query as typed has no visible India intent signal in the SERP at all |
| anti tarnish earrings buy online india *(India-qualified variant, tested)* | Commercial (category) | Myntra, Amazon.in, Etsy India, TheJewelBox, Urban Era Jewel, Shivansh Jewellery — all category/collection pages, all India-hosted | `/shop/earrings` | Aligned in type; correct URL, but see §2 for what's missing on it |
| brass jewellery online india | Commercial (category) | Etsy India, Myntra, Flipkart, Utsav Fashion, Okhaistore — category listing pages, several explicitly traditional/handicraft brass (Dokra), not fashion/anti-tarnish brass | `/shop/earrings` | **Category-intent mismatch, not format mismatch** — the ranking pages are mostly *traditional/artisan* brass jewelry (Dokra, wholesale), a different sub-category than Avirena's anti-tarnish fashion brass. Avirena competing here means disambiguating "anti-tarnish fashion brass" from "traditional brass jewellery" on-page, or deprioritizing this exact phrase in favor of "anti tarnish brass jewellery india" |
| nickel free jewellery india | Commercial/informational hybrid | Mixed: Etsy India category pages + one branded launch article (thefinebox) + one guide (Ektaraa) | Best split: `/shop/earrings` for commercial half, `/guides/jewellery-for-sensitive-skin-india` for informational half | `/guides/jewellery-for-sensitive-skin-india` already exists and is well-built (~1,040 words, confirmed in `content.md`); `/shop/earrings` has no nickel-free callout in visible page copy |
| office wear earrings | Commercial (filtered/tagged category) | **Confirmed category-page format only** — GIVA `/collections/style-office/category_earrings`, BlueStone `/jewellery/officewear-earrings.html`, Mridah `/collections/office-wear`, Candere `/jewellery/office-wear-earrings.html` — zero editorial/blog results in top 8 | Should be `/shop/office-everyday` or `/collections/office-everyday` | **Does not exist.** Shopify smart collection "Office & Everyday" is already built (confirmed `ecommerce.md` L3) with zero frontend route. This is the single clearest page-type-correct, zero-content-cost gap on the entire site |
| gifting jewellery under 1000 *(India-qualified: "jewellery gift under 1000 rupees india")* | Commercial (filtered/tagged category) | GIVA `/blogs/.../jewellery-gifts-under-1000` (blog+shop hybrid), BlueStone price-filtered category, Mannash `/collections/under-1000`, Zevarly `/collections/jewellery-under-1000`, Foundation Gift | Should be `/shop/gifting-edit` or price-filtered `/shop?max=999` | **Does not exist as a page.** Shopify smart collection "Gifting Edit" and the `under-999` product tag both already exist (confirmed `ecommerce.md` C1, L3) — again, zero frontend cost to build, currently invisible to both users and Google |
| does brass jewellery turn skin green | Informational | Editorial guide/blog, 100% (Dea Dia, Parkdale Brass ×2, Zearrow, AJLuxe — all direct-answer blog posts, zero marketplace/category pages in top 5) | `/guides/does-brass-jewelry-turn-skin-green` | **Aligned.** Confirmed 1,154 words, opens with a direct quotable answer (`content.md` §4) |
| how long does anti tarnish jewellery last | Informational | Editorial guide/blog, 100%, and now (unlike the prior hypothesis) mostly small **Indian** D2C brand blogs (Zaisha, Kymee, Shayn, Subhranika, StyleBuzz, Avvni, Aferando, Ivara) | `/guides/anti-tarnish-jewelry-care` (closest existing guide) | **Partial mismatch** — the existing guide covers *care habits*, not a direct "X months/years" lifespan answer. None of the 7 guides currently leads with a number for coating lifespan (flagged as a content gap independently in `content.md` §7) |
| brass vs gold plated jewellery | Informational | Editorial guide/blog, 100% (JINGYING, Quirky Kanya, Lupine Lane, Kaleya Studio, DVVX, AJLuxe, JewelryLab) | `/guides/jewelry-materials-guide` | **Aligned.** Confirmed ~1,230 words, names all four constructions and states which Avirena is (`content.md` §4) |
| ring size chart india | Informational (reference/utility) | Mix of brand size-guide pages (Tanishq PDF, Jewelove, Silberuh, CaratLane PDF, RishiRich, Krisha by Sakshi) and one aggregator (sizechart.com) — all brand-owned utility pages, not blog narrative | `/guides/ring-size-guide` | **Type-aligned but category-mismatched** — Avirena sells zero rings. A well-built ring size guide (~1,000 words, in-band FAQ answers per `content.md`) is targeting a query whose commercial follow-through the site cannot fulfill. See §5 |
| jewellery for sensitive skin india | Informational | Editorial guide/blog, 100%, several are direct brand-blog competitors at a similar stage (Amama, Amorella, Seraphae, Ektaraa, Nuyug, Shoppers Point India — none are large established players) | `/guides/jewellery-for-sensitive-skin-india` | **Aligned, and genuinely winnable** — see §5, this is the single best-matched query+page+competitive-set combination found in this audit |
| jewellery care monsoon india | Informational | Editorial guide/blog, mostly (GIVA's own blog, Outlook Luxe, Surat Diamond, Kairavi, National Herald, allblogs.in) — one is a large player (GIVA) but via its blog vertical, not its category pages | `/guides/jewellery-care-monsoon-humidity-india` | **Aligned.** Confirmed ~890 words |

**Net read:** 5 of 6 informational queries are page-type aligned already (guide exists, correct format). 1 of 6 (`ring size chart india`) is format-aligned but catalog-mismatched — a wasted asset given the site sells no rings. On the commercial side, 3 of 6 queries have the right URL live (`/shop/earrings`) but thin/absent on-page differentiation; 2 of 6 (`office wear earrings`, `gifting under ₹1,000`) have **no page at all** despite the backend merchandising already existing in Shopify.

---

## 2. Page-type mismatch detail — where the guide/product split breaks down

**Not a guide-vs-product mismatch in the way the brief hypothesized.** The 7 guides are correctly *not* trying to rank as product pages, and the 9 product pages are correctly not trying to rank as guides. The actual mismatches are:

**Mismatch A — CRITICAL: two commercial-intent page types are missing entirely, not misassigned.**
`office wear earrings` and `gifting jewellery under ₹1,000` both resolve to filtered-category-page SERPs. Avirena's Shopify backend already has both segments built as smart collections (`Office & Everyday`, `Gifting Edit`, confirmed in `ecommerce.md` Finding L3 and C1) with zero corresponding frontend route in `App.tsx`/`scripts/prerender.ts`. This is not a page-type mismatch so much as a **missing page** — the correct type (filtered category page) is understood and half-built on the backend, just never shipped to the frontend. Severity: CRITICAL, because this is the only finding in this entire audit where the fix is "wire an existing collection to a route," not "write new content" or "wait for authority."

**Mismatch B — HIGH: `/shop/earrings` is the right page type but carries none of the differentiating copy the commercial SERP rewards.**
Confirmed via direct fetch: `/shop/earrings`'s entire prerendered body text is one tagline ("Sculptural molten studs, organic drop earrings, and huggies in anti-tarnish brass.") plus 9 bare prices — no visible "anti-tarnish," "nickel-free," or "office wear" callouts as scannable category copy, no filter/facet UI, no links to the guides that substantiate those claims. Competing category pages (Myntra, TheJewelBox) lead with exactly these claims as on-page category descriptions. Avirena's version of the same page type is present but under-armed for the query.

**Mismatch C — MEDIUM: `/guides/ring-size-guide` is a well-built page targeting a query the catalog cannot convert.**
The guide is genuinely one of the strongest pieces of content on the site (in-band FAQ answers, full conversion table — confirmed `content.md` §4) but Avirena sells zero rings. Any traffic this guide earns for "ring size chart india" has no next step on-site other than leaving. This is not a page-type problem (the format is correct for the query) — it is a **catalog-alignment** problem, and it is the guide with the weakest realistic ROI of the 7 (see §5).

**Mismatch D — MEDIUM: the gifting guide answers a commercial question and then dead-ends.**
`/guides/jewellery-gifting-guide-india`'s own FAQ block directly and specifically answers *"What is a good jewellery gift under ₹1000 in India?"* with a paragraph recommending earrings — genuinely good, on-topic content. But there is no link from that answer to a shoppable "gifting" page (because none exists — Mismatch A) or even to `/shop/earrings` filtered by price. A reader who is convinced by the guide's own argument has nowhere obvious to click. This is a self-inflicted conversion leak inside content that is otherwise doing its job correctly.

**No mismatch found: guides targeting queries where guides don't rank.** All 7 guides map to SERPs that are guide/blog-dominated (confirmed individually in §1's table). None of the 7 guides is misdirected at a category-page query.

**Mismatch E — MEDIUM: product pages carry strong trust copy but omit three specific, high-frequency purchase-blocking details a first-time online jewelry buyer looks for.**
Confirmed via live fetch of the Crystal Hoops PDP (`/product/avirena-crystal-hoops-gold-tone-earrings`, full extracted body text captured 2026-09-08):
- **No dimensions or weight anywhere in the visible page text.** The description is entirely qualitative ("chunky domed hoop," "hollow-formed hoop, so the scale does not weigh on the lobe") with no mm/cm size or gram weight stated. For online-only earrings bought sight-unseen, this is a specific, recurring purchase-blocker (independently flagged as a hypothesis in `content.md` §7, now confirmed present on this specific live PDP rather than only inferred from category norms).
- **No COD (cash on delivery) mention on the product page itself.** COD is referenced at the policy level per `content.md`/`ecommerce.md` cross-references, but the fetched PDP's full text (materials, care, "Perfect for," shipping/exchange line) contains no COD callout. A price-sensitive first-time buyer deciding whether to trust a brand-new domain with payment before delivery is exactly the persona who looks for this at the point of decision, not two clicks away on `/policies`.
- **Gifting is referenced with no gift-wrap or gift-note mechanism visible.** The PDP's "Perfect for" list includes "Gifting" as an occasion tag, and the standalone gifting guide (Mismatch D) argues earrings are the safest gift — but nothing in the fetched PDP text offers gift wrapping, a gift note/message field, or gift-ready packaging as an actual option. The site tells a buyer "this is good for gifting" without giving them a way to act on that as a gift transaction (contrast with the gifting guide's own advice: "Packaging: for gifting, a piece that arrives ready to give saves you a step" — the guide states the need and the PDP does not fulfill it).

**Fix, all three:** Add a one-line dimension/weight spec (even approximate, e.g. "Hoop diameter: 3.2cm · Weight: 4g") to the Materials block already present on every PDP; add a short COD-available line near the price/shipping area (the information already exists in `/policies`, this is a surfacing fix, not new content); add a gift-wrap checkbox or gift-note field at cart/checkout and reference it on the PDP itself, replacing the passive "Gifting" occasion tag with something actionable. None of these require new merchandising decisions — they require making already-true facts visible at the point where this persona is deciding.
**Falsifiability:** Re-fetch any `/product/avirena-*` page's extracted text; confirm the presence of a numeric dimension/weight value, the string "COD" or "Cash on Delivery," and a gift-wrap/gift-note option. All three were absent from the Crystal Hoops PDP as fetched on 2026-09-08.

**Note on homepage state (checked 2026-09-08, after this audit began).** `content.md` (compiled earlier in this same audit round) recorded the homepage's prerendered `#root` at ~60 words with only a hero line and an empty category-list container. Re-fetching `/` directly during this pass shows the prerendered root now at **61 words** with a populated structure: H1 ("Timeless Beauty • Uniquely Yours"), a one-line subhead, an "Explore Collection" CTA, a live category link list (Earrings/Necklaces/Rings/Bracelets/Brooches), and — new since `content.md`'s pass — a full list of all 7 guide links surfaced directly on the homepage. This is a real, positive, confirmed change: guide discoverability from the homepage is now good (internal linking to all 7 guides in one place), and the category link structure is intact. It does **not** yet add body copy addressing any of this report's page-type or persona findings (still no visible material/trust/differentiation copy on the homepage itself, still no office-wear or gifting-specific homepage entry point). On the hero image specifically: the fetched prerendered HTML references `logo.webp`/`logo.png` as the preloaded LCP asset, but no distinct `hero.png`/`hero.webp` `<img>` tag was found in the static markup at fetch time — if a new 109KB hero WebP has been added as a CSS background-image or client-side-only element, that would not appear in this raw-HTML check and is unverified here; flagging the discrepancy rather than asserting the asset is absent.

---

## 3. User stories from observed SERP + intent signals

**Story 1 — "I don't know if this will turn my skin green/react, and I want a straight answer before I spend money."**
*Signal:* `does brass jewellery turn skin green` SERP is 100% direct-answer blog posts (Dea Dia, Parkdale Brass, Zearrow, AJLuxe) that open with a yes/no answer in the first sentence, not a scene-setting intro.
*Journey stage:* Awareness/early consideration.
*Does the landing page let them do it in one step?* Yes — `/guides/does-brass-jewelry-turn-skin-green` opens with exactly this direct-answer pattern (confirmed verbatim: *"Bare brass can turn skin green... on coated jewelry like ours the brass never touches your skin directly, so for most wearers it does not happen at all"*). One step, correctly executed. The gap is what happens *after* the answer: the guide should hand this now-reassured reader straight to a product, and per `content.md` Finding 1, this and other guide pages' internal linking to `/shop/earrings` was not independently re-verified in this pass — worth a follow-up check that a visible "shop the collection" CTA exists inside the guide body, not just in global nav.

**Story 2 — "I need a gift under ₹1,000 for someone whose size/taste I don't know, and I want the safest option, not the prettiest one."**
*Signal:* `jewellery gift under 1000 rupees india` SERP is dominated by price-filtered collection pages (Mannash `/collections/under-1000`, Zevarly `/collections/jewellery-under-1000`, BlueStone price filter) — the format itself signals the searcher wants to browse a curated, budget-capped set, not read an article.
*Journey stage:* Decision (has budget and occasion, needs a browsable shortlist).
*Does the landing page let them do it in one step?* **No.** The guide (`/guides/jewellery-gifting-guide-india`) correctly answers the *reasoning* ("earrings need no sizing, buy under ₹1,000 confidently") but the *browsable shortlist* page this searcher actually wants does not exist (Mismatch A/D above). Two steps minimum today: read the guide, then manually browse `/shop/earrings` and mentally filter by price yourself, since there's no price filter UI either (confirmed no facet links in `/shop/earrings`'s prerendered HTML).

**Story 3 — "I wear earrings to work every day and want something professional, comfortable, and durable — not costume-y."**
*Signal:* `office wear earrings` SERP is 100% collection pages with occasion-specific curation (GIVA's `style-office` tag, BlueStone's dedicated officewear category, Mridah's office-wear collection) — no single result is a generic "all earrings" page.
*Journey stage:* Consideration (has a specific use-case filter in mind).
*Does the landing page let them do it in one step?* **No page exists to test this against.** The closest available page, `/shop/earrings`, shows all 9 SKUs undifferentiated by occasion — a "chunky domed hoop" (from the crystal hoops PDP, styled for "sarees and ethnic outfits," "weddings," "evening looks") sits next to whatever the site's plainest stud is, with no way to filter to "office-appropriate" specifically. This searcher has to open every product page and read the "Perfect for" list themselves.

**Story 4 — "I have sensitive skin / have reacted to jewellery before, and I need to know this brand is actually safe before I trust it with a purchase."**
*Signal:* `jewellery for sensitive skin india` SERP is dominated by brand-blog explainer content that names specific safe materials (316L surgical steel, titanium, BIS-hallmarked 925 silver) and specific allergens to avoid (nickel) — this searcher wants a credible, specific materials explanation, not marketing reassurance.
*Journey stage:* Consideration, trust-building before first purchase.
*Does the landing page let them do it in one step?* Yes, well — `/guides/jewellery-for-sensitive-skin-india` is confirmed live at ~1,040 words with the same specificity pattern (nickel-free, surgical steel posts) the SERP rewards, and the PDP itself independently repeats "Nickel-free, lead-free and cadmium-free" and "Surgical steel posts, suitable for sensitive skin" as a bolded highlight (confirmed live fetch of the Crystal Hoops PDP). This is the strongest single story-to-page match found in the audit — informational and commercial pages both carry the same credible specificity independently.

**Story 5 — "I already know I want earrings from this brand; I just want to find a specific style fast."**
*Signal:* Inferred from repeat-buyer/direct-navigation behavior rather than a single query (no branded-query SERP was tested, since Avirena is too new for meaningful branded search volume) — but the underlying need (fast style-based browsing) is the same mechanism the `office wear earrings` and gifting-collection SERPs reward externally.
*Journey stage:* Decision, repeat/returning visit.
*Does the landing page let them do it in one step?* Partially — `/shop/earrings` lists all 9 products with price only, no style/finish/occasion filter, no "new," no "bestseller" flag (confirmed absent — `ecommerce.md` L3 notes no New Arrivals/Bestsellers page exists). At 9 SKUs this is not yet a hard blocker, but it will become one before the catalog reaches even 20–30 items if no filtering is added.

---

## 4. Persona scoring

Scored 0–25 per dimension (Relevance, Clarity, Trust, Action) against the pages each persona would actually land on, using only confirmed live page states from this audit and the parallel `content.md`/`ecommerce.md`/`schema.md` findings. Sorted weakest persona first.

### Persona B — Gift buyer, budget ₹1,000, doesn't know sizes (maps to Story 2)
**Lands on:** Google → `/guides/jewellery-gifting-guide-india` (if the guide ranks) or directly `/shop/earrings` (if browsing).

| Dimension | Score | Why |
|---|---|---|
| Relevance | 15/25 | The guide is highly relevant (answers the exact "under ₹1,000, no sizing" question), but the more likely SERP-rewarded page type (a filtered collection) doesn't exist, so relevance is capped by page-type absence, not content quality. |
| Clarity | 17/25 | Guide's own budget/ranking-by-fit-risk section is clear and specific. Loses points because it never resolves to a concrete, clickable shortlist — the clarity of the *advice* isn't matched by clarity of the *next step*. |
| Trust | 16/25 | Product-level nickel-free/surgical-steel claims are credible and consistent between guide and PDP. Undermined by the fabricated 65–72% "compare-at" discount pricing flagged in `content.md` §3 — a gift buyer comparing "₹599, was ₹1,899" against GIVA/Mannash's plain, undiscounted pricing is exactly the persona likely to notice and distrust a suspiciously large synthetic markdown. |
| Action | 8/25 | **Weakest link.** No price-filtered or gift-tagged page to act on despite the backend tag (`under-999`) and Shopify collection already existing. Buyer must manually scan 9 products with no price sort. |
| **Total** | **56/100** | |

### Persona A — First-time buyer worried about skin reactions (maps to Story 1 + Story 4)
**Lands on:** `/guides/does-brass-jewelry-turn-skin-green` or `/guides/jewellery-for-sensitive-skin-india`, then likely a PDP.

| Dimension | Score | Why |
|---|---|---|
| Relevance | 23/25 | Best match in the audit — direct-answer opening matches exactly what the SERP rewards; PDP reinforces with the same nickel-free/surgical-steel language independently. |
| Clarity | 21/25 | Guide states the chemistry plainly and gives an honest yes/no. Minor deduction: no stated coating-lifespan number anywhere on site (flagged `content.md` §7), which this exact persona would ask next ("ok it won't react now, but for how long?"). |
| Trust | 19/25 | Strong — explicit negation of solid-gold/vermeil/sterling claims (verified non-softened per `content.md` §4), consistent nickel-free claims guide-to-PDP. Deduction for the same synthetic discount-pricing issue and for `/policies` (where a skin-reaction-cautious buyer would check the return terms before buying) currently prerendering only 11 words with fabricated corporate identifiers (`content.md` Finding 2b) — a buyer who clicks through to verify return terms before a first purchase lands on the site's least trustworthy page at exactly the point they're seeking reassurance. |
| Action | 14/25 | Guide-to-PDP path exists but was not independently confirmed to have an in-body CTA (only global nav, per `content.md`'s scope). No visible "if this happens, here's what we do" return-path messaging on the guide page itself. |
| **Total** | **77/100** | Strongest persona fit on the site. |

### Persona C — Repeat buyer looking for a specific style (maps to Story 5)
**Lands on:** `/shop/earrings` directly, or a product page from memory/bookmark.

| Dimension | Score | Why |
|---|---|---|
| Relevance | 18/25 | At 9 SKUs, browsing the full list is still tolerable — relevance isn't broken yet, just unassisted. |
| Clarity | 14/25 | No style/occasion/finish filter, no "office wear" or "festive" grouping visible on `/shop/earrings` itself (that framing exists only inside individual PDP "Perfect for" lists, requiring per-product reading). |
| Trust | 17/25 | Consistent with Persona A's trust baseline; no persona-specific trust gap beyond the sitewide discount-pricing and `/policies` issues already noted. |
| Action | 12/25 | No sort/filter, no bestseller or "new" signal, no wishlist/save-for-later evident. A repeat buyer who liked a specific past style has no fast path back to "similar styles" — the cross-sell "Perfect match with" block exists but is confirmed to use non-crawlable JS click-handlers rather than real links (`ecommerce.md` H2), which also degrades the *on-site* browsing experience for this persona, not just crawlability. |
| **Total** | **61/100** | |

### Persona D — Office-wear searcher (maps to Story 3, added because it's the single clearest missing-page finding)
**Lands on:** Google → no dedicated page exists → most likely lands on homepage or `/shop/earrings` via a generic query, or bounces before clicking through if the SERP snippet can't promise an office-specific result.

| Dimension | Score | Why |
|---|---|---|
| Relevance | 6/25 | No page targets this intent at all. Whatever page Google surfaces (if any) will be generically about all 9 earrings, not office-appropriate ones specifically. |
| Clarity | 10/25 | Individual PDPs do state "Perfect for" occasions, but none currently reads "office" specifically in the sampled Crystal Hoops copy (its list is festive/saree/wedding/evening — the opposite occasion set from what this persona wants); unverified whether any of the other 8 PDPs' "Perfect for" lists include an office/daily-wear entry. |
| Trust | 15/25 | No persona-specific trust deficit beyond sitewide baseline, but trust is moot if relevance fails first. |
| Action | 5/25 | No filtered page, no tag-based landing page, backend collection unused. |
| **Total** | **36/100** | **Weakest persona-page fit found in this audit** — not because of content quality, but because the page this persona needs does not exist despite near-zero cost to build it (Shopify collection is already there). |

**Priority order for fixes, weakest persona first:** Persona D (office-wear, 36/100 — build the missing page) → Persona B (gift buyer, 56/100 — build the missing page + add price sort) → Persona C (repeat buyer, 61/100 — add filters, fix cross-sell links) → Persona A (skin-reaction-cautious buyer, 77/100 — smallest fix needed: add a coating-lifespan number and fix `/policies`).

---

## 5. The honest constraint — what's winnable in 90 days, and what isn't

Given: 9 products, all earrings, brand-new domain (days old), zero backlinks/authority, sole proprietorship with no press or review history.

**Realistically winnable in 90 days:**
- **`jewellery for sensitive skin india`** — the competitive set (Amama, Amorella, Seraphae, Ektaraa, Nuyug, Shoppers Point India) are themselves small/newer Indian D2C brand blogs, not entrenched high-authority domains. The existing guide is already comparable in depth and specificity. This is the single best authority-adjusted opportunity found in this audit.
- **`does brass jewellery turn skin green`** — competitive set is international (Dea Dia, Parkdale Brass, AJLuxe) but the query itself carries no explicit India qualifier, so there's no geographic disadvantage baked into the SERP; ranking depends on content quality/citability, where Avirena's guide is already competitive (confirmed direct-answer opening, correct length). Realistic mid-tier ranking (page 2, rising toward page 1) within 90 days, not a top-3 spot against Google's default trust priors for a zero-history domain — genuinely earning a top-3 spot this fast would require external validation this audit cannot promise.
- **Building `/shop/office-everyday` and `/shop/gifting-edit`** — not a ranking bet at all, since it's near-zero-cost (backend already exists) and improves Persona D/B's actual site experience regardless of whether Google ranks the page in 90 days. Do this even if the SEO payoff is slow, because the UX payoff is immediate.

**Not realistically winnable in 90 days — say so plainly:**
- **`anti tarnish jewellery india` and `brass jewellery online india`** (broad commercial category terms) — these are dominated by Myntra, Flipkart, Amazon.in, TheJewelBox: domains with years of accumulated authority, product review counts in the thousands, and category-page depth Avirena's 9-SKU, single-category catalog cannot match on breadth. A brand-new domain competing head-on for these exact broad terms in 90 days would be effort spent against domains with structural advantages code and content changes cannot close quickly. Recommend deprioritizing these as primary near-term targets; treat them as multi-year plays revisited after catalog expansion and real authority accrual (backlinks, reviews, press).
- **`ring size chart india`** — the guide is well-built, but the site sells zero rings. Even a successful ranking here converts nothing, because Persona C/repeat-buyer and Persona B/gift-buyer traffic arriving via a ring query has no product to buy. This is not an "unwinnable due to competition" case like the above — it's winnable in principle (the competitive set includes reachable mid-size brand pages, not only Tanishq/CaratLane) but **not worth winning** given the catalog. Recommend not investing further content/optimization effort here until rings are a real SKU category; the guide can stay live as-is (it costs nothing to leave up) but should not receive incremental investment.
- **`gifting jewellery under 1000`** as a *broad* national term — GIVA, BlueStone, and Foundation Gift have far deeper catalogs and gifting-specific merchandising (custom engraving, occasion bundles) than a 9-SKU earrings-only store can match broadly. The *narrower*, more winnable version of this intent is "earrings gift under ₹1,000" specifically, where Avirena's entire catalog qualifies by price and the gifting guide already argues earrings are the safest gift choice — this narrower framing is achievable, the broad one is not.
- **`office wear earrings`** without qualification — GIVA and BlueStone's dedicated office collections have far more SKUs and years of standing. Avirena's realistic 90-day goal here is not to outrank them broadly but to exist as a crawlable, correctly-tagged page at all (currently: doesn't exist) so that it can start accumulating relevance for long-tail variants ("office wear earrings under 1000," "office wear earrings anti tarnish") where the field is thinner.

**Where effort would be plainly wasted right now:** writing additional broad-category commercial content (more copy on `/shop` or `/shop/earrings` alone) will not overcome Myntra/Flipkart/Amazon's structural authority advantage in 90 days — that is a losing trade of effort against unwinnable queries. The better use of the same effort is the two missing pages (§1, §2 Mismatch A) and tightening the guide-to-shop link path (§2 Mismatch D, §3 Story 2), both of which compound with catalog growth rather than fighting entrenched incumbents head-on.

---

## SXO Gap Score

Scored across intent-fit dimensions specific to search *experience* (separate from any technical SEO Health Score reported elsewhere in this audit):

| Dimension | Score | Basis |
|---|---|---|
| Page-type/SERP-format alignment | 11/20 | 5 of 6 informational queries aligned; 3 of 6 commercial queries aligned but thin; 2 of 6 commercial queries have no page at all |
| Guide-to-shop conversion path | 6/15 | Content quality is high but internal linking from guide answers to shoppable pages is unconfirmed/likely absent for the gifting guide specifically |
| Category page differentiation | 5/15 | `/shop/earrings` carries no visible category-level trust/material copy despite the claims existing elsewhere on-site |
| Persona-critical missing pages | 4/20 | Office-wear and gifting-edit pages absent despite near-zero build cost; this is the single largest deduction in the whole score |
| Trust-page readiness at decision point | 8/15 | Strong PDP-level trust signals undercut by `/policies` thinness/fabricated content (cross-referenced from `content.md`) at exactly the moment cautious buyers seek reassurance |
| Catalog-query alignment | 9/15 | Ring size guide targets an unconvertible category; earrings-specific guides and PDPs are well-aligned to the actual catalog |
| **Total SXO Gap Score** | **43/100** | |

This is a content-and-routing gap score, not a technical-crawlability score — the parallel `technical.md`, `sitemap.md`, and `schema.md` findings in this same directory cover the indexability layer that determines whether Google can even see these pages once they exist.

---

## Limitations

- No DataForSEO, Search Console, or any ranking/impression/click/volume API access was used or available. All SERP claims above are directly reproducible via the exact query strings quoted, re-run on 2026-09-08 — they describe what currently ranks, not what will rank, and carry no volume or CPC estimate.
- WebSearch results reflect Google's response to a US-market-default search context (no explicit India geolocation could be forced from this environment); queries without an explicit "india" qualifier (e.g., "anti tarnish earrings online") may under-represent India-specific SERP results relative to what a searcher physically in India would see. Where this materially affected a finding (commercial query geography), a second India-qualified variant of the same query was run and both are reported side by side (§1).
- Competitive "authority" claims (e.g., "Myntra has years of accumulated authority") are based on observed brand recognition and SERP presence pattern, not on any backlink/domain-authority metric tool — no third-party authority score was pulled for any competitor domain.
- Persona scores are qualitative judgments grounded in confirmed live page content and the parallel audit files' verified findings, not user-testing or analytics data — no session recordings, heatmaps, or actual conversion-funnel data exist for this brand-new site.
- Guide-to-shop internal linking (whether guide body copy contains a live CTA to `/shop/earrings` beyond global navigation) was inferred as likely-thin based on `content.md`'s scope note that this was "not independently re-verified" — flagged here as a specific follow-up worth a direct check, not asserted as confirmed absent.
- No AI Overview presence/absence was systematically logged per query (WebSearch tool output does not reliably distinguish AI Overview text from organic snippets) — treat any AI Overview-specific claims as absent from this report rather than assumed non-existent.

## Cross-references

- `content.md` (this audit set): `/policies` fabricated CIN/GSTIN/address content directly undermines Persona A's and Persona B's trust scores at the exact moment they seek reassurance — highest-leverage fix shared between the content and SXO findings.
- `ecommerce.md` (this audit set): Finding L3 (missing Gifting Edit / Office & Everyday frontend routes) and Finding C1 (mis-tagged `under-999` collection) are the direct backend-readiness evidence behind this report's §1/§2 Mismatch A and Persona B/D scores.
- `schema.md` (this audit set): BreadcrumbList and Product price schema defects affect how confidently Google can serve any of these pages as rich results once page-type/content gaps above are closed — sequence schema fixes after the missing-page fixes, not before, since there's no rich result to enhance on a page that doesn't exist yet.
- Recommend `/seo content` for a deeper E-E-A-T pass specifically on `/policies` and `/contact`, already flagged as critical in `content.md`.
- Recommend `/seo schema` once `/shop/office-everyday` and `/shop/gifting-edit` exist, to generate CollectionPage/ItemList schema for the two new routes.

Generate a PDF report? Use `/seo google report`.
