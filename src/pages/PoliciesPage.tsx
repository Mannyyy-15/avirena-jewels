import React, { useState } from 'react';
import {
  Truck,
  RotateCcw,
  Gem,
  Lock,
  CheckCircle2,
  FileText,
  Clock,
  HelpCircle,
  ArrowRight,
  Send,
  AlertCircle
} from 'lucide-react';

interface PoliciesPageProps {
  onNavigateToContact: () => void;
  onNavigateToShop: () => void;
  initialTab?: 'shipping' | 'returns' | 'authenticity' | 'privacy';
}

export const PoliciesPage: React.FC<PoliciesPageProps> = ({
  onNavigateToContact,
  onNavigateToShop,
  initialTab = 'shipping',
}) => {
  const [activeTab, setActiveTab] = useState<'shipping' | 'returns' | 'authenticity' | 'privacy'>(initialTab);

  // Return request form state
  const [returnForm, setReturnForm] = useState({
    orderId: '',
    email: '',
    reason: 'size_exchange',
    notes: '',
  });
  const [returnSubmitted, setReturnSubmitted] = useState(false);

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReturnSubmitted(true);
  };

  return (
    <div className="w-full text-left font-sans-body bg-[#E7E4D5] text-[#413C23] pb-24 select-none">
      {/* 1. Header Banner */}
      <section className="relative w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 pt-4 pb-8 sm:pb-12">
        <div className="relative rounded-xs overflow-hidden border border-[#D8D2C2] bg-[#413C23] text-[#E7E4D5] py-14 sm:py-20 px-6 sm:px-12 text-center space-y-3 shadow-sm">
          <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] text-[#8F896D] uppercase block">
            (01) / Maison Service Standards
          </span>
          <h1 className="font-serif-display text-4xl sm:text-6xl lg:text-7xl font-light text-[#E7E4D5] tracking-tight">
            Policies & <span className="italic font-normal text-[#FAF8F5]">Client Assurance</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#E7E4D5]/80 max-w-xl mx-auto font-normal leading-relaxed">
            Transparent guidelines covering worldwide insured shipping, 14-day hassle-free exchanges, and hallmarked precious metal standards.
          </p>
        </div>
      </section>

      {/* 2. Navigation Tabs */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 mb-10">
        <div className="flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto pb-2 border-b border-[#D8D2C2] scrollbar-none">
          {[
            { id: 'shipping', label: 'Shipping & Delivery', icon: Truck },
            { id: 'returns', label: '14-Day Returns & Exchanges', icon: RotateCcw },
            { id: 'authenticity', label: 'Materials & Hallmarking', icon: Gem },
            { id: 'privacy', label: 'Privacy & Terms', icon: Lock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 text-xs uppercase tracking-wider rounded-xs flex items-center gap-2 cursor-pointer transition-all shrink-0 font-medium ${
                  isActive
                    ? 'bg-[#413C23] text-[#E7E4D5] shadow-xs'
                    : 'bg-[#F4EFE6] text-[#413C23] border border-[#D8D2C2] hover:border-[#8F896D]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Main Policy Content */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 max-w-6xl mx-auto">
        <div className="bg-[#F4EFE6] border border-[#D8D2C2] rounded-xs p-6 sm:p-10 lg:p-12 space-y-8 shadow-xs text-left">
          
          {/* TAB 1: SHIPPING & TRANSIT INSURANCE */}
          {activeTab === 'shipping' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-[#D8D2C2] pb-4">
                <span className="text-[10px] text-[#8F896D] uppercase tracking-widest font-semibold block">
                  Delivery Framework
                </span>
                <h2 className="font-serif-display text-3xl sm:text-4xl text-[#413C23]">
                  Shipping & Insured Transit Policy
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-[#FAF8F5] p-5 rounded-xs border border-[#D8D2C2] space-y-2">
                  <span className="text-xs uppercase font-bold text-[#8F896D] block">Domestic India</span>
                  <p className="font-serif-display text-xl text-[#413C23]">2 – 4 Business Days</p>
                  <p className="text-xs text-[#413C23]/75">
                    Complimentary express courier via Bluedart Luxury Air. Includes tamper-proof security seal.
                  </p>
                </div>

                <div className="bg-[#FAF8F5] p-5 rounded-xs border border-[#D8D2C2] space-y-2">
                  <span className="text-xs uppercase font-bold text-[#8F896D] block">Europe & UK</span>
                  <p className="font-serif-display text-xl text-[#413C23]">3 – 5 Business Days</p>
                  <p className="text-xs text-[#413C23]/75">
                    Dispatched from our Vicenza, Italy studio with all VAT & custom duties pre-cleared.
                  </p>
                </div>

                <div className="bg-[#FAF8F5] p-5 rounded-xs border border-[#D8D2C2] space-y-2">
                  <span className="text-xs uppercase font-bold text-[#8F896D] block">North America & Global</span>
                  <p className="font-serif-display text-xl text-[#413C23]">4 – 7 Business Days</p>
                  <p className="text-xs text-[#413C23]/75">
                    Express DHL International courier with real-time SMS & email milestone tracking.
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-[#413C23]/80 leading-relaxed pt-2">
                <h4 className="font-serif-display text-lg text-[#413C23] font-medium">100% Transit Insurance Guarantee</h4>
                <p>
                  Every Avirena shipment is fully insured against theft, transit damage, or courier loss from our atelier until the moment it is signed for at your doorstep. In the rare event of transit complications, our concierge guarantees an immediate replacement or 100% full refund.
                </p>

                <h4 className="font-serif-display text-lg text-[#413C23] font-medium pt-2">Packaging Standards</h4>
                <p>
                  Orders arrive in our signature forest green velvet travel pouch, housed in an embossed gold-foil presentation box, accompanied by a certificate of authenticity and microfiber polishing cloth.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: 14-DAY RETURNS & EXCHANGE */}
          {activeTab === 'returns' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-[#D8D2C2] pb-4">
                <span className="text-[10px] text-[#8F896D] uppercase tracking-widest font-semibold block">
                  Peace of Mind Guarantee
                </span>
                <h2 className="font-serif-display text-3xl sm:text-4xl text-[#413C23]">
                  14-Day Return & Exchange Policy
                </h2>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-[#413C23]/80 leading-relaxed">
                <p>
                  We want you to be completely enamored with your creation. If the sizing isn't perfect or you wish to exchange for another silhouette, we provide a seamless <strong>14-day exchange and return window</strong> starting from your delivery date.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="bg-[#FAF8F5] p-4 rounded-xs border border-[#D8D2C2] space-y-1">
                    <span className="font-serif-display text-lg text-[#413C23] block">1. Doorstep Pickup</span>
                    <p className="text-xs text-[#8F896D]">We schedule an insured courier to pick up the piece at your address.</p>
                  </div>
                  <div className="bg-[#FAF8F5] p-4 rounded-xs border border-[#D8D2C2] space-y-1">
                    <span className="font-serif-display text-lg text-[#413C23] block">2. Atelier Quality Check</span>
                    <p className="text-xs text-[#8F896D]">Inspected by our gemologists to ensure unworn condition.</p>
                  </div>
                  <div className="bg-[#FAF8F5] p-4 rounded-xs border border-[#D8D2C2] space-y-1">
                    <span className="font-serif-display text-lg text-[#413C23] block">3. Immediate Refund/Exchange</span>
                    <p className="text-xs text-[#8F896D]">Processed to original payment method or instant store credit within 48h.</p>
                  </div>
                </div>

                {/* Interactive Return Initiation Form */}
                <div className="mt-8 bg-[#FAF8F5] border border-[#D8D2C2] p-6 rounded-xs space-y-4">
                  <h4 className="font-serif-display text-xl text-[#413C23]">
                    Initiate a Return or Exchange
                  </h4>

                  {returnSubmitted ? (
                    <div className="py-8 text-center space-y-3 bg-[#F4EFE6] rounded-xs border border-[#D8D2C2] p-6">
                      <CheckCircle2 className="w-10 h-10 text-[#8F896D] mx-auto" />
                      <h5 className="font-serif-display text-xl text-[#413C23]">Request Received for #{returnForm.orderId}</h5>
                      <p className="text-xs text-[#8F896D] max-w-md mx-auto">
                        Our returns concierge will email your prepaid courier label and arrange doorstep pickup within 12 business hours.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleReturnSubmit} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          required
                          placeholder="Order ID (e.g. AV-10482)"
                          value={returnForm.orderId}
                          onChange={(e) => setReturnForm({ ...returnForm, orderId: e.target.value })}
                          className="px-3 py-2 bg-[#F4EFE6] border border-[#D8D2C2] rounded-xs text-xs text-[#413C23] focus:outline-none focus:border-[#8F896D]"
                        />
                        <input
                          type="email"
                          required
                          placeholder="Email used for order"
                          value={returnForm.email}
                          onChange={(e) => setReturnForm({ ...returnForm, email: e.target.value })}
                          className="px-3 py-2 bg-[#F4EFE6] border border-[#D8D2C2] rounded-xs text-xs text-[#413C23] focus:outline-none focus:border-[#8F896D]"
                        />
                      </div>

                      <select
                        value={returnForm.reason}
                        onChange={(e) => setReturnForm({ ...returnForm, reason: e.target.value })}
                        className="w-full px-3 py-2 bg-[#F4EFE6] border border-[#D8D2C2] rounded-xs text-xs text-[#413C23] focus:outline-none focus:border-[#8F896D]"
                      >
                        <option value="size_exchange">Exchange Ring / Chain Size</option>
                        <option value="different_piece">Exchange for Another Design</option>
                        <option value="full_refund">Return for Full Refund to Original Card</option>
                        <option value="store_credit">Return for Store Credit</option>
                      </select>

                      <textarea
                        rows={2}
                        placeholder="Additional details / preferred replacement size..."
                        value={returnForm.notes}
                        onChange={(e) => setReturnForm({ ...returnForm, notes: e.target.value })}
                        className="w-full px-3 py-2 bg-[#F4EFE6] border border-[#D8D2C2] rounded-xs text-xs text-[#413C23] focus:outline-none focus:border-[#8F896D]"
                      />

                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-[#413C23] hover:bg-[#8F896D] text-[#E7E4D5] text-xs uppercase tracking-widest font-semibold rounded-xs transition-colors cursor-pointer"
                      >
                        Submit Return Request
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AUTHENTICITY & HALLMARKING */}
          {activeTab === 'authenticity' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-[#D8D2C2] pb-4">
                <span className="text-[10px] text-[#8F896D] uppercase tracking-widest font-semibold block">
                  Purity & Certification
                </span>
                <h2 className="font-serif-display text-3xl sm:text-4xl text-[#413C23]">
                  Hallmarking & Material Standards
                </h2>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-[#413C23]/80 leading-relaxed">
                <p>
                  We maintain strict metallurgical purity standards. All Avirena silver cores are cast in <strong>certified 100% recycled 925 sterling silver</strong> and stamped with the official <code>925</code> hallmark.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="bg-[#FAF8F5] p-5 rounded-xs border border-[#D8D2C2] space-y-2">
                    <span className="font-serif-display text-lg text-[#413C23] block">3.0µ Heavy Gold Vermeil</span>
                    <p className="text-xs text-[#413C23]/80">
                      Standard fashion jewelry uses 0.1 to 0.5-micron flash plating that rubs off in weeks. Our 3.0-micron 18k electrolytic bath is 6x thicker, delivering genuine solid gold radiance.
                    </p>
                  </div>

                  <div className="bg-[#FAF8F5] p-5 rounded-xs border border-[#D8D2C2] space-y-2">
                    <span className="font-serif-display text-lg text-[#413C23] block">Natural Baroque Pearls</span>
                    <p className="text-xs text-[#413C23]/80">
                      We never use synthetic resin, plastic, or simulated glass pearls. Every pearl is an organic, cultivated freshwater pearl with distinct natural iridescence.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PRIVACY & TERMS */}
          {activeTab === 'privacy' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-[#D8D2C2] pb-4">
                <span className="text-[10px] text-[#8F896D] uppercase tracking-widest font-semibold block">
                  Data & Security
                </span>
                <h2 className="font-serif-display text-3xl sm:text-4xl text-[#413C23]">
                  Privacy Policy & Terms of Service
                </h2>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-[#413C23]/80 leading-relaxed">
                <p>
                  Your privacy is sacred. All payment transactions are encrypted using <strong>256-Bit SSL protocols</strong>. We never store complete credit card information or share collector records with third-party advertising brokers.
                </p>

                <p>
                  For detailed inquiries regarding account data removal, bespoke contracts, or intellectual property rights, please email <a href="mailto:legal@avirena.com" className="underline font-semibold text-[#413C23]">legal@avirena.com</a>.
                </p>
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  );
};
