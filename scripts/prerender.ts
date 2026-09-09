import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Long-form guide copy. Shared verbatim with src/pages/GuidesPage.tsx so the
// prerendered HTML and the hydrated DOM can never state different facts.
import { GUIDES, type Guide, type GuideBlock } from '../src/data/guides';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const publicDir = path.join(rootDir, 'public');

// Shopify Configuration — credentials come from the environment only.
// Never commit a fallback token here: it ends up in git history permanently.
const SHOPIFY_STORE_DOMAIN = process.env.VITE_SHOPIFY_STORE_DOMAIN || '';
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = process.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';
const SHOPIFY_API_VERSION = process.env.VITE_SHOPIFY_API_VERSION || '2025-01';

const SITE_URL = 'https://avirenajewels.com';

interface RouteData {
  path: string;
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
  ogType: string;
  keywords?: string;
  jsonLd: any[];
  htmlContent: string;
  /** When set, overrides the template's robots directive for this route only. */
  robots?: string;
}

/**
 * Derive a category slug for a Shopify product.
 *
 * This MUST stay behaviourally identical to `transformShopifyProduct()` in
 * src/lib/shopify.ts (~line 464) so the prerendered category counts, the
 * noindex decisions below, and the client-rendered grid never disagree.
 * Shopify has no first-class category field on the Storefront API, so both
 * sides infer it from title / productType / tags / description.
 */
function deriveCategory(product: any): string {
  const titleLower = (product.title || '').toLowerCase();
  const typeLower = (product.productType || '').toLowerCase();
  const tagsLower = (product.tags || []).map((t: string) => String(t).toLowerCase()).join(' ');
  const descLower = (product.description || '').toLowerCase();
  const fullText = `${titleLower} ${typeLower} ${tagsLower} ${descLower}`;

  const rules: { category: string; primary: RegExp; tag: RegExp }[] = [
    { category: 'earrings', primary: /\b(earrings?|studs?|dangles?|hoops?|huggie)\b/i, tag: /\b(earrings?)\b/i },
    { category: 'necklaces', primary: /\b(necklaces?|pendants?|chokers?|collars?)\b/i, tag: /\b(necklaces?)\b/i },
    { category: 'bracelets', primary: /\b(bracelets?|bangles?|cuffs?)\b/i, tag: /\b(bracelets?)\b/i },
    { category: 'brooches', primary: /\b(brooches?|pins?)\b/i, tag: /\b(brooches?)\b/i },
    { category: 'rings', primary: /\b(rings?|bands?)\b/i, tag: /\b(rings?)\b/i },
    { category: 'sets', primary: /\b(sets?|suites?)\b/i, tag: /\b(sets?)\b/i },
  ];

  for (const rule of rules) {
    if (rule.primary.test(titleLower) || rule.primary.test(typeLower) || rule.tag.test(tagsLower)) {
      return rule.category;
    }
  }

  // Second pass: fall back to the full text blob (description included).
  for (const rule of rules) {
    if (rule.category === 'sets') continue;
    if (rule.primary.test(fullText)) return rule.category;
  }

  return 'earrings';
}

// 1. Fetch live products from Shopify
async function fetchShopifyProducts(): Promise<any[]> {
  if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    throw new Error(
      '[Prerender] Missing VITE_SHOPIFY_STORE_DOMAIN or VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN. ' +
        'Set them in .env (local) or the Vercel project environment. ' +
        'Refusing to build: without them every product page would be silently omitted.'
    );
  }

  try {
    const endpoint = `https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
    const query = `
      query GetProductsForPrerender {
        products(first: 100) {
          edges {
            node {
              id
              title
              handle
              description
              availableForSale
              productType
              tags
              # Hand-written per-product SEO copy set in Shopify admin. Preferred
              # over truncating the body description, which produced meta tags
              # ending mid-sentence in an ellipsis.
              seo {
                description
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              compareAtPriceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 10) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
      }
    `;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query }),
    });

    const data = await res.json();
    return (data.data?.products?.edges || []).map((e: any) => e.node);
  } catch (err) {
    console.warn('[Prerender] Could not fetch products from Shopify:', err);
    return [];
  }
}

// 2. Generate Organization & Global Schema
function getGlobalSchema() {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Avirena Jewels',
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      description:
        'Homegrown dailywear jewelry atelier crafting sculptural pieces in durable brass, anti-tarnish protective coatings, and natural cultured pearls.',
      sameAs: [
        'https://www.instagram.com/avirenajewels/',
        'https://www.facebook.com/profile.php?id=61594070437997',
        'https://www.pinterest.com/avirenajewels',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+91-78238-89290',
        contactType: 'customer service',
        availableLanguage: ['English', 'Hindi'],
        areaServed: ['IN', 'US', 'GB', 'EU'],
      },
    },
    {
      // OnlineStore schema with Google Site Name & Organization attributes
      '@context': 'https://schema.org',
      '@type': 'OnlineStore',
      name: 'Avirena Jewels',
      alternateName: ['Avirena', 'AVIRENA', 'AVIRENA Jewels'],
      image: `${SITE_URL}/og-banner.jpg`,
      logo: `${SITE_URL}/logo.png`,
      '@id': `${SITE_URL}/#store`,
      url: SITE_URL,
      email: 'avirenajewels@gmail.com',
      telephone: '+91-78238-89290',
      priceRange: '₹₹',
      currenciesAccepted: 'INR',
      paymentAccepted: 'Credit Card, Debit Card, UPI, Net Banking',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Mumbai',
        addressRegion: 'MH',
        addressCountry: 'IN',
      },
      parentOrganization: {
        '@type': 'Organization',
        name: 'The PieCraft Marketing',
        url: 'https://thepiecraftmarketing.com/',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Avirena Jewels',
      alternateName: ['Avirena', 'AVIRENA', 'AVIRENA Jewels', 'Avira Jewels'],
      url: SITE_URL,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/shop?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ];
}


// ---------------------------------------------------------------------------
// Title & description shaping
// ---------------------------------------------------------------------------

/** Google truncates around here; longer titles are cut off in every SERP surface. */
const MAX_TITLE_LENGTH = 60;
/** Meta descriptions are truncated around here too. */
const MAX_DESCRIPTION_LENGTH = 160;

/**
 * Build a SERP-safe <title> from a raw Shopify product title.
 *
 * Shopify titles here are keyword-stuffed and pipe-separated, e.g.
 *   "Geometric Gold-Tone Statement Earrings for Women | Modern Square Earrings"
 * which produced ~101-character page titles that truncated everywhere. Take the
 * segment before the first " | " (the distinctive product name), append a short
 * brand suffix, and only drop the suffix if the result still would not fit.
 * A title that is already short is left alone apart from the suffix.
 */
function buildProductTitle(rawTitle: string): string {
  const name = rawTitle.split('|')[0].trim() || rawTitle.trim();
  const suffix = ' | AVIRENA';

  if (name.length + suffix.length <= MAX_TITLE_LENGTH) {
    return `${name}${suffix}`;
  }

  // The distinctive name alone already fills the budget: keep the name, drop the
  // brand suffix rather than shipping a title that gets cut mid-word.
  if (name.length <= MAX_TITLE_LENGTH) {
    return name;
  }

  // Pathological case — a single segment longer than the whole budget. Trim on a
  // word boundary so the title never ends mid-word.
  return truncateAtWord(name, MAX_TITLE_LENGTH);
}

/**
 * Build a meta description that fits, ending on a word boundary with an ellipsis
 * only when text was actually cut. The previous version blindly sliced at 155
 * and then appended more text, guaranteeing an over-length, mid-word result.
 */
/**
 * Meta description for a product page.
 *
 * Uses the hand-written Shopify SEO description when present, but strips any
 * rupee figure out of it and appends the CURRENT catalog price instead. The
 * Shopify copy was authored before a repricing and several entries advertised
 * a price below what the product now costs.
 *
 * Any price figures that are not the product price itself are stripped.
 */
function buildProductMetaDescription(
  seoDescription: string | undefined,
  rawDescription: string,
  priceInr: number
): string {
  const authored = (seoDescription || '').replace(/\s+/g, ' ').trim();
  if (!authored) return buildProductDescription(rawDescription);

  const priceSuffix = ` ₹${priceInr}.`;
  const cleaned = authored
    .replace(/Free delivery over (₹|Rs\.?)\s*1,?999\.?/gi, 'Free delivery across India.')
    .replace(/₹\s?[0-9][0-9,]*\.?/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  const budget = MAX_DESCRIPTION_LENGTH - priceSuffix.length;
  const body = cleaned.length > budget ? truncateAtWord(cleaned, budget) : cleaned;
  return `${body}${priceSuffix}`;
}

function buildProductDescription(rawDescription: string): string {
  const body = rawDescription.replace(/\s+/g, ' ').trim();
  const suffix = ' Free delivery across India. 7-day easy returns.';

  if (body.length + suffix.length <= MAX_DESCRIPTION_LENGTH) {
    return `${body}${suffix}`;
  }

  const budget = MAX_DESCRIPTION_LENGTH - suffix.length - 1; // -1 for the ellipsis
  return `${truncateAtWord(body, budget)}…${suffix}`;
}

/** Cut a string to at most `max` characters without splitting a word. */
function truncateAtWord(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trim();
}

// ---------------------------------------------------------------------------
// Guide rendering (see src/data/guides.ts)
// ---------------------------------------------------------------------------


/**
 * Build FAQPage `mainEntity` nodes from guide Q&A, so the FAQ route reuses the
 * same verified answers as /guides/:slug rather than keeping a second, shorter
 * copy that can drift out of sync. Throws on an unknown pair so a renamed
 * question fails the build instead of silently dropping an answer.
 */
function guideFaqEntries(refs: [string, string][]): any[] {
  return refs.map(([slug, question]) => {
    const guide = GUIDES.find((g) => g.slug === slug);
    const faq = guide?.faqs.find((f) => f.question === question);
    if (!faq) {
      throw new Error(
        `[Prerender] No guide FAQ found for "${question}" in guide "${slug}". ` +
          'Update scripts/prerender.ts if the question was reworded in src/data/guides.ts.'
      );
    }
    return {
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    };
  });
}

/** Render one guide body block as static, crawlable HTML. */
function renderGuideBlock(block: GuideBlock): string {
  switch (block.type) {
    case 'lead':
      // The direct answer, first thing in the body: this is the passage an
      // answer engine or featured snippet lifts.
      return `<p class="guide-lead">${escapeHtml(block.text)}</p>`;
    case 'heading':
      return `<h2>${escapeHtml(block.text)}</h2>`;
    case 'paragraph':
      return `<p>${escapeHtml(block.text)}</p>`;
    case 'list':
      return `<ul>${block.items.map((i) => `<li>${escapeHtml(i)}</li>`).join('')}</ul>`;
    case 'table':
      return `<table><caption>${escapeHtml(block.caption)}</caption><thead><tr>${block.columns
        .map((c) => `<th scope="col">${escapeHtml(c)}</th>`)
        .join('')}</tr></thead><tbody>${block.rows
        .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`)
        .join('')}</tbody></table>`;
    default:
      return '';
  }
}

/**
 * Per-position alt-text suffixes for the product gallery.
 *
 * Shopify's own altText is empty on the current uploads, and emitting the
 * product name five times gives a screen reader and Google Images no way to
 * tell the views apart. Indexed by gallery position.
 */
const GALLERY_ALT_SUFFIX = [
  '',
  ' — detail view',
  ' — side profile',
  ' — close-up of the finish',
  ' — worn on model',
  ' — styled look',
];

/**
 * Related-product links for a product page, in PRERENDERED html.
 *
 * The hydrated app has a "Perfect match with" block, but it is built from
 * onClick handlers on divs rather than anchors, so no crawler ever sees a link
 * between two products. Without this, the only path to a product page is the
 * sitemap and no internal link equity flows through the catalog at all.
 */
function renderRelatedProducts(all: any[], currentHandle: string): string {
  const others = all.filter((p) => (p.handle || p.id) !== currentHandle).slice(0, 4);
  if (others.length === 0) return '';

  return `
          <nav class="related-products" aria-label="More pieces">
            <h2>More Pieces</h2>
            <ul>
              ${others
                .map((p: any) => {
                  const h = p.handle || p.id;
                  const amt = Math.round(
                    parseFloat(p.priceRange?.minVariantPrice?.amount || '0')
                  );
                  return `<li><a href="/product/${h}">${escapeHtml(p.title)}</a> — ₹${amt}</li>`;
                })
                .join('\n              ')}
            </ul>
            <p><a href="/shop">View all jewellery</a></p>
          </nav>`;
}

/** Full prerendered article body for one guide, including its on-page Q&A. */
function renderGuideHtml(guide: Guide): string {
  return `
      <main class="guide-page">
        <nav aria-label="Breadcrumb">
          <a href="/">Home</a> / <a href="/guides">Guides</a> / <span>${escapeHtml(guide.shortTitle)}</span>
        </nav>
        <article>
          <h1>${escapeHtml(guide.heading)}</h1>
          ${guide.blocks.map(renderGuideBlock).join('\n          ')}
          <section class="guide-faq">
            <h2>Common Questions</h2>
            ${guide.faqs
              .map(
                (f) => `<h3>${escapeHtml(f.question)}</h3><p>${escapeHtml(f.answer)}</p>`
              )
              .join('\n            ')}
          </section>
        </article>
        <nav aria-label="More guides">
          <h2>More Guides</h2>
          <ul>
            ${GUIDES.filter((g) => g.slug !== guide.slug)
              .map((g) => `<li><a href="/guides/${g.slug}">${escapeHtml(g.shortTitle)}</a></li>`)
              .join('\n            ')}
          </ul>
        </nav>
      </main>
    `;
}

/**
 * Critical CSS for the prerendered skeleton.
 *
 * The skeleton emitted below uses semantic class names (.site-header,
 * .hero-section, .cta-btn, .category-page, .categories-section,
 * .product-detail-page ...) that have ZERO rules in the shipped Tailwind
 * stylesheet -- Tailwind only emits classes it actually finds in src/. So until
 * the React bundle parsed and rendered, first paint was unstyled browser-default
 * HTML: Times New Roman on white with blue underlined links.
 *
 * This is deliberately small and inline (no extra request, no render-blocking
 * round trip). It is NOT a stylesheet -- it only has to make first paint look
 * like AVIRENA. Once React mounts it replaces #root wholesale and Tailwind takes
 * over, so nothing here needs to survive that swap.
 *
 * Tokens: bg #E7E4D5 / ink #413C23 / accent #8F896D / muted #F2EFDB / line #D8D2C2
 */
/**
 * Shopify's image CDN resizes on demand via a `width` query param. Product card
 * thumbs were being served the full-resolution master (often 2000px+) into a
 * ~220px grid cell. Only cdn.shopify.com URLs are rewritten; anything else
 * (a local /logo.png fallback, Unsplash) is returned untouched.
 */
function shopifyImage(url: string, width: number): string {
  if (!url.includes('cdn.shopify.com')) return url;
  return url.includes('?') ? `${url}&width=${width}` : `${url}?width=${width}`;
}

const CRITICAL_CSS = `
    <style id="critical-skeleton-css">
      :root{--av-bg:#E7E4D5;--av-ink:#413C23;--av-accent:#8F896D;--av-muted:#F2EFDB;--av-line:#D8D2C2}
      body{margin:0;background:var(--av-bg);color:var(--av-ink);
        font-family:'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,sans-serif;
        -webkit-font-smoothing:antialiased}
      #root{min-height:100vh}
      #root a{color:inherit;text-decoration:none}
      #root h1,#root h2,#root h3{font-family:'Cormorant Garamond',Georgia,serif;
        font-weight:300;letter-spacing:-.01em;margin:0 0 .5rem}
      #root main p{margin:0 0 1rem;line-height:1.65;color:rgba(65,60,35,.85)}
      #root footer p,#root footer a,#root footer span{color:#FFFFFF}
      .site-header{display:flex;align-items:center;justify-content:center;
        padding:1.25rem 1.5rem;border-bottom:1px solid var(--av-line);background:var(--av-bg)}
      .site-header nav{display:flex;flex-wrap:wrap;gap:1.25rem;justify-content:center;
        font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--av-accent)}
      .hero-section{min-height:60vh;display:flex;flex-direction:column;align-items:center;
        justify-content:center;text-align:center;padding:4rem 1.5rem;
        border-bottom:1px solid var(--av-line)}
      .hero-section h1{font-size:clamp(2.25rem,7vw,4.5rem);line-height:1.05;max-width:18ch}
      .hero-section p{max-width:52ch;font-size:.95rem}
      .cta-btn{display:inline-block;margin-top:.5rem;padding:.9rem 1.9rem;
        background:var(--av-ink);color:var(--av-bg);font-size:11px;font-weight:600;
        letter-spacing:.2em;text-transform:uppercase}
      .categories-section,.collections-page,.shop-catalog-page,.category-page,
      .about-page,.contact-page,.faq-page,.policies-page,.journal-page,
      .not-found-page,.product-detail-page{max-width:1280px;margin:0 auto;padding:3rem 1.5rem}
      .categories-section h2{font-size:clamp(1.5rem,4vw,2.5rem);text-align:center}
      .categories-section ul{list-style:none;margin:2rem 0 0;padding:0;display:flex;
        flex-wrap:wrap;gap:.75rem;justify-content:center}
      .categories-section li a{display:block;padding:.85rem 1.4rem;background:var(--av-muted);
        border:1px solid var(--av-line);font-size:11px;letter-spacing:.16em;text-transform:uppercase}
      .category-page nav,.product-detail-page nav{font-size:11px;letter-spacing:.12em;
        text-transform:uppercase;color:var(--av-accent);margin-bottom:1.5rem}
      .category-page h1,.shop-catalog-page h1,.product-detail-page h1{
        font-size:clamp(2rem,5vw,3.25rem)}
      .products-grid{display:grid;gap:1.25rem;margin-top:2rem;
        grid-template-columns:repeat(auto-fill,minmax(220px,1fr))}
      .product-card{background:var(--av-muted);border:1px solid var(--av-line);padding:1rem}
      .product-card img{width:100%;height:auto;aspect-ratio:1/1;object-fit:contain;
        mix-blend-mode:multiply;display:block}
      .product-card .price{display:block;margin-top:.4rem;font-weight:600;font-size:.9rem}
      .category-empty{background:var(--av-muted);border:1px solid var(--av-line);
        padding:2rem;text-align:center;margin-top:2rem}
      .product-detail-page .product-gallery{display:grid;gap:.75rem;
        grid-template-columns:repeat(auto-fill,minmax(150px,1fr))}
      .product-detail-page .product-gallery img{width:100%;height:auto;aspect-ratio:4/5;
        object-fit:cover;background:var(--av-muted);border:1px solid var(--av-line);display:block}
      .product-detail-page .product-info{margin-top:1.5rem}
      .product-detail-page .price{font-size:1.25rem;font-weight:600}
    </style>`;

// 3. Build HTML Template with Injected Meta Tags & Prerendered Content
function renderPageHtml(template: string, route: RouteData): string {
  let html = template;

  // Strip every SEO tag the static index.html template carries, so the per-route
  // set injected below is the ONLY one on the page. Without this, every route
  // shipped duplicate title/description/OG/Twitter tags and the homepage shipped
  // two conflicting <link rel="canonical"> values, which makes Google discard
  // both and pick its own canonical.
  html = html
    .replace(/<title[^>]*>[\s\S]*?<\/title>\s*/gi, '')
    .replace(/<meta\s+name=["']title["'][^>]*>\s*/gi, '')
    .replace(/<meta\s+name=["']description["'][^>]*>\s*/gi, '')
    .replace(/<meta\s+name=["']keywords["'][^>]*>\s*/gi, '')
    .replace(/<link\s+rel=["']canonical["'][^>]*>\s*/gi, '')
    .replace(/<meta\s+property=["']og:[^"']*["'][^>]*>\s*/gi, '')
    .replace(/<meta\s+name=["']twitter:[^"']*["'][^>]*>\s*/gi, '')
    .replace(/<meta\s+name=["']robots["'][^>]*>\s*/gi, '');

  // Robots is emitted per-route so a page can opt out of indexing (e.g. an
  // empty category) without leaving the template's `index, follow` behind as a
  // conflicting second directive.
  const robotsContent =
    route.robots || 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

  // Meta Tags String
  const metaTags = `
    <title>${escapeHtml(route.title)}</title>
    <meta name="robots" content="${escapeHtml(robotsContent)}" />
    <meta name="title" content="${escapeHtml(route.title)}" />
    <meta name="description" content="${escapeHtml(route.description)}" />
    ${route.keywords ? `<meta name="keywords" content="${escapeHtml(route.keywords)}" />` : ''}
    <link rel="canonical" href="${route.canonical}" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="${route.ogType}" />
    <meta property="og:url" content="${route.canonical}" />
    <meta property="og:site_name" content="AVIRENA Jewels" />
    <meta property="og:title" content="${escapeHtml(route.title)}" />
    <meta property="og:description" content="${escapeHtml(route.description)}" />
    <meta property="og:image" content="${route.ogImage}" />
    <!-- Primary locale is en_IN: the store prices in INR, ships from Mumbai and
         targets Indian search. en_US as primary told social platforms and
         crawlers the opposite. -->
    <meta property="og:locale" content="en_IN" />
    <meta property="og:locale:alternate" content="en_US" />
    <meta property="og:locale:alternate" content="en_GB" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${route.canonical}" />
    <meta name="twitter:title" content="${escapeHtml(route.title)}" />
    <meta name="twitter:description" content="${escapeHtml(route.description)}" />
    <meta name="twitter:image" content="${route.ogImage}" />

    <!-- Structured Data JSON-LD -->
    <script type="application/ld+json" id="dynamic-jsonld-schema">
${JSON.stringify(route.jsonLd, null, 2)}
    </script>
  `;

  // Inject Meta Tags + critical skeleton CSS before </head>. Critical CSS goes
  // last so it wins over anything the static template declares.
  html = html.replace('</head>', `${metaTags}\n${CRITICAL_CSS}\n  </head>`);

  // Inject Pre-rendered Semantic HTML into <div id="root">
  if (route.htmlContent) {
    html = html.replace(
      '<div id="root"></div>',
      `<div id="root">${route.htmlContent}</div>`
    );
  }

  return html;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// 4. Main Prerender Execution Function
async function main() {
  console.log('🚀 Starting SEO Prerender and GSC Sitemap Generator for AVIRENA...');

  if (!fs.existsSync(distDir)) {
    console.error('❌ dist/ directory not found! Run "vite build" first.');
    process.exit(1);
  }

  const indexHtmlTemplate = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

  // Fetch live Shopify catalog
  console.log('📦 Querying live Shopify catalog...');
  const shopifyProducts = await fetchShopifyProducts();
  console.log(`✨ Fetched ${shopifyProducts.length} live products from Shopify.`);

  const routes: RouteData[] = [];
  const sitemapUrls: { loc: string; lastmod: string; changefreq: string; priority: string; images?: string[] }[] = [];

  const today = new Date().toISOString().split('T')[0];

  // Helper to add sitemap URL
  const addSitemapUrl = (loc: string, priority = '0.8', changefreq = 'weekly', images: string[] = []) => {
    sitemapUrls.push({ loc, lastmod: today, changefreq, priority, images });
  };

  // Lowest live catalog price, derived once and reused by the homepage and
  // /shop copy. Never hardcode a price in copy: the previous hardcoded "₹499"
  // survived a repricing and advertised a figure that no longer existed.
  const lowestPriceForHome = shopifyProducts.length
    ? Math.round(
        Math.min(
          ...shopifyProducts.map((p: any) =>
            parseFloat(p.priceRange?.minVariantPrice?.amount || '0')
          )
        )
      )
    : 0;

  // ---------------- ROUTE 1: Home Page (/) ----------------
  routes.push({
    path: '',
    title: 'Avirena Jewels – Anti-Tarnish Dailywear Jewelry India',
    description:
      'At Avirena Jewels, our mission is to create elegant, high-quality dailywear jewellery handcrafted in durable anti-tarnish brass and natural cultured pearls.',
    canonical: SITE_URL,
    ogImage: `${SITE_URL}/og-banner.jpg`,
    ogType: 'website',
    keywords:
      'dailywear jewelry, anti tarnish brass jewelry, baroque pearls, sculptural rings, molten earrings, statement necklace, luxury jewelry India, aesthetic dailywear',
    jsonLd: [
      ...getGlobalSchema(),
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Avirena Site Navigation',
        itemListElement: [
          {
            '@type': 'SiteNavigationElement',
            position: 1,
            name: 'Products',
            description: 'Anti-tarnish earrings, necklaces, rings, and bracelets crafted for daily wear.',
            url: `${SITE_URL}/shop`,
          },
          {
            '@type': 'SiteNavigationElement',
            position: 2,
            name: 'Earrings',
            description: 'Sculptural molten studs, organic drop earrings, and crystal huggies in brass.',
            url: `${SITE_URL}/shop/earrings`,
          },
          {
            '@type': 'SiteNavigationElement',
            position: 3,
            name: 'Necklaces',
            description: 'Layered architectural chains, pearl drop pendants, and statement collars.',
            url: `${SITE_URL}/shop/necklaces`,
          },
          {
            '@type': 'SiteNavigationElement',
            position: 4,
            name: 'Rings',
            description: 'Ergonomic statement bands, wave rings, and baroque pearl solitaires.',
            url: `${SITE_URL}/shop/rings`,
          },
          {
            '@type': 'SiteNavigationElement',
            position: 5,
            name: 'Signature Suites',
            description: 'Curated design suites and coordinated sets for daily wear and gifting.',
            url: `${SITE_URL}/collections`,
          },
          {
            '@type': 'SiteNavigationElement',
            position: 6,
            name: 'About Us',
            description: 'Our homegrown Mumbai atelier, anti-tarnish metal crafting, and dailywear philosophy.',
            url: `${SITE_URL}/about`,
          },
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What materials are used in Avirena dailywear jewelry?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Avirena crafts jewelry using high-density brass and durable alloys sealed with protective e-coating to ensure everyday water resistance and long-lasting anti-tarnish durability.',
            },
          },
          {
            '@type': 'Question',
            name: 'Are Avirena baroque pearls natural?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, Avirena exclusively uses hand-selected cultured freshwater baroque pearls known for their organic luster and natural unique contours.',
            },
          },
        ],
      },
    ],
    htmlContent: `
      <header class="site-header">
        <nav aria-label="Main Navigation">
          <a href="/">AVIRENA</a>
          <a href="/shop">Shop All Jewelry</a>
          <a href="/shop/earrings">Earrings</a>
          <a href="/shop/rings">Rings</a>
          <a href="/shop/necklaces">Necklaces</a>
          <a href="/shop/bracelets">Bracelets</a>
          <a href="/collections">Curated Suites</a>
          <a href="/about">About Us</a>
          <a href="/guides">Jewellery Guides</a>
          <a href="/faq">FAQ &amp; Sizing</a>
          <a href="/journal">Styling Journal</a>
          <a href="/contact">Contact Concierge</a>
        </nav>
      </header>
      <main>
        <section class="hero-section">
          <h1>Anti-Tarnish Brass Jewellery for Daily Wear</h1>
          <p>Sculptural earrings in high-grade brass and durable alloys, sealed with a protective anti-tarnish coating. Nickel-free, lead-free and cadmium-free, with surgical steel posts, so they suit sensitive skin. Made in India for everyday wear${
            lowestPriceForHome ? `, from ₹${lowestPriceForHome}` : ''
          }.</p>
          <a href="/shop" class="cta-btn">Explore Collection</a>
        </section>

        <section class="categories-section">
          <h2>What we make, stated plainly</h2>
          <p>This is fashion jewellery. It is not solid gold, not gold vermeil and not sterling silver, and it is not hallmarked to any precious-metal standard. Gold-tone and silver-tone describe the colour of the finish, not the metal underneath. Where a piece has pearls they are cultured freshwater pearls, and where it has a stone it is faceted glass rather than a diamond. We would rather tell you that up front than have you find out after it arrives.</p>
          <p>Free delivery on all orders and 7-day exchanges on unworn pieces across India.</p>
        </section>

        <section class="categories-section">
          <h2>Jewellery Categories</h2>
          <ul>
            <li><a href="/shop/earrings">Earrings</a> — studs, drops and hoops in gold tone and silver tone</li>
            <li><a href="/shop/necklaces">Necklaces</a> — architectural chains and pendants</li>
            <li><a href="/shop/rings">Rings</a> — sculptural bands and wave rings</li>
            <li><a href="/shop/bracelets">Bracelets</a> — open cuffs and linked wristwear</li>
            <li><a href="/shop/brooches">Brooches</a> — artisanal sculptural pins</li>
          </ul>
        </section>
        <section class="categories-section">
          <h2>Jewelry Guides</h2>
          <ul>
            ${GUIDES.map(
              (g) => `<li><a href="/guides/${g.slug}">${escapeHtml(g.shortTitle)}</a></li>`
            ).join('')}
          </ul>
        </section>
      </main>
      <footer class="site-footer">
        <div>
          <h3>Navigation</h3>
          <ul>
            <li><a href="/shop">Shop All</a></li>
            <li><a href="/shop/earrings">Earrings</a></li>
            <li><a href="/shop/rings">Rings</a></li>
            <li><a href="/shop/necklaces">Necklaces</a></li>
            <li><a href="/shop/bracelets">Bracelets</a></li>
            <li><a href="/collections">Curated Suites</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/faq">FAQ &amp; Sizing</a></li>
            <li><a href="/journal">Styling Journal</a></li>
          </ul>
        </div>
        <div>
          <h3>Support &amp; Policies</h3>
          <ul>
            <li><a href="/contact">Contact Concierge</a></li>
            <li><a href="/refund-policy">Return &amp; Refund Policy</a></li>
            <li><a href="/shipping-policy">Shipping Policy</a></li>
            <li><a href="/privacy-policy">Privacy Policy</a></li>
            <li><a href="/terms-of-service">Terms of Service</a></li>
            <li><a href="/legal-notice">Legal Notice</a></li>
          </ul>
        </div>
      </footer>
    `,
  });
  addSitemapUrl(SITE_URL, '1.0', 'daily', [`${SITE_URL}/logo.png`]);

  // ---------------- Category index (data-driven, from the live catalog) ------
  // Every "is this category empty?" decision below reads from this map. Nothing
  // about the empty categories is hardcoded: load a necklace into Shopify and
  // the next build indexes /shop/necklaces and puts it back in the sitemap with
  // no code change.
  const productsByCategory = new Map<string, any[]>();
  for (const product of shopifyProducts) {
    const cat = deriveCategory(product);
    if (!productsByCategory.has(cat)) productsByCategory.set(cat, []);
    productsByCategory.get(cat)!.push(product);
  }
  console.log(
    `📊 Live catalog by category: ${
      [...productsByCategory.entries()].map(([c, l]) => `${c}=${l.length}`).join(', ') || '(none)'
    }`
  );

  /**
   * Minimal, crawlable product card. Emits a real <a href="/product/{handle}">
   * carrying the product name and price so category pages pass link equity to
   * product pages without relying on the sitemap or on JS execution.
   */
  const renderProductCards = (list: any[]): string =>
    list
      .map((p) => {
        const img = p.images?.edges?.[0]?.node?.url || `${SITE_URL}/logo.png`;
        const price = p.priceRange?.minVariantPrice?.amount || '0';
        return `
        <article class="product-card" data-id="${p.handle || p.id}">
          <a href="/product/${p.handle}">
            <img src="${shopifyImage(img, 600)}" alt="${escapeHtml(p.title)}" width="600" height="600" loading="lazy" decoding="async" />
            <h3>${escapeHtml(p.title)}</h3>
            <p class="price">₹${Math.round(parseFloat(price))}</p>
          </a>
        </article>
      `;
      })
      .join('\n');

  // ---------------- ROUTE 2: Shop Catalog (/shop) ----------------
  const productCardsHtml = renderProductCards(shopifyProducts);

  // Derived from the live catalog, never hardcoded: the meta description
  // previously advertised "from ₹499" long after the cheapest SKU had been
  // repriced to ₹599, promising a price that did not exist.
  const lowestPrice = lowestPriceForHome;

  routes.push({
    path: 'shop',
    title: 'Anti-Tarnish Jewellery Online India | AVIRENA',
    description: `Shop anti-tarnish gold-tone brass jewellery for daily wear. Nickel-free, skin-safe${
      lowestPrice ? `, from ₹${lowestPrice}` : ''
    }. Free delivery on all orders and 7-day exchanges across India.`,
    canonical: `${SITE_URL}/shop`,
    ogImage: shopifyProducts[0]?.images?.edges?.[0]?.node?.url || `${SITE_URL}/logo.png`,
    ogType: 'website',
    keywords: 'anti tarnish jewellery india, brass jewellery online, dailywear jewellery, gold tone earrings, nickel free jewellery, office wear jewellery',
    jsonLd: [
      ...getGlobalSchema(),
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'All Dailywear Jewelry Collection | AVIRENA',
        url: `${SITE_URL}/shop`,
        description:
          'Curated dailywear jewelry collection featuring sculptural earrings, rings, necklaces, and bracelets in anti-tarnish brass.',
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: SITE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Shop All Jewelry',
            item: `${SITE_URL}/shop`,
          },
        ],
      },
    ],
    htmlContent: `
      <main class="shop-catalog-page">
        <header>
          <h1>All Jewelry Collection</h1>
          <p>Modern jewelry designed in-house. Crafted with durable anti-tarnish brass.</p>
        </header>
        <section class="products-grid">
          ${productCardsHtml}
        </section>
      </main>
    `,
  });
  addSitemapUrl(`${SITE_URL}/shop`, '0.9', 'daily');

  // ---------------- CATEGORY ROUTES (/shop/:category) ----------------
  const categories = [
    { id: 'earrings', title: 'Earrings', desc: 'Sculptural molten studs, organic drop earrings, and huggies in anti-tarnish brass.' },
    { id: 'necklaces', title: 'Necklaces', desc: 'Layered architectural chains, pearl drop pendants, and statement collars.' },
    { id: 'rings', title: 'Rings', desc: 'Ergonomic statement bands, wave rings, and baroque pearl solitaire rings.' },
    { id: 'bracelets', title: 'Bracelets', desc: 'Structured cuffs, open wire bangles, and delicate linked wristwear.' },
    { id: 'brooches', title: 'Brooches', desc: 'Artisanal sculptural lapel brooches and organic drape pins.' },
  ];

  const noindexedCategories: string[] = [];

  for (const cat of categories) {
    const catProducts = productsByCategory.get(cat.id) || [];
    const isEmpty = catProducts.length === 0;
    const catImages = catProducts
      .map((p) => p.images?.edges?.[0]?.node?.url)
      .filter(Boolean) as string[];

    // An empty category page is thin content: it has an <h1> and a sentence and
    // nothing to buy. It stays reachable (nav, sitewide links, direct URL all
    // still resolve to a real 200 page) but is kept out of the index and out of
    // the sitemap until it has inventory. `follow` is deliberate: the page's own
    // links still pass equity onward.
    if (isEmpty) noindexedCategories.push(cat.id);

    routes.push({
      path: `shop/${cat.id}`,
      title: `Anti-Tarnish ${cat.title} Online India | AVIRENA`,
      description: isEmpty
        ? `${cat.title} are not in stock at AVIRENA yet. Browse our current dailywear jewelry in anti-tarnish brass.`
        : `${cat.desc} Handcrafted in premium brass with anti-tarnish protective sealing.`,
      canonical: `${SITE_URL}/shop/${cat.id}`,
      ogImage: catImages[0] || `${SITE_URL}/logo.png`,
      ogType: 'website',
      robots: isEmpty ? 'noindex, follow' : undefined,
      jsonLd: [
        ...getGlobalSchema(),
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: `${cat.title} Collection | AVIRENA`,
          url: `${SITE_URL}/shop/${cat.id}`,
          description: cat.desc,
          ...(isEmpty
            ? {}
            : {
                mainEntity: {
                  '@type': 'ItemList',
                  numberOfItems: catProducts.length,
                  itemListElement: catProducts.map((p, i) => ({
                    '@type': 'ListItem',
                    position: i + 1,
                    url: `${SITE_URL}/product/${p.handle}`,
                    name: p.title,
                  })),
                },
              }),
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: 'Shop All Jewelry', item: `${SITE_URL}/shop` },
            {
              '@type': 'ListItem',
              position: 3,
              name: cat.title,
              item: `${SITE_URL}/shop/${cat.id}`,
            },
          ],
        },
      ],
      htmlContent: `
        <main class="category-page">
          <nav aria-label="Breadcrumb">
            <a href="/">Home</a> / <a href="/shop">Shop</a> / <span>${cat.title}</span>
          </nav>
          <h1>${cat.title} Collection</h1>
          <p>${cat.desc}</p>
          ${
            isEmpty
              ? `<section class="category-empty">
            <p>No pieces in this category yet. New ${cat.title.toLowerCase()} are added as each design is released.</p>
            <a href="/shop">Browse all jewelry</a>
          </section>`
              : `<section class="products-grid">
          ${renderProductCards(catProducts)}
        </section>`
          }
        </main>
      `,
    });

    if (!isEmpty) {
      addSitemapUrl(`${SITE_URL}/shop/${cat.id}`, '0.8', 'weekly', catImages);
    }
  }

  if (noindexedCategories.length > 0) {
    console.log(
      `  ⚠ Noindexed + excluded from sitemap (zero products in the live Shopify catalog): ${noindexedCategories
        .map((c) => `/shop/${c}`)
        .join(', ')}`
    );
    console.log(
      '    These pages stay reachable and will become indexable automatically once inventory exists.'
    );
  } else {
    console.log('  ✓ Every category has live inventory — all category routes are indexable.');
  }

  // ---------------- ROUTE 3: Collections Hub (/collections) ----------------
  routes.push({
    path: 'collections',
    title: 'Signature Jewelry Design Suites | AVIRENA',
    description:
      'Explore the signature design suites of Avirena: Sculptural Brass, Baroque Pearl Editions, and Architectural Chains.',
    canonical: `${SITE_URL}/collections`,
    ogImage: `${SITE_URL}/logo.png`,
    ogType: 'website',
    jsonLd: [
      ...getGlobalSchema(),
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: SITE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Collections',
            item: `${SITE_URL}/collections`,
          },
        ],
      },
    ],
    htmlContent: `
      <main class="collections-page">
        <h1>Collections</h1>
        <p>Sculptural dailywear jewellery in anti-tarnish brass and durable alloys, grouped by the way people actually shop: by category, by occasion, and by budget. Every piece is nickel-free with surgical steel posts.</p>

        <h2>Shop by category</h2>
        <ul>
          <li><a href="/shop/earrings">Earrings</a> — studs, drops, hoops and sculptural forms in gold tone and silver tone.</li>
          <li><a href="/shop/necklaces">Necklaces</a> — chains, chokers and pendants.</li>
          <li><a href="/shop/rings">Rings</a> — sculptural bands and stacking rings.</li>
          <li><a href="/shop/bracelets">Bracelets</a> — cuffs, bangles and chain bracelets.</li>
          <li><a href="/shop/brooches">Brooches</a> — sculptural pins for scarves, lapels and knitwear.</li>
        </ul>
        <p>Categories beyond earrings are still being stocked. <a href="/shop">Browse everything available now</a>.</p>

        <h2>Curated edits &amp; occasions</h2>
        <ul>
          <li><a href="/collections/under-999"><strong>The Under ₹999 Edit</strong></a> — premium anti-tarnish dailywear jewelry under ₹999.</li>
          <li><a href="/collections/gifting-edit"><strong>The Gifting Edit</strong></a> — zero-sizing-risk earrings and timeless dailywear gifts under ₹1,000. Our <a href="/guides/jewellery-gifting-guide-india">gifting guide</a> explains what else to consider.</li>
          <li><strong>Office and everyday</strong> — understated pieces light enough to forget you have them on.</li>
          <li><strong>Festive and occasion wear</strong> — statement drops and crystal hoops that carry a saree or an evening outfit.</li>
        </ul>

        <h2>Before you choose</h2>
        <p>If you have reacted to jewellery before, or you are wondering whether brass marks skin, these answer it honestly rather than selling around it:</p>
        <ul>
          <li><a href="/guides/does-brass-jewelry-turn-skin-green">Does brass jewellery turn skin green?</a></li>
          <li><a href="/guides/jewellery-for-sensitive-skin-india">Jewellery for sensitive skin</a></li>
          <li><a href="/guides/jewelry-materials-guide">Brass vs plated vs vermeil vs solid gold</a></li>
          <li><a href="/guides/anti-tarnish-jewelry-care">Anti-tarnish care guide</a></li>
        </ul>
      </main>
    `,
  });
  addSitemapUrl(`${SITE_URL}/collections`, '0.8', 'weekly');

  // ---------------- ROUTE 3a: Under ₹999 Edit (/collections/under-999) ----------------
  const under999Products = shopifyProducts.filter((p: any) => {
    const price = parseFloat(p.priceRange?.minVariantPrice?.amount || '0');
    return price <= 999;
  });
  const under999Images = under999Products
    .map((p) => p.images?.edges?.[0]?.node?.url)
    .filter(Boolean) as string[];

  routes.push({
    path: 'collections/under-999',
    title: 'Anti-Tarnish Jewellery Under ₹999 | Affordable Dailywear | AVIRENA',
    description:
      'Shop luxury anti-tarnish dailywear jewellery under ₹999. Waterproof, nickel-free brass earrings, rings, and pendants handcrafted for sensitive skin. Free delivery across India.',
    canonical: `${SITE_URL}/collections/under-999`,
    ogImage: under999Images[0] || `${SITE_URL}/logo.png`,
    ogType: 'website',
    keywords: 'anti tarnish jewellery under 1000, jewellery under 999, affordable brass jewellery, daily wear earrings under 1000, waterproof jewellery india',
    jsonLd: [
      ...getGlobalSchema(),
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'The Under ₹999 Anti-Tarnish Edit | AVIRENA',
        url: `${SITE_URL}/collections/under-999`,
        description:
          'Curated edit of anti-tarnish dailywear jewelry under ₹999. Handcrafted in skin-safe brass with durable anti-tarnish protective sealing.',
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: SITE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Collections',
            item: `${SITE_URL}/collections`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Under ₹999 Edit',
            item: `${SITE_URL}/collections/under-999`,
          },
        ],
      },
    ],
    htmlContent: `
      <main class="category-page">
        <nav aria-label="Breadcrumb">
          <a href="/">Home</a> / <a href="/collections">Collections</a> / <span>The Under ₹999 Edit</span>
        </nav>
        <h1>The Under ₹999 Edit</h1>
        <p>Lustrous anti-tarnish dailywear jewelry handcrafted in skin-safe brass &amp; durable alloys. Every piece under ₹999.</p>
        <section class="products-grid">
          ${renderProductCards(under999Products)}
        </section>
      </main>
    `,
  });
  addSitemapUrl(`${SITE_URL}/collections/under-999`, '0.85', 'weekly', under999Images);

  // ---------------- ROUTE 3b: The Gifting Edit (/collections/gifting-edit) ----------------
  const giftingProducts = shopifyProducts.filter((p: any) => {
    const price = parseFloat(p.priceRange?.minVariantPrice?.amount || '0');
    const title = (p.title || '').toLowerCase();
    const type = (p.productType || '').toLowerCase();
    return price <= 1200 || title.includes('earring') || type.includes('earring') || title.includes('stud') || title.includes('drop');
  });
  const giftingImages = giftingProducts
    .map((p) => p.images?.edges?.[0]?.node?.url)
    .filter(Boolean) as string[];

  routes.push({
    path: 'collections/gifting-edit',
    title: 'Jewellery Gifts Under ₹1000 | Thoughtful Everyday Gifts | AVIRENA',
    description:
      'Find the perfect jewellery gift under ₹1000 with Avirena. Sculptural earrings, pearl drops, and timeless staples with zero sizing risk. Includes luxury gift box.',
    canonical: `${SITE_URL}/collections/gifting-edit`,
    ogImage: giftingImages[0] || `${SITE_URL}/logo.png`,
    ogType: 'website',
    keywords: 'jewellery gifts under 1000, gifts for her india, daily wear jewellery gifts, earring gifts under 1000, thoughtful birthday gifts jewellery',
    jsonLd: [
      ...getGlobalSchema(),
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'The Gifting Edit: Jewellery Under ₹1000 | AVIRENA',
        url: `${SITE_URL}/collections/gifting-edit`,
        description:
          'Thoughtful jewellery gifts under ₹1000 with zero sizing risk. Earrings, pearl drops, and timeless anti-tarnish dailywear staples.',
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: SITE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Collections',
            item: `${SITE_URL}/collections`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'The Gifting Edit',
            item: `${SITE_URL}/collections/gifting-edit`,
          },
        ],
      },
    ],
    htmlContent: `
      <main class="category-page">
        <nav aria-label="Breadcrumb">
          <a href="/">Home</a> / <a href="/collections">Collections</a> / <span>The Gifting Edit</span>
        </nav>
        <h1>The Gifting Edit</h1>
        <p>Zero-sizing-risk earrings, luminous pearl drops &amp; sculpted staples. Thoughtful gifting under ₹1,000 in signature Avirena packaging.</p>
        <section class="products-grid">
          ${renderProductCards(giftingProducts)}
        </section>
      </main>
    `,
  });
  addSitemapUrl(`${SITE_URL}/collections/gifting-edit`, '0.85', 'weekly', giftingImages);

  // ---------------- ROUTE 4: About Page (/about) ----------------
  routes.push({
    path: 'about',
    title: 'About Avirena | Homegrown Dailywear Craftsmanship',
    description:
      'Learn about Avirena Jewels, our homegrown Indian artisans, anti-tarnish metal crafting, and our dailywear jewelry philosophy.',
    canonical: `${SITE_URL}/about`,
    ogImage: `${SITE_URL}/logo.png`,
    ogType: 'website',
    jsonLd: [
      ...getGlobalSchema(),
      {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: 'About AVIRENA',
        url: `${SITE_URL}/about`,
        description: 'Homegrown dailywear jewelry crafted in durable anti-tarnish brass.',
      },
    ],
    htmlContent: `
      <main class="about-page">
        <h1>Our Story &amp; Philosophy</h1>
        <p>Avirena Jewels is a homegrown Indian jewellery label based in Mumbai, making sculptural pieces for everyday wear. We began in 2020, hand-assembling jewellery at a kitchen table during lockdown, and we still design for the same thing we did then: pieces substantial enough to feel considered, priced so you can actually wear them on an ordinary Tuesday.</p>

        <h2>What we make, stated plainly</h2>
        <p>Our jewellery is made from high-grade brass and durable alloys, finished with a protective anti-tarnish coating in gold tone, silver tone and rose gold tone. Every piece is nickel-free, lead-free and cadmium-free, and every earring post is surgical steel, so the pieces suit sensitive skin.</p>
        <p>This is fashion jewellery. It is not solid gold, not gold vermeil and not sterling silver, and it is not hallmarked to any precious-metal standard. We say so on every product page, because a shopper deciding between a ₹699 pair of earrings and a ₹30,000 one deserves to know exactly which they are looking at. Where we use pearls they are cultured freshwater pearls, and where a piece has a stone it is faceted glass, not a diamond.</p>

        <h2>Why brass</h2>
        <p>Brass has the density and edge definition that make a sculptural shape read properly. Thin, hollow alternatives lose the line. Brass holds it. The protective coating is what keeps the finish stable through daily wear, and it is a finish, so it wears with time and use rather than lasting forever. Careful habits extend it meaningfully; nothing makes it permanent, and we would rather tell you that than promise otherwise.</p>

        <h2>Who we are</h2>
        <p>Avirena Jewels is a sole proprietorship operating online from Mumbai. We do not have a walk-in store. Orders ship tracked across India with free delivery, and unworn pieces can be exchanged within 7 days in their original packaging. If something is wrong with an order, one person reads that email and replies.</p>

        <h2>Honest answers, not marketing</h2>
        <p>We publish guides on the questions people actually ask before buying brass jewellery, including whether it can turn skin green. It can, for some people, in some conditions, and our guide explains the chemistry and how to avoid it rather than dodging the question. You can read those in our jewellery guides.</p>

        <nav aria-label="Related pages">
          <a href="/shop">Shop all jewellery</a> ·
          <a href="/guides">Jewellery guides</a> ·
          <a href="/guides/jewelry-materials-guide">Brass vs plated vs vermeil vs solid gold</a> ·
          <a href="/policies">Policies</a> ·
          <a href="/contact">Contact us</a>
        </nav>
      </main>
    `,
  });
  addSitemapUrl(`${SITE_URL}/about`, '0.7', 'monthly');

  // ---------------- ROUTE 5: Contact Page (/contact) ----------------
  routes.push({
    path: 'contact',
    title: 'Contact Avirena | Support & Order Help',
    description:
      'Contact Avirena Jewels for order help, exchanges, ring sizing and product questions. Email or WhatsApp +91 78238 89290, replies in 1-2 business days.',
    canonical: `${SITE_URL}/contact`,
    ogImage: `${SITE_URL}/logo.png`,
    ogType: 'website',
    jsonLd: [
      ...getGlobalSchema(),
      {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: 'Contact Avirena Jewels',
        url: `${SITE_URL}/contact`,
      },
    ],
    htmlContent: `
      <main class="contact-page">
        <h1>Contact Us</h1>
        <p>One person reads this inbox and replies. If something is wrong with an order, say so directly and we will sort it out.</p>

        <h2>How to reach us</h2>
        <ul>
          <li><strong>Email:</strong> <a href="mailto:avirenajewels@gmail.com">avirenajewels@gmail.com</a></li>
          <li><strong>WhatsApp / Phone:</strong> <a href="https://wa.me/917823889290">+91 78238 89290</a></li>
          <li><strong>Hours:</strong> Monday to Saturday, 10:00 AM - 7:00 PM IST. Closed Sunday.</li>
          <li><strong>Response time:</strong> 1-2 business days.</li>
        </ul>
        <p>Avirena Jewels is an online-only business based in Mumbai, Maharashtra. We do not operate a walk-in store.</p>

        <h2>What to include</h2>
        <p>For anything about an existing order, please include your order number. For a size or fit question, tell us which piece you are looking at and we will give you a straight answer rather than a sales pitch.</p>

        <h2>Questions we can usually answer faster than email</h2>
        <ul>
          <li><a href="/guides/ring-size-guide">How do I measure my ring size at home?</a></li>
          <li><a href="/guides/does-brass-jewelry-turn-skin-green">Does brass jewellery turn skin green?</a></li>
          <li><a href="/guides/jewellery-for-sensitive-skin-india">Is this suitable for sensitive skin?</a></li>
          <li><a href="/guides/anti-tarnish-jewelry-care">How do I care for anti-tarnish jewellery?</a></li>
          <li><a href="/policies">Shipping, returns and exchange policy</a></li>
        </ul>

        <h2>Returns and exchanges</h2>
        <p>Unworn pieces can be exchanged within 7 days of delivery in their original packaging. Email us with your order number and the reason, and we will arrange a courier pickup from your address. Full terms are on our <a href="/policies">policies page</a>.</p>
      </main>
    `,
  });
  addSitemapUrl(`${SITE_URL}/contact`, '0.6', 'monthly');

  // ---------------- ROUTE 6: FAQ Page (/faq) ----------------
  routes.push({
    path: 'faq',
    title: 'FAQs, Sizing Guide & Jewelry Care | AVIRENA',
    description:
      'Frequently asked questions regarding anti-tarnish brass care, hypoallergenic alloys, ring sizing conversions, and natural baroque pearl preservation.',
    canonical: `${SITE_URL}/faq`,
    ogImage: `${SITE_URL}/logo.png`,
    ogType: 'website',
    jsonLd: [
      ...getGlobalSchema(),
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          // Answers are pulled from src/data/guides.ts rather than restated here,
          // so the FAQ schema, the guide pages and the client-side schema can
          // never disagree. Each is written direct-answer-first and long enough
          // to stand alone as an extracted passage.
          ...guideFaqEntries([
            ['ring-size-guide', 'How do I measure my ring size at home?'],
            ['anti-tarnish-jewelry-care', 'How should I clean anti-tarnish brass jewelry?'],
            ['does-brass-jewelry-turn-skin-green', 'Does brass jewelry turn your skin green?'],
            ['does-brass-jewelry-turn-skin-green', 'Is brass jewelry safe for sensitive skin?'],
            [
              'jewelry-materials-guide',
              'What are Avirena pieces actually made of?',
            ],
          ]),
        ],
      },
    ],
    htmlContent: `
      <main class="faq-page">
        <h1>Frequently Asked Questions & Care Guide</h1>
        <p>Answers to common questions about materials, ring sizing, care, and express delivery.</p>
        <nav aria-label="In-depth guides">
          <h2>In-Depth Guides</h2>
          <ul>
            ${GUIDES.map(
              (g) => `<li><a href="/guides/${g.slug}">${escapeHtml(g.heading)}</a></li>`
            ).join('')}
          </ul>
        </nav>
      </main>
    `,
  });
  addSitemapUrl(`${SITE_URL}/faq`, '0.6', 'monthly');

  // ---------------- DEDICATED POLICY ROUTES ----------------
  
  // 1. Privacy Policy (/privacy-policy)
  routes.push({
    path: 'privacy-policy',
    title: 'Privacy Policy | AVIRENA Jewels',
    description:
      'Official Privacy Policy of Avirena Jewels. Transparent data protection, PCI-DSS certified payment encryption, zero third-party data broker sales, and client privacy rights.',
    canonical: `${SITE_URL}/privacy-policy`,
    ogImage: `${SITE_URL}/logo.png`,
    ogType: 'website',
    jsonLd: [
      ...getGlobalSchema(),
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Privacy Policy', item: `${SITE_URL}/privacy-policy` },
        ],
      },
    ],
    htmlContent: `
      <main class="policies-page">
        <nav aria-label="Breadcrumb">
          <a href="/">Home</a> / <span>Privacy Policy</span>
        </nav>
        <h1>Privacy Policy</h1>
        <p><strong>Last Updated: September 2026</strong></p>
        <p>Avirena Jewels ("we", "our", or "us") is dedicated to safeguarding your personal data and ensuring transparent privacy practices in compliance with global data privacy regulations (including GDPR, CCPA, and the Indian Digital Personal Data Protection Act).</p>

        <h2>1. Information We Collect</h2>
        <ul>
          <li><strong>Personal Information:</strong> Name, billing address, shipping address, email address, and telephone number provided during checkout or account creation.</li>
          <li><strong>Payment Data:</strong> All credit card, UPI, Apple Pay, and digital wallet transactions are encrypted via 256-bit SSL protocols directly through our PCI-DSS Tier 1 certified payment gateway partners (Shopify Payments / Stripe / Razorpay). Avirena never stores complete credit card numbers or security CVV codes.</li>
          <li><strong>Device &amp; Analytics Information:</strong> IP address, browser type, geographic region, and browsing behavior to optimize page performance and prevent fraudulent transactions.</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <ul>
          <li>To process, fulfill, and provide real-time updates for your jewelry orders.</li>
          <li>To communicate customer concierge support, custom sizing consultations, and order confirmations.</li>
          <li>To send optional private atelier lookbooks and editorial releases (you may unsubscribe at any time).</li>
          <li>To detect and prevent fraudulent transactions and unauthorized access.</li>
        </ul>

        <h2>3. Sharing with Third Parties</h2>
        <ul>
          <li>We do NOT sell, rent, or trade your personal information to third-party advertising brokers.</li>
          <li>Information is shared strictly with essential service providers: express logistics carriers (Bluedart, Delhivery, DTDC, DHL) and secure payment processors.</li>
        </ul>

        <h2>4. Your Rights &amp; Data Deletion</h2>
        <p>You hold the right to access, rectify, or request permanent deletion of your personal records at any time by emailing <a href="mailto:avirenajewels@gmail.com">avirenajewels@gmail.com</a>.</p>

        <nav aria-label="Related policies">
          <a href="/refund-policy">Return &amp; Refund Policy</a> ·
          <a href="/shipping-policy">Shipping Policy</a> ·
          <a href="/terms-of-service">Terms of Service</a> ·
          <a href="/legal-notice">Legal Notice</a>
        </nav>
      </main>
    `,
  });
  addSitemapUrl(`${SITE_URL}/privacy-policy`, '0.6', 'monthly');

  // 2. Return & Refund Policy (/refund-policy)
  routes.push({
    path: 'refund-policy',
    title: 'Return and Refund Policy (7-Day Exchanges) | AVIRENA Jewels',
    description:
      'Avirena Jewels 7-day return and exchange policy. Easy doorstep courier pickup across India, zero-fee transit defect replacements, and prompt refunds.',
    canonical: `${SITE_URL}/refund-policy`,
    ogImage: `${SITE_URL}/logo.png`,
    ogType: 'website',
    jsonLd: [
      ...getGlobalSchema(),
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Return and Refund Policy', item: `${SITE_URL}/refund-policy` },
        ],
      },
    ],
    htmlContent: `
      <main class="policies-page">
        <nav aria-label="Breadcrumb">
          <a href="/">Home</a> / <span>Return &amp; Refund Policy</span>
        </nav>
        <h1>Return and Refund Policy</h1>
        <p>At Avirena Jewels, we take immense pride in the craftsmanship and finish quality of our pieces. If you are not completely enamored with your selection, we offer a straightforward <strong>7-Day Return &amp; Exchange window</strong> from the date of package delivery.</p>

        <h2>1. Eligibility for Returns &amp; Exchanges</h2>
        <ul>
          <li>Items must be in their original, unworn, and unblemished condition.</li>
          <li>The piece must be returned with its original packaging.</li>
          <li>Custom bespoke commissions, personalized engravings, and gift cards are final sale unless a structural defect is verified.</li>
        </ul>

        <h2>2. How to Initiate a Return</h2>
        <ul>
          <li>Email our concierge team at <a href="mailto:avirenajewels@gmail.com">avirenajewels@gmail.com</a> or WhatsApp us at <a href="https://wa.me/917823889290">+91 78238 89290</a> with your Order ID (#AV-XXXXX) and reason for return/exchange.</li>
          <li>We will arrange a courier pickup from your address across India.</li>
        </ul>

        <h2>3. Refunds &amp; Processing</h2>
        <ul>
          <li>Once your return reaches us, we inspect it within 2 business days.</li>
          <li>Approved refunds are credited directly to your original payment method within 3–5 business days, depending on your financial institution.</li>
          <li>Alternatively, you may choose store credit for the full value with zero deduction.</li>
        </ul>

        <h2>4. Damaged or Defective Items</h2>
        <p>If an item arrives damaged during transit, please notify <a href="mailto:avirenajewels@gmail.com">avirenajewels@gmail.com</a> within 48 hours of receipt with clear photographs. We will immediately dispatch a priority replacement at zero additional charge.</p>

        <nav aria-label="Related policies">
          <a href="/shipping-policy">Shipping Policy</a> ·
          <a href="/privacy-policy">Privacy Policy</a> ·
          <a href="/terms-of-service">Terms of Service</a> ·
          <a href="/contact">Contact Concierge</a>
        </nav>
      </main>
    `,
  });
  addSitemapUrl(`${SITE_URL}/refund-policy`, '0.6', 'monthly');

  // 3. Shipping Policy (/shipping-policy)
  routes.push({
    path: 'shipping-policy',
    title: 'Shipping Policy & Express Delivery | AVIRENA Jewels',
    description:
      'Official shipping policy of Avirena Jewels. Free insured express delivery on all orders, 1-2 day dispatch, and 2-4 day doorstep arrival across India.',
    canonical: `${SITE_URL}/shipping-policy`,
    ogImage: `${SITE_URL}/logo.png`,
    ogType: 'website',
    jsonLd: [
      ...getGlobalSchema(),
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Shipping Policy', item: `${SITE_URL}/shipping-policy` },
        ],
      },
    ],
    htmlContent: `
      <main class="policies-page">
        <nav aria-label="Breadcrumb">
          <a href="/">Home</a> / <span>Shipping Policy</span>
        </nav>
        <h1>Shipping &amp; Transit Policy</h1>
        <p>Every Avirena order is carefully packaged in a presentation box for safe transit.</p>

        <h2>1. Order Processing Timelines</h2>
        <ul>
          <li><strong>In-stock pieces:</strong> Dispatched within 1-2 business days (Monday to Saturday, excluding public holidays).</li>
          <li><strong>Made-to-order pieces:</strong> Handcrafted and dispatched within 7-10 business days.</li>
        </ul>

        <h2>2. Domestic Delivery (India)</h2>
        <ul>
          <li><strong>Timeline:</strong> 2 to 4 business days via Express Tracked Courier.</li>
          <li><strong>Shipping Cost:</strong> Free Express Insured Delivery on all orders. No minimum order value required.</li>
          <li>Prepaid options and verified COD are supported nationwide.</li>
        </ul>

        <h2>3. International Delivery</h2>
        <ul>
          <li><strong>Timeline:</strong> 4 to 7 business days via International Express.</li>
          <li><strong>Shipping Cost:</strong> Calculated at checkout based on destination country and parcel weight.</li>
        </ul>

        <h2>4. 100% Transit Insurance Guarantee</h2>
        <p>Every parcel is 100% insured from our Mumbai studio until verified doorstep signature handover. If an order is delayed or misplaced in transit, contact <a href="mailto:avirenajewels@gmail.com">avirenajewels@gmail.com</a> for immediate priority resolution.</p>

        <nav aria-label="Related policies">
          <a href="/refund-policy">Return &amp; Refund Policy</a> ·
          <a href="/privacy-policy">Privacy Policy</a> ·
          <a href="/terms-of-service">Terms of Service</a> ·
          <a href="/contact">Contact Concierge</a>
        </nav>
      </main>
    `,
  });
  addSitemapUrl(`${SITE_URL}/shipping-policy`, '0.6', 'monthly');

  // 4. Terms of Service (/terms-of-service)
  routes.push({
    path: 'terms-of-service',
    title: 'Terms of Service | AVIRENA Jewels',
    description:
      'Terms of Service for Avirena Jewels. Online store terms, anti-tarnish brass jewelry material disclosures, pricing, 4-hour cancellation window, and Indian consumer protection.',
    canonical: `${SITE_URL}/terms-of-service`,
    ogImage: `${SITE_URL}/logo.png`,
    ogType: 'website',
    jsonLd: [
      ...getGlobalSchema(),
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Terms of Service', item: `${SITE_URL}/terms-of-service` },
        ],
      },
    ],
    htmlContent: `
      <main class="policies-page">
        <nav aria-label="Breadcrumb">
          <a href="/">Home</a> / <span>Terms of Service</span>
        </nav>
        <h1>Terms of Service</h1>
        <p><strong>Last Updated: September 2026</strong></p>
        <p>Welcome to the Avirena Jewels online boutique (avirenajewels.com). By visiting our website or purchasing our creations, you agree to be bound by the following terms and conditions.</p>

        <h2>1. General Conditions</h2>
        <ul>
          <li>We reserve the right to refuse service, terminate accounts, or cancel orders if fraud or violation of terms is suspected.</li>
          <li>You agree not to duplicate, resell, copy, or exploit any portion of our jewelry sculptures, design assets, or website copy without express written consent.</li>
        </ul>

        <h2>2. Products, Materials &amp; Pricing</h2>
        <ul>
          <li>All descriptions, dimensions, and material compositions (high-grade brass, durable alloys, anti-tarnish protective coatings, cultured freshwater baroque pearls) are documented with utmost accuracy. Because our pieces feature cultured baroque pearls, slight organic variations in contour and iridescence celebrate each item's uniqueness.</li>
          <li>Avirena jewelry is fashion jewelry and contains no solid gold, vermeil, or sterling silver.</li>
          <li>Prices are subject to change without prior notice. We reserve the right to correct typographical pricing errors and cancel affected orders with a full refund.</li>
        </ul>

        <h2>3. Order Acceptance &amp; Cancellations</h2>
        <ul>
          <li>Orders may be cancelled within 4 hours of placement by contacting <a href="mailto:avirenajewels@gmail.com">avirenajewels@gmail.com</a> prior to dispatch handover.</li>
        </ul>

        <h2>4. Governing Law</h2>
        <p>These Terms of Service and any separate agreements shall be governed by and construed in accordance with the laws of India, with jurisdiction in Mumbai courts.</p>

        <nav aria-label="Related policies">
          <a href="/privacy-policy">Privacy Policy</a> ·
          <a href="/refund-policy">Return &amp; Refund Policy</a> ·
          <a href="/legal-notice">Legal Notice</a>
        </nav>
      </main>
    `,
  });
  addSitemapUrl(`${SITE_URL}/terms-of-service`, '0.6', 'monthly');

  // 5. Legal Notice (/legal-notice)
  routes.push({
    path: 'legal-notice',
    title: 'Legal Notice & Business Information | AVIRENA Jewels',
    description:
      'Legal notice and company registry for Avirena Jewels, based in Mumbai, Maharashtra, India. Registered contact disclosures and grievance redressal officer details.',
    canonical: `${SITE_URL}/legal-notice`,
    ogImage: `${SITE_URL}/logo.png`,
    ogType: 'website',
    jsonLd: [
      ...getGlobalSchema(),
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Legal Notice', item: `${SITE_URL}/legal-notice` },
        ],
      },
    ],
    htmlContent: `
      <main class="policies-page">
        <nav aria-label="Breadcrumb">
          <a href="/">Home</a> / <span>Legal Notice</span>
        </nav>
        <h1>Legal Notice (Impressum)</h1>

        <h2>1. Business Information</h2>
        <ul>
          <li><strong>Trade Name:</strong> Avirena Jewels</li>
          <li><strong>Business Type:</strong> Sole Proprietorship</li>
          <li><strong>Headquarters:</strong> Mumbai, Maharashtra, India</li>
          <li><strong>Trading Model:</strong> Online-only boutique</li>
          <li><strong>Official Email:</strong> <a href="mailto:avirenajewels@gmail.com">avirenajewels@gmail.com</a></li>
          <li><strong>Support Telephone &amp; WhatsApp:</strong> <a href="https://wa.me/917823889290">+91 78238 89290</a></li>
        </ul>

        <h2>2. Grievance Redressal Officer</h2>
        <p>In accordance with the Consumer Protection (E-Commerce) Rules, 2020:</p>
        <ul>
          <li><strong>Officer:</strong> Grievance Officer, Avirena Jewels</li>
          <li><strong>Email:</strong> <a href="mailto:avirenajewels@gmail.com">avirenajewels@gmail.com</a></li>
          <li><strong>Acknowledgment:</strong> Within 48 hours of ticket receipt</li>
          <li><strong>Resolution:</strong> Within 30 days from date of receipt</li>
        </ul>

        <h2>3. Material Assurance Disclosures</h2>
        <p>Avirena jewelry is fashion jewelry crafted from high-density brass and durable alloys with protective e-coatings and surgical steel posts. It does not contain precious metals and is not hallmarked to any precious-metal fineness standard.</p>

        <nav aria-label="Related policies">
          <a href="/privacy-policy">Privacy Policy</a> ·
          <a href="/refund-policy">Return &amp; Refund Policy</a> ·
          <a href="/terms-of-service">Terms of Service</a>
        </nav>
      </main>
    `,
  });
  addSitemapUrl(`${SITE_URL}/legal-notice`, '0.6', 'monthly');

  // 6. Unified Policies Hub (/policies)
  routes.push({
    path: 'policies',
    title: 'Policies, Shipping & Returns | AVIRENA',
    description:
      'Official client policies of Avirena Jewels covering free delivery, 7-day hassle-free returns, material assurance, and customer privacy.',
    canonical: `${SITE_URL}/policies`,
    ogImage: `${SITE_URL}/logo.png`,
    ogType: 'website',
    jsonLd: [...getGlobalSchema()],
    htmlContent: `
      <main class="policies-page">
        <h1>Policies, Shipping &amp; Returns</h1>
        <p>The terms below are the ones we hold ourselves to. Dedicated policy documents are accessible below:</p>

        <ul>
          <li><a href="/refund-policy">Return &amp; Refund Policy (7-Day Exchanges)</a></li>
          <li><a href="/shipping-policy">Shipping Policy &amp; Express Delivery</a></li>
          <li><a href="/privacy-policy">Privacy Policy &amp; Data Protection</a></li>
          <li><a href="/terms-of-service">Terms of Service</a></li>
          <li><a href="/legal-notice">Legal Notice &amp; Business Information</a></li>
        </ul>

        <h2>Returns and exchanges summary</h2>
        <p>Unworn pieces can be returned or exchanged within <strong>7 days of delivery</strong>, in their original condition and packaging. Email <a href="mailto:avirenajewels@gmail.com">avirenajewels@gmail.com</a> with your order number and the reason, and we will arrange a courier pickup from your address.</p>

        <h2>Shipping summary</h2>
        <p>In-stock pieces are dispatched within 1-2 business days, Monday to Saturday excluding public holidays. Delivery within India typically takes 2-4 business days. Free delivery on all orders — no minimum required.</p>

        <h2>Privacy summary</h2>
        <p>We collect only what is needed to fulfil an order. Payments are processed by PCI-DSS certified gateways and we never store card numbers or CVV codes.</p>
      </main>
    `,
  });
  addSitemapUrl(`${SITE_URL}/policies`, '0.5', 'monthly');

  // ---------------- ROUTE 8: Journal Page (/journal) ----------------
  routes.push({
    path: 'journal',
    title: 'Journal | Styling Notes & Brand Story | AVIRENA',
    description:
      'The Avirena journal: how the brand started in 2020, why we choose brass over precious metal, and how to stack dailywear jewellery without overdoing it.',
    canonical: `${SITE_URL}/journal`,
    ogImage: `${SITE_URL}/logo.png`,
    ogType: 'website',
    jsonLd: [...getGlobalSchema()],
    htmlContent: `
      <main class="journal-page">
        <h1>Journal</h1>
        <p>Notes on how we make things, why we make them from what we do, and how to wear them. For the practical questions about materials, care and sizing, see our <a href="/guides">jewellery guides</a>.</p>

        <h2>Born in Quarantine: How a 2020 Lockdown Passion Project Built Avirena</h2>
        <p>Avirena started at a kitchen table during the 2020 lockdown, hand-assembling pieces for friends and neighbours. What people responded to was that the jewellery felt substantial and considered without the price or fragility of solid gold, and could be worn working from home, running errands, or dressing up a simple outfit. That is still what we design for.</p>

        <h2>The Brass Alloy Standard: Why We Choose Brass Over Precious Metals</h2>
        <p>The market pushes you toward two extremes: cheap metals that mark your skin after two wears, or solid gold you are afraid to wear outside. We take a third path. Brass is dense and ductile, so it holds architectural curves and crisp edges that thin hollow alternatives lose. We use lead-free and nickel-free brass, sealed with a protective anti-tarnish coating, with surgical steel posts. It is fashion jewellery and we say so plainly — no precious metal, no hallmarking claim. Our <a href="/guides/jewelry-materials-guide">materials guide</a> compares brass, plated, vermeil and solid gold honestly.</p>

        <h2>The Everyday Stacking Blueprint</h2>
        <p>An intentional ear stack starts with one anchor: a bold stud on the primary lobe. Contrast comes next — pair a high-polish dome against grooved or textured pieces so the combination reads as considered rather than cluttered. When layering necklaces, vary the chain weights rather than repeating them.</p>

        <h2>Care and Longevity</h2>
        <p>Apply perfume and lotion first and let them settle before putting jewellery on. Take pieces off before swimming, bathing and workouts. Wipe with a soft dry cloth after wear and store dry, ideally in a pouch with a silica sachet — which matters more in Indian humidity than most care advice written abroad admits. Full detail in the <a href="/guides/anti-tarnish-jewelry-care">care guide</a> and the <a href="/guides/jewellery-care-monsoon-humidity-india">monsoon guide</a>.</p>

        <nav aria-label="Related pages">
          <a href="/shop">Shop all jewellery</a> ·
          <a href="/guides">Jewellery guides</a> ·
          <a href="/about">About Avirena</a>
        </nav>
      </main>
    `,
  });
  addSitemapUrl(`${SITE_URL}/journal`, '0.7', 'weekly');


  // ---------------- ROUTE 9: Guides Hub (/guides) ----------------
  // Objection-handling and buyer-education content. These are the pages that
  // answer "does brass jewelry turn skin green", how the anti-tarnish coating
  // behaves, what brass is versus plated/vermeil/solid gold, and ring sizing —
  // the last of which previously existed only inside RingSizerModal.tsx and was
  // therefore invisible to every crawler.
  routes.push({
    path: 'guides',
    title: 'Jewelry Guides: Materials, Care & Fit | AVIRENA',
    description:
      'Honest guides to brass jewelry: whether it turns skin green, how anti-tarnish coating behaves, brass vs plated vs vermeil vs solid gold, and ring sizing.',
    canonical: `${SITE_URL}/guides`,
    ogImage: `${SITE_URL}/logo.png`,
    ogType: 'website',
    keywords:
      'brass jewelry guide, anti tarnish jewelry care, jewelry materials guide, ring size chart India, does brass turn skin green',
    jsonLd: [
      ...getGlobalSchema(),
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Jewelry Guides | AVIRENA',
        url: `${SITE_URL}/guides`,
        description:
          'Guides to jewelry materials, anti-tarnish care, and ring sizing from Avirena Jewels.',
        hasPart: GUIDES.map((g) => ({
          '@type': 'Article',
          headline: g.heading,
          url: `${SITE_URL}/guides/${g.slug}`,
          description: g.summary,
        })),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Guides', item: `${SITE_URL}/guides` },
        ],
      },
    ],
    htmlContent: `
      <main class="guides-hub-page">
        <h1>Jewelry Guides</h1>
        <p>Straight answers about what brass jewelry actually is, how a protective anti-tarnish coating behaves, and how to get the fit right.</p>
        <ul>
          ${GUIDES.map(
            (g) =>
              `<li><a href="/guides/${g.slug}"><h2>${escapeHtml(g.heading)}</h2></a><p>${escapeHtml(
                g.summary
              )}</p></li>`
          ).join('\n          ')}
        </ul>
      </main>
    `,
  });
  addSitemapUrl(`${SITE_URL}/guides`, '0.8', 'monthly');

  // ---------------- GUIDE ARTICLE ROUTES (/guides/:slug) ----------------
  for (const guide of GUIDES) {
    routes.push({
      path: `guides/${guide.slug}`,
      title: guide.metaTitle,
      description: guide.metaDescription,
      canonical: `${SITE_URL}/guides/${guide.slug}`,
      ogImage: `${SITE_URL}/logo.png`,
      ogType: 'article',
      jsonLd: [
        ...getGlobalSchema(),
        {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: guide.heading,
          // The direct answer doubles as the schema description so an engine
          // reading only the structured data still gets the answer itself.
          description: guide.directAnswer,
          url: `${SITE_URL}/guides/${guide.slug}`,
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${SITE_URL}/guides/${guide.slug}`,
          },
          author: { '@type': 'Organization', name: 'Avirena Jewels' },
          publisher: {
            '@type': 'Organization',
            name: 'Avirena Jewels',
            logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
          },
          articleSection: guide.category,
          inLanguage: 'en',
        },
        {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: guide.faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: 'Guides', item: `${SITE_URL}/guides` },
            {
              '@type': 'ListItem',
              position: 3,
              name: guide.shortTitle,
              item: `${SITE_URL}/guides/${guide.slug}`,
            },
          ],
        },
      ],
      htmlContent: renderGuideHtml(guide),
    });
    addSitemapUrl(`${SITE_URL}/guides/${guide.slug}`, '0.7', 'monthly');
  }

  // ---------------- DYNAMIC PRODUCT DETAIL PAGES (/product/:handle) ----------------
  for (const product of shopifyProducts) {
    const handle = product.handle || product.id;
    const prodImages = (product.images?.edges || []).map((e: any) => e.node.url);
    const mainImage = prodImages[0] || `${SITE_URL}/logo.png`;
    const priceAmount = parseFloat(product.priceRange?.minVariantPrice?.amount || '0');
    const currency = product.priceRange?.minVariantPrice?.currencyCode || 'INR';
    const prodTitle = product.title;
    const prodDesc = product.description || `Homegrown dailywear jewelry handcrafted in durable anti-tarnish brass by Avirena Jewels.`;

    const productJsonLd = [
      ...getGlobalSchema(),
      {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: prodTitle,
        image: prodImages,
        description: prodDesc,
        sku: handle,
        brand: {
          '@type': 'Brand',
          name: 'Avirena Jewels',
        },
        // Material disclosure, derived from the same tags that drive the
        // finish. Stated in schema because material honesty is the brand's
        // whole position: never emit a precious-metal or hallmarking claim
        // here. SeoMeta.tsx sets the same field after hydration.
        material: /\bsilver\b/i.test(`${prodTitle} ${(product.tags || []).join(' ')}`)
          ? 'Durable alloy with anti-tarnish silver-tone protective coating; nickel-free, surgical steel posts'
          : 'High-grade brass with anti-tarnish gold-tone protective coating; nickel-free, surgical steel posts',
        // Finish colour, and Google's product taxonomy code. Both are
        // recommended for merchant listings and are the cheapest remaining
        // completeness wins. "Gold-tone"/"Silver-tone" describe the finish
        // colour only — never the metal.
        color: /\bsilver\b/i.test(`${prodTitle} ${(product.tags || []).join(' ')}`)
          ? 'Silver-tone'
          : 'Gold-tone',
        category: [
          product.productType || 'Earrings',
          {
            '@type': 'CategoryCode',
            inCodeSet: 'https://www.google.com/basepages/producttype/taxonomy.en-US.txt',
            codeValue: '188', // Apparel & Accessories > Jewelry > Earrings
            name: 'Earrings',
          },
        ],
        offers: {
          '@type': 'Offer',
          url: `${SITE_URL}/product/${handle}`,
          priceCurrency: currency,
          price: priceAmount,
          priceValidUntil: '2027-12-31',
          itemCondition: 'https://schema.org/NewCondition',
          availability: product.availableForSale
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
          seller: {
            '@type': 'Organization',
            name: 'Avirena Jewels',
          },
          shippingDetails: {
            '@type': 'OfferShippingDetails',
            shippingRate: {
              '@type': 'MonetaryAmount',
              value: '0',
              currency: 'INR',
            },
            shippingDestination: {
              '@type': 'DefinedRegion',
              addressCountry: 'IN',
            },
            deliveryTime: {
              '@type': 'ShippingDeliveryTime',
              handlingTime: {
                '@type': 'QuantitativeValue',
                minValue: 0,
                maxValue: 1,
                unitCode: 'DAY',
              },
              transitTime: {
                '@type': 'QuantitativeValue',
                minValue: 2,
                maxValue: 4,
                unitCode: 'DAY',
              },
            },
          },
          hasMerchantReturnPolicy: {
            '@type': 'MerchantReturnPolicy',
            applicableCountry: ['IN', 'US', 'GB', 'EU'],
            returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
            merchantReturnDays: 7,
            returnMethod: 'https://schema.org/ReturnByMail',
            returnFees: 'https://schema.org/FreeReturn',
          },
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: SITE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Shop',
            item: `${SITE_URL}/shop`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: prodTitle,
            item: `${SITE_URL}/product/${handle}`,
          },
        ],
      },
    ];

    routes.push({
      path: `product/${handle}`,
      // Shopify titles are long and pipe-separated; buildProductTitle keeps the
      // distinctive name and a short brand suffix inside the ~60-char SERP budget.
      title: buildProductTitle(prodTitle),
      // Prefer the hand-written Shopify SEO description over truncating the
      // body copy, which ends mid-sentence in an ellipsis.
      //
      // Any price literal is STRIPPED and the live price re-appended: the
      // Shopify SEO fields were written before a repricing and four of them
      // advertised a price lower than the product now costs, which is a
      // Merchant Center violation as well as a broken promise to the shopper.
      // Prices belong in exactly one place — the catalog.
      description: buildProductMetaDescription(
        product.seo?.description,
        prodDesc,
        Math.round(priceAmount)
      ),
      canonical: `${SITE_URL}/product/${handle}`,
      ogImage: mainImage,
      ogType: 'product',
      keywords: `${prodTitle}, brass jewelry, dailywear jewelry, Avirena Jewels, ${product.productType || 'jewelry'}`,
      jsonLd: productJsonLd,
      htmlContent: `
        <main class="product-detail-page">
          <nav aria-label="Breadcrumb">
            <a href="/">Home</a> / <a href="/shop">Shop</a> / <span>${escapeHtml(prodTitle)}</span>
          </nav>
          <article itemscope itemtype="https://schema.org/Product">
            <h1 itemprop="name">${escapeHtml(prodTitle)}</h1>
            <div class="product-gallery">
              ${prodImages
                .map((src: string, i: number) => {
                  // Alt text differentiates each gallery image. Shopify's own
                  // altText is empty on these uploads, and repeating the product
                  // name five times tells a screen reader (and Google Images)
                  // nothing about which view it is looking at.
                  const alt = escapeHtml(
                    `${prodTitle}${GALLERY_ALT_SUFFIX[i] || ` — view ${i + 1}`}`
                  );
                  // First gallery image is the LCP candidate on /product/*: eager +
                  // high priority. Everything after it is lazy.
                  return i === 0
                    ? `<img src="${shopifyImage(src, 1000)}" alt="${alt}" itemprop="image" width="1000" height="1250" loading="eager" fetchpriority="high" decoding="sync" />`
                    : `<img src="${shopifyImage(src, 600)}" alt="${alt}" itemprop="image" width="600" height="750" loading="lazy" decoding="async" />`;
                })
                .join('')}
            </div>
            <div class="product-info">
              <p class="price">₹${Math.round(priceAmount)}</p>
              <div itemprop="description">${escapeHtml(prodDesc)}</div>
            </div>
          </article>
          ${renderRelatedProducts(shopifyProducts, handle)}
        </main>
      `,
    });

    addSitemapUrl(`${SITE_URL}/product/${handle}`, '0.9', 'weekly', prodImages);
  }

  // ---------------- 5. Write Pre-rendered HTML Files into dist/ ----------------
  console.log(`🔨 Generating static pre-rendered HTML files for ${routes.length} routes...`);

  for (const route of routes) {
    const renderedHtml = renderPageHtml(indexHtmlTemplate, route);
    const targetDir = route.path ? path.join(distDir, route.path) : distDir;

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const targetFile = path.join(targetDir, 'index.html');
    fs.writeFileSync(targetFile, renderedHtml, 'utf-8');
    console.log(`  ✓ Generated: /${route.path || 'index.html'}`);
  }

  // ---------------- 5b. Branded 404 page (dist/404.html) ----------------
  // Vercel serves dist/404.html for any path with no matching static file, now
  // that the catch-all rewrite is gone. Generated here (rather than committed as
  // a bare file in public/) so it inherits the same shell, hashed asset links and
  // branding as every other route, and can never be clobbered by a rebuild.
  const notFoundRoute: RouteData = {
    path: '404',
    title: 'Page Not Found | AVIRENA',
    description:
      'The page you are looking for does not exist. Browse the Avirena Jewels dailywear collection in anti-tarnish brass.',
    canonical: `${SITE_URL}/404`,
    ogImage: `${SITE_URL}/logo.png`,
    ogType: 'website',
    robots: 'noindex, follow',
    jsonLd: [...getGlobalSchema()],
    htmlContent: `
      <main class="not-found-page">
        <h1>Page Not Found</h1>
        <p>We could not find the page you were looking for. It may have been moved or removed.</p>
        <nav aria-label="Recovery Navigation">
          <a href="/">Return Home</a>
          <a href="/shop">Shop All Jewelry</a>
          <a href="/collections">Collections</a>
          <a href="/contact">Contact Concierge</a>
        </nav>
      </main>
    `,
  };

  // `robots: 'noindex, follow'` is set on the route above. The canonical is
  // stripped here because a 404 must not consolidate signals onto itself.
  const notFoundHtml = renderPageHtml(indexHtmlTemplate, notFoundRoute).replace(
    /<link\s+rel=["']canonical["'][^>]*>\s*/gi,
    ''
  );
  fs.writeFileSync(path.join(distDir, '404.html'), notFoundHtml, 'utf-8');
  console.log('  ✓ Generated: /404.html (branded, noindex, excluded from sitemap)');

  // ---------------- 6. Generate Sitemap XML ----------------
  console.log('🗺️ Generating dynamic sitemap.xml...');

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${sitemapUrls
  .map((u) => {
    let imagesXml = '';
    if (u.images && u.images.length > 0) {
      imagesXml = u.images
        .map(
          (img) => `
    <image:image>
      <image:loc>${img}</image:loc>
    </image:image>`
        )
        .join('');
    }
    return `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>${imagesXml}
  </url>`;
  })
  .join('\n')}
</urlset>
`;

  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf-8');
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf-8');
  console.log(`  ✓ Written sitemap.xml with ${sitemapUrls.length} verified URLs.`);

  // ---------------- 7. Generate robots.txt ----------------
  const robotsTxt = `# Robots.txt for Avirena Jewels (avirenajewels.com)
User-agent: *
Allow: /
Disallow: /checkout
Disallow: /cart
Disallow: /api/

User-agent: Googlebot
Allow: /

User-agent: Googlebot-Image
Allow: /

# AI Search & Answer Engine Crawlers (AEO / LLM indexing)
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

# Sitemaps & LLM Manifest
Sitemap: ${SITE_URL}/sitemap.xml
`;

  fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt, 'utf-8');
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt, 'utf-8');
  console.log('  ✓ Written robots.txt.');

  console.log('🎉 Prerender and GSC optimization build completed successfully!');
}

main().catch((err) => {
  console.error('❌ Prerender script encountered an error:', err);
  process.exit(1);
});
