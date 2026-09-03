import React, { useState } from 'react';
import {
  X,
  Package,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

interface TrackOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TrackingResult {
  orderId: string;
  customerName: string;
  status: 'processing' | 'dispatched' | 'in_transit' | 'delivered';
  courier: string;
  trackingNumber: string;
  estimatedDelivery: string;
  destination: string;
  itemsSummary: string;
  steps: {
    title: string;
    description: string;
    timestamp: string;
    completed: boolean;
    current?: boolean;
  }[];
}

export const TrackOrderModal: React.FC<TrackOrderModalProps> = ({ isOpen, onClose }) => {
  const [orderQuery, setOrderQuery] = useState('');
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [trackingResult, setTrackingResult] = useState<TrackingResult | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery.trim()) return;

    setIsSearching(true);
    setHasSearched(false);

    // Mock tracking data lookup based on query or sample order
    setTimeout(() => {
      setIsSearching(false);
      setHasSearched(true);

      const normalized = orderQuery.toUpperCase().trim();
      setTrackingResult({
        orderId: normalized.startsWith('AV-') ? normalized : `AV-${normalized}`,
        customerName: phoneOrEmail ? phoneOrEmail.split('@')[0] : 'Valued Collector',
        status: 'in_transit',
        courier: 'Bluedart Express Luxury Air / DHL',
        trackingNumber: `BD-${Math.floor(100000000 + Math.random() * 900000000)}`,
        estimatedDelivery: 'Tuesday, Sep 8, 2026 (Before 6:00 PM)',
        destination: 'Bandra West, Mumbai 400050',
        itemsSummary: '1x Aurelia Sculptural Band (18k Gold Vermeil) + Velvet Keepsake Box',
        steps: [
          {
            title: 'Order Verified & Artisan Casting',
            description: 'Handcrafted at Studio Atelier and inspected by master gemologist',
            timestamp: 'Sep 3, 2026 • 11:30 AM',
            completed: true,
          },
          {
            title: 'Sealed & Insured Express Handover',
            description: 'Transferred to secured luxury courier in tamper-evident velvet packaging',
            timestamp: 'Sep 4, 2026 • 03:45 PM',
            completed: true,
          },
          {
            title: 'In Transit — Express Air Freight',
            description: 'Package en route to local delivery hub with 100% transit insurance',
            timestamp: 'Sep 5, 2026 • 08:20 AM',
            completed: true,
            current: true,
          },
          {
            title: 'Out for Doorstep Delivery',
            description: 'Direct courier delivery with OTP / signature verification',
            timestamp: 'Estimated Sep 8, 2026',
            completed: false,
          },
        ],
      });
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans-body">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4 sm:p-6 text-center">
        <div className="relative w-full max-w-2xl transform overflow-hidden rounded-xs bg-[#E7E4D5] border border-[#D8D2C2] text-left shadow-2xl transition-all animate-in zoom-in-95 duration-200 text-[#413C23]">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#D8D2C2] bg-[#F4EFE6] px-6 py-4">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-[#8F896D]" />
              <h3 className="font-serif-display text-xl sm:text-2xl text-[#413C23]">
                Track Your Atelier Package
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-[#8F896D] hover:text-[#413C23] hover:bg-[#E7E4D5] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Search Input Form */}
            <form onSubmit={handleTrack} className="space-y-4 bg-[#FAF8F5] border border-[#D8D2C2] p-5 rounded-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs text-[#413C23] font-semibold uppercase tracking-wider block">
                    Order ID *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AV-84920 or 84920"
                    value={orderQuery}
                    onChange={(e) => setOrderQuery(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F4EFE6] border border-[#D8D2C2] rounded-xs text-xs text-[#413C23] placeholder-[#8F896D]/60 focus:outline-none focus:border-[#8F896D]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-[#413C23] font-semibold uppercase tracking-wider block">
                    Phone / Email (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +91 9876543210 or email"
                    value={phoneOrEmail}
                    onChange={(e) => setPhoneOrEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F4EFE6] border border-[#D8D2C2] rounded-xs text-xs text-[#413C23] placeholder-[#8F896D]/60 focus:outline-none focus:border-[#8F896D]"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                <span className="text-[11px] text-[#8F896D]">
                  Need quick lookup? Try sample ID <strong className="text-[#413C23] cursor-pointer" onClick={() => setOrderQuery('AV-10482')}>AV-10482</strong>
                </span>

                <button
                  type="submit"
                  disabled={isSearching}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#413C23] hover:bg-[#8F896D] text-[#E7E4D5] text-xs uppercase tracking-widest font-semibold rounded-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSearching ? (
                    <span>Looking up Package...</span>
                  ) : (
                    <>
                      <Search className="w-3.5 h-3.5" />
                      <span>Track Order</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Tracking Result View */}
            {trackingResult && (
              <div className="space-y-5 animate-in fade-in duration-300">
                {/* Status Hero Card */}
                <div className="p-5 bg-[#F4EFE6] border border-[#D8D2C2] rounded-xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D8D2C2] pb-3">
                    <div>
                      <span className="text-[10px] text-[#8F896D] uppercase tracking-wider block font-semibold">
                        Order #{trackingResult.orderId}
                      </span>
                      <h4 className="font-serif-display text-xl text-[#413C23] font-medium">
                        Status: In Transit (On Schedule)
                      </h4>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-[#8F896D] uppercase tracking-wider block">Estimated Delivery</span>
                      <span className="text-xs font-bold text-[#413C23] bg-[#E7E4D5] px-2.5 py-1 rounded-xs border border-[#D8D2C2]">
                        {trackingResult.estimatedDelivery}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#413C23]/80">
                    <div>
                      <span className="text-[#8F896D] block text-[11px]">Courier / Tracking AWB:</span>
                      <strong>{trackingResult.courier}</strong> ({trackingResult.trackingNumber})
                    </div>
                    <div>
                      <span className="text-[#8F896D] block text-[11px]">Package Contents:</span>
                      <span>{trackingResult.itemsSummary}</span>
                    </div>
                  </div>
                </div>

                {/* Milestone Timeline */}
                <div className="p-5 bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs space-y-4">
                  <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#8F896D] block">
                    Shipment Milestones
                  </span>

                  <div className="space-y-4 pl-2">
                    {trackingResult.steps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3.5 relative">
                        {/* Vertical line connecting steps */}
                        {idx !== trackingResult.steps.length - 1 && (
                          <div className={`absolute left-3.5 top-6 bottom-0 w-0.5 ${step.completed ? 'bg-[#413C23]' : 'bg-[#D8D2C2]'}`} />
                        )}

                        {/* Step Icon */}
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 ${
                          step.completed
                            ? 'bg-[#413C23] text-[#E7E4D5]'
                            : 'bg-[#E7E4D5] text-[#8F896D] border border-[#D8D2C2]'
                        }`}>
                          {step.completed ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <Clock className="w-4 h-4" />
                          )}
                        </div>

                        {/* Step Details */}
                        <div className="space-y-0.5 text-left pb-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-serif-display text-sm sm:text-base font-medium text-[#413C23]">
                              {step.title}
                            </span>
                            {step.current && (
                              <span className="text-[9px] bg-[#413C23] text-[#E7E4D5] uppercase px-1.5 py-0.2 rounded-full font-bold">
                                Current Status
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#413C23]/75 font-normal leading-relaxed">
                            {step.description}
                          </p>
                          <span className="text-[10px] text-[#8F896D] block font-mono">
                            {step.timestamp}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Direct WhatsApp Track Assistance */}
            <div className="p-4 bg-[#F4EFE6] border border-[#D8D2C2] rounded-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
              <div className="space-y-0.5">
                <span className="font-serif-display text-base text-[#413C23] block">
                  Prefer Live WhatsApp Tracking Updates?
                </span>
                <p className="text-xs text-[#8F896D]">
                  Our concierge team provides instant live package status and courier coordination.
                </p>
              </div>

              <a
                href={`https://wa.me/919820012345?text=Hello%20Avirena,%20Please%20help%20me%20track%20my%20order%20${orderQuery || 'AV-XXXXX'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#FAF8F5] border border-[#D8D2C2] hover:border-[#413C23] text-[#413C23] text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors shrink-0 flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Track on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="border-t border-[#D8D2C2] bg-[#F4EFE6] px-6 py-3 flex items-center justify-between text-[11px] text-[#8F896D]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8F896D]" />
              100% Insured Delivery Transit Guarantee
            </span>
            <button
              onClick={onClose}
              className="text-xs font-semibold text-[#413C23] hover:underline uppercase tracking-wider"
            >
              Close
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
