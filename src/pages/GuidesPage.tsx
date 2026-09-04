import React from 'react';
import { ArrowRight, ArrowLeft, BookOpen } from 'lucide-react';
import { GUIDES, Guide, GuideBlock } from '../data/guides';

interface GuidesPageProps {
  /** Slug of the guide to render. Null renders the /guides hub. */
  activeSlug: string | null;
  onSelectGuide: (slug: string) => void;
  onNavigateToHub: () => void;
  onNavigateToShop: () => void;
}

const BlockRenderer: React.FC<{ block: GuideBlock }> = ({ block }) => {
  switch (block.type) {
    case 'lead':
      return (
        <p className="text-base sm:text-lg font-normal text-[#413C23] border-l-2 border-[#8F896D] pl-4 leading-relaxed">
          {block.text}
        </p>
      );
    case 'heading':
      return (
        <h2 className="font-serif-display text-2xl sm:text-3xl text-[#413C23] font-normal leading-snug pt-4">
          {block.text}
        </h2>
      );
    case 'paragraph':
      return <p className="leading-relaxed">{block.text}</p>;
    case 'list':
      return (
        <ul className="space-y-2.5 list-disc pl-5 marker:text-[#8F896D]">
          {block.items.map((item, i) => (
            <li key={i} className="leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      );
    case 'table':
      return (
        <div className="overflow-x-auto border border-[#D8D2C2] rounded-xs bg-[#F2EFDB]">
          <table className="w-full text-left text-xs sm:text-sm">
            <caption className="sr-only">{block.caption}</caption>
            <thead className="bg-[#E7E4D5] text-[#413C23] border-b border-[#D8D2C2] font-serif-display uppercase tracking-wider">
              <tr>
                {block.columns.map((col) => (
                  <th key={col} scope="col" className="p-3 font-medium whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8D2C2]">
              {block.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className={
                        ci === 0
                          ? 'p-3 font-medium text-[#413C23] whitespace-nowrap'
                          : 'p-3 text-[#413C23]/80'
                      }
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return null;
  }
};

const GuideArticle: React.FC<{
  guide: Guide;
  onNavigateToHub: () => void;
  onSelectGuide: (slug: string) => void;
  onNavigateToShop: () => void;
}> = ({ guide, onNavigateToHub, onSelectGuide, onNavigateToShop }) => {
  const related = GUIDES.filter((g) => g.slug !== guide.slug);

  return (
    <div className="w-full text-left font-sans-body bg-[#E7E4D5] text-[#413C23] pb-24">
      {/* Breadcrumbs */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 pt-8 pb-4">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#8F896D]"
        >
          <button
            onClick={onNavigateToHub}
            className="hover:text-[#413C23] transition-colors cursor-pointer"
          >
            Guides
          </button>
          <span>/</span>
          <span className="text-[#413C23] font-medium">{guide.category}</span>
        </nav>
      </section>

      {/* Header */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 pb-8">
        <div className="max-w-3xl space-y-4">
          <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8F896D]">
            {guide.category} · {guide.readTime}
          </span>
          <h1 className="font-serif-display text-3xl sm:text-5xl lg:text-6xl text-[#413C23] tracking-tight leading-tight font-normal">
            {guide.heading}
          </h1>
          <p className="text-base sm:text-lg text-[#413C23]/80 font-normal leading-relaxed">
            {guide.summary}
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 max-w-7xl">
          <article className="lg:col-span-8 space-y-6 text-[#413C23]/85 text-sm sm:text-base leading-relaxed font-normal">
            {guide.blocks.map((block, i) => (
              <BlockRenderer key={i} block={block} />
            ))}

            {/* Question & answer section — mirrors the FAQPage JSON-LD for this route */}
            <div className="pt-8 space-y-6 border-t border-[#D8D2C2]">
              <h2 className="font-serif-display text-2xl sm:text-3xl text-[#413C23] font-normal">
                Common Questions
              </h2>
              {guide.faqs.map((faq) => (
                <div key={faq.question} className="space-y-2">
                  <h3 className="text-base font-medium text-[#413C23]">{faq.question}</h3>
                  <p className="leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-[#D8D2C2]">
              <button
                onClick={onNavigateToHub}
                className="px-5 py-2.5 bg-[#413C23] text-[#E7E4D5] text-xs uppercase tracking-widest font-semibold rounded-xs hover:bg-[#8F896D] transition-colors cursor-pointer inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Guides</span>
              </button>
            </div>
          </article>

          {/* Related guides rail */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-[#F2EFDB] border border-[#D8D2C2] p-6 rounded-xs space-y-5">
              <h2 className="font-serif-display text-lg text-[#413C23] font-medium tracking-wide uppercase pb-2 border-b border-[#D8D2C2]">
                More Guides
              </h2>
              <div className="space-y-3">
                {related.map((g) => (
                  <button
                    key={g.slug}
                    onClick={() => onSelectGuide(g.slug)}
                    className="w-full text-left p-3 bg-[#E7E4D5] rounded-xs border border-[#D8D2C2] hover:border-[#8F896D] cursor-pointer transition-colors group"
                  >
                    <span className="block text-[10px] uppercase tracking-wider text-[#8F896D] font-semibold">
                      {g.category}
                    </span>
                    <span className="block text-sm text-[#413C23] group-hover:text-[#8F896D] transition-colors mt-0.5">
                      {g.shortTitle}
                    </span>
                  </button>
                ))}
              </div>
              <button
                onClick={onNavigateToShop}
                className="w-full py-3 bg-[#413C23] text-[#E7E4D5] text-xs uppercase tracking-widest font-semibold rounded-xs hover:bg-[#8F896D] transition-colors cursor-pointer"
              >
                Shop Dailywear Jewelry
              </button>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};

export const GuidesPage: React.FC<GuidesPageProps> = ({
  activeSlug,
  onSelectGuide,
  onNavigateToHub,
  onNavigateToShop,
}) => {
  const guide = activeSlug ? GUIDES.find((g) => g.slug === activeSlug) : undefined;

  if (guide) {
    return (
      <GuideArticle
        guide={guide}
        onNavigateToHub={onNavigateToHub}
        onSelectGuide={onSelectGuide}
        onNavigateToShop={onNavigateToShop}
      />
    );
  }

  // Hub view
  return (
    <div className="w-full text-left font-sans-body bg-[#E7E4D5] text-[#413C23] pb-24">
      <section className="relative w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 pt-4 pb-8 sm:pb-12">
        <div className="relative rounded-xs overflow-hidden border border-[#D8D2C2] bg-[#413C23] text-[#E7E4D5] py-14 sm:py-20 px-6 sm:px-12 text-center space-y-4">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] text-[#8F896D] uppercase block">
              Materials, Care &amp; Fit
            </span>
            <h1 className="font-serif-display text-4xl sm:text-6xl lg:text-7xl text-[#E7E4D5] tracking-tight font-light leading-tight">
              Jewelry Guides
            </h1>
            <p className="text-xs sm:text-sm text-[#E7E4D5]/80 max-w-lg mx-auto font-normal leading-relaxed pt-1">
              Straight answers about what brass jewelry actually is, how a protective
              anti-tarnish coating behaves, and how to get the fit right.
            </p>
          </div>
        </div>
      </section>

      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {GUIDES.map((g) => (
            <article
              key={g.slug}
              onClick={() => onSelectGuide(g.slug)}
              className="group cursor-pointer bg-[#F2EFDB] border border-[#D8D2C2] rounded-xs p-6 sm:p-8 flex flex-col justify-between gap-5 hover:border-[#8F896D] hover:shadow-xs transition-all duration-300"
            >
              <div className="space-y-3">
                <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-wider text-[#8F896D] font-semibold">
                  <BookOpen className="w-3.5 h-3.5" />
                  {g.category} · {g.readTime}
                </span>
                <h2 className="font-serif-display text-xl sm:text-2xl text-[#413C23] group-hover:text-[#8F896D] transition-colors leading-snug font-normal">
                  {g.heading}
                </h2>
                <p className="text-xs sm:text-sm text-[#413C23]/75 leading-relaxed">{g.summary}</p>
              </div>
              <div className="pt-3 border-t border-[#D8D2C2] flex items-center justify-between text-xs text-[#413C23] font-medium group-hover:text-[#8F896D]">
                <span className="uppercase tracking-wider text-[11px]">Read Guide</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
