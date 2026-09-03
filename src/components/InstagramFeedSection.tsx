import React from 'react';
import { Instagram, ArrowUpRight } from 'lucide-react';

interface InstagramFeedSectionProps {
  instagramHandle?: string;
  instagramUrl?: string;
}

export const InstagramFeedSection: React.FC<InstagramFeedSectionProps> = ({
  instagramHandle = '@avirena.jewels',
  instagramUrl = 'https://instagram.com/avirena.jewels',
}) => {
  const images = [
    {
      id: 'ig-1',
      src: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=90',
      alt: 'Avirena Handcrafted Gold Rings Stack',
      aspect: 'aspect-[4/5]',
      offsetClass: 'sm:-translate-y-4',
    },
    {
      id: 'ig-2',
      src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=90',
      alt: 'Avirena Solitaire Signet Ring Editorial',
      aspect: 'aspect-[3/4]',
      offsetClass: 'sm:translate-y-8 z-10',
      hasHandle: true,
    },
    {
      id: 'ig-3',
      src: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=90',
      alt: 'Avirena Sunlit Gold Cuff and Minimal Rings',
      aspect: 'aspect-[4/5]',
      offsetClass: 'sm:-translate-y-6',
    },
    {
      id: 'ig-4',
      src: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=90',
      alt: 'Avirena Sculptural Earrings and Layered Chains',
      aspect: 'aspect-[3/4]',
      offsetClass: 'sm:translate-y-4',
    },
  ];

  return (
    <section className="relative w-full bg-[#E7E4D5] py-16 sm:py-24 px-4 sm:px-8 lg:px-12 xl:px-16 overflow-hidden border-t border-[#D8D2C2] select-none">
      
      {/* Background Abstract Continuous Fluid Wire Curves */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-40 stroke-[#8F896D]"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 1440 600"
        preserveAspectRatio="none"
      >
        <path
          d="M-50 180 C 300 20, 700 240, 1500 50"
          strokeWidth="1"
          strokeDasharray="4 2"
        />
        <path
          d="M-100 80 C 200 120, 800 480, 1550 560"
          strokeWidth="1.25"
        />
        <path
          d="M0 520 C 500 350, 900 100, 1500 280"
          strokeWidth="0.8"
          strokeDasharray="6 3"
        />
      </svg>

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Header: Line + FOLLOW US ON INSTAGRAM */}
        <div className="flex items-center gap-4 sm:gap-6 mb-12 sm:mb-16">
          <div className="w-12 sm:w-20 md:w-28 h-[1px] bg-[#413C23]/60" />
          <h2 className="font-serif-display text-2xl sm:text-4xl md:text-5xl lg:text-5xl tracking-[0.12em] font-light text-[#413C23] uppercase">
            Follow Us On Instagram
          </h2>
        </div>

        {/* 4-Image Staggered / Overlapping Collage Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5 items-center">
          {images.map((img) => (
            <a
              key={img.id}
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative block overflow-hidden bg-[#D8D1C0] shadow-sm transition-all duration-500 ease-out hover:shadow-xl hover:scale-[1.02] ${img.aspect} ${img.offsetClass}`}
            >
              {/* Product / Editorial Image */}
              <img
                src={img.src}
                alt={img.alt}
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-full object-cover object-center filter contrast-[1.02] group-hover:scale-106 transition-transform duration-700 ease-out"
              />

              {/* Dark Hover Tint + Instagram Icon Overlay */}
              <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-white/90 text-[#413C23] flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-md">
                  <Instagram className="w-5 h-5 stroke-[1.5]" />
                </div>
              </div>

              {/* Optional Instagram Handle Label on Featured Center Image */}
              {img.hasHandle && (
                <div className="absolute bottom-3 inset-x-0 text-center pointer-events-none z-10">
                  <span className="font-serif italic text-sm sm:text-base md:text-lg text-[#FAF8F5] drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] tracking-wide">
                    {instagramHandle}
                  </span>
                </div>
              )}
            </a>
          ))}
        </div>

        {/* Bottom Centered Direct Link */}
        <div className="text-center mt-12 sm:mt-16">
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-serif italic tracking-widest text-[#413C23] hover:text-[#8F896D] transition-colors border-b border-[#413C23]/30 pb-0.5"
          >
            <span>Explore atelier stories {instagramHandle}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};
