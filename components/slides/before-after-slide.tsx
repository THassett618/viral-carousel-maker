"use client";

import type { BeforeAfterSlide, BrandConfig } from "@/types/carousel";
import { SlideBase, getTextColor, getMutedColor, getBorderColor } from "./slide-base";

interface Props {
  slide: BeforeAfterSlide;
  brand: BrandConfig;
}

export function BeforeAfterSlideComponent({ slide, brand }: Props) {
  const textColor = getTextColor(brand.theme);
  const mutedColor = getMutedColor(brand.theme);
  const borderColor = getBorderColor(brand.theme);

  return (
    <SlideBase brand={brand}>
      <div className="flex flex-col justify-center h-full gap-5">
        <h2
          className="text-2xl font-black leading-tight"
          style={{ color: textColor }}
        >
          {slide.headline}
        </h2>

        <div className="flex flex-col gap-3 mt-2">
          {/* Before */}
          <div
            className="rounded-xl p-4 border"
            style={{ borderColor, background: "rgba(239,68,68,0.08)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-red-400">Before</span>
            </div>
            <p className="text-sm font-medium leading-snug" style={{ color: mutedColor }}>
              {slide.before}
            </p>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <span className="text-2xl" style={{ color: brand.accent }}>↓</span>
          </div>

          {/* After */}
          <div
            className="rounded-xl p-4 border"
            style={{
              borderColor: brand.accent,
              background: `${brand.accent}15`,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: brand.accent }}>
                After
              </span>
            </div>
            <p className="text-sm font-medium leading-snug" style={{ color: textColor }}>
              {slide.after}
            </p>
          </div>
        </div>
      </div>
    </SlideBase>
  );
}
