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
} from 'lucide-react';
import { Product, Currency, Category } from '../types';
import { PRODUCTS, formatPrice } from '../data/products';
import { ProductCard } from '../components/ProductCard';
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

  return (
    <div ref={containerRef} className="pb-20 overflow-hidden font-sans-body w-full text-[#111111] bg-[#FAF8F5]">
      
      {/* 1. EXACT 100VH HERO SECTION */}
      <section
        ref={heroRef}
        className="relative w-full bg-[#F6F1E8] border-b border-[#E8E2D6] min-h-[calc(100vh-6rem)] sm:min-h-[calc(100vh-5rem)] h-[calc(100vh-5rem)] max-h-[1080px] flex flex-col justify-between p-6 sm:p-10 md:p-12 lg:px-16 lg:py-10 select-none overflow-hidden"
      >
        {/* Top Micro-Header */}
        <div className="gsap-hero-sub w-full flex items-center justify-between z-10 text-xs">
          <span className="text-[10px] sm:text-xs font-medium tracking-[0.25em] text-[#5C5850] uppercase">
            Timeless Beauty • Uniquely Yours
          </span>
          <button
            onClick={() => onNavigateToCollection('all')}
            className="text-[11px] sm:text-xs font-medium text-[#5C5850] hover:text-[#D4AF37] transition-colors cursor-pointer uppercase tracking-wider"
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
        <div className="gsap-hero-sub w-full flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 sm:gap-6 z-10 pt-4 border-t border-[#E8E2D6]">
          <p className="text-xs sm:text-[13px] text-[#5C5850] font-normal max-w-md leading-relaxed">
            Handcrafted demi-fine jewelry in thick 18k gold vermeil, recycled 925 sterling silver & natural pearls. Sculpted with soul.
          </p>

          <button
            id="hero-shop-all-btn"
            onClick={() => onNavigateToCollection('all')}
            className="px-7 py-3.5 bg-[#111111] hover:bg-[#D4AF37] text-white text-xs uppercase tracking-[0.2em] font-semibold rounded-xs transition-all shadow-md flex items-center gap-2.5 cursor-pointer active:scale-98"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 2. SECTION 2: EDITORIAL CATEGORY SHOWCASE WITH ORIGINKIT HOVER-IMAGE-REVEAL */}
      <section className="w-full bg-[#FAF8F5] py-16 sm:py-24 border-b border-[#E8E2D6] px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="w-full space-y-8">
          
          {/* Pure Originkit Hover Image Reveal List */}
          <div className="py-6 sm:py-12">
            <HoverImageReveal
              items={categoryRevealItems}
              font={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(3.75rem, 10vw, 8.5rem)',
                fontWeight: 300,
                lineHeight: '0.96em',
                letterSpacing: '-0.03em',
              }}
              textColor="#111111"
              dimColor="#B8B2A6"
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
      <section className="w-full bg-[#EAE6DC] py-16 sm:py-24 border-b border-[#D8D2C5] px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="w-full space-y-8 sm:space-y-12">
          
          {/* Section Header */}
          <div className="flex items-end justify-between border-b border-[#D8D2C5] pb-4">
            <div>
              <span className="text-[11px] text-[#7A7468] uppercase tracking-widest font-normal block mb-1">
                (02)
              </span>
              <h2 className="font-serif-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#111111] font-light italic tracking-tight leading-none">
                Collection
              </h2>
            </div>
            <button
              onClick={() => onNavigateToCollection('all')}
              className="text-xs text-[#5C5850] hover:text-[#111111] transition-colors cursor-pointer font-normal underline underline-offset-4 lowercase"
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
                <div className="relative aspect-square w-full bg-[#F5F2EA] border border-[#DDD7CA] rounded-xs flex items-center justify-center p-6 transition-all duration-300 group-hover:bg-[#FAF9F5] group-hover:border-[#CFC7B7] overflow-hidden">
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
                    className="absolute bottom-2.5 right-2.5 p-2 bg-[#111111] hover:bg-[#D4AF37] text-white rounded-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-sm cursor-pointer z-10"
                    title="Quick Add"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Fixed Meta Box directly on linen canvas */}
                <div className="h-10 flex flex-col justify-between pt-0.5">
                  <h4 className="font-serif-display text-xs sm:text-[13px] text-[#111111] group-hover:text-[#D4AF37] transition-colors font-medium truncate block">
                    {displayTitle}
                  </h4>
                  <p className="text-xs text-[#5C5850] font-normal block">
                    {formatPrice(product.price, currency)}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. SECTION 4: "POPULAR" (Exact Identical 5-Column Grid, Width & Box Dimensions) */}
      <section className="w-full bg-[#EAE6DC] py-16 sm:py-24 border-b border-[#D8D2C5] px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="w-full space-y-8 sm:space-y-12">
          
          {/* Section Header */}
          <div className="flex items-end justify-between border-b border-[#D8D2C5] pb-4">
            <div>
              <span className="text-[11px] text-[#7A7468] uppercase tracking-widest font-normal block mb-1">
                (03)
              </span>
              <h2 className="font-serif-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#111111] font-light italic tracking-tight leading-none">
                Popular
              </h2>
            </div>
            <button
              onClick={() => onNavigateToCollection('all')}
              className="text-xs text-[#5C5850] hover:text-[#111111] transition-colors cursor-pointer font-normal underline underline-offset-4 lowercase"
            >
              see all
            </button>
          </div>

          {/* Wide Dramatic Monochrome Model Banner */}
          <div className="w-full h-56 sm:h-72 md:h-80 lg:h-96 rounded-xs overflow-hidden border border-[#D8D2C5] relative bg-[#111111]">
            <img
              src="https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=2000&q=90"
              alt="Sculptural Molten Earring Campaign"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-[center_35%] filter grayscale contrast-125"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20 pointer-events-none" />
          </div>

          {/* 5-Column Uniform Product Grid (Identical sizing to Collection above) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5">
            {popularFive.map((product) => (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="group cursor-pointer flex flex-col space-y-3 text-left w-full"
              >
                {/* Fixed Uniform Square Box Container */}
                <div className="relative aspect-square w-full bg-[#F5F2EA] border border-[#DDD7CA] rounded-xs flex items-center justify-center p-6 transition-all duration-300 group-hover:bg-[#FAF9F5] group-hover:border-[#CFC7B7] overflow-hidden">
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
                    className="absolute bottom-2.5 right-2.5 p-2 bg-[#111111] hover:bg-[#D4AF37] text-white rounded-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-sm cursor-pointer z-10"
                    title="Quick Add"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Fixed Meta Box directly on linen canvas */}
                <div className="h-10 flex flex-col justify-between pt-0.5">
                  <h4 className="font-serif-display text-xs sm:text-[13px] text-[#111111] group-hover:text-[#D4AF37] transition-colors font-medium truncate block">
                    {product.name}
                  </h4>
                  <p className="text-xs text-[#5C5850] font-normal block">
                    {formatPrice(product.price, currency)}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. VALUE PROPOSITION STRIP */}
      <section className="border-b border-[#E8E2D6] bg-white py-6 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 text-xs font-medium text-[#111111]">
            <div className="w-9 h-9 rounded-full bg-[#FAF8F5] border border-[#E8E2D6] flex items-center justify-center text-[#D4AF37] shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <span className="block font-semibold">Complimentary Shipping</span>
              <span className="text-[10px] text-[#5C5850]">On orders over $150</span>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3 text-xs font-medium text-[#111111]">
            <div className="w-9 h-9 rounded-full bg-[#FAF8F5] border border-[#E8E2D6] flex items-center justify-center text-[#D4AF37] shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="block font-semibold">2-Year Atelier Warranty</span>
              <span className="text-[10px] text-[#5C5850]">Guaranteed craftsmanship</span>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3 text-xs font-medium text-[#111111]">
            <div className="w-9 h-9 rounded-full bg-[#FAF8F5] border border-[#E8E2D6] flex items-center justify-center text-[#D4AF37] shrink-0">
              <Gem className="w-4 h-4" />
            </div>
            <div>
              <span className="block font-semibold">18k Thick Gold Vermeil</span>
              <span className="text-[10px] text-[#5C5850]">Recycled 925 solid silver</span>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3 text-xs font-medium text-[#111111]">
            <div className="w-9 h-9 rounded-full bg-[#FAF8F5] border border-[#E8E2D6] flex items-center justify-center text-[#D4AF37] shrink-0">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <span className="block font-semibold">30-Day Easy Returns</span>
              <span className="text-[10px] text-[#5C5850]">Complimentary return labels</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
