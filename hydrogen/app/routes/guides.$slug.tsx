import type { LoaderFunctionArgs, MetaFunction } from 'react-router';
import { useLoaderData, Link } from 'react-router';
import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { GUIDES, type Guide, type GuideBlock } from '../data/guides';

export async function loader({ params }: LoaderFunctionArgs) {
  const guide = GUIDES.find((g) => g.slug === params.slug);
  if (!guide) {
    throw new Response('Guide not found', { status: 404 });
  }
  return { guide };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.guide) {
    return [{ title: 'Guide Not Found | AVIRENA' }];
  }
  const { guide } = data;
  return [
    { title: guide.metaTitle },
    { name: 'description', content: guide.metaDescription },
    { property: 'og:title', content: guide.metaTitle },
    { property: 'og:description', content: guide.metaDescription },
    { property: 'og:image', content: '/og-banner.jpg' },
  ];
};

function BlockRenderer({ block }: { block: GuideBlock }) {
  switch (block.type) {
    case 'lead':
      return (
        <p className="text-base sm:text-lg font-normal text-[#413C23] border-l-2 border-[#8F896D] pl-4 leading-relaxed my-4">
          {block.text}
        </p>
      );
    case 'heading':
      return (
        <h2 className="font-serif-display text-2xl sm:text-3xl text-[#413C23] font-normal leading-snug pt-6 pb-2">
          {block.text}
        </h2>
      );
    case 'paragraph':
      return <p className="leading-relaxed text-sm sm:text-base text-[#413C23]/85 my-3 font-normal">{block.text}</p>;
    case 'list':
      return (
        <ul className="space-y-2.5 list-disc pl-5 marker:text-[#8F896D] text-sm sm:text-base text-[#413C23]/85 my-3 font-normal">
          {block.items.map((item, i) => (
            <li key={i} className="leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      );
    case 'table':
      return (
        <div className="overflow-x-auto border border-[#D8D2C2] rounded-xs bg-[#F2EFDB] my-6">
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
                <tr key={ri} className="hover:bg-[#E7E4D5]/40 transition-colors">
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
}

export default function GuideDetailPage() {
  const { guide } = useLoaderData<typeof loader>();
  const related = GUIDES.filter((g) => g.slug !== guide.slug).slice(0, 3);

  return (
    <div className="w-full text-left font-sans-body bg-[#E7E4D5] text-[#413C23] pb-24 select-none">
      {/* Breadcrumbs */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 pt-8 pb-4">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#8F896D]"
        >
          <Link
            to="/guides"
            className="hover:text-[#413C23] transition-colors cursor-pointer"
          >
            Guides
          </Link>
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

            {/* Questions & Answers */}
            <div className="pt-8 space-y-6 border-t border-[#D8D2C2]">
              <h2 className="font-serif-display text-2xl sm:text-3xl text-[#413C23] font-normal">
                Common Questions
              </h2>
              {guide.faqs.map((faq) => (
                <div key={faq.question} className="space-y-2">
                  <h3 className="text-base font-medium text-[#413C23]">{faq.question}</h3>
                  <p className="leading-relaxed text-sm text-[#413C23]/80">{faq.answer}</p>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-[#D8D2C2]">
              <Link
                to="/guides"
                className="px-5 py-2.5 bg-[#413C23] text-[#E7E4D5] text-xs uppercase tracking-widest font-semibold rounded-xs hover:bg-[#8F896D] transition-colors cursor-pointer inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Guides</span>
              </Link>
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
                  <Link
                    key={g.slug}
                    to={`/guides/${g.slug}`}
                    className="w-full text-left p-3 bg-[#E7E4D5] rounded-xs border border-[#D8D2C2] hover:border-[#8F896D] cursor-pointer transition-colors group block"
                  >
                    <span className="block text-[10px] uppercase tracking-wider text-[#8F896D] font-semibold">
                      {g.category}
                    </span>
                    <span className="block text-sm text-[#413C23] group-hover:text-[#8F896D] transition-colors mt-0.5">
                      {g.shortTitle}
                    </span>
                  </Link>
                ))}
              </div>
              <Link
                to="/shop"
                className="w-full py-3 bg-[#413C23] text-[#E7E4D5] text-xs uppercase tracking-widest font-semibold rounded-xs hover:bg-[#8F896D] transition-colors block text-center"
              >
                Shop Dailywear Jewelry
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
