import React, { useState, useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  ShieldCheck,
  Gem,
  Package,
  ShoppingBag,
  Truck,
  RotateCcw,
  Heart,
  Check
} from 'lucide-react';
import { Product, Currency, Category } from '../types';
import { formatPrice, getCompareAtPrice, getDiscountPercentage } from '../data/products';
import { HeroBaroquePearlRing } from '../components/HeroBaroquePearlRing';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface HomePageProps {
  onSelectProduct: (product: Product) => void;
  onNavigateToCollection: (category?: Category, metal?: string) => void;
  onQuickAdd: (product: Product) => void;
  currency: Currency;
  isWishlisted: (id: string) => boolean;
  onToggleWishlist: (product: Product) => void;
  catalogProducts?: Product[];
  onNavigateToAbout?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectProduct,
  onNavigateToCollection,
  onQuickAdd,
  currency,
  isWishlisted,
  onToggleWishlist,
  catalogProducts = [],
  onNavigateToAbout,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // Gifting filter tab state
  // Gifting filter tab state
  const [activeGiftTier, setActiveGiftTier] = useState<'all' | 'daily' | 'statement' | 'pearls'>('all');

  // Live Shopify catalog only — no mock fallback. When it is empty (still
  // loading, or genuinely empty) product sections render nothing rather than
  // stock-photo placeholders.
  const safeProducts = useMemo(
    () => (Array.isArray(catalogProducts) ? catalogProducts : []),
    [catalogProducts]
  );

  // Safe image getter. Falls back to the brand logo, never to stock photography:
  // an Unsplash image here would render as this product's photograph.
  const getProductImage = (prod?: Product) => {
    if (prod && Array.isArray(prod.images) && prod.images.length > 0 && prod.images[0]) {
      return prod.images[0];
    }
    return '/logo.png';
  };

  // Featured Spotlight Product from live catalog (or fallback)
  const spotlightProduct = useMemo(() => {
    // Select first live product or piece with multiple images
    const multiImg = safeProducts.find((p) => p.images && p.images.length > 1);
    return multiImg || safeProducts[0];
  }, [safeProducts]);

  // Left side image: Last image of the product assigned in Shopify
  const leftLifestyleImage = useMemo(() => {
    if (spotlightProduct && spotlightProduct.images && spotlightProduct.images.length > 0) {
      return spotlightProduct.images[spotlightProduct.images.length - 1];
    }
    // Brand logo, not stock photography: this slot depicts the spotlight product.
    return '/logo.png';
  }, [spotlightProduct]);

  // Right side image: First image of the product assigned in Shopify
  const rightProductImage = useMemo(() => {
    if (spotlightProduct && spotlightProduct.images && spotlightProduct.images.length > 0) {
      return spotlightProduct.images[0];
    }
    // Brand logo, not stock photography: this slot depicts the spotlight product.
    return '/logo.png';
  }, [spotlightProduct]);

  // Curated pieces for "Collection" section dynamically from live catalog
  const collectionFive = useMemo(() => {
    if (!safeProducts || safeProducts.length === 0) return [];
    return safeProducts.slice(0, 5).map((p) => ({
      product: p,
      displayTitle: p.name,
    }));
  }, [safeProducts]);

  // Curated pieces for "Popular" section dynamically from live catalog
  const popularFive = useMemo(() => {
    if (!safeProducts || safeProducts.length === 0) return [];
    // Prioritize bestsellers or reverse order for curated variation
    const sorted = [...safeProducts].sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
    return sorted.slice(0, 5);
  }, [safeProducts]);

  // Curated Gold-Tone Brass pieces dynamically from live catalog
  const goldProducts = useMemo(() => {
    if (!safeProducts || safeProducts.length === 0) return [];
    return safeProducts.filter((p) => {
      if (!p || !p.id) return false;
      const m = (p.metal || '').toLowerCase();
      const n = (p.name || '').toLowerCase();
      const t = Array.isArray(p.tags) ? p.tags.join(' ').toLowerCase() : '';
      if (m.includes('silver') || /\bsilver\b/.test(n) || /\bsilver\b/.test(t)) return false;
      return true;
    });
  }, [safeProducts]);

  // Curated Silver-Tone pieces dynamically from live catalog
  const silverProducts = useMemo(() => {
    if (!safeProducts || safeProducts.length === 0) return [];
    return safeProducts.filter((p) => {
      if (!p || !p.id) return false;
      const m = (p.metal || '').toLowerCase();
      const n = (p.name || '').toLowerCase();
      const t = Array.isArray(p.tags) ? p.tags.join(' ').toLowerCase() : '';
      const hasSilverVariant = p.variants?.some((v) => /silver/i.test(v.title));
      return (
        m.includes('silver') ||
        /\bsilver\b/.test(n) ||
        /\brhodium\b/.test(n) ||
        /\bsilver\b/.test(t) ||
        hasSilverVariant
      );
    });
  }, [safeProducts]);

  // Filtered Gifting items dynamically from live catalog
  const giftingProducts = useMemo(() => {
    if (!safeProducts || safeProducts.length === 0) return [];
    const filtered = safeProducts.filter((p) => {
      if (!p || !p.id) return false;
      const text = `${p.name} ${p.subtitle || ''} ${p.description || ''} ${p.category} ${p.metal}`.toLowerCase();
      if (activeGiftTier === 'daily') {
        return text.includes('stud') || text.includes('minimal') || text.includes('hoop') || text.includes('daily') || p.price <= 2000;
      }
      if (activeGiftTier === 'statement') {
        return text.includes('statement') || text.includes('drop') || text.includes('sculpt') || text.includes('geometric') || p.isSculptural;
      }
      if (activeGiftTier === 'pearls') {
        return text.includes('pearl');
      }
      return true;
    });
    // Never return empty: if specific filter yields nothing, fallback gracefully to catalog slice
    return filtered.length > 0 ? filtered.slice(0, 4) : safeProducts.slice(0, 4);
  }, [safeProducts, activeGiftTier]);

  // Refresh ScrollTrigger geometry whenever catalog items load or tier changes
  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 120);
    return () => clearTimeout(timer);
  }, [safeProducts.length, activeGiftTier, goldProducts.length, silverProducts.length]);

  // Smoothly reveal gifting cards whenever the active tier or items change
  useEffect(() => {
    if (giftingProducts.length > 0) {
      const cards = document.querySelectorAll('.gifting-card');
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out', clearProps: 'all' }
        );
      }
    }
  }, [activeGiftTier, giftingProducts.length]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance
      gsap.from('.gsap-hero-title', {
        scale: 0.94,
        opacity: 0,
        y: 35,
        duration: 1.1,
        ease: 'power3.out',
      });

      gsap.from('.gsap-hero-sub', {
        y: 20,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        delay: 0.15,
        ease: 'power2.out',
      });

      // General scroll reveal elements
      gsap.utils.toArray<HTMLElement>('.gsap-home-reveal').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // Staggered collection cards
      gsap.from('.collection-card', {
        y: 35,
        opacity: 0,
        duration: 0.75,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.collection-grid',
          start: 'top 85%',
        },
      });

      // Staggered popular cards
      gsap.from('.popular-card', {
        y: 35,
        opacity: 0,
        duration: 0.75,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.popular-grid',
          start: 'top 85%',
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="pb-20 overflow-hidden font-sans-body w-full text-[#413C23] bg-[#E7E4D5] select-none">
      
      {/* 1. EXACT 100VH HERO SECTION */}
      <section
        ref={heroRef}
        className="relative w-full bg-[#E7E4D5] border-b border-[#D8D2C2] min-h-[calc(100vh-6rem)] sm:min-h-[calc(100vh-5rem)] h-[calc(100vh-5rem)] max-h-[1080px] flex flex-col justify-between p-6 sm:p-10 md:p-12 lg:px-16 lg:py-10 select-none overflow-hidden"
      >
        {/* Top Micro-Header */}
        <div className="gsap-hero-sub w-full flex items-center justify-between z-10 text-xs">
          <span className="text-[10px] sm:text-xs font-medium tracking-[0.25em] text-[#8F896D] uppercase">
            Timeless Beauty • Uniquely Yours
          </span>
          <button
            onClick={() => onNavigateToCollection('all')}
            className="text-[11px] sm:text-xs font-medium text-[#8F896D] hover:text-[#413C23] transition-colors cursor-pointer uppercase tracking-wider"
          >
            (all pieces — {safeProducts.length})
          </button>
        </div>

        {/* Center Stage: Large Official Logo with Floating Golden Baroque Pearl Ring Centered */}
        <div className="relative my-auto py-8 sm:py-12 md:py-16 flex items-center justify-center w-full z-10 overflow-visible px-2 sm:px-4">
          {/* Official Brand Logo */}
          <div className="gsap-hero-title w-full flex items-center justify-center select-none pointer-events-none z-0">
            {/* LCP element. WebP (91KB) is served to every modern browser with the
                320KB PNG kept only as a fallback. Intrinsic 2128x739 is declared so
                the browser reserves the correct box before the bytes land (CLS). */}
            <picture>
              <source srcSet="/logo.webp" type="image/webp" />
              <img
                src="/logo.png"
                alt="AVIRENA"
                width={2128}
                height={739}
                className="w-full max-w-[1280px] 2xl:max-w-[1440px] px-3 sm:px-6 md:px-8 lg:px-10 h-auto object-contain mix-blend-multiply select-none"
                loading="eager"
                fetchPriority="high"
                decoding="sync"
              />
            </picture>
          </div>

          {/* Floating Baroque Pearl Ring (Lowered for mobile, preserved at original placement on desktop) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-[10%] sm:-translate-y-[10%] md:-translate-y-[22%] lg:-translate-y-[28%] z-20 pointer-events-auto">
            <HeroBaroquePearlRing onClick={() => onNavigateToCollection('rings')} />
          </div>
        </div>

        {/* Bottom Hero Bar */}
        <div className="gsap-hero-sub w-full flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 sm:gap-6 z-10 pt-4 border-t border-[#D8D2C2]">
          <p className="text-xs sm:text-sm text-black font-normal max-w-md leading-relaxed">
            Homegrown premium dailywear jewels crafted in high-grade brass with durable anti-tarnish protective coating. Designed for effortless everyday elegance.
          </p>

          <button
            id="hero-shop-all-btn"
            onClick={() => onNavigateToCollection('all')}
            className="px-7 py-3.5 bg-black hover:bg-neutral-800 text-white text-xs uppercase tracking-[0.2em] font-semibold rounded-xs transition-all shadow-md flex items-center gap-2.5 cursor-pointer active:scale-98"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 2. SECTION 2: EDITORIAL CATEGORY SHOWCASE (COMMENTED OUT)
      <section className="w-full bg-[#E7E4D5] py-16 sm:py-24 border-b border-[#D8D2C2] px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="w-full space-y-8">
          <div className="py-6 sm:py-12">
            <HoverImageReveal
              items={categoryRevealItems}
              font={{
                fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                fontSize: 'clamp(3.75rem, 10vw, 8.5rem)',
                fontWeight: 300,
                lineHeight: '0.96em',
                letterSpacing: '-0.03em',
              }}
              textColor="#413C23"
              dimColor="#8F896D"
              backgroundColor="transparent"
              align="center"
              rowGap={16}
              imageWidth={360}
              imageHeight={460}
              rounded={10}
              followStrength={2.5}
              offsetX={200}
              offsetY={0}
            />
          </div>
        </div>
      </section>
      */}

      {/* 3. SECTION 3: "COLLECTION" (5 Identical Standard Cards) */}
      <section className="w-full bg-[#E7E4D5] py-16 sm:py-24 border-b border-[#D8D2C2] px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="w-full space-y-8 sm:space-y-12">
          
          {/* Section Header */}
          <div className="flex items-end justify-between border-b border-[#D8D2C2] pb-5">
            <div>
              <span className="text-xs sm:text-sm text-[#8F896D] uppercase tracking-[0.2em] font-semibold block mb-2">
                Curated Collection
              </span>
              <h2 className="font-serif-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#413C23] font-bold tracking-tight leading-[1.05] max-w-2xl">
                Designing, Crafting<br />&amp; Layering.
              </h2>
            </div>
            <button
              onClick={() => onNavigateToCollection('all')}
              className="text-xs sm:text-sm text-[#8F896D] hover:text-[#413C23] transition-colors cursor-pointer font-medium underline underline-offset-4 tracking-wide uppercase shrink-0 pb-1"
            >
              see all
            </button>
          </div>

          {/* 5-Column Uniform Product Grid */}
          <div className="collection-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5">
            {collectionFive.map(({ product, displayTitle }) => {
              if (!product || !product.id) return null;
              const imageSrc = getProductImage(product);

              return (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="collection-card group cursor-pointer flex flex-col space-y-2 text-left w-full"
                >
                  {/* Fixed Uniform Square Box Container */}
                  <div className="relative aspect-square w-full bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs flex items-center justify-center p-6 transition-all duration-300 group-hover:border-[#8F896D] group-hover:shadow-[0_8px_20px_rgba(65,60,35,0.08)] overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center">
                      <img
                        src={imageSrc}
                        alt={product.name || displayTitle}
                        referrerPolicy="no-referrer"
                        width={800}
                        height={800}
                        loading="lazy"
                        decoding="async"
                        className="max-w-full max-h-full w-auto h-auto object-contain mix-blend-multiply group-hover:scale-108 transition-transform duration-500 ease-out"
                      />
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickAdd(product);
                      }}
                      className="absolute bottom-2.5 right-2.5 p-2 bg-black hover:bg-neutral-800 text-white rounded-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-sm cursor-pointer z-10"
                      title="Quick Add"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Meta Box with Prominent Bold Price & Discount Badge */}
                  <div className="flex flex-col justify-between pt-1">
                    <h4 className="font-serif-display text-base sm:text-lg md:text-xl text-black group-hover:text-neutral-700 transition-colors font-medium sm:font-semibold leading-snug truncate block">
                      {displayTitle}
                    </h4>
                    {(() => {
                      const comparePrice = getCompareAtPrice(product.price || 0, product.originalPrice);
                      const discount = getDiscountPercentage(product.price || 0, comparePrice);
                      return (
                        <div className="flex items-baseline gap-2 mt-0.5 flex-wrap">
                          <span className="text-base sm:text-lg md:text-xl font-bold text-black tracking-tight">
                            {formatPrice(product.price || 0, currency)}
                          </span>
                          {comparePrice > (product.price || 0) && (
                            <>
                              <span className="text-xs text-[#DC2626] line-through font-normal">
                                {formatPrice(comparePrice, currency)}
                              </span>
                              <span className="text-[10px] font-bold text-[#15803D] bg-[#15803D]/10 border border-[#15803D]/20 px-1.5 py-0.2 rounded-2xs uppercase tracking-wider">
                                {discount}% OFF
                              </span>
                            </>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. SECTION 4: "POPULAR / BESTSELLERS" (5-Column Grid + Wide Campaign Model Banner) */}
      <section className="w-full bg-[#E7E4D5] py-16 sm:py-24 border-b border-[#D8D2C2] px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="w-full space-y-8 sm:space-y-12">
          
          {/* Section Header */}
          <div className="flex items-end justify-between border-b border-[#D8D2C2] pb-5">
            <div>
              <span className="text-xs sm:text-sm text-[#8F896D] uppercase tracking-[0.2em] font-semibold block mb-2">
                Bestsellers
              </span>
              <h2 className="font-serif-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#413C23] font-bold tracking-tight leading-[1.05] max-w-2xl">
                Styling, Loving<br />&amp; Living In.
              </h2>
            </div>
            <button
              onClick={() => onNavigateToCollection('all')}
              className="text-xs sm:text-sm text-[#8F896D] hover:text-[#413C23] transition-colors cursor-pointer font-medium underline underline-offset-4 tracking-wide uppercase shrink-0 pb-1"
            >
              see all
            </button>
          </div>

          {/* Wide Dramatic Model Banner */}
          <div className="gsap-home-reveal w-full h-64 sm:h-80 md:h-96 lg:h-[460px] xl:h-[500px] rounded-xs overflow-hidden border border-[#D8D2C2] relative bg-[#413C23] shadow-xs">
            <img
              src="/assets/editorial/bestsellers-campaign-banner.jpg"
              alt="Avirena Sculptural Jewelry Campaign"
              width={2000}
              height={1000}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#413C23]/40 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* 5-Column Uniform Product Grid */}
          <div className="popular-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5">
            {popularFive.map((product) => {
              if (!product || !product.id) return null;
              const imageSrc = getProductImage(product);

              return (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="popular-card group cursor-pointer flex flex-col space-y-2 text-left w-full"
                >
                  {/* Fixed Uniform Square Box Container */}
                  <div className="relative aspect-square w-full bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs flex items-center justify-center p-6 transition-all duration-300 group-hover:border-[#8F896D] group-hover:shadow-[0_8px_20px_rgba(65,60,35,0.08)] overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center">
                      <img
                        src={imageSrc}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        width={800}
                        height={800}
                        loading="lazy"
                        decoding="async"
                        className="max-w-full max-h-full w-auto h-auto object-contain mix-blend-multiply group-hover:scale-108 transition-transform duration-500 ease-out"
                      />
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickAdd(product);
                      }}
                      className="absolute bottom-2.5 right-2.5 p-2 bg-black hover:bg-neutral-800 text-white rounded-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-sm cursor-pointer z-10"
                      title="Quick Add"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Meta Box with Prominent Bold Price & Discount Badge */}
                  <div className="flex flex-col justify-between pt-1">
                    <h4 className="font-serif-display text-base sm:text-lg md:text-xl text-black group-hover:text-neutral-700 transition-colors font-medium sm:font-semibold leading-snug truncate block">
                      {product.name}
                    </h4>
                    {(() => {
                      const comparePrice = getCompareAtPrice(product.price || 0, product.originalPrice);
                      const discount = getDiscountPercentage(product.price || 0, comparePrice);
                      return (
                        <div className="flex items-baseline gap-2 mt-0.5 flex-wrap">
                          <span className="text-base sm:text-lg md:text-xl font-bold text-black tracking-tight">
                            {formatPrice(product.price || 0, currency)}
                          </span>
                          {comparePrice > (product.price || 0) && (
                            <>
                              <span className="text-xs text-[#DC2626] line-through font-normal">
                                {formatPrice(comparePrice, currency)}
                              </span>
                              <span className="text-[10px] font-bold text-[#15803D] bg-[#15803D]/10 border border-[#15803D]/20 px-1.5 py-0.2 rounded-2xs uppercase tracking-wider">
                                {discount}% OFF
                              </span>
                            </>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 5. SECTION 5: THE GOLD TONE EDIT (Curated 18K Gold-Tone Brass Showcase) */}
      <section className="w-full bg-[#E7E4D5] py-16 sm:py-24 border-b border-[#D8D2C2] px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 select-none">
        <div className="w-full space-y-8 sm:space-y-12">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#D8D2C2] pb-5 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C6A664] border border-[#A68846]/40 shadow-xs" />
                <span className="text-xs sm:text-sm text-[#8F896D] uppercase tracking-[0.2em] font-semibold">
                  The Gold Tone Edit • Warm Luster
                </span>
              </div>
              <h2 className="font-serif-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#413C23] font-bold tracking-tight leading-[1.05] max-w-2xl">
                Gilded Warmth &amp;<br />Sculptural Brass.
              </h2>
            </div>
            <div className="flex flex-col sm:items-end gap-2 shrink-0">
              <p className="text-xs sm:text-[13px] text-[#413C23]/80 font-normal max-w-xs sm:text-right leading-relaxed">
                Rich sunlit tones in heavy brass with durable anti-tarnish protective sealing.
              </p>
              <button
                onClick={() => onNavigateToCollection('all', 'brass')}
                className="text-xs sm:text-sm text-[#8F896D] hover:text-[#413C23] transition-colors cursor-pointer font-medium underline underline-offset-4 tracking-wide uppercase pt-1"
              >
                see all gold ({goldProducts.length})
              </button>
            </div>
          </div>

          {/* Gold Edit Wide Campaign Banner */}
          <div className="gsap-home-reveal w-full h-64 sm:h-80 md:h-96 lg:h-[460px] xl:h-[500px] rounded-xs overflow-hidden border border-[#D8D2C2] relative bg-[#413C23] shadow-xs">
            <img
              src="/assets/editorial/gold-edit-campaign-banner.jpg"
              alt="Avirena Gold-Tone Brass Campaign"
              width={2000}
              height={1000}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#413C23]/35 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Gold Product Grid (4 curated pieces) */}
          <div className="gold-grid grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {goldProducts.length === 0 ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={`gold-skeleton-${idx}`}
                  className="flex flex-col justify-between bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs overflow-hidden animate-pulse p-4"
                >
                  <div className="aspect-square w-full bg-[#E7E4D5] rounded-xs mb-3" />
                  <div className="h-4 bg-[#E7E4D5] rounded w-3/4 mb-2" />
                  <div className="h-3 bg-[#E7E4D5] rounded w-1/3" />
                </div>
              ))
            ) : (
              goldProducts.slice(0, 4).map((product) => {
                if (!product || !product.id) return null;
                const imageSrc = getProductImage(product);
                const wishlisted = isWishlisted(product.id);

                return (
                  <div
                    key={product.id}
                    onClick={() => onSelectProduct(product)}
                    className="gold-card group cursor-pointer flex flex-col justify-between bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs p-3.5 sm:p-5 transition-all duration-300 hover:border-[#8F896D] hover:shadow-[0_10px_25px_rgba(65,60,35,0.08)] relative text-left"
                  >
                    {/* Top Bar: Metal Finish Badge & Wishlist Heart */}
                    <div className="flex items-center justify-between w-full z-10">
                      <span className="text-[10px] sm:text-[11px] font-semibold text-[#413C23] bg-[#E7E4D5] px-2 py-0.5 rounded-xs border border-[#D8D2C2] uppercase tracking-wider">
                        Gold-Tone Brass
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWishlist(product);
                        }}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                          wishlisted
                            ? 'bg-[#413C23] text-white opacity-100 shadow-xs'
                            : 'bg-[#FAF8F5]/90 text-[#413C23] opacity-80 sm:opacity-0 group-hover:opacity-100 hover:bg-white border border-[#D8D2C2] shadow-xs'
                        }`}
                        aria-label="Wishlist"
                      >
                        <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-[#7A0F1A] text-[#7A0F1A]' : ''}`} />
                      </button>
                    </div>

                    {/* Uniform Square Image Container */}
                    <div className="relative aspect-square w-full my-3 flex items-center justify-center p-3 overflow-hidden">
                      <img
                        src={imageSrc}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        width={800}
                        height={800}
                        loading="lazy"
                        decoding="async"
                        className="max-w-full max-h-full w-auto h-auto object-contain mix-blend-multiply group-hover:scale-108 transition-transform duration-500 ease-out"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickAdd(product);
                        }}
                        className="absolute bottom-1 right-1 p-2.5 bg-black hover:bg-neutral-800 text-white rounded-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-md cursor-pointer z-10"
                        title="Quick Add"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Meta Box */}
                    <div className="flex flex-col justify-between pt-2 border-t border-[#D8D2C2]/60">
                      <h4 className="font-serif-display text-base sm:text-lg md:text-xl text-black group-hover:text-neutral-700 transition-colors font-medium sm:font-semibold leading-snug truncate">
                        {product.name}
                      </h4>
                      <div className="flex items-baseline justify-between mt-1 flex-wrap gap-1.5">
                        {(() => {
                          const comparePrice = getCompareAtPrice(product.price || 0, product.originalPrice);
                          const discount = getDiscountPercentage(product.price || 0, comparePrice);
                          return (
                            <div className="flex items-baseline gap-2 flex-wrap">
                              <span className="text-base sm:text-lg md:text-xl font-bold text-black tracking-tight">
                                {formatPrice(product.price || 0, currency)}
                              </span>
                              {comparePrice > (product.price || 0) && (
                                <>
                                  <span className="text-xs text-[#DC2626] line-through font-normal">
                                    {formatPrice(comparePrice, currency)}
                                  </span>
                                  <span className="text-[10px] font-bold text-[#15803D] bg-[#15803D]/10 border border-[#15803D]/20 px-1.5 py-0.2 rounded-2xs uppercase tracking-wider">
                                    {discount}% OFF
                                  </span>
                                </>
                              )}
                            </div>
                          );
                        })()}
                        <span className="text-[10px] sm:text-xs text-[#8F896D] uppercase tracking-wider font-medium group-hover:text-[#413C23] transition-colors">
                          View Piece →
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Subtle Craftsmanship Highlights Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-[#413C23]/80">
            <div className="py-2.5 px-4 bg-[#F2EFDB]/70 border border-[#D8D2C2] rounded-xs flex items-center justify-center sm:justify-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#8F896D] shrink-0" />
              <span className="font-medium">Anti-Tarnish Protective Shield</span>
            </div>
            <div className="py-2.5 px-4 bg-[#F2EFDB]/70 border border-[#D8D2C2] rounded-xs flex items-center justify-center sm:justify-start gap-2.5">
              <Gem className="w-4 h-4 text-[#8F896D] shrink-0" />
              <span className="font-medium">Handcrafted Sculptural Brass</span>
            </div>
            <div className="py-2.5 px-4 bg-[#F2EFDB]/70 border border-[#D8D2C2] rounded-xs flex items-center justify-center sm:justify-start gap-2.5">
              <Check className="w-4 h-4 text-[#8F896D] shrink-0" />
              <span className="font-medium">Hypoallergenic Surgical Steel Posts</span>
            </div>
          </div>

        </div>
      </section>

      {/* 6. SECTION 6: THE SILVER TONE EDIT (Curated Silver-Tone Alloy & Rhodium Showcase) */}
      <section className="silver-section w-full bg-[#E7E4D5] py-16 sm:py-24 border-b border-[#D8D2C2] px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 select-none">
        <div className="w-full space-y-8 sm:space-y-12">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#D8D2C2] pb-5 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#A8B2BC] border border-[#7D8893]/40 shadow-xs" />
                <span className="text-xs sm:text-sm text-[#8F896D] uppercase tracking-[0.2em] font-semibold">
                  The Silver Tone Edit • Cool Modernity
                </span>
              </div>
              <h2 className="font-serif-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#413C23] font-bold tracking-tight leading-[1.05] max-w-2xl">
                Architectural Polish &amp;<br />Silver Silhouette.
              </h2>
            </div>
            <div className="flex flex-col sm:items-end gap-2 shrink-0">
              <p className="text-xs sm:text-[13px] text-[#413C23]/80 font-normal max-w-xs sm:text-right leading-relaxed">
                Mirror rhodium finish in precision silver alloy. Crisp, architectural, and anti-tarnish.
              </p>
              <button
                onClick={() => onNavigateToCollection('all', 'alloy')}
                className="text-xs sm:text-sm text-[#8F896D] hover:text-[#413C23] transition-colors cursor-pointer font-medium underline underline-offset-4 tracking-wide uppercase pt-1"
              >
                see all silver ({silverProducts.length})
              </button>
            </div>
          </div>

          {/* Silver Edit Wide Campaign Banner */}
          <div className="gsap-home-reveal w-full h-64 sm:h-80 md:h-96 lg:h-[460px] xl:h-[500px] rounded-xs overflow-hidden border border-[#D8D2C2] relative bg-[#413C23] shadow-xs">
            <img
              src="/assets/editorial/silver-edit-campaign-banner.jpg"
              alt="Avirena Silver-Tone Alloy Campaign"
              width={2000}
              height={1000}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#413C23]/35 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Silver Product Grid */}
          <div className="silver-grid grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {silverProducts.length === 0 ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={`silver-skeleton-${idx}`}
                  className="flex flex-col justify-between bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs overflow-hidden animate-pulse p-4"
                >
                  <div className="aspect-square w-full bg-[#E7E4D5] rounded-xs mb-3" />
                  <div className="h-4 bg-[#E7E4D5] rounded w-3/4 mb-2" />
                  <div className="h-3 bg-[#E7E4D5] rounded w-1/3" />
                </div>
              ))
            ) : (
              silverProducts.map((product) => {
                if (!product || !product.id) return null;
                const imageSrc = getProductImage(product);
                const wishlisted = isWishlisted(product.id);

                return (
                  <div
                    key={product.id}
                    onClick={() => onSelectProduct(product)}
                    className="silver-card group cursor-pointer flex flex-col justify-between bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs p-3.5 sm:p-5 transition-all duration-300 hover:border-[#8F896D] hover:shadow-[0_10px_25px_rgba(65,60,35,0.08)] relative text-left"
                  >
                    {/* Top Bar: Metal Finish Badge & Wishlist Heart */}
                    <div className="flex items-center justify-between w-full z-10">
                      <span className="text-[10px] sm:text-[11px] font-semibold text-[#413C23] bg-[#E7E4D5] px-2 py-0.5 rounded-xs border border-[#D8D2C2] uppercase tracking-wider">
                        Silver-Tone Alloy
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWishlist(product);
                        }}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
                          wishlisted
                            ? 'bg-[#413C23] text-white opacity-100 shadow-xs'
                            : 'bg-[#FAF8F5]/90 text-[#413C23] opacity-80 sm:opacity-0 group-hover:opacity-100 hover:bg-white border border-[#D8D2C2] shadow-xs'
                        }`}
                        aria-label="Wishlist"
                      >
                        <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-[#7A0F1A] text-[#7A0F1A]' : ''}`} />
                      </button>
                    </div>

                    {/* Uniform Square Image Container */}
                    <div className="relative aspect-square w-full my-3 flex items-center justify-center p-3 overflow-hidden">
                      <img
                        src={imageSrc}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        width={800}
                        height={800}
                        loading="lazy"
                        decoding="async"
                        className="max-w-full max-h-full w-auto h-auto object-contain mix-blend-multiply group-hover:scale-108 transition-transform duration-500 ease-out"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickAdd(product);
                        }}
                        className="absolute bottom-1 right-1 p-2.5 bg-black hover:bg-neutral-800 text-white rounded-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-md cursor-pointer z-10"
                        title="Quick Add"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Meta Box */}
                    <div className="flex flex-col justify-between pt-2 border-t border-[#D8D2C2]/60">
                      <h4 className="font-serif-display text-base sm:text-lg md:text-xl text-black group-hover:text-neutral-700 transition-colors font-medium sm:font-semibold leading-snug truncate">
                        {product.name}
                      </h4>
                      <div className="flex items-baseline justify-between mt-1 flex-wrap gap-1.5">
                        {(() => {
                          const comparePrice = getCompareAtPrice(product.price || 0, product.originalPrice);
                          const discount = getDiscountPercentage(product.price || 0, comparePrice);
                          return (
                            <div className="flex items-baseline gap-2 flex-wrap">
                              <span className="text-base sm:text-lg md:text-xl font-bold text-black tracking-tight">
                                {formatPrice(product.price || 0, currency)}
                              </span>
                              {comparePrice > (product.price || 0) && (
                                <>
                                  <span className="text-xs text-[#DC2626] line-through font-normal">
                                    {formatPrice(comparePrice, currency)}
                                  </span>
                                  <span className="text-[10px] font-bold text-[#15803D] bg-[#15803D]/10 border border-[#15803D]/20 px-1.5 py-0.2 rounded-2xs uppercase tracking-wider">
                                    {discount}% OFF
                                  </span>
                                </>
                              )}
                            </div>
                          );
                        })()}
                        <span className="text-[10px] sm:text-xs text-[#8F896D] uppercase tracking-wider font-medium group-hover:text-[#413C23] transition-colors">
                          View Piece →
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Subtle Craftsmanship Highlights Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-[#413C23]/80">
            <div className="py-2.5 px-4 bg-[#F2EFDB]/70 border border-[#D8D2C2] rounded-xs flex items-center justify-center sm:justify-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#8F896D] shrink-0" />
              <span className="font-medium">Anti-Tarnish Dual-Action Protective Seal</span>
            </div>
            <div className="py-2.5 px-4 bg-[#F2EFDB]/70 border border-[#D8D2C2] rounded-xs flex items-center justify-center sm:justify-start gap-2.5">
              <Gem className="w-4 h-4 text-[#8F896D] shrink-0" />
              <span className="font-medium">Mirror-Polished Rhodium &amp; Silver Luster</span>
            </div>
            <div className="py-2.5 px-4 bg-[#F2EFDB]/70 border border-[#D8D2C2] rounded-xs flex items-center justify-center sm:justify-start gap-2.5">
              <Check className="w-4 h-4 text-[#8F896D] shrink-0" />
              <span className="font-medium">Hypoallergenic Surgical Steel Posts</span>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURED PIECE SECTION (Full-Width Italian Editorial Showcase)
          Rendered only when there is a real product to spotlight. The live
          Shopify catalog can be empty (initial load, or a failed fetch), and
          this whole section is about one specific piece — with no product it
          has nothing honest to show. */}
      {spotlightProduct && (
      <section className="w-full bg-[#E7E4D5] border-t border-b border-[#D8D2C2] select-none overflow-hidden">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 items-stretch">

          {/* Left Column: Last Product Image (Full-Width Half at 85vh) */}
          <div
            onClick={() => onSelectProduct(spotlightProduct)}
            className="relative w-full h-[500px] sm:h-[600px] md:h-[85vh] min-h-[560px] bg-[#D8D1C0] overflow-hidden group cursor-pointer"
          >
            <img
              src={leftLifestyleImage}
              alt={spotlightProduct.name}
              referrerPolicy="no-referrer"
              width={1200}
              height={1600}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-[center_30%] group-hover:scale-104 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300 pointer-events-none" />
          </div>

          {/* Right Column: First Product Image & Italian Editorial Canvas (Full-Width Half at 85vh) */}
          <div className="w-full h-[500px] sm:h-[600px] md:h-[85vh] min-h-[560px] bg-[#878266] text-[#FAF8F5] p-8 sm:p-12 md:p-14 lg:p-16 flex flex-col justify-between items-center text-center relative overflow-hidden">
            
            {/* Top Text: Category & Headline */}
            <div className="space-y-2 z-10 pt-2 sm:pt-4">
              <span className="text-[11px] sm:text-xs text-[#FAF8F5]/75 uppercase tracking-[0.28em] font-medium block">
                Atelier Editorial
              </span>
              <h3 className="font-serif-display text-3xl sm:text-5xl md:text-6xl lg:text-[62px] text-[#FAF8F5] font-light tracking-wide">
                Signature Dailywear
              </h3>
            </div>

            {/* Center Stage: First Product Image (Enlarged) */}
            <div
              onClick={() => onSelectProduct(spotlightProduct)}
              className="relative my-auto flex items-center justify-center cursor-pointer group z-10 w-full"
            >
              <div className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[420px] lg:h-[420px] max-h-[46vh] flex items-center justify-center p-2">
                <img
                  src={rightProductImage}
                  alt={spotlightProduct.name}
                  referrerPolicy="no-referrer"
                  width={840}
                  height={840}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.45)] group-hover:scale-106 transition-transform duration-500 ease-out"
                />
              </div>
            </div>

            {/* Bottom Text & Button */}
            <div className="space-y-4 sm:space-y-5 z-10 max-w-md pb-2 sm:pb-4">
              <p className="font-serif italic text-sm sm:text-base text-[#FAF8F5]/90 leading-relaxed font-light">
                {spotlightProduct.subtitle || 'A collection where timelessness meets emotion, and simplicity acquires character.'}
              </p>

              <button
                type="button"
                onClick={() => onSelectProduct(spotlightProduct)}
                className="px-9 py-3 bg-[#FAF8F5] hover:bg-white text-[#413C23] text-xs uppercase tracking-[0.25em] font-semibold transition-all duration-200 rounded-xs shadow-md cursor-pointer active:scale-98"
              >
                SEE MORE
              </button>
            </div>

          </div>

        </div>
      </section>
      )}

      {/* 4. SECTION 4: CURATED GIFTING & OCCASION HUB */}
      <section className="w-full bg-[#E7E4D5] py-16 sm:py-24 border-b border-[#D8D2C2] px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="w-full space-y-10 sm:space-y-12">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#D8D2C2] pb-4 text-left gap-3">
            <div>
              <span className="text-[10px] text-[#8F896D] uppercase tracking-widest font-semibold block mb-1">
                Gifting & Curated Edits
              </span>
              <h2 className="font-serif-display text-4xl sm:text-6xl text-[#413C23] font-light">
                Shop By <span className="italic font-normal">Occasion</span>
              </h2>
            </div>
            
            {/* Gifting Tier Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {[
                { id: 'all', label: 'All Curated Gifts' },
                { id: 'daily', label: 'Daily Staples' },
                { id: 'statement', label: 'Statement Pieces' },
                { id: 'pearls', label: 'Baroque Pearls' },
              ].map((tier) => {
                const isActive = activeGiftTier === tier.id;
                return (
                  <button
                    key={tier.id}
                    onClick={() => setActiveGiftTier(tier.id as any)}
                    className={`text-xs px-3.5 py-1.5 rounded-xs uppercase tracking-wider font-medium transition-all cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-black text-white shadow-xs'
                        : 'bg-[#E7E4D5] text-black border border-[#D8D2C2] hover:border-black'
                    }`}
                  >
                    {tier.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4-Item Grid for Gifting */}
          <div className="gifting-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[360px]">
            {giftingProducts.length === 0 ? (
              // Luxury skeleton placeholder while Shopify GraphQL resolves
              Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={`gifting-skeleton-${idx}`}
                  className="flex flex-col justify-between bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs overflow-hidden text-left animate-pulse"
                >
                  <div className="aspect-square w-full bg-[#E7E4D5] opacity-60" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-[#E7E4D5] rounded w-3/4 opacity-70" />
                    <div className="h-3 bg-[#E7E4D5] rounded w-1/3 opacity-50" />
                  </div>
                </div>
              ))
            ) : (
              giftingProducts.map((product) => {
              if (!product || !product.id) return null;
              const imageSrc = getProductImage(product);

              return (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="gifting-card group cursor-pointer flex flex-col justify-between bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs overflow-hidden transition-all duration-300 hover:shadow-md hover:border-[#8F896D] text-left"
                >
                  <div className="relative aspect-square w-full bg-[#FAF8F5] p-6 flex items-center justify-center overflow-hidden">
                    <img
                      src={imageSrc}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      width={800}
                      height={800}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-contain mix-blend-multiply group-hover:scale-106 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#FAF8F5] text-[#413C23] text-[10px] font-semibold px-2 py-0.5 rounded-xs border border-[#D8D2C2] uppercase tracking-wider">
                      {product.metal}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickAdd(product);
                      }}
                      className="absolute bottom-3 right-3 p-2.5 bg-black hover:bg-neutral-800 text-white rounded-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-md cursor-pointer z-10"
                      title="Quick Add to Bag"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-4 space-y-1.5">
                    <h4 className="font-serif-display text-lg sm:text-xl text-black group-hover:text-neutral-700 transition-colors font-medium sm:font-semibold truncate">
                      {product.name}
                    </h4>
                    <div className="flex items-center justify-between text-xs pt-0.5 flex-wrap gap-1">
                      {(() => {
                        const comparePrice = getCompareAtPrice(product.price || 0, product.originalPrice);
                        const discount = getDiscountPercentage(product.price || 0, comparePrice);
                        return (
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="text-base sm:text-lg font-bold text-black tracking-tight">{formatPrice(product.price || 0, currency)}</span>
                            {comparePrice > (product.price || 0) && (
                              <>
                                <span className="text-xs text-[#DC2626] line-through font-normal">
                                  {formatPrice(comparePrice, currency)}
                                </span>
                                <span className="text-[10px] font-bold text-[#15803D] bg-[#15803D]/10 border border-[#15803D]/20 px-1.5 py-0.2 rounded-2xs uppercase tracking-wider">
                                  {discount}% OFF
                                </span>
                              </>
                            )}
                          </div>
                        );
                      })()}
                      <span className="text-[10px] text-[#413C23] uppercase tracking-wider font-semibold group-hover:underline">
                        View Details →
                      </span>
                    </div>
                  </div>
                </div>
              );
            }))}
          </div>

        </div>
      </section>

      {/* 6. VALUE PROPOSITION & SCARCITY STRIP */}
      <section className="border-b border-[#D8D2C2] bg-[#E7E4D5] py-8 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3.5 text-xs font-medium text-[#413C23]">
            <div className="w-10 h-10 rounded-full bg-[#F2EFDB] border border-[#D8D2C2] flex items-center justify-center text-[#413C23] shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <span className="block font-semibold">Free Delivery</span>
              <span className="text-[10px] text-[#8F896D]">On all orders across India</span>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3.5 text-xs font-medium text-[#413C23]">
            <div className="w-10 h-10 rounded-full bg-[#F2EFDB] border border-[#D8D2C2] flex items-center justify-center text-[#413C23] shrink-0">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <span className="block font-semibold">Signature Packaging</span>
              <span className="text-[10px] text-[#8F896D]">Premium eco-friendly box</span>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3.5 text-xs font-medium text-[#413C23]">
            <div className="w-10 h-10 rounded-full bg-[#F2EFDB] border border-[#D8D2C2] flex items-center justify-center text-[#413C23] shrink-0">
              <Gem className="w-4 h-4" />
            </div>
            <div>
              <span className="block font-semibold">Anti-Tarnish Protective Seal</span>
              <span className="text-[10px] text-[#8F896D]">Premium brass dailywear</span>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3.5 text-xs font-medium text-[#413C23]">
            <div className="w-10 h-10 rounded-full bg-[#F2EFDB] border border-[#D8D2C2] flex items-center justify-center text-[#413C23] shrink-0">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <span className="block font-semibold">7-Day Easy Returns</span>
              <span className="text-[10px] text-[#8F896D]">Hassle-free exchanges</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
