import React, { useState, useMemo, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Product, Currency, Category, Metal } from '../types';
import { formatPrice } from '../data/products';
import { ChevronDown, Heart, Check, ShoppingBag, Eye } from 'lucide-react';

interface CollectionPageProps {
  products: Product[];
  /**
   * False until the live Shopify catalog fetch has settled. While false the grid
   * renders a skeleton — never placeholder products — so no frame of this page
   * can show a product count other than the true one.
   */
  isCatalogReady?: boolean;
  selectedCategory: Category;
  setSelectedCategory: (cat: Category) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  currency: Currency;
  isWishlisted: (productId: string) => boolean;
  onToggleWishlist: (product: Product) => void;
  onNavigateHome?: () => void;
}

export const CollectionPage: React.FC<CollectionPageProps> = ({
  products,
  isCatalogReady = true,
  selectedCategory,
  setSelectedCategory,
  onSelectProduct,
  onQuickAdd,
  onQuickView,
  currency,
  isWishlisted,
  onToggleWishlist,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedMetal, setSelectedMetal] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [metalDropdownOpen, setMetalDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (containerRef.current) {
      gsap.fromTo(
        '.collection-page-card',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.04, ease: 'power2.out' }
      );
    }
  }, [selectedCategory, selectedMetal, sortBy, isCatalogReady]);

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
  };

  const renderProductCard = (product: Product) => {
    const wishlisted = isWishlisted(product.id);

    return (
      <div
        key={product.id}
        onClick={() => onSelectProduct(product)}
        className="collection-page-card group relative flex flex-col justify-between bg-[#F2EFDB] border border-[#D8D2C2] rounded-xs hover:border-[#8F896D] hover:shadow-[0_8px_20px_rgba(65,60,35,0.08)] transition-all duration-300 cursor-pointer p-4 sm:p-5 select-none text-left"
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-3.5 right-3.5 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
            wishlisted
              ? 'bg-[#413C23] text-white opacity-100 shadow-xs'
              : 'bg-[#F2EFDB]/90 text-[#413C23] opacity-0 group-hover:opacity-100 hover:bg-[#FAF8F5] border border-[#D8D2C2] shadow-xs'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-[#7A0F1A] text-[#7A0F1A]' : ''}`} />
        </button>

        {onQuickView && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="absolute top-3.5 right-12 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 bg-[#F2EFDB]/90 text-[#413C23] opacity-0 group-hover:opacity-100 hover:bg-[#FAF8F5] border border-[#D8D2C2] shadow-xs"
            aria-label="Quick View"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        )}

        {product.isBestseller && (
          <span className="absolute top-3.5 left-3.5 z-10 bg-[#413C23] text-[#FAF8F5] text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-2xs">
            Bestseller
          </span>
        )}

        <div className="relative aspect-square w-full flex items-center justify-center overflow-hidden mb-3 p-4 sm:p-6">
          <img
            src={product.images[0]}
            alt={product.name}
            referrerPolicy="no-referrer"
            loading="lazy"
            className="max-w-full max-h-full w-auto h-auto object-contain mix-blend-multiply group-hover:scale-106 transition-transform duration-500 ease-out"
          />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickAdd(product);
            }}
            className="absolute bottom-2.5 right-2.5 z-10 p-2 bg-[#413C23] hover:bg-[#8F896D] text-[#FAF8F5] rounded-xs opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm cursor-pointer"
            title="Quick Add to Bag"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex flex-col text-left space-y-1">
          <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-[#8F896D]">
            {product.metal}
          </span>
          <h3 className="font-serif-display text-base sm:text-lg font-normal text-[#413C23] group-hover:text-[#8F896D] transition-colors leading-snug truncate">
            {product.name}
          </h3>
          <p className="text-base sm:text-lg font-bold text-[#413C23] tracking-tight mt-0.5">
            {formatPrice(product.price, currency)}
          </p>
        </div>
      </div>
    );
  };

  /**
   * Neutral loading placeholder. Deliberately carries no name, price, image or
   * count — nothing here can be mistaken for a real product while the live
   * Shopify catalog is still in flight.
   */
  const renderSkeletonCard = (key: string, featured = false) => (
    <div
      key={key}
      aria-hidden="true"
      className={`relative flex flex-col justify-between bg-[#F2EFDB] border border-[#D8D2C2] rounded-xs p-4 sm:p-5 ${
        featured
          ? 'col-span-1 sm:col-span-2 lg:col-span-2 lg:row-span-2 min-h-[380px] lg:min-h-0 p-5 sm:p-7'
          : ''
      }`}
    >
      <div
        className={`w-full rounded-xs bg-[#E2DDCB] animate-pulse mb-3 ${
          featured ? 'flex-1 min-h-[240px] sm:min-h-[300px]' : 'aspect-square'
        }`}
      />
      <div className="flex flex-col space-y-2">
        <div className="h-2 w-20 rounded-2xs bg-[#E2DDCB] animate-pulse" />
        <div className="h-4 w-3/4 rounded-2xs bg-[#E2DDCB] animate-pulse" />
        <div className="h-4 w-1/3 rounded-2xs bg-[#E2DDCB] animate-pulse" />
      </div>
    </div>
  );

  const renderFeaturedBentoCard = (product: Product) => {
    const wishlisted = isWishlisted(product.id);

    return (
      <div
        key={`bento-${product.id}`}
        onClick={() => onSelectProduct(product)}
        className="collection-page-card group relative flex flex-col justify-between bg-[#F2EFDB] border border-[#D8D2C2] rounded-xs hover:border-[#8F896D] hover:shadow-[0_8px_20px_rgba(65,60,35,0.08)] transition-all duration-300 cursor-pointer col-span-1 sm:col-span-2 lg:col-span-2 lg:row-span-2 p-5 sm:p-7 select-none text-left overflow-hidden min-h-[380px] lg:min-h-0"
      >
        <div className="flex items-center justify-between w-full z-10 mb-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-2xs bg-[#413C23] text-[#FAF8F5] text-[10px] uppercase tracking-widest font-medium">
            Featured Piece
          </span>
          <div className="flex items-center gap-2">
            {onQuickView && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickView(product);
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 bg-[#F2EFDB]/90 text-[#413C23] hover:bg-[#FAF8F5] border border-[#D8D2C2] shadow-xs"
                aria-label="Quick View"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleWishlist(product);
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                wishlisted
                  ? 'bg-[#413C23] text-white opacity-100 shadow-xs'
                  : 'bg-[#F2EFDB]/90 text-[#413C23] hover:bg-[#FAF8F5] border border-[#D8D2C2] shadow-xs'
              }`}
              aria-label="Wishlist"
            >
              <Heart className={`w-4 h-4 ${wishlisted ? 'fill-[#7A0F1A] text-[#7A0F1A]' : ''}`} />
            </button>
          </div>
        </div>

        <div className="relative flex-1 w-full min-h-[240px] sm:min-h-[300px] flex items-center justify-center overflow-hidden my-3 p-4 sm:p-8">
          <img
            src={product.images[0]}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="max-w-[380px] max-h-[380px] sm:max-w-[440px] sm:max-h-[440px] w-auto h-auto object-contain mix-blend-multiply group-hover:scale-106 transition-transform duration-700 ease-out"
          />
        </div>

        <div className="flex items-end justify-between w-full pt-3 border-t border-[#D8D2C2]/60 z-10">
          <div className="flex flex-col text-left space-y-1 max-w-[70%]">
            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#8F896D]">
              {product.metal}
            </span>
            <h3 className="font-serif-display text-xl sm:text-2xl font-normal text-[#413C23] group-hover:text-[#8F896D] transition-colors leading-snug truncate">
              {product.name}
            </h3>
            <p className="text-lg sm:text-xl font-bold text-[#413C23] tracking-tight mt-0.5">
              {formatPrice(product.price, currency)}
            </p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickAdd(product);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#413C23] hover:bg-[#8F896D] text-[#FAF8F5] text-xs uppercase tracking-wider font-medium rounded-xs transition-colors shadow-sm cursor-pointer shrink-0"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Bag</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div ref={containerRef} className="pb-10 font-sans-body w-full text-[#413C23] bg-[#E7E4D5] select-none">
      <section className="relative w-full bg-[#8A8568] text-[#FAF8F5] min-h-[360px] sm:min-h-[420px] md:min-h-[480px] flex flex-col justify-between pt-8 sm:pt-10 px-4 sm:px-8 lg:px-12 select-none overflow-hidden border-b border-[#7B765B]">
        <div className="absolute inset-x-0 top-0 bottom-12 flex justify-center items-start pointer-events-none overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=95"
            alt="Avirena Jewelry Editorial Model"
            referrerPolicy="no-referrer"
            className="h-[115%] w-auto max-w-none object-cover object-top filter contrast-[1.03] opacity-95 translate-y-[-5%]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#8A8568]/40 via-transparent to-[#8A8568] pointer-events-none" />
        </div>
        <div className="relative z-10 w-full flex items-center justify-between text-[11px] sm:text-xs font-serif text-[#FAF8F5]/90 pt-1">
          <span className="italic tracking-wider font-light">Homegrown dailywear jewels</span>
          <span className="uppercase tracking-[0.2em] font-sans-body text-[10px] sm:text-[11px] font-medium text-[#FAF8F5]/85">HOME / SHOP / {getMastheadTitle()}{isCatalogReady ? ` (${filteredProducts.length})` : ''}</span>
        </div>
        <div className="relative z-10 w-full text-center pb-2 sm:pb-3">
          <h1 className="font-serif-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight text-[#FAF8F5] font-light italic leading-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.15)]">{getMastheadTitle()}</h1>
        </div>
        <div className="relative z-10 w-full flex items-center justify-between text-[10px] sm:text-[11px] font-mono tracking-widest text-[#FAF8F5]/70 pb-3 border-t border-[#FAF8F5]/20 pt-2">
          <span>CURATED DAILYWEAR BRASS</span>
          <span>AVIRENA JEWELS</span>
        </div>
      </section>

      <div className="sticky top-16 sm:top-20 z-30 w-full bg-[#E7E4D5]/98 backdrop-blur-md border-b border-[#D8D2C2] px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-3 flex items-center justify-between select-none">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
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
          <div className="relative">
            <button
              onClick={() => {
                setMetalDropdownOpen(!metalDropdownOpen);
                setCategoryDropdownOpen(false);
                setSortDropdownOpen(false);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm bg-[#7E795F] hover:bg-[#6C674E] text-[#FAF8F5] text-[11px] font-medium tracking-wider uppercase transition-colors cursor-pointer"
            >
              <span>{selectedMetal === 'all' ? 'Metal' : selectedMetal}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {metalDropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-[#E7E4D5] border border-[#D8D2C2] rounded-xs shadow-lg py-1 z-30 animate-in fade-in duration-150">
                {[
                  { id: 'all', label: 'All Metals' },
                  { id: 'brass', label: 'Gold-Tone Brass' },
                  { id: 'alloy', label: 'Silver-Tone Alloy' },
                  { id: 'anti-tarnish', label: 'Anti-Tarnish' },
                ].map((metal) => (
                  <button
                    key={metal.id}
                    onClick={() => {
                      setSelectedMetal(metal.id);
                      setMetalDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-between ${
                      selectedMetal === metal.id ? 'bg-[#D8D2C2] text-[#413C23] font-bold' : 'text-[#413C23]/80 hover:bg-[#EDE8DC]'
                    }`}
                  >
                    <span>{metal.label}</span>
                    {selectedMetal === metal.id && <Check className="w-3.5 h-3.5 text-[#413C23]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
          {(selectedCategory !== 'all' || selectedMetal !== 'all') && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedMetal('all');
              }}
              className="text-[11px] text-[#8F896D] hover:text-[#413C23] underline underline-offset-4 cursor-pointer ml-1"
            >
              Reset Filters
            </button>
          )}
        </div>
        <div className="relative">
          <button
            onClick={() => {
              setSortDropdownOpen(!sortDropdownOpen);
              setCategoryDropdownOpen(false);
              setMetalDropdownOpen(false);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm bg-transparent hover:bg-[#D8D2C2]/40 text-[#413C23] text-[11px] font-medium tracking-wider uppercase transition-colors cursor-pointer border border-[#D8D2C2]"
          >
            <span>Sort: {sortLabels[sortBy]}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          {sortDropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-[#E7E4D5] border border-[#D8D2C2] rounded-xs shadow-lg py-1 z-30 animate-in fade-in duration-150">
              {(Object.keys(sortLabels) as Array<keyof typeof sortLabels>).map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    setSortBy(key);
                    setSortDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-between ${
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

      <main className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-6 sm:py-8">
        {!isCatalogReady ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
            role="status"
            aria-live="polite"
            aria-busy="true"
          >
            <span className="sr-only">Loading the collection…</span>
            {renderSkeletonCard('skeleton-featured', true)}
            {['a', 'b', 'c', 'd'].map((k) => renderSkeletonCard(`skeleton-${k}`))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center max-w-md mx-auto">
            <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#8F896D] mb-3">
              {selectedCategory === 'all' ? 'Collection' : selectedCategory}
            </span>
            <p className="font-serif-display text-2xl sm:text-3xl font-light italic text-[#413C23] mb-2">
              No pieces in this category yet
            </p>
            <p className="text-xs sm:text-sm text-[#413C23]/70 leading-relaxed mb-6">
              New designs are added as each piece is released. Explore what is available now.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedMetal('all');
              }}
              className="px-6 py-2.5 bg-[#413C23] text-white text-xs uppercase tracking-widest hover:bg-[#8F896D] transition-colors cursor-pointer"
            >
              Explore All Jewelry
            </button>
          </div>
        ) : filteredProducts.length === 3 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* 3-item Bento: 1st piece is 2 cols & 2 rows, items 2 & 3 stack on the right */}
            {renderFeaturedBentoCard(filteredProducts[0])}
            {filteredProducts.slice(1).map((prod) => renderProductCard(prod))}
          </div>
        ) : filteredProducts.length >= 4 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* 4+ item Bento: 1st piece is 2x2, remaining items fill the grid */}
            {renderFeaturedBentoCard(filteredProducts[0])}
            {filteredProducts.slice(1).map((prod) => renderProductCard(prod))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {filteredProducts.map((prod) => renderProductCard(prod))}
          </div>
        )}
      </main>
    </div>
  );
};
