export interface PolicyData {
  id: 'returns' | 'privacy' | 'terms' | 'shipping' | 'contact' | 'legal';
  handle: string;
  title: string;
  subtitle: string;
  text: string;
}

export const POLICIES: Record<string, PolicyData> = {
  returns: {
    id: 'returns',
    handle: 'refund-policy',
    title: 'Return & Refund Policy',
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
    id: 'privacy',
    handle: 'privacy-policy',
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
• Information is shared strictly with essential service providers: express logistics carriers (Bluedart, Delhivery, India Post) and secure payment processors.

4. Your Rights & Data Deletion:
• You hold the right to access, rectify, or request permanent deletion of your personal records at any time by emailing avirenajewels@gmail.com.`,
  },

  terms: {
    id: 'terms',
    handle: 'terms-of-service',
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
    id: 'shipping',
    handle: 'shipping-policy',
    title: 'Shipping Policy',
    subtitle: 'Insured Delivery Timelines & Transit Terms',
    text: `AVIRENA JEWELS — SHIPPING & TRANSIT POLICY

Every order is carefully packaged for safe and secure transit.

1. Order Processing Timelines:
• In-stock pieces are dispatched within 24–48 business hours (Monday to Saturday, excluding public holidays).

2. Domestic Delivery (India):
• Timeline: 3 to 5 business days via Express Courier.
• Shipping Cost: Free Express Insured Delivery on all orders. No minimum order value required.
• Cash on Delivery (COD) and Prepaid options are supported nationwide.

3. International Delivery:
• Timeline: 4 to 7 business days via International Express.
• Shipping Cost: Calculated at checkout or complimentary on eligible orders.

4. 100% Transit Insurance Guarantee:
• Every parcel is 100% insured from our studio until the moment of verified doorstep signature handover. If an order is lost in transit, an immediate priority replacement is dispatched.`,
  },

  contact: {
    id: 'contact',
    handle: 'contact-information',
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
    id: 'legal',
    handle: 'legal-notice',
    title: 'Legal Notice',
    subtitle: 'Company Registration, Tax Identification & Hallmarking Disclosures',
    text: `AVIRENA JEWELS — LEGAL NOTICE (IMPRESSUM)

1. Business Information:
Trade Name: Avirena Jewels
Business Type: Sole proprietorship
Based in: Mumbai, Maharashtra, India
Proprietor / Grievance Officer: contactable at avirenajewels@gmail.com

2. Material Disclosures:
• Avirena jewelry is fashion jewelry crafted from high-density brass and durable alloys. It does not contain precious metal and is not sold as, or hallmarked to, any precious-metal fineness standard.
• Gold-tone and silver-tone finishes are achieved with a protective anti-tarnish coating over a brass base. Finish longevity varies with wear, skin chemistry, and care.
• Baroque pearls are ethically sourced cultured freshwater pearls.
• All pieces are nickel-free, lead-free, and cadmium-free. Earring posts are surgical steel.

3. Dispute Resolution:
• For Indian consumers, grievances are handled per Consumer Protection (E-Commerce) Rules, 2020 via avirenajewels@gmail.com.`,
  },
};
