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
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 6) {
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
      legalName: 'Avirena Jewels Private Limited',
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      description:
        'Homegrown dailywear jewelry atelier crafting sculptural pieces in durable brass, anti-tarnish protective coatings, and natural cultured pearls.',
      sameAs: [
        'https://www.instagram.com/avirena.jewels',
        'https://www.facebook.com/avirenajewels',
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
      // OnlineStore, not JewelryStore/LocalBusiness: Avirena sells online and has
      // no walk-in storefront. A LocalBusiness type with a street address and geo
      // coordinates asserts a physical location customers can visit, and the
      // address previously stated here was not a real one.
      '@context': 'https://schema.org',
      '@type': 'OnlineStore',
      name: 'Avirena Jewels',
      image: `${SITE_URL}/logo.png`,
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
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Avirena Jewels',
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
const MAX_DESCRIPTION_LENGTH = 155;

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
function buildProductDescription(rawDescription: string): string {
  const body = rawDescription.replace(/\s+/g, ' ').trim();
  const suffix = ' Anti-tarnish brass. 14-day exchanges.';

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
      #root p{margin:0 0 1rem;line-height:1.65;color:rgba(65,60,35,.85)}
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
    <meta property="og:locale" content="en_US" />
    <meta property="og:locale:alternate" content="en_IN" />
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

  // ---------------- ROUTE 1: Home Page (/) ----------------
  routes.push({
    path: '',
    title: 'AVIRENA | Homegrown Dailywear Jewelry • Anti-Tarnish Brass & Baroque Pearls',
    description:
      'Explore AVIRENA Jewels. Homegrown dailywear jewelry handcrafted in durable brass, anti-tarnish protective coatings, and natural cultured pearls. Timeless beauty, uniquely yours.',
    canonical: SITE_URL,
    ogImage: `${SITE_URL}/logo.png`,
    ogType: 'website',
    keywords:
      'dailywear jewelry, anti tarnish brass jewelry, baroque pearls, sculptural rings, molten earrings, statement necklace, luxury jewelry India, aesthetic dailywear',
    jsonLd: [
      ...getGlobalSchema(),
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
          <a href="/collections">Collections</a>
          <a href="/about">About Atelier</a>
          <a href="/guides">Jewelry Guides</a>
          <a href="/contact">Concierge</a>
        </nav>
      </header>
      <main>
        <section class="hero-section">
          <h1>Timeless Beauty • Uniquely Yours</h1>
          <p>Handcrafted homegrown dailywear jewelry in durable brass, anti-tarnish protective coatings & natural pearls.</p>
          <a href="/shop" class="cta-btn">Explore Collection</a>
        </section>
        <section class="categories-section">
          <h2>Jewelry Categories</h2>
          <ul>
            <li><a href="/shop/earrings">Earrings</a></li>
            <li><a href="/shop/necklaces">Necklaces</a></li>
            <li><a href="/shop/rings">Rings</a></li>
            <li><a href="/shop/bracelets">Bracelets</a></li>
            <li><a href="/shop/brooches">Brooches</a></li>
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

  routes.push({
    path: 'shop',
    title: 'Shop All Dailywear Jewelry | AVIRENA',
    description:
      'Discover handcrafted dailywear jewelry sculpted in durable anti-tarnish brass and natural cultured baroque pearls. Complimentary express delivery across India over ₹1,999.',
    canonical: `${SITE_URL}/shop`,
    ogImage: shopifyProducts[0]?.images?.edges?.[0]?.node?.url || `${SITE_URL}/logo.png`,
    ogType: 'website',
    keywords: 'shop dailywear jewelry, brass earrings, rings, necklaces, bracelets, anti tarnish jewelry',
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
      title: `${cat.title} — Dailywear Jewelry | AVIRENA`,
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
        <h1>Signature Design Suites</h1>
        <p>Explore cohesive sculptural narratives crafted to stack harmoniously.</p>
      </main>
    `,
  });
  addSitemapUrl(`${SITE_URL}/collections`, '0.8', 'weekly');

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
        <h1>Our Story & Philosophy</h1>
        <p>Handcrafted homegrown dailywear jewelry sculpted for everyday confidence.</p>
      </main>
    `,
  });
  addSitemapUrl(`${SITE_URL}/about`, '0.7', 'monthly');

  // ---------------- ROUTE 5: Contact Page (/contact) ----------------
  routes.push({
    path: 'contact',
    title: 'Contact Concierge & Support | AVIRENA',
    description:
      'Contact Avirena concierge for order tracking, styling advice, ring sizing assistance, and gift curation.',
    canonical: `${SITE_URL}/contact`,
    ogImage: `${SITE_URL}/logo.png`,
    ogType: 'website',
    jsonLd: [
      ...getGlobalSchema(),
      {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: 'Contact AVIRENA Atelier',
        url: `${SITE_URL}/contact`,
      },
    ],
    htmlContent: `
      <main class="contact-page">
        <h1>Atelier Concierge</h1>
        <p>Connect with our jewelry specialists for styling, sizing, and order assistance.</p>
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

  // ---------------- ROUTE 7: Policies Page (/policies) ----------------
  routes.push({
    path: 'policies',
    title: 'Policies, Shipping & Returns | AVIRENA',
    description:
      'Official client policies of Avirena Jewels covering tracked courier delivery, 14-day hassle-free returns, material assurance, and customer privacy.',
    canonical: `${SITE_URL}/policies`,
    ogImage: `${SITE_URL}/logo.png`,
    ogType: 'website',
    jsonLd: [...getGlobalSchema()],
    htmlContent: `
      <main class="policies-page">
        <h1>Client Policies & Assurance</h1>
        <p>14-Day Exchanges • Tracked Express Shipping • Hypoallergenic Materials</p>
      </main>
    `,
  });
  addSitemapUrl(`${SITE_URL}/policies`, '0.5', 'monthly');

  // ---------------- ROUTE 8: Journal Page (/journal) ----------------
  routes.push({
    path: 'journal',
    title: 'Journal & Styling Lookbook | AVIRENA',
    description:
      'Explore the Avirena Journal. Dailywear jewelry styling notes, layer stacking guides, and craftsmanship chronicles.',
    canonical: `${SITE_URL}/journal`,
    ogImage: `${SITE_URL}/logo.png`,
    ogType: 'website',
    jsonLd: [...getGlobalSchema()],
    htmlContent: `
      <main class="journal-page">
        <h1>Atelier Journal & Lookbook</h1>
        <p>Discover dailywear styling notes, craftsmanship chronicles, and jewelry care tips.</p>
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
          hasMerchantReturnPolicy: {
            '@type': 'MerchantReturnPolicy',
            applicableCountry: ['IN', 'US', 'GB', 'EU'],
            returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
            merchantReturnDays: 14,
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
      description: buildProductDescription(prodDesc),
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
                .map((src: string, i: number) =>
                  // First gallery image is the LCP candidate on /product/*: eager +
                  // high priority. Everything after it is lazy.
                  i === 0
                    ? `<img src="${shopifyImage(src, 1000)}" alt="${escapeHtml(prodTitle)}" itemprop="image" width="1000" height="1250" loading="eager" fetchpriority="high" decoding="sync" />`
                    : `<img src="${shopifyImage(src, 600)}" alt="${escapeHtml(prodTitle)}" itemprop="image" width="600" height="750" loading="lazy" decoding="async" />`
                )
                .join('')}
            </div>
            <div class="product-info">
              <p class="price">₹${Math.round(priceAmount)}</p>
              <div itemprop="description">${escapeHtml(prodDesc)}</div>
            </div>
          </article>
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
