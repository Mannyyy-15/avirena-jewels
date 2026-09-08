import React, { useState } from 'react';
import { PageView, Category } from '../types';
import { PaymentBadges } from './PaymentBadges';
import { ShieldCheck, RotateCcw, MessageCircle, ArrowRight, Sparkles, Check } from 'lucide-react';

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
    <footer className="w-full bg-[#141310] text-[#FAF8F5] font-sans-body select-none overflow-hidden pt-12 sm:pt-16 pb-6 sm:pb-8 px-4 sm:px-8 lg:px-14 xl:px-20 border-t border-[#D4AF37]/20 relative">
      
      {/* Decorative ambient gold glow in the background */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-32 bg-radial from-[#D4AF37]/10 to-transparent pointer-events-none blur-2xl"
        aria-hidden="true" 
      />

      {/* =========================================================================
          SECTION 1: ATELIER PILLARS & CLIENT REASSURANCE BAR
          ========================================================================= */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 sm:pb-14 border-b border-white/10 text-center md:text-left relative z-10">
        
        {/* Pillar 1: Anti-Tarnish Assurance */}
        <div className="flex items-center gap-4 justify-center md:justify-start group">
          <div className="w-12 h-12 rounded-full bg-[#201E18] border border-[#D4AF37]/30 flex items-center justify-center shrink-0 group-hover:border-[#D4AF37] group-hover:scale-105 transition-all duration-300">
            <ShieldCheck className="w-6 h-6 text-[#D4AF37]" strokeWidth={1.5} />
          </div>
          <div>
            <h5 className="text-xs uppercase font-bold tracking-[0.18em] text-white">
              Anti-Tarnish Assurance
            </h5>
            <p className="text-[12px] text-white/60 font-light mt-0.5 leading-snug">
              Solid brass core &amp; double e-coating for active daily wear
            </p>
          </div>
        </div>

        {/* Pillar 2: 14-Day Seamless Exchanges */}
        <div className="flex items-center gap-4 justify-center md:justify-start group">
          <div className="w-12 h-12 rounded-full bg-[#201E18] border border-[#D4AF37]/30 flex items-center justify-center shrink-0 group-hover:border-[#D4AF37] group-hover:scale-105 transition-all duration-300">
            <RotateCcw className="w-5 h-5 text-[#D4AF37]" strokeWidth={1.5} />
          </div>
          <div>
            <h5 className="text-xs uppercase font-bold tracking-[0.18em] text-white">
              14-Day Easy Exchanges
            </h5>
            <p className="text-[12px] text-white/60 font-light mt-0.5 leading-snug">
              Hassle-free size adjustment &amp; exchange guarantee
            </p>
          </div>
        </div>

        {/* Pillar 3: Dedicated Atelier Concierge */}
        <div className="flex items-center gap-4 justify-center md:justify-start group">
          <div className="w-12 h-12 rounded-full bg-[#201E18] border border-[#25D366]/40 flex items-center justify-center shrink-0 group-hover:border-[#25D366] group-hover:scale-105 transition-all duration-300">
            <MessageCircle className="w-5 h-5 text-[#25D366]" strokeWidth={1.5} />
          </div>
          <div>
            <h5 className="text-xs uppercase font-bold tracking-[0.18em] text-white">
              Direct Concierge Support
            </h5>
            <a
              href="https://wa.me/917823889290"
              target="_blank"
              rel="noreferrer"
              className="text-[12px] text-[#25D366] hover:underline font-medium mt-0.5 block"
            >
              Chat on WhatsApp (+91 78238 89290)
            </a>
          </div>
        </div>

      </div>

      {/* =========================================================================
          SECTION 2: MULTI-COLUMN ARCHITECTURE (4 COLUMNS)
          ========================================================================= */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 py-12 sm:py-16 text-left relative z-10">
        
        {/* COLUMN 1: OUR COMPANY (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <h4 className="text-xs uppercase tracking-[0.22em] font-bold text-white">
              Our Company
            </h4>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-[13px] text-white/70 font-light">
            <li>
              <button
                onClick={() => handleNavigate('home')}
                className="hover:text-[#D4AF37] transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
              >
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#D4AF37]">›</span>
                <span>Home</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigate('collection', 'all')}
                className="hover:text-[#D4AF37] transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
              >
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#D4AF37]">›</span>
                <span>All products</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigate('collection', 'all')}
                className="hover:text-[#D4AF37] transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
              >
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#D4AF37]">›</span>
                <span>Men's Collection</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigate('collection', 'all')}
                className="hover:text-[#D4AF37] transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
              >
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#D4AF37]">›</span>
                <span>Women's Collection</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigate('collection', 'all')}
                className="hover:text-[#D4AF37] transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
              >
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#D4AF37]">›</span>
                <span>Mangalsutra Collection</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigate('about')}
                className="hover:text-[#D4AF37] transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
              >
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#D4AF37]">›</span>
                <span>About Us</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigate('contact')}
                className="hover:text-[#D4AF37] transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
              >
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#D4AF37]">›</span>
                <span>Contact Us</span>
              </button>
            </li>
          </ul>
        </div>

        {/* COLUMN 2: CUSTOMER SERVICE (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <h4 className="text-xs uppercase tracking-[0.22em] font-bold text-white">
              Customer Service
            </h4>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-[13px] text-white/70 font-light">
            <li>
              <button
                onClick={() => handlePolicyClick('legal')}
                className="hover:text-[#D4AF37] transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
              >
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#D4AF37]">›</span>
                <span>Legal Notice</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handlePolicyClick('privacy')}
                className="hover:text-[#D4AF37] transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
              >
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#D4AF37]">›</span>
                <span>Privacy Policy</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handlePolicyClick('returns')}
                className="hover:text-[#D4AF37] transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
              >
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#D4AF37]">›</span>
                <span>Refund Policy</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handlePolicyClick('shipping')}
                className="hover:text-[#D4AF37] transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
              >
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#D4AF37]">›</span>
                <span>Shipping Policy</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handlePolicyClick('terms')}
                className="hover:text-[#D4AF37] transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
              >
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#D4AF37]">›</span>
                <span>Terms of Service</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handlePolicyClick('contact')}
                className="hover:text-[#D4AF37] transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
              >
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#D4AF37]">›</span>
                <span>Contact Information</span>
              </button>
            </li>
          </ul>
        </div>

        {/* COLUMN 3: ATELIER CRAFT & GUIDES (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <h4 className="text-xs uppercase tracking-[0.22em] font-bold text-white">
              The Atelier
            </h4>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-[13px] text-white/70 font-light">
            <li>
              <button
                onClick={() => handleNavigate('guides')}
                className="hover:text-[#D4AF37] transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
              >
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#D4AF37]">›</span>
                <span>Care &amp; Materials Guide</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigate('faq')}
                className="hover:text-[#D4AF37] transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
              >
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#D4AF37]">›</span>
                <span>Ring Size Guide</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigate('journal')}
                className="hover:text-[#D4AF37] transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
              >
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#D4AF37]">›</span>
                <span>Styling Journal</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigate('collections')}
                className="hover:text-[#D4AF37] transition-colors cursor-pointer text-left flex items-center gap-1.5 group"
              >
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#D4AF37]">›</span>
                <span>Curated Suites</span>
              </button>
            </li>
          </ul>
        </div>

        {/* COLUMN 4: SUBSCRIBE TO AVIRENA JEWELS & SOCIALS (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <h4 className="text-xs uppercase tracking-[0.22em] font-bold text-white">
              Subscribe to Avirena Jewels
            </h4>
          </div>
          <p className="text-xs text-white/70 font-light leading-relaxed">
            Receive insights into modern sculptural jewelry, updates on new artisan piece launches, and exclusive community privileges.
          </p>

          {/* Newsletter Form */}
          <form onSubmit={handleNewsletterSubmit} className="pt-1">
            {isSubscribed ? (
              <div className="w-full bg-[#201E18] border border-[#D4AF37]/50 text-white rounded-md px-4 py-3 text-xs flex items-center gap-2.5">
                <Check className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span className="text-[#FAF8F5]">Thank you for subscribing to AVIRENA Privileges!</span>
              </div>
            ) : (
              <div className="flex items-center rounded-md bg-[#201E18] p-1 border border-white/15 focus-within:border-[#D4AF37] transition-colors shadow-inner">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Email address"
                  required
                  aria-label="Email address for newsletter"
                  className="flex-1 px-3 py-2 text-xs text-white placeholder-white/40 bg-transparent focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-[#7A0F1A] hover:bg-[#921220] text-white px-5 py-2 text-xs font-bold uppercase tracking-wider rounded transition-all cursor-pointer shrink-0 shadow-sm active:scale-95 flex items-center gap-1"
                >
                  <span>Sign Up</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </form>

          {/* Social Circles Row: Instagram, Facebook, WhatsApp, Pinterest */}
          <div className="pt-2">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-2.5 font-medium">
              Join Our Community
            </p>
            <div className="flex items-center gap-3">
              {/* 1. Instagram */}
              <a
                href="https://www.instagram.com/avirenajewels/"
                target="_blank"
                rel="noreferrer"
                aria-label="Follow Avirena Jewels on Instagram"
                title="Follow us on Instagram"
                className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-115 shadow-sm text-white"
                style={{
                  background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)',
                }}
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
                aria-label="Connect on Facebook"
                title="Follow us on Facebook"
                className="w-8 h-8 rounded-full bg-[#1877F2] flex items-center justify-center transition-transform hover:scale-115 shadow-sm text-white"
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
                aria-label="Chat with Atelier Concierge on WhatsApp"
                title="Chat with us on WhatsApp (+91 78238 89290)"
                className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center transition-transform hover:scale-115 shadow-sm text-white"
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
                aria-label="Avirena Jewels Pinterest Moodboard"
                title="Follow us on Pinterest"
                className="w-8 h-8 rounded-full bg-[#E60023] flex items-center justify-center transition-transform hover:scale-115 shadow-sm text-white"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.332 1.365-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* =========================================================================
          SECTION 3: GRAND CENTER LOGO STATEMENT
          "logo should be big in centere else change everything"
          ========================================================================= */}
      <div className="w-full my-6 sm:my-10 relative">
        {/* Subtle dual hairline borders with center cutout */}
        <div className="w-full flex items-center justify-center gap-4 sm:gap-8">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-[#D4AF37]/60" />
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37]/70 font-serif">
            Atelier Par Excellence
          </span>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#D4AF37]/30 to-[#D4AF37]/60" />
        </div>

        {/* Large Prominent Centered Logo */}
        <div className="w-full py-8 sm:py-12 flex items-center justify-center overflow-hidden">
          <button
            onClick={() => handleNavigate('home')}
            className="group cursor-pointer focus:outline-none transition-transform duration-500 hover:scale-[1.02] active:scale-[0.99] flex flex-col items-center justify-center"
            title="Return to AVIRENA Home"
            aria-label="AVIRENA Jewels Home"
          >
            <img
              src="/logo-white.png"
              alt="AVIRENA"
              className="w-[88vw] sm:w-[75vw] md:w-[65vw] lg:w-[55vw] max-w-[860px] h-auto object-contain select-none drop-shadow-[0_4px_24px_rgba(212,175,55,0.15)] group-hover:drop-shadow-[0_4px_30px_rgba(212,175,55,0.25)] transition-all duration-300"
              loading="lazy"
            />
          </button>
        </div>

        {/* Bottom hairline border */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </div>

      {/* =========================================================================
          SECTION 4: PAYMENT METHODS BADGES STRIP
          ========================================================================= */}
      <div className="max-w-7xl mx-auto py-4 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10">
        <div className="text-center sm:text-left">
          <p className="text-[11px] uppercase tracking-[0.16em] text-white/50 font-medium">
            100% Encrypted &amp; Verified Checkout
          </p>
          <p className="text-[11px] text-white/40 font-light">
            All major debit/credit cards, UPI apps &amp; Net Banking accepted
          </p>
        </div>
        <PaymentBadges />
      </div>

      {/* =========================================================================
          SECTION 5: BRAND CREDITS & COPYRIGHT BAR
          ========================================================================= */}
      <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-xs text-white/60 font-light">
        <p className="tracking-wide">
          AVIRENA is an atelier jewellery venture by{' '}
          <a
            href="https://thepiecraftmarketing.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#D4AF37] hover:text-[#F2EFDB] underline underline-offset-4 font-medium transition-colors"
          >
            The PieCraft Marketing
          </a>
          .
        </p>
        <p className="text-[11px] text-white/40 tracking-wider">
          © {new Date().getFullYear()} Avirena Jewels. All rights reserved.
        </p>
      </div>

    </footer>
  );
};
