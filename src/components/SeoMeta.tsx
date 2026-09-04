import React, { useEffect } from 'react';
import { PageView, Product, Currency, Category } from '../types';
import { GUIDES } from '../data/guides';

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
    let title = 'AVIRENA | Homegrown Dailywear Jewelry • Anti-Tarnish Brass & Baroque Pearls';
    let description =
      'Explore Avirena Jewels. Homegrown premium dailywear jewelry handcrafted in durable brass, anti-tarnish protective coatings, and natural cultured pearls.';
    let canonical = 'https://avirenajewels.com';

    if (currentPage === 'collection' || currentPage === 'shop') {
      const catLabel = selectedCategory && selectedCategory !== 'all' ? `${selectedCategory.toUpperCase()} | ` : '';
      title = `${catLabel}Shop Dailywear Jewelry | AVIRENA`;
      description = `Discover our curated collection of ${selectedCategory || 'dailywear'} jewelry in premium anti-tarnish brass. Complimentary express shipping over ₹1,999.`;
      canonical = `https://avirenajewels.com/shop${selectedCategory && selectedCategory !== 'all' ? `/${selectedCategory}` : ''}`;
    } else if (currentPage === 'collections') {
      title = 'Signature Jewelry Design Suites | AVIRENA';
      description = 'Explore the signature design suites of Avirena: Sculptural Brass, Baroque Pearl Editions, and Architectural Chains.';
      canonical = 'https://avirenajewels.com/collections';
    } else if (currentPage === 'pdp' && selectedProduct) {
      title = `${selectedProduct.name} — ${selectedProduct.metal} | AVIRENA`;
      description = `${selectedProduct.description} Handcrafted in ${selectedProduct.metal} with anti-tarnish protective coating. 14-day exchanges & express delivery.`;
      // Real product URLs are singular /product/{handle} (see scripts/prerender.ts
      // and the sitemap). shopify.ts sets id = handle for live products, so prefer
      // handle and fall back to id — the same value the router resolves by.
      canonical = `https://avirenajewels.com/product/${selectedProduct.handle || selectedProduct.id}`;
    } else if (currentPage === 'about') {
      title = 'About Avirena | Homegrown Dailywear Craftsmanship';
      description = 'Learn about Avirena Jewels, our homegrown Indian design studio, and our commitment to skin-safe anti-tarnish brass jewelry made for everyday wear.';
      canonical = 'https://avirenajewels.com/about';
    } else if (currentPage === 'contact') {
      title = 'Atelier Concierge & Private Appointments | AVIRENA';
      description = 'Contact Avirena concierge for bespoke bridal commissions, custom ring sizing, and order assistance. Available via WhatsApp and email.';
      canonical = 'https://avirenajewels.com/contact';
    } else if (currentPage === 'policies') {
      title = 'Policies, Shipping & Client Assurance | AVIRENA';
      description = 'Official written policies of Avirena Jewels covering worldwide insured delivery, 14-day returns, material hallmarking, and data privacy.';
      canonical = 'https://avirenajewels.com/policies';
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
      legalName: 'Avirena Jewels Private Limited',
      url: 'https://avirenajewels.com',
      logo: 'https://avirenajewels.com/logo.png',
      description:
        'Luxury demi-fine jewelry atelier crafting sculptural pieces in durable brass, anti-tarnish protective coatings, and natural cultured pearls.',
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
    });

    // 2. LocalBusiness / JewelryStore (GEO Schema)
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'JewelryStore',
      name: 'Studio Avirena Atelier',
      image: 'https://avirenajewels.com/logo.png',
      '@id': 'https://avirenajewels.com/#store',
      url: 'https://avirenajewels.com',
      telephone: '+91-98200-12345',
      priceRange: '$$',
      currenciesAccepted: 'INR, EUR, USD, GBP',
      paymentAccepted: 'Credit Card, Apple Pay, Google Pay, UPI, Cash on Delivery',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Suite 402, Heritage Craft Enclave, Bandra West',
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
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '10:00',
          closes: '19:00',
        },
      ],
    });

    // 3. WebSite & SearchAction Schema
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Avirena Jewels',
      url: 'https://avirenajewels.com',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://avirenajewels.com/shop?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    });

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
          priceCurrency: currency,
          price: selectedProduct.price,
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
              currency: currency,
            },
            deliveryTime: {
              '@type': 'ShippingDeliveryTime',
              handlingTime: {
                '@type': 'QuantitativeValue',
                minValue: 1,
                maxValue: 2,
                unitCode: 'd',
              },
              transitTime: {
                '@type': 'QuantitativeValue',
                minValue: 2,
                maxValue: 4,
                unitCode: 'd',
              },
            },
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
              text: 'We offer complimentary express shipping on all orders over ₹1,999. We also provide a 14-day return and size exchange window.',
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
