"use client";

import type { BodySlide, BrandConfig } from "@/types/carousel";
import { SlideBase, getTextColor, getMutedColor } from "./slide-base";

interface Props {
  slide: BodySlide;
  brand: BrandConfig;
}

export function BodySlideComponent({ slide, brand }: Props) {
  const textColor = getTextColor(brand.theme);
  const mutedColor = getMutedColor(brand.theme);

  return (
    <SlideBase brand={brand}>
      <div className="flex flex-col justify-center h-full gap-6">
        <div
          className="text-xs font-bold uppercase tracking-[0.2em]"
          style={{ color: brand.accent }}
        >
          {String(slide.slideNumber).padStart(2, "0")}
        </div>

        <h2
          className="text-3xl font-black leading-tight tracking-tight"
          style={{ color: textColor }}
        >
          {slide.headline}
        </h2>

        <ul className="flex flex-col gap-3 mt-2">
          {slide.bullets.map((bullet, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: brand.accent }}
              />
              <span className="text-base font-medium leading-snug" style={{ color: mutedColor }}>
                {bullet}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </SlideBase>
  );
}
