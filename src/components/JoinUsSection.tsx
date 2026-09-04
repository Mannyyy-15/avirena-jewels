import React, { useState } from 'react';
import joinusModelImg from '../assets/about/joinus-model-left.jpg';
import joinusJewelryImg from '../assets/about/joinus-jewelry-right.jpg';

export const JoinUsSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && agreed) {
      setSubmitted(true);
      setEmail('');
      setAgreed(false);
      setTimeout(() => setSubmitted(false), 4000);
    }
  };

  return (
    <section className="w-full bg-[#E7E4D5] py-16 sm:py-20 lg:py-24 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 select-none">
      
      {/* Section Header */}
      <div className="text-center mb-10 sm:mb-14">
        <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl text-[#413C23] font-normal tracking-[0.08em] uppercase">
          Join Us
        </h2>
      </div>

      {/* 3-Column Layout: Left Image | Center Content | Right Image */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-10 items-center">
        
        {/* Left Image: Model in golden dress */}
        <div className="lg:col-span-4 hidden lg:block">
          <div className="aspect-[3/4] rounded-[2rem] overflow-hidden bg-[#D8D2C2] shadow-md relative group">
            <img
              src={joinusModelImg}
              alt="Woman in gold dress wearing statement jewelry"
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>
        </div>

        {/* Center Content: Text + Email Form + Subscribe */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center text-center space-y-7 sm:space-y-8 py-4">
          
          {/* Subtext */}
          <p className="font-serif-display text-sm sm:text-base text-[#413C23]/80 leading-relaxed max-w-xs">
            New collections, discounts, exclusive offers and much more
          </p>

          {/* Email Input */}
          <form onSubmit={handleSubmit} className="w-full max-w-[280px] space-y-5">
            <div className="relative">
              <input
                id="joinus-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                className="w-full bg-transparent border-b border-[#413C23]/30 focus:border-[#413C23] text-sm text-[#413C23] placeholder:text-[#8F896D]/70 font-serif-display py-2.5 outline-none transition-colors tracking-wide"
              />
            </div>

            {/* Privacy Checkbox */}
            <label
              htmlFor="joinus-privacy-checkbox"
              className="flex items-start gap-2.5 cursor-pointer text-left"
            >
              <input
                id="joinus-privacy-checkbox"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 w-3.5 h-3.5 border border-[#413C23]/40 rounded-none accent-[#413C23] cursor-pointer shrink-0"
              />
              <span className="text-[10px] sm:text-[11px] text-[#413C23]/65 leading-snug font-normal">
                by clicking on the "sign up" button, I agree to the processing of my personal data in accordance with the privacy policy.
              </span>
            </label>

            {/* Circular Dot SUBSCRIBE Button */}
            <div className="pt-2 flex justify-center">
              <button
                id="joinus-subscribe-btn"
                type="submit"
                disabled={!email || !agreed}
                className="group inline-flex items-center gap-3 cursor-pointer select-none disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
              >
                <div className="relative flex items-center">
                  <div className="w-12 h-12 rounded-full border border-[#413C23]/50 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:border-[#413C23] group-hover:bg-[#F2EFDB] shadow-xs group-disabled:hover:scale-100 group-disabled:hover:border-[#413C23]/50 group-disabled:hover:bg-transparent">
                    <span className="w-2 h-2 rounded-full bg-[#413C23] transition-transform duration-300 group-hover:scale-125" />
                  </div>
                  <span className="w-6 sm:w-8 h-px bg-[#413C23]/50 -ml-1 transition-all duration-300 group-hover:w-10 group-hover:bg-[#413C23]" />
                </div>
                <span className="font-serif-display text-xs sm:text-sm uppercase tracking-[0.22em] text-[#413C23] font-normal">
                  Subscribe
                </span>
              </button>
            </div>

            {/* Success Message */}
            {submitted && (
              <p className="text-xs text-[#8F896D] font-serif-display text-center animate-pulse">
                Welcome to the Avirena family ✦
              </p>
            )}
          </form>
        </div>

        {/* Right Image: Jewelry close-up */}
        <div className="lg:col-span-4 hidden lg:block">
          <div className="aspect-[3/4] rounded-[2rem] overflow-hidden bg-[#D8D2C2] shadow-md relative group">
            <img
              src={joinusJewelryImg}
              alt="Ornate gold statement earring with gemstones"
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>
        </div>

        {/* Mobile-only: Show both images side by side */}
        <div className="lg:hidden grid grid-cols-2 gap-4 mt-4">
          <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-[#D8D2C2] shadow-sm">
            <img
              src={joinusModelImg}
              alt="Woman in gold dress wearing statement jewelry"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-[#D8D2C2] shadow-sm">
            <img
              src={joinusJewelryImg}
              alt="Ornate gold statement earring with gemstones"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>

      </div>
    </section>
  );
};
