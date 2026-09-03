import React, { useState, useMemo, useRef } from 'react';
import {
  ChevronDown,
  ShoppingBag,
  Heart,
  ArrowRight,
  Sparkles,
  Check,
} from 'lucide-react';
import { Product, Currency, Category } from '../types';
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
  currency,
  isWishlisted,
  onToggleWishlist,
  catalogProducts = PRODUCTS,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Sorting state
  const [sortBy, setSortBy] = useState<'bestselling' | 'price-asc' | 'price-desc' | 'rating'>('bestselling');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  // Category filter pills
  const categories: { id: Category; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: catalogProducts.length },
    { id: 'rings', label: 'Rings', count: catalogProducts.filter((p) => p.category === 'rings').length },
    { id: 'necklaces', label: 'Necklaces', count: catalogProducts.filter((p) => p.category === 'necklaces').length },
    { id: 'earrings', label: 'Earrings', count: catalogProducts.filter((p) => p.category === 'earrings').length },
    { id: 'bracelets', label: 'Bracelets', count: catalogProducts.filter((p) => p.category === 'bracelets').length },
    { id: 'brooches', label: 'Brooches', count: catalogProducts.filter((p) => p.category === 'brooches').length },
  ];

  // Filter and sort catalog
  const filteredProducts = useMemo(() => {
    return catalogProducts
      .filter((p) => selectedCategory === 'all' || p.category === selectedCategory)
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
      });
  }, [catalogProducts, selectedCategory, sortBy]);

  // Specific products mapped for the editorial layout (matching reference image)
  const editorialPieces = {
    // Large top-left on-model square
    squareNecklace: catalogProducts.find((p) => p.id === 'square-form-necklace') || catalogProducts[0],
    
    // Top-right 2x2 grid
    lucidStuds: catalogProducts.find((p) => p.id === 'lucid-studs') || catalogProducts[1],
    solidBrooch: catalogProducts.find((p) => p.id === 'solid-wave-brooch') || catalogProducts[2],
    ornatePendant: catalogProducts.find((p) => p.id === 'ornate-scroll-pendant') || catalogProducts[3],
    twoPearlCuff: catalogProducts.find((p) => p.id === 'two-pearl-cuff') || catalogProducts[4],

    // Middle 4-item row 1
    twinHoop: catalogProducts.find((p) => p.id === 'twin-hoop-earrings') || catalogProducts[5],
    rowRing: catalogProducts.find((p) => p.id === 'row-edge-ring') || catalogProducts[6],
    waveRing: catalogProducts.find((p) => p.id === 'wave-prism-ring') || catalogProducts[7],
    shellStuds: catalogProducts.find((p) => p.id === 'dome-studs') || catalogProducts[8],

    // Middle 4-item row 2
    goldCurveNecklace: catalogProducts.find((p) => p.id === 'gold-curve-necklace') || catalogProducts[9],
    aureliaEarrings: catalogProducts.find((p) => p.id === 'aurelia-hoops') || catalogProducts[10],
    linkedHeartBracelet: catalogProducts.find((p) => p.id === 'linked-heart-bracelet') || catalogProducts[11],
    scaloBracelet: catalogProducts.find((p) => p.id === 'scalo-bracelet') || catalogProducts[12],

    // Bottom 2 large on-model cards
    domeStudsOnModel: catalogProducts.find((p) => p.id === 'dome-studs') || catalogProducts[13] || catalogProducts[1],
    pearlDropOnModel: catalogProducts.find((p) => p.id === 'baroque-pearl-choker') || catalogProducts[14] || catalogProducts[0],
  };

  const sortLabels = {
    bestselling: 'Best selling',
    'price-asc': 'Price: Low to High',
    'price-desc': 'Price: High to Low',
    rating: 'Highest Rated',
  };

  return (
    <div ref={containerRef} className="pb-24 font-sans-body w-full text-[#111111] bg-[#EAE6DC]">
      
      {/* 1. TOP EDITORIAL HERO BANNER (Exact Reference Match) */}
      <section className="relative w-full bg-[#86806C] text-white min-h-[360px] sm:min-h-[460px] md:min-h-[540px] flex flex-col justify-between p-6 sm:p-10 md:p-12 lg:px-16 lg:py-12 select-none overflow-hidden border-b border-[#D8D2C5]">
        
        {/* Top Micro Header */}
        <div className="w-full flex items-center justify-between text-[11px] uppercase tracking-[0.2em] font-light text-white/80 z-20">
          <span>modern jewelry designed to last</span>
          <span>HOME PAGE / SHOP ({selectedCategory.toUpperCase()})</span>
        </div>

        {/* Center Editorial On-Model Beauty Image */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1800&q=90"
            alt="Avirena Fine Jewelry Campaign"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-[center_28%] opacity-90 filter contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#86806C]/90 via-black/20 to-[#86806C]/60" />
        </div>

        {/* Giant Masthead: ALL JEWELRY (or Selected Category) */}
        <div className="w-full z-20 pt-24 sm:pt-36 md:pt-48">
          <h1 className="font-serif-display text-6xl sm:text-8xl md:text-9xl lg:text-[11vw] font-light text-white tracking-tight leading-[0.85] text-left select-none uppercase drop-shadow-sm">
            {selectedCategory === 'all' ? 'ALL JEWELRY' : selectedCategory}
          </h1>
        </div>
      </section>

      {/* 2. FILTER PILLS & SORT BAR (Exact Reference Match) */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-6 border-b border-[#D8D2C5] bg-[#EAE6DC]">
        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Left Category Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-xs px-3.5 py-1.5 rounded-xs transition-all cursor-pointer font-medium uppercase tracking-wider ${
                    isActive
                      ? 'bg-[#7D7864] text-white shadow-xs'
                      : 'bg-[#DDD8CD] hover:bg-[#D4CEBF] text-[#3E3A32] border border-[#D0C9BA]'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className="ml-1 opacity-70 text-[10px]">({cat.count})</span>
                </button>
              );
            })}
          </div>

          {/* Right Sort Dropdown */}
          <div className="relative self-end sm:self-auto">
            <button
              onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              className="flex items-center gap-1.5 text-xs text-[#5C5850] hover:text-[#111111] transition-colors cursor-pointer bg-transparent py-1 uppercase tracking-wider font-normal"
            >
              <span>Sort by:</span>
              <span className="font-semibold text-[#111111]">{sortLabels[sortBy]}</span>
              <ChevronDown className="w-3.5 h-3.5 stroke-[1.5]" />
            </button>

            {sortDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#F5F2EA] border border-[#DDD7CA] rounded-xs shadow-xl py-1 z-30 animate-in fade-in zoom-in-95 duration-150">
                {(Object.keys(sortLabels) as (keyof typeof sortLabels)[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSortBy(key);
                      setSortDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-[#EAE6DC] cursor-pointer ${
                      sortBy === key ? 'font-semibold text-[#111111] bg-[#EAE6DC]' : 'text-[#5C5850]'
                    }`}
                  >
                    <span>{sortLabels[key]}</span>
                    {sortBy === key && <Check className="w-3.5 h-3.5 text-[#D4AF37]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </section>

      {/* 3. ASYMMETRIC EDITORIAL PRODUCT GRID (Exact Reference Match) */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-10 sm:py-16">
        
        {/* VIEW A: When viewing "All" Pieces -> Render the exact Asymmetric Editorial Layout */}
        {selectedCategory === 'all' ? (
          <div className="space-y-6 sm:space-y-8">
            
            {/* BLOCK 1: TOP ASYMMETRIC SECTION (Left 2-col tall card + Right 2-col 2x2 grid) */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-5">
              
              {/* Left 2 Columns: Tall On-Model Square Form Necklace Card */}
              <div
                onClick={() => onSelectProduct(editorialPieces.squareNecklace)}
                className="lg:col-span-2 group cursor-pointer flex flex-col space-y-3 text-left"
              >
                <div className="relative aspect-square w-full bg-[#F5F2EA] border border-[#DDD7CA] rounded-xs overflow-hidden transition-all duration-300 group-hover:bg-[#FAF9F5] group-hover:border-[#CFC7B7]">
                  <img
                    src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=90"
                    alt={editorialPieces.squareNecklace.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickAdd(editorialPieces.squareNecklace);
                    }}
                    className="absolute bottom-3 right-3 p-2.5 bg-[#111111] hover:bg-[#D4AF37] text-white rounded-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-md cursor-pointer z-10"
                    title="Quick Add"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
                <div className="h-10 flex flex-col justify-between pt-0.5">
                  <h4 className="font-serif-display text-xs sm:text-sm text-[#111111] group-hover:text-[#D4AF37] transition-colors font-medium truncate block">
                    {editorialPieces.squareNecklace.name}
                  </h4>
                  <p className="text-xs text-[#5C5850] font-normal block">
                    {formatPrice(editorialPieces.squareNecklace.price, currency)}
                  </p>
                </div>
              </div>

              {/* Right 2 Columns: 2x2 Grid of 4 Items */}
              <div className="lg:col-span-2 grid grid-cols-2 gap-4 sm:gap-5">
                {[
                  editorialPieces.lucidStuds,
                  editorialPieces.solidBrooch,
                  editorialPieces.ornatePendant,
                  editorialPieces.twoPearlCuff,
                ].map((product) => (
                  <div
                    key={product.id}
                    onClick={() => onSelectProduct(product)}
                    className="group cursor-pointer flex flex-col space-y-3 text-left w-full"
                  >
                    <div className="relative aspect-square w-full bg-[#F5F2EA] border border-[#DDD7CA] rounded-xs flex items-center justify-center p-5 sm:p-6 transition-all duration-300 group-hover:bg-[#FAF9F5] group-hover:border-[#CFC7B7] overflow-hidden">
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
                        className="absolute bottom-2 right-2 p-1.5 bg-[#111111] hover:bg-[#D4AF37] text-white rounded-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-sm cursor-pointer z-10"
                        title="Quick Add"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </button>
                    </div>
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

            {/* BLOCK 2: 4-COLUMN ROW 1 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {[
                editorialPieces.twinHoop,
                editorialPieces.rowRing,
                editorialPieces.waveRing,
                editorialPieces.shellStuds,
              ].map((product) => (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="group cursor-pointer flex flex-col space-y-3 text-left w-full"
                >
                  <div className="relative aspect-square w-full bg-[#F5F2EA] border border-[#DDD7CA] rounded-xs flex items-center justify-center p-5 sm:p-6 transition-all duration-300 group-hover:bg-[#FAF9F5] group-hover:border-[#CFC7B7] overflow-hidden">
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
                      className="absolute bottom-2 right-2 p-1.5 bg-[#111111] hover:bg-[#D4AF37] text-white rounded-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-sm cursor-pointer z-10"
                      title="Quick Add"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  </div>
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

            {/* BLOCK 3: 4-COLUMN ROW 2 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {[
                editorialPieces.goldCurveNecklace,
                editorialPieces.aureliaEarrings,
                editorialPieces.linkedHeartBracelet,
                editorialPieces.scaloBracelet,
              ].map((product) => (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="group cursor-pointer flex flex-col space-y-3 text-left w-full"
                >
                  <div className="relative aspect-square w-full bg-[#F5F2EA] border border-[#DDD7CA] rounded-xs flex items-center justify-center p-5 sm:p-6 transition-all duration-300 group-hover:bg-[#FAF9F5] group-hover:border-[#CFC7B7] overflow-hidden">
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
                      className="absolute bottom-2 right-2 p-1.5 bg-[#111111] hover:bg-[#D4AF37] text-white rounded-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-sm cursor-pointer z-10"
                      title="Quick Add"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  </div>
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

            {/* BLOCK 4: BOTTOM 2 LARGE EDITORIAL ON-MODEL CARDS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
              
              {/* Large Card 1: Dome Studs on Model */}
              <div
                onClick={() => onSelectProduct(editorialPieces.domeStudsOnModel)}
                className="group cursor-pointer flex flex-col space-y-3 text-left"
              >
                <div className="relative aspect-square w-full bg-[#F5F2EA] border border-[#DDD7CA] rounded-xs overflow-hidden transition-all duration-300 group-hover:bg-[#FAF9F5] group-hover:border-[#CFC7B7]">
                  <img
                    src="https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1200&q=90"
                    alt="Dome Studs on Model"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickAdd(editorialPieces.domeStudsOnModel);
                    }}
                    className="absolute bottom-3 right-3 p-2.5 bg-[#111111] hover:bg-[#D4AF37] text-white rounded-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-md cursor-pointer z-10"
                    title="Quick Add"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
                <div className="h-10 flex flex-col justify-between pt-0.5">
                  <h4 className="font-serif-display text-xs sm:text-sm text-[#111111] group-hover:text-[#D4AF37] transition-colors font-medium truncate block">
                    {editorialPieces.domeStudsOnModel.name}
                  </h4>
                  <p className="text-xs text-[#5C5850] font-normal block">
                    {formatPrice(editorialPieces.domeStudsOnModel.price, currency)}
                  </p>
                </div>
              </div>

              {/* Large Card 2: Pearl Drop Necklace on Model */}
              <div
                onClick={() => onSelectProduct(editorialPieces.pearlDropOnModel)}
                className="group cursor-pointer flex flex-col space-y-3 text-left"
              >
                <div className="relative aspect-square w-full bg-[#F5F2EA] border border-[#DDD7CA] rounded-xs overflow-hidden transition-all duration-300 group-hover:bg-[#FAF9F5] group-hover:border-[#CFC7B7]">
                  <img
                    src="https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=1200&q=90"
                    alt="Pearl Drop Necklace on Model"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickAdd(editorialPieces.pearlDropOnModel);
                    }}
                    className="absolute bottom-3 right-3 p-2.5 bg-[#111111] hover:bg-[#D4AF37] text-white rounded-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-md cursor-pointer z-10"
                    title="Quick Add"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
                <div className="h-10 flex flex-col justify-between pt-0.5">
                  <h4 className="font-serif-display text-xs sm:text-sm text-[#111111] group-hover:text-[#D4AF37] transition-colors font-medium truncate block">
                    {editorialPieces.pearlDropOnModel.name}
                  </h4>
                  <p className="text-xs text-[#5C5850] font-normal block">
                    {formatPrice(editorialPieces.pearlDropOnModel.price, currency)}
                  </p>
                </div>
              </div>

            </div>

          </div>
        ) : (
          /* VIEW B: Filtered View (e.g. Rings, Necklaces, etc.) -> Clean 4-Column Grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="group cursor-pointer flex flex-col space-y-3 text-left w-full"
              >
                <div className="relative aspect-square w-full bg-[#F5F2EA] border border-[#DDD7CA] rounded-xs flex items-center justify-center p-5 sm:p-6 transition-all duration-300 group-hover:bg-[#FAF9F5] group-hover:border-[#CFC7B7] overflow-hidden">
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
                    className="absolute bottom-2 right-2 p-1.5 bg-[#111111] hover:bg-[#D4AF37] text-white rounded-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-sm cursor-pointer z-10"
                    title="Quick Add"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </button>
                </div>
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
        )}

      </section>

    </div>
  );
};
