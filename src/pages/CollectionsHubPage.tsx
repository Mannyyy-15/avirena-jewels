import React, { useRef } from 'react';
import { ArrowRight, Gem, ArrowUpRight } from 'lucide-react';
import { Product, Currency, Category } from '../types';

interface CollectionsHubPageProps {
  onNavigateToCategory: (category: Category) => void;
  onSelectProduct: (product: Product) => void;
  currency: Currency;
  catalogProducts?: Product[];
  /** False until the live Shopify catalog fetch has settled. */
  isCatalogReady?: boolean;
}

interface CollectionSuite {
  id: string;
  title: string;
  subtitle: string;
  category: Category;
  description: string;
  coverImage: string;
  featuredProductId: string;
}

const SUITES: CollectionSuite[] = [
  {
    id: 'rings-bands',
    title: 'Molten Gold Bands & Rings',
    subtitle: 'Lost-Wax Sculpted Silhouettes',
    category: 'rings',
    description: 'Organic contours, molten ridges, and sculpted geometric bands crafted in premium gold-tone brass alloy.',
    coverImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85',
    featuredProductId: 'row-edge-ring',
  },
  {
    id: 'chains-necklaces',
    title: 'Architectural Figaro & Solitaires',
    subtitle: 'Geometric Weight & Balance',
    category: 'necklaces',
    description: 'Chunky interlocking links, minimal chokers, and baroque pearl drops designed for effortless stacking.',
    coverImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85',
    featuredProductId: 'square-form-necklace',
  },
  {
    id: 'molten-earrings',
    title: 'Sculptural Molten Ear Artifacts',
    subtitle: 'Vortices, Hoops & Spheres',
    category: 'earrings',
    description: 'Featherweight hollow-core dome studs, spiraling vortices, and bold huggies with high-polished mirror luster.',
    coverImage: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1200&q=85',
    featuredProductId: 'lucid-studs',
  },
  {
    id: 'cuffs-bracelets',
    title: 'Open Wire Cuffs & Bangles',
    subtitle: 'Fluid Ergonomic Wristwear',
    category: 'bracelets',
    description: 'Hand-shaped malleable wire cuffs tipped with natural freshwater pearls and architectural bar bangles.',
    coverImage: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=1200&q=85',
    featuredProductId: 'two-pearl-cuff',
  },
  {
    id: 'kinetic-brooches',
    title: 'Kinetic Ribbons & Modern Pins',
    subtitle: 'Sculpted Statement Accents',
    category: 'brooches',
    description: 'Fluid kinetic ribbons in silver-tone and gold-tone brass alloy that elevate silk scarves, lapels, and knitwear.',
    coverImage: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1200&q=85',
    featuredProductId: 'solid-wave-brooch',
  },
];

export const CollectionsHubPage: React.FC<CollectionsHubPageProps> = ({
  onNavigateToCategory,
  onSelectProduct,
  currency,
  catalogProducts = [],
  isCatalogReady = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Counts come from the live Shopify catalog only. There is no mock fallback:
  // an unstocked category honestly reads 0 rather than borrowing a placeholder.
  const countFor = (cat: Category) =>
    catalogProducts.filter((p) => p.category === cat).length;

  const categories: { id: Category; label: string; count: number }[] = [
    { id: 'all', label: 'All Pieces', count: catalogProducts.length },
    { id: 'rings', label: 'Rings', count: countFor('rings') },
    { id: 'necklaces', label: 'Necklaces', count: countFor('necklaces') },
    { id: 'earrings', label: 'Earrings', count: countFor('earrings') },
    { id: 'bracelets', label: 'Bracelets', count: countFor('bracelets') },
    { id: 'brooches', label: 'Brooches', count: countFor('brooches') },
  ];

  return (
    <div ref={containerRef} className="pb-24 font-sans-body w-full text-[#413C23] bg-[#E7E4D5] select-none">
      
      {/* 1. EDITORIAL HERO BANNER */}
      <section className="relative w-full bg-[#413C23] text-[#E7E4D5] min-h-[380px] sm:min-h-[460px] flex flex-col justify-between p-6 sm:p-10 md:p-14 lg:px-16 2xl:px-20 select-none overflow-hidden border-b border-[#D8D2C2]">
        <div className="w-full flex items-center justify-between text-[10px] sm:text-xs uppercase tracking-[0.25em] font-medium text-[#8F896D] z-20">
          <span>(01) / The Maison Archives</span>
          <span className="text-[#E7E4D5]/75 hidden sm:inline-block">Curated Suites • {SUITES.length} Categories</span>
        </div>

        {/* Background Atmosphere Image Blend */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1800&q=90"
            alt="Avirena Collections Archive"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-[center_35%] opacity-35 filter contrast-110 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#413C23] via-[#413C23]/65 to-[#413C23]/40" />
        </div>

        <div className="w-full z-20 pt-16 sm:pt-24 text-left max-w-4xl space-y-3">
          <span className="text-[11px] uppercase tracking-[0.3em] font-semibold text-[#8F896D] block">
            Permanent Suites
          </span>
          <h1 className="font-serif-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-light text-[#E7E4D5] tracking-tight leading-[0.9] drop-shadow-md">
            Collections & <span className="italic font-normal text-[#FAF8F5]">Suites</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#E7E4D5]/80 font-normal max-w-xl leading-relaxed pt-2">
            Explore our permanent design suites crafted in anti-tarnish brass with protective gold-tone and silver-tone finishes, and cultured baroque pearls.
          </p>
        </div>
      </section>

      {/* 2. CATEGORY JUMP TABS BAR */}
      <section className="sticky top-0 z-30 w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-3.5 bg-[#E7E4D5]/95 backdrop-blur-md border-b border-[#D8D2C2]">
        <div className="w-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => {
              // Categories with no live inventory stay clickable (the route is
              // real and reachable) but are visually de-emphasised and labelled
              // so nobody is sent to an empty grid without warning.
              const isEmpty = isCatalogReady && cat.count === 0;
              return (
                <button
                  key={cat.id}
                  onClick={() => onNavigateToCategory(cat.id)}
                  title={isEmpty ? `${cat.label} — coming soon` : undefined}
                  className={`text-xs px-4 py-2 rounded-xs transition-all cursor-pointer font-medium uppercase tracking-wider shrink-0 flex items-center gap-1.5 border ${
                    isEmpty
                      ? 'bg-transparent text-[#413C23]/45 border-dashed border-[#D8D2C2] hover:text-[#413C23]/70'
                      : 'bg-[#F2EFDB] hover:bg-[#FAF8F5] text-[#413C23] border-[#D8D2C2] hover:border-[#8F896D]'
                  }`}
                >
                  <span>{cat.label}</span>
                  {isEmpty ? (
                    <span className="text-[9px] tracking-[0.15em] text-[#8F896D]">Soon</span>
                  ) : (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#E7E4D5] text-[#8F896D]">
                      {isCatalogReady ? cat.count : '—'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => onNavigateToCategory('all')}
            className="hidden md:inline-flex items-center gap-1 text-xs font-semibold text-[#413C23] hover:text-[#8F896D] transition-colors uppercase tracking-widest shrink-0 cursor-pointer"
          >
            <span>View All Pieces</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* 3. CURATED SUITES GRID */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-12 sm:py-20">
        <div className="w-full space-y-10 sm:space-y-14">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#D8D2C2] pb-4 text-left gap-3">
            <div>
              <span className="text-[10px] text-[#8F896D] uppercase tracking-widest font-semibold block mb-1">
                (02) / Design Suites
              </span>
              <h2 className="font-serif-display text-3xl sm:text-5xl text-[#413C23] font-light">
                Designed in Sets. <span className="italic font-normal">Worn Forever.</span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#413C23]/70 font-normal max-w-md">
              Each suite represents a cohesive sculptural narrative—engineered to complement and stack harmoniously.
            </p>
          </div>

          {/* Collection Suites Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {SUITES.map((suite, idx) => {
              // Only ever a REAL product from the live Shopify catalog. When the
              // suite has no live inventory this is undefined and the "Signature
              // Piece" block is replaced by an honest "coming soon" note — never
              // by a mock product with stock photography.
              const suiteProducts = catalogProducts.filter((p) => p.category === suite.category);
              const featuredProduct =
                suiteProducts.find((p) => p.handle === suite.featuredProductId) ||
                suiteProducts.find((p) => p.id === suite.featuredProductId) ||
                suiteProducts[0];

              return (
                <div
                  key={suite.id}
                  onClick={() => onNavigateToCategory(suite.category)}
                  className="group cursor-pointer flex flex-col justify-between bg-[#F2EFDB] border border-[#D8D2C2] rounded-xs overflow-hidden transition-all duration-300 hover:shadow-md hover:border-[#8F896D] text-left"
                >
                  {/* Suite Image Header */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#E7E4D5]">
                    <img
                      src={suite.coverImage}
                      alt={suite.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent pointer-events-none" />
                    
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
                      <span className="text-[10px] uppercase tracking-widest font-semibold text-[#D4AF37]">
                        (0{idx + 1})
                      </span>
                      <span className="text-[11px] font-medium bg-[#413C23]/80 backdrop-blur-xs px-2.5 py-0.5 rounded-xs border border-white/20">
                        {!isCatalogReady
                          ? '—'
                          : suiteProducts.length === 0
                          ? 'Coming Soon'
                          : `${suiteProducts.length} ${suiteProducts.length === 1 ? 'Style' : 'Styles'}`}
                      </span>
                    </div>
                  </div>

                  {/* Suite Copy */}
                  <div className="p-6 space-y-4 flex flex-col justify-between flex-1">
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase tracking-widest text-[#8F896D] font-semibold block">
                        {suite.subtitle}
                      </span>
                      <h3 className="font-serif-display text-xl sm:text-2xl text-[#413C23] group-hover:text-[#8F896D] transition-colors font-medium">
                        {suite.title}
                      </h3>
                      <p className="text-xs text-[#413C23]/75 font-normal leading-relaxed pt-1">
                        {suite.description}
                      </p>
                    </div>

                    {/* Featured Piece Highlight */}
                    <div className="pt-3.5 border-t border-[#D8D2C2] flex items-center justify-between">
                      {featuredProduct ? (
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 bg-[#FAF8F5] border border-[#D8D2C2] rounded-xs flex items-center justify-center p-1">
                            <img
                              src={featuredProduct.images[0]}
                              alt={featuredProduct.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-contain mix-blend-multiply"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-[#8F896D] uppercase tracking-wider block font-medium">Signature Piece</span>
                            <span className="text-xs font-serif-display text-[#413C23] font-medium truncate block max-w-[140px]">
                              {featuredProduct.name}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 bg-[#FAF8F5] border border-dashed border-[#D8D2C2] rounded-xs flex items-center justify-center">
                            <Gem className="w-4 h-4 text-[#8F896D]" />
                          </div>
                          <div>
                            <span className="text-[10px] text-[#8F896D] uppercase tracking-wider block font-medium">
                              {isCatalogReady ? 'In Development' : 'Loading'}
                            </span>
                            <span className="text-xs font-serif-display text-[#413C23]/70 font-medium block">
                              {isCatalogReady ? 'Not yet released' : '—'}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#413C23] group-hover:text-[#8F896D] transition-colors uppercase tracking-wider">
                          <span>View Suite</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. BOTTOM PILLARS GUARANTEE STRIP */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 pt-4">
        <div className="bg-[#FAF8F5] border border-[#D8D2C2] p-8 sm:p-12 rounded-xs text-center space-y-6 max-w-7xl mx-auto shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#8F896D] block">Everyday Durability</span>
              <p className="font-serif-display text-lg sm:text-xl text-[#413C23]">Anti-Tarnish E-Coating</p>
            </div>
            <div className="space-y-1 border-y sm:border-y-0 sm:border-x border-[#D8D2C2] py-4 sm:py-0">
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#8F896D] block">Skin Safe</span>
              <p className="font-serif-display text-lg sm:text-xl text-[#413C23]">Nickel & Lead Free</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#8F896D] block">Maison Standard</span>
              <p className="font-serif-display text-lg sm:text-xl text-[#413C23]">Natural Baroque Pearls</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
