import {useOptimisticCart, CartForm, Image} from '@shopify/hydrogen';
import {useNavigate} from 'react-router';
import {ShoppingBag, Truck, X, Trash2, Minus, Plus} from 'lucide-react';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {CartLineItem, type CartLine} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';
import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import {PAIR_OFFERS, type PairOffer} from '~/data/offers';
import {PRODUCTS} from '~/data/products';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

export type BundlePiece = {
  id: string;
  title: string;
  metal: string;
  imageUrl?: string;
  imageData?: any;
};

export type DisplayCartGroup =
  | {
      type: 'bundle';
      bundleGroupId: string;
      bundleTitle: string;
      lines: CartLine[];
      pieces: BundlePiece[];
      quantity: number;
      combinedPrice: number;
      combinedOriginalPrice: number;
      savings: number;
    }
  | {
      type: 'single';
      line: CartLine;
    };

function resolveBundlePieces(lines: CartLine[], offer?: PairOffer): BundlePiece[] {
  if (lines.length >= 2) {
    return lines.map((m) => {
      const metal =
        m.merchandise.selectedOptions
          ?.filter((o) => o.value !== 'Default Title')
          ?.map((o) => o.value)
          ?.join(' • ') || 'Brass';
      return {
        id: m.id,
        title: m.merchandise.product.title,
        metal,
        imageUrl: m.merchandise.image?.url || '/logo.png',
        imageData: m.merchandise.image,
      };
    });
  }

  const singleLine = lines[0];
  const handle = singleLine?.merchandise?.product?.handle || '';
  const matchingOffer =
    offer ||
    PAIR_OFFERS.find(
      (o) =>
        o.shopifyHandle === handle ||
        o.id === handle ||
        o.handles.includes(handle) ||
        (singleLine?.merchandise?.product?.title || '').toLowerCase().includes(o.title.toLowerCase())
    );

  if (matchingOffer) {
    const p1 = PRODUCTS.find((p) => p.handle === matchingOffer.handles[0] || p.id === matchingOffer.handles[0]);
    const p2 = PRODUCTS.find((p) => p.handle === matchingOffer.handles[1] || p.id === matchingOffer.handles[1]);
    if (p1 && p2) {
      return [
        {
          id: `${singleLine.id}-p1`,
          title: p1.name,
          metal: p1.metal,
          imageUrl: p1.images?.[0] || '/logo.png',
        },
        {
          id: `${singleLine.id}-p2`,
          title: p2.name,
          metal: p2.metal,
          imageUrl: p2.images?.[0] || '/logo.png',
        },
      ];
    }
  }

  return [
    {
      id: singleLine.id,
      title: singleLine.merchandise.product.title,
      metal: 'Duo Set',
      imageUrl: singleLine.merchandise.image?.url || '/logo.png',
      imageData: singleLine.merchandise.image,
    },
  ];
}

function groupCartLinesForDisplay(lines: CartLine[]): DisplayCartGroup[] {
  const result: DisplayCartGroup[] = [];
  const processedBundleGroups = new Set<string>();
  const singleMerchandiseMap = new Map<string, {line: CartLine; index: number}>();

  for (const line of lines) {
    if ('parentRelationship' in line && line.parentRelationship?.parent) {
      continue;
    }

    const bundleAttr = line.attributes?.find((a) => a.key === '_bundleGroupId')?.value;
    const bundleTitleAttr = line.attributes?.find((a) => a.key === '_bundleTitle')?.value;
    const bundleSavingsStr = line.attributes?.find((a) => a.key === '_bundleSavings')?.value;

    const handle = line.merchandise?.product?.handle || '';
    const isExplicitBundleProduct = Boolean(
      PAIR_OFFERS.some((o) => o.shopifyHandle === handle || o.id === handle) ||
      (handle.endsWith('-duo') && !handle.includes('duo-curve'))
    );

    const isBundleProduct = Boolean(bundleAttr || isExplicitBundleProduct);

    if (isBundleProduct) {
      const groupId = bundleAttr || `bundle-${handle || line.id}`;
      if (processedBundleGroups.has(groupId)) continue;
      processedBundleGroups.add(groupId);

      const bundleMembers = bundleAttr
        ? lines.filter((l) =>
            l.attributes?.some((a) => a.key === '_bundleGroupId' && a.value === bundleAttr)
          )
        : [line];

      const qty = bundleMembers[0]?.quantity || 1;
      const combinedAmount = bundleMembers.reduce((sum, m) => {
        const lineTotal = parseFloat(m.cost?.totalAmount?.amount || '0');
        if (lineTotal > 0) return sum + lineTotal;
        const unit = parseFloat(m.merchandise?.price?.amount || '0');
        return sum + unit * (m.quantity || 1);
      }, 0);

      const matchingOffer = PAIR_OFFERS.find(
        (o) =>
          o.shopifyHandle === handle ||
          o.id === handle ||
          (bundleTitleAttr && o.title.toLowerCase() === bundleTitleAttr.toLowerCase())
      );

      const savings = bundleSavingsStr
        ? parseFloat(bundleSavingsStr)
        : (matchingOffer?.saving || 100);
      const combinedOriginalAmount = combinedAmount + savings * qty;
      const bundleTitle = bundleTitleAttr || matchingOffer?.title || line.merchandise?.product?.title || 'Duo Suite';
      const pieces = resolveBundlePieces(bundleMembers, matchingOffer);
      const compositeImage = matchingOffer?.shopifyHandle
        ? `/assets/bundles/${matchingOffer.shopifyHandle}.webp`
        : pieces[0]?.imageUrl;

      result.push({
        type: 'bundle',
        bundleGroupId: groupId,
        bundleTitle,
        lines: bundleMembers,
        pieces,
        compositeImage,
        quantity: qty,
        combinedPrice: combinedAmount,
        combinedOriginalPrice: combinedOriginalAmount,
        savings,
      });
    } else {
      // Single line item: Deduplicate optimistic temporary duplicates with existing lines
      const merchId = line.merchandise?.id;
      if (merchId && singleMerchandiseMap.has(merchId)) {
        const existingEntry = singleMerchandiseMap.get(merchId)!;
        // Merge quantity onto the existing card
        const mergedQty = (existingEntry.line.quantity || 1) + (line.quantity || 1);
        const mergedLine = {
          ...existingEntry.line,
          quantity: mergedQty,
        };
        result[existingEntry.index] = {
          type: 'single',
          line: mergedLine,
        };
      } else {
        const newIndex = result.length;
        if (merchId) {
          singleMerchandiseMap.set(merchId, {line, index: newIndex});
        }
        result.push({
          type: 'single',
          line,
        });
      }
    }
  }

  return result;
}

export function CartMain({layout, cart: originalCart}: CartMainProps) {
  const cart = useOptimisticCart(originalCart);
  const isAside = layout === 'aside';
  const lines = cart?.lines?.nodes ?? [];
  const linesCount = Boolean(lines.length || 0);
  const totalCount = cart?.totalQuantity || 0;
  const groupedItems = groupCartLinesForDisplay(lines);
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
            {groupedItems.map((group) => {
              if (group.type === 'bundle') {
                return (
                  <div
                    key={group.bundleGroupId}
                    className="flex gap-4 p-4 bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs transition-all hover:border-[#8F896D] shadow-2xs text-[#413C23]"
                  >
                    {/* Thumbnail: Duo Suite Composite Showcase */}
                    <div className="w-24 h-24 bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
                      <img
                        src={group.compositeImage || group.pieces[0]?.imageUrl || '/logo.png'}
                        alt={group.bundleTitle}
                        width={96}
                        height={96}
                        loading="lazy"
                        decoding="async"
                        className="max-w-full max-h-full w-auto h-auto object-contain mix-blend-multiply"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-serif-display text-base font-medium text-[#413C23] leading-snug line-clamp-2">
                            {group.bundleTitle}
                          </h4>
                          <BundleRemoveButton
                            lineIds={group.lines.map((l) => l.id)}
                            disabled={group.lines.some((l) => !!l.isOptimistic)}
                          />
                        </div>

                        <div className="text-[11px] text-[#8F896D] uppercase tracking-wider font-semibold mt-0.5">
                          Duo Suite • 2-Piece Set
                        </div>
                      </div>

                      {/* Quantity & Price Row */}
                      <div className="flex items-center justify-between pt-2">
                        <BundleQuantityControls
                          lines={group.lines}
                          quantity={group.quantity}
                        />

                        <div className="flex items-baseline gap-1.5 text-right">
                          {group.combinedOriginalPrice > group.combinedPrice && (
                            <span className="text-xs text-[#991B1B] line-through font-normal">
                              ₹{Math.round(group.combinedOriginalPrice).toLocaleString('en-IN')}
                            </span>
                          )}
                          <span className="text-base sm:text-lg font-bold text-[#413C23] tracking-tight">
                            ₹{Math.round(group.combinedPrice).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <CartLineItem
                  key={group.line.id}
                  line={group.line}
                  layout={layout}
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

function BundleRemoveButton({
  lineIds,
  disabled,
}: {
  lineIds: string[];
  disabled: boolean;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button
        disabled={disabled}
        type="submit"
        className="text-[#8F896D] hover:text-[#7A0F1A] transition-colors p-1 cursor-pointer disabled:opacity-30 shrink-0"
        title="Remove entire duo suite"
        aria-label="Remove entire duo suite"
      >
        <Trash2 className="w-4 h-4 stroke-[1.5]" />
      </button>
    </CartForm>
  );
}

function BundleQuantityControls({
  lines,
  quantity,
}: {
  lines: CartLine[];
  quantity: number;
}) {
  const isOptimistic = lines.some((l) => !!l.isOptimistic);
  const prevQuantity = Math.max(1, quantity - 1);
  const nextQuantity = quantity + 1;

  const decreaseUpdates: CartLineUpdateInput[] = lines.map((l) => ({
    id: l.id,
    quantity: prevQuantity,
  }));

  const increaseUpdates: CartLineUpdateInput[] = lines.map((l) => ({
    id: l.id,
    quantity: nextQuantity,
  }));

  return (
    <div className="flex items-center border border-[#D8D2C2] rounded-xs bg-[#FAF8F5]">
      <CartForm
        route="/cart"
        action={CartForm.ACTIONS.LinesUpdate}
        inputs={{lines: decreaseUpdates}}
      >
        <button
          aria-label="Decrease bundle quantity"
          disabled={quantity <= 1 || isOptimistic}
          type="submit"
          className="w-7 h-7 flex items-center justify-center text-[#413C23] hover:bg-[#E7E4D5] transition-colors cursor-pointer disabled:opacity-30"
        >
          <Minus className="w-3 h-3 stroke-[2]" />
        </button>
      </CartForm>
      <span className="px-2.5 text-xs font-bold text-[#413C23] min-w-[22px] text-center font-mono">
        {quantity}
      </span>
      <CartForm
        route="/cart"
        action={CartForm.ACTIONS.LinesUpdate}
        inputs={{lines: increaseUpdates}}
      >
        <button
          aria-label="Increase bundle quantity"
          disabled={isOptimistic}
          type="submit"
          className="w-7 h-7 flex items-center justify-center text-[#413C23] hover:bg-[#E7E4D5] transition-colors cursor-pointer disabled:opacity-30"
        >
          <Plus className="w-3 h-3 stroke-[2]" />
        </button>
      </CartForm>
    </div>
  );
}
