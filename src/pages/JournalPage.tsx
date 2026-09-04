import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Clock, BookOpen, Share2, ChevronRight, Check } from 'lucide-react';
import blogHeroImg from '../assets/blog-hero-editorial.jpg';
import { Product, Currency } from '../types';
import { formatPrice } from '../data/products';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface JournalPageProps {
  onSelectProduct: (product: Product) => void;
  onNavigateToShop: () => void;
  currency: Currency;
  /** Live Shopify catalog. Article product strips resolve against this only. */
  catalogProducts?: Product[];
}

interface Article {
  id: string;
  title: string;
  subtitle: string;
  category: 'Craftsmanship' | 'Style Guide' | 'Our Story' | 'Care Guide';
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
  catalogProducts = [],
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.journal-reveal', {
        y: 28,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [selectedArticle, activeCategory]);

  const articles: Article[] = [
    {
      id: 'our-2020-story',
      title: 'Born in Quarantine: How a 2020 Lockdown Passion Project Built Avirena',
      subtitle: 'From hand-assembling jewelry in a living room to an everyday modern design label.',
      category: 'Our Story',
      readTime: '4 min read',
      date: 'Brand Chronicle',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1600&q=90',
      excerpt:
        'When the global lockdown paused daily life in 2020, we sought solace in creative hands-on craft. What began as small, thoughtful jewelry gifts for our immediate neighborhood quickly resonated into a community of women seeking high-grade, everyday luxury that is beautiful, skin-friendly, and accessible.',
      content: [
        'In the spring of 2020, during the height of the COVID lockdown, normal routines came to a sudden halt. In those quiet weeks confined indoors, our founders took comfort at the workbench—sketching sculptural curves, sourcing skin-friendly alloys, and hand-finishing pieces for friends and family.',
        'The response was immediate and heartwarming. Friends loved that our pieces felt substantial, warm, and sophisticated without the prohibitive price tag or delicacy of solid gold. They could wear them working from home, stepping out for quick errands, or styling up their simplest outfits.',
        'Encouraged by local community demand, we formalized our vision into AVIRENA: a homegrown Indian jewelry brand dedicated to honest craft, timeless modern aesthetics, and daily wearable durability. Today, we remain true to that founding ethos—every piece is thoughtfully engineered for life as you truly live it.'
      ],
      featuredProductIds: ['square-form-necklace', 'lucid-studs', 'scalo-bracelet']
    },
    {
      id: 'high-grade-brass-alloy',
      title: 'The Brass Alloy Standard: Why We Choose Premium Brass Over Precious Metals',
      subtitle: 'Understanding protective plating, skin-friendly alloys, and anti-tarnish everyday wear.',
      category: 'Craftsmanship',
      readTime: '4 min read',
      date: 'Material Study',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1600&q=90',
      excerpt:
        'We believe in transparency. We don’t sell overpriced solid gold or fragile mined diamonds. Instead, we master high-grade brass alloy coated in durable gold-tone and silver-tone protective finishes—engineered for sweat resistance, lightweight comfort, and zero tarnish.',
      content: [
        'For decades, the jewelry market forced shoppers to choose between two extremes: cheap fast-fashion metals that turn your skin green after two wears, or exorbitant solid gold pieces you are terrified to wear outside the house.',
        'At AVIRENA, we carve a conscious third path. We craft our pieces using high-tensile, lead-free and nickel-free brass alloy. Brass is ductile yet resilient, allowing us to mold architectural arches, organic fluting, and bold dome silhouettes that maintain their crisp lines over time.',
        'Each piece is finished with a protective anti-tarnish coating and sealed with a hypoallergenic barrier. The result is warm, luminous gold-tone and crisp silver-tone jewelry that withstands moisture, humidity, and daily friction without fading.'
      ],
      featuredProductIds: ['dome-studs', 'row-edge-ring', 'wave-prism-ring']
    },
    {
      id: 'modern-ear-stacking-guide',
      title: 'The Everyday Stacking Blueprint: Minimalist Combinations for Work and Weekend',
      subtitle: 'How to balance chunky domes, textured huggies, and clean lines without looking overdone.',
      category: 'Style Guide',
      readTime: '3 min read',
      date: 'Style Notes',
      image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1600&q=90',
      excerpt:
        'Building an effortless jewelry uniform is about harmony and contrast. Discover how our community pairs bold sculptural rings with textured hoops for seamless day-to-night transitions.',
      content: [
        'An intentional ear stack begins with a clear anchor point. Our Dome Studs or Lucid Studs command the primary lobe with bold, reflective surfaces.',
        'Moving along the ear, contrast is key. Pair a high-polish dome with the subtle fluting of the Twin Hoop Huggies. The interplay of mirror-finish metal against grooved ribbing creates visual richness without feeling cluttered.',
        'When stacking necklaces, balance chain weights: pair a substantial architectural chain like the Square Form Necklace with a delicate choker to frame your collarbone naturally with open collars, knits, or crisp button-downs.'
      ],
      featuredProductIds: ['dome-studs', 'twin-hoop-earrings', 'accent-earrings']
    },
    {
      id: 'caring-for-brass-jewelry',
      title: 'Everyday Longevity: How to Keep Your Anti-Tarnish Pieces Glowing',
      subtitle: 'Simple, practical care routines designed for busy daily life.',
      category: 'Care Guide',
      readTime: '3 min read',
      date: 'Care & Longevity',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1600&q=90',
      excerpt:
        'Our protective anti-tarnish coating is engineered for real life. Here are four straightforward, hassle-free habits to preserve your jewelry’s warm gleam season after season.',
      content: [
        'Apply fragrances and cosmetics first. Allow lotions, hairsprays, and perfumes to settle into your skin before fastening your necklaces or slipping on your rings.',
        'While our protective coatings are moisture and sweat-resistant, avoid exposing your pieces to harsh chlorinated pools or industrial detergents, which can dull any surface over extended periods.',
        'At the end of your day, a gentle wipe with a soft dry microfiber cloth removes body oils and urban dust. Store your pieces in individual compartments or pouches to keep them free from friction scratches.'
      ],
      featuredProductIds: ['luna-pearl-choker', 'two-pearl-cuff', 'gold-curve-necklace']
    }
  ];

  const filteredArticles = activeCategory === 'all'
    ? articles
    : articles.filter(a => a.category.toLowerCase() === activeCategory.toLowerCase());

  // If viewing single article
  if (selectedArticle) {
    // Resolve against the live Shopify catalog only. An article that names a
    // piece we do not actually stock simply renders no product strip.
    const featuredProds = selectedArticle.featuredProductIds
      .map((id) => catalogProducts.find((p) => p.handle === id || p.id === id))
      .filter(Boolean) as Product[];

    return (
      <div ref={containerRef} className="w-full text-left font-sans-body bg-[#E7E4D5] text-[#413C23] pb-24 select-none">
        {/* Article Breadcrumbs */}
        <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 pt-8 pb-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#8F896D]">
            <button
              onClick={() => setSelectedArticle(null)}
              className="hover:text-[#413C23] transition-colors cursor-pointer"
            >
              Journal
            </button>
            <span>/</span>
            <span className="text-[#413C23] font-medium">{selectedArticle.category}</span>
          </div>
        </section>

        {/* Article Header */}
        <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 pb-8">
          <div className="max-w-4xl space-y-4">
            <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8F896D]">
              {selectedArticle.category} · {selectedArticle.readTime}
            </span>
            <h1 className="font-serif-display text-3xl sm:text-5xl lg:text-6xl text-[#413C23] tracking-tight leading-tight font-normal">
              {selectedArticle.title}
            </h1>
            <p className="text-base sm:text-lg text-[#413C23]/80 font-normal leading-relaxed">
              {selectedArticle.subtitle}
            </p>
          </div>
        </section>

        {/* Hero Image */}
        <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 mb-12">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-xs overflow-hidden border border-[#D8D2C2] bg-[#F2EFDB]">
            <img
              src={selectedArticle.image}
              alt={selectedArticle.title}
              className="w-full h-full object-cover object-center"
            />
          </div>
        </section>

        {/* Article Body & Featured Jewelry Sidebar */}
        <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 max-w-7xl">
            {/* Main Article Content */}
            <div className="lg:col-span-8 space-y-6 text-[#413C23]/85 text-sm sm:text-base leading-relaxed font-normal">
              <p className="text-base sm:text-lg font-normal text-[#413C23] border-l-2 border-[#8F896D] pl-4 italic">
                {selectedArticle.excerpt}
              </p>
              {selectedArticle.content.map((paragraph, index) => (
                <p key={index} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}

              <div className="pt-8 border-t border-[#D8D2C2] flex items-center justify-between">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-5 py-2.5 bg-[#413C23] text-[#E7E4D5] text-xs uppercase tracking-widest font-semibold rounded-xs hover:bg-[#8F896D] transition-colors cursor-pointer"
                >
                  ← Back to All Stories
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2500);
                  }}
                  className="px-4 py-2 border border-[#D8D2C2] hover:border-[#413C23] text-xs text-[#413C23] rounded-xs flex items-center gap-1.5 cursor-pointer transition-colors bg-[#F2EFDB]"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#413C23]" />
                      <span>Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share Article</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Featured Jewelry in Story */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#F2EFDB] border border-[#D8D2C2] p-6 rounded-xs space-y-5">
                <div className="flex items-center gap-2 pb-2 border-b border-[#D8D2C2]">
                  <h3 className="font-serif-display text-lg text-[#413C23] font-medium tracking-wide uppercase">
                    Featured in This Story
                  </h3>
                </div>
                <div className="space-y-3.5">
                  {featuredProds.map(product => (
                    <div
                      key={product.id}
                      onClick={() => onSelectProduct(product)}
                      className="flex items-center gap-3.5 p-2.5 bg-[#E7E4D5] rounded-xs border border-[#D8D2C2] hover:border-[#8F896D] cursor-pointer transition-all duration-200 group"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-14 h-14 object-cover rounded-xs"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-normal text-[#413C23] group-hover:text-[#8F896D] transition-colors truncate">
                          {product.name}
                        </h4>
                        <p className="text-[11px] text-[#8F896D] truncate">{product.metal}</p>
                        <p className="text-xs font-medium text-[#413C23] mt-0.5">
                          {formatPrice(product.price, currency)}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#8F896D] group-hover:text-[#413C23] transition-colors" />
                    </div>
                  ))}
                </div>
                <button
                  onClick={onNavigateToShop}
                  className="w-full py-3 bg-[#413C23] text-[#E7E4D5] text-xs uppercase tracking-widest font-semibold rounded-xs hover:bg-[#8F896D] transition-colors text-center cursor-pointer block"
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
    <div ref={containerRef} className="w-full text-left font-sans-body bg-[#E7E4D5] text-[#413C23] pb-24 select-none">
      {/* 1. Top Editorial Banner */}
      <section className="relative w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 pt-4 pb-8 sm:pb-12">
        <div className="relative rounded-xs overflow-hidden border border-[#D8D2C2] bg-[#413C23] text-[#E7E4D5] py-16 sm:py-24 px-6 sm:px-12 text-center space-y-4 shadow-sm min-h-[320px] sm:min-h-[380px] flex items-center justify-center">
          {/* Atmospheric Editorial Background Photo */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <img
              src={blogHeroImg}
              alt="Avirena Jewelry Journal & Editorial Still Life"
              className="w-full h-full object-cover object-center filter contrast-[1.05] opacity-45 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#413C23] via-[#413C23]/80 to-[#413C23]/60 pointer-events-none" />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto space-y-3">
            <span className="journal-reveal text-[10px] sm:text-xs font-semibold tracking-[0.25em] text-[#8F896D] uppercase block">
              Editorial Notes & Care Insights
            </span>
            <h1 className="journal-reveal font-serif-display text-4xl sm:text-6xl lg:text-7xl text-[#E7E4D5] tracking-tight font-light leading-tight">
              The Avirena Journal
            </h1>
            <p className="journal-reveal text-xs sm:text-sm text-[#E7E4D5]/90 max-w-lg mx-auto font-normal leading-relaxed pt-1">
              Reflections on homegrown design, durable brass craftsmanship, and intentional styling rituals for everyday life.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Category Filter Tabs */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 mb-10">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#D8D2C2]">
          {['all', 'our story', 'craftsmanship', 'style guide', 'care guide'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-xs uppercase tracking-wider rounded-xs transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#413C23] text-[#FAF8F5] font-medium shadow-xs'
                  : 'bg-[#F2EFDB] text-[#413C23]/80 hover:bg-[#E7E4D5] hover:text-[#413C23] border border-[#D8D2C2]'
              }`}
            >
              {cat === 'all' ? 'All Stories' : cat}
            </button>
          ))}
        </div>
      </section>

      {/* 3. Hero Featured Story (First Article) */}
      {filteredArticles.length > 0 && (
        <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 mb-12">
          <div
            onClick={() => setSelectedArticle(filteredArticles[0])}
            className="group cursor-pointer grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#F2EFDB] border border-[#D8D2C2] rounded-xs p-6 sm:p-8 hover:border-[#8F896D] hover:shadow-sm transition-all duration-300 items-center"
          >
            <div className="lg:col-span-7 aspect-[16/10] overflow-hidden rounded-xs bg-[#E7E4D5] border border-[#D8D2C2]">
              <img
                src={filteredArticles[0].image}
                alt={filteredArticles[0].title}
                className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700 ease-out"
              />
            </div>
            <div className="lg:col-span-5 space-y-4 text-left">
              <div className="flex items-center gap-2 text-xs text-[#8F896D]">
                <span className="text-[10px] uppercase font-semibold tracking-wider">
                  Featured Story
                </span>
                <span>·</span>
                <span>{filteredArticles[0].readTime}</span>
              </div>
              <h2 className="font-serif-display text-2xl sm:text-3xl lg:text-4xl text-[#413C23] group-hover:text-[#8F896D] transition-colors leading-tight font-normal">
                {filteredArticles[0].title}
              </h2>
              <p className="text-xs sm:text-sm text-[#413C23]/80 font-normal leading-relaxed line-clamp-3">
                {filteredArticles[0].excerpt}
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#413C23] group-hover:text-[#8F896D] transition-colors">
                <span>Read Full Story</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. Stories Grid */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredArticles.slice(1).map(article => (
            <div
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="group cursor-pointer bg-[#F2EFDB] border border-[#D8D2C2] rounded-xs overflow-hidden flex flex-col hover:border-[#8F896D] hover:shadow-xs transition-all duration-300"
            >
              <div className="aspect-[16/11] overflow-hidden bg-[#E7E4D5] relative border-b border-[#D8D2C2]">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 ease-out"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#FAF8F5]/95 backdrop-blur-xs text-[10px] uppercase font-medium tracking-wider text-[#413C23] rounded-xs border border-[#D8D2C2]">
                  {article.category}
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="text-[11px] text-[#8F896D] font-medium">{article.readTime}</div>
                  <h3 className="font-serif-display text-xl text-[#413C23] group-hover:text-[#8F896D] transition-colors leading-snug font-normal">
                    {article.title}
                  </h3>
                  <p className="text-xs text-[#413C23]/75 font-normal line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#D8D2C2] flex items-center justify-between text-xs text-[#413C23] font-medium group-hover:text-[#8F896D]">
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
