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
        <div className="w-screen max-w-md bg-[#FAF8F5] border-l border-[#E8E2D6] shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 text-[#111111]">
          
          {/* Header */}
          <div className="p-5 border-b border-[#E8E2D6] bg-white space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <h2 className="font-serif-display text-xl sm:text-2xl text-[#111111]">Your Shopping Bag</h2>
                <span className="text-xs uppercase tracking-wider text-[#5C5850] font-semibold">
                  ({totalCount} {totalCount === 1 ? 'piece' : 'pieces'})
                </span>
              </div>
              <button
                id="close-cart-drawer-btn"
                onClick={onClose}
                className="p-1.5 text-[#5C5850] hover:text-[#111111] transition-colors focus:outline-none cursor-pointer"
                aria-label="Close cart"
              >
                <X className="w-5 h-5 stroke-[1.5]" />
              </button>
            </div>

            {/* Free Shipping Progress Meter */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px] font-medium">
                {remainingForFreeShipping === 0 ? (
                  <span className="text-[#2E7D32] flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    You unlocked Complimentary Insured Express Shipping!
                  </span>
                ) : (
                  <span className="text-[#5C5850]">
                    Add <strong>{formatPrice(remainingForFreeShipping, currency)}</strong> more for <strong>Free Shipping</strong>
                  </span>
                )}
                <span className="text-[10px] text-[#D4AF37] font-bold">{Math.round(progressPercent)}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#E8E2D6] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#D4AF37] transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-[#E8E2D6]">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#EAE4D8] flex items-center justify-center text-[#5C5850]">
                  <ShoppingBag className="w-7 h-7 stroke-[1.2]" />
                </div>
                <div>
                  <h3 className="font-serif-display text-lg text-[#111111]">Your bag is currently empty</h3>
                  <p className="text-xs text-[#5C5850] mt-1 max-w-xs leading-relaxed font-normal">
                    Discover handcrafted sculptural earrings, rings, necklaces, and cuffs sculpted for daily grace.
                  </p>
                </div>
                <button
                  id="empty-cart-explore-btn"
                  onClick={() => {
                    onClose();
                    onContinueShopping();
                  }}
                  className="px-6 py-3 bg-[#111111] hover:bg-[#D4AF37] text-white text-xs uppercase tracking-widest font-semibold rounded-xs transition-colors cursor-pointer shadow-sm"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              <>
                {items.map((item) => (
                  <div key={item.id} className="pt-4 first:pt-0 flex gap-3.5 text-left">
                    {/* Thumbnail */}
                    <div className="w-18 h-18 bg-white border border-[#E8E2D6] rounded-xs shrink-0 overflow-hidden flex items-center justify-center p-1.5">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                    </div>

                    {/* Item info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-serif-display text-sm text-[#111111] leading-tight font-medium">
                            {item.product.name}
                          </h4>
                          <button
                            id={`remove-item-${item.id}`}
                            onClick={() => onRemoveItem(item.id)}
                            className="text-[#5C5850] hover:text-[#7A0F1A] p-1 transition-colors cursor-pointer"
                            title="Remove item"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5 stroke-[1.5]" />
                          </button>
                        </div>

                        <p className="text-[11px] text-[#5C5850] mt-0.5 font-medium">
                          {item.metal} {item.size ? `• ${item.size}` : ''}
                        </p>
                      </div>

                      {/* Quantity & Price */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center border border-[#E8E2D6] rounded-xs bg-white">
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="p-1 text-[#5C5850] hover:text-[#111111] cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center text-xs font-bold text-[#111111]">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="p-1 text-[#5C5850] hover:text-[#111111] cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs sm:text-sm font-semibold text-[#111111]">
                          {formatPrice(item.product.price * item.quantity, currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Gift Wrap Toggle Option */}
                <div className="pt-4 border-t border-[#E8E2D6] space-y-2">
                  <label className="flex items-center gap-2 text-xs font-medium text-[#111111] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeGiftWrap}
                      onChange={(e) => setIncludeGiftWrap(e.target.checked)}
                      className="rounded-xs text-[#D4AF37] focus:ring-[#D4AF37]"
                    />
                    <Gift className="w-4 h-4 text-[#D4AF37]" />
                    <span>Complimentary Luxury Gift Box & Handwritten Note</span>
                  </label>

                  {includeGiftWrap && (
                    <textarea
                      value={giftNote}
                      onChange={(e) => setGiftNote(e.target.value)}
                      placeholder="Write your custom gift message here..."
                      rows={2}
                      className="w-full text-xs p-2.5 bg-white border border-[#E8E2D6] rounded-xs text-[#111111] focus:outline-none focus:border-[#D4AF37]"
                    />
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-5 bg-white border-t border-[#E8E2D6] space-y-3.5">
              <div className="space-y-1.5 text-xs text-[#5C5850]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#111111]">{formatPrice(subtotal, currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{remainingForFreeShipping === 0 ? 'Complimentary' : formatPrice(12, currency)}</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline border-t border-[#E8E2D6] pt-2">
                <span className="font-serif-display text-sm font-semibold text-[#111111]">Estimated Total</span>
                <span className="font-serif-display text-xl text-[#111111] font-bold">
                  {formatPrice(subtotal, currency)}
                </span>
              </div>

              <button
                id="drawer-checkout-btn"
                onClick={handleCheckoutClick}
                disabled={isRedirectingToShopify}
                className="w-full py-3.5 bg-[#111111] hover:bg-[#D4AF37] text-white text-xs uppercase tracking-[0.2em] font-semibold rounded-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-center text-[#5C5850]">
                🔒 256-bit SSL Encrypted • 30-Day Easy Returns • 2-Year Warranty
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
