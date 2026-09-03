import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ContactPageProps {
  onNavigateToShop: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigateToShop }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'bespoke',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero Reveal
      gsap.from('.contact-hero-text', {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
      });

      // 2. Info Cards
      gsap.from('.contact-card', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.contact-card-grid',
          start: 'top 85%',
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 900);
  };

  const faqs = [
    {
      q: 'How do I care for 18k gold vermeil jewelry?',
      a: 'We recommend removing your vermeil pieces before bathing, swimming, or applying perfumes and lotions. Clean gently with our complimentary microfiber polishing cloth. Never use abrasive jewelry dips.',
    },
    {
      q: 'Do you offer bespoke or custom sizing?',
      a: 'Yes! Our atelier crafts custom ring sizes, adjusted necklace chain lengths, and bespoke one-of-a-kind commissions. Select "Bespoke Commission" in the contact form or message our WhatsApp concierge.',
    },
    {
      q: 'What is your shipping and return policy?',
      a: 'We offer complimentary express insured shipping on all orders. We also offer a 14-day hassle-free exchange and return window with doorstep pickup.',
    },
    {
      q: 'Are your baroque pearls natural?',
      a: '100% natural freshwater baroque pearls. Each pearl is organic and irregular, handpicked for exceptional rainbow luster and structural uniqueness.',
    },
  ];

  return (
    <div ref={containerRef} className="font-sans-body text-[#2C2C2A] bg-[#FAF8F5] pb-24 overflow-hidden w-full">
      {/* 1. TOP HEADER BANNER */}
      <section className="relative w-full px-4 sm:px-8 lg:px-12 xl:px-16 pt-4 pb-8 sm:pb-12">
        <div className="relative rounded-xs overflow-hidden border border-[#E6DFD3] bg-[#EAE6DB] py-14 sm:py-20 px-6 sm:px-12 text-center space-y-4">
          <div className="contact-hero-text">
            <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-[#C5A059] uppercase block mb-2">
              Atelier Concierge & Care
            </span>
            <h1 className="font-serif-display text-4xl sm:text-6xl lg:text-7xl text-[#2C2C2A] tracking-tight">
              We’re Here to Assist You
            </h1>
          </div>
          <p className="contact-hero-text text-xs sm:text-sm text-[#7D7973] max-w-xl mx-auto font-light leading-relaxed">
            From styling consultations and bespoke bridal commissions to order tracking and ring sizing, our jewelry specialists are dedicated to your experience.
          </p>
        </div>
      </section>

      {/* 2. 3 CONCIERGE CHANNELS */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 pb-12">
        <div className="contact-card-grid grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto text-left">
          {/* Card 1: WhatsApp Concierge */}
          <div className="contact-card bg-white p-6 sm:p-8 rounded-xs border border-[#E6DFD3] space-y-3 hover:border-[#C5A059] transition-all hover:shadow-xs">
            <div className="w-10 h-10 rounded-xs bg-[#FAF8F5] border border-[#E6DFD3] flex items-center justify-center text-[#2C2C2A]">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-serif-display text-lg text-[#2C2C2A]">WhatsApp Concierge</h3>
            <p className="text-xs text-[#7D7973] leading-relaxed">
              Instant styling guidance, high-resolution video consultations, and real-time ring sizing assistance.
            </p>
            <a
              href="https://wa.me/919820012345?text=Hello%20Avirena%20Atelier,%20I%20would%20like%20assistance%20with%20a%20jewelry%20piece."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#C5A059] hover:text-[#2C2C2A] font-medium pt-2 transition-colors"
            >
              <span>Chat on WhatsApp (+91 98200 12345)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 2: Email & Support */}
          <div className="contact-card bg-white p-6 sm:p-8 rounded-xs border border-[#E6DFD3] space-y-3 hover:border-[#C5A059] transition-all hover:shadow-xs">
            <div className="w-10 h-10 rounded-xs bg-[#FAF8F5] border border-[#E6DFD3] flex items-center justify-center text-[#2C2C2A]">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-serif-display text-lg text-[#2C2C2A]">Email Client Relations</h3>
            <p className="text-xs text-[#7D7973] leading-relaxed">
              For bespoke inquiries, press, and order updates. We reply within 4 business hours.
            </p>
            <a
              href="mailto:concierge@avirena.com"
              className="inline-flex items-center gap-1.5 text-xs text-[#C5A059] hover:text-[#2C2C2A] font-medium pt-2 transition-colors"
            >
              <span>concierge@avirena.com</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 3: Flagship Atelier */}
          <div className="contact-card bg-white p-6 sm:p-8 rounded-xs border border-[#E6DFD3] space-y-3 hover:border-[#C5A059] transition-all hover:shadow-xs">
            <div className="w-10 h-10 rounded-xs bg-[#FAF8F5] border border-[#E6DFD3] flex items-center justify-center text-[#2C2C2A]">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-serif-display text-lg text-[#2C2C2A]">Atelier Appointments</h3>
            <p className="text-xs text-[#7D7973] leading-relaxed">
              Private 1-on-1 private appointments at our Bandra West, Mumbai studio and Vicenza casting house.
            </p>
            <span className="inline-block text-xs text-[#2C2C2A] font-medium pt-2">
              Mon – Sat: 11:00 AM – 7:30 PM IST
            </span>
          </div>
        </div>
      </section>

      {/* 3. MAIN FORM & ATELIER LOCATIONS */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left: Interactive Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-xs border border-[#E6DFD3] text-left space-y-6">
            <div>
              <span className="text-xs font-semibold text-[#C5A059] uppercase tracking-[0.25em] block mb-1">
                Direct Message
              </span>
              <h2 className="font-serif-display text-2xl sm:text-4xl text-[#2C2C2A]">
                Send an Atelier Inquiry
              </h2>
            </div>

            {submitted ? (
              <div className="py-12 text-center space-y-4 bg-[#FAF8F5] rounded-xs border border-[#E6DFD3] p-6">
                <CheckCircle2 className="w-12 h-12 text-[#C5A059] mx-auto animate-bounce" />
                <h3 className="font-serif-display text-2xl text-[#2C2C2A]">
                  Thank you, {formData.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#7D7973] max-w-md mx-auto">
                  Your inquiry has been received by our head concierge. A specialist will contact you via {formData.email} shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', inquiryType: 'bespoke', message: '' });
                  }}
                  className="px-6 py-2.5 bg-[#2C2C2A] text-white text-xs uppercase tracking-widest font-medium rounded-xs hover:bg-[#444238] transition-colors cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-[#2C2C2A] font-medium block">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Elena Rostova"
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E6DFD3] rounded-xs text-xs text-[#2C2C2A] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-[#2C2C2A] font-medium block">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="elena@example.com"
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E6DFD3] rounded-xs text-xs text-[#2C2C2A] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-[#2C2C2A] font-medium block">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E6DFD3] rounded-xs text-xs text-[#2C2C2A] focus:outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-[#2C2C2A] font-medium block">
                      Inquiry Category
                    </label>
                    <select
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E6DFD3] rounded-xs text-xs text-[#2C2C2A] focus:outline-none focus:border-[#C5A059]"
                    >
                      <option value="bespoke">Bespoke / Custom Piece</option>
                      <option value="appointment">Private Atelier Appointment</option>
                      <option value="styling">Virtual Styling Advice</option>
                      <option value="sizing">Ring Sizing & Fit Help</option>
                      <option value="order">Existing Order Tracking</option>
                      <option value="press">Press & Editorial Loan</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-[#2C2C2A] font-medium block">
                    Message Details *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about the piece or appointment you have in mind..."
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E6DFD3] rounded-xs text-xs text-[#2C2C2A] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-[#2C2C2A] hover:bg-[#C5A059] text-white text-xs uppercase tracking-widest font-semibold rounded-xs transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <span>Sending to Concierge...</span>
                  ) : (
                    <>
                      <span>Submit Inquiry</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right: Atelier Locations & Working Hours */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="bg-[#FAF8F5] p-6 sm:p-8 rounded-xs border border-[#E6DFD3] space-y-6">
              <div>
                <span className="text-xs font-semibold text-[#C5A059] uppercase tracking-[0.25em] block mb-1">
                  Physical Ateliers
                </span>
                <h3 className="font-serif-display text-2xl text-[#2C2C2A]">
                  Our Studio Locations
                </h3>
              </div>

              {/* Location 1 */}
              <div className="space-y-2 border-b border-[#E6DFD3] pb-4">
                <div className="flex items-center gap-2 text-sm font-serif-display text-[#2C2C2A]">
                  <MapPin className="w-4 h-4 text-[#C5A059]" />
                  <span>Avirena Mumbai Atelier & Salon</span>
                </div>
                <p className="text-xs text-[#7D7973] leading-relaxed pl-6">
                  Waterfield Road, Bandra West, Mumbai 400050, India
                </p>
                <p className="text-[11px] text-[#2C2C2A] font-medium pl-6">
                  Hours: Tuesday – Sunday | 11:00 AM – 7:30 PM (By Appointment)
                </p>
              </div>

              {/* Location 2 */}
              <div className="space-y-2 pb-2">
                <div className="flex items-center gap-2 text-sm font-serif-display text-[#2C2C2A]">
                  <MapPin className="w-4 h-4 text-[#C5A059]" />
                  <span>Vicenza Casting House & Studio</span>
                </div>
                <p className="text-xs text-[#7D7973] leading-relaxed pl-6">
                  Corso Andrea Palladio, 36100 Vicenza VI, Italy
                </p>
                <p className="text-[11px] text-[#2C2C2A] font-medium pl-6">
                  Hours: Monday – Friday | 9:00 AM – 6:00 PM CET
                </p>
              </div>
            </div>

            {/* Virtual Consultation Box */}
            <div className="bg-[#9A9886] text-white p-6 sm:p-8 rounded-xs space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FAF8F5]" />
                <h4 className="font-serif-display text-lg">Complimentary Virtual Sizing</h4>
              </div>
              <p className="text-xs text-[#FAF8F5]/90 font-light leading-relaxed">
                Not sure of your ring or collar size? Book a 15-minute 1-on-1 video call with our jewelry consultant.
              </p>
              <button
                onClick={() => {
                  setFormData({
                    ...formData,
                    inquiryType: 'sizing',
                    message: 'I would like to schedule a virtual sizing consultation.',
                  });
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
                className="text-xs text-white underline underline-offset-4 hover:text-[#2C2C2A] transition-colors font-medium"
              >
                Schedule Virtual Call →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FAQ ACCORDION SECTION */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-12 max-w-4xl mx-auto text-left">
        <div className="text-center space-y-2 mb-8">
          <span className="text-xs font-semibold text-[#C5A059] uppercase tracking-[0.25em] block">
            Common Inquiries
          </span>
          <h2 className="font-serif-display text-3xl sm:text-4xl text-[#2C2C2A]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="border border-[#E6DFD3] rounded-xs bg-white overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left text-xs sm:text-sm font-medium text-[#2C2C2A] hover:text-[#C5A059] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#7D7973] transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-[#C5A059]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-xs text-[#7D7973] leading-relaxed border-t border-[#E6DFD3]/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
