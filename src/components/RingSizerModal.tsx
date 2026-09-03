import React, { useState } from 'react';
import { X, Ruler, Sparkles, Check, Info } from 'lucide-react';

interface RingSizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSize?: (size: string) => void;
}

interface SizeRow {
  us: string;
  uk: string;
  eu: string;
  india: string;
  diameterMm: number;
  circumferenceMm: number;
}

const SIZE_CHART: SizeRow[] = [
  { us: '5', uk: 'J 1/2', eu: '49', india: '9', diameterMm: 15.7, circumferenceMm: 49.3 },
  { us: '6', uk: 'L 1/2', eu: '51.5', india: '12', diameterMm: 16.5, circumferenceMm: 51.8 },
  { us: '7', uk: 'N 1/2', eu: '54', india: '14', diameterMm: 17.3, circumferenceMm: 54.4 },
  { us: '8', uk: 'P 1/2', eu: '56.5', india: '16', diameterMm: 18.1, circumferenceMm: 56.9 },
  { us: '9', uk: 'R 1/2', eu: '59', india: '18', diameterMm: 18.9, circumferenceMm: 59.5 },
  { us: '10', uk: 'T 1/2', eu: '61.5', india: '20', diameterMm: 19.8, circumferenceMm: 62.1 },
];

export const RingSizerModal: React.FC<RingSizerModalProps> = ({
  isOpen,
  onClose,
  onSelectSize,
}) => {
  const [activeTab, setActiveTab] = useState<'gauge' | 'chart'>('gauge');
  const [sliderDiameter, setSliderDiameter] = useState<number>(17.3); // Default US 7

  if (!isOpen) return null;

  // Find closest size for slider
  const closestSize = SIZE_CHART.reduce((prev, curr) =>
    Math.abs(curr.diameterMm - sliderDiameter) < Math.abs(prev.diameterMm - sliderDiameter) ? curr : prev
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans-body">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4 sm:p-6 text-center">
        <div className="relative w-full max-w-xl transform overflow-hidden rounded-xs bg-[#E7E4D5] border border-[#D8D2C2] text-left shadow-2xl transition-all animate-in zoom-in-95 duration-200 text-[#413C23]">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#D8D2C2] bg-[#F4EFE6] px-6 py-4">
            <div className="flex items-center gap-2">
              <Ruler className="w-4 h-4 text-[#8F896D]" />
              <h3 className="font-serif-display text-xl sm:text-2xl text-[#413C23]">
                Atelier Ring Size & Fit Guide
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-[#8F896D] hover:text-[#413C23] hover:bg-[#E7E4D5] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-[#D8D2C2] bg-[#E7E4D5] px-6 pt-3 gap-4 text-xs font-semibold uppercase tracking-wider">
            <button
              onClick={() => setActiveTab('gauge')}
              className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'gauge'
                  ? 'border-[#413C23] text-[#413C23]'
                  : 'border-transparent text-[#8F896D] hover:text-[#413C23]'
              }`}
            >
              Interactive On-Screen Caliper
            </button>
            <button
              onClick={() => setActiveTab('chart')}
              className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'chart'
                  ? 'border-[#413C23] text-[#413C23]'
                  : 'border-transparent text-[#8F896D] hover:text-[#413C23]'
              }`}
            >
              International Sizing Chart
            </button>
          </div>

          {/* Content Body */}
          <div className="p-6 space-y-6">
            {activeTab === 'gauge' ? (
              <div className="space-y-6">
                <div className="bg-[#FAF8F5] border border-[#D8D2C2] p-4 rounded-xs text-xs text-[#413C23]/80 leading-relaxed flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-[#8F896D] shrink-0 mt-0.5" />
                  <span>
                    Place an existing well-fitting ring directly on your screen. Adjust the slider until the golden circle perfectly aligns with the <strong>inside edge</strong> of your ring.
                  </span>
                </div>

                {/* Visual Ring Gauge Circle */}
                <div className="py-6 flex flex-col items-center justify-center bg-[#F4EFE6] border border-[#D8D2C2] rounded-xs space-y-4">
                  <div
                    className="rounded-full border-2 border-[#8F896D] bg-[#FAF8F5]/80 flex items-center justify-center shadow-inner transition-all duration-100 relative"
                    style={{
                      width: `${sliderDiameter * 8}px`,
                      height: `${sliderDiameter * 8}px`,
                      maxWidth: '220px',
                      maxHeight: '220px',
                    }}
                  >
                    <div className="text-center pointer-events-none">
                      <span className="font-serif-display text-2xl sm:text-3xl text-[#413C23] font-light block">
                        US {closestSize.us}
                      </span>
                      <span className="text-[10px] text-[#8F896D] uppercase tracking-wider font-medium">
                        {sliderDiameter.toFixed(1)} mm
                      </span>
                    </div>
                  </div>

                  <div className="w-full px-8 space-y-2">
                    <div className="flex justify-between text-[11px] text-[#8F896D] font-medium">
                      <span>Smaller (15.0 mm)</span>
                      <span>Diameter: {sliderDiameter.toFixed(1)} mm</span>
                      <span>Larger (20.5 mm)</span>
                    </div>
                    <input
                      type="range"
                      min="15.0"
                      max="20.5"
                      step="0.1"
                      value={sliderDiameter}
                      onChange={(e) => setSliderDiameter(parseFloat(e.target.value))}
                      className="w-full accent-[#413C23] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Recommended Size Output */}
                <div className="p-4 bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#8F896D] block font-semibold">
                      Calculated Match
                    </span>
                    <p className="font-serif-display text-lg text-[#413C23] font-medium">
                      Size US {closestSize.us} • EU {closestSize.eu} • India {closestSize.india} • UK {closestSize.uk}
                    </p>
                  </div>

                  {onSelectSize && (
                    <button
                      onClick={() => {
                        onSelectSize(`Size ${closestSize.us}`);
                        onClose();
                      }}
                      className="px-5 py-2 bg-[#413C23] hover:bg-[#8F896D] text-[#E7E4D5] text-xs uppercase tracking-widest font-semibold rounded-xs transition-all cursor-pointer whitespace-nowrap shadow-xs"
                    >
                      Select Size {closestSize.us}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* International Size Chart Table */
              <div className="space-y-4">
                <p className="text-xs text-[#413C23]/80">
                  All Avirena rings are engineered with comfort-fit curves. If you are between sizes, we recommend sizing up.
                </p>

                <div className="overflow-x-auto border border-[#D8D2C2] rounded-xs bg-[#FAF8F5]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F4EFE6] text-[#413C23] border-b border-[#D8D2C2] font-serif-display text-sm uppercase tracking-wider">
                      <tr>
                        <th className="p-3">US / Canada</th>
                        <th className="p-3">UK / Australia</th>
                        <th className="p-3">EU</th>
                        <th className="p-3">India / Asia</th>
                        <th className="p-3">Diameter (mm)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#D8D2C2]">
                      {SIZE_CHART.map((row) => (
                        <tr
                          key={row.us}
                          className="hover:bg-[#E7E4D5]/60 transition-colors cursor-pointer"
                          onClick={() => {
                            if (onSelectSize) {
                              onSelectSize(`Size ${row.us}`);
                              onClose();
                            }
                          }}
                        >
                          <td className="p-3 font-semibold text-[#413C23]">US {row.us}</td>
                          <td className="p-3 text-[#413C23]/80">{row.uk}</td>
                          <td className="p-3 text-[#413C23]/80">{row.eu}</td>
                          <td className="p-3 text-[#413C23]/80">{row.india}</td>
                          <td className="p-3 text-[#8F896D] font-mono">{row.diameterMm} mm</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="border-t border-[#D8D2C2] bg-[#F4EFE6] px-6 py-3 flex items-center justify-between text-[11px] text-[#8F896D]">
            <span>Need custom bespoke sizing? Message our WhatsApp Concierge.</span>
            <button
              onClick={onClose}
              className="text-xs font-semibold text-[#413C23] hover:underline uppercase tracking-wider"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
