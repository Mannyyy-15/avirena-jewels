import React, { useRef } from 'react';
import { ArrowRight, Sparkles, Gem, ArrowUpRight } from 'lucide-react';
import { Product, Currency, Category } from '../types';
import { PRODUCTS, formatPrice } from '../data/products';

interface CollectionsHubPageProps {
  onNavigateToCategory: (category: Category) => void;
  onSelectProduct: (product: Product) => void;
  currency: Currency;
  catalogProducts?: Product[];
}

interface CollectionSuite {
  id: string;
  title: string;
  subtitle: string;
  category: Category;
  description: string;
  coverImage: string;
  pieceCount: string;
  featuredProductId: string;
}

const SUITES: CollectionSuite[] = [
  {
    id: 'rings-bands',
    title: 'Molten Gold Bands & Rings',
    subtitle: 'Lost-Wax Sculpted Silhouettes',
    category: 'rings',
    description: 'Organic gold contours, molten ridges, and diamond-paved geometric bands cast in thick 18k vermeil.',
    coverImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85',
    pieceCount: '6 Unique Styles',
    featuredProductId: 'row-edge-ring',
  },
  {
    id: 'chains-necklaces',
    title: 'Architectural Figaro & Solitaires',
    subtitle: 'Geometric Weight & Balance',
    category: 'necklaces',
    description: 'Chunky interlocking figaro links, minimal Y-chokers, and baroque pearl drops designed for effortless stacking.',
    coverImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85',
    pieceCount: '8 Unique Styles',
    featuredProductId: 'square-form-necklace',
  },
  {
    id: 'molten-earrings',
    title: 'Sculptural Molten Ear Artifacts',
    subtitle: 'Vortices, Hoops & Spheres',
    category: 'earrings',
    description: 'Featherweight hollow-core dome studs, spiraling vortices, and bold huggies with high-polished mirror luster.',
    coverImage: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1200&q=85',
    pieceCount: '7 Unique Styles',
    featuredProductId: 'lucid-studs',
  },
  {
    id: 'cuffs-bracelets',
    title: 'Open Wire Cuffs & Bangles',
    subtitle: 'Fluid Ergonomic Wristwear',
    category: 'bracelets',
    description: 'Hand-shaped malleable gold wire cuffs tipped with natural freshwater pearls and architectural bar bangles.',
    coverImage: 'https://images.unsplash.com/photo-1611591475168-98967b5eb488?auto=format&fit=crop&w=1200&q=85',
    pieceCount: '5 Unique Styles',
    featuredProductId: 'two-pearl-cuff',
  },
  {
    id: 'kinetic-brooches',
    title: 'Kinetic Ribbons & Modern Pins',
    subtitle: 'Sculpted Statement Accents',
    category: 'brooches',
    description: 'Fluid kinetic ribbons in recycled 925 silver and 18k vermeil that elevate silk scarves, lapels, and knitwear.',
    coverImage: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1200&q=85',
    pieceCount: '4 Unique Styles',
    featuredProductId: 'solid-wave-brooch',
  },
];

export const CollectionsHubPage: React.FC<CollectionsHubPageProps> = ({
  onNavigateToCategory,
  onSelectProduct,
  currency,
  catalogProducts = PRODUCTS,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="pb-24 font-sans-body w-full text-[#111111] bg-[#EAE6DC]">
      
      {/* 1. EDITORIAL HERO BANNER */}
      <section className="relative w-full bg-[#86806C] text-white min-h-[360px] sm:min-h-[460px] flex flex-col justify-between p-6 sm:p-10 md:p-12 lg:px-16 lg:py-12 select-none overflow-hidden border-b border-[#D8D2C5]">
        <div className="w-full flex items-center justify-between text-[11px] uppercase tracking-[0.2em] font-light text-white/80 z-20">
          <span>curated archives • {SUITES.length} maison collections</span>
          <span>HOME / COLLECTIONS</span>
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1800&q=90"
            alt="Avirena Collections Archive"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-[center_35%] opacity-85 filter contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#86806C]/90 via-black/30 to-[#86806C]/60" />
        </div>

        <div className="w-full z-20 pt-24 sm:pt-36">
          <h1 className="font-serif-display text-6xl sm:text-8xl md:text-9xl lg:text-[10vw] font-light text-white tracking-tight leading-[0.85] text-left select-none uppercase drop-shadow-sm">
            COLLECTIONS
          </h1>
        </div>
      </section>

      {/* 2. CURATED SUITES GRID */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-12 sm:py-20">
        <div className="w-full space-y-12 sm:space-y-16">
          
          <div className="max-w-2xl text-left space-y-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#7A7468] font-bold block">
              The Maison Archives
            </span>
            <h2 className="font-serif-display text-3xl sm:text-4xl text-[#111111] font-light italic">
              Designed in Sets. Worn Forever.
            </h2>
            <p className="text-xs sm:text-sm text-[#5C5850] font-normal leading-relaxed">
              Explore our permanent design suites crafted with recycled precious metals, certified natural gemstones, and lustrous baroque pearls.
            </p>
          </div>

          {/* Collection Suites List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {SUITES.map((suite, idx) => {
              const featuredProduct =
                catalogProducts.find((p) => p.id === suite.featuredProductId) || catalogProducts[0];

              return (
                <div
                  key={suite.id}
                  onClick={() => onNavigateToCategory(suite.category)}
                  className="group cursor-pointer flex flex-col justify-between bg-[#F5F2EA] border border-[#DDD7CA] rounded-xs overflow-hidden transition-all duration-300 hover:shadow-md hover:border-[#CFC7B7] text-left"
                >
                  {/* Suite Image Header */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#DDD8CD]">
                    <img
                      src={suite.coverImage}
                      alt={suite.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                    
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
                      <span className="text-[10px] uppercase tracking-widest font-semibold text-[#D4AF37]">
                        (0{idx + 1})
                      </span>
                      <span className="text-[11px] font-medium bg-black/40 backdrop-blur-xs px-2.5 py-0.5 rounded-xs">
                        {suite.pieceCount}
                      </span>
                    </div>
                  </div>

                  {/* Suite Copy */}
                  <div className="p-6 space-y-4 flex flex-col justify-between flex-1">
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase tracking-widest text-[#7A7468] font-medium block">
                        {suite.subtitle}
                      </span>
                      <h3 className="font-serif-display text-xl sm:text-2xl text-[#111111] group-hover:text-[#D4AF37] transition-colors font-medium">
                        {suite.title}
                      </h3>
                      <p className="text-xs text-[#5C5850] font-normal leading-relaxed pt-1">
                        {suite.description}
                      </p>
                    </div>

                    {/* Featured Piece Highlight */}
                    <div className="pt-3 border-t border-[#DDD7CA] flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 bg-white border border-[#DDD7CA] rounded-xs flex items-center justify-center p-1">
                          <img
                            src={featuredProduct.images[0]}
                            alt={featuredProduct.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-contain mix-blend-multiply"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-[#7A7468] uppercase tracking-wider block">Signature Piece</span>
                          <span className="text-xs font-serif-display text-[#111111] font-medium truncate block max-w-[140px]">
                            {featuredProduct.name}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#111111] group-hover:text-[#D4AF37] transition-colors uppercase tracking-wider">
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

    </div>
  );
};
