import React from 'react';
import heroArchImg from '../assets/about/about-hero-arch.jpg';
import vignette1Img from '../assets/about/about-vignette-1.jpg';
import vignette2Img from '../assets/about/about-vignette-2.jpg';
import vignette3Img from '../assets/about/about-vignette-3.jpg';

interface AboutUsEditorialSectionProps {
  onNavigateToAbout?: () => void;
  className?: string;
}

export const AboutUsEditorialSection: React.FC<AboutUsEditorialSectionProps> = ({
  onNavigateToAbout,
  className = '',
}) => {
  return (
    <section className={`w-full bg-[#E7E4D5] py-16 sm:py-24 lg:py-28 border-b border-[#D8D2C2] px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 select-none ${className}`}>
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
        
        {/* LEFT COLUMN: Full-Width Editorial Story & Cascading Inverted Arch Vignettes */}
        <div className="lg:col-span-7 xl:col-span-7 flex flex-col justify-between text-left space-y-8 sm:space-y-10 w-full">
          
          {/* Top Editorial Story Block */}
          <div className="space-y-6 w-full">
            {/* Header with Horizontal Hairline */}
            <div className="flex items-center gap-4 sm:gap-6">
              <span className="w-12 sm:w-16 h-px bg-[#8F896D]/60 shrink-0" />
              <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-[#413C23] font-normal tracking-[0.06em] uppercase">
                About Us
              </h2>
            </div>

            {/* Editorial Copy: Spanning full column width without artificial narrow bounds */}
            <div className="space-y-4 text-xs sm:text-sm text-[#413C23]/85 leading-relaxed font-normal w-full max-w-2xl">
              <p>
                There is an intimate story behind every piece in your jewelry box. All those quiet, cherished moments you hold onto—that is the very heartbeat of AVIRENA.
              </p>
              <p>
                Founded in 2020 during the lockdown as a homegrown creative journey, AVIRENA began with small, bespoke orders for our local community. Today, we have evolved into a beloved modern daily jewelry label. We intentionally craft our collections using premium brass alloy, durable water-resistant protective finishes, and hypoallergenic coatings—never overpriced solid gold or mined diamonds, but high-grade, tarnish-resistant pieces designed for effortless, everyday luxury.
              </p>
            </div>

            {/* Signature Luxury Circular CTA Button: "MORE ABOUT US" */}
            <div className="pt-2 sm:pt-4">
              <button
                id="more-about-us-btn"
                type="button"
                onClick={onNavigateToAbout}
                className="group inline-flex items-center gap-3.5 text-xs uppercase tracking-[0.24em] text-[#413C23] font-medium transition-all hover:text-[#8F896D] cursor-pointer select-none"
              >
                <div className="relative flex items-center">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-[#413C23]/60 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:border-[#413C23] group-hover:bg-[#F2EFDB] shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-[#413C23] transition-transform duration-300 group-hover:scale-125" />
                  </div>
                  <span className="w-6 sm:w-8 h-px bg-[#413C23]/60 -ml-1 transition-all duration-300 group-hover:w-12 group-hover:bg-[#413C23]" />
                </div>
                <span className="font-serif-display text-xs sm:text-sm tracking-[0.22em] text-[#413C23] font-normal">
                  More About Us
                </span>
              </button>
            </div>
          </div>

          {/* Bottom Cascading Inverted Arch (U-Shape) Vignettes: Generous sizing filling the left column */}
          <div className="pt-4 sm:pt-6 w-full">
            <div className="flex items-start">
              {/* Vignette 1: Sculptural Drop Earrings */}
              <div className="w-32 sm:w-40 md:w-48 aspect-[3/4] rounded-t-none rounded-b-full overflow-hidden bg-[#F2EFDB] border border-[#D8D2C2] shadow-sm relative z-10 transition-transform duration-500 hover:scale-105 hover:z-40 shrink-0">
                <img
                  src={vignette1Img}
                  alt="Avirena sculptural earrings on silk"
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Vignette 2: Jewelry Flatlay (Overlapping + Stepped Down) */}
              <div className="w-36 sm:w-44 md:w-52 aspect-[3/4] rounded-t-none rounded-b-full overflow-hidden bg-[#F2EFDB] border border-[#D8D2C2] shadow-md -ml-8 sm:-ml-12 md:-ml-14 mt-6 sm:mt-8 relative z-20 transition-transform duration-500 hover:scale-105 hover:z-40 shrink-0">
                <img
                  src={vignette2Img}
                  alt="Avirena handcrafted gold rings and necklaces"
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Vignette 3: Ribbed Gold Hoops (Overlapping + Stepped Down Further) */}
              <div className="w-32 sm:w-40 md:w-48 aspect-[3/4] rounded-t-none rounded-b-full overflow-hidden bg-[#F2EFDB] border border-[#D8D2C2] shadow-sm -ml-8 sm:-ml-12 md:-ml-14 mt-12 sm:mt-16 relative z-30 transition-transform duration-500 hover:scale-105 hover:z-40 shrink-0">
                <img
                  src={vignette3Img}
                  alt="Avirena ribbed gold hoop earrings on satin"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Large Roman Arch Editorial Portrait bridging the space */}
        <div className="lg:col-span-5 xl:col-span-5 flex justify-center lg:justify-start xl:justify-center w-full">
          <div className="w-full max-w-[440px] sm:max-w-[480px] lg:max-w-[520px] xl:max-w-[560px] aspect-[2/3] rounded-t-full rounded-b-none overflow-hidden bg-[#F2EFDB] border border-[#D8D2C2] shadow-lg relative group">
            <img
              src={heroArchImg}
              alt="Avirena editorial jewelry portrait"
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-104"
            />
            {/* Subtle inner border for luxury finish */}
            <div className="absolute inset-0 rounded-t-full rounded-b-none border border-black/5 pointer-events-none" />
          </div>
        </div>

      </div>
    </section>
  );
};
