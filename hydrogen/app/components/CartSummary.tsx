import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, type OptimisticCart} from '@shopify/hydrogen';
import {useId} from 'react';
import {Link} from 'react-router';
import {Lock, ShieldCheck, Tag} from 'lucide-react';
import {useAside} from './Aside';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

function formatPriceAmount(amount?: string, currencyCode = 'INR') {
  if (!amount) return '₹0';
  const num = parseFloat(amount);
  if (isNaN(num)) return `₹${amount}`;
  return `₹${Math.round(num).toLocaleString('en-IN')}`;
}

function getCleanCheckoutUrl(url?: string) {
  if (!url) return undefined;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('myshopify.com')) {
      parsed.hostname = 'www.avirenajewels.com';
    }
    return parsed.toString();
  } catch {
    return url.replace('m5yhxq-gb.myshopify.com', 'www.avirenajewels.com');
  }
}

export function CartSummary({cart, layout}: CartSummaryProps) {
  const isAside = layout === 'aside';
  const discountsHeadingId = useId();
  const discountCodeInputId = useId();
  const {close} = useAside();

  const checkoutUrl = getCleanCheckoutUrl(cart?.checkoutUrl);

  const subtotalFormatted = formatPriceAmount(
    cart?.cost?.subtotalAmount?.amount,
    cart?.cost?.subtotalAmount?.currencyCode || 'INR',
  );

  const totalFormatted = formatPriceAmount(
    cart?.cost?.totalAmount?.amount || cart?.cost?.subtotalAmount?.amount,
    cart?.cost?.totalAmount?.currencyCode || 'INR',
  );

  return (
    <div
      className={`border-t border-[#D8D2C2] bg-[#F2EFDB] p-5 sm:p-6 space-y-4 text-[#413C23] shrink-0 ${
        isAside ? 'mt-auto' : 'rounded-xs max-w-lg mx-auto shadow-xs'
      }`}
    >
      {/* Pricing Lines */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-baseline text-[#413C23]">
          <span className="text-xs uppercase tracking-widest font-semibold text-[#8F896D]">
            Subtotal
          </span>
          <span className="text-xl sm:text-2xl font-bold text-[#413C23] tracking-tight">
            {subtotalFormatted}
          </span>
        </div>

        <div className="flex justify-between text-xs text-[#8F896D]">
          <span>Shipping</span>
          <span className="font-medium text-[#413C23]">Free Delivery</span>
        </div>

        <p className="text-[11px] text-[#6B6650] pt-0.5">
          Use <strong className="font-mono text-[#413C23]">PREPAID50</strong> at checkout for another ₹50 off.
        </p>
      </div>

      {/* Discount Codes Section */}
      <CartDiscounts
        discountCodes={cart?.discountCodes}
        discountsHeadingId={discountsHeadingId}
        discountCodeInputId={discountCodeInputId}
      />

      {/* Checkout CTA Button */}
      {checkoutUrl ? (
        <a
          id="cart-drawer-checkout-btn"
          href={checkoutUrl}
          className="w-full py-4 bg-black hover:bg-neutral-800 text-white text-xs sm:text-sm uppercase tracking-[0.2em] font-semibold rounded-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98 text-center"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Proceed to Checkout • {totalFormatted}</span>
        </a>
      ) : (
        <button
          disabled
          className="w-full py-4 bg-black/50 text-white text-xs sm:text-sm uppercase tracking-[0.2em] font-semibold rounded-xs flex items-center justify-center gap-2 cursor-not-allowed"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Checkout unavailable</span>
        </button>
      )}

      {/* View Full Bag Details Link */}
      {isAside && (
        <Link
          to="/cart"
          onClick={close}
          className="w-full text-center text-xs uppercase tracking-widest font-semibold text-[#413C23] hover:text-[#8F896D] transition-colors py-1 cursor-pointer underline underline-offset-4 block"
        >
          View Full Bag Details →
        </Link>
      )}

      {/* Secure SSL Encrypted Checkout Reassurance */}
      <div className="flex items-center justify-center gap-2 text-[10px] text-[#8F896D] uppercase tracking-wider font-semibold pt-1">
        <ShieldCheck className="w-3.5 h-3.5 text-[#413C23]" />
        <span>Secure SSL Encrypted Checkout</span>
      </div>
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
    <div className="space-y-2 pt-0.5">
      {codes.length > 0 && (
        <div className="flex items-center justify-between p-2 bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs text-xs">
          <span className="font-mono text-[#14532D] font-bold uppercase flex items-center gap-1">
            <Tag className="w-3 h-3" />
            {codes.join(', ')} Applied
          </span>
          <UpdateDiscountForm discountCodes={[]}>
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
            className="flex-1 px-3 py-2 bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs text-xs text-[#413C23] placeholder-[#8F896D] focus:outline-none focus:border-[#413C23]"
          />
          <button
            type="submit"
            className="px-3.5 py-2 bg-[#413C23] text-[#FAF8F5] text-[11px] uppercase tracking-wider font-medium rounded-xs hover:bg-[#8F896D] transition-colors cursor-pointer"
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
