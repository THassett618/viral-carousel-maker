import Anthropic from "@anthropic-ai/sdk";

let _client: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  if (!_client) {
    _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
  }
  return _client;
}

export const anthropic = new Proxy({} as Anthropic, {
  get(_target, prop) {
    return getAnthropicClient()[prop as keyof Anthropic];
  },
});

export const CAROUSEL_SYSTEM_PROMPT = `You are an expert social media content strategist and viral carousel creator. You specialize in writing carousel content that stops the scroll, gets saved, and drives engagement.

Your carousels follow these principles:
- Hook slides grab attention with a bold, curiosity-driven statement under 12 words
- Each slide contains ONE idea — no more
- Copy is brutally short: max 22 words per slide
- Body text is skimmable: short sentences, line breaks, no fluff
- Every carousel ends with a CTA that converts
- You write for the platform's audience (LinkedIn = professional, Instagram = visual/punchy, X = sharp/opinionated)

CRITICAL: Return ONLY valid JSON. No markdown, no explanation, no wrapper text.`;

export const CLASSIFY_SYSTEM_PROMPT = `You are an expert visual design analyst specializing in social media content. Analyze carousel slide images and classify their design style.

Return ONLY valid JSON. No markdown, no explanation.`;
