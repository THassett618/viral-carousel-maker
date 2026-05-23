"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { GeneratorForm } from "@/components/generator/generator-form";
import { CarouselPreview } from "@/components/generator/carousel-preview";
import { HookPicker } from "@/components/generator/hook-picker";
import { RepurposePanel } from "@/components/generator/repurpose-panel";
import { WelcomeBanner } from "@/components/app/welcome-banner";
import { OutOfCreditsDialog } from "@/components/app/out-of-credits-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import type { CarouselSpec, GenerateInput, HookOption } from "@/types/carousel";
import { Sparkles, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

type Stage = "form" | "hooks" | "done";

function CheckoutSuccessToast() {
  const searchParams = useSearchParams();
  const toastedRef = useRef(false);
  useEffect(() => {
    if (toastedRef.current) return;
    const checkout = searchParams.get("checkout");
    const plan = searchParams.get("plan");
    if (checkout === "success") {
      toastedRef.current = true;
      toast.success(plan ? `${plan} activated — enjoy your credits!` : "Payment successful — credits added!");
    }
  }, [searchParams]);
  return null;
}

export default function GeneratePage() {

  const [stage, setStage] = useState<Stage>("form");
  const [carousel, setCarousel] = useState<CarouselSpec | null>(null);

  // Hook step
  const [pendingInput, setPendingInput] = useState<GenerateInput | null>(null);
  const [hooks, setHooks] = useState<HookOption[]>([]);
  const [selectedHook, setSelectedHook] = useState<string | null>(null);
  const [isGeneratingHooks, setIsGeneratingHooks] = useState(false);
  const [isRegeneratingHooks, setIsRegeneratingHooks] = useState(false);

  // Carousel step
  const [isGenerating, setIsGenerating] = useState(false);
  const [outOfCredits, setOutOfCredits] = useState<{ open: boolean; plan: string }>({ open: false, plan: "free" });

  // Library status — activates RAG when user has uploaded references
  const [hasLibrary, setHasLibrary] = useState(false);
  useEffect(() => {
    createClient()
      .from("reference_images")
      .select("id", { count: "exact", head: true })
      .then(({ count }) => setHasLibrary((count ?? 0) > 0));
  }, []);

  const fetchHooks = async (input: GenerateInput, isRegen = false) => {
    if (isRegen) setIsRegeneratingHooks(true);
    else setIsGeneratingHooks(true);

    try {
      const res = await fetch("/api/hooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: input.topic,
          url: input.url,
          rawText: input.rawText,
          platform: input.platform,
          targetAudience: input.targetAudience,
          offering: input.offering,
          goal: input.goal,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Hook generation failed");
      setHooks(data.hooks);
      setSelectedHook(data.hooks[0]?.hook ?? null);
      if (!isRegen) setStage("hooks");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Hook generation failed");
    } finally {
      setIsGeneratingHooks(false);
      setIsRegeneratingHooks(false);
    }
  };

  const handleGenerateHooks = async (input: GenerateInput) => {
    setPendingInput(input);
    await fetchHooks(input);
  };

  const handleRegenerateHooks = async () => {
    if (!pendingInput) return;
    await fetchHooks(pendingInput, true);
  };

  const handleGenerateCarousel = async () => {
    if (!pendingInput || !selectedHook) return;
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...pendingInput, chosenHook: selectedHook }),
      });
      const data = await res.json();
      if (res.status === 402) {
        setOutOfCredits({ open: true, plan: data.plan ?? "free" });
        return;
      }
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setCarousel(data.carousel);
      setStage("done");
      toast.success("Carousel generated!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = () => {
    if (pendingInput && selectedHook) handleGenerateCarousel();
  };

  const handleBack = () => {
    if (stage === "hooks") setStage("form");
    else if (stage === "done") setStage("hooks");
  };

  return (
    <div className="min-h-screen">
      <Suspense>
        <CheckoutSuccessToast />
      </Suspense>
      <OutOfCreditsDialog
        open={outOfCredits.open}
        plan={outOfCredits.plan}
        onClose={() => setOutOfCredits((s) => ({ ...s, open: false }))}
      />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <WelcomeBanner />
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          {stage !== "form" && (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-black tracking-tight">Generate Carousel</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {stage === "form" && "Enter a topic, URL, or paste text — get scroll-stopping slides in seconds."}
              {stage === "hooks" && "Pick your opening hook. This sets the entire carousel's angle."}
              {stage === "done" && "Your carousel is ready. Review, export, or repurpose below."}
            </p>
          </div>
          {stage !== "form" && (
            <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
              <span className={stage === "hooks" ? "text-foreground font-medium" : ""}>
                1 Hook
              </span>
              <span className="opacity-30">→</span>
              <span className={stage === "done" ? "text-foreground font-medium" : ""}>
                2 Carousel
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 items-start">
          {/* Left: Form or Hook picker */}
          <Card className="sticky top-6">
            <CardContent className="pt-6">
              <AnimatePresence mode="wait">
                {stage === "form" ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <GeneratorForm
                      onGenerateHooks={handleGenerateHooks}
                      isGeneratingHooks={isGeneratingHooks}
                      hasLibrary={hasLibrary}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="hooks"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <HookPicker
                      hooks={hooks}
                      selected={selectedHook}
                      onSelect={(h) => setSelectedHook(h.hook)}
                      onRegenerate={handleRegenerateHooks}
                      onGenerate={handleGenerateCarousel}
                      isGenerating={isGenerating}
                      isRegenerating={isRegeneratingHooks}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Right: Preview or Empty state */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center min-h-[500px] gap-6"
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">Building your carousel...</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Writing every slide around your chosen hook
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-primary"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </motion.div>
              ) : carousel && stage === "done" ? (
                <motion.div
                  key="carousel"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <CarouselPreview carousel={carousel} onRegenerate={handleRegenerate} />
                  <RepurposePanel carousel={carousel} />
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
                    <p className="font-semibold">
                      {stage === "hooks" ? "Select a hook and generate" : "Your carousel will appear here"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {stage === "hooks"
                        ? "Pick the opening angle on the left, then click Build."
                        : "Fill in the form and hit Generate Hook Options to start."}
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
