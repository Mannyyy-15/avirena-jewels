import React, { useState } from 'react';
import {
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Lock,
  Check,
} from 'lucide-react';
import { CartItem, Currency, Product } from '../types';
import { formatPrice, formatInr } from '../data/products';
import { useShopify } from '../context/ShopifyContext';
import { buildDirectCheckoutUrl } from '../lib/shopify';
import { getAutomaticPairSavings, groupCartItemsForDisplay } from '../data/offers';

interface CartPageProps {
  items: CartItem[];
  currency: Currency;
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
  onSelectProduct: (product: Product) => void;
}



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
  const pairSavings = getAutomaticPairSavings(items);



  const handleCheckout = async () => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'InitiateCheckout', {
        value: subtotal,
        currency: currency === 'INR' ? 'INR' : currency,
        num_items: totalCount,
        content_ids: items.map((i) => i.product.handle || i.product.id)
      });
    }

    // High-speed Direct Permalink Checkout: redirect immediately to Shopify edge CDN
    const directCheckoutUrl = buildDirectCheckoutUrl(items);
    if (directCheckoutUrl) {
      setIsRedirecting(true);
      window.location.href = directCheckoutUrl;
      return;
    }

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
            Explore our curated dailywear jewels in premium brass.
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

      {/* 2. FREE DELIVERY BANNER */}
      <div className="mt-6 bg-[#F2EFDB] border border-[#D8D2C2] p-4 rounded-xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#D8D2C2] flex items-center justify-center text-[#413C23] shrink-0">
          <Truck className="w-4.5 h-4.5" />
        </div>
        <div>
          <span className="block text-sm font-semibold text-[#413C23]">Free Delivery on All Orders</span>
          <span className="text-[11px] text-[#8F896D]">Express insured courier • 2–5 business days across India</span>
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
            {groupCartItemsForDisplay(items).map((group) => {
              if (group.type === 'bundle') {
                const leadItem = group.items[0];
                return (
                  <div
                    key={group.bundleGroupId}
                    className="py-5 first:pt-0 last:pb-0 flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center"
                  >
                    {/* Duo Bundle Info Column */}
                    <div className="w-full sm:col-span-6 space-y-2">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#7A0F1A]/10 text-[#7A0F1A] text-[10px] font-bold tracking-[0.16em] uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#7A0F1A]" />
                        <span>Duo Suite · {group.bundleTitle}</span>
                        <span className="text-[#14532D] font-mono">· Save ₹{group.savings * group.quantity}</span>
                      </div>

                      {/* Dual Items Visual Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {group.items.map((piece) => (
                          <div
                            key={piece.id}
                            className="flex items-center gap-2.5 bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs p-2"
                          >
                            <div className="w-12 h-12 bg-white border border-[#D8D2C2]/70 rounded-xs flex items-center justify-center p-1 shrink-0 overflow-hidden">
                              <img
                                src={piece.product.images[0] || '/logo.png'}
                                alt={piece.product.name}
                                referrerPolicy="no-referrer"
                                className="max-w-full max-h-full w-auto h-auto object-contain mix-blend-multiply"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-serif-display text-xs font-medium text-[#413C23] truncate leading-tight">
                                {piece.product.name}
                              </p>
                              <span className="text-[10px] text-[#8F896D] uppercase tracking-wider block mt-0.5">
                                {piece.metal}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="w-full sm:col-span-3 flex items-center justify-between sm:justify-center">
                      <div className="flex items-center border border-[#D8D2C2] rounded-xs bg-[#FAF8F5]">
                        <button
                          onClick={() => onUpdateQuantity(leadItem.id, Math.max(1, group.quantity - 1))}
                          className="w-8 h-8 flex items-center justify-center text-[#413C23] hover:bg-[#E7E4D5] transition-colors cursor-pointer disabled:opacity-30"
                          disabled={group.quantity <= 1}
                          aria-label="Decrease duo quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-[#413C23] min-w-[24px] text-center font-mono">
                          {group.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(leadItem.id, group.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-[#413C23] hover:bg-[#E7E4D5] transition-colors cursor-pointer"
                          aria-label="Increase duo quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(leadItem.id)}
                        className="sm:hidden text-[#8F896D] hover:text-[#7A0F1A] transition-colors p-1"
                        title="Remove duo suite"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Combined Duo Price & Remove */}
                    <div className="w-full sm:col-span-3 flex items-center justify-between sm:justify-end gap-3">
                      <div className="text-right">
                        <div className="flex items-baseline gap-1.5 justify-end">
                          <span className="text-xs text-[#991B1B] line-through font-normal">
                            {formatPrice(group.combinedOriginalPrice * group.quantity, currency)}
                          </span>
                          <span className="text-base sm:text-lg font-bold text-[#413C23] tracking-tight">
                            {formatPrice(group.combinedPrice * group.quantity, currency)}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-[#14532D] uppercase tracking-wider block">
                          ₹{group.savings * group.quantity} Bundle Discount Applied
                        </span>
                      </div>
                      <button
                        onClick={() => onRemoveItem(leadItem.id)}
                        className="hidden sm:inline-flex text-[#8F896D] hover:text-[#7A0F1A] transition-colors p-1 cursor-pointer"
                        title="Remove duo suite"
                        aria-label="Remove duo suite"
                      >
                        <Trash2 className="w-4 h-4 stroke-[1.5]" />
                      </button>
                    </div>
                  </div>
                );
              }

              const item = group.item;
              return (
                <div
                  key={item.id}
                  className="py-5 first:pt-0 last:pb-0 flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center"
                >
                  {/* Product Column */}
                  <div className="w-full sm:col-span-6 flex items-center gap-4">
                    <div className="w-20 h-20 bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs flex items-center justify-center p-2 shrink-0 overflow-hidden">
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
              );
            })}
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

            {pairSavings > 0 && (
              <div className="flex justify-between items-center rounded-xs border border-[#15803D]/25 bg-[#15803D]/10 px-3 py-2 text-[#14532D]">
                <span className="font-semibold">Automatic pair saving</span>
                <span className="font-bold">−{formatInr(pairSavings)}</span>
              </div>
            )}

            <div className="rounded-xs border border-dashed border-[#8F896D] bg-[#FAF8F5] px-3 py-2 leading-relaxed text-[#6B6650]">
              Add code <strong className="font-mono text-[#413C23]">PREPAID50</strong> at checkout for another ₹50 off.
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#8F896D] uppercase tracking-wider font-semibold">Delivery</span>
              <span className="font-semibold text-[#413C23]">Free</span>
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
            className="w-full py-4 bg-black hover:bg-neutral-800 text-white text-xs sm:text-sm uppercase tracking-[0.2em] font-semibold rounded-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-60"
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
