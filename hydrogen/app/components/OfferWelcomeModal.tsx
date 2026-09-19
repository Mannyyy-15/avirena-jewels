import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { X, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'avirena_welcome_offer_seen';
const SHOW_DELAY_MS = 15000;

const isPaidVisit = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.has('fbclid') || params.has('gclid') || params.has('ttclid')) return true;
    const medium = (params.get('utm_medium') || '').toLowerCase();
    if (['cpc', 'ppc', 'paid', 'paidsocial', 'paid_social'].includes(medium)) return true;
    const source = (params.get('utm_source') || '').toLowerCase();
    return ['facebook', 'instagram', 'meta', 'fb', 'ig'].includes(source);
  } catch {
    return false;
  }
};

interface OfferWelcomeModalProps {
  onShopNow?: () => void;
}

export const OfferWelcomeModal: React.FC<OfferWelcomeModalProps> = ({ onShopNow }) => {
  const [isOpen, setIsOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isPaidVisit()) return;

    let seen = true;
    try {
      seen = localStorage.getItem(STORAGE_KEY) === '1';
    } catch {
      seen = true;
    }
    if (seen) return;

    const timer = setTimeout(() => setIsOpen(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused.current?.focus?.();
    };
  }, [isOpen]);

  const handleShopNow = () => {
    handleClose();
    if (onShopNow) {
      onShopNow();
    } else {
      navigate('/shop');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70] overflow-y-auto font-sans-body"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-offer-title"
    >
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in duration-300"
        onClick={handleClose}
      />

      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        <div className="relative w-full max-w-3xl overflow-hidden rounded-xs bg-[#E7E4D5] border border-[#D8D2C2] shadow-2xl animate-in zoom-in-95 duration-200 text-[#413C23]">
          <button
            ref={closeButtonRef}
            onClick={handleClose}
            aria-label="Close offer"
            className="absolute top-2 right-2 z-10 w-11 h-11 inline-flex items-center justify-center rounded-full bg-[#FAF8F5]/95 text-[#413C23] hover:bg-[#FAF8F5] transition-colors cursor-pointer shadow-xs"
          >
            <X className="w-5 h-5 stroke-[2]" />
          </button>

          <div className="grid sm:grid-cols-2">
            {/* Image panel */}
            <div className="relative h-44 sm:h-auto sm:min-h-[24rem] bg-[#D8D2C2]">
              <img
                src="/assets/about/about-vignette-2.webp"
                alt="Avirena Jewels anti-tarnish brass earrings styled for everyday wear"
                className="absolute inset-0 w-full h-full object-cover"
                width={600}
                height={600}
              />
            </div>

            {/* Content panel */}
            <div className="flex flex-col justify-center gap-4 px-6 py-7 sm:px-8 sm:py-10">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6B6650]">
                <Sparkles className="w-3.5 h-3.5 text-[#8F896D] shrink-0" strokeWidth={1.75} />
                The Launch Sale Is Live
              </span>

              <h2
                id="welcome-offer-title"
                className="font-serif-display text-3xl sm:text-4xl leading-[1.15] text-[#413C23]"
              >
                Up to <span className="text-[#7A0F1A]">70% off</span> everything
              </h2>

              <p className="text-sm leading-relaxed text-[#6B6650]">
                Anti-tarnish brass, nickel-free with surgical steel posts, built for
                daily wear - now from ₹599. Free delivery anywhere in India, on
                every order, with no code needed.
              </p>

              <div className="flex flex-col gap-2.5">
                <button
                  onClick={handleShopNow}
                  className="w-full px-6 py-3.5 rounded-xs bg-[#413C23] text-[#FAF8F5] text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#2F2B19] transition-colors cursor-pointer"
                >
                  Shop the sale
                </button>
                <button
                  onClick={handleClose}
                  className="w-full text-[11px] uppercase tracking-[0.12em] text-[#6B6650] hover:text-[#413C23] transition-colors cursor-pointer"
                >
                  Maybe later
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
