import React, { useState } from 'react';
import type { MetaFunction } from 'react-router';
import { useLoaderData, Link } from 'react-router';
import type { Route } from './+types/journal';
import { ArrowRight, Clock, BookOpen, Share2, ChevronRight, Check } from 'lucide-react';
import {
  STOREFRONT_PRODUCTS_QUERY,
  transformShopifyProduct,
} from '~/lib/shopify';
import { formatPrice } from '~/lib/currency';
import type { Product } from '~/types/storefront';

export const meta: MetaFunction = () => {
  return [
    { title: 'Journal & Styling Lookbook | AVIRENA' },
    {
      name: 'description',
      content:
        'Read the Avirena Journal: styling lookbooks, modern ear stacking blueprints, brass alloy material deep-dives, and jewelry care rituals.',
    },
    { property: 'og:title', content: 'Journal & Styling Lookbook | AVIRENA' },
    {
      property: 'og:description',
      content:
        'Editorial styling guides, brass craftsmanship studies, and homegrown jewelry stories from the Avirena atelier.',
    },
    { property: 'og:image', content: '/og-banner.jpg' },
  ];
};

export async function loader({ context }: Route.LoaderArgs) {
  const { storefront } = context;
  const productsData = await storefront.query(STOREFRONT_PRODUCTS_QUERY, {
    variables: { first: 50 },
  });
  const rawEdges = productsData?.products?.edges || [];
  const catalogProducts: Product[] = rawEdges.map((edge: any) =>
    transformShopifyProduct(edge.node)
  );

  return { catalogProducts };
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

export default function JournalPage() {
  const { catalogProducts } = useLoaderData<typeof loader>();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [copied, setCopied] = useState(false);

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

  if (selectedArticle) {
    const featuredProds = (catalogProducts || []).slice(0, 3);

    return (
      <div className="w-full text-left font-sans-body bg-[#E7E4D5] text-[#413C23] pb-24 select-none">
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
            <div className="lg:col-span-8 space-y-6 text-[#413C23]/85 text-sm sm:text-base leading-relaxed font-normal">
              <p className="text-base sm:text-lg font-normal text-[#413C23] border-l-2 border-[#8F896D] pl-4 italic">
                {selectedArticle.excerpt}
              </p>
              {selectedArticle.content.map((paragraph, index) => (
                <p key={index} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}

              <div className="pt-8 border-t border-[#D8D2C2] flex flex-wrap items-center justify-between gap-4">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="text-xs uppercase tracking-widest font-semibold text-[#413C23] hover:text-[#8F896D] transition-colors cursor-pointer"
                >
                  ← Back to Journal
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#8F896D] hover:text-[#413C23] transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Link Copied' : 'Share Article'}</span>
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#F2EFDB] p-6 rounded-xs border border-[#D8D2C2] space-y-4">
                <h3 className="font-serif-display text-lg text-[#413C23] font-medium tracking-wide uppercase pb-2 border-b border-[#D8D2C2]">
                  Featured in This Story
                </h3>
                <div className="space-y-3">
                  {featuredProds.map((prod) => (
                    <Link
                      key={prod.id}
                      to={`/products/${prod.handle || prod.id}`}
                      className="flex items-center gap-3 p-2 bg-[#E7E4D5] rounded-xs border border-[#D8D2C2] hover:border-[#8F896D] transition-colors group cursor-pointer"
                    >
                      <div className="w-12 h-12 bg-white rounded-2xs overflow-hidden shrink-0 border border-[#D8D2C2]">
                        <img
                          src={prod.images[0] || '/logo.png'}
                          alt={prod.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="block text-xs font-serif font-medium text-[#413C23] group-hover:underline truncate">
                          {prod.name}
                        </span>
                        <span className="block text-xs font-bold text-[#413C23]">
                          {formatPrice(prod.price)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  to="/shop"
                  className="w-full py-3 bg-[#413C23] text-[#FAF8F5] text-xs uppercase tracking-widest font-semibold rounded-xs hover:bg-[#8F896D] transition-colors block text-center"
                >
                  Shop Collection
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full text-left font-sans-body bg-[#E7E4D5] text-[#413C23] pb-24 select-none">
      {/* 1. Header Banner */}
      <section className="relative w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 pt-4 pb-8 sm:pb-12">
        <div className="relative rounded-xs overflow-hidden border border-[#D8D2C2] bg-[#413C23] text-[#E7E4D5] py-14 sm:py-20 px-6 sm:px-12 text-center space-y-4 shadow-sm">
          <div className="relative z-10 space-y-3 max-w-2xl mx-auto">
            <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] text-[#8F896D] uppercase block">
              Atelier Chronicle &amp; Style Notes
            </span>
            <h1 className="font-serif-display text-4xl sm:text-6xl lg:text-7xl text-[#E7E4D5] tracking-tight font-light leading-tight">
              The Avirena Journal
            </h1>
            <p className="text-xs sm:text-sm text-[#E7E4D5]/80 max-w-lg mx-auto font-normal leading-relaxed pt-1">
              Reflections on conscious jewelry craftsmanship, material integrity, and timeless daily styling rituals.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Category Filter Tabs */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 mb-10">
        <div className="flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto pb-2 border-b border-[#D8D2C2]">
          {[
            { id: 'all', label: 'All Stories' },
            { id: 'our story', label: 'Our Story' },
            { id: 'craftsmanship', label: 'Craftsmanship' },
            { id: 'style guide', label: 'Style Guide' },
            { id: 'care guide', label: 'Care Guide' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 text-xs uppercase tracking-wider rounded-xs font-medium cursor-pointer transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#413C23] text-[#FAF8F5] shadow-xs'
                  : 'bg-[#F2EFDB] text-[#413C23] border border-[#D8D2C2] hover:border-[#8F896D]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* 3. Articles Grid */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {filteredArticles.map((article) => (
            <article
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="bg-[#F2EFDB] border border-[#D8D2C2] rounded-xs overflow-hidden flex flex-col justify-between group cursor-pointer hover:border-[#8F896D] transition-all hover:shadow-sm"
            >
              <div>
                <div className="aspect-[16/10] overflow-hidden bg-[#E7E4D5]">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
                <div className="p-6 sm:p-8 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-[#8F896D] uppercase tracking-wider font-semibold">
                    <span>{article.category}</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h2 className="font-serif-display text-xl sm:text-2xl text-[#413C23] font-normal leading-snug group-hover:underline">
                    {article.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#413C23]/75 leading-relaxed font-normal line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-2 flex items-center justify-between border-t border-[#D8D2C2]/60">
                <span className="text-xs uppercase tracking-wider text-[#413C23] font-semibold flex items-center gap-1.5 group-hover:text-[#8F896D] transition-colors">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
                <span className="text-[11px] text-[#8F896D] font-normal">
                  {article.date}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
