import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Heart,
  Maximize2,
  ShieldCheck,
  Sparkles,
  Truck,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Product, Currency, Metal, CartItem, ProductMedia } from '../types';
import { formatPrice, getCompareAtPrice, getDiscountPercentage } from '../data/products';
import { useShopify } from '../context/ShopifyContext';
import { ProductImageLightbox } from '../components/ProductImageLightbox';
import { ProductCard } from '../components/ProductCard';

interface ProductDetailPageProps {
  product: Product;
  currency: Currency;
  onAddToCart: (item: Omit<CartItem, 'id'>) => void;
  onSelectProduct: (product: Product, shouldScroll?: boolean) => void;
  onNavigateBack: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  catalogProducts?: Product[];
  isWishlistedById?: (id: string) => boolean;
}

// Helpers to identify metal tone and group product families
const isProductSilver = (p: Product): boolean => {
  const text = `${p.name} ${p.metal} ${p.handle || ''} ${(p.tags || []).join(' ')}`.toLowerCase();
  return text.includes('silver-tone') || text.includes('— silver') || text.includes('-silver-') || text.includes('silver');
};

const isProductGold = (p: Product): boolean => {
  const text = `${p.name} ${p.metal} ${p.handle || ''} ${(p.tags || []).join(' ')}`.toLowerCase();
  if (text.includes('silver-tone') || text.includes('— silver') || text.includes('-silver-')) return false;
  return text.includes('gold') || text.includes('brass') || text.includes('gold-tone');
};

const getProductFamilyKey = (p: Product): string => {
  if (!p) return '';
  return p.name
    .replace(/\s*[-—–]\s*(Gold|Silver)(\s*Tone)?/i, '')
    .replace(/\s*(Gold|Silver)(\s*Tone)?\s*(Brass|Alloy)?/i, '')
    .trim()
    .toLowerCase();
};

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  currency,
  onAddToCart,
  onSelectProduct,
  onNavigateBack,
  isWishlisted,
  onToggleWishlist,
  catalogProducts = [],
  isWishlistedById,
}) => {
  const { isConfigured, addToShopifyCart, syncLocalCartToShopify } = useShopify();

  // Buy Now redirects to Shopify; this disables the button while that resolves
  // so a second tap cannot create a second checkout.
  const [isBuyingNow, setIsBuyingNow] = useState(false);

  // Tracks in-place variant changes to avoid jumpy scrollToTop
  const isVariantSwitchRef = useRef(false);

  // Finish selector: "Gold Tone Brass" and "Silver Tone Brass"
  const [selectedFinish, setSelectedFinish] = useState<'Gold Tone Brass' | 'Silver Tone Brass'>(() =>
    isProductSilver(product) ? 'Silver Tone Brass' : 'Gold Tone Brass'
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Long Shopify descriptions are clamped to 4 lines so the price and Add to
  // Bag stay above the fold; this toggles the full text.
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // Fullscreen High-Res Lightbox State (Mobile & Desktop)
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  // Recurring 1-hour offer countdown timer (resets every hour so it never permanently expires)
  const [offerTimeLeft, setOfferTimeLeft] = useState(() => {
    const now = new Date();
    return {
      hours: 0,
      minutes: 59 - now.getMinutes(),
      seconds: 59 - now.getSeconds(),
    };
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setOfferTimeLeft({
        hours: 0,
        minutes: 59 - now.getMinutes(),
        seconds: 59 - now.getSeconds(),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Accordion state (Product Description, Materials / Composition, Dimensions & Fit, Care)
  const [openAccordion, setOpenAccordion] = useState<'description' | 'materials' | 'dimensions' | 'care' | null>(null);

  // Bottom Tabs state (Product Overview, Packaging, Shipping & Returns)
  const [activeTab, setActiveTab] = useState<'overview' | 'packaging' | 'shipping'>('overview');

  /**
   * Pincode delivery estimator.
   *
   * Previously this accepted ANY well-formed 6-digit number and always replied
   * "Delivery in 2-4 Business Days" — including for PINs that do not exist and
   * for genuinely remote regions where that estimate is untrue. A delivery
   * promise a shopper can screenshot has to be real.
   *
   * Now resolves against India Post's public pincode API (no key required),
   * confirms the PIN exists, names the district and state back to the shopper
   * so they can see it matched the right place, and gives a delivery window
   * banded by region rather than one flat national claim.
   */
  type PincodeResult = {
    ok: boolean;
    message: string;
    place?: string;
  };

  const [pincodeInput, setPincodeInput] = useState<string>(() => {
    try {
      return localStorage.getItem('avirena_pincode') || '';
    } catch {
      return '';
    }
  });
  const [pincodeResult, setPincodeResult] = useState<PincodeResult | null>(null);
  const [isCheckingPincode, setIsCheckingPincode] = useState(false);

  /**
   * Delivery window by destination state.
   *
   * Metro and well-connected states get the shorter band; the North-East,
   * island territories and Ladakh genuinely take longer, and saying so is
   * better than promising 2-4 days and missing it.
   */
  const deliveryWindowFor = (state: string): string => {
    const s = state.toLowerCase();
    const extended = [
      'andaman', 'nicobar', 'lakshadweep', 'ladakh', 'arunachal', 'nagaland',
      'manipur', 'mizoram', 'tripura', 'meghalaya', 'sikkim', 'assam',
    ];
    if (extended.some((x) => s.includes(x))) return '5–8 business days';
    const metro = ['maharashtra', 'delhi', 'gujarat', 'karnataka', 'telangana', 'tamil nadu', 'haryana'];
    if (metro.some((x) => s.includes(x))) return '2–4 business days';
    return '3–6 business days';
  };

  const handleCheckPincode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = pincodeInput.trim();

    if (!/^[1-9][0-9]{5}$/.test(clean)) {
      setPincodeResult({ ok: false, message: 'Enter a valid 6-digit Indian PIN code.' });
      return;
    }

    setIsCheckingPincode(true);
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${clean}`);
      const data = await res.json();
      const entry = Array.isArray(data) ? data[0] : null;
      const office = entry?.PostOffice?.[0];

      if (entry?.Status !== 'Success' || !office) {
        setPincodeResult({
          ok: false,
          message: `We could not find PIN ${clean}. Please check and try again.`,
        });
        return;
      }

      const place = `${office.District}, ${office.State}`;
      try {
        localStorage.setItem('avirena_pincode', clean);
      } catch {}

      setPincodeResult({
        ok: true,
        place,
        message: `Delivers to ${place} in ${deliveryWindowFor(office.State)}. Free shipping.`,
      });
    } catch {
      // Network failure is not the shopper's problem — do not imply their PIN
      // was wrong, and do not invent a delivery promise we could not verify.
      setPincodeResult({
        ok: false,
        message: 'Could not check right now. We ship free across India — try again shortly.',
      });
    } finally {
      setIsCheckingPincode(false);
    }
  };

  // Live Shopify catalog only (drives 'styled with' / related pieces).
  const activeProducts = Array.isArray(catalogProducts) ? catalogProducts : [];

  // Gallery shows this product's OWN photography and nothing else. It used to
  // be padded to 5 thumbnails with Unsplash stock photos, which showed shoppers
  // jewelry that was not the item they were buying. A short gallery is honest;
  // a padded one is not. Falls back to the brand logo only if Shopify has no
  // image at all, so the <img> is never broken.
  const imagesList =
    product.images && product.images.length > 0 ? product.images : ['/logo.png'];

  // Full gallery in Shopify media order (images + videos); mock products have no
  // media, so we fall back to their plain image list.
  const mediaList: ProductMedia[] =
    (product.media && product.media.length > 0 ? product.media : imagesList.map((u) => ({ contentType: 'image', url: u })));
  const activeMedia = mediaList[activeImageIndex] || mediaList[0];

  // Discover sibling variant pieces in the live catalog (e.g. Solene Crystal Hoops Gold & Silver)
  const { goldVariant, silverVariant, isGoldAvailable, isSilverAvailable } = useMemo(() => {
    const familyKey = getProductFamilyKey(product);
    const familyProducts = (catalogProducts || []).filter(
      (p) => getProductFamilyKey(p) === familyKey
    );

    const gold = familyProducts.find(isProductGold) || (isProductGold(product) ? product : undefined);
    const silver = familyProducts.find(isProductSilver) || (isProductSilver(product) ? product : undefined);

    return {
      goldVariant: gold,
      silverVariant: silver,
      isGoldAvailable: !!gold,
      isSilverAvailable: !!silver,
    };
  }, [product, catalogProducts]);

  useEffect(() => {
    if (isVariantSwitchRef.current) {
      isVariantSwitchRef.current = false;
      setActiveImageIndex(0);
      setIsLightboxOpen(false);
    } else {
      setActiveImageIndex(0);
      setOpenAccordion(null);
      setActiveTab('overview');
      setIsLightboxOpen(false);
      setIsDescriptionExpanded(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (isProductSilver(product)) {
      setSelectedFinish('Silver Tone Brass');
    } else {
      setSelectedFinish('Gold Tone Brass');
    }
  }, [product.id]);

  const handleFinishChange = (finish: 'Gold Tone Brass' | 'Silver Tone Brass') => {
    if (finish === selectedFinish) return;

    if (finish === 'Gold Tone Brass' && goldVariant) {
      setSelectedFinish('Gold Tone Brass');
      setActiveImageIndex(0);
      if (goldVariant.id !== product.id) {
        isVariantSwitchRef.current = true;
        onSelectProduct(goldVariant, false);
      }
    } else if (finish === 'Silver Tone Brass' && silverVariant) {
      setSelectedFinish('Silver Tone Brass');
      setActiveImageIndex(0);
      if (silverVariant.id !== product.id) {
        isVariantSwitchRef.current = true;
        onSelectProduct(silverVariant, false);
      }
    }
  };

  const toggleAccordion = (key: 'description' | 'materials' | 'dimensions' | 'care') => {
    setOpenAccordion(openAccordion === key ? null : key);
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

  // Complementary recommendations for "Perfect match with" — randomized each visit.
  const complementaryItems = useMemo(() => {
    const others = activeProducts.filter((p) => p.id !== product.id);
    const shuffled = [...others];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, 3);
  }, [activeProducts, product.id]);

  // "More from AVIRENA" — 5 other pieces from the live catalog.
  const moreProducts = useMemo(
    () => activeProducts.filter((p) => p.id !== product.id).slice(0, 5),
    [activeProducts, product.id]
  );

  const thumbRowRef = useRef<HTMLDivElement>(null);

  const scrollThumbs = (dir: 1 | -1) => {
    const el = thumbRowRef.current;
    if (!el) return;
    const thumb = el.querySelector('[data-thumb]') as HTMLElement | null;
    const step = thumb ? thumb.offsetWidth + 10 : 72;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

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
          
          {/* LEFT: Hero Image — CSS sticky, sticks while right column scrolls.
            top-[124px] clears the sticky navbar (announcement bar ~37px +
            main bar h-20 80px ≈ 117px) so the image never slides beneath it. */}
          <div className="lg:col-span-6 xl:col-span-6 w-full lg:sticky lg:top-[124px] lg:self-start">
            <div className="flex flex-col gap-3 w-full">
              {/* Main product canvas: image, or video player when the active
                media item is a video. bg-white so images that ship with a baked
                white background blend seamlessly instead of looking like a
                border; no padding — artwork fills the whole square. */}
              <div className="space-y-3">
                <div
                  onClick={() => {
                    if (activeMedia.contentType !== 'video') setIsLightboxOpen(true);
                  }}
                  className={`relative w-full aspect-square max-h-[calc(100vh-160px)] bg-white border border-[#D8D2C2] rounded-xs overflow-hidden flex items-center justify-center shadow-xs select-none group/canvas ${
                    activeMedia.contentType === 'video' ? '' : 'cursor-pointer'
                  }`}
                >
                  {(() => {
                    if (activeMedia.contentType === 'video') {
                      return (
                        <video
                          key={activeMedia.url}
                          src={activeMedia.url}
                          poster={activeMedia.poster}
                          autoPlay
                          muted
                          loop
                          playsInline
                          preload="metadata"
                          className="w-full h-full object-contain object-center bg-white"
                        />
                      );
                    }
                    return (
                      <img
                        src={activeMedia.url || imagesList[0]}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        width={1254}
                        height={1254}
                        loading="eager"
                        fetchPriority="high"
                        decoding="sync"
                        className="w-full h-full object-contain object-center select-none pointer-events-none"
                      />
                    );
                  })()}

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

                  {/* Fullscreen expand only makes sense for stills */}
                  {activeMedia.contentType !== 'video' && (
                    <>
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

                      {/* Desktop hint */}
                      <div className="hidden sm:block absolute bottom-3 left-3.5 pointer-events-none text-[9px] uppercase tracking-widest text-[#8F896D] font-semibold bg-[#FAF8F5]/85 px-2 py-0.5 rounded-2xs border border-[#D8D2C2]/60 backdrop-blur-xs">
                        Click to Expand
                      </div>

                      {/* Mobile hint */}
                      <div className="flex sm:hidden items-center gap-1.5 absolute bottom-3 left-3.5 pointer-events-none text-[9px] uppercase tracking-widest text-[#413C23] font-semibold bg-[#FAF8F5]/90 px-2.5 py-1 rounded-xs border border-[#D8D2C2] shadow-xs">
                        <Maximize2 className="w-3 h-3 text-[#8F896D]" />
                        <span>Tap to Expand</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnail strip — one row only on every screen; slides when
                    there are more than five items (native swipe + arrows). */}
                {mediaList.length > 1 && (
                  <div className="relative">
                    <div
                      ref={thumbRowRef}
                      className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1.5"
                    >
                      {mediaList.map((m, idx) => (
                        <button
                          key={`${m.url}-${idx}`}
                          data-thumb
                          onClick={() => setActiveImageIndex(idx)}
                          className={`flex-[0_0_calc((100%-40px)/5)] relative aspect-square shrink-0 rounded-xs border overflow-hidden transition-all cursor-pointer bg-white flex items-center justify-center ${
                            activeImageIndex === idx
                              ? 'border-[#413C23] ring-2 ring-[#413C23]/25'
                              : 'border-[#D8D2C2] opacity-80 hover:opacity-100 hover:border-[#8F896D]'
                          }`}
                          aria-label={
                            m.contentType === 'video'
                              ? `Play video ${idx + 1}`
                              : `View image ${idx + 1}`
                          }
                        >
                          <img
                            src={m.contentType === 'video' ? m.poster || m.url : m.url}
                            alt={`${product.name} thumbnail ${idx + 1}`}
                            referrerPolicy="no-referrer"
                            width={160}
                            height={160}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover object-center"
                          />
                          {m.contentType === 'video' && (
                            <span className="absolute top-1.5 left-1.5 bg-[#413C23]/90 text-[#FAF8F5] text-[9px] tracking-[0.14em] uppercase font-semibold px-1.5 py-0.5 rounded-xs shadow-xs pointer-events-none">
                              Video
                            </span>
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Slide arrows only appear when the strip actually overflows */}
                    {mediaList.length > 5 && (
                      <>
                        <button
                          type="button"
                          onClick={() => scrollThumbs(-1)}
                          aria-label="Scroll thumbnails left"
                          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-7 w-7 rounded-full bg-[#FAF8F5]/95 hover:bg-[#FAF8F5] text-[#413C23] border border-[#D8D2C2] shadow-md transition-all flex items-center justify-center cursor-pointer active:scale-95"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" strokeWidth={1.75} />
                        </button>
                        <button
                          type="button"
                          onClick={() => scrollThumbs(1)}
                          aria-label="Scroll thumbnails right"
                          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-7 w-7 rounded-full bg-[#FAF8F5]/95 hover:bg-[#FAF8F5] text-[#413C23] border border-[#D8D2C2] shadow-md transition-all flex items-center justify-center cursor-pointer active:scale-95"
                        >
                          <ChevronRight className="w-3.5 h-3.5" strokeWidth={1.75} />
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Buy Box, Narrative, Finish Selector, CTA & Accordions */}
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
                  'Jewellery with organic texture and sculptural form. Each curve tells a story of light, resilience, and individuality.'}
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

            {/* Price with Strikethrough Compare-At Price and Discount Badge */}
            {(() => {
              const comparePrice = getCompareAtPrice(product.price, product.originalPrice);
              const discount = getDiscountPercentage(product.price, comparePrice);
              return (
                <div className="pt-1 flex items-baseline gap-3 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-bold text-[#413C23] tracking-tight">
                    {formatPrice(product.price, currency)}
                  </span>
                  {comparePrice > product.price && (
                    <>
                      <span className="text-base sm:text-lg text-[#DC2626] line-through font-normal">
                        {formatPrice(comparePrice, currency)}
                      </span>
                      <span className="text-xs font-bold text-[#15803D] bg-[#15803D]/10 border border-[#15803D]/20 px-2.5 py-0.5 rounded-2xs uppercase tracking-wider">
                        {discount}% OFF
                      </span>
                    </>
                  )}
                </div>
              );
            })()}

            {/* Recurring Urgency Offer Timer - Clean Plain Text */}
            <p className="text-xs text-[#8F896D] pt-0.5">
              Offer ends in{' '}
              <span className="font-mono font-medium text-[#DC2626]">
                {String(offerTimeLeft.hours).padStart(2, '0')}h {String(offerTimeLeft.minutes).padStart(2, '0')}m {String(offerTimeLeft.seconds).padStart(2, '0')}s
              </span>
            </p>

            {/* Finish Selector (Gold Tone Brass & Silver Tone Brass) */}
            <div className="space-y-2 pt-1 w-full">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#413C23] uppercase tracking-wider">
                  Finish: <span className="font-normal text-[#8F896D]">{selectedFinish}</span>
                </span>
                {!isSilverAvailable && selectedFinish === 'Gold Tone Brass' && (
                  <span className="text-[11px] text-[#8F896D]/80 italic">Silver edition unavailable</span>
                )}
                {!isGoldAvailable && selectedFinish === 'Silver Tone Brass' && (
                  <span className="text-[11px] text-[#8F896D]/80 italic">Gold edition unavailable</span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {/* Gold Tone Brass */}
                <button
                  type="button"
                  onClick={() => handleFinishChange('Gold Tone Brass')}
                  disabled={!isGoldAvailable}
                  title={isGoldAvailable ? 'Select Gold Tone Brass' : 'Unavailable in Silver/Gold Tone Brass'}
                  className={`px-5 py-2.5 rounded-xs border text-xs font-semibold transition-all ${
                    selectedFinish === 'Gold Tone Brass'
                      ? 'border-black bg-black text-white shadow-xs cursor-default'
                      : isGoldAvailable
                      ? 'border-[#D8D2C2] text-black bg-[#F2EFDB] hover:border-black cursor-pointer'
                      : 'border-dashed border-[#D8D2C2] text-neutral-400 bg-[#E7E4D5]/40 cursor-not-allowed opacity-50'
                  }`}
                >
                  <span>Gold Tone Brass</span>
                  {!isGoldAvailable && (
                    <span className="ml-1.5 text-[10px] uppercase font-normal tracking-wide text-neutral-500">
                      (N/A)
                    </span>
                  )}
                </button>

                {/* Silver Tone Brass */}
                <button
                  type="button"
                  onClick={() => handleFinishChange('Silver Tone Brass')}
                  disabled={!isSilverAvailable}
                  title={isSilverAvailable ? 'Select Silver Tone Brass' : 'Unavailable in Silver Tone Brass'}
                  className={`px-5 py-2.5 rounded-xs border text-xs font-semibold transition-all ${
                    selectedFinish === 'Silver Tone Brass'
                      ? 'border-black bg-black text-white shadow-xs cursor-default'
                      : isSilverAvailable
                      ? 'border-[#D8D2C2] text-black bg-[#F2EFDB] hover:border-black cursor-pointer'
                      : 'border-dashed border-[#D8D2C2] text-neutral-400 bg-[#E7E4D5]/40 cursor-not-allowed opacity-50'
                  }`}
                >
                  <span>Silver Tone Brass</span>
                  {!isSilverAvailable && (
                    <span className="ml-1.5 text-[10px] uppercase font-normal tracking-wide text-neutral-500">
                      (N/A)
                    </span>
                  )}
                </button>
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
                  className="w-full sm:w-auto sm:min-w-[190px] py-4 px-8 bg-black hover:bg-neutral-800 disabled:opacity-60 disabled:cursor-wait text-white text-xs uppercase tracking-[0.2em] font-semibold rounded-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  {isBuyingNow ? 'Taking you to checkout…' : 'Buy Now'}
                </button>

                <button
                  id="pdp-add-to-bag-cta"
                  onClick={handleAddToCart}
                  className="w-full sm:w-auto sm:min-w-[190px] py-4 px-8 bg-transparent border border-black hover:bg-black hover:text-white text-black text-xs uppercase tracking-[0.2em] font-semibold rounded-xs transition-all flex items-center justify-center cursor-pointer active:scale-98"
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

            {/* Trust & Quality Badges.
                Palette is the brand's own (#413C23 ink, #8F896D muted, #F2EFDB
                surface) rather than raw black/white — the previous version used
                pure black text and emerald accents that belonged to no part of
                the design system. "Zero Allergy" was also an absolute claim we
                cannot make: nickel-free materially reduces reaction risk, it
                does not guarantee nobody reacts.
                2x2 grid keeps cards roomy in the half-width PDP column on every
                device; 4-across only kicks in on very wide screens where the
                column is actually wide enough (>=1536px viewport). */}
            <div className="grid grid-cols-2 2xl:grid-cols-4 gap-2.5 pt-2 w-full">
              {[
                { Icon: ShieldCheck, title: 'Anti-Tarnish', copy: 'Protective e-coat finish' },
                { Icon: Sparkles, title: 'Skin Friendly', copy: 'Nickel-free, steel posts' },
                { Icon: Truck, title: 'Free Shipping', copy: 'Tracked, across India' },
                { Icon: RefreshCw, title: '7-Day Returns', copy: 'Easy exchange on unworn' },
              ].map(({ Icon, title, copy }) => (
                <div
                  key={title}
                  className="flex flex-col items-start p-3 rounded-xs bg-[#E7E4D5] border border-[#D8D2C2] transition-colors hover:border-[#8F896D]"
                >
                  <div className="flex items-center gap-1.5 mb-1.5 text-[#413C23]">
                    <Icon className="w-4 h-4 text-[#8F896D] shrink-0" strokeWidth={1.5} />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.12em] whitespace-nowrap">{title}</span>
                  </div>
                  <span className="text-[10px] text-[#413C23]/80 leading-tight">{copy}</span>
                </div>
              ))}
            </div>

            {/* Pincode Delivery Estimator.
                Brand palette throughout, and the result now reflects a real
                India Post lookup rather than echoing back whatever was typed. */}
            <form
              onSubmit={handleCheckPincode}
              className="p-3.5 bg-[#E7E4D5] border border-[#D8D2C2] rounded-xs space-y-2.5 w-full"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#413C23]">
                  <MapPin className="w-3.5 h-3.5 text-[#8F896D]" strokeWidth={1.5} />
                  <span>Check Delivery</span>
                </div>
                <span className="text-[10px] text-[#413C23] font-semibold tracking-[0.12em] uppercase bg-[#F2EFDB] border border-[#D8D2C2] px-2 py-0.5 rounded-2xs shrink-0">
                  Free Shipping
                </span>
              </div>

              {/* Placeholder is #6B6650 (5.44:1 on this surface), not the
                  #8F896D accent — that measures 3.32:1 and fails WCAG AA. */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={pincodeInput}
                  onChange={(e) => {
                    setPincodeInput(e.target.value.replace(/\D/g, ''));
                    if (pincodeResult) setPincodeResult(null);
                  }}
                  placeholder="6-digit PIN code"
                  aria-label="Enter your 6-digit Indian PIN code"
                  className="flex-1 min-w-0 px-3 py-2.5 text-xs bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs text-[#413C23] placeholder:text-[#6B6650] outline-none focus:border-[#8F896D] focus:ring-1 focus:ring-[#8F896D]/30 transition-colors tracking-[0.08em]"
                />
                <button
                  type="submit"
                  disabled={isCheckingPincode || pincodeInput.length !== 6}
                  className="px-5 py-2.5 bg-[#413C23] hover:bg-[#8F896D] disabled:opacity-40 disabled:cursor-not-allowed text-[#FAF8F5] text-[11px] font-semibold uppercase tracking-[0.14em] rounded-xs transition-colors cursor-pointer shrink-0"
                >
                  {isCheckingPincode ? 'Checking…' : 'Check'}
                </button>
              </div>

              {pincodeResult && (
                <div
                  role="status"
                  aria-live="polite"
                  className={`flex items-start gap-1.5 text-[11px] leading-snug animate-in fade-in ${
                    pincodeResult.ok ? 'text-[#413C23]' : 'text-[#7A0F1A]'
                  }`}
                >
                  {pincodeResult.ok ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#8F896D] shrink-0 mt-px" strokeWidth={1.75} />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-[#7A0F1A] shrink-0 mt-px" strokeWidth={1.75} />
                  )}
                  <span className="font-medium">{pincodeResult.message}</span>
                </div>
              )}
            </form>

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
                    <p>• Store in a cool, dry place away from direct sunlight when not in use.</p>
                    <p>• Gently buff with a soft microfiber cloth to preserve its mirror polish.</p>
                    <p>• Avoid direct contact with harsh chlorine bleach or acetone.</p>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 3. BELOW-FOLD: EDITORIAL TABS (LEFT) + PERFECT MATCH WITH (RIGHT) */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 pt-8 border-t border-[#D8D2C2]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-14 items-start w-full">
          
          {/* LEFT SIDE: Editorial Tabs */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-8 w-full">

            {/* Horizontal Tabs: Product Overview | Packaging | Shipping & Returns */}
            <div className="space-y-4 pt-2 w-full">
              <div className="flex items-center gap-6 sm:gap-8 border-b border-[#D8D2C2] text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`pb-3 transition-colors cursor-pointer relative uppercase tracking-wider ${
                    activeTab === 'overview'
                      ? 'text-black font-bold'
                      : 'text-neutral-500 hover:text-black'
                  }`}
                >
                  <span>Product Overview</span>
                  {activeTab === 'overview' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('packaging')}
                  className={`pb-3 transition-colors cursor-pointer relative uppercase tracking-wider ${
                    activeTab === 'packaging'
                      ? 'text-black font-bold'
                      : 'text-neutral-500 hover:text-black'
                  }`}
                >
                  <span>Packaging</span>
                  {activeTab === 'packaging' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('shipping')}
                  className={`pb-3 transition-colors cursor-pointer relative uppercase tracking-wider ${
                    activeTab === 'shipping'
                      ? 'text-black font-bold'
                      : 'text-neutral-500 hover:text-black'
                  }`}
                >
                  <span>Shipping &amp; Returns</span>
                  {activeTab === 'shipping' && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                  )}
                </button>
              </div>

              {/* Tab Content Panels */}
              <div className="text-xs text-[#413C23]/85 leading-relaxed font-normal pt-1 w-full">
                {activeTab === 'overview' && (
                  <p>
                    Jewellery sculpted with organic texture and inspired by architectural sun emblems. Each piece has a raw yet elegant finish that captures warm sunlight. Each curve and imperfection tells a story of light, resilience, and individuality. A statement piece born from the meeting of earth and fire — bold, imperfect, alive.
                  </p>
                )}

                {activeTab === 'packaging' && (
                  <p>
                    Every AVIRENA piece arrives in a luxury presentation box, accompanied by an anti-tarnish polishing cloth and certificate of authenticity. Crafted sustainably using recycled fiber packaging.
                  </p>
                )}

                {activeTab === 'shipping' && (
                  <p>
                    Free express courier delivery with full transit insurance on all orders across India. Dispatched within 24–48 hours with real-time tracking updates sent directly via WhatsApp and email. Easy 7-day returns and exchanges.
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
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs overflow-hidden shrink-0 flex items-center justify-center group-hover:border-[#413C23] transition-colors">
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

      {/* 4. MORE FROM AVIRENA — simple 5-piece grid, no carousel */}
      {moreProducts.length > 0 && (
        <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 pt-12 pb-4 border-t border-[#D8D2C2]">
          <div className="w-full">
            <div className="flex items-end justify-between gap-4 mb-6">
              <h3 className="font-serif-display text-2xl sm:text-3xl font-light text-[#413C23] tracking-tight">
                More from AVIRENA
              </h3>
              <button
                onClick={onNavigateBack}
                className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#8F896D] hover:text-[#413C23] transition-colors cursor-pointer underline underline-offset-4 decoration-[#D8D2C2] shrink-0"
              >
                View all pieces
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-x-4 gap-y-8">
              {moreProducts.map((item) => (
                <ProductCard
                  key={item.id}
                  product={item}
                  currency={currency}
                  onSelect={onSelectProduct}
                  onQuickAdd={handleQuickAddRecommendation}
                  isWishlisted={isWishlistedById ? isWishlistedById(item.id) : false}
                  onToggleWishlist={onToggleWishlist}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. HIGH-RES FULLSCREEN LIGHTBOX (Mobile & Desktop) */}
      <ProductImageLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={imagesList}
        initialIndex={Math.max(0, imagesList.indexOf(activeMedia.url))}
        productName={product.name}
      />

    </div>
  );
};
