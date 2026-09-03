import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

let lenisInstance: Lenis | null = null;
let rafId: number | null = null;

export function initSmoothScroll(): () => void {
  if (typeof window === 'undefined') return () => {};

  if (lenisInstance) {
    if (rafId) cancelAnimationFrame(rafId);
    lenisInstance.destroy();
  }

  // Optimized Lenis configuration for 60/120Hz butter-smooth scrolling without micro-jitter
  const lenis = new Lenis({
    duration: 1.0,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    touchMultiplier: 1.0,
    wheelMultiplier: 1.0,
  });

  lenisInstance = lenis;

  // Sync with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  // Clean, high-performance RAF loop (no GSAP ticker lag or double-time stutter)
  function raf(time: number) {
    lenis.raf(time);
    rafId = requestAnimationFrame(raf);
  }
  rafId = requestAnimationFrame(raf);

  return () => {
    if (rafId) cancelAnimationFrame(rafId);
    lenis.destroy();
    lenisInstance = null;
  };
}

export function scrollToTop(): void {
  if (lenisInstance) {
    lenisInstance.scrollTo(0, { immediate: false, duration: 0.8 });
  } else if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}
