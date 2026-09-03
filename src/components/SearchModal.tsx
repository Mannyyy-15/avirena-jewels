import React, { useState, useMemo } from 'react';
import { Search, X, ArrowRight, Sparkles, Star, ShoppingBag, Eye } from 'lucide-react';
import { Product, Currency } from '../types';
import { PRODUCTS, formatPrice } from '../data/products';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  currency: Currency;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onQuickAdd,
  currency,
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const popularSearches = [
    'Baroque Pearl',
    '18k Gold Vermeil',
    'Sculptural Cuff',
    'Molten Rings',
    'Dome Studs',
    'Wave Brooch',
    'Choker',
  ];

  const searchResults = useMemo(() => {
    if (!query.trim() && selectedCategory === 'all') {
      return PRODUCTS.slice(0, 6); // Show top trending by default
    }

    const q = query.toLowerCase().trim();
    return PRODUCTS.filter((p) => {
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.metal.toLowerCase().includes(q) ||
        p.materials.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [query, selectedCategory]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans-body flex items-start justify-center pt-16 sm:pt-24 px-4 pb-12">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-[#FAF8F5] border border-[#E6DFD3] rounded-xs shadow-2xl max-w-4xl w-full overflow-hidden z-10 animate-in zoom-in-95 duration-200 text-left flex flex-col max-h-[85vh]">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-6 border-b border-[#E6DFD3] flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-[#9A9886] shrink-0" />
          <input
            type="text"
            placeholder="Search jewelry by name, metal (e.g. Vermeil), style, or category..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-sm sm:text-base text-[#2C2C2A] placeholder-[#9A9886] focus:outline-none font-sans-body"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs uppercase tracking-wider text-[#7D7973] hover:text-[#2C2C2A] cursor-pointer px-2 py-1"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#F3EFE6] text-[#2C2C2A] transition-colors cursor-pointer"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills & Popular Suggestions */}
        <div className="px-4 sm:px-6 py-3 bg-[#F3EFE6] border-b border-[#E6DFD3] flex items-center justify-between gap-4 overflow-x-auto">
          <div className="flex items-center gap-1.5 shrink-0 text-xs text-[#7D7973]">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="font-medium text-[#2C2C2A]">Popular:</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
            {popularSearches.map((term) => (
              <button
                key={term}
                onClick={() => setQuery(term)}
                className="px-2.5 py-1 bg-white border border-[#E6DFD3] text-[#5C5850] hover:text-[#2C2C2A] hover:border-[#C5A059] rounded-xs text-[11px] whitespace-nowrap cursor-pointer transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Results Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-[#7D7973]">
              {query ? `Found ${searchResults.length} creations for "${query}"` : 'Trending Atelier Signatures'}
            </span>
          </div>

          {searchResults.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Search className="w-8 h-8 text-[#9A9886] mx-auto stroke-[1.2]" />
              <h4 className="font-serif-display text-xl text-[#2C2C2A]">No jewelry found</h4>
              <p className="text-xs text-[#7D7973] max-w-sm mx-auto">
                We couldn't find any pieces matching your query. Try searching for "necklace", "gold", "pearl", or "ring".
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {searchResults.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    onClose();
                    onSelectProduct(product);
                  }}
                  className="group bg-white border border-[#E6DFD3] rounded-xs p-3 flex flex-col justify-between hover:border-[#C5A059] hover:shadow-xs transition-all cursor-pointer"
                >
                  <div className="aspect-square bg-[#FAF8F5] rounded-xs overflow-hidden flex items-center justify-center p-2 mb-2 relative">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-[#9A9886]">
                      <span className="uppercase tracking-wider truncate">{product.metal}</span>
                      <div className="flex items-center gap-0.5 text-[#C5A059]">
                        <Star className="w-2.5 h-2.5 fill-[#C5A059]" />
                        <span>{product.rating || 4.9}</span>
                      </div>
                    </div>
                    <h5 className="text-xs font-normal text-[#2C2C2A] group-hover:text-[#C5A059] transition-colors truncate">
                      {product.name}
                    </h5>
                    <p className="text-xs font-medium text-[#2C2C2A]">
                      {formatPrice(product.price, currency)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
