"use client";

import type { ChecklistSlide, BrandConfig } from "@/types/carousel";
import { SlideBase, getTextColor, getMutedColor } from "./slide-base";

interface Props {
  slide: ChecklistSlide;
  brand: BrandConfig;
}

export function ChecklistSlideComponent({ slide, brand }: Props) {
  const textColor = getTextColor(brand.theme);
  const mutedColor = getMutedColor(brand.theme);

  return (
    <SlideBase brand={brand}>
      <div className="flex flex-col justify-center h-full gap-5">
        <div
          className="text-xs font-bold uppercase tracking-[0.2em]"
          style={{ color: brand.accent }}
        >
          Checklist
        </div>

        <h2
          className="text-2xl md:text-3xl font-black leading-tight"
          style={{ color: textColor }}
        >
          {slide.headline}
        </h2>

        <ul className="flex flex-col gap-3 mt-2">
          {slide.items.map((item, i) => (
            <li key={i} className="flex items-center gap-3">
              <div
                className="w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border-2"
                style={{
                  borderColor: brand.accent,
                  background: item.checked ? brand.accent : "transparent",
                }}
              >
                {item.checked && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <span
                className="text-sm font-medium leading-snug"
                style={{ color: item.checked ? mutedColor : textColor }}
              >
                {item.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </SlideBase>
  );
}
