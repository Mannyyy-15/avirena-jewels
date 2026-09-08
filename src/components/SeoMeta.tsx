import React, { useEffect } from 'react';
import { PageView, Product, Currency, Category } from '../types';
import { GUIDES } from '../data/guides';

/**
 * The INR amount a shopper actually pays, as a number for schema.
 *
 * Mirrors formatPrice() in src/data/products.ts exactly: live Shopify prices
 * already arrive in rupees, while legacy/local entries use a small base figure
 * that needs the 90x conversion. Schema must publish the same number the page
 * displays and the same one scripts/prerender.ts emits.
 */
const toInrAmount = (price: number): number =>
  price < 500 ? Math.round(price * 90) : Math.round(price);

interface SeoMetaProps {
  currentPage: PageView;
  selectedProduct?: Product;
  selectedCategory?: Category;
  currency: Currency;
  /** Slug of the guide being viewed, when currentPage is 'guides'. */
  activeGuideSlug?: string | null;
}

export const SeoMeta: React.FC<SeoMetaProps> = ({
  currentPage,
  selectedProduct,
  selectedCategory,
  currency,
  activeGuideSlug,
}) => {
  const activeGuide =
    currentPage === 'guides' && activeGuideSlug
      ? GUIDES.find((g) => g.slug === activeGuideSlug)
      : undefined;

  useEffect(() => {
    // Dynamic Title & Description Map
    let title = 'Avirena Jewels – Anti-Tarnish Dailywear Jewelry India';
    let description =
      'At Avirena Jewels, our mission is to create elegant, high-quality dailywear jewellery handcrafted in durable anti-tarnish brass and natural cultured pearls.';
    let canonical = 'https://avirenajewels.com';

    if (currentPage === 'collection' || currentPage === 'shop') {
      const catLabel = selectedCategory && selectedCategory !== 'all' ? `${selectedCategory.toUpperCase()} | ` : '';
      title = `${catLabel}Shop Dailywear Jewelry | AVIRENA`;
      description = `Discover our curated collection of ${selectedCategory || 'dailywear'} jewelry in premium anti-tarnish brass. Free delivery on all orders.`;
      canonical = `https://avirenajewels.com/shop${selectedCategory && selectedCategory !== 'all' ? `/${selectedCategory}` : ''}`;
    } else if (currentPage === 'collections') {
      title = 'Signature Jewelry Design Suites | AVIRENA';
      description = 'Explore the Avirena collections: sculptural brass earrings, baroque pearl pieces and architectural chains, all in anti-tarnish gold-tone brass.';
      canonical = 'https://avirenajewels.com/collections';
    } else if (currentPage === 'pdp' && selectedProduct) {
      title = `${selectedProduct.name} — ${selectedProduct.metal} | AVIRENA`;
      description = `${selectedProduct.description} Handcrafted in ${selectedProduct.metal} with anti-tarnish protective coating. Free delivery across India & 7-day easy returns.`;
      // Real product URLs are singular /product/{handle} (see scripts/prerender.ts
      // and the sitemap). shopify.ts sets id = handle for live products, so prefer
      // handle and fall back to id — the same value the router resolves by.
      canonical = `https://avirenajewels.com/product/${selectedProduct.handle || selectedProduct.id}`;
    } else if (currentPage === 'about') {
      title = 'About Avirena | Homegrown Dailywear Craftsmanship';
      description = 'Learn about Avirena Jewels, our homegrown Indian design studio, and our commitment to skin-safe anti-tarnish brass jewelry made for everyday wear.';
      canonical = 'https://avirenajewels.com/about';
    } else if (currentPage === 'contact') {
      title = 'Contact Avirena | Support & Order Help';
      description = 'Get in touch with Avirena Jewels for order assistance, ring sizing help, exchanges and product questions. Reach us on WhatsApp or by email.';
      canonical = 'https://avirenajewels.com/contact';
    } else if (currentPage === 'policies') {
      title = 'Policies, Shipping & Returns | AVIRENA';
      description = 'Avirena Jewels policies covering free delivery, 7-day exchanges, material disclosures and data privacy.';
      canonical = 'https://avirenajewels.com/policies';
    } else if (currentPage === 'privacy-policy') {
      title = 'Privacy Policy | AVIRENA Jewels';
      description = 'Read the official Avirena Jewels Privacy Policy. Information security, data protection, PCI-DSS compliant checkout, and customer privacy standards.';
      canonical = 'https://avirenajewels.com/privacy-policy';
    } else if (currentPage === 'refund-policy') {
      title = 'Return and Refund Policy (7-Day Exchanges) | AVIRENA Jewels';
      description = 'Avirena Jewels 7-day hassle-free return and exchange policy. Easy door-step courier pickup across India, zero fee replacements, and prompt refunds.';
      canonical = 'https://avirenajewels.com/refund-policy';
    } else if (currentPage === 'shipping-policy') {
      title = 'Shipping Policy & Express Delivery | AVIRENA Jewels';
      description = 'Official shipping policy of Avirena Jewels. Free delivery on all orders, 1-2 day dispatch, tracked express courier delivery across India in 2-5 days.';
      canonical = 'https://avirenajewels.com/shipping-policy';
    } else if (currentPage === 'terms-of-service') {
      title = 'Terms of Service | AVIRENA Jewels';
      description = 'Terms of Service for Avirena Jewels. E-commerce store conditions, Indian Consumer Protection Act compliance, jewelry material disclosures, and user terms.';
      canonical = 'https://avirenajewels.com/terms-of-service';
    } else if (currentPage === 'legal-notice') {
      title = 'Legal Notice & Business Information | AVIRENA Jewels';
      description = 'Avirena Jewels legal notice, registered trade details in Mumbai, Maharashtra, grievance redressal officer, and regulatory compliance disclosures.';
      canonical = 'https://avirenajewels.com/legal-notice';
    } else if (currentPage === 'guides') {
      // Must mirror scripts/prerender.ts exactly: without this branch, hydrating a
      // /guides/* page would rewrite its canonical back to the homepage.
      if (activeGuide) {
        title = activeGuide.metaTitle;
        description = activeGuide.metaDescription;
        canonical = `https://avirenajewels.com/guides/${activeGuide.slug}`;
      } else {
        title = 'Jewelry Guides: Materials, Care & Fit | AVIRENA';
        description =
          'Honest guides to brass jewelry: whether it turns skin green, how anti-tarnish coating behaves, brass vs plated vs vermeil vs solid gold, and ring sizing.';
        canonical = 'https://avirenajewels.com/guides';
      }
    } else if (currentPage === 'faq') {
      title = 'FAQs, Ring Sizing & Jewelry Care | AVIRENA';
      description = 'Frequently asked questions about gold-tone brass, ring sizing, hypoallergenic alloys, anti-tarnish protection, and daily jewelry care.';
      canonical = 'https://avirenajewels.com/faq';
    }

    // Update document head
    document.title = title;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }

    // Update OpenGraph
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', canonical);

    // Update Canonical
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', canonical);

    // Dynamic JSON-LD Structured Data Generation
    const schemas: any[] = [];

    // 1. Organization & Brand Schema
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Avirena Jewels',
      url: 'https://avirenajewels.com',
      logo: 'https://avirenajewels.com/logo.png',
      description:
        'Homegrown dailywear jewelry brand crafting sculptural pieces in durable brass with anti-tarnish protective coatings and cultured freshwater pearls.',
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
    });

    // 2. OnlineStore — must mirror scripts/prerender.ts getGlobalSchema() exactly.
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'OnlineStore',
      name: 'Avirena Jewels',
      alternateName: ['Avirena', 'AVIRENA', 'AVIRENA Jewels'],
      image: 'https://avirenajewels.com/og-banner.jpg',
      logo: 'https://avirenajewels.com/logo.png',
      '@id': 'https://avirenajewels.com/#store',
      url: 'https://avirenajewels.com',
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
    });

    // 3. WebSite & SearchAction Schema
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Avirena Jewels',
      alternateName: ['Avirena', 'AVIRENA', 'AVIRENA Jewels', 'Avira Jewels'],
      url: 'https://avirenajewels.com',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://avirenajewels.com/shop?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    });

    // 3b. Google Sitelinks SiteNavigationElement Schema
    if (currentPage === 'home') {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Avirena Site Navigation',
        itemListElement: [
          {
            '@type': 'SiteNavigationElement',
            position: 1,
            name: 'Products',
            description: 'Anti-tarnish earrings, necklaces, rings, and bracelets crafted for daily wear.',
            url: 'https://avirenajewels.com/shop',
          },
          {
            '@type': 'SiteNavigationElement',
            position: 2,
            name: 'Earrings',
            description: 'Sculptural molten studs, organic drop earrings, and crystal huggies in brass.',
            url: 'https://avirenajewels.com/shop/earrings',
          },
          {
            '@type': 'SiteNavigationElement',
            position: 3,
            name: 'Necklaces',
            description: 'Layered architectural chains, pearl drop pendants, and statement collars.',
            url: 'https://avirenajewels.com/shop/necklaces',
          },
          {
            '@type': 'SiteNavigationElement',
            position: 4,
            name: 'Rings',
            description: 'Ergonomic statement bands, wave rings, and baroque pearl solitaires.',
            url: 'https://avirenajewels.com/shop/rings',
          },
          {
            '@type': 'SiteNavigationElement',
            position: 5,
            name: 'Signature Suites',
            description: 'Curated design suites and coordinated sets for daily wear and gifting.',
            url: 'https://avirenajewels.com/collections',
          },
          {
            '@type': 'SiteNavigationElement',
            position: 6,
            name: 'About Us',
            description: 'Our homegrown Mumbai atelier, anti-tarnish metal crafting, and dailywear philosophy.',
            url: 'https://avirenajewels.com/about',
          },
        ],
      });
    }

    // 3c. Policy Breadcrumbs
    if (['privacy-policy', 'refund-policy', 'shipping-policy', 'terms-of-service', 'legal-notice', 'policies'].includes(currentPage)) {
      const policyNames: Record<string, string> = {
        'privacy-policy': 'Privacy Policy',
        'refund-policy': 'Return and Refund Policy',
        'shipping-policy': 'Shipping Policy',
        'terms-of-service': 'Terms of Service',
        'legal-notice': 'Legal Notice',
        'policies': 'Policies',
      };
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://avirenajewels.com' },
          { '@type': 'ListItem', position: 2, name: policyNames[currentPage] || 'Policies', item: canonical },
        ],
      });
    }

    // 4. Product Schema (if on PDP)
    if (currentPage === 'pdp' && selectedProduct) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: selectedProduct.name,
        image: selectedProduct.images,
        description: selectedProduct.description,
        sku: selectedProduct.handle || selectedProduct.id,
        brand: {
          '@type': 'Brand',
          name: 'Avirena Jewels',
        },
        material: selectedProduct.materials || selectedProduct.metal,
        offers: {
          '@type': 'Offer',
          url: `https://avirenajewels.com/product/${selectedProduct.handle || selectedProduct.id}`,
          priceCurrency: 'INR',
          // Must match scripts/prerender.ts, which emits the real INR amount.
          // selectedProduct.price is an internal base figure that formatPrice()
          // converts for display; assigning it raw published price 7.77 with
          // priceCurrency INR on a 699 rupee product, which is both a
          // prerender/hydration divergence and a Merchant Center violation.
          price: toInrAmount(selectedProduct.price),
          priceValidUntil: '2027-12-31',
          itemCondition: 'https://schema.org/NewCondition',
          availability: selectedProduct.inStock
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
              // The store transacts in INR; `currency` is a display toggle and
              // must not leak into schema, which has to match prerender.ts.
              currency: 'INR',
            },
            deliveryTime: {
              '@type': 'ShippingDeliveryTime',
              handlingTime: {
                '@type': 'QuantitativeValue',
                minValue: 1,
                maxValue: 2,
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
      });
    }

    // 4b. Guide Article + FAQPage Schema — mirrors what scripts/prerender.ts
    // writes for /guides/:slug, so hydration reinforces the static schema
    // instead of replacing it with homepage schema.
    if (activeGuide) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: activeGuide.heading,
        description: activeGuide.directAnswer,
        url: `https://avirenajewels.com/guides/${activeGuide.slug}`,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://avirenajewels.com/guides/${activeGuide.slug}`,
        },
        author: { '@type': 'Organization', name: 'Avirena Jewels' },
        publisher: {
          '@type': 'Organization',
          name: 'Avirena Jewels',
          logo: { '@type': 'ImageObject', url: 'https://avirenajewels.com/logo.png' },
        },
        articleSection: activeGuide.category,
        inLanguage: 'en',
      });
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: activeGuide.faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      });
    }

    // 5. FAQPage Schema (AEO Engine Optimization)
    if (currentPage === 'faq' || currentPage === 'home') {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What materials are used in Avirena dailywear jewelry?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Avirena crafts jewelry using high-density brass and durable alloys sealed with a protective anti-tarnish e-coating for everyday water resistance and long-lasting wear.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is Avirena jewelry hypoallergenic and nickel-free?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. All Avirena pieces are nickel-free, lead-free, and cadmium-free, and earring posts are surgical steel, making them suitable for sensitive skin.',
            },
          },
          {
            '@type': 'Question',
            name: 'Are Avirena baroque pearls natural?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, Avirena uses hand-selected cultured freshwater baroque pearls known for their organic luster and naturally unique contours. We never use simulated resin, plastic, or synthetic pearls.',
            },
          },
          {
            '@type': 'Question',
            name: 'What is Avirena’s shipping and returns policy?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'We offer free delivery on all orders across India. We also provide a 7-day return and size exchange window.',
            },
          },
        ],
      });
    }

    // Inject JSON-LD Script tag
    let scriptTag = document.getElementById('dynamic-jsonld-schema');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'dynamic-jsonld-schema';
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(schemas);
  }, [currentPage, selectedProduct, selectedCategory, currency, activeGuide]);

  return null;
};
