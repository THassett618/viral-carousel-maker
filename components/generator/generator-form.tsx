"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ACCENT_PRESETS } from "@/types/carousel";
import { cn } from "@/lib/utils";
import type { GenerateInput, Platform, Theme } from "@/types/carousel";
import {
  Sparkles,
  Link2,
  FileText,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  BookImage,
  Target,
} from "lucide-react";

interface Props {
  onGenerateHooks: (input: GenerateInput) => void;
  isGeneratingHooks: boolean;
  hasLibrary: boolean;
}

type InputMode = "topic" | "url" | "text";

const PLATFORMS: { value: Platform; label: string; emoji: string }[] = [
  { value: "instagram", label: "Instagram", emoji: "📸" },
  { value: "linkedin", label: "LinkedIn", emoji: "💼" },
  { value: "twitter", label: "X / Twitter", emoji: "𝕏" },
];

const THEMES: { value: Theme; label: string }[] = [
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
  { value: "gradient", label: "Gradient" },
  { value: "minimal", label: "Minimal" },
];

export function GeneratorForm({ onGenerateHooks, isGeneratingHooks, hasLibrary }: Props) {
  const [mode, setMode] = useState<InputMode>("topic");
  const [topic, setTopic] = useState("");
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [theme, setTheme] = useState<Theme>("dark");
  const [accent, setAccent] = useState("#00C2A8");
  const [customAccent, setCustomAccent] = useState("#00C2A8");
  const [brandName, setBrandName] = useState("");
  const [slideCount, setSlideCount] = useState(7);
  const [useLibrary, setUseLibrary] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showIcp, setShowIcp] = useState(false);
  const [targetAudience, setTargetAudience] = useState("");
  const [offering, setOffering] = useState("");
  const [goal, setGoal] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerateHooks({
      topic: mode === "topic" ? topic : undefined,
      url: mode === "url" ? url : undefined,
      rawText: mode === "text" ? text : undefined,
      platform,
      theme,
      accent,
      slideCount,
      brandName: brandName || undefined,
      useLibrary,
      targetAudience: targetAudience || undefined,
      offering: offering || undefined,
      goal: goal || undefined,
    });
  };

  const isValid =
    (mode === "topic" && topic.trim().length > 2) ||
    (mode === "url" && url.trim().length > 10) ||
    (mode === "text" && text.trim().length > 20);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Input mode tabs */}
      <div className="flex rounded-lg border border-border bg-muted/30 p-1 gap-1">
        {([
          { v: "topic", label: "Topic", icon: <Lightbulb className="w-3.5 h-3.5" /> },
          { v: "url", label: "URL", icon: <Link2 className="w-3.5 h-3.5" /> },
          { v: "text", label: "Paste Text", icon: <FileText className="w-3.5 h-3.5" /> },
        ] as const).map(({ v, label, icon }) => (
          <button
            key={v}
            type="button"
            onClick={() => setMode(v)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md text-xs font-medium transition-all",
              mode === v
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {/* Input field */}
      <div className="space-y-2">
        {mode === "topic" && (
          <>
            <Label>What&apos;s your carousel about?</Label>
            <Input
              placeholder="e.g. 5 reasons most startups fail in their first year"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="text-sm"
            />
          </>
        )}
        {mode === "url" && (
          <>
            <Label>Article or YouTube URL</Label>
            <Input
              type="url"
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="text-sm font-mono"
            />
          </>
        )}
        {mode === "text" && (
          <>
            <Label>Paste your content</Label>
            <Textarea
              placeholder="Paste a blog post, transcript, notes, or any text you want to turn into a carousel..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="text-sm min-h-[120px] resize-none"
            />
          </>
        )}
      </div>

      {/* ICP targeting (optional) */}
      <div>
        <button
          type="button"
          onClick={() => setShowIcp((v) => !v)}
          className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <Target className="w-3.5 h-3.5" />
          {showIcp ? "Hide" : "Add"} audience context
          <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
            optional
          </span>
          {showIcp ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {showIcp && (
          <div className="mt-3 space-y-3 p-3 rounded-xl bg-muted/20 border border-border">
            <p className="text-[10px] text-muted-foreground">
              Helps Claude write sharper hooks and a more targeted CTA.
            </p>
            <div className="space-y-1.5">
              <Label className="text-xs">Who are you writing for?</Label>
              <Input
                placeholder="e.g. SaaS founders, fitness coaches, freelancers"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="text-xs h-8"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">What are you selling / promoting?</Label>
              <Input
                placeholder="e.g. My consulting, a new course, nothing — just building audience"
                value={offering}
                onChange={(e) => setOffering(e.target.value)}
                className="text-xs h-8"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Goal of this carousel</Label>
              <div className="flex flex-wrap gap-1.5">
                {["Get follows", "Build authority", "Drive DMs", "Sell something", "Grow email list"].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGoal(goal === g ? "" : g)}
                    className={cn(
                      "text-[10px] px-2.5 py-1 rounded-full border transition-all",
                      goal === g
                        ? "border-primary bg-primary/10 text-primary font-medium"
                        : "border-border text-muted-foreground hover:border-primary/40"
                    )}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Platform */}
      <div className="space-y-2">
        <Label>Platform</Label>
        <div className="grid grid-cols-3 gap-2">
          {PLATFORMS.map(({ value, label, emoji }) => (
            <button
              key={value}
              type="button"
              onClick={() => setPlatform(value)}
              className={cn(
                "flex flex-col items-center gap-1 py-2.5 px-3 rounded-lg border text-xs font-medium transition-all",
                platform === value
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/50"
              )}
            >
              <span className="text-base">{emoji}</span>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Theme */}
      <div className="space-y-2">
        <Label>Theme</Label>
        <div className="grid grid-cols-4 gap-2">
          {THEMES.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setTheme(value)}
              className={cn(
                "py-2 px-2 rounded-lg border text-xs font-medium transition-all",
                theme === value
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/50"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Accent color */}
      <div className="space-y-2">
        <Label>Accent Color</Label>
        <div className="flex flex-wrap gap-2">
          {ACCENT_PRESETS.map(({ name, value }) => (
            <button
              key={value}
              type="button"
              title={name}
              onClick={() => { setAccent(value); setCustomAccent(value); }}
              className={cn(
                "w-7 h-7 rounded-full border-2 transition-all",
                accent === value ? "border-foreground scale-110" : "border-transparent"
              )}
              style={{ background: value }}
            />
          ))}
          <div className="relative">
            <input
              type="color"
              value={customAccent}
              onChange={(e) => { setCustomAccent(e.target.value); setAccent(e.target.value); }}
              className="w-7 h-7 rounded-full cursor-pointer border-2 border-border opacity-0 absolute inset-0"
            />
            <div
              className={cn(
                "w-7 h-7 rounded-full border-2 flex items-center justify-center text-[10px] font-bold",
                "border-dashed border-muted-foreground text-muted-foreground"
              )}
              style={{ background: customAccent !== "#00C2A8" ? customAccent : undefined }}
            >
              +
            </div>
          </div>
        </div>
      </div>

      {/* Advanced */}
      <div>
        <button
          type="button"
          onClick={() => setShowAdvanced((v) => !v)}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          Advanced options
        </button>

        {showAdvanced && (
          <div className="space-y-4 mt-4 pt-4 border-t border-border">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Brand / Handle</Label>
                <Input
                  placeholder="Your brand name"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label>Slide Count</Label>
                <Select
                  value={String(slideCount)}
                  onValueChange={(v) => v && setSlideCount(parseInt(v))}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 6, 7, 8, 9, 10, 12].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n} slides
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {hasLibrary && (
              <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/20">
                <button
                  type="button"
                  onClick={() => setUseLibrary((v) => !v)}
                  className={cn(
                    "w-10 h-5 rounded-full transition-colors relative flex-shrink-0",
                    useLibrary ? "bg-primary" : "bg-muted"
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform",
                      useLibrary ? "translate-x-5" : "translate-x-0.5"
                    )}
                  />
                </button>
                <div>
                  <div className="text-xs font-medium flex items-center gap-1.5">
                    <BookImage className="w-3.5 h-3.5" />
                    Use my Style Library
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Let AI learn from your saved reference images
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Separator />

      <Button
        type="submit"
        disabled={!isValid || isGeneratingHooks}
        className="w-full gap-2 font-bold"
        size="lg"
      >
        {isGeneratingHooks ? (
          <>
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Writing hooks...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Generate Hook Options →
          </>
        )}
      </Button>
    </form>
  );
}
