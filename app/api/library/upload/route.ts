import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { anthropic, CLASSIFY_SYSTEM_PROMPT } from "@/lib/anthropic";
import { embedText } from "@/lib/openai";
import { nanoid } from "@/lib/utils";
import type { ClassifyImageResponse } from "@/types/library";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const setId = formData.get("setId") as string | null;
    const slideIndex = formData.get("slideIndex") as string | null;

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Only JPEG, PNG, and WebP images are supported" }, { status: 400 });
    }

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Image must be under 10MB" }, { status: 400 });
    }

    // Upload to Supabase Storage
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${user.id}/library/${nanoid()}.${ext}`;
    const bytes = await file.arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from("carousel-assets")
      .upload(path, bytes, { contentType: file.type });

    if (uploadError) throw new Error(uploadError.message);

    const { data: { publicUrl } } = supabase.storage
      .from("carousel-assets")
      .getPublicUrl(path);

    // Classify with Claude Vision
    const b64 = Buffer.from(bytes).toString("base64");
    const classifyMsg = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 512,
      system: CLASSIFY_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: file.type as "image/jpeg" | "image/png" | "image/webp",
                data: b64,
              },
            },
            {
              type: "text",
              text: `Classify this carousel slide image. Return ONLY this JSON:
{
  "title": "short descriptive title (max 8 words)",
  "category": one of: "hook" | "checklist" | "quote" | "stat" | "before_after" | "minimal" | "bold" | "gradient" | "dark" | "light" | "other",
  "tags": ["tag1", "tag2", "tag3"],
  "description": "one sentence visual style description"
}`,
            },
          ],
        },
      ],
    });

    const classifyContent = classifyMsg.content[0];
    let classification: ClassifyImageResponse = {
      title: file.name.replace(/\.[^.]+$/, ""),
      category: "other",
      tags: [],
      description: "",
    };

    if (classifyContent.type === "text") {
      try {
        let raw = classifyContent.text.trim();
        if (raw.startsWith("```")) raw = raw.replace(/^```[a-z]*\n?/, "").replace(/\n?```$/, "");
        classification = JSON.parse(raw);
      } catch {
        // Use defaults
      }
    }

    // Generate embedding from classification text
    const embeddingText = `${classification.title} ${classification.category} ${classification.tags.join(" ")} ${classification.description}`;
    const embedding = await embedText(embeddingText);

    // Save to DB
    const id = nanoid();
    const { error: dbError } = await supabase.from("reference_images").insert({
      id,
      user_id: user.id,
      url: publicUrl,
      title: classification.title,
      category: classification.category,
      tags: classification.tags,
      set_id: setId || null,
      slide_index: slideIndex ? parseInt(slideIndex) : null,
      embedding,
      source: "upload",
    });

    if (dbError) throw new Error(dbError.message);

    return NextResponse.json({
      id,
      url: publicUrl,
      title: classification.title,
      category: classification.category,
      tags: classification.tags,
      description: classification.description,
    });
  } catch (err) {
    console.error("[library/upload]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 500 }
    );
  }
}
