import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Check,
  Lock,
} from 'lucide-react';
import { CartItem, Currency, Product } from '../types';
import { formatPrice } from '../data/products';
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
  onViewCartPage?: () => void;
}

const FREE_SHIPPING_THRESHOLD_INR = 1999;

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onContinueShopping,
  onViewCartPage,
}) => {
  const { isConfigured, syncLocalCartToShopify } = useShopify();
  const [isRedirectingToShopify, setIsRedirectingToShopify] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalCount = items.reduce((total, i) => total + i.quantity, 0);
  
  // Calculate INR equivalent for free shipping progress
  const subtotalINR = subtotal < 500 ? Math.round(subtotal * 90) : Math.round(subtotal);
  const progressPercent = Math.min(100, (subtotalINR / FREE_SHIPPING_THRESHOLD_INR) * 100);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD_INR - subtotalINR);

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
      {/* Dark Dimmed Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
        {/* h-dvh so the panel has a definite height on mobile and tracks the
            browser chrome as it hides. justify-between is dropped: the item
            list already flexes, and combining the two let the footer drift. */}
        <div className="w-screen max-w-md h-dvh bg-[#FAF8F5] border-l border-[#D8D2C2] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 text-[#413C23]">
          
          {/* 1. TOP HEADER */}
          <div className="p-5 sm:p-6 border-b border-[#D8D2C2] bg-[#F2EFDB] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2.5">
                <h2 className="font-serif-display text-2xl sm:text-3xl font-medium text-[#413C23] tracking-tight">
                  Shopping Bag
                </h2>
                <span className="text-xs uppercase tracking-widest text-[#8F896D] font-bold">
                  ({totalCount} {totalCount === 1 ? 'item' : 'items'})
                </span>
              </div>
              <button
                id="close-cart-drawer-btn"
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-[#FAF8F5] border border-[#D8D2C2] text-[#413C23] hover:bg-[#E7E4D5] transition-colors cursor-pointer"
                aria-label="Close cart drawer"
              >
                <X className="w-4 h-4 stroke-[1.5]" />
              </button>
            </div>

            {/* Free Shipping Progress Indicator */}
            <div className="pt-1 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-[#413C23] font-semibold">
                {remainingForFreeShipping === 0 ? (
                  <span className="flex items-center gap-1.5 text-[#413C23]">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Complimentary Express Shipping Unlocked!</span>
                  </span>
                ) : (
                  <span>
                    Add ₹{remainingForFreeShipping.toLocaleString('en-IN')} more for Free Shipping
                  </span>
                )}
                <span className="text-[11px] font-mono text-[#8F896D] font-bold">
                  {Math.round(progressPercent)}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#D8D2C2] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#413C23] transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* 2. CART ITEM LIST */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {items.length === 0 ? (
              <div className="py-20 text-center space-y-5">
                <div className="w-16 h-16 bg-[#F2EFDB] border border-[#D8D2C2] rounded-full mx-auto flex items-center justify-center text-[#413C23]">
                  <ShoppingBag className="w-8 h-8 stroke-[1.4]" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif-display text-2xl text-[#413C23] font-medium">Your Bag is Empty</h3>
                  <p className="text-xs text-[#8F896D]">
                    Discover our handcrafted dailywear jewels in premium brass.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onContinueShopping();
                  }}
                  className="px-6 py-3 bg-[#413C23] text-[#FAF8F5] hover:bg-[#8F896D] text-xs uppercase tracking-[0.2em] font-semibold rounded-xs transition-colors shadow-sm cursor-pointer"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 bg-[#F2EFDB] border border-[#D8D2C2] rounded-xs transition-all hover:border-[#8F896D]"
                  >
                    {/* Square thumbnail. Larger and less padded than before:
                        at 80px with 8px inset the piece was too small to
                        recognise, which is the thumbnail's only job here. */}
                    <div className="w-24 h-24 bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        width={96}
                        height={96}
                        loading="lazy"
                        decoding="async"
                        className="max-w-full max-h-full w-auto h-auto object-contain mix-blend-multiply"
                      />
                    </div>

                    {/* Details Column */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          {/* Wraps to two lines rather than truncating: names
                              like "Solene Crystal Hoops - Gold" lose the finish
                              at the ellipsis, which is the part that tells the
                              shopper which variant is in their bag. */}
                          <h4 className="font-serif-display text-base font-medium text-[#413C23] leading-snug line-clamp-2">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-[#8F896D] hover:text-[#7A0F1A] transition-colors p-1 cursor-pointer shrink-0"
                            title="Remove item"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4 stroke-[1.5]" />
                          </button>
                        </div>
                        <div className="text-[11px] text-[#8F896D] uppercase tracking-wider font-semibold mt-0.5">
                          {item.metal}
                          {item.size && <span> • {item.size}</span>}
                        </div>
                      </div>

                      {/* Quantity & Bold Price Row */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center border border-[#D8D2C2] rounded-xs bg-[#FAF8F5]">
                          <button
                            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="w-7 h-7 flex items-center justify-center text-[#413C23] hover:bg-[#E7E4D5] transition-colors cursor-pointer disabled:opacity-30"
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-[#413C23] min-w-[22px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-[#413C23] hover:bg-[#E7E4D5] transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-base sm:text-lg font-bold text-[#413C23] tracking-tight">
                          {formatPrice(item.product.price * item.quantity, currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3. FOOTER CHECKOUT SUMMARY */}
          {items.length > 0 && (
            <div className="p-5 sm:p-6 border-t border-[#D8D2C2] bg-[#F2EFDB] space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between items-baseline text-[#413C23]">
                  <span className="text-xs uppercase tracking-widest font-semibold text-[#8F896D]">
                    Subtotal
                  </span>
                  <span className="text-xl sm:text-2xl font-bold text-[#413C23] tracking-tight">
                    {formatPrice(subtotal, currency)}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-[#8F896D]">
                  <span>Shipping &amp; Taxes</span>
                  <span className="font-medium text-[#413C23]">
                    {remainingForFreeShipping === 0 ? 'Free Express Shipping' : 'Calculated at checkout'}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                id="cart-drawer-checkout-btn"
                onClick={handleCheckoutClick}
                disabled={isRedirectingToShopify}
                className="w-full py-4 bg-[#413C23] hover:bg-[#8F896D] text-[#FAF8F5] text-xs sm:text-sm uppercase tracking-[0.2em] font-semibold rounded-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-60"
              >
                {isRedirectingToShopify ? (
                  <span>Redirecting to Checkout...</span>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Proceed to Checkout • {formatPrice(subtotal, currency)}</span>
                  </>
                )}
              </button>

              {/* View Cart Page Link */}
              {onViewCartPage && (
                <button
                  onClick={onViewCartPage}
                  className="w-full text-center text-xs uppercase tracking-widest font-semibold text-[#413C23] hover:text-[#8F896D] transition-colors py-1 cursor-pointer underline underline-offset-4"
                >
                  View Full Bag Details →
                </button>
              )}

              <div className="flex items-center justify-center gap-2 text-[10px] text-[#8F896D] uppercase tracking-wider font-semibold pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#413C23]" />
                <span>Secure SSL Encrypted Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
