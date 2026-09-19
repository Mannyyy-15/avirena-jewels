/**
 * Legacy product handles → current handles.
 *
 * Ported from `vercel.json` on the Vite site. These are REAL indexed URLs from
 * a pre-rebrand handle change; without these redirects they 404 on cutover and
 * the site loses whatever ranking and backlinks they carry.
 *
 * This site is headless, so Shopify's own URL redirects never fire for the
 * storefront — this map is the only thing preserving them.
 */
export const LEGACY_PRODUCT_HANDLES: Record<string, string> = {
  'geometric-gold-tone-statement-earrings-for-women-modern-square-earrings':
    'avirena-square-studs-gold-tone-brass-earrings',
  'gold-tone-drop-earrings-for-women-minimalist-long-dangle-earrings':
    'avirena-drop-earrings-gold-tone-brass',
  'gold-tone-statement-drop-earrings-for-women-geometric-dangle-earrings':
    'avirena-statement-drops-geometric-brass-earrings',
  'nadir-square-studs-gold-tone-brass-earrings':
    'avirena-square-studs-gold-tone-brass-earrings',
  'lume-drop-earrings-gold-tone-brass': 'avirena-drop-earrings-gold-tone-brass',
  'forma-statement-drops-geometric-brass-earrings':
    'avirena-statement-drops-geometric-brass-earrings',
  'amara-heart-drops-silver-tone-earrings':
    'avirena-heart-drops-silver-tone-earrings',
  'volute-spiral-earrings-silver-tone': 'avirena-spiral-earrings-silver-tone',
  'solene-crystal-hoops-gold-tone-earrings':
    'avirena-crystal-hoops-gold-tone-earrings',
  'solene-crystal-hoops-silver-tone-earrings':
    'avirena-crystal-hoops-silver-tone-earrings',
  'petra-pebble-studs-gold-tone-earrings':
    'avirena-pebble-studs-gold-tone-earrings',
  'foglia-leaf-studs-gold-tone-earrings':
    'avirena-leaf-studs-gold-tone-earrings',
};

/** The current handle for a legacy one, or null if it is not a legacy handle. */
export function resolveLegacyHandle(handle: string): string | null {
  return LEGACY_PRODUCT_HANDLES[handle] ?? null;
}
