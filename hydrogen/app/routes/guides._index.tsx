import type { MetaFunction } from 'react-router';
import { Link } from 'react-router';
import { ArrowRight, BookOpen } from 'lucide-react';
import { GUIDES } from '../data/guides';

export const meta: MetaFunction = () => {
  return [
    { title: 'Jewelry Care & Material Guides | AVIRENA' },
    {
      name: 'description',
      content:
        'Crawlable reference guides to brass jewelry, anti-tarnish protective coatings, ring sizing, sensitive skin care, and monsoon humidity protection.',
    },
    { property: 'og:title', content: 'Jewelry Care & Material Guides | AVIRENA' },
    {
      property: 'og:description',
      content:
        'Honest, verified knowledge on brass dailywear jewelry, anti-tarnish finishes, ring sizing, and everyday care.',
    },
    { property: 'og:image', content: '/og-banner.jpg' },
  ];
};

export default function GuidesIndex() {
  return (
    <div className="w-full text-left font-sans-body bg-[#E7E4D5] pb-24 text-[#413C23] select-none">
      {/* 1. Header Banner */}
      <section className="relative w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 pt-4 pb-8 sm:pb-12">
        <div className="relative rounded-xs overflow-hidden border border-[#D8D2C2] bg-[#413C23] text-[#E7E4D5] py-14 sm:py-20 px-6 sm:px-12 text-center space-y-4 shadow-sm">
          <div>
            <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] text-[#8F896D] uppercase block mb-2">
              Atelier Knowledge Base
            </span>
            <h1 className="font-serif-display text-4xl sm:text-6xl lg:text-7xl text-[#E7E4D5] tracking-tight font-light">
              Jewelry Guides &amp; Care
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#E7E4D5]/80 max-w-xl mx-auto font-normal leading-relaxed">
            Honest material breakdowns, anti-tarnish protective care rituals, ring sizing standards, and sensitive skin guidance.
          </p>
        </div>
      </section>

      {/* 2. Guides Grid */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {GUIDES.map((guide) => (
            <Link
              key={guide.slug}
              to={`/guides/${guide.slug}`}
              className="bg-[#F2EFDB] border border-[#D8D2C2] rounded-xs p-6 sm:p-8 hover:border-[#8F896D] transition-all hover:shadow-xs flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs uppercase tracking-wider text-[#8F896D]">
                  <span className="px-2.5 py-1 bg-[#E7E4D5] rounded-xs text-[#413C23] font-semibold">
                    {guide.category}
                  </span>
                  <span>{guide.readTime}</span>
                </div>
                <h2 className="font-serif-display text-xl sm:text-2xl text-[#413C23] group-hover:text-[#8F896D] transition-colors font-normal leading-snug">
                  {guide.heading}
                </h2>
                <p className="text-xs sm:text-sm text-[#413C23]/75 leading-relaxed font-normal">
                  {guide.summary}
                </p>
              </div>

              <div className="pt-6 border-t border-[#D8D2C2]/50 mt-6 flex items-center justify-between">
                <span className="text-xs text-[#413C23] font-medium uppercase tracking-wider group-hover:text-[#8F896D] inline-flex items-center gap-1.5">
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
                <span className="text-xs text-[#8F896D]">
                  {guide.faqs.length} FAQs
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
