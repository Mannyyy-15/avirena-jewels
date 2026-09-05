import React, { useState, useEffect, lazy, Suspense } from 'react';
import { PageView, Product, CartItem, Currency, Category } from './types';
import { GUIDES } from './data/guides';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { InstagramFeedSection } from './components/InstagramFeedSection';
import { CartDrawer } from './components/CartDrawer';

import { ToastContainer, ToastMessage } from './components/Toast';

import { StoryModal, CareModal } from './components/StoryAndCareModals';
import { HomePage } from './pages/HomePage';

import { SeoMeta } from './components/SeoMeta';
import { ShopifyProvider, useShopify } from './context/ShopifyContext';
import { initSmoothScroll, scrollToTop } from './lib/smoothScroll';

/*
 * Route-level code splitting. The app shipped as one 747KB bundle across 16
 * routes; every visitor paid for the checkout flow and every page they never
 * opened. HomePage stays statically imported because it is the landing route.
 *
 * Safe with the prerender flow: src/main.tsx uses createRoot (client render),
 * not hydrateRoot, so React replaces the prerendered skeleton wholesale and a
 * suspended chunk cannot cause a hydration mismatch.
 */
const CollectionPage = lazy(() =>
  import('./pages/CollectionPage').then((m) => ({ default: m.CollectionPage }))
);
const CollectionsHubPage = lazy(() =>
  import('./pages/CollectionsHubPage').then((m) => ({ default: m.CollectionsHubPage }))
);
const ProductDetailPage = lazy(() =>
  import('./pages/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage }))
);
const CartPage = lazy(() =>
  import('./pages/CartPage').then((m) => ({ default: m.CartPage }))
);
const CheckoutPage = lazy(() =>
  import('./pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage }))
);
const AboutPage = lazy(() =>
  import('./pages/AboutPage').then((m) => ({ default: m.AboutPage }))
);
const ContactPage = lazy(() =>
  import('./pages/ContactPage').then((m) => ({ default: m.ContactPage }))
);
const JournalPage = lazy(() =>
  import('./pages/JournalPage').then((m) => ({ default: m.JournalPage }))
);
const FaqPage = lazy(() =>
  import('./pages/FaqPage').then((m) => ({ default: m.FaqPage }))
);
const PoliciesPage = lazy(() =>
  import('./pages/PoliciesPage').then((m) => ({ default: m.PoliciesPage }))
);
const GuidesPage = lazy(() =>
  import('./pages/GuidesPage').then((m) => ({ default: m.GuidesPage }))
);
const QuickViewModal = lazy(() =>
  import('./components/QuickViewModal').then((m) => ({ default: m.QuickViewModal }))
);
const WishlistModal = lazy(() =>
  import('./components/WishlistModal').then((m) => ({ default: m.WishlistModal }))
);
const SearchModal = lazy(() =>
  import('./components/SearchModal').then((m) => ({ default: m.SearchModal }))
);

/**
 * Category slugs that map to real, prerendered /shop/:category routes.
 * Kept in sync with scripts/prerender.ts `categories` and the Category union in ./types.
 * 'all' is intentionally excluded: it is represented by bare /shop, not /shop/all.
 */
const CATEGORY_SLUGS = ['rings', 'necklaces', 'earrings', 'bracelets', 'sets', 'brooches'] as const;

const isCategorySlug = (value: string): value is Exclude<Category, 'all'> =>
  (CATEGORY_SLUGS as readonly string[]).includes(value);

/**
 * Resolve a URL segment to a product. Live URLs use the Shopify handle
 * (src/lib/shopify.ts sets `id: node.handle || node.id` and also keeps `handle`),
 * but local/mock products are keyed by `id`. Match on both, in both catalogs.
 */
const findProductBySlug = (catalog: Product[], slug: string): Product | undefined =>
  catalog.find((p) => p.handle === slug || p.id === slug || p.shopifyId === slug);

/**
 * Guide slugs that map to real, prerendered /guides/:slug routes.
 * Sourced from src/data/guides.ts, the same module scripts/prerender.ts reads,
 * so a guide can never exist on one side of the build and not the other.
 */
const isGuideSlug = (value: string): boolean => GUIDES.some((g) => g.slug === value);

/** The canonical URL path for a given page/state. Mirrors scripts/prerender.ts route paths. */
const buildPath = (
  page: PageView,
  product: Product | undefined,
  category: Category,
  guideSlug: string | null
): string => {
  switch (page) {
    case 'home':
      return '/';
    case 'collection':
    case 'shop':
      return category && category !== 'all' ? `/shop/${category}` : '/shop';
    case 'collections':
      return '/collections';
    case 'pdp':
      return product ? `/product/${product.handle || product.id}` : '/shop';
    case 'about':
      return '/about';
    case 'contact':
      return '/contact';
    case 'journal':
      return '/journal';
    case 'faq':
      return '/faq';
    case 'policies':
      return '/policies';
    case 'guides':
      return guideSlug ? `/guides/${guideSlug}` : '/guides';
    case 'cart':
      return '/cart';
    case 'checkout':
      return '/checkout';
    default:
      return '/';
  }
};

/** Document titles, kept consistent with the titles scripts/prerender.ts writes per route. */
const CATEGORY_TITLES: Record<Exclude<Category, 'all'>, string> = {
  earrings: 'Anti-Tarnish Earrings Online India | AVIRENA',
  necklaces: 'Anti-Tarnish Necklaces Online India | AVIRENA',
  rings: 'Anti-Tarnish Rings Online India | AVIRENA',
  bracelets: 'Anti-Tarnish Bracelets Online India | AVIRENA',
  brooches: 'Anti-Tarnish Brooches Online India | AVIRENA',
  sets: 'Anti-Tarnish Jewellery Sets Online India | AVIRENA',
};

const buildTitle = (
  page: PageView,
  product: Product | undefined,
  category: Category,
  guideSlug: string | null
): string => {
  switch (page) {
    case 'home':
      return 'AVIRENA | Anti-Tarnish Brass Jewellery for Daily Wear';
    case 'collection':
    case 'shop':
      return category && category !== 'all'
        ? CATEGORY_TITLES[category]
        : 'Anti-Tarnish Jewellery Online India | AVIRENA';
    case 'collections':
      return 'Signature Jewelry Design Suites | AVIRENA';
    case 'pdp':
      return product ? `${product.name} | AVIRENA Dailywear Jewelry` : 'AVIRENA';
    case 'about':
      return 'About Avirena | Homegrown Dailywear Craftsmanship';
    case 'contact':
      return 'Contact Concierge & Support | AVIRENA';
    case 'journal':
      return 'Journal & Styling Lookbook | AVIRENA';
    case 'faq':
      return 'FAQs, Sizing Guide & Jewelry Care | AVIRENA';
    case 'policies':
      return 'Policies, Shipping & Returns | AVIRENA';
    case 'guides': {
      const guide = guideSlug ? GUIDES.find((g) => g.slug === guideSlug) : undefined;
      return guide ? guide.metaTitle : 'Jewelry Guides: Materials, Care & Fit | AVIRENA';
    }
    case 'cart':
      return 'Your Shopping Bag | AVIRENA';
    case 'checkout':
      return 'Secure Checkout | AVIRENA';
    default:
      return 'AVIRENA | Anti-Tarnish Brass Jewellery for Daily Wear';
  }
};

/**
 * Route chunk fallback. Painted in the brand palette rather than left blank so a
 * slow chunk fetch shows the site's own surface, not a white flash. Sized to the
 * viewport so swapping it for the real page does not shift layout.
 */
function RouteFallback() {
  return (
    <div
      className="w-full min-h-[70vh] bg-[#E7E4D5]"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading…</span>
    </div>
  );
}

function AppContent() {
  const { products: storeProducts, isConfigured, hasLoadedProducts } = useShopify();

  // Initialize Lenis Smooth Scroll with GSAP
  useEffect(() => {
    const cleanup = initSmoothScroll();
    return cleanup;
  }, []);

  // Page Routing State
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  // True once the URL -> state sync (effect 1) has run at least once, and again
  // whenever a popstate is being applied. While false, the URL-writing effect
  // must stay quiet: on first paint it still holds the default state ('home'),
  // and writing that out would clobber a deep route like /shop/necklaces.
  const isApplyingLocation = React.useRef(true);
  // Read inside the location effect without making it a dependency: re-running
  // that effect on every catalog update re-armed isApplyingLocation and
  // swallowed the user's next in-app navigation.
  const storeProductsRef = React.useRef<Product[]>([]);
  // No mock seed. Until a real product is selected (or the live catalog lands)
  // this is null, and every consumer already handles an absent product. Seeding
  // it from src/data/products.ts would put a stock-photo placeholder into the
  // page title, canonical and Product schema.
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [activeGuideSlug, setActiveGuideSlug] = useState<string | null>(null);
  const [currency, setCurrency] = useState<Currency>('INR');

  // Keep the ref in step with the live catalog, and tell the location effect
  // once — so a deep /product/<handle> link that loaded before Shopify
  // responded can still resolve, without re-arming isApplyingLocation on
  // every subsequent catalog update.
  useEffect(() => {
    const hadNone = storeProductsRef.current.length === 0;
    storeProductsRef.current = storeProducts || [];
    if (hadNone && storeProductsRef.current.length > 0) {
      window.dispatchEvent(new Event('avirena:catalog-ready'));
    }
  }, [storeProducts]);

  // Sync selectedProduct if storeProducts change
  useEffect(() => {
    if (!selectedProduct) return;
    if (storeProducts && storeProducts.length > 0) {
      const exists = storeProducts.find((p) => p.id === selectedProduct.id);
      if (!exists) {
        setSelectedProduct(storeProducts[0]);
      }
    }
  }, [storeProducts]);

  // Modals & Drawers
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [isWishlistModalOpen, setIsWishlistModalOpen] = useState<boolean>(false);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState<boolean>(false);
  const [isCareModalOpen, setIsCareModalOpen] = useState<boolean>(false);
  
  // Quick View Modal
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState<boolean>(false);

  // Toast Notification System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Wishlist State (persisted cleanly in localStorage)
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('avirena_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('avirena_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.warn('Failed to save wishlist:', e);
    }
  }, [wishlist]);

  // Cart State (persisted cleanly in localStorage)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('avirena_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('avirena_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Failed to save cart:', e);
    }
  }, [cart]);

  // 1. Parse URL Path on Load & Popstate (Clean HTML5 Routing, no hash)
  useEffect(() => {
    const handleLocationChange = () => {
      // Suppress the URL-writing effect for the state updates this triggers:
      // the URL is already correct — it is the source of truth right now.
      //
      // Armed only for a real URL-driven change: first mount and popstate.
      // This effect ALSO re-runs when the Shopify catalog lands mid-session,
      // and re-arming there left a stale flag that swallowed the user's next
      // real navigation (menu -> Shop changed the page but kept the URL at /).
      isApplyingLocation.current = true;

      // If there's an old legacy hash like #/shop or #about, normalize it
      let path = window.location.pathname;
      if (window.location.hash) {
        const legacyHash = window.location.hash.replace(/^#\/?/, '');
        if (legacyHash) {
          path = `/${legacyHash}`;
          window.history.replaceState(null, '', path);
        }
      }

      const parts = path.split('?')[0].split('/').filter(Boolean).map(decodeURIComponent);
      const root = parts[0] || 'home';

      if (root === 'product' && parts[1]) {
        // Live product URLs use the Shopify handle. Match on handle OR id.
        // Only the live Shopify catalog is consulted. The mock catalog is not a
        // fallback: resolving a URL against it would render a fake product page.
        const prod = findProductBySlug(storeProductsRef.current, parts[1]);
        if (prod) {
          setSelectedProduct(prod);
          setCurrentPage('pdp');
          return;
        }
        // Unknown product slug: leave currentPage untouched rather than silently
        // rendering the homepage under a /product/* URL (which would overwrite the
        // prerendered Product schema with homepage schema).
        return;
      }

      switch (root) {
        case 'shop':
        case 'collection': {
          const slug = parts[1];
          if (!slug) {
            setSelectedCategory('all');
            setCurrentPage('collection');
          } else if (isCategorySlug(slug)) {
            setSelectedCategory(slug);
            setCurrentPage('collection');
          }
          // An invalid category slug is a not-found case. Vercel serves a real 404
          // for it (no prerendered file exists), so do not fall back to the
          // unfiltered catalog or rewrite the URL here.
          break;
        }
        case 'collections':
        case 'suites':
          setCurrentPage('collections');
          break;
        case 'about':
          setCurrentPage('about');
          break;
        case 'contact':
          setCurrentPage('contact');
          break;
        case 'journal':
        case 'blog':
        case 'lookbook':
          setCurrentPage('journal');
          break;
        case 'faq':
        case 'care':
        case 'sizing':
          setCurrentPage('faq');
          break;
        case 'policies':
          setCurrentPage('policies');
          break;
        case 'guides': {
          const slug = parts[1];
          if (!slug) {
            setActiveGuideSlug(null);
            setCurrentPage('guides');
          } else if (isGuideSlug(slug)) {
            setActiveGuideSlug(slug);
            setCurrentPage('guides');
          }
          // An unknown guide slug is a not-found case: no prerendered file exists,
          // so the edge serves a real 404. Do not fall back to the hub here.
          break;
        }
        case 'cart':
          setCurrentPage('cart');
          break;
        case 'checkout':
          setCurrentPage('checkout');
          break;
        case 'home':
          setCurrentPage('home');
          break;
        default:
          // Unknown route. The edge serves a real 404 for these (no prerendered
          // file), so do not render the homepage under a foreign URL.
          break;
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);

    // The catalog only changes routing for ONE case: a deep /product/<handle>
    // link that loaded before Shopify responded. Re-parsing for anything else
    // arms isApplyingLocation with no state change to consume it, leaving the
    // flag set — which then swallowed the user's next real navigation.
    const onCatalogReady = () => {
      if (window.location.pathname.startsWith('/product/')) {
        handleLocationChange();
      }
    };
    window.addEventListener('avirena:catalog-ready', onCatalogReady);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('avirena:catalog-ready', onCatalogReady);
    };
    // Mount only. The catalog is read through storeProductsRef, and the
    // catalog-ready event covers the one case that needs a re-parse.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. Synchronize Document Title & Clean URL Path on Page Change
  useEffect(() => {
    // Title always reflects the real route, including the category segment, and
    // matches what scripts/prerender.ts serves for that route.
    document.title = buildTitle(currentPage, selectedProduct, selectedCategory, activeGuideSlug);

    const targetPath = buildPath(currentPage, selectedProduct, selectedCategory, activeGuideSlug);
    const currentPath = window.location.pathname;

    // The URL is authoritative while an initial load or a popstate is being
    // applied to state. Writing during that window is what used to rewrite
    // /shop/earrings -> /shop and push a spurious history entry.
    //
    // Consume the flag on the very next run of this effect: by then React has
    // flushed the state updates handleLocationChange queued, so anything after
    // is genuine in-app navigation. Do NOT gate clearing on the paths matching
    // — on an unknown/404 route they never converge, which left the flag stuck
    // and silently swallowed every later navigation (menu -> Shop kept /).
    if (isApplyingLocation.current) {
      isApplyingLocation.current = false;
      return;
    }

    // Never rewrite the URL when the browser is already on a valid route that
    // represents this state — including deeper routes (/shop/:category,
    // /product/:handle).
    const alreadyCorrect =
      currentPath === targetPath ||
      // tolerate a trailing slash on the same route
      currentPath.replace(/\/+$/, '') === targetPath.replace(/\/+$/, '');

    if (!alreadyCorrect) {
      // Genuine in-app navigation: this is a new destination the user chose,
      // so it earns a history entry.
      window.history.pushState(null, '', targetPath);
    } else if (window.location.hash) {
      // Same route, but a stale legacy hash is hanging around: clean it up
      // in place, never with pushState.
      window.history.replaceState(null, '', targetPath);
    }
  }, [currentPage, selectedProduct, selectedCategory, activeGuideSlug]);

  // Navigation handlers
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('pdp');
    scrollToTop();
  };

  const handleNavigateToCollection = (category: Category = 'all') => {
    setSelectedCategory(category);
    setCurrentPage('collection');
    scrollToTop();
  };

  const handlePageChange = (page: PageView) => {
    setCurrentPage(page);
    scrollToTop();
  };

  const handleNavigateToGuide = (slug: string | null) => {
    setActiveGuideSlug(slug);
    setCurrentPage('guides');
    scrollToTop();
  };

  const handleOpenQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  // Cart operations
  const handleAddToCart = (item: Omit<CartItem, 'id'>) => {
    const existingIndex = cart.findIndex(
      (c) =>
        c.product.id === item.product.id &&
        c.metal === item.metal &&
        c.size === item.size
    );

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += item.quantity;
      setCart(updated);
    } else {
      const newItem: CartItem = {
        ...item,
        id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      };
      setCart([...cart, newItem]);
    }

    // Immediately open the cart drawer so the user sees the item added
    setIsCartDrawerOpen(true);
  };

  const handleQuickAdd = (product: Product) => {
    handleAddToCart({
      product,
      quantity: 1,
      metal: product.metal,
      size: product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined,
    });
  };

  const handleUpdateQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveFromCart(id);
    } else {
      setCart(cart.map((item) => (item.id === id ? { ...item, quantity: newQty } : item)));
    }
  };

  const handleRemoveFromCart = (id: string) => {
    const removedItem = cart.find((i) => i.id === id);
    setCart(cart.filter((item) => item.id !== id));
    if (removedItem) {
      addToast({
        type: 'info',
        title: 'Removed from Bag',
        subtitle: removedItem.product.name,
      });
    }
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Wishlist operations
  const isProductWishlisted = (id: string): boolean => {
    return wishlist.some((p) => p.id === id);
  };

  const handleToggleWishlist = (product: Product) => {
    if (isProductWishlisted(product.id)) {
      setWishlist(wishlist.filter((p) => p.id !== product.id));
      addToast({
        type: 'info',
        title: 'Removed from Saved',
        subtitle: product.name,
      });
    } else {
      setWishlist([...wishlist, product]);
      addToast({
        type: 'wishlist',
        title: 'Saved to Wishlist',
        subtitle: `${product.name} added to your private archive`,
        actionLabel: 'View Saved',
        onAction: () => setIsWishlistModalOpen(true),
      });
    }
  };

  const handleRemoveFromWishlist = (product: Product) => {
    setWishlist(wishlist.filter((p) => p.id !== product.id));
  };

  const totalCartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1A1918] w-full font-sans-body">
      {/* Dynamic SEO, AEO & GEO Schema.org Engine */}
      <SeoMeta
        currentPage={currentPage}
        selectedProduct={selectedProduct ?? undefined}
        selectedCategory={selectedCategory}
        currency={currency}
        activeGuideSlug={activeGuideSlug}
      />

      {/* Universal Navigation Bar */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={handlePageChange}
        cartCount={totalCartCount}
        wishlistCount={wishlist.length}
        openCartDrawer={() => setIsCartDrawerOpen(true)}
        openSearchModal={() => setIsSearchModalOpen(true)}
        openWishlistModal={() => setIsWishlistModalOpen(true)}
        openStoryModal={() => handlePageChange('about')}
        openCareModal={() => handlePageChange('faq')}
        setSelectedCategory={setSelectedCategory}
        currency={currency}
        setCurrency={setCurrency}
      />

      {/* Main Multi-Page View Container */}
      <main className="flex-1 w-full">
        <Suspense fallback={<RouteFallback />}>
        {currentPage === 'home' && (
          <HomePage
            onSelectProduct={handleSelectProduct}
            onNavigateToCollection={handleNavigateToCollection}
            onQuickAdd={handleQuickAdd}
            onQuickView={handleOpenQuickView}
            currency={currency}
            isWishlisted={isProductWishlisted}
            onToggleWishlist={handleToggleWishlist}
            catalogProducts={storeProducts}
            onNavigateToAbout={() => handlePageChange('about')}
          />
        )}

        {(currentPage === 'collection' || currentPage === 'shop') && (
          <CollectionPage
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onSelectProduct={handleSelectProduct}
            onQuickAdd={handleQuickAdd}
            onQuickView={handleOpenQuickView}
            currency={currency}
            isWishlisted={isProductWishlisted}
            onToggleWishlist={handleToggleWishlist}
            products={storeProducts}
            isCatalogReady={hasLoadedProducts}
          />
        )}

        {currentPage === 'collections' && (
          <CollectionsHubPage
            onNavigateToCategory={(cat) => handleNavigateToCollection(cat)}
            onSelectProduct={handleSelectProduct}
            currency={currency}
            catalogProducts={storeProducts}
            isCatalogReady={hasLoadedProducts}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage
            onNavigateToShop={() => handleNavigateToCollection('all')}
            onNavigateToContact={() => handlePageChange('contact')}
          />
        )}

        {currentPage === 'contact' && (
          <ContactPage
            onNavigateToShop={() => handleNavigateToCollection('all')}
          />
        )}

        {currentPage === 'journal' && (
          <JournalPage
            onSelectProduct={handleSelectProduct}
            onNavigateToShop={() => handleNavigateToCollection('all')}
            currency={currency}
            catalogProducts={storeProducts}
          />
        )}

        {currentPage === 'faq' && (
          <FaqPage
            onNavigateToContact={() => handlePageChange('contact')}
            onNavigateToShop={() => handleNavigateToCollection('all')}
          />
        )}

        {currentPage === 'policies' && (
          <PoliciesPage
            onNavigateToContact={() => handlePageChange('contact')}
            onNavigateToShop={() => handleNavigateToCollection('all')}
          />
        )}

        {currentPage === 'guides' && (
          <GuidesPage
            activeSlug={activeGuideSlug}
            onSelectGuide={(slug) => handleNavigateToGuide(slug)}
            onNavigateToHub={() => handleNavigateToGuide(null)}
            onNavigateToShop={() => handleNavigateToCollection('all')}
          />
        )}

        {currentPage === 'pdp' && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            currency={currency}
            onAddToCart={handleAddToCart}
            onSelectProduct={handleSelectProduct}
            onNavigateBack={() => handlePageChange('collection')}
            isWishlisted={isProductWishlisted(selectedProduct.id)}
            onToggleWishlist={handleToggleWishlist}
            catalogProducts={storeProducts}
          />
        )}

        {currentPage === 'cart' && (
          <CartPage
            items={cart}
            currency={currency}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveFromCart}
            onProceedToCheckout={() => handlePageChange('checkout')}
            onContinueShopping={() => handlePageChange('collection')}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentPage === 'checkout' && (
          <CheckoutPage
            items={cart}
            currency={currency}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveFromCart}
            onNavigateHome={() => handlePageChange('home')}
            onClearCart={handleClearCart}
          />
        )}
        </Suspense>
      </main>

      {/* Instagram Feed Gallery Section */}
      <InstagramFeedSection />

      {/* Footer */}
      <Footer
        setCurrentPage={handlePageChange}
        openStoryModal={() => handlePageChange('about')}
        openCareModal={() => handlePageChange('faq')}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        items={cart}
        currency={currency}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={() => {
          setIsCartDrawerOpen(false);
          handlePageChange('checkout');
        }}
        onContinueShopping={() => {
          setIsCartDrawerOpen(false);
          handlePageChange('collection');
        }}
        onViewCartPage={() => {
          setIsCartDrawerOpen(false);
          handlePageChange('cart');
        }}
      />

      {/* Quick View Modal (chunk fetched only once opened) */}
      {isQuickViewOpen && (
      <Suspense fallback={null}>
      <QuickViewModal
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        onAddToCart={handleAddToCart}
        onSelectProduct={handleSelectProduct}
        currency={currency}
        isWishlisted={quickViewProduct ? isProductWishlisted(quickViewProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
      />
      </Suspense>
      )}

      {/* Live Search Modal (chunk fetched only once opened) */}
      {isSearchModalOpen && (
      <Suspense fallback={null}>
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectProduct={handleSelectProduct}
        onQuickAdd={handleQuickAdd}
        currency={currency}
        catalogProducts={storeProducts}
      />
      </Suspense>
      )}

      {/* Wishlist Modal (chunk fetched only once opened) */}
      {isWishlistModalOpen && (
      <Suspense fallback={null}>
      <WishlistModal
        isOpen={isWishlistModalOpen}
        onClose={() => setIsWishlistModalOpen(false)}
        wishlist={wishlist}
        currency={currency}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onAddToCart={handleAddToCart}
        onSelectProduct={(product) => {
          setIsWishlistModalOpen(false);
          handleSelectProduct(product);
        }}
      />
      </Suspense>
      )}

      {/* Story & Care Modals */}
      <StoryModal isOpen={isStoryModalOpen} onClose={() => setIsStoryModalOpen(false)} />
      <CareModal isOpen={isCareModalOpen} onClose={() => setIsCareModalOpen(false)} />

      {/* Floating Toast Feedback Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

export default function App() {
  return (
    <ShopifyProvider>
      <AppContent />
    </ShopifyProvider>
  );
}
