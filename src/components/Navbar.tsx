import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, User, Menu, X, Heart, Sparkles, Check, ArrowRight, ChevronRight } from 'lucide-react';
import { PageView, Currency, Category } from '../types';
import { AvirenaLogo } from './AvirenaLogo';

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
  '✨ COMPLIMENTARY EXPRESS SHIPPING ON ORDERS OVER ₹1,999',
  '💎 PREMIUM ANTI-TARNISH BRASS & ORGANIC FRESHWATER PEARLS',
  '🌿 HOMEGROWN HANDCRAFTED DAILYWEAR LUXURY',
  '🎁 COMPLIMENTARY KEEPSAKE TRAVEL POUCH WITH EVERY ORDER',
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [announcementIndex, setAnnouncementIndex] = useState(0);

  // Auto-rotate announcement messages
  useEffect(() => {
    const interval = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const navigateTo = (page: PageView, category?: Category) => {
    setCurrentPage(page);
    if (category && setSelectedCategory) {
      setSelectedCategory(category);
    }
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      {/* 1. TOP ANNOUNCEMENT TICKER */}
      <div className="w-full bg-[#413C23] text-[#E7E4D5] py-2 px-4 text-center">
        <div className="flex items-center justify-center gap-2 text-[10px] sm:text-[11px] font-medium tracking-[0.2em] uppercase">
          <span className="transition-opacity duration-500 ease-in-out">
            {ANNOUNCEMENTS[announcementIndex]}
          </span>
        </div>
      </div>

      {/* 2. MAIN 3-COLUMN NAVIGATION BAR */}
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 h-16 sm:h-20 grid grid-cols-12 items-center font-sans-body">
        
        {/* LEFT COLUMN (Desktop Nav Links & Mobile Menu) */}
        <div className="col-span-4 flex items-center">
          {/* Mobile Hamburger */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(true)}
            className="p-1 -ml-1 text-[#413C23] hover:text-[#8F896D] lg:hidden transition-colors cursor-pointer"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6 stroke-[1.25]" />
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-[11px] xl:text-xs uppercase tracking-[0.18em] font-medium text-[#413C23]">
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
                currentPage === 'collection' || currentPage === 'shop'
                  ? 'text-[#413C23] font-bold after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-[#8F896D]'
                  : 'text-[#413C23]/85'
              }`}
            >
              Shop
            </button>

            <button
              id="nav-collections-btn"
              onClick={() => navigateTo('collections')}
              className={`transition-colors hover:text-[#8F896D] py-1 cursor-pointer relative ${
                currentPage === 'collections'
                  ? 'text-[#413C23] font-bold after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-[#8F896D]'
                  : 'text-[#413C23]/85'
              }`}
            >
              Collections
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
          </nav>
        </div>

        {/* CENTER COLUMN (Strictly Centered Brand Logo) */}
        <div className="col-span-4 flex items-center justify-center text-center">
          <button
            id="nav-brand-monogram-btn"
            onClick={() => navigateTo('home')}
            className="group px-2 py-1 flex items-center justify-center transition-transform hover:scale-[1.02] cursor-pointer"
            aria-label="Avirena Home"
          >
            <AvirenaLogo size="sm" className="h-7 sm:h-9 md:h-10 transition-opacity group-hover:opacity-90" />
          </button>
        </div>

        {/* RIGHT COLUMN (Search, Wishlist, Account, Bag) */}
        <div className="col-span-4 flex items-center justify-end space-x-3 sm:space-x-5 text-[#413C23]">
          {/* Search Trigger */}
          <button
            id="nav-search-btn"
            onClick={openSearchModal}
            className="p-1.5 text-[#413C23] hover:text-[#8F896D] transition-colors focus:outline-none cursor-pointer flex items-center gap-1"
            aria-label="Search"
            title="Search the Collection"
          >
            <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[1.4]" />
            <span className="hidden xl:inline text-[11px] uppercase tracking-widest font-medium">Search</span>
          </button>

          {/* Wishlist Trigger */}
          <button
            id="nav-wishlist-btn"
            onClick={openWishlistModal}
            className="relative p-1.5 text-[#413C23] hover:text-[#8F896D] transition-colors focus:outline-none cursor-pointer"
            aria-label="Wishlist"
            title="Saved Pieces"
          >
            <Heart className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[1.4]" />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-[#7A0F1A] text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* User Sign In Trigger */}
          <div className="relative">
            <button
              id="nav-user-account-btn"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="p-1.5 text-[#413C23] hover:text-[#8F896D] transition-colors focus:outline-none cursor-pointer"
              aria-label="Account"
              title="Account"
            >
              <User className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[1.4]" />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-[#E7E4D5] border border-[#D8D2C2] rounded-xs shadow-xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="space-y-3 text-left">
                  <div className="border-b border-[#D8D2C2] pb-2">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[#8F896D] block">
                      Welcome to Avirena
                    </span>
                    <p className="text-xs text-[#413C23] font-medium mt-0.5">
                      Join for order tracking &amp; exclusive access
                    </p>
                  </div>

                  {subscribed ? (
                    <div className="py-3 text-center space-y-1 bg-[#F4EFE6] border border-[#D8D2C2] rounded-xs">
                      <Check className="w-4 h-4 text-[#413C23] mx-auto" />
                      <p className="text-xs font-semibold text-[#413C23]">Welcome to Avirena</p>
                      <p className="text-[10px] text-[#8F896D]">Check your inbox for updates</p>
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

          {/* Cart Bag Trigger */}
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

      {/* 3. MOBILE SLIDE-OUT MENU OVERLAY */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden animate-in fade-in duration-200">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative w-4/5 max-w-sm bg-[#FAF8F5] h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto border-r border-[#E8E2D6] z-10 text-left font-sans-body">
            <div className="space-y-8">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D6]">
                <AvirenaLogo size="sm" className="h-6" />
                <button
                  id="mobile-menu-close-btn"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-[#5C5850] hover:text-[#111111] cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 stroke-[1.5]" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col space-y-4 text-sm font-semibold uppercase tracking-wider text-[#111111]">
                <button
                  onClick={() => navigateTo('home')}
                  className="text-left py-1 hover:text-[#8F896D] transition-colors cursor-pointer"
                >
                  Home
                </button>
                <button
                  onClick={() => navigateTo('shop', 'all')}
                  className="text-left py-1 hover:text-[#8F896D] transition-colors cursor-pointer"
                >
                  All Jewelry
                </button>
                <div className="pl-4 space-y-2 text-xs font-normal text-[#5C5850]">
                  <button onClick={() => navigateTo('shop', 'rings')} className="block text-left hover:text-[#111111]">Rings</button>
                  <button onClick={() => navigateTo('shop', 'earrings')} className="block text-left hover:text-[#111111]">Earrings</button>
                  <button onClick={() => navigateTo('shop', 'necklaces')} className="block text-left hover:text-[#111111]">Necklaces</button>
                  <button onClick={() => navigateTo('shop', 'bracelets')} className="block text-left hover:text-[#111111]">Bracelets</button>
                </div>
                <button
                  onClick={() => navigateTo('collections')}
                  className="text-left py-1 hover:text-[#8F896D] transition-colors cursor-pointer"
                >
                  Collections
                </button>
                <button
                  onClick={() => navigateTo('about')}
                  className="text-left py-1 hover:text-[#8F896D] transition-colors cursor-pointer"
                >
                  About Our Brand
                </button>
                <button
                  onClick={() => navigateTo('policies')}
                  className="text-left py-1 hover:text-[#8F896D] transition-colors cursor-pointer"
                >
                  Policies &amp; Care
                </button>
                <button
                  onClick={() => navigateTo('contact')}
                  className="text-left py-1 hover:text-[#8F896D] transition-colors cursor-pointer"
                >
                  Contact &amp; Support
                </button>
              </nav>
            </div>

            {/* Mobile Saved Pieces */}
            <div className="pt-6 border-t border-[#E8E2D6] space-y-4">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openWishlistModal();
                }}
                className="w-full py-2.5 bg-white border border-[#E8E2D6] text-[#111111] text-xs font-semibold uppercase tracking-wider rounded-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Heart className="w-4 h-4 text-[#8F896D]" />
                <span>Saved Pieces ({wishlistCount})</span>
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
};
