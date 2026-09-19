import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import type {CartLayout, LineItemChildrenMap} from '~/components/CartMain';
import {CartForm, Image, Money, type OptimisticCartLine} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link} from 'react-router';
import {useAside} from './Aside';
import type {CartApiQueryFragment} from 'storefrontapi.generated';

export type CartLine = OptimisticCartLine<CartApiQueryFragment>;

export function CartLineItem({
  layout,
  line,
  childrenMap,
}: {
  layout: CartLayout;
  line: CartLine;
  childrenMap: LineItemChildrenMap;
}) {
  const {id, merchandise, quantity} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();
  const lineItemChildren = childrenMap[id];
  const childrenLabelId = `cart-line-children-${id}`;

  return (
    <li key={id} className="p-3.5 sm:p-4 bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs mb-3 shadow-2xs list-none">
      <div className="flex gap-3.5 items-start">
        {image && (
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs overflow-hidden shrink-0">
            <Image
              alt={title}
              aspectRatio="1/1"
              data={image}
              height={120}
              loading="lazy"
              width={120}
              className="w-full h-full object-cover mix-blend-multiply"
            />
          </div>
        )}

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <Link
              prefetch="intent"
              to={lineItemUrl}
              onClick={() => {
                if (layout === 'aside') {
                  close();
                }
              }}
              className="font-serif text-sm sm:text-base text-[#413C23] hover:text-[#8F896D] transition-colors leading-snug truncate block font-normal"
            >
              {product.title}
            </Link>
            <CartLineRemoveButton lineIds={[id]} disabled={!!line.isOptimistic} />
          </div>

          <div className="flex flex-wrap gap-1 text-[10px] text-[#8F896D] uppercase tracking-wider">
            {selectedOptions
              .filter((opt) => opt.value !== 'Default Title')
              .map((option) => (
                <span key={option.name} className="px-1.5 py-0.5 bg-[#E7E4D5] rounded-xs">
                  {option.value}
                </span>
              ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <CartLineQuantity line={line} />
            <div className="font-sans font-semibold text-sm sm:text-base text-[#413C23]">
              {line?.cost?.totalAmount ? (
                <Money data={line.cost.totalAmount} />
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {lineItemChildren ? (
        <div className="pt-2 pl-4 border-l-2 border-[#D8D2C2] mt-2">
          <p id={childrenLabelId} className="sr-only">
            Line items with {product.title}
          </p>
          <ul aria-labelledby={childrenLabelId} className="space-y-2">
            {lineItemChildren.map((childLine) => (
              <CartLineItem
                childrenMap={childrenMap}
                key={childLine.id}
                line={childLine}
                layout={layout}
              />
            ))}
          </ul>
        </div>
      ) : null}
    </li>
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
          <span className="text-sm">−</span>
        </button>
      </CartLineUpdateButton>
      <span className="px-2.5 text-xs font-semibold text-[#413C23] min-w-[20px] text-center font-mono">
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
          <span className="text-sm">+</span>
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
        className="text-[#8F896D] hover:text-[#DC2626] transition-colors p-1 cursor-pointer disabled:opacity-30"
        aria-label="Remove item"
        title="Remove item"
      >
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
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
