import { anthropic, CAROUSEL_SYSTEM_PROMPT } from "./anthropic";
import type {
  CarouselSpec,
  GenerateInput,
  GenerateHooksInput,
  HookOption,
  RepurposeInput,
  RepurposeOutput,
  Platform,
  AspectRatio,
  Theme,
  Slide,
} from "@/types/carousel";
import { PLATFORM_RATIOS } from "@/types/carousel";
import { nanoid } from "./utils";

function buildUserPrompt(input: GenerateInput, referenceContext?: string): string {
  const { topic, url, transcript, rawText, platform, theme, accent, slideCount = 7, brandName,
    targetAudience, offering, goal, chosenHook } = input;

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

  const icpContext = [
    targetAudience && `Target audience: ${targetAudience}`,
    offering && `Offering/product: ${offering}`,
    goal && `Goal of this carousel: ${goal}`,
  ].filter(Boolean).join("\n");

  return `Create a ${slideCount}-slide carousel for ${platformGuide[platform]}.

${contentSource}

Brand: ${brandName || "Scrollr"}
Theme: ${themeGuide[theme]}
Accent color: ${accent || "#00C2A8"}
${icpContext ? `\nAUDIENCE & GOAL CONTEXT:\n${icpContext}` : ""}
${chosenHook ? `\nOPENING HOOK (use this exactly as Slide 1 headline — do not change it):\n"${chosenHook}"` : ""}
${referenceContext ? `\nSTYLE REFERENCE ANALYSIS:\n${referenceContext}\n\nStudy the layout, hierarchy, and aesthetic of these references and adapt it.` : ""}

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

export async function generateHooks(input: GenerateHooksInput): Promise<HookOption[]> {
  const { topic, url, rawText, platform, targetAudience, offering, goal } = input;

  const platformGuide: Record<Platform, string> = {
    instagram: "Instagram (visual, emotional, saves-worthy)",
    linkedin: "LinkedIn (professional, insight-driven, thought leadership)",
    twitter: "X/Twitter (sharp, opinionated, takes-worth-sharing)",
  };

  const content = topic
    ? `TOPIC: "${topic}"`
    : rawText
    ? `SOURCE TEXT:\n${rawText.slice(0, 1500)}`
    : url
    ? `URL: ${url}`
    : "General content carousel";

  const icpLines = [
    targetAudience && `Target audience: ${targetAudience}`,
    offering && `Offering/product: ${offering}`,
    goal && `Goal: ${goal}`,
  ].filter(Boolean).join("\n");

  const prompt = `Generate 4 distinct opening hook options for a ${platformGuide[platform]} carousel.

${content}
${icpLines ? `\n${icpLines}` : ""}

Return exactly 4 hooks with completely different angles. Each hook must be under 14 words and punchy enough to stop a scroll. Return ONLY a JSON array:
[
  {
    "id": "1",
    "angle": "Curiosity gap",
    "hook": "The one habit that doubled my LinkedIn reach (most people skip it)",
    "why": "Opens a knowledge gap without revealing the answer"
  },
  {
    "id": "2",
    "angle": "Contrarian take",
    "hook": "Everything you've been taught about content is slowing you down",
    "why": "Challenges assumptions, forces a double-take"
  },
  {
    "id": "3",
    "angle": "Stat-led",
    "hook": "I analyzed 500 viral posts. Only 3 patterns actually matter",
    "why": "Specificity + promise of extracted value"
  },
  {
    "id": "4",
    "angle": "Pain point",
    "hook": "You're posting every day and still stuck at the same follower count",
    "why": "Names the exact frustration — instantly relatable"
  }
]`;

  const msg = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const text = msg.content[0].type === "text" ? msg.content[0].text : "[]";
  let raw = text.trim();
  if (raw.startsWith("```")) raw = raw.replace(/^```[a-z]*\n?/, "").replace(/\n?```$/, "");
  return JSON.parse(raw) as HookOption[];
}

export async function repurposeCarousel(input: RepurposeInput): Promise<RepurposeOutput> {
  const { format, slides, platform, brandName } = input;

  const slidesSummary = slides.map((s, i) => {
    const num = i + 1;
    if (s.type === "hook") return `Slide ${num} (Hook): ${s.headline}`;
    if (s.type === "cta") return `Slide ${num} (CTA): ${s.headline} — ${s.cta}`;
    if (s.type === "stat") return `Slide ${num} (Stat): ${s.stat} — ${s.label}`;
    if (s.type === "quote") return `Slide ${num} (Quote): "${s.quote}"`;
    if (s.type === "body") return `Slide ${num} (Body): ${s.headline}${s.bullets ? " — " + s.bullets.join(" / ") : ""}`;
    if (s.type === "checklist") return `Slide ${num} (Checklist): ${s.headline} — ${s.items.map(it => it.text).join(", ")}`;
    if (s.type === "tip") return `Slide ${num} (Tip): ${s.headline} — ${s.body}`;
    if (s.type === "before_after") return `Slide ${num} (Before/After): ${s.before} → ${s.after}`;
    return `Slide ${num}: [unknown]`;
  }).join("\n");

  const handle = brandName ? `@${brandName.toLowerCase().replace(/\s+/g, "")}` : "@scrollr";

  const formatPrompts: Record<typeof format, string> = {
    thread: `Convert this ${platform} carousel into an X/Twitter thread.

Rules:
- First tweet is the hook (under 280 chars, add "🧵" at end)
- Each subsequent tweet = one insight from the carousel (under 280 chars)
- Keep the same punchy, direct voice
- Last tweet: "Follow ${handle} for more" + relevant CTA
- Number each tweet: 1/, 2/, etc.

CAROUSEL CONTENT:
${slidesSummary}

Write the complete thread:`,

    email: `Convert this carousel into a short email teaser that makes someone click to view it.

Rules:
- Start with: Subject: [subject line]
- Then a divider ---
- 3-4 punchy sentences that tease the value without giving it all away
- End with a button-style CTA: "[→ Read the full carousel]"
- Keep the voice direct and conversational

CAROUSEL CONTENT:
${slidesSummary}

Write the email:`,

    linkedin_post: `Convert this carousel into a standalone LinkedIn text post.

Rules:
- First line is the hook (no "I" at the start, no hashtag spam)
- Use line breaks liberally — this is LinkedIn, not an essay
- 4-6 short paragraphs with one key insight each
- End with a genuine question OR a direct CTA to follow
- Under 1300 characters total
- No hashtag wall at the bottom (max 2-3 relevant ones if needed)

CAROUSEL CONTENT:
${slidesSummary}

Write the LinkedIn post:`,
  };

  const msg = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1200,
    messages: [{ role: "user", content: formatPrompts[format] }],
  });

  const content = msg.content[0].type === "text" ? msg.content[0].text : "";
  return { format, content };
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
