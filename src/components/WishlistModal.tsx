import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Product, Currency } from '../types';
import { formatPrice } from '../data/products';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Product[];
  onRemoveFromWishlist: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  currency: Currency;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  wishlist,
  onRemoveFromWishlist,
  onSelectProduct,
  onAddToCart,
  currency,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans-body">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="min-h-screen px-4 text-center flex items-center justify-center py-12">
        <div className="inline-block w-full max-w-2xl bg-[#FAF8F5] border border-[#E6DFD3] rounded-xs p-6 sm:p-8 text-left align-middle shadow-2xl transform transition-all animate-in zoom-in-95 duration-200 z-10">
          <div className="flex items-center justify-between pb-4 border-b border-[#E6DFD3]">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 fill-[#C5A059] text-[#C5A059]" />
              <h3 className="font-serif-display text-2xl text-[#2C2C2A]">Saved Pieces</h3>
              <span className="text-xs text-[#9A9886] uppercase tracking-widest font-semibold">
                ({wishlist.length})
              </span>
            </div>
            <button
              id="close-wishlist-modal-btn"
              onClick={onClose}
              className="p-1.5 text-[#7D7973] hover:text-[#2C2C2A] transition-colors"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>

          <div className="mt-6 max-h-[60vh] overflow-y-auto pr-1">
            {wishlist.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <Heart className="w-10 h-10 text-[#9A9886]/40 mx-auto stroke-[1.2]" />
                <p className="text-sm text-[#7D7973]">
                  You haven't saved any pieces to your wishlist yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4 divide-y divide-[#E6DFD3]">
                {wishlist.map((p) => (
                  <div key={p.id} className="pt-4 first:pt-0 flex items-center justify-between gap-4">
                    <div
                      className="flex items-center gap-4 cursor-pointer group flex-1"
                      onClick={() => {
                        onSelectProduct(p);
                        onClose();
                      }}
                    >
                      <div className="w-16 h-16 bg-[#FAF8F5] border border-[#E6DFD3] rounded-xs overflow-hidden p-1.5 shrink-0">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div>
                        <h4 className="font-serif-display text-base text-[#2C2C2A] group-hover:text-[#C5A059] transition-colors">
                          {p.name}
                        </h4>
                        <span className="text-xs text-[#7D7973] block">{p.subtitle}</span>
                        <span className="text-xs font-semibold text-[#2C2C2A] mt-1 block">
                          {formatPrice(p.price, currency)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        id={`wishlist-add-to-bag-${p.id}`}
                        onClick={() => onAddToCart(p)}
                        className="px-3.5 py-2 bg-[#9A9886] hover:bg-[#858372] text-white text-xs uppercase tracking-wider font-medium rounded-xs flex items-center gap-1.5 transition-colors"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Bag</span>
                      </button>
                      <button
                        id={`wishlist-remove-${p.id}`}
                        onClick={() => onRemoveFromWishlist(p)}
                        className="p-2 text-[#7D7973]/70 hover:text-[#C5A059] transition-colors"
                        title="Remove from saved"
                      >
                        <Trash2 className="w-4 h-4 stroke-[1.5]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

