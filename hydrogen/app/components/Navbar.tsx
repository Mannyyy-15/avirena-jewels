import React, { useState, useRef, Suspense } from 'react';
import { Link, useLocation, Await } from 'react-router';
import { Search, ShoppingBag, Menu, X, Heart, ChevronDown } from 'lucide-react';
import type { CartApiQueryFragment } from 'storefrontapi.generated';
import { AvirenaLogo } from './AvirenaLogo';
import { useOptionalAside } from './Aside';

interface NavbarProps {
  cart?: Promise<CartApiQueryFragment | null> | number;
  cartCount?: number;
  wishlistCount?: number;
  openCartDrawer?: () => void;
  openSearchModal?: () => void;
  openWishlistModal?: () => void;
}

interface AnnouncementItem {
  text: string;
  href?: string;
}

const ANNOUNCEMENTS: AnnouncementItem[] = [
  { text: 'FREE DELIVERY ON ALL ORDERS ACROSS INDIA' },
  { text: 'ANTI-TARNISH BRASS & CULTURED FRESHWATER PEARLS' },
  { text: 'HOMEGROWN DAILYWEAR JEWELLERY FROM MUMBAI' },
  { text: '7-DAY EASY RETURNS & EXCHANGES' },
  { text: 'NICKEL-FREE WITH SURGICAL STEEL POSTS' },
  { text: 'DESIGNED IN INDIA FOR EVERYDAY WEAR' },
];

const CATEGORY_ITEMS = [
  { id: 'earrings', label: 'Earrings', href: '/shop/earrings', count: 12 },
  { id: 'rings', label: 'Rings', href: '/shop/rings', isEmpty: true },
  { id: 'necklaces', label: 'Necklaces', href: '/shop/necklaces', isEmpty: true },
  { id: 'bracelets', label: 'Bracelets', href: '/shop/bracelets', isEmpty: true },
  { id: 'brooches', label: 'Brooches', href: '/shop/brooches', isEmpty: true },
];

const CURATED_EDITS = [
  {
    title: 'Duo Suites',
    tagline: 'Pair & save ₹100 automatically',
    href: '/collections/duo-suites',
  },
  {
    title: 'Under ₹999',
    tagline: 'Architectural daily pieces under ₹999',
    href: '/collections/under-999',
  },
  {
    title: 'The Gifting Edit',
    tagline: 'Timeless heirlooms & modern forms',
    href: '/collections/gifting-edit',
  },
];

export const Navbar: React.FC<NavbarProps> = ({
  cart,
  cartCount = 0,
  wishlistCount = 0,
  openCartDrawer,
  openSearchModal,
  openWishlistModal,
}) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const aside = useOptionalAside();

  const handleOpenCart = openCartDrawer || (aside ? () => aside.open('cart') : undefined);
  const handleOpenSearch = openSearchModal || (aside ? () => aside.open('search') : undefined);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [collectionsDropdownOpen, setCollectionsDropdownOpen] = useState(false);
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

  return (
    <header className="sticky top-0 z-40 bg-[#E7E4D5]/98 backdrop-blur-md border-b border-[#D8D2C2] transition-all duration-200 w-full">
      {/* 1. Announcement Marquee Bar */}
      <div className="w-full bg-black text-white py-2 sm:py-2.5 overflow-hidden border-b border-black marquee-pause select-none">
        <div className="flex animate-infinite-marquee">
          <div className="flex items-center shrink-0">
            {ANNOUNCEMENTS.map((item, idx) => (
              <div key={`ann-track1-${idx}`} className="flex items-center shrink-0 px-6 sm:px-10">
                <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.22em] uppercase text-white whitespace-nowrap">
                  {item.text}
                </span>
                <span className="ml-6 sm:ml-10 text-white/60 text-xs select-none">✦</span>
              </div>
            ))}
          </div>
          <div className="flex items-center shrink-0" aria-hidden="true">
            {ANNOUNCEMENTS.map((item, idx) => (
              <div key={`ann-track2-${idx}`} className="flex items-center shrink-0 px-6 sm:px-10">
                <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.22em] uppercase text-white whitespace-nowrap">
                  {item.text}
                </span>
                <span className="ml-6 sm:ml-10 text-white/60 text-xs select-none">✦</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="relative w-full px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-20 h-16 sm:h-20 flex lg:grid lg:grid-cols-12 items-center justify-between font-sans-body">
        {/* Left: Mobile Menu Toggle & Desktop Navigation Links */}
        <div className="flex items-center lg:col-span-5 z-20">
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 -ml-2 text-black hover:text-neutral-600 lg:hidden transition-colors cursor-pointer"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6 stroke-[1.3]" />
          </button>

          <nav className="hidden lg:flex items-center space-x-5 xl:space-x-7 text-[11px] xl:text-xs uppercase tracking-[0.16em] font-medium text-black">
            <Link
              to="/"
              className={`transition-colors hover:text-neutral-600 py-1 relative ${
                currentPath === '/'
                  ? 'text-black font-bold after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-black'
                  : 'text-black'
              }`}
            >
              Home
            </Link>

            <Link
              to="/shop"
              className={`transition-colors hover:text-neutral-600 py-1 relative ${
                currentPath.startsWith('/shop') && !collectionsDropdownOpen
                  ? 'text-black font-bold after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-black'
                  : 'text-black'
              }`}
            >
              Shop
            </Link>

            {/* Collections Mega Dropdown */}
            <div
              className="relative py-1"
              onMouseEnter={handleCollectionsEnter}
              onMouseLeave={handleCollectionsLeave}
            >
              <Link
                to="/collections"
                className={`inline-flex items-center gap-1 transition-colors hover:text-neutral-600 cursor-pointer relative py-1 ${
                  currentPath.startsWith('/collections') || collectionsDropdownOpen
                    ? 'text-black font-semibold'
                    : 'text-black'
                }`}
                aria-expanded={collectionsDropdownOpen}
              >
                <span>Collections</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 stroke-[1.5] ${
                    collectionsDropdownOpen ? 'rotate-180 text-black' : ''
                  }`}
                />
              </Link>

              {collectionsDropdownOpen && (
                <div
                  className="absolute left-0 top-full pt-2 w-[520px] z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  onMouseEnter={handleCollectionsEnter}
                  onMouseLeave={handleCollectionsLeave}
                >
                  <div className="bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs shadow-[0_20px_45px_rgba(65,60,35,0.12)] p-5 select-none text-left">
                    <div className="grid grid-cols-2 gap-6">
                      {/* Left: Category Navigation */}
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#8F896D] block mb-3 border-b border-[#D8D2C2]/60 pb-1.5">
                          By Category
                        </span>
                        <div className="space-y-1.5">
                          {CATEGORY_ITEMS.map((cat) => (
                            <Link
                              key={cat.id}
                              to={cat.href}
                              onClick={() => setCollectionsDropdownOpen(false)}
                              className="group flex items-center justify-between py-1 px-2 rounded-xs text-xs text-black hover:bg-[#E7E4D5]/60 hover:text-black transition-all"
                            >
                              <span className="font-medium group-hover:translate-x-0.5 transition-transform">
                                {cat.label}
                              </span>
                              {cat.isEmpty ? (
                                <span className="text-[9px] uppercase tracking-wider text-[#8F896D] bg-[#E7E4D5] px-1.5 py-0.5 rounded-2xs font-semibold">
                                  Soon
                                </span>
                              ) : cat.count ? (
                                <span className="text-[10px] text-black">({cat.count})</span>
                              ) : null}
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Right: Curated Edits */}
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#8F896D] block mb-3 border-b border-[#D8D2C2]/60 pb-1.5">
                          Curated Edits
                        </span>
                        <div className="space-y-2">
                          {CURATED_EDITS.map((edit) => (
                            <Link
                              key={edit.title}
                              to={edit.href}
                              onClick={() => setCollectionsDropdownOpen(false)}
                              className="group block p-2 rounded-xs border border-transparent hover:border-[#D8D2C2] hover:bg-[#E7E4D5]/40 transition-all text-left"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-black group-hover:text-black">
                                  {edit.title}
                                </span>
                                <span className="text-xs text-[#8F896D] group-hover:text-black group-hover:translate-x-0.5 transition-transform">
                                  →
                                </span>
                              </div>
                              <p className="text-[11px] text-[#6B6650] mt-0.5 leading-snug">
                                {edit.tagline}
                              </p>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/about"
              className={`transition-colors hover:text-neutral-600 py-1 relative ${
                currentPath === '/about'
                  ? 'text-black font-bold after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-black'
                  : 'text-black'
              }`}
            >
              About
            </Link>

            <Link
              to="/journal"
              className={`transition-colors hover:text-neutral-600 py-1 relative ${
                currentPath === '/journal'
                  ? 'text-black font-bold after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-black'
                  : 'text-black'
              }`}
            >
              Journal
            </Link>
          </nav>
        </div>

        {/* Center: Brand Monogram / Official Logo (Mathematically Dead-Centered on Mobile and Desktop) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:static lg:translate-x-0 lg:translate-y-0 lg:col-span-2 flex items-center justify-center text-center px-2 z-10 pointer-events-auto">
          <Link
            to="/"
            className="group py-1 flex items-center justify-center transition-transform hover:scale-[1.02] cursor-pointer"
            title="AVIRENA Jewels"
            aria-label="Return to AVIRENA Home"
          >
            <AvirenaLogo size="custom" className="h-7 sm:h-8 md:h-10 transition-opacity group-hover:opacity-90" />
          </Link>
        </div>

        {/* Right: Actions (Search, Wishlist, Cart Bag) */}
        <div className="flex items-center justify-end space-x-2 sm:space-x-4 lg:space-x-5 lg:col-span-5 text-black z-20">
          <button
            id="nav-search-btn"
            onClick={handleOpenSearch}
            className="p-1.5 text-black hover:text-neutral-600 transition-colors focus:outline-none cursor-pointer flex items-center gap-1"
            title="Search collection"
            aria-label="Search collection"
          >
            <Search className="w-4.5 h-4.5 stroke-[1.5]" />
            <span className="hidden xl:inline text-[11px] uppercase tracking-widest font-medium">Search</span>
          </button>

          {openWishlistModal && (
            <button
              id="nav-wishlist-btn"
              onClick={openWishlistModal}
              className="p-1.5 text-black hover:text-neutral-600 transition-colors cursor-pointer relative"
              title="Saved pieces"
              aria-label="Saved pieces"
            >
              <Heart className="w-4.5 h-4.5 stroke-[1.5]" />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-black text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </button>
          )}

          <button
            id="nav-cart-btn"
            onClick={handleOpenCart}
            className="p-1.5 text-black hover:text-neutral-600 transition-colors cursor-pointer relative"
            title="Shopping Bag"
            aria-label="Shopping Bag"
          >
            <ShoppingBag className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[1.5]" />
            {typeof cart === 'number' ? (
              cart > 0 && (
                <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-black text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                  {cart}
                </span>
              )
            ) : cartCount > 0 ? (
              <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-black text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            ) : cart ? (
              <Suspense fallback={null}>
                <Await resolve={cart}>
                  {(c) =>
                    c?.totalQuantity ? (
                      <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-black text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                        {c.totalQuantity}
                      </span>
                    ) : null
                  }
                </Await>
              </Suspense>
            ) : null}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-[#FAF8F5] p-6 shadow-2xl overflow-y-auto flex flex-col justify-between z-10 text-left">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#D8D2C2]">
                <AvirenaLogo size="sm" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-black hover:text-neutral-600"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-6 space-y-4 font-sans-body">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-semibold uppercase tracking-wider text-black hover:text-neutral-600"
                >
                  Home
                </Link>
                <Link
                  to="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-semibold uppercase tracking-wider text-black hover:text-neutral-600"
                >
                  Shop All
                </Link>
                <Link
                  to="/collections"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-semibold uppercase tracking-wider text-black hover:text-neutral-600"
                >
                  Curated Suites
                </Link>
                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-semibold uppercase tracking-wider text-black hover:text-neutral-600"
                >
                  About Us
                </Link>
                <Link
                  to="/faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-semibold uppercase tracking-wider text-black hover:text-neutral-600"
                >
                  FAQ &amp; Sizing
                </Link>
                <Link
                  to="/journal"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-semibold uppercase tracking-wider text-black hover:text-neutral-600"
                >
                  Styling Journal
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-semibold uppercase tracking-wider text-black hover:text-neutral-600"
                >
                  Contact Concierge
                </Link>
              </div>
            </div>

            <div className="pt-6 border-t border-[#D8D2C2] text-xs text-[#6B6650]">
              <p>© {new Date().getFullYear()} Avirena Jewels</p>
              <p className="mt-1">Handcrafted with anti-tarnish protective coating</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
