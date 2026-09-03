import React, { useState } from 'react';
import { Sparkles, ArrowRight, Clock, BookOpen, Share2, Tag, ChevronRight } from 'lucide-react';
import { Product, Currency } from '../types';
import { PRODUCTS, formatPrice } from '../data/products';

interface JournalPageProps {
  onSelectProduct: (product: Product) => void;
  onNavigateToShop: () => void;
  currency: Currency;
}

interface Article {
  id: string;
  title: string;
  subtitle: string;
  category: 'Craftsmanship' | 'Style Guide' | 'Heritage' | 'Care Guide';
  readTime: string;
  date: string;
  image: string;
  excerpt: string;
  content: string[];
  featuredProductIds: string[];
}

export const JournalPage: React.FC<JournalPageProps> = ({
  onSelectProduct,
  onNavigateToShop,
  currency,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const articles: Article[] = [
    {
      id: 'sculptural-vermeil-craft',
      title: 'The Art of Sculptural Vermeil: Inside Our Arezzo & Jaipur Foundries',
      subtitle: 'Where ancient lost-wax casting meets contemporary minimalist architecture.',
      category: 'Craftsmanship',
      readTime: '4 min read',
      date: 'Autumn Edition',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1600&q=90',
      excerpt:
        'Behind every organic curve of Avirena jewelry lies a multi-generational tradition of Italian and Indian metalsmiths. Discover how 3.0-micron thick gold vermeil bridges the worlds of high fine jewelry and modern effortless wear.',
      content: [
        'True vermeil is not merely gold plating. By historical standard and French decree, authentic vermeil requires a solid base of 925 sterling silver layered with a generous coating of gold measuring at least 2.5 microns thick.',
        'At Studio Avirena, we surpass standard industry thresholds by depositing a resilient 3.0-micron coating of 18-karat yellow gold over recycled silver cores. Every single master model is sculpted by hand in jeweller’s wax, allowing our craftsmen to form undulating, molten silhouettes that reflect natural sunlight with remarkable depth.',
        'This painstaking dual-origin process unites the sculptural purity of Arezzo goldsmithing with the intricate filigree heritage of Jaipur artisans. The result is modern fine jewelry made to accompany you through daily rituals and special occasions alike.'
      ],
      featuredProductIds: ['square-form-necklace', 'lucid-studs', 'scalo-bracelet']
    },
    {
      id: 'modern-ear-stacking-guide',
      title: 'The Architectural Ear Stack: Balancing Bold Domes with Delicate Huggies',
      subtitle: 'A structural approach to everyday jewelry layering without the clutter.',
      category: 'Style Guide',
      readTime: '3 min read',
      date: 'Style Notes',
      image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1600&q=90',
      excerpt:
        'Layering earrings is an exercise in scale, texture, and negative space. Master the art of pairing high-polish dome studs with ribbed hoop huggies and sparkling crystal accents.',
      content: [
        'When assembling an intentional ear stack, begin with a commanding focal point. The Dome Stud or Lucid Stud anchors the first lobe piercing with its bold, light-catching surface.',
        'As you move upwards along the ear lobe, introduce contrasting textures: the vertical fluting of the Twin Hoop Huggies or the delicate twinkle of our Accent Huggies. The juxtaposition of smooth molten metal against micro-pavé crystals creates visual dimension without overwhelming.',
        'Rule of thumb: leave breathing room between bold elements. If your first piercing is a substantial sculptural piece, keep the secondary accents slender and closely contoured to the ear.'
      ],
      featuredProductIds: ['dome-studs', 'accent-earrings', 'twin-hoop-earrings', 'lucid-studs']
    },
    {
      id: 'baroque-pearl-modern-classic',
      title: 'Lustrous Imperfection: Why Organic Baroque Pearls Outshine the Spherical',
      subtitle: 'Celebrating individuality, iridescence, and the allure of natural contours.',
      category: 'Heritage',
      readTime: '5 min read',
      date: 'Material Study',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1600&q=90',
      excerpt:
        'Unlike manufactured uniform beads, no two freshwater baroque pearls are ever identical. Explore how Studio Avirena frames these luminous treasures in modern gold wire architecture.',
      content: [
        'Derived from the Portuguese word "barroco"—meaning an irregular or non-spherical pearl—baroque pearls have captivated royal courts and contemporary sculptors for centuries.',
        'Each pearl harvested for Avirena is hand-selected for its high nacre thickness and celestial orient (the rainbow play of color across its iridescent skin). Rather than forcing these natural gems into rigid symmetrical settings, our designers mold the gold around each pearl’s unique contours.',
        'From the Luna Pearl Choker to the Two Pearl Cuff, these pieces celebrate the poetic truth that genuine luxury lies in unrepeatable individuality.'
      ],
      featuredProductIds: ['luna-pearl-choker', 'two-pearl-cuff', 'pearl-drop-meridian']
    },
    {
      id: 'prolonging-vermeil-brilliance',
      title: 'The Atelier Guide: Caring for 18k Gold Vermeil for Generations',
      subtitle: 'Simple preservation rituals to maintain your jewelry’s warm mirror luster.',
      category: 'Care Guide',
      readTime: '3 min read',
      date: 'Care & Longevity',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1600&q=90',
      excerpt:
        'Gold vermeil is remarkably resilient when cared for with mindful intention. Follow our master goldsmiths’ recommendations for cleaning, storing, and wearing your collection.',
      content: [
        'The golden rule of fine vermeil: "Last on, first off." Apply your perfumes, serums, hairsprays, and lotions before putting on your jewelry. Chemicals and alcohol in cosmetics can react with surface finishes.',
        'Remove your jewelry before swimming in chlorinated pools or bathing in thermal baths. Water itself is gentle, but household detergents and pool chlorines accelerate oxidation.',
        'At the end of each wear, gently buff the surface with the complimentary Studio Avirena microfiber cloth to remove skin oils and dust. Store each piece separately in its velvet pouch to prevent scratches.'
      ],
      featuredProductIds: ['row-edge-ring', 'wave-prism-ring', 'gold-curve-necklace']
    }
  ];

  const filteredArticles = activeCategory === 'all'
    ? articles
    : articles.filter(a => a.category.toLowerCase() === activeCategory.toLowerCase());

  // If viewing single article
  if (selectedArticle) {
    const featuredProds = selectedArticle.featuredProductIds
      .map(id => PRODUCTS.find(p => p.id === id))
      .filter(Boolean) as Product[];

    return (
      <div className="w-full text-left font-sans-body bg-[#FAF8F5] pb-24">
        {/* Article Header & Breadcrumbs */}
        <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 pt-6 pb-6">
          <div className="flex items-center gap-2 text-xs text-[#7D7973] uppercase tracking-wider mb-6">
            <button
              onClick={() => setSelectedArticle(null)}
              className="hover:text-[#2C2C2A] cursor-pointer"
            >
              Journal
            </button>
            <span>/</span>
            <span className="text-[#C5A059] font-medium">{selectedArticle.category}</span>
          </div>

          <div className="max-w-3xl space-y-4">
            <span className="inline-block px-3 py-1 bg-[#EAE6DB] text-[#2C2C2A] text-[11px] font-medium uppercase tracking-widest rounded-xs">
              {selectedArticle.category} • {selectedArticle.readTime}
            </span>
            <h1 className="font-serif-display text-3xl sm:text-5xl lg:text-6xl text-[#2C2C2A] tracking-tight leading-tight">
              {selectedArticle.title}
            </h1>
            <p className="text-base sm:text-lg text-[#5C5850] font-light leading-relaxed">
              {selectedArticle.subtitle}
            </p>
          </div>
        </section>

        {/* Hero Image */}
        <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 mb-12">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-xs overflow-hidden border border-[#E6DFD3] bg-[#2C2C2A]">
            <img
              src={selectedArticle.image}
              alt={selectedArticle.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </section>

        {/* Article Body & Featured Jewelry Sidebar */}
        <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl">
            {/* Main Article Content */}
            <div className="lg:col-span-8 space-y-6 text-[#2C2C2A]/90 text-sm sm:text-base leading-relaxed font-light">
              <p className="text-base sm:text-lg font-normal text-[#2C2C2A] border-l-2 border-[#C5A059] pl-4 italic">
                {selectedArticle.excerpt}
              </p>
              {selectedArticle.content.map((paragraph, index) => (
                <p key={index} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}

              <div className="pt-8 border-t border-[#E6DFD3] flex items-center justify-between">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-5 py-2.5 bg-[#2C2C2A] text-white text-xs uppercase tracking-widest rounded-xs hover:bg-[#444238] transition-colors cursor-pointer"
                >
                  ← Back to All Stories
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    alert('Article link copied to clipboard!');
                  }}
                  className="px-4 py-2 border border-[#E6DFD3] hover:border-[#2C2C2A] text-xs text-[#2C2C2A] rounded-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" /> Share Article
                </button>
              </div>
            </div>

            {/* Featured Jewelry in Story */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#F3EFE6] border border-[#E6DFD3] p-6 rounded-xs space-y-5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C5A059]" />
                  <h3 className="font-serif-display text-lg text-[#2C2C2A]">Featured In This Story</h3>
                </div>
                <div className="space-y-4">
                  {featuredProds.map(product => (
                    <div
                      key={product.id}
                      onClick={() => onSelectProduct(product)}
                      className="flex items-center gap-3 p-2 bg-white rounded-xs border border-[#E6DFD3] hover:border-[#C5A059] cursor-pointer transition-all duration-200 group"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 object-cover rounded-xs"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-normal text-[#2C2C2A] group-hover:text-[#C5A059] transition-colors truncate">
                          {product.name}
                        </h4>
                        <p className="text-[11px] text-[#7D7973] truncate">{product.metal}</p>
                        <p className="text-xs font-medium text-[#2C2C2A] mt-0.5">
                          {formatPrice(product.price, currency)}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#7D7973] group-hover:text-[#2C2C2A] transition-colors" />
                    </div>
                  ))}
                </div>
                <button
                  onClick={onNavigateToShop}
                  className="w-full py-2.5 bg-[#2C2C2A] text-white text-xs uppercase tracking-widest rounded-xs hover:bg-[#444238] transition-colors text-center cursor-pointer block"
                >
                  Explore Complete Collection
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Main Journal & Lookbook List View
  return (
    <div className="w-full text-left font-sans-body bg-[#FAF8F5] pb-24">
      {/* 1. Top Editorial Banner */}
      <section className="relative w-full px-4 sm:px-8 lg:px-12 xl:px-16 pt-4 pb-8 sm:pb-12">
        <div className="relative rounded-xs overflow-hidden border border-[#E6DFD3] bg-[#EAE6DB] py-14 sm:py-20 px-6 sm:px-12 text-center space-y-4">
          <div>
            <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-[#C5A059] uppercase block mb-2">
              The Studio Avirena Gazette
            </span>
            <h1 className="font-serif-display text-4xl sm:text-6xl lg:text-7xl text-[#2C2C2A] tracking-tight">
              Journal & Lookbook
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#7D7973] max-w-xl mx-auto font-light leading-relaxed">
            Stories of hereditary craftsmanship, architectural jewelry styling, and the art of living with modern luxury.
          </p>
        </div>
      </section>

      {/* 2. Category Filter Tabs */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 mb-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E6DFD3]">
          {['all', 'craftsmanship', 'style guide', 'heritage', 'care guide'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-xs uppercase tracking-wider rounded-xs transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#2C2C2A] text-white font-medium shadow-xs'
                  : 'bg-[#F3EFE6] text-[#5C5850] hover:bg-[#EAE6DB] hover:text-[#2C2C2A]'
              }`}
            >
              {cat === 'all' ? 'All Stories' : cat}
            </button>
          ))}
        </div>
      </section>

      {/* 3. Hero Featured Story (First Article) */}
      {filteredArticles.length > 0 && (
        <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 mb-12">
          <div
            onClick={() => setSelectedArticle(filteredArticles[0])}
            className="group cursor-pointer grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white border border-[#E6DFD3] rounded-xs p-6 sm:p-8 hover:border-[#C5A059] hover:shadow-sm transition-all duration-300 items-center"
          >
            <div className="lg:col-span-7 aspect-[16/10] overflow-hidden rounded-xs bg-[#EAE6DB]">
              <img
                src={filteredArticles[0].image}
                alt={filteredArticles[0].title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
            <div className="lg:col-span-5 space-y-4 text-left">
              <div className="flex items-center gap-2 text-xs text-[#7D7973]">
                <span className="px-2.5 py-1 bg-[#F3EFE6] text-[#C5A059] font-medium uppercase tracking-wider rounded-xs text-[10px]">
                  Featured Story
                </span>
                <span>•</span>
                <span>{filteredArticles[0].readTime}</span>
              </div>
              <h2 className="font-serif-display text-2xl sm:text-3xl lg:text-4xl text-[#2C2C2A] group-hover:text-[#C5A059] transition-colors leading-tight">
                {filteredArticles[0].title}
              </h2>
              <p className="text-xs sm:text-sm text-[#7D7973] font-light leading-relaxed">
                {filteredArticles[0].excerpt}
              </p>
              <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#2C2C2A] group-hover:text-[#C5A059] transition-colors">
                <span>Read Full Story</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. Stories Grid */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredArticles.slice(1).map(article => (
            <div
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="group cursor-pointer bg-white border border-[#E6DFD3] rounded-xs overflow-hidden flex flex-col hover:border-[#C5A059] hover:shadow-xs transition-all duration-300"
            >
              <div className="aspect-[16/11] overflow-hidden bg-[#EAE6DB] relative">
                <img
                  src={article.image}
                  alt={article.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-xs text-[10px] uppercase font-medium tracking-wider text-[#2C2C2A] rounded-xs">
                  {article.category}
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="text-[11px] text-[#7D7973]">{article.readTime}</div>
                  <h3 className="font-serif-display text-xl text-[#2C2C2A] group-hover:text-[#C5A059] transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-xs text-[#7D7973] font-light line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
                <div className="pt-2 border-t border-[#E6DFD3] flex items-center justify-between text-xs text-[#2C2C2A] font-medium group-hover:text-[#C5A059]">
                  <span className="uppercase tracking-wider text-[11px]">Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
