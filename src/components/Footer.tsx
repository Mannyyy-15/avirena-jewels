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
    <footer className="w-full bg-[#8F896D] text-[#FFFFFF] font-sans-body select-none overflow-hidden pt-8 sm:pt-10 pb-4 sm:pb-6 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
      
      {/* 1. TOP ROW: Category Links & Social Icons */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 sm:pb-5">
        
        {/* Left: Category Navigation */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-5 sm:gap-8 text-xs tracking-[0.2em] font-medium uppercase">
          <button
            onClick={() => handleNavigate('collection', 'rings')}
            className="text-white/90 hover:text-white transition-all cursor-pointer hover:tracking-[0.24em]"
          >
            Rings
          </button>
          <button
            onClick={() => handleNavigate('collection', 'earrings')}
            className="text-white/90 hover:text-white transition-all cursor-pointer hover:tracking-[0.24em]"
          >
            Earrings
          </button>
          <button
            onClick={() => handleNavigate('collection', 'necklaces')}
            className="text-white/90 hover:text-white transition-all cursor-pointer hover:tracking-[0.24em]"
          >
            Necklaces
          </button>
          <button
            onClick={() => handleNavigate('collection', 'bracelets')}
            className="text-white/90 hover:text-white transition-all cursor-pointer hover:tracking-[0.24em]"
          >
            Bracelets
          </button>
        </div>

        {/* Right: Social Circle Icons */}
        <div className="flex items-center gap-3">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
            className="w-7 h-7 rounded-full border border-white/60 flex items-center justify-center text-white hover:bg-white hover:text-[#8F896D] transition-all duration-300"
          >
            <Facebook className="w-3.5 h-3.5 fill-current" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="w-7 h-7 rounded-full border border-white/60 flex items-center justify-center text-white hover:bg-white hover:text-[#8F896D] transition-all duration-300"
          >
            <Instagram className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://pinterest.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Pinterest"
            className="w-7 h-7 rounded-full border border-white/60 flex items-center justify-center text-white hover:bg-white hover:text-[#8F896D] transition-all duration-300"
          >
            <Compass className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 2. CENTER STATEMENT: AVIRENA LOGO WHITE BANNER */}
      <div className="w-full border-t border-b border-white/30 py-5 sm:py-7 my-1 flex items-center justify-center overflow-hidden">
        <button
          onClick={() => handleNavigate('home')}
          className="w-full flex items-center justify-center group cursor-pointer focus:outline-none transition-transform duration-500 hover:scale-[1.015]"
        >
          <img
            src="/logo-white.png"
            alt="AVIRENA"
            className="w-[80vw] sm:w-[70vw] md:w-[60vw] lg:w-[50vw] max-w-[720px] h-auto object-contain select-none opacity-95 group-hover:opacity-100 transition-all duration-300"
            loading="lazy"
          />
        </button>
      </div>

      {/* 3. BOTTOM ROW: Information & Legal Links */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-3 pt-4 sm:pt-5 text-xs font-normal text-white/90">
        
        {/* Left / Center Info Links */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-5 sm:gap-x-6 gap-y-2">
          <button
            onClick={() => handleNavigate('about')}
            className="hover:text-white hover:underline transition-all cursor-pointer"
          >
            Our Story
          </button>
          <button
            onClick={() => handleNavigate('policies')}
            className="hover:text-white hover:underline transition-all cursor-pointer"
          >
            Materials &amp; Care
          </button>
          <button
            onClick={() => handleNavigate('policies')}
            className="hover:text-white hover:underline transition-all cursor-pointer"
          >
            Shipping &amp; Returns
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
            Contact
          </button>
        </div>

        {/* Right: Legal Links */}
        <div className="flex items-center gap-5 shrink-0">
          <button
            onClick={() => handleNavigate('policies')}
            className="hover:text-white hover:underline transition-all cursor-pointer"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => handleNavigate('policies')}
            className="hover:text-white hover:underline transition-all cursor-pointer"
          >
            Terms of Service
          </button>
        </div>
      </div>

      {/* 4. COPYRIGHT NOTICE */}
      <div className="w-full pt-4 pb-1 text-center">
        <p className="text-[11px] text-white/75 font-light tracking-wider">
          © {new Date().getFullYear()} Avirena Jewels. All rights reserved.
        </p>
      </div>

    </footer>
  );
};
