"use client";

import { useState, useEffect } from "react";
import { UploadZone } from "@/components/library/upload-zone";
import { ReferenceCard } from "@/components/library/reference-card";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { ReferenceImage, StyleCategory } from "@/types/library";
import { STYLE_CATEGORIES } from "@/types/library";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BookImage,
  Search,
  Upload,
  Layers,
  Grid3X3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function LibraryPage() {
  const [images, setImages] = useState<ReferenceImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState<StyleCategory | "all">("all");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"kanban" | "grid">("kanban");

  const supabase = createClient();

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("reference_images")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setImages(data as ReferenceImage[]);
    }
    setLoading(false);
  };

  const handleUpload = async (files: File[]) => {
    setUploading(true);
    let successCount = 0;

    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/library/upload", { method: "POST", body: formData });
        const data = await res.json();

        if (res.ok) {
          successCount++;
          setImages((prev) => [data as ReferenceImage, ...prev]);
        } else {
          toast.error(`Failed: ${file.name}`);
        }
      } catch {
        toast.error(`Error uploading ${file.name}`);
      }
    }

    if (successCount > 0) {
      toast.success(`${successCount} image${successCount > 1 ? "s" : ""} classified and added`);
    }
    setUploading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("reference_images")
      .delete()
      .eq("id", id);

    if (!error) {
      setImages((prev) => prev.filter((img) => img.id !== id));
      toast.success("Removed from library");
    }
  };

  const filtered = images.filter((img) => {
    const matchesFilter = filter === "all" || img.category === filter;
    const matchesSearch =
      !search ||
      img.title.toLowerCase().includes(search.toLowerCase()) ||
      img.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const byCategory = Object.keys(STYLE_CATEGORIES).reduce((acc, cat) => {
    acc[cat as StyleCategory] = filtered.filter((img) => img.category === cat);
    return acc;
  }, {} as Record<StyleCategory, ReferenceImage[]>);

  const hasImages = images.length > 0;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <BookImage className="w-5 h-5 text-primary" />
              <h1 className="text-2xl font-black tracking-tight">Style Library</h1>
            </div>
            <p className="text-muted-foreground text-sm mt-1 max-w-lg">
              Upload carousels you love. Claude classifies each slide automatically. When you generate,
              the AI learns from your taste profile to match your aesthetic.
            </p>
          </div>
          <Badge variant="secondary" className="text-sm px-3 py-1.5 shrink-0">
            {images.length} reference{images.length !== 1 ? "s" : ""}
          </Badge>
        </div>

        {/* Upload zone */}
        <UploadZone onFiles={handleUpload} uploading={uploading} />

        {hasImages && (
          <>
            {/* Toolbar */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[180px] max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 text-sm h-9"
                />
              </div>

              <div className="flex items-center gap-1 p-1 rounded-lg border border-border bg-muted/30">
                {(["all", ...Object.keys(STYLE_CATEGORIES)] as const).map((cat) => {
                  const count = cat === "all" ? images.length : (byCategory[cat as StyleCategory]?.length || 0);
                  if (count === 0 && cat !== "all") return null;
                  return (
                    <button
                      key={cat}
                      onClick={() => setFilter(cat as StyleCategory | "all")}
                      className={cn(
                        "px-2.5 py-1 rounded-md text-xs font-medium transition-all",
                        filter === cat
                          ? "bg-background shadow-sm text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {cat === "all" ? `All (${count})` : `${STYLE_CATEGORIES[cat as StyleCategory].label} (${count})`}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-1 p-1 rounded-lg border border-border bg-muted/30 ml-auto">
                <button
                  onClick={() => setView("kanban")}
                  className={cn("p-1.5 rounded-md transition-colors", view === "kanban" ? "bg-background shadow-sm" : "text-muted-foreground")}
                >
                  <Layers className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setView("grid")}
                  className={cn("p-1.5 rounded-md transition-colors", view === "grid" ? "bg-background shadow-sm" : "text-muted-foreground")}
                >
                  <Grid3X3 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Content */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="rounded-xl bg-muted animate-pulse aspect-[4/5]" />
                ))}
              </div>
            ) : view === "grid" ? (
              <motion.div
                layout
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
              >
                <AnimatePresence>
                  {filtered.map((img) => (
                    <motion.div
                      key={img.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                    >
                      <ReferenceCard image={img} onDelete={handleDelete} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              /* Kanban view */
              <div className="flex gap-4 overflow-x-auto pb-4">
                {(Object.keys(STYLE_CATEGORIES) as StyleCategory[]).map((cat) => {
                  const colImages = byCategory[cat];
                  if (!colImages || colImages.length === 0) return null;
                  const catInfo = STYLE_CATEGORIES[cat];

                  return (
                    <div key={cat} className="flex-shrink-0 w-48">
                      <div className="flex items-center gap-2 mb-3">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ background: catInfo.color }}
                        />
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                          {catInfo.label}
                        </span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {colImages.length}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {colImages.map((img) => (
                          <ReferenceCard key={img.id} image={img} onDelete={handleDelete} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {!hasImages && !loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
              <BookImage className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold">Your style library is empty</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                Upload carousel screenshots you love. The AI will study them and match
                their style every time you generate.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
