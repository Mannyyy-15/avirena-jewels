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
}

const FREE_SHIPPING_THRESHOLD_EUR = 150;

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onContinueShopping,
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

  // Quick cross sell suggestions (pieces not in cart)
  const crossSellSuggestions = PRODUCTS.filter(
    (p) => !items.some((item) => item.product.id === p.id)
  ).slice(0, 2);

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
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
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
            <div className="pt-2">
              <div className="flex items-center justify-between text-[11px] text-[#413C23] font-medium pb-1.5">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[#8F896D]" />
                  {remainingForFreeShipping === 0 ? (
                    <span className="text-[#413C23] font-semibold">You've unlocked Complimentary Express Shipping!</span>
                  ) : (
                    <span>Add {formatPrice(remainingForFreeShipping, currency)} more for free express shipping</span>
                  )}
                </span>
                <span className="font-bold">{Math.round(progressPercent)}%</span>
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
                    Explore our sculptural demi-fine rings, necklaces, and bespoke pieces.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onContinueShopping();
                  }}
                  className="px-6 py-2.5 bg-[#413C23] hover:bg-[#8F896D] text-[#E7E4D5] text-xs uppercase tracking-widest font-semibold rounded-xs transition-colors cursor-pointer"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              <>
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3.5 bg-[#F4EFE6] border border-[#D8D2C2] rounded-xs relative group"
                  >
                    {/* Item Image */}
                    <div className="w-20 h-20 bg-[#E7E4D5] border border-[#D8D2C2] rounded-xs flex items-center justify-center p-2 shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </div>

                    {/* Item Copy & Controls */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-start justify-between">
                          <h4 className="font-serif-display text-sm font-medium text-[#413C23] leading-snug">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="text-[#8F896D] hover:text-[#7A0F1A] transition-colors p-1 cursor-pointer"
                            title="Remove piece"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5 stroke-[1.5]" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-[#8F896D] uppercase tracking-wider">
                          <span>{item.metal}</span>
                          {item.size && (
                            <>
                              <span>•</span>
                              <span>Size: {item.size}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Quantity Selector & Price */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center border border-[#D8D2C2] rounded-xs bg-[#E7E4D5]">
                          <button
                            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="p-1 text-[#8F896D] hover:text-[#413C23] cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center text-xs font-bold text-[#413C23]">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="p-1 text-[#8F896D] hover:text-[#413C23] cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs sm:text-sm font-semibold text-[#413C23]">
                          {formatPrice(item.product.price * item.quantity, currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Gift Wrap Toggle Option */}
                <div className="pt-4 border-t border-[#D8D2C2] space-y-2">
                  <label className="flex items-center gap-2 text-xs font-medium text-[#413C23] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeGiftWrap}
                      onChange={(e) => setIncludeGiftWrap(e.target.checked)}
                      className="rounded-xs text-[#413C23] focus:ring-[#413C23]"
                    />
                    <Gift className="w-4 h-4 text-[#8F896D]" />
                    <span>Complimentary Luxury Gift Box & Handwritten Note</span>
                  </label>

                  {includeGiftWrap && (
                    <textarea
                      value={giftNote}
                      onChange={(e) => setGiftNote(e.target.value)}
                      placeholder="Write your custom gift message here..."
                      rows={2}
                      className="w-full text-xs p-2.5 bg-[#F4EFE6] border border-[#D8D2C2] rounded-xs text-[#413C23] focus:outline-none focus:border-[#8F896D]"
                    />
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-5 bg-[#F4EFE6] border-t border-[#D8D2C2] space-y-3.5">
              <div className="space-y-1.5 text-xs text-[#8F896D]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#413C23]">{formatPrice(subtotal, currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{remainingForFreeShipping === 0 ? 'Complimentary' : formatPrice(12, currency)}</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline border-t border-[#D8D2C2] pt-2">
                <span className="font-serif-display text-sm font-semibold text-[#413C23]">Estimated Total</span>
                <span className="font-serif-display text-xl text-[#413C23] font-bold">
                  {formatPrice(subtotal, currency)}
                </span>
              </div>

              <button
                id="drawer-checkout-btn"
                onClick={handleCheckoutClick}
                disabled={isRedirectingToShopify}
                className="w-full py-3.5 bg-[#413C23] hover:bg-[#8F896D] text-[#E7E4D5] text-xs uppercase tracking-[0.2em] font-semibold rounded-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-center text-[#8F896D]">
                🔒 256-bit SSL Encrypted • 30-Day Easy Returns • 2-Year Warranty
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
