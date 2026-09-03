import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Sparkles, Gem, Heart, Crown, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
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
  setSelectedCategory
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
      }, 3000);
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
    <footer className="bg-[#111111] text-[#FAF8F5] border-t border-[#333333] pt-14 font-sans-body w-full">
      {/* 4 Brand Pillars Bar */}
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 pb-12 border-b border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shrink-0">
              <Gem className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-widest font-semibold text-white">Timeless Sculptures</h4>
              <p className="text-[11px] text-white/70 mt-1 leading-relaxed font-light">
                Modern silhouettes crafted to outlast fast-fashion trends.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-widest font-semibold text-white">18k Thick Vermeil</h4>
              <p className="text-[11px] text-white/70 mt-1 leading-relaxed font-light">
                Heavy 3.0-micron solid gold over recycled 925 silver.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-widest font-semibold text-white">Insured Global Delivery</h4>
              <p className="text-[11px] text-white/70 mt-1 leading-relaxed font-light">
                Complimentary insured express delivery on orders over $150.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shrink-0">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-widest font-semibold text-white">30-Day Easy Returns</h4>
              <p className="text-[11px] text-white/70 mt-1 leading-relaxed font-light">
                Pre-paid return labels with seamless exchange guarantees.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 text-left">
          {/* Brand Manifesto & Monogram */}
          <div className="lg:col-span-4 space-y-4">
            <button onClick={() => handleNavigate('home')} className="text-left cursor-pointer group">
              <AvirenaLogo size="sm" theme="light" className="h-8 transition-transform group-hover:scale-[1.01]" />
            </button>
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#D4AF37] block">
              Timeless Beauty. Uniquely Yours.
            </span>

            <p className="text-xs text-white/70 max-w-sm leading-relaxed font-light">
              AVIRENA is a celebration of timeless elegance and modern femininity. Each piece is thoughtfully cast in recycled precious metals to enhance beauty, inspire confidence, and be cherished forever.
            </p>
          </div>

          {/* Collections Column */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-white">Explore</h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li>
                <button
                  onClick={() => handleNavigate('home')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('shop', 'all')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Shop All Pieces
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('collections')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Curated Collections
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('collection', 'rings')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Rings & Bands
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('collection', 'necklaces')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Necklaces & Chokers
                </button>
              </li>
            </ul>
          </div>

          {/* Maison & Concierge */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-white">The Maison</h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li>
                <button
                  onClick={() => handleNavigate('about')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Our Atelier Story
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('journal')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Editorial Lookbook
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('faq')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Sizing & Care Standard
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigate('contact')}
                  className="hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  Atelier Concierge
                </button>
              </li>
            </ul>
          </div>

          {/* VIP Atelier Newsletter Box */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-white">Private VIP Circle</h4>
            <p className="text-xs text-white/70 leading-relaxed font-light">
              Subscribe for private invitations to seasonal archives, bespoke previews, and 10% off your initial order.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2 text-xs text-[#D4AF37] bg-white/10 p-3 rounded-xs border border-[#D4AF37]">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Thank you for joining the Avirena Circle.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-3.5 py-2.5 bg-white/10 border border-white/20 rounded-xs text-xs text-white focus:outline-none focus:border-[#D4AF37] placeholder-white/50"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#BF9B2D] text-[#111111] text-xs uppercase tracking-wider font-bold rounded-xs transition-colors cursor-pointer shrink-0"
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Copyright and Links */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/60 gap-3">
          <span>© {new Date().getFullYear()} AVIRENA JEWELS. ALL RIGHTS RESERVED.</span>
          <div className="flex items-center space-x-6">
            <button onClick={() => handleNavigate('faq')} className="hover:text-white transition-colors cursor-pointer">
              Privacy Standard
            </button>
            <button onClick={() => handleNavigate('faq')} className="hover:text-white transition-colors cursor-pointer">
              Terms of Service
            </button>
            <button onClick={() => handleNavigate('faq')} className="hover:text-white transition-colors cursor-pointer">
              Insured Logistics & Returns
            </button>
          </div>
        </div>
      </div>

      {/* Brand Board Bottom Banner: Deep Garnet Red Ribbon */}
      <div className="w-full bg-[#7A0F1A] py-3.5 px-4 text-center">
        <p className="text-[10px] sm:text-xs tracking-[0.35em] text-[#FFFFFF] font-bold uppercase">
          ELEGANT • TIMELESS • FEMININE • LUXURIOUS
        </p>
      </div>
    </footer>
  );
};
