"use client";

import type { HookSlide, BrandConfig } from "@/types/carousel";
import { SlideBase, getTextColor, getMutedColor } from "./slide-base";

interface Props {
  slide: HookSlide;
  brand: BrandConfig;
}

function highlightEmphasis(text: string, emphasis: string[] = [], accent: string): React.ReactNode {
  if (!emphasis.length) return text;
  const pattern = new RegExp(`(${emphasis.map((e) => e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  const parts = text.split(pattern);
  return parts.map((part, i) =>
    emphasis.some((e) => e.toLowerCase() === part.toLowerCase()) ? (
      <span key={i} style={{ color: accent }}>
        {part}
      </span>
    ) : (
      part
    )
  );
}

export function HookSlideComponent({ slide, brand }: Props) {
  const textColor = getTextColor(brand.theme);
  const mutedColor = getMutedColor(brand.theme);

  return (
    <SlideBase brand={brand}>
      <div className="flex flex-col justify-center h-full gap-6">
        {/* Eyebrow accent */}
        <div
          className="text-xs font-bold uppercase tracking-[0.2em]"
          style={{ color: brand.accent }}
        >
          {brand.name}
        </div>

        {/* Big headline */}
        <h1
          className="text-4xl md:text-5xl font-black leading-[1.05] tracking-tight"
          style={{ color: textColor }}
        >
          {highlightEmphasis(slide.headline, slide.emphasis, brand.accent)}
        </h1>

        {slide.subtext && (
          <p
            className="text-lg font-medium leading-snug max-w-[85%]"
            style={{ color: mutedColor }}
          >
            {slide.subtext}
          </p>
        )}

        {/* Swipe indicator */}
        <div className="flex items-center gap-2 mt-auto" style={{ color: mutedColor }}>
          <span className="text-sm font-medium">Swipe to learn more</span>
          <span style={{ color: brand.accent }}>→</span>
        </div>
      </div>
    </SlideBase>
  );
}
