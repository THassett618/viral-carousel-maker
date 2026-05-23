import { NextRequest, NextResponse } from "next/server";
import { generateCarousel, extractTextFromUrl } from "@/lib/carousel-generator";
import { createClient } from "@/lib/supabase/server";
import { embedText } from "@/lib/openai";
import { anthropic, CLASSIFY_SYSTEM_PROMPT } from "@/lib/anthropic";
import type { GenerateInput } from "@/types/carousel";
import { z } from "zod";

const schema = z.object({
  topic: z.string().optional(),
  url: z.string().url().optional(),
  transcript: z.string().optional(),
  rawText: z.string().optional(),
  platform: z.enum(["instagram", "linkedin", "twitter"]).default("instagram"),
  theme: z.enum(["dark", "light", "gradient", "minimal"]).default("dark"),
  accent: z.string().optional(),
  slideCount: z.number().int().min(3).max(15).optional(),
  brandName: z.string().optional(),
  useLibrary: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const input = schema.parse(body) as GenerateInput;

    // Extract text from URL if provided
    if (input.url && !input.topic && !input.rawText) {
      try {
        input.rawText = await extractTextFromUrl(input.url);
      } catch {
        // Continue without URL content
      }
    }

    // Find relevant reference images from library if enabled
    let referenceContext: string | undefined;
    if (input.useLibrary) {
      try {
        const searchTerm = input.topic || input.rawText?.slice(0, 200) || "";
        if (searchTerm) {
          const embedding = await embedText(searchTerm);
          const { data: refs } = await supabase.rpc("match_reference_images", {
            query_embedding: embedding,
            match_threshold: 0.3,
            match_count: 3,
            p_user_id: user.id,
          });

          if (refs && refs.length > 0) {
            // Fetch image URLs and ask Claude to analyze them
            const imageMessages = await Promise.all(
              refs.slice(0, 3).map(async (ref: { url: string; title: string; category: string; tags: string[] }) => {
                try {
                  const imgRes = await fetch(ref.url);
                  const buf = await imgRes.arrayBuffer();
                  const b64 = Buffer.from(buf).toString("base64");
                  const mime = imgRes.headers.get("content-type") || "image/jpeg";
                  return { url: ref.url, b64, mime, title: ref.title, category: ref.category, tags: ref.tags };
                } catch {
                  return null;
                }
              })
            );

            const validRefs = imageMessages.filter(Boolean);
            if (validRefs.length > 0) {
              const analyzeMsg = await anthropic.messages.create({
                model: "claude-sonnet-4-6",
                max_tokens: 1024,
                system: CLASSIFY_SYSTEM_PROMPT,
                messages: [
                  {
                    role: "user",
                    content: [
                      ...validRefs.map((r) => ({
                        type: "image" as const,
                        source: { type: "base64" as const, media_type: r!.mime as "image/jpeg", data: r!.b64 },
                      })),
                      {
                        type: "text" as const,
                        text: "Describe the visual style, layout, typography, and design patterns of these reference slides in 2-3 sentences. Focus on what makes them visually distinctive and effective.",
                      },
                    ],
                  },
                ],
              });
              const analysisContent = analyzeMsg.content[0];
              if (analysisContent.type === "text") {
                referenceContext = analysisContent.text;
              }
            }
          }
        }
      } catch {
        // Graceful degradation: generate without references
      }
    }

    const carousel = await generateCarousel(input, referenceContext);

    // Persist to Supabase
    await supabase.from("carousels").insert({
      id: carousel.id,
      user_id: user.id,
      title: carousel.title,
      platform: carousel.platform,
      ratio: carousel.ratio,
      brand: carousel.brand,
      slides: carousel.slides,
      topic: carousel.topic,
    });

    return NextResponse.json({ carousel });
  } catch (err) {
    console.error("[generate]", err);
    const message = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
