import React, { useState } from 'react';
import { X, Heart, ShoppingBag, Check, ShieldCheck, Sparkles, Ruler, ArrowRight, Star } from 'lucide-react';
import { Product, Currency, Metal } from '../types';
import { formatPrice } from '../data/products';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: { product: Product; quantity: number; metal?: Metal; size?: string }) => void;
  onSelectProduct: (product: Product) => void;
  currency: Currency;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onSelectProduct,
  currency,
  isWishlisted,
  onToggleWishlist,
}) => {
  if (!isOpen || !product) return null;

  const [selectedMetal, setSelectedMetal] = useState<Metal>(product.metal || '18k Gold Vermeil');
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes ? product.sizes[0] : '');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isAdded, setIsAdded] = useState<boolean>(false);

  const handleAdd = () => {
    onAddToCart({
      product,
      quantity,
      metal: selectedMetal,
      size: selectedSize || undefined,
    });
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1200);
  };

  const handleGoToPdp = () => {
    onClose();
    onSelectProduct(product);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans-body flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-[#FAF8F5] border border-[#E6DFD3] rounded-xs shadow-2xl max-w-3xl w-full overflow-hidden z-10 animate-in zoom-in-95 duration-200 text-left">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white text-[#2C2C2A] transition-colors z-20 cursor-pointer shadow-xs"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Image Gallery */}
          <div className="p-6 bg-[#F3EFE6] border-b md:border-b-0 md:border-r border-[#E6DFD3] flex flex-col justify-between">
            <div className="relative aspect-square w-full bg-white rounded-xs overflow-hidden border border-[#E6DFD3] flex items-center justify-center p-4">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain mix-blend-multiply transition-all duration-300"
              />
              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1">
                {product.isBestseller && (
                  <span className="bg-[#2C2C2A] text-white text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-xs">
                    Bestseller
                  </span>
                )}
                {product.isSculptural && (
                  <span className="bg-[#EAE6DB] text-[#2C2C2A] text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-xs border border-[#D5CFBF]">
                    Sculptural
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail selector if multiple images */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-14 h-14 rounded-xs overflow-hidden border bg-white p-1 cursor-pointer transition-all ${
                      activeImageIndex === idx ? 'border-[#C5A059] ring-1 ring-[#C5A059]' : 'border-[#E6DFD3] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" referrerPolicy="no-referrer" className="w-full h-full object-contain mix-blend-multiply" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Config & Purchase */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category & Rating */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#9A9886] font-medium">
                  {product.category} • Atelier Edition
                </span>
                <div className="flex items-center gap-1 text-[#C5A059] text-xs">
                  <Star className="w-3.5 h-3.5 fill-[#C5A059]" />
                  <span className="font-semibold text-[#2C2C2A]">{product.rating || 4.9}</span>
                  <span className="text-[#9A9886]">({product.reviewsCount || 48})</span>
                </div>
              </div>

              {/* Title & Price */}
              <div>
                <h3 className="font-serif-display text-2xl sm:text-3xl text-[#2C2C2A] leading-tight">
                  {product.name}
                </h3>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-serif-display text-xl font-medium text-[#2C2C2A]">
                    {formatPrice(product.price, currency)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-[#9A9886] line-through">
                      {formatPrice(product.originalPrice, currency)}
                    </span>
                  )}
                </div>
              </div>

              {/* Description excerpt */}
              <p className="text-xs text-[#5C5850] font-light leading-relaxed">
                {product.description}
              </p>

              {/* Metal Finish Selector */}
              <div className="space-y-2 pt-2 border-t border-[#E6DFD3]">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-[#2C2C2A]">Material Finish</span>
                  <span className="text-[#7D7973]">{selectedMetal}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMetal('Gold-Tone Brass')}
                    className={`py-2 px-3 text-xs rounded-xs border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      selectedMetal === 'Gold-Tone Brass'
                        ? 'border-[#C5A059] bg-[#F3EFE6] font-medium text-[#2C2C2A]'
                        : 'border-[#E6DFD3] text-[#5C5850] hover:border-[#9A9886]'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full bg-[#E5C158] border border-[#B89B38]" />
                    <span>Gold-Tone Brass</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedMetal('Silver-Tone Alloy')}
                    className={`py-2 px-3 text-xs rounded-xs border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      selectedMetal === 'Silver-Tone Alloy'
                        ? 'border-[#C5A059] bg-[#F3EFE6] font-medium text-[#2C2C2A]'
                        : 'border-[#E6DFD3] text-[#5C5850] hover:border-[#9A9886]'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full bg-[#E0E0E0] border border-[#BDBDBD]" />
                    <span>Silver-Tone Alloy</span>
                  </button>
                </div>
              </div>

              {/* Size Selector if available */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-[#2C2C2A]">Select Size</span>
                    <span className="text-[#7D7973]">{selectedSize}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedSize(s)}
                        className={`px-3 py-1.5 text-xs rounded-xs border cursor-pointer transition-all ${
                          selectedSize === s
                            ? 'border-[#2C2C2A] bg-[#2C2C2A] text-white font-medium'
                            : 'border-[#E6DFD3] text-[#5C5850] hover:border-[#2C2C2A]'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions: Quantity + Add to Bag + Wishlist */}
            <div className="space-y-3 pt-4 border-t border-[#E6DFD3]">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-[#E6DFD3] rounded-xs bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-xs text-[#2C2C2A] hover:bg-[#F3EFE6] cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-semibold text-[#2C2C2A]">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-xs text-[#2C2C2A] hover:bg-[#F3EFE6] cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Add to Bag Button */}
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={isAdded}
                  className={`flex-1 py-3 px-4 rounded-xs text-xs font-medium uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                    isAdded
                      ? 'bg-[#2C2C2A] text-[#C5A059]'
                      : 'bg-[#2C2C2A] hover:bg-[#444238] text-white'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4 text-[#C5A059]" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag • {formatPrice(product.price * quantity, currency)}</span>
                    </>
                  )}
                </button>

                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={() => onToggleWishlist(product)}
                  className="p-3 border border-[#E6DFD3] hover:border-[#2C2C2A] rounded-xs bg-white text-[#2C2C2A] transition-colors cursor-pointer"
                  title="Save to Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#C5A059] text-[#C5A059]' : ''}`} />
                </button>
              </div>

              {/* View Full Details Link */}
              <button
                type="button"
                onClick={handleGoToPdp}
                className="w-full text-center text-xs text-[#7D7973] hover:text-[#2C2C2A] uppercase tracking-wider font-medium flex items-center justify-center gap-1 cursor-pointer pt-1"
              >
                <span>View Complete Atelier Details & Dimensions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
