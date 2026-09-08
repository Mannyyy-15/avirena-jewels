import React, { useState } from 'react';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import { Product, Currency, Metal } from '../types';
import { formatPrice, getCompareAtPrice, getDiscountPercentage } from '../data/products';

interface ProductCardProps {
  product: Product;
  currency: Currency;
  onSelect: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  onSelect,
  onQuickAdd,
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
      className="group cursor-pointer flex flex-col transition-all duration-300 relative text-left font-sans-body w-full"
    >
      {/* Product Image Canvas Container */}
      <div className="relative aspect-square w-full bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs overflow-hidden flex items-center justify-center p-4 sm:p-6 transition-all duration-300 group-hover:border-[#8F896D] group-hover:shadow-[0_8px_20px_rgba(65,60,35,0.08)]">
        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.isBestseller && (
            <span className="bg-[#413C23] text-[#FAF8F5] text-[9px] tracking-[0.16em] uppercase font-bold px-2 py-0.5 rounded-xs shadow-xs">
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

          <button
            id={`wishlist-btn-${product.id}`}
            onClick={handleToggleWishlist}
            className="p-1.5 rounded-full bg-[#FAF8F5]/95 hover:bg-white text-[#8F896D] hover:text-[#413C23] transition-all shadow-xs cursor-pointer focus:outline-none border border-[#D8D2C2]"
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
          width={800}
          height={800}
          className="w-full h-full object-contain object-center mix-blend-multiply transition-all duration-500 ease-out group-hover:scale-105"
          loading="lazy"
          decoding="async"
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

      {/* Product Details - Prominent Price & Clean Typography */}
      <div className="mt-3 flex flex-col space-y-1">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-[#8F896D] uppercase tracking-[0.18em] font-semibold text-[10px]">
            {product.metal}
          </span>
        </div>

        <h3 className="font-serif-display text-base sm:text-lg font-normal text-[#413C23] group-hover:text-[#8F896D] transition-colors leading-snug truncate">
          {product.name}
        </h3>

        {/* Prominent High-Visibility Price */}
        {(() => {
          const comparePrice = getCompareAtPrice(product.price, product.originalPrice);
          const discount = getDiscountPercentage(product.price, comparePrice);
          return (
            <div className="flex items-baseline gap-2 pt-0.5 flex-wrap">
              <span className="text-base sm:text-lg font-bold text-[#413C23] tracking-tight">
                {formatPrice(product.price, currency)}
              </span>
              {comparePrice > product.price && (
                <>
                  <span className="text-xs sm:text-sm text-[#DC2626] line-through font-normal">
                    {formatPrice(comparePrice, currency)}
                  </span>
                  <span className="text-[10px] font-bold text-[#15803D] bg-[#15803D]/10 border border-[#15803D]/20 px-1.5 py-0.5 rounded-2xs uppercase tracking-wider">
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
};
