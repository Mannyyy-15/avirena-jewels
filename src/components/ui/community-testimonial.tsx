import React from "react";
import { Star, CheckCircle2 } from "lucide-react";

export interface TestimonialItem {
  id?: string;
  quote: string;
  authorName: string;
  authorTitle: string;
  avatarUrl: string;
  rating?: number;
  verified?: boolean;
}

export interface TestimonialRow {
  id: string;
  speed?: string;
  direction?: "left" | "right";
  testimonials: TestimonialItem[];
}

export interface TestimonialsData {
  eyebrow?: string;
  title: string;
  subtitle: string;
  rows: TestimonialRow[];
}

export interface TestimonialCardProps {
  quote: string;
  authorName: string;
  authorTitle: string;
  avatarUrl: string;
  rating?: number;
  verified?: boolean;
}

/**
 * TestimonialCard — Styled for AVIRENA's warm luxury aesthetic
 */
export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  authorName,
  authorTitle,
  avatarUrl,
  rating = 5,
  verified = true,
}) => {
  return (
    <div className="testimonial-card flex flex-col items-start justify-between p-6 sm:p-7 bg-[#FAF8F5] rounded-xl shadow-[0_4px_20px_rgba(65,60,35,0.06)] hover:shadow-[0_8px_30px_rgba(65,60,35,0.12)] w-[320px] sm:w-[380px] flex-shrink-0 border border-[#8F896D]/20 hover:border-[#D4AF37]/60 transition-all duration-300">
      
      <div>
        {/* Top: 5 Gold Stars & Verified Badge */}
        <div className="flex items-center justify-between w-full mb-3.5">
          <div className="flex items-center gap-1 text-[#D4AF37]">
            {[...Array(rating)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current text-[#D4AF37]" strokeWidth={0} />
            ))}
          </div>
          {verified && (
            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold text-[#8F896D] bg-[#E7E4D5]/60 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3 text-[#D4AF37]" />
              Verified Buyer
            </span>
          )}
        </div>

        {/* Quote text */}
        <p className="text-[#413C23] text-sm sm:text-[15px] leading-relaxed font-sans-body font-normal italic">
          "{quote}"
        </p>
      </div>

      {/* Author Details */}
      <div className="flex items-center gap-3.5 mt-5 pt-3.5 border-t border-[#8F896D]/15 w-full">
        <img
          src={avatarUrl}
          alt={authorName}
          loading="lazy"
          className="w-11 h-11 rounded-full object-cover ring-2 ring-[#D4AF37]/30 shrink-0 bg-[#E7E4D5]"
          onError={(e) => {
            const target = e.currentTarget;
            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=8F896D&color=fff&size=96`;
          }}
        />
        <div className="min-w-0">
          <h4 className="text-sm font-bold text-[#413C23] font-sans-body tracking-tight leading-tight truncate">
            {authorName}
          </h4>
          <p className="text-[#8F896D] text-xs font-light tracking-wide truncate">
            {authorTitle}
          </p>
        </div>
      </div>

    </div>
  );
};

export interface HorizontalScrollerProps {
  children: React.ReactNode;
  speed?: string;
  direction?: "left" | "right";
}

/**
 * HorizontalScroller with pause-on-hover & smooth continuous loop
 */
export const HorizontalScroller: React.FC<HorizontalScrollerProps> = ({
  children,
  speed = "40s",
  direction = "left",
}) => {
  const animationClass =
    direction === "right" ? "animate-scroll-horizontal-reverse" : "animate-scroll-horizontal";

  return (
    <div className="w-full overflow-hidden group relative mask-fade py-2">
      <div
        className={`flex w-max ${animationClass}`}
        style={{ ["--scroll-duration" as string]: speed } as React.CSSProperties}
      >
        <div className="flex shrink-0 items-stretch justify-center gap-6 sm:gap-8 px-3 sm:px-4">
          {children}
        </div>
        <div className="flex shrink-0 items-stretch justify-center gap-6 sm:gap-8 px-3 sm:px-4" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
};

export interface TestimonialsSectionProps {
  data: TestimonialsData;
}

/**
 * TestimonialsSection — Bespoke 2-row luxury showcase
 */
export default function TestimonialsSection({ data }: TestimonialsSectionProps) {
  return (
    <section className="testimonials-section relative flex flex-col items-center gap-8 sm:gap-10 py-16 sm:py-20 w-full overflow-hidden">
      
      {/* Editorial Header */}
      <div className="flex flex-col items-center gap-2.5 sm:gap-3 text-center z-10 max-w-2xl px-4">
        {data.eyebrow && (
          <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] font-bold text-[#8F896D]">
            {data.eyebrow}
          </span>
        )}
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-[#413C23] leading-tight tracking-tight font-normal">
          {data.title}
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-[#8F896D] max-w-xl leading-relaxed font-sans-body">
          {data.subtitle}
        </p>
      </div>

      {/* 2-Row Horizontal Scrollers */}
      <div className="flex flex-col gap-5 sm:gap-6 z-10 w-full">
        {data.rows.map((row) => (
          <HorizontalScroller key={row.id} speed={row.speed} direction={row.direction}>
            {row.testimonials.map((t) => (
              <TestimonialCard
                key={t.id || t.authorName}
                quote={t.quote}
                authorName={t.authorName}
                authorTitle={t.authorTitle}
                avatarUrl={t.avatarUrl}
                rating={t.rating}
                verified={t.verified}
              />
            ))}
          </HorizontalScroller>
        ))}
      </div>

    </section>
  );
}
