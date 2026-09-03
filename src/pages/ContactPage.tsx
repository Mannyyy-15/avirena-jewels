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
  Calendar,
  Gem
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
      gsap.from('.contact-hero-element', {
        y: 35,
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
    }, 850);
  };

  const faqs = [
    {
      q: 'How do I care for 18k gold vermeil jewelry?',
      a: 'We recommend removing your vermeil pieces before bathing, swimming, or applying perfumes and lotions. Clean gently with our complimentary microfiber polishing cloth. Never use harsh abrasive chemical jewelry dips.',
    },
    {
      q: 'Do you offer bespoke commissions or custom ring sizing?',
      a: 'Yes! Our atelier crafts custom ring sizes, adjusted necklace chain lengths, and bespoke one-of-a-kind commissions. Select "Bespoke Commission" in the contact form or message our WhatsApp concierge for direct guidance.',
    },
    {
      q: 'What is your shipping and return policy?',
      a: 'We provide complimentary express insured delivery across India and worldwide. We also offer a 14-day hassle-free exchange and return policy with insured doorstep courier pickup.',
    },
    {
      q: 'Are your baroque pearls 100% natural?',
      a: 'Yes, every baroque pearl is an authentic natural freshwater pearl. Each pearl is organic and asymmetrical, hand-selected for vibrant rainbow luster and structural uniqueness.',
    },
  ];

  return (
    <div ref={containerRef} className="font-sans-body text-[#413C23] bg-[#E7E4D5] pb-24 overflow-hidden w-full select-none">
      
      {/* 1. TOP HEADER BANNER */}
      <section className="relative w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 pt-4 pb-8 sm:pb-12">
        <div className="relative rounded-xs overflow-hidden border border-[#D8D2C2] bg-[#413C23] text-[#E7E4D5] py-16 sm:py-24 px-6 sm:px-12 text-center space-y-4 shadow-sm">
          {/* Subtle Ambient Background */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#413C23] via-[#413C23]/80 to-[#413C23]/60 pointer-events-none" />
          
          <div className="relative z-10 space-y-3 max-w-3xl mx-auto">
            <span className="contact-hero-element text-[10px] sm:text-xs font-semibold tracking-[0.25em] text-[#8F896D] uppercase block">
              (01) / Maison Concierge & Client Care
            </span>
            <h1 className="contact-hero-element font-serif-display text-4xl sm:text-6xl lg:text-7xl text-[#E7E4D5] tracking-tight font-light leading-tight">
              We’re Here to <span className="italic font-normal text-[#FAF8F5]">Assist You</span>
            </h1>
            <p className="contact-hero-element text-xs sm:text-sm text-[#E7E4D5]/85 max-w-xl mx-auto font-normal leading-relaxed pt-1">
              From virtual styling consultations and custom bridal commissions to ring sizing and order tracking, our jewelry specialists are dedicated to your experience.
            </p>
          </div>
        </div>
      </section>

      {/* 2. 3 CONCIERGE CHANNELS */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 pb-12">
        <div className="contact-card-grid grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto text-left">
          
          {/* Card 1: WhatsApp Concierge */}
          <div className="contact-card bg-[#F4EFE6] p-6 sm:p-8 rounded-xs border border-[#D8D2C2] space-y-3.5 hover:border-[#8F896D] transition-all hover:shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xs bg-[#E7E4D5] border border-[#D8D2C2] flex items-center justify-center text-[#413C23]">
                <MessageSquare className="w-5 h-5 stroke-[1.5]" />
              </div>
              <h3 className="font-serif-display text-xl text-[#413C23] font-medium">WhatsApp Concierge</h3>
              <p className="text-xs text-[#413C23]/75 leading-relaxed font-normal">
                Instant styling guidance, high-resolution video consultations, and real-time ring sizing assistance from our specialists.
              </p>
            </div>
            <a
              href="https://wa.me/919820012345?text=Hello%20Avirena%20Atelier,%20I%20would%20like%20assistance%20with%20a%20jewelry%20piece."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#413C23] hover:text-[#8F896D] font-semibold uppercase tracking-wider pt-2 transition-colors"
            >
              <span>Chat on WhatsApp (+91 98200 12345)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 2: Email & Support */}
          <div className="contact-card bg-[#F4EFE6] p-6 sm:p-8 rounded-xs border border-[#D8D2C2] space-y-3.5 hover:border-[#8F896D] transition-all hover:shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xs bg-[#E7E4D5] border border-[#D8D2C2] flex items-center justify-center text-[#413C23]">
                <Mail className="w-5 h-5 stroke-[1.5]" />
              </div>
              <h3 className="font-serif-display text-xl text-[#413C23] font-medium">Email Client Relations</h3>
              <p className="text-xs text-[#413C23]/75 leading-relaxed font-normal">
                For bespoke bridal inquiries, press requests, and order assistance. We reply within 4 business hours.
              </p>
            </div>
            <a
              href="mailto:concierge@avirena.com"
              className="inline-flex items-center gap-1.5 text-xs text-[#413C23] hover:text-[#8F896D] font-semibold uppercase tracking-wider pt-2 transition-colors"
            >
              <span>concierge@avirena.com</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 3: Flagship Atelier */}
          <div className="contact-card bg-[#F4EFE6] p-6 sm:p-8 rounded-xs border border-[#D8D2C2] space-y-3.5 hover:border-[#8F896D] transition-all hover:shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xs bg-[#E7E4D5] border border-[#D8D2C2] flex items-center justify-center text-[#413C23]">
                <MapPin className="w-5 h-5 stroke-[1.5]" />
              </div>
              <h3 className="font-serif-display text-xl text-[#413C23] font-medium">Atelier Appointments</h3>
              <p className="text-xs text-[#413C23]/75 leading-relaxed font-normal">
                Private 1-on-1 consultations at our Bandra West, Mumbai salon and Vicenza casting studio.
              </p>
            </div>
            <span className="inline-block text-xs text-[#8F896D] font-medium pt-2">
              Tue – Sun: 11:00 AM – 7:30 PM (By Appointment)
            </span>
          </div>
        </div>
      </section>

      {/* 3. MAIN FORM & ATELIER LOCATIONS */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          
          {/* Left: Interactive Form */}
          <div className="lg:col-span-7 bg-[#F4EFE6] p-6 sm:p-10 rounded-xs border border-[#D8D2C2] text-left space-y-6 shadow-xs">
            <div>
              <span className="text-[10px] sm:text-xs font-semibold text-[#8F896D] uppercase tracking-[0.25em] block mb-1">
                (02) / Direct Message
              </span>
              <h2 className="font-serif-display text-2xl sm:text-4xl text-[#413C23] font-light">
                Send an Atelier Inquiry
              </h2>
            </div>

            {submitted ? (
              <div className="py-12 text-center space-y-4 bg-[#FAF8F5] rounded-xs border border-[#D8D2C2] p-8">
                <CheckCircle2 className="w-12 h-12 text-[#8F896D] mx-auto animate-bounce" />
                <h3 className="font-serif-display text-2xl sm:text-3xl text-[#413C23] font-light">
                  Thank you, {formData.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#413C23]/75 max-w-md mx-auto leading-relaxed font-normal">
                  Your inquiry has been received by our head concierge. A jewelry specialist will contact you via {formData.email} shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', inquiryType: 'bespoke', message: '' });
                  }}
                  className="px-6 py-2.5 bg-[#413C23] text-[#E7E4D5] text-xs uppercase tracking-widest font-semibold rounded-xs hover:bg-[#8F896D] transition-colors cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-[#413C23] font-medium block">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Elena Rostova"
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs text-xs text-[#413C23] placeholder-[#8F896D]/60 focus:outline-none focus:border-[#8F896D] transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-[#413C23] font-medium block">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="elena@example.com"
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs text-xs text-[#413C23] placeholder-[#8F896D]/60 focus:outline-none focus:border-[#8F896D] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-[#413C23] font-medium block">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs text-xs text-[#413C23] placeholder-[#8F896D]/60 focus:outline-none focus:border-[#8F896D] transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-[#413C23] font-medium block">
                      Inquiry Category
                    </label>
                    <select
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs text-xs text-[#413C23] focus:outline-none focus:border-[#8F896D] transition-colors cursor-pointer"
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
                  <label className="text-xs text-[#413C23] font-medium block">
                    Message Details *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about the piece or appointment you have in mind..."
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs text-xs text-[#413C23] placeholder-[#8F896D]/60 focus:outline-none focus:border-[#8F896D] transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-[#413C23] hover:bg-[#8F896D] text-[#E7E4D5] text-xs uppercase tracking-[0.2em] font-semibold rounded-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-98"
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
            <div className="bg-[#F4EFE6] p-6 sm:p-8 rounded-xs border border-[#D8D2C2] space-y-6 shadow-xs">
              <div>
                <span className="text-[10px] sm:text-xs font-semibold text-[#8F896D] uppercase tracking-[0.25em] block mb-1">
                  (03) / Physical Ateliers
                </span>
                <h3 className="font-serif-display text-2xl sm:text-3xl text-[#413C23] font-light">
                  Studio Locations
                </h3>
              </div>

              {/* Location 1: Mumbai */}
              <div className="space-y-2 border-b border-[#D8D2C2] pb-4">
                <div className="flex items-center gap-2 text-sm font-serif-display text-[#413C23] font-medium">
                  <MapPin className="w-4 h-4 text-[#8F896D]" />
                  <span>Avirena Mumbai Salon & Atelier</span>
                </div>
                <p className="text-xs text-[#413C23]/75 leading-relaxed pl-6 font-normal">
                  Waterfield Road, Bandra West, Mumbai 400050, India
                </p>
                <p className="text-[11px] text-[#8F896D] font-medium pl-6">
                  Hours: Tue – Sun | 11:00 AM – 7:30 PM IST (By Appointment)
                </p>
              </div>

              {/* Location 2: Vicenza */}
              <div className="space-y-2 pb-2">
                <div className="flex items-center gap-2 text-sm font-serif-display text-[#413C23] font-medium">
                  <MapPin className="w-4 h-4 text-[#8F896D]" />
                  <span>Vicenza Casting House & Studio</span>
                </div>
                <p className="text-xs text-[#413C23]/75 leading-relaxed pl-6 font-normal">
                  Corso Andrea Palladio, 36100 Vicenza VI, Italy
                </p>
                <p className="text-[11px] text-[#8F896D] font-medium pl-6">
                  Hours: Mon – Fri | 9:00 AM – 6:00 PM CET
                </p>
              </div>
            </div>

            {/* Virtual Consultation Box */}
            <div className="bg-[#413C23] text-[#E7E4D5] p-6 sm:p-8 rounded-xs space-y-3 shadow-md border border-[#413C23]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#8F896D]" />
                <h4 className="font-serif-display text-lg sm:text-xl font-light">Complimentary Virtual Sizing</h4>
              </div>
              <p className="text-xs text-[#E7E4D5]/80 font-normal leading-relaxed">
                Not sure of your ring or collar size? Book a 15-minute 1-on-1 video call with our jewelry consultant.
              </p>
              <button
                onClick={() => {
                  setFormData({
                    ...formData,
                    inquiryType: 'sizing',
                    message: 'I would like to schedule a virtual sizing consultation.',
                  });
                  window.scrollTo({ top: 350, behavior: 'smooth' });
                }}
                className="text-xs text-[#FAF8F5] underline underline-offset-4 hover:text-[#8F896D] transition-colors font-semibold uppercase tracking-wider cursor-pointer inline-block pt-1"
              >
                Schedule Virtual Call →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FAQ ACCORDION SECTION */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-12 max-w-4xl mx-auto text-left">
        <div className="text-center space-y-2 mb-8">
          <span className="text-[10px] sm:text-xs font-semibold text-[#8F896D] uppercase tracking-[0.25em] block">
            (04) / Common Inquiries
          </span>
          <h2 className="font-serif-display text-3xl sm:text-4xl text-[#413C23] font-light">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="border border-[#D8D2C2] rounded-xs bg-[#F4EFE6] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left text-xs sm:text-sm font-medium text-[#413C23] hover:text-[#8F896D] transition-colors cursor-pointer"
                >
                  <span className="font-serif-display text-base sm:text-lg">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#8F896D] transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-xs text-[#413C23]/80 leading-relaxed border-t border-[#D8D2C2]/60 pt-3 font-normal">
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
