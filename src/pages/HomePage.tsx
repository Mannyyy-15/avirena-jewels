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
  Heart
} from 'lucide-react';
import { Product, Currency, Category } from '../types';
import { formatPrice } from '../data/products';
import { HeroBaroquePearlRing } from '../components/HeroBaroquePearlRing';
import { AboutUsEditorialSection } from '../components/AboutUsEditorialSection';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface HomePageProps {
  onSelectProduct: (product: Product) => void;
  onNavigateToCollection: (category?: Category) => void;
  onQuickAdd: (product: Product) => void;
  onQuickView?: (product: Product) => void;
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
  onQuickView,
  currency,
  isWishlisted,
  onToggleWishlist,
  catalogProducts = [],
  onNavigateToAbout,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // Gifting filter tab state
  const [activeGiftTier, setActiveGiftTier] = useState<'all' | 'under150' | 'heirloom' | 'pearls'>('all');

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

  // Filtered Gifting items dynamically from live catalog
  const giftingProducts = useMemo(() => {
    if (!safeProducts || safeProducts.length === 0) return [];
    const filtered = safeProducts.filter((p) => {
      if (!p || !p.id) return false;
      if (activeGiftTier === 'under150') return p.price <= 150;
      if (activeGiftTier === 'heirloom') return p.price >= 180;
      if (activeGiftTier === 'pearls') return p.description?.toLowerCase().includes('pearl') || p.name?.toLowerCase().includes('pearl');
      return true;
    });
    return filtered.length > 0 ? filtered.slice(0, 4) : safeProducts.slice(0, 4);
  }, [safeProducts, activeGiftTier]);

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

      // Staggered gifting cards
      gsap.from('.gifting-card', {
        y: 30,
        opacity: 0,
        duration: 0.75,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.gifting-grid',
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
        <div className="relative my-auto py-10 sm:py-16 flex items-center justify-center w-full z-10 overflow-visible">
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
                className="w-[98vw] sm:w-[96vw] md:w-[94vw] lg:w-[92vw] xl:w-[90vw] 2xl:w-[88vw] max-w-[1550px] scale-105 sm:scale-110 md:scale-115 lg:scale-120 h-auto object-contain mix-blend-multiply select-none"
                loading="eager"
                fetchPriority="high"
                decoding="sync"
              />
            </picture>
          </div>

          {/* Floating Baroque Pearl Ring (Centered & Positioned Gracefully Below Logo Center) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-[12%] sm:translate-y-[10%] md:translate-y-[8%] z-20 pointer-events-auto">
            <HeroBaroquePearlRing onClick={() => onNavigateToCollection('rings')} />
          </div>
        </div>

        {/* Bottom Hero Bar */}
        <div className="gsap-hero-sub w-full flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 sm:gap-6 z-10 pt-4 border-t border-[#D8D2C2]">
          <p className="text-xs sm:text-[13px] text-[#413C23]/80 font-normal max-w-md leading-relaxed">
            Homegrown premium dailywear jewels crafted in high-grade brass with durable anti-tarnish protective coating. Designed for effortless everyday elegance.
          </p>

          <button
            id="hero-shop-all-btn"
            onClick={() => onNavigateToCollection('all')}
            className="px-7 py-3.5 bg-[#413C23] hover:bg-[#8F896D] text-[#E7E4D5] text-xs uppercase tracking-[0.2em] font-semibold rounded-xs transition-all shadow-md flex items-center gap-2.5 cursor-pointer active:scale-98"
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
              <h2 className="font-serif-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#413C23] font-light italic tracking-tight leading-[1.05] max-w-2xl">
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
                  <div className="relative aspect-square w-full bg-[#F2EFDB] border border-[#D8D2C2] rounded-xs flex items-center justify-center p-6 transition-all duration-300 group-hover:border-[#8F896D] group-hover:shadow-[0_8px_20px_rgba(65,60,35,0.08)] overflow-hidden">
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
                      className="absolute bottom-2.5 right-2.5 p-2 bg-[#413C23] hover:bg-[#8F896D] text-[#E7E4D5] rounded-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-sm cursor-pointer z-10"
                      title="Quick Add"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Meta Box with Prominent Bold Price */}
                  <div className="flex flex-col justify-between pt-1">
                    <h4 className="font-serif-display text-sm sm:text-base text-[#413C23] group-hover:text-[#8F896D] transition-colors font-normal leading-snug truncate block">
                      {displayTitle}
                    </h4>
                    <p className="text-sm sm:text-base font-bold text-[#413C23] tracking-tight mt-0.5 block">
                      {formatPrice(product.price || 0, currency)}
                    </p>
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
              <h2 className="font-serif-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#413C23] font-light italic tracking-tight leading-[1.05] max-w-2xl">
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
          <div className="gsap-home-reveal w-full h-56 sm:h-72 md:h-80 lg:h-96 rounded-xs overflow-hidden border border-[#D8D2C2] relative bg-[#413C23] shadow-xs">
            <img
              src="https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=2000&q=90"
              alt="Sculptural Molten Earring Campaign"
              referrerPolicy="no-referrer"
              width={2000}
              height={1000}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-[center_35%] filter contrast-110 opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#413C23]/60 via-transparent to-[#413C23]/40 pointer-events-none" />
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
                  <div className="relative aspect-square w-full bg-[#F2EFDB] border border-[#D8D2C2] rounded-xs flex items-center justify-center p-6 transition-all duration-300 group-hover:border-[#8F896D] group-hover:shadow-[0_8px_20px_rgba(65,60,35,0.08)] overflow-hidden">
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
                      className="absolute bottom-2.5 right-2.5 p-2 bg-[#413C23] hover:bg-[#8F896D] text-[#E7E4D5] rounded-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-sm cursor-pointer z-10"
                      title="Quick Add"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Meta Box with Prominent Bold Price */}
                  <div className="flex flex-col justify-between pt-1">
                    <h4 className="font-serif-display text-sm sm:text-base text-[#413C23] group-hover:text-[#8F896D] transition-colors font-normal leading-snug truncate block">
                      {product.name}
                    </h4>
                    <p className="text-sm sm:text-base font-bold text-[#413C23] tracking-tight mt-0.5 block">
                      {formatPrice(product.price || 0, currency)}
                    </p>
                  </div>
                </div>
              );
            })}
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

      {/* 4. SECTION 4: EDITORIAL ABOUT US (Roman Arch & Cascading Vignettes) */}
      <AboutUsEditorialSection onNavigateToAbout={onNavigateToAbout} />

      {/* 5. SECTION 5: CURATED GIFTING & OCCASION HUB */}
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
                { id: 'under150', label: 'Daily Staples' },
                { id: 'heirloom', label: 'Statement Pieces' },
                { id: 'pearls', label: 'Baroque Pearls' },
              ].map((tier) => {
                const isActive = activeGiftTier === tier.id;
                return (
                  <button
                    key={tier.id}
                    onClick={() => setActiveGiftTier(tier.id as any)}
                    className={`text-xs px-3.5 py-1.5 rounded-xs uppercase tracking-wider font-medium transition-all cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-[#413C23] text-[#E7E4D5] shadow-xs'
                        : 'bg-[#E7E4D5] text-[#413C23] border border-[#D8D2C2] hover:border-[#8F896D]'
                    }`}
                  >
                    {tier.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4-Item Grid for Gifting */}
          <div className="gifting-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {giftingProducts.map((product) => {
              if (!product || !product.id) return null;
              const imageSrc = getProductImage(product);

              return (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="gifting-card group cursor-pointer flex flex-col justify-between bg-[#F2EFDB] border border-[#D8D2C2] rounded-xs overflow-hidden transition-all duration-300 hover:shadow-md hover:border-[#8F896D] text-left"
                >
                  <div className="relative aspect-square w-full bg-[#F2EFDB] p-6 flex items-center justify-center overflow-hidden">
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
                    <div className="absolute top-3 left-3 bg-[#F2EFDB] text-[#413C23] text-[10px] font-semibold px-2 py-0.5 rounded-xs border border-[#D8D2C2] uppercase tracking-wider">
                      {product.metal}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickAdd(product);
                      }}
                      className="absolute bottom-3 right-3 p-2.5 bg-[#413C23] hover:bg-[#8F896D] text-[#E7E4D5] rounded-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-md cursor-pointer z-10"
                      title="Quick Add to Bag"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-4 space-y-1.5">
                    <h4 className="font-serif-display text-base text-[#413C23] group-hover:text-[#8F896D] transition-colors font-medium truncate">
                      {product.name}
                    </h4>
                    <div className="flex items-center justify-between text-xs pt-0.5">
                      <span className="text-base font-bold text-[#413C23] tracking-tight">{formatPrice(product.price || 0, currency)}</span>
                      <span className="text-[10px] text-[#413C23] uppercase tracking-wider font-semibold group-hover:underline">
                        View Details →
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
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
              <span className="block font-semibold">Complimentary Shipping</span>
              <span className="text-[10px] text-[#8F896D]">On orders over ₹1,999</span>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3.5 text-xs font-medium text-[#413C23]">
            <div className="w-10 h-10 rounded-full bg-[#F2EFDB] border border-[#D8D2C2] flex items-center justify-center text-[#413C23] shrink-0">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <span className="block font-semibold">Signature Packaging</span>
              <span className="text-[10px] text-[#8F896D]">Velvet keepsake pouch</span>
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
              <span className="block font-semibold">30-Day Easy Returns</span>
              <span className="text-[10px] text-[#8F896D]">Doorstep insured pickup</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
