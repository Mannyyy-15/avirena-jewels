import React, { useState, useRef } from 'react';
import { Search, ShoppingBag, User, Menu, X, Heart, Check, ChevronDown } from 'lucide-react';
import { PageView, Currency, Category } from '../types';
import { AvirenaLogo } from './AvirenaLogo';
import { useShopify } from '../context/ShopifyContext';

interface NavbarProps {
  currentPage: PageView;
  setCurrentPage: (page: PageView) => void;
  cartCount: number;
  wishlistCount: number;
  openCartDrawer: () => void;
  openSearchModal: () => void;
  openWishlistModal: () => void;
  openStoryModal: () => void;
  openCareModal: () => void;
  setSelectedCategory?: (cat: Category) => void;
  currency?: Currency;
  setCurrency?: (c: Currency) => void;
}

const ANNOUNCEMENTS = [
  'COMPLIMENTARY EXPRESS SHIPPING ON ORDERS OVER ₹1,999',
  'PREMIUM ANTI-TARNISH BRASS & ORGANIC FRESHWATER PEARLS',
  'HOMEGROWN HANDCRAFTED DAILYWEAR JEWELS',
  'COMPLIMENTARY KEEPSAKE TRAVEL POUCH WITH EVERY ORDER',
  'ZERO ALLERGY SURGICAL STEEL POSTS & HYPOALLERGENIC FINISHES',
  'HANDCRAFTED BY SKILLED ARTISANS ACROSS INDIA',
];

const CATEGORY_ITEMS: { id: Category; label: string }[] = [
  { id: 'rings', label: 'Rings' },
  { id: 'earrings', label: 'Earrings' },
  { id: 'necklaces', label: 'Necklaces' },
  { id: 'bracelets', label: 'Bracelets' },
  { id: 'brooches', label: 'Brooches' },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  setCurrentPage,
  cartCount,
  wishlistCount,
  openCartDrawer,
  openSearchModal,
  openWishlistModal,
  openStoryModal,
  openCareModal,
  setSelectedCategory,
}) => {
  // Category availability is read from the live Shopify catalog, never from a
  // hardcoded list. A category with no stock is still listed and still routable
  // (its /shop/:category page is real and returns 200), but it is marked
  // "Soon" and de-emphasised rather than presented as shoppable. When
  // inventory is added the marker disappears on its own.
  const { products: liveProducts, hasLoadedProducts } = useShopify();
  const categoryItems = CATEGORY_ITEMS.map((cat) => ({
    ...cat,
    isEmpty: hasLoadedProducts && !liveProducts.some((p) => p.category === cat.id),
  }));

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCollectionsOpen, setMobileCollectionsOpen] = useState(false);
  const [collectionsDropdownOpen, setCollectionsDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCollectionsEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setCollectionsDropdownOpen(true);
  };

  const handleCollectionsLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setCollectionsDropdownOpen(false);
    }, 220);
  };

  const navigateTo = (page: PageView, category?: Category) => {
    setCurrentPage(page);
    if (category && setSelectedCategory) {
      setSelectedCategory(category);
    }
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setCollectionsDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectCategory = (cat: Category) => {
    navigateTo('shop', cat);
    setCollectionsDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const handleQuickSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setUserDropdownOpen(false);
        setEmailInput('');
      }, 2000);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#E7E4D5]/98 backdrop-blur-md border-b border-[#D8D2C2] transition-all duration-200 w-full">
      <div className="w-full bg-[#413C23] text-[#FAF8F5] py-2 sm:py-2.5 overflow-hidden border-b border-[#35311B] marquee-pause select-none">
        <div className="flex animate-infinite-marquee">
          <div className="flex items-center shrink-0">
            {ANNOUNCEMENTS.map((text, idx) => (
              <div key={`ann-track1-${idx}`} className="flex items-center shrink-0 px-6 sm:px-10">
                <span className="text-[10px] sm:text-[11px] font-medium tracking-[0.22em] uppercase text-[#F2EFDB]/95 whitespace-nowrap">
                  {text}
                </span>
                <span className="ml-6 sm:ml-10 text-[#8F896D] text-xs select-none">✦</span>
              </div>
            ))}
          </div>
          <div className="flex items-center shrink-0" aria-hidden="true">
            {ANNOUNCEMENTS.map((text, idx) => (
              <div key={`ann-track2-${idx}`} className="flex items-center shrink-0 px-6 sm:px-10">
                <span className="text-[10px] sm:text-[11px] font-medium tracking-[0.22em] uppercase text-[#F2EFDB]/95 whitespace-nowrap">
                  {text}
                </span>
                <span className="ml-6 sm:ml-10 text-[#8F896D] text-xs select-none">✦</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative w-full px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-20 h-16 sm:h-20 flex lg:grid lg:grid-cols-12 items-center justify-between font-sans-body">
        {/* Left: Mobile menu toggle button & Desktop navigation */}
        <div className="flex items-center lg:col-span-5 z-20">
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 -ml-2 text-[#413C23] hover:text-[#8F896D] lg:hidden transition-colors cursor-pointer"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6 stroke-[1.3]" />
          </button>

          <nav className="hidden lg:flex items-center space-x-5 xl:space-x-7 text-[11px] xl:text-xs uppercase tracking-[0.16em] font-medium text-[#413C23]">
            <button
              id="nav-home-btn"
              onClick={() => navigateTo('home')}
              className={`transition-colors hover:text-[#8F896D] py-1 cursor-pointer relative ${
                currentPage === 'home'
                  ? 'text-[#413C23] font-bold after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-[#8F896D]'
                  : 'text-[#413C23]/85'
              }`}
            >
              Home
            </button>

            <button
              id="nav-shop-btn"
              onClick={() => navigateTo('shop', 'all')}
              className={`transition-colors hover:text-[#8F896D] py-1 cursor-pointer relative ${
                (currentPage === 'collection' || currentPage === 'shop') && !collectionsDropdownOpen
                  ? 'text-[#413C23] font-bold after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-[#8F896D]'
                  : 'text-[#413C23]/85'
              }`}
            >
              Shop
            </button>

            <div
              className="relative py-1"
              onMouseEnter={handleCollectionsEnter}
              onMouseLeave={handleCollectionsLeave}
            >
              <button
                id="nav-collections-dropdown-btn"
                onClick={() => setCollectionsDropdownOpen((prev) => !prev)}
                className={`inline-flex items-center gap-1 transition-colors hover:text-[#8F896D] cursor-pointer relative py-1 ${
                  collectionsDropdownOpen
                    ? 'text-[#8F896D] font-semibold'
                    : 'text-[#413C23]/85'
                }`}
                aria-expanded={collectionsDropdownOpen}
              >
                <span>Collections</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 stroke-[1.5] ${
                    collectionsDropdownOpen ? 'rotate-180 text-[#8F896D]' : ''
                  }`}
                />
              </button>

              {collectionsDropdownOpen && (
                <div
                  className="absolute left-0 top-full pt-2 w-64 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  onMouseEnter={handleCollectionsEnter}
                  onMouseLeave={handleCollectionsLeave}
                >
                  <div className="bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs shadow-[0_12px_30px_rgba(65,60,35,0.12)] py-2 px-1 select-none text-left min-w-[200px]">
                    {categoryItems.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => selectCategory(cat.id)}
                        className={`w-full text-left px-4 py-2.5 text-[11px] uppercase tracking-[0.18em] hover:bg-[#F2EFDB] transition-all font-medium cursor-pointer flex items-center justify-between gap-2 ${
                          cat.isEmpty
                            ? 'text-[#413C23]/45 hover:text-[#413C23]/70'
                            : 'text-[#413C23]/85 hover:text-[#413C23]'
                        }`}
                      >
                        <span>{cat.label}</span>
                        {cat.isEmpty && (
                          <span className="text-[9px] tracking-[0.12em] text-[#8F896D] normal-case">
                            Soon
                          </span>
                        )}
                      </button>
                    ))}

                    <div className="border-t border-[#E8E2D6]/80 mt-1 pt-1 mx-2">
                      <button
                        onClick={() => selectCategory('all')}
                        className="w-full text-left px-2 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#413C23] hover:text-[#8F896D] transition-all cursor-pointer"
                      >
                        All Jewelry
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              id="nav-blog-btn"
              onClick={() => navigateTo('journal')}
              className={`transition-colors hover:text-[#8F896D] py-1 cursor-pointer relative ${
                currentPage === 'journal'
                  ? 'text-[#413C23] font-bold after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-[#8F896D]'
                  : 'text-[#413C23]/85'
              }`}
            >
              Blog
            </button>

            <button
              id="nav-about-btn"
              onClick={() => navigateTo('about')}
              className={`transition-colors hover:text-[#8F896D] py-1 cursor-pointer relative ${
                currentPage === 'about'
                  ? 'text-[#413C23] font-bold after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-[#8F896D]'
                  : 'text-[#413C23]/85'
              }`}
            >
              About
            </button>

            <button
              id="nav-contact-btn"
              onClick={() => navigateTo('contact')}
              className={`transition-colors hover:text-[#8F896D] py-1 cursor-pointer relative ${
                currentPage === 'contact'
                  ? 'text-[#413C23] font-bold after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-[#8F896D]'
                  : 'text-[#413C23]/85'
              }`}
            >
              Contact
            </button>
          </nav>
        </div>

        {/* Center: Brand Monogram / Official Logo (Mathematically Dead-Centered on Mobile and Desktop) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:static lg:translate-x-0 lg:translate-y-0 lg:col-span-2 flex items-center justify-center text-center px-2 z-10 pointer-events-auto">
          <button
            id="nav-brand-monogram-btn"
            onClick={() => navigateTo('home')}
            className="group py-1 flex items-center justify-center transition-transform hover:scale-[1.02] cursor-pointer"
            aria-label="Avirena Home"
          >
            <AvirenaLogo size="custom" className="h-7 sm:h-8 md:h-10 transition-opacity group-hover:opacity-90" />
          </button>
        </div>

        {/* Right: Actions (Wishlist and Account hidden on mobile, visible on desktop) */}
        <div className="flex items-center justify-end space-x-2 sm:space-x-4 lg:space-x-5 lg:col-span-5 text-[#413C23] z-20">
          <button
            id="nav-search-btn"
            onClick={openSearchModal}
            className="p-1.5 text-[#413C23] hover:text-[#8F896D] transition-colors focus:outline-none cursor-pointer flex items-center gap-1"
            aria-label="Search"
            title="Search the Collection"
          >
            <Search className="w-4.5 h-4.5 stroke-[1.4]" />
            <span className="hidden xl:inline text-[11px] uppercase tracking-widest font-medium">Search</span>
          </button>

          {/* Desktop-only Wishlist Button */}
          <button
            id="nav-wishlist-btn"
            onClick={openWishlistModal}
            className="hidden lg:flex relative p-1.5 text-[#413C23] hover:text-[#8F896D] transition-colors focus:outline-none cursor-pointer"
            aria-label="Wishlist"
            title="Saved Pieces"
          >
            <Heart className="w-4.5 h-4.5 stroke-[1.4]" />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-[#7A0F1A] text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Desktop-only User Account Button */}
          <div className="hidden lg:block relative">
            <button
              id="nav-user-account-btn"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="p-1.5 text-[#413C23] hover:text-[#8F896D] transition-colors focus:outline-none cursor-pointer"
              aria-label="Account"
              title="Account"
            >
              <User className="w-4.5 h-4.5 stroke-[1.4]" />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs shadow-xl p-5 z-50 text-left font-sans-body animate-in fade-in duration-150">
                <div className="space-y-4">
                  <div className="border-b border-[#D8D2C2] pb-3">
                    <h4 className="text-xs uppercase tracking-widest font-bold text-[#413C23]">
                      Avirena Atelier Club
                    </h4>
                    <p className="text-[11px] text-[#8F896D] mt-1 font-serif italic">
                      Complimentary bespoke cleaning, early preview access &amp; birthday gifts.
                    </p>
                  </div>

                  {subscribed ? (
                    <div className="py-2 text-center text-xs text-[#413C23] font-medium flex items-center justify-center gap-1.5">
                      <Check className="w-4 h-4 text-[#8F896D]" />
                      <span>Welcome to the Avirena Atelier.</span>
                    </div>
                  ) : (
                    <form onSubmit={handleQuickSignIn} className="space-y-2">
                      <input
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs focus:outline-none focus:border-[#413C23] text-[#413C23]"
                      />
                      <button
                        type="submit"
                        className="w-full py-2 bg-[#413C23] hover:bg-[#8F896D] text-[#E7E4D5] text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors cursor-pointer"
                      >
                        Continue
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Cart Bag button */}
          <button
            id="nav-cart-bag-btn"
            onClick={openCartDrawer}
            className="relative p-2 bg-[#413C23] text-[#E7E4D5] rounded-xs hover:bg-[#8F896D] transition-colors focus:outline-none flex items-center gap-2 cursor-pointer shadow-xs"
            aria-label="Shopping Bag"
            title="View Shopping Bag"
          >
            <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
            <span className="text-xs font-bold font-mono tracking-tight">{cartCount}</span>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex lg:hidden animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-[#413C23]/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* h-dvh (not h-full) so the panel has a definite height on mobile:
              as a flex child of a fixed wrapper, h-full collapsed to its own
              content box and clipped the nav links inside a ~97px scroller.
              dvh also tracks the mobile browser chrome as it hides/shows. */}
          <div className="relative w-[85%] max-w-sm bg-[#E7E4D5] h-dvh max-h-dvh shadow-2xl p-6 flex flex-col justify-between overflow-y-auto overscroll-contain border-r border-[#D8D2C2] z-10 text-left font-sans-body">
            <div className="space-y-6">
              {/* Drawer Top Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-[#D8D2C2]">
                <button
                  onClick={() => navigateTo('home')}
                  className="cursor-pointer"
                  aria-label="Avirena Home"
                >
                  <AvirenaLogo size="custom" className="h-7" />
                </button>
                <button
                  id="mobile-menu-close-btn"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 -mr-1.5 text-[#413C23] hover:text-[#8F896D] transition-colors cursor-pointer rounded-xs"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 stroke-[1.5]" />
                </button>
              </div>

              {/* Mobile Quick Action Buttons: Saved Pieces & Account */}
              <div className="grid grid-cols-2 gap-2.5 pb-1">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openWishlistModal();
                  }}
                  className="py-2.5 px-3 bg-[#FAF8F5] border border-[#D8D2C2] hover:border-[#8F896D] text-[#413C23] text-[11px] font-semibold uppercase tracking-wider rounded-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
                >
                  <Heart className="w-4 h-4 text-[#8F896D]" />
                  <span>Saved ({wishlistCount})</span>
                </button>

                <button
                  onClick={() => setUserDropdownOpen((prev) => !prev)}
                  className={`py-2.5 px-3 bg-[#FAF8F5] border text-[#413C23] text-[11px] font-semibold uppercase tracking-wider rounded-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs ${
                    userDropdownOpen ? 'border-[#413C23] bg-[#F2EFDB]' : 'border-[#D8D2C2] hover:border-[#8F896D]'
                  }`}
                >
                  <User className="w-4 h-4 text-[#8F896D]" />
                  <span>Account</span>
                </button>
              </div>

              {/* Atelier Club / Quick Sign-in Section if toggled */}
              {userDropdownOpen && (
                <div className="p-4 bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs space-y-3 animate-in fade-in duration-150">
                  <div className="border-b border-[#D8D2C2] pb-2">
                    <h4 className="text-[11px] uppercase tracking-widest font-bold text-[#413C23]">
                      Avirena Atelier Club
                    </h4>
                    <p className="text-[10px] text-[#8F896D] font-serif italic mt-0.5">
                      Complimentary cleaning, early preview access &amp; birthday gifts.
                    </p>
                  </div>
                  {subscribed ? (
                    <div className="py-2 text-center text-xs text-[#413C23] font-medium flex items-center justify-center gap-1.5">
                      <Check className="w-4 h-4 text-[#8F896D]" />
                      <span>Welcome to the Avirena Atelier.</span>
                    </div>
                  ) : (
                    <form onSubmit={handleQuickSignIn} className="space-y-2">
                      <input
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full px-3 py-2 text-xs bg-white border border-[#D8D2C2] rounded-xs focus:outline-none focus:border-[#413C23] text-[#413C23]"
                      />
                      <button
                        type="submit"
                        className="w-full py-2 bg-[#413C23] hover:bg-[#8F896D] text-[#E7E4D5] text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors cursor-pointer"
                      >
                        Join Atelier
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* Main Navigation Links */}
              <nav className="flex flex-col space-y-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#413C23]">
                <button
                  onClick={() => navigateTo('home')}
                  className={`text-left py-2.5 px-2 rounded-xs transition-colors cursor-pointer flex items-center justify-between ${
                    currentPage === 'home' ? 'bg-[#FAF8F5] text-[#413C23] font-bold' : 'hover:bg-[#F2EFDB] text-[#413C23]/90'
                  }`}
                >
                  <span>Home</span>
                  {currentPage === 'home' && <span className="text-[10px] text-[#8F896D]">✦</span>}
                </button>

                <button
                  onClick={() => navigateTo('shop', 'all')}
                  className={`text-left py-2.5 px-2 rounded-xs transition-colors cursor-pointer flex items-center justify-between ${
                    currentPage === 'shop' || currentPage === 'collection' ? 'bg-[#FAF8F5] text-[#413C23] font-bold' : 'hover:bg-[#F2EFDB] text-[#413C23]/90'
                  }`}
                >
                  <span>Shop All Jewelry</span>
                  {(currentPage === 'shop' || currentPage === 'collection') && <span className="text-[10px] text-[#8F896D]">✦</span>}
                </button>

                {/* Collections Accordion */}
                <div className="py-1">
                  <button
                    onClick={() => setMobileCollectionsOpen((prev) => !prev)}
                    className="w-full flex items-center justify-between text-left py-2.5 px-2 rounded-xs text-xs font-semibold uppercase tracking-[0.16em] text-[#413C23] hover:bg-[#F2EFDB] transition-colors cursor-pointer"
                  >
                    <span>Collections</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#8F896D] transition-transform duration-200 ${
                        mobileCollectionsOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {mobileCollectionsOpen && (
                    <div className="pl-3 py-1 space-y-1 text-[11px] font-medium text-[#413C23]/80 animate-in fade-in duration-150">
                      {categoryItems.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => selectCategory(cat.id)}
                          className={`flex w-full items-center justify-between gap-2 text-left py-1.5 px-2 rounded-xs hover:bg-[#FAF8F5] transition-colors ${
                            cat.isEmpty ? 'text-[#413C23]/40' : 'text-[#413C23]'
                          }`}
                        >
                          <span>{cat.label}</span>
                          {cat.isEmpty && (
                            <span className="text-[9px] uppercase tracking-[0.12em] text-[#8F896D]">
                              Soon
                            </span>
                          )}
                        </button>
                      ))}
                      <button
                        onClick={() => selectCategory('all')}
                        className="block w-full text-left py-1.5 px-2 font-semibold text-[#8F896D] hover:text-[#413C23] transition-colors"
                      >
                        All Categories →
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => navigateTo('journal')}
                  className={`text-left py-2.5 px-2 rounded-xs transition-colors cursor-pointer flex items-center justify-between ${
                    currentPage === 'journal' ? 'bg-[#FAF8F5] text-[#413C23] font-bold' : 'hover:bg-[#F2EFDB] text-[#413C23]/90'
                  }`}
                >
                  <span>Blog &amp; Journal</span>
                  {currentPage === 'journal' && <span className="text-[10px] text-[#8F896D]">✦</span>}
                </button>

                <button
                  onClick={() => navigateTo('about')}
                  className={`text-left py-2.5 px-2 rounded-xs transition-colors cursor-pointer flex items-center justify-between ${
                    currentPage === 'about' ? 'bg-[#FAF8F5] text-[#413C23] font-bold' : 'hover:bg-[#F2EFDB] text-[#413C23]/90'
                  }`}
                >
                  <span>About Our Brand</span>
                  {currentPage === 'about' && <span className="text-[10px] text-[#8F896D]">✦</span>}
                </button>

                <button
                  onClick={() => navigateTo('contact')}
                  className={`text-left py-2.5 px-2 rounded-xs transition-colors cursor-pointer flex items-center justify-between ${
                    currentPage === 'contact' ? 'bg-[#FAF8F5] text-[#413C23] font-bold' : 'hover:bg-[#F2EFDB] text-[#413C23]/90'
                  }`}
                >
                  <span>Contact &amp; Concierge</span>
                  {currentPage === 'contact' && <span className="text-[10px] text-[#8F896D]">✦</span>}
                </button>
              </nav>
            </div>

            {/* Bottom Footer Info inside Sidebar */}
            <div className="pt-6 border-t border-[#D8D2C2] space-y-3 text-[11px] text-[#8F896D]">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => navigateTo('faq')}
                  className="hover:text-[#413C23] transition-colors cursor-pointer"
                >
                  FAQ &amp; Sizing
                </button>
                <span>•</span>
                <button
                  onClick={() => navigateTo('guides')}
                  className="hover:text-[#413C23] transition-colors cursor-pointer"
                >
                  Care Guides
                </button>
                <span>•</span>
                <button
                  onClick={() => navigateTo('policies')}
                  className="hover:text-[#413C23] transition-colors cursor-pointer"
                >
                  Policies
                </button>
              </div>
              <p className="text-[10px] text-center text-[#413C23]/60 tracking-wider">
                © {new Date().getFullYear()} AVIRENA JEWELS • EST. 2020
              </p>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
};
