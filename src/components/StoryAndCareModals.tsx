import React from 'react';
import { X, ShieldCheck } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StoryModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans-body select-none">
      <div
        className="fixed inset-0 bg-[#413C23]/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div className="min-h-screen px-4 flex items-center justify-center py-12">
        <div className="inline-block w-full max-w-3xl bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs p-6 sm:p-10 text-left align-middle shadow-2xl animate-in zoom-in-95 duration-200 z-10 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#D8D2C2]">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#413C23]" />
              <span className="text-xs uppercase tracking-[0.25em] text-[#8F896D] font-semibold">
                The Avirena Ethos · Est. 2020
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
            <h2 className="font-serif-display text-3xl sm:text-4xl text-[#413C23] leading-tight font-normal">
              “Crafted to be lived in every day.”
            </h2>

            <p className="text-sm font-normal leading-relaxed text-[#413C23]/85">
              Founded in 2020 during the COVID lockdown as a homegrown creative project, <strong className="text-[#413C23] font-semibold">AVIRENA</strong> started with small, thoughtful jewelry creations for our local community. Today, we have built a distinctive modern label focused on accessible daily luxury.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#D8D2C2]">
              <div className="space-y-2">
                <h4 className="font-serif-display text-lg text-[#413C23] font-medium">Conscious Everyday Luxury</h4>
                <p className="text-xs text-[#413C23]/75 leading-relaxed font-normal">
                  We consciously avoid overpriced solid gold or mined diamond markups. Instead, every piece is cast in durable, skin-friendly brass alloy, finished with a water-resistant protective coating and sealed with an anti-tarnish protective barrier.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-serif-display text-lg text-[#413C23] font-medium">Sculptural Modern Design</h4>
                <p className="text-xs text-[#413C23]/75 leading-relaxed font-normal">
                  Rejecting generic fast-fashion trends, our pieces explore architectural curves, fluid molten textures, and organic cultured pearls sculpted for all-day comfort.
                </p>
              </div>
            </div>

            <div className="bg-[#F2EFDB] p-5 rounded-xs flex items-center gap-4 border border-[#D8D2C2]">
              <p className="text-xs text-[#413C23] italic font-normal">
                “True daily luxury is how effortless, confident, and comfortable a piece feels on your skin from morning to night.”
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
        className="fixed inset-0 bg-[#413C23]/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div className="min-h-screen px-4 flex items-center justify-center py-12">
        <div className="inline-block w-full max-w-3xl bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs p-6 sm:p-10 text-left align-middle shadow-2xl animate-in zoom-in-95 duration-200 z-10 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#D8D2C2]">
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
            <h2 className="font-serif-display text-3xl text-[#413C23] font-normal">
              Preserving Your Piece&apos;s Warm Luster
            </h2>

            <div className="space-y-4 text-xs leading-relaxed text-[#413C23]/80 font-normal">
              <div className="p-4 bg-[#F2EFDB] border border-[#D8D2C2] rounded-xs">
                <h4 className="font-semibold text-sm text-[#413C23] mb-1">Our Materials &amp; Anti-Tarnish Finish</h4>
                <p>
                  Our jewels are crafted with premium brass alloy and finished with modern gold-tone and silver-tone protective coatings. Sealed with a protective anti-tarnish barrier, they are hypoallergenic and sweat-resistant for daily wear.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-3.5 bg-[#F2EFDB] border border-[#D8D2C2] rounded-xs">
                  <strong className="block text-[#413C23] mb-1 font-semibold">1. Put On Last</strong>
                  Put your jewelry on after applying perfumes, lotions, sanitizers, and hair sprays.
                </div>
                <div className="p-3.5 bg-[#F2EFDB] border border-[#D8D2C2] rounded-xs">
                  <strong className="block text-[#413C23] mb-1 font-semibold">2. Keep Dry &amp; Stored</strong>
                  Store separately in your complimentary pouch away from high humidity when not in use.
                </div>
                <div className="p-3.5 bg-[#F2EFDB] border border-[#D8D2C2] rounded-xs">
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
