import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';

interface RecentPurchaseToastProps {
  products?: Product[];
  onSelectProduct?: (product: Product, shouldScroll?: boolean) => void;
}

const BUYER_NAMES = [
  'Ananya',
  'Priya',
  'Sneha',
  'Tanya',
  'Rhea',
  'Pooja',
  'Shreya',
  'Meera',
  'Aditi',
  'Kritika',
  'Radhika',
  'Natasha',
  'Simran',
  'Ishita',
  'Divya',
  'Aakanksha',
  'Bhavna',
  'Ritu',
  'Anushka',
  'Tara',
  'Deepika',
  'Isha',
  'Aanya',
  'Kiara',
  'Nisha',
  'Sonam',
  'Diya',
  'Alia',
  'Suhana',
  'Kavya',
];

const CITIES = [
  'Mumbai',
  'South Delhi',
  'Bengaluru',
  'Pune',
  'Jaipur',
  'Hyderabad',
  'Ahmedabad',
  'Chandigarh',
  'Gurugram',
  'Kolkata',
  'Lucknow',
  'Indore',
  'Chennai',
  'Surat',
  'Noida',
  'Kochi',
  'Bhopal',
];

const TIME_AGOS = [
  'Just now',
  '2 minutes ago',
  '4 minutes ago',
  '7 minutes ago',
  '12 minutes ago',
  '18 minutes ago',
  '26 minutes ago',
  '34 minutes ago',
];

interface PurchaseItem {
  id: string;
  name: string;
  city: string;
  product: Product;
  timeAgo: string;
}

export const RecentPurchaseToast: React.FC<RecentPurchaseToastProps> = ({
  products = [],
  onSelectProduct,
}) => {
  // Use live products if available, fallback to bundled products catalog
  const catalog = products.length > 0 ? products : PRODUCTS;

  const [currentItem, setCurrentItem] = useState<PurchaseItem | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // History tracking to avoid repeating the same person or product back-to-back
  const lastPersonRef = useRef<string>('');
  const lastProductRef = useRef<string>('');

  useEffect(() => {
    if (!catalog || catalog.length === 0) return;

    let isMounted = true;
    let timerId: NodeJS.Timeout;

    const pickNextPurchase = () => {
      if (!isMounted || catalog.length === 0) return;

      // Filter to products with valid images
      const validProducts = catalog.filter(
        (p) => p.images && p.images.length > 0 && p.images[0]
      );
      const productPool = validProducts.length > 0 ? validProducts : catalog;

      // Pick non-repeating product
      let candidateProduct =
        productPool[Math.floor(Math.random() * productPool.length)];
      if (productPool.length > 1 && candidateProduct.id === lastProductRef.current) {
        candidateProduct =
          productPool.find((p) => p.id !== lastProductRef.current) || candidateProduct;
      }
      lastProductRef.current = candidateProduct.id;

      // Pick non-repeating buyer name
      let candidateName =
        BUYER_NAMES[Math.floor(Math.random() * BUYER_NAMES.length)];
      if (candidateName === lastPersonRef.current) {
        candidateName =
          BUYER_NAMES.find((n) => n !== lastPersonRef.current) || candidateName;
      }
      lastPersonRef.current = candidateName;

      // Pick random city and time
      const city = CITIES[Math.floor(Math.random() * CITIES.length)];
      const timeAgo = TIME_AGOS[Math.floor(Math.random() * TIME_AGOS.length)];

      setCurrentItem({
        id: `${candidateProduct.id}-${Date.now()}`,
        name: candidateName,
        city,
        product: candidateProduct,
        timeAgo,
      });
      setIsVisible(true);

      // Keep visible for 4.5 seconds
      timerId = setTimeout(() => {
        if (!isMounted) return;
        setIsVisible(false);

        // Natural pause before next purchase (8 to 14 seconds)
        const nextDelay = 8000 + Math.floor(Math.random() * 6000);
        timerId = setTimeout(pickNextPurchase, nextDelay);
      }, 4500);
    };

    // Initial first appearance after 4 seconds of page load
    timerId = setTimeout(pickNextPurchase, 4000);

    return () => {
      isMounted = false;
      clearTimeout(timerId);
    };
  }, [catalog]);

  if (!currentItem) return null;

  const productImg =
    currentItem.product.images?.[0] ||
    currentItem.product.media?.[0]?.url ||
    '/logo.webp';

  const handleClick = () => {
    if (onSelectProduct) {
      onSelectProduct(currentItem.product, true);
    } else {
      window.location.href = `/product/${currentItem.product.handle || currentItem.product.id}`;
    }
  };

  return (
    <div
      role="status"
      aria-live="polite"
      onClick={handleClick}
      className={`fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 max-w-[340px] w-[calc(100vw-40px)] sm:w-auto bg-white/95 backdrop-blur-md rounded-xs border border-[#D8D2C2] shadow-[0_8px_26px_rgba(65,60,35,0.12)] p-2.5 sm:p-3 flex items-center gap-3 select-none cursor-pointer transition-all duration-500 ease-out hover:border-[#413C23] hover:shadow-[0_10px_32px_rgba(65,60,35,0.18)] ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
          : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
      }`}
    >
      {/* Product Image Thumbnail */}
      <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xs border border-[#E7E4D5] bg-[#FAF8F5] overflow-hidden shrink-0 flex items-center justify-center">
        <img
          src={productImg}
          alt={currentItem.product.name}
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
      </div>

      {/* Notification Text */}
      <div className="flex-1 min-w-0 pr-1 text-left">
        <p className="text-[11px] sm:text-xs text-[#413C23] font-medium truncate leading-tight">
          <span className="font-semibold text-black">{currentItem.name}</span>{' '}
          <span className="text-[#8F896D]">from</span> {currentItem.city}
        </p>

        <p className="text-[12px] sm:text-[13px] text-[#413C23] font-serif-display font-light truncate mt-0.5 leading-snug">
          Purchased {currentItem.product.name}
        </p>

        <div className="flex items-center gap-1.5 text-[10px] text-[#8F896D] mt-0.5">
          <span className="inline-flex items-center gap-0.5 text-[#15803D] font-medium">
            <CheckCircle2 className="w-3 h-3 text-[#15803D]" strokeWidth={2.2} />
            Verified Order
          </span>
          <span>•</span>
          <span>{currentItem.timeAgo}</span>
        </div>
      </div>

      {/* Dismiss Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsVisible(false);
        }}
        className="p-1 -mr-1 -mt-5 text-[#8F896D] hover:text-[#413C23] transition-colors cursor-pointer rounded-xs"
        aria-label="Dismiss notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
