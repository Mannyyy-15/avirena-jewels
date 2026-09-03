import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, User, Menu, X, Heart, Sparkles, Check, ArrowRight, Globe, ChevronRight } from 'lucide-react';
import { PageView, Currency, Category } from '../types';
import { CURRENCIES } from '../data/products';
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
  currency: Currency;
  setCurrency: (c: Currency) => void;
}

const ANNOUNCEMENTS = [
  '✨ COMPLIMENTARY INSURED EXPRESS SHIPPING OVER $150',
  '💎 HANDCRAFTED 18K THICK GOLD VERMEIL & NATURAL PEARLS',
  '🌿 100% RECYCLED PRECIOUS METALS • 2-YEAR WARRANTY',
  '🎁 LUXURY KEEPSAKE BOX INCLUDED WITH EVERY ORDER',
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
  currency,
  setCurrency,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [announcementIndex, setAnnouncementIndex] = useState(0);

  // Auto-rotate announcement messages
  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const navigateTo = (page: PageView, category?: Category) => {
    setCurrentPage(page);
    if (category && setSelectedCategory) {
      setSelectedCategory(category);
    }
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setCurrencyDropdownOpen(false);
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
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/98 backdrop-blur-md border-b border-[#E8E2D6] transition-all duration-200 w-full">
      {/* 1. TOP ANNOUNCEMENT TICKER */}
      <div className="w-full bg-[#111111] text-[#FAF8F5] py-2 px-4 text-center">
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
            className="p-1 -ml-1 text-[#111111] hover:text-[#D4AF37] lg:hidden transition-colors cursor-pointer"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6 stroke-[1.25]" />
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-[11px] xl:text-xs uppercase tracking-[0.18em] font-medium text-[#111111]">
            <button
              id="nav-home-btn"
              onClick={() => navigateTo('home')}
              className={`transition-colors hover:text-[#D4AF37] py-1 cursor-pointer relative ${
                currentPage === 'home'
                  ? 'text-[#111111] font-bold after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-[#D4AF37]'
                  : 'text-[#111111]/85'
              }`}
            >
              Home
            </button>

            <button
              id="nav-shop-btn"
              onClick={() => navigateTo('shop', 'all')}
              className={`transition-colors hover:text-[#D4AF37] py-1 cursor-pointer relative ${
                currentPage === 'collection' || currentPage === 'shop'
                  ? 'text-[#111111] font-bold after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-[#D4AF37]'
                  : 'text-[#111111]/85'
              }`}
            >
              Shop
            </button>

            <button
              id="nav-collections-btn"
              onClick={() => navigateTo('collections')}
              className={`transition-colors hover:text-[#D4AF37] py-1 cursor-pointer relative ${
                currentPage === 'collections'
                  ? 'text-[#111111] font-bold after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-[#D4AF37]'
                  : 'text-[#111111]/85'
              }`}
            >
              Collections
            </button>

            <button
              id="nav-about-btn"
              onClick={() => navigateTo('about')}
              className={`transition-colors hover:text-[#D4AF37] py-1 cursor-pointer relative ${
                currentPage === 'about'
                  ? 'text-[#111111] font-bold after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-[#D4AF37]'
                  : 'text-[#111111]/85'
              }`}
            >
              About
            </button>

            <button
              id="nav-contact-btn"
              onClick={() => navigateTo('contact')}
              className={`transition-colors hover:text-[#D4AF37] py-1 cursor-pointer relative ${
                currentPage === 'contact'
                  ? 'text-[#111111] font-bold after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-[#D4AF37]'
                  : 'text-[#111111]/85'
              }`}
            >
              Contact
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

        {/* RIGHT COLUMN (Currency, Search, Wishlist, Account, Bag) */}
        <div className="col-span-4 flex items-center justify-end space-x-3 sm:space-x-5 text-[#111111]">
          {/* Currency Selector */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
              className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[#5C5850] hover:text-[#111111] px-2 py-1 rounded-xs border border-[#E8E2D6] hover:border-[#D4AF37] transition-colors cursor-pointer bg-white"
              title="Select currency"
            >
              <Globe className="w-3 h-3 text-[#D4AF37]" />
              <span className="font-semibold">{currency}</span>
              <span className="text-[10px] text-[#5C5850]">({CURRENCIES[currency].symbol})</span>
            </button>

            {currencyDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-[#FAF8F5] border border-[#E8E2D6] rounded-xs shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                {(Object.keys(CURRENCIES) as Currency[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setCurrency(c);
                      setCurrencyDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#F3EFE6] cursor-pointer ${
                      currency === c ? 'font-semibold text-[#111111] bg-[#F3EFE6]' : 'text-[#5C5850]'
                    }`}
                  >
                    <span>{c}</span>
                    <span className="text-[#D4AF37] font-medium">{CURRENCIES[c].symbol}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Trigger */}
          <button
            id="nav-search-btn"
            onClick={openSearchModal}
            className="p-1.5 text-[#111111] hover:text-[#D4AF37] transition-colors focus:outline-none cursor-pointer flex items-center gap-1"
            aria-label="Search"
            title="Search the Atelier"
          >
            <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[1.4]" />
            <span className="hidden xl:inline text-[11px] uppercase tracking-widest font-medium">Search</span>
          </button>

          {/* Wishlist Trigger */}
          <button
            id="nav-wishlist-btn"
            onClick={openWishlistModal}
            className="relative p-1.5 text-[#111111] hover:text-[#D4AF37] transition-colors focus:outline-none cursor-pointer"
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

          {/* Account Trigger */}
          <div className="relative">
            <button
              id="nav-user-btn"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="p-1.5 text-[#111111] hover:text-[#D4AF37] transition-colors focus:outline-none cursor-pointer"
              aria-label="Account"
              title="Atelier Account"
            >
              <User className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[1.4]" />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-3 w-72 sm:w-80 bg-[#FAF8F5] border border-[#E8E2D6] rounded-xs shadow-2xl p-5 z-50 animate-in fade-in zoom-in-95 duration-150 text-left">
                <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D6]">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    <h4 className="font-serif-display text-base text-[#111111]">Atelier Account</h4>
                  </div>
                  <button
                    onClick={() => setUserDropdownOpen(false)}
                    className="text-[#5C5850] hover:text-[#111111] text-xs cursor-pointer"
                  >
                    <X className="w-4 h-4 stroke-[1.5]" />
                  </button>
                </div>

                <div className="py-3 space-y-3">
                  <p className="text-xs text-[#5C5850] leading-relaxed">
                    Access private pre-releases, insured parcel tracking, and bespoke sizing consultations.
                  </p>

                  {subscribed ? (
                    <div className="p-3 bg-white border border-[#D4AF37] rounded-xs flex items-center gap-2 text-xs text-[#111111]">
                      <Check className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <span>Welcome to Avirena Atelier VIP.</span>
                    </div>
                  ) : (
                    <form onSubmit={handleQuickSignIn} className="space-y-2.5">
                      <input
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full text-xs px-3 py-2 bg-white border border-[#E8E2D6] rounded-xs text-[#111111] placeholder-[#5C5850]/70 focus:outline-none focus:border-[#D4AF37]"
                      />
                      <button
                        type="submit"
                        className="w-full py-2 bg-[#111111] hover:bg-[#D4AF37] text-white text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors cursor-pointer"
                      >
                        Sign In / Join VIP
                      </button>
                    </form>
                  )}

                  <div className="pt-2 border-t border-[#E8E2D6] flex flex-col space-y-1.5 text-xs text-[#5C5850]">
                    <button
                      onClick={() => navigateTo('faq')}
                      className="text-left hover:text-[#D4AF37] transition-colors py-1 cursor-pointer flex items-center justify-between"
                    >
                      <span>Shipping & Order Tracking</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => navigateTo('contact')}
                      className="text-left hover:text-[#D4AF37] transition-colors py-1 cursor-pointer flex items-center justify-between"
                    >
                      <span>Bespoke Concierge</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bag / Cart Trigger */}
          <button
            id="nav-cart-drawer-btn"
            onClick={openCartDrawer}
            className="relative py-1.5 px-2.5 bg-[#111111] hover:bg-[#D4AF37] text-white rounded-xs transition-all duration-200 cursor-pointer flex items-center gap-2 shadow-xs active:scale-98"
            aria-label="Shopping Bag"
            title="View Shopping Bag"
          >
            <ShoppingBag className="w-3.5 h-3.5 stroke-[1.8]" />
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest">
              Bag ({cartCount})
            </span>
          </button>
        </div>
      </div>

      {/* 3. MOBILE MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex lg:hidden">
          <div className="w-4/5 max-w-sm bg-[#FAF8F5] h-full shadow-2xl flex flex-col justify-between p-6 animate-in slide-in-from-left duration-300">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#E8E2D6] pb-4">
                <AvirenaLogo size="sm" className="h-7" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-[#5C5850] hover:text-[#111111] cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6 stroke-[1.25]" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col space-y-4 text-sm font-medium text-[#111111]">
                <button
                  onClick={() => navigateTo('home')}
                  className="text-left py-1 hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Home
                </button>
                <button
                  onClick={() => navigateTo('shop', 'all')}
                  className="text-left py-1 hover:text-[#D4AF37] transition-colors cursor-pointer font-semibold"
                >
                  Shop All
                </button>
                <button
                  onClick={() => navigateTo('collections')}
                  className="text-left py-1 hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Collections
                </button>
                <button
                  onClick={() => navigateTo('about')}
                  className="text-left py-1 hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  About Our Atelier
                </button>
                <button
                  onClick={() => navigateTo('contact')}
                  className="text-left py-1 hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Contact & Concierge
                </button>
              </nav>
            </div>

            {/* Mobile Currency & Sign In */}
            <div className="pt-6 border-t border-[#E8E2D6] space-y-4">
              <div className="flex items-center justify-between text-xs text-[#5C5850]">
                <span>Currency</span>
                <div className="flex gap-1.5">
                  {(Object.keys(CURRENCIES) as Currency[]).map((c) => (
                    <button
                      key={c}
                      onClick={() => setCurrency(c)}
                      className={`px-2 py-1 rounded-xs border text-xs cursor-pointer ${
                        currency === c
                          ? 'bg-[#111111] text-white border-[#111111] font-bold'
                          : 'bg-white border-[#E8E2D6] text-[#5C5850]'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openWishlistModal();
                }}
                className="w-full py-2.5 bg-white border border-[#E8E2D6] text-[#111111] text-xs font-semibold uppercase tracking-wider rounded-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Heart className="w-4 h-4 text-[#D4AF37]" />
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
