import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AboutUsEditorialSection } from '../components/AboutUsEditorialSection';

// Image imports for Section 2: Editorial Banner
import bannerBookImg from '../assets/about/about-banner-book.jpg';

// Image imports for Section 3: Bestsellers
import bestsellerSignetsImg from '../assets/about/about-bestseller-signets.jpg';
import bestsellerNecklaceImg from '../assets/about/about-bestseller-necklace.jpg';
import bestsellerSmileImg from '../assets/about/about-bestseller-smile.jpg';


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

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal animations for editorial images
      gsap.utils.toArray<HTMLElement>('.gsap-about-reveal').forEach((el) => {
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

      // Staggered product cards
      gsap.from('.bestseller-card', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.bestsellers-grid',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      // New collection collage reveal
      gsap.from('.new-collection-element', {
        y: 35,
        opacity: 0,
        duration: 0.85,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.new-collection-grid',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="font-sans-body text-[#413C23] bg-[#E7E4D5] overflow-hidden w-full select-none">
      
      {/* ═══════════════════════════════════════════════════════════════
          SECTION 1: ABOUT US — Editorial Story + Roman Arch + Vignettes
          Uses the shared AboutUsEditorialSection component
      ═══════════════════════════════════════════════════════════════ */}
      <AboutUsEditorialSection onNavigateToAbout={onNavigateToShop} />


      {/* ═══════════════════════════════════════════════════════════════
          SECTION 2: "OUR JEWELRY IS JUST LOVE" — Infinite Marquee Banner
          Atmospheric photography with infinite marquee serif typography
      ═══════════════════════════════════════════════════════════════ */}
      <section className="w-full relative overflow-hidden select-none">
        {/* Full-bleed atmospheric photo */}
        <div className="relative w-full h-[240px] sm:h-[320px] lg:h-[380px] overflow-hidden">
          <img
            src={bannerBookImg}
            alt="Jewelry on vintage book in warm sunlight"
            className="w-full h-full object-cover object-center scale-105"
          />
          {/* Dark overlay for text legibility */}
          <div className="absolute inset-0 bg-[#413C23]/50" />

          {/* Bold serif typography infinite marquee */}
          <div className="absolute inset-0 flex items-center overflow-hidden">
            <div className="flex animate-infinite-marquee whitespace-nowrap">
              <div className="flex items-center shrink-0">
                {[...Array(4)].map((_, i) => (
                  <div key={`about-marquee-1-${i}`} className="flex items-center shrink-0">
                    <span className="font-serif-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-[#FAF8F5] tracking-[0.06em] uppercase whitespace-nowrap font-light leading-none px-6 sm:px-12">
                      Our Jewelry Is Just Love
                    </span>
                    <span className="text-2xl sm:text-4xl text-[#E7E4D5]/60 font-serif-display select-none">
                      ·
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center shrink-0" aria-hidden="true">
                {[...Array(4)].map((_, i) => (
                  <div key={`about-marquee-2-${i}`} className="flex items-center shrink-0">
                    <span className="font-serif-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-[#FAF8F5] tracking-[0.06em] uppercase whitespace-nowrap font-light leading-none px-6 sm:px-12">
                      Our Jewelry Is Just Love
                    </span>
                    <span className="text-2xl sm:text-4xl text-[#E7E4D5]/60 font-serif-display select-none">
                      ·
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════
          SECTION 3: BESTSELLERS — Editorial Product Showcase
          Right-aligned header, horizontal contrast band, 3 editorial cards
      ═══════════════════════════════════════════════════════════════ */}
      <section className="w-full bg-[#E7E4D5] py-16 sm:py-24 lg:py-28 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 border-b border-[#D8D2C2]">
        
        {/* Section Header: Right-aligned "BESTSELLERS —" */}
        <div className="w-full flex items-end justify-between mb-10 sm:mb-14 gsap-about-reveal">
          <div className="flex-1" />
          <div className="flex items-center gap-4 sm:gap-6">
            <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-[#413C23] font-normal tracking-[0.04em] uppercase">
              Bestsellers
            </h2>
            <span className="w-12 sm:w-20 h-px bg-[#8F896D]/60 shrink-0" />
          </div>
        </div>

        {/* 3-Card Editorial Strip with horizontal contrast band behind */}
        <div className="relative">
          {/* Horizontal contrast band running behind the cards */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-20 sm:h-28 lg:h-32 bg-[#8F896D]/20 rounded-xs pointer-events-none" />

          <div className="bestsellers-grid grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 relative z-10">
            
            {/* Card 1: Micro Signets */}
            <div
              className="bestseller-card group cursor-pointer"
              onClick={onNavigateToShop}
            >
              <div className="bg-[#F2EFDB] border border-[#D8D2C2] rounded-xs overflow-hidden transition-all hover:border-[#8F896D] hover:shadow-md">
                <div className="aspect-[3/4] overflow-hidden relative">
                  <img
                    src={bestsellerSignetsImg}
                    alt="Micro signet rings on elegant hands"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
                <div className="p-5 sm:p-6 space-y-3 text-center">
                  <h3 className="font-serif-display text-lg sm:text-xl text-[#413C23] font-medium tracking-wide uppercase">
                    Micro Signets
                  </h3>
                  {/* Circular dot "SHOW MORE" button */}
                  <button
                    type="button"
                    className="group/btn inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-[#413C23]/80 font-medium transition-all hover:text-[#413C23] cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full border border-[#413C23]/40 flex items-center justify-center transition-all duration-300 group-hover/btn:scale-110 group-hover/btn:border-[#413C23] group-hover/btn:bg-[#E7E4D5]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#413C23]" />
                    </div>
                    <span className="font-serif-display text-xs tracking-[0.18em]">Show More</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2: Necklace Handmade */}
            <div
              className="bestseller-card group cursor-pointer"
              onClick={onNavigateToShop}
            >
              <div className="bg-[#F2EFDB] border border-[#D8D2C2] rounded-xs overflow-hidden transition-all hover:border-[#8F896D] hover:shadow-md">
                <div className="aspect-[3/4] overflow-hidden relative">
                  <img
                    src={bestsellerNecklaceImg}
                    alt="Statement gold beaded necklace"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
                <div className="p-5 sm:p-6 space-y-3 text-center">
                  <h3 className="font-serif-display text-lg sm:text-xl text-[#413C23] font-medium tracking-wide uppercase">
                    Necklace Handmade
                  </h3>
                  {/* Circular dot "SHOW MORE" button */}
                  <button
                    type="button"
                    className="group/btn inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-[#413C23]/80 font-medium transition-all hover:text-[#413C23] cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full border border-[#413C23]/40 flex items-center justify-center transition-all duration-300 group-hover/btn:scale-110 group-hover/btn:border-[#413C23] group-hover/btn:bg-[#E7E4D5]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#413C23]" />
                    </div>
                    <span className="font-serif-display text-xs tracking-[0.18em]">Show More</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Card 3: Ring «For You» */}
            <div
              className="bestseller-card group cursor-pointer"
              onClick={onNavigateToShop}
            >
              <div className="bg-[#F2EFDB] border border-[#D8D2C2] rounded-xs overflow-hidden transition-all hover:border-[#8F896D] hover:shadow-md">
                <div className="aspect-[3/4] overflow-hidden relative">
                  <img
                    src={bestsellerSmileImg}
                    alt="Model smiling with layered gold rings and earrings"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
                <div className="p-5 sm:p-6 space-y-3 text-center">
                  <h3 className="font-serif-display text-lg sm:text-xl text-[#413C23] font-medium tracking-wide uppercase">
                    Ring «For You»
                  </h3>
                  {/* Circular dot "SHOW MORE" button */}
                  <button
                    type="button"
                    className="group/btn inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-[#413C23]/80 font-medium transition-all hover:text-[#413C23] cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full border border-[#413C23]/40 flex items-center justify-center transition-all duration-300 group-hover/btn:scale-110 group-hover/btn:border-[#413C23] group-hover/btn:bg-[#E7E4D5]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#413C23]" />
                    </div>
                    <span className="font-serif-display text-xs tracking-[0.18em]">Show More</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


    </div>
  );
};
