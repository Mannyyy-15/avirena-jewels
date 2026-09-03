import React, { useState } from 'react';
import { MessageSquare, X, Sparkles, Send, ArrowRight } from 'lucide-react';

export const FloatingWhatsAppConcierge: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 font-sans-body">
      {/* Expanded Quick Chat Window */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 text-left text-[#413C23]">
          {/* Header */}
          <div className="bg-[#413C23] text-[#E7E4D5] p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#E7E4D5] text-[#413C23] flex items-center justify-center font-serif-display font-bold">
                AV
              </div>
              <div>
                <h4 className="font-serif-display text-sm font-medium">Avirena Atelier Concierge</h4>
                <span className="text-[10px] text-[#8F896D] block">Online • Typically replies in 5 mins</span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-[#E7E4D5]/70 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3 bg-[#F4EFE6]/50">
            <div className="p-3 bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs text-xs text-[#413C23] leading-relaxed shadow-2xs">
              <p className="font-serif-display text-sm mb-1 font-medium">Namaste & Welcome to Avirena Atelier ✨</p>
              <p className="text-[11px] text-[#413C23]/80">
                How may our jewelry specialists assist you today? We can help with custom ring sizing, bespoke bridal suites, order tracking, or styling advice.
              </p>
            </div>

            {/* Quick Option Prompts */}
            <div className="space-y-1.5 pt-1">
              <a
                href="https://wa.me/919820012345?text=Hello%20Avirena,%20I%20would%20like%20assistance%20with%20ring%20sizing%20and%20fit."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-left p-2.5 bg-[#FAF8F5] hover:bg-[#E7E4D5] border border-[#D8D2C2] rounded-xs text-xs text-[#413C23] flex items-center justify-between transition-colors group block"
              >
                <span>💍 Ring Sizing & Fit Guidance</span>
                <ArrowRight className="w-3 h-3 text-[#8F896D] group-hover:translate-x-0.5 transition-transform" />
              </a>

              <a
                href="https://wa.me/919820012345?text=Hello%20Avirena,%20I%20want%20to%20inquire%20about%20a%20Bespoke%20Custom%20Commission."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-left p-2.5 bg-[#FAF8F5] hover:bg-[#E7E4D5] border border-[#D8D2C2] rounded-xs text-xs text-[#413C23] flex items-center justify-between transition-colors group block"
              >
                <span>✨ Bespoke Commission / Bridal</span>
                <ArrowRight className="w-3 h-3 text-[#8F896D] group-hover:translate-x-0.5 transition-transform" />
              </a>

              <a
                href="https://wa.me/919820012345?text=Hello%20Avirena,%20Help%20me%20track%20my%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-left p-2.5 bg-[#FAF8F5] hover:bg-[#E7E4D5] border border-[#D8D2C2] rounded-xs text-xs text-[#413C23] flex items-center justify-between transition-colors group block"
              >
                <span>📦 Track Order Status</span>
                <ArrowRight className="w-3 h-3 text-[#8F896D] group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>

          {/* Footer Direct WhatsApp Button */}
          <div className="p-3 bg-[#FAF8F5] border-t border-[#D8D2C2]">
            <a
              href="https://wa.me/919820012345?text=Hello%20Avirena%20Atelier,%20I%20would%20like%20to%20connect%20with%20a%20jewelry%20specialist."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-[#413C23] hover:bg-[#8F896D] text-[#E7E4D5] text-xs uppercase tracking-wider font-semibold rounded-xs transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Start WhatsApp Chat</span>
            </a>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-3 bg-[#413C23] hover:bg-[#8F896D] text-[#E7E4D5] rounded-full shadow-2xl flex items-center gap-2.5 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border border-[#8F896D]/40 group"
        aria-label="Contact Concierge on WhatsApp"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D4AF37]" />
        </span>
        <MessageSquare className="w-4 h-4" />
        <span className="text-xs uppercase tracking-widest font-semibold hidden sm:inline-block">
          Concierge
        </span>
      </button>
    </div>
  );
};
