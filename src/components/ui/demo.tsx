import React from "react";
import TestimonialsSection, { TestimonialsData } from "@/components/ui/community-testimonial";

export default function DemoOne() {
  const testimonialsData: TestimonialsData = {
    eyebrow: "Client Stories & Atelier Reviews",
    title: "Loved by Modern Women Across India",
    subtitle:
      "Real impressions from clients who wear AVIRENA anti-tarnish sculptural jewelry every single day.",
    rows: [
      {
        id: "row1",
        speed: "45s",
        direction: "left",
        testimonials: [
          {
            id: "t1",
            quote:
              "I've worn the Avirena Square Studs through Mumbai monsoon humidity and daily gym workouts. Not a single trace of tarnish or skin discoloration.",
            authorName: "Ananya Sharma",
            authorTitle: "Verified Buyer • Mumbai, MH",
            avatarUrl:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
            rating: 5,
            verified: true,
          },
          {
            id: "t2",
            quote:
              "The gold tone is so rich and authentic — not that fake yellowish finish. Everyone at my office asked if these were solid 18k gold heirloom earrings.",
            authorName: "Rhea Singhania",
            authorTitle: "Architect • Bengaluru, KA",
            avatarUrl:
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
            rating: 5,
            verified: true,
          },
          {
            id: "t3",
            quote:
              "Sensitive ears approved! Most fashion jewellery makes my lobes burn within 20 minutes. Avirena's hypoallergenic brass is a lifesaver.",
            authorName: "Devika Mehra",
            authorTitle: "Verified Buyer • New Delhi, DL",
            avatarUrl:
              "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80",
            rating: 5,
            verified: true,
          },
          {
            id: "t4",
            quote:
              "The unboxing experience was like opening a Parisian jewellery box. Heavy, sculptural, and feels 5x its price tag. Fast 2-day delivery too!",
            authorName: "Priya Iyer",
            authorTitle: "Creative Director • Chennai, TN",
            avatarUrl:
              "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
            rating: 5,
            verified: true,
          },
        ],
      },
      {
        id: "row2",
        speed: "42s",
        direction: "right",
        testimonials: [
          {
            id: "t5",
            quote:
              "The weight balance is incredible. They look substantial and architectural, yet feel weightless on the ear from morning meetings to dinners.",
            authorName: "Natasha Kapoor",
            authorTitle: "Verified Buyer • Gurugram, HR",
            avatarUrl:
              "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150&q=80",
            rating: 5,
            verified: true,
          },
          {
            id: "t6",
            quote:
              "Finally, an Indian jewellery brand that understands modern minimalism! Pure sculptural elegance that pairs seamlessly with both sarees and blazers.",
            authorName: "Meera Varma",
            authorTitle: "Brand Strategist • Hyderabad, TG",
            avatarUrl:
              "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80",
            rating: 5,
            verified: true,
          },
          {
            id: "t7",
            quote:
              "Ordered for my sister's birthday and she literally teared up. The gift box and concierge WhatsApp assistance were top tier. My new go-to brand!",
            authorName: "Tanvi Deshmukh",
            authorTitle: "Verified Buyer • Pune, MH",
            avatarUrl:
              "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=150&h=150&q=80",
            rating: 5,
            verified: true,
          },
          {
            id: "t8",
            quote:
              "Living in Jaipur, I know fine craftsmanship. The finish on the Volute spirals is mirror-like and immaculate. Zero tarnishing after 3 months!",
            authorName: "Aashi Saxena",
            authorTitle: "Jewelry Enthusiast • Jaipur, RJ",
            avatarUrl:
              "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=150&h=150&q=80",
            rating: 5,
            verified: true,
          },
        ],
      },
    ],
  };

  return (
    <div
      className="app-root w-full bg-gradient-to-b from-[#E7E4D5] via-[#F2EFDB] to-[#E7E4D5] border-t border-b border-[#8F896D]/20 overflow-hidden"
      aria-label="Avirena Client Testimonials"
    >
      <TestimonialsSection data={testimonialsData} />
    </div>
  );
}
