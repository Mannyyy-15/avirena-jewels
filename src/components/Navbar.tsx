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

      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 h-16 sm:h-20 grid grid-cols-12 items-center font-sans-body">
        <div className="col-span-5 flex items-center">
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(true)}
            className="p-1 -ml-1 text-[#413C23] hover:text-[#8F896D] lg:hidden transition-colors cursor-pointer"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6 stroke-[1.25]" />
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

        <div className="col-span-2 flex items-center justify-center text-center">
          <button
            id="nav-brand-monogram-btn"
            onClick={() => navigateTo('home')}
            className="group px-2 py-1 flex items-center justify-center transition-transform hover:scale-[1.02] cursor-pointer"
            aria-label="Avirena Home"
          >
            <AvirenaLogo size="sm" className="h-7 sm:h-9 md:h-10 transition-opacity group-hover:opacity-90" />
          </button>
        </div>

        <div className="col-span-5 flex items-center justify-end space-x-3 sm:space-x-5 text-[#413C23]">
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

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden animate-in fade-in duration-200">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative w-4/5 max-w-sm bg-[#FAF8F5] h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto border-r border-[#E8E2D6] z-10 text-left font-sans-body">
            <div className="space-y-6">
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

              <nav className="flex flex-col space-y-3 text-sm font-semibold uppercase tracking-wider text-[#111111]">
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
                  Shop All Jewelry
                </button>

                <div className="border-y border-[#E8E2D6]/80 py-2">
                  <button
                    onClick={() => setMobileCollectionsOpen((prev) => !prev)}
                    className="w-full flex items-center justify-between text-left py-1 text-sm font-semibold uppercase tracking-wider text-[#111111] hover:text-[#8F896D] transition-colors cursor-pointer"
                  >
                    <span>Collections</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#8F896D] transition-transform duration-200 ${
                        mobileCollectionsOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {mobileCollectionsOpen && (
                    <div className="pl-3 pt-2 space-y-2 text-xs font-normal text-[#5C5850] animate-in fade-in duration-150">
                      {categoryItems.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => selectCategory(cat.id)}
                          className={`flex w-full items-center justify-between gap-2 text-left py-1 transition-colors ${
                            cat.isEmpty ? 'text-[#5C5850]/50 hover:text-[#5C5850]' : 'hover:text-[#111111]'
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
                        className="block w-full text-left py-1 font-semibold text-[#8F896D] hover:text-[#413C23] transition-colors"
                      >
                        All Categories →
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => navigateTo('journal')}
                  className="text-left py-1 hover:text-[#8F896D] transition-colors cursor-pointer"
                >
                  Blog &amp; Journal
                </button>

                <button
                  onClick={() => navigateTo('about')}
                  className="text-left py-1 hover:text-[#8F896D] transition-colors cursor-pointer"
                >
                  About Our Brand
                </button>

                <button
                  onClick={() => navigateTo('contact')}
                  className="text-left py-1 hover:text-[#8F896D] transition-colors cursor-pointer"
                >
                  Contact &amp; Support
                </button>

                <button
                  onClick={() => navigateTo('faq')}
                  className="text-left py-1 hover:text-[#8F896D] transition-colors cursor-pointer"
                >
                  FAQ &amp; Sizing
                </button>

                <button
                  onClick={() => navigateTo('guides')}
                  className="text-left py-1 hover:text-[#8F896D] transition-colors cursor-pointer"
                >
                  Jewelry Guides
                </button>

                <button
                  onClick={() => navigateTo('policies')}
                  className="text-left py-1 hover:text-[#8F896D] transition-colors cursor-pointer"
                >
                  Policies &amp; Care
                </button>
              </nav>
            </div>

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
