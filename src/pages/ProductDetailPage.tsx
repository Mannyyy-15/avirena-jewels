import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { Product, Currency, Metal, CartItem } from '../types';
import { PRODUCTS, formatPrice } from '../data/products';
import { ProductCard } from '../components/ProductCard';
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

  // Sync state if product changes
  useEffect(() => {
    setSelectedMetal(product.metal);
    setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : '');
    setActiveImageIndex(0);
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product.id]);

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

  return (
    <div className="space-y-12 sm:space-y-16 pb-24 text-left font-sans-body w-full text-[#413C23] bg-[#E7E4D5]">
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
          <div className="lg:col-span-5 space-y-6 bg-[#F4EFE6] p-6 sm:p-8 rounded-xs border border-[#D8D2C2] shadow-xs">
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
                    <span>Sizing Guide</span>
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
                    className="text-[#8F896D] hover:text-[#413C23] p-1 cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-[#413C23]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-[#8F896D] hover:text-[#413C23] p-1 cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Cart CTA */}
                <button
                  id="pdp-add-to-cart-btn"
                  onClick={handleAddToCart}
                  className={`flex-1 py-3.5 px-6 uppercase tracking-[0.2em] font-semibold text-xs rounded-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
                    addedAnimation
                      ? 'bg-[#8F896D] text-white'
                      : 'bg-[#413C23] hover:bg-[#8F896D] text-[#E7E4D5] active:scale-98'
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <span>Add to Bag • {formatPrice(product.price * quantity, currency)}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Share and Wishlist Action Bar */}
              <div className="flex items-center justify-between text-xs text-[#8F896D] pt-1">
                <button
                  onClick={() => onToggleWishlist(product)}
                  className="flex items-center gap-1.5 hover:text-[#7A0F1A] transition-colors cursor-pointer"
                >
                  <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-[#7A0F1A] text-[#7A0F1A]' : ''}`} />
                  <span>{isWishlisted ? 'Saved in Wishlist' : 'Save to Wishlist'}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 hover:text-[#413C23] transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedLink ? 'Link Copied!' : 'Share Piece'}</span>
                </button>
              </div>
            </div>

            {/* Accordions */}
            <div className="divide-y divide-[#E8E2D6] border-t border-[#E8E2D6] pt-2">
              {/* 1. Description */}
              <div className="py-3">
                <button
                  onClick={() => toggleAccordion('desc')}
                  className="w-full flex items-center justify-between text-left text-xs font-semibold uppercase tracking-wider text-[#111111] cursor-pointer"
                >
                  <span>Description & Silhouette</span>
                  {openAccordion === 'desc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordion === 'desc' && (
                  <div className="mt-2 text-xs text-[#5C5850] leading-relaxed space-y-2">
                    <p>{product.description}</p>
                    {product.details && (
                      <ul className="list-disc pl-4 space-y-1">
                        {product.details.map((detail, idx) => (
                          <li key={idx}>{detail}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* 2. Materials & Sustainability */}
              <div className="py-3">
                <button
                  onClick={() => toggleAccordion('materials')}
                  className="w-full flex items-center justify-between text-left text-xs font-semibold uppercase tracking-wider text-[#111111] cursor-pointer"
                >
                  <span>Materials & Sustainability</span>
                  {openAccordion === 'materials' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordion === 'materials' && (
                  <div className="mt-2 text-xs text-[#5C5850] leading-relaxed space-y-2">
                    <p><strong>Composition:</strong> {product.materials}</p>
                    <p>All Avirena metals are 100% recycled precious silver and ethically mined gold alloys compliant with the Responsible Jewellery Council (RJC).</p>
                  </div>
                )}
              </div>

              {/* 3. Insured Delivery & Returns */}
              <div className="py-3">
                <button
                  onClick={() => toggleAccordion('shipping')}
                  className="w-full flex items-center justify-between text-left text-xs font-semibold uppercase tracking-wider text-[#111111] cursor-pointer"
                >
                  <span>Insured Delivery & Returns</span>
                  {openAccordion === 'shipping' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordion === 'shipping' && (
                  <div className="mt-2 text-xs text-[#5C5850] leading-relaxed space-y-1.5">
                    <p>• Complimentary insured DHL Express on orders over $150.</p>
                    <p>• Signature required upon receipt for maximum safety.</p>
                    <p>• 30-day hassle-free return window with pre-paid return labels.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. STYLED WITH / COMPLETE THE LOOK */}
      {styledWithProducts.length > 0 && (
        <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-10 border-t border-[#E8E2D6] bg-white">
          <div className="w-full space-y-6">
            <div className="flex items-end justify-between border-b border-[#E8E2D6] pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-bold block">
                  Curated Pairings
                </span>
                <h2 className="font-serif-display text-2xl sm:text-3xl text-[#111111]">
                  Complete The Look
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {styledWithProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  currency={currency}
                  onSelect={onSelectProduct}
                  onQuickAdd={onAddToCart}
                  isWishlisted={isWishlisted}
                  onToggleWishlist={onToggleWishlist}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. SIZING GUIDE MODAL HELPER */}
      {isSizingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] max-w-lg w-full rounded-xs border border-[#E8E2D6] p-6 space-y-4 shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#E8E2D6] pb-3">
              <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="font-serif-display text-lg text-[#111111]">Atelier Sizing Guide</h3>
              </div>
              <button
                onClick={() => setIsSizingModalOpen(false)}
                className="p-1 text-[#5C5850] hover:text-[#111111] cursor-pointer"
              >
                <X className="w-5 h-5 stroke-[1.5]" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#5C5850] leading-relaxed">
              <p>To ensure a flawless fit, refer to standard measurements below:</p>
              
              <div className="border border-[#E8E2D6] rounded-xs overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-[#EAE4D8] text-[#111111] font-semibold text-[11px]">
                    <tr>
                      <th className="p-2 border-b border-[#E8E2D6]">Ring Size</th>
                      <th className="p-2 border-b border-[#E8E2D6]">Inner Circumference</th>
                      <th className="p-2 border-b border-[#E8E2D6]">US / UK Equivalent</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E2D6] bg-white">
                    <tr><td className="p-2">Size 5</td><td className="p-2">49.3 mm</td><td className="p-2">US 5 / UK J½</td></tr>
                    <tr><td className="p-2">Size 6</td><td className="p-2">51.9 mm</td><td className="p-2">US 6 / UK M</td></tr>
                    <tr><td className="p-2">Size 7</td><td className="p-2">54.4 mm</td><td className="p-2">US 7 / UK O</td></tr>
                    <tr><td className="p-2">Size 8</td><td className="p-2">57.0 mm</td><td className="p-2">US 8 / UK Q</td></tr>
                  </tbody>
                </table>
              </div>

              <p className="text-[11px] text-[#5C5850] pt-1">
                Need bespoke resizing or custom sizing assistance? Contact our Atelier Concierge for private styling assistance.
              </p>
            </div>

            <button
              onClick={() => setIsSizingModalOpen(false)}
              className="w-full py-2.5 bg-[#111111] text-white text-xs uppercase tracking-widest font-semibold rounded-xs cursor-pointer hover:bg-[#D4AF37] transition-colors"
            >
              Got It, Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
