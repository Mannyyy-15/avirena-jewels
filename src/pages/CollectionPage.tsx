import React, { useState, useMemo, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Product, Currency, Category, Metal } from '../types';
import { PRODUCTS, formatPrice } from '../data/products';
import { ChevronDown, Heart, Check } from 'lucide-react';

interface CollectionPageProps {
  products: Product[];
  selectedCategory: Category;
  setSelectedCategory: (cat: Category) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  currency: Currency;
  isWishlisted: (productId: string) => boolean;
  onToggleWishlist: (product: Product) => void;
  onNavigateHome: () => void;
}

export const CollectionPage: React.FC<CollectionPageProps> = ({
  products,
  selectedCategory,
  setSelectedCategory,
  onSelectProduct,
  onQuickAdd,
  currency,
  isWishlisted,
  onToggleWishlist,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedMetal, setSelectedMetal] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  
  // Dropdown states for filter pills
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [metalDropdownOpen, setMetalDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedCategory, selectedMetal]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (selectedCategory && selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (selectedMetal && selectedMetal !== 'all') {
      list = list.filter((p) => {
        if (selectedMetal === 'brass') return p.metal.toLowerCase().includes('brass') || p.metal.toLowerCase().includes('gold');
        if (selectedMetal === 'alloy') return p.metal.toLowerCase().includes('alloy') || p.metal.toLowerCase().includes('silver');
        if (selectedMetal === 'anti-tarnish') return p.metal.toLowerCase().includes('anti-tarnish');
        return true;
      });
    }

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => (b.rating || 5) - (a.rating || 5));
    }

    return list;
  }, [products, selectedCategory, selectedMetal, sortBy]);

  const getMastheadTitle = () => {
    if (selectedCategory === 'all') return 'ALL JEWELRY';
    return selectedCategory.toUpperCase();
  };

  const sortLabels = {
    featured: 'Featured',
    'price-asc': 'Price: Low to High',
    'price-desc': 'Price: High to Low',
    rating: 'Top Rated',
  };

  // Curated products for exact Italian Editorial Grid
  const layeredNecklace = products.find((p) => p.id === 'layered-chain-necklace') || products[0] || PRODUCTS[0];
  const lucidStuds = products.find((p) => p.id === 'lucid-studs') || products[1] || PRODUCTS[1];
  const solidBrooch = products.find((p) => p.id === 'solid-brooch') || products[2] || PRODUCTS[2];
  const ornatePendant = products.find((p) => p.id === 'ornate-pendant') || products[3] || PRODUCTS[3];
  const twoPearlCuff = products.find((p) => p.id === 'two-pearl-cuff') || products[4] || PRODUCTS[4];
  const tideHoop = products.find((p) => p.id === 'tide-hoop') || products[5] || PRODUCTS[5];
  const starEdgeRing = products.find((p) => p.id === 'star-edge-ring') || products[6] || PRODUCTS[6];
  const waveMiracleRing = products.find((p) => p.id === 'wave-miracle-ring') || products[7] || PRODUCTS[7];
  const shellStuds = products.find((p) => p.id === 'shell-studs') || products[8] || PRODUCTS[8];
  const goldCurveNecklace = products.find((p) => p.id === 'gold-curve-necklace') || products[9] || PRODUCTS[9];
  const aureusEarrings = products.find((p) => p.id === 'aureus-earrings') || products[10] || PRODUCTS[10];
  const linkedHeartBracelet = products.find((p) => p.id === 'linked-heart-bracelet') || products[11] || PRODUCTS[11];
  const sculpBracelet = products.find((p) => p.id === 'sculp-bracelet') || products[12] || PRODUCTS[12];
  const domeStuds = products.find((p) => p.id === 'dome-studs') || products[13] || PRODUCTS[13];
  const pearlDropNecklace = products.find((p) => p.id === 'pearl-drop-necklace') || products[14] || PRODUCTS[14];

  const editorialUsedIds = new Set([
    layeredNecklace.id,
    lucidStuds.id,
    solidBrooch.id,
    ornatePendant.id,
    twoPearlCuff.id,
    tideHoop.id,
    starEdgeRing.id,
    waveMiracleRing.id,
    shellStuds.id,
    goldCurveNecklace.id,
    aureusEarrings.id,
    linkedHeartBracelet.id,
    sculpBracelet.id,
    domeStuds.id,
    pearlDropNecklace.id,
  ]);

  const remainingProducts = filteredProducts.filter((p) => !editorialUsedIds.has(p.id));

  // Render a single standard card
  const renderProductCard = (product: Product, customTitle?: string, customPrice?: number) => {
    const wishlisted = isWishlisted(product.id);
    const displayPrice = customPrice !== undefined ? customPrice : product.price;

    return (
      <div
        key={product.id}
        onClick={() => onSelectProduct(product)}
        className="group relative flex flex-col bg-[#E7E4D5] border border-[#D8D2C2] rounded-xs hover:border-[#8F896D] hover:shadow-[0_8px_20px_rgba(65,60,35,0.08)] transition-all duration-300 cursor-pointer p-4 sm:p-5 select-none text-left"
      >
        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-4 right-4 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
            wishlisted
              ? 'bg-[#413C23] text-white opacity-100 shadow-xs'
              : 'bg-[#E7E4D5]/90 text-[#413C23] opacity-0 group-hover:opacity-100 hover:bg-[#FAF8F5] border border-[#D8D2C2] shadow-xs'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-[#7A0F1A] text-[#7A0F1A]' : ''}`} />
        </button>

        {/* Product Image */}
        <div className="relative aspect-square w-full flex items-center justify-center overflow-hidden mb-3">
          <img
            src={product.images[0]}
            alt={product.name}
            referrerPolicy="no-referrer"
            loading="lazy"
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-106 transition-transform duration-500 ease-out"
          />
        </div>

        {/* Text Details with Prominent Bold Price */}
        <div className="flex flex-col text-left space-y-1">
          <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-[#8F896D]">
            {product.metal}
          </span>
          <h3 className="font-serif-display text-base sm:text-lg font-normal text-[#413C23] group-hover:text-[#8F896D] transition-colors leading-snug truncate">
            {customTitle || product.name}
          </h3>
          <p className="text-base sm:text-lg font-bold text-[#413C23] tracking-tight mt-0.5">
            {formatPrice(displayPrice, currency)}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div ref={containerRef} className="pb-10 font-sans-body w-full text-[#413C23] bg-[#E7E4D5] select-none">
      
      {/* 1. HERO MASTHEAD BANNER */}
      <section className="relative w-full bg-[#8A8568] text-[#FAF8F5] min-h-[360px] sm:min-h-[420px] md:min-h-[480px] flex flex-col justify-between pt-8 sm:pt-10 px-4 sm:px-8 lg:px-12 select-none overflow-hidden border-b border-[#7B765B]">
        
        {/* Centered Editorial High-Fashion Model Portrait */}
        <div className="absolute inset-x-0 top-0 bottom-12 flex justify-center items-start pointer-events-none overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=95"
            alt="Avirena Jewelry Editorial Model"
            referrerPolicy="no-referrer"
            className="h-[115%] w-auto max-w-none object-cover object-top filter contrast-[1.03] opacity-95 translate-y-[-5%]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#8A8568]/40 via-transparent to-[#8A8568] pointer-events-none" />
        </div>

        {/* Sub-Header Text Elements (Mid Left & Mid Right) */}
        <div className="relative z-10 w-full flex items-center justify-between text-[11px] sm:text-xs font-serif text-[#FAF8F5]/90 pt-1">
          <span className="italic tracking-wider font-light">
            Homegrown dailywear jewels
          </span>
          <span className="uppercase tracking-[0.2em] font-sans-body text-[10px] sm:text-[11px] font-medium text-[#FAF8F5]/85">
            HOME / SHOP / {getMastheadTitle()} ({filteredProducts.length})
          </span>
        </div>

        {/* Massive Luxury Serif Masthead Typography */}
        <div className="relative z-10 w-full text-center pb-2 sm:pb-3">
          <h1 className="font-serif-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight text-[#FAF8F5] font-light italic leading-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
            {getMastheadTitle()}
          </h1>
        </div>

        {/* Bottom Hairline Anchor Strip */}
        <div className="relative z-10 w-full flex items-center justify-between text-[10px] sm:text-[11px] font-mono tracking-widest text-[#FAF8F5]/70 pb-3 border-t border-[#FAF8F5]/20 pt-2">
          <span>CURATED DAILYWEAR BRASS</span>
          <span>AVIRENA JEWELS</span>
        </div>
      </section>

      {/* 2. SLICK FILTER & SORT TOOLBAR */}
      <div className="sticky top-16 sm:top-20 z-30 w-full bg-[#E7E4D5]/98 backdrop-blur-md border-b border-[#D8D2C2] px-4 sm:px-8 lg:px-12 py-3 flex items-center justify-between select-none">
        
        {/* Left: Filter Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Category Dropdown Pill */}
          <div className="relative">
            <button
              onClick={() => {
                setCategoryDropdownOpen(!categoryDropdownOpen);
                setMetalDropdownOpen(false);
                setSortDropdownOpen(false);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm bg-[#7E795F] hover:bg-[#6C674E] text-[#FAF8F5] text-[11px] font-medium tracking-wider uppercase transition-colors cursor-pointer"
            >
              <span>{selectedCategory === 'all' ? 'Category' : selectedCategory}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {categoryDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-[#E7E4D5] border border-[#D8D2C2] rounded-xs shadow-lg py-1 z-30 animate-in fade-in duration-150">
                {(['all', 'earrings', 'necklaces', 'rings', 'bracelets', 'brooches'] as Category[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setCategoryDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-between ${
                      selectedCategory === cat ? 'bg-[#D8D2C2] text-[#413C23] font-bold' : 'text-[#413C23]/80 hover:bg-[#EDE8DC]'
                    }`}
                  >
                    <span>{cat === 'all' ? 'All Jewelry' : cat}</span>
                    {selectedCategory === cat && <Check className="w-3.5 h-3.5 text-[#413C23]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Metal / Finish Filter Pill */}
          <div className="relative">
            <button
              onClick={() => {
                setMetalDropdownOpen(!metalDropdownOpen);
                setCategoryDropdownOpen(false);
                setSortDropdownOpen(false);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm bg-[#7E795F] hover:bg-[#6C674E] text-[#FAF8F5] text-[11px] font-medium tracking-wider uppercase transition-colors cursor-pointer"
            >
              <span>{selectedMetal === 'all' ? 'Finish ▾' : selectedMetal}</span>
            </button>

            {metalDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-[#E7E4D5] border border-[#D8D2C2] rounded-xs shadow-lg py-1 z-30 animate-in fade-in duration-150">
                {[
                  { label: 'All Finishes', val: 'all' },
                  { label: 'Gold-Tone Brass', val: 'brass' },
                  { label: 'Silver-Tone Alloy', val: 'alloy' },
                  { label: 'Anti-Tarnish Finishes', val: 'anti-tarnish' },
                ].map((item) => (
                  <button
                    key={item.val}
                    onClick={() => {
                      setSelectedMetal(item.val);
                      setMetalDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-between ${
                      selectedMetal === item.val ? 'bg-[#D8D2C2] text-[#413C23] font-bold' : 'text-[#413C23]/80 hover:bg-[#EDE8DC]'
                    }`}
                  >
                    <span>{item.label}</span>
                    {selectedMetal === item.val && <Check className="w-3.5 h-3.5 text-[#413C23]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setSortDropdownOpen(!sortDropdownOpen);
              setCategoryDropdownOpen(false);
              setMetalDropdownOpen(false);
            }}
            className="inline-flex items-center gap-1.5 text-xs text-[#413C23] font-normal hover:text-[#8F896D] transition-colors cursor-pointer"
          >
            <span>Sort by: <strong className="font-semibold">{sortLabels[sortBy]}</strong></span>
            <ChevronDown className="w-3.5 h-3.5 stroke-[1.5]" />
          </button>

          {sortDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#E7E4D5] border border-[#D8D2C2] rounded-xs shadow-lg py-1 z-30 animate-in fade-in duration-150">
              {(Object.keys(sortLabels) as (keyof typeof sortLabels)[]).map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    setSortBy(key);
                    setSortDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-xs transition-colors cursor-pointer flex items-center justify-between ${
                    sortBy === key ? 'bg-[#D8D2C2] text-[#413C23] font-bold' : 'text-[#413C23]/80 hover:bg-[#EDE8DC]'
                  }`}
                >
                  <span>{sortLabels[key]}</span>
                  {sortBy === key && <Check className="w-3.5 h-3.5 text-[#413C23]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. EDITORIAL ASYMMETRIC GRID */}
      <main className="w-full px-4 sm:px-8 lg:px-12 py-6 sm:py-8">
        
        {/* If filtered by specific category or metal, show clean responsive grid */}
        {selectedCategory !== 'all' || selectedMetal !== 'all' ? (
          <div>
            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center justify-center">
                <p className="text-lg font-serif italic text-[#413C23]/70 mb-4">
                  No jewelry pieces found in this category.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedMetal('all');
                  }}
                  className="px-6 py-2.5 bg-[#413C23] text-white text-xs uppercase tracking-widest hover:bg-[#8F896D] transition-colors"
                >
                  Explore All Jewelry
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.map((prod) => renderProductCard(prod))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            
            {/* ROW 1: Large Left Editorial Lifestyle + 4 Right Product Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              
              {/* Left Tall Lifestyle Feature Card */}
              <div
                onClick={() => onSelectProduct(layeredNecklace)}
                className="group relative flex flex-col bg-[#E7E4D5] border border-[#D8D2C2] rounded-xs hover:border-[#8F896D] hover:shadow-[0_8px_20px_rgba(65,60,35,0.08)] transition-all duration-300 cursor-pointer md:col-span-2 md:row-span-2 p-4 sm:p-6 select-none text-left"
              >
                <div className="relative aspect-[4/5] md:aspect-auto md:flex-1 w-full overflow-hidden mb-3 bg-[#D8D2C2] rounded-xs">
                  <img
                    src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=95"
                    alt="Layered Chain Necklace"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-700 ease-out"
                  />
                </div>
                <div className="flex flex-col text-left space-y-1">
                  <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-[#8F896D]">
                    Gold-Tone Brass
                  </span>
                  <h3 className="font-serif-display text-lg sm:text-xl font-normal text-[#413C23] group-hover:text-[#8F896D] transition-colors leading-snug truncate">
                    Layered Chain Necklace
                  </h3>
                  <p className="text-base sm:text-lg font-bold text-[#413C23] tracking-tight mt-0.5">
                    {formatPrice(180, currency)}
                  </p>
                </div>
              </div>

              {/* Right Col 3, Row 1 Top */}
              {renderProductCard(lucidStuds, 'Lucid Studs', 150)}

              {/* Right Col 4, Row 1 Top */}
              {renderProductCard(solidBrooch, 'Solid Wave Brooch', 225)}

              {/* Right Col 3, Row 1 Bottom */}
              {renderProductCard(ornatePendant, 'Ornate Scroll Pendant', 250)}

              {/* Right Col 4, Row 1 Bottom */}
              {renderProductCard(twoPearlCuff, 'Two-Pearl Cuff', 215)}
            </div>

            {/* ROW 2: 4 Standard Product Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {renderProductCard(tideHoop, 'Tide Hoop Earrings', 175)}
              {renderProductCard(starEdgeRing, 'Star Edge Ring', 160)}
              {renderProductCard(waveMiracleRing, 'Wave Miracle Ring', 195)}
              {renderProductCard(shellStuds, 'Shell Radiance Studs', 150)}
            </div>

            {/* ROW 3: 4 Standard Product Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {renderProductCard(goldCurveNecklace, 'Gold Curve Necklace', 210)}
              {renderProductCard(aureusEarrings, 'Aureus Earrings', 210)}
              {renderProductCard(linkedHeartBracelet, 'Linked Heart Bracelet', 195)}
              {renderProductCard(sculpBracelet, 'Sculp Bracelet', 230)}
            </div>

            {/* ROW 4: 2 Large Editorial Lifestyle Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              
              {/* Editorial Duo Left: Dome Studs */}
              <div
                onClick={() => onSelectProduct(domeStuds)}
                className="group relative flex flex-col bg-[#E7E4D5] border border-[#D8D2C2] rounded-xs hover:border-[#8F896D] hover:shadow-[0_8px_20px_rgba(65,60,35,0.08)] transition-all duration-300 cursor-pointer p-4 sm:p-6 select-none text-left"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden mb-3 bg-[#D8D2C2] rounded-xs">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=95"
                    alt="Dome Studs"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-[center_35%] group-hover:scale-104 transition-transform duration-700 ease-out"
                  />
                </div>
                <div className="flex flex-col text-left space-y-1">
                  <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-[#8F896D]">
                    Gold-Tone Brass
                  </span>
                  <h3 className="font-serif-display text-lg sm:text-xl font-normal text-[#413C23] group-hover:text-[#8F896D] transition-colors leading-snug truncate">
                    Dome Studs
                  </h3>
                  <p className="text-base sm:text-lg font-bold text-[#413C23] tracking-tight mt-0.5">
                    {formatPrice(160, currency)}
                  </p>
                </div>
              </div>

              {/* Editorial Duo Right: Pearl Drop Necklace */}
              <div
                onClick={() => onSelectProduct(pearlDropNecklace)}
                className="group relative flex flex-col bg-[#E7E4D5] border border-[#D8D2C2] rounded-xs hover:border-[#8F896D] hover:shadow-[0_8px_20px_rgba(65,60,35,0.08)] transition-all duration-300 cursor-pointer p-4 sm:p-6 select-none text-left"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden mb-3 bg-[#D8D2C2] rounded-xs">
                  <img
                    src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=95"
                    alt="Pearl Drop Necklace"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-[center_35%] group-hover:scale-104 transition-transform duration-700 ease-out"
                  />
                </div>
                <div className="flex flex-col text-left space-y-1">
                  <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-[#8F896D]">
                    Gold-Tone Brass
                  </span>
                  <h3 className="font-serif-display text-lg sm:text-xl font-normal text-[#413C23] group-hover:text-[#8F896D] transition-colors leading-snug truncate">
                    Pearl Drop Necklace
                  </h3>
                  <p className="text-base sm:text-lg font-bold text-[#413C23] tracking-tight mt-0.5">
                    {formatPrice(190, currency)}
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Live Catalog Items */}
            {remainingProducts.length > 0 && (
              <div className="pt-8 border-t border-[#D8D2C2]">
                <h3 className="text-xs uppercase tracking-[0.2em] font-medium text-[#413C23]/80 mb-6 text-left">
                  More Atelier Creations ({remainingProducts.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {remainingProducts.map((prod) => renderProductCard(prod))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
