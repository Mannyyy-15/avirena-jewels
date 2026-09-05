import React, { useState, useEffect } from 'react';
import { ChevronRight, Plus, Minus, Heart, Maximize2 } from 'lucide-react';
import { Product, Currency, Metal, CartItem } from '../types';
import { formatPrice } from '../data/products';
import { useShopify } from '../context/ShopifyContext';
import { ProductImageLightbox } from '../components/ProductImageLightbox';

interface ProductDetailPageProps {
  product: Product;
  currency: Currency;
  onAddToCart: (item: Omit<CartItem, 'id'>) => void;
  onSelectProduct: (product: Product) => void;
  onNavigateBack: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  catalogProducts?: Product[];
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  currency,
  onAddToCart,
  onSelectProduct,
  onNavigateBack,
  isWishlisted,
  onToggleWishlist,
  catalogProducts = [],
}) => {
  const { isConfigured, addToShopifyCart, syncLocalCartToShopify } = useShopify();

  // Buy Now redirects to Shopify; this disables the button while that resolves
  // so a second tap cannot create a second checkout.
  const [isBuyingNow, setIsBuyingNow] = useState(false);

  // Finish selector: "Gold Tone Brass" and "Silver Tone Brass"
  const [selectedFinish, setSelectedFinish] = useState<'Gold Tone Brass' | 'Silver Tone Brass'>('Gold Tone Brass');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Long Shopify descriptions are clamped to 4 lines so the price and Add to
  // Bag stay above the fold; this toggles the full text.
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // Interactive Magnifying Zoom Lens State
  const [zoomPosition, setZoomPosition] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  // Fullscreen High-Res Lightbox State (Mobile & Desktop)
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  // Accordion state (Product Description, Materials / Composition, Dimensions & Fit, Care)
  const [openAccordion, setOpenAccordion] = useState<'description' | 'materials' | 'dimensions' | 'care' | null>(null);

  // Bottom Tabs state (Product Overview, Packaging, Shipping & Returns)
  const [activeTab, setActiveTab] = useState<'overview' | 'packaging' | 'shipping'>('overview');

  // Live Shopify catalog only (drives 'styled with' / related pieces).
  const activeProducts = Array.isArray(catalogProducts) ? catalogProducts : [];

  // Gallery shows this product's OWN photography and nothing else. It used to
  // be padded to 5 thumbnails with Unsplash stock photos, which showed shoppers
  // jewelry that was not the item they were buying. A short gallery is honest;
  // a padded one is not. Falls back to the brand logo only if Shopify has no
  // image at all, so the <img> is never broken.
  const imagesList =
    product.images && product.images.length > 0 ? product.images : ['/logo.png'];

  useEffect(() => {
    setActiveImageIndex(0);
    setOpenAccordion(null);
    setActiveTab('overview');
    setIsZoomed(false);
    setIsLightboxOpen(false);
    setIsDescriptionExpanded(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product.id]);

  const toggleAccordion = (key: 'description' | 'materials' | 'dimensions' | 'care') => {
    setOpenAccordion(openAccordion === key ? null : key);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomPosition({ x, y });
  };

  const handleAddToCart = async () => {
    onAddToCart({
      product,
      quantity: 1,
      metal: selectedFinish === 'Gold Tone Brass' ? 'Gold-Tone Brass' : 'Silver-Tone Alloy',
    });

    if (isConfigured && product.variants && product.variants.length > 0) {
      const targetVariant = product.variants[0];
      if (targetVariant?.id) {
        await addToShopifyCart(targetVariant.id, 1);
      }
    }
  };

  /**
   * Buy Now: straight to Shopify checkout with only this piece.
   *
   * Deliberately does NOT touch the local bag — a shopper using Buy Now is
   * buying this one item, and silently adding it to a bag they may already
   * have items in (or leaving it there after an abandoned checkout) creates
   * duplicates. syncLocalCartToShopify creates a fresh Shopify cart from the
   * lines passed in, so we hand it this product alone.
   *
   * If Shopify is not configured or the variant is missing, fall back to the
   * normal add-to-bag flow rather than leaving the button dead.
   */
  const handleBuyNow = async () => {
    const metal: Metal = selectedFinish === 'Gold Tone Brass' ? 'Gold-Tone Brass' : 'Silver-Tone Alloy';
    const variantId = product.variants && product.variants.length > 0 ? product.variants[0].id : undefined;

    if (isConfigured && variantId) {
      setIsBuyingNow(true);
      try {
        const checkoutUrl = await syncLocalCartToShopify([
          { id: `buynow-${product.id}`, product, quantity: 1, metal, variantId },
        ]);
        if (checkoutUrl) {
          window.location.href = checkoutUrl;
          return;
        }
      } catch (e) {
        console.warn('[BuyNow] Falling back to add-to-bag:', e);
      } finally {
        setIsBuyingNow(false);
      }
    }

    // Fallback: add to the bag and open the drawer so the sale is still reachable.
    await handleAddToCart();
  };

  const handleQuickAddRecommendation = async (recommendedItem: Product) => {
    onAddToCart({
      product: recommendedItem,
      quantity: 1,
      metal: recommendedItem.metal,
    });

    if (isConfigured && recommendedItem.variants && recommendedItem.variants.length > 0) {
      const targetVariant = recommendedItem.variants[0];
      if (targetVariant?.id) {
        await addToShopifyCart(targetVariant.id, 1);
      }
    }
  };

  // Complementary recommendations for "Perfect match with"
  const complementaryItems = activeProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="w-full min-h-screen bg-[#E7E4D5] text-[#413C23] font-sans-body text-left select-none pb-24">
      
      {/* 1. TOP BREADCRUMBS */}
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 pt-5 pb-3">
        <nav className="flex items-center space-x-1.5 text-xs text-[#8F896D]">
          <button
            onClick={() => window.location.href = '/'}
            className="hover:text-[#413C23] transition-colors cursor-pointer"
          >
            Home
          </button>
          <span>/</span>
          <button
            onClick={onNavigateBack}
            className="hover:text-[#413C23] transition-colors cursor-pointer"
          >
            Shop
          </button>
          <span>/</span>
          <span className="capitalize">{product.category}</span>
          <span>/</span>
          <span className="text-[#413C23] font-semibold truncate max-w-[260px] sm:max-w-md">
            {product.name}
          </span>
        </nav>
      </div>

      {/* 2. MAIN 100VH VIEWPORT FOLD */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 pt-1 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-14 items-start w-full">
          
          {/* LEFT: Hero Image with Interactive Magnifying Zoom Lens */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-4 w-full">
            {/* Main Interactive Zoom Canvas.
                Square on mobile, 4:5 portrait from sm up: a 4:5 canvas on a
                390px screen is ~490px tall, which pushed the title, price and
                Add to Bag below the fold before the shopper saw them. */}
            <div
              onClick={() => setIsLightboxOpen(true)}
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
              className="relative w-full aspect-square sm:aspect-[4/5] max-h-[calc(100vh-140px)] bg-[#F2EFDB] border border-[#D8D2C2] rounded-xs overflow-hidden flex items-center justify-center cursor-pointer sm:cursor-crosshair shadow-xs select-none group/canvas"
            >
              <img
                src={imagesList[activeImageIndex] || imagesList[0]}
                alt={product.name}
                referrerPolicy="no-referrer"
                width={1000}
                height={1250}
                loading="eager"
                fetchPriority="high"
                decoding="sync"
                style={{
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                }}
                className={`w-full h-full object-cover object-center transition-transform duration-100 ease-out select-none pointer-events-none ${
                  isZoomed ? 'sm:scale-[2.4] scale-100' : 'scale-100'
                }`}
              />

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleWishlist(product);
                }}
                className="absolute top-3.5 right-3.5 z-10 p-2.5 rounded-full bg-[#FAF8F5]/90 hover:bg-[#FAF8F5] text-[#413C23] transition-all shadow-xs cursor-pointer border border-[#D8D2C2]"
                title={isWishlisted ? 'Saved to Wishlist' : 'Save to Wishlist'}
                aria-label="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#7A0F1A] text-[#7A0F1A]' : 'stroke-[1.5]'}`} />
              </button>

              {/* Fullscreen Expand Button (Mobile & Desktop) */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLightboxOpen(true);
                }}
                className="absolute top-3.5 left-3.5 z-10 p-2.5 rounded-full bg-[#FAF8F5]/90 hover:bg-[#FAF8F5] text-[#413C23] transition-all shadow-xs cursor-pointer border border-[#D8D2C2] flex items-center justify-center group-hover/canvas:scale-105"
                title="Expand image fullscreen"
                aria-label="Expand image fullscreen"
              >
                <Maximize2 className="w-4 h-4 text-[#413C23]" />
              </button>

              {/* Desktop hint: Hover to Zoom • Click to Expand */}
              <div className="hidden sm:block absolute bottom-3 left-3.5 pointer-events-none text-[9px] uppercase tracking-widest text-[#8F896D] font-semibold bg-[#FAF8F5]/85 px-2 py-0.5 rounded-2xs border border-[#D8D2C2]/60 backdrop-blur-xs">
                Hover to Zoom • Click to Expand
              </div>

              {/* Mobile hint: Tap to Expand */}
              <div className="flex sm:hidden items-center gap-1.5 absolute bottom-3 left-3.5 pointer-events-none text-[9px] uppercase tracking-widest text-[#413C23] font-semibold bg-[#FAF8F5]/90 px-2.5 py-1 rounded-xs border border-[#D8D2C2] shadow-xs">
                <Maximize2 className="w-3 h-3 text-[#8F896D]" />
                <span>Tap to Expand</span>
              </div>
            </div>

            {/* Mobile Thumbnails Strip (Immediately below hero image on mobile) */}
            <div className="flex lg:hidden items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
              {imagesList.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-12 h-12 sm:w-16 sm:h-16 shrink-0 aspect-square rounded-xs border overflow-hidden transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-[#413C23] ring-2 ring-[#413C23]/25'
                      : 'border-[#D8D2C2] opacity-80 hover:opacity-100'
                  }`}
                  aria-label={`View image ${idx + 1}`}
                >
                  <img
                    src={img}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    width={160}
                    height={160}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-center"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Buy Box, Narrative, Finish Selector, CTA & Accordions (Full-Width Content) */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-5 w-full text-left">
            
            {/* Category Tag & Brand Serif Title */}
            <div className="space-y-1.5 w-full">
              <span className="text-[10px] uppercase tracking-[0.22em] font-semibold text-[#8F896D] block">
                {product.category || 'Fine Jewelry'}
              </span>
              <h1 className="font-serif-display text-3xl sm:text-4xl lg:text-[44px] text-[#413C23] font-light leading-tight tracking-tight w-full">
                {product.name}
              </h1>
            </div>

            {/* Narrative description, clamped to 4 lines.
                Full Shopify descriptions run several hundred words; printed in
                full they pushed the price and Add to Bag below the fold, so a
                shopper had to scroll past the whole story to buy. The text is
                always in the DOM (line-clamp is CSS only), so crawlers and
                screen readers still get all of it. */}
            <div className="space-y-1.5 text-xs sm:text-sm text-[#413C23]/85 leading-relaxed font-normal w-full">
              <p className="font-semibold text-[#413C23] tracking-wide">
                Raw, Radiant, Eternal.
              </p>
              <p className={`w-full ${isDescriptionExpanded ? '' : 'line-clamp-4'}`}>
                {product.description ||
                  'Hand-sculpted jewelry with organic texture and sculptural form. Each curve tells a story of light, resilience, and individuality.'}
              </p>
              <button
                type="button"
                onClick={() => setIsDescriptionExpanded((v) => !v)}
                className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#8F896D] hover:text-[#413C23] transition-colors cursor-pointer underline underline-offset-4 decoration-[#D8D2C2]"
                aria-expanded={isDescriptionExpanded}
              >
                {isDescriptionExpanded ? 'Read less' : 'Read more'}
              </button>
            </div>

            {/* Price */}
            <div className="pt-1">
              <span className="text-2xl sm:text-3xl font-bold text-[#413C23] tracking-tight">
                {formatPrice(product.price, currency)}
              </span>
            </div>

            {/* Finish Selector (Gold Tone Brass & Silver Tone Brass) */}
            <div className="space-y-2 pt-1 w-full">
              <span className="text-xs font-semibold text-[#413C23] block uppercase tracking-wider">
                Finish
              </span>
              <div className="flex flex-wrap items-center gap-3">
                {(['Gold Tone Brass', 'Silver Tone Brass'] as const).map((finish) => (
                  <button
                    key={finish}
                    onClick={() => setSelectedFinish(finish)}
                    className={`px-5 py-2.5 rounded-xs border text-xs font-semibold transition-all cursor-pointer ${
                      selectedFinish === finish
                        ? 'border-[#413C23] bg-[#413C23] text-[#FAF8F5] shadow-xs'
                        : 'border-[#D8D2C2] text-[#413C23] bg-[#F2EFDB] hover:border-[#413C23]'
                    }`}
                  >
                    {finish}
                  </button>
                ))}
              </div>
            </div>

            {/* Primary CTA and Wishlist Action.
                Buy Now is the filled primary and Add to Bag the outlined
                secondary: a shopper who has decided should reach checkout in
                one tap, while browsing still has an obvious path. */}
            <div className="pt-3 flex flex-wrap items-center gap-4 sm:gap-6 w-full">
              <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2.5 sm:gap-3">
                <button
                  id="pdp-buy-now-cta"
                  onClick={handleBuyNow}
                  disabled={isBuyingNow}
                  className="w-full sm:w-auto sm:min-w-[190px] py-4 px-8 bg-[#413C23] hover:bg-[#8F896D] disabled:opacity-60 disabled:cursor-wait text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-semibold rounded-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  {isBuyingNow ? 'Taking you to checkout…' : 'Buy Now'}
                </button>

                <button
                  id="pdp-add-to-bag-cta"
                  onClick={handleAddToCart}
                  className="w-full sm:w-auto sm:min-w-[190px] py-4 px-8 bg-transparent border border-[#413C23] hover:bg-[#413C23] hover:text-[#FAF8F5] text-[#413C23] text-xs uppercase tracking-[0.2em] font-semibold rounded-xs transition-all flex items-center justify-center cursor-pointer active:scale-98"
                >
                  Add to Bag
                </button>
              </div>

              <button
                onClick={() => onToggleWishlist(product)}
                className="text-xs uppercase tracking-[0.16em] font-semibold text-[#413C23] hover:text-[#8F896D] transition-colors cursor-pointer flex items-center gap-1.5 underline underline-offset-4"
              >
                <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-[#7A0F1A] text-[#7A0F1A]' : ''}`} />
                <span>{isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}</span>
              </button>
            </div>

            {/* 4 Clean Hairline Accordions */}
            <div className="pt-4 border-t border-[#D8D2C2] divide-y divide-[#D8D2C2] w-full">
              
              {/* 1. Product Description */}
              <div className="py-3.5 w-full">
                <button
                  onClick={() => toggleAccordion('description')}
                  className="w-full flex items-center justify-between text-xs sm:text-[13px] font-medium text-[#413C23] hover:text-[#8F896D] transition-colors cursor-pointer"
                >
                  <span className="uppercase tracking-wider font-semibold">Product Description</span>
                  <span className="text-base text-[#413C23] font-light">
                    {openAccordion === 'description' ? '−' : '+'}
                  </span>
                </button>
                {openAccordion === 'description' && (
                  <div className="pt-3 text-xs text-[#413C23]/80 leading-relaxed space-y-1.5 font-normal w-full">
                    <p>{product.description}</p>
                    {product.details && product.details.length > 0 && (
                      <ul className="list-disc list-inside space-y-1 pt-1">
                        {product.details.map((detail, i) => (
                          <li key={i}>{detail}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* 2. Materials / Composition */}
              <div className="py-3.5 w-full">
                <button
                  onClick={() => toggleAccordion('materials')}
                  className="w-full flex items-center justify-between text-xs sm:text-[13px] font-medium text-[#413C23] hover:text-[#8F896D] transition-colors cursor-pointer"
                >
                  <span className="uppercase tracking-wider font-semibold">Materials / Composition</span>
                  <span className="text-base text-[#413C23] font-light">
                    {openAccordion === 'materials' ? '−' : '+'}
                  </span>
                </button>
                {openAccordion === 'materials' && (
                  <div className="pt-3 text-xs text-[#413C23]/80 leading-relaxed font-normal w-full">
                    <p>
                      {product.materials ||
                        'Hand-crafted in solid high-grade brass with a resilient protective anti-tarnish coating. 100% hypoallergenic, nickel-free, and lead-free dailywear formulation.'}
                    </p>
                  </div>
                )}
              </div>

              {/* 3. Dimensions & Fit */}
              <div className="py-3.5 w-full">
                <button
                  onClick={() => toggleAccordion('dimensions')}
                  className="w-full flex items-center justify-between text-xs sm:text-[13px] font-medium text-[#413C23] hover:text-[#8F896D] transition-colors cursor-pointer"
                >
                  <span className="uppercase tracking-wider font-semibold">Dimensions &amp; Fit</span>
                  <span className="text-base text-[#413C23] font-light">
                    {openAccordion === 'dimensions' ? '−' : '+'}
                  </span>
                </button>
                {openAccordion === 'dimensions' && (
                  <div className="pt-3 text-xs text-[#413C23]/80 leading-relaxed font-normal space-y-1 w-full">
                    <p>• Weight: Approx. 4.2g — featherweight comfort for continuous day-to-night wear.</p>
                    <p>• Profile: Ergonomically cast with smooth inner bevel for effortless daily wear.</p>
                  </div>
                )}
              </div>

              {/* 4. Care */}
              <div className="py-3.5 w-full">
                <button
                  onClick={() => toggleAccordion('care')}
                  className="w-full flex items-center justify-between text-xs sm:text-[13px] font-medium text-[#413C23] hover:text-[#8F896D] transition-colors cursor-pointer"
                >
                  <span className="uppercase tracking-wider font-semibold">Care</span>
                  <span className="text-base text-[#413C23] font-light">
                    {openAccordion === 'care' ? '−' : '+'}
                  </span>
                </button>
                {openAccordion === 'care' && (
                  <div className="pt-3 text-xs text-[#413C23]/80 leading-relaxed font-normal space-y-1 w-full">
                    <p>• Store in your provided AVIRENA signature keepsake pouch when not in use.</p>
                    <p>• Gently buff with a soft microfiber cloth to preserve its mirror polish.</p>
                    <p>• Avoid direct contact with harsh chlorine bleach or acetone.</p>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 3. BELOW THE 100VH FOLD: FULL-WIDTH THUMBNAILS GRID & EDITORIAL TABS (LEFT) + PERFECT MATCH WITH (RIGHT) */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 pt-8 border-t border-[#D8D2C2]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-14 items-start w-full">
          
          {/* LEFT SIDE: 5 Thumbnails spanning full column width + Editorial Tabs */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-8 w-full">
            
            {/* Desktop 5-Column Thumbnail Grid spanning the entire left column width */}
            <div className="hidden lg:grid grid-cols-5 gap-3 sm:gap-4 w-full py-1">
              {imagesList.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-full aspect-square rounded-xs border overflow-hidden transition-all cursor-pointer bg-[#F2EFDB] ${
                    activeImageIndex === idx
                      ? 'border-[#413C23] ring-2 ring-[#413C23]/25 shadow-xs'
                      : 'border-[#D8D2C2] opacity-80 hover:opacity-100 hover:border-[#8F896D]'
                  }`}
                  aria-label={`View gallery image ${idx + 1}`}
                >
                  <img
                    src={img}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    width={160}
                    height={160}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-center"
                  />
                </button>
              ))}
            </div>

            {/* Horizontal Tabs: Product Overview | Packaging | Shipping & Returns */}
            <div className="space-y-4 pt-2 w-full">
              <div className="flex items-center gap-6 sm:gap-8 border-b border-[#D8D2C2] text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`pb-3 transition-colors cursor-pointer relative uppercase tracking-wider ${
                    activeTab === 'overview'
                      ? 'text-[#413C23]'
                      : 'text-[#8F896D] hover:text-[#413C23]'
                  }`}
                >
                  <span>Product Overview</span>
                  {activeTab === 'overview' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#413C23]" />
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('packaging')}
                  className={`pb-3 transition-colors cursor-pointer relative uppercase tracking-wider ${
                    activeTab === 'packaging'
                      ? 'text-[#413C23]'
                      : 'text-[#8F896D] hover:text-[#413C23]'
                  }`}
                >
                  <span>Packaging</span>
                  {activeTab === 'packaging' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#413C23]" />
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('shipping')}
                  className={`pb-3 transition-colors cursor-pointer relative uppercase tracking-wider ${
                    activeTab === 'shipping'
                      ? 'text-[#413C23]'
                      : 'text-[#8F896D] hover:text-[#413C23]'
                  }`}
                >
                  <span>Shipping &amp; Returns</span>
                  {activeTab === 'shipping' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#413C23]" />
                  )}
                </button>
              </div>

              {/* Tab Content Panels */}
              <div className="text-xs text-[#413C23]/85 leading-relaxed font-normal pt-1 w-full">
                {activeTab === 'overview' && (
                  <p>
                    Handcrafted jewelry sculpted with organic texture and inspired by architectural sun emblems. Each piece is individually cast, giving it a raw yet elegant finish that captures warm sunlight. Each curve and imperfection tells a story of light, resilience, and individuality. A statement piece born from the meeting of earth and fire — bold, imperfect, alive.
                  </p>
                )}

                {activeTab === 'packaging' && (
                  <p>
                    Every AVIRENA piece arrives nestled in our signature travel keepsake pouch, accompanied by a luxury presentation box, anti-tarnish polishing cloth, and certificate of authenticity. Crafted sustainably using recycled fiber packaging.
                  </p>
                )}

                {activeTab === 'shipping' && (
                  <p>
                    Complimentary express courier shipping with full transit insurance across all orders in India. Dispatched within 24–48 hours with real-time tracking updates sent directly via WhatsApp and email. Easy 30-day doorstep returns and exchanges.
                  </p>
                )}
              </div>
            </div>

          </div>

          {/* RIGHT SIDE: "Perfect match with" Recommendations List */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-6 w-full">
            
            <h3 className="font-serif-display text-2xl sm:text-3xl font-light text-[#413C23] tracking-tight">
              Perfect match with
            </h3>

            <div className="divide-y divide-[#D8D2C2] border-b border-[#D8D2C2] w-full">
              {complementaryItems.map((item) => (
                <div
                  key={item.id}
                  className="py-4 flex items-center justify-between gap-4 group w-full"
                >
                  {/* Left: Square Product Preview Box & Title/Price */}
                  <div
                    onClick={() => onSelectProduct(item)}
                    className="flex items-center gap-4 cursor-pointer flex-1"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#F2EFDB] border border-[#D8D2C2] rounded-xs overflow-hidden shrink-0 flex items-center justify-center p-2 group-hover:border-[#413C23] transition-colors">
                      <img
                        src={item.images?.[0] || '/logo.png'}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        width={160}
                        height={160}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs sm:text-sm font-medium text-[#413C23] group-hover:underline">
                        {item.name}
                      </h4>
                      <span className="text-xs font-bold text-[#413C23] block">
                        {formatPrice(item.price, currency)}
                      </span>
                    </div>
                  </div>

                  {/* Right: "Add to cart" Quick-Add Action Link */}
                  <button
                    onClick={() => handleQuickAddRecommendation(item)}
                    className="text-xs font-semibold text-[#413C23] hover:text-[#8F896D] underline underline-offset-4 uppercase tracking-wider shrink-0 cursor-pointer transition-colors"
                  >
                    Add to cart
                  </button>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* 8. HIGH-RES FULLSCREEN LIGHTBOX (Mobile & Desktop) */}
      <ProductImageLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={imagesList}
        initialIndex={activeImageIndex}
        productName={product.name}
      />

    </div>
  );
};
