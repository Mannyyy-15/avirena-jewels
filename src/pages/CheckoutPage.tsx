import React, { useState } from 'react';
import {
  ShieldCheck,
  CreditCard,
  Lock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  Truck,
  ArrowLeft
} from 'lucide-react';
import { CartItem, Currency } from '../types';
import { formatPrice } from '../data/products';

interface CheckoutPageProps {
  items: CartItem[];
  currency: Currency;
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onNavigateHome: () => void;
  onClearCart: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  items,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  onNavigateHome,
  onClearCart,
}) => {
  // Form State
  const [formData, setFormData] = useState({
    firstName: 'Amara',
    lastName: 'Sharma',
    email: 'amara.sharma@example.com',
    phone: '+91 98200 45678',
    country: 'India',
    city: 'Mumbai',
    streetAddress: '14, Altamount Luxury Enclave, Cumballa Hill',
    zipCode: '400026',
    deliveryMethod: 'standard', // 'standard' | 'express'
    paymentMethod: 'card', // 'card' | 'paypal' | 'applepay' | 'upi'
    cardNumber: '•••• •••• •••• 4289',
    cardName: 'Amara Sharma',
    cardExpiry: '08/29',
    cardCvc: '•••',
    upiId: 'amara@okhdfcbank',
    agreeTerms: true,
  });

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [promoError, setPromoError] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingCost = formData.deliveryMethod === 'express' ? 15 : (subtotal >= 150 ? 0 : 12);
  const discountAmount = (subtotal * discountPercent) / 100;
  const total = Math.max(0, subtotal - discountAmount + shippingCost);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'AVIRENA10' || promoCode.trim().toUpperCase() === 'GLOW10') {
      setDiscountPercent(10);
      setPromoError('');
    } else {
      setPromoError('Invalid code. Try AVIRENA10 for 10% off.');
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedOrder = `AVR-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderNumber(generatedOrder);
    setOrderPlaced(true);
    onClearCart();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. ORDER CONFIRMATION VIEW (If order successfully placed)
  if (orderPlaced) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-8 animate-in fade-in zoom-in-95 duration-300 font-sans-body">
        <div className="w-20 h-20 bg-[#E6DFD3] border border-[#C5A059] rounded-full mx-auto flex items-center justify-center text-[#C5A059]">
          <CheckCircle2 className="w-10 h-10 stroke-[1.5]" />
        </div>

        <div className="space-y-3">
          <span className="text-xs uppercase tracking-[0.3em] text-[#9A9886] font-semibold">
            Order Confirmed
          </span>
          <h1 className="font-serif-display text-4xl sm:text-5xl text-[#2C2C2A]">
            Thank you, {formData.firstName}
          </h1>
          <p className="text-sm text-[#7D7973]">
            Order confirmation & tracking sent to <strong className="text-[#2C2C2A]">{formData.email}</strong>
          </p>
        </div>

        {/* Order Receipt Box */}
        <div className="bg-[#FAF8F5] border border-[#E6DFD3] rounded-xs p-6 sm:p-8 text-left space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E6DFD3] gap-2">
            <div>
              <span className="text-xs text-[#7D7973] block">Order Reference:</span>
              <span className="font-serif-display text-xl text-[#2C2C2A] font-semibold">
                {orderNumber}
              </span>
            </div>
            <div className="text-right sm:text-right">
              <span className="text-xs text-[#7D7973] block">Estimated Delivery:</span>
              <span className="text-xs font-medium text-[#2C2C2A]">
                {formData.deliveryMethod === 'express' ? '1–2 Business Days' : '3–5 Business Days'}
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs text-[#7D7973]">
            <p><strong className="text-[#2C2C2A]">Shipping to:</strong> {formData.streetAddress}, {formData.city}, {formData.zipCode}, {formData.country}</p>
            <p><strong className="text-[#2C2C2A]">Payment Method:</strong> {formData.paymentMethod.toUpperCase()} (Total paid: {formatPrice(total, currency)})</p>
            <p className="text-[#9A9886] pt-2">
              ✓ Each piece is individually inspected, placed inside an anti-tarnish velvet travel pouch, and packaged in our luxury keepsake box.
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateHome}
          className="px-8 py-3.5 bg-[#9A9886] hover:bg-[#858372] text-white text-xs uppercase tracking-[0.2em] font-medium rounded-xs shadow-md transition-all"
        >
          Return to Atelier
        </button>
      </div>
    );
  }

  // 2. EMPTY STATE
  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6 font-sans-body">
        <ShoppingBag className="w-12 h-12 text-[#9A9886] mx-auto stroke-[1.2]" />
        <h2 className="font-serif-display text-3xl text-[#2C2C2A]">Your Bag is Empty</h2>
        <p className="text-xs text-[#7D7973] leading-relaxed">
          Please add your favorite pieces to your bag before proceeding to checkout.
        </p>
        <button
          onClick={onNavigateHome}
          className="px-6 py-3 bg-[#9A9886] hover:bg-[#858372] text-white text-xs uppercase tracking-widest rounded-xs transition-colors"
        >
          Discover Jewelry
        </button>
      </div>
    );
  }

  // 3. MAIN CHECKOUT PAGE
  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8 sm:py-12 text-left font-sans-body">
      {/* Top Back Navigation */}
      <button
        onClick={onNavigateHome}
        className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#7D7973] hover:text-[#2C2C2A] transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Storefront</span>
      </button>

      {/* Very Large Serif Headline */}
      <div className="mb-10">
        <h1 className="font-serif-display text-5xl sm:text-6xl lg:text-7xl text-[#2C2C2A] tracking-tight">
          Checkout
        </h1>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        {/* LEFT COLUMN: Clean Underlined / Bordered Form Sections */}
        <div className="lg:col-span-7 space-y-10">
          {/* Section 1: Personal Information */}
          <div className="space-y-4">
            <div className="flex items-baseline justify-between border-b border-[#E6DFD3] pb-2">
              <h3 className="font-serif-display text-2xl text-[#2C2C2A]">Personal Information</h3>
              <span className="text-xs text-[#7D7973]">
                Already have an account? <a href="#signin" className="underline font-medium text-[#2C2C2A] hover:text-[#C5A059]">Sign in</a>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#7D7973] mb-1 font-medium">
                  First Name
                </label>
                <input
                  id="checkout-first-name"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="First name"
                  className="w-full bg-[#FAF8F5] border border-[#E6DFD3] focus:border-[#9A9886] rounded-xs px-3.5 py-2.5 text-xs text-[#2C2C2A] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#7D7973] mb-1 font-medium">
                  Last Name
                </label>
                <input
                  id="checkout-last-name"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Last name"
                  className="w-full bg-[#FAF8F5] border border-[#E6DFD3] focus:border-[#9A9886] rounded-xs px-3.5 py-2.5 text-xs text-[#2C2C2A] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#7D7973] mb-1 font-medium">
                  Email Address
                </label>
                <input
                  id="checkout-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Email for dispatch updates"
                  className="w-full bg-[#FAF8F5] border border-[#E6DFD3] focus:border-[#9A9886] rounded-xs px-3.5 py-2.5 text-xs text-[#2C2C2A] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#7D7973] mb-1 font-medium">
                  Phone Number
                </label>
                <input
                  id="checkout-phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Phone number for courier"
                  className="w-full bg-[#FAF8F5] border border-[#E6DFD3] focus:border-[#9A9886] rounded-xs px-3.5 py-2.5 text-xs text-[#2C2C2A] focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Shipping Address */}
          <div className="space-y-4">
            <div className="border-b border-[#E6DFD3] pb-2">
              <h3 className="font-serif-display text-2xl text-[#2C2C2A]">Shipping Address</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#7D7973] mb-1 font-medium">
                  Country / Region
                </label>
                <select
                  id="checkout-country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#E6DFD3] focus:border-[#9A9886] rounded-xs px-3.5 py-2.5 text-xs text-[#2C2C2A] focus:outline-none transition-colors"
                >
                  <option value="India">India (Mumbai, Delhi, Bangalore, etc.)</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United Arab Emirates">United Arab Emirates (Dubai)</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Germany">Germany / EU</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#7D7973] mb-1 font-medium">
                  City
                </label>
                <input
                  id="checkout-city"
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="City"
                  className="w-full bg-[#FAF8F5] border border-[#E6DFD3] focus:border-[#9A9886] rounded-xs px-3.5 py-2.5 text-xs text-[#2C2C2A] focus:outline-none transition-colors"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-[#7D7973] mb-1 font-medium">
                  Street Address & Apartment
                </label>
                <input
                  id="checkout-address"
                  type="text"
                  required
                  value={formData.streetAddress}
                  onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                  placeholder="Apartment, suite, unit, building, street"
                  className="w-full bg-[#FAF8F5] border border-[#E6DFD3] focus:border-[#9A9886] rounded-xs px-3.5 py-2.5 text-xs text-[#2C2C2A] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#7D7973] mb-1 font-medium">
                  Postal / Zip Code
                </label>
                <input
                  id="checkout-zip"
                  type="text"
                  required
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  placeholder="Postal Code"
                  className="w-full bg-[#FAF8F5] border border-[#E6DFD3] focus:border-[#9A9886] rounded-xs px-3.5 py-2.5 text-xs text-[#2C2C2A] focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Delivery Method */}
          <div className="space-y-4">
            <div className="border-b border-[#E6DFD3] pb-2">
              <h3 className="font-serif-display text-2xl text-[#2C2C2A]">Delivery Method</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                className={`flex items-start p-4 rounded-xs border cursor-pointer transition-all ${
                  formData.deliveryMethod === 'standard'
                    ? 'border-[#9A9886] bg-[#E6DFD3]/40'
                    : 'border-[#E6DFD3] bg-[#FAF8F5]'
                }`}
              >
                <input
                  type="radio"
                  name="delivery"
                  value="standard"
                  checked={formData.deliveryMethod === 'standard'}
                  onChange={() => setFormData({ ...formData, deliveryMethod: 'standard' })}
                  className="mt-0.5 text-[#9A9886] focus:ring-[#9A9886]"
                />
                <div className="ml-3">
                  <span className="block text-xs font-semibold text-[#2C2C2A]">Standard Delivery</span>
                  <span className="block text-[11px] text-[#7D7973] mt-0.5">
                    2–4 Business days (Free on orders over €150 / ₹12,000)
                  </span>
                </div>
              </label>

              <label
                className={`flex items-start p-4 rounded-xs border cursor-pointer transition-all ${
                  formData.deliveryMethod === 'express'
                    ? 'border-[#9A9886] bg-[#E6DFD3]/40'
                    : 'border-[#E6DFD3] bg-[#FAF8F5]'
                }`}
              >
                <input
                  type="radio"
                  name="delivery"
                  value="express"
                  checked={formData.deliveryMethod === 'express'}
                  onChange={() => setFormData({ ...formData, deliveryMethod: 'express' })}
                  className="mt-0.5 text-[#9A9886] focus:ring-[#9A9886]"
                />
                <div className="ml-3">
                  <span className="block text-xs font-semibold text-[#2C2C2A]">Priority Air Express</span>
                  <span className="block text-[11px] text-[#7D7973] mt-0.5">
                    1–2 Business days ({formatPrice(15, currency)})
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Section 4: Payment Method */}
          <div className="space-y-4">
            <div className="border-b border-[#E6DFD3] pb-2">
              <h3 className="font-serif-display text-2xl text-[#2C2C2A]">Payment Method</h3>
            </div>

            {/* Payment Type Selection */}
            <div className="flex items-center gap-6 text-xs text-[#2C2C2A] flex-wrap">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={formData.paymentMethod === 'card'}
                  onChange={() => setFormData({ ...formData, paymentMethod: 'card' })}
                  className="text-[#9A9886] focus:ring-[#9A9886]"
                />
                <span className="font-medium">Credit / Debit Card</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="upi"
                  checked={formData.paymentMethod === 'upi'}
                  onChange={() => setFormData({ ...formData, paymentMethod: 'upi' })}
                  className="text-[#9A9886] focus:ring-[#9A9886]"
                />
                <span className="font-medium">UPI / NetBanking (India)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value="paypal"
                  checked={formData.paymentMethod === 'paypal'}
                  onChange={() => setFormData({ ...formData, paymentMethod: 'paypal' })}
                  className="text-[#9A9886] focus:ring-[#9A9886]"
                />
                <span className="font-medium">PayPal</span>
              </label>
            </div>

            {/* Card Inputs */}
            {formData.paymentMethod === 'card' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FAF8F5] p-5 rounded-xs border border-[#E6DFD3]">
                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase tracking-wider text-[#7D7973] mb-1 font-medium">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      id="checkout-card-num"
                      type="text"
                      required
                      value={formData.cardNumber}
                      onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                      placeholder="4000 1234 5678 9010"
                      className="w-full bg-[#FAF8F5] border border-[#E6DFD3] rounded-xs px-3.5 py-2.5 text-xs text-[#2C2C2A] focus:outline-none focus:border-[#9A9886]"
                    />
                    <CreditCard className="w-4 h-4 text-[#7D7973] absolute right-3.5 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#7D7973] mb-1 font-medium">
                    Name on Card
                  </label>
                  <input
                    id="checkout-card-name"
                    type="text"
                    required
                    value={formData.cardName}
                    onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                    placeholder="Amara Sharma"
                    className="w-full bg-[#FAF8F5] border border-[#E6DFD3] rounded-xs px-3.5 py-2.5 text-xs text-[#2C2C2A] focus:outline-none focus:border-[#9A9886]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#7D7973] mb-1 font-medium">
                      Expiry
                    </label>
                    <input
                      id="checkout-card-exp"
                      type="text"
                      required
                      value={formData.cardExpiry}
                      onChange={(e) => setFormData({ ...formData, cardExpiry: e.target.value })}
                      placeholder="MM/YY"
                      className="w-full bg-[#FAF8F5] border border-[#E6DFD3] rounded-xs px-3.5 py-2.5 text-xs text-[#2C2C2A] focus:outline-none focus:border-[#9A9886]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#7D7973] mb-1 font-medium">
                      CVC / CVV
                    </label>
                    <input
                      id="checkout-card-cvc"
                      type="password"
                      maxLength={4}
                      required
                      value={formData.cardCvc}
                      onChange={(e) => setFormData({ ...formData, cardCvc: e.target.value })}
                      placeholder="123"
                      className="w-full bg-[#FAF8F5] border border-[#E6DFD3] rounded-xs px-3.5 py-2.5 text-xs text-[#2C2C2A] focus:outline-none focus:border-[#9A9886]"
                    />
                  </div>
                </div>
              </div>
            )}

            {formData.paymentMethod === 'upi' && (
              <div className="bg-[#FAF8F5] p-5 rounded-xs border border-[#E6DFD3] space-y-2">
                <label className="block text-xs uppercase tracking-wider text-[#7D7973] mb-1 font-medium">
                  Virtual Payment Address (VPA / UPI ID)
                </label>
                <input
                  type="text"
                  value={formData.upiId}
                  onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                  placeholder="yourname@okhdfcbank"
                  className="w-full bg-[#FAF8F5] border border-[#E6DFD3] rounded-xs px-3.5 py-2.5 text-xs text-[#2C2C2A] focus:outline-none focus:border-[#9A9886]"
                />
                <span className="text-[11px] text-[#9A9886] block">
                  You will receive a collect request on Google Pay / PhonePe / Paytm.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Order Summary Card */}
        <div className="lg:col-span-5">
          <div className="bg-[#FAF8F5] border border-[#E6DFD3] rounded-xs p-6 sm:p-8 space-y-6 shadow-xs sticky top-28">
            <div className="flex items-baseline justify-between border-b border-[#E6DFD3] pb-4">
              <h2 className="font-serif-display text-2xl text-[#2C2C2A]">
                Cart ({items.reduce((sum, i) => sum + i.quantity, 0)})
              </h2>
              <span className="text-xs uppercase tracking-widest text-[#9A9886] font-medium">
                Review Order
              </span>
            </div>

            {/* Line Items List */}
            <div className="space-y-4 max-h-80 overflow-y-auto pr-1 divide-y divide-[#E6DFD3]">
              {items.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex gap-3.5">
                  <div className="w-16 h-16 bg-[#FAF8F5] border border-[#E6DFD3] rounded-xs p-1 shrink-0 overflow-hidden flex items-center justify-center">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between text-xs">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif-display text-base text-[#2C2C2A]">
                          {item.product.name}
                        </h4>
                        <span className="font-medium text-[#2C2C2A]">
                          {formatPrice(item.product.price * item.quantity, currency)}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#7D7973]">
                        {item.metal} {item.size ? `• ${item.size}` : ''}
                      </p>
                    </div>

                    <div className="text-[11px] text-[#9A9886]">
                      Quantity: {item.quantity}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code Input */}
            <div className="pt-2 border-t border-[#E6DFD3]">
              <div className="flex gap-2">
                <input
                  id="checkout-promo-input"
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Gift card or discount code"
                  className="flex-1 bg-[#FAF8F5] border border-[#E6DFD3] rounded-xs px-3 py-2 text-xs text-[#2C2C2A] placeholder-[#7D7973]/60 focus:outline-none focus:border-[#9A9886]"
                />
                <button
                  type="button"
                  id="checkout-apply-promo-btn"
                  onClick={handleApplyPromo}
                  className="px-4 py-2 bg-[#E6DFD3] hover:bg-[#DCD5C6] text-[#2C2C2A] text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors"
                >
                  Apply
                </button>
              </div>

              {discountPercent > 0 && (
                <span className="text-[11px] text-[#9A9886] block mt-1.5 font-medium">
                  ✓ {discountPercent}% discount applied (AVIRENA10)
                </span>
              )}
              {promoError && (
                <span className="text-[11px] text-[#C5A059] block mt-1.5 font-medium">
                  {promoError}
                </span>
              )}
            </div>

            {/* Cost Breakdown */}
            <div className="space-y-2 text-xs text-[#7D7973] border-t border-[#E6DFD3] pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#2C2C2A]">{formatPrice(subtotal, currency)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-[#C5A059]">
                  <span>Atelier Discount</span>
                  <span>-{formatPrice(discountAmount, currency)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Insured Shipping</span>
                <span className="font-medium text-[#2C2C2A]">{shippingCost === 0 ? 'Complimentary' : formatPrice(shippingCost, currency)}</span>
              </div>

              <div className="flex justify-between text-[#9A9886]">
                <span>Taxes</span>
                <span>Included in price</span>
              </div>
            </div>

            {/* Grand Total */}
            <div className="border-t border-[#E6DFD3] pt-4 flex justify-between items-baseline">
              <span className="font-serif-display text-xl text-[#2C2C2A]">Total Due</span>
              <span className="font-serif-display text-2xl text-[#2C2C2A] font-semibold">
                {formatPrice(total, currency)}
              </span>
            </div>

            {/* Legal Agreement */}
            <label className="flex items-start gap-2 cursor-pointer text-[11px] text-[#7D7973]">
              <input
                type="checkbox"
                required
                checked={formData.agreeTerms}
                onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                className="mt-0.5 rounded-xs text-[#9A9886] focus:ring-[#9A9886]"
              />
              <span>
                By placing an order, I agree to the <a href="#terms" className="underline hover:text-[#2C2C2A]">Terms & Conditions</a> and <a href="#privacy" className="underline hover:text-[#2C2C2A]">Privacy Policy</a>.
              </span>
            </label>

            {/* Primary Place Order Button in Muted Olive */}
            <button
              type="submit"
              id="place-order-btn"
              className="w-full py-4 bg-[#9A9886] hover:bg-[#858372] text-white text-xs uppercase tracking-[0.25em] font-medium rounded-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 active:scale-98"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Pay and Place Order</span>
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-[#7D7973] tracking-wider uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>256-Bit Encrypted Secure Checkout</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

