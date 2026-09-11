import type { RefObject } from 'react';
import gsap from 'gsap';

/**
 * Runs a GSAP context once the elements it animates actually exist.
 *
 * The site is prerendered and mounted with `createRoot` (not `hydrateRoot`), so
 * on first paint the DOM is a static skeleton and React replaces it wholesale a
 * beat later. A page effect that runs on mount therefore fires while none of
 * its animation targets are in the DOM yet: GSAP logs "Invalid scope" /
 * "target not found", and - worse - the entrance animation silently never
 * plays, because effects with `[]` deps never run again.
 *
 * This waits for `readySelector` to appear (via MutationObserver, capped by
 * `timeoutMs`) before building the context, and reverts cleanly on unmount.
 *
 * @param scope         Container ref the context is scoped to.
 * @param readySelector Selector that signals the real content has mounted.
 * @param build         Animation setup, run inside the scoped context.
 * @returns             Cleanup function for the effect.
 */
export function revealWhenReady(
  scope: RefObject<HTMLElement | null>,
  readySelector: string,
  build: () => void,
  timeoutMs = 4000,
): () => void {
  let ctx: gsap.Context | null = null;
  let observer: MutationObserver | null = null;
  let timeoutId: number | null = null;
  let cancelled = false;

  const start = () => {
    if (cancelled || ctx) return false;
    const root = scope.current;
    if (!root || !root.querySelector(readySelector)) return false;

    ctx = gsap.context(build, scope);
    return true;
  };

  if (!start()) {
    observer = new MutationObserver(() => {
      if (start()) {
        observer?.disconnect();
        observer = null;
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Stop watching even if the content never arrives, so a failed catalog
    // load cannot leave an observer running for the life of the page.
    timeoutId = window.setTimeout(() => {
      observer?.disconnect();
      observer = null;
    }, timeoutMs);
  }

  return () => {
    cancelled = true;
    if (timeoutId !== null) clearTimeout(timeoutId);
    observer?.disconnect();
    ctx?.revert();
  };
}
