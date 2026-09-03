import React from 'react';
import { Instagram, Facebook, Compass } from 'lucide-react';
import { PageView, Category } from '../types';

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
  const handleNavigate = (page: PageView, category?: Category) => {
    setCurrentPage(page);
    if (category && setSelectedCategory) {
      setSelectedCategory(category);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#8F896D] text-[#FFFFFF] font-sans-body select-none overflow-hidden pt-12 sm:pt-16 pb-8 sm:pb-12 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
      
      {/* 1. TOP ROW: Category Links & Social Icons */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 sm:pb-8">
        
        {/* Left: Category Navigation */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 sm:gap-10 text-xs sm:text-sm tracking-[0.22em] font-medium uppercase">
          <button
            onClick={() => handleNavigate('collection', 'rings')}
            className="text-white/90 hover:text-white transition-all cursor-pointer hover:tracking-[0.26em]"
          >
            Rings
          </button>
          <button
            onClick={() => handleNavigate('collection', 'earrings')}
            className="text-white/90 hover:text-white transition-all cursor-pointer hover:tracking-[0.26em]"
          >
            Earrings
          </button>
          <button
            onClick={() => handleNavigate('collection', 'necklaces')}
            className="text-white/90 hover:text-white transition-all cursor-pointer hover:tracking-[0.26em]"
          >
            Necklaces
          </button>
          <button
            onClick={() => handleNavigate('collection', 'bracelets')}
            className="text-white/90 hover:text-white transition-all cursor-pointer hover:tracking-[0.26em]"
          >
            Bracelets
          </button>
        </div>

        {/* Right: Social Circle Icons */}
        <div className="flex items-center gap-4">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
            className="w-8 h-8 rounded-full border border-white/60 flex items-center justify-center text-white hover:bg-white hover:text-[#CFC6BA] transition-all duration-300"
          >
            <Facebook className="w-4 h-4 fill-current" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="w-8 h-8 rounded-full border border-white/60 flex items-center justify-center text-white hover:bg-white hover:text-[#CFC6BA] transition-all duration-300"
          >
            <Instagram className="w-4 h-4" />
          </a>
          <a
            href="https://pinterest.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Pinterest"
            className="w-8 h-8 rounded-full border border-white/60 flex items-center justify-center text-white hover:bg-white hover:text-[#CFC6BA] transition-all duration-300"
          >
            <Compass className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* 2. GIANT CENTER STATEMENT: AVIRENA TYPOGRAPHY BANNER WITH HAIRLINE BORDERS */}
      <div className="w-full border-t border-b border-white/35 py-4 sm:py-6 md:py-8 my-2 flex items-center justify-center overflow-hidden">
        <button
          onClick={() => handleNavigate('home')}
          className="w-full text-center group cursor-pointer focus:outline-none transition-transform duration-500 hover:scale-[1.01]"
        >
          {/* Giant Serif Luxury Wordmark spanning full width */}
          <span className="font-serif-display font-light text-[15vw] sm:text-[14.5vw] leading-[0.85] tracking-[-0.03em] text-white select-none uppercase block w-full text-center drop-shadow-sm">
            AVIRENA
          </span>
        </button>
      </div>

      {/* 3. BOTTOM ROW: Information & Legal Links */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 pt-6 sm:pt-8 text-xs sm:text-sm font-normal text-white/90">
        
        {/* Left / Center Info Links */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 sm:gap-x-8 gap-y-3">
          <button
            onClick={() => handleNavigate('about')}
            className="hover:text-white hover:underline transition-all cursor-pointer"
          >
            Our Story
          </button>
          <button
            onClick={() => {
              handleNavigate('faq');
              openCareModal();
            }}
            className="hover:text-white hover:underline transition-all cursor-pointer"
          >
            Materials
          </button>
          <button
            onClick={() => handleNavigate('about')}
            className="hover:text-white hover:underline transition-all cursor-pointer"
          >
            Sustainability
          </button>
          <button
            onClick={() => handleNavigate('faq')}
            className="hover:text-white hover:underline transition-all cursor-pointer"
          >
            Shipping & Returns
          </button>
          <button
            onClick={() => handleNavigate('faq')}
            className="hover:text-white hover:underline transition-all cursor-pointer"
          >
            FAQs
          </button>
          <button
            onClick={() => handleNavigate('contact')}
            className="hover:text-white hover:underline transition-all cursor-pointer"
          >
            Contact Us
          </button>
        </div>

        {/* Right: Legal Links */}
        <div className="flex items-center gap-6 sm:gap-8 shrink-0">
          <button
            onClick={() => handleNavigate('faq')}
            className="hover:text-white hover:underline transition-all cursor-pointer"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => handleNavigate('faq')}
            className="hover:text-white hover:underline transition-all cursor-pointer"
          >
            Terms of Service
          </button>
        </div>
      </div>

      {/* 4. COPYRIGHT NOTICE */}
      <div className="w-full pt-10 sm:pt-14 pb-2 text-center">
        <p className="text-[11px] sm:text-xs text-white/80 font-light tracking-wider">
          © {new Date().getFullYear()} Avirena Jewels. All rights reserved.
        </p>
      </div>

    </footer>
  );
};
