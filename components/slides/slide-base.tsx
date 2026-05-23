"use client";

import { cn } from "@/lib/utils";
import type { BrandConfig, Theme } from "@/types/carousel";

interface SlideBaseProps {
  brand: BrandConfig;
  children: React.ReactNode;
  className?: string;
}

function getBgStyle(theme: Theme, accent: string): React.CSSProperties {
  switch (theme) {
    case "dark":
      return { background: "#0A0A0A" };
    case "light":
      return { background: "#FAFAFA" };
    case "gradient":
      return {
        background: `linear-gradient(135deg, #0A0A0A 0%, ${accent}22 100%)`,
      };
    case "minimal":
      return { background: "#FFFFFF" };
    default:
      return { background: "#0A0A0A" };
  }
}

export function getTextColor(theme: Theme): string {
  return theme === "light" || theme === "minimal" ? "#0A0A0A" : "#FAFAFA";
}

export function getMutedColor(theme: Theme): string {
  return theme === "light" || theme === "minimal" ? "#6B7280" : "#9CA3AF";
}

export function getBorderColor(theme: Theme): string {
  return theme === "light" || theme === "minimal"
    ? "rgba(0,0,0,0.1)"
    : "rgba(255,255,255,0.1)";
}

export function SlideBase({ brand, children, className }: SlideBaseProps) {
  const bgStyle = getBgStyle(brand.theme, brand.accent);
  const textColor = getTextColor(brand.theme);

  return (
    <div
      className={cn("w-full h-full flex flex-col relative font-sans", className)}
      style={{ ...bgStyle, color: textColor }}
    >
      {/* Subtle grid texture for dark themes */}
      {(brand.theme === "dark" || brand.theme === "gradient") && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
      )}

      {/* Accent line at top */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ background: brand.accent }}
      />

      <div className="relative z-10 flex flex-col h-full p-8 md:p-10">
        {children}
      </div>
    </div>
  );
}

export function AccentText({
  children,
  accent,
  className,
}: {
  children: React.ReactNode;
  accent: string;
  className?: string;
}) {
  return (
    <span className={className} style={{ color: accent }}>
      {children}
    </span>
  );
}

export function SlideNumber({
  n,
  total,
  accent,
  theme,
}: {
  n: number;
  total?: number;
  accent: string;
  theme: Theme;
}) {
  return (
    <div
      className="flex items-center gap-1.5 text-xs font-mono mb-auto mt-0"
      style={{ color: getMutedColor(theme) }}
    >
      <span
        className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold"
        style={{ background: accent, color: "#fff" }}
      >
        {n}
      </span>
      {total && <span className="opacity-50">/ {total}</span>}
    </div>
  );
}
