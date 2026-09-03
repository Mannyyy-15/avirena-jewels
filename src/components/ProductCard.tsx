import React, { useState } from 'react';
import { Heart, ShoppingBag, Check, Eye, Star } from 'lucide-react';
import { Product, Currency, Metal } from '../types';
import { formatPrice } from '../data/products';

interface ProductCardProps {
  product: Product;
  currency: Currency;
  onSelect: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  onSelect,
  onQuickAdd,
  onQuickView,
  isWishlisted,
  onToggleWishlist,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [selectedMetal, setSelectedMetal] = useState<Metal>(product.metal);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickAdd({ ...product, metal: selectedMetal });
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickView?.(product);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWishlist(product);
  };

  const displayImage = isHovered && product.images.length > 1 ? product.images[1] : product.images[0];

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onSelect(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group cursor-pointer flex flex-col transition-all duration-300 relative text-left font-sans-body luxury-card w-full"
    >
      {/* Product Image Canvas Container */}
      <div className="relative aspect-square w-full bg-[#F4EFE6] border border-[#D8D2C2] rounded-xs overflow-hidden flex items-center justify-center p-4 sm:p-6 transition-all duration-300 group-hover:border-[#8F896D] group-hover:shadow-[0_10px_25px_rgba(65,60,35,0.08)]">
        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.isBestseller && (
            <span className="bg-[#413C23] text-[#E7E4D5] text-[9px] tracking-[0.16em] uppercase font-bold px-2 py-0.5 rounded-xs shadow-xs">
              Bestseller
            </span>
          )}
          {product.isSculptural && !product.isBestseller && (
            <span className="bg-[#FAF8F5]/95 text-[#413C23] text-[9px] tracking-[0.16em] uppercase font-semibold px-2 py-0.5 border border-[#D8D2C2] rounded-xs shadow-xs">
              Sculptural
            </span>
          )}
        </div>

        {/* Action icons top right */}
        <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
          {onQuickView && (
            <button
              onClick={handleQuickView}
              className="p-1.5 rounded-full bg-[#FAF8F5]/95 hover:bg-[#413C23] hover:text-[#E7E4D5] text-[#413C23] transition-all shadow-xs cursor-pointer border border-[#D8D2C2]/50"
              title="Quick View"
              aria-label="Quick View"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            id={`wishlist-btn-${product.id}`}
            onClick={handleToggleWishlist}
            className="p-1.5 rounded-full bg-[#FAF8F5]/95 hover:bg-white text-[#8F896D] hover:text-[#413C23] transition-all shadow-xs cursor-pointer focus:outline-none border border-[#D8D2C2]/50"
            title={isWishlisted ? 'Remove from saved' : 'Save to wishlist'}
            aria-label={isWishlisted ? 'Remove from saved' : 'Save to wishlist'}
          >
            <Heart
              className={`w-3.5 h-3.5 transition-transform active:scale-125 ${
                isWishlisted ? 'fill-[#7A0F1A] text-[#7A0F1A]' : 'stroke-[1.5]'
              }`}
            />
          </button>
        </div>

        {/* Main Product Image with Smooth Transition */}
        <img
          src={displayImage}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain object-center mix-blend-multiply transition-all duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Quick Add Overlay on Hover */}
        <div className="absolute inset-x-2.5 bottom-2.5 z-10 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
          <button
            id={`quick-add-btn-${product.id}`}
            onClick={handleQuickAdd}
            className={`w-full py-2.5 px-3 text-[10px] sm:text-[11px] uppercase tracking-widest font-semibold rounded-xs flex items-center justify-center gap-2 transition-all duration-200 shadow-md cursor-pointer ${
              addedAnimation
                ? 'bg-[#8F896D] text-[#FAF8F5]'
                : 'bg-[#413C23] hover:bg-[#8F896D] text-[#E7E4D5] active:scale-98'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 stroke-[1.75]" />
                <span>Quick Add</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="mt-3 flex flex-col space-y-1">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-[#8F896D] uppercase tracking-widest font-medium text-[10px]">
            {product.metal === '18k Gold Vermeil' ? '18k Vermeil' : '925 Silver'}
          </span>
          <div className="flex items-center gap-1 text-[#8F896D]">
            <Star className="w-3 h-3 fill-[#8F896D] text-[#8F896D]" />
            <span className="font-semibold text-[10px] text-[#413C23]">{product.rating}</span>
          </div>
        </div>

        <h3 className="font-serif-display text-sm sm:text-base font-medium text-[#413C23] group-hover:text-[#8F896D] transition-colors truncate">
          {product.name}
        </h3>

        <div className="flex items-baseline space-x-2">
          <span className="text-xs sm:text-sm font-semibold text-[#413C23]">
            {formatPrice(product.price, currency)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-[11px] text-[#8F896D]/70 line-through">
              {formatPrice(product.originalPrice, currency)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
