"use client";

import { motion } from "framer-motion";
import { Check, RefreshCw, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HookOption } from "@/types/carousel";

const ANGLE_COLORS: Record<string, string> = {
  "Curiosity gap": "#00C2A8",
  "Contrarian take": "#F43F5E",
  "Stat-led": "#F59E0B",
  "Pain point": "#7C3AED",
  "Promise": "#3B82F6",
  "Social proof": "#10B981",
};

interface Props {
  hooks: HookOption[];
  selected: string | null;
  onSelect: (hook: HookOption) => void;
  onRegenerate: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
  isRegenerating: boolean;
}

export function HookPicker({
  hooks,
  selected,
  onSelect,
  onRegenerate,
  onGenerate,
  isGenerating,
  isRegenerating,
}: Props) {
  const selectedHook = hooks.find((h) => h.hook === selected);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-black text-sm tracking-tight">Pick your opening hook</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Your first slide. Choose the angle that fits your voice.
          </p>
        </div>
        <button
          type="button"
          onClick={onRegenerate}
          disabled={isRegenerating}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
        >
          <RefreshCw className={cn("w-3.5 h-3.5", isRegenerating && "animate-spin")} />
          New options
        </button>
      </div>

      <div className="space-y-2">
        {hooks.map((hook, i) => {
          const accent = ANGLE_COLORS[hook.angle] ?? "#00C2A8";
          const isSelected = selected === hook.hook;
          return (
            <motion.button
              key={hook.id}
              type="button"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.3 }}
              onClick={() => onSelect(hook)}
              className={cn(
                "w-full text-left p-4 rounded-xl border transition-all duration-200 group",
                isSelected
                  ? "border-opacity-60 bg-opacity-5"
                  : "border-border hover:border-opacity-40 bg-transparent hover:bg-muted/20"
              )}
              style={isSelected ? {
                borderColor: accent,
                background: `${accent}08`,
                boxShadow: `0 0 0 1px ${accent}30`,
              } : undefined}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
                  style={isSelected
                    ? { background: accent }
                    : { border: "1.5px solid var(--border)" }}
                >
                  {isSelected && <Check className="w-3 h-3 text-black" strokeWidth={3} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider"
                      style={{ color: accent }}
                    >
                      {hook.angle}
                    </span>
                  </div>
                  <p className="text-sm font-semibold leading-snug text-foreground">{hook.hook}</p>
                  <p className="text-[11px] text-muted-foreground mt-1.5 leading-snug">{hook.why}</p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onGenerate}
        disabled={!selected || isGenerating}
        className="w-full h-11 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          background: selected ? "linear-gradient(135deg,#00C2A8,#00DFC8)" : undefined,
          backgroundColor: !selected ? "var(--muted)" : undefined,
          color: selected ? "#000" : "var(--muted-foreground)",
        }}
      >
        {isGenerating ? (
          <>
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Building carousel...
          </>
        ) : (
          <>
            <Zap className="w-4 h-4" />
            {selectedHook ? "Build carousel with this hook →" : "Select a hook above"}
          </>
        )}
      </button>
    </div>
  );
}
