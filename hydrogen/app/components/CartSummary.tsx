import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Money, type OptimisticCart} from '@shopify/hydrogen';
import {useId, useRef} from 'react';
import {useFetcher} from 'react-router';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart, layout}: CartSummaryProps) {
  const isAside = layout === 'aside';
  const discountsHeadingId = useId();
  const discountCodeInputId = useId();

  return (
    <div className={`border-t border-[#D8D2C2] bg-[#F2EFDB] p-5 sm:p-6 space-y-4 text-[#413C23] ${isAside ? 'mt-auto' : 'rounded-xs max-w-lg mx-auto shadow-xs'}`}>
      {/* Free Delivery Reassurance */}
      <div className="flex items-center justify-between text-xs text-[#413C23] pb-2 border-b border-[#D8D2C2]/60 font-medium">
        <span className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="16" height="13" x="1" y="6" rx="2" />
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
          Express Delivery
        </span>
        <span className="text-[#14532D] uppercase font-bold tracking-wider text-[11px]">
          FREE
        </span>
      </div>

      {/* Prepaid Offer Alert */}
      <div className="p-2.5 bg-[#FAF8F5] border border-[#8F896D]/40 rounded-xs flex items-center justify-between text-xs">
        <span className="text-[#413C23]">Prepaid extra discount:</span>
        <span className="font-mono font-bold text-[#7A0F1A] bg-[#FAF8F5] px-2 py-0.5 border border-[#7A0F1A]/30 rounded-xs">
          PREPAID50
        </span>
      </div>

      {/* Subtotal */}
      <div className="flex justify-between items-baseline pt-1">
        <span className="font-serif text-lg text-[#413C23]">Subtotal</span>
        <span className="font-sans font-bold text-xl sm:text-2xl text-[#413C23] tracking-tight">
          {cart?.cost?.subtotalAmount?.amount ? (
            <Money data={cart.cost.subtotalAmount} />
          ) : (
            '₹0'
          )}
        </span>
      </div>

      {/* Discount Codes Section */}
      <CartDiscounts
        discountCodes={cart?.discountCodes}
        discountsHeadingId={discountsHeadingId}
        discountCodeInputId={discountCodeInputId}
      />

      {/* Direct Shopify Checkout Handoff */}
      <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} />

      {/* Security Reassurance */}
      <div className="pt-2 text-center text-[10px] uppercase tracking-wider text-[#8F896D] space-y-1">
        <p>🔒 256-Bit SSL Encrypted • PCI-DSS Compliant Checkout</p>
        <p>UPI • Cards • NetBanking • Cash on Delivery</p>
      </div>
    </div>
  );
}

function CartCheckoutActions({checkoutUrl}: {checkoutUrl?: string}) {
  if (!checkoutUrl) return null;

  return (
    <div>
      <a
        href={checkoutUrl}
        target="_self"
        className="w-full py-3.5 px-6 bg-[#413C23] hover:bg-[#8F896D] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-semibold rounded-xs transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer block text-center"
      >
        <span>Proceed to Checkout</span>
        <span>→</span>
      </a>
    </div>
  );
}

function CartDiscounts({
  discountCodes,
  discountsHeadingId,
  discountCodeInputId,
}: {
  discountCodes?: CartApiQueryFragment['discountCodes'];
  discountsHeadingId: string;
  discountCodeInputId: string;
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div className="space-y-2 pt-1">
      {codes.length > 0 && (
        <div className="flex items-center justify-between p-2 bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs text-xs">
          <span className="font-mono text-[#14532D] font-bold uppercase">
            {codes.join(', ')} Applied
          </span>
          <UpdateDiscountForm>
            <button
              type="submit"
              className="text-[#DC2626] text-[11px] underline uppercase cursor-pointer"
            >
              Remove
            </button>
          </UpdateDiscountForm>
        </div>
      )}

      <UpdateDiscountForm discountCodes={codes}>
        <div className="flex gap-2">
          <input
            id={discountCodeInputId}
            type="text"
            name="discountCode"
            placeholder="Discount code (e.g. PREPAID50)"
            className="flex-1 px-3 py-1.5 bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs text-xs text-[#413C23] focus:outline-none focus:border-[#413C23]"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-[#413C23] text-[#FAF8F5] text-[11px] uppercase tracking-wider rounded-xs hover:bg-[#8F896D] transition-colors cursor-pointer"
          >
            Apply
          </button>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  const fetcher = useFetcher();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}
