"use client";

import { useState } from "react";
import { GeneratorForm } from "@/components/generator/generator-form";
import { CarouselPreview } from "@/components/generator/carousel-preview";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import type { CarouselSpec, GenerateInput } from "@/types/carousel";
import { Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function GeneratePage() {
  const [carousel, setCarousel] = useState<CarouselSpec | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastInput, setLastInput] = useState<GenerateInput | null>(null);

  const handleGenerate = async (input: GenerateInput) => {
    setIsGenerating(true);
    setLastInput(input);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setCarousel(data.carousel);
      toast.success("Carousel generated!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = () => {
    if (lastInput) handleGenerate(lastInput);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-black tracking-tight">Generate Carousel</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Enter a topic, URL, or paste text — get a scroll-stopping carousel in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 items-start">
          {/* Left: Form */}
          <Card className="sticky top-6">
            <CardContent className="pt-6">
              <GeneratorForm
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
                hasLibrary={false}
              />
            </CardContent>
          </Card>

          {/* Right: Preview or Empty state */}
          <div>
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center min-h-[500px] gap-6"
                >
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">Crafting your carousel...</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Writing hooks, headlines, and slide copy
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-primary"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.15,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              ) : carousel ? (
                <motion.div
                  key="carousel"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <CarouselPreview carousel={carousel} onRegenerate={handleRegenerate} />
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center min-h-[500px] gap-4 rounded-2xl border-2 border-dashed border-border"
                >
                  <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div className="text-center px-6">
                    <p className="font-semibold">Your carousel will appear here</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Fill in the form and hit Generate to create your first carousel
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
