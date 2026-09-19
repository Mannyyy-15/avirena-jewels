import React, { useState } from 'react';
import { Link } from 'react-router';
import {
  RotateCcw,
  Lock,
  FileText,
  Truck,
  Mail,
  Scale,
  Copy,
  Check,
  CheckCircle2,
  Building2,
  Phone,
  Clock,
  ShieldCheck,
  Gem,
} from 'lucide-react';

interface PolicyLayoutProps {
  activeHandle?: string;
  serverPolicyTitle?: string;
  serverPolicyBodyHtml?: string;
}

export function PolicyLayout({
  activeHandle = 'refund-policy',
  serverPolicyTitle,
  serverPolicyBodyHtml,
}: PolicyLayoutProps) {
  const [activeTab, setActiveTab] = useState<'returns' | 'privacy' | 'terms' | 'shipping' | 'contact' | 'legal'>(() => {
    if (activeHandle === 'privacy-policy') return 'privacy';
    if (activeHandle === 'terms-of-service') return 'terms';
    if (activeHandle === 'shipping-policy') return 'shipping';
    if (activeHandle === 'contact' || activeHandle === 'contact-information') return 'contact';
    if (activeHandle === 'legal-notice') return 'legal';
    return 'returns';
  });
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

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

  const copyToClipboard = (text: string, tabId: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedTab(tabId);
      setTimeout(() => setCopiedTab(null), 2500);
    }
  };

  const policiesData = {
    returns: {
      title: 'Return and Refund Policy',
      subtitle: '7-Day Compliant Client Returns & Exchanges',
      text: `AVIRENA JEWELS — RETURN & REFUND POLICY

At Avirena Jewels, we take immense pride in the craftsmanship and finish quality of our pieces. If you are not completely enamored with your selection, we offer a straightforward 7-Day Return & Exchange window from the date of package delivery.

1. Eligibility for Returns & Exchanges:
• Items must be in their original, unworn, and unblemished condition.
• The piece must be returned with its original packaging.
• Custom bespoke commissions, personalized engravings, and gift cards are final sale and cannot be returned unless a structural defect is verified.

2. How to Initiate a Return:
• Email our concierge team at avirenajewels@gmail.com or WhatsApp us with your Order ID (#AV-XXXXX) and reason for return/exchange.
• We will arrange a courier pickup from your address.

3. Refunds & Processing:
• Once your return reaches us, we inspect it within 2 business days.
• Approved refunds are credited directly to your original payment method within 3–5 business days, depending on your financial institution.
• Alternatively, you may choose store credit for the full value with no deduction.

4. Damaged or Defective Items:
• If an item arrives damaged during transit, please notify avirenajewels@gmail.com within 48 hours of receipt with clear photographs. We will immediately dispatch a priority replacement at zero additional charge.`,
    },

    privacy: {
      title: 'Privacy Policy',
      subtitle: 'Data Protection, Security & Compliance Standards',
      text: `AVIRENA JEWELS — PRIVACY POLICY
Last Updated: September 2026

Avirena Jewels ("we", "our", or "us") is dedicated to safeguarding your personal data and ensuring transparent privacy practices in compliance with global data privacy regulations (including GDPR, CCPA, and the Indian Digital Personal Data Protection Act).

1. Information We Collect:
• Personal Information: Name, billing address, shipping address, email address, and telephone number provided during checkout or account creation.
• Payment Data: All credit card, UPI, Apple Pay, and digital wallet transactions are encrypted via 256-bit SSL protocols directly through our PCI-DSS Tier 1 certified payment gateway partners (Shopify Payments / Stripe / Razorpay). Avirena never stores complete credit card numbers or security CVV codes.
• Device & Analytics Information: IP address, browser type, geographic region, and browsing behavior to optimize page performance and prevent fraudulent transactions.

2. How We Use Your Information:
• To process, fulfill, and provide real-time updates for your jewelry orders.
• To communicate customer concierge support, custom sizing consultations, and order confirmations.
• To send optional private atelier lookbooks and editorial releases (you may unsubscribe at any time).
• To detect and prevent fraudulent transactions and unauthorized access.

3. Sharing with Third Parties:
• We do NOT sell, rent, or trade your personal information to third-party advertising brokers.
• Information is shared strictly with essential service providers: express logistics carriers (Bluedart, DHL, FedEx) and secure payment processors.

4. Your Rights & Data Deletion:
• You hold the right to access, rectify, or request permanent deletion of your personal records at any time by emailing avirenajewels@gmail.com.`,
    },

    terms: {
      title: 'Terms of Service',
      subtitle: 'Online Store Terms, Pricing & Intellectual Property',
      text: `AVIRENA JEWELS — TERMS OF SERVICE
Last Updated: September 2026

Welcome to the Avirena Jewels online boutique (avirenajewels.com). By visiting our website or purchasing our creations, you agree to be bound by the following terms and conditions.

1. General Conditions:
• We reserve the right to refuse service, terminate accounts, or cancel orders at our discretion if fraud or violation of terms is suspected.
• You agree not to duplicate, resell, copy, or exploit any portion of our jewelry sculptures, design patents, or website assets without express written consent.

2. Products, Materials & Pricing:
• All descriptions, dimensions, and material compositions (high-grade brass, durable alloys, anti-tarnish protective coatings, cultured freshwater baroque pearls) are documented with utmost accuracy. Because our pieces feature cultured baroque pearls, slight organic variations in contour and iridescence celebrate each item's uniqueness.
• Prices are subject to change without prior notice. We reserve the right to correct typographical pricing errors.

3. Order Acceptance & Cancellations:
• An order confirmation does not signify our final acceptance of an order. We reserve the right to limit order quantities per household or cancel orders affected by inventory inaccuracies.
• Orders may be cancelled within 4 hours of placement by contacting avirenajewels@gmail.com prior to dispatch handover.

4. Intellectual Property:
• All visual branding, typography treatments, original design sculpts, product photography, and editorial copy are the exclusive intellectual property of Avirena Jewels.

5. Governing Law:
• These Terms of Service and any separate agreements whereby we provide you services shall be governed by and construed in accordance with the laws of India, with jurisdiction in Mumbai courts.`,
    },

    shipping: {
      title: 'Shipping Policy',
      subtitle: 'Insured Global Delivery Timelines & Transit Terms',
      text: `AVIRENA JEWELS — SHIPPING & TRANSIT POLICY

Every order is carefully packaged for safe and secure transit.

1. Order Processing Timelines:
• In-stock pieces are dispatched within 1-2 business days (Monday to Saturday, excluding public holidays).
• Made-to-order pieces require 7-10 business days.

2. Domestic Delivery (India):
• Timeline: 2 to 4 business days via Express Courier.
• Shipping Cost: Free Express Insured Delivery on all orders. No minimum order value required.
• Cash on Delivery (COD) and Prepaid options are supported nationwide.

3. International Delivery:
• Timeline: 4 to 7 business days via International Express.
• Shipping Cost: Calculated at checkout or complimentary on eligible orders.
• Duties & Taxes: International orders are shipped DDP (Delivery Duty Paid) where possible, ensuring zero surprise customs fees upon arrival.

4. 100% Transit Insurance Guarantee:
• Every parcel is 100% insured from our studio until the moment of verified doorstep signature handover. If an order is lost in transit, an immediate priority replacement is dispatched.`,
    },

    contact: {
      title: 'Contact Information',
      subtitle: 'Official Atelier & Customer Concierge Registry',
      text: `AVIRENA JEWELS — CONTACT INFORMATION

Business Name:
Avirena Jewels (sole proprietorship)

Based in:
Mumbai, Maharashtra, India
Online only — we do not operate a walk-in store.

Email:
avirenajewels@gmail.com

Telephone & WhatsApp Support:
+91 92252 61659

Support Hours:
Monday – Saturday: 10:00 AM – 7:00 PM IST
Sunday: Closed

Grievance Officer:
Email: avirenajewels@gmail.com
We acknowledge complaints within 48 hours and resolve them within one month of receipt.`,
    },

    legal: {
      title: 'Legal Notice',
      subtitle: 'Company Registration, Tax Identification & Hallmarking',
      text: `AVIRENA JEWELS — LEGAL NOTICE (IMPRESSUM)

1. Business Information:
Trade Name: Avirena Jewels
Business Type: Sole proprietorship
Based in: Mumbai, Maharashtra, India
Proprietor / Grievance Officer: contactable at avirenajewels@gmail.com

2. Material Disclosures:
• Avirena jewelry is fashion jewelry crafted from high-density brass and durable alloys. It does not contain precious metal and is not sold as, or hallmarked to, any precious-metal fineness standard.
• Gold-tone and rose gold-tone finishes are achieved with a protective anti-tarnish e-coating over a brass base. Finish longevity varies with wear, skin chemistry, and care.
• Baroque pearls are ethically sourced cultured freshwater pearls.
• All pieces are nickel-free, lead-free, and cadmium-free. Earring posts are surgical steel.

3. Dispute Resolution:
• The European Commission provides an online dispute resolution platform: https://ec.europa.eu/consumers/odr
• For Indian consumers, grievances are handled per Consumer Protection (E-Commerce) Rules, 2020 via avirenajewels@gmail.com.`,
    },
  };

  const currentPolicy = policiesData[activeTab];

  return (
    <div className="w-full text-left font-sans-body bg-[#E7E4D5] text-[#413C23] pb-24 select-none">
      {/* 1. Header Banner */}
      <section className="relative w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 pt-4 pb-8 sm:pb-12">
        <div className="relative rounded-xs overflow-hidden border border-[#D8D2C2] bg-[#413C23] text-[#E7E4D5] py-14 sm:py-20 px-6 sm:px-12 text-center space-y-3 shadow-sm">
          <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] text-[#8F896D] uppercase block">
            (01) / Legal, Compliance & Service Registry
          </span>
          <h1 className="font-serif-display text-4xl sm:text-6xl lg:text-7xl font-light text-[#E7E4D5] tracking-tight">
            Policies & <span className="italic font-normal text-[#FAF8F5]">Client Assurance</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#E7E4D5]/80 max-w-xl mx-auto font-normal leading-relaxed">
            Official written policies covering 7-day returns, free delivery, privacy compliance, terms of service, and registered atelier contact disclosures.
          </p>
        </div>
      </section>

      {/* 2. Navigation Tabs */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 mb-10">
        <div className="flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto pb-2 border-b border-[#D8D2C2] scrollbar-none">
          {[
            { id: 'returns', path: '/refund-policy', label: 'Return & Refund', icon: RotateCcw },
            { id: 'privacy', path: '/privacy-policy', label: 'Privacy Policy', icon: Lock },
            { id: 'terms', path: '/terms-of-service', label: 'Terms of Service', icon: FileText },
            { id: 'shipping', path: '/shipping-policy', label: 'Shipping Policy', icon: Truck },
            { id: 'contact', path: '/contact', label: 'Contact Info', icon: Mail },
            { id: 'legal', path: '/legal-notice', label: 'Legal Notice', icon: Scale },
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
                    : 'bg-[#F2EFDB] text-[#413C23] border border-[#D8D2C2] hover:border-[#8F896D]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Main Policy Content Box */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 max-w-5xl mx-auto">
        <div className="bg-[#F2EFDB] border border-[#D8D2C2] rounded-xs p-6 sm:p-10 lg:p-12 space-y-8 shadow-xs text-left">
          {/* Policy Title & 1-Click Copy Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D8D2C2] pb-6">
            <div>
              <span className="text-[10px] text-[#8F896D] uppercase tracking-widest font-semibold block mb-1">
                Official Maison Policy
              </span>
              <h2 className="font-serif-display text-3xl sm:text-4xl text-[#413C23]">
                {currentPolicy.title}
              </h2>
              <p className="text-xs text-[#413C23]/70 pt-1">{currentPolicy.subtitle}</p>
            </div>

            <button
              onClick={() => copyToClipboard(currentPolicy.text, activeTab)}
              className="px-4 py-2.5 bg-[#FAF8F5] border border-[#D8D2C2] hover:border-[#413C23] text-[#413C23] text-xs uppercase tracking-wider font-semibold rounded-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer shadow-2xs"
            >
              {copiedTab === activeTab ? (
                <>
                  <Check className="w-4 h-4 text-[#413C23]" />
                  <span>Text Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#8F896D]" />
                  <span>Copy Policy</span>
                </>
              )}
            </button>
          </div>

          {/* Formatted Policy Text Display */}
          <div className="bg-[#FAF8F5] border border-[#D8D2C2] p-6 sm:p-8 rounded-xs font-mono text-xs text-[#413C23]/90 leading-relaxed whitespace-pre-wrap selection:bg-[#413C23] selection:text-[#FAF8F5]">
            {serverPolicyBodyHtml ? (
              <div dangerouslySetInnerHTML={{ __html: serverPolicyBodyHtml }} />
            ) : (
              currentPolicy.text
            )}
          </div>

          {/* Tab Specific Interactive Modules */}
          {activeTab === 'returns' && (
            <div className="space-y-6 pt-4 border-t border-[#D8D2C2]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-[#E7E4D5] border border-[#D8D2C2] rounded-xs space-y-1.5">
                  <span className="text-[10px] font-semibold text-[#8F896D] uppercase tracking-wider block">Step 01</span>
                  <h4 className="font-serif-display text-base text-[#413C23]">Initiate Request</h4>
                  <p className="text-xs text-[#413C23]/75 leading-relaxed">WhatsApp or email your Order ID to our concierge desk within 7 days.</p>
                </div>
                <div className="p-4 bg-[#E7E4D5] border border-[#D8D2C2] rounded-xs space-y-1.5">
                  <span className="text-[10px] font-semibold text-[#8F896D] uppercase tracking-wider block">Step 02</span>
                  <h4 className="font-serif-display text-base text-[#413C23]">Doorstep Pickup</h4>
                  <p className="text-xs text-[#413C23]/75 leading-relaxed">Our express courier collects the parcel in its original pouch.</p>
                </div>
                <div className="p-4 bg-[#E7E4D5] border border-[#D8D2C2] rounded-xs space-y-1.5">
                  <span className="text-[10px] font-semibold text-[#8F896D] uppercase tracking-wider block">Step 03</span>
                  <h4 className="font-serif-display text-base text-[#413C23]">Prompt Refund</h4>
                  <p className="text-xs text-[#413C23]/75 leading-relaxed">Direct refund to payment method in 3–5 days or instant store credit.</p>
                </div>
              </div>

              <div className="bg-[#E7E4D5] p-6 rounded-xs border border-[#D8D2C2] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif-display text-xl text-[#413C23]">Initiate Quick Exchange / Return</h3>
                  <span className="text-[10px] uppercase tracking-widest text-[#8F896D] font-semibold">Priority Desk</span>
                </div>

                {returnSubmitted ? (
                  <div className="p-6 bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-[#413C23] mx-auto" />
                    <h4 className="font-serif-display text-lg text-[#413C23]">Exchange Request Received</h4>
                    <p className="text-xs text-[#413C23]/75 max-w-md mx-auto">
                      Our concierge team will review Order #{returnForm.orderId} and dispatch return pickup instructions to {returnForm.email} within 4 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleReturnSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Order ID (#AV-10023)"
                      value={returnForm.orderId}
                      onChange={(e) => setReturnForm({ ...returnForm, orderId: e.target.value })}
                      className="px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs text-[#413C23] placeholder-[#8F896D]/60 focus:outline-none focus:border-[#413C23]"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Your Purchase Email"
                      value={returnForm.email}
                      onChange={(e) => setReturnForm({ ...returnForm, email: e.target.value })}
                      className="px-3 py-2 text-xs bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs text-[#413C23] placeholder-[#8F896D]/60 focus:outline-none focus:border-[#413C23]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#413C23] hover:bg-[#8F896D] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors cursor-pointer"
                    >
                      Submit Return Request
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#D8D2C2]">
              <div className="p-5 bg-[#E7E4D5] rounded-xs border border-[#D8D2C2] space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-[#8F896D] font-semibold">Standard Domestic</span>
                <h4 className="font-serif-display text-lg text-[#413C23]">Free Express Insured Courier</h4>
                <p className="text-xs text-[#413C23]/75 leading-relaxed">
                  Every parcel is tracked with real-time SMS updates. Delivery within 2–4 business days across metro & tier-1 cities.
                </p>
              </div>
              <div className="p-5 bg-[#E7E4D5] rounded-xs border border-[#D8D2C2] space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-[#8F896D] font-semibold">Worldwide Delivery</span>
                <h4 className="font-serif-display text-lg text-[#413C23]">International Priority Express</h4>
                <p className="text-xs text-[#413C23]/75 leading-relaxed">
                  Delivered in 4–7 business days via DHL Express with all import duties pre-calculated at checkout.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#D8D2C2]">
              <div className="p-5 bg-[#E7E4D5] rounded-xs border border-[#D8D2C2] space-y-3">
                <div className="flex items-center gap-2 text-[#413C23]">
                  <Building2 className="w-4 h-4 text-[#8F896D]" />
                  <span className="text-xs uppercase tracking-wider font-semibold">Registered Studio</span>
                </div>
                <p className="text-xs text-[#413C23]/80 leading-relaxed">
                  Avirena Jewels<br />
                  Online Studio &amp; Atelier<br />
                  Mumbai, Maharashtra, India
                </p>
              </div>
              <div className="p-5 bg-[#E7E4D5] rounded-xs border border-[#D8D2C2] space-y-3">
                <div className="flex items-center gap-2 text-[#413C23]">
                  <Clock className="w-4 h-4 text-[#8F896D]" />
                  <span className="text-xs uppercase tracking-wider font-semibold">Concierge Desk</span>
                </div>
                <p className="text-xs text-[#413C23]/80 leading-relaxed">
                  Mon – Sat: 10:00 AM – 7:00 PM IST<br />
                  WhatsApp: +91 92252 61659<br />
                  Email: avirenajewels@gmail.com
                </p>
              </div>
            </div>
          )}

          {activeTab === 'legal' && (
            <div className="space-y-4 pt-4 border-t border-[#D8D2C2]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 bg-[#E7E4D5] rounded-xs border border-[#D8D2C2] space-y-2">
                  <div className="flex items-center gap-2 text-[#413C23]">
                    <Gem className="w-4 h-4 text-[#8F896D]" />
                    <span className="text-xs uppercase tracking-wider font-semibold">Fashion Jewelry Disclosure</span>
                  </div>
                  <p className="text-xs text-[#413C23]/75 leading-relaxed">
                    Avirena items are cast in high-grade brass alloy with protective anti-tarnish coatings. They are not solid gold or precious silver.
                  </p>
                </div>
                <div className="p-5 bg-[#E7E4D5] rounded-xs border border-[#D8D2C2] space-y-2">
                  <div className="flex items-center gap-2 text-[#413C23]">
                    <ShieldCheck className="w-4 h-4 text-[#8F896D]" />
                    <span className="text-xs uppercase tracking-wider font-semibold">Consumer Protection</span>
                  </div>
                  <p className="text-xs text-[#413C23]/75 leading-relaxed">
                    Operated in full compliance with the Consumer Protection (E-Commerce) Rules 2020 and Indian DPDP Act.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
