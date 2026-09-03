import React from 'react';
import { X, Sparkles, Feather, ShieldCheck } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StoryModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans-body select-none">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div className="min-h-screen px-4 flex items-center justify-center py-12">
        <div className="inline-block w-full max-w-3xl bg-[#FAF8F5] border border-[#E6DFD3] rounded-xs p-6 sm:p-10 text-left align-middle shadow-2xl animate-in zoom-in-95 duration-200 z-10 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E6DFD3]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#8F896D]" />
              <span className="text-xs uppercase tracking-[0.25em] text-[#8F896D] font-semibold">
                The Avirena Ethos
              </span>
            </div>
            <button
              id="close-story-modal-btn"
              onClick={onClose}
              className="p-1.5 text-[#413C23]/60 hover:text-[#413C23] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>

          <div className="space-y-6 text-[#413C23] leading-relaxed">
            <h2 className="font-serif-display text-3xl sm:text-4xl text-[#413C23] leading-tight">
              “Crafted to be worn, not stored.”
            </h2>

            <p className="text-sm font-light leading-relaxed text-[#413C23]/80">
              <strong className="text-[#413C23] font-semibold">Avirena Jewels</strong> is a homegrown brand crafting premium dailywear pieces for modern women who treat jewelry not as an afterthought, but as effortless daily self-expression.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#E6DFD3]">
              <div className="space-y-2">
                <h4 className="font-serif-display text-lg text-[#413C23] font-medium">Everyday Luxury</h4>
                <p className="text-xs text-[#413C23]/75 leading-relaxed">
                  We believe beautiful jewelry should be lived in every day. Each piece is cast in durable brass, sealed with an anti-tarnish protective coat, and crafted with comfortable ergonomics for all-day wear.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-serif-display text-lg text-[#413C23] font-medium">Sculptural Silhouettes</h4>
                <p className="text-xs text-[#413C23]/75 leading-relaxed">
                  Rejecting fast-fashion generic molds, our signature forms explore fluid molten textures, organic cultured pearls, and architectural curves.
                </p>
              </div>
            </div>

            <div className="bg-[#E6DFD3]/40 p-5 rounded-xs flex items-center gap-4 border border-[#E6DFD3]">
              <Feather className="w-8 h-8 text-[#8F896D] shrink-0" />
              <p className="text-xs text-[#413C23] italic">
                “True daily luxury is how effortless a piece feels on your skin from morning till night.”
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CareModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans-body select-none">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div className="min-h-screen px-4 flex items-center justify-center py-12">
        <div className="inline-block w-full max-w-3xl bg-[#FAF8F5] border border-[#E6DFD3] rounded-xs p-6 sm:p-10 text-left align-middle shadow-2xl animate-in zoom-in-95 duration-200 z-10 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E6DFD3]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#8F896D]" />
              <span className="text-xs uppercase tracking-[0.25em] text-[#8F896D] font-semibold">
                Materials &amp; Care Guide
              </span>
            </div>
            <button
              id="close-care-modal-btn"
              onClick={onClose}
              className="p-1.5 text-[#413C23]/60 hover:text-[#413C23] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>

          <div className="space-y-6 text-[#413C23]">
            <h2 className="font-serif-display text-3xl text-[#413C23]">
              Preserving Your Piece's Golden Luster
            </h2>

            <div className="space-y-4 text-xs leading-relaxed text-[#413C23]/80">
              <div className="p-4 bg-[#FAF8F5] border border-[#E6DFD3] rounded-xs">
                <h4 className="font-semibold text-sm text-[#413C23] mb-1">Our Materials &amp; Anti-Tarnish Finish</h4>
                <p>
                  Our jewels are crafted with premium brass and high-grade alloys, sealed with specialized anti-tarnish protective e-coatings. This delivers lasting golden luster and water resistance for daily styling.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-3.5 bg-[#E6DFD3]/40 border border-[#E6DFD3] rounded-xs">
                  <strong className="block text-[#413C23] mb-1 font-semibold">1. Put On Last</strong>
                  Put your jewelry on after applying perfumes, lotions, sanitizers, and hair sprays.
                </div>
                <div className="p-3.5 bg-[#E6DFD3]/40 border border-[#E6DFD3] rounded-xs">
                  <strong className="block text-[#413C23] mb-1 font-semibold">2. Keep Dry &amp; Stored</strong>
                  Store separately in your complimentary pouch away from high humidity when not in use.
                </div>
                <div className="p-3.5 bg-[#E6DFD3]/40 border border-[#E6DFD3] rounded-xs">
                  <strong className="block text-[#413C23] mb-1 font-semibold">3. Gentle Wipe</strong>
                  Gently buff with a soft dry cloth after wearing to remove oils and maintain brilliance.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
