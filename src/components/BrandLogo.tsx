import React from 'react';
import { AvirenaLogo } from './AvirenaLogo';

interface BrandLogoProps {
  variant?: 'primary' | 'monogram' | 'submark' | 'icon' | 'secondary' | 'stacked';
  className?: string;
  theme?: 'dark' | 'light' | 'gold';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'primary',
  className = '',
  theme = 'dark',
  size = 'md',
}) => {
  // 1. PRIMARY LOGO: AVIRENA with Gold Jewelry Thread & Garnet Drop Bead
  if (variant === 'primary') {
    return (
      <AvirenaLogo
        size={size}
        theme={theme}
        className={className}
        showThread={true}
      />
    );
  }

  // 2. SECONDARY LOGO: AVIRENA with "JEWELLERY" Subtitle
  if (variant === 'secondary') {
    return (
      <div className={`inline-flex flex-col items-center justify-center select-none ${className}`}>
        <AvirenaLogo size={size} theme={theme} showThread={true} />
        <span className="text-[9px] sm:text-[10px] tracking-[0.35em] font-sans-body uppercase font-medium text-[#D4AF37] -mt-1 sm:-mt-2">
          Jewellery
        </span>
      </div>
    );
  }

  // 3. MONOGRAM / SUBMARK: Circular Gold Badge with Intertwined 'AV'
  if (variant === 'monogram' || variant === 'submark') {
    const sizeMap = {
      xs: 'w-6 h-6',
      sm: 'w-8 h-8',
      md: 'w-11 h-11',
      lg: 'w-16 h-16',
      xl: 'w-24 h-24',
    };

    return (
      <div className={`relative inline-flex items-center justify-center rounded-full overflow-hidden select-none ${sizeMap[size]} ${className}`}>
        <img
          src="/favicon.png"
          alt="AV Monogram"
          className={`w-full h-full object-contain ${theme === 'light' ? 'brightness-0 invert' : 'mix-blend-multiply'}`}
          loading="eager"
        />
      </div>
    );
  }

  // 4. ICON / SPARKLE SHINE: 4-Point Luxury Star
  if (variant === 'icon') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-4 h-4 text-[#D4AF37] ${className}`}
      >
        <path
          d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  // 5. STACKED VARIANT
  return (
    <div className={`flex flex-col items-center text-center group ${className}`}>
      <BrandLogo variant="monogram" size={size} theme={theme} className="mb-2" />
      <AvirenaLogo size="sm" theme={theme} showThread={true} />
    </div>
  );
};

export { AvirenaLogo };
