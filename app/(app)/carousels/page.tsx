"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import { SlideWrapper } from "@/components/slides/slide-wrapper";
import type { CarouselSpec } from "@/types/carousel";
import { Sparkles, Trash2, ExternalLink, LayoutGrid } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function CarouselsPage() {
  const [carousels, setCarousels] = useState<CarouselSpec[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadCarousels();
  }, []);

  const loadCarousels = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("carousels")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) setCarousels(data as unknown as CarouselSpec[]);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("carousels").delete().eq("id", id);
    if (!error) {
      setCarousels((prev) => prev.filter((c) => c.id !== id));
      toast.success("Deleted");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-primary" />
              <h1 className="text-2xl font-black tracking-tight">My Carousels</h1>
            </div>
            <p className="text-muted-foreground text-sm mt-1">
              All your generated carousels, ready to re-export
            </p>
          </div>
          <Button asChild className="gap-2">
            <Link href="/generate">
              <Sparkles className="w-4 h-4" />
              New Carousel
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-muted animate-pulse aspect-[4/5]" />
            ))}
          </div>
        ) : carousels.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
              <LayoutGrid className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold">No carousels yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Generate your first carousel to see it here
              </p>
            </div>
            <Button asChild className="gap-2 mt-2">
              <Link href="/generate">
                <Sparkles className="w-4 h-4" />
                Generate now
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {carousels.map((carousel, idx) => (
              <motion.div
                key={carousel.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group relative rounded-2xl border border-border overflow-hidden bg-card hover:border-primary/50 transition-all"
              >
                {/* Thumbnail — first slide */}
                <div className="relative">
                  <SlideWrapper
                    slide={carousel.slides[0]}
                    spec={carousel}
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Link
                      href={`/generate?carousel=${carousel.id}`}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-white" />
                    </Link>
                    <button
                      onClick={() => handleDelete(carousel.id)}
                      className="p-2 rounded-lg bg-white/10 hover:bg-red-500/80 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3 space-y-1.5">
                  <p className="text-xs font-bold leading-tight line-clamp-1">
                    {carousel.title}
                  </p>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge variant="secondary" className="text-[10px] px-1.5 h-4 capitalize">
                      {carousel.platform}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] px-1.5 h-4">
                      {carousel.slides.length} slides
                    </Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    {formatDate(carousel.createdAt)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
