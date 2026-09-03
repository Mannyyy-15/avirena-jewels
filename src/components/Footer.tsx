import React, { useState } from 'react';
import { 
  Sparkles, 
  Gem, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Mail, 
  Instagram, 
  Compass, 
  MessageCircle,
  Award,
  Lock,
  PhoneCall
} from 'lucide-react';
import { PageView, Category } from '../types';
import { AvirenaLogo } from './AvirenaLogo';

interface FooterProps {
  setCurrentPage: (page: PageView) => void;
  openStoryModal: () => void;
  openCareModal: () => void;
  setSelectedCategory?: (cat: Category) => void;
}

export const Footer: React.FC<FooterProps> = ({
  setCurrentPage,
  openStoryModal,
  openCareModal,
  setSelectedCategory,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
      }, 4000);
    }
  };

  const handleNavigate = (page: PageView, category?: Category) => {
    setCurrentPage(page);
    if (category && setSelectedCategory) {
      setSelectedCategory(category);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#111111] text-[#FAF8F5] border-t border-[#2A2723] font-sans-body w-full relative overflow-hidden">
      {/* Subtle Background Ambience Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#7A0F1A]/10 rounded-full blur-3xl pointer-events-none" />

      {/* 1. BRAND PILLARS BAR */}
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-10 border-b border-white/10 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {/* Pillar 1 */}
          <div className="flex items-start gap-4 p-4 rounded-xs bg-white/[0.02] border border-white/5 hover:border-[#D4AF37]/30 transition-all duration-300 group">
            <div className="w-11 h-11 rounded-full bg-[#1A1A1A] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 group-hover:bg-[#D4AF37] group-hover:text-[#111111] transition-all duration-300 shrink-0">
              <Gem className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-[0.18em] font-semibold text-[#FAF8F5] group-hover:text-[#D4AF37] transition-colors">
                Sculptural Demi-Fine
              </h4>
              <p className="text-[11px] text-[#A8A49C] mt-1 leading-relaxed font-light">
                Original architectural silhouettes designed for effortless everyday wear.
              </p>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="flex items-start gap-4 p-4 rounded-xs bg-white/[0.02] border border-white/5 hover:border-[#D4AF37]/30 transition-all duration-300 group">
            <div className="w-11 h-11 rounded-full bg-[#1A1A1A] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 group-hover:bg-[#D4AF37] group-hover:text-[#111111] transition-all duration-300 shrink-0">
              <Sparkles className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-[0.18em] font-semibold text-[#FAF8F5] group-hover:text-[#D4AF37] transition-colors">
                18k Thick Gold Vermeil
              </h4>
              <p className="text-[11px] text-[#A8A49C] mt-1 leading-relaxed font-light">
                Heavy 3.0-micron gold plating over certified recycled 925 sterling silver.
              </p>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="flex items-start gap-4 p-4 rounded-xs bg-white/[0.02] border border-white/5 hover:border-[#D4AF37]/30 transition-all duration-300 group">
            <div className="w-11 h-11 rounded-full bg-[#1A1A1A] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 group-hover:bg-[#D4AF37] group-hover:text-[#111111] transition-all duration-300 shrink-0">
              <Truck className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-[0.18em] font-semibold text-[#FAF8F5] group-hover:text-[#D4AF37] transition-colors">
                Insured Express Courier
              </h4>
              <p className="text-[11px] text-[#A8A49C] mt-1 leading-relaxed font-light">
                Complimentary tracked dispatch with luxury signature gift box packaging.
              </p>
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="flex items-start gap-4 p-4 rounded-xs bg-white/[0.02] border border-white/5 hover:border-[#D4AF37]/30 transition-all duration-300 group">
            <div className="w-11 h-11 rounded-full bg-[#1A1A1A] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] group-hover:scale-110 group-hover:bg-[#D4AF37] group-hover:text-[#111111] transition-all duration-300 shrink-0">
              <RotateCcw className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-[0.18em] font-semibold text-[#FAF8F5] group-hover:text-[#D4AF37] transition-colors">
                30-Day Guarantee
              </h4>
              <p className="text-[11px] text-[#A8A49C] mt-1 leading-relaxed font-light">
                Effortless exchanges & 1-year anti-tarnish atelier craftsmanship warranty.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN FOOTER NAVIGATION & NEWSLETTER */}
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 text-left">
          
          {/* Brand Presentation (Col Span 4) */}
          <div className="lg:col-span-4 space-y-5">
            <button 
              onClick={() => handleNavigate('home')} 
              className="text-left cursor-pointer group inline-block focus:outline-none"
            >
              <AvirenaLogo size="md" theme="light" showThread={true} className="transition-transform group-hover:scale-[1.02]" />
            </button>

            <p className="text-xs text-[#A8A49C] leading-relaxed font-light max-w-sm">
              AVIRENA is a celebration of timeless elegance and modern femininity. Each piece is thoughtfully cast in recycled precious metals to enhance beauty, inspire confidence, and be cherished forever.
            </p>

            {/* Atelier Contact Pill */}
            <div className="space-y-2 pt-1 text-xs">
              <div className="flex items-center gap-2.5 text-[#C5A059]">
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <a href="mailto:concierge@avirenajewels.com" className="hover:underline text-[#FAF8F5]/90 hover:text-[#D4AF37] transition-colors">
                  concierge@avirenajewels.com
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-[#C5A059]">
                <PhoneCall className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[#FAF8F5]/90">
                  WhatsApp Concierge Available Mon–Sat
                </span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#FAF8F5]/80 hover:text-[#111111] hover:bg-[#D4AF37] hover:border-[#D4AF37] transition-all duration-300"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a 
                href="https://pinterest.com" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="Pinterest"
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#FAF8F5]/80 hover:text-[#111111] hover:bg-[#D4AF37] hover:border-[#D4AF37] transition-all duration-300"
              >
                <Compass className="w-3.5 h-3.5" />
              </a>
              <button 
                onClick={() => handleNavigate('contact')}
                aria-label="WhatsApp Atelier"
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#FAF8F5]/80 hover:text-[#111111] hover:bg-[#D4AF37] hover:border-[#D4AF37] transition-all duration-300 cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Explore Collections (Col Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.22em] font-semibold text-[#D4AF37]">
              The Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A8A49C]">
              <li>
                <button
                  onClick={() => handleNavigate('shop', 'all')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer hover:translate-x-0.5 transform duration-150 inline-block text-left"
                >
                  All Jewellery
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('collections')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer hover:translate-x-0.5 transform duration-150 inline-block text-left"
                >
                  Curated Suites
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('collection', 'rings')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer hover:translate-x-0.5 transform duration-150 inline-block text-left"
                >
                  Sculptural Rings
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('collection', 'necklaces')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer hover:translate-x-0.5 transform duration-150 inline-block text-left"
                >
                  Necklaces & Chokers
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('collection', 'earrings')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer hover:translate-x-0.5 transform duration-150 inline-block text-left"
                >
                  Molten Earrings
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('collection', 'bracelets')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer hover:translate-x-0.5 transform duration-150 inline-block text-left"
                >
                  Cuffs & Bracelets
                </button>
              </li>
            </ul>
          </div>

          {/* Maison & Atelier (Col Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.22em] font-semibold text-[#D4AF37]">
              The Maison
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A8A49C]">
              <li>
                <button
                  onClick={() => handleNavigate('about')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer hover:translate-x-0.5 transform duration-150 inline-block text-left"
                >
                  Our Atelier Story
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('journal')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer hover:translate-x-0.5 transform duration-150 inline-block text-left"
                >
                  Editorial Journal
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    handleNavigate('faq');
                    openCareModal();
                  }}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer hover:translate-x-0.5 transform duration-150 inline-block text-left"
                >
                  Materials & Care Standard
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('faq')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer hover:translate-x-0.5 transform duration-150 inline-block text-left"
                >
                  Ring Sizing Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('contact')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer hover:translate-x-0.5 transform duration-150 inline-block text-left"
                >
                  Bespoke Commissions
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('faq')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer hover:translate-x-0.5 transform duration-150 inline-block text-left"
                >
                  Shipping & Returns
                </button>
              </li>
            </ul>
          </div>

          {/* VIP Salon Circle / Newsletter (Col Span 4) */}
          <div className="lg:col-span-4 space-y-4 bg-white/[0.02] border border-white/10 p-6 rounded-xs relative">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] tracking-[0.16em] uppercase font-semibold">
              <Award className="w-3 h-3" />
              Private Atelier Circle
            </div>

            <h4 className="font-serif-display text-lg sm:text-xl text-[#FAF8F5] leading-snug">
              Receive 10% Off Your Initial Order & Private Archives
            </h4>

            <p className="text-xs text-[#A8A49C] leading-relaxed font-light">
              Join our private salon for private seasonal previews, bespoke trunk shows, and editorial jewellery journals.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2.5 text-xs text-[#D4AF37] bg-[#D4AF37]/10 p-3.5 rounded-xs border border-[#D4AF37]/40 animate-in fade-in duration-300">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span className="font-medium">Welcome to the Avirena Circle. Your 10% code has been sent.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 px-3.5 py-2.5 bg-white/5 border border-white/15 rounded-xs text-xs text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 placeholder-white/40 transition-all"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#C5A059] text-[#111111] text-xs uppercase tracking-[0.14em] font-bold rounded-xs transition-all duration-300 cursor-pointer shrink-0 shadow-sm hover:shadow-[#D4AF37]/20 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Join
                  </button>
                </div>
                <p className="text-[10px] text-white/40 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" />
                  We respect your privacy. Unsubscribe anytime.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* 3. ASSURANCE & SECURED PAYMENTS RIBBON */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-[11px] text-[#A8A49C]">
          {/* Authenticity badges */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6">
            <span className="flex items-center gap-1.5 font-medium text-white/90">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              Certified 18K Vermeil & 925 Silver
            </span>
            <span className="hidden sm:inline text-white/20">•</span>
            <span className="flex items-center gap-1.5 font-medium text-white/90">
              <Gem className="w-3.5 h-3.5 text-[#D4AF37]" />
              Conflict-Free Natural Pearls & Stones
            </span>
            <span className="hidden sm:inline text-white/20">•</span>
            <span className="flex items-center gap-1.5 font-medium text-white/90">
              <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
              256-Bit Encrypted Shopify Checkout
            </span>
          </div>

          {/* Payment Method Badges */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-white/50 mr-1">Secured By</span>
            <div className="px-2 py-1 bg-white/5 border border-white/10 rounded-xs text-[10px] font-semibold text-white/80">
              VISA
            </div>
            <div className="px-2 py-1 bg-white/5 border border-white/10 rounded-xs text-[10px] font-semibold text-white/80">
              Mastercard
            </div>
            <div className="px-2 py-1 bg-white/5 border border-white/10 rounded-xs text-[10px] font-semibold text-white/80">
              Amex
            </div>
            <div className="px-2 py-1 bg-white/5 border border-white/10 rounded-xs text-[10px] font-semibold text-white/80">
              Apple Pay
            </div>
            <div className="px-2 py-1 bg-white/5 border border-white/10 rounded-xs text-[10px] font-semibold text-white/80">
              UPI
            </div>
          </div>
        </div>

        {/* 4. COPYRIGHT & LEGAL */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/50 gap-4 text-center sm:text-left">
          <span>© {new Date().getFullYear()} AVIRENA JEWELS. ALL RIGHTS RESERVED.</span>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <button 
              onClick={() => handleNavigate('faq')} 
              className="hover:text-[#D4AF37] transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => handleNavigate('faq')} 
              className="hover:text-[#D4AF37] transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <button 
              onClick={() => handleNavigate('faq')} 
              className="hover:text-[#D4AF37] transition-colors cursor-pointer"
            >
              Shipping & Returns
            </button>
            <button 
              onClick={() => handleNavigate('contact')} 
              className="hover:text-[#D4AF37] transition-colors cursor-pointer"
            >
              Concierge Help
            </button>
          </div>
        </div>
      </div>

      {/* 5. BRAND BOARD SIGNATURE RIBBON: Royal Deep Garnet Red */}
      <div className="w-full bg-[#7A0F1A] py-3 px-4 text-center border-t border-[#9E1B28]/40 shadow-inner">
        <p className="text-[10px] sm:text-xs tracking-[0.38em] text-[#FFFFFF] font-medium uppercase font-sans-body">
          ELEGANT • TIMELESS • FEMININE • LUXURIOUS
        </p>
      </div>
    </footer>
  );
};
