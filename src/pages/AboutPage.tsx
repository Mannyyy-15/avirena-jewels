import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Gem, Shield, Sparkles, Flame, ArrowRight, Clock, Award, Compass } from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';

// Register GSAP plugins safely
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface AboutPageProps {
  onNavigateToShop: () => void;
  onNavigateToContact: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onNavigateToShop,
  onNavigateToContact,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const craftRef = useRef<HTMLDivElement>(null);
  const manifestoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero Reveal
      gsap.from('.about-hero-text', {
        y: 60,
        opacity: 0,
        duration: 1.1,
        stagger: 0.15,
        ease: 'power3.out',
      });

      // 2. Parallax and reveal on editorial images
      gsap.utils.toArray<HTMLElement>('.gsap-reveal-img').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 50, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // 3. Staggered craft pillars
      gsap.from('.craft-pillar-card', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: craftRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      // 4. Manifesto text fade-in
      if (manifestoRef.current) {
        gsap.from(manifestoRef.current, {
          opacity: 0,
          y: 40,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: manifestoRef.current,
            start: 'top 80%',
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="font-sans-body text-[#2C2C2A] bg-[#FAF8F5] pb-24 overflow-hidden w-full">
      {/* 1. HERO SECTION - High-Impact Editorial Atelier Banner */}
      <section ref={heroRef} className="relative w-full px-4 sm:px-8 lg:px-12 xl:px-16 pt-4 pb-12 sm:pb-16">
        <div className="relative rounded-xs overflow-hidden border border-[#E6DFD3] bg-[#2C2C2A] min-h-[500px] sm:min-h-[580px] lg:min-h-[640px] flex items-end">
          {/* Background Atmospheric Workshop & Model Image */}
          <img
            src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=2400&q=90"
            alt="Avirena jewelry artisan handcrafting gold casting"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-[center_35%] mix-blend-luminosity opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1A] via-[#1C1C1A]/60 to-transparent" />

          {/* Top Micro-Header */}
          <div className="absolute top-6 sm:top-10 left-6 sm:left-12 right-6 sm:right-12 flex items-center justify-between z-10 border-b border-white/10 pb-4">
            <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-[#C5A059] uppercase">
              The Avirena Atelier
            </span>
            <span className="text-[11px] sm:text-xs text-[#E6DFD3] font-light hidden sm:inline-block">
              Est. Jaipur • Vicenza • Mumbai
            </span>
          </div>

          {/* Center-Bottom Hero Typography */}
          <div className="relative z-10 w-full px-6 sm:px-12 lg:px-16 pb-10 sm:pb-16 max-w-4xl space-y-3">
            <div className="about-hero-text">
              <h1 className="font-serif-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-[#FAF8F5] tracking-tight leading-[1.05] font-light">
                The Poetry of Molten Metal
              </h1>
            </div>

            <p className="about-hero-text text-xs sm:text-sm text-[#FAF8F5]/80 max-w-xl font-light leading-relaxed">
              Sculpted by hand using lost-wax casting, celebrating the natural ripples of molten gold and organic baroque pearls.
            </p>

            <div className="about-hero-text pt-2 flex flex-wrap items-center gap-3">
              <button
                id="about-hero-shop-btn"
                onClick={onNavigateToShop}
                className="px-5 py-2.5 bg-[#FAF8F5] hover:bg-[#C5A059] text-[#2C2C2A] hover:text-white text-xs uppercase tracking-widest font-medium rounded-xs transition-colors shadow-sm inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Creations</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                id="about-hero-contact-btn"
                onClick={onNavigateToContact}
                className="px-5 py-2.5 border border-white/40 hover:border-white text-white text-xs uppercase tracking-widest font-medium rounded-xs transition-colors cursor-pointer"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OUR MANIFESTO - 2-Column High Contrast Layout */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14 items-center">
          {/* Left: Atmospheric Workshop Image */}
          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/5] rounded-xs overflow-hidden border border-[#E6DFD3] bg-[#E6DFD3] gsap-reveal-img relative">
              <img
                src="https://images.unsplash.com/photo-1611591475168-98967b5eb488?auto=format&fit=crop&w=1200&q=90"
                alt="Molten gold cuff sculpted on stone"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-[#FAF8F5]/90 backdrop-blur-xs p-4 rounded-xs border border-[#E6DFD3]">
                <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-semibold block">
                  Casting Signature
                </span>
                <p className="text-xs text-[#2C2C2A] font-serif-display italic mt-0.5">
                  “Metal in its liquid state remembers the touch of the artisan’s flame.”
                </p>
              </div>
            </div>
          </div>

          {/* Right: Narrative & Philosophy */}
          <div ref={manifestoRef} className="lg:col-span-7 space-y-6 text-left">
            <div className="space-y-2">
              <h2 className="font-serif-display text-2xl sm:text-4xl text-[#2C2C2A] tracking-tight leading-tight">
                Designed to be worn, lived in, and loved daily.
              </h2>
            </div>

            <p className="text-sm sm:text-base text-[#7D7973] font-light leading-relaxed">
              Traditional fine jewelry is locked away in bank vaults, reserved only for weddings and ceremonial galas. Avirena was founded on a simple conviction: luxury should be an everyday sensation.
            </p>

            <p className="text-sm sm:text-base text-[#7D7973] font-light leading-relaxed">
              We bridge the worlds of ancient Indian metal-smithing traditions from Jaipur and contemporary Italian sculptural minimalism from Vicenza. Each piece is engineered with ergonomic weight distribution, ensuring day-to-night comfort.
            </p>

            {/* 3 Key Brand Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#E6DFD3]">
              <div>
                <span className="font-serif-display text-3xl sm:text-4xl text-[#2C2C2A] block">3.0μ</span>
                <span className="text-[11px] sm:text-xs text-[#7D7973] uppercase tracking-wider">Gold Vermeil Thickness</span>
              </div>
              <div>
                <span className="font-serif-display text-3xl sm:text-4xl text-[#2C2C2A] block">100%</span>
                <span className="text-[11px] sm:text-xs text-[#7D7973] uppercase tracking-wider">Recycled 925 Silver</span>
              </div>
              <div>
                <span className="font-serif-display text-3xl sm:text-4xl text-[#2C2C2A] block">0%</span>
                <span className="text-[11px] sm:text-xs text-[#7D7973] uppercase tracking-wider">Nickel & Lead Toxins</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MATERIAL MASTERY & ARTISANAL PILLARS */}
      <section ref={craftRef} className="w-full bg-[#EAE6DB]/70 py-16 sm:py-24 border-y border-[#DDD7CB]">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="font-serif-display text-2xl sm:text-4xl text-[#2C2C2A] tracking-tight">
              Material Standards
            </h2>
            <p className="text-xs sm:text-sm text-[#7D7973] font-light leading-relaxed">
              Genuine precious metals, conflict-free gemstones, and thick vermeil layers engineered for longevity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {/* Pillar 1 */}
            <div className="craft-pillar-card bg-[#FAF8F5] p-6 sm:p-8 rounded-xs border border-[#E6DFD3] space-y-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xs bg-[#EAE6DB] flex items-center justify-center text-[#C5A059]">
                <Flame className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="font-serif-display text-xl text-[#2C2C2A]">18k Heavy Vermeil</h3>
              <p className="text-xs text-[#7D7973] leading-relaxed font-light">
                Unlike standard 0.5-micron flash electroplating, our heavy 3.0-micron 18-karat gold layer ensures enduring richness and rich luster that resists daily wear.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="craft-pillar-card bg-[#FAF8F5] p-6 sm:p-8 rounded-xs border border-[#E6DFD3] space-y-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xs bg-[#EAE6DB] flex items-center justify-center text-[#C5A059]">
                <Gem className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="font-serif-display text-xl text-[#2C2C2A]">Baroque Freshwater Pearls</h3>
              <p className="text-xs text-[#7D7973] leading-relaxed font-light">
                Each baroque pearl is individually hand-selected for its iridescent luster, unique irregular contours, and organic asymmetry. No two pearls are ever identical.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="craft-pillar-card bg-[#FAF8F5] p-6 sm:p-8 rounded-xs border border-[#E6DFD3] space-y-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xs bg-[#EAE6DB] flex items-center justify-center text-[#C5A059]">
                <Shield className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="font-serif-display text-xl text-[#2C2C2A]">Hypoallergenic Silver Core</h3>
              <p className="text-xs text-[#7D7973] leading-relaxed font-light">
                Our base is always certified 100% recycled 925 sterling silver—never cheap brass, alloy, or nickel that turns skin green or triggers irritations.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="craft-pillar-card bg-[#FAF8F5] p-6 sm:p-8 rounded-xs border border-[#E6DFD3] space-y-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xs bg-[#EAE6DB] flex items-center justify-center text-[#C5A059]">
                <Award className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="font-serif-display text-xl text-[#2C2C2A]">Limited Small Batches</h3>
              <p className="text-xs text-[#7D7973] leading-relaxed font-light">
                Produced in strictly controlled limited batches by hereditary jewelers. We maintain zero deadstock waste and provide full artisan fair-wage transparency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE 4-STAGE CRAFT JOURNEY */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E6DFD3] pb-6">
            <div>
              <h2 className="font-serif-display text-2xl sm:text-4xl text-[#2C2C2A] tracking-tight">
                Craftsmanship
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#7D7973] max-w-md font-light">
              From wax sculpture to molten gold bath, every piece undergoes over 18 hours of craftsmanship.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Sculptural Wax Carving',
                desc: 'Forms are hand-carved in organic jeweler wax to capture molten liquid waves and natural imperfections.',
                img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
              },
              {
                step: '02',
                title: 'Lost-Wax Casting',
                desc: 'Recycled 925 silver is melted at 961°C and poured into gypsum molds, displacing the wax shell.',
                img: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=800&q=80',
              },
              {
                step: '03',
                title: 'Hand-Filing & Polish',
                desc: 'Artisans use fine diamond files and buffing wheels to achieve a satiny mirror luster without erasing molten texture.',
                img: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80',
              },
              {
                step: '04',
                title: '18k Heavy Gold Bath',
                desc: 'The jewel is immersed in a multi-stage electrolytic bath, sealing 3.0 microns of warm 18k yellow gold.',
                img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
              },
            ].map((stage, idx) => (
              <div
                key={stage.step}
                className="group bg-[#FAF8F5] border border-[#E6DFD3] rounded-xs overflow-hidden flex flex-col text-left hover:border-[#C5A059] transition-colors"
              >
                <div className="aspect-[4/3] bg-[#E6DFD3] overflow-hidden relative">
                  <img
                    src={stage.img}
                    alt={stage.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#2C2C2A] text-white text-[11px] font-mono px-2 py-0.5 rounded-xs">
                    {stage.step}
                  </div>
                </div>

                <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif-display text-lg text-[#2C2C2A] group-hover:text-[#C5A059] transition-colors">
                      {stage.title}
                    </h4>
                    <p className="text-xs text-[#7D7973] font-light leading-relaxed mt-1">
                      {stage.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FOUNDER'S LETTER & SIGNATURE */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 max-w-5xl mx-auto py-12">
        <div className="bg-[#FAF8F5] border border-[#E6DFD3] p-8 sm:p-12 lg:p-16 rounded-xs text-center space-y-6 shadow-xs relative">
          <BrandLogo variant="submark" size="md" theme="gold" className="mx-auto" />
          
          <div className="space-y-4 max-w-2xl mx-auto">
            <h3 className="font-serif-display text-2xl sm:text-4xl text-[#2C2C2A]">
              “We build jewels that age with you, taking on the patina of your life’s milestones.”
            </h3>
            <p className="text-xs sm:text-sm text-[#7D7973] font-light leading-relaxed italic">
              When you put on an Avirena ring or necklace, it shouldn’t feel like costume or fragile decoration. It should feel grounding—like a wearable piece of sculpture that honors your individuality.
            </p>
          </div>

          <div className="pt-4 border-t border-[#E6DFD3] max-w-xs mx-auto">
            <span className="font-serif-display text-lg text-[#2C2C2A] block">Avirena Creative Direction</span>
            <span className="text-xs text-[#C5A059] uppercase tracking-widest">Jaipur & Mumbai</span>
          </div>
        </div>
      </section>

      {/* 6. BOTTOM INVITATION CTA */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 pt-8">
        <div className="bg-[#2C2C2A] text-[#FAF8F5] p-6 sm:p-12 lg:p-14 rounded-xs text-center space-y-5 max-w-7xl mx-auto">
          <h2 className="font-serif-display text-2xl sm:text-4xl lg:text-5xl text-[#FAF8F5] max-w-2xl mx-auto">
            Find the piece sculpted for your daily journey.
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onNavigateToShop}
              className="px-8 py-3.5 bg-[#FAF8F5] hover:bg-[#C5A059] text-[#2C2C2A] hover:text-white text-xs uppercase tracking-widest font-semibold rounded-xs transition-colors shadow-sm cursor-pointer"
            >
              Shop All Jewelry
            </button>
            <button
              onClick={onNavigateToContact}
              className="px-8 py-3.5 border border-white/40 hover:border-white text-white text-xs uppercase tracking-widest font-semibold rounded-xs transition-colors cursor-pointer"
            >
              Contact Concierge
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
