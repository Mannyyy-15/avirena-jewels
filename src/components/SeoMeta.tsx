import React, { useEffect } from 'react';
import { PageView, Product, Currency, Category } from '../types';

interface SeoMetaProps {
  currentPage: PageView;
  selectedProduct?: Product;
  selectedCategory?: Category;
  currency: Currency;
}

export const SeoMeta: React.FC<SeoMetaProps> = ({
  currentPage,
  selectedProduct,
  selectedCategory,
  currency,
}) => {
  useEffect(() => {
    // Dynamic Title & Description Map
    let title = 'AVIRENA | Handcrafted Demi-Fine Jewelry • 18k Gold Vermeil & Baroque Pearls';
    let description =
      'Explore Avirena Jewels. Artisanal sculptural jewelry handcrafted in 3.0µ thick 18k gold vermeil, recycled 925 sterling silver, and natural freshwater baroque pearls.';
    let canonical = 'https://avirena.com';

    if (currentPage === 'collection' || currentPage === 'shop') {
      const catLabel = selectedCategory && selectedCategory !== 'all' ? `${selectedCategory.toUpperCase()} | ` : '';
      title = `${catLabel}Shop Demi-Fine Jewelry | AVIRENA`;
      description = `Discover our curated collection of ${selectedCategory || 'demi-fine'} jewelry in 18k heavy gold vermeil and recycled silver. Complimentary insured shipping over $150.`;
      canonical = `https://avirena.com/shop${selectedCategory && selectedCategory !== 'all' ? `/${selectedCategory}` : ''}`;
    } else if (currentPage === 'collections') {
      title = 'Signature Jewelry Design Suites | AVIRENA Atelier';
      description = 'Explore the signature design suites of Avirena: Molten Sculptures, Baroque Pearl Editions, and Architectural Chains.';
      canonical = 'https://avirena.com/collections';
    } else if (currentPage === 'pdp' && selectedProduct) {
      title = `${selectedProduct.name} — ${selectedProduct.metal} | AVIRENA`;
      description = `${selectedProduct.description} Handcrafted in ${selectedProduct.metal} with recycled 925 silver. 14-day returns & express delivery.`;
      canonical = `https://avirena.com/products/${selectedProduct.id}`;
    } else if (currentPage === 'about') {
      title = 'Our Heritage & Lost-Wax Craftsmanship | AVIRENA';
      description = 'Learn about Studio Avirena, our heritage lost-wax casting ateliers in Jaipur and Vicenza, and our 100% recycled precious metals commitment.';
      canonical = 'https://avirena.com/about';
    } else if (currentPage === 'contact') {
      title = 'Atelier Concierge & Private Appointments | AVIRENA';
      description = 'Contact Avirena concierge for bespoke bridal commissions, custom ring sizing, and order assistance. Available via WhatsApp and email.';
      canonical = 'https://avirena.com/contact';
    } else if (currentPage === 'policies') {
      title = 'Policies, Shipping & Client Assurance | AVIRENA';
      description = 'Official written policies of Avirena Jewels covering worldwide insured delivery, 14-day returns, material hallmarking, and data privacy.';
      canonical = 'https://avirecom/policies';
    } else if (currentPage === 'faq') {
      title = 'FAQs, Ring Sizing & Jewelry Care | AVIRENA';
      description = 'Frequently asked questions about 18k gold vermeil, ring sizing calipers, hypoallergenic silver, and natural baroque pearl care.';
      canonical = 'https://avirena.com/faq';
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
      url: 'https://avirena.com',
      logo: 'https://avirena.com/logo.png',
      description:
        'Luxury demi-fine jewelry atelier crafting sculptural pieces in 18k gold vermeil, recycled 925 sterling silver, and natural baroque pearls.',
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
      image: 'https://avirena.com/logo.png',
      '@id': 'https://avirena.com/#store',
      url: 'https://avirena.com',
      telephone: '+91-98200-12345',
      priceRange: '$$',
      currenciesAccepted: 'EUR, USD, INR, GBP',
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
      url: 'https://avirena.com',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://avirena.com/shop?q={search_term_string}',
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
        sku: selectedProduct.id,
        brand: {
          '@type': 'Brand',
          name: 'Avirena Jewels',
        },
        material: selectedProduct.materials || selectedProduct.metal,
        offers: {
          '@type': 'Offer',
          url: `https://avirena.com/products/${selectedProduct.id}`,
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
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: selectedProduct.rating || '4.9',
          reviewCount: selectedProduct.reviewsCount || '38',
        },
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
            name: 'What is 18k Gold Vermeil and how is it made?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Gold Vermeil is a premium French plating technique where an ultra-thick layer of 3.0 microns of 18k yellow gold is electroplated over a solid recycled 925 sterling silver core. It is 6 times thicker than standard flash-plated fashion jewelry and will not tarnish or discolor skin.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is Avirena jewelry hypoallergenic and nickel-free?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, 100%. All Avirena creations are strictly nickel-free, lead-free, and cadmium-free, crafted with solid 925 sterling silver and titanium-reinforced earring posts safe for sensitive skin.',
            },
          },
          {
            '@type': 'Question',
            name: 'Are Avirena baroque pearls natural?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, Avirena exclusively uses 100% natural, hand-selected freshwater baroque pearls. We never use simulated resin, plastic, or synthetic pearls.',
            },
          },
          {
            '@type': 'Question',
            name: 'What is Avirena’s shipping and returns policy?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'We offer complimentary express insured shipping on all orders worldwide over $150. We also provide a 14-day doorstep return and size exchange window.',
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
  }, [currentPage, selectedProduct, selectedCategory, currency]);

  return null;
};
