import React, { useState, useEffect } from 'react';
import { PageView, Product, CartItem, Currency, Category } from './types';
import { PRODUCTS } from './data/products';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { QuickViewModal } from './components/QuickViewModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { WishlistModal } from './components/WishlistModal';
import { StoryModal, CareModal } from './components/StoryAndCareModals';
import { HomePage } from './pages/HomePage';
import { CollectionPage } from './pages/CollectionPage';
import { CollectionsHubPage } from './pages/CollectionsHubPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { JournalPage } from './pages/JournalPage';
import { FaqPage } from './pages/FaqPage';
import { ShopifyProvider, useShopify } from './context/ShopifyContext';

function AppContent() {
  const { products: storeProducts, isConfigured } = useShopify();

  // Page Routing State
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product>(storeProducts[0] || PRODUCTS[0]);
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [currency, setCurrency] = useState<Currency>('EUR');

  // Sync selectedProduct if storeProducts change
  useEffect(() => {
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

  // Wishlist State
  const [wishlist, setWishlist] = useState<Product[]>([
    storeProducts[0] || PRODUCTS[0],
    storeProducts[1] || PRODUCTS[1],
  ]);

  // Initial Cart
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: 'cart-1',
      product: storeProducts[0] || PRODUCTS[0],
      quantity: 1,
      metal: '18k Gold Vermeil',
      size: '38 cm',
    },
    {
      id: 'cart-2',
      product: storeProducts[1] || PRODUCTS[1],
      quantity: 1,
      metal: '18k Gold Vermeil',
    },
  ]);

  // 1. Parse URL Hash on Load & Popstate/Hashchange
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      const parts = hash.split('?')[0].split('/');
      const root = parts[0] || 'home';

      if (root === 'product' && parts[1]) {
        const prod = storeProducts.find((p) => p.id === parts[1]) || PRODUCTS.find((p) => p.id === parts[1]);
        if (prod) {
          setSelectedProduct(prod);
          setCurrentPage('pdp');
          return;
        }
      }

      switch (root) {
        case 'shop':
        case 'collection':
          setCurrentPage('collection');
          break;
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
        case 'lookbook':
          setCurrentPage('journal');
          break;
        case 'faq':
        case 'care':
        case 'sizing':
          setCurrentPage('faq');
          break;
        case 'cart':
          setCurrentPage('cart');
          break;
        case 'checkout':
          setCurrentPage('checkout');
          break;
        default:
          setCurrentPage('home');
          break;
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [storeProducts]);

  // 2. Synchronize Document Title & URL Hash on Page Change
  useEffect(() => {
    let title = 'Studio Avirena | Modern Sculptural Jewelry';
    let targetHash = '#/';

    switch (currentPage) {
      case 'home':
        title = 'Studio Avirena | Modern Sculptural Demi-Fine Jewelry';
        targetHash = '#/';
        break;
      case 'collection':
      case 'shop':
        title = 'All Jewelry Collection | Studio Avirena';
        targetHash = '#/shop';
        break;
      case 'pdp':
        title = `${selectedProduct.name} | Studio Avirena`;
        targetHash = `#/product/${selectedProduct.id}`;
        break;
      case 'about':
        title = 'About Our Atelier & Heritage | Studio Avirena';
        targetHash = '#/about';
        break;
      case 'contact':
        title = 'Atelier Concierge & Bespoke Commissions | Studio Avirena';
        targetHash = '#/contact';
        break;
      case 'journal':
        title = 'Journal & Editorial Lookbook | Studio Avirena';
        targetHash = '#/journal';
        break;
      case 'faq':
        title = 'FAQs, Ring Sizing & Care Standard | Studio Avirena';
        targetHash = '#/faq';
        break;
      case 'cart':
        title = 'Your Shopping Bag | Studio Avirena';
        targetHash = '#/cart';
        break;
      case 'checkout':
        title = 'Secure Atelier Checkout | Studio Avirena';
        targetHash = '#/checkout';
        break;
    }

    document.title = title;
    if (window.location.hash !== targetHash) {
      window.history.replaceState(null, '', targetHash);
    }
  }, [currentPage, selectedProduct]);

  // Navigation handlers
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('pdp');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToCollection = (category: Category = 'all') => {
    setSelectedCategory(category);
    setCurrentPage('collection');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageChange = (page: PageView) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

    addToast({
      type: 'cart',
      title: `Added to Bag`,
      subtitle: `${item.product.name} • ${item.metal}`,
      actionLabel: 'View Bag',
      onAction: () => setIsCartDrawerOpen(true),
    });
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
          />
        )}

        {currentPage === 'collection' && (
          <CollectionPage
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onSelectProduct={handleSelectProduct}
            onQuickAdd={handleQuickAdd}
            onQuickView={handleOpenQuickView}
            currency={currency}
            isWishlisted={isProductWishlisted}
            onToggleWishlist={handleToggleWishlist}
            catalogProducts={storeProducts}
          />
        )}

        {currentPage === 'collections' && (
          <CollectionsHubPage
            onNavigateToCategory={(cat) => handleNavigateToCollection(cat)}
            onSelectProduct={handleSelectProduct}
            currency={currency}
            catalogProducts={storeProducts}
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
          />
        )}

        {currentPage === 'faq' && (
          <FaqPage
            onNavigateToContact={() => handlePageChange('contact')}
            onNavigateToShop={() => handleNavigateToCollection('all')}
          />
        )}

        {currentPage === 'pdp' && (
          <ProductDetailPage
            product={selectedProduct}
            currency={currency}
            onAddToCart={handleAddToCart}
            onSelectProduct={handleSelectProduct}
            onNavigateBack={() => handlePageChange('collection')}
            isWishlisted={isProductWishlisted(selectedProduct.id)}
            onToggleWishlist={handleToggleWishlist}
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
      </main>

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
      />

      {/* Quick View Modal */}
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

      {/* Live Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectProduct={handleSelectProduct}
        onQuickAdd={handleQuickAdd}
        currency={currency}
      />

      {/* Wishlist Modal */}
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
