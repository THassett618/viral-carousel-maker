import { NextRequest, NextResponse } from "next/server";
import { repurposeCarousel } from "@/lib/carousel-generator";
import { createClient } from "@/lib/supabase/server";
import type { RepurposeInput } from "@/types/carousel";
import { z } from "zod";

export const dynamic = "force-dynamic";

const schema = z.object({
  format: z.enum(["thread", "email", "linkedin_post"]),
  slides: z.array(z.record(z.string(), z.unknown())),
  topic: z.string().optional(),
  platform: z.enum(["instagram", "linkedin", "twitter"]).default("instagram"),
  brandName: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const input = schema.parse(body);

    const result = await repurposeCarousel(input as unknown as RepurposeInput);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[repurpose]", err);
    return NextResponse.json({ error: "Repurpose failed" }, { status: 500 });
  }
}
