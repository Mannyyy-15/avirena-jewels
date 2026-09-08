import React from 'react';
import { motion } from 'motion/react';

interface HeroBaroquePearlRingProps {
  className?: string;
  onClick?: () => void;
}

export const HeroBaroquePearlRing: React.FC<HeroBaroquePearlRingProps> = ({
  className = 'w-[145px] xs:w-[185px] sm:w-[250px] md:w-[320px] lg:w-[400px] xl:w-[460px] 2xl:w-[500px]',
  onClick,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: 1.0,
          ease: [0.16, 1, 0.3, 1],
        },
      }}
      className={`relative cursor-pointer select-none flex items-center justify-center pointer-events-auto filter drop-shadow-[0_20px_35px_rgba(40,25,10,0.22)] ${className}`}
      onClick={onClick}
    >
      {/* Gentle Floating Motion */}
      <motion.div
        animate={{
          y: [-7, 7, -7],
          rotate: [-1, 1, -1],
        }}
        transition={{
          repeat: Infinity,
          duration: 6,
          ease: 'easeInOut',
        }}
        className="w-full relative flex items-center justify-center"
      >
        {/* Measured as the real mobile LCP element. The PNG is 1.29MB and cost
            ~5s of resource load under throttled mobile; the WebP is 109KB, a
            92% saving. PNG stays as the fallback source. Explicit dimensions
            reserve layout space so the swap cannot shift the page. */}
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
      </motion.div>
    </motion.div>
  );
};
