import React from "react";
import TestimonialsSection from "@/components/ui/community-testimonial";

export default function DemoOne() {
  const testimonialsData = {
    title: "Don't just take our word for it",
    subtitle:
      "See what our users are saying about how our app has transformed their daily routines and helped them build lasting habits.",
    rows: [
      {
        id: "row1",
        speed: "50s",
        direction: "left" as const,
        testimonials: [
          {
            id: "t1",
            quote:
              "This app completely changed how I approach my goals. The visual feedback is incredibly motivating!",
            authorName: "Sarah K.",
            authorTitle: "Productivity Blogger",
            avatarUrl:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
          },
          {
            id: "t2",
            quote:
              "I've tried countless habit trackers, and this is the first one that actually stuck. It's simple, beautiful, and effective.",
            authorName: "Michael B.",
            authorTitle: "Software Engineer",
            avatarUrl:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
          },
          {
            id: "t3",
            quote:
              "The team accountability features are a game-changer. Our entire group is more motivated and connected.",
            authorName: "Emily W.",
            authorTitle: "Startup Founder",
            avatarUrl:
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
          },
        ],
      },
      {
        id: "row2",
        speed: "40s",
        direction: "right" as const,
        testimonials: [
          {
            id: "t4",
            quote:
              "The design is just stunning. It feels less like a chore and more like a game. I'm hooked!",
            authorName: "David L.",
            authorTitle: "UX Designer",
            avatarUrl:
              "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
          },
          {
            id: "t5",
            quote:
              "Simple, no clutter, does exactly what it promises. The reminders are gentle but effective.",
            authorName: "Jessica P.",
            authorTitle: "Student",
            avatarUrl:
              "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80",
          },
          {
            id: "t6",
            quote:
              "Seeing my progress in the analytics section is the best part of my week. It shows my work is paying off.",
            authorName: "Alex C.",
            authorTitle: "Data Analyst",
            avatarUrl:
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80",
          },
        ],
      },
      {
        id: "row3",
        speed: "60s",
        direction: "left" as const,
        testimonials: [
          {
            id: "t7",
            quote:
              "I love that my data is private. In a world where everything is tracked, this feels safe and personal.",
            authorName: "Kenji T.",
            authorTitle: "Privacy Advocate",
            avatarUrl:
              "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&h=150&q=80",
          },
          {
            id: "t8",
            quote:
              "Finally, a habit app that isn't bloated with features I don't need. It's focused and powerful.",
            authorName: "Maria G.",
            authorTitle: "Writer",
            avatarUrl:
              "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
          },
          {
            id: "t9",
            quote:
              "The community support is surprisingly wholesome. It's a great place for accountability.",
            authorName: "Chris R.",
            authorTitle: "Fitness Coach",
            avatarUrl:
              "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80",
          },
        ],
      },
    ],
  };

  return (
    <div
      className="app-root bg-radial w-full flex items-center justify-center py-16 sm:py-24 px-4 overflow-hidden border-t border-[#8F896D]/15"
      aria-label="Testimonials showcase"
    >
      <TestimonialsSection data={testimonialsData} />
    </div>
  );
}
