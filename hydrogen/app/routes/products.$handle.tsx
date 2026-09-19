import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLoaderData, useNavigate, Link, useFetcher } from 'react-router';
import type { Route } from './+types/products.$handle';
import { CartForm } from '@shopify/hydrogen';
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
  Check,
  ShoppingBag,
} from 'lucide-react';
import {
  STOREFRONT_PRODUCT_BY_HANDLE_QUERY,
  STOREFRONT_PRODUCTS_QUERY,
  transformShopifyProduct,
} from '~/lib/shopify';
import {
  formatPrice,
  getCompareAtPrice,
  getDiscountPercentage,
} from '~/lib/currency';
import { findPairOffer } from '~/data/offers';
import { ProductImageLightbox } from '~/components/ProductImageLightbox';
import { ProductCard } from '~/components/ProductCard';
import { trackViewItem, trackBeginCheckout } from '~/lib/analytics';
import { useAside } from '~/components/Aside';
import type { Product, ProductMedia, Currency, Metal } from '~/types/storefront';

export const meta: Route.MetaFunction = ({ data }) => {
  if (!data?.product) {
    return [{ title: 'Piece Not Found | AVIRENA Jewels' }];
  }
  const { product } = data;
  return [
    { title: `${product.name} | AVIRENA Anti-Tarnish Jewellery` },
    {
      name: 'description',
      content: `${product.name}. Crafted from high-grade brass with anti-tarnish protective coating and surgical steel posts. Free delivery across India.`,
    },
    {
      property: 'og:title',
      content: `${product.name} | AVIRENA Dailywear Jewelry`,
    },
    {
      property: 'og:description',
      content: product.description.slice(0, 160),
    },
    {
      property: 'og:image',
      content: product.images[0] || 'https://avirenajewels.com/og-banner.jpg',
    },
    {
      tagName: 'link',
      rel: 'canonical',
      href: `https://avirenajewels.com/products/${product.handle}`,
    },
  ];
};

export async function loader({ params, context }: Route.LoaderArgs) {
  const { handle } = params;
  if (!handle) {
    throw new Response('Product handle is required', { status: 400 });
  }

  const { storefront } = context;

  const [productData, allProductsData] = await Promise.all([
    storefront.query(STOREFRONT_PRODUCT_BY_HANDLE_QUERY, {
      variables: { handle },
    }),
    storefront.query(STOREFRONT_PRODUCTS_QUERY, {
      variables: { first: 50 },
    }),
  ]);

  if (!productData?.product) {
    throw new Response('Product not found', { status: 404 });
  }

  const product = transformShopifyProduct(productData.product);

  const rawEdges = allProductsData?.products?.edges || [];
  const allProducts: Product[] = rawEdges.map((edge: any) =>
    transformShopifyProduct(edge.node)
  );

  return {
    product,
    allProducts,
  };
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

export default function ProductDetailPage() {
  const { product, allProducts } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const aside = useAside();

  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [isAddedToBag, setIsAddedToBag] = useState(false);
  const [addedRecId, setAddedRecId] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Finish selector: "Gold Tone Brass" and "Silver Tone Brass"
  const [selectedFinish, setSelectedFinish] = useState<'Gold Tone Brass' | 'Silver Tone Brass'>(() =>
    isProductSilver(product) ? 'Silver Tone Brass' : 'Gold Tone Brass'
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Bundle suite detection
  const isBundle = Boolean(
    (product.tags || []).includes('bundle') ||
    (product.tags || []).includes('duo-suite') ||
    (product.handle || '').includes('duo') ||
    (product.name || '').toLowerCase().includes('duo')
  );

  const pairOffer = useMemo(() => {
    return findPairOffer(product, allProducts || []);
  }, [product, allProducts]);

  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [openAccordion, setOpenAccordion] = useState<'description' | 'materials' | 'dimensions' | 'care' | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'packaging' | 'shipping'>('overview');

  // Repeating 15-minute offer countdown timer
  const [timeLeft, setTimeLeft] = useState(() => {
    const now = Math.floor(Date.now() / 1000);
    const cycle = 15 * 60;
    return cycle - (now % cycle);
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) return 15 * 60;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  // Stock urgency number
  const stockCount = useMemo(() => {
    const qty = product.variants?.[0]?.quantityAvailable;
    if (typeof qty === 'number' && qty > 0 && qty <= 10) return qty;
    const charCode = (product.id || '2').charCodeAt((product.id || '2').length - 1);
    return (charCode % 3) + 2;
  }, [product]);

  // Pincode delivery estimator
  type PincodeResult = {
    ok: boolean;
    message: string;
    place?: string;
  };

  const [pincodeInput, setPincodeInput] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem('avirena_pincode') || '';
      } catch {
        return '';
      }
    }
    return '';
  });
  const [pincodeResult, setPincodeResult] = useState<PincodeResult | null>(null);
  const [isCheckingPincode, setIsCheckingPincode] = useState(false);

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
      setPincodeResult({
        ok: false,
        message: 'Could not check right now. We ship free across India — try again shortly.',
      });
    } finally {
      setIsCheckingPincode(false);
    }
  };

  const imagesList =
    product.images && product.images.length > 0 ? product.images : ['/logo.png'];

  const mediaList: ProductMedia[] =
    product.media && product.media.length > 0
      ? product.media
      : imagesList.map((u) => ({ contentType: 'image', url: u }));
  const activeMedia = mediaList[activeImageIndex] || mediaList[0];

  // Discover sibling variant pieces
  const { goldVariant, silverVariant, isGoldAvailable, isSilverAvailable } = useMemo(() => {
    if (isBundle) {
      return {
        goldVariant: pairOffer?.products[0] || product,
        silverVariant: pairOffer?.products[1] || product,
        isGoldAvailable: true,
        isSilverAvailable: true,
      };
    }

    const familyKey = getProductFamilyKey(product);
    const familyProducts = (allProducts || []).filter(
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
  }, [product, allProducts, isBundle, pairOffer]);

  useEffect(() => {
    setActiveImageIndex(0);
    setOpenAccordion(null);
    setActiveTab('overview');
    setIsLightboxOpen(false);
    setIsDescriptionExpanded(false);

    if (isProductSilver(product)) {
      setSelectedFinish('Silver Tone Brass');
    } else {
      setSelectedFinish('Gold Tone Brass');
    }

    trackViewItem(product);
  }, [product.id]);

  const handleFinishChange = (finish: 'Gold Tone Brass' | 'Silver Tone Brass') => {
    if (isBundle) {
      setSelectedFinish(finish);
      if (pairOffer && pairOffer.products.length === 2) {
        const targetProd = finish === 'Gold Tone Brass' ? pairOffer.products[0] : pairOffer.products[1];
        if (targetProd?.images && targetProd.images.length > 0) {
          const targetImg = targetProd.images[0];
          const idx = mediaList.findIndex((m) => m.url === targetImg);
          if (idx >= 0) setActiveImageIndex(idx);
        }
      }
      return;
    }

    if (finish === selectedFinish) return;

    if (finish === 'Gold Tone Brass' && goldVariant) {
      setSelectedFinish('Gold Tone Brass');
      if (goldVariant.handle && goldVariant.handle !== product.handle) {
        navigate(`/products/${goldVariant.handle}`);
      }
    } else if (finish === 'Silver Tone Brass' && silverVariant) {
      setSelectedFinish('Silver Tone Brass');
      if (silverVariant.handle && silverVariant.handle !== product.handle) {
        navigate(`/products/${silverVariant.handle}`);
      }
    }
  };

  const toggleAccordion = (key: 'description' | 'materials' | 'dimensions' | 'care') => {
    setOpenAccordion(openAccordion === key ? null : key);
  };

  const handleAddToCart = () => {
    const variantId = product.variants?.[0]?.id || `gid://shopify/ProductVariant/${product.id}`;
    aside.open('cart');

    const selectedVariant = {
      id: variantId,
      title: selectedFinish || product.metal || 'Default',
      price: {
        amount: String(getPriceInINR(product.price)),
        currencyCode: 'INR',
      },
      product: {
        id: product.id,
        title: product.name,
        handle: product.handle || product.id,
      },
      image: {
        url: product.images?.[0] || '/logo.png',
        altText: product.name,
      },
      selectedOptions: [
        { name: 'Finish', value: selectedFinish || product.metal || 'Default' },
      ],
    };

    const bundleAttributes = isBundle
      ? [
          { key: '_bundleGroupId', value: `bundle-${product.handle || product.id}-${Date.now()}` },
          { key: '_bundleTitle', value: product.name },
          { key: '_bundleSavings', value: '100' },
        ]
      : undefined;

    fetcher.submit(
      {
        [CartForm.INPUT_NAME]: JSON.stringify({
          action: CartForm.ACTIONS.LinesAdd,
          inputs: {
            lines: [
              {
                merchandiseId: variantId,
                quantity: 1,
                selectedVariant,
                attributes: bundleAttributes,
              },
            ],
          },
        }),
      },
      { method: 'POST', action: '/cart' }
    );

    setIsAddedToBag(true);
    setTimeout(() => {
      setIsAddedToBag(false);
    }, 1800);
  };

  const handleBuyNow = () => {
    setIsBuyingNow(true);
    trackBeginCheckout([{ product, quantity: 1 }]);

    const variantId = product.variants?.[0]?.id || `gid://shopify/ProductVariant/${product.id}`;
    const selectedVariant = {
      id: variantId,
      title: selectedFinish || product.metal || 'Default',
      price: {
        amount: String(getPriceInINR(product.price)),
        currencyCode: 'INR',
      },
      product: {
        id: product.id,
        title: product.name,
        handle: product.handle || product.id,
      },
      image: {
        url: product.images?.[0] || '/logo.png',
        altText: product.name,
      },
      selectedOptions: [
        { name: 'Finish', value: selectedFinish || product.metal || 'Default' },
      ],
    };

    fetcher.submit(
      {
        [CartForm.INPUT_NAME]: JSON.stringify({
          action: CartForm.ACTIONS.LinesAdd,
          inputs: {
            lines: [
              {
                merchandiseId: variantId,
                quantity: 1,
                selectedVariant,
              },
            ],
          },
        }),
        redirectTo: '/cart',
      },
      { method: 'POST', action: '/cart' }
    );
  };

  const handleQuickAddRecommendation = (recommendedItem: Product) => {
    const variantId = recommendedItem.variants?.[0]?.id || `gid://shopify/ProductVariant/${recommendedItem.id}`;
    aside.open('cart');

    const selectedVariant = {
      id: variantId,
      title: recommendedItem.metal || 'Default',
      price: {
        amount: String(getPriceInINR(recommendedItem.price)),
        currencyCode: 'INR',
      },
      product: {
        id: recommendedItem.id,
        title: recommendedItem.name,
        handle: recommendedItem.handle || recommendedItem.id,
      },
      image: {
        url: recommendedItem.images?.[0] || '/logo.png',
        altText: recommendedItem.name,
      },
      selectedOptions: [
        { name: 'Finish', value: recommendedItem.metal || 'Default' },
      ],
    };

    fetcher.submit(
      {
        [CartForm.INPUT_NAME]: JSON.stringify({
          action: CartForm.ACTIONS.LinesAdd,
          inputs: {
            lines: [
              {
                merchandiseId: variantId,
                quantity: 1,
                selectedVariant,
              },
            ],
          },
        }),
      },
      { method: 'POST', action: '/cart' }
    );

    setAddedRecId(recommendedItem.id);
    setTimeout(() => {
      setAddedRecId(null);
    }, 1800);
  };

  const complementaryItems = useMemo(() => {
    const others = (allProducts || []).filter((p) => p.id !== product.id);
    return others.slice(0, 3);
  }, [allProducts, product.id]);

  const moreProducts = useMemo(
    () => (allProducts || []).filter((p) => p.id !== product.id).slice(0, 5),
    [allProducts, product.id]
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
          <Link to="/" className="hover:text-[#413C23] transition-colors cursor-pointer">
            Home
          </Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#413C23] transition-colors cursor-pointer">
            Shop
          </Link>
          <span>/</span>
          {isBundle ? (
            <>
              <Link
                to="/collections/duo-suites"
                className="hover:text-[#413C23] transition-colors cursor-pointer capitalize"
              >
                Duo Suites
              </Link>
              <span>/</span>
            </>
          ) : (
            <>
              <Link
                to={`/shop/${product.category || 'all'}`}
                className="hover:text-[#413C23] transition-colors cursor-pointer capitalize"
              >
                {product.category}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-[#413C23] font-semibold truncate max-w-[260px] sm:max-w-md">
            {product.name}
          </span>
        </nav>
      </div>

      {/* 2. MAIN 100VH VIEWPORT FOLD */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 pt-1 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-14 items-start w-full">
          {/* LEFT: Hero Image — CSS sticky */}
          <div className="lg:col-span-6 xl:col-span-6 w-full lg:sticky lg:top-[124px] lg:self-start">
            <div className="flex flex-col gap-3 w-full">
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
                      setIsWishlisted(!isWishlisted);
                    }}
                    className="absolute top-3.5 right-3.5 z-10 p-2.5 rounded-full bg-[#FAF8F5]/90 hover:bg-[#FAF8F5] text-[#413C23] transition-all shadow-xs cursor-pointer border border-[#D8D2C2]"
                    title={isWishlisted ? 'Saved to Wishlist' : 'Save to Wishlist'}
                    aria-label="Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#7A0F1A] text-[#7A0F1A]' : 'stroke-[1.5]'}`} />
                  </button>

                  {/* Duo Set Badge */}
                  {isBundle && (
                    <div className="absolute top-3.5 left-14 z-10 pointer-events-none">
                      <span className="bg-[#413C23] text-[#FAF8F5] text-[9px] uppercase tracking-[0.16em] font-bold px-2.5 py-1 rounded-2xs shadow-xs border border-[#413C23]">
                        DUO SET • 2 PIECES INCLUDED
                      </span>
                    </div>
                  )}

                  {/* Fullscreen Expand */}
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

                      <div className="hidden sm:block absolute bottom-3 left-3.5 pointer-events-none text-[9px] uppercase tracking-widest text-[#8F896D] font-semibold bg-[#FAF8F5]/85 px-2 py-0.5 rounded-2xs border border-[#D8D2C2]/60 backdrop-blur-xs">
                        Click to Expand
                      </div>

                      <div className="flex sm:hidden items-center gap-1.5 absolute bottom-3 left-3.5 pointer-events-none text-[9px] uppercase tracking-widest text-[#413C23] font-semibold bg-[#FAF8F5]/90 px-2.5 py-1 rounded-xs border border-[#D8D2C2] shadow-xs">
                        <Maximize2 className="w-3 h-3 text-[#8F896D]" />
                        <span>Tap to Expand</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnail strip */}
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

          {/* RIGHT: Buy Box */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-5 w-full text-left">
            <div className="space-y-2 w-full">
              <div className="flex items-center gap-2 flex-wrap">
                {isBundle ? (
                  <span className="bg-[#413C23] text-[#FAF8F5] text-[10px] uppercase tracking-[0.2em] font-bold px-2.5 py-1 rounded-xs shadow-2xs inline-flex items-center gap-1.5">
                    <span>✦ DUO SET • 2-PIECE BUNDLE</span>
                  </span>
                ) : (
                  <span className="text-[10px] uppercase tracking-[0.22em] font-semibold text-[#8F896D] block">
                    {product.category || 'Fine Jewelry'}
                  </span>
                )}
              </div>
              <h1 className="font-serif-display text-3xl sm:text-4xl lg:text-[44px] text-[#413C23] font-light leading-tight tracking-tight w-full">
                {product.name}
              </h1>
            </div>

            {/* Narrative description */}
            <div className="space-y-1.5 text-xs sm:text-sm text-[#413C23]/85 leading-relaxed font-normal w-full">
              {product.subtitle && (
                <p className="font-medium text-[#413C23] tracking-wide">
                  {product.subtitle}
                </p>
              )}
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
              let comparePrice = getCompareAtPrice(product.price, product.originalPrice);

              if (isBundle) {
                if (pairOffer && pairOffer.products.length === 2) {
                  const p1Mrp = getCompareAtPrice(pairOffer.products[0].price, pairOffer.products[0].originalPrice);
                  const p2Mrp = getCompareAtPrice(pairOffer.products[1].price, pairOffer.products[1].originalPrice);
                  comparePrice = p1Mrp + p2Mrp;
                } else if (comparePrice <= product.price * 1.5) {
                  comparePrice = getCompareAtPrice(product.price);
                }
              }

              const discount = getDiscountPercentage(product.price, comparePrice);
              return (
                <div className="space-y-2.5 w-full pt-1">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-3xl sm:text-4xl font-bold text-[#413C23] tracking-tight">
                      {formatPrice(product.price)}
                    </span>
                    {comparePrice > product.price && (
                      <>
                        <span className="text-base sm:text-lg text-[#8F896D] line-through font-normal">
                          {formatPrice(comparePrice)}
                        </span>
                        <span className="text-[11px] font-semibold text-[#413C23] bg-[#FAF8F5] border border-[#D8D2C2] px-2.5 py-0.5 rounded-xs uppercase tracking-wider shadow-2xs">
                          {discount}% OFF
                        </span>
                      </>
                    )}
                  </div>

                  <div className="text-[11px] text-[#8F896D] tracking-wide">
                    <span>MRP incl. of all taxes</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#DC2626] tracking-wide pt-1 select-none">
                    <span>Only {stockCount} left in stock — Offer ends in {formatTimer(timeLeft)}</span>
                  </div>
                </div>
              );
            })()}

            {/* Finish / Bundle Contents */}
            <div className="space-y-2.5 pt-1 w-full">
              {isBundle ? (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] font-semibold text-[#413C23] uppercase tracking-[0.14em]">
                      What's In This 2-Piece Duo Set
                    </span>
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-[#413C23] bg-[#FAF8F5] border border-[#D8D2C2] px-2.5 py-0.5 rounded-xs">
                      Both Pairs Included
                    </span>
                  </div>

                  {pairOffer && pairOffer.products.length === 2 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {pairOffer.products.map((p, idx) => (
                        <Link
                          key={p.id}
                          to={`/products/${p.handle || p.id}`}
                          className="flex items-center gap-3 p-2.5 bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs hover:border-[#413C23] transition-colors cursor-pointer"
                        >
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-11 h-11 object-contain mix-blend-multiply bg-white rounded-2xs border border-[#E7E4D5] p-1"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="text-[9px] uppercase tracking-wider text-[#8F896D] block">
                              Piece 0{idx + 1} • {p.metal}
                            </span>
                            <span className="text-xs font-serif font-medium text-[#413C23] truncate block">
                              {p.name}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[#413C23] bg-[#FAF8F5] p-3 rounded-xs border border-[#D8D2C2]">
                      Includes both pieces curated and packaged securely together in one delivery.
                    </p>
                  )}

                  <p className="text-[11px] text-[#8F896D] tracking-wide pt-0.5">
                    Both individual pieces are securely packaged and delivered together in one parcel.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] font-semibold text-[#413C23] uppercase tracking-[0.14em]">
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
                      title={isGoldAvailable ? 'Select Gold Tone Brass' : 'Unavailable in Gold Tone Brass'}
                      className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xs border text-xs font-medium transition-all ${
                        selectedFinish === 'Gold Tone Brass'
                          ? 'border-[#413C23] bg-[#FAF8F5] text-[#413C23] ring-1 ring-[#413C23] shadow-xs cursor-pointer'
                          : isGoldAvailable
                          ? 'border-[#D8D2C2] text-[#6B6650] bg-[#FAF8F5]/80 hover:border-[#8F896D] hover:text-[#413C23] cursor-pointer'
                          : 'border-dashed border-[#D8D2C2] text-neutral-400 bg-[#FAF8F5]/30 cursor-not-allowed opacity-50'
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className="w-3.5 h-3.5 rounded-full shrink-0 border border-[#00000020] bg-[linear-gradient(135deg,#E8C87A_0%,#C9A227_55%,#9C7A1A_100%)] shadow-2xs"
                      />
                      <span>Gold Tone Brass</span>
                      {!isGoldAvailable && (
                        <span className="text-[10px] uppercase font-normal tracking-wide text-[#8F896D]">
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
                      className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xs border text-xs font-medium transition-all ${
                        selectedFinish === 'Silver Tone Brass'
                          ? 'border-[#413C23] bg-[#FAF8F5] text-[#413C23] ring-1 ring-[#413C23] shadow-xs cursor-pointer'
                          : isSilverAvailable
                          ? 'border-[#D8D2C2] text-[#6B6650] bg-[#FAF8F5]/80 hover:border-[#8F896D] hover:text-[#413C23] cursor-pointer'
                          : 'border-dashed border-[#D8D2C2] text-neutral-400 bg-[#FAF8F5]/30 cursor-not-allowed opacity-50'
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className="w-3.5 h-3.5 rounded-full shrink-0 border border-[#00000020] bg-[linear-gradient(135deg,#F2F2F0_0%,#C8C8CC_55%,#9A9AA0_100%)] shadow-2xs"
                      />
                      <span>Silver Tone Brass</span>
                      {!isSilverAvailable && (
                        <span className="text-[10px] uppercase font-normal tracking-wide text-[#8F896D]">
                          (N/A)
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Primary Actions: Buy Now, Add to Bag, and Wishlist */}
            <div className="pt-3 flex flex-wrap items-center gap-4 sm:gap-6 w-full">
              <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
                <button
                  id="pdp-buy-now-cta"
                  onClick={handleBuyNow}
                  disabled={isBuyingNow}
                  className="w-full sm:w-auto sm:min-w-[190px] py-4 px-8 bg-black hover:bg-neutral-800 disabled:opacity-60 disabled:cursor-wait text-white text-xs uppercase tracking-[0.2em] font-semibold rounded-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  {isBuyingNow ? 'Taking you to checkout…' : 'Buy Now'}
                </button>

                <button
                  id="pdp-add-to-bag-cta"
                  onClick={handleAddToCart}
                  disabled={isBuyingNow}
                  className={`w-full sm:w-auto sm:min-w-[190px] py-4 px-8 text-xs uppercase tracking-[0.2em] font-semibold rounded-xs transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-98 border border-black ${
                    isAddedToBag
                      ? 'bg-black text-white'
                      : 'bg-transparent text-black hover:bg-black hover:text-white'
                  }`}
                  style={{
                    backgroundColor: isAddedToBag ? '#000000' : 'transparent',
                    color: isAddedToBag ? '#ffffff' : '#000000',
                    borderColor: '#000000',
                  }}
                >
                  {isAddedToBag ? (
                    <span className="inline-flex items-center gap-2">
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>Added to Bag</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag</span>
                    </span>
                  )}
                </button>
              </div>

              <button
                id="pdp-wishlist-cta"
                type="button"
                onClick={() => setIsWishlisted(!isWishlisted)}
                title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                aria-label={isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
                className="text-xs uppercase tracking-[0.16em] font-medium text-black hover:text-neutral-600 transition-colors cursor-pointer flex items-center gap-2 py-2"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isWishlisted ? 'fill-black text-black' : 'text-black'
                  }`}
                />
                <span>{isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}</span>
              </button>
            </div>

            {/* Trust & Quality Badges */}
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

            {/* Pincode Delivery Estimator */}
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
                        'High-grade brass with a protective anti-tarnish coating. Nickel-free, lead-free and cadmium-free, with surgical steel posts. This is fashion jewellery: not solid gold, gold vermeil or sterling silver, and not hallmarked to any precious-metal standard.'}
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
                    Every AVIRENA piece arrives securely packaged for safe transit, ensuring your jewellery reaches you in pristine condition.
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
                  <Link
                    to={`/products/${item.handle || item.id}`}
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
                        {formatPrice(item.price)}
                      </span>
                    </div>
                  </Link>

                  <button
                    onClick={() => handleQuickAddRecommendation(item)}
                    className={`text-xs font-semibold uppercase tracking-wider shrink-0 cursor-pointer transition-all duration-200 flex items-center gap-1.5 ${
                      addedRecId === item.id
                        ? 'text-[#15803D]'
                        : 'text-[#413C23] hover:text-[#8F896D] underline underline-offset-4'
                    }`}
                  >
                    {addedRecId === item.id ? (
                      <span className="inline-flex items-center gap-1 animate-in fade-in zoom-in-75 duration-150">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Added</span>
                      </span>
                    ) : (
                      <span>Add to cart</span>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. MORE FROM AVIRENA — 5-piece grid */}
      {moreProducts.length > 0 && (
        <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 pt-12 pb-4 border-t border-[#D8D2C2]">
          <div className="w-full">
            <div className="flex items-end justify-between gap-4 mb-6">
              <h3 className="font-serif-display text-2xl sm:text-3xl font-light text-[#413C23] tracking-tight">
                More from AVIRENA
              </h3>
              <Link
                to="/shop"
                className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#8F896D] hover:text-[#413C23] transition-colors cursor-pointer underline underline-offset-4 decoration-[#D8D2C2] shrink-0"
              >
                View all pieces
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-x-4 gap-y-8">
              {moreProducts.map((item) => (
                <ProductCard
                  key={item.id}
                  product={item}
                  currency="INR"
                  to={`/products/${item.handle || item.id}`}
                  onQuickAdd={handleQuickAddRecommendation}
                  isWishlisted={false}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* LIGHTBOX */}
      <ProductImageLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={imagesList}
        initialIndex={Math.max(0, imagesList.indexOf(activeMedia.url))}
        productName={product.name}
      />
    </div>
  );
}
