import React, { useState } from 'react';
import { PageView, Category } from '../types';
import { PaymentBadges } from './PaymentBadges';
import { Truck, RotateCcw, ShieldCheck, MessageCircle, Check, ArrowRight } from 'lucide-react';

interface FooterProps {
  setCurrentPage: (page: PageView) => void;
  onNavigateToPolicy?: (tab: 'returns' | 'privacy' | 'terms' | 'shipping' | 'contact' | 'legal') => void;
  openStoryModal: () => void;
  openCareModal: () => void;
  setSelectedCategory?: (cat: Category) => void;
}

export const Footer: React.FC<FooterProps> = ({
  setCurrentPage,
  onNavigateToPolicy,
  openStoryModal,
  openCareModal,
  setSelectedCategory,
}) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNavigate = (page: PageView, category?: Category) => {
    setCurrentPage(page);
    if (category && setSelectedCategory) {
      setSelectedCategory(category);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePolicyClick = (tab: 'returns' | 'privacy' | 'terms' | 'shipping' | 'contact' | 'legal') => {
    if (onNavigateToPolicy) {
      onNavigateToPolicy(tab);
    } else {
      setCurrentPage('policies');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;
    setIsSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
      setIsSubscribed(false);
    }, 4500);
  };

  return (
    <footer className="w-full bg-black text-white font-sans-body select-none overflow-hidden border-t border-white/15 relative">

      {/* =========================================================================
          1. VALUE & TRUST PILLARS STRIP (Clean monochrome 4-pillar bar)
          ========================================================================= */}
      <div className="w-full border-b border-white/15 px-5 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          
          {/* Pillar 1: Free Delivery */}
          <div className="flex items-center gap-4 group">
            <div className="w-11 h-11 rounded-full border border-white/20 bg-white/5 flex items-center justify-center shrink-0 transition-colors duration-300 group-hover:border-white group-hover:bg-white group-hover:text-black text-white">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-[13px] uppercase tracking-[0.14em] font-bold text-white">
                Free Pan-India Delivery
              </h4>
              <p className="text-xs text-neutral-400 mt-0.5">
                All prepaid &amp; COD orders insured &amp; tracked
              </p>
            </div>
          </div>

          {/* Pillar 2: 7-Day Returns */}
          <div className="flex items-center gap-4 group">
            <div className="w-11 h-11 rounded-full border border-white/20 bg-white/5 flex items-center justify-center shrink-0 transition-colors duration-300 group-hover:border-white group-hover:bg-white group-hover:text-black text-white">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-[13px] uppercase tracking-[0.14em] font-bold text-white">
                7-Day Easy Returns
              </h4>
              <p className="text-xs text-neutral-400 mt-0.5">
                Unworn pieces in original box, hassle-free
              </p>
            </div>
          </div>

          {/* Pillar 3: Anti-Tarnish */}
          <div className="flex items-center gap-4 group">
            <div className="w-11 h-11 rounded-full border border-white/20 bg-white/5 flex items-center justify-center shrink-0 transition-colors duration-300 group-hover:border-white group-hover:bg-white group-hover:text-black text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-[13px] uppercase tracking-[0.14em] font-bold text-white">
                Anti-Tarnish &amp; Safe
              </h4>
              <p className="text-xs text-neutral-400 mt-0.5">
                Surgical steel posts, hypoallergenic &amp; nickel-free
              </p>
            </div>
          </div>

          {/* Pillar 4: WhatsApp Concierge */}
          <div className="flex items-center gap-4 group">
            <div className="w-11 h-11 rounded-full border border-white/20 bg-white/5 flex items-center justify-center shrink-0 transition-colors duration-300 group-hover:border-white group-hover:bg-white group-hover:text-black text-white">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-[13px] uppercase tracking-[0.14em] font-bold text-white">
                WhatsApp Concierge
              </h4>
              <p className="text-xs text-neutral-400 mt-0.5">
                Direct styling &amp; order support 7 days a week
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* =========================================================================
          2. EDITORIAL STATEMENT & NEWSLETTER BAR
          ========================================================================= */}
      <div className="w-full border-b border-white/15 px-5 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Editorial Brand Statement */}
          <div className="lg:col-span-6 space-y-3 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/5 text-[11px] uppercase tracking-[0.2em] text-neutral-300">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Atelier &amp; Design • Crafted in India
            </div>
            <h3 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-white tracking-tight leading-[1.2]">
              Modern anti-tarnish jewelry. <br className="hidden sm:inline" />
              Crafted for every day.
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Sculpted brass silhouettes protected with durable anti-tarnish coatings and hypoallergenic surgical steel posts for sensitive skin.
            </p>
          </div>

          {/* Newsletter Box */}
          <div className="lg:col-span-6 space-y-3 text-center lg:text-left">
            <h4 className="text-xs sm:text-sm uppercase font-bold tracking-[0.18em] text-white">
              Join The Avirena Edit
            </h4>
            <p className="text-xs sm:text-sm text-neutral-300">
              Subscribe for private drop announcements, styling notes, and curated seasonal edits.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="w-full max-w-md mx-auto lg:mx-0 pt-1">
              {isSubscribed ? (
                <div className="flex items-center justify-center lg:justify-start gap-2.5 bg-white/10 border border-white/30 rounded-full px-5 py-3 text-xs sm:text-sm text-white">
                  <Check className="w-4 h-4 text-white shrink-0" />
                  <span>Welcome to the Avirena Edit. Thank you for subscribing!</span>
                </div>
              ) : (
                <div className="flex items-center rounded-full border border-white/30 bg-white/5 hover:border-white/60 focus-within:border-white focus-within:bg-white/10 p-1.5 pl-5 transition-all">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    aria-label="Email Address for Avirena newsletter"
                    className="w-full bg-transparent text-white placeholder-neutral-500 text-xs sm:text-sm outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-full bg-white text-black hover:bg-neutral-200 hover:shadow-lg px-6 py-2.5 text-xs sm:text-sm font-bold tracking-wide transition-all cursor-pointer shrink-0 flex items-center gap-1.5 active:scale-95"
                  >
                    <span>Subscribe</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </form>
          </div>

        </div>
      </div>

      {/* =========================================================================
          3. FOUR-COLUMN MONOCHROME NAVIGATION GRID
          ========================================================================= */}
      <div className="w-full px-5 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">

          {/* Col 1: Brand Ethos & Socials (lg: 4 cols) */}
          <div className="lg:col-span-4 space-y-5 text-left">
            <button
              onClick={() => handleNavigate('home')}
              className="cursor-pointer focus:outline-none text-left block group"
              aria-label="AVIRENA Home"
            >
              <span className="font-serif-display text-2xl sm:text-3xl font-bold tracking-[0.16em] uppercase text-white group-hover:text-neutral-300 transition-colors">
                AVIRENA
              </span>
              <span className="block text-[10px] tracking-[0.28em] uppercase text-neutral-400 font-sans-body mt-0.5">
                Jewels • Atelier
              </span>
            </button>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Everyday luxury jewelry sculpted in durable brass with anti-tarnish protective coatings and hypoallergenic surgical steel posts. Fashion jewellery crafted for timeless comfort.
            </p>

            <div className="space-y-1.5 pt-1 text-[11px] uppercase tracking-wider text-neutral-300">
              <p>• Surgical Steel Hypoallergenic Posts</p>
              <p>• Nickel-Free, Lead-Free &amp; Cadmium-Free</p>
              <p>• Free Insured Delivery Across India</p>
            </div>

            {/* Social Icons */}
            <div className="pt-2">
              <h5 className="text-[11px] uppercase font-bold tracking-[0.18em] text-white mb-3">
                Follow The Story
              </h5>
              <div className="flex items-center gap-3">
                {/* 1. Instagram */}
                <a
                  href="https://www.instagram.com/avirenajewels/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  title="Follow on Instagram"
                  className="w-10 h-10 rounded-full border border-white/20 bg-white/5 flex items-center justify-center transition-all duration-200 hover:scale-110 hover:border-white hover:bg-white hover:text-black text-white"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </a>

                {/* 2. Facebook */}
                <a
                  href="https://www.facebook.com/profile.php?id=61594070437997"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  title="Follow on Facebook"
                  className="w-10 h-10 rounded-full border border-white/20 bg-white/5 flex items-center justify-center transition-all duration-200 hover:scale-110 hover:border-white hover:bg-white hover:text-black text-white"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>

                {/* 3. WhatsApp Concierge */}
                <a
                  href="https://wa.me/917823889290"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp Concierge"
                  title="Chat with Concierge"
                  className="w-10 h-10 rounded-full border border-white/20 bg-white/5 flex items-center justify-center transition-all duration-200 hover:scale-110 hover:border-white hover:bg-white hover:text-black text-white"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                </a>

                {/* 4. Pinterest */}
                <a
                  href="https://www.pinterest.com/avirenajewels"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Pinterest"
                  title="Follow on Pinterest"
                  className="w-10 h-10 rounded-full border border-white/20 bg-white/5 flex items-center justify-center transition-all duration-200 hover:scale-110 hover:border-white hover:bg-white hover:text-black text-white"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.332 1.365-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: The Collection (lg: 2.5 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs sm:text-[13px] uppercase font-bold tracking-[0.16em] text-white">
              The Collection
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-[13px] text-neutral-300">
              <li>
                <a
                  href="/shop"
                  onClick={(e) => { e.preventDefault(); handleNavigate('collection', 'all'); }}
                  className="hover:text-white hover:underline transition-colors block py-0.5"
                >
                  Shop All Jewelry
                </a>
              </li>
              <li>
                <a
                  href="/shop/earrings"
                  onClick={(e) => { e.preventDefault(); handleNavigate('collection', 'earrings'); }}
                  className="hover:text-white hover:underline transition-colors block py-0.5"
                >
                  Earrings &amp; Hoops
                </a>
              </li>
              <li>
                <a
                  href="/collections"
                  onClick={(e) => { e.preventDefault(); handleNavigate('collections'); }}
                  className="hover:text-white hover:underline transition-colors block py-0.5"
                >
                  Signature Suites
                </a>
              </li>
              <li>
                <a
                  href="/shop"
                  onClick={(e) => { e.preventDefault(); handleNavigate('collection', 'all'); }}
                  className="hover:text-white hover:underline transition-colors block py-0.5"
                >
                  Gifting Edit
                </a>
              </li>
              <li>
                <a
                  href="/shop"
                  onClick={(e) => { e.preventDefault(); handleNavigate('collection', 'all'); }}
                  className="hover:text-white hover:underline transition-colors block py-0.5"
                >
                  Under ₹999 Edit
                </a>
              </li>
              <li>
                <a
                  href="/shop"
                  onClick={(e) => { e.preventDefault(); handleNavigate('collection', 'all'); }}
                  className="hover:text-white hover:underline transition-colors block py-0.5"
                >
                  Bestsellers
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Atelier & Journal (lg: 2.5 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs sm:text-[13px] uppercase font-bold tracking-[0.16em] text-white">
              Journal &amp; Craft
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-[13px] text-neutral-300">
              <li>
                <a
                  href="/about"
                  onClick={(e) => { e.preventDefault(); handleNavigate('about'); }}
                  className="hover:text-white hover:underline transition-colors block py-0.5"
                >
                  About Avirena
                </a>
              </li>
              <li>
                <a
                  href="/journal"
                  onClick={(e) => { e.preventDefault(); handleNavigate('journal'); }}
                  className="hover:text-white hover:underline transition-colors block py-0.5"
                >
                  Styling Journal
                </a>
              </li>
              <li>
                <a
                  href="/guides"
                  onClick={(e) => { e.preventDefault(); handleNavigate('guides'); }}
                  className="hover:text-white hover:underline transition-colors block py-0.5"
                >
                  Care &amp; Materials Guides
                </a>
              </li>
              <li>
                <a
                  href="/faq"
                  onClick={(e) => { e.preventDefault(); handleNavigate('faq'); }}
                  className="hover:text-white hover:underline transition-colors block py-0.5"
                >
                  FAQ &amp; Sizing
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={openCareModal}
                  className="hover:text-white hover:underline transition-colors block py-0.5 text-left cursor-pointer"
                >
                  Jewelry Care Routine
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Support & Policies (lg: 3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs sm:text-[13px] uppercase font-bold tracking-[0.16em] text-white">
              Client Concierge
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-[13px] text-neutral-300">
              <li>
                <a
                  href="/contact"
                  onClick={(e) => { e.preventDefault(); handleNavigate('contact'); }}
                  className="hover:text-white hover:underline transition-colors block py-0.5"
                >
                  Contact Concierge
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/917823889290"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:underline transition-colors block py-0.5"
                >
                  WhatsApp: +91 78238 89290
                </a>
              </li>
              <li>
                <a
                  href="/refund-policy"
                  onClick={(e) => { e.preventDefault(); handlePolicyClick('returns'); }}
                  className="hover:text-white hover:underline transition-colors block py-0.5"
                >
                  7-Day Return &amp; Refund
                </a>
              </li>
              <li>
                <a
                  href="/shipping-policy"
                  onClick={(e) => { e.preventDefault(); handlePolicyClick('shipping'); }}
                  className="hover:text-white hover:underline transition-colors block py-0.5"
                >
                  Shipping &amp; Delivery Policy
                </a>
              </li>
              <li>
                <a
                  href="/privacy-policy"
                  onClick={(e) => { e.preventDefault(); handlePolicyClick('privacy'); }}
                  className="hover:text-white hover:underline transition-colors block py-0.5"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms-of-service"
                  onClick={(e) => { e.preventDefault(); handlePolicyClick('terms'); }}
                  className="hover:text-white hover:underline transition-colors block py-0.5"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="/legal-notice"
                  onClick={(e) => { e.preventDefault(); handlePolicyClick('legal'); }}
                  className="hover:text-white hover:underline transition-colors block py-0.5"
                >
                  Legal Notice
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* =========================================================================
          4. GRAND ARCHITECTURAL WHITE SIGNATURE LOGO
          ========================================================================= */}
      <div className="w-full px-5 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-8 sm:py-12 border-t border-white/15 flex items-center justify-center">
        <button
          onClick={() => handleNavigate('home')}
          className="w-full flex items-center justify-center cursor-pointer focus:outline-none transition-transform duration-300 hover:opacity-90 active:scale-[0.99]"
          title="Return to AVIRENA Home"
          aria-label="Return to AVIRENA Home"
        >
          <img
            src="/logo-white.png"
            alt="AVIRENA Jewels"
            className="w-full max-w-4xl h-auto object-contain select-none opacity-90 hover:opacity-100 transition-opacity"
            loading="lazy"
          />
        </button>
      </div>

      {/* =========================================================================
          5. BOTTOM BAR (Monochrome Legal & Payment Badges)
          ========================================================================= */}
      <div className="w-full border-t border-white/15 px-5 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-6 sm:py-8 bg-black">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-5 text-center lg:text-left">
          
          {/* Copyright & Agency Credits */}
          <div className="space-y-1">
            <p className="text-xs text-neutral-300">
              © {new Date().getFullYear()} AVIRENA JEWELS. All rights reserved.
            </p>
            <p className="text-[11px] text-neutral-400">
              Atelier &amp; Brand by{' '}
              <a
                href="https://thepiecraftmarketing.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 text-white hover:text-neutral-300 font-medium transition-colors"
              >
                The PieCraft Marketing
              </a>
            </p>
          </div>

          {/* Trust Statement */}
          <p className="text-[11px] uppercase tracking-[0.16em] text-neutral-400 font-medium">
            100% Verified Secure Checkout • All Major Cards, UPI &amp; Netbanking
          </p>

          {/* Payment Badges */}
          <div>
            <PaymentBadges />
          </div>

        </div>
      </div>

    </footer>
  );
};
