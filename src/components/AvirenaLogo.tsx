import React from 'react';

interface AvirenaLogoProps {
  className?: string;
  theme?: 'dark' | 'light' | 'gold' | 'monochrome';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  showThread?: boolean;
}

export const AvirenaLogo: React.FC<AvirenaLogoProps> = ({
  className = '',
  theme = 'dark',
  size = 'md',
}) => {
  // Size height presets
  const sizeClasses = {
    xs: 'h-6 sm:h-7',
    sm: 'h-8 sm:h-10',
    md: 'h-10 sm:h-14',
    lg: 'h-14 sm:h-20',
    xl: 'h-20 sm:h-28',
    custom: '',
  };

  const heightClass = size !== 'custom' ? sizeClasses[size] : '';

  // Theme styling for the actual logo image
  const themeFilterClass =
    theme === 'light'
      ? 'brightness-0 invert'
      : 'mix-blend-multiply';

  return (
    <div className={`inline-flex items-center justify-center select-none ${heightClass} ${className}`}>
      <img
        src="/logo.png"
        alt="AVIRENA"
        className={`h-full w-auto max-w-full object-contain ${themeFilterClass}`}
        loading="eager"
      />
    </div>
  );
};
