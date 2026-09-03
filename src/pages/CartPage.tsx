import React, { useState } from 'react';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Gift,
} from 'lucide-react';
import { CartItem, Currency, Product } from '../types';
import { formatPrice } from '../data/products';
import { useShopify } from '../context/ShopifyContext';

interface CartPageProps {
  items: CartItem[];
  currency: Currency;
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
  onSelectProduct: (product: Product) => void;
}

const FREE_SHIPPING_THRESHOLD_EUR = 150;

export const CartPage: React.FC<CartPageProps> = ({
  items,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onContinueShopping,
  onSelectProduct,
}) => {
  const { isConfigured, syncLocalCartToShopify } = useShopify();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [includeGiftWrap, setIncludeGiftWrap] = useState(false);
  const [giftNote, setGiftNote] = useState('');

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalCount = items.reduce((total, i) => total + i.quantity, 0);
  const progressPercent = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD_EUR) * 100);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD_EUR - subtotal);

  const handleCheckout = async () => {
    if (isConfigured && items.length > 0) {
      setIsRedirecting(true);
      try {
        const checkoutUrl = await syncLocalCartToShopify(items);
        if (checkoutUrl) {
          window.location.href = checkoutUrl;
          return;
        }
      } catch (e) {
        console.warn('Fallback to standard checkout:', e);
      } finally {
        setIsRedirecting(false);
      }
    }
    onProceedToCheckout();
  };

  if (items.length === 0) {
    return (
      <div className="w-full px-4 sm:px-8 py-24 text-center space-y-6 text-[#111111] font-sans-body max-w-xl mx-auto">
        <div className="w-20 h-20 rounded-full bg-[#EAE4D8] border border-[#E8E2D6] mx-auto flex items-center justify-center text-[#5C5850]">
          <ShoppingBag className="w-8 h-8 stroke-[1.2]" />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif-display text-3xl sm:text-4xl text-[#111111]">Your Bag is Empty</h2>
          <p className="text-xs sm:text-sm text-[#5C5850] max-w-sm mx-auto leading-relaxed">
            Discover handcrafted demi-fine jewelry sculpted for daily grace in thick 18k gold vermeil and solid 925 silver.
          </p>
        </div>
        <button
          onClick={onContinueShopping}
          className="px-8 py-3.5 bg-[#111111] hover:bg-[#D4AF37] text-white text-xs uppercase tracking-widest font-semibold rounded-xs transition-colors cursor-pointer shadow-md"
        >
          Explore the Collection
        </button>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-10 text-left space-y-8 font-sans-body text-[#111111] bg-[#FAF8F5]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#E8E2D6] pb-5 gap-3">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-bold block">
            Atelier Order
          </span>
          <h1 className="font-serif-display text-3xl sm:text-4xl text-[#111111] tracking-tight">
            Shopping Bag ({totalCount} {totalCount === 1 ? 'Piece' : 'Pieces'})
          </h1>
        </div>
        <button
          onClick={onContinueShopping}
          className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#5C5850] hover:text-[#111111] transition-colors cursor-pointer font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Continue Shopping</span>
        </button>
      </div>

      {/* Free Shipping Progress */}
      <div className="bg-white p-4 rounded-xs border border-[#E8E2D6] space-y-2 shadow-xs">
        <div className="flex items-center justify-between text-xs font-medium">
          {remainingForFreeShipping === 0 ? (
            <span className="text-[#2E7D32] flex items-center gap-1.5 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              You unlocked Complimentary Insured Express Shipping!
            </span>
          ) : (
            <span className="text-[#5C5850]">
              Add <strong>{formatPrice(remainingForFreeShipping, currency)}</strong> more for <strong>Free Worldwide Shipping</strong>
            </span>
          )}
          <span className="text-xs text-[#D4AF37] font-bold">{Math.round(progressPercent)}%</span>
        </div>
        <div className="w-full h-2 bg-[#FAF8F5] border border-[#E8E2D6] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#D4AF37] transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Cart Items */}
        <div className="lg:col-span-8 space-y-4 divide-y divide-[#E8E2D6] bg-white p-6 sm:p-8 rounded-xs border border-[#E8E2D6] shadow-xs">
          {items.map((item) => (
            <div key={item.id} className="pt-5 first:pt-0 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div
                className="flex items-center gap-4 cursor-pointer group flex-1"
                onClick={() => onSelectProduct(item.product)}
              >
                <div className="w-20 h-20 bg-[#FAF8F5] border border-[#E8E2D6] rounded-xs p-2 shrink-0 overflow-hidden flex items-center justify-center">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </div>
                <div className="space-y-0.5">
                  <h3 className="font-serif-display text-base text-[#111111] group-hover:text-[#D4AF37] transition-colors font-medium">
                    {item.product.name}
                  </h3>
                  <p className="text-xs text-[#5C5850] font-medium">
                    {item.metal} {item.size ? `• Size ${item.size}` : ''}
                  </p>
                  <p className="text-xs font-semibold text-[#111111] sm:hidden">
                    {formatPrice(item.product.price, currency)}
                  </p>
                </div>
              </div>

              {/* Quantity Stepper & Price */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                <div className="flex items-center border border-[#E8E2D6] bg-[#FAF8F5] rounded-xs">
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    className="p-1.5 text-[#111111] hover:text-[#D4AF37] transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-semibold text-[#111111]">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="p-1.5 text-[#111111] hover:text-[#D4AF37] transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <span className="font-serif-display text-base font-semibold text-[#111111] min-w-[80px] text-right">
                  {formatPrice(item.product.price * item.quantity, currency)}
                </span>

                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="p-1.5 text-[#5C5850] hover:text-[#7A0F1A] transition-colors cursor-pointer"
                  title="Remove piece"
                  aria-label="Remove piece"
                >
                  <Trash2 className="w-4 h-4 stroke-[1.5]" />
                </button>
              </div>
            </div>
          ))}

          {/* Gift Wrapping Option */}
          <div className="pt-6 border-t border-[#E8E2D6] space-y-3">
            <label className="flex items-center gap-2.5 text-xs font-medium text-[#111111] cursor-pointer">
              <input
                type="checkbox"
                checked={includeGiftWrap}
                onChange={(e) => setIncludeGiftWrap(e.target.checked)}
                className="rounded-xs text-[#D4AF37] focus:ring-[#D4AF37]"
              />
              <Gift className="w-4 h-4 text-[#D4AF37]" />
              <span>Complimentary Atelier Keepsake Packaging & Handwritten Note</span>
            </label>

            {includeGiftWrap && (
              <textarea
                value={giftNote}
                onChange={(e) => setGiftNote(e.target.value)}
                placeholder="Enter custom gift message to be handwritten inside your parcel..."
                rows={2}
                className="w-full text-xs p-3 bg-[#FAF8F5] border border-[#E8E2D6] rounded-xs text-[#111111] focus:outline-none focus:border-[#D4AF37]"
              />
            )}
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4 bg-white border border-[#E8E2D6] rounded-xs p-6 sm:p-8 space-y-6 shadow-xs">
          <h2 className="font-serif-display text-xl text-[#111111]">Order Summary</h2>

          <div className="space-y-3 text-xs border-b border-[#E8E2D6] pb-5">
            <div className="flex justify-between text-[#5C5850]">
              <span className="font-medium text-[#111111]">Subtotal</span>
              <span className="font-semibold text-[#111111]">{formatPrice(subtotal, currency)}</span>
            </div>
            <div className="flex justify-between text-[#5C5850]">
              <span>Insured Express Shipping</span>
              <span className="text-[#111111] font-medium">
                {remainingForFreeShipping === 0 ? 'Complimentary' : formatPrice(12, currency)}
              </span>
            </div>
            <div className="flex justify-between text-[#5C5850]">
              <span>Atelier Tax & Customs</span>
              <span className="text-[#111111]">Included</span>
            </div>
          </div>

          <div className="flex justify-between items-baseline pt-1">
            <span className="font-serif-display text-lg text-[#111111] font-medium">Total</span>
            <span className="font-serif-display text-2xl text-[#111111] font-bold">
              {formatPrice(subtotal + (remainingForFreeShipping === 0 ? 0 : 12), currency)}
            </span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={isRedirecting}
            className="w-full py-4 bg-[#111111] hover:bg-[#D4AF37] text-white text-xs uppercase tracking-[0.2em] font-semibold rounded-xs transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 active:scale-98"
          >
            {isRedirecting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Redirecting to Checkout...</span>
              </>
            ) : (
              <>
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-[#5C5850] pt-1">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            <span>256-Bit SSL Encrypted Atelier Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
};
