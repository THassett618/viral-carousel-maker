import { anthropic, CAROUSEL_SYSTEM_PROMPT } from "./anthropic";
import type {
  CarouselSpec,
  GenerateInput,
  Platform,
  AspectRatio,
  Theme,
  Slide,
} from "@/types/carousel";
import { PLATFORM_RATIOS } from "@/types/carousel";
import { nanoid } from "./utils";

function buildUserPrompt(input: GenerateInput, referenceContext?: string): string {
  const { topic, url, transcript, rawText, platform, theme, accent, slideCount = 7, brandName } = input;

  const platformGuide: Record<Platform, string> = {
    instagram: "Instagram (visual, punchy, saves-worthy, emotional hooks)",
    linkedin: "LinkedIn (professional, insight-driven, thought leadership)",
    twitter: "X/Twitter (sharp, opinionated, takes-worth-sharing)",
  };

  const contentSource = topic
    ? `TOPIC: "${topic}"`
    : transcript
    ? `TRANSCRIPT:\n${transcript.slice(0, 3000)}`
    : rawText
    ? `SOURCE TEXT:\n${rawText.slice(0, 3000)}`
    : url
    ? `URL CONTENT (user provided): ${url}`
    : "Create an engaging carousel on a trending topic";

  const themeGuide: Record<Theme, string> = {
    dark: "dark background with light text and colored accents",
    light: "white/cream background with dark text",
    gradient: "bold gradient background",
    minimal: "ultra-clean minimal design with lots of whitespace",
  };

  return `Create a ${slideCount}-slide carousel for ${platformGuide[platform]}.

${contentSource}

Brand: ${brandName || "Scrollr"}
Theme: ${themeGuide[theme]}
Accent color: ${accent || "#00C2A8"}

${referenceContext ? `STYLE REFERENCE ANALYSIS:\n${referenceContext}\n\nStudy the layout, hierarchy, and aesthetic of these references and adapt it.` : ""}

SLIDE RULES:
- Slide 1: Hook — bold statement under 12 words that creates curiosity or names pain
- Slides 2-${slideCount - 1}: One idea per slide, max 22 words body text
- Last slide: CTA with your brand handle

SLIDE TYPES to choose from:
- "hook": headline + optional subtext + emphasis words
- "body": headline + 2-4 bullet points
- "quote": pull quote + attribution
- "stat": big number/stat + label + context
- "checklist": headline + 3-6 checklist items
- "before_after": headline + before state + after state
- "tip": tip number + headline + short body
- "cta": headline + subtext + action + handle

Return this exact JSON structure:
{
  "title": "short carousel title for internal reference",
  "slides": [
    {
      "type": "hook",
      "slideNumber": 1,
      "headline": "...",
      "subtext": "...",
      "emphasis": ["word1", "word2"]
    },
    {
      "type": "body",
      "slideNumber": 2,
      "headline": "...",
      "bullets": ["...", "..."]
    },
    {
      "type": "stat",
      "slideNumber": 3,
      "stat": "73%",
      "label": "of marketers...",
      "context": "source or extra line"
    },
    {
      "type": "cta",
      "slideNumber": ${slideCount},
      "headline": "...",
      "subtext": "...",
      "cta": "Follow for more",
      "handle": "@${brandName?.toLowerCase().replace(/\s/g, "") || "scrollr"}"
    }
  ]
}`;
}

export async function generateCarousel(
  input: GenerateInput,
  referenceContext?: string
): Promise<CarouselSpec> {
  const userPrompt = buildUserPrompt(input, referenceContext);

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    system: CAROUSEL_SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");

  let raw = content.text.trim();
  // Strip markdown code fences if present
  if (raw.startsWith("```")) {
    raw = raw.replace(/^```[a-z]*\n?/, "").replace(/\n?```$/, "");
  }

  const parsed = JSON.parse(raw);

  const ratio: AspectRatio = PLATFORM_RATIOS[input.platform];

  const slides: Slide[] = parsed.slides.map((s: Record<string, unknown>) => ({
    id: nanoid(),
    ...s,
  }));

  return {
    id: nanoid(),
    title: parsed.title || input.topic || "My Carousel",
    platform: input.platform,
    ratio,
    brand: {
      name: input.brandName || "Scrollr",
      theme: input.theme,
      accent: input.accent || "#00C2A8",
    },
    slides,
    topic: input.topic,
    createdAt: new Date().toISOString(),
  };
}

export async function extractTextFromUrl(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; Scrollr/1.0)" },
    signal: AbortSignal.timeout(10000),
  });
  const html = await response.text();
  // Basic HTML to text extraction
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 5000);
}
