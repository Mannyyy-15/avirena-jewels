import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, ShopifyCart } from '../types';
import { PRODUCTS as FALLBACK_PRODUCTS } from '../data/products';
import {
  isShopifyConfigured,
  shopifyFetch,
  GET_PRODUCTS_QUERY,
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  GET_CART_QUERY,
  transformShopifyProduct,
  transformShopifyCart,
} from '../lib/shopify';

interface ShopifyContextType {
  isConfigured: boolean;
  products: Product[];
  isLoadingProducts: boolean;
  shopifyCart: ShopifyCart | null;
  isLoadingCart: boolean;
  addToShopifyCart: (variantId: string, quantity: number) => Promise<boolean>;
  updateShopifyCartLine: (lineId: string, quantity: number) => Promise<boolean>;
  removeFromShopifyCart: (lineId: string) => Promise<boolean>;
  redirectToShopifyCheckout: () => void;
  syncLocalCartToShopify: (localCart: CartItem[]) => Promise<string | null>;
}

const ShopifyContext = createContext<ShopifyContextType | undefined>(undefined);

const SHOPIFY_CART_ID_STORAGE_KEY = 'avirena_shopify_cart_id';

export const ShopifyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const isConfigured = isShopifyConfigured();
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(false);
  const [shopifyCart, setShopifyCart] = useState<ShopifyCart | null>(null);
  const [isLoadingCart, setIsLoadingCart] = useState<boolean>(false);

  // 1. Fetch live Shopify products if configured
  useEffect(() => {
    if (!isConfigured) {
      setProducts(FALLBACK_PRODUCTS);
      return;
    }

    const loadProducts = async () => {
      setIsLoadingProducts(true);
      try {
        const res = await shopifyFetch<any>({
          query: GET_PRODUCTS_QUERY,
          variables: { first: 50 },
        });

        const fetchedEdges = res.data?.products?.edges || [];
        if (fetchedEdges.length > 0) {
          const transformed = fetchedEdges.map((e: any) => transformShopifyProduct(e.node));
          setProducts(transformed);
        } else {
          setProducts(FALLBACK_PRODUCTS);
        }
      } catch (err) {
        console.warn('Could not fetch from Shopify Storefront API, using fallback catalog:', err);
        setProducts(FALLBACK_PRODUCTS);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    loadProducts();
  }, [isConfigured]);

  // 2. Load or Restore Existing Shopify Cart
  useEffect(() => {
    if (!isConfigured) return;

    const savedCartId = localStorage.getItem(SHOPIFY_CART_ID_STORAGE_KEY);
    if (!savedCartId) return;

    const loadCart = async () => {
      setIsLoadingCart(true);
      try {
        const res = await shopifyFetch<any>({
          query: GET_CART_QUERY,
          variables: { cartId: savedCartId },
        });
        if (res.data?.cart) {
          setShopifyCart(transformShopifyCart(res.data.cart));
        } else {
          localStorage.removeItem(SHOPIFY_CART_ID_STORAGE_KEY);
        }
      } catch (err) {
        console.warn('Failed to restore Shopify cart:', err);
      } finally {
        setIsLoadingCart(false);
      }
    };

    loadCart();
  }, [isConfigured]);

  // 3. Add Line Item to Shopify Cart
  const addToShopifyCart = async (variantId: string, quantity: number): Promise<boolean> => {
    if (!isConfigured) return false;
    setIsLoadingCart(true);

    try {
      let currentCartId = shopifyCart?.id || localStorage.getItem(SHOPIFY_CART_ID_STORAGE_KEY);

      if (!currentCartId) {
        // Create new Cart
        const res = await shopifyFetch<any>({
          query: CART_CREATE_MUTATION,
          variables: {
            input: {
              lines: [{ merchandiseId: variantId, quantity }],
            },
          },
        });

        const newCart = res.data?.cartCreate?.cart;
        if (newCart) {
          const parsed = transformShopifyCart(newCart);
          setShopifyCart(parsed);
          if (parsed?.id) {
            localStorage.setItem(SHOPIFY_CART_ID_STORAGE_KEY, parsed.id);
          }
          return true;
        }
      } else {
        // Add to existing Cart
        const res = await shopifyFetch<any>({
          query: CART_LINES_ADD_MUTATION,
          variables: {
            cartId: currentCartId,
            lines: [{ merchandiseId: variantId, quantity }],
          },
        });

        const updated = res.data?.cartLinesAdd?.cart;
        if (updated) {
          setShopifyCart(transformShopifyCart(updated));
          return true;
        }
      }
      return false;
    } catch (err) {
      console.error('Error adding to Shopify cart:', err);
      return false;
    } finally {
      setIsLoadingCart(false);
    }
  };

  // 4. Update Line Item Quantity
  const updateShopifyCartLine = async (lineId: string, quantity: number): Promise<boolean> => {
    if (!isConfigured || !shopifyCart?.id) return false;
    setIsLoadingCart(true);

    try {
      const res = await shopifyFetch<any>({
        query: CART_LINES_UPDATE_MUTATION,
        variables: {
          cartId: shopifyCart.id,
          lines: [{ id: lineId, quantity }],
        },
      });

      const updated = res.data?.cartLinesUpdate?.cart;
      if (updated) {
        setShopifyCart(transformShopifyCart(updated));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error updating Shopify cart line:', err);
      return false;
    } finally {
      setIsLoadingCart(false);
    }
  };

  // 5. Remove Line Item
  const removeFromShopifyCart = async (lineId: string): Promise<boolean> => {
    if (!isConfigured || !shopifyCart?.id) return false;
    setIsLoadingCart(true);

    try {
      const res = await shopifyFetch<any>({
        query: CART_LINES_REMOVE_MUTATION,
        variables: {
          cartId: shopifyCart.id,
          lineIds: [lineId],
        },
      });

      const updated = res.data?.cartLinesRemove?.cart;
      if (updated) {
        setShopifyCart(transformShopifyCart(updated));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error removing from Shopify cart:', err);
      return false;
    } finally {
      setIsLoadingCart(false);
    }
  };

  // 6. Redirect to live Shopify Checkout
  const redirectToShopifyCheckout = () => {
    if (shopifyCart?.checkoutUrl) {
      window.location.href = shopifyCart.checkoutUrl;
    }
  };

  // 7. Sync whole local cart to a live Shopify Checkout session
  const syncLocalCartToShopify = async (localCart: CartItem[]): Promise<string | null> => {
    if (!isConfigured) return null;
    setIsLoadingCart(true);

    try {
      const lines = localCart
        .map((item) => {
          const variantId =
            item.variantId ||
            (item.product.variants && item.product.variants.length > 0
              ? item.product.variants[0].id
              : null);
          return variantId ? { merchandiseId: variantId, quantity: item.quantity } : null;
        })
        .filter(Boolean);

      if (lines.length === 0) return null;

      const res = await shopifyFetch<any>({
        query: CART_CREATE_MUTATION,
        variables: {
          input: { lines },
        },
      });

      const cartData = res.data?.cartCreate?.cart;
      if (cartData?.checkoutUrl) {
        const parsed = transformShopifyCart(cartData);
        setShopifyCart(parsed);
        if (parsed?.id) {
          localStorage.setItem(SHOPIFY_CART_ID_STORAGE_KEY, parsed.id);
        }
        return cartData.checkoutUrl;
      }
      return null;
    } catch (err) {
      console.error('Error synchronizing cart with Shopify:', err);
      return null;
    } finally {
      setIsLoadingCart(false);
    }
  };

  return (
    <ShopifyContext.Provider
      value={{
        isConfigured,
        products,
        isLoadingProducts,
        shopifyCart,
        isLoadingCart,
        addToShopifyCart,
        updateShopifyCartLine,
        removeFromShopifyCart,
        redirectToShopifyCheckout,
        syncLocalCartToShopify,
      }}
    >
      {children}
    </ShopifyContext.Provider>
  );
};

export const useShopify = (): ShopifyContextType => {
  const context = useContext(ShopifyContext);
  if (!context) {
    throw new Error('useShopify must be used within a ShopifyProvider');
  }
  return context;
};
