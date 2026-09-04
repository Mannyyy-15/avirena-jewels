import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface ProductImageLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
  productName: string;
}

export const ProductImageLightbox: React.FC<ProductImageLightboxProps> = ({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
  productName,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Touch gesture refs
  const lastTouchRef = useRef<{ x: number; y: number } | null>(null);
  const lastTouchDistanceRef = useRef<number | null>(null);
  const lastTapTimeRef = useRef<number>(0);
  const swipeStartXRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);

  // Sync initial index when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setScale(1);
      setPosition({ x: 0, y: 0 });
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, initialIndex]);

  // Reset zoom & pan when image index changes
  const changeImage = useCallback((newIndex: number) => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setCurrentIndex(newIndex);
  }, []);

  const handlePrev = useCallback(() => {
    if (images.length <= 1) return;
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    changeImage(prevIndex);
  }, [currentIndex, images.length, changeImage]);

  const handleNext = useCallback(() => {
    if (images.length <= 1) return;
    const nextIndex = (currentIndex + 1) % images.length;
    changeImage(nextIndex);
  }, [currentIndex, images.length, changeImage]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext]);

  if (!isOpen || !images || images.length === 0) return null;

  // Double-tap or double-click to toggle zoom (1x <-> 2.5x)
  const handleDoubleTap = (clientX: number, clientY: number, targetRect: DOMRect) => {
    if (scale > 1) {
      // Reset zoom
      setScale(1);
      setPosition({ x: 0, y: 0 });
    } else {
      // Zoom in centered around tap point
      const targetScale = 2.5;
      const offsetX = (targetRect.width / 2 - (clientX - targetRect.left)) * (targetScale - 1);
      const offsetY = (targetRect.height / 2 - (clientY - targetRect.top)) * (targetScale - 1);
      setScale(targetScale);
      setPosition({ x: offsetX, y: offsetY });
    }
  };

  // Touch handlers for Pinch, Pan, Double-Tap, and Swipe
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      // Pinch start
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      lastTouchDistanceRef.current = dist;
    } else if (e.touches.length === 1) {
      const touch = e.touches[0];
      lastTouchRef.current = { x: touch.clientX, y: touch.clientY };
      swipeStartXRef.current = touch.clientX;
      isDraggingRef.current = true;

      // Detect double-tap (< 280ms)
      const now = Date.now();
      if (now - lastTapTimeRef.current < 280) {
        const rect = e.currentTarget.getBoundingClientRect();
        handleDoubleTap(touch.clientX, touch.clientY, rect);
        lastTapTimeRef.current = 0;
      } else {
        lastTapTimeRef.current = now;
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2 && lastTouchDistanceRef.current !== null) {
      // Pinch gesture
      e.preventDefault();
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const delta = dist / lastTouchDistanceRef.current;
      setScale((prevScale) => Math.max(1, Math.min(3.5, prevScale * delta)));
      lastTouchDistanceRef.current = dist;
    } else if (e.touches.length === 1 && isDraggingRef.current && lastTouchRef.current) {
      const touch = e.touches[0];
      const deltaX = touch.clientX - lastTouchRef.current.x;
      const deltaY = touch.clientY - lastTouchRef.current.y;

      if (scale > 1) {
        // Pan within zoomed image
        e.preventDefault();
        const maxPan = (scale - 1) * 250;
        setPosition((prev) => ({
          x: Math.max(-maxPan, Math.min(maxPan, prev.x + deltaX)),
          y: Math.max(-maxPan, Math.min(maxPan, prev.y + deltaY)),
        }));
      }
      lastTouchRef.current = { x: touch.clientX, y: touch.clientY };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    lastTouchDistanceRef.current = null;
    isDraggingRef.current = false;

    // Handle horizontal swipe navigation if at 1x scale
    if (scale === 1 && swipeStartXRef.current !== null && e.changedTouches.length > 0) {
      const endX = e.changedTouches[0].clientX;
      const diffX = endX - swipeStartXRef.current;
      if (diffX > 50) {
        handlePrev();
      } else if (diffX < -50) {
        handleNext();
      }
    }
    swipeStartXRef.current = null;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="High-resolution product image viewer"
      className="fixed inset-0 z-[9999] bg-[#12110E]/97 backdrop-blur-md flex flex-col justify-between overflow-hidden select-none animate-in fade-in duration-200"
    >
      {/* Top Header */}
      <header className="relative w-full z-20 flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[#FAF8F5]/10 bg-[#12110E]/60 backdrop-blur-sm">
        <div className="flex flex-col text-left max-w-[60%] truncate">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#D8D2C2]/70 font-medium">
            AVIRENA • Studio Detail
          </span>
          <h3 className="font-serif-display text-sm sm:text-base text-[#FAF8F5] truncate font-light">
            {productName}
          </h3>
        </div>

        {/* Counter Badge */}
        <div className="text-xs tracking-wider text-[#FAF8F5]/80 font-mono bg-[#FAF8F5]/10 px-2.5 py-1 rounded-full border border-[#FAF8F5]/10">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="p-2.5 sm:p-2 rounded-full bg-[#FAF8F5]/10 hover:bg-[#FAF8F5]/25 active:scale-95 text-[#FAF8F5] transition-all cursor-pointer border border-[#FAF8F5]/15 focus:outline-none focus:ring-2 focus:ring-[#D8D2C2]"
          aria-label="Close image viewer"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* Main Interactive Viewer Canvas */}
      <main
        className="relative flex-1 w-full flex items-center justify-center overflow-hidden touch-none cursor-grab active:cursor-grabbing px-2 sm:px-8 py-2"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onDoubleClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          handleDoubleTap(e.clientX, e.clientY, rect);
        }}
      >
        {/* Active High-Res Image */}
        <div
          className="relative max-w-full max-h-full flex items-center justify-center transition-transform duration-100 ease-out"
          style={{
            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
            transformOrigin: 'center center',
          }}
        >
          <img
            src={images[currentIndex]}
            alt={`${productName} view ${currentIndex + 1}`}
            referrerPolicy="no-referrer"
            className="max-h-[72vh] sm:max-h-[78vh] w-auto max-w-[92vw] sm:max-w-[80vw] object-contain rounded-xs shadow-2xl pointer-events-none"
            loading="eager"
            decoding="sync"
          />
        </div>

        {/* Prev / Next Chevrons (Desktop & Tablet) */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-3 sm:p-3.5 rounded-full bg-[#12110E]/80 hover:bg-[#FAF8F5] hover:text-[#12110E] text-[#FAF8F5] border border-[#FAF8F5]/15 transition-all cursor-pointer shadow-lg active:scale-95 z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-3 sm:p-3.5 rounded-full bg-[#12110E]/80 hover:bg-[#FAF8F5] hover:text-[#12110E] text-[#FAF8F5] border border-[#FAF8F5]/15 transition-all cursor-pointer shadow-lg active:scale-95 z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Quick Zoom Controls Floating Pill */}
        <div className="absolute bottom-3 sm:bottom-4 right-4 sm:right-8 z-10 flex items-center gap-1.5 bg-[#12110E]/85 border border-[#FAF8F5]/15 rounded-full px-2 py-1 shadow-md backdrop-blur-xs">
          <button
            type="button"
            onClick={() => setScale((s) => Math.min(3.5, s + 0.5))}
            className="p-1.5 text-[#FAF8F5]/80 hover:text-[#FAF8F5] transition-colors cursor-pointer"
            title="Zoom In"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <span className="text-[10px] text-[#FAF8F5]/70 font-mono w-9 text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            onClick={() => {
              setScale((s) => Math.max(1, s - 0.5));
              if (scale <= 1.5) setPosition({ x: 0, y: 0 });
            }}
            className="p-1.5 text-[#FAF8F5]/80 hover:text-[#FAF8F5] transition-colors cursor-pointer"
            title="Zoom Out"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          {scale > 1 && (
            <button
              type="button"
              onClick={() => {
                setScale(1);
                setPosition({ x: 0, y: 0 });
              }}
              className="p-1.5 text-[#D8D2C2] hover:text-white transition-colors cursor-pointer border-l border-[#FAF8F5]/15 pl-1.5"
              title="Reset Zoom"
              aria-label="Reset zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </main>

      {/* Bottom Thumbnails & Micro Instructions */}
      <footer className="relative w-full z-20 flex flex-col items-center justify-center gap-2 px-4 py-3 border-t border-[#FAF8F5]/10 bg-[#12110E]/70 backdrop-blur-sm">
        {/* Thumbnails row */}
        {images.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto max-w-full py-0.5 no-scrollbar">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => changeImage(idx)}
                className={`w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-xs overflow-hidden border transition-all cursor-pointer ${
                  currentIndex === idx
                    ? 'border-[#FAF8F5] ring-2 ring-[#FAF8F5]/40 scale-105'
                    : 'border-[#FAF8F5]/20 opacity-60 hover:opacity-100'
                }`}
                aria-label={`Switch to image ${idx + 1}`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </button>
            ))}
          </div>
        )}

        {/* User Interaction Hint */}
        <p className="text-[10px] tracking-wider text-[#FAF8F5]/60 uppercase font-sans">
          Double-tap or pinch to inspect details • Swipe to browse
        </p>
      </footer>
    </div>
  );
};
