"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SlideWrapper } from "@/components/slides/slide-wrapper";
import type { CarouselSpec } from "@/types/carousel";
import { toPng } from "html-to-image";
import JSZip from "jszip";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  RotateCcw,
  Layers,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  carousel: CarouselSpec;
  onRegenerate: () => void;
}

export function CarouselPreview({ carousel, onRegenerate }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  const totalSlides = carousel.slides.length;
  const current = carousel.slides[activeIndex];

  const prev = () => setActiveIndex((i) => Math.max(0, i - 1));
  const next = () => setActiveIndex((i) => Math.min(totalSlides - 1, i + 1));

  const exportSlides = useCallback(async () => {
    setExporting(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder("carousel");

      for (let i = 0; i < totalSlides; i++) {
        setActiveIndex(i);
        await new Promise((r) => setTimeout(r, 150));

        const el = slideRefs.current[i];
        if (!el) continue;

        const dataUrl = await toPng(el, {
          quality: 1.0,
          pixelRatio: 2,
          cacheBust: true,
        });

        const base64 = dataUrl.split(",")[1];
        folder?.file(`slide-${String(i + 1).padStart(2, "0")}.png`, base64, { base64: true });
      }

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${carousel.title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-carousel.zip`;
      a.click();
      URL.revokeObjectURL(url);

      setExported(true);
      setTimeout(() => setExported(false), 3000);
      toast.success(`${totalSlides} slides exported!`);
    } catch (err) {
      toast.error("Export failed. Please try again.");
      console.error(err);
    } finally {
      setExporting(false);
    }
  }, [carousel, totalSlides]);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-lg leading-tight">{carousel.title}</h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="text-xs capitalize">
              {carousel.platform}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {totalSlides} slides
            </Badge>
            <Badge variant="outline" className="text-xs">
              {carousel.ratio}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onRegenerate} className="gap-1.5">
            <RotateCcw className="w-3.5 h-3.5" />
            Redo
          </Button>
          <Button
            size="sm"
            onClick={exportSlides}
            disabled={exporting}
            className="gap-1.5"
          >
            {exported ? (
              <Check className="w-3.5 h-3.5" />
            ) : exporting ? (
              <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            {exporting ? "Exporting..." : exported ? "Exported!" : "Export ZIP"}
          </Button>
        </div>
      </div>

      {/* Main slide preview */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.15 }}
          >
            <div
              ref={(el) => { slideRefs.current[activeIndex] = el; }}
              className="w-full max-w-sm mx-auto"
            >
              <SlideWrapper
                slide={current}
                spec={carousel}
                className="shadow-2xl"
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Nav arrows */}
        <button
          onClick={prev}
          disabled={activeIndex === 0}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-8 h-8 rounded-full bg-background border border-border shadow-md flex items-center justify-center disabled:opacity-30 hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={next}
          disabled={activeIndex === totalSlides - 1}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-8 h-8 rounded-full bg-background border border-border shadow-md flex items-center justify-center disabled:opacity-30 hover:bg-muted transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Slide counter */}
      <div className="text-center text-sm text-muted-foreground">
        {activeIndex + 1} of {totalSlides}
      </div>

      {/* Slide strip */}
      <div className="flex gap-2 overflow-x-auto pb-2 px-1">
        {carousel.slides.map((slide, i) => (
          <button
            key={slide.id}
            onClick={() => setActiveIndex(i)}
            className={cn(
              "flex-shrink-0 w-14 rounded-md overflow-hidden border-2 transition-all",
              i === activeIndex ? "border-primary shadow-lg" : "border-transparent opacity-60 hover:opacity-90"
            )}
          >
            <div
              ref={(el) => {
                if (i !== activeIndex) slideRefs.current[i] = el;
              }}
            >
              <SlideWrapper slide={slide} spec={carousel} />
            </div>
          </button>
        ))}
      </div>

      {/* Slide type badges */}
      <div className="flex flex-wrap gap-1.5">
        {carousel.slides.map((slide, i) => (
          <button
            key={slide.id}
            onClick={() => setActiveIndex(i)}
            className={cn(
              "text-xs px-2 py-0.5 rounded-full border font-medium transition-all",
              i === activeIndex
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:border-primary/50"
            )}
          >
            {slide.type.replace("_", " ")}
          </button>
        ))}
      </div>
    </div>
  );
}
