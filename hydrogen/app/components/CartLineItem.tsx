import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import type {CartLayout, LineItemChildrenMap} from '~/components/CartMain';
import {CartForm, Image, type OptimisticCartLine} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link} from 'react-router';
import {Trash2, Minus, Plus} from 'lucide-react';
import {useAside} from './Aside';
import type {CartApiQueryFragment} from 'storefrontapi.generated';

export type CartLine = OptimisticCartLine<CartApiQueryFragment>;

function formatPriceAmount(amount?: string, currencyCode = 'INR') {
  if (!amount) return '₹0';
  const num = parseFloat(amount);
  if (isNaN(num)) return `₹${amount}`;
  return `₹${Math.round(num).toLocaleString('en-IN')}`;
}

export function CartLineItem({
  layout,
  line,
  childrenMap,
}: {
  layout: CartLayout;
  line: CartLine;
  childrenMap?: LineItemChildrenMap;
}) {
  const {id, merchandise, quantity} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();

  const optionsDisplay = selectedOptions
    .filter((opt) => opt.value !== 'Default Title')
    .map((opt) => opt.value)
    .join(' • ');

  const unitPrice = parseFloat(line?.merchandise?.price?.amount || '0');
  const amountStr =
    line?.cost?.totalAmount?.amount ||
    (unitPrice > 0 ? String(unitPrice * (line.quantity || 1)) : undefined);

  const priceFormatted = formatPriceAmount(
    amountStr,
    line?.cost?.totalAmount?.currencyCode || line?.merchandise?.price?.currencyCode || 'INR',
  );

  return (
    <div
      key={id}
      className="flex gap-4 p-4 bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs transition-all hover:border-[#8F896D] shadow-2xs text-[#413C23]"
    >
      {/* Thumbnail */}
      <div className="w-24 h-24 bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
        {image ? (
          <Image
            alt={title || product.title}
            aspectRatio="1/1"
            data={image}
            height={96}
            loading="lazy"
            width={96}
            className="max-w-full max-h-full w-auto h-auto object-contain mix-blend-multiply"
          />
        ) : (
          <img
            src="/logo.png"
            alt={product.title}
            className="max-w-full max-h-full w-auto h-auto object-contain mix-blend-multiply"
          />
        )}
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start justify-between gap-2">
            <Link
              prefetch="intent"
              to={lineItemUrl}
              onClick={() => {
                if (layout === 'aside') {
                  close();
                }
              }}
              className="font-serif-display text-base font-medium text-[#413C23] hover:text-[#8F896D] transition-colors leading-snug line-clamp-2"
            >
              {product.title}
            </Link>
            <CartLineRemoveButton lineIds={[id]} disabled={!!line.isOptimistic} />
          </div>

          {optionsDisplay && (
            <div className="text-[11px] text-[#8F896D] uppercase tracking-wider font-semibold mt-0.5">
              {optionsDisplay}
            </div>
          )}
        </div>

        {/* Quantity and Price row */}
        <div className="flex items-center justify-between pt-2">
          <CartLineQuantity line={line} />

          <span className="text-base sm:text-lg font-bold text-[#413C23] tracking-tight">
            {priceFormatted}
          </span>
        </div>
      </div>
    </div>
  );
}

function CartLineQuantity({line}: {line: CartLine}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="flex items-center border border-[#D8D2C2] rounded-xs bg-[#FAF8F5]">
      <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
        <button
          aria-label="Decrease quantity"
          disabled={quantity <= 1 || !!isOptimistic}
          name="decrease-quantity"
          value={prevQuantity}
          className="w-7 h-7 flex items-center justify-center text-[#413C23] hover:bg-[#E7E4D5] transition-colors cursor-pointer disabled:opacity-30"
        >
          <Minus className="w-3 h-3 stroke-[2]" />
        </button>
      </CartLineUpdateButton>
      <span className="px-2.5 text-xs font-bold text-[#413C23] min-w-[22px] text-center font-mono">
        {quantity}
      </span>
      <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
        <button
          aria-label="Increase quantity"
          name="increase-quantity"
          value={nextQuantity}
          disabled={!!isOptimistic}
          className="w-7 h-7 flex items-center justify-center text-[#413C23] hover:bg-[#E7E4D5] transition-colors cursor-pointer disabled:opacity-30"
        >
          <Plus className="w-3 h-3 stroke-[2]" />
        </button>
      </CartLineUpdateButton>
    </div>
  );
}

function CartLineRemoveButton({
  lineIds,
  disabled,
}: {
  lineIds: string[];
  disabled: boolean;
}) {
  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button
        disabled={disabled}
        type="submit"
        className="text-[#8F896D] hover:text-[#7A0F1A] transition-colors p-1 cursor-pointer disabled:opacity-30 shrink-0"
        aria-label="Remove item"
        title="Remove item"
      >
        <Trash2 className="w-4 h-4 stroke-[1.5]" />
      </button>
    </CartForm>
  );
}

function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  const lineIds = lines.map((line) => line.id);

  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}

function getUpdateKey(lineIds: string[]) {
  return [CartForm.ACTIONS.LinesUpdate, ...lineIds].join('-');
}
