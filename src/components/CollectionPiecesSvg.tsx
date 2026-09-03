import React from 'react';

// 1. Aurora Ring: Bezel-set emerald-cut diamond baguettes on thick gold band
export const AuroraRingSvg: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="goldGradientRing" x1="50" y1="50" x2="250" y2="250" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F9E2A8" />
        <stop offset="25%" stopColor="#DFAD53" />
        <stop offset="50%" stopColor="#FBF0CA" />
        <stop offset="75%" stopColor="#C99438" />
        <stop offset="100%" stopColor="#96651E" />
      </linearGradient>
      <linearGradient id="goldHighlight" x1="100" y1="50" x2="160" y2="250" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
        <stop offset="30%" stopColor="#F9E2A8" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#8C5C1B" stopOpacity="0.9" />
      </linearGradient>
      <linearGradient id="gemGlass" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="30%" stopColor="#F3F5F7" />
        <stop offset="70%" stopColor="#DDE4EA" />
        <stop offset="100%" stopColor="#BAC6D0" />
      </linearGradient>
      <linearGradient id="gemFacet" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#AFC0CD" stopOpacity="0.6" />
      </linearGradient>
      <filter id="ringDropShadow" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="3" dy="8" stdDeviation="7" floodColor="#7A5E2A" floodOpacity="0.22" />
      </filter>
    </defs>
    
    <g filter="url(#ringDropShadow)">
      {/* Outer Elliptical Eternity Band Profile */}
      <ellipse cx="148" cy="150" rx="46" ry="78" stroke="url(#goldGradientRing)" strokeWidth="24" strokeLinecap="round" />
      <ellipse cx="152" cy="150" rx="38" ry="72" stroke="url(#goldHighlight)" strokeWidth="4" />
      
      {/* Individual Baguette Setting Slots around the contour */}
      {/* Segment 1 */}
      <g transform="translate(102, 86) rotate(-22)">
        <rect x="0" y="0" width="22" height="15" rx="2" fill="url(#goldGradientRing)" stroke="#7A4E11" strokeWidth="1" />
        <rect x="2.5" y="2" width="17" height="11" rx="1" fill="url(#gemGlass)" stroke="#8FA4B5" strokeWidth="0.75" />
        <polygon points="4,3 18,3 15,11 7,11" fill="url(#gemFacet)" opacity="0.8" />
        <line x1="11" y1="2" x2="11" y2="13" stroke="#FFFFFF" strokeWidth="0.75" />
      </g>
      
      {/* Segment 2 */}
      <g transform="translate(94, 114) rotate(-10)">
        <rect x="0" y="0" width="22" height="16" rx="2" fill="url(#goldGradientRing)" stroke="#7A4E11" strokeWidth="1" />
        <rect x="2.5" y="2" width="17" height="12" rx="1" fill="url(#gemGlass)" stroke="#8FA4B5" strokeWidth="0.75" />
        <polygon points="4,3 18,3 15,12 7,12" fill="url(#gemFacet)" opacity="0.85" />
        <line x1="11" y1="2" x2="11" y2="14" stroke="#FFFFFF" strokeWidth="0.75" />
      </g>

      {/* Segment 3 - Center Left Face */}
      <g transform="translate(92, 142) rotate(0)">
        <rect x="0" y="0" width="23" height="17" rx="2" fill="url(#goldGradientRing)" stroke="#7A4E11" strokeWidth="1" />
        <rect x="2.5" y="2.5" width="18" height="12" rx="1" fill="url(#gemGlass)" stroke="#8FA4B5" strokeWidth="0.75" />
        <polygon points="4,4 19,4 16,13 7,13" fill="url(#gemFacet)" opacity="0.9" />
        <line x1="11.5" y1="2.5" x2="11.5" y2="14.5" stroke="#FFFFFF" strokeWidth="1" />
      </g>

      {/* Segment 4 */}
      <g transform="translate(96, 172) rotate(10)">
        <rect x="0" y="0" width="22" height="16" rx="2" fill="url(#goldGradientRing)" stroke="#7A4E11" strokeWidth="1" />
        <rect x="2.5" y="2" width="17" height="12" rx="1" fill="url(#gemGlass)" stroke="#8FA4B5" strokeWidth="0.75" />
        <polygon points="4,3 18,3 15,12 7,12" fill="url(#gemFacet)" opacity="0.8" />
        <line x1="11" y1="2" x2="11" y2="14" stroke="#FFFFFF" strokeWidth="0.75" />
      </g>

      {/* Segment 5 */}
      <g transform="translate(106, 200) rotate(22)">
        <rect x="0" y="0" width="22" height="15" rx="2" fill="url(#goldGradientRing)" stroke="#7A4E11" strokeWidth="1" />
        <rect x="2.5" y="2" width="17" height="11" rx="1" fill="url(#gemGlass)" stroke="#8FA4B5" strokeWidth="0.75" />
        <polygon points="4,3 18,3 15,11 7,11" fill="url(#gemFacet)" opacity="0.75" />
        <line x1="11" y1="2" x2="11" y2="13" stroke="#FFFFFF" strokeWidth="0.75" />
      </g>

      {/* Segment 6 - Top Rim */}
      <g transform="translate(126, 68) rotate(-42)">
        <rect x="0" y="0" width="21" height="14" rx="2" fill="url(#goldGradientRing)" stroke="#7A4E11" strokeWidth="0.75" />
        <rect x="2" y="2" width="17" height="10" rx="1" fill="url(#gemGlass)" stroke="#8FA4B5" strokeWidth="0.5" />
      </g>

      {/* Segment 7 - Bottom Rim */}
      <g transform="translate(126, 222) rotate(42)">
        <rect x="0" y="0" width="21" height="14" rx="2" fill="url(#goldGradientRing)" stroke="#7A4E11" strokeWidth="0.75" />
        <rect x="2" y="2" width="17" height="10" rx="1" fill="url(#gemGlass)" stroke="#8FA4B5" strokeWidth="0.5" />
      </g>
    </g>
  </svg>
);

// 2. Solis Necklace: Dual fine gold chains meeting at a micropavé cylinder with dual tassel drops & crystals
export const SolisNecklaceSvg: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="goldChains" x1="50" y1="20" x2="250" y2="280" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F9E2A8" />
        <stop offset="50%" stopColor="#DFA642" />
        <stop offset="100%" stopColor="#96651E" />
      </linearGradient>
      <filter id="necklaceDrop" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="2" dy="5" stdDeviation="5" floodColor="#7A5E2A" floodOpacity="0.2" />
      </filter>
    </defs>
    
    <g filter="url(#necklaceDrop)">
      {/* Dual Left Chains coming from top */}
      <path d="M72 15 L144 148" stroke="url(#goldChains)" strokeWidth="2.5" strokeDasharray="3 1.5" />
      <path d="M78 15 L146 148" stroke="url(#goldChains)" strokeWidth="2" strokeDasharray="2 1" />

      {/* Dual Right Chains coming from top */}
      <path d="M228 15 L156 148" stroke="url(#goldChains)" strokeWidth="2.5" strokeDasharray="3 1.5" />
      <path d="M222 15 L154 148" stroke="url(#goldChains)" strokeWidth="2" strokeDasharray="2 1" />

      {/* Central Micropavé Gold Cylinder / Barrel */}
      <rect x="136" y="145" width="28" height="18" rx="3" fill="url(#goldChains)" stroke="#7A4E11" strokeWidth="1" />
      
      {/* Pavé crystal dots */}
      <circle cx="142" cy="149" r="1.5" fill="#FFFFFF" />
      <circle cx="146" cy="149" r="1.5" fill="#FFFFFF" />
      <circle cx="150" cy="149" r="1.5" fill="#FFFFFF" />
      <circle cx="154" cy="149" r="1.5" fill="#FFFFFF" />
      <circle cx="158" cy="149" r="1.5" fill="#FFFFFF" />
      
      <circle cx="142" cy="154" r="1.5" fill="#FFFFFF" />
      <circle cx="146" cy="154" r="1.5" fill="#FFFFFF" />
      <circle cx="150" cy="154" r="1.5" fill="#FFFFFF" />
      <circle cx="154" cy="154" r="1.5" fill="#FFFFFF" />
      <circle cx="158" cy="154" r="1.5" fill="#FFFFFF" />

      <circle cx="142" cy="159" r="1.5" fill="#FFFFFF" />
      <circle cx="146" cy="159" r="1.5" fill="#FFFFFF" />
      <circle cx="150" cy="159" r="1.5" fill="#FFFFFF" />
      <circle cx="154" cy="159" r="1.5" fill="#FFFFFF" />
      <circle cx="158" cy="159" r="1.5" fill="#FFFFFF" />

      {/* Left Hanging Tassel Chain */}
      <line x1="144" y1="163" x2="144" y2="238" stroke="url(#goldChains)" strokeWidth="2" strokeDasharray="2 1" />
      {/* Left Gold Cylinder Cap */}
      <rect x="141.5" y="235" width="5" height="18" rx="1.5" fill="url(#goldChains)" stroke="#7A4E11" strokeWidth="0.75" />
      {/* Left Crystal Droplet */}
      <circle cx="144" cy="258" r="4.5" fill="#FFFFFF" stroke="#8FA4B5" strokeWidth="1" />
      <circle cx="142.5" cy="256.5" r="1.5" fill="#FFFFFF" />

      {/* Right Hanging Tassel Chain */}
      <line x1="156" y1="163" x2="156" y2="238" stroke="url(#goldChains)" strokeWidth="2" strokeDasharray="2 1" />
      {/* Right Gold Cylinder Cap */}
      <rect x="153.5" y="235" width="5" height="18" rx="1.5" fill="url(#goldChains)" stroke="#7A4E11" strokeWidth="0.75" />
      {/* Right Crystal Droplet */}
      <circle cx="156" cy="258" r="4.5" fill="#FFFFFF" stroke="#8FA4B5" strokeWidth="1" />
      <circle cx="154.5" cy="256.5" r="1.5" fill="#FFFFFF" />
    </g>
  </svg>
);

// 3. Linea Hoops / Studs: Rounded square stud with grid quadrants (one diamond pavé quadrant) and side profile post
export const LineaHoopsSvg: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="goldStud" x1="100" y1="100" x2="220" y2="220" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F9E2A8" />
        <stop offset="35%" stopColor="#DFAD53" />
        <stop offset="70%" stopColor="#FBF0CA" />
        <stop offset="100%" stopColor="#96651E" />
      </linearGradient>
      <filter id="studShadow" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="3" dy="6" stdDeviation="6" floodColor="#7A5E2A" floodOpacity="0.22" />
      </filter>
    </defs>
    
    <g filter="url(#studShadow)">
      {/* Front Facing Stud (Left) */}
      <rect x="96" y="116" width="56" height="56" rx="10" fill="url(#goldStud)" stroke="#7A4E11" strokeWidth="1.5" />
      
      {/* Cross Section Dividers */}
      <line x1="96" y1="144" x2="152" y2="144" stroke="#684210" strokeWidth="1.5" />
      <line x1="124" y1="116" x2="124" y2="172" stroke="#684210" strokeWidth="1.5" />

      {/* Top Left Quadrant - Pavé Diamonds Grid */}
      <rect x="98" y="118" width="24" height="24" rx="8" fill="#EBF0F5" stroke="#90A1AF" strokeWidth="0.75" />
      <circle cx="104" cy="124" r="2" fill="#FFFFFF" stroke="#8799A8" strokeWidth="0.5" />
      <circle cx="110" cy="124" r="2" fill="#FFFFFF" stroke="#8799A8" strokeWidth="0.5" />
      <circle cx="116" cy="124" r="2" fill="#FFFFFF" stroke="#8799A8" strokeWidth="0.5" />
      
      <circle cx="104" cy="130" r="2" fill="#FFFFFF" stroke="#8799A8" strokeWidth="0.5" />
      <circle cx="110" cy="130" r="2" fill="#FFFFFF" stroke="#8799A8" strokeWidth="0.5" />
      <circle cx="116" cy="130" r="2" fill="#FFFFFF" stroke="#8799A8" strokeWidth="0.5" />

      <circle cx="104" cy="136" r="2" fill="#FFFFFF" stroke="#8799A8" strokeWidth="0.5" />
      <circle cx="110" cy="136" r="2" fill="#FFFFFF" stroke="#8799A8" strokeWidth="0.5" />
      <circle cx="116" cy="136" r="2" fill="#FFFFFF" stroke="#8799A8" strokeWidth="0.5" />

      {/* Polished Gold Quadrants Highlights */}
      <path d="M126 120 L146 120 A6 6 0 0 1 150 126 L150 142 L126 142 Z" fill="#FCEBC2" opacity="0.6" />
      <path d="M98 146 L122 146 L122 170 L104 170 A6 6 0 0 1 98 164 Z" fill="#E6AE4A" opacity="0.4" />
      <path d="M126 146 L150 146 L150 164 A6 6 0 0 1 144 170 L126 170 Z" fill="#FDF4DA" opacity="0.7" />

      {/* Side Profile View of Matching Stud (Right) */}
      <g transform="translate(170, 116)">
        {/* Curved front face edge */}
        <rect x="0" y="0" width="16" height="56" rx="6" fill="url(#goldStud)" stroke="#7A4E11" strokeWidth="1.5" />
        {/* Top pave slice edge */}
        <rect x="1" y="2" width="14" height="24" rx="4" fill="#DDE4EA" stroke="#90A1AF" strokeWidth="0.5" />
        <circle cx="5" cy="8" r="1.5" fill="#FFFFFF" />
        <circle cx="11" cy="8" r="1.5" fill="#FFFFFF" />
        <circle cx="8" cy="14" r="1.5" fill="#FFFFFF" />

        {/* Earring Post */}
        <line x1="16" y1="28" x2="52" y2="28" stroke="#DFA642" strokeWidth="2" />
        
        {/* Earring Butterfly Scroll Backing */}
        <path d="M46 14 C46 22 41 28 46 28 C41 28 46 34 46 42" stroke="#A67324" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="48" cy="28" r="3" fill="#DFA642" stroke="#7A4E11" strokeWidth="1" />
      </g>
    </g>
  </svg>
);

// 4. Forma Bracelet: Clean oval dual-wire contour bangle with sleek top rectangular clasp plate
export const FormaBraceletSvg: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="goldBangle" x1="60" y1="60" x2="240" y2="240" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F9E2A8" />
        <stop offset="30%" stopColor="#E2B156" />
        <stop offset="60%" stopColor="#FDF4DA" />
        <stop offset="85%" stopColor="#C99438" />
        <stop offset="100%" stopColor="#8C5C1B" />
      </linearGradient>
      <filter id="bangleShadow" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="4" dy="8" stdDeviation="7" floodColor="#7A5E2A" floodOpacity="0.22" />
      </filter>
    </defs>
    
    <g filter="url(#bangleShadow)">
      {/* Tilted Dynamic Bangle Angle */}
      <g transform="translate(150, 150) rotate(-35) translate(-150, -150)">
        {/* Outer Wire Ring */}
        <ellipse cx="150" cy="150" rx="82" ry="52" stroke="url(#goldBangle)" strokeWidth="6" />
        
        {/* Inner Wire Ring */}
        <ellipse cx="150" cy="150" rx="72" ry="44" stroke="url(#goldBangle)" strokeWidth="5.5" />
        
        {/* Highlight sheen along top curved wire */}
        <path d="M78 135 C95 105 150 95 210 120" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.75" />

        {/* Minimalist Rectangular Top Locking Clasp Plate */}
        <g transform="translate(132, 94)">
          <rect x="0" y="0" width="36" height="20" rx="3" fill="url(#goldBangle)" stroke="#7A4E11" strokeWidth="1.2" />
          <line x1="0" y1="10" x2="36" y2="10" stroke="#684210" strokeWidth="0.5" opacity="0.4" />
          <circle cx="18" cy="10" r="1.5" fill="#5A3709" />
          <rect x="2" y="2" width="32" height="4" rx="1" fill="#FFFFFF" opacity="0.45" />
        </g>
      </g>
    </g>
  </svg>
);

// 5. Echo Brooch: Minimal vertical solid gold bar with prong-set square cushion diamond atop
export const EchoBroochSvg: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="goldBar" x1="130" y1="110" x2="170" y2="230" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F9E2A8" />
        <stop offset="35%" stopColor="#DFAD53" />
        <stop offset="70%" stopColor="#FDF4DA" />
        <stop offset="100%" stopColor="#96651E" />
      </linearGradient>
      <linearGradient id="diamondFacet" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="30%" stopColor="#F4F7F9" />
        <stop offset="70%" stopColor="#D5DFE6" />
        <stop offset="100%" stopColor="#A8BAC6" />
      </linearGradient>
      <filter id="broochShadow" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="3" dy="6" stdDeviation="6" floodColor="#7A5E2A" floodOpacity="0.22" />
      </filter>
    </defs>
    
    <g filter="url(#broochShadow)">
      {/* Square Princess / Cushion Cut Diamond atop */}
      <g transform="translate(138, 114)">
        {/* 4 Corner Gold Prongs */}
        <circle cx="-1" cy="-1" r="2" fill="url(#goldBar)" stroke="#7A4E11" strokeWidth="0.5" />
        <circle cx="25" cy="-1" r="2" fill="url(#goldBar)" stroke="#7A4E11" strokeWidth="0.5" />
        <circle cx="-1" cy="25" r="2" fill="url(#goldBar)" stroke="#7A4E11" strokeWidth="0.5" />
        <circle cx="25" cy="25" r="2" fill="url(#goldBar)" stroke="#7A4E11" strokeWidth="0.5" />

        {/* Diamond Body */}
        <rect x="0" y="0" width="24" height="24" rx="2" fill="url(#diamondFacet)" stroke="#90A1AF" strokeWidth="1" />
        
        {/* Facet Star Refraction Lines */}
        <polygon points="12,2 22,12 12,22 2,12" fill="#FFFFFF" opacity="0.8" />
        <line x1="0" y1="0" x2="24" y2="24" stroke="#7E93A2" strokeWidth="0.5" />
        <line x1="24" y1="0" x2="0" y2="24" stroke="#7E93A2" strokeWidth="0.5" />
        <polygon points="12,6 18,12 12,18 6,12" fill="#E8F1F7" />
        <circle cx="10" cy="8" r="1.5" fill="#FFFFFF" />
      </g>

      {/* Vertical Sleek Gold Bar Stem */}
      <rect x="143" y="142" width="14" height="68" rx="2" fill="url(#goldBar)" stroke="#7A4E11" strokeWidth="1.2" />
      
      {/* Light sheen along bar stem */}
      <line x1="146" y1="144" x2="146" y2="208" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.75" strokeLinecap="round" />
    </g>
  </svg>
);
