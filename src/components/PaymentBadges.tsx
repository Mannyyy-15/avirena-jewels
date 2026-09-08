import React from 'react';

export interface PaymentBadgeItem {
  name: string;
  src: string;
  alt: string;
  imgClass?: string;
}

const PAYMENT_METHODS: PaymentBadgeItem[] = [
  {
    name: 'Google Pay',
    src: '/payment-methods/gpay.svg',
    alt: 'Google Pay',
    imgClass: 'h-4 sm:h-[18px]',
  },
  {
    name: 'PhonePe',
    src: '/payment-methods/phonepe.svg',
    alt: 'PhonePe',
    imgClass: 'h-5 sm:h-6',
  },
  {
    name: 'BHIM UPI',
    src: '/payment-methods/upi.svg',
    alt: 'BHIM UPI',
    imgClass: 'h-4 sm:h-5',
  },
  {
    name: 'Paytm',
    src: '/payment-methods/paytm.svg',
    alt: 'Paytm',
    imgClass: 'h-3.5 sm:h-4',
  },
  {
    name: 'Visa',
    src: '/payment-methods/visa.svg',
    alt: 'Visa',
    imgClass: 'h-3 sm:h-3.5',
  },
  {
    name: 'RuPay',
    src: '/payment-methods/rupay.svg',
    alt: 'RuPay',
    imgClass: 'h-3.5 sm:h-4',
  },
  {
    name: 'Mastercard',
    src: '/payment-methods/mastercard.svg',
    alt: 'Mastercard',
    imgClass: 'h-5 sm:h-6',
  },
];

/**
 * Authentic payment badges using official brand vector SVGs.
 * Rendered inside crisp white rounded card pills matching e-commerce standards.
 */
export const PaymentBadges: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 ${className}`}>
      {PAYMENT_METHODS.map((badge) => (
        <div
          key={badge.name}
          className="w-12 h-7 sm:w-14 sm:h-8 bg-white rounded-md flex items-center justify-center p-1 sm:p-1.5 shadow-xs border border-white/30 transition-transform duration-200 hover:scale-105 select-none"
          title={badge.name}
          aria-label={badge.name}
        >
          <img
            src={badge.src}
            alt={badge.alt}
            className={`w-auto max-w-[90%] object-contain ${badge.imgClass || 'h-4'}`}
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
};
