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
      q: 'What materials are Avirena jewels made of?',
      a: 'Avirena is a homegrown jewelry brand crafting premium dailywear pieces. Our core creations are cast in high-grade, durable brass and premium alloys, sealed with specialized anti-tarnish gold-tone protective finishes. We also incorporate hand-selected cultured baroque pearls and sparkling cubic zirconia crystals designed for everyday wear.',
    },
    {
      q: 'Is Avirena dailywear jewelry hypoallergenic and nickel-free?',
      a: 'Yes, 100%. All our pieces are crafted strictly lead-free, nickel-free, and cadmium-free. We use skin-friendly protective seals and surgical steel posts on earrings to ensure complete comfort for sensitive skin.',
    },
    {
      q: 'How do I care for my brass & anti-tarnish jewelry?',
      a: 'To maintain the radiant shine of your jewelry for years, we recommend putting on your jewelry after applying perfumes, hairsprays, and lotions. Remove pieces before swimming, intense workouts, or showering, and wipe gently with a soft dry cloth after wearing before storing in your pouch.',
    },
    {
      q: 'How do I determine my ring or bracelet size?',
      a: 'Use our interactive Ring Sizing tool on this page, or measure the inner diameter of an existing ring. For bangles and cuffs, our flexible open architectures (like the Scalo Bracelet and Two Pearl Cuff) are designed with gentle tension memory and can be adjusted to fit wrists comfortably.',
    },
    {
      q: 'What is your shipping timeline and delivery process?',
      a: 'We offer express tracked shipping on all orders. Standard dispatch takes 24-48 business hours. Delivery across India and international destinations takes 2-5 business days via reputed courier partners.',
    },
    {
      q: 'What is your return and exchange policy?',
      a: 'We provide a 14-day hassle-free return and exchange window. If a size is not right or you desire a different piece, simply contact our support team to arrange an exchange.',
    },
  ];

  return (
    <div className="w-full text-left font-sans-body bg-[#E7E4D5] pb-10">
      {/* 1. Header Banner */}
      <section className="relative w-full px-4 sm:px-8 lg:px-12 xl:px-16 pt-4 pb-8 sm:pb-12">
        <div className="relative rounded-xs overflow-hidden border border-[#D8D2C2] bg-[#E7E4D5] py-14 sm:py-20 px-6 sm:px-12 text-center space-y-4">
          <div>
            <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-[#8F896D] uppercase block mb-2">
              Customer Support &amp; Knowledge Base
            </span>
            <h1 className="font-serif-display text-4xl sm:text-6xl lg:text-7xl text-[#413C23] tracking-tight">
              FAQs, Sizing &amp; Care
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#413C23]/70 max-w-xl mx-auto font-light leading-relaxed">
            Everything you need to know about our homegrown dailywear materials, sizing tools, care rituals, and express delivery.
          </p>
        </div>
      </section>

      {/* 2. Navigation Tabs */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 mb-10">
        <div className="flex items-center justify-center gap-2 sm:gap-4 overflow-x-auto pb-2 border-b border-[#D8D2C2]">
          <button
            onClick={() => setActiveTab('faq')}
            className={`px-5 py-2.5 text-xs uppercase tracking-wider rounded-xs flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'faq'
                ? 'bg-[#413C23] text-white font-medium shadow-xs'
                : 'bg-[#E7E4D5] text-[#413C23] border border-[#D8D2C2] hover:bg-[#D8D2C2]'
            }`}
          >
            <HelpCircle className="w-4 h-4" /> Frequently Asked Questions
          </button>
          <button
            onClick={() => setActiveTab('sizing')}
            className={`px-5 py-2.5 text-xs uppercase tracking-wider rounded-xs flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'sizing'
                ? 'bg-[#413C23] text-white font-medium shadow-xs'
                : 'bg-[#E7E4D5] text-[#413C23] border border-[#D8D2C2] hover:bg-[#D8D2C2]'
            }`}
          >
            <Ruler className="w-4 h-4" /> Sizing &amp; Fit Guide
          </button>
          <button
            onClick={() => setActiveTab('materials')}
            className={`px-5 py-2.5 text-xs uppercase tracking-wider rounded-xs flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'materials'
                ? 'bg-[#413C23] text-white font-medium shadow-xs'
                : 'bg-[#E7E4D5] text-[#413C23] border border-[#D8D2C2] hover:bg-[#D8D2C2]'
            }`}
          >
            <Gem className="w-4 h-4" /> Materials &amp; Care
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`px-5 py-2.5 text-xs uppercase tracking-wider rounded-xs flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'shipping'
                ? 'bg-[#413C23] text-white font-medium shadow-xs'
                : 'bg-[#E7E4D5] text-[#413C23] border border-[#D8D2C2] hover:bg-[#D8D2C2]'
            }`}
          >
            <Truck className="w-4 h-4" /> Shipping &amp; Returns
          </button>
        </div>
      </section>

      {/* 3. Tab Contents */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 max-w-5xl mx-auto">
        {/* TAB 1: FAQs */}
        {activeTab === 'faq' && (
          <div className="space-y-4">
            {faqItems.map((item, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="bg-[#E7E4D5] border border-[#D8D2C2] rounded-xs overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#D8D2C2]/40"
                  >
                    <span className="font-serif-display text-base sm:text-lg text-[#413C23] font-medium">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#8F896D] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#413C23]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-[#413C23]/80 font-light leading-relaxed border-t border-[#D8D2C2]/60 bg-[#E7E4D5]/60">
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
          <div className="bg-[#E7E4D5] border border-[#D8D2C2] rounded-xs p-6 sm:p-10 space-y-8">
            <div>
              <h2 className="font-serif-display text-2xl sm:text-3xl text-[#413C23]">Interactive Ring Size Finder</h2>
              <p className="text-xs sm:text-sm text-[#413C23]/70 mt-1 font-light">
                Wrap a strip of paper or string around the base of your finger, mark where it overlaps, and measure the length in millimeters.
              </p>
            </div>

            {/* Interactive Slider */}
            <div className="bg-[#E7E4D5] border border-[#D8D2C2] p-6 rounded-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#413C23]">Finger Circumference:</span>
                <span className="text-sm font-serif-display font-medium text-[#8F896D]">{ringSizeInput} mm</span>
              </div>
              <input
                type="range"
                min="45"
                max="65"
                value={ringSizeInput}
                onChange={(e) => setRingSizeInput(Number(e.target.value))}
                className="w-full accent-[#413C23] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#8F896D]">
                <span>45 mm (US 3.5)</span>
                <span>55 mm (US 7)</span>
                <span>65 mm (US 11)</span>
              </div>
              <div className="pt-3 border-t border-[#D8D2C2] flex items-center justify-between">
                <span className="text-xs text-[#413C23]/80">Recommended Size:</span>
                <span className="text-sm font-semibold text-[#413C23]">{getEstimatedUsSize(ringSizeInput)}</span>
              </div>
            </div>

            {/* Sizing Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-[#D8D2C2]">
                <thead className="bg-[#D8D2C2]/40 text-[#413C23] uppercase tracking-wider font-semibold border-b border-[#D8D2C2]">
                  <tr>
                    <th className="p-3 border-r border-[#D8D2C2]">US Size</th>
                    <th className="p-3 border-r border-[#D8D2C2]">UK / AU</th>
                    <th className="p-3 border-r border-[#D8D2C2]">EU Size</th>
                    <th className="p-3 border-r border-[#D8D2C2]">Inside Diameter</th>
                    <th className="p-3">Circumference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8D2C2]">
                  {[
                    { us: '5', uk: 'J ½', eu: '49', diam: '15.7 mm', circ: '49.3 mm' },
                    { us: '6', uk: 'M', eu: '52', diam: '16.5 mm', circ: '51.9 mm' },
                    { us: '7', uk: 'O', eu: '54', diam: '17.3 mm', circ: '54.5 mm' },
                    { us: '8', uk: 'Q', eu: '57', diam: '18.1 mm', circ: '57.2 mm' },
                    { us: '9', uk: 'S', eu: '59', diam: '18.9 mm', circ: '59.8 mm' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-[#D8D2C2]/30">
                      <td className="p-3 font-semibold text-[#413C23] border-r border-[#D8D2C2]">{row.us}</td>
                      <td className="p-3 border-r border-[#D8D2C2]">{row.uk}</td>
                      <td className="p-3 border-r border-[#D8D2C2]">{row.eu}</td>
                      <td className="p-3 border-r border-[#D8D2C2]">{row.diam}</td>
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
              <div className="bg-[#E7E4D5] border border-[#D8D2C2] p-6 sm:p-8 rounded-xs space-y-4">
                <div className="flex items-center gap-3 text-[#413C23]">
                  <Gem className="w-5 h-5" />
                  <h3 className="font-serif-display text-xl text-[#413C23]">Premium Brass &amp; Anti-Tarnish Finish</h3>
                </div>
                <p className="text-xs sm:text-sm text-[#413C23]/80 font-light leading-relaxed">
                  We craft our dailywear pieces with high-density brass and durable alloys sealed with protective e-coating to resist oxidation and daily tarnishing.
                </p>
                <div className="space-y-2 pt-2 border-t border-[#D8D2C2] text-xs text-[#413C23]">
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#8F896D]" /> Water-resistant &amp; durable for daily routines</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#8F896D]" /> 100% hypoallergenic, nickel &amp; lead free</div>
                </div>
              </div>

              <div className="bg-[#E7E4D5] border border-[#D8D2C2] p-6 sm:p-8 rounded-xs space-y-4">
                <div className="flex items-center gap-3 text-[#413C23]">
                  <Sparkles className="w-5 h-5" />
                  <h3 className="font-serif-display text-xl text-[#413C23]">Daily Care Rituals</h3>
                </div>
                <p className="text-xs sm:text-sm text-[#413C23]/80 font-light leading-relaxed">
                  Apply perfumes, sanitizers, and lotions before wearing your jewelry. Store in your pouch when not in use to preserve the luster.
                </p>
                <div className="space-y-2 pt-2 border-t border-[#D8D2C2] text-xs text-[#413C23]">
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#8F896D]" /> Buff gently with a dry microfiber cloth</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#8F896D]" /> Keep dry and store separately</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Shipping & Returns */}
        {activeTab === 'shipping' && (
          <div className="bg-[#E7E4D5] border border-[#D8D2C2] rounded-xs p-6 sm:p-10 space-y-6">
            <h2 className="font-serif-display text-2xl sm:text-3xl text-[#413C23]">Express Shipping &amp; 14-Day Returns</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="p-4 bg-[#E7E4D5] border border-[#D8D2C2] rounded-xs space-y-2">
                <Truck className="w-5 h-5 text-[#8F896D]" />
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#413C23]">Express Delivery</h4>
                <p className="text-xs text-[#413C23]/80 font-light leading-relaxed">
                  Tracked courier delivery dispatched promptly within 24-48 hours.
                </p>
              </div>
              <div className="p-4 bg-[#E7E4D5] border border-[#D8D2C2] rounded-xs space-y-2">
                <ShieldCheck className="w-5 h-5 text-[#8F896D]" />
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#413C23]">Safe Delivery</h4>
                <p className="text-xs text-[#413C23]/80 font-light leading-relaxed">
                  Every order is securely packaged in our signature keepsake pouch and crush-proof box.
                </p>
              </div>
              <div className="p-4 bg-[#E7E4D5] border border-[#D8D2C2] rounded-xs space-y-2">
                <RotateCcw className="w-5 h-5 text-[#8F896D]" />
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#413C23]">14-Day Exchanges</h4>
                <p className="text-xs text-[#413C23]/80 font-light leading-relaxed">
                  Need a different size or style? We make exchanges quick and easy.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 4. Bottom Support CTA */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 mt-16 max-w-5xl mx-auto">
        <div className="bg-[#EAE6DB] border border-[#E6DFD3] p-8 sm:p-12 rounded-xs text-center space-y-4">
          <h3 className="font-serif-display text-2xl sm:text-3xl text-[#413C23]">Still have questions?</h3>
          <p className="text-xs sm:text-sm text-[#413C23]/80 max-w-md mx-auto font-light">
            Our team is always here to help you pick the right size or recommend styling stacks.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={onNavigateToContact}
              className="px-6 py-3 bg-[#413C23] text-white text-xs uppercase tracking-wider font-semibold rounded-xs hover:bg-[#8F896D] transition-colors cursor-pointer"
            >
              Contact Support
            </button>
            <button
              onClick={onNavigateToShop}
              className="px-6 py-3 border border-[#413C23] text-[#413C23] text-xs uppercase tracking-wider font-semibold rounded-xs hover:bg-[#413C23] hover:text-white transition-colors cursor-pointer"
            >
              Shop Jewelry
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
