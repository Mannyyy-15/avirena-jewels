import React, { useState, useMemo, useRef } from 'react';
import {
  ChevronDown,
  ShoppingBag,
  SlidersHorizontal,
  Check,
  Sparkles
} from 'lucide-react';
import { Product, Currency, Category, Metal } from '../types';
import { PRODUCTS, formatPrice } from '../data/products';

interface CollectionPageProps {
  selectedCategory: Category;
  setSelectedCategory: (cat: Category) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  currency: Currency;
  isWishlisted: (id: string) => boolean;
  onToggleWishlist: (product: Product) => void;
  catalogProducts?: Product[];
}

export const CollectionPage: React.FC<CollectionPageProps> = ({
  selectedCategory,
  setSelectedCategory,
  onSelectProduct,
  onQuickAdd,
  onQuickView,
  currency,
  isWishlisted,
  onToggleWishlist,
  catalogProducts = PRODUCTS,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Fallback safety to ensure catalog is always populated and never throws undefined
  const activeProducts = useMemo(() => {
    if (catalogProducts && catalogProducts.length > 0) {
      return catalogProducts;
    }
    return PRODUCTS;
  }, [catalogProducts]);

  // Filtering & Sorting state
  const [sortBy, setSortBy] = useState<'bestselling' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('bestselling');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  // Category navigation tabs matching reference
  const categories: { id: Category; label: string; count: number }[] = [
    { id: 'all', label: 'All Jewelry', count: activeProducts.length },
    { id: 'necklaces', label: 'Necklaces', count: activeProducts.filter((p) => p.category === 'necklaces').length },
    { id: 'bracelets', label: 'Bracelets', count: activeProducts.filter((p) => p.category === 'bracelets').length },
    { id: 'rings', label: 'Rings', count: activeProducts.filter((p) => p.category === 'rings').length },
    { id: 'earrings', label: 'Earrings', count: activeProducts.filter((p) => p.category === 'earrings').length },
    { id: 'brooches', label: 'Brooches', count: activeProducts.filter((p) => p.category === 'brooches').length },
  ];

  // Filter and sort catalog
  const filteredProducts = useMemo(() => {
    return activeProducts
      .filter((p) => {
        return selectedCategory === 'all' || p.category === selectedCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
      });
  }, [activeProducts, selectedCategory, sortBy]);

  const sortLabels = {
    bestselling: 'Best selling',
    newest: 'New arrivals',
    'price-asc': 'Price: Low to high',
    'price-desc': 'Price: High to low',
    rating: 'Highest rated',
  };

  const getMastheadTitle = () => {
    switch (selectedCategory) {
      case 'necklaces':
        return 'NECKLACES';
      case 'bracelets':
        return 'BRACELETS';
      case 'rings':
        return 'RINGS';
      case 'earrings':
        return 'EARRINGS';
      case 'brooches':
        return 'BROOCHES';
      default:
        return 'ALL JEWELRY';
    }
  };

  // Find specific key pieces for the editorial layout blocks
  const squareFormPiece = activeProducts.find((p) => p.id === 'square-form-necklace') || activeProducts[0];
  const domeStudsPiece = activeProducts.find((p) => p.id === 'dome-studs') || activeProducts[13] || activeProducts[2];
  const pearlDropPiece = activeProducts.find((p) => p.id === 'two-pearl-cuff' || p.id === 'gold-curve-necklace') || activeProducts[4];

  // Separate non-feature pieces for uniform grid
  const standardGridPieces = filteredProducts.filter(
    (p) => selectedCategory !== 'all' || (p.id !== squareFormPiece?.id && p.id !== domeStudsPiece?.id && p.id !== pearlDropPiece?.id)
  );

  return (
    <div ref={containerRef} className="pb-24 font-sans-body w-full text-[#413C23] bg-[#E7E4D5] select-none">
      
      {/* 1. EXACT REFERENCE EDITORIAL MASTHEAD BANNER */}
      <section className="relative w-full bg-[#8F896D] text-[#E7E4D5] min-h-[360px] sm:min-h-[460px] md:min-h-[520px] flex flex-col justify-between p-6 sm:p-10 md:p-12 lg:px-16 2xl:px-20 select-none overflow-hidden border-b border-[#D8D2C2]">
        
        {/* Background Panoramic High-Fashion Model Portrait */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=2000&q=90"
            alt="Avirena Jewelry Editorial Model"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-[center_35%] filter contrast-105 opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#413C23]/80 via-[#413C23]/30 to-black/25" />
        </div>

        {/* Top Micro Header */}
        <div className="w-full flex items-center justify-between text-[11px] sm:text-xs font-normal uppercase tracking-[0.2em] text-[#FAF8F5]/90 z-20">
          <span className="font-light">
            Modern jewelry designed in-house
          </span>
          <span className="text-[10px] sm:text-[11px] tracking-[0.25em] text-[#FAF8F5]/80">
            HOME PAGE / SHOP ALL
          </span>
        </div>

        {/* Center / Bottom Grand Headline Touching Lower Edge */}
        <div className="w-full z-20 pt-16 sm:pt-28 text-center">
          <h1 className="font-serif-display text-6xl sm:text-8xl md:text-9xl lg:text-[11vw] font-light text-[#FAF8F5] tracking-tight leading-none uppercase drop-shadow-sm select-none">
            {getMastheadTitle()}
          </h1>
        </div>
      </section>

      {/* 2. STICKY CATEGORY PILLS & SORT BAR (Matching Reference) */}
      <section className="sticky top-0 z-30 w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-3 bg-[#E7E4D5]/98 backdrop-blur-md border-b border-[#D8D2C2] shadow-2xs">
        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Left: Category Filter Pills with Counts */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-xs px-3.5 py-1.5 rounded-xs transition-all cursor-pointer font-medium uppercase tracking-wider shrink-0 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#8F896D] text-[#FAF8F5] shadow-xs border border-[#8F896D]'
                      : 'bg-[#FAF8F5] text-[#413C23] border border-[#D8D2C2] hover:border-[#8F896D]'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className="text-[11px] opacity-80">
                    ({cat.count})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right: Sort by Dropdown */}
          <div className="relative shrink-0 text-right">
            <button
              onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              className="inline-flex items-center gap-1.5 text-xs text-[#413C23] hover:text-[#8F896D] transition-colors cursor-pointer py-1 font-medium tracking-wide"
            >
              <span className="text-[#8F896D]">Sort by:</span>
              <span className="underline underline-offset-2">{sortLabels[sortBy]}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-[#8F896D] transition-transform duration-200 ${sortDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {sortDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs shadow-xl py-1 z-40 animate-in fade-in zoom-in-95 duration-150 text-left">
                {(Object.keys(sortLabels) as (keyof typeof sortLabels)[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSortBy(key);
                      setSortDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-[#F4EFE6] cursor-pointer transition-colors ${
                      sortBy === key ? 'font-bold text-[#413C23] bg-[#F4EFE6]' : 'text-[#413C23]/80'
                    }`}
                  >
                    <span>{sortLabels[key]}</span>
                    {sortBy === key && <Check className="w-3.5 h-3.5 text-[#8F896D]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </section>

      {/* 3. EDITORIAL ASYMMETRICAL CATALOG GRID (Matching Reference) */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 pt-8 sm:pt-12">
        <div className="w-full space-y-6 sm:space-y-8">
          
          {/* SECTION A: 4-Column Grid with Big 2x2 Feature Hero on Left */}
          {selectedCategory === 'all' && squareFormPiece && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-start">
              
              {/* BIG 2x2 Feature Hero Card: Square Form Necklace Model */}
              <div
                onClick={() => onSelectProduct(squareFormPiece)}
                className="sm:col-span-2 sm:row-span-2 group cursor-pointer flex flex-col justify-between text-left h-full space-y-3"
              >
                <div className="relative aspect-[4/5] sm:aspect-square w-full bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs overflow-hidden transition-all duration-300 group-hover:border-[#8F896D]">
                  <img
                    src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=90"
                    alt={squareFormPiece.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-[center_35%] group-hover:scale-103 transition-transform duration-700 ease-out"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickAdd(squareFormPiece);
                    }}
                    className="absolute bottom-3 right-3 p-3 bg-[#413C23] hover:bg-[#8F896D] text-[#FAF8F5] rounded-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-md cursor-pointer z-10"
                    title="Quick Add to Bag"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-0.5 pt-1">
                  <h3 className="font-serif-display text-sm sm:text-base font-medium text-[#413C23] group-hover:text-[#8F896D] transition-colors">
                    {squareFormPiece.name}
                  </h3>
                  <p className="text-xs text-[#8F896D] font-normal">
                    {formatPrice(squareFormPiece.price, currency)}
                  </p>
                </div>
              </div>

              {/* Top Right 4 Pieces (Cols 3 & 4) */}
              {activeProducts
                .filter((p) => p.id !== squareFormPiece.id)
                .slice(0, 4)
                .map((product) => (
                  <div
                    key={product.id}
                    onClick={() => onSelectProduct(product)}
                    className="group cursor-pointer flex flex-col space-y-3 text-left w-full"
                  >
                    <div className="relative aspect-square w-full bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs flex items-center justify-center p-6 transition-all duration-300 group-hover:bg-white group-hover:border-[#8F896D] overflow-hidden">
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
                        className="absolute bottom-2.5 right-2.5 p-2 bg-[#413C23] hover:bg-[#8F896D] text-[#FAF8F5] rounded-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-sm cursor-pointer z-10"
                        title="Quick Add"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </button>
                    </div>

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
          )}

          {/* SECTION B: UNIFORM 4-COLUMN PRODUCT GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {(selectedCategory === 'all' ? standardGridPieces.slice(4) : filteredProducts).map((product) => (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="group cursor-pointer flex flex-col space-y-3 text-left w-full"
              >
                <div className="relative aspect-square w-full bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs flex items-center justify-center p-6 transition-all duration-300 group-hover:bg-white group-hover:border-[#8F896D] overflow-hidden">
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
                    className="absolute bottom-2.5 right-2.5 p-2 bg-[#413C23] hover:bg-[#8F896D] text-[#FAF8F5] rounded-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-sm cursor-pointer z-10"
                    title="Quick Add"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </button>
                </div>

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

          {/* SECTION C: BOTTOM DUAL CAMPAIGN HERO CARDS (Matching Reference) */}
          {selectedCategory === 'all' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-4">
              
              {/* Left Dual Feature: Dome Studs Model */}
              <div
                onClick={() => {
                  if (domeStudsPiece) onSelectProduct(domeStudsPiece);
                }}
                className="group cursor-pointer flex flex-col space-y-3 text-left w-full"
              >
                <div className="relative aspect-[4/5] sm:aspect-square w-full bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs overflow-hidden transition-all duration-300 group-hover:border-[#8F896D]">
                  <img
                    src="https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1200&q=90"
                    alt="Dome Studs Campaign Model"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-[center_35%] group-hover:scale-103 transition-transform duration-700 ease-out"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (domeStudsPiece) onQuickAdd(domeStudsPiece);
                    }}
                    className="absolute bottom-3 right-3 p-3 bg-[#413C23] hover:bg-[#8F896D] text-[#FAF8F5] rounded-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-md cursor-pointer z-10"
                    title="Quick Add to Bag"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-0.5 pt-1">
                  <h3 className="font-serif-display text-sm sm:text-base font-medium text-[#413C23] group-hover:text-[#8F896D] transition-colors">
                    {domeStudsPiece?.name || 'Dome Studs'}
                  </h3>
                  <p className="text-xs text-[#8F896D] font-normal">
                    {formatPrice(domeStudsPiece?.price || 155, currency)}
                  </p>
                </div>
              </div>

              {/* Right Dual Feature: Baroque Pearl Pendant Model */}
              <div
                onClick={() => {
                  if (pearlDropPiece) onSelectProduct(pearlDropPiece);
                }}
                className="group cursor-pointer flex flex-col space-y-3 text-left w-full"
              >
                <div className="relative aspect-[4/5] sm:aspect-square w-full bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs overflow-hidden transition-all duration-300 group-hover:border-[#8F896D]">
                  <img
                    src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=90"
                    alt="Pearl Drop Pendant Campaign Model"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-[center_30%] group-hover:scale-103 transition-transform duration-700 ease-out"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (pearlDropPiece) onQuickAdd(pearlDropPiece);
                    }}
                    className="absolute bottom-3 right-3 p-3 bg-[#413C23] hover:bg-[#8F896D] text-[#FAF8F5] rounded-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-md cursor-pointer z-10"
                    title="Quick Add to Bag"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-0.5 pt-1">
                  <h3 className="font-serif-display text-sm sm:text-base font-medium text-[#413C23] group-hover:text-[#8F896D] transition-colors">
                    {pearlDropPiece?.name || 'Baroque Pearl Drop'}
                  </h3>
                  <p className="text-xs text-[#8F896D] font-normal">
                    {formatPrice(pearlDropPiece?.price || 195, currency)}
                  </p>
                </div>
              </div>

            </div>
          )}

        </div>
      </section>

    </div>
  );
};
