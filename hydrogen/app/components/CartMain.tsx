import {useOptimisticCart} from '@shopify/hydrogen';
import {Link} from 'react-router';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {CartLineItem, type CartLine} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

export type LineItemChildrenMap = {[parentId: string]: CartLine[]};

function getLineItemChildrenMap(lines: CartLine[]): LineItemChildrenMap {
  const children: LineItemChildrenMap = {};
  for (const line of lines) {
    if ('parentRelationship' in line && line.parentRelationship?.parent) {
      const parentId = line.parentRelationship.parent.id;
      if (!children[parentId]) children[parentId] = [];
      children[parentId].push(line);
    }
    if ('lineComponents' in line) {
      const lineChildren = getLineItemChildrenMap(line.lineComponents);
      for (const [parentId, childIds] of Object.entries(lineChildren)) {
        if (!children[parentId]) children[parentId] = [];
        children[parentId].push(...childIds);
      }
    }
  }
  return children;
}

export function CartMain({layout, cart: originalCart}: CartMainProps) {
  const cart = useOptimisticCart(originalCart);
  const isAside = layout === 'aside';
  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;
  const childrenMap = getLineItemChildrenMap(cart?.lines?.nodes ?? []);

  return (
    <section
      className={`font-sans text-[#413C23] flex flex-col ${
        isAside
          ? 'h-full min-h-[calc(100vh-80px)] justify-between'
          : 'max-w-4xl mx-auto py-10 px-4 sm:px-6'
      }`}
      aria-label={layout === 'page' ? 'Cart page' : 'Cart drawer'}
    >
      <CartEmpty hidden={linesCount} layout={layout} />

      {linesCount ? (
        <div className={`flex flex-col ${isAside ? 'flex-1 justify-between' : 'space-y-8'}`}>
          <div className="flex-1 overflow-y-auto px-1 py-2">
            <ul aria-label="Cart line items" className="space-y-2 p-0 m-0">
              {(cart?.lines?.nodes ?? []).map((line) => {
                if (
                  'parentRelationship' in line &&
                  line.parentRelationship?.parent
                ) {
                  return null;
                }
                return (
                  <CartLineItem
                    key={line.id}
                    line={line}
                    layout={layout}
                    childrenMap={childrenMap}
                  />
                );
              })}
            </ul>
          </div>

          {cartHasItems && <CartSummary cart={cart} layout={layout} />}
        </div>
      ) : null}
    </section>
  );
}

function CartEmpty({
  hidden = false,
  layout,
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  const {close} = useAside();
  return (
    <div hidden={hidden} className="py-16 text-center space-y-4">
      <div className="w-16 h-16 bg-[#E7E4D5] border border-[#D8D2C2] rounded-full mx-auto flex items-center justify-center text-[#413C23]">
        <svg
          className="w-8 h-8"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      </div>
      <div className="space-y-1">
        <h3 className="font-serif text-2xl sm:text-3xl text-[#413C23] font-normal">
          Your Bag is Empty
        </h3>
        <p className="text-xs text-[#8F896D]">
          Discover our dailywear jewels crafted in premium brass.
        </p>
      </div>
      <div className="pt-2">
        <Link
          to="/shop"
          onClick={() => {
            if (layout === 'aside') {
              close();
            }
          }}
          className="inline-block px-6 py-3 bg-[#413C23] text-[#FAF8F5] hover:bg-[#8F896D] text-xs uppercase tracking-[0.2em] font-semibold rounded-xs transition-colors shadow-xs"
        >
          Explore Collection
        </Link>
      </div>
    </div>
  );
}
