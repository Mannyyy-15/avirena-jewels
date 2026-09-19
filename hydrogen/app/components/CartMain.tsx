import {useOptimisticCart} from '@shopify/hydrogen';
import {Link, useNavigate} from 'react-router';
import {ShoppingBag, Truck, X} from 'lucide-react';
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
  const totalCount = cart?.totalQuantity || 0;
  const childrenMap = getLineItemChildrenMap(cart?.lines?.nodes ?? []);
  const {close} = useAside();
  const navigate = useNavigate();

  return (
    <div
      className={`font-sans-body text-[#413C23] flex flex-col ${
        isAside
          ? 'h-full min-h-0 justify-between bg-[#FAF8F5]'
          : 'max-w-4xl mx-auto py-8 px-4 sm:px-6'
      }`}
      aria-label={layout === 'page' ? 'Shopping Cart page' : 'Shopping Bag drawer'}
    >
      {/* 1. TOP HEADER (Drawer Only) */}
      {isAside && (
        <div className="p-5 sm:p-6 border-b border-[#D8D2C2] bg-[#F2EFDB] space-y-3 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2.5">
              <h2 className="font-serif-display text-2xl sm:text-3xl font-medium text-[#413C23] tracking-tight">
                Shopping Bag
              </h2>
              <span className="text-xs uppercase tracking-widest text-[#8F896D] font-bold">
                ({totalCount} {totalCount === 1 ? 'item' : 'items'})
              </span>
            </div>
            <button
              id="close-cart-drawer-btn"
              onClick={close}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-[#FAF8F5] border border-[#D8D2C2] text-[#413C23] hover:bg-[#E7E4D5] transition-colors cursor-pointer"
              aria-label="Close cart drawer"
            >
              <X className="w-4 h-4 stroke-[1.5]" />
            </button>
          </div>

          {/* Free Delivery Badge */}
          <div className="pt-1 flex items-center gap-1.5 text-xs text-[#413C23] font-semibold">
            <Truck className="w-3.5 h-3.5 stroke-[2]" />
            <span>Free Delivery on All Orders</span>
          </div>
        </div>
      )}

      {/* 2. CART ITEM LIST */}
      <div className={`flex-1 overflow-y-auto ${isAside ? 'p-5 sm:p-6 space-y-4' : 'space-y-6'}`}>
        {!linesCount ? (
          <div className="py-16 sm:py-20 text-center space-y-5">
            <div className="w-16 h-16 bg-[#F2EFDB] border border-[#D8D2C2] rounded-full mx-auto flex items-center justify-center text-[#413C23]">
              <ShoppingBag className="w-8 h-8 stroke-[1.4]" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif-display text-2xl sm:text-3xl text-[#413C23] font-medium">
                Your Bag is Empty
              </h3>
              <p className="text-xs sm:text-sm text-[#8F896D]">
                Discover our dailywear jewels in premium brass.
              </p>
            </div>
            <button
              id="empty-cart-explore-btn"
              onClick={() => {
                if (isAside) close();
                navigate('/shop');
              }}
              className="px-6 py-3 bg-[#413C23] text-[#FAF8F5] hover:bg-[#8F896D] text-xs uppercase tracking-[0.2em] font-semibold rounded-xs transition-colors shadow-sm cursor-pointer"
            >
              Explore Collection
            </button>
          </div>
        ) : (
          <div className="space-y-3">
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
          </div>
        )}
      </div>

      {/* 3. FOOTER CHECKOUT SUMMARY */}
      {linesCount && <CartSummary cart={cart} layout={layout} />}
    </div>
  );
}
