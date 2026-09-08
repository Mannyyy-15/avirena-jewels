import React, { useState } from 'react';
import { PageView, Category } from '../types';
import { PaymentBadges } from './PaymentBadges';

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
    }, 4000);
  };

  return (
    <footer className="w-full bg-[#8F896D] text-[#FFFFFF] font-sans-body select-none overflow-hidden pt-10 sm:pt-14 pb-4 sm:pb-6 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
      
      {/* 1. TOP MAIN GRID: Our Company, Customer Service & Subscribe Section */}
      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-8 sm:pb-10 text-left">
        
        {/* COLUMN 1: OUR COMPANY */}
        <div className="md:col-span-3 lg:col-span-3 space-y-4">
          <h4 className="text-xs sm:text-sm uppercase tracking-[0.2em] font-bold text-white">
            Our Company
          </h4>
          <ul className="space-y-2.5 text-xs sm:text-[13px] text-white/90">
            <li>
              <button
                onClick={() => handleNavigate('home')}
                className="hover:text-white hover:underline transition-all cursor-pointer text-left"
              >
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigate('collection', 'all')}
                className="hover:text-white hover:underline transition-all cursor-pointer text-left"
              >
                All products
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigate('collection', 'all')}
                className="hover:text-white hover:underline transition-all cursor-pointer text-left"
              >
                Men's Collection
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigate('collection', 'all')}
                className="hover:text-white hover:underline transition-all cursor-pointer text-left"
              >
                Women's Collection
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigate('collection', 'all')}
                className="hover:text-white hover:underline transition-all cursor-pointer text-left"
              >
                Mangalsutra Collection
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigate('about')}
                className="hover:text-white hover:underline transition-all cursor-pointer text-left"
              >
                About Us
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigate('contact')}
                className="hover:text-white hover:underline transition-all cursor-pointer text-left"
              >
                Contact Us
              </button>
            </li>
          </ul>
        </div>

        {/* COLUMN 2: CUSTOMER SERVICE */}
        <div className="md:col-span-3 lg:col-span-3 space-y-4">
          <h4 className="text-xs sm:text-sm uppercase tracking-[0.2em] font-bold text-white">
            Customer Service
          </h4>
          <ul className="space-y-2.5 text-xs sm:text-[13px] text-white/90">
            <li>
              <button
                onClick={() => handlePolicyClick('legal')}
                className="hover:text-white hover:underline transition-all cursor-pointer text-left"
              >
                Legal Notice
              </button>
            </li>
            <li>
              <button
                onClick={() => handlePolicyClick('privacy')}
                className="hover:text-white hover:underline transition-all cursor-pointer text-left"
              >
                Privacy Policy
              </button>
            </li>
            <li>
              <button
                onClick={() => handlePolicyClick('returns')}
                className="hover:text-white hover:underline transition-all cursor-pointer text-left"
              >
                Refund Policy
              </button>
            </li>
            <li>
              <button
                onClick={() => handlePolicyClick('shipping')}
                className="hover:text-white hover:underline transition-all cursor-pointer text-left"
              >
                Shipping Policy
              </button>
            </li>
            <li>
              <button
                onClick={() => handlePolicyClick('terms')}
                className="hover:text-white hover:underline transition-all cursor-pointer text-left"
              >
                Terms of Service
              </button>
            </li>
            <li>
              <button
                onClick={() => handlePolicyClick('contact')}
                className="hover:text-white hover:underline transition-all cursor-pointer text-left"
              >
                Contact Information
              </button>
            </li>
          </ul>
        </div>

        {/* COLUMN 3: SUBSCRIBE TO AVIRENA JEWELS & SOCIALS */}
        <div className="md:col-span-6 lg:col-span-6 space-y-4 lg:pl-6">
          <h4 className="text-xs sm:text-sm uppercase tracking-[0.2em] font-bold text-white">
            Subscribe to Avirena Jewels
          </h4>
          <p className="text-xs text-white/90 leading-relaxed max-w-lg">
            Receive insights into modern sculptural jewelry, updates on new artisan piece launches, and exclusive community privileges.
          </p>

          {/* Newsletter Input Box with Sign Up Button */}
          <form onSubmit={handleNewsletterSubmit} className="pt-1">
            {isSubscribed ? (
              <div className="w-full max-w-md bg-white/15 border border-white/40 text-white rounded-xs px-4 py-2.5 text-xs font-semibold flex items-center gap-2">
                <span className="text-[#D4AF37]">✓</span>
                <span>Thank you for subscribing to AVIRENA!</span>
              </div>
            ) : (
              <div className="flex w-full max-w-md rounded-xs overflow-hidden bg-white p-1 shadow-sm border border-white/20">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Email address"
                  required
                  aria-label="Email address for newsletter"
                  className="flex-1 px-3.5 py-2 text-xs text-[#413C23] placeholder-[#8F896D]/70 bg-transparent focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-[#7A0F1A] hover:bg-[#5E0B14] text-white px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-xs transition-colors cursor-pointer shrink-0 shadow-xs"
                >
                  Sign Up
                </button>
              </div>
            )}
          </form>

          {/* Social Circles Row: Instagram, Facebook, WhatsApp, Pinterest */}
          <div className="pt-2 flex items-center gap-3">
            {/* 1. Instagram with Signature Gradient */}
            <a
              href="https://www.instagram.com/avirenajewels/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              title="Follow us on Instagram"
              className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm"
              style={{
                background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)',
              }}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-white fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>

            {/* 2. Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              title="Follow us on Facebook"
              className="w-8 h-8 rounded-full bg-[#1877F2] flex items-center justify-center transition-transform hover:scale-110 shadow-sm text-white"
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
              title="Chat with us on WhatsApp (+91 78238 89290)"
              className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center transition-transform hover:scale-110 shadow-sm text-white"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
            </a>

            {/* 4. Pinterest */}
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Pinterest"
              title="Follow us on Pinterest"
              className="w-8 h-8 rounded-full bg-[#E60023] flex items-center justify-center transition-transform hover:scale-110 shadow-sm text-white"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.332 1.365-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* 2. CENTER STATEMENT: AVIRENA LOGO WHITE BANNER */}
      <div className="w-full border-t border-b border-white/25 py-6 sm:py-8 my-4 flex items-center justify-center overflow-hidden">
        <button
          onClick={() => handleNavigate('home')}
          className="w-full flex items-center justify-center group cursor-pointer focus:outline-none transition-transform duration-500 hover:scale-[1.015]"
          title="Return to AVIRENA Home"
          aria-label="AVIRENA Jewels Home"
        >
          <img
            src="/logo-white.png"
            alt="AVIRENA"
            className="w-[80vw] sm:w-[70vw] md:w-[60vw] lg:w-[50vw] max-w-[720px] h-auto object-contain select-none opacity-95 group-hover:opacity-100 transition-all duration-300"
            loading="lazy"
          />
        </button>
      </div>

      {/* 3. PAYMENT METHODS BADGES STRIP (GPay, PhonePe, UPI, Paytm, Visa, RuPay, Mastercard) */}
      <div className="w-full py-3 flex flex-col items-center justify-center gap-2">
        <PaymentBadges />
      </div>

      {/* 4. BRAND CREDITS & COPYRIGHT */}
      <div className="w-full pt-4 pb-1 text-center space-y-1.5 border-t border-white/20 mt-3">
        <p className="text-xs text-white/90 font-normal tracking-wide">
          AVIRENA is an atelier jewellery venture by{' '}
          <a
            href="https://thepiecraftmarketing.com/"
            target="_blank"
            rel="noopener"
            className="underline underline-offset-4 text-white hover:text-[#FAF8F5] font-semibold transition-colors"
          >
            The PieCraft Marketing
          </a>
          .
        </p>
        <p className="text-[11px] text-white/70 font-light tracking-wider">
          © {new Date().getFullYear()} Avirena Jewels. All rights reserved.
        </p>
      </div>

    </footer>
  );
};
