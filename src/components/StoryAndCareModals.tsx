import React from 'react';
import { X, Sparkles, Feather, ShieldCheck } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StoryModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans-body">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div className="min-h-screen px-4 flex items-center justify-center py-12">
        <div className="inline-block w-full max-w-3xl bg-[#FAF8F5] border border-[#E6DFD3] rounded-xs p-6 sm:p-10 text-left align-middle shadow-2xl animate-in zoom-in-95 duration-200 z-10 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E6DFD3]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#C5A059]" />
              <span className="text-xs uppercase tracking-[0.25em] text-[#9A9886] font-semibold">
                The Avirena Ethos
              </span>
            </div>
            <button
              id="close-story-modal-btn"
              onClick={onClose}
              className="p-1.5 text-[#7D7973] hover:text-[#2C2C2A] transition-colors"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>

          <div className="space-y-6 text-[#2C2C2A] leading-relaxed">
            <h2 className="font-serif-display text-3xl sm:text-4xl text-[#2C2C2A] leading-tight">
              “Crafted to be worn, not stored.”
            </h2>

            <p className="text-sm font-light leading-relaxed text-[#7D7973]">
              Born at the intersection of classical Indian metalcraft and Italian sculptural minimalism, 
              <strong className="text-[#2C2C2A] font-semibold"> Avirena Jewels</strong> creates modern demi-fine pieces for women who treat jewelry not as an afterthought, but as daily armor and subtle self-expression.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#E6DFD3]">
              <div className="space-y-2">
                <h4 className="font-serif-display text-lg text-[#2C2C2A]">Everyday Luxury</h4>
                <p className="text-xs text-[#7D7973] leading-relaxed">
                  We believe fine design shouldn't be locked in a velvet safe for special occasions. Each piece is engineered with weight balance, anti-tarnish protective layering, and effortless silhouettes designed for desk-to-dinner transitions.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-serif-display text-lg text-[#2C2C2A]">Sculptural Modernity</h4>
                <p className="text-xs text-[#7D7973] leading-relaxed">
                  Rejecting fast-fashion generic molds, our signature forms explore fluid molten gold, organic baroque pearls, and architectural curves inspired by mid-century kinetic sculpture.
                </p>
              </div>
            </div>

            <div className="bg-[#E6DFD3]/40 p-5 rounded-xs flex items-center gap-4 border border-[#E6DFD3]">
              <Feather className="w-8 h-8 text-[#C5A059] shrink-0" />
              <p className="text-xs text-[#2C2C2A] italic">
                “True luxury is how effortless a piece feels on your skin when you reach for your morning coffee.”
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
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans-body">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div className="min-h-screen px-4 flex items-center justify-center py-12">
        <div className="inline-block w-full max-w-3xl bg-[#FAF8F5] border border-[#E6DFD3] rounded-xs p-6 sm:p-10 text-left align-middle shadow-2xl animate-in zoom-in-95 duration-200 z-10 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E6DFD3]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#C5A059]" />
              <span className="text-xs uppercase tracking-[0.25em] text-[#9A9886] font-semibold">
                Materials & Care Guide
              </span>
            </div>
            <button
              id="close-care-modal-btn"
              onClick={onClose}
              className="p-1.5 text-[#7D7973] hover:text-[#2C2C2A] transition-colors"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>

          <div className="space-y-6 text-[#2C2C2A]">
            <h2 className="font-serif-display text-3xl text-[#2C2C2A]">
              Preserving Your Piece's Golden Luster
            </h2>

            <div className="space-y-4 text-xs leading-relaxed text-[#7D7973]">
              <div className="p-4 bg-[#FAF8F5] border border-[#E6DFD3] rounded-xs">
                <h4 className="font-semibold text-sm text-[#2C2C2A] mb-1">What is 18k Solid Vermeil?</h4>
                <p>
                  Gold vermeil is a premium demi-fine standard requiring a minimum 2.5 microns of real 18k gold over a solid 925 Sterling Silver base. Avirena applies a generous 3.0 microns followed by a microscopic ceramic barrier, ensuring 5x greater longevity than standard flash plating.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-3.5 bg-[#E6DFD3]/40 border border-[#E6DFD3] rounded-xs">
                  <strong className="block text-[#2C2C2A] mb-1 font-semibold">1. The Golden Rule</strong>
                  Put your jewelry on last after perfumes, lotions, and hair styling sprays have dried.
                </div>
                <div className="p-3.5 bg-[#E6DFD3]/40 border border-[#E6DFD3] rounded-xs">
                  <strong className="block text-[#2C2C2A] mb-1 font-semibold">2. Storage</strong>
                  Store separately in your complimentary Avirena anti-tarnish suede pouch away from direct humidity.
                </div>
                <div className="p-3.5 bg-[#E6DFD3]/40 border border-[#E6DFD3] rounded-xs">
                  <strong className="block text-[#2C2C2A] mb-1 font-semibold">3. Gentle Cleansing</strong>
                  Gently wipe with our included microfiber polishing cloth. Never use harsh chemical ultrasonic dips.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

