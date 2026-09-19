import React, { useState } from 'react';
import { AvirenaLogo } from '~/components/AvirenaLogo';
import { BrandLogo } from '~/components/BrandLogo';
import { PaymentBadges } from '~/components/PaymentBadges';
import { ProductCard } from '~/components/ProductCard';
import { CatalogItemCard } from '~/components/CatalogItemCard';
import { ToastContainer, type ToastMessage } from '~/components/Toast';
import type { Product } from '~/types/storefront';

// Sample pieces strictly adhering to Brass material integrity
const SAMPLE_SINGLE_PIECE: Product = {
  id: 'avirena-square-studs-gold-tone-brass-earrings',
  handle: 'avirena-square-studs-gold-tone-brass-earrings',
  name: 'Avirena Square Studs',
  subtitle: 'Modern Geometric Square Stud Earrings',
  category: 'earrings',
  metal: 'Gold-Tone Brass',
  price: 799,
  originalPrice: 2499,
  images: [
    'https://cdn.shopify.com/s/files/1/1031/9364/1282/files/square_nadir-square-studs-gold-tone-brass-earrings_1.png?v=1788779598',
    'https://cdn.shopify.com/s/files/1/1031/9364/1282/files/square_clean_nadir-square-studs-gold-tone-brass-earrings_2.png?v=1788782981',
  ],
  description: 'Modern geometry. Effortless statement in gold-tone brass.',
  details: ['Modern geometric square design', 'Anti-tarnish protective coating', 'Surgical steel posts'],
  materials: 'High-grade brass with anti-tarnish protective coating and surgical steel posts',
  inStock: true,
  isBestseller: true,
  isSculptural: true,
  tags: ['brass', 'gold-tone', 'bestseller', 'earrings'],
};

const SAMPLE_DUO_SUITE: Product = {
  id: 'cascade-statement-duo',
  handle: 'cascade-statement-duo',
  name: 'Cascade Statement Duo',
  subtitle: 'Duo Suite • Pair of Complementary Statement Earrings',
  category: 'sets',
  metal: 'Gold & Silver Tone Brass',
  price: 1399,
  originalPrice: 4299,
  images: [
    'https://cdn.shopify.com/s/files/1/1031/9364/1282/files/cascade_duo_main.png?v=1788779598',
    'https://cdn.shopify.com/s/files/1/1031/9364/1282/files/square_clean_nadir-square-studs-gold-tone-brass-earrings_2.png?v=1788782981',
  ],
  description: 'Two complementary architectural brass statement pieces. Pair & save ₹100 automatically.',
  details: ['2 complementary pairs included', 'Gold & Silver Tone Brass', 'Surgical steel posts'],
  materials: 'High-grade brass with anti-tarnish protective coating and surgical steel posts',
  inStock: true,
  isBestseller: true,
  tags: ['duo-suite', 'bundle', 'brass', 'statement'],
};

const BRAND_COLORS = [
  { name: 'Ink', hex: '#413C23', bg: 'bg-[#413C23]', text: 'text-white' },
  { name: 'Stone Taupe (Accent)', hex: '#8F896D', bg: 'bg-[#8F896D]', text: 'text-white' },
  { name: 'Muted Taupe', hex: '#6B6650', bg: 'bg-[#6B6650]', text: 'text-white' },
  { name: 'Border Subtle', hex: '#D8D2C2', bg: 'bg-[#D8D2C2]', text: 'text-black' },
  { name: 'Ivory Sand (Base)', hex: '#E7E4D5', bg: 'bg-[#E7E4D5]', text: 'text-black' },
  { name: 'Warm Linen', hex: '#F2EFDB', bg: 'bg-[#F2EFDB]', text: 'text-black' },
  { name: 'Soft Silver Canvas', hex: '#FAF8F5', bg: 'bg-[#FAF8F5]', text: 'text-black' },
  { name: 'Luxe Gold', hex: '#D4AF37', bg: 'bg-[#D4AF37]', text: 'text-black' },
  { name: 'Garnet Red', hex: '#7A0F1A', bg: 'bg-[#7A0F1A]', text: 'text-white' },
  { name: 'Urgency Red', hex: '#DC2626', bg: 'bg-[#DC2626]', text: 'text-white' },
];

export function meta() {
  return [
    { title: 'Design System & Components | Avirena Jewels Hydrogen' },
    { name: 'robots', content: 'noindex, nofollow' },
  ];
}

export default function DesignSystemPage() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [wishlistedIds, setWishlistedIds] = useState<string[]>([]);

  const addSampleToast = () => {
    const id = Date.now().toString();
    setToasts((prev) => [
      ...prev,
      {
        id,
        type: 'cart',
        title: 'Added to Bag',
        subtitle: 'Avirena Square Studs (₹799)',
        actionLabel: 'View Bag',
        onAction: () => alert('View Bag Clicked'),
      },
    ]);
  };

  const toggleWishlist = (product: Product) => {
    setWishlistedIds((prev) =>
      prev.includes(product.id)
        ? prev.filter((id) => id !== product.id)
        : [...prev, product.id]
    );
  };

  return (
    <div className="w-full bg-[#E7E4D5] text-black font-sans-body">
      <div className="site-container-full py-10 sm:py-16 max-w-7xl mx-auto space-y-16">
        {/* Header Intro */}
        <div className="border-b border-[#D8D2C2] pb-6">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#8F896D]">
            Avirena Design System • Phase 1 Verification
          </span>
          <h1 className="font-serif-display text-4xl sm:text-5xl font-medium tracking-tight mt-2 text-black">
            Brand Tokens &amp; Leaf Components
          </h1>
          <p className="mt-2 text-sm text-[#413C23] max-w-2xl leading-relaxed">
            Verified design system tokens, typography scales, official brand color swatches,
            and presentational leaf components on Shopify Hydrogen (Remix).
          </p>
        </div>

        {/* 1. Brand Palette */}
        <section className="space-y-4">
          <h2 className="font-serif-display text-2xl font-semibold text-black">
            1. Official Brand Palette
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
            {BRAND_COLORS.map((c) => (
              <div
                key={c.name}
                className="border border-[#D8D2C2] rounded-xs overflow-hidden shadow-xs bg-white"
              >
                <div className={`h-16 sm:h-20 ${c.bg} flex items-end p-2`}>
                  <span className={`text-[10px] font-mono font-bold ${c.text}`}>
                    {c.hex}
                  </span>
                </div>
                <div className="p-2.5">
                  <div className="text-xs font-semibold text-black">{c.name}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Typography Hierarchy */}
        <section className="space-y-4">
          <h2 className="font-serif-display text-2xl font-semibold text-black">
            2. Typography Hierarchy
          </h2>
          <div className="bg-[#FAF8F5] p-6 rounded-xs border border-[#D8D2C2] space-y-6">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#8F896D] mb-1">
                Display &amp; Headings — Cormorant Garamond
              </div>
              <p className="font-serif-display text-4xl sm:text-5xl font-medium text-black">
                Modern Sculptural Anti-Tarnish Jewellery
              </p>
              <p className="font-serif-display italic text-2xl text-[#6B6650] mt-1">
                Crafted for everyday elegance with architectural balance.
              </p>
            </div>

            <div>
              <div className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#8F896D] mb-1">
                Body &amp; Micro-copy — Plus Jakarta Sans
              </div>
              <p className="font-sans-body text-base text-black leading-relaxed">
                All Avirena pieces are crafted from high-grade brass with a durable anti-tarnish
                protective coating in warm gold or clean silver tone. Finished with surgical steel
                posts for comfortable, worry-free all-day wear.
              </p>
              <div className="flex items-center gap-4 mt-3 text-xs uppercase tracking-[0.18em] font-semibold text-black">
                <span>Free Delivery Across India</span>
                <span>•</span>
                <span>7-Day Easy Returns</span>
                <span>•</span>
                <span>Anti-Tarnish Brass</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Logos & Brand Mark Variants */}
        <section className="space-y-4">
          <h2 className="font-serif-display text-2xl font-semibold text-black">
            3. Brand Logos &amp; Mark Variants
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-[#FAF8F5] p-6 rounded-xs border border-[#D8D2C2]">
            <div className="flex flex-col items-center justify-center p-6 border border-[#D8D2C2] rounded-xs bg-[#E7E4D5]">
              <span className="text-[10px] uppercase font-bold text-[#8F896D] mb-4">Wordmark (Primary)</span>
              <AvirenaLogo size="md" />
            </div>
            <div className="flex flex-col items-center justify-center p-6 border border-[#D8D2C2] rounded-xs bg-[#FAF8F5]">
              <span className="text-[10px] uppercase font-bold text-[#8F896D] mb-4">Secondary (with Subtitle)</span>
              <BrandLogo variant="secondary" size="md" />
            </div>
            <div className="flex flex-col items-center justify-center p-6 border border-[#D8D2C2] rounded-xs bg-black text-white">
              <span className="text-[10px] uppercase font-bold text-neutral-400 mb-4">Monochrome / Invert</span>
              <AvirenaLogo size="md" theme="light" />
            </div>
          </div>
        </section>

        {/* 4. Payment Badges */}
        <section className="space-y-4">
          <h2 className="font-serif-display text-2xl font-semibold text-black">
            4. Authentic Payment Method Badges
          </h2>
          <div className="bg-[#413C23] p-8 rounded-xs flex flex-col items-center justify-center text-center space-y-4">
            <span className="text-xs uppercase tracking-[0.16em] text-[#E7E4D5] font-semibold">
              100% Secure &amp; Verified Checkout
            </span>
            <PaymentBadges />
          </div>
        </section>

        {/* 5. Product Cards (Single Piece & Duo Suite Bundle) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif-display text-2xl font-semibold text-black">
              5. Product Cards &amp; Duo Suite Bundle Tag
            </h2>
            <button
              onClick={addSampleToast}
              className="text-xs font-bold uppercase tracking-wider bg-black text-white px-3 py-1.5 rounded-xs hover:bg-neutral-800 transition-colors"
            >
              Trigger Sample Toast
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* Single Earring */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#8F896D] mb-2">
                Single Earring (Bestseller)
              </div>
              <ProductCard
                product={SAMPLE_SINGLE_PIECE}
                currency="INR"
                isWishlisted={wishlistedIds.includes(SAMPLE_SINGLE_PIECE.id)}
                onToggleWishlist={toggleWishlist}
                onQuickAdd={() => addSampleToast()}
              />
            </div>

            {/* Duo Suite Bundle */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#8F896D] mb-2">
                Duo Suite (Bundle Tag • 2 Pieces)
              </div>
              <ProductCard
                product={SAMPLE_DUO_SUITE}
                currency="INR"
                isWishlisted={wishlistedIds.includes(SAMPLE_DUO_SUITE.id)}
                onToggleWishlist={toggleWishlist}
                onQuickAdd={() => addSampleToast()}
              />
            </div>

            {/* Catalog Item Card Variant */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#8F896D] mb-2">
                Catalog Item Card Variant
              </div>
              <CatalogItemCard
                product={SAMPLE_SINGLE_PIECE}
                currency="INR"
                isWishlisted={wishlistedIds.includes(SAMPLE_SINGLE_PIECE.id)}
                onToggleWishlist={toggleWishlist}
                onQuickAdd={() => addSampleToast()}
              />
            </div>
          </div>
        </section>
      </div>

      {/* Floating Toast Container */}
      <ToastContainer
        toasts={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />
    </div>
  );
}
