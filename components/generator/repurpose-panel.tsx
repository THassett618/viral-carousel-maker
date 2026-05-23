"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Loader2, Share2, Mail, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CarouselSpec, RepurposeFormat } from "@/types/carousel";

interface Props {
  carousel: CarouselSpec;
}

const FORMATS: { id: RepurposeFormat; label: string; desc: string; icon: React.ReactNode; color: string }[] = [
  {
    id: "thread",
    label: "X Thread",
    desc: "Numbered tweet thread",
    icon: <Share2 className="w-4 h-4" />,
    color: "#e5e5e5",
  },
  {
    id: "email",
    label: "Email Teaser",
    desc: "Subject + short teaser",
    icon: <Mail className="w-4 h-4" />,
    color: "#F59E0B",
  },
  {
    id: "linkedin_post",
    label: "LinkedIn Post",
    desc: "Text-only post",
    icon: <Globe className="w-4 h-4" />,
    color: "#0A66C2",
  },
];

export function RepurposePanel({ carousel }: Props) {
  const [activeFormat, setActiveFormat] = useState<RepurposeFormat | null>(null);
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<RepurposeFormat | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (format: RepurposeFormat) => {
    if (content[format]) {
      setActiveFormat(format);
      return;
    }
    setLoading(format);
    setActiveFormat(format);
    try {
      const res = await fetch("/api/repurpose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          format,
          slides: carousel.slides,
          topic: carousel.topic,
          platform: carousel.platform,
          brandName: carousel.brand.name,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setContent((prev) => ({ ...prev, [format]: data.content }));
    } catch {
      setContent((prev) => ({ ...prev, [format]: "Failed to generate. Try again." }));
    } finally {
      setLoading(null);
    }
  };

  const handleCopy = async () => {
    if (!activeFormat || !content[activeFormat]) return;
    await navigator.clipboard.writeText(content[activeFormat]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-border bg-card">
      <div className="p-4 border-b border-border">
        <h3 className="font-black text-sm">Repurpose this carousel</h3>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          Turn your slides into copy for other channels
        </p>
      </div>

      <div className="p-4 space-y-3">
        <div className="grid grid-cols-3 gap-2">
          {FORMATS.map(({ id, label, desc, icon, color }) => {
            const isActive = activeFormat === id;
            const isDone = !!content[id];
            return (
              <button
                key={id}
                type="button"
                onClick={() => handleGenerate(id)}
                disabled={loading !== null}
                className={cn(
                  "relative p-3 rounded-xl border text-left transition-all duration-200 disabled:opacity-60",
                  isActive
                    ? "border-opacity-50 bg-opacity-5"
                    : "border-border hover:bg-muted/30"
                )}
                style={isActive ? { borderColor: color, background: `${color}0D` } : undefined}
              >
                <div className="flex items-center gap-1.5 mb-1" style={{ color: isActive ? color : undefined }}>
                  {icon}
                  {isDone && !loading && (
                    <span className="ml-auto">
                      <Check className="w-3 h-3" style={{ color: "#10B981" }} />
                    </span>
                  )}
                </div>
                <p className="text-[11px] font-bold">{label}</p>
                <p className="text-[10px] text-muted-foreground">{desc}</p>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {activeFormat && (
            <motion.div
              key={activeFormat}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              {loading === activeFormat ? (
                <div className="h-32 flex items-center justify-center rounded-xl bg-muted/20 border border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Writing {FORMATS.find((f) => f.id === activeFormat)?.label}...
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <textarea
                    readOnly
                    value={content[activeFormat] ?? ""}
                    className="w-full h-44 p-3 text-[12px] leading-relaxed rounded-xl border border-border bg-muted/20 resize-none font-mono focus:outline-none text-foreground"
                  />
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="absolute top-2 right-2 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all hover:bg-muted/50"
                    style={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      color: copied ? "#10B981" : "var(--muted-foreground)",
                    }}
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
