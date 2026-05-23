export type StyleCategory =
  | "hook"
  | "checklist"
  | "quote"
  | "stat"
  | "before_after"
  | "minimal"
  | "bold"
  | "gradient"
  | "dark"
  | "light"
  | "other";

export interface ReferenceImage {
  id: string;
  userId: string;
  url: string;
  thumbnailUrl?: string;
  title: string;
  category: StyleCategory;
  tags: string[];
  setId?: string;
  slideIndex?: number;
  embedding?: number[];
  createdAt: string;
  source?: "upload" | "generated";
}

export interface ReferenceSet {
  id: string;
  userId: string;
  title: string;
  images: ReferenceImage[];
  createdAt: string;
}

export interface ClassifyImageResponse {
  title: string;
  category: StyleCategory;
  tags: string[];
  description: string;
}

export const STYLE_CATEGORIES: Record<StyleCategory, { label: string; color: string }> = {
  hook: { label: "Hook", color: "#F43F5E" },
  checklist: { label: "Checklist", color: "#10B981" },
  quote: { label: "Quote", color: "#7C3AED" },
  stat: { label: "Stat / Data", color: "#F59E0B" },
  before_after: { label: "Before / After", color: "#3B82F6" },
  minimal: { label: "Minimal", color: "#6B7280" },
  bold: { label: "Bold", color: "#F97316" },
  gradient: { label: "Gradient", color: "#EC4899" },
  dark: { label: "Dark", color: "#1F2937" },
  light: { label: "Light", color: "#E5E7EB" },
  other: { label: "Other", color: "#9CA3AF" },
};
