export type Platform = "instagram" | "linkedin" | "twitter";
export type AspectRatio = "4:5" | "1:1" | "9:16" | "16:9";
export type Theme = "dark" | "light" | "gradient" | "minimal";

export type SlideType =
  | "hook"
  | "body"
  | "quote"
  | "stat"
  | "checklist"
  | "before_after"
  | "tip"
  | "cta";

export interface BrandConfig {
  name: string;
  theme: Theme;
  accent: string;
  font?: string;
}

export interface BaseSlide {
  id: string;
  type: SlideType;
  slideNumber: number;
}

export interface HookSlide extends BaseSlide {
  type: "hook";
  headline: string;
  subtext?: string;
  emphasis?: string[];
}

export interface BodySlide extends BaseSlide {
  type: "body";
  headline: string;
  bullets: string[];
  emphasis?: string[];
}

export interface QuoteSlide extends BaseSlide {
  type: "quote";
  quote: string;
  attribution?: string;
  context?: string;
}

export interface StatSlide extends BaseSlide {
  type: "stat";
  stat: string;
  label: string;
  context?: string;
}

export interface ChecklistSlide extends BaseSlide {
  type: "checklist";
  headline: string;
  items: Array<{ text: string; checked?: boolean }>;
}

export interface BeforeAfterSlide extends BaseSlide {
  type: "before_after";
  headline: string;
  before: string;
  after: string;
}

export interface TipSlide extends BaseSlide {
  type: "tip";
  number?: string;
  headline: string;
  body: string;
}

export interface CTASlide extends BaseSlide {
  type: "cta";
  headline: string;
  subtext?: string;
  cta: string;
  handle?: string;
}

export type Slide =
  | HookSlide
  | BodySlide
  | QuoteSlide
  | StatSlide
  | ChecklistSlide
  | BeforeAfterSlide
  | TipSlide
  | CTASlide;

export interface CarouselSpec {
  id: string;
  title: string;
  platform: Platform;
  ratio: AspectRatio;
  brand: BrandConfig;
  slides: Slide[];
  topic?: string;
  createdAt: string;
}

export interface GenerateInput {
  topic?: string;
  url?: string;
  transcript?: string;
  rawText?: string;
  platform: Platform;
  theme: Theme;
  accent?: string;
  slideCount?: number;
  brandName?: string;
  referenceImageIds?: string[];
}

export interface GenerateResponse {
  carousel: CarouselSpec;
  tokensUsed?: number;
}

export const PLATFORM_RATIOS: Record<Platform, AspectRatio> = {
  instagram: "4:5",
  linkedin: "1:1",
  twitter: "16:9",
};

export const SLIDE_DIMENSIONS: Record<AspectRatio, { w: number; h: number }> = {
  "4:5": { w: 1080, h: 1350 },
  "1:1": { w: 1080, h: 1080 },
  "9:16": { w: 1080, h: 1920 },
  "16:9": { w: 1920, h: 1080 },
};

export const ACCENT_PRESETS = [
  { name: "Cyan", value: "#00C2A8" },
  { name: "Violet", value: "#7C3AED" },
  { name: "Rose", value: "#F43F5E" },
  { name: "Amber", value: "#F59E0B" },
  { name: "Blue", value: "#3B82F6" },
  { name: "Emerald", value: "#10B981" },
  { name: "Orange", value: "#F97316" },
  { name: "White", value: "#FFFFFF" },
];
