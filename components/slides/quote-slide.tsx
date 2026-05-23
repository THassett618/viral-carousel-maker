"use client";

import type { QuoteSlide, BrandConfig } from "@/types/carousel";
import { SlideBase, getTextColor, getMutedColor } from "./slide-base";

interface Props {
  slide: QuoteSlide;
  brand: BrandConfig;
}

export function QuoteSlideComponent({ slide, brand }: Props) {
  const textColor = getTextColor(brand.theme);
  const mutedColor = getMutedColor(brand.theme);

  return (
    <SlideBase brand={brand}>
      <div className="flex flex-col justify-center h-full gap-6">
        {/* Big quote mark */}
        <div className="text-8xl font-black leading-none" style={{ color: brand.accent, opacity: 0.3 }}>
          "
        </div>

        <blockquote
          className="text-2xl md:text-3xl font-bold leading-snug -mt-8"
          style={{ color: textColor }}
        >
          {slide.quote}
        </blockquote>

        {(slide.attribution || slide.context) && (
          <div className="flex flex-col gap-1 mt-4 border-l-2 pl-4" style={{ borderColor: brand.accent }}>
            {slide.attribution && (
              <span className="text-sm font-bold" style={{ color: brand.accent }}>
                {slide.attribution}
              </span>
            )}
            {slide.context && (
              <span className="text-sm" style={{ color: mutedColor }}>
                {slide.context}
              </span>
            )}
          </div>
        )}
      </div>
    </SlideBase>
  );
}
