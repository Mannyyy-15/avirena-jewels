import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Mail,
  MessageSquare,
  MapPin,
  ChevronDown,
  ArrowRight,
  Send,
  CheckCircle2,
  Clock
} from 'lucide-react';

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
    inquiryType: 'general',
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
        y: 28,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
      });

      // 2. Info Cards
      gsap.from('.contact-card', {
        y: 24,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
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
    }, 750);
  };

  const faqs = [
    {
      q: 'What metals are your jewelry pieces made from?',
      a: 'We craft our pieces from high-grade brass alloy finished with advanced gold-tone and silver-tone protective coatings. They are 100% lead-free, nickel-free, hypoallergenic, and sealed with a protective anti-tarnish barrier engineered for daily wear.',
    },
    {
      q: 'Can I wear my Avirena jewelry every day in water?',
      a: 'Yes! Our protective anti-tarnish coating makes our pieces sweat-resistant and water-resistant for daily hand washing, showers, and rain. To keep them looking pristine year after year, we recommend wiping them with a soft microfiber cloth and avoiding prolonged exposure to harsh chlorine or chemical detergents.',
    },
    {
      q: 'How did Avirena start?',
      a: 'Avirena was founded in 2020 during the COVID lockdown as a small homegrown creative passion project. What started by crafting pieces for close family and friends in our neighborhood grew through word of mouth into the conscious daily jewelry label you see today.',
    },
    {
      q: 'What is your shipping and delivery timeline?',
      a: 'We dispatch all orders within 24 to 48 hours across India with express tracking. Standard domestic delivery takes 3 to 5 business days. You will receive real-time SMS and email tracking links upon dispatch.',
    },
  ];

  return (
    <div ref={containerRef} className="font-sans-body text-[#413C23] bg-[#E7E4D5] pb-24 overflow-hidden w-full select-none">
      
      {/* 1. TOP HEADER BANNER */}
      <section className="relative w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 pt-4 pb-8 sm:pb-12">
        <div className="relative rounded-xs overflow-hidden border border-[#D8D2C2] bg-[#413C23] text-[#E7E4D5] py-14 sm:py-20 px-6 sm:px-12 text-center space-y-4 shadow-sm">
          <div className="relative z-10 space-y-3 max-w-2xl mx-auto">
            <span className="contact-hero-element text-[10px] sm:text-xs font-semibold tracking-[0.25em] text-[#8F896D] uppercase block">
              Customer Care & Atelier Inquiries
            </span>
            <h1 className="contact-hero-element font-serif-display text-4xl sm:text-6xl lg:text-7xl text-[#E7E4D5] tracking-tight font-light leading-tight">
              We&apos;re Here to Help
            </h1>
            <p className="contact-hero-element text-xs sm:text-sm text-[#E7E4D5]/80 max-w-lg mx-auto font-normal leading-relaxed pt-1">
              Have questions about styling, ring sizing, or caring for your daily pieces? Reach out to our studio team anytime.
            </p>
          </div>
        </div>
      </section>

      {/* 2. 3 CONTACT CARDS */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 pb-12">
        <div className="contact-card-grid grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto text-left">
          
          {/* Card 1: WhatsApp Support */}
          <div className="contact-card bg-[#F2EFDB] p-6 sm:p-8 rounded-xs border border-[#D8D2C2] space-y-3.5 hover:border-[#8F896D] transition-all hover:shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xs bg-[#E7E4D5] border border-[#D8D2C2] flex items-center justify-center text-[#413C23]">
                <MessageSquare className="w-5 h-5 stroke-[1.5]" />
              </div>
              <h3 className="font-serif-display text-xl text-[#413C23] font-normal">WhatsApp Support</h3>
              <p className="text-xs text-[#413C23]/75 leading-relaxed font-normal">
                Direct styling guidance, real-time ring sizing help, and quick answers to all your jewelry questions.
              </p>
            </div>
            <a
              href="https://wa.me/919820012345?text=Hi%20Avirena,%20I%20have%20a%20question%20about%20a%20jewelry%20piece."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#413C23] hover:text-[#8F896D] font-medium uppercase tracking-wider pt-2 transition-colors"
            >
              <span>Message Us on WhatsApp</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 2: Email */}
          <div className="contact-card bg-[#F2EFDB] p-6 sm:p-8 rounded-xs border border-[#D8D2C2] space-y-3.5 hover:border-[#8F896D] transition-all hover:shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xs bg-[#E7E4D5] border border-[#D8D2C2] flex items-center justify-center text-[#413C23]">
                <Mail className="w-5 h-5 stroke-[1.5]" />
              </div>
              <h3 className="font-serif-display text-xl text-[#413C23] font-normal">Email Inquiries</h3>
              <p className="text-xs text-[#413C23]/75 leading-relaxed font-normal">
                For order updates, collaborations, or general feedback. We respond within 1 business day.
              </p>
            </div>
            <a
              href="mailto:support@avirenajewels.com"
              className="inline-flex items-center gap-1.5 text-xs text-[#413C23] hover:text-[#8F896D] font-medium uppercase tracking-wider pt-2 transition-colors"
            >
              <span>support@avirenajewels.com</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 3: Studio & Hours */}
          <div className="contact-card bg-[#F2EFDB] p-6 sm:p-8 rounded-xs border border-[#D8D2C2] space-y-3.5 hover:border-[#8F896D] transition-all hover:shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xs bg-[#E7E4D5] border border-[#D8D2C2] flex items-center justify-center text-[#413C23]">
                <Clock className="w-5 h-5 stroke-[1.5]" />
              </div>
              <h3 className="font-serif-display text-xl text-[#413C23] font-normal">Support Hours</h3>
              <p className="text-xs text-[#413C23]/75 leading-relaxed font-normal">
                Our customer care team is available Monday through Saturday to help with all inquiries.
              </p>
            </div>
            <span className="inline-block text-xs text-[#8F896D] font-medium pt-2">
              Mon – Sat: 10:00 AM – 7:00 PM IST
            </span>
          </div>
        </div>
      </section>

      {/* 3. MAIN FORM */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-8">
        <div className="max-w-4xl mx-auto bg-[#F2EFDB] p-6 sm:p-10 lg:p-12 rounded-xs border border-[#D8D2C2] text-left space-y-6 shadow-xs">
          <div>
            <span className="text-[10px] sm:text-xs font-semibold text-[#8F896D] uppercase tracking-[0.25em] block mb-1">
              Send a Message
            </span>
            <h2 className="font-serif-display text-2xl sm:text-4xl text-[#413C23] font-normal">
              Get in Touch with Our Team
            </h2>
          </div>

          {submitted ? (
            <div className="py-12 text-center space-y-4 bg-[#E7E4D5] rounded-xs border border-[#D8D2C2] p-8">
              <CheckCircle2 className="w-12 h-12 text-[#413C23] mx-auto" />
              <h3 className="font-serif-display text-2xl sm:text-3xl text-[#413C23] font-normal">
                Thank you, {formData.name}
              </h3>
              <p className="text-xs sm:text-sm text-[#413C23]/75 max-w-md mx-auto leading-relaxed font-normal">
                We have received your message and will get back to you at {formData.email} as soon as possible.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', phone: '', inquiryType: 'general', message: '' });
                }}
                className="px-6 py-2.5 bg-[#413C23] text-[#E7E4D5] text-xs uppercase tracking-widest font-semibold rounded-xs hover:bg-[#8F896D] transition-colors cursor-pointer"
              >
                Send Another Message
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
                    placeholder="Your Name"
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs text-xs text-[#413C23] placeholder-[#8F896D]/60 focus:outline-none focus:border-[#413C23] transition-colors"
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
                    placeholder="your.email@example.com"
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs text-xs text-[#413C23] placeholder-[#8F896D]/60 focus:outline-none focus:border-[#413C23] transition-colors"
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
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs text-xs text-[#413C23] placeholder-[#8F896D]/60 focus:outline-none focus:border-[#413C23] transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-[#413C23] font-medium block">
                    Subject / Topic
                  </label>
                  <select
                    value={formData.inquiryType}
                    onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs text-xs text-[#413C23] focus:outline-none focus:border-[#413C23] transition-colors cursor-pointer"
                  >
                    <option value="general">General Question</option>
                    <option value="styling">Styling & Layering Advice</option>
                    <option value="sizing">Ring Sizing & Fit Help</option>
                    <option value="order">Order Tracking & Delivery</option>
                    <option value="care">Jewelry Care & Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-[#413C23] font-medium block">
                  Message *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we help you today?"
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs text-xs text-[#413C23] placeholder-[#8F896D]/60 focus:outline-none focus:border-[#413C23] transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-[#413C23] hover:bg-[#8F896D] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-semibold rounded-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-98"
              >
                {submitting ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <span>Submit Message</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* 4. FAQ ACCORDION SECTION */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-12 max-w-4xl mx-auto text-left">
        <div className="text-center space-y-2 mb-8">
          <span className="text-[10px] sm:text-xs font-semibold text-[#8F896D] uppercase tracking-[0.25em] block">
            Frequently Asked Questions
          </span>
          <h2 className="font-serif-display text-3xl sm:text-4xl text-[#413C23] font-light">
            Helpful Answers
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="border border-[#D8D2C2] rounded-xs bg-[#F2EFDB] overflow-hidden transition-colors"
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
