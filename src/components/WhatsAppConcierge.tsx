import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Sparkles } from 'lucide-react';

export const WhatsAppConcierge: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    try {
      const isDismissed = sessionStorage.getItem('avirena_wa_prompt_dismissed');
      if (!isDismissed) {
        // Show subtle prompt after 4 seconds of pleasant browsing
        const timer = setTimeout(() => {
          setShowPrompt(true);
        }, 4000);
        return () => clearTimeout(timer);
      }
    } catch {
      // sessionStorage unavailable
    }
  }, []);

  const handleDismissPrompt = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setShowPrompt(false);
    setHasInteracted(true);
    try {
      sessionStorage.setItem('avirena_wa_prompt_dismissed', 'true');
    } catch {
      // ignore
    }
  };

  const waUrl =
    "https://wa.me/917823889290?text=Hi%20Avirena,%20I'd%20like%20to%20claim%20my%2010%25%20VIP%20welcome%20code%20and%20chat%20with%20a%20stylist!";

  return (
    <aside aria-label="WhatsApp VIP Concierge" className="fixed bottom-6 left-6 z-40 flex flex-col items-start font-sans-body select-none">
      {/* Subtle Stylist Invitation Card */}
      {showPrompt && !hasInteracted && (
        <div
          role="region"
          aria-label="VIP Concierge Greeting"
          className="mb-3 max-w-[280px] sm:max-w-xs bg-[#242320]/95 backdrop-blur-md text-white p-3.5 rounded-sm shadow-[0_12px_36px_rgba(0,0,0,0.25)] border border-[#C5A059]/40 animate-in fade-in slide-in-from-bottom-2 duration-300 relative text-left"
        >
          <button
            onClick={handleDismissPrompt}
            className="absolute top-2 right-2 text-white/50 hover:text-white transition-colors p-1 cursor-pointer rounded-full hover:bg-white/10"
            aria-label="Dismiss greeting"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-[0.16em] text-[#E5D7B7]">
              Stylist Concierge Online
            </span>
          </div>

          <p className="text-xs text-[#FAF8F5] leading-relaxed">
            Need help selecting a piece or want your <strong className="text-[#E5D7B7] font-semibold">10% VIP welcome code</strong>? Chat with an Avirena stylist directly.
          </p>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              setShowPrompt(false);
              setHasInteracted(true);
            }}
            className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#E5D7B7] hover:text-white transition-colors uppercase tracking-[0.12em] group"
          >
            <span>Start WhatsApp Chat</span>
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </a>
        </div>
      )}

      {/* Primary Floating Action Pill / Badge */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        id="floating-whatsapp-btn"
        className="group flex items-center gap-2.5 bg-[#1F1E1B] hover:bg-[#2A2925] text-white px-3.5 py-2.5 sm:px-4 sm:py-2.5 rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.22)] border border-[#C5A059]/40 hover:border-[#C5A059] transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
        aria-label="Chat with Avirena VIP Concierge on WhatsApp for 10% off"
      >
        {/* WhatsApp Icon with Emerald Accents */}
        <div className="w-6 h-6 rounded-full bg-[#25D366] flex items-center justify-center shrink-0 shadow-xs">
          <MessageCircle className="w-3.5 h-3.5 text-white fill-white" />
        </div>

        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#FAF8F5] group-hover:text-white">
              VIP Concierge
            </span>
            <span className="px-1.5 py-0.2 bg-[#C5A059]/20 text-[#E5D7B7] text-[9px] font-bold uppercase tracking-wider rounded-xs border border-[#C5A059]/40">
              10% Off
            </span>
          </div>
          <span className="hidden sm:inline text-[9.5px] text-[#A8A498] font-normal">
            Instant styling &amp; order assistance
          </span>
        </div>

        <Sparkles className="w-3.5 h-3.5 text-[#C5A059] opacity-80 group-hover:opacity-100 group-hover:rotate-12 transition-all ml-0.5" />
      </a>
    </aside>
  );
};
