import React, { useState } from 'react';
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
  Gem
} from 'lucide-react';

interface PoliciesPageProps {
  onNavigateToContact: () => void;
  onNavigateToShop: () => void;
  initialTab?: 'returns' | 'privacy' | 'terms' | 'shipping' | 'contact' | 'legal';
}

export const PoliciesPage: React.FC<PoliciesPageProps> = ({
  onNavigateToContact,
  onNavigateToShop,
  initialTab = 'returns',
}) => {
  const [activeTab, setActiveTab] = useState<'returns' | 'privacy' | 'terms' | 'shipping' | 'contact' | 'legal'>(initialTab);
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

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

  const copyToClipboard = (text: string, tabId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(tabId);
    setTimeout(() => setCopiedTab(null), 2500);
  };

  const policiesData = {
    returns: {
      title: 'Return and Refund Policy',
      subtitle: '14-Day Compliant Client Returns & Exchanges',
      text: `AVIRENA JEWELS — RETURN & REFUND POLICY

At Avirena Jewels, we take immense pride in the artisanal craftsmanship and metallurgical integrity of our demi-fine creations. If you are not completely enamored with your selection, we offer a straightforward 14-Day Return & Exchange window from the date of package delivery.

1. Eligibility for Returns & Exchanges:
• Items must be in their original, unworn, and unblemished condition.
• The piece must be accompanied by the original velvet keepsake pouch, presentation box, and certificate of authenticity.
• Custom bespoke commissions, personalized engravings, and gift cards are final sale and cannot be returned unless a structural defect is verified.

2. How to Initiate a Return:
• Email our concierge team at concierge@avirena.com or WhatsApp us with your Order ID (#AV-XXXXX) and reason for return/exchange.
• Our atelier will schedule an insured doorstep courier pickup at your designated address.

3. Refunds & Processing:
• Once received at our studio, your piece undergoes a gemological and physical inspection within 2 business days.
• Approved refunds are credited directly to your original payment method within 3–5 business days, depending on your financial institution.
• Alternatively, you may choose Instant Atelier Store Credit with zero deductions.

4. Damaged or Defective Items:
• If an item arrives damaged during transit, please notify concierge@avirena.com within 48 hours of receipt with clear photographs. We will immediately dispatch a priority replacement at zero additional charge.`,
    },

    privacy: {
      title: 'Privacy Policy',
      subtitle: 'Data Protection, Security & Compliance Standards',
      text: `AVIRENA JEWELS — PRIVACY POLICY
Last Updated: September 2026

Studio Avirena ("we", "our", or "us") is dedicated to safeguarding your personal data and ensuring transparent privacy practices in compliance with global data privacy regulations (including GDPR, CCPA, and the Indian Digital Personal Data Protection Act).

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
• You hold the right to access, rectify, or request permanent deletion of your personal records at any time by emailing privacy@avirena.com.`,
    },

    terms: {
      title: 'Terms of Service',
      subtitle: 'Online Store Terms, Pricing & Intellectual Property',
      text: `AVIRENA JEWELS — TERMS OF SERVICE
Last Updated: September 2026

Welcome to the Avirena Jewels online boutique (avirena.com). By visiting our website or purchasing our creations, you agree to be bound by the following terms and conditions.

1. General Conditions:
• We reserve the right to refuse service, terminate accounts, or cancel orders at our discretion if fraud or violation of terms is suspected.
• You agree not to duplicate, resell, copy, or exploit any portion of our jewelry sculptures, design patents, or website assets without express written consent.

2. Products, Materials & Pricing:
• All descriptions, gemstone dimensions, and metal purities (18k Gold Vermeil, 925 Sterling Silver, natural baroque pearls) are documented with utmost accuracy. Because our pieces feature natural baroque pearls, slight organic variations in contour and iridescence celebrate each item's uniqueness.
• Prices are subject to change without prior notice. We reserve the right to correct typographical pricing errors.

3. Order Acceptance & Cancellations:
• An order confirmation does not signify our final acceptance of an order. We reserve the right to limit order quantities per household or cancel orders affected by inventory inaccuracies.
• Orders may be cancelled within 4 hours of placement by contacting concierge@avirena.com prior to dispatch handover.

4. Intellectual Property:
• All visual branding, Cormorant/Atelier typography treatments, lost-wax casting sculpts, product photography, and editorial copy are the exclusive intellectual property of Avirena Jewels Private Limited.

5. Governing Law:
• These Terms of Service and any separate agreements whereby we provide you services shall be governed by and construed in accordance with the laws of India, with jurisdiction in Mumbai courts.`,
    },

    shipping: {
      title: 'Shipping Policy',
      subtitle: 'Insured Global Delivery Timelines & Transit Terms',
      text: `AVIRENA JEWELS — SHIPPING & TRANSIT POLICY

Every Avirena creation is carefully packaged in our signature velvet travel pouch and protective presentation box, fully insured against transit loss or damage.

1. Order Processing Timelines:
• In-stock pieces are dispatched within 24 to 48 business hours from our atelier (Monday through Saturday, excluding national holidays).
• Made-to-order custom sizes or bespoke commissions require 7–10 business days for master artisan casting.

2. Domestic Delivery (India):
• Timeline: 2 to 4 business days via Bluedart Luxury Air / Express Courier.
• Shipping Cost: Complimentary Express Insured Delivery on all orders above ₹3,000 / $150. A flat fee of ₹150 applies to orders below the threshold.
• Cash on Delivery (COD) and Prepaid options are supported nationwide.

3. International Delivery (US, UK, Europe & Worldwide):
• Europe & UK: 3 to 5 business days via DHL Express / FedEx Priority.
• North America & Rest of World: 4 to 7 business days via DHL International Priority.
• Shipping Cost: Calculated at checkout or complimentary on orders over $150 / €150 / £130.
• Duties & Taxes: International orders are shipped DDP (Delivery Duty Paid) where possible, ensuring zero surprise customs fees upon arrival.

4. 100% Transit Insurance Guarantee:
• Every parcel is 100% insured from our studio until the moment of verified doorstep signature handover. If an order is lost in transit, an immediate priority replacement is dispatched.`,
    },

    contact: {
      title: 'Contact Information',
      subtitle: 'Official Atelier & Customer Concierge Registry',
      text: `AVIRENA JEWELS — CONTACT INFORMATION

Legal Business Entity:
Avirena Jewels Private Limited

Registered Atelier & Studio Office:
Studio Avirena, Suite 402, Heritage Craft Enclave,
Bandra West, Mumbai, Maharashtra 400050, India

Customer Concierge Email:
concierge@avirena.com
support@avirena.com

Telephone & WhatsApp Support:
+91 98200 12345 / +91 80505 56004

Atelier Operational Hours:
Monday – Saturday: 10:00 AM – 7:00 PM IST (06:30 – 15:30 CET)
Sunday: Closed (Concierge tickets monitored for urgent inquiries)

Grievance & Legal Officer:
Attn: Legal & Compliance Officer
Email: legal@avirena.com`,
    },

    legal: {
      title: 'Legal Notice',
      subtitle: 'Company Registration, Tax Identification & Hallmarking',
      text: `AVIRENA JEWELS — LEGAL NOTICE (IMPRESSUM)

1. Company Information:
Trade Name: Avirena Jewels
Corporate Identity Number (CIN): U36999MH2024PTC123456
GSTIN / Tax ID: 27AAAAA0000A1Z5
Director / Representative: Avirena Atelier Management Board

2. Metallurgical & Hallmarking Disclosures:
• All precious silver jewelry manufactured and retailed by Avirena conforms to Bureau of Indian Standards (BIS) 925 fineness guidelines (IS 2112:2014) and European Assay standards.
• Gold Vermeil pieces feature minimum 3.0-micron 18k yellow gold electrolytic deposition over 100% recycled 925 sterling silver cores.
• Natural baroque pearls are ethically sourced cultivated freshwater pearls.

3. Dispute Resolution:
• The European Commission provides an online dispute resolution platform: https://ec.europa.eu/consumers/odr
• For Indian consumers, grievances are handled per Consumer Protection (E-Commerce) Rules, 2020 via legal@avirena.com.`,
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
            Official written policies covering 14-day returns, worldwide insured shipping, privacy compliance, terms of service, and registered atelier contact disclosures.
          </p>
        </div>
      </section>

      {/* 2. Navigation Tabs (Matching Shopify's 6 Policy Categories) */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 mb-10">
        <div className="flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto pb-2 border-b border-[#D8D2C2] scrollbar-none">
          {[
            { id: 'returns', label: 'Return & Refund', icon: RotateCcw },
            { id: 'privacy', label: 'Privacy Policy', icon: Lock },
            { id: 'terms', label: 'Terms of Service', icon: FileText },
            { id: 'shipping', label: 'Shipping Policy', icon: Truck },
            { id: 'contact', label: 'Contact Info', icon: Mail },
            { id: 'legal', label: 'Legal Notice', icon: Scale },
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

      {/* 3. Main Policy Content Box */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 max-w-5xl mx-auto">
        <div className="bg-[#F4EFE6] border border-[#D8D2C2] rounded-xs p-6 sm:p-10 lg:p-12 space-y-8 shadow-xs text-left">
          
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
              title="Copy text to paste directly into Shopify Admin > Policies"
            >
              {copiedTab === activeTab ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#8F896D]" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#8F896D]" />
                  <span>Copy for Shopify Admin</span>
                </>
              )}
            </button>
          </div>

          {/* Formatted Text Viewer */}
          <div className="bg-[#FAF8F5] p-6 sm:p-8 rounded-xs border border-[#D8D2C2] text-xs sm:text-sm text-[#413C23]/85 leading-relaxed font-sans-body whitespace-pre-line select-text">
            {currentPolicy.text}
          </div>

          {/* Special Interactive Section for Returns */}
          {activeTab === 'returns' && (
            <div className="pt-4 space-y-4">
              <h3 className="font-serif-display text-2xl text-[#413C23]">
                Online Exchange & Return Form
              </h3>

              {returnSubmitted ? (
                <div className="py-8 text-center space-y-3 bg-[#FAF8F5] rounded-xs border border-[#D8D2C2] p-6">
                  <CheckCircle2 className="w-10 h-10 text-[#8F896D] mx-auto" />
                  <h4 className="font-serif-display text-xl text-[#413C23]">Request Received for #{returnForm.orderId}</h4>
                  <p className="text-xs text-[#8F896D] max-w-md mx-auto">
                    Our concierge team has received your request and will schedule insured doorstep pickup within 12 business hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleReturnSubmit} className="space-y-3 bg-[#FAF8F5] p-6 rounded-xs border border-[#D8D2C2]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Order ID (e.g. AV-10482)"
                      value={returnForm.orderId}
                      onChange={(e) => setReturnForm({ ...returnForm, orderId: e.target.value })}
                      className="px-3.5 py-2.5 bg-[#F4EFE6] border border-[#D8D2C2] rounded-xs text-xs text-[#413C23] focus:outline-none focus:border-[#8F896D]"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Email used during checkout"
                      value={returnForm.email}
                      onChange={(e) => setReturnForm({ ...returnForm, email: e.target.value })}
                      className="px-3.5 py-2.5 bg-[#F4EFE6] border border-[#D8D2C2] rounded-xs text-xs text-[#413C23] focus:outline-none focus:border-[#8F896D]"
                    />
                  </div>

                  <select
                    value={returnForm.reason}
                    onChange={(e) => setReturnForm({ ...returnForm, reason: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#F4EFE6] border border-[#D8D2C2] rounded-xs text-xs text-[#413C23] focus:outline-none focus:border-[#8F896D]"
                  >
                    <option value="size_exchange">Exchange Size (Ring, Bracelet, Chain)</option>
                    <option value="different_piece">Exchange for Another Atelier Piece</option>
                    <option value="full_refund">Return for Full Refund to Original Payment Method</option>
                    <option value="store_credit">Return for Store Credit</option>
                  </select>

                  <textarea
                    rows={2}
                    placeholder="Additional notes or desired replacement ring size..."
                    value={returnForm.notes}
                    onChange={(e) => setReturnForm({ ...returnForm, notes: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#F4EFE6] border border-[#D8D2C2] rounded-xs text-xs text-[#413C23] focus:outline-none focus:border-[#8F896D]"
                  />

                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#413C23] hover:bg-[#8F896D] text-[#E7E4D5] text-xs uppercase tracking-widest font-semibold rounded-xs transition-colors cursor-pointer"
                  >
                    Submit Exchange / Return Request
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Concierge Assistance Footer */}
          <div className="pt-4 border-t border-[#D8D2C2] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#413C23]/80">
            <span>Have questions about our terms or custom bridal commissions?</span>
            <button
              onClick={onNavigateToContact}
              className="font-semibold text-[#413C23] hover:text-[#8F896D] underline uppercase tracking-wider cursor-pointer"
            >
              Contact Atelier Concierge →
            </button>
          </div>

        </div>
      </section>
    </div>
  );
};
