import React from 'react';

/**
 * Authentic payment badges for Indian & International checkouts
 * Exactly matching the reference style: white rounded pill cards with authentic brand logos.
 */
export const PaymentBadges: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 ${className}`}>
      {/* 1. Google Pay (GPay) */}
      <div
        className="w-12 h-7 sm:w-14 sm:h-8 bg-white rounded-md flex items-center justify-center px-1.5 py-1 shadow-xs border border-white/20 transition-transform hover:scale-105"
        title="Google Pay"
        aria-label="Google Pay"
      >
        <svg viewBox="0 0 54 22" className="w-full h-full object-contain" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* G */}
          <path d="M7.8 11.2c0-.5-.04-1-.13-1.5H0v2.9h4.4c-.19 1-.76 1.9-1.6 2.5v2h2.6c1.5-1.4 2.4-3.5 2.4-5.9z" fill="#4285F4"/>
          <path d="M0 19.1c2.1 0 3.9-.7 5.2-1.9l-2.6-2c-.7.5-1.6.8-2.6.8-2 0-3.8-1.4-4.4-3.3h-2.7v2.1c1.3 2.6 4.1 4.3 7.1 4.3z" fill="#34A853"/>
          <path d="M-4.4 12.7c-.1-.5-.2-1-.2-1.5s.1-1 .2-1.5V7.6h-2.7C-7.7 8.8-8 10-8 11.2s.3 2.4.9 3.6l2.7-2.1z" fill="#FBBC04"/>
          <path d="M0 6.6c1.1 0 2.2.4 3 1.2l2.3-2.3C3.9 4.2 2.1 3.4 0 3.4c-3 0-5.8 1.7-7.1 4.3l2.7 2.1C-3.8 8-2 6.6 0 6.6z" fill="#EA4335"/>
          {/* Pay */}
          <text x="14" y="15" fill="#5F6368" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" fontSize="11" fontWeight="600" letterSpacing="-0.3px">Pay</text>
        </svg>
      </div>

      {/* 2. PhonePe */}
      <div
        className="w-12 h-7 sm:w-14 sm:h-8 bg-white rounded-md flex items-center justify-center p-1 shadow-xs border border-white/20 transition-transform hover:scale-105"
        title="PhonePe"
        aria-label="PhonePe"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="11" fill="#5f259f" />
          {/* Devanagari Pe icon */}
          <path
            d="M8.2 6.5h4.2c2.1 0 3.6 1.4 3.6 3.3 0 1.9-1.4 3.3-3.6 3.3H10.5v4.4H8.2V6.5zm2.3 4.7h1.7c.9 0 1.6-.6 1.6-1.4 0-.8-.7-1.4-1.6-1.4h-1.7v2.8z"
            fill="#ffffff"
          />
          <path d="M12.5 13.1l3.5 4.4h-2.7l-2.7-3.6h-.7v-.8h2.6z" fill="#ffffff" />
        </svg>
      </div>

      {/* 3. BHIM / UPI */}
      <div
        className="w-12 h-7 sm:w-14 sm:h-8 bg-white rounded-md flex items-center justify-center px-1.5 py-1 shadow-xs border border-white/20 transition-transform hover:scale-105"
        title="BHIM UPI"
        aria-label="BHIM UPI"
      >
        <svg viewBox="0 0 36 20" className="w-full h-full object-contain" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* UPI Triangles */}
          <path d="M6 3l5 7H1l5-7z" fill="#097939" />
          <path d="M10 17l-5-7h10l-5 7z" fill="#ED7524" />
          <text x="18" y="14" fill="#000000" fontFamily="sans-serif" fontSize="9" fontWeight="800" fontStyle="italic" letterSpacing="-0.5px">UPI</text>
        </svg>
      </div>

      {/* 4. Paytm */}
      <div
        className="w-12 h-7 sm:w-14 sm:h-8 bg-white rounded-md flex items-center justify-center px-1.5 py-1 shadow-xs border border-white/20 transition-transform hover:scale-105"
        title="Paytm"
        aria-label="Paytm"
      >
        <svg viewBox="0 0 46 16" className="w-full h-full object-contain" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text x="1" y="12" fill="#002970" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" fontSize="11" fontWeight="800" letterSpacing="-0.5px">pay</text>
          <text x="22" y="12" fill="#00BAF2" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" fontSize="11" fontWeight="800" letterSpacing="-0.5px">tm</text>
        </svg>
      </div>

      {/* 5. Visa */}
      <div
        className="w-12 h-7 sm:w-14 sm:h-8 bg-white rounded-md flex items-center justify-center px-1.5 py-1 shadow-xs border border-white/20 transition-transform hover:scale-105"
        title="Visa"
        aria-label="Visa"
      >
        <svg viewBox="0 0 38 14" className="w-full h-full object-contain" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M14.5 1.5l-2.4 11h-2.1l1.5-7-1.8 7H7.9L5.3 4.2c-.2-.7-.4-.9-.9-1.2C3.6 2.5 2.2 2.1 1 1.9l.2-.4h4.4c.6 0 1.1.4 1.2 1.1l1.1 5.8 2.7-6.9h2.3l3.6 11h-2.2l-.5-2.5h-3.1l-.3 1.5zm8.5 7.1c0-2.8-3.9-3-3.9-4.2 0-.4.4-.8 1.2-.9.4 0 1.5.1 2.2.4l.4-1.9c-.6-.2-1.4-.4-2.4-.4-2.5 0-4.3 1.3-4.3 3.2 0 1.4 1.3 2.2 2.2 2.7.9.5 1.2.8 1.2 1.2 0 .6-.8.9-1.5.9-.9 0-1.6-.2-2.3-.5l-.4 2c.7.3 1.7.5 2.6.5 2.7 0 4.5-1.3 4.5-3.1zM36.8 1.5h-1.8c-.6 0-1 .2-1.3.8L29.3 12.5h2.3l.5-1.3h2.8l.3 1.3h2l-1.6-11zm-3.6 7.9l1.1-3.1.6 3.1h-1.7zm-8.8-7.9l-1.8 11h2.2l1.8-11h-2.2z"
            fill="#1A1F71"
          />
          <path d="M5.6 2.6C4.8 2.3 3.4 1.9 1 1.9l.2-.4h4.4c.6 0 1.1.4 1.2 1.1l.4 2.2-.8-.8c-.4-.4-.7-.9-.8-1.4z" fill="#F7B600" />
        </svg>
      </div>

      {/* 6. RuPay */}
      <div
        className="w-12 h-7 sm:w-14 sm:h-8 bg-white rounded-md flex items-center justify-center px-1.5 py-1 shadow-xs border border-white/20 transition-transform hover:scale-105"
        title="RuPay"
        aria-label="RuPay"
      >
        <svg viewBox="0 0 48 16" className="w-full h-full object-contain" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text x="1" y="12.5" fill="#092359" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" fontSize="10.5" fontWeight="800" fontStyle="italic" letterSpacing="-0.3px">
            RuPay
          </text>
          {/* Directional Chevrons */}
          <path d="M40 3l3 5-3 5h2.5l3-5-3-5H40z" fill="#ED7524" />
          <path d="M43.5 3l3 5-3 5H49l3-5-3-5h-2.5z" fill="#097939" />
        </svg>
      </div>

      {/* 7. Mastercard */}
      <div
        className="w-12 h-7 sm:w-14 sm:h-8 bg-white rounded-md flex items-center justify-center px-1.5 py-1 shadow-xs border border-white/20 transition-transform hover:scale-105"
        title="Mastercard"
        aria-label="Mastercard"
      >
        <svg viewBox="0 0 32 20" className="w-full h-full object-contain" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="11" cy="10" r="8" fill="#EB001B" />
          <circle cx="21" cy="10" r="8" fill="#F79E1B" />
          {/* Overlap Intersection */}
          <path d="M16 4.3a7.96 7.96 0 013 5.7c0 2.3-1 4.4-2.6 5.7A7.96 7.96 0 0113 10c0-2.3 1-4.4 2.6-5.7z" fill="#FF5F00" />
        </svg>
      </div>
    </div>
  );
};
