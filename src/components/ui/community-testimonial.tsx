import React from "react";

export interface TestimonialItem {
  id?: string;
  quote: string;
  authorName: string;
  authorTitle: string;
  avatarUrl: string;
}

export interface TestimonialRow {
  id: string;
  speed?: string;
  direction?: "left" | "right";
  testimonials: TestimonialItem[];
}

export interface TestimonialsData {
  title: string;
  subtitle: string;
  rows: TestimonialRow[];
}

export interface TestimonialCardProps {
  quote: string;
  authorName: string;
  authorTitle: string;
  avatarUrl: string;
}

/**
 * TestimonialCard
 * Props: quote, authorName, authorTitle, avatarUrl
 */
export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  authorName,
  authorTitle,
  avatarUrl,
}) => {
  return (
    <div className="testimonial-card flex flex-col items-start gap-4 p-6 bg-white rounded-lg shadow-lg w-96 flex-shrink-0 border border-gray-100/80 hover:shadow-xl transition-shadow duration-300">
      <p className="text-gray-700 text-lg leading-relaxed">"{quote}"</p>
      <div className="flex items-center gap-4 mt-auto pt-2">
        <img
          src={avatarUrl}
          alt={authorName}
          loading="lazy"
          className="w-12 h-12 rounded-full bg-gray-200 object-cover ring-2 ring-gray-100"
          onError={(e) => {
            // Graceful fallback avatar if image fails to load
            const target = e.currentTarget;
            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=8F896D&color=fff&size=96`;
          }}
        />
        <div>
          <h4 className="text-lg font-bold text-gray-900 leading-tight">{authorName}</h4>
          <p className="text-gray-600 text-sm">{authorTitle}</p>
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
 * HorizontalScroller
 * Props: children, speed (e.g., "40s"), direction ("left" | "right")
 */
export const HorizontalScroller: React.FC<HorizontalScrollerProps> = ({
  children,
  speed = "40s",
  direction = "left",
}) => {
  const animationClass =
    direction === "right" ? "animate-scroll-horizontal-reverse" : "animate-scroll-horizontal";

  return (
    <div className="w-full overflow-hidden group relative mask-fade">
      <div
        className={`flex ${animationClass}`}
        style={{ ["--scroll-duration" as string]: speed } as React.CSSProperties}
      >
        <div className="flex items-stretch justify-center gap-8 px-4">{children}</div>
        <div className="flex items-stretch justify-center gap-8 px-4" aria-hidden="true">
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
 * TestimonialsSection
 * Props: data { title, subtitle, rows[] }
 */
export default function TestimonialsSection({ data }: TestimonialsSectionProps) {
  return (
    <section className="testimonials-section relative flex flex-col items-center gap-12 p-6 sm:p-10 w-full max-w-7xl mx-auto overflow-hidden">
      <div className="flex flex-col items-center gap-4 sm:gap-6 text-center z-10 max-w-2xl px-4">
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-black leading-tight tracking-tight"
          style={{ opacity: 0, animation: "fadeInUp 0.7s ease-out 0.2s forwards" }}
        >
          {data.title}
        </h2>
        <p
          className="text-base sm:text-lg text-gray-700 leading-relaxed"
          style={{ opacity: 0, animation: "fadeInUp 0.7s ease-out 0.4s forwards" }}
        >
          {data.subtitle}
        </p>
      </div>

      <div className="flex flex-col gap-6 sm:gap-8 z-10 w-full max-w-6xl">
        {data.rows.map((row) => (
          <HorizontalScroller key={row.id} speed={row.speed} direction={row.direction}>
            {row.testimonials.map((t) => (
              <TestimonialCard
                key={t.id || t.authorName}
                quote={t.quote}
                authorName={t.authorName}
                authorTitle={t.authorTitle}
                avatarUrl={t.avatarUrl}
              />
            ))}
          </HorizontalScroller>
        ))}
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 85% 67% at 50% 100%, rgba(189,204,255,0.45) 0%, transparent 60%)",
          zIndex: 0,
        }}
      />
    </section>
  );
}
