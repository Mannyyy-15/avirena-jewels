import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Gem,
  Package,
  ShoppingBag,
  Star,
  Check,
  ArrowUpRight,
  Gift,
  CheckCircle2,
  Heart,
  Crown,
  RotateCcw,
  Truck,
  Flame,
  Layers,
  Award
} from 'lucide-react';
import { Product, Currency, Category } from '../types';
import { PRODUCTS, formatPrice } from '../data/products';
import { HeroBaroquePearlRing } from '../components/HeroBaroquePearlRing';
import HoverImageReveal from '../components/originkit/ui/hover-image-reveal';

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
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectProduct,
  onNavigateToCollection,
  onQuickAdd,
  onQuickView,
  currency,
  isWishlisted,
  onToggleWishlist,
  catalogProducts = PRODUCTS,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // Gifting filter tab state
  const [activeGiftTier, setActiveGiftTier] = useState<'all' | 'under150' | 'heirloom' | 'pearls'>('all');

  // Hotspot State for "Shop The Look"
  const [activeHotspot, setActiveHotspot] = useState<number>(0);

  // 5-Category Hover Image Reveal dataset
  const categoryRevealItems = {
    itemCount: 5,
    item1: {
      text: 'Bracelets',
      image: {
        src: 'https://images.unsplash.com/photo-1611591475168-98967b5eb488?auto=format&fit=crop&w=1000&q=85',
        alt: 'Handcrafted Demi-Fine Bracelets & Cuffs',
      },
      onClick: () => onNavigateToCollection('bracelets'),
    },
    item2: {
      text: 'Rings',
      image: {
        src: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85',
        alt: 'Sculptural Demi-Fine Rings & Bands',
      },
      onClick: () => onNavigateToCollection('rings'),
    },
    item3: {
      text: 'Earrings',
      image: {
        src: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1000&q=85',
        alt: 'Molten Gold Earrings & Hoops',
      },
      onClick: () => onNavigateToCollection('earrings'),
    },
    item4: {
      text: 'Necklaces',
      image: {
        src: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85',
        alt: 'Architectural Geometric Figaro Necklaces',
      },
      onClick: () => onNavigateToCollection('necklaces'),
    },
    item5: {
      text: 'Brooches',
      image: {
        src: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1000&q=85',
        alt: 'Fluid Sculptural Kinetic Brooches',
      },
      onClick: () => onNavigateToCollection('brooches'),
    },
  };

  // Curated 5 pieces for "Collection" section matching reference layout
  const collectionFive = [
    {
      product: catalogProducts.find((p) => p.id === 'row-edge-ring') || catalogProducts[5] || catalogProducts[0],
      displayTitle: 'Aurelia Ring',
    },
    {
      product: catalogProducts.find((p) => p.id === 'square-form-necklace') || catalogProducts[0],
      displayTitle: 'Nadir Necklace',
    },
    {
      product: catalogProducts.find((p) => p.id === 'lucid-studs') || catalogProducts[1],
      displayTitle: 'Lucea Studs',
    },
    {
      product: catalogProducts.find((p) => p.id === 'scalo-bracelet') || catalogProducts[11] || catalogProducts[3],
      displayTitle: 'Forma Bracelet',
    },
    {
      product: catalogProducts.find((p) => p.id === 'solid-wave-brooch') || catalogProducts[2],
      displayTitle: 'Aura Brooch',
    },
  ];

  // Curated 5 pieces for "Popular" section (identical 5-column grid & sizing as Collection)
  const popularFive = [
    catalogProducts.find((p) => p.id === 'wave-prism-ring') || catalogProducts[6] || catalogProducts[0],
    catalogProducts.find((p) => p.id === 'gold-curve-necklace') || catalogProducts[8] || catalogProducts[1],
    catalogProducts.find((p) => p.id === 'dome-studs') || catalogProducts[13] || catalogProducts[2],
    catalogProducts.find((p) => p.id === 'two-pearl-cuff') || catalogProducts[4],
    catalogProducts.find((p) => p.id === 'asta-brooch') || catalogProducts[14] || catalogProducts[3],
  ];

  // Shop The Look Hotspots Dataset
  const stackLookProducts = [
    {
      id: 0,
      title: 'Lucea Molten Studs',
      price: 110,
      category: 'Earrings',
      pinX: '46%',
      pinY: '28%',
      product: catalogProducts.find((p) => p.id === 'lucid-studs') || catalogProducts[1],
    },
    {
      id: 1,
      title: 'Nadir Geometric Choker',
      price: 195,
      category: 'Necklaces',
      pinX: '52%',
      pinY: '52%',
      product: catalogProducts.find((p) => p.id === 'square-form-necklace') || catalogProducts[0],
    },
    {
      id: 2,
      title: 'Aurelia Sculptural Band',
      price: 145,
      category: 'Rings',
      pinX: '68%',
      pinY: '74%',
      product: catalogProducts.find((p) => p.id === 'row-edge-ring') || catalogProducts[5],
    },
  ];

  const totalStackPrice = stackLookProducts.reduce((sum, item) => sum + item.price, 0);
  const discountedBundlePrice = Math.round(totalStackPrice * 0.9); // 10% bundle saving

  // Filtered Gifting items
  const giftingProducts = catalogProducts.filter((p) => {
    if (activeGiftTier === 'under150') return p.price <= 150;
    if (activeGiftTier === 'heirloom') return p.price >= 180;
    if (activeGiftTier === 'pearls') return p.description.toLowerCase().includes('pearl') || p.name.toLowerCase().includes('pearl');
    return true;
  }).slice(0, 4);

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
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleAddEntireStack = () => {
    stackLookProducts.forEach((item) => {
      if (item.product) {
        onQuickAdd(item.product);
      }
    });
  };

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
            (all pieces — {catalogProducts.length})
          </button>
        </div>

        {/* Center Stage: Large Official Logo with Floating Golden Baroque Pearl Ring Touching Text */}
        <div className="relative my-auto py-10 sm:py-16 flex items-center justify-center w-full z-10 overflow-visible">
          {/* Official Brand Logo */}
          <div className="gsap-hero-title w-full flex items-center justify-center select-none pointer-events-none z-0">
            <img
              src="/logo-main.jpeg"
              alt="AVIRENA"
              className="w-[98vw] sm:w-[96vw] md:w-[94vw] lg:w-[92vw] xl:w-[90vw] 2xl:w-[88vw] max-w-[1550px] scale-105 sm:scale-110 md:scale-115 lg:scale-120 h-auto object-contain mix-blend-multiply select-none"
              loading="eager"
            />
          </div>

          {/* Floating Photorealistic Golden Baroque Pearl Ring Touching Logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[42%] z-20 pointer-events-auto">
            <HeroBaroquePearlRing onClick={() => onNavigateToCollection('rings')} />
          </div>
        </div>

        {/* Bottom Hero Bar */}
        <div className="gsap-hero-sub w-full flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 sm:gap-6 z-10 pt-4 border-t border-[#D8D2C2]">
          <p className="text-xs sm:text-[13px] text-[#413C23]/80 font-normal max-w-md leading-relaxed">
            Handcrafted demi-fine jewelry in thick 18k gold vermeil, recycled 925 sterling silver & natural pearls. Sculpted with soul.
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

      {/* 2. SECTION 2: EDITORIAL CATEGORY SHOWCASE WITH ORIGINKIT HOVER-IMAGE-REVEAL */}
      <section className="w-full bg-[#E7E4D5] py-16 sm:py-24 border-b border-[#D8D2C2] px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="w-full space-y-8">
          
          {/* Pure Originkit Hover Image Reveal List */}
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

      {/* 3. SECTION 3: "COLLECTION" (5 Identical Standard Cards) */}
      <section className="w-full bg-[#F4EFE6] py-16 sm:py-24 border-b border-[#D8D2C2] px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="w-full space-y-8 sm:space-y-12">
          
          {/* Section Header */}
          <div className="flex items-end justify-between border-b border-[#D8D2C2] pb-4">
            <div>
              <span className="text-[11px] text-[#8F896D] uppercase tracking-widest font-normal block mb-1">
                (02)
              </span>
              <h2 className="font-serif-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#413C23] font-light italic tracking-tight leading-none">
                Collection
              </h2>
            </div>
            <button
              onClick={() => onNavigateToCollection('all')}
              className="text-xs text-[#8F896D] hover:text-[#413C23] transition-colors cursor-pointer font-normal underline underline-offset-4 lowercase"
            >
              see all
            </button>
          </div>

          {/* 5-Column Uniform Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5">
            {collectionFive.map(({ product, displayTitle }) => (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="group cursor-pointer flex flex-col space-y-3 text-left w-full"
              >
                {/* Fixed Uniform Square Box Container */}
                <div className="relative aspect-square w-full bg-[#E7E4D5] border border-[#D8D2C2] rounded-xs flex items-center justify-center p-6 transition-all duration-300 group-hover:bg-[#FAF8F5] group-hover:border-[#8F896D] overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      referrerPolicy="no-referrer"
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

                {/* Fixed Meta Box directly on linen canvas */}
                <div className="h-10 flex flex-col justify-between pt-0.5">
                  <h4 className="font-serif-display text-xs sm:text-[13px] text-[#413C23] group-hover:text-[#8F896D] transition-colors font-medium truncate block">
                    {displayTitle}
                  </h4>
                  <p className="text-xs text-[#8F896D] font-normal block">
                    {formatPrice(product.price, currency)}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. NEW HIGH-CONVERTING SECTION: INTERACTIVE "SHOP THE LOOK" / STACKING STUDIO */}
      <section className="w-full bg-[#E7E4D5] py-16 sm:py-24 border-b border-[#D8D2C2] px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="w-full space-y-10 sm:space-y-14">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#D8D2C2] pb-4 text-left gap-3">
            <div>
              <span className="text-[10px] text-[#8F896D] uppercase tracking-widest font-semibold block mb-1">
                (03) / Editorial Stacking Studio
              </span>
              <h2 className="font-serif-display text-4xl sm:text-6xl text-[#413C23] font-light">
                Shop The <span className="italic font-normal">Layered Look</span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#413C23]/70 font-normal max-w-md">
              Explore our signature molten stack. Hover or tap the glowing pins to inspect individual pieces, or acquire the complete stack with 10% savings.
            </p>
          </div>

          {/* 2-Column Split: Interactive Photo Hotspots + Dynamic Stack Cart Box */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Editorial Photo with Interactive Hotspots */}
            <div className="lg:col-span-7 relative aspect-[4/5] sm:aspect-[16/11] lg:aspect-[4/3] rounded-xs overflow-hidden border border-[#D8D2C2] bg-[#F4EFE6] shadow-md">
              <img
                src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1600&q=90"
                alt="Avirena Layered Jewelry Stack"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-[center_30%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#413C23]/40 via-transparent to-transparent pointer-events-none" />

              {/* Hotspot Pins */}
              {stackLookProducts.map((spot) => {
                const isActive = activeHotspot === spot.id;
                return (
                  <button
                    key={spot.id}
                    onClick={() => setActiveHotspot(spot.id)}
                    style={{ left: spot.pinX, top: spot.pinY }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20 focus:outline-none"
                    aria-label={spot.title}
                  >
                    {/* Pulsing ring animation */}
                    <span className="absolute -inset-2 rounded-full bg-[#FAF8F5]/50 animate-ping duration-1000" />
                    <div className={`relative w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      isActive
                        ? 'bg-[#413C23] border-[#FAF8F5] text-[#FAF8F5] scale-110 shadow-lg'
                        : 'bg-[#FAF8F5] border-[#413C23] text-[#413C23] hover:scale-110'
                    }`}>
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right: Curated Stack Breakdown & 1-Click Multi-Item Add Box */}
            <div className="lg:col-span-5 bg-[#F4EFE6] border border-[#D8D2C2] p-6 sm:p-8 rounded-xs text-left space-y-6 shadow-sm">
              <div className="space-y-1 border-b border-[#D8D2C2] pb-4">
                <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#8F896D] block">
                  Curated 3-Piece Suite
                </span>
                <h3 className="font-serif-display text-2xl sm:text-3xl text-[#413C23] font-light">
                  The Molten Signature Trio
                </h3>
              </div>

              {/* Items List in this Stack */}
              <div className="space-y-3">
                {stackLookProducts.map((spot) => {
                  const isSelected = activeHotspot === spot.id;
                  return (
                    <div
                      key={spot.id}
                      onClick={() => setActiveHotspot(spot.id)}
                      className={`p-3 rounded-xs border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#FAF8F5] border-[#8F896D] shadow-xs'
                          : 'bg-[#E7E4D5]/60 border-[#D8D2C2] hover:bg-[#FAF8F5]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs flex items-center justify-center p-1 shrink-0">
                          <img
                            src={spot.product?.images[0]}
                            alt={spot.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-contain mix-blend-multiply"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase text-[#8F896D] font-medium block">
                            {spot.category}
                          </span>
                          <span className="font-serif-display text-sm font-medium text-[#413C23] block">
                            {spot.title}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-semibold text-[#413C23] block">
                          {formatPrice(spot.price, currency)}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (spot.product) onQuickAdd(spot.product);
                          }}
                          className="text-[10px] uppercase font-semibold text-[#8F896D] hover:text-[#413C23] underline cursor-pointer"
                        >
                          + Add Single
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Multi-Item 1-Click Bundle Add */}
              <div className="pt-4 border-t border-[#D8D2C2] space-y-3">
                <div className="flex items-baseline justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs text-[#413C23] font-medium block">Complete 3-Piece Stack</span>
                    <span className="text-[11px] text-[#8F896D]">Includes 10% Maison Bundle Savings</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#8F896D] line-through mr-2">
                      {formatPrice(totalStackPrice, currency)}
                    </span>
                    <span className="font-serif-display text-xl text-[#413C23] font-bold">
                      {formatPrice(discountedBundlePrice, currency)}
                    </span>
                  </div>
                </div>

                <button
                  id="add-entire-stack-btn"
                  onClick={handleAddEntireStack}
                  className="w-full py-3.5 bg-[#413C23] hover:bg-[#8F896D] text-[#E7E4D5] text-xs uppercase tracking-[0.2em] font-semibold rounded-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Add Entire Stack to Bag</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. SECTION 5: "POPULAR" (5-Column Grid + Wide Campaign Banner) */}
      <section className="w-full bg-[#F4EFE6] py-16 sm:py-24 border-b border-[#D8D2C2] px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="w-full space-y-8 sm:space-y-12">
          
          {/* Section Header */}
          <div className="flex items-end justify-between border-b border-[#D8D2C2] pb-4">
            <div>
              <span className="text-[11px] text-[#8F896D] uppercase tracking-widest font-normal block mb-1">
                (04)
              </span>
              <h2 className="font-serif-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#413C23] font-light italic tracking-tight leading-none">
                Popular
              </h2>
            </div>
            <button
              onClick={() => onNavigateToCollection('all')}
              className="text-xs text-[#8F896D] hover:text-[#413C23] transition-colors cursor-pointer font-normal underline underline-offset-4 lowercase"
            >
              see all
            </button>
          </div>

          {/* Wide Dramatic Model Banner */}
          <div className="w-full h-56 sm:h-72 md:h-80 lg:h-96 rounded-xs overflow-hidden border border-[#D8D2C2] relative bg-[#413C23] shadow-xs">
            <img
              src="https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=2000&q=90"
              alt="Sculptural Molten Earring Campaign"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-[center_35%] filter contrast-110 opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#413C23]/60 via-transparent to-[#413C23]/40 pointer-events-none" />
          </div>

          {/* 5-Column Uniform Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5">
            {popularFive.map((product) => (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="group cursor-pointer flex flex-col space-y-3 text-left w-full"
              >
                {/* Fixed Uniform Square Box Container */}
                <div className="relative aspect-square w-full bg-[#E7E4D5] border border-[#D8D2C2] rounded-xs flex items-center justify-center p-6 transition-all duration-300 group-hover:bg-[#FAF8F5] group-hover:border-[#8F896D] overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      referrerPolicy="no-referrer"
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

                {/* Fixed Meta Box directly on linen canvas */}
                <div className="h-10 flex flex-col justify-between pt-0.5">
                  <h4 className="font-serif-display text-xs sm:text-[13px] text-[#413C23] group-hover:text-[#8F896D] transition-colors font-medium truncate block">
                    {product.name}
                  </h4>
                  <p className="text-xs text-[#8F896D] font-normal block">
                    {formatPrice(product.price, currency)}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. NEW E-COMMERCE SECTION: CURATED GIFTING & PRICE-TIER HUB */}
      <section className="w-full bg-[#E7E4D5] py-16 sm:py-24 border-b border-[#D8D2C2] px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="w-full space-y-10 sm:space-y-12">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#D8D2C2] pb-4 text-left gap-3">
            <div>
              <span className="text-[10px] text-[#8F896D] uppercase tracking-widest font-semibold block mb-1">
                (05) / Gifting & Curated Edits
              </span>
              <h2 className="font-serif-display text-4xl sm:text-6xl text-[#413C23] font-light">
                Shop By <span className="italic font-normal">Occasion</span>
              </h2>
            </div>
            
            {/* Gifting Tier Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {[
                { id: 'all', label: 'All Curated Gifts' },
                { id: 'under150', label: 'Under $150 Staples' },
                { id: 'heirloom', label: 'Heirloom ($200+)' },
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
                        : 'bg-[#F4EFE6] text-[#413C23] border border-[#D8D2C2] hover:border-[#8F896D]'
                    }`}
                  >
                    {tier.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4-Item Grid for Gifting */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {giftingProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="group cursor-pointer flex flex-col justify-between bg-[#F4EFE6] border border-[#D8D2C2] rounded-xs overflow-hidden transition-all duration-300 hover:shadow-md hover:border-[#8F896D] text-left"
              >
                <div className="relative aspect-square w-full bg-[#FAF8F5] p-6 flex items-center justify-center overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-106 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#E7E4D5] text-[#413C23] text-[10px] font-semibold px-2 py-0.5 rounded-xs border border-[#D8D2C2] uppercase tracking-wider">
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
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#8F896D] font-normal">{formatPrice(product.price, currency)}</span>
                    <span className="text-[10px] text-[#413C23] uppercase tracking-wider font-semibold group-hover:underline">
                      View Details →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. VALUE PROPOSITION & SCARCITY STRIP */}
      <section className="border-b border-[#D8D2C2] bg-[#F4EFE6] py-8 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3.5 text-xs font-medium text-[#413C23]">
            <div className="w-10 h-10 rounded-full bg-[#E7E4D5] border border-[#D8D2C2] flex items-center justify-center text-[#413C23] shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <span className="block font-semibold">Complimentary Shipping</span>
              <span className="text-[10px] text-[#8F896D]">On orders over $150</span>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3.5 text-xs font-medium text-[#413C23]">
            <div className="w-10 h-10 rounded-full bg-[#E7E4D5] border border-[#D8D2C2] flex items-center justify-center text-[#413C23] shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="block font-semibold">2-Year Atelier Warranty</span>
              <span className="text-[10px] text-[#8F896D]">Guaranteed craftsmanship</span>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3.5 text-xs font-medium text-[#413C23]">
            <div className="w-10 h-10 rounded-full bg-[#E7E4D5] border border-[#D8D2C2] flex items-center justify-center text-[#413C23] shrink-0">
              <Gem className="w-4 h-4" />
            </div>
            <div>
              <span className="block font-semibold">18k Heavy Gold Vermeil</span>
              <span className="text-[10px] text-[#8F896D]">Recycled 925 solid silver</span>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3.5 text-xs font-medium text-[#413C23]">
            <div className="w-10 h-10 rounded-full bg-[#E7E4D5] border border-[#D8D2C2] flex items-center justify-center text-[#413C23] shrink-0">
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
