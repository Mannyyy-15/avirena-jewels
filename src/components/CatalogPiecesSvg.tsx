import React from 'react';

// Common Gradients & Filters
const SvgDefs: React.FC = () => (
  <defs>
    {/* Warm 18k Yellow Gold Gradient */}
    <linearGradient id="catGoldGrad" x1="20" y1="20" x2="280" y2="280" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stopColor="#FDE6A6" />
      <stop offset="25%" stopColor="#E5B24D" />
      <stop offset="50%" stopColor="#FFF2CB" />
      <stop offset="75%" stopColor="#C99438" />
      <stop offset="100%" stopColor="#8C5C1B" />
    </linearGradient>

    {/* Radiant Molten Gold */}
    <linearGradient id="catMoltenGold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#FFF4D0" />
      <stop offset="30%" stopColor="#E8B958" />
      <stop offset="65%" stopColor="#C68E2F" />
      <stop offset="100%" stopColor="#8F5E18" />
    </linearGradient>

    {/* 925 Sterling Silver / Mirror Rhodium Gradient */}
    <linearGradient id="catSilverGrad" x1="30" y1="30" x2="270" y2="270" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stopColor="#FFFFFF" />
      <stop offset="25%" stopColor="#DDE4EA" />
      <stop offset="50%" stopColor="#F8FAFC" />
      <stop offset="75%" stopColor="#B4C2CD" />
      <stop offset="100%" stopColor="#7E93A2" />
    </linearGradient>

    {/* Lustrous Baroque Pearl Gradient */}
    <linearGradient id="catPearlGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#FFFFFF" />
      <stop offset="40%" stopColor="#F9F6F0" />
      <stop offset="70%" stopColor="#EFE8DD" />
      <stop offset="90%" stopColor="#DFD5C7" />
      <stop offset="100%" stopColor="#C8BCAB" />
    </linearGradient>

    {/* Gem Crystal Shimmer */}
    <linearGradient id="catGemGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#FFFFFF" />
      <stop offset="35%" stopColor="#F0F4F8" />
      <stop offset="70%" stopColor="#D5E1EA" />
      <stop offset="100%" stopColor="#9FB4C3" />
    </linearGradient>

    {/* Realistic Soft Ambient Drop Shadow */}
    <filter id="catShadow" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="2" dy="6" stdDeviation="6" floodColor="#4A3F2C" floodOpacity="0.16" />
    </filter>
  </defs>
);

// 1. Lucid Studs (Pair of two organic molten gold swirl/donut earrings)
export const LucidStudsSvg: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <SvgDefs />
    <g filter="url(#catShadow)">
      {/* Left Stud */}
      <g transform="translate(85, 150)">
        <ellipse cx="0" cy="0" rx="42" ry="44" fill="url(#catGoldGrad)" stroke="#7A4E11" strokeWidth="1" />
        <ellipse cx="2" cy="-2" rx="18" ry="20" fill="#F3EFE6" stroke="#8C5C1B" strokeWidth="1.5" />
        {/* Molten ripple creases */}
        <path d="M-30 -15 C-20 -32 15 -35 32 -18" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
        <path d="M-28 20 C-10 36 20 34 30 18" stroke="#7A4E11" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        <circle cx="20" cy="-20" r="3" fill="#FFFFFF" opacity="0.9" />
      </g>

      {/* Right Stud */}
      <g transform="translate(215, 150)">
        <ellipse cx="0" cy="0" rx="42" ry="44" fill="url(#catGoldGrad)" stroke="#7A4E11" strokeWidth="1" />
        <ellipse cx="-2" cy="-2" rx="18" ry="20" fill="#F3EFE6" stroke="#8C5C1B" strokeWidth="1.5" />
        {/* Molten ripple creases */}
        <path d="M-32 -18 C-15 -35 20 -32 30 -15" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
        <path d="M-30 18 C-20 34 10 36 28 20" stroke="#7A4E11" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        <circle cx="-20" cy="-20" r="3" fill="#FFFFFF" opacity="0.9" />
      </g>
    </g>
  </svg>
);

// 2. Solid Wave Brooch (Fluid Sculptural Sterling Silver Pin)
export const SolidWaveBroochSvg: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <SvgDefs />
    <g filter="url(#catShadow)" transform="translate(150, 150) rotate(-15) translate(-150, -150)">
      {/* Back Pin Needle */}
      <line x1="80" y1="170" x2="220" y2="135" stroke="#8FA4B5" strokeWidth="2" strokeLinecap="round" />
      <circle cx="220" cy="135" r="4" fill="#B4C2CD" stroke="#687B8A" strokeWidth="1" />

      {/* Volumetric Smooth Fluid Silver Wave Body */}
      <path
        d="M60 160 C75 110 130 100 180 115 C230 130 250 165 225 185 C200 205 150 180 120 165 C95 150 75 180 60 160 Z"
        fill="url(#catSilverGrad)"
        stroke="#7A8C9A"
        strokeWidth="1.5"
      />
      {/* Mirror Sheen Edge Reflection */}
      <path
        d="M75 145 C100 115 145 110 185 122 C225 135 240 160 220 178"
        stroke="#FFFFFF"
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M130 165 C160 180 195 190 215 182"
        stroke="#5A6D7C"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
    </g>
  </svg>
);

// 3. Ornate Scroll Pendant (Intricate Italian Gold Filigree Medallion on Fine Chain)
export const OrnateScrollPendantSvg: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <SvgDefs />
    <g filter="url(#catShadow)">
      {/* Fine Suspended Chain */}
      <path d="M120 20 L150 95 L180 20" stroke="url(#catGoldGrad)" strokeWidth="2" strokeDasharray="3 1.5" />
      
      {/* Top Bail Connector with Small Beads */}
      <circle cx="150" cy="98" r="5" fill="url(#catGoldGrad)" stroke="#7A4E11" strokeWidth="1" />
      <circle cx="150" cy="80" r="3" fill="url(#catGoldGrad)" />
      <circle cx="136" cy="55" r="2.5" fill="url(#catGoldGrad)" />
      <circle cx="164" cy="55" r="2.5" fill="url(#catGoldGrad)" />

      {/* Ornate Medallion Outer Teardrop Scroll Frame */}
      <g transform="translate(150, 185)">
        <path
          d="M0 -75 C45 -40 68 0 52 45 C38 82 -38 82 -52 45 C-68 0 -45 -40 0 -75 Z"
          fill="none"
          stroke="url(#catGoldGrad)"
          strokeWidth="6"
        />
        {/* Filigree Internal Scrollwork Spirals */}
        <path
          d="M0 -55 C25 -20 40 10 25 35 C12 55 -12 55 -25 35 C-40 10 -25 -20 0 -55 Z"
          fill="none"
          stroke="url(#catGoldGrad)"
          strokeWidth="3.5"
        />
        <circle cx="0" cy="0" r="14" fill="url(#catGoldGrad)" stroke="#7A4E11" strokeWidth="1" />
        <circle cx="0" cy="0" r="6" fill="#FFF4D0" />
        
        {/* Micro Scroll Tendrils */}
        <path d="M-15 15 C-28 28 -10 40 0 28 C10 40 28 28 15 15" stroke="url(#catGoldGrad)" strokeWidth="3" />
        <path d="M-22 -10 C-38 5 -20 20 -10 10" stroke="url(#catGoldGrad)" strokeWidth="2.5" />
        <path d="M22 -10 C38 5 20 20 10 10" stroke="url(#catGoldGrad)" strokeWidth="2.5" />
        
        {/* Highlight Accent */}
        <path d="M-30 -30 C-10 -55 0 -62 0 -62" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
      </g>
    </g>
  </svg>
);

// 4. Two Pearl Cuff (Minimal Open Gold Wire Bangle with Dual Pearls)
export const TwoPearlCuffSvg: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <SvgDefs />
    <g filter="url(#catShadow)" transform="translate(150, 150) rotate(-15) translate(-150, -150)">
      {/* Curved Open Wire Arm */}
      <path
        d="M95 170 C70 120 120 75 185 85 C240 95 260 150 230 185 C210 210 165 220 135 210 C115 202 105 188 105 180"
        fill="none"
        stroke="url(#catGoldGrad)"
        strokeWidth="6.5"
        strokeLinecap="round"
      />
      {/* Gold Highlight Streak */}
      <path
        d="M125 90 C165 85 220 100 235 140"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* Left Pearl Accent at opening tip */}
      <g transform="translate(95, 170)">
        <circle cx="0" cy="0" r="10" fill="url(#catPearlGrad)" stroke="#C8BCAB" strokeWidth="1" />
        <ellipse cx="-3" cy="-3" rx="4" ry="2.5" fill="#FFFFFF" opacity="0.9" />
        {/* Gold Cap */}
        <rect x="-4" y="-3" width="8" height="6" rx="2" fill="url(#catGoldGrad)" transform="rotate(30)" />
      </g>

      {/* Right Pearl Accent at opening tip */}
      <g transform="translate(205, 195)">
        <circle cx="0" cy="0" r="10" fill="url(#catPearlGrad)" stroke="#C8BCAB" strokeWidth="1" />
        <ellipse cx="-3" cy="-3" rx="4" ry="2.5" fill="#FFFFFF" opacity="0.9" />
        {/* Gold Cap */}
        <rect x="-4" y="-3" width="8" height="6" rx="2" fill="url(#catGoldGrad)" transform="rotate(-30)" />
      </g>
    </g>
  </svg>
);

// 5. Twin Hoop Earrings (Pair of Silver Ribbed Multi-Tier Oval Huggies)
export const TwinHoopEarringsSvg: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <SvgDefs />
    <g filter="url(#catShadow)">
      {/* Left Ribbed Hoop */}
      <g transform="translate(95, 145)">
        {/* Top Post / Hinge */}
        <rect x="-6" y="-56" width="12" height="12" rx="2" fill="url(#catSilverGrad)" stroke="#7A8C9A" strokeWidth="0.75" />
        <line x1="-12" y1="-50" x2="12" y2="-50" stroke="#7A8C9A" strokeWidth="2" />
        {/* Layer 1 Outer Oval */}
        <ellipse cx="0" cy="0" rx="38" ry="48" fill="none" stroke="url(#catSilverGrad)" strokeWidth="6" />
        {/* Layer 2 Mid Oval */}
        <ellipse cx="0" cy="0" rx="28" ry="38" fill="none" stroke="url(#catSilverGrad)" strokeWidth="5" />
        {/* Layer 3 Inner Oval */}
        <ellipse cx="0" cy="0" rx="18" ry="26" fill="none" stroke="url(#catSilverGrad)" strokeWidth="4.5" />
        {/* Highlights */}
        <path d="M-28 -20 C-36 0 -36 20 -28 35" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      </g>

      {/* Right Ribbed Hoop */}
      <g transform="translate(205, 145)">
        {/* Top Post / Hinge */}
        <rect x="-6" y="-56" width="12" height="12" rx="2" fill="url(#catSilverGrad)" stroke="#7A8C9A" strokeWidth="0.75" />
        <line x1="-12" y1="-50" x2="12" y2="-50" stroke="#7A8C9A" strokeWidth="2" />
        {/* Layer 1 Outer Oval */}
        <ellipse cx="0" cy="0" rx="38" ry="48" fill="none" stroke="url(#catSilverGrad)" strokeWidth="6" />
        {/* Layer 2 Mid Oval */}
        <ellipse cx="0" cy="0" rx="28" ry="38" fill="none" stroke="url(#catSilverGrad)" strokeWidth="5" />
        {/* Layer 3 Inner Oval */}
        <ellipse cx="0" cy="0" rx="18" ry="26" fill="none" stroke="url(#catSilverGrad)" strokeWidth="4.5" />
        {/* Highlights */}
        <path d="M-28 -20 C-36 0 -36 20 -28 35" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      </g>
    </g>
  </svg>
);

// 6. Row Edge Ring (Wide Sunburst Etched Gold Cigar Band)
export const RowEdgeRingSvg: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <SvgDefs />
    <g filter="url(#catShadow)" transform="translate(150, 150) rotate(-10) translate(-150, -150)">
      {/* Inner Profile Hole */}
      <ellipse cx="150" cy="150" rx="72" ry="26" fill="#3D2E14" />

      {/* Main Wide Band Cylinder Silhouette */}
      <path
        d="M78 150 C78 172 110 188 150 188 C190 188 222 172 222 150 L222 135 C222 115 190 98 150 98 C110 98 78 115 78 135 Z"
        fill="url(#catGoldGrad)"
        stroke="#7A4E11"
        strokeWidth="1.5"
      />

      {/* Sunburst Star Etchings across the front face */}
      {[-45, -25, 0, 25, 45].map((offset, i) => (
        <g key={i} transform={`translate(${150 + offset}, 160)`}>
          <circle cx="0" cy="0" r="3" fill="#FFF4D0" />
          <line x1="-7" y1="0" x2="7" y2="0" stroke="#7A4E11" strokeWidth="1" />
          <line x1="0" y1="-7" x2="0" y2="7" stroke="#7A4E11" strokeWidth="1" />
          <line x1="-5" y1="-5" x2="5" y2="5" stroke="#7A4E11" strokeWidth="0.75" />
          <line x1="5" y1="-5" x2="-5" y2="5" stroke="#7A4E11" strokeWidth="0.75" />
        </g>
      ))}

      {/* Upper Rim Elliptical Lip */}
      <ellipse cx="150" cy="135" rx="72" ry="22" fill="none" stroke="url(#catMoltenGold)" strokeWidth="5" />
      <path d="M85 136 C110 152 190 152 215 136" stroke="#FFFFFF" strokeWidth="2.5" opacity="0.8" />
    </g>
  </svg>
);

// 7. Wave Prism Ring (Minimalist Contoured Band with Bezel White Topaz)
export const WavePrismRingSvg: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <SvgDefs />
    <g filter="url(#catShadow)" transform="translate(150, 150) rotate(25) translate(-150, -150)">
      {/* Contoured Knife-Edge Loop Band */}
      <ellipse cx="150" cy="150" rx="60" ry="70" stroke="url(#catGoldGrad)" strokeWidth="6" fill="none" />
      <path d="M96 150 C96 100 130 85 150 90" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.8" />

      {/* Top Gem Bezel Setting */}
      <g transform="translate(150, 80)">
        <circle cx="0" cy="0" r="16" fill="url(#catGoldGrad)" stroke="#7A4E11" strokeWidth="1" />
        {/* Faceted Topaz Gem */}
        <circle cx="0" cy="0" r="12" fill="url(#catGemGrad)" stroke="#7A8C9A" strokeWidth="0.75" />
        <polygon points="-6,-6 6,-6 10,0 6,6 -6,6 -10,0" fill="#FFFFFF" opacity="0.8" />
        <polygon points="-3,-3 3,-3 5,0 3,3 -3,3 -5,0" fill="#F0F8FF" />
        <circle cx="-3" cy="-3" r="2" fill="#FFFFFF" />
      </g>
    </g>
  </svg>
);

// 8. Shell Radiance Studs (Pair of Scalloped Gold Seashell Fan Earrings)
export const ShellRadianceStudsSvg: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <SvgDefs />
    <g filter="url(#catShadow)">
      {/* Left Shell */}
      <g transform="translate(90, 150)">
        <path
          d="M0 35 C-38 35 -48 -15 -35 -35 C-15 -48 15 -48 35 -35 C48 -15 38 35 0 35 Z"
          fill="url(#catGoldGrad)"
          stroke="#7A4E11"
          strokeWidth="1.5"
        />
        {/* Radiating Ribs */}
        {[-30, -18, -6, 6, 18, 30].map((deg, i) => (
          <line
            key={i}
            x1="0"
            y1="32"
            x2={Math.sin((deg * Math.PI) / 180) * 45}
            y2={-Math.cos((deg * Math.PI) / 180) * 45 + 5}
            stroke="#7A4E11"
            strokeWidth="1.5"
          />
        ))}
        <path d="M-28 -25 C-10 -42 10 -42 28 -25" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
      </g>

      {/* Right Shell */}
      <g transform="translate(210, 150)">
        <path
          d="M0 35 C-38 35 -48 -15 -35 -35 C-15 -48 15 -48 35 -35 C48 -15 38 35 0 35 Z"
          fill="url(#catGoldGrad)"
          stroke="#7A4E11"
          strokeWidth="1.5"
        />
        {/* Radiating Ribs */}
        {[-30, -18, -6, 6, 18, 30].map((deg, i) => (
          <line
            key={i}
            x1="0"
            y1="32"
            x2={Math.sin((deg * Math.PI) / 180) * 45}
            y2={-Math.cos((deg * Math.PI) / 180) * 45 + 5}
            stroke="#7A4E11"
            strokeWidth="1.5"
          />
        ))}
        <path d="M-28 -25 C-10 -42 10 -42 28 -25" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
      </g>
    </g>
  </svg>
);

// 9. Gold Curve Necklace (Minimalist Wavy Wire Collar Necklace)
export const GoldCurveNecklaceSvg: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <SvgDefs />
    <g filter="url(#catShadow)">
      {/* Upper Fine Cable Chain */}
      <path d="M60 40 L90 180" stroke="url(#catGoldGrad)" strokeWidth="1.5" strokeDasharray="3 1.5" />
      <path d="M240 40 L210 180" stroke="url(#catGoldGrad)" strokeWidth="1.5" strokeDasharray="3 1.5" />

      {/* Lower Fluid Organic Wavy Solid Gold Wire Bar */}
      <path
        d="M90 180 C110 200 135 185 160 215 C185 230 200 195 210 180"
        fill="none"
        stroke="url(#catGoldGrad)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Golden Highlight Sheen */}
      <path
        d="M98 185 C120 195 140 190 162 216"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.85"
      />
    </g>
  </svg>
);

// 10. Accent Huggie Earrings (Pair of Diamond Pavé Hoop Huggies)
export const AccentEarringsSvg: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <SvgDefs />
    <g filter="url(#catShadow)">
      {/* Left Huggie */}
      <g transform="translate(100, 150)">
        <ellipse cx="0" cy="0" rx="34" ry="40" stroke="url(#catGoldGrad)" strokeWidth="14" fill="none" />
        {/* Micropavé Stones */}
        {[-30, -15, 0, 15, 30].map((deg, idx) => (
          <circle
            key={idx}
            cx={-34 * Math.cos((deg * Math.PI) / 180)}
            cy={40 * Math.sin((deg * Math.PI) / 180)}
            r="3"
            fill="#FFFFFF"
            stroke="#8FA4B5"
            strokeWidth="0.5"
          />
        ))}
      </g>

      {/* Right Huggie */}
      <g transform="translate(200, 150)">
        <ellipse cx="0" cy="0" rx="34" ry="40" stroke="url(#catGoldGrad)" strokeWidth="14" fill="none" />
        {/* Micropavé Stones */}
        {[-30, -15, 0, 15, 30].map((deg, idx) => (
          <circle
            key={idx}
            cx={-34 * Math.cos((deg * Math.PI) / 180)}
            cy={40 * Math.sin((deg * Math.PI) / 180)}
            r="3"
            fill="#FFFFFF"
            stroke="#8FA4B5"
            strokeWidth="0.5"
          />
        ))}
      </g>
    </g>
  </svg>
);

// 11. Linked Heart Toggle Bracelet (Liquid Silver Snake Chain with Sculpted Heart Toggle)
export const LinkedHeartBraceletSvg: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <SvgDefs />
    <g filter="url(#catShadow)" transform="translate(150, 150) rotate(5) translate(-150, -150)">
      {/* Circular Snake Chain Loop */}
      <ellipse cx="150" cy="140" rx="76" ry="60" stroke="url(#catSilverGrad)" strokeWidth="5.5" fill="none" strokeDasharray="6 2" />
      <ellipse cx="150" cy="140" rx="76" ry="60" stroke="#FFFFFF" strokeWidth="1.5" fill="none" opacity="0.6" />

      {/* Bottom Sculpted Organic Asymmetric Heart Charm */}
      <g transform="translate(150, 205)">
        <path
          d="M0 16 C-22 0 -30 -18 -16 -30 C-4 -40 0 -22 0 -22 C0 -22 4 -40 16 -30 C30 -18 22 0 0 16 Z"
          fill="none"
          stroke="url(#catSilverGrad)"
          strokeWidth="6"
          strokeLinejoin="round"
        />
        {/* T-Bar Lock Toggle */}
        <line x1="-20" y1="-14" x2="20" y2="-14" stroke="url(#catSilverGrad)" strokeWidth="4.5" strokeLinecap="round" />
        <circle cx="0" cy="-14" r="3" fill="#FFFFFF" />
        <path d="M-14 -24 C-4 -30 0 -18 0 -18" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
      </g>
    </g>
  </svg>
);

// 12. Scalo Bracelet (Sculptural Molten Undulating Gold Wave Cuff)
export const ScaloBraceletSvg: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <SvgDefs />
    <g filter="url(#catShadow)" transform="translate(150, 150) rotate(-10) translate(-150, -150)">
      {/* Heavy Undulating Wave Cuff Silhouette */}
      <path
        d="M65 155 C70 115 105 95 150 95 C195 95 230 115 235 155 C230 185 205 205 175 190 C150 175 130 205 105 195 C80 185 65 175 65 155 Z"
        fill="url(#catGoldGrad)"
        stroke="#7A4E11"
        strokeWidth="2"
      />
      {/* Top Wave Ridge Highlight */}
      <path
        d="M75 145 C95 110 135 102 170 105 C205 108 225 135 228 150"
        stroke="#FFFFFF"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.85"
      />
      {/* Bottom Wave Fold */}
      <path
        d="M85 168 C115 185 145 155 175 180 C195 190 215 170 220 158"
        stroke="#7A4E11"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.4"
      />
    </g>
  </svg>
);

// 13. Square Form Necklace (Heavy Figaro Link Gold Chain with Square Architecture)
export const SquareFormNecklaceSvg: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <SvgDefs />
    <g filter="url(#catShadow)">
      {/* Broad Figaro / Curb Chain Loop */}
      <path
        d="M60 50 C50 170 110 250 150 250 C190 250 250 170 240 50"
        fill="none"
        stroke="url(#catGoldGrad)"
        strokeWidth="14"
        strokeLinecap="round"
        strokeDasharray="22 6"
      />
      {/* Interlocking Link Outlines */}
      <path
        d="M60 50 C50 170 110 250 150 250 C190 250 250 170 240 50"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeDasharray="18 10"
        opacity="0.75"
      />
    </g>
  </svg>
);

// 14. Dome Studs (High-Polish Giant Spherical Gold Stud)
export const DomeStudsSvg: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <SvgDefs />
    <g filter="url(#catShadow)">
      <circle cx="150" cy="150" r="70" fill="url(#catGoldGrad)" stroke="#7A4E11" strokeWidth="1.5" />
      {/* High-Gloss Dome Specular Highlight */}
      <ellipse cx="125" cy="120" rx="35" ry="25" fill="#FFFFFF" opacity="0.65" transform="rotate(-30, 125, 120)" />
      <circle cx="115" cy="110" r="8" fill="#FFFFFF" opacity="0.95" />
    </g>
  </svg>
);
