"use client";

import type {
  Slide,
  BrandConfig,
  HookSlide,
  BodySlide,
  QuoteSlide,
  StatSlide,
  ChecklistSlide,
  BeforeAfterSlide,
  TipSlide,
  CTASlide,
} from "@/types/carousel";

interface Props {
  slide: Slide;
  brand: BrandConfig;
}

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  if (clean.length === 3) {
    return {
      r: parseInt(clean[0] + clean[0], 16),
      g: parseInt(clean[1] + clean[1], 16),
      b: parseInt(clean[2] + clean[2], 16),
    };
  }
  return {
    r: parseInt(clean.slice(0, 2), 16) || 0,
    g: parseInt(clean.slice(2, 4), 16) || 194,
    b: parseInt(clean.slice(4, 6), 16) || 168,
  };
}

const BEBAS: React.CSSProperties = { fontFamily: "var(--font-bebas)", fontWeight: 400 };

function FazioBase({ brand, children }: { brand: BrandConfig; children: React.ReactNode }) {
  const { accent, name, theme } = brand;
  const { r, g, b } = hexToRgb(accent);
  const isDark = theme === "dark" || theme === "gradient";

  const bg = isDark
    ? `radial-gradient(ellipse at 70% 70%, rgba(${r},${g},${b},0.22) 0%, #050505 62%)`
    : "#ffffff";
  const textColor = isDark ? "#f2f2f2" : "#0a0a0a";
  const mutedColor = isDark ? "rgba(242,242,242,0.42)" : "rgba(10,10,10,0.42)";
  const dividerColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";

  const ribbonText = Array(10).fill(`${name.toUpperCase()} ✦ `).join("");

  return (
    <div className="w-full h-full flex" style={{ background: bg, color: textColor }}>
      {/* Left ribbon */}
      <div
        className="shrink-0 flex items-center justify-center overflow-hidden select-none"
        style={{
          width: 36,
          background: accent,
          writingMode: "vertical-rl",
          transform: "rotate(180deg)",
          fontSize: 8,
          letterSpacing: "0.07em",
          color: "rgba(255,255,255,0.92)",
          fontWeight: 800,
          whiteSpace: "nowrap",
        }}
      >
        {ribbonText}
      </div>

      {/* Content column */}
      <div
        className="flex-1 min-w-0 flex flex-col"
        style={{ padding: "14px 18px 12px 14px" }}
      >
        {/* Author header */}
        <div
          className="flex items-center gap-2 shrink-0"
          style={{ paddingBottom: 10, borderBottom: `1px solid ${dividerColor}`, marginBottom: 10 }}
        >
          <div
            className="rounded-full shrink-0 flex items-center justify-center text-white"
            style={{ width: 28, height: 28, background: accent, fontSize: 13, ...BEBAS }}
          >
            {name[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-black text-[11px] leading-none truncate">{name}</div>
            <div
              className="text-[9px] leading-none mt-0.5 truncate"
              style={{ color: mutedColor }}
            >
              @{name.toLowerCase().replace(/\s+/g, "")}
            </div>
          </div>
          <div
            className="shrink-0 font-black text-[8px] leading-none px-2 py-1 rounded-sm"
            style={{ border: `1.5px solid ${accent}`, color: accent, letterSpacing: "0.06em" }}
          >
            READ MORE →
          </div>
        </div>

        {/* Slide content */}
        <div className="flex-1 min-h-0 flex flex-col">{children}</div>

        {/* Footer */}
        <div
          className="shrink-0 flex items-center justify-between"
          style={{ paddingTop: 8, borderTop: `1px solid ${dividerColor}` }}
        >
          <span className="font-bold text-[9px]" style={{ color: mutedColor }}>
            𝕏
          </span>
          <span
            className="text-[9px] font-black uppercase"
            style={{ color: mutedColor, letterSpacing: "0.2em" }}
          >
            {name}
          </span>
          <span style={{ color: accent, fontSize: 9 }}>◆</span>
        </div>
      </div>
    </div>
  );
}

// ── Slide type renderers ──────────────────────────────────────────────────────

function renderHook(slide: HookSlide, brand: BrandConfig) {
  const { accent, theme } = brand;
  const isDark = theme === "dark" || theme === "gradient";
  const mutedColor = isDark ? "rgba(242,242,242,0.45)" : "rgba(10,10,10,0.45)";

  return (
    <div className="flex flex-col justify-between h-full py-2">
      <div className="flex-1 flex flex-col justify-center gap-3">
        <p
          className="uppercase leading-none"
          style={{ ...BEBAS, fontSize: 54, lineHeight: 1.0 }}
        >
          {slide.headline.split(" ").map((word, i) => {
            const clean = word.toLowerCase().replace(/[^a-z]/g, "");
            const isEm = slide.emphasis?.some((e) => e.toLowerCase() === clean);
            return (
              <span key={i}>
                {isEm ? (
                  <span
                    className="px-1"
                    style={{
                      background: accent,
                      color: isDark ? "#fff" : "#000",
                    }}
                  >
                    {word}
                  </span>
                ) : (
                  word
                )}{" "}
              </span>
            );
          })}
        </p>
        {slide.subtext && (
          <p className="text-[12px] leading-snug font-medium" style={{ color: mutedColor }}>
            {slide.subtext}
          </p>
        )}
      </div>
      <p
        className="text-[10px] font-black tracking-wider uppercase"
        style={{ color: accent }}
      >
        Swipe →
      </p>
    </div>
  );
}

function renderBody(slide: BodySlide, brand: BrandConfig) {
  const { accent } = brand;

  return (
    <div className="flex flex-col gap-2 py-1">
      <p
        className="uppercase"
        style={{ ...BEBAS, fontSize: 36, lineHeight: 1.05 }}
      >
        {slide.headline}
      </p>
      <div className="flex flex-col gap-2 mt-1">
        {slide.bullets.map((bullet, i) => (
          <div key={i} className="flex items-start gap-2">
            <div
              className="shrink-0 font-black text-[10px] leading-none px-1.5 py-0.5 rounded-sm text-white"
              style={{ background: accent, minWidth: 26, textAlign: "center", marginTop: 1 }}
            >
              {String(i + 1).padStart(2, "0")}
            </div>
            <p className="text-[12px] leading-snug">{bullet}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function renderQuote(slide: QuoteSlide, brand: BrandConfig) {
  const { accent, theme } = brand;
  const isDark = theme === "dark" || theme === "gradient";
  const mutedColor = isDark ? "rgba(242,242,242,0.45)" : "rgba(10,10,10,0.45)";

  return (
    <div className="flex flex-col justify-center h-full gap-3 py-2">
      <div style={{ ...BEBAS, fontSize: 72, lineHeight: 0.8, color: accent }}>&ldquo;</div>
      <p className="uppercase" style={{ ...BEBAS, fontSize: 34, lineHeight: 1.1 }}>
        {slide.quote}
      </p>
      {slide.attribution && (
        <p className="text-[11px] font-bold" style={{ color: accent }}>
          — {slide.attribution}
        </p>
      )}
      {slide.context && (
        <p className="text-[10px]" style={{ color: mutedColor }}>
          {slide.context}
        </p>
      )}
    </div>
  );
}

function renderStat(slide: StatSlide, brand: BrandConfig) {
  const { accent, theme } = brand;
  const isDark = theme === "dark" || theme === "gradient";
  const mutedColor = isDark ? "rgba(242,242,242,0.45)" : "rgba(10,10,10,0.45)";

  return (
    <div className="flex flex-col justify-center h-full gap-2 py-2">
      <p
        className="uppercase"
        style={{ ...BEBAS, fontSize: 84, lineHeight: 0.9, color: accent }}
      >
        {slide.stat}
      </p>
      <p className="uppercase" style={{ ...BEBAS, fontSize: 26, lineHeight: 1.1 }}>
        {slide.label}
      </p>
      {slide.context && (
        <p className="text-[10px]" style={{ color: mutedColor }}>
          {slide.context}
        </p>
      )}
    </div>
  );
}

function renderChecklist(slide: ChecklistSlide, brand: BrandConfig) {
  const { accent } = brand;

  return (
    <div className="flex flex-col gap-2 py-1">
      <p className="uppercase" style={{ ...BEBAS, fontSize: 34, lineHeight: 1.05 }}>
        {slide.headline}
      </p>
      <div className="flex flex-col gap-1.5 mt-1">
        {slide.items.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <div
              className="shrink-0 rounded flex items-center justify-center text-white text-[9px] font-black"
              style={{
                width: 16,
                height: 16,
                background: item.checked !== false ? accent : "transparent",
                border: `1.5px solid ${accent}`,
                color: item.checked !== false ? "#fff" : accent,
                marginTop: 1,
                flexShrink: 0,
              }}
            >
              {item.checked !== false ? "✓" : ""}
            </div>
            <p className="text-[12px] leading-snug">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function renderBeforeAfter(slide: BeforeAfterSlide, brand: BrandConfig) {
  const { accent } = brand;
  const { r, g, b } = hexToRgb(accent);

  return (
    <div className="flex flex-col gap-2 py-1">
      <p className="uppercase" style={{ ...BEBAS, fontSize: 32, lineHeight: 1.05 }}>
        {slide.headline}
      </p>
      <div className="flex flex-col gap-2 mt-1">
        <div
          className="p-2.5 rounded"
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
          }}
        >
          <div
            className="text-[9px] font-black tracking-widest uppercase mb-1"
            style={{ color: "#ef4444" }}
          >
            BEFORE
          </div>
          <p className="text-[12px] leading-snug">{slide.before}</p>
        </div>
        <div
          className="p-2.5 rounded"
          style={{
            background: `rgba(${r},${g},${b},0.1)`,
            border: `1px solid rgba(${r},${g},${b},0.35)`,
          }}
        >
          <div
            className="text-[9px] font-black tracking-widest uppercase mb-1"
            style={{ color: accent }}
          >
            AFTER
          </div>
          <p className="text-[12px] leading-snug">{slide.after}</p>
        </div>
      </div>
    </div>
  );
}

function renderTip(slide: TipSlide, brand: BrandConfig) {
  const { accent, theme } = brand;
  const isDark = theme === "dark" || theme === "gradient";
  const mutedColor = isDark ? "rgba(242,242,242,0.45)" : "rgba(10,10,10,0.45)";

  return (
    <div className="flex flex-col justify-center h-full gap-3 py-2">
      {slide.number && (
        <div
          className="self-start font-black text-[10px] leading-none px-2.5 py-1.5 rounded-sm text-white"
          style={{ background: accent, letterSpacing: "0.06em" }}
        >
          TIP {slide.number}
        </div>
      )}
      <p className="uppercase" style={{ ...BEBAS, fontSize: 40, lineHeight: 1.05 }}>
        {slide.headline}
      </p>
      <p className="text-[12px] leading-snug" style={{ color: mutedColor }}>
        {slide.body}
      </p>
    </div>
  );
}

function renderCTA(slide: CTASlide, brand: BrandConfig) {
  const { accent, theme } = brand;
  const isDark = theme === "dark" || theme === "gradient";
  const mutedColor = isDark ? "rgba(242,242,242,0.45)" : "rgba(10,10,10,0.45)";

  return (
    <div className="flex flex-col justify-center items-center h-full gap-4 py-2 text-center">
      <p className="uppercase" style={{ ...BEBAS, fontSize: 42, lineHeight: 1.0 }}>
        {slide.headline}
      </p>
      {slide.subtext && (
        <p className="text-[12px]" style={{ color: mutedColor }}>
          {slide.subtext}
        </p>
      )}
      <div
        className="font-black text-[11px] px-4 py-2 rounded-sm text-white"
        style={{ background: accent, letterSpacing: "0.06em" }}
      >
        {slide.cta}
      </div>
      {slide.handle && (
        <p className="text-[11px] font-bold" style={{ color: accent }}>
          {slide.handle}
        </p>
      )}
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export function FazioSlide({ slide, brand }: Props) {
  const content = (() => {
    switch (slide.type) {
      case "hook":        return renderHook(slide, brand);
      case "body":        return renderBody(slide, brand);
      case "quote":       return renderQuote(slide, brand);
      case "stat":        return renderStat(slide, brand);
      case "checklist":   return renderChecklist(slide, brand);
      case "before_after": return renderBeforeAfter(slide, brand);
      case "tip":         return renderTip(slide, brand);
      case "cta":         return renderCTA(slide, brand);
      default:            return null;
    }
  })();

  return <FazioBase brand={brand}>{content}</FazioBase>;
}
