import React, { useState } from 'react';
import {
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ShoppingBag,
  ShieldCheck,
  Check,
  Lock,
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

const FREE_SHIPPING_THRESHOLD_INR = 1999;

export const CartPage: React.FC<CartPageProps> = ({
  items,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onContinueShopping,
}) => {
  const { isConfigured, syncLocalCartToShopify } = useShopify();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalCount = items.reduce((total, i) => total + i.quantity, 0);

  const subtotalINR = subtotal < 500 ? Math.round(subtotal * 90) : Math.round(subtotal);
  const progressPercent = Math.min(100, (subtotalINR / FREE_SHIPPING_THRESHOLD_INR) * 100);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD_INR - subtotalINR);

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
      <div className="w-full px-4 sm:px-8 py-28 text-center space-y-6 text-[#413C23] font-sans-body max-w-lg mx-auto select-none">
        <div className="w-20 h-20 rounded-full bg-[#F2EFDB] border border-[#D8D2C2] mx-auto flex items-center justify-center text-[#413C23]">
          <ShoppingBag className="w-8 h-8 stroke-[1.4]" />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif-display text-3xl sm:text-4xl text-[#413C23] font-normal">
            Your Bag is Empty
          </h2>
          <p className="text-xs text-[#8F896D]">
            Explore our curated handcrafted dailywear jewels in premium brass.
          </p>
        </div>
        <button
          onClick={onContinueShopping}
          className="px-8 py-3.5 bg-[#413C23] hover:bg-[#8F896D] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-semibold rounded-xs transition-colors cursor-pointer shadow-sm"
        >
          Explore Collection
        </button>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-8 sm:py-12 text-left font-sans-body text-[#413C23] bg-[#E7E4D5] select-none">
      
      {/* 1. HEADER ROW */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#D8D2C2] pb-6 gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#8F896D] font-bold block mb-1">
            Order Review
          </span>
          <h1 className="font-serif-display text-4xl sm:text-5xl font-light italic text-[#413C23] tracking-tight">
            Shopping Bag ({totalCount} {totalCount === 1 ? 'Piece' : 'Pieces'})
          </h1>
        </div>
        <button
          onClick={onContinueShopping}
          className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#8F896D] hover:text-[#413C23] transition-colors cursor-pointer font-semibold underline underline-offset-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Continue Shopping</span>
        </button>
      </div>

      {/* 2. FREE SHIPPING BANNER */}
      <div className="mt-6 bg-[#F2EFDB] border border-[#D8D2C2] p-4 rounded-xs space-y-2">
        <div className="flex items-center justify-between text-xs text-[#413C23] font-semibold">
          {remainingForFreeShipping === 0 ? (
            <span className="flex items-center gap-1.5 text-[#413C23]">
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Complimentary Insured Express Shipping Unlocked!</span>
            </span>
          ) : (
            <span>
              Add ₹{remainingForFreeShipping.toLocaleString('en-IN')} more for Complimentary Express Shipping
            </span>
          )}
          <span className="font-mono text-xs font-bold text-[#8F896D]">
            {Math.round(progressPercent)}%
          </span>
        </div>
        <div className="w-full h-2 bg-[#D8D2C2] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#413C23] transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 3. MAIN CART GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-8 items-start">
        
        {/* Left: Items List (8 Columns) */}
        <div className="lg:col-span-8 bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs p-5 sm:p-7 space-y-5">
          <div className="hidden sm:grid grid-cols-12 text-xs uppercase tracking-widest text-[#8F896D] font-semibold border-b border-[#D8D2C2] pb-3">
            <span className="col-span-6">Product</span>
            <span className="col-span-3 text-center">Quantity</span>
            <span className="col-span-3 text-right">Total</span>
          </div>

          <div className="divide-y divide-[#D8D2C2]/60">
            {items.map((item) => (
              <div
                key={item.id}
                className="py-5 first:pt-0 last:pb-0 flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center"
              >
                {/* Product Column */}
                <div className="w-full sm:col-span-6 flex items-center gap-4">
                  <div className="w-20 h-20 bg-[#F2EFDB] border border-[#D8D2C2] rounded-xs flex items-center justify-center p-2 shrink-0 overflow-hidden">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="max-w-full max-h-full w-auto h-auto object-contain mix-blend-multiply"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-serif-display text-base sm:text-lg font-medium text-[#413C23] leading-snug">
                      {item.product.name}
                    </h3>
                    <p className="text-[11px] text-[#8F896D] uppercase tracking-wider font-semibold mt-0.5">
                      {item.metal}
                      {item.size && <span> • {item.size}</span>}
                    </p>
                    <p className="text-xs text-[#8F896D] mt-1 sm:hidden">
                      {formatPrice(item.product.price, currency)} each
                    </p>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="w-full sm:col-span-3 flex items-center justify-between sm:justify-center">
                  <div className="flex items-center border border-[#D8D2C2] rounded-xs bg-[#FAF8F5]">
                    <button
                      onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center text-[#413C23] hover:bg-[#E7E4D5] transition-colors cursor-pointer disabled:opacity-30"
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-[#413C23] min-w-[24px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-[#413C23] hover:bg-[#E7E4D5] transition-colors cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="sm:hidden text-[#8F896D] hover:text-[#7A0F1A] transition-colors p-1"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Total Item Price & Remove */}
                <div className="w-full sm:col-span-3 flex items-center justify-between sm:justify-end gap-3">
                  <span className="text-base sm:text-lg font-bold text-[#413C23] tracking-tight">
                    {formatPrice(item.product.price * item.quantity, currency)}
                  </span>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="hidden sm:inline-flex text-[#8F896D] hover:text-[#7A0F1A] transition-colors p-1 cursor-pointer"
                    title="Remove item"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4 stroke-[1.5]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Order Summary (4 Columns) */}
        <div className="lg:col-span-4 bg-[#F2EFDB] border border-[#D8D2C2] rounded-xs p-6 sm:p-7 space-y-6 sticky top-24">
          <h2 className="font-serif-display text-2xl text-[#413C23] font-medium border-b border-[#D8D2C2] pb-3">
            Order Summary
          </h2>

          <div className="space-y-3 text-xs text-[#413C23]">
            <div className="flex justify-between items-center">
              <span className="text-[#8F896D] uppercase tracking-wider font-semibold">Subtotal</span>
              <span className="text-base font-bold text-[#413C23]">{formatPrice(subtotal, currency)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#8F896D] uppercase tracking-wider font-semibold">Insured Delivery</span>
              <span className="font-semibold text-[#413C23]">
                {remainingForFreeShipping === 0 ? 'Complimentary' : 'Calculated at checkout'}
              </span>
            </div>

            <div className="border-t border-[#D8D2C2] pt-4 flex justify-between items-baseline">
              <span className="text-sm uppercase tracking-widest font-bold text-[#413C23]">Total</span>
              <span className="text-2xl sm:text-3xl font-bold text-[#413C23] tracking-tight">
                {formatPrice(subtotal, currency)}
              </span>
            </div>
          </div>

          <button
            id="cart-page-checkout-btn"
            onClick={handleCheckout}
            disabled={isRedirecting}
            className="w-full py-4 bg-[#413C23] hover:bg-[#8F896D] text-[#FAF8F5] text-xs sm:text-sm uppercase tracking-[0.2em] font-semibold rounded-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-60"
          >
            {isRedirecting ? (
              <span>Redirecting to Checkout...</span>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Proceed to Checkout</span>
              </>
            )}
          </button>

          <div className="space-y-2 pt-2 border-t border-[#D8D2C2]/60 text-[11px] text-[#8F896D]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#413C23] shrink-0" />
              <span>256-Bit Bank Grade SSL Encrypted Checkout</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#413C23] shrink-0" />
              <span>Complimentary Insured Delivery Across India</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
