"use client";

import type { StatSlide, BrandConfig } from "@/types/carousel";
import { SlideBase, getTextColor, getMutedColor } from "./slide-base";

interface Props {
  slide: StatSlide;
  brand: BrandConfig;
}

export function StatSlideComponent({ slide, brand }: Props) {
  const textColor = getTextColor(brand.theme);
  const mutedColor = getMutedColor(brand.theme);

  return (
    <SlideBase brand={brand}>
      <div className="flex flex-col justify-center h-full gap-4">
        <div
          className="text-xs font-bold uppercase tracking-[0.2em]"
          style={{ color: brand.accent }}
        >
          By The Numbers
        </div>

        {/* Massive stat */}
        <div
          className="text-7xl md:text-8xl font-black leading-none tracking-tighter"
          style={{ color: brand.accent }}
        >
          {slide.stat}
        </div>

        <div
          className="text-xl font-bold leading-snug max-w-[80%]"
          style={{ color: textColor }}
        >
          {slide.label}
        </div>

        {slide.context && (
          <p className="text-sm font-medium mt-2" style={{ color: mutedColor }}>
            {slide.context}
          </p>
        )}

        {/* Decorative bar */}
        <div className="flex gap-1 mt-auto">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-1 rounded-full"
              style={{
                background: brand.accent,
                width: `${[40, 25, 15, 12, 8][i]}%`,
                opacity: 1 - i * 0.15,
              }}
            />
          ))}
        </div>
      </div>
    </SlideBase>
  );
}
