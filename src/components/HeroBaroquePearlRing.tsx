import React from 'react';
import { motion } from 'motion/react';

interface HeroBaroquePearlRingProps {
  className?: string;
  onClick?: () => void;
}

export const HeroBaroquePearlRing: React.FC<HeroBaroquePearlRingProps> = ({
  className = 'w-[380px] xs:w-[480px] sm:w-[580px] md:w-[680px] lg:w-[780px] xl:w-[880px] 2xl:w-[980px]',
  onClick,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: 1.2,
          ease: [0.16, 1, 0.3, 1],
        },
      }}
      className={`relative cursor-pointer select-none flex items-center justify-center pointer-events-auto filter drop-shadow-[0_30px_50px_rgba(40,25,10,0.28)] ${className}`}
      onClick={onClick}
    >
      {/* Gentle Floating Motion */}
      <motion.div
        animate={{
          y: [-10, 10, -10],
          rotate: [-1.5, 1.5, -1.5],
        }}
        transition={{
          repeat: Infinity,
          duration: 5,
          ease: 'easeInOut',
        }}
        className="w-full relative flex items-center justify-center"
      >
        <svg
          viewBox="0 0 600 640"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <defs>
            {/* Rich 18k Yellow Gold Gradients */}
            <linearGradient id="luxeGoldShank" x1="160" y1="160" x2="460" y2="580" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFF4D0" />
              <stop offset="15%" stopColor="#F7D070" />
              <stop offset="38%" stopColor="#E5A630" />
              <stop offset="65%" stopColor="#FFDE8A" />
              <stop offset="85%" stopColor="#C8841B" />
              <stop offset="100%" stopColor="#7E4C09" />
            </linearGradient>

            <linearGradient id="innerHoleGrad" x1="250" y1="360" x2="390" y2="540" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#6E3F06" />
              <stop offset="35%" stopColor="#F0CB6E" />
              <stop offset="75%" stopColor="#9C6314" />
              <stop offset="100%" stopColor="#4A2802" />
            </linearGradient>

            {/* Baroque Pearl High-Nacre Iridescence */}
            <radialGradient id="pearlBodyIridescence" cx="36%" cy="30%" r="68%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="25%" stopColor="#FCF8F2" />
              <stop offset="55%" stopColor="#F2E8DC" />
              <stop offset="80%" stopColor="#D8C7B8" />
              <stop offset="100%" stopColor="#A38F7F" />
            </radialGradient>

            <radialGradient id="pearlLusterGaze" cx="60%" cy="65%" r="55%">
              <stop offset="0%" stopColor="#FFEFE8" stopOpacity="0.85" />
              <stop offset="45%" stopColor="#EAD6CD" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#B39F95" stopOpacity="0" />
            </radialGradient>

            <linearGradient id="pearlSpecularSweep" x1="210" y1="190" x2="350" y2="350" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#EFE5D8" stopOpacity="0" />
            </linearGradient>

            {/* Ground Shadow */}
            <radialGradient id="ringGroundShadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3D290F" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#3D290F" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#3D290F" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* 1. Ambient Drop Shadow */}
          <ellipse cx="310" cy="600" rx="150" ry="26" fill="url(#ringGroundShadow)" />

          {/* 2. Inner Ring Shank / Hallmark */}
          <g>
            <ellipse cx="318" cy="430" rx="68" ry="96" transform="rotate(18 318 430)" fill="url(#innerHoleGrad)" />
            <text
              x="338"
              y="446"
              transform="rotate(62 338 446)"
              fill="#523106"
              fontFamily="Georgia, serif"
              fontSize="14"
              fontWeight="bold"
              opacity="0.7"
              letterSpacing="2.5"
            >
              750
            </text>
          </g>

          {/* 3. Outer Molten Gold Band */}
          <path
            d="M234 346 
               C224 395 238 460 274 510 
               C310 560 362 570 392 538 
               C422 506 434 435 422 366 
               C415 330 405 295 386 268 
               C370 244 348 232 338 234 
               C322 238 296 256 266 280 
               C244 300 238 324 234 346 Z"
            fill="url(#luxeGoldShank)"
            stroke="#7C4806"
            strokeWidth="2.5"
          />

          {/* 4. Molten Bezel Setting Cradling Pearl */}
          <path
            d="M236 312 
               C216 338 220 380 242 406 
               C266 434 314 444 354 412 
               C394 380 414 330 410 286 
               C406 244 382 224 354 222 
               C318 218 262 274 236 312 Z"
            fill="url(#luxeGoldShank)"
            stroke="#6E3E03"
            strokeWidth="3"
          />

          {/* Outer Bezel Rim Reflection */}
          <path
            d="M234 350 C228 388 248 422 274 436 C310 452 362 434 394 394 C414 366 422 322 416 290"
            stroke="#FFF8E0"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
            opacity="0.9"
          />

          {/* 5. Natural Organic Baroque Pearl */}
          <g>
            {/* Pearl Silhouette */}
            <path
              d="M240 318
                 C226 290 236 248 266 220
                 C296 192 338 184 376 202
                 C414 220 430 258 422 292
                 C414 326 380 362 336 376
                 C292 390 252 350 240 318 Z"
              fill="url(#pearlBodyIridescence)"
              stroke="#B39F8E"
              strokeWidth="2"
            />

            {/* Warm Rosé Luster Flare */}
            <path
              d="M254 316
                 C248 292 258 258 282 234
                 C306 210 344 206 372 222
                 C400 238 408 272 400 300
                 C392 328 362 354 326 362
                 C290 370 260 344 254 316 Z"
              fill="url(#pearlLusterGaze)"
            />

            {/* High-Gloss Light Sweep */}
            <path
              d="M270 232
                 C294 208 332 202 362 216
                 C380 226 390 242 394 260
                 C388 246 372 234 350 230
                 C324 226 292 232 270 250 Z"
              fill="url(#pearlSpecularSweep)"
            />

            {/* Specular Highlights */}
            <ellipse
              cx="302"
              cy="230"
              rx="26"
              ry="15"
              transform="rotate(-25 302 230)"
              fill="#FFFFFF"
              opacity="0.95"
            />
            <ellipse
              cx="344"
              cy="238"
              rx="18"
              ry="9"
              transform="rotate(15 344 238)"
              fill="#FFFFFF"
              opacity="0.85"
            />

            {/* Shadow under Pearl at gold contact edge */}
            <path
              d="M244 334 C262 364 300 378 340 370 C374 362 402 334 412 298"
              stroke="#5C3B24"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              opacity="0.5"
            />
          </g>

          {/* 6. Gold Rim Flare Accents */}
          <path
            d="M234 346 C240 374 266 400 298 412"
            stroke="#FFF1C2"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.95"
          />
          <path
            d="M386 346 C404 320 412 290 408 262"
            stroke="#FFF8E0"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.9"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
};
