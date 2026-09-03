// Originkit — props baked into the default export.
"use client";

import React, { useRef, useState, useEffect, type CSSProperties } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  type Transition as MotionTransition,
} from "framer-motion";

interface Item {
  text?: string;
  image?: { src?: string; srcSet?: string; alt?: string };
  link?: string;
  category?: string;
}

interface ItemsValue {
  itemCount?: number;
  [key: string]: unknown;
}

const MAX_ITEMS = 6;

interface FontValue {
  fontSize?: number | string;
  letterSpacing?: number | string;
  lineHeight?: number | string;
  [key: string]: unknown;
}

export interface HoverImageRevealProps {
  items?: ItemsValue;
  font?: FontValue;
  textColor?: string;
  dimColor?: string;
  align?: "left" | "center" | "right";
  rowGap?: number;
  imageWidth?: number;
  imageHeight?: number;
  rounded?: number;
  offsetX?: number;
  offsetY?: number;
  followStrength?: number;
  transition?: MotionTransition;
  backgroundColor?: string;
  style?: CSSProperties;
  onItemClick?: (item: Item, index: number) => void;
}

const DEFAULT_ITEMS_DATA: { text: string; src: string }[] = [
  {
    text: "NEW SEASON DROP",
    src: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/8e0d22a8-ac82-4893-90d8-3403f80ec600/w=800",
  },
  {
    text: "ESSENTIAL COLLECTION",
    src: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/d6af07a0-4dc5-4de4-07b1-9d2ad6100000/w=800",
  },
  {
    text: "SUMMER EDITION",
    src: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/c083d83a-f5a4-4434-989f-4eaa9bbe7500/w=800",
  },
  {
    text: "STREET ICONS",
    src: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/93bad0e0-e2ab-4e21-de9c-4cb54b028f00/w=800",
  },
  {
    text: "PREMIUM DENIM",
    src: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/09a59a65-3c07-4500-f72c-68c824168c00/w=800",
  },
  {
    text: "ARCHIVE PIECES",
    src: "https://imagedelivery.net/IEUjvl3YUlxY-MrTpOAWDQ/8e0d22a8-ac82-4893-90d8-3403f80ec600/w=800",
  },
];

const DEFAULT_ITEMS: ItemsValue = {
  itemCount: 5,
  item1: {
    text: DEFAULT_ITEMS_DATA[0].text,
    image: { src: DEFAULT_ITEMS_DATA[0].src },
  },
  item2: {
    text: DEFAULT_ITEMS_DATA[1].text,
    image: { src: DEFAULT_ITEMS_DATA[1].src },
  },
  item3: {
    text: DEFAULT_ITEMS_DATA[2].text,
    image: { src: DEFAULT_ITEMS_DATA[2].src },
  },
  item4: {
    text: DEFAULT_ITEMS_DATA[3].text,
    image: { src: DEFAULT_ITEMS_DATA[3].src },
  },
  item5: {
    text: DEFAULT_ITEMS_DATA[4].text,
    image: { src: DEFAULT_ITEMS_DATA[4].src },
  },
  item6: {
    text: DEFAULT_ITEMS_DATA[5].text,
    image: { src: DEFAULT_ITEMS_DATA[5].src },
  },
};

const DEFAULT_FONT: FontValue = {
  fontFamily: "Inter",
  fontWeight: 400,
  fontSize: 61,
  lineHeight: "0.9em",
  letterSpacing: "-0.05em",
  textAlign: "left",
};

const alignToFlex: Record<string, CSSProperties["alignItems"]> = {
  left: "flex-start",
  center: "center",
  right: "flex-end",
};
const alignToText: Record<string, CSSProperties["textAlign"]> = {
  left: "left",
  center: "center",
  right: "right",
};

function __OriginkitBase_HoverImageReveal({
  items = DEFAULT_ITEMS,
  font = DEFAULT_FONT,
  textColor = "#FFFFFF",
  dimColor = "#51565A",
  align = "center",
  rowGap = 30,
  imageWidth = 320,
  imageHeight = 420,
  rounded = 16,
  offsetX = 140,
  offsetY = 0,
  followStrength = 5,
  backgroundColor = "#000000",
  style,
  onItemClick,
}: HoverImageRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const hasInitializedPos = useRef(false);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const stiffness = 85 + followStrength * 6;
  const springCfg = { stiffness, damping: 24, mass: 0.4 };
  const x = useSpring(rawX, springCfg);
  const y = useSpring(rawY, springCfg);

  const data = items || DEFAULT_ITEMS;
  const count = Math.max(
    1,
    Math.min(MAX_ITEMS, (data.itemCount as number) || 5)
  );
  const list: Item[] = [];
  for (let i = 1; i <= count; i++) {
    const it = data[`item${i}`] as Item | undefined;
    const fallback = DEFAULT_ITEMS_DATA[i - 1];
    list.push({
      text: it?.text ?? fallback?.text ?? `Item ${i}`,
      image: it?.image ?? (fallback ? { src: fallback.src } : undefined),
      link: it?.link,
      category: it?.category,
    });
  }

  // Preload images to avoid any hover flash or latency
  useEffect(() => {
    list.forEach((item) => {
      if (item.image?.src) {
        const img = new Image();
        img.src = item.image.src;
      }
    });
  }, [list]);

  const anyActive = hovered != null;

  const updatePosition = (clientX: number, clientY: number, instant = false) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    let targetX = clientX - rect.left + offsetX;
    let targetY = clientY - rect.top + offsetY;

    // Keep the preview within container bounds so it never gets clipped awkwardly
    const halfW = imageWidth / 2;
    const halfH = imageHeight / 2;
    const padding = 16;
    targetX = Math.max(halfW + padding, Math.min(rect.width - halfW - padding, targetX));
    targetY = Math.max(halfH + padding, Math.min(rect.height - halfH - padding, targetY));

    if (instant || !hasInitializedPos.current) {
      rawX.jump(targetX);
      rawY.jump(targetY);
      hasInitializedPos.current = true;
    } else {
      rawX.set(targetX);
      rawY.set(targetY);
    }
  };

  const onMove = (e: React.MouseEvent) => {
    updatePosition(e.clientX, e.clientY);
  };

  const handleMouseEnterItem = (i: number, e: React.MouseEvent) => {
    if (!hasInitializedPos.current || hovered === null) {
      updatePosition(e.clientX, e.clientY, true);
    }
    setHovered(i);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={onMove}
      onMouseLeave={() => {
        setHovered(null);
        hasInitializedPos.current = false;
      }}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "visible",
        backgroundColor,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: alignToFlex[align],
        gap: `${rowGap}px`,
        padding: "24px 16px",
        boxSizing: "border-box",
        cursor: "default",
        ...(font as CSSProperties),
        ...style,
      }}
    >
      {/* Floating Image Reveal Preview Card */}
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
          width: imageWidth,
          height: imageHeight,
          borderRadius: rounded,
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 30,
          boxShadow: "0 25px 50px -12px rgba(44, 44, 42, 0.25), 0 10px 20px -5px rgba(44, 44, 42, 0.15)",
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: anyActive ? 1 : 0,
          scale: anyActive ? 1 : 0.92,
        }}
        transition={{
          duration: 0.28,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {list.map((item, i) => {
          const src = item.image?.src;
          const isCurrent = hovered === i;

          return (
            <motion.div
              key={i}
              initial={false}
              animate={{
                opacity: isCurrent ? 1 : 0,
                scale: isCurrent ? 1 : 1.06,
              }}
              transition={{
                duration: 0.35,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                overflow: "hidden",
                backgroundColor: "#E6DFD3",
                zIndex: isCurrent ? 2 : 1,
              }}
            >
              {src ? (
                <img
                  src={src}
                  alt={item.image?.alt || item.text || ""}
                  referrerPolicy="no-referrer"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(135deg, #DDD7CB, #B8B5A5)",
                  }}
                />
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Typography Category Items List */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: alignToFlex[align],
          gap: `${rowGap}px`,
          zIndex: 10,
          width: "100%",
        }}
      >
        {list.map((item, i) => {
          const isHovered = hovered === i;
          const color = anyActive ? (isHovered ? textColor : dimColor) : textColor;
          
          return (
            <div
              key={i}
              onMouseEnter={(e) => handleMouseEnterItem(i, e)}
              onClick={() => onItemClick?.(item, i)}
              style={{
                cursor: item.link || onItemClick ? "pointer" : "default",
                userSelect: "none",
                display: "inline-block",
                transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                transform: isHovered ? "scale(1.02)" : "scale(1)",
              }}
            >
              <span
                style={{
                  display: "block",
                  color,
                  transition: "color 0.25s ease",
                  whiteSpace: "pre",
                  textAlign: alignToText[align],
                  lineHeight: "1.05",
                }}
              >
                {item.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const __originkitPresetProps = {
  "overrides": {},
  "__curationVersion": 1
};

export default function HoverImageReveal(props: Record<string, unknown>) {
  return <__OriginkitBase_HoverImageReveal {...(__originkitPresetProps as Record<string, unknown>)} {...props} />;
}

