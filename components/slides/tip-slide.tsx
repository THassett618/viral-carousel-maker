"use client";

import type { TipSlide, BrandConfig } from "@/types/carousel";
import { SlideBase, getTextColor, getMutedColor } from "./slide-base";

interface Props {
  slide: TipSlide;
  brand: BrandConfig;
}

export function TipSlideComponent({ slide, brand }: Props) {
  const textColor = getTextColor(brand.theme);
  const mutedColor = getMutedColor(brand.theme);

  return (
    <SlideBase brand={brand}>
      <div className="flex flex-col justify-center h-full gap-5">
        {/* Tip badge */}
        <div className="inline-flex items-center gap-2">
          <div
            className="text-xs font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full"
            style={{ background: brand.accent, color: "#fff" }}
          >
            {slide.number ? `Tip ${slide.number}` : "Tip"}
          </div>
        </div>

        <h2
          className="text-3xl font-black leading-tight"
          style={{ color: textColor }}
        >
          {slide.headline}
        </h2>

        <p
          className="text-base font-medium leading-relaxed"
          style={{ color: mutedColor }}
        >
          {slide.body}
        </p>

        {/* Decorative element */}
        <div className="mt-auto flex gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-0.5 flex-1 rounded-full"
              style={{
                background: brand.accent,
                opacity: i === 0 ? 1 : 0.3,
              }}
            />
          ))}
        </div>
      </div>
    </SlideBase>
  );
}
