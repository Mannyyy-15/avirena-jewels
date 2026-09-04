import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const publicDir = path.join(rootDir, 'public');

// Shopify Configuration
const SHOPIFY_STORE_DOMAIN = process.env.VITE_SHOPIFY_STORE_DOMAIN || 'm5yhxq-gb.myshopify.com';
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = process.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || 'db9c487f9b1aaafdc4f81665bbabcf07';
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
}

// 1. Fetch live products from Shopify
async function fetchShopifyProducts(): Promise<any[]> {
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
        telephone: '+91-98200-12345',
        contactType: 'customer service',
        availableLanguage: ['English', 'Hindi', 'Italian'],
        areaServed: ['IN', 'US', 'GB', 'EU'],
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'JewelryStore',
      name: 'Studio Avirena Atelier',
      image: `${SITE_URL}/logo.png`,
      '@id': `${SITE_URL}/#store`,
      url: SITE_URL,
      telephone: '+91-98200-12345',
      priceRange: '₹₹',
      currenciesAccepted: 'INR, EUR, USD, GBP',
      paymentAccepted: 'Credit Card, Apple Pay, Google Pay, UPI, Net Banking, Cash on Delivery',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Heritage Craft Enclave, Bandra West',
        addressLocality: 'Mumbai',
        addressRegion: 'MH',
        postalCode: '400050',
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 19.0596,
        longitude: 72.8295,
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

// 3. Build HTML Template with Injected Meta Tags & Prerendered Content
function renderPageHtml(template: string, route: RouteData): string {
  let html = template;

  // Replace <title>
  html = html.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(route.title)}</title>`);

  // Meta Tags String
  const metaTags = `
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

  // Inject Meta Tags before </head>
  html = html.replace('</head>', `${metaTags}\n  </head>`);

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
    canonical: `${SITE_URL}/`,
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
      </main>
    `,
  });
  addSitemapUrl(`${SITE_URL}/`, '1.0', 'daily', [`${SITE_URL}/logo.png`]);

  // ---------------- ROUTE 2: Shop Catalog (/shop) ----------------
  const productCardsHtml = shopifyProducts
    .map((p) => {
      const img = p.images?.edges?.[0]?.node?.url || `${SITE_URL}/logo.png`;
      const price = p.priceRange?.minVariantPrice?.amount || '0';
      const currency = p.priceRange?.minVariantPrice?.currencyCode || 'INR';
      return `
        <article class="product-card" data-id="${p.handle || p.id}">
          <a href="/product/${p.handle}">
            <img src="${img}" alt="${escapeHtml(p.title)}" loading="lazy" />
            <h3>${escapeHtml(p.title)}</h3>
            <p class="price">₹${Math.round(parseFloat(price))}</p>
          </a>
        </article>
      `;
    })
    .join('\n');

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
            item: `${SITE_URL}/`,
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

  for (const cat of categories) {
    routes.push({
      path: `shop/${cat.id}`,
      title: `${cat.title} — Dailywear Jewelry | AVIRENA`,
      description: `${cat.desc} Handcrafted in premium brass with anti-tarnish protective sealing.`,
      canonical: `${SITE_URL}/shop/${cat.id}`,
      ogImage: `${SITE_URL}/logo.png`,
      ogType: 'website',
      jsonLd: [
        ...getGlobalSchema(),
        {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: `${cat.title} Collection | AVIRENA`,
          url: `${SITE_URL}/shop/${cat.id}`,
          description: cat.desc,
        },
      ],
      htmlContent: `
        <main class="category-page">
          <h1>${cat.title} Collection</h1>
          <p>${cat.desc}</p>
        </main>
      `,
    });
    addSitemapUrl(`${SITE_URL}/shop/${cat.id}`, '0.8', 'weekly');
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
            item: `${SITE_URL}/`,
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
          {
            '@type': 'Question',
            name: 'How do I determine my ring size accurately?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Use our ring sizing chart or measure your finger circumference in millimeters. We provide seamless size exchanges within 14 days.',
            },
          },
          {
            '@type': 'Question',
            name: 'How should I care for anti-tarnish brass jewelry?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Store your jewelry in the provided pouch, apply lotions and perfumes before wearing, and gently wipe with a dry soft cloth after use.',
            },
          },
        ],
      },
    ],
    htmlContent: `
      <main class="faq-page">
        <h1>Frequently Asked Questions & Care Guide</h1>
        <p>Answers to common questions about materials, ring sizing, care, and express delivery.</p>
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
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '38',
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
            item: `${SITE_URL}/`,
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
      title: `${prodTitle} | AVIRENA Dailywear Jewelry`,
      description: `${prodDesc.slice(0, 155)}... Handcrafted in anti-tarnish brass. Tracked express delivery & 14-day exchanges.`,
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
              ${prodImages.map((src: string) => `<img src="${src}" alt="${escapeHtml(prodTitle)}" itemprop="image" />`).join('')}
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
