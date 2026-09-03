import React, { useState, useMemo, useRef } from 'react';
import {
  ChevronDown,
  Sparkles,
  SlidersHorizontal,
  X,
  RefreshCw,
  Gem
} from 'lucide-react';
import { Product, Currency, Category, Metal } from '../types';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';

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

  // Fallback safety to ensure products are never empty
  const activeProducts = useMemo(() => {
    if (catalogProducts && catalogProducts.length > 0) {
      return catalogProducts;
    }
    return PRODUCTS;
  }, [catalogProducts]);

  // Filtering & Sorting state
  const [selectedMetal, setSelectedMetal] = useState<Metal | 'all'>('all');
  const [sortBy, setSortBy] = useState<'bestselling' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('bestselling');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  // Category navigation tabs
  const categories: { id: Category; label: string; count: number }[] = [
    { id: 'all', label: 'All Pieces', count: activeProducts.length },
    { id: 'rings', label: 'Rings', count: activeProducts.filter((p) => p.category === 'rings').length },
    { id: 'necklaces', label: 'Necklaces', count: activeProducts.filter((p) => p.category === 'necklaces').length },
    { id: 'earrings', label: 'Earrings', count: activeProducts.filter((p) => p.category === 'earrings').length },
    { id: 'bracelets', label: 'Bracelets', count: activeProducts.filter((p) => p.category === 'bracelets').length },
    { id: 'brooches', label: 'Brooches', count: activeProducts.filter((p) => p.category === 'brooches').length },
  ];

  // Metal filter options
  const metals: { id: Metal | 'all'; label: string }[] = [
    { id: 'all', label: 'All Metals' },
    { id: '18k Gold Vermeil', label: '18k Gold Vermeil' },
    { id: '925 Sterling Silver', label: '925 Sterling Silver' },
    { id: 'Rose Gold', label: 'Rose Gold' },
  ];

  // Filter and sort catalog
  const filteredProducts = useMemo(() => {
    return activeProducts
      .filter((p) => {
        const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
        const matchesMetal = selectedMetal === 'all' || p.metal === selectedMetal;
        return matchesCategory && matchesMetal;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
      });
  }, [activeProducts, selectedCategory, selectedMetal, sortBy]);

  const sortLabels = {
    bestselling: 'Best Selling',
    newest: 'New Arrivals',
    'price-asc': 'Price: Low to High',
    'price-desc': 'Price: High to Low',
    rating: 'Highest Rated',
  };

  const getCategoryHeroTitle = () => {
    switch (selectedCategory) {
      case 'rings':
        return 'Sculptural Rings & Bands';
      case 'necklaces':
        return 'Architectural Necklaces';
      case 'earrings':
        return 'Molten Studs & Hoops';
      case 'bracelets':
        return 'Fluid Cuffs & Bangles';
      case 'brooches':
        return 'Kinetic Statement Brooches';
      default:
        return 'All Fine Jewellery';
    }
  };

  const getCategoryHeroDesc = () => {
    switch (selectedCategory) {
      case 'rings':
        return 'Organic silhouettes and molten contours cast in 3.0-micron 18k gold vermeil and recycled silver.';
      case 'necklaces':
        return 'Interlocking geometric figaro links, baroque pearls, and fluid solitaires designed for effortless stacking.';
      case 'earrings':
        return 'Featherweight hollow-core dome studs, spiraling vortices, and bold drop accents crafted for all-day comfort.';
      case 'bracelets':
        return 'Ergonomic open-wire cuffs tipped with freshwater pearls and sculpted link wristwear.';
      case 'brooches':
        return 'Kinetic precious metal ribbons that elevate silks, tailoring, and evening outerwear.';
      default:
        return 'Timeless Demi-Fine jewellery handcrafted in thick 18k gold vermeil and recycled sterling silver.';
    }
  };

  return (
    <div ref={containerRef} className="pb-24 font-sans-body w-full text-[#413C23] bg-[#E7E4D5]">
      
      {/* 1. TOP EDITORIAL HERO BANNER */}
      <section className="relative w-full bg-[#413C23] text-white min-h-[300px] sm:min-h-[380px] flex flex-col justify-between p-6 sm:p-10 md:p-14 select-none overflow-hidden border-b border-[#D8D2C2]">
        {/* Background Atmosphere Glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1800&q=90"
            alt="Avirena Fine Jewellery Editorial"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-[center_30%] opacity-35 filter contrast-110 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#413C23] via-[#413C23]/70 to-transparent" />
        </div>

        {/* Top Micro Navigation / Breadcrumb */}
        <div className="w-full flex items-center justify-between text-[11px] uppercase tracking-[0.24em] font-light text-[#E7E4D5] z-20">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#8F896D]" />
            Atelier Curated Edition
          </span>
          <span className="text-[#E7E4D5]/80">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'Piece' : 'Pieces'} Available
          </span>
        </div>

        {/* Masthead Title & Description */}
        <div className="w-full z-20 pt-12 sm:pt-16 max-w-3xl">
          <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#8F896D] block mb-2">
            Maison Avirena Collection
          </span>
          <h1 className="font-serif-display text-4xl sm:text-6xl md:text-7xl font-light text-[#E7E4D5] tracking-tight leading-[1.05] text-left select-none drop-shadow-md">
            {getCategoryHeroTitle()}
          </h1>
          <p className="text-xs sm:text-sm text-[#E7E4D5]/80 font-light mt-3 max-w-xl leading-relaxed">
            {getCategoryHeroDesc()}
          </p>
        </div>
      </section>

      {/* 2. FILTER & SORT CONTROLS BAR */}
      <section className="sticky top-0 z-30 w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-4 bg-[#E7E4D5]/95 backdrop-blur-md border-b border-[#D8D2C2] shadow-xs">
        <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Left: Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-xs px-4 py-2 rounded-xs transition-all cursor-pointer font-medium uppercase tracking-wider shrink-0 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#413C23] text-[#E7E4D5] shadow-sm border border-[#413C23]'
                      : 'bg-[#F4EFE6] hover:bg-[#FAF8F5] text-[#413C23] border border-[#D8D2C2]'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-[#8F896D]/30 text-[#E7E4D5]' : 'bg-[#E7E4D5] text-[#8F896D]'}`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right: Metal Filter & Sort Dropdown */}
          <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
            {/* Metal Selector */}
            <div className="flex items-center gap-1 bg-[#F4EFE6] border border-[#D8D2C2] rounded-xs px-2.5 py-1.5 text-xs text-[#413C23]">
              <Gem className="w-3.5 h-3.5 text-[#8F896D]" />
              <select
                value={selectedMetal}
                onChange={(e) => setSelectedMetal(e.target.value as Metal | 'all')}
                className="bg-transparent text-xs text-[#413C23] font-medium uppercase tracking-wider focus:outline-none cursor-pointer"
              >
                {metals.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#F4EFE6] border border-[#D8D2C2] rounded-xs text-xs text-[#413C23] hover:border-[#8F896D] transition-all cursor-pointer font-medium uppercase tracking-wider"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#8F896D]" />
                <span className="hidden sm:inline text-[#8F896D]">Sort:</span>
                <span>{sortLabels[sortBy]}</span>
                <ChevronDown className="w-3.5 h-3.5 stroke-[1.5] text-[#8F896D]" />
              </button>

              {sortDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-[#E7E4D5] border border-[#D8D2C2] rounded-xs shadow-xl py-1 z-40 animate-in fade-in zoom-in-95 duration-150">
                  {(Object.keys(sortLabels) as (keyof typeof sortLabels)[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => {
                        setSortBy(key);
                        setSortDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between hover:bg-[#F4EFE6] cursor-pointer ${
                        sortBy === key ? 'font-bold text-[#413C23] bg-[#F4EFE6]' : 'text-[#413C23]/80'
                      }`}
                    >
                      <span>{sortLabels[key]}</span>
                      {sortBy === key && <Sparkles className="w-3.5 h-3.5 text-[#8F896D]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRODUCT CATALOG GRID */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-10 sm:py-14">
        {filteredProducts.length === 0 ? (
          /* Empty State */
          <div className="w-full py-20 text-center space-y-4 max-w-md mx-auto">
            <div className="w-14 h-14 bg-[#F4EFE6] border border-[#D8D2C2] rounded-full mx-auto flex items-center justify-center text-[#8F896D]">
              <RefreshCw className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h3 className="font-serif-display text-2xl text-[#413C23]">No Jewellery Pieces Found</h3>
            <p className="text-xs text-[#8F896D] leading-relaxed">
              No items match your current filter selection. Try clearing your filters to view all available pieces.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedMetal('all');
              }}
              className="px-6 py-2.5 bg-[#413C23] text-[#E7E4D5] hover:bg-[#8F896D] text-xs uppercase tracking-widest font-semibold rounded-xs transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* Responsive Product Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                currency={currency}
                onSelect={onSelectProduct}
                onQuickAdd={onQuickAdd}
                onQuickView={onQuickView}
                isWishlisted={isWishlisted(product.id)}
                onToggleWishlist={onToggleWishlist}
              />
            ))}
          </div>
        )}
      </section>

    </div>
  );
};
