import React, { useEffect, useRef, useState } from 'react';
import { X, Check, Copy, Truck } from 'lucide-react';
import offerImage from '../assets/about/about-vignette-2.webp';

/**
 * Welcome offer modal shown once per visitor on entry.
 *
 * The code it promotes (FREESHIP) is a real, active Shopify discount with no
 * end date, so the copy makes no expiry or scarcity claim - there is nothing
 * here that stops being true tomorrow.
 *
 * Layout is image-left / content-right on desktop and stacks on mobile, where
 * the image is capped in height so the CTA stays above the fold on small
 * screens.
 */

const STORAGE_KEY = 'avirena_welcome_offer_seen';
const DISCOUNT_CODE = 'FREESHIP';

/** Delay before showing, so the modal never competes with the LCP paint. */
const SHOW_DELAY_MS = 1600;

interface OfferWelcomeModalProps {
  /** Navigates to the shop listing and closes the modal. */
  onShopNow: () => void;
}

export const OfferWelcomeModal: React.FC<OfferWelcomeModalProps> = ({ onShopNow }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // Show once per visitor. localStorage can throw in private mode, so a failed
  // read is treated as "already seen" rather than showing the modal every load.
  useEffect(() => {
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
      /* Non-fatal: the modal simply shows again on the next visit. */
    }
  };

  // Scroll lock, Escape to dismiss, and focus handling while open.
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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(DISCOUNT_CODE);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    } catch {
      /* Clipboard blocked - the code stays visible for manual copying. */
    }
  };

  const handleShopNow = () => {
    handleClose();
    onShopNow();
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
            className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-[#FAF8F5]/90 text-[#6B6650] hover:text-[#413C23] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[1.5]" />
          </button>

          <div className="grid sm:grid-cols-2">
            {/* Image panel */}
            <div className="relative h-44 sm:h-auto sm:min-h-[24rem] bg-[#D8D2C2]">
              <img
                src={offerImage}
                alt="Avirena Jewels anti-tarnish brass earrings styled for everyday wear"
                className="absolute inset-0 w-full h-full object-cover"
                width={600}
                height={600}
              />
            </div>

            {/* Content panel */}
            <div className="flex flex-col justify-center gap-4 px-6 py-7 sm:px-8 sm:py-10">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6B6650]">
                <Truck className="w-3.5 h-3.5 text-[#8F896D] shrink-0" strokeWidth={1.75} />
                Welcome to Avirena
              </span>

              <h2
                id="welcome-offer-title"
                className="font-serif-display text-3xl sm:text-4xl leading-[1.15] text-[#413C23]"
              >
                Free delivery on your first order
              </h2>

              <p className="text-sm leading-relaxed text-[#6B6650]">
                Anti-tarnish brass, nickel-free with surgical steel posts, made for
                everyday wear. Use this code at checkout for free shipping anywhere
                in India.
              </p>

              <button
                onClick={handleCopy}
                aria-label={`Copy discount code ${DISCOUNT_CODE}`}
                className="group flex items-center justify-between gap-3 w-full px-4 py-3 rounded-xs bg-[#F2EFDB] border border-dashed border-[#8F896D] hover:border-[#413C23] transition-colors cursor-pointer"
              >
                <span className="font-mono text-lg font-semibold tracking-[0.12em] text-[#413C23]">
                  {DISCOUNT_CODE}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6B6650] group-hover:text-[#413C23] transition-colors">
                  {hasCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5" strokeWidth={2} />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" strokeWidth={1.75} />
                      Copy
                    </>
                  )}
                </span>
              </button>

              <div className="flex flex-col gap-2.5">
                <button
                  onClick={handleShopNow}
                  className="w-full px-6 py-3.5 rounded-xs bg-[#413C23] text-[#FAF8F5] text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#2F2B19] transition-colors cursor-pointer"
                >
                  Shop the collection
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
