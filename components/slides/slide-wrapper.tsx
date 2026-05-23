"use client";

import { cn } from "@/lib/utils";
import type { CarouselSpec, Slide, AspectRatio } from "@/types/carousel";
import { HookSlideComponent } from "./hook-slide";
import { BodySlideComponent } from "./body-slide";
import { QuoteSlideComponent } from "./quote-slide";
import { StatSlideComponent } from "./stat-slide";
import { ChecklistSlideComponent } from "./checklist-slide";
import { BeforeAfterSlideComponent } from "./before-after-slide";
import { TipSlideComponent } from "./tip-slide";
import { CTASlideComponent } from "./cta-slide";
import { FazioSlide } from "./templates/fazio-slide";

const RATIO_CLASSES: Record<AspectRatio, string> = {
  "4:5": "aspect-[4/5]",
  "1:1": "aspect-square",
  "9:16": "aspect-[9/16]",
  "16:9": "aspect-video",
};

interface SlideWrapperProps {
  slide: Slide;
  spec: CarouselSpec;
  className?: string;
  scale?: number;
}

export function SlideWrapper({ slide, spec, className, scale = 1 }: SlideWrapperProps) {
  const { brand, ratio } = spec;

  const sharedProps = { slide, brand };

  const content = () => {
    if (brand.template === "fazio") {
      return <FazioSlide slide={slide} brand={brand} />;
    }
    switch (slide.type) {
      case "hook": return <HookSlideComponent {...sharedProps} slide={slide} />;
      case "body": return <BodySlideComponent {...sharedProps} slide={slide} />;
      case "quote": return <QuoteSlideComponent {...sharedProps} slide={slide} />;
      case "stat": return <StatSlideComponent {...sharedProps} slide={slide} />;
      case "checklist": return <ChecklistSlideComponent {...sharedProps} slide={slide} />;
      case "before_after": return <BeforeAfterSlideComponent {...sharedProps} slide={slide} />;
      case "tip": return <TipSlideComponent {...sharedProps} slide={slide} />;
      case "cta": return <CTASlideComponent {...sharedProps} slide={slide} />;
      default: return null;
    }
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg select-none",
        RATIO_CLASSES[ratio],
        className
      )}
      style={{ transform: scale !== 1 ? `scale(${scale})` : undefined }}
    >
      {content()}
    </div>
  );
}
