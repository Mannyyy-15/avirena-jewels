import React, { useState } from 'react';
import {
  HelpCircle,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Truck,
  Ruler,
  ChevronDown,
  Mail,
  MessageSquare,
  ArrowRight,
  Gem,
  CheckCircle2,
} from 'lucide-react';

interface FaqPageProps {
  onNavigateToContact: () => void;
  onNavigateToShop: () => void;
}

export const FaqPage: React.FC<FaqPageProps> = ({ onNavigateToContact, onNavigateToShop }) => {
  const [activeTab, setActiveTab] = useState<'faq' | 'sizing' | 'materials' | 'shipping'>('faq');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Sizing interactive guide
  const [ringSizeInput, setRingSizeInput] = useState<number>(54); // mm circumference

  const getEstimatedUsSize = (mm: number) => {
    if (mm < 48) return 'US 4 (14.9 mm diameter)';
    if (mm < 50) return 'US 5 (15.7 mm diameter)';
    if (mm < 53) return 'US 6 (16.5 mm diameter)';
    if (mm < 55) return 'US 7 (17.3 mm diameter)';
    if (mm < 58) return 'US 8 (18.1 mm diameter)';
    if (mm < 60) return 'US 9 (18.9 mm diameter)';
    return 'US 10 (19.8 mm diameter)';
  };

  const faqItems = [
    {
      q: 'What is 18k Gold Vermeil and how is it made?',
      a: 'Gold vermeil (pronounced ver-may) is a premium gold plating technique dating back to 18th-century French craftsmen. At Studio Avirena, we deposit an exceptionally thick layer of 3.0 microns of 18k yellow gold over a pure recycled 925 sterling silver base. This provides the sumptuous warm look and feel of solid gold at a fraction of the cost, lasting for years without tarnishing or turning skin green.',
    },
    {
      q: 'Is Avirena jewelry hypoallergenic and nickel-free?',
      a: 'Yes, 100%. All Avirena jewelry is strictly nickel-free, lead-free, and cadmium-free. We use solid 925 sterling silver and titanium-reinforced earring posts, making our pieces completely safe for sensitive skin.',
    },
    {
      q: 'How do I determine my ring or bracelet size?',
      a: 'Use our interactive Ring Sizing tool on this page, or measure the inner diameter of an existing ring. For bangles and cuffs, our flexible open architectures (like the Scalo Bracelet and Two Pearl Cuff) are designed with gentle tension memory and can be adjusted to fit wrists from 14cm to 19cm comfortably.',
    },
    {
      q: 'What is your shipping timeline and cost?',
      a: 'We offer complimentary express insured shipping on all orders worldwide. Standard dispatch takes 24-48 business hours. Delivery within Europe takes 2-4 days, US takes 3-5 days, and India takes 2-4 days via tracked express courier.',
    },
    {
      q: 'What is your returns and exchange policy?',
      a: 'We provide a 14-day hassle-free return and exchange window. If a size is not right or you desire a different piece, simply contact our concierge team to schedule a complimentary doorstep pickup.',
    },
    {
      q: 'Do you offer a warranty on your jewelry?',
      a: 'Every piece of Studio Avirena jewelry includes our 2-Year Atelier Warranty covering any manufacturing defects, clasp adjustments, or re-vermeil restoration service.',
    },
  ];

  return (
    <div className="w-full text-left font-sans-body bg-[#FAF8F5] pb-24">
      {/* 1. Header Banner */}
      <section className="relative w-full px-4 sm:px-8 lg:px-12 xl:px-16 pt-4 pb-8 sm:pb-12">
        <div className="relative rounded-xs overflow-hidden border border-[#E6DFD3] bg-[#EAE6DB] py-14 sm:py-20 px-6 sm:px-12 text-center space-y-4">
          <div>
            <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-[#C5A059] uppercase block mb-2">
              Customer Support & Knowledge Base
            </span>
            <h1 className="font-serif-display text-4xl sm:text-6xl lg:text-7xl text-[#2C2C2A] tracking-tight">
              FAQs, Sizing & Care
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#7D7973] max-w-xl mx-auto font-light leading-relaxed">
            Everything you need to know about our precious materials, ring sizing, care guides, and worldwide insured shipping.
          </p>
        </div>
      </section>

      {/* 2. Navigation Tabs */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 mb-10">
        <div className="flex items-center justify-center gap-2 sm:gap-4 overflow-x-auto pb-2 border-b border-[#E6DFD3]">
          <button
            onClick={() => setActiveTab('faq')}
            className={`px-5 py-2.5 text-xs uppercase tracking-wider rounded-xs flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'faq'
                ? 'bg-[#2C2C2A] text-white font-medium shadow-xs'
                : 'bg-[#F3EFE6] text-[#5C5850] hover:bg-[#EAE6DB]'
            }`}
          >
            <HelpCircle className="w-4 h-4" /> Frequently Asked Questions
          </button>
          <button
            onClick={() => setActiveTab('sizing')}
            className={`px-5 py-2.5 text-xs uppercase tracking-wider rounded-xs flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'sizing'
                ? 'bg-[#2C2C2A] text-white font-medium shadow-xs'
                : 'bg-[#F3EFE6] text-[#5C5850] hover:bg-[#EAE6DB]'
            }`}
          >
            <Ruler className="w-4 h-4" /> Sizing & Fit Guide
          </button>
          <button
            onClick={() => setActiveTab('materials')}
            className={`px-5 py-2.5 text-xs uppercase tracking-wider rounded-xs flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'materials'
                ? 'bg-[#2C2C2A] text-white font-medium shadow-xs'
                : 'bg-[#F3EFE6] text-[#5C5850] hover:bg-[#EAE6DB]'
            }`}
          >
            <Gem className="w-4 h-4" /> Materials & Care
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`px-5 py-2.5 text-xs uppercase tracking-wider rounded-xs flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'shipping'
                ? 'bg-[#2C2C2A] text-white font-medium shadow-xs'
                : 'bg-[#F3EFE6] text-[#5C5850] hover:bg-[#EAE6DB]'
            }`}
          >
            <Truck className="w-4 h-4" /> Shipping & Returns
          </button>
        </div>
      </section>

      {/* 3. Tab Content */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 max-w-5xl mx-auto">
        {/* TAB 1: FAQ Accordions */}
        {activeTab === 'faq' && (
          <div className="space-y-4">
            {faqItems.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-[#E6DFD3] rounded-xs overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#FAF8F5]"
                  >
                    <span className="font-serif-display text-base sm:text-lg text-[#2C2C2A]">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#7D7973] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#C5A059]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-[#5C5850] font-light leading-relaxed border-t border-[#E6DFD3]/60 bg-[#FAF8F5]/50">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: Sizing Guide */}
        {activeTab === 'sizing' && (
          <div className="bg-white border border-[#E6DFD3] rounded-xs p-6 sm:p-10 space-y-8">
            <div>
              <h2 className="font-serif-display text-2xl sm:text-3xl text-[#2C2C2A]">Interactive Ring Size Finder</h2>
              <p className="text-xs sm:text-sm text-[#7D7973] mt-1 font-light">
                Wrap a strip of paper or string around the base of your finger, mark where it overlaps, and measure the length in millimeters.
              </p>
            </div>

            {/* Interactive Slider */}
            <div className="bg-[#F3EFE6] border border-[#E6DFD3] p-6 rounded-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#2C2C2A]">Finger Circumference:</span>
                <span className="text-sm font-serif-display font-medium text-[#C5A059]">{ringSizeInput} mm</span>
              </div>
              <input
                type="range"
                min="45"
                max="65"
                value={ringSizeInput}
                onChange={(e) => setRingSizeInput(Number(e.target.value))}
                className="w-full accent-[#C5A059] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#7D7973]">
                <span>45 mm (US 3.5)</span>
                <span>55 mm (US 7)</span>
                <span>65 mm (US 11)</span>
              </div>
              <div className="pt-3 border-t border-[#E6DFD3] flex items-center justify-between">
                <span className="text-xs text-[#5C5850]">Recommended Size:</span>
                <span className="text-sm font-semibold text-[#2C2C2A]">{getEstimatedUsSize(ringSizeInput)}</span>
              </div>
            </div>

            {/* Sizing Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-[#E6DFD3]">
                <thead className="bg-[#F3EFE6] text-[#2C2C2A] uppercase tracking-wider font-semibold border-b border-[#E6DFD3]">
                  <tr>
                    <th className="p-3 border-r border-[#E6DFD3]">US Size</th>
                    <th className="p-3 border-r border-[#E6DFD3]">UK / AU</th>
                    <th className="p-3 border-r border-[#E6DFD3]">EU Size</th>
                    <th className="p-3 border-r border-[#E6DFD3]">Inside Diameter</th>
                    <th className="p-3">Circumference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6DFD3]">
                  {[
                    { us: '5', uk: 'J ½', eu: '49', diam: '15.7 mm', circ: '49.3 mm' },
                    { us: '6', uk: 'M', eu: '52', diam: '16.5 mm', circ: '51.9 mm' },
                    { us: '7', uk: 'O', eu: '54', diam: '17.3 mm', circ: '54.5 mm' },
                    { us: '8', uk: 'Q', eu: '57', diam: '18.1 mm', circ: '57.2 mm' },
                    { us: '9', uk: 'S', eu: '59', diam: '18.9 mm', circ: '59.8 mm' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-[#FAF8F5]">
                      <td className="p-3 font-semibold text-[#2C2C2A] border-r border-[#E6DFD3]">{row.us}</td>
                      <td className="p-3 border-r border-[#E6DFD3]">{row.uk}</td>
                      <td className="p-3 border-r border-[#E6DFD3]">{row.eu}</td>
                      <td className="p-3 border-r border-[#E6DFD3]">{row.diam}</td>
                      <td className="p-3">{row.circ}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Materials & Care */}
        {activeTab === 'materials' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-[#E6DFD3] p-6 sm:p-8 rounded-xs space-y-4">
                <div className="flex items-center gap-3 text-[#C5A059]">
                  <Gem className="w-5 h-5" />
                  <h3 className="font-serif-display text-xl text-[#2C2C2A]">18k Gold Vermeil Standard</h3>
                </div>
                <p className="text-xs sm:text-sm text-[#5C5850] font-light leading-relaxed">
                  We use an industry-leading 3.0-micron thick coating of 18k solid gold over 100% recycled 925 sterling silver. Unlike flash-plated jewelry that wears down in weeks, our heavy vermeil is built to endure daily wear.
                </p>
                <div className="space-y-2 pt-2 border-t border-[#E6DFD3] text-xs text-[#2C2C2A]">
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059]" /> 5x thicker than ordinary fashion plating</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059]" /> Zero green discoloration or oxidation on skin</div>
                </div>
              </div>

              <div className="bg-white border border-[#E6DFD3] p-6 sm:p-8 rounded-xs space-y-4">
                <div className="flex items-center gap-3 text-[#C5A059]">
                  <Sparkles className="w-5 h-5" />
                  <h3 className="font-serif-display text-xl text-[#2C2C2A]">Daily Care Rituals</h3>
                </div>
                <p className="text-xs sm:text-sm text-[#5C5850] font-light leading-relaxed">
                  Avoid spraying perfumes or applying alcohol-based lotions directly onto your jewelry. Remove pieces before swimming in chlorinated pools or exercising intensely.
                </p>
                <div className="space-y-2 pt-2 border-t border-[#E6DFD3] text-xs text-[#2C2C2A]">
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059]" /> Buff gently with our microfiber cloth</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059]" /> Store separately in your suede travel pouch</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Shipping & Returns */}
        {activeTab === 'shipping' && (
          <div className="bg-white border border-[#E6DFD3] rounded-xs p-6 sm:p-10 space-y-6">
            <h2 className="font-serif-display text-2xl sm:text-3xl text-[#2C2C2A]">Worldwide Insured Shipping & 14-Day Returns</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="p-4 bg-[#F3EFE6] border border-[#E6DFD3] rounded-xs space-y-2">
                <Truck className="w-5 h-5 text-[#C5A059]" />
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#2C2C2A]">Express Delivery</h4>
                <p className="text-xs text-[#5C5850] font-light leading-relaxed">
                  Complimentary express shipping with real-time tracking on all orders worldwide.
                </p>
              </div>

              <div className="p-4 bg-[#F3EFE6] border border-[#E6DFD3] rounded-xs space-y-2">
                <RotateCcw className="w-5 h-5 text-[#C5A059]" />
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#2C2C2A]">14-Day Free Returns</h4>
                <p className="text-xs text-[#5C5850] font-light leading-relaxed">
                  Hassle-free return pickup from your doorstep or simple exchange for a different size.
                </p>
              </div>

              <div className="p-4 bg-[#F3EFE6] border border-[#E6DFD3] rounded-xs space-y-2">
                <ShieldCheck className="w-5 h-5 text-[#C5A059]" />
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#2C2C2A]">2-Year Warranty</h4>
                <p className="text-xs text-[#5C5850] font-light leading-relaxed">
                  Full coverage against manufacturing defects, loose stones, and clasp adjustments.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Concierge CTA */}
        <div className="mt-12 p-8 bg-[#2C2C2A] text-white rounded-xs flex flex-col sm:flex-row items-center justify-between gap-6 text-left">
          <div className="space-y-1">
            <h3 className="font-serif-display text-xl sm:text-2xl text-white">Still have questions?</h3>
            <p className="text-xs text-[#B4C2CD] font-light">Our dedicated atelier concierge is available 7 days a week.</p>
          </div>
          <button
            onClick={onNavigateToContact}
            className="px-6 py-3 bg-[#C5A059] hover:bg-[#B38F46] text-[#2C2C2A] font-medium text-xs uppercase tracking-widest rounded-xs transition-colors cursor-pointer shrink-0"
          >
            Contact Atelier Concierge
          </button>
        </div>
      </section>
    </div>
  );
};
