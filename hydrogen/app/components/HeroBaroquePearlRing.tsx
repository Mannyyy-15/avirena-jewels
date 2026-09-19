import React from 'react';

interface HeroBaroquePearlRingProps {
  className?: string;
  onClick?: () => void;
}

export const HeroBaroquePearlRing: React.FC<HeroBaroquePearlRingProps> = ({
  className = 'w-[145px] xs:w-[185px] sm:w-[250px] md:w-[320px] lg:w-[400px] xl:w-[460px] 2xl:w-[500px]',
  onClick,
}) => {
  return (
    <div
      className={`relative cursor-pointer select-none flex items-center justify-center pointer-events-auto filter drop-shadow-[0_20px_35px_rgba(40,25,10,0.22)] ${className}`}
      onClick={onClick}
    >
      {/* Gentle Floating Motion via Pure CSS to guarantee 0 CLS and 0 hydration cost */}
      <div className="w-full relative flex items-center justify-center animate-hero-float">
        <picture>
          <source srcSet="/hero.webp" type="image/webp" />
          <img
            src="/hero.png"
            alt="Avirena Signature Baroque Pearl Ring"
            width={1024}
            height={1024}
            loading="eager"
            fetchPriority="high"
            decoding="sync"
            className="w-full h-auto object-contain max-h-[36vh] sm:max-h-[42vh] md:max-h-[46vh] pointer-events-none drop-shadow-md select-none"
          />
        </picture>
      </div>
    </div>
  );
};
