"use client";

import type { CTASlide, BrandConfig } from "@/types/carousel";
import { SlideBase, getTextColor, getMutedColor } from "./slide-base";

interface Props {
  slide: CTASlide;
  brand: BrandConfig;
}

export function CTASlideComponent({ slide, brand }: Props) {
  const textColor = getTextColor(brand.theme);
  const mutedColor = getMutedColor(brand.theme);

  return (
    <SlideBase brand={brand}>
      <div className="flex flex-col justify-center items-center h-full gap-6 text-center">
        {/* Brand mark */}
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black"
          style={{ background: brand.accent, color: "#fff" }}
        >
          {brand.name.charAt(0).toUpperCase()}
        </div>

        <h2
          className="text-3xl md:text-4xl font-black leading-tight"
          style={{ color: textColor }}
        >
          {slide.headline}
        </h2>

        {slide.subtext && (
          <p className="text-base font-medium max-w-[80%]" style={{ color: mutedColor }}>
            {slide.subtext}
          </p>
        )}

        {/* CTA button */}
        <div
          className="px-6 py-3 rounded-xl font-bold text-sm mt-2"
          style={{ background: brand.accent, color: "#fff" }}
        >
          {slide.cta}
        </div>

        {slide.handle && (
          <div className="text-sm font-bold mt-auto" style={{ color: brand.accent }}>
            {slide.handle}
          </div>
        )}
      </div>
    </SlideBase>
  );
}
