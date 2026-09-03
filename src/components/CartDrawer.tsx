import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Sparkles,
  Gift,
  Truck,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { CartItem, Currency, Product } from '../types';
import { formatPrice, PRODUCTS } from '../data/products';
import { useShopify } from '../context/ShopifyContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: Currency;
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
  onQuickAdd?: (product: Product) => void;
}

const FREE_SHIPPING_THRESHOLD_EUR = 150;

// Curated luxury add-ons
const LUXURY_ADDONS: Product[] = [
  {
    id: 'addon-polish-cloth',
    name: 'Atelier Gold Microfiber Cloth',
    tagline: 'Preserves 18k vermeil satiny mirror luster',
    price: 12,
    rating: 5.0,
    reviewsCount: 142,
    images: [
      'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=400&q=80',
    ],
    category: 'brooches',
    metal: '18k Gold Vermeil',
    description: 'Ultra-plush anti-tarnish polishing cloth specifically formulated for 3.0µ vermeil and natural pearls.',
    features: ['Micro-abrasion safe', 'Reusable 200+ times', 'Anti-tarnish barrier'],
    details: {
      material: '100% Micro-suede',
      dimensions: '15cm x 15cm',
      origin: 'Jaipur Atelier',
    },
  },
  {
    id: 'addon-travel-case',
    name: 'Velvet Atelier Travel Vault',
    tagline: 'Forest green velvet with champagne brass zipper',
    price: 28,
    rating: 4.9,
    reviewsCount: 98,
    images: [
      'https://images.unsplash.com/photo-1611591475168-98967b5eb488?auto=format&fit=crop&w=400&q=80',
    ],
    category: 'brooches',
    metal: '18k Gold Vermeil',
    description: 'Compact protective velvet travel jewelry organizer with dedicated ring slots and anti-tangle necklace hooks.',
    features: ['Anti-tarnish lining', 'Ergonomic ring rolls', 'Champagne metal zip'],
    details: {
      material: 'Forest Green Silk Velvet',
      dimensions: '10cm x 10cm x 5cm',
      origin: 'Vicenza, Italy',
    },
  },
];

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onContinueShopping,
  onQuickAdd,
}) => {
  const { isConfigured, syncLocalCartToShopify } = useShopify();
  const [isRedirectingToShopify, setIsRedirectingToShopify] = useState(false);
  const [includeGiftWrap, setIncludeGiftWrap] = useState(false);
  const [giftNote, setGiftNote] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalCount = items.reduce((total, i) => total + i.quantity, 0);
  const progressPercent = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD_EUR) * 100);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD_EUR - subtotal);

  // Filter add-ons not already in cart
  const availableAddons = LUXURY_ADDONS.filter(
    (addon) => !items.some((item) => item.product.id === addon.id)
  );

  const handleCheckoutClick = async () => {
    if (isConfigured && items.length > 0) {
      setIsRedirectingToShopify(true);
      try {
        const checkoutUrl = await syncLocalCartToShopify(items);
        if (checkoutUrl) {
          window.location.href = checkoutUrl;
          return;
        }
      } catch (e) {
        console.warn('Fallback to standard checkout:', e);
      } finally {
        setIsRedirectingToShopify(false);
      }
    }
    onClose();
    onProceedToCheckout();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans-body">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
        <div className="w-screen max-w-md bg-[#E7E4D5] border-l border-[#D8D2C2] shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 text-[#413C23]">
          
          {/* Header */}
          <div className="p-5 border-b border-[#D8D2C2] bg-[#F4EFE6] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <h2 className="font-serif-display text-xl sm:text-2xl text-[#413C23]">Your Shopping Bag</h2>
                <span className="text-xs uppercase tracking-wider text-[#8F896D] font-semibold">
                  ({totalCount} {totalCount === 1 ? 'piece' : 'pieces'})
                </span>
              </div>
              <button
                id="close-cart-drawer-btn"
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-[#E7E4D5] text-[#8F896D] hover:text-[#413C23] transition-colors cursor-pointer"
                aria-label="Close cart drawer"
              >
                <X className="w-5 h-5 stroke-[1.5]" />
              </button>
            </div>

            {/* Free Insured Delivery Progress Bar */}
            <div className="pt-1">
              <div className="flex items-center justify-between text-[11px] text-[#413C23] font-medium pb-1.5">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#8F896D]" />
                  {remainingForFreeShipping === 0 ? (
                    <span className="text-[#413C23] font-semibold">You've unlocked Free Insured Express Shipping!</span>
                  ) : (
                    <span>Add {formatPrice(remainingForFreeShipping, currency)} for Free Express Shipping</span>
                  )}
                </span>
                <span className="font-bold text-[#8F896D]">{Math.round(progressPercent)}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#D8D2C2] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#413C23] transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Cart Item List / Empty State */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 bg-[#F4EFE6] border border-[#D8D2C2] rounded-full mx-auto flex items-center justify-center text-[#8F896D]">
                  <ShoppingBag className="w-8 h-8 stroke-[1.2]" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif-display text-lg text-[#413C23]">Your bag is empty</h3>
                  <p className="text-xs text-[#8F896D] max-w-xs mx-auto">
                    Explore our sculptural demi-fine rings, necklaces, and baroque pearl pieces.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onContinueShopping();
                  }}
                  className="px-6 py-2.5 bg-[#413C23] text-[#E7E4D5] hover:bg-[#8F896D] text-xs uppercase tracking-widest font-semibold rounded-xs transition-all shadow-sm cursor-pointer"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3.5 p-3.5 bg-[#F4EFE6] border border-[#D8D2C2] rounded-xs relative group transition-colors hover:border-[#8F896D]"
                  >
                    {/* Item Thumbnail */}
                    <div className="w-20 h-20 bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs flex items-center justify-center p-2 shrink-0 overflow-hidden">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div className="space-y-0.5">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-serif-display text-sm sm:text-base text-[#413C23] font-medium truncate">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-[#8F896D] hover:text-[#413C23] p-1 transition-colors cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5 stroke-[1.5]" />
                          </button>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-[#8F896D] uppercase tracking-wider">
                          <span>{item.metal}</span>
                          {item.size && (
                            <>
                              <span>•</span>
                              <span>{item.size}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        {/* Qty Switcher */}
                        <div className="flex items-center border border-[#D8D2C2] rounded-xs bg-[#FAF8F5]">
                          <button
                            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="p-1 text-[#8F896D] hover:text-[#413C23] transition-colors cursor-pointer disabled:opacity-40"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-medium text-[#413C23] min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="p-1 text-[#8F896D] hover:text-[#413C23] transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-semibold text-[#413C23]">
                          {formatPrice(item.product.price * item.quantity, currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* 1-Click Luxury Upsell Add-ons */}
                {availableAddons.length > 0 && onQuickAdd && (
                  <div className="pt-2 space-y-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#8F896D] block">
                      Recommended Atelier Add-ons
                    </span>
                    <div className="space-y-2">
                      {availableAddons.map((addon) => (
                        <div
                          key={addon.id}
                          className="flex items-center justify-between p-2.5 bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs hover:border-[#8F896D] transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={addon.images[0]}
                              alt={addon.name}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 object-cover rounded-xs border border-[#D8D2C2] shrink-0"
                            />
                            <div className="truncate">
                              <span className="font-serif-display text-xs text-[#413C23] font-medium block truncate">
                                {addon.name}
                              </span>
                              <span className="text-[10px] text-[#8F896D] block">
                                +{formatPrice(addon.price, currency)}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => onQuickAdd(addon)}
                            className="px-3 py-1 bg-[#413C23] hover:bg-[#8F896D] text-[#E7E4D5] text-[10px] uppercase tracking-wider font-semibold rounded-xs transition-colors shrink-0 cursor-pointer"
                          >
                            + Add
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Gifting & Personal Message Accordion */}
                <div className="pt-1">
                  <button
                    onClick={() => setIncludeGiftWrap(!includeGiftWrap)}
                    className="flex items-center justify-between w-full p-2.5 bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs text-xs text-[#413C23] hover:border-[#8F896D] transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5 font-medium">
                      <Gift className="w-3.5 h-3.5 text-[#8F896D]" />
                      <span>Complimentary Gift Packaging & Note</span>
                    </span>
                    <span className="text-[10px] text-[#8F896D] uppercase font-semibold">
                      {includeGiftWrap ? 'Added' : '+ Free'}
                    </span>
                  </button>

                  {includeGiftWrap && (
                    <div className="p-3 bg-[#FAF8F5] border-x border-b border-[#D8D2C2] rounded-b-xs space-y-2 animate-in fade-in duration-200">
                      <textarea
                        rows={2}
                        value={giftNote}
                        onChange={(e) => setGiftNote(e.target.value)}
                        placeholder="Write your personal handwritten gift note here..."
                        className="w-full p-2 bg-[#F4EFE6] border border-[#D8D2C2] rounded-xs text-xs text-[#413C23] placeholder-[#8F896D]/60 focus:outline-none focus:border-[#8F896D]"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#D8D2C2] bg-[#F4EFE6] space-y-3 shadow-inner">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-[#413C23]">
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatPrice(subtotal, currency)}</span>
                </div>
                <div className="flex justify-between text-[#8F896D]">
                  <span>Insured Express Delivery</span>
                  <span>{remainingForFreeShipping === 0 ? 'Complimentary' : 'Calculated at checkout'}</span>
                </div>
              </div>

              <button
                id="cart-drawer-checkout-btn"
                onClick={handleCheckoutClick}
                disabled={isRedirectingToShopify}
                className="w-full py-3.5 bg-[#413C23] hover:bg-[#8F896D] text-[#E7E4D5] text-xs uppercase tracking-[0.2em] font-semibold rounded-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-60"
              >
                {isRedirectingToShopify ? (
                  <span>Redirecting to Shopify Checkout...</span>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Proceed to Secure Checkout • {formatPrice(subtotal, currency)}</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 text-[10px] text-[#8F896D] uppercase tracking-wider pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#8F896D]" />
                  256-Bit SSL Encrypted
                </span>
                <span>•</span>
                <span>30-Day Free Returns</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
