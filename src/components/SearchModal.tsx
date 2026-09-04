import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { Product, Currency } from '../types';
import { formatPrice } from '../data/products';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  currency: Currency;
  catalogProducts?: Product[];
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onQuickAdd,
  currency,
  catalogProducts = [],
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Live Shopify catalog only. Searching a mock catalog would surface
  // unbuyable, stock-photo "products" in results.
  const activeProducts = useMemo(
    () => (Array.isArray(catalogProducts) ? catalogProducts : []),
    [catalogProducts]
  );

  const popularSearches = [
    'Earrings',
    'Gold Tone',
    'Hoops',
    'Brass Alloy',
    'Rings',
    'Necklace',
    'Choker',
  ];

  const searchResults = useMemo(() => {
    if (!query.trim() && selectedCategory === 'all') {
      return activeProducts.slice(0, 8); // Show top items by default
    }

    const q = query.toLowerCase().trim();
    return activeProducts.filter((p) => {
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.subtitle && p.subtitle.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.metal && p.metal.toLowerCase().includes(q)) ||
        (p.materials && p.materials.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });
  }, [activeProducts, query, selectedCategory]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans-body flex items-start justify-center pt-16 sm:pt-24 px-4 pb-12 select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#413C23]/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-[#E7E4D5] border border-[#D8D2C2] rounded-xs shadow-2xl max-w-4xl w-full overflow-hidden z-10 animate-in zoom-in-95 duration-200 text-left flex flex-col max-h-[85vh]">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-6 border-b border-[#D8D2C2] flex items-center gap-3 bg-[#FAF8F5]">
          <Search className="w-5 h-5 text-[#8F896D] shrink-0" />
          <input
            type="text"
            placeholder="Search dailywear jewelry by name, metal, style, or type..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-sm sm:text-base text-[#413C23] placeholder-[#8F896D]/70 focus:outline-none font-sans-body"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs uppercase tracking-wider text-[#8F896D] hover:text-[#413C23] cursor-pointer px-2 py-1 transition-colors"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#F2EFDB] text-[#413C23] transition-colors cursor-pointer"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Popular Suggestions */}
        <div className="px-4 sm:px-6 py-3 bg-[#F2EFDB] border-b border-[#D8D2C2] flex items-center justify-between gap-4 overflow-x-auto">
          <div className="flex items-center gap-1.5 shrink-0 text-xs text-[#8F896D]">
            <span className="font-semibold uppercase tracking-wider text-[10px] text-[#413C23]">Popular:</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
            {popularSearches.map((term) => (
              <button
                key={term}
                onClick={() => setQuery(term)}
                className="px-2.5 py-1 bg-[#FAF8F5] border border-[#D8D2C2] text-[#413C23]/80 hover:text-[#413C23] hover:border-[#8F896D] rounded-xs text-[11px] whitespace-nowrap cursor-pointer transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Results Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-[#E7E4D5]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-[#8F896D] uppercase tracking-wider font-medium">
              {query ? `Found ${searchResults.length} creations for "${query}"` : 'Curated Signatures'}
            </span>
          </div>

          {searchResults.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Search className="w-8 h-8 text-[#8F896D] mx-auto stroke-[1.2]" />
              <h4 className="font-serif-display text-xl text-[#413C23] font-normal">No jewelry found</h4>
              <p className="text-xs text-[#8F896D] max-w-sm mx-auto">
                We couldn't find any pieces matching your query. Try searching for "hoops", "gold tone", "choker", or "rings".
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
              {searchResults.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    onClose();
                    onSelectProduct(product);
                  }}
                  className="group bg-[#F2EFDB] border border-[#D8D2C2] rounded-xs p-3 flex flex-col justify-between hover:border-[#8F896D] hover:shadow-xs transition-all cursor-pointer"
                >
                  <div className="aspect-square bg-[#E7E4D5] rounded-xs overflow-hidden flex items-center justify-center p-2 mb-2 relative border border-[#D8D2C2]">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      width={400}
                      height={400}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-[#8F896D]">
                      <span className="uppercase tracking-wider truncate">{product.metal}</span>
                    </div>
                    <h5 className="text-xs font-normal text-[#413C23] group-hover:text-[#8F896D] transition-colors truncate">
                      {product.name}
                    </h5>
                    <p className="text-xs font-semibold text-[#413C23]">
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
