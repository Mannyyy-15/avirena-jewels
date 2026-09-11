import React, { useState, useEffect, lazy, Suspense } from 'react';
import { PageView, Product, CartItem, Currency, Category } from './types';
import { GUIDES } from './data/guides';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { InstagramFeedSection } from './components/InstagramFeedSection';
import DemoOne from './components/ui/demo';
import { CartDrawer } from './components/CartDrawer';
import { WhatsAppConcierge } from './components/WhatsAppConcierge';
import { RecentPurchaseToast } from './components/RecentPurchaseToast';

import { ToastContainer, ToastMessage } from './components/Toast';

import { StoryModal, CareModal } from './components/StoryAndCareModals';
import { HomePage } from './pages/HomePage';

import { SeoMeta } from './components/SeoMeta';
import { ShopifyProvider, useShopify } from './context/ShopifyContext';
import { initSmoothScroll, scrollToTop } from './lib/smoothScroll';

import { ErrorBoundary } from './components/ErrorBoundary';

/**
 * Wraps dynamic component imports with deployment-safe retry logic.
 * If a new build has deployed on Vercel and changed chunk hashes,
 * fetching an older chunk URL (e.g. ProductDetailPage-[oldHash].js) results in a 404.
 * This helper catches the failure and reloads the page once to acquire the latest HTML
 * and valid chunk mappings, preventing uncaught module fetch TypeErrors.
 */
function lazyWithRetry<T extends React.ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>
) {
  return lazy(async () => {
    try {
      return await componentImport();
    } catch (error: any) {
      console.warn('[Avirena] Dynamic component chunk failed to load, attempting reload:', error);
      const isChunkError =
        error?.message?.includes('dynamically imported module') ||
        error?.message?.includes('Loading chunk') ||
        error?.message?.includes('Failed to fetch') ||
        error?.name === 'TypeError';

      const retryKey = `avirena_chunk_retry_${window.location.pathname}`;
      const hasRetried = sessionStorage.getItem(retryKey);

      if (isChunkError && !hasRetried) {
        sessionStorage.setItem(retryKey, 'true');
        window.location.reload();
        // Return unresolved promise while the browser initiates the full reload
        return new Promise<{ default: T }>(() => {});
      }

      sessionStorage.removeItem(retryKey);
      throw error;
    }
  });
}

/*
 * Route-level code splitting with deployment-resilient dynamic imports.
 */
const CollectionPage = lazyWithRetry(() =>
  import('./pages/CollectionPage').then((m) => ({ default: m.CollectionPage }))
);
const CollectionsHubPage = lazyWithRetry(() =>
  import('./pages/CollectionsHubPage').then((m) => ({ default: m.CollectionsHubPage }))
);
const ProductDetailPage = lazyWithRetry(() =>
  import('./pages/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage }))
);
const CartPage = lazyWithRetry(() =>
  import('./pages/CartPage').then((m) => ({ default: m.CartPage }))
);
const CheckoutPage = lazyWithRetry(() =>
  import('./pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage }))
);
const AboutPage = lazyWithRetry(() =>
  import('./pages/AboutPage').then((m) => ({ default: m.AboutPage }))
);
const ContactPage = lazyWithRetry(() =>
  import('./pages/ContactPage').then((m) => ({ default: m.ContactPage }))
);
const JournalPage = lazyWithRetry(() =>
  import('./pages/JournalPage').then((m) => ({ default: m.JournalPage }))
);
const FaqPage = lazyWithRetry(() =>
  import('./pages/FaqPage').then((m) => ({ default: m.FaqPage }))
);
const PoliciesPage = lazyWithRetry(() =>
  import('./pages/PoliciesPage').then((m) => ({ default: m.PoliciesPage }))
);
const GuidesPage = lazyWithRetry(() =>
  import('./pages/GuidesPage').then((m) => ({ default: m.GuidesPage }))
);
const WishlistModal = lazyWithRetry(() =>
  import('./components/WishlistModal').then((m) => ({ default: m.WishlistModal }))
);
const SearchModal = lazyWithRetry(() =>
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
 * Maps legacy arbitrary product handles (pre-rebrand) to new official Avirena handles
 * for zero-downtime backward compatibility with bookmarks and external links.
 */
const LEGACY_SLUG_MAP: Record<string, string> = {
  'nadir-square-studs-gold-tone-brass-earrings': 'avirena-square-studs-gold-tone-brass-earrings',
  'lume-drop-earrings-gold-tone-brass': 'avirena-drop-earrings-gold-tone-brass',
  'forma-statement-drops-geometric-brass-earrings': 'avirena-statement-drops-geometric-brass-earrings',
  'amara-heart-drops-silver-tone-earrings': 'avirena-heart-drops-silver-tone-earrings',
  'volute-spiral-earrings-silver-tone': 'avirena-spiral-earrings-silver-tone',
  'solene-crystal-hoops-gold-tone-earrings': 'avirena-crystal-hoops-gold-tone-earrings',
  'solene-crystal-hoops-silver-tone-earrings': 'avirena-crystal-hoops-silver-tone-earrings',
  'petra-pebble-studs-gold-tone-earrings': 'avirena-pebble-studs-gold-tone-earrings',
  'foglia-leaf-studs-gold-tone-earrings': 'avirena-leaf-studs-gold-tone-earrings',
};

/**
 * Resolve a URL segment to a product. Live URLs use the Shopify handle
 * (src/lib/shopify.ts sets `id: node.handle || node.id` and also keeps `handle`),
 * but local/mock products are keyed by `id`. Match on both, in both catalogs.
 */
const findProductBySlug = (catalog: Product[], slug: string): Product | undefined => {
  const targetSlug = LEGACY_SLUG_MAP[slug] || slug;
  return catalog.find(
    (p) => p.handle === targetSlug || p.id === targetSlug || p.handle === slug || p.id === slug || p.shopifyId === slug
  );
};

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
  guideSlug: string | null,
  curatedEdit?: 'under-999' | 'gifting-edit' | null
): string => {
  switch (page) {
    case 'home':
      return '/';
    case 'collection':
    case 'shop':
      if (curatedEdit === 'under-999') return '/collections/under-999';
      if (curatedEdit === 'gifting-edit') return '/collections/gifting-edit';
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
    case 'privacy-policy':
      return '/privacy-policy';
    case 'refund-policy':
      return '/refund-policy';
    case 'shipping-policy':
      return '/shipping-policy';
    case 'terms-of-service':
      return '/terms-of-service';
    case 'legal-notice':
      return '/legal-notice';
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
  guideSlug: string | null,
  curatedEdit?: 'under-999' | 'gifting-edit' | null
): string => {
  switch (page) {
    case 'home':
      return 'Avirena Jewels – Anti-Tarnish Dailywear Jewelry India';
    case 'collection':
    case 'shop':
      if (curatedEdit === 'under-999') {
        return 'Anti-Tarnish Jewellery Under ₹999 | Affordable Dailywear | AVIRENA';
      }
      if (curatedEdit === 'gifting-edit') {
        return 'Jewellery Gifts Under ₹1000 | Thoughtful Everyday Gifts | AVIRENA';
      }
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
    case 'privacy-policy':
      return 'Privacy Policy | AVIRENA Jewels';
    case 'refund-policy':
      return 'Return and Refund Policy (7-Day Exchanges) | AVIRENA Jewels';
    case 'shipping-policy':
      return 'Shipping Policy & Express Delivery | AVIRENA Jewels';
    case 'terms-of-service':
      return 'Terms of Service | AVIRENA Jewels';
    case 'legal-notice':
      return 'Legal Notice & Business Information | AVIRENA Jewels';
    case 'guides': {
      const guide = guideSlug ? GUIDES.find((g) => g.slug === guideSlug) : undefined;
      return guide ? guide.metaTitle : 'Jewelry Guides: Materials, Care & Fit | AVIRENA';
    }
    case 'cart':
      return 'Your Shopping Bag | AVIRENA';
    case 'checkout':
      return 'Secure Checkout | AVIRENA';
    default:
      return 'Avirena Jewels – Anti-Tarnish Dailywear Jewelry India';
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
  const [selectedMetal, setSelectedMetal] = useState<string>('all');
  const [curatedEdit, setCuratedEdit] = useState<'under-999' | 'gifting-edit' | null>(null);
  const [activeGuideSlug, setActiveGuideSlug] = useState<string | null>(null);
  const [activePolicyTab, setActivePolicyTab] = useState<'returns' | 'privacy' | 'terms' | 'shipping' | 'contact' | 'legal'>('returns');
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
            setCuratedEdit(null);
            setCurrentPage('collection');
          } else if (slug === 'under-999') {
            setSelectedCategory('all');
            setCuratedEdit('under-999');
            setCurrentPage('collection');
          } else if (slug === 'gifting-edit') {
            setSelectedCategory('all');
            setCuratedEdit('gifting-edit');
            setCurrentPage('collection');
          } else if (isCategorySlug(slug)) {
            setSelectedCategory(slug);
            setCuratedEdit(null);
            setCurrentPage('collection');
          }
          // An invalid category slug is a not-found case. Vercel serves a real 404
          // for it (no prerendered file exists), so do not fall back to the
          // unfiltered catalog or rewrite the URL here.
          break;
        }
        case 'collections':
        case 'suites': {
          const slug = parts[1];
          if (slug === 'under-999') {
            setSelectedCategory('all');
            setCuratedEdit('under-999');
            setCurrentPage('collection');
          } else if (slug === 'gifting-edit') {
            setSelectedCategory('all');
            setCuratedEdit('gifting-edit');
            setCurrentPage('collection');
          } else {
            setCuratedEdit(null);
            setCurrentPage('collections');
          }
          break;
        }
        case 'about':
          setCuratedEdit(null);
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
        case 'privacy-policy':
        case 'privacy':
          setActivePolicyTab('privacy');
          setCurrentPage('privacy-policy');
          break;
        case 'refund-policy':
        case 'return-policy':
        case 'refund':
        case 'returns':
          setActivePolicyTab('returns');
          setCurrentPage('refund-policy');
          break;
        case 'shipping-policy':
        case 'shipping':
          setActivePolicyTab('shipping');
          setCurrentPage('shipping-policy');
          break;
        case 'terms-of-service':
        case 'terms-and-conditions':
        case 'terms':
          setActivePolicyTab('terms');
          setCurrentPage('terms-of-service');
          break;
        case 'legal-notice':
        case 'legal':
        case 'impressum':
          setActivePolicyTab('legal');
          setCurrentPage('legal-notice');
          break;
        case 'policies': {
          const sub = parts[1];
          if (sub === 'privacy' || sub === 'privacy-policy') {
            setActivePolicyTab('privacy');
            setCurrentPage('privacy-policy');
          } else if (sub === 'returns' || sub === 'refund' || sub === 'refund-policy') {
            setActivePolicyTab('returns');
            setCurrentPage('refund-policy');
          } else if (sub === 'shipping' || sub === 'shipping-policy') {
            setActivePolicyTab('shipping');
            setCurrentPage('shipping-policy');
          } else if (sub === 'terms' || sub === 'terms-of-service') {
            setActivePolicyTab('terms');
            setCurrentPage('terms-of-service');
          } else if (sub === 'legal' || sub === 'legal-notice') {
            setActivePolicyTab('legal');
            setCurrentPage('legal-notice');
          } else {
            const searchParams = new URLSearchParams(window.location.search);
            const policyTab = searchParams.get('tab') as 'returns' | 'privacy' | 'terms' | 'shipping' | 'contact' | 'legal' | null;
            if (policyTab && ['returns', 'privacy', 'terms', 'shipping', 'contact', 'legal'].includes(policyTab)) {
              setActivePolicyTab(policyTab);
            }
            setCurrentPage('policies');
          }
          break;
        }
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
    document.title = buildTitle(currentPage, selectedProduct, selectedCategory, activeGuideSlug, curatedEdit);

    const targetPath = buildPath(currentPage, selectedProduct, selectedCategory, activeGuideSlug, curatedEdit);
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
  }, [currentPage, selectedProduct, selectedCategory, activeGuideSlug, curatedEdit]);

  // Navigation handlers
  const handleSelectProduct = (product: Product, shouldScroll: boolean = true) => {
    setSelectedProduct(product);
    setCuratedEdit(null);
    setCurrentPage('pdp');
    if (shouldScroll) {
      scrollToTop();
    }
  };

  const handleNavigateToCollection = (category: Category = 'all', metal: string = 'all') => {
    setCuratedEdit(null);
    setSelectedCategory(category);
    setSelectedMetal(metal);
    setCurrentPage('collection');
    scrollToTop();
  };

  const handleSelectCuratedEdit = (edit: 'under-999' | 'gifting-edit') => {
    setCuratedEdit(edit);
    setSelectedCategory('all');
    setCurrentPage('collection');
    scrollToTop();
  };

  const handlePageChange = (page: PageView) => {
    setCuratedEdit(null);
    setCurrentPage(page);
    scrollToTop();
  };

  const handleNavigateToPolicy = (tab: 'returns' | 'privacy' | 'terms' | 'shipping' | 'contact' | 'legal') => {
    setActivePolicyTab(tab);
    switch (tab) {
      case 'privacy':
        setCurrentPage('privacy-policy');
        break;
      case 'returns':
        setCurrentPage('refund-policy');
        break;
      case 'shipping':
        setCurrentPage('shipping-policy');
        break;
      case 'terms':
        setCurrentPage('terms-of-service');
        break;
      case 'legal':
        setCurrentPage('legal-notice');
        break;
      case 'contact':
        setCurrentPage('contact');
        break;
      default:
        setCurrentPage('policies');
        break;
    }
    scrollToTop();
  };

  const handleNavigateToGuide = (slug: string | null) => {
    setActiveGuideSlug(slug);
    setCurrentPage('guides');
    scrollToTop();
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
    // No toast: the cart drawer is the feedback. A notification that repeats
    // what the user just watched happen is noise.
    setCart(cart.filter((item) => item.id !== id));
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
        curatedEdit={curatedEdit}
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
        setSelectedCategory={(cat) => {
          setCuratedEdit(null);
          setSelectedCategory(cat);
        }}
        onSelectCuratedEdit={handleSelectCuratedEdit}
        currency={currency}
        setCurrency={setCurrency}
      />

      {/* Main Multi-Page View Container */}
      <main className="flex-1 w-full">
        <ErrorBoundary>
          <Suspense fallback={<RouteFallback />}>
        {currentPage === 'home' && (
          <HomePage
            onSelectProduct={handleSelectProduct}
            onNavigateToCollection={handleNavigateToCollection}
            onQuickAdd={handleQuickAdd}
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
            setSelectedCategory={(cat) => {
              setCuratedEdit(null);
              setSelectedCategory(cat);
            }}
            curatedEdit={curatedEdit}
            onClearCuratedEdit={() => setCuratedEdit(null)}
            initialMetal={selectedMetal}
            onSelectProduct={handleSelectProduct}
            onQuickAdd={handleQuickAdd}
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

        {(currentPage === 'policies' ||
          currentPage === 'privacy-policy' ||
          currentPage === 'refund-policy' ||
          currentPage === 'shipping-policy' ||
          currentPage === 'terms-of-service' ||
          currentPage === 'legal-notice') && (
          <PoliciesPage
            key={currentPage + '-' + activePolicyTab}
            initialTab={activePolicyTab}
            onTabChange={handleNavigateToPolicy}
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
            isWishlistedById={isProductWishlisted}
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
        </ErrorBoundary>
      </main>

      {/* Instagram Feed Gallery Section */}
      <InstagramFeedSection />

      {/* Community Testimonials Showcase */}
      <DemoOne />

      {/* Footer */}
      <Footer
        setCurrentPage={handlePageChange}
        onNavigateToPolicy={handleNavigateToPolicy}
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

      {/* Floating WhatsApp VIP Concierge & Lead Magnet */}
      <WhatsAppConcierge />

      {/* Floating Recent Purchase Social Proof Notification */}
      <RecentPurchaseToast
        products={storeProducts}
        onSelectProduct={handleSelectProduct}
      />
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
