import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Gem, Shield, Sparkles, Flame, ArrowRight, Award, Compass, Heart, CheckCircle2, Star } from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';

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
      // 1. Hero Entrance
      gsap.from('.about-hero-element', {
        y: 35,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
      });

      // 2. Parallax and reveal on editorial images
      gsap.utils.toArray<HTMLElement>('.gsap-reveal-img').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
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
        y: 35,
        opacity: 0,
        duration: 0.75,
        stagger: 0.12,
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
          y: 30,
          duration: 0.9,
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
    <div ref={containerRef} className="font-sans-body text-[#413C23] bg-[#E7E4D5] pb-24 overflow-hidden w-full select-none">
      
      {/* 1. HERO SECTION - Editorial Atelier Masthead */}
      <section ref={heroRef} className="relative w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 pt-4 pb-12 sm:pb-16">
        <div className="relative rounded-xs overflow-hidden border border-[#D8D2C2] bg-[#413C23] min-h-[520px] sm:min-h-[600px] lg:min-h-[660px] flex items-end">
          {/* Background Atmospheric Workshop Image with Multiply/Luminosity Blend */}
          <img
            src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=2400&q=90"
            alt="Avirena jewelry artisan handcrafting gold casting"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-[center_35%] mix-blend-luminosity opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#413C23] via-[#413C23]/60 to-transparent" />

          {/* Top Micro-Header */}
          <div className="absolute top-6 sm:top-10 left-6 sm:left-12 right-6 sm:right-12 flex items-center justify-between z-10 border-b border-[#E7E4D5]/20 pb-4">
            <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] text-[#8F896D] uppercase">
              (01) / The Avirena Atelier
            </span>
            <span className="text-[10px] sm:text-xs text-[#E7E4D5]/80 font-light hidden sm:inline-block uppercase tracking-widest">
              Jaipur • Vicenza • Mumbai
            </span>
          </div>

          {/* Center-Bottom Hero Typography */}
          <div className="relative z-10 w-full px-6 sm:px-12 lg:px-16 pb-10 sm:pb-16 max-w-4xl space-y-4 text-left">
            <div className="about-hero-element">
              <span className="text-[11px] uppercase tracking-[0.3em] font-semibold text-[#8F896D] block mb-2">
                Sculpted With Soul
              </span>
              <h1 className="font-serif-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-[#E7E4D5] tracking-tight leading-[1.02] font-light">
                The Poetry of <span className="italic font-normal text-[#FAF8F5]">Molten Metal</span>
              </h1>
            </div>

            <p className="about-hero-element text-xs sm:text-sm text-[#E7E4D5]/85 max-w-xl font-normal leading-relaxed">
              Sculpted by hand using lost-wax casting, celebrating the natural ripples of molten 18k gold vermeil and organic baroque freshwater pearls.
            </p>

            <div className="about-hero-element pt-2 flex flex-wrap items-center gap-3.5">
              <button
                id="about-hero-shop-btn"
                onClick={onNavigateToShop}
                className="px-6 py-3.5 bg-[#E7E4D5] hover:bg-[#8F896D] text-[#413C23] hover:text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-semibold rounded-xs transition-all shadow-md inline-flex items-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Explore Creations</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                id="about-hero-contact-btn"
                onClick={onNavigateToContact}
                className="px-6 py-3.5 border border-[#E7E4D5]/50 hover:border-[#E7E4D5] text-[#E7E4D5] text-xs uppercase tracking-[0.2em] font-semibold rounded-xs transition-colors cursor-pointer"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OUR MANIFESTO - 2-Column Editorial High-End Layout */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-12 sm:py-20 border-b border-[#D8D2C2]">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14 items-center">
          
          {/* Left: Atmospheric Workshop Image with Signature Seal */}
          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/5] rounded-xs overflow-hidden border border-[#D8D2C2] bg-[#F4EFE6] gsap-reveal-img relative shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1611591475168-98967b5eb488?auto=format&fit=crop&w=1200&q=90"
                alt="Molten gold cuff sculpted on stone"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-[#FAF8F5]/95 backdrop-blur-xs p-4 rounded-xs border border-[#D8D2C2]">
                <span className="text-[10px] uppercase tracking-widest text-[#8F896D] font-bold block">
                  Signature Casting
                </span>
                <p className="text-xs text-[#413C23] font-serif-display italic mt-1 leading-snug">
                  “Metal in its liquid state remembers the touch of the artisan’s flame.”
                </p>
              </div>
            </div>
          </div>

          {/* Right: Narrative & Philosophy */}
          <div ref={manifestoRef} className="lg:col-span-7 space-y-6 text-left">
            <div className="space-y-2">
              <span className="text-[10px] text-[#8F896D] uppercase tracking-widest font-semibold block">
                (02) / Philosophy
              </span>
              <h2 className="font-serif-display text-3xl sm:text-5xl lg:text-6xl text-[#413C23] tracking-tight leading-tight font-light">
                Designed to be worn, lived in, and <span className="italic font-normal">loved daily.</span>
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-[#413C23]/80 font-normal leading-relaxed">
              Traditional fine jewelry is often locked away in bank vaults, reserved only for weddings and rare galas. Avirena was founded on a simple conviction: luxury should be an everyday sensation.
            </p>

            <p className="text-xs sm:text-sm text-[#413C23]/80 font-normal leading-relaxed">
              We bridge the worlds of ancient Indian metal-smithing traditions from Jaipur and contemporary Italian sculptural minimalism from Vicenza. Each piece is engineered with ergonomic weight distribution, ensuring luxurious day-to-night comfort.
            </p>

            {/* 3 Key Brand Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#D8D2C2]">
              <div className="space-y-1">
                <span className="font-serif-display text-3xl sm:text-4xl text-[#413C23] block font-light">3.0μ</span>
                <span className="text-[10px] sm:text-[11px] text-[#8F896D] uppercase tracking-wider block font-medium">Gold Vermeil Layer</span>
              </div>
              <div className="space-y-1">
                <span className="font-serif-display text-3xl sm:text-4xl text-[#413C23] block font-light">100%</span>
                <span className="text-[10px] sm:text-[11px] text-[#8F896D] uppercase tracking-wider block font-medium">Recycled 925 Silver</span>
              </div>
              <div className="space-y-1">
                <span className="font-serif-display text-3xl sm:text-4xl text-[#413C23] block font-light">0%</span>
                <span className="text-[10px] sm:text-[11px] text-[#8F896D] uppercase tracking-wider block font-medium">Nickel & Allergen Free</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MATERIAL MASTERY & ARTISANAL PILLARS */}
      <section ref={craftRef} className="w-full bg-[#F4EFE6] py-16 sm:py-24 border-b border-[#D8D2C2] px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="w-full space-y-12">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#D8D2C2] pb-4 text-left gap-3">
            <div>
              <span className="text-[10px] text-[#8F896D] uppercase tracking-widest font-semibold block mb-1">
                (03) / Standards
              </span>
              <h2 className="font-serif-display text-3xl sm:text-5xl text-[#413C23] tracking-tight font-light">
                Material Integrity
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#413C23]/70 font-normal max-w-md">
              Genuine precious metals, conflict-free gemstones, and thick vermeil layers engineered for lasting daily radiance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 text-left">
            {/* Pillar 1 */}
            <div className="craft-pillar-card bg-[#FAF8F5] p-6 sm:p-8 rounded-xs border border-[#D8D2C2] space-y-4 hover:border-[#8F896D] transition-all hover:shadow-sm">
              <div className="w-11 h-11 rounded-xs bg-[#E7E4D5] border border-[#D8D2C2] flex items-center justify-center text-[#413C23]">
                <Flame className="w-5 h-5 stroke-[1.5]" />
              </div>
              <h3 className="font-serif-display text-xl text-[#413C23] font-medium">18k Heavy Vermeil</h3>
              <p className="text-xs text-[#413C23]/75 leading-relaxed font-normal">
                Unlike standard 0.5-micron flash plating, our heavy 3.0-micron 18-karat gold layer delivers enduring warmth and rich luster that resists daily wear.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="craft-pillar-card bg-[#FAF8F5] p-6 sm:p-8 rounded-xs border border-[#D8D2C2] space-y-4 hover:border-[#8F896D] transition-all hover:shadow-sm">
              <div className="w-11 h-11 rounded-xs bg-[#E7E4D5] border border-[#D8D2C2] flex items-center justify-center text-[#413C23]">
                <Gem className="w-5 h-5 stroke-[1.5]" />
              </div>
              <h3 className="font-serif-display text-xl text-[#413C23] font-medium">Baroque Pearls</h3>
              <p className="text-xs text-[#413C23]/75 leading-relaxed font-normal">
                Each baroque pearl is individually hand-selected for its iridescent luster, unique irregular contours, and organic asymmetry. No two pearls are ever identical.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="craft-pillar-card bg-[#FAF8F5] p-6 sm:p-8 rounded-xs border border-[#D8D2C2] space-y-4 hover:border-[#8F896D] transition-all hover:shadow-sm">
              <div className="w-11 h-11 rounded-xs bg-[#E7E4D5] border border-[#D8D2C2] flex items-center justify-center text-[#413C23]">
                <Shield className="w-5 h-5 stroke-[1.5]" />
              </div>
              <h3 className="font-serif-display text-xl text-[#413C23] font-medium">Hypoallergenic Core</h3>
              <p className="text-xs text-[#413C23]/75 leading-relaxed font-normal">
                Our base is always certified 100% recycled 925 sterling silver—never cheap brass, base alloy, or nickel that turns skin green or triggers irritations.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="craft-pillar-card bg-[#FAF8F5] p-6 sm:p-8 rounded-xs border border-[#D8D2C2] space-y-4 hover:border-[#8F896D] transition-all hover:shadow-sm">
              <div className="w-11 h-11 rounded-xs bg-[#E7E4D5] border border-[#D8D2C2] flex items-center justify-center text-[#413C23]">
                <Award className="w-5 h-5 stroke-[1.5]" />
              </div>
              <h3 className="font-serif-display text-xl text-[#413C23] font-medium">Limited Batches</h3>
              <p className="text-xs text-[#413C23]/75 leading-relaxed font-normal">
                Produced in strictly controlled limited runs by hereditary jewelers. We maintain zero deadstock waste and practice full artisan fair-wage transparency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE 4-STAGE CRAFT JOURNEY */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-16 sm:py-24 border-b border-[#D8D2C2]">
        <div className="w-full space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#D8D2C2] pb-4 text-left">
            <div>
              <span className="text-[10px] text-[#8F896D] uppercase tracking-widest font-semibold block mb-1">
                (04) / Atelier Process
              </span>
              <h2 className="font-serif-display text-3xl sm:text-5xl text-[#413C23] tracking-tight font-light">
                The Making of an Artifact
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#413C23]/70 max-w-md font-normal">
              From hand-carved wax sculpture to molten gold immersion, every creation undergoes over 18 hours of master craftsmanship.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Sculptural Wax Carving',
                desc: 'Silhouettes are hand-carved in organic jeweler wax to capture molten liquid waves and natural tactile ridges.',
                img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
              },
              {
                step: '02',
                title: 'Lost-Wax Casting',
                desc: 'Recycled 925 silver is melted at 961°C and poured into gypsum investment molds, displacing the carved wax shell.',
                img: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=800&q=80',
              },
              {
                step: '03',
                title: 'Hand-Filing & Satiny Polish',
                desc: 'Artisans use fine diamond files and buffing wheels to achieve a silky mirror luster without dulling molten contours.',
                img: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80',
              },
              {
                step: '04',
                title: '18k Heavy Gold Bath',
                desc: 'The jewel is immersed in a multi-stage electrolytic bath, sealing 3.0 microns of warm 18k yellow gold.',
                img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
              },
            ].map((stage) => (
              <div
                key={stage.step}
                className="group bg-[#F4EFE6] border border-[#D8D2C2] rounded-xs overflow-hidden flex flex-col text-left hover:border-[#8F896D] transition-all hover:shadow-sm"
              >
                <div className="aspect-[4/3] bg-[#E7E4D5] overflow-hidden relative">
                  <img
                    src={stage.img}
                    alt={stage.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-3 left-3 bg-[#413C23] text-[#E7E4D5] text-[11px] font-mono px-2 py-0.5 rounded-xs">
                    ({stage.step})
                  </div>
                </div>

                <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif-display text-lg text-[#413C23] group-hover:text-[#8F896D] transition-colors font-medium">
                      {stage.title}
                    </h4>
                    <p className="text-xs text-[#413C23]/75 font-normal leading-relaxed mt-1.5">
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
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-16 max-w-5xl mx-auto">
        <div className="bg-[#FAF8F5] border border-[#D8D2C2] p-8 sm:p-12 lg:p-16 rounded-xs text-center space-y-6 shadow-xs relative">
          <BrandLogo variant="submark" size="md" theme="gold" className="mx-auto" />
          
          <div className="space-y-4 max-w-2xl mx-auto">
            <span className="text-[10px] text-[#8F896D] uppercase tracking-widest font-semibold block">
              (05) / Founder’s Note
            </span>
            <h3 className="font-serif-display text-2xl sm:text-4xl text-[#413C23] font-light italic leading-snug">
              “We build jewels that age with you, taking on the patina of your life’s milestones.”
            </h3>
            <p className="text-xs sm:text-sm text-[#413C23]/80 font-normal leading-relaxed">
              When you put on an Avirena ring or necklace, it shouldn’t feel like costume or fragile decoration. It should feel grounding—like a wearable piece of sculpture that honors your individuality.
            </p>
          </div>

          <div className="pt-4 border-t border-[#D8D2C2] max-w-xs mx-auto">
            <span className="font-serif-display text-lg text-[#413C23] block font-medium">Avirena Creative Direction</span>
            <span className="text-[11px] text-[#8F896D] uppercase tracking-[0.2em] font-semibold">Jaipur • Vicenza • Mumbai</span>
          </div>
        </div>
      </section>

      {/* 6. BOTTOM INVITATION CTA */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 pt-4">
        <div className="bg-[#413C23] text-[#E7E4D5] p-8 sm:p-12 lg:p-16 rounded-xs text-center space-y-6 max-w-7xl mx-auto border border-[#413C23] shadow-md">
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.3em] font-semibold text-[#8F896D] block">
              Maison Avirena
            </span>
            <h2 className="font-serif-display text-3xl sm:text-5xl lg:text-6xl text-[#E7E4D5] max-w-2xl mx-auto font-light leading-tight">
              Find the piece sculpted for your <span className="italic font-normal">daily journey.</span>
            </h2>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onNavigateToShop}
              className="px-8 py-3.5 bg-[#E7E4D5] hover:bg-[#8F896D] text-[#413C23] hover:text-[#FAF8F5] text-xs uppercase tracking-[0.2em] font-semibold rounded-xs transition-all shadow-sm cursor-pointer active:scale-98"
            >
              Shop All Jewelry
            </button>
            <button
              onClick={onNavigateToContact}
              className="px-8 py-3.5 border border-[#E7E4D5]/40 hover:border-[#E7E4D5] text-[#E7E4D5] text-xs uppercase tracking-[0.2em] font-semibold rounded-xs transition-colors cursor-pointer"
            >
              Contact Concierge
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
