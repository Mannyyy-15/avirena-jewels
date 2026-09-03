import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Heart,
  Plus,
  Minus,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Share2,
  ExternalLink,
  Star,
  Ruler,
  Gem,
  Package,
  X,
  Lock,
  Clock
} from 'lucide-react';
import { Product, Currency, Metal, CartItem } from '../types';
import { PRODUCTS, formatPrice } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { RingSizerModal } from '../components/RingSizerModal';
import { useShopify } from '../context/ShopifyContext';

interface ProductDetailPageProps {
  product: Product;
  currency: Currency;
  onAddToCart: (item: Omit<CartItem, 'id'>) => void;
  onSelectProduct: (product: Product) => void;
  onNavigateBack: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  currency,
  onAddToCart,
  onSelectProduct,
  onNavigateBack,
  isWishlisted,
  onToggleWishlist,
}) => {
  const { isConfigured, addToShopifyCart } = useShopify();
  const [selectedMetal, setSelectedMetal] = useState<Metal>(product.metal);
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : ''
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isSizingModalOpen, setIsSizingModalOpen] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const buyBoxRef = useRef<HTMLDivElement>(null);

  // Sync state if product changes
  useEffect(() => {
    setSelectedMetal(product.metal);
    setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : '');
    setActiveImageIndex(0);
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product.id]);

  // Scroll listener for Sticky Add To Cart bar
  useEffect(() => {
    const handleScroll = () => {
      if (buyBoxRef.current) {
        const rect = buyBoxRef.current.getBoundingClientRect();
        setShowStickyBar(rect.bottom < 100);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Accordion states
  const [openAccordion, setOpenAccordion] = useState<'desc' | 'materials' | 'shipping' | 'care'>('desc');

  const toggleAccordion = (key: 'desc' | 'materials' | 'shipping' | 'care') => {
    setOpenAccordion(openAccordion === key ? null : key);
  };

  const handleAddToCart = async () => {
    onAddToCart({
      product,
      quantity,
      metal: selectedMetal,
      size: selectedSize || undefined,
    });
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);

    if (isConfigured && product.variants && product.variants.length > 0) {
      const targetVariant = product.variants[0];
      if (targetVariant?.id) {
        await addToShopifyCart(targetVariant.id, quantity);
      }
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const styledWithProducts = (product.styledWithIds || [])
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter(Boolean) as Product[];

  const relatedProducts = PRODUCTS.filter(
    (p) => p.id !== product.id && p.category === product.category
  ).slice(0, 4);

  const imagesList = product.images && product.images.length > 0 ? product.images : [
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=90'
  ];

  const installmentPrice = Math.round(product.price / 4);

  return (
    <div className="space-y-12 sm:space-y-16 pb-24 text-left font-sans-body w-full text-[#413C23] bg-[#E7E4D5] select-none">
      
      {/* 1. BREADCRUMBS */}
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 pt-4">
        <nav className="flex items-center space-x-2 text-xs uppercase tracking-wider text-[#8F896D]">
          <button onClick={onNavigateBack} className="hover:text-[#413C23] transition-colors cursor-pointer font-medium">
            Atelier Catalog
          </button>
          <span>/</span>
          <span className="capitalize">{product.category}</span>
          <span>/</span>
          <span className="text-[#413C23] font-semibold truncate max-w-[240px]">{product.name}</span>
        </nav>
      </div>

      {/* 2. FULL-WIDTH PRODUCT DETAIL SPLIT */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16 items-start">
          
          {/* LEFT: Full Gallery with Large Canvas & Thumbnails */}
          <div className="lg:col-span-7 space-y-4">
            <div className="aspect-square sm:aspect-[4/3] lg:aspect-square bg-[#F4EFE6] border border-[#D8D2C2] rounded-xs overflow-hidden flex items-center justify-center p-6 sm:p-10 relative shadow-xs">
              <img
                src={imagesList[activeImageIndex] || imagesList[0]}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain mix-blend-multiply transition-all duration-300"
              />

              {product.isBestseller && (
                <span className="absolute top-4 left-4 bg-[#413C23] text-[#E7E4D5] text-[10px] tracking-widest uppercase font-bold px-3 py-1 rounded-xs shadow-xs">
                  Bestseller
                </span>
              )}

              <button
                onClick={() => onToggleWishlist(product)}
                className="absolute top-4 right-4 p-2 rounded-full bg-[#FAF8F5]/95 hover:bg-white text-[#8F896D] hover:text-[#7A0F1A] transition-all shadow-sm cursor-pointer border border-[#D8D2C2]/50"
                title={isWishlisted ? 'Saved to Wishlist' : 'Save to Wishlist'}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#7A0F1A] text-[#7A0F1A]' : 'stroke-[1.5]'}`} />
              </button>
            </div>

            {/* Thumbnails Row */}
            {imagesList.length > 1 && (
              <div className="grid grid-cols-4 gap-3 sm:gap-4">
                {imagesList.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`aspect-square bg-[#F4EFE6] rounded-xs border p-2 flex items-center justify-center overflow-hidden transition-all cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-[#413C23] ring-2 ring-[#413C23]/20 shadow-xs'
                        : 'border-[#D8D2C2] hover:border-[#8F896D] opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} view ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Buy Box & Accordions */}
          <div ref={buyBoxRef} className="lg:col-span-5 space-y-6 bg-[#F4EFE6] p-6 sm:p-8 rounded-xs border border-[#D8D2C2] shadow-xs">
            {/* Header: Title, Subtitle, Price, Rating */}
            <div className="space-y-2 border-b border-[#D8D2C2] pb-5">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#8F896D]">
                  {selectedMetal}
                </span>
                <div className="flex items-center gap-1 text-[#8F896D]">
                  <Star className="w-3.5 h-3.5 fill-[#8F896D]" />
                  <span className="font-bold text-xs text-[#413C23]">{product.rating || 4.9}</span>
                  <span className="text-xs text-[#8F896D]">({product.reviewsCount || 42} reviews)</span>
                </div>
              </div>

              <h1 className="font-serif-display text-2xl sm:text-4xl text-[#413C23] leading-tight font-normal">
                {product.name}
              </h1>

              {product.subtitle && (
                <p className="text-xs sm:text-sm text-[#8F896D] font-normal">{product.subtitle}</p>
              )}

              <div className="flex items-baseline gap-3 pt-1">
                <span className="font-serif-display text-2xl sm:text-3xl text-[#413C23] font-semibold">
                  {formatPrice(product.price, currency)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-[#8F896D] line-through">
                    {formatPrice(product.originalPrice, currency)}
                  </span>
                )}
                <span className="text-[11px] text-[#413C23] bg-[#E7E4D5] px-2.5 py-0.5 rounded-xs font-semibold border border-[#D8D2C2]">
                  In Stock & Ready to Ship
                </span>
              </div>

              {/* Installments info */}
              <p className="text-[11px] text-[#8F896D] pt-1">
                Or 4 interest-free payments of <strong className="text-[#413C23]">{formatPrice(installmentPrice, currency)}</strong> with Klarna or Afterpay
              </p>
            </div>

            {/* Material / Metal Switcher */}
            <div className="space-y-2.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#413C23] block">
                Precious Metal: <span className="font-normal text-[#8F896D]">{selectedMetal}</span>
              </span>
              <div className="flex gap-2.5">
                {(['18k Gold Vermeil', '925 Sterling Silver'] as Metal[]).map((metal) => (
                  <button
                    key={metal}
                    onClick={() => setSelectedMetal(metal)}
                    className={`flex-1 py-2.5 px-3 rounded-xs border text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      selectedMetal === metal
                        ? 'bg-[#413C23] text-[#E7E4D5] border-[#413C23] shadow-xs'
                        : 'bg-[#E7E4D5] text-[#413C23] border-[#D8D2C2] hover:border-[#413C23]'
                    }`}
                  >
                    <span
                      className={`w-3 h-3 rounded-full border ${
                        metal.includes('Gold') ? 'bg-[#D4AF37] border-[#BF9B2D]' : 'bg-[#E0E0E0] border-[#BDBDBD]'
                      }`}
                    />
                    <span>{metal === '18k Gold Vermeil' ? '18k Vermeil' : '925 Silver'}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes & Ring Sizing Guide Helper */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold uppercase tracking-wider text-[#413C23]">
                    Size / Length: <span className="font-normal text-[#8F896D]">{selectedSize}</span>
                  </span>
                  <button
                    onClick={() => setIsSizingModalOpen(true)}
                    className="text-[#8F896D] hover:text-[#413C23] font-semibold underline underline-offset-4 flex items-center gap-1 cursor-pointer"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Ring Size Guide</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-xs border text-xs font-semibold transition-all cursor-pointer ${
                        selectedSize === size
                          ? 'bg-[#413C23] text-[#E7E4D5] border-[#413C23]'
                          : 'bg-[#E7E4D5] text-[#413C23] border-[#D8D2C2] hover:border-[#413C23]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Add to Bag */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-[#D8D2C2] rounded-xs bg-[#E7E4D5] px-3 py-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 text-[#8F896D] hover:text-[#413C23] transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-semibold text-[#413C23] min-w-[24px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 text-[#8F896D] hover:text-[#413C23] transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Bag CTA */}
                <button
                  id="pdp-add-to-cart-btn"
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 bg-[#413C23] hover:bg-[#8F896D] text-[#E7E4D5] text-xs uppercase tracking-[0.2em] font-semibold rounded-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-4 h-4 text-[#D4AF37]" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Add to Shopping Bag • {formatPrice(product.price * quantity, currency)}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Scarcity & Shipping Assurance */}
              <div className="p-3.5 bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs space-y-2 text-xs">
                <div className="flex items-center justify-between text-[#413C23]">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#8F896D]" />
                    <span>Dispatch: Within 24 hours</span>
                  </span>
                  <span className="text-[10px] text-[#8F896D] uppercase font-bold">Small Batch #04</span>
                </div>

                {/* Pincode / Postal Delivery Checker */}
                <div className="pt-1.5 border-t border-[#D8D2C2]/60">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Enter Delivery Pincode / Postal Code"
                      maxLength={8}
                      className="w-full px-3 py-1.5 bg-[#F4EFE6] border border-[#D8D2C2] rounded-xs text-[11px] text-[#413C23] placeholder-[#8F896D]/70 focus:outline-none focus:border-[#8F896D]"
                      defaultValue="400050"
                    />
                    <button
                      type="button"
                      className="px-3 py-1.5 bg-[#413C23] hover:bg-[#8F896D] text-[#E7E4D5] text-[10px] uppercase tracking-wider font-semibold rounded-xs transition-colors shrink-0 cursor-pointer"
                    >
                      Check
                    </button>
                  </div>
                  <p className="text-[10px] text-[#413C23] font-medium pt-1.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#8F896D]" />
                    <span>Express Air Delivery in 2–3 Days • Cash on Delivery & Prepaid Available</span>
                  </p>
                </div>

                {/* 10% First Order Coupon Banner */}
                <div className="p-2 bg-[#E7E4D5]/70 rounded-xs border border-[#D8D2C2] flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-[#413C23]">🏷️ First Atelier Order?</span>
                  <span className="text-[10px] text-[#8F896D] font-mono font-bold bg-[#FAF8F5] px-2 py-0.5 rounded-xs border border-[#D8D2C2]">
                    CODE: LUXE10
                  </span>
                </div>
              </div>
            </div>

            {/* Accordions */}
            <div className="border-t border-[#D8D2C2] divide-y divide-[#D8D2C2] pt-2">
              {/* Description */}
              <div className="py-3">
                <button
                  onClick={() => toggleAccordion('desc')}
                  className="w-full flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#413C23] cursor-pointer"
                >
                  <span>Design & Sculpture Story</span>
                  {openAccordion === 'desc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordion === 'desc' && (
                  <div className="pt-3 text-xs text-[#413C23]/80 leading-relaxed font-normal space-y-2">
                    <p>{product.description}</p>
                    {product.features && (
                      <ul className="list-disc list-inside space-y-1 pt-1 text-[#413C23]/90">
                        {product.features.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* Material Details */}
              <div className="py-3">
                <button
                  onClick={() => toggleAccordion('materials')}
                  className="w-full flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#413C23] cursor-pointer"
                >
                  <span>Material Standards & Dimensions</span>
                  {openAccordion === 'materials' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordion === 'materials' && (
                  <div className="pt-3 text-xs text-[#413C23]/80 leading-relaxed space-y-1.5 font-normal">
                    {product.details?.material && (
                      <div className="flex justify-between">
                        <span className="text-[#8F896D]">Metal Composition</span>
                        <span className="font-semibold text-[#413C23]">{product.details.material}</span>
                      </div>
                    )}
                    {product.details?.dimensions && (
                      <div className="flex justify-between">
                        <span className="text-[#8F896D]">Dimensions</span>
                        <span className="font-semibold text-[#413C23]">{product.details.dimensions}</span>
                      </div>
                    )}
                    {product.details?.origin && (
                      <div className="flex justify-between">
                        <span className="text-[#8F896D]">Artisan Provenance</span>
                        <span className="font-semibold text-[#413C23]">{product.details.origin}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Shipping & Returns */}
              <div className="py-3">
                <button
                  onClick={() => toggleAccordion('shipping')}
                  className="w-full flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#413C23] cursor-pointer"
                >
                  <span>Complimentary Shipping & Returns</span>
                  {openAccordion === 'shipping' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordion === 'shipping' && (
                  <div className="pt-3 text-xs text-[#413C23]/80 leading-relaxed space-y-2 font-normal">
                    <p>• Complimentary express courier shipping with real-time tracking.</p>
                    <p>• 30-day hassle-free returns & doorstep pickup.</p>
                    <p>• 2-Year Maison Warranty covering all structural craftsmanship.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Share & Inquire Links */}
            <div className="pt-2 flex items-center justify-between text-xs border-t border-[#D8D2C2]">
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 text-[#8F896D] hover:text-[#413C23] transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedLink ? 'Link Copied!' : 'Share Creation'}</span>
              </button>
              <a
                href="https://wa.me/919820012345?text=Hello%20Avirena,%20I%20have%20an%20inquiry%20about%20the%20"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#8F896D] hover:text-[#413C23] underline cursor-pointer"
              >
                Ask Concierge on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. STYLED WITH / COMPLETE THE SET */}
      {styledWithProducts.length > 0 && (
        <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-12 border-t border-[#D8D2C2]">
          <div className="space-y-8 text-left">
            <div className="flex items-end justify-between border-b border-[#D8D2C2] pb-4">
              <div>
                <span className="text-[10px] text-[#8F896D] uppercase tracking-widest font-semibold block mb-1">
                  Atelier Stacking
                </span>
                <h3 className="font-serif-display text-2xl sm:text-4xl text-[#413C23] font-light">
                  Styled Beautifully With
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {styledWithProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  currency={currency}
                  onSelect={onSelectProduct}
                  onQuickAdd={() => onAddToCart({ product: p, quantity: 1, metal: p.metal })}
                  isWishlisted={false}
                  onToggleWishlist={onToggleWishlist}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. RELATED CREATIONS */}
      {relatedProducts.length > 0 && (
        <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-12 border-t border-[#D8D2C2]">
          <div className="space-y-8 text-left">
            <div className="flex items-end justify-between border-b border-[#D8D2C2] pb-4">
              <div>
                <span className="text-[10px] text-[#8F896D] uppercase tracking-widest font-semibold block mb-1">
                  More In {product.category}
                </span>
                <h3 className="font-serif-display text-2xl sm:text-4xl text-[#413C23] font-light">
                  Complementary Creations
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  currency={currency}
                  onSelect={onSelectProduct}
                  onQuickAdd={() => onAddToCart({ product: p, quantity: 1, metal: p.metal })}
                  isWishlisted={false}
                  onToggleWishlist={onToggleWishlist}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* STICKY BOTTOM ADD TO CART BAR (Floats on scroll) */}
      {showStickyBar && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-t border-[#D8D2C2] p-3.5 sm:p-4 shadow-xl animate-in slide-in-from-bottom duration-300">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={imagesList[0]}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-11 h-11 object-cover rounded-xs border border-[#D8D2C2] shrink-0"
              />
              <div className="truncate hidden sm:block">
                <h4 className="font-serif-display text-sm font-medium text-[#413C23] truncate">
                  {product.name}
                </h4>
                <span className="text-[10px] text-[#8F896D] uppercase tracking-wider block">
                  {selectedMetal} {selectedSize && `• ${selectedSize}`}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="font-serif-display text-base sm:text-lg font-semibold text-[#413C23]">
                {formatPrice(product.price * quantity, currency)}
              </span>
              <button
                onClick={handleAddToCart}
                className="px-6 py-2.5 bg-[#413C23] hover:bg-[#8F896D] text-[#E7E4D5] text-xs uppercase tracking-widest font-semibold rounded-xs transition-all shadow-sm cursor-pointer"
              >
                {addedAnimation ? 'Added!' : 'Add to Bag'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ring Sizer Modal */}
      <RingSizerModal
        isOpen={isSizingModalOpen}
        onClose={() => setIsSizingModalOpen(false)}
        onSelectSize={(sz) => setSelectedSize(sz)}
      />

    </div>
  );
};
